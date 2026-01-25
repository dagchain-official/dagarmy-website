import { NextResponse } from 'next/server';

export function middleware(request) {
  // Middleware disabled - authentication handled client-side
  // This avoids cookie/localStorage sync issues
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin',
  ],
};
