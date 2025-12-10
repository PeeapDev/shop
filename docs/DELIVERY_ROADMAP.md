# Peeap Shop - Delivery Roadmap

## Overview

This document outlines the phased delivery plan for the Peeap Shop platform. Each phase builds upon the previous, allowing for iterative development and early testing.

---

## Phase 0: Foundation Setup
**Goal**: Set up infrastructure and project foundation

### Tasks

- [ ] **P0.1** Create GitHub repository (PeeapDev/shop)
- [ ] **P0.2** Initialize Next.js 14 project with TypeScript
- [ ] **P0.3** Configure Tailwind CSS + shadcn/ui
- [ ] **P0.4** Set up Turborepo structure
- [ ] **P0.5** Create Supabase project (peeap-shop)
- [ ] **P0.6** Run database migrations (core tables)
- [ ] **P0.7** Set up Vercel project with wildcard domain
- [ ] **P0.8** Configure environment variables
- [ ] **P0.9** Set up CI/CD pipeline

### Deliverables
- Empty Next.js app deployed to Vercel
- Database connected and migrations run
- Development environment ready

---

## Phase 1: Vendor Dashboard (MVP)
**Goal**: Vendors can sign up, create stores, and add products

### Tasks

#### Authentication
- [ ] **P1.1** Implement SSO with my.peeap.com
- [ ] **P1.2** Create auth middleware
- [ ] **P1.3** Session management

#### Dashboard Layout
- [ ] **P1.4** Create dashboard layout with sidebar
- [ ] **P1.5** Dashboard home page (overview stats)
- [ ] **P1.6** Navigation structure

#### Store Setup
- [ ] **P1.7** Store creation wizard
- [ ] **P1.8** Store settings page
- [ ] **P1.9** Subdomain assignment (slug)

#### Product Management
- [ ] **P1.10** Products list page
- [ ] **P1.11** Add/Edit product form
- [ ] **P1.12** Product image upload (Supabase Storage)
- [ ] **P1.13** Product variants (size, color)
- [ ] **P1.14** Inventory management
- [ ] **P1.15** Product categories

### Deliverables
- Vendors can log in via Peeap SSO
- Vendors can create a store and get a subdomain
- Vendors can add/edit products with images
- Products saved to database

### Demo URL
`dashboard.shop.peeap.com`

---

## Phase 2: Vendor Storefront
**Goal**: Individual vendor stores accessible via subdomain

### Tasks

#### Multi-Tenant Routing
- [ ] **P2.1** Middleware for subdomain detection
- [ ] **P2.2** Store lookup by slug
- [ ] **P2.3** Custom domain lookup (database)

#### Storefront Pages
- [ ] **P2.4** Store homepage (hero, featured products)
- [ ] **P2.5** Product listing page
- [ ] **P2.6** Product detail page
- [ ] **P2.7** Category pages
- [ ] **P2.8** Search functionality
- [ ] **P2.9** Store header/footer

#### Theme System (Basic)
- [ ] **P2.10** Default theme template
- [ ] **P2.11** Theme configuration (colors, fonts)
- [ ] **P2.12** Logo/branding upload
- [ ] **P2.13** Store preview in dashboard

### Deliverables
- `vendor-name.shop.peeap.com` shows vendor's store
- Products displayed with proper styling
- Basic theme customization working

### Demo URL
`demo-store.shop.peeap.com`

---

## Phase 3: Shopping Cart & Checkout
**Goal**: Customers can purchase products

### Tasks

#### Cart System
- [ ] **P3.1** Add to cart functionality
- [ ] **P3.2** Cart drawer/page
- [ ] **P3.3** Cart persistence (localStorage + DB for logged in)
- [ ] **P3.4** Quantity updates
- [ ] **P3.5** Remove items

#### Checkout Flow
- [ ] **P3.6** Checkout page (shipping details)
- [ ] **P3.7** Peeap SDK integration
- [ ] **P3.8** Create checkout session API
- [ ] **P3.9** Payment success handling
- [ ] **P3.10** Payment failure handling

#### Order Management
- [ ] **P3.11** Order creation on payment success
- [ ] **P3.12** Order confirmation page
- [ ] **P3.13** Order confirmation email
- [ ] **P3.14** Inventory deduction

### Deliverables
- Customers can add products to cart
- Checkout redirects to Peeap payment
- Orders created on successful payment
- Inventory updated

### Integration Required
- my.peeap.com Checkout API
- Webhook endpoint for payment events

---

## Phase 4: Order Fulfillment & Payouts
**Goal**: Vendors can manage orders, funds flow correctly

### Tasks

#### Vendor Order Management
- [ ] **P4.1** Orders list in dashboard
- [ ] **P4.2** Order detail view
- [ ] **P4.3** Order status updates (processing, shipped, delivered)
- [ ] **P4.4** Shipping label / tracking number input
- [ ] **P4.5** Order notifications to customer

