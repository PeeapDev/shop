# Peeap Shop

A hybrid multi-vendor marketplace and multi-tenant e-commerce platform integrated with the Peeap payment ecosystem.

## Overview

Peeap Shop combines:
- **Marketplace** (`shop.peeap.com`) - All vendors listed together
- **Individual Stores** (`vendor.shop.peeap.com` or custom domains) - Branded vendor storefronts
- **Peeap Integration** - Seamless payments, wallets, and SSO with my.peeap.com

## Documentation

- [Project Plan](./docs/PROJECT_PLAN.md) - Architecture and technical design
- [Delivery Roadmap](./docs/DELIVERY_ROADMAP.md) - Phase-by-phase implementation plan
- [Database Schema](./docs/DATABASE_SCHEMA.md) - PostgreSQL/Supabase schema
- [API Specification](./docs/API_SPECIFICATION.md) - API contracts and webhooks

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Query + Zustand
- **Payments**: Peeap SDK (my.peeap.com)
- **Hosting**: Vercel

## Project Structure

```
shop/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/
│       │   ├── (marketplace)/  # shop.peeap.com routes
│       │   ├── (store)/        # Vendor store routes
│       │   ├── (dashboard)/    # Vendor dashboard
│       │   └── api/            # API routes
│       ├── components/
│       ├── lib/
│       └── hooks/
├── packages/
│   ├── database/               # Supabase schema & migrations
│   └── ui/                     # Shared components
├── docs/                       # Documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Vercel account

### Setup

1. Clone the repository:
```bash
git clone https://github.com/PeeapDev/shop.git
cd shop
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Peeap Integration
PEEAP_API_URL=https://my.peeap.com/api/v1
PEEAP_API_KEY=your_api_key
PEEAP_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run database migrations:
```bash
pnpm db:migrate
```

6. Start development server:
```bash
pnpm dev
```

## Development

### Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:reset         # Reset database

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript check
pnpm test             # Run tests
```

### Multi-Tenant Development

For local testing of subdomains:

1. Add to `/etc/hosts`:
```
127.0.0.1 shop.local
127.0.0.1 store1.shop.local
127.0.0.1 store2.shop.local
127.0.0.1 dashboard.shop.local
```

2. Run with custom host:
```bash
HOST=shop.local pnpm dev
```

## Deployment

### Vercel

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Set up domains:
   - `shop.peeap.com` - Marketplace
   - `*.shop.peeap.com` - Wildcard for vendor stores
   - `dashboard.shop.peeap.com` - Vendor dashboard

### Supabase

1. Create new Supabase project
2. Run migrations from `packages/database/migrations`
3. Configure RLS policies
4. Set up Storage buckets

## Integration with my.peeap.com

This project integrates with the Peeap payment platform:

- **SSO**: Vendors authenticate via Peeap accounts
- **Payments**: Checkout via Peeap SDK
- **Wallets**: Vendor earnings deposited to Peeap wallets
- **Webhooks**: Real-time payment/payout notifications

See [API Specification](./docs/API_SPECIFICATION.md) for details.

## License

Proprietary - Peeap Inc.
