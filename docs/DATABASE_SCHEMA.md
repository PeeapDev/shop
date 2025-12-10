# Peeap Shop - Database Schema

## Overview

This document defines the PostgreSQL database schema for the Peeap Shop platform, hosted on Supabase.

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIPS                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │    stores    │
                                    │──────────────│
                                    │ id           │
                                    │ peeap_id     │◄─────── Links to my.peeap.com
                                    │ slug         │
                                    │ name         │
                                    └──────┬───────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              │                            │                            │
              ▼                            ▼                            ▼
    ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
    │     products     │        │      orders      │        │  store_domains   │
    │──────────────────│        │──────────────────│        │──────────────────│
    │ id               │        │ id               │        │ id               │
    │ store_id    ────►│        │ store_id    ────►│        │ store_id    ────►│
    │ name             │        │ customer_*       │        │ domain           │
    │ price            │        │ total            │        │ verified         │
    └────────┬─────────┘        └────────┬─────────┘        └──────────────────┘
             │                           │
             │                           │
             ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ product_variants │        │   order_items    │
    │──────────────────│        │──────────────────│
    │ id               │        │ id               │
    │ product_id  ────►│        │ order_id    ────►│
    │ sku              │        │ product_id  ────►│
    │ price            │        │ quantity         │
    └──────────────────┘        └──────────────────┘


    ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
    │    categories    │        │      themes      │        │     reviews      │
    │──────────────────│        │──────────────────│        │──────────────────│
    │ id               │        │ id               │        │ id               │
    │ name             │        │ name             │        │ product_id  ────►│
    │ parent_id   ────►│        │ config           │        │ order_id    ────►│
    └──────────────────┘        └──────────────────┘        │ rating           │
                                                            └──────────────────┘
```

---

## Core Tables

### stores

The central table for vendor stores.

```sql
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Peeap Integration
    peeap_merchant_id UUID NOT NULL UNIQUE,    -- Links to my.peeap.com merchant
    peeap_user_id UUID NOT NULL,               -- Owner's Peeap user ID

    -- Store Identity
    slug VARCHAR(100) NOT NULL UNIQUE,          -- subdomain: {slug}.shop.peeap.com
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    favicon_url TEXT,

    -- Contact Info
    email VARCHAR(255),
    phone VARCHAR(50),
    address JSONB,                              -- { street, city, state, country, zip }

    -- Settings
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',                -- Additional settings

    -- Theme & Customization
    theme_id UUID REFERENCES themes(id),
    custom_theme JSONB DEFAULT '{}',            -- Theme overrides
    custom_css TEXT,

    -- Status
    status VARCHAR(20) DEFAULT 'draft',         -- draft, active, suspended, closed
    is_featured BOOLEAN DEFAULT FALSE,
    show_in_marketplace BOOLEAN DEFAULT TRUE,   -- Can hide from marketplace

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_stores_peeap_merchant_id ON stores(peeap_merchant_id);
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_stores_is_featured ON stores(is_featured) WHERE is_featured = TRUE;
```

### store_domains

Custom domains for vendor stores.

```sql
CREATE TABLE store_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,

    domain VARCHAR(255) NOT NULL UNIQUE,        -- www.vendorsite.com
    is_primary BOOLEAN DEFAULT FALSE,

    -- Verification
    verification_token VARCHAR(100),
    verified_at TIMESTAMP WITH TIME ZONE,

    -- SSL
    ssl_status VARCHAR(20) DEFAULT 'pending',   -- pending, active, failed
    ssl_expires_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_store_domains_domain ON store_domains(domain);
CREATE INDEX idx_store_domains_store_id ON store_domains(store_id);
```

---

## Product Tables

### categories

Hierarchical product categories.

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,

    -- Hierarchy
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    level INT DEFAULT 0,                        -- 0 = root, 1 = child, etc.
    path TEXT,                                  -- Materialized path: /root/child/grandchild

    -- Display
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_path ON categories(path);
```

### products

