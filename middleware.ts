import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add CSP header to allow WalletConnect iframes
  response.headers.set(
    'Content-Security-Policy',
    "frame-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://verify.walletconnect.com https://verify.walletconnect.org https://secure.walletconnect.com https://secure.walletconnect.org https://secure-mobile.walletconnect.com https://secure-mobile.walletconnect.org"
  );

  return response;
}

export const config = {
  matcher: '/:path*',
};
