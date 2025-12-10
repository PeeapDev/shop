# Peeap Shop - API Specification

## Overview

This document defines the API contracts for:
1. **Internal APIs** - shop.peeap.com endpoints
2. **Integration APIs** - Communication with my.peeap.com
3. **Public APIs** - For marketplace integration in my.peeap.com

Base URLs:
- Shop API: `https://shop.peeap.com/api`
- Peeap API: `https://my.peeap.com/api/v1`

---

## Authentication

### SSO Flow with my.peeap.com

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SSO FLOW                                        │
└─────────────────────────────────────────────────────────────────────────────┘

1. User clicks "Login" on shop.peeap.com
                    │
                    ▼
2. Redirect to my.peeap.com/auth/authorize
   GET /auth/authorize?
       client_id=shop_peeap_com&
       redirect_uri=https://shop.peeap.com/auth/callback&
       response_type=code&
       scope=merchant:read,merchant:write
                    │
                    ▼
3. User authenticates on my.peeap.com
                    │
                    ▼
4. Redirect back to shop.peeap.com with code
   GET /auth/callback?code=AUTH_CODE
                    │
                    ▼
5. Exchange code for tokens
   POST /auth/token
   {
       "grant_type": "authorization_code",
       "code": "AUTH_CODE",
       "client_id": "shop_peeap_com",
       "client_secret": "SECRET",
       "redirect_uri": "https://shop.peeap.com/auth/callback"
   }
                    │
                    ▼
6. Receive tokens
   {
       "access_token": "eyJ...",
       "refresh_token": "eyJ...",
       "expires_in": 3600,
       "user": {
           "id": "uuid",
           "email": "vendor@example.com",
           "name": "Vendor Name",
           "merchant_id": "uuid"  // If business account
       }
   }
```

### API Authentication

All authenticated requests must include:

```http
Authorization: Bearer {access_token}
```

---

## Shop Internal APIs

### Stores API

#### Get Current Store

```http
GET /api/stores/me
Authorization: Bearer {token}
```

Response:
```json
{
    "id": "uuid",
    "slug": "my-store",
    "name": "My Store",
    "description": "Store description",
    "logo_url": "https://...",
    "status": "active",
    "settings": {},
    "theme": {
        "id": "uuid",
        "name": "Default"
    },
    "custom_theme": {},
    "peeap_merchant_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z"
}
```

#### Create Store

```http
POST /api/stores
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "My Store",
    "slug": "my-store",
    "description": "Store description"
}
```

Response:
```json
{
    "id": "uuid",
    "slug": "my-store",
    "name": "My Store",
    "status": "draft",
    "store_url": "https://my-store.shop.peeap.com"
}
```

#### Update Store

```http
PATCH /api/stores/me
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Updated Store Name",
    "description": "Updated description",
    "settings": {
        "currency": "USD",
        "timezone": "America/New_York"
    }
}
```

#### Update Store Theme

```http
PUT /api/stores/me/theme
Authorization: Bearer {token}
Content-Type: application/json

{
    "theme_id": "uuid",
    "custom_theme": {
        "colors": {
            "primary": "#FF5733"
        }
    },
    "custom_css": ".header { background: #000; }"
}
```

---

### Products API

#### List Products

```http
GET /api/products?page=1&limit=20&status=active&category=electronics
Authorization: Bearer {token}
```

Response:
```json
{
    "data": [
        {
            "id": "uuid",
            "name": "Product Name",
            "slug": "product-name",
            "price": 29.99,
            "compare_at_price": 39.99,
            "images": [
                { "url": "https://...", "alt": "Product image" }
            ],
            "status": "active",
            "inventory_quantity": 100,
            "category": {
                "id": "uuid",
                "name": "Electronics"
            }
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 150,
        "total_pages": 8
    }
}
```

#### Get Product

```http
GET /api/products/{id}
Authorization: Bearer {token}
```

Response:
```json
{
    "id": "uuid",
    "name": "Product Name",
    "slug": "product-name",
    "description": "Full product description",
    "short_description": "Short description",
    "price": 29.99,
    "compare_at_price": 39.99,
    "cost_price": 15.00,
    "currency": "USD",
    "sku": "PROD-001",
    "inventory_quantity": 100,
    "track_inventory": true,
    "images": [
        { "url": "https://...", "alt": "Product image", "position": 0 }
    ],
    "category_id": "uuid",
    "tags": ["new", "featured"],
    "status": "active",
    "has_variants": true,
    "options": [
        { "name": "Size", "values": ["S", "M", "L", "XL"] },
        { "name": "Color", "values": ["Red", "Blue", "Green"] }
    ],
    "variants": [
        {
            "id": "uuid",
            "title": "S / Red",
            "options": { "Size": "S", "Color": "Red" },
            "price": 29.99,
            "sku": "PROD-001-S-RED",
            "inventory_quantity": 25
        }
    ],
    "meta_title": "SEO Title",
    "meta_description": "SEO Description",
    "created_at": "2024-01-01T00:00:00Z"
}
```

#### Create Product

```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "New Product",
    "description": "Product description",
    "price": 29.99,
    "compare_at_price": 39.99,
    "sku": "PROD-002",
    "inventory_quantity": 50,
    "category_id": "uuid",
    "tags": ["new"],
    "images": [
        { "url": "https://...", "alt": "Image 1" }
    ],
    "status": "draft"
}
```

#### Update Product

```http
PATCH /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Updated Product Name",
    "price": 34.99,
    "status": "active"
}
```

#### Delete Product

```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

