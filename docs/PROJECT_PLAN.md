# Peeap Shop - Project Plan

## Overview

**Peeap Shop** is a hybrid multi-vendor marketplace and multi-tenant e-commerce platform that integrates seamlessly with the Peeap payment ecosystem (my.peeap.com).

### The Hybrid Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PEEAP COMMERCE ECOSYSTEM                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  MARKETPLACE (shop.peeap.com)                                       │   │
│  │  • All vendors listed together (like Amazon/Etsy)                   │   │
│  │  • Categories, search, featured vendors                             │   │
│  │  • Customers shop across multiple vendors in one cart               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                 ┌────────────────────┼────────────────────┐                │
│                 ▼                    ▼                    ▼                │
│  ┌──────────────────────┐ ┌──────────────────┐ ┌──────────────────────┐   │
│  │ VENDOR STORES        │ │                  │ │                      │   │
│  │                      │ │                  │ │                      │   │
│  │ sonia.shop.peeap.com │ │ acme.shop.peeap  │ │ www.soniastore.com   │   │
│  │ (subdomain)          │ │ .com             │ │ (custom domain)      │   │
│  │                      │ │                  │ │                      │   │
│  │ • Own branding       │ │ • Own branding   │ │ • Own branding       │   │
│  │ • Custom landing     │ │ • Custom landing │ │ • Custom landing     │   │
│  │ • Same products      │ │ • Same products  │ │ • Same products      │   │
│  │ • Same inventory     │ │ • Same inventory │ │ • Same inventory     │   │
│  └──────────────────────┘ └──────────────────┘ └──────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  PEEAP DASHBOARD (my.peeap.com/store)                               │   │
│  │  • "Store" tab shows all vendors & products                         │   │
│  │  • Users browse/purchase without leaving my.peeap.com               │   │
│  │  • Pay directly with wallet balance                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  PAYMENTS (my.peeap.com)                                            │   │
│  │  • All transactions processed through Peeap                         │   │
│  │  • Vendor wallets with pending/available balance                    │   │
│  │  • Platform fees automatically collected                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Marketplace (shop.peeap.com)
- Browse all vendors and products
- Category navigation
- Search functionality
- Featured vendors/products
- Multi-vendor cart (buy from multiple vendors in one checkout)
- Reviews and ratings

### 2. Individual Vendor Stores
- **Subdomain**: `vendor-name.shop.peeap.com`
- **Custom Domain**: `www.vendorsite.com` (CNAME setup)
- Personal branding (logo, colors, fonts)
- Custom landing page
- Same product inventory as marketplace listing
- Optional: Hide from marketplace (exclusive store)

### 3. Vendor Dashboard
- Product management (add, edit, inventory)
- Order management
- Store customization (themes, visual editor)
- Analytics and reports
- Balance view (synced from my.peeap.com)
- Payout history

### 4. Integration with my.peeap.com
- **Authentication**: SSO with Peeap accounts
- **Payments**: Checkout via Peeap SDK
- **Wallets**: Vendor earnings go to Peeap wallet
- **Store Page**: Browse marketplace inside user dashboard

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARCHITECTURE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND (Next.js 14)                        │   │
│  │                                                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │ Marketplace │  │   Vendor    │  │   Vendor    │                  │   │
│  │  │ Storefront  │  │   Stores    │  │  Dashboard  │                  │   │
│  │  │             │  │             │  │             │                  │   │
│  │  │ shop.peeap  │  │ *.shop.     │  │ dashboard.  │                  │   │
│  │  │ .com        │  │ peeap.com   │  │ shop.peeap  │                  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         BACKEND (Next.js API)                        │   │
│  │                                                                       │   │
│  │  • Products API          • Orders API                                │   │
│  │  • Stores API            • Categories API                            │   │
│  │  • Themes API            • Webhooks (from my.peeap.com)              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                    ┌─────────────────┼─────────────────┐                   │
│                    ▼                 ▼                 ▼                   │
│  ┌──────────────────────┐ ┌──────────────────┐ ┌──────────────────────┐   │
│  │      SUPABASE        │ │   my.peeap.com   │ │      STORAGE         │   │
│  │                      │ │       API        │ │                      │   │
│  │  • PostgreSQL DB     │ │                  │ │  • Product images    │   │
│  │  • Auth (optional)   │ │  • Checkout      │ │  • Store logos       │   │
│  │  • Realtime          │ │  • Merchant API  │ │  • Theme assets      │   │
│  │                      │ │  • Webhooks      │ │                      │   │
│  └──────────────────────┘ └──────────────────┘ └──────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| Framework | Next.js 14 (App Router) | SSR for SEO, API routes, excellent Vercel integration |
| Database | Supabase (PostgreSQL) | Realtime, Auth, Storage, easy setup |
| Styling | Tailwind CSS + shadcn/ui | Consistent with my.peeap.com |
| State | React Query + Zustand | Server state + client state |
| Payments | Peeap SDK (my.peeap.com) | Native integration |
| Hosting | Vercel | Wildcard subdomains, edge functions |
| Storage | Supabase Storage / Cloudinary | Product images, assets |

