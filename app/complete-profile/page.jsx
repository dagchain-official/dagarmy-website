"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, AlertCircle, Loader2, User } from 'lucide-react';

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '12px',
  border: '1.5px solid #e5e7eb',
  background: '#fff',
  color: '#111827',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
};

const COUNTRY_CODES = [
  ['+1','US/CA'],['+44','UK'],['+91','IN'],['+971','UAE'],['+966','SA'],
  ['+92','PK'],['+880','BD'],['+234','NG'],['+254','KE'],['+27','ZA'],
  ['+49','DE'],['+33','FR'],['+39','IT'],['+34','ES'],['+55','BR'],
  ['+52','MX'],['+60','MY'],['+65','SG'],['+62','ID'],['+63','PH'],
  ['+84','VN'],['+66','TH'],['+20','EG'],['+212','MA'],['+213','DZ'],
];

function CompleteProfileInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [country, setCountry]     = useState('+91');
  const [whatsapp, setWhatsapp]   = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [refValid, setRefValid]   = useState(null);
  const [error, setError]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = React.useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pending_referral_code');
      if (saved) setReferralCode(saved);
    }
  }, []);

  // Referral code validation
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!referralCode || referralCode.trim().length < 3) { setRefValid(null); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/referral/validate?code=${referralCode.trim()}`);
        const data = await res.json();
        setRefValid(data?.valid ?? false);
      } catch { setRefValid(null); }
    }, 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [referralCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const digitsOnly = whatsapp.replace(/\D/g, '');
    if (!firstName.trim()) { setError('First name is required'); return; }
    if (!lastName.trim())  { setError('Last name is required'); return; }
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setError('Valid WhatsApp number required (7–15 digits)');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          country_code: country,
          whatsapp_number: whatsapp.trim(),
          ...(referralCode.trim() ? { referral_code: referralCode.trim().toUpperCase() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save profile'); return; }
      // Update stored user object with new profile data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pending_referral_code');
        try {
          const stored = JSON.parse(localStorage.getItem('dagarmy_user') || '{}');
          localStorage.setItem('dagarmy_user', JSON.stringify({
            ...stored,
            full_name: `${firstName.trim()} ${lastName.trim()}`,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            profile_completed: true,
          }));
        } catch {}
      }
      router.replace('/student-dashboard');
    } catch { setError('Network error. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#fff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '28px 28px 0',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          paddingBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Complete Your Profile</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>One last step to get started</div>
            </div>
          </div>
          {email && (
            <div style={{ marginTop: '14px', padding: '8px 12px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>
              Signed in as <strong style={{ color: '#fff' }}>{email}</strong>
            </div>
          )}
        </div>

        {/* Form */}
        <div style={{ padding: '28px' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 12px', marginBottom: '18px', fontSize: '13px', color: '#dc2626' }}>
              <AlertCircle size={15} style={{ marginTop: '1px', flexShrink: 0 }} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  First Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required autoFocus placeholder="John"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Last Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="Doe"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                WhatsApp Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={country} onChange={e => setCountry(e.target.value)}
                  style={{ ...inputStyle, width: '105px', flexShrink: 0, cursor: 'pointer' }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}>
                  {COUNTRY_CODES.map(([code, label]) => (
                    <option key={code} value={code}>{code} {label}</option>
                  ))}
                </select>
                <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/[^0-9\s\-]/g, ''))} required placeholder="Enter number"
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Used for team communications - we don't spam</p>
            </div>

            {/* Referral Code */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Referral Code <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())} maxLength={12} placeholder="e.g. DAG1234ABCD"
                  style={{ ...inputStyle, borderColor: refValid === true ? '#22c55e' : refValid === false ? '#ef4444' : '#e5e7eb', fontFamily: 'monospace', letterSpacing: '0.05em', paddingRight: referralCode ? '36px' : '14px' }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = refValid === true ? '#22c55e' : refValid === false ? '#ef4444' : '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                {refValid === true  && <Check       size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#22c55e' }} />}
                {refValid === false && <AlertCircle size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} />}
              </div>
            </div>

            <button type="submit" disabled={submitting} style={{
              width: '100%', padding: '13px 16px', borderRadius: '14px', border: 'none',
              background: submitting ? '#d1d5db' : 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
              color: '#fff', fontSize: '15px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: submitting ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = '0.92'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
              {submitting
                ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                : <><Check size={16} /> Complete Setup & Enter Dashboard</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <CompleteProfileInner />
    </Suspense>
  );
}