#### Upload Product Image

```http
POST /api/products/{id}/images
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (binary)
alt: "Product image description"
```

Response:
```json
{
    "url": "https://storage.supabase.co/...",
    "alt": "Product image description",
    "position": 2
}
```

---

### Orders API

#### List Orders

```http
GET /api/orders?page=1&limit=20&status=pending&fulfillment=unfulfilled
Authorization: Bearer {token}
```

Response:
```json
{
    "data": [
        {
            "id": "uuid",
            "order_number": "ORD-2024-000001",
            "customer_name": "John Doe",
            "customer_email": "john@example.com",
            "total": 89.97,
            "currency": "USD",
            "payment_status": "paid",
            "fulfillment_status": "unfulfilled",
            "payout_status": "pending",
            "items_count": 3,
            "created_at": "2024-01-15T10:30:00Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 45,
        "total_pages": 3
    }
}
```

#### Get Order

```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

Response:
```json
{
    "id": "uuid",
    "order_number": "ORD-2024-000001",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890",
    "shipping_address": {
        "name": "John Doe",
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "US",
        "zip": "10001"
    },
    "items": [
        {
            "id": "uuid",
            "product_id": "uuid",
            "product_name": "Product Name",
            "variant_title": "M / Blue",
            "sku": "PROD-001-M-BLU",
            "quantity": 2,
            "unit_price": 29.99,
            "total_price": 59.98,
            "image_url": "https://..."
        }
    ],
    "subtotal": 59.98,
    "shipping_cost": 5.99,
    "tax_amount": 4.00,
    "discount_amount": 0,
    "total": 69.97,
    "currency": "USD",
    "payment_status": "paid",
    "fulfillment_status": "unfulfilled",
    "payout_status": "pending",
    "payout_amount": 67.87,
    "platform_fee": 2.10,
    "payout_release_at": "2024-01-22T10:30:00Z",
    "peeap_transaction_id": "uuid",
    "source": "storefront",
    "customer_notes": "Please gift wrap",
    "events": [
        {
            "type": "created",
            "description": "Order placed",
            "created_at": "2024-01-15T10:30:00Z"
        },
        {
            "type": "paid",
            "description": "Payment received via Peeap",
            "created_at": "2024-01-15T10:31:00Z"
        }
    ],
    "created_at": "2024-01-15T10:30:00Z"
}
```

#### Update Order Status

```http
PATCH /api/orders/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
    "fulfillment_status": "fulfilled",
    "tracking_number": "1Z999AA10123456784",
    "tracking_url": "https://ups.com/track?num=..."
}
```

#### Add Order Note

```http
POST /api/orders/{id}/notes
Authorization: Bearer {token}
Content-Type: application/json

