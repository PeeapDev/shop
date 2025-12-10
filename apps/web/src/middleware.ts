import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Multi-tenant middleware for routing requests based on hostname
 *
 * Routes:
 * - shop.peeap.com -> /marketplace
 * - dashboard.shop.peeap.com -> /dashboard
 * - {slug}.shop.peeap.com -> /store/{slug}
 * - custom domain -> lookup store and route to /store/{slug}
 */

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'shop.peeap.com';
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'shop.peeap.com';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
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

  // Local development handling
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Extract subdomain
  let subdomain: string | null = null;

  if (isLocalhost) {
    // For local dev: check for subdomain in query param or use path-based routing
    subdomain = url.searchParams.get('subdomain');
  } else {
    // Production: extract subdomain from hostname
    const hostParts = hostname.replace(`.${ROOT_DOMAIN}`, '').split('.');
    if (hostname !== ROOT_DOMAIN && hostname !== `www.${ROOT_DOMAIN}`) {
      subdomain = hostParts[0];
    }
  }

  // Route based on subdomain
  if (subdomain === 'dashboard') {
    // Vendor dashboard: dashboard.shop.peeap.com
    url.pathname = `/dashboard${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (subdomain && subdomain !== 'www') {
    // Vendor store: {slug}.shop.peeap.com
    url.pathname = `/store/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Main marketplace: shop.peeap.com
  if (!pathname.startsWith('/marketplace') && !pathname.startsWith('/store') && !pathname.startsWith('/dashboard')) {
    url.pathname = `/marketplace${pathname}`;
    return NextResponse.rewrite(url);
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
