import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all admin routes except the root /admin path
  // The root /admin page will handle its own redirect
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    // Check if user is authenticated
    const userRole = request.cookies.get('dagarmy_role')?.value;
    const isAuthenticated = request.cookies.get('dagarmy_authenticated')?.value;

    // If not authenticated, redirect to register/login page
    if (!isAuthenticated || isAuthenticated !== 'true') {
      const loginUrl = new URL('/register', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin role
    if (userRole !== 'admin') {
      // Redirect non-admin users to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin',
  ],
};