{
    "note": "Customer requested expedited shipping",
    "is_internal": true
}
```

---

### Categories API

#### List Categories

```http
GET /api/categories
```

Response:
```json
{
    "data": [
        {
            "id": "uuid",
            "name": "Electronics",
            "slug": "electronics",
            "image_url": "https://...",
            "children": [
                {
                    "id": "uuid",
                    "name": "Phones",
                    "slug": "phones"
                },
                {
                    "id": "uuid",
                    "name": "Laptops",
                    "slug": "laptops"
                }
            ]
        }
    ]
}
```

---

### Cart API (Public)

#### Get Cart

```http
GET /api/cart
Cookie: cart_session={session_id}
# OR
Authorization: Bearer {token}
```

Response:
```json
{
    "id": "uuid",
    "items": [
        {
            "id": "uuid",
            "product": {
                "id": "uuid",
                "name": "Product Name",
                "slug": "product-name",
                "image_url": "https://..."
            },
            "variant": {
                "id": "uuid",
                "title": "M / Blue"
            },
            "store": {
                "id": "uuid",
                "name": "Store Name",
                "slug": "store-name"
            },
            "quantity": 2,
            "unit_price": 29.99,
            "total_price": 59.98
        }
    ],
    "item_count": 2,
    "subtotal": 59.98
}
```

#### Add to Cart

```http
POST /api/cart/items
Content-Type: application/json

{
    "product_id": "uuid",
    "variant_id": "uuid",
    "quantity": 1
}
```

#### Update Cart Item

```http
PATCH /api/cart/items/{item_id}
Content-Type: application/json

{
    "quantity": 3
}
```

#### Remove from Cart

```http
DELETE /api/cart/items/{item_id}
```

---

### Checkout API

#### Create Checkout Session

```http
POST /api/checkout
Authorization: Bearer {token}  # Optional for guest checkout
Content-Type: application/json

{
    "cart_id": "uuid",
    "shipping_address": {
        "name": "John Doe",
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "US",
        "zip": "10001",
        "phone": "+1234567890"
    },
    "customer_email": "john@example.com",
    "customer_notes": "Please gift wrap",
    "discount_code": "SAVE10"
}
```

Response:
```json
{
    "order_id": "uuid",
    "order_number": "ORD-2024-000001",
    "peeap_checkout_url": "https://my.peeap.com/checkout/pay/session_xxx",
    "total": 69.97,
    "expires_at": "2024-01-15T11:30:00Z"
}
```

---

## Integration with my.peeap.com

### Checkout Session Creation

shop.peeap.com calls my.peeap.com to create checkout:

```http
POST https://my.peeap.com/api/v1/checkout/sessions
Authorization: Bearer {shop_api_key}
Content-Type: application/json

{
    "merchant_id": "uuid",
    "amount": 69.97,
    "currency": "USD",
    "description": "Order #ORD-2024-000001",
    "metadata": {
        "order_id": "uuid",
        "store_id": "uuid",
        "source": "shop.peeap.com"
    },
    "split": {
        "platform_fee_percent": 3.0
    },
    "hold_period_days": 7,
    "success_url": "https://store.shop.peeap.com/orders/{order_id}/success",
    "cancel_url": "https://store.shop.peeap.com/cart"
}
```

Response:
```json
{
    "id": "session_xxx",
    "checkout_url": "https://my.peeap.com/checkout/pay/session_xxx",
    "amount": 69.97,
    "currency": "USD",
    "status": "pending",
    "expires_at": "2024-01-15T11:30:00Z"
}
```

### Merchant Balance API

shop.peeap.com fetches vendor balance:

```http
GET https://my.peeap.com/api/v1/merchants/{merchant_id}/balance
Authorization: Bearer {shop_api_key}
```

Response:
```json
{
    "merchant_id": "uuid",
    "available_balance": 1250.00,
    "pending_balance": 3420.00,
    "currency": "USD",
    "pending_payouts": [
        {
            "order_id": "uuid",
            "amount": 120.00,
            "release_at": "2024-01-17T00:00:00Z"
        },
        {
            "order_id": "uuid",
            "amount": 300.00,
            "release_at": "2024-01-20T00:00:00Z"
        }
    ]
}
```

### Refund API

```http
POST https://my.peeap.com/api/v1/refunds
Authorization: Bearer {shop_api_key}
Content-Type: application/json

{
    "transaction_id": "uuid",
    "amount": 29.99,
    "reason": "Customer requested refund"
}
```

---

## Webhooks (my.peeap.com → shop.peeap.com)

### Webhook Endpoint

```http
POST https://shop.peeap.com/api/webhooks/peeap
X-Peeap-Signature: sha256=xxx
Content-Type: application/json
```

### Signature Verification

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');

    return `sha256=${expectedSignature}` === signature;
}
```

