# Peeap Shop - Development Progress

> Last Updated: December 10, 2024

## Project Overview

Building a hybrid multi-vendor marketplace + multi-tenant e-commerce platform that integrates with the Peeap payment ecosystem (my.peeap.com).

**Repository**: https://github.com/PeeapDev/shop

---

## Completed Tasks ✅

### 1. Project Setup
- [x] Created project directory at `/Users/local_server/soft-touch2/project/shop`
- [x] Initialized Next.js 14 with TypeScript, Tailwind, App Router
- [x] Installed dependencies: Supabase, React Query, Zustand, Axios
- [x] Set up shadcn/ui components
- [x] Created project structure

### 2. Documentation
- [x] `docs/PROJECT_PLAN.md` - Full architecture and design
- [x] `docs/DELIVERY_ROADMAP.md` - 12 phases with task checklists
- [x] `docs/DATABASE_SCHEMA.md` - PostgreSQL schema with 15+ tables
- [x] `docs/API_SPECIFICATION.md` - API contracts, webhooks, SSO flow

### 3. Database
- [x] Created Supabase project: `peeap-shop`
- [x] Project URL: `https://cfjehzehbiqgsemkeiay.supabase.co`
- [x] Created migration file: `packages/database/migrations/001_initial_schema.sql`
- [ ] **TODO**: Run migration in Supabase SQL Editor

### 4. Core Files Created
- [x] `src/middleware.ts` - Path-based routing (no wildcard DNS needed)
- [x] `src/lib/supabase/client.ts` - Browser Supabase client
- [x] `src/lib/supabase/server.ts` - Server Supabase client
- [x] `src/lib/peeap-sdk.ts` - Integration SDK for my.peeap.com
- [x] `src/types/database.ts` - TypeScript types for database

### 5. Pages Created
- [x] `/` - Marketplace homepage
- [x] `/store/[slug]` - Vendor store page
- [x] `/dashboard` - Vendor dashboard with layout
- [x] `/dashboard/page.tsx` - Dashboard home with stats

### 6. Git & GitHub
- [x] Initialized git repository
- [x] Pushed to GitHub: https://github.com/PeeapDev/shop
- [x] Latest commit: `abf92d4` - Switch to path-based routing

### 7. Vercel Setup
- [x] Logged into new Vercel account: `devpeeap-8345s-projects`
- [x] Created project from GitHub: `shop`
- [x] Domain added: `shop.peeap.com`
- [ ] **TODO**: Set Root Directory to `apps/web` in Vercel settings

---

## Pending Tasks 🔄

### Immediate (to complete setup)

1. **Vercel Configuration**
   - Go to: https://vercel.com/devpeeap-8345s-projects/shop/settings
   - Set **Root Directory**: `apps/web`
   - Click Save → Redeploy

2. **Run Database Migration**
   - Go to Supabase Dashboard → SQL Editor
   - Copy contents of `packages/database/migrations/001_initial_schema.sql`
   - Run the SQL

3. **Add Supabase Service Role Key**
   - Get from Supabase Dashboard → Settings → API
   - Add to `apps/web/.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## URL Structure (Path-Based)

We chose path-based routing to avoid wildcard DNS complexity:

| URL | Purpose |
|-----|---------|
| `shop.peeap.com/` | Marketplace homepage |
| `shop.peeap.com/products` | All products |
| `shop.peeap.com/vendors` | All vendors |
| `shop.peeap.com/categories` | Categories |
| `shop.peeap.com/store/{slug}` | Individual vendor store |
| `shop.peeap.com/store/{slug}/products` | Vendor's products |
| `shop.peeap.com/dashboard` | Vendor dashboard |
| `shop.peeap.com/cart` | Shopping cart |
| `shop.peeap.com/checkout` | Checkout |

---

## Environment Variables

File: `apps/web/.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cfjehzehbiqgsemkeiay.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmamVoemVoYmlxZ3NlbWtlaWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjA2MTEsImV4cCI6MjA4MDg5NjYxMX0.hzLebHS5KwYgyENUT6_ZA0dH-ZNv7NTmzRXg0-Z0yq8
SUPABASE_SERVICE_ROLE_KEY=  # TODO: Add this

# Peeap Integration
PEEAP_API_URL=https://my.peeap.com/api/v1
PEEAP_API_KEY=  # TODO: Add when ready
PEEAP_WEBHOOK_SECRET=  # TODO: Add when ready

# App
NEXT_PUBLIC_APP_URL=https://shop.peeap.com
NEXT_PUBLIC_MAIN_DOMAIN=shop.peeap.com
```

---

## DNS Configuration

Already configured in Contabo:

| Type | Name | Value |
|------|------|-------|
| CNAME | `shop` | `cname.vercel-dns.com` |

---

## Project Structure

```
/Users/local_server/soft-touch2/project/shop/
├── README.md
├── PROGRESS.md                 # This file
├── docs/
│   ├── PROJECT_PLAN.md
│   ├── DELIVERY_ROADMAP.md
│   ├── DATABASE_SCHEMA.md
│   └── API_SPECIFICATION.md
├── apps/
│   └── web/                    # Next.js 14 app
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx              # Marketplace
│       │   │   ├── store/[slug]/page.tsx # Vendor stores
│       │   │   └── dashboard/            # Vendor dashboard
│       │   ├── lib/
│       │   │   ├── peeap-sdk.ts
│       │   │   └── supabase/
│       │   ├── middleware.ts
│       │   └── types/database.ts
│       ├── .env.local
│       └── package.json
└── packages/
    └── database/
        └── migrations/
            └── 001_initial_schema.sql
```

---

## Accounts & Services

| Service | Account/Project | URL |
|---------|-----------------|-----|
| GitHub | PeeapDev/shop | https://github.com/PeeapDev/shop |
| Vercel | devpeeap-8345s-projects/shop | https://vercel.com/devpeeap-8345s-projects/shop |
| Supabase | peeap-shop | https://supabase.com/dashboard/project/cfjehzehbiqgsemkeiay |
| Production | shop.peeap.com | https://shop.peeap.com |

---

## Integration with my.peeap.com (Card Project)

The shop integrates with the existing Peeap payment platform:

1. **SSO**: Vendors authenticate via Peeap accounts
2. **Payments**: Checkout via Peeap SDK
3. **Wallets**: Vendor earnings go to Peeap wallets
4. **Store Page**: Add "Store" tab to my.peeap.com dashboard (Phase 6)

Related project: `/Users/local_server/soft-touch2/project/card`

---

## Next Development Phase

After completing pending setup tasks, continue with **Phase 1: Vendor Dashboard (MVP)**

See `docs/DELIVERY_ROADMAP.md` for detailed tasks:
- [ ] Implement SSO with my.peeap.com
- [ ] Store creation wizard
- [ ] Product management CRUD
- [ ] Product image upload

---

## Commands Reference

```bash
# Navigate to project
cd /Users/local_server/soft-touch2/project/shop/apps/web

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod

# Push to GitHub
git add -A && git commit -m "message" && git push origin main
```

---

## Notes

- Using path-based routing instead of subdomains to avoid wildcard DNS (requires Vercel Pro)
- Vendor stores accessible at `/store/{slug}` instead of `{slug}.shop.peeap.com`
- Dashboard at `/dashboard` instead of `dashboard.shop.peeap.com`
