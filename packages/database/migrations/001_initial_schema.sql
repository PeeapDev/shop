-- Peeap Shop Initial Database Schema
-- Version: 001
-- Description: Core tables for multi-vendor e-commerce platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- THEMES TABLE
-- ============================================
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    thumbnail_url TEXT,
    preview_url TEXT,
    config JSONB NOT NULL DEFAULT '{}',
    sections JSONB DEFAULT '[]',
    is_premium BOOLEAN DEFAULT FALSE,
    price DECIMAL(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_themes_slug ON themes(slug);
CREATE INDEX idx_themes_is_premium ON themes(is_premium);

-- ============================================
-- STORES TABLE
-- ============================================
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    peeap_merchant_id UUID NOT NULL UNIQUE,
    peeap_user_id UUID NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    address JSONB,
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    theme_id UUID REFERENCES themes(id),
    custom_theme JSONB DEFAULT '{}',
    custom_css TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    show_in_marketplace BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_stores_peeap_merchant_id ON stores(peeap_merchant_id);
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_stores_is_featured ON stores(is_featured) WHERE is_featured = TRUE;

-- ============================================
-- STORE DOMAINS TABLE
-- ============================================
CREATE TABLE store_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL UNIQUE,
    is_primary BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(100),
    verified_at TIMESTAMP WITH TIME ZONE,
    ssl_status VARCHAR(20) DEFAULT 'pending',
    ssl_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_store_domains_domain ON store_domains(domain);
CREATE INDEX idx_store_domains_store_id ON store_domains(store_id);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    level INT DEFAULT 0,
    path TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_path ON categories(path);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    sku VARCHAR(100),
    barcode VARCHAR(100),
    inventory_quantity INT DEFAULT 0,
    track_inventory BOOLEAN DEFAULT TRUE,
    allow_backorder BOOLEAN DEFAULT FALSE,
    weight DECIMAL(10, 2),
    weight_unit VARCHAR(10) DEFAULT 'kg',
    images JSONB DEFAULT '[]',
    category_id UUID REFERENCES categories(id),
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    has_variants BOOLEAN DEFAULT FALSE,
    options JSONB DEFAULT '[]',
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

-- ============================================
-- PRODUCT VARIANTS TABLE
-- ============================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    options JSONB NOT NULL,
    price DECIMAL(10, 2),
    compare_at_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    sku VARCHAR(100),
    barcode VARCHAR(100),
    inventory_quantity INT DEFAULT 0,
    weight DECIMAL(10, 2),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    position INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- ============================================
-- DISCOUNTS TABLE
-- ============================================
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    minimum_order_amount DECIMAL(10, 2),
    minimum_quantity INT,
    applies_to VARCHAR(20) DEFAULT 'all',
    applicable_product_ids UUID[],
    applicable_category_ids UUID[],
    usage_limit INT,
    usage_limit_per_customer INT,
    times_used INT DEFAULT 0,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store_id, code)
);

CREATE INDEX idx_discounts_store_id ON discounts(store_id);
CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_is_active ON discounts(is_active);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id),
    order_number VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    peeap_user_id UUID,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    peeap_checkout_session_id VARCHAR(100),
    peeap_transaction_id UUID,
    payment_status VARCHAR(20) DEFAULT 'pending',
    fulfillment_status VARCHAR(20) DEFAULT 'unfulfilled',
    order_status VARCHAR(20) DEFAULT 'pending',
    payout_status VARCHAR(20) DEFAULT 'pending',
    payout_amount DECIMAL(10, 2),
    platform_fee DECIMAL(10, 2),
    payout_release_at TIMESTAMP WITH TIME ZONE,
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    tracking_url TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    customer_notes TEXT,
    internal_notes TEXT,
    discount_code VARCHAR(50),
    discount_id UUID REFERENCES discounts(id),
    source VARCHAR(50) DEFAULT 'storefront',
    source_url TEXT,
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

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_title VARCHAR(255),
    sku VARCHAR(100),
    image_url TEXT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    fulfilled_quantity INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================
-- ORDER EVENTS TABLE
-- ============================================
CREATE TABLE order_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    description TEXT,
    data JSONB DEFAULT '{}',
    created_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_events_order_id ON order_events(order_id);
CREATE INDEX idx_order_events_created_at ON order_events(created_at);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    peeap_user_id UUID,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    images JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'pending',
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    vendor_response TEXT,
    vendor_response_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- CARTS TABLE
-- ============================================
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    peeap_user_id UUID,
    session_id VARCHAR(100),
    store_id UUID REFERENCES stores(id),
    item_count INT DEFAULT 0,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_carts_peeap_user_id ON carts(peeap_user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);

-- ============================================
-- CART ITEMS TABLE
-- ============================================
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- ============================================
-- STORE PAGES TABLE
-- ============================================
CREATE TABLE store_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT,
    content_type VARCHAR(20) DEFAULT 'html',
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    show_in_navigation BOOLEAN DEFAULT FALSE,
    navigation_position INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store_id, slug)
);

CREATE INDEX idx_store_pages_store_id ON store_pages(store_id);
CREATE INDEX idx_store_pages_slug ON store_pages(slug);

-- ============================================
-- WEBHOOK EVENTS TABLE
-- ============================================
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_status ON webhook_events(status);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate order number
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

-- ============================================
-- SEED DATA
-- ============================================

-- Default theme
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

-- Default categories
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