### Event Types

#### payment.completed

```json
{
    "event": "payment.completed",
    "timestamp": "2024-01-15T10:31:00Z",
    "data": {
        "transaction_id": "uuid",
        "checkout_session_id": "session_xxx",
        "merchant_id": "uuid",
        "amount": 69.97,
        "currency": "USD",
        "platform_fee": 2.10,
        "net_amount": 67.87,
        "metadata": {
            "order_id": "uuid",
            "store_id": "uuid"
        },
        "payout_release_at": "2024-01-22T10:31:00Z"
    }
}
```

#### payment.failed

```json
{
    "event": "payment.failed",
    "timestamp": "2024-01-15T10:31:00Z",
    "data": {
        "checkout_session_id": "session_xxx",
        "error_code": "insufficient_funds",
        "error_message": "Payment declined",
        "metadata": {
            "order_id": "uuid"
        }
    }
}
```

#### payment.refunded

```json
{
    "event": "payment.refunded",
    "timestamp": "2024-01-16T14:00:00Z",
    "data": {
        "transaction_id": "uuid",
        "refund_id": "uuid",
        "amount": 29.99,
        "reason": "Customer requested refund",
        "metadata": {
            "order_id": "uuid"
        }
    }
}
```

#### payout.released

```json
{
    "event": "payout.released",
    "timestamp": "2024-01-22T00:00:00Z",
    "data": {
        "merchant_id": "uuid",
        "transaction_id": "uuid",
        "amount": 67.87,
        "metadata": {
            "order_id": "uuid"
        }
    }
}
```

#### merchant.updated

```json
{
    "event": "merchant.updated",
    "timestamp": "2024-01-15T12:00:00Z",
    "data": {
        "merchant_id": "uuid",
        "changes": ["name", "email"],
        "merchant": {
            "id": "uuid",
            "name": "Updated Business Name",
            "email": "new@example.com"
        }
    }
}
```

#### merchant.suspended

```json
{
    "event": "merchant.suspended",
    "timestamp": "2024-01-15T12:00:00Z",
    "data": {
        "merchant_id": "uuid",
        "reason": "Terms violation"
    }
}
```

---

## Public API for my.peeap.com Integration

These endpoints are called by my.peeap.com to display the Store page.

### Featured Vendors

```http
GET https://shop.peeap.com/api/public/vendors/featured?limit=8
```

Response:
```json
{
    "data": [
        {
            "id": "uuid",
            "name": "Sonia's Fashion",
            "slug": "sonias-fashion",
            "logo_url": "https://...",
            "description": "Trendy fashion for everyone",
            "store_url": "https://sonias-fashion.shop.peeap.com",
            "products_count": 45,
            "rating": 4.8
        }
    ]
}
```

### Products Listing

```http
GET https://shop.peeap.com/api/public/products?page=1&limit=20&category=electronics&search=phone
```

Response:
```json
{
    "data": [
        {
            "id": "uuid",
            "name": "Smartphone XYZ",
            "slug": "smartphone-xyz",
            "price": 599.99,
            "compare_at_price": 699.99,
            "image_url": "https://...",
            "store": {
                "id": "uuid",
                "name": "TechHub",
                "slug": "techhub"
            },
            "rating": 4.5,
            "reviews_count": 28
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 150
    }
}
```

### Product Detail

```http
GET https://shop.peeap.com/api/public/products/{slug}
```

### Categories

```http
GET https://shop.peeap.com/api/public/categories
```

### Search

```http
GET https://shop.peeap.com/api/public/search?q=wireless+headphones&limit=20
```

Response:
```json
{
    "products": [...],
    "vendors": [...],
    "categories": [...]
}
```

---

## Error Responses

All errors follow this format:

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid request data",
        "details": [
            {
                "field": "price",
                "message": "Price must be a positive number"
            }
        ]
    }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Not allowed to access resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

- **Public APIs**: 100 requests/minute per IP
- **Authenticated APIs**: 1000 requests/minute per user
- **Webhook delivery**: Retry with exponential backoff (3 attempts)

Headers returned:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1705320000
```