#### Payout System
- [ ] **P4.6** Pending balance display (from my.peeap.com)
- [ ] **P4.7** Available balance display
- [ ] **P4.8** Payout history
- [ ] **P4.9** Webhook handler for payout.released

#### Customer Order Tracking
- [ ] **P4.10** Order history page (customer)
- [ ] **P4.11** Order tracking page
- [ ] **P4.12** Delivery confirmation

### Deliverables
- Vendors see orders in dashboard
- Vendors can mark orders as shipped/delivered
- Balance shows pending and available amounts
- Customers can track orders

### Integration Required
- my.peeap.com Merchant Balance API
- my.peeap.com Payout Webhooks

---

## Phase 5: Marketplace
**Goal**: Central marketplace aggregating all vendors

### Tasks

#### Marketplace Homepage
- [ ] **P5.1** Marketplace layout (distinct from vendor stores)
- [ ] **P5.2** Featured vendors section
- [ ] **P5.3** Featured products section
- [ ] **P5.4** Category navigation
- [ ] **P5.5** Search across all products

#### Vendor Directory
- [ ] **P5.6** Vendors list page
- [ ] **P5.7** Vendor profile page
- [ ] **P5.8** Vendor filtering (category, location)

#### Product Discovery
- [ ] **P5.9** All products listing
- [ ] **P5.10** Category pages
- [ ] **P5.11** Search results page
- [ ] **P5.12** Filters (price, category, vendor)
- [ ] **P5.13** Sort options

#### Multi-Vendor Cart
- [ ] **P5.14** Cart supports items from multiple vendors
- [ ] **P5.15** Checkout splits payment to vendors
- [ ] **P5.16** Separate shipping per vendor

### Deliverables
- `shop.peeap.com` shows marketplace
- Customers can browse all vendors/products
- Cart works with multiple vendors
- Checkout splits payments correctly

### Demo URL
`shop.peeap.com`

---

## Phase 6: my.peeap.com Integration
**Goal**: Store page inside Peeap user dashboard

### Tasks

#### Store Page (in card project)
- [ ] **P6.1** Add "Store" tab to my.peeap.com navigation
- [ ] **P6.2** Store page layout
- [ ] **P6.3** Featured vendors widget
- [ ] **P6.4** Product grid
- [ ] **P6.5** Search bar
- [ ] **P6.6** Category filters

#### API Integration
- [ ] **P6.7** API endpoint for featured vendors
- [ ] **P6.8** API endpoint for products (paginated)
- [ ] **P6.9** API endpoint for search

#### Seamless Checkout
- [ ] **P6.10** Add to cart from my.peeap.com
- [ ] **P6.11** Checkout with wallet balance (one-click)
- [ ] **P6.12** Order history in my.peeap.com

### Deliverables
- Users see "Store" tab in my.peeap.com
- Can browse and purchase without leaving
- Pay with wallet balance directly

### Changes Required
- Modifications to `card` project (my.peeap.com)

---

## Phase 7: Advanced Store Customization
**Goal**: Vendors have full control over store appearance

### Tasks

#### Theme System
- [ ] **P7.1** Theme marketplace (free + premium)
- [ ] **P7.2** Theme preview
- [ ] **P7.3** Theme installation

#### Visual Editor
- [ ] **P7.4** Drag-and-drop page builder
- [ ] **P7.5** Section templates (hero, products, testimonials)
- [ ] **P7.6** Custom CSS support
- [ ] **P7.7** Mobile preview

#### Custom Pages
- [ ] **P7.8** About page builder
- [ ] **P7.9** Contact page with form
- [ ] **P7.10** Custom pages (FAQ, policies)
- [ ] **P7.11** Blog (optional module)

#### Navigation
- [ ] **P7.12** Menu builder
- [ ] **P7.13** Header customization
- [ ] **P7.14** Footer customization

### Deliverables
- Vendors can choose from multiple themes
- Visual editor for page customization
- Custom pages support
- Full navigation control

---

## Phase 8: Custom Domains
**Goal**: Vendors can use their own domain

### Tasks

- [ ] **P8.1** Domain settings in dashboard
- [ ] **P8.2** DNS verification instructions
- [ ] **P8.3** Domain verification API
- [ ] **P8.4** SSL certificate provisioning (Vercel)
- [ ] **P8.5** Custom domain routing in middleware
- [ ] **P8.6** Domain status monitoring

### Deliverables
- Vendors can add custom domain in settings
- Instructions for DNS setup
- Custom domain serves vendor store
- SSL automatically configured

---

## Phase 9: Analytics & Reports
**Goal**: Vendors have insights into their business

### Tasks