### Multi-Tenancy Strategy

```
Request Flow:
─────────────

1. shop.peeap.com          → Marketplace layout
2. vendor.shop.peeap.com   → Vendor store layout (subdomain)
3. www.custom-domain.com   → Vendor store layout (custom domain lookup)
4. dashboard.shop.peeap.com → Vendor dashboard

Middleware handles routing:
┌─────────────────────────────────────────────────────────────────┐
│  middleware.ts                                                  │
│                                                                 │
│  if (hostname === 'shop.peeap.com') → /marketplace              │
│  if (hostname === 'dashboard.shop.peeap.com') → /dashboard      │
│  if (hostname.endsWith('.shop.peeap.com')) → /store/[slug]      │
│  else → lookup custom domain → /store/[slug]                    │
└─────────────────────────────────────────────────────────────────┘
```

## User Flows

### Vendor Onboarding

```
1. Vendor signs up on my.peeap.com (Business Account)
                    │
                    ▼
2. KYC verification + Business details
                    │
                    ▼
3. "Create Online Store" button appears in dashboard
                    │
                    ▼
4. Redirects to shop.peeap.com with SSO token
                    │
                    ▼
5. Store setup wizard:
   • Choose store name/slug
   • Select theme
   • Add first products
   • Configure shipping
                    │
                    ▼
6. Store goes live: vendor-name.shop.peeap.com
```

### Customer Purchase Flow

```
Customer browses (marketplace/vendor store/my.peeap.com)
                    │
                    ▼
            Add to cart
                    │
                    ▼
            Checkout
                    │
                    ▼
    ┌───────────────────────────────┐
    │   Peeap Checkout (SDK)        │
    │                               │
    │   • Wallet balance            │
    │   • Card payment              │
    │   • Mobile money              │
    └───────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │   Payment Split               │
    │                               │
    │   Total: $100.00              │
    │   Platform fee (3%): $3.00    │
    │   Vendor receives: $97.00     │
    │   (held for 7 days)           │
    └───────────────────────────────┘
                    │
                    ▼
    Order created → Vendor notified → Fulfillment
                    │
                    ▼
    After 7 days (or delivery): Funds released to vendor wallet
```

## Integration Points with my.peeap.com

### 1. Authentication (SSO)

```
shop.peeap.com                           my.peeap.com
      │                                        │
      │  1. Redirect to login                  │
      │──────────────────────────────────────►│
      │                                        │
      │  2. User authenticates                 │
      │                                        │
      │  3. Redirect back with token           │
      │◄──────────────────────────────────────│
      │                                        │
      │  4. Exchange token for session         │
      │──────────────────────────────────────►│
      │                                        │
      │  5. Return user data + merchant info   │
      │◄──────────────────────────────────────│
```

### 2. Checkout Integration

```javascript
// On shop.peeap.com checkout
const checkoutSession = await peeapSDK.createCheckout({
  merchant_id: vendor.peeap_merchant_id,
  amount: cart.total,
  currency: 'USD',
  items: cart.items,
  metadata: {
    order_id: order.id,
    store_id: store.id,
    source: 'shop.peeap.com'
  },
  split: {
    platform_fee_percent: 3.0
  },
  hold_period_days: 7,
  success_url: `${storeUrl}/orders/${order.id}/success`,
  cancel_url: `${storeUrl}/cart`
});

// Redirect to Peeap checkout
window.location.href = checkoutSession.checkout_url;
```

