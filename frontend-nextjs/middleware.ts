import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Protected routes
  const protectedRoutes = [
    '/dashboard',
    '/candidates',
    '/employees',
    '/factories',
    '/timer-cards',
    '/salary',
    '/requests',
    '/database',
    '/adminer',
  ];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Check for token in cookies (we'll set this on login)
  const token = request.cookies.get('token')?.value || request.cookies.get('auth_token')?.value;

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (pathname === '/login' && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Request-ID', crypto.randomUUID());
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};