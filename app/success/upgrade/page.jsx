"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function UpgradeSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }
    // Small delay to allow webhook to process, then verify
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/stripe/verify-payment?session_id=${sessionId}`);
        const data = await res.json();
        if (res.ok && data.paid) {
          // Redirect to dashboard with staking perk params — modal will fire there
          router.replace(`/dashboard?staking_perk=lt_upgrade&session_id=${sessionId}`);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '52px 48px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #e0e7ff',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '28px' }}>
          <Image src="/images/logo/logo.png" alt="DAGARMY" width={64} height={64} style={{ borderRadius: '16px' }} />
        </div>

        {status === 'loading' && (
          <>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              border: '3px solid #e0e7ff', borderTopColor: '#6366f1',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 24px',
            }} />
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
              Confirming your payment...
            </h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Please wait while we activate your DAG Lieutenant status.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            {/* Success icon */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#eef2ff', borderRadius: '20px',
              padding: '5px 14px', marginBottom: '20px',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1' }}>PAYMENT CONFIRMED</span>
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
              Welcome, DAG Lieutenant!
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 32px', lineHeight: 1.6 }}>
              Your account has been upgraded. You now have access to full earning potential, enhanced referral bonuses, and exclusive Lieutenant benefits.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/rewards" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px 24px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff', fontSize: '14px', fontWeight: '700',
                textDecoration: 'none', boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                View My Rewards
              </Link>
              <Link href="/dashboard" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '13px 24px', borderRadius: '12px',
                border: '1.5px solid #e0e7ff', background: '#fff',
                color: '#4f46e5', fontSize: '14px', fontWeight: '600',
                textDecoration: 'none',
              }}>
                Go to Dashboard
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: '#fef2f2', border: '2px solid #fecaca',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px' }}>
              Could not verify payment
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 28px', lineHeight: 1.6 }}>
              If your payment was successful, your account will be upgraded within a few minutes. Check your email for a receipt.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/rewards" style={{
                padding: '13px 24px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff', fontSize: '14px', fontWeight: '700',
                textDecoration: 'none', display: 'block',
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              }}>
                Go to Rewards Page
              </Link>
              <a href="mailto:support@dagchain.network" style={{
                padding: '13px 24px', borderRadius: '12px',
                border: '1.5px solid #e2e8f0', background: '#fff',
                color: '#64748b', fontSize: '14px', fontWeight: '600',
                textDecoration: 'none', display: 'block',
              }}>
                Contact Support
              </a>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #e0e7ff', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <UpgradeSuccessContent />
    </Suspense>
  );
}
