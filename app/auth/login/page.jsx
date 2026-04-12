"use client";
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// /auth/login — redirects to home page, which opens the login modal
// This page exists to satisfy middleware redirects for unauthenticated users
function AuthLoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    // Store intended destination so home page can redirect after login
    if (redirect && redirect !== '/') {
      sessionStorage.setItem('dagarmy_login_redirect', redirect);
    }
    // Go to home — the LoginModal can be triggered there
    router.replace('/?login=1');
  }, [redirect, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
    }}>
      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
        Redirecting...
      </div>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f1f5f9',
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          Loading...
        </div>
      </div>
    }>
      <AuthLoginRedirect />
    </Suspense>
  );
}
