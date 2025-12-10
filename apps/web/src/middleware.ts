import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routing Middleware for Peeap Shop
 *
 * URL Structure (Path-based):
 * - shop.peeap.com/                    → Marketplace homepage
 * - shop.peeap.com/products            → All products
 * - shop.peeap.com/vendors             → All vendors
 * - shop.peeap.com/store/{slug}        → Individual vendor store
 * - shop.peeap.com/store/{slug}/products → Vendor's products
 * - shop.peeap.com/dashboard           → Vendor dashboard (authenticated)
 * - shop.peeap.com/cart                → Shopping cart
 * - shop.peeap.com/checkout            → Checkout
 */

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next();
  }

  // Dashboard routes - require authentication (handled in dashboard layout)
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Store routes - vendor storefronts
  if (pathname.startsWith('/store/')) {
    return NextResponse.next();
  }

  // Cart and checkout
  if (pathname.startsWith('/cart') || pathname.startsWith('/checkout')) {
    return NextResponse.next();
  }

  // All other routes go to marketplace
  // Rewrite root and marketplace routes
  if (pathname === '/' || pathname.startsWith('/products') || pathname.startsWith('/vendors') || pathname.startsWith('/categories')) {
    // These are marketplace routes, let them through
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