### 3. Webhooks (my.peeap.com → shop.peeap.com)

| Event | Action |
|-------|--------|
| `payment.completed` | Update order status, start payout timer |
| `payment.failed` | Mark order as payment failed |
| `payment.refunded` | Process refund, update inventory |
| `payout.released` | Mark vendor funds as available |
| `merchant.updated` | Sync vendor profile |
| `merchant.suspended` | Suspend vendor store |

### 4. API Calls (shop.peeap.com → my.peeap.com)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/merchants/{id}` | Get merchant details |
| `GET /api/v1/merchants/{id}/balance` | Get wallet balance |
| `GET /api/v1/merchants/{id}/transactions` | Get transactions |
| `POST /api/v1/checkout/sessions` | Create checkout session |
| `POST /api/v1/refunds` | Process refund |

## Project Structure

```
shop/
├── apps/
│   └── web/                          # Next.js application
│       ├── app/
│       │   ├── (marketplace)/        # shop.peeap.com routes
│       │   │   ├── page.tsx          # Homepage
│       │   │   ├── products/
│       │   │   ├── vendors/
│       │   │   ├── categories/
│       │   │   └── cart/
│       │   │
│       │   ├── (store)/              # Vendor store routes
│       │   │   ├── [slug]/
│       │   │   │   ├── page.tsx      # Store homepage
│       │   │   │   ├── products/
│       │   │   │   └── cart/
│       │   │
│       │   ├── (dashboard)/          # Vendor dashboard
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx          # Dashboard home
│       │   │   ├── products/
│       │   │   ├── orders/
│       │   │   ├── store/
│       │   │   │   ├── themes/
│       │   │   │   ├── customize/
│       │   │   │   └── domains/
│       │   │   ├── analytics/
│       │   │   └── settings/
│       │   │
│       │   └── api/                  # API routes
│       │       ├── products/
│       │       ├── orders/
│       │       ├── stores/
│       │       └── webhooks/
│       │           └── peeap/
│       │
│       ├── components/
│       │   ├── ui/                   # shadcn components
│       │   ├── marketplace/          # Marketplace components
│       │   ├── store/                # Vendor store components
│       │   ├── dashboard/            # Dashboard components
│       │   └── checkout/             # Checkout components
│       │
│       ├── lib/
│       │   ├── supabase.ts           # Supabase client
│       │   ├── peeap-sdk.ts          # Peeap API client
│       │   └── utils.ts
│       │
│       ├── hooks/
│       ├── stores/                   # Zustand stores
│       └── middleware.ts             # Multi-tenant routing
│
├── packages/
│   ├── database/                     # Supabase schema & migrations
│   ├── peeap-sdk/                    # Peeap integration SDK
│   └── ui/                           # Shared UI components
│
├── docs/
│   ├── PROJECT_PLAN.md               # This file
│   ├── DELIVERY_ROADMAP.md           # Phase-by-phase delivery
│   ├── DATABASE_SCHEMA.md            # Database design
│   └── API_SPECIFICATION.md          # API documentation
│
├── package.json
├── turbo.json                        # Turborepo config
└── README.md
```

## External Services

| Service | Purpose | Setup Required |
|---------|---------|----------------|
| **Supabase** | Database, Auth, Storage | New project: `peeap-shop` |
| **Vercel** | Hosting, Edge functions | New project, wildcard domain |
| **GitHub** | Source control | New repo: `PeeapDev/shop` |
| **Cloudinary** (optional) | Image optimization | Account setup |

## Security Considerations

1. **Authentication**: All sensitive operations require valid Peeap session
2. **API Security**: Webhook signature verification
3. **Data Isolation**: Vendors can only access their own data
4. **Payment Security**: All payments through Peeap (PCI compliant)
5. **Domain Verification**: Custom domains require DNS verification

## Success Metrics

- Vendor onboarding time < 10 minutes
- Page load time < 2 seconds
- Checkout completion rate > 80%
- 99.9% uptime
- Mobile responsive on all pages