Main product table.

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,

    -- Basic Info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),

    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),            -- Original price (for sales)
    cost_price DECIMAL(10, 2),                  -- Cost for profit calculation
    currency VARCHAR(3) DEFAULT 'USD',

    -- Inventory (for simple products without variants)
    sku VARCHAR(100),
    barcode VARCHAR(100),
    inventory_quantity INT DEFAULT 0,
    track_inventory BOOLEAN DEFAULT TRUE,
    allow_backorder BOOLEAN DEFAULT FALSE,

    -- Physical Properties
    weight DECIMAL(10, 2),
    weight_unit VARCHAR(10) DEFAULT 'kg',       -- kg, lb, oz, g

    -- Media
    images JSONB DEFAULT '[]',                  -- [{ url, alt, position }]

    -- Organization
    category_id UUID REFERENCES categories(id),
    tags TEXT[],                                -- Array of tags

    -- Status
    status VARCHAR(20) DEFAULT 'draft',         -- draft, active, archived
    is_featured BOOLEAN DEFAULT FALSE,

    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,

    -- Variants
    has_variants BOOLEAN DEFAULT FALSE,
    options JSONB DEFAULT '[]',                 -- [{ name: "Size", values: ["S", "M", "L"] }]

    -- Stats
    view_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,

    UNIQUE(store_id, slug)
);

CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

### product_variants

Variants for products with multiple options (size, color, etc.).

```sql
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    -- Variant Options
    title VARCHAR(255) NOT NULL,                -- "Small / Red"
    options JSONB NOT NULL,                     -- { "Size": "Small", "Color": "Red" }

    -- Pricing (overrides product price if set)
    price DECIMAL(10, 2),
    compare_at_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),

    -- Inventory
    sku VARCHAR(100),
    barcode VARCHAR(100),
    inventory_quantity INT DEFAULT 0,

    -- Physical
    weight DECIMAL(10, 2),

    -- Media
    image_url TEXT,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    position INT DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
```

---

## Order Tables

### orders

Customer orders.

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id),

    -- Order Number
    order_number VARCHAR(50) NOT NULL,          -- Human-readable: ORD-2024-001234

    -- Customer Info
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    peeap_user_id UUID,                         -- If customer is Peeap user

    -- Addresses
    shipping_address JSONB NOT NULL,            -- { name, street, city, state, country, zip, phone }
    billing_address JSONB,

    -- Money
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    -- Peeap Integration
    peeap_checkout_session_id VARCHAR(100),
    peeap_transaction_id UUID,

    -- Status
    payment_status VARCHAR(20) DEFAULT 'pending',   -- pending, paid, failed, refunded
    fulfillment_status VARCHAR(20) DEFAULT 'unfulfilled', -- unfulfilled, partial, fulfilled
    order_status VARCHAR(20) DEFAULT 'pending',     -- pending, confirmed, processing, completed, cancelled

    -- Payout
    payout_status VARCHAR(20) DEFAULT 'pending',    -- pending, released, paid_out
    payout_amount DECIMAL(10, 2),                   -- Amount after platform fee
    platform_fee DECIMAL(10, 2),                    -- Platform fee amount
    payout_release_at TIMESTAMP WITH TIME ZONE,     -- When funds become available

    -- Shipping
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    tracking_url TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,

    -- Notes
    customer_notes TEXT,
    internal_notes TEXT,

    -- Discount
    discount_code VARCHAR(50),
    discount_id UUID REFERENCES discounts(id),

    -- Source
    source VARCHAR(50) DEFAULT 'storefront',        -- storefront, marketplace, peeap_app
    source_url TEXT,

    -- Metadata
    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(store_id, order_number)
);

CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_peeap_user_id ON orders(peeap_user_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX idx_orders_payout_status ON orders(payout_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### order_items

Line items in an order.

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    -- Product Reference
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,

    -- Snapshot (in case product changes/deletes)
    product_name VARCHAR(255) NOT NULL,
    variant_title VARCHAR(255),
    sku VARCHAR(100),
    image_url TEXT,

    -- Quantity & Price
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,

    -- Fulfillment
    fulfilled_quantity INT DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

### order_events

Order status history / timeline.

```sql
CREATE TABLE order_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    event_type VARCHAR(50) NOT NULL,            -- created, paid, shipped, delivered, etc.
    description TEXT,
    data JSONB DEFAULT '{}',                    -- Additional event data

    created_by VARCHAR(50),                     -- system, vendor, customer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_events_order_id ON order_events(order_id);
CREATE INDEX idx_order_events_created_at ON order_events(created_at);
```

---

## Theme & Customization Tables

### themes

Available themes for stores.

```sql
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    thumbnail_url TEXT,
    preview_url TEXT,

    -- Theme Configuration
    config JSONB NOT NULL DEFAULT '{}',         -- Default theme settings
    sections JSONB DEFAULT '[]',                -- Available sections

    -- Pricing
    is_premium BOOLEAN DEFAULT FALSE,
    price DECIMAL(10, 2) DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_themes_slug ON themes(slug);
CREATE INDEX idx_themes_is_premium ON themes(is_premium);
```

### store_pages

Custom pages for stores.

```sql
CREATE TABLE store_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT,                               -- HTML or JSON content
    content_type VARCHAR(20) DEFAULT 'html',    -- html, json (for builder)

    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,

    -- Status
    is_published BOOLEAN DEFAULT FALSE,
    show_in_navigation BOOLEAN DEFAULT FALSE,
    navigation_position INT DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(store_id, slug)
);

CREATE INDEX idx_store_pages_store_id ON store_pages(store_id);
CREATE INDEX idx_store_pages_slug ON store_pages(slug);
```

---

## Marketing Tables

### discounts

Discount codes and promotions.

```sql
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,

    code VARCHAR(50) NOT NULL,
    description TEXT,

    -- Discount Type
    type VARCHAR(20) NOT NULL,                  -- percentage, fixed_amount, free_shipping
    value DECIMAL(10, 2) NOT NULL,              -- Percentage or fixed amount

    -- Conditions
    minimum_order_amount DECIMAL(10, 2),
    minimum_quantity INT,

    -- Applicability
    applies_to VARCHAR(20) DEFAULT 'all',       -- all, specific_products, specific_categories
    applicable_product_ids UUID[],
    applicable_category_ids UUID[],

    -- Limits
    usage_limit INT,                            -- Total uses allowed
    usage_limit_per_customer INT,
    times_used INT DEFAULT 0,

    -- Validity
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(store_id, code)
);

CREATE INDEX idx_discounts_store_id ON discounts(store_id);
CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_is_active ON discounts(is_active);
```

---

## Review Tables

### reviews

Product reviews from customers.

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),        -- Link to order (verified purchase)

    -- Reviewer
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    peeap_user_id UUID,

    -- Review Content
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,

    -- Media
    images JSONB DEFAULT '[]',                  -- Review images

    -- Status
    status VARCHAR(20) DEFAULT 'pending',       -- pending, approved, rejected
    is_verified_purchase BOOLEAN DEFAULT FALSE,

    -- Response
    vendor_response TEXT,
    vendor_response_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

---

## Cart Tables

### carts

Shopping carts (for logged-in users).

```sql
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Owner
    peeap_user_id UUID,                         -- Logged in user
    session_id VARCHAR(100),                    -- Guest session

    -- Store (optional - for single-store carts)
    store_id UUID REFERENCES stores(id),

    -- Totals (calculated)
    item_count INT DEFAULT 0,
    subtotal DECIMAL(10, 2) DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE          -- For guest carts
);

CREATE INDEX idx_carts_peeap_user_id ON carts(peeap_user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
```

### cart_items

Items in a cart.

```sql
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,

    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id),

    quantity INT NOT NULL DEFAULT 1,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(cart_id, product_id, variant_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
```

---

## Analytics Tables

### product_views

Track product page views.

```sql
CREATE TABLE product_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,

    peeap_user_id UUID,
    session_id VARCHAR(100),

    source VARCHAR(50),                         -- marketplace, storefront, peeap_app
    referrer TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_views_product_id ON product_views(product_id);
CREATE INDEX idx_product_views_store_id ON product_views(store_id);
CREATE INDEX idx_product_views_created_at ON product_views(created_at);
```

### store_analytics_daily

Daily aggregated store analytics.

```sql
CREATE TABLE store_analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    date DATE NOT NULL,

    -- Traffic
    page_views INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,

    -- Sales
    orders_count INT DEFAULT 0,
    items_sold INT DEFAULT 0,
    gross_sales DECIMAL(10, 2) DEFAULT 0,
    net_sales DECIMAL(10, 2) DEFAULT 0,

    -- Cart
    carts_created INT DEFAULT 0,
    checkouts_started INT DEFAULT 0,
    checkouts_completed INT DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(store_id, date)
);

CREATE INDEX idx_store_analytics_daily_store_id ON store_analytics_daily(store_id);
CREATE INDEX idx_store_analytics_daily_date ON store_analytics_daily(date);
```

---

## Webhook & Integration Tables

### webhook_events

Log of incoming webhooks from my.peeap.com.

```sql
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,

    -- Processing
    status VARCHAR(20) DEFAULT 'pending',       -- pending, processed, failed
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INT DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_status ON webhook_events(status);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at);
```

---

## Functions & Triggers

### Auto-update timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ... apply to other tables
```

### Generate order number

```sql
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    seq_num INT;
BEGIN
    year_part := TO_CHAR(NOW(), 'YYYY');

    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS INT)), 0) + 1
    INTO seq_num
    FROM orders
    WHERE store_id = NEW.store_id
    AND order_number LIKE 'ORD-' || year_part || '-%';

    NEW.order_number := 'ORD-' || year_part || '-' || LPAD(seq_num::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();
```

### Update product stats

```sql
CREATE OR REPLACE FUNCTION update_product_sales_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE products
        SET sales_count = sales_count + NEW.quantity
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_sales_trigger
    AFTER INSERT ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_product_sales_count();
```

---

## Row Level Security (RLS)

Enable RLS for multi-tenant data isolation.

```sql
-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Store owners can only see their own stores
CREATE POLICY store_owner_policy ON stores
    FOR ALL
    USING (peeap_user_id = auth.uid());

-- Products belong to stores
CREATE POLICY product_store_policy ON products
    FOR ALL
    USING (store_id IN (
        SELECT id FROM stores WHERE peeap_user_id = auth.uid()
    ));

-- Public read for active products
CREATE POLICY product_public_read ON products
    FOR SELECT
    USING (status = 'active');

-- Orders belong to stores
CREATE POLICY order_store_policy ON orders
    FOR ALL
    USING (store_id IN (
        SELECT id FROM stores WHERE peeap_user_id = auth.uid()
    ));
```

---

## Seed Data

### Default Categories

```sql
INSERT INTO categories (name, slug, level) VALUES
('Electronics', 'electronics', 0),
('Clothing & Fashion', 'clothing-fashion', 0),
('Home & Garden', 'home-garden', 0),
('Health & Beauty', 'health-beauty', 0),
('Sports & Outdoors', 'sports-outdoors', 0),
('Books & Media', 'books-media', 0),
('Food & Beverages', 'food-beverages', 0),
('Toys & Games', 'toys-games', 0),
('Automotive', 'automotive', 0),
('Services', 'services', 0);
```

### Default Theme

```sql
INSERT INTO themes (name, slug, description, config, is_active) VALUES
('Default', 'default', 'Clean and minimal default theme', '{
    "colors": {
        "primary": "#3B82F6",
        "secondary": "#10B981",
        "accent": "#8B5CF6",
        "background": "#FFFFFF",
        "text": "#1F2937"
    },
    "fonts": {
        "heading": "Inter",
        "body": "Inter"
    },
    "layout": {
        "headerStyle": "standard",
        "footerStyle": "standard"
    }
}', true);
```