#### Dashboard Analytics
- [ ] **P9.1** Sales overview (today, week, month)
- [ ] **P9.2** Revenue charts
- [ ] **P9.3** Order count trends
- [ ] **P9.4** Top products
- [ ] **P9.5** Traffic sources

#### Reports
- [ ] **P9.6** Sales report (exportable)
- [ ] **P9.7** Product performance report
- [ ] **P9.8** Customer report
- [ ] **P9.9** Payout report

#### Platform Analytics (Admin)
- [ ] **P9.10** Total GMV
- [ ] **P9.11** Active vendors
- [ ] **P9.12** Platform revenue
- [ ] **P9.13** Top performing stores

### Deliverables
- Analytics dashboard for vendors
- Exportable reports
- Platform admin analytics

---

## Phase 10: Reviews, Ratings & Social
**Goal**: Build trust and engagement

### Tasks

#### Reviews
- [ ] **P10.1** Product review submission
- [ ] **P10.2** Review moderation (vendor)
- [ ] **P10.3** Review display on product page
- [ ] **P10.4** Average rating calculation

#### Vendor Ratings
- [ ] **P10.5** Vendor rating (based on reviews)
- [ ] **P10.6** Vendor trust badges

#### Social Features
- [ ] **P10.7** Wishlist/favorites
- [ ] **P10.8** Share product (social)
- [ ] **P10.9** Recently viewed

### Deliverables
- Customers can leave reviews
- Products show ratings
- Vendors have trust scores

---

## Phase 11: Marketing Tools
**Goal**: Vendors can promote their products

### Tasks

#### Discounts
- [ ] **P11.1** Coupon code creation
- [ ] **P11.2** Discount types (%, fixed, free shipping)
- [ ] **P11.3** Coupon application at checkout
- [ ] **P11.4** Usage limits and expiry

#### Promotions
- [ ] **P11.5** Sale badges on products
- [ ] **P11.6** Flash sales
- [ ] **P11.7** Bundle deals

#### Email Marketing (Basic)
- [ ] **P11.8** Customer email collection
- [ ] **P11.9** Order notification emails
- [ ] **P11.10** Abandoned cart emails (optional)

### Deliverables
- Vendors can create discount codes
- Promotions displayed on storefront
- Basic email notifications

---

## Phase 12: Mobile App / PWA
**Goal**: Mobile-optimized experience

### Tasks

- [ ] **P12.1** PWA configuration
- [ ] **P12.2** App manifest
- [ ] **P12.3** Offline support (basic)
- [ ] **P12.4** Push notifications
- [ ] **P12.5** Add to home screen prompt

### Deliverables
- Shop works as PWA
- Installable on mobile
- Push notifications for orders

---

## MVP Definition

**Minimum Viable Product** includes:
- Phase 0: Foundation
- Phase 1: Vendor Dashboard
- Phase 2: Vendor Storefront
- Phase 3: Shopping Cart & Checkout
- Phase 4: Order Fulfillment (basic)

**MVP Features:**
- Vendors can create store and add products
- Vendor stores accessible via subdomain
- Customers can browse and purchase
- Payments through Peeap
- Basic order management

---

## Dependencies

### External Dependencies
| Dependency | Required For | Phase |
|------------|--------------|-------|
| Supabase project | All phases | 0 |
| Vercel project | All phases | 0 |
| my.peeap.com SSO API | Authentication | 1 |
| my.peeap.com Checkout API | Payments | 3 |
| my.peeap.com Webhooks | Order/Payout sync | 3, 4 |
| my.peeap.com Merchant API | Balance display | 4 |

### Internal Dependencies (card project changes)
| Change | Phase |
|--------|-------|
| SSO endpoint for shop.peeap.com | 1 |
| Checkout session with split payments | 3 |
| Webhook events for shop orders | 3 |
| Merchant pending balance API | 4 |
| Store page in user dashboard | 6 |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| SSO integration complexity | Start with simple token exchange, iterate |
| Multi-tenant routing issues | Extensive middleware testing |
| Payment split accuracy | Thorough testing with test transactions |
| Custom domain SSL | Use Vercel's automatic SSL |
| Performance at scale | Implement caching early, use CDN |

---

## Success Criteria per Phase

| Phase | Success Criteria |
|-------|------------------|
| 0 | App deploys, DB connects |
| 1 | Vendor can log in, create store, add product |
| 2 | Store accessible via subdomain, products display |
| 3 | Customer can complete purchase |
| 4 | Vendor sees order, balance shows correctly |
| 5 | Marketplace shows all vendors/products |
| 6 | Store tab works in my.peeap.com |
| 7 | Vendor can customize store appearance |
| 8 | Custom domain serves store |
| 9 | Analytics dashboard shows data |
| 10 | Reviews display on products |
| 11 | Coupon codes work at checkout |
| 12 | PWA installable on mobile |
