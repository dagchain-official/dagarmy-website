import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = [
  '/student-dashboard',
  '/admin',
  '/(dashboard)',
  '/rewards',
  '/courses',
  '/hackathons',
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some(p => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // ── Auth protection ───────────────────────────────────────────────────────
  if (isProtected(pathname)) {
    const token = request.cookies.get('dagarmy_token')?.value;
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Redirect logged-in users away from auth pages ─────────────────────────
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
    const token = request.cookies.get('dagarmy_token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/student-dashboard', request.url));
    }
  }

  // ── Minimal CSP (WalletConnect entries removed) ───────────────────────────
  response.headers.set(
    'Content-Security-Policy',
    "frame-src 'self' https://accounts.google.com"
  );

  return response;
}

export const config = {
  matcher: [
    // Skip: static files, images, API routes, and auth routes
    '/((?!_next/static|_next/image|favicon.ico|api/|auth/|.*\.pdf$|.*\.png$|.*\.jpg$|.*\.jpeg$|.*\.svg$|.*\.gif$|.*\.ico$|.*\.webp$).*)',
  ],
};
