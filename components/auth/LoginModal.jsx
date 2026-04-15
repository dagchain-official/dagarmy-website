"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, ArrowLeft, ChevronRight, Loader2, Eye, EyeOff, Check, AlertCircle, Wallet, Phone, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

async function getFingerprint() {
  try {
    const FpJS = await import('@fingerprintjs/fingerprintjs');
    const fp = await FpJS.default.load();
    const { visitorId } = await fp.get();
    return visitorId;
  } catch { return null; }
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// ── Shared input style — light theme, matches DAGCHAIN exactly
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
};

// ── Ghost option button (Google / Email rows)
function OptionBtn({ icon, label, onClick, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '13px 16px',
        borderRadius: '14px',
        border: '1.5px solid #e5e7eb',
        background: hov ? '#f9fafb' : '#fff',
        color: '#111827',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
      <ChevronRight size={16} style={{ color: '#9ca3af' }} />
    </button>
  );
}

// ── Gradient CTA button (Connect Wallet / Create Account style)
function GradientBtn({ children, type = 'button', onClick, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '13px 16px',
        borderRadius: '14px',
        border: 'none',
        background: disabled ? '#d1d5db' : 'linear-gradient(90deg, #22d3ee 0%, #818cf8 50%, #a855f7 100%)',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'opacity 0.15s, transform 0.1s',
        boxShadow: disabled ? 'none' : '0 4px 20px rgba(99,102,241,0.3)',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.92'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.985)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
      <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      <span style={{ fontSize: '12px', color: '#9ca3af' }}>or</span>
      <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
    </div>
  );
}

export default function LoginModal({ isOpen, onClose }) {
  const { login, loginWithGoogle } = useAuth();

  // view: 'main' | 'signin' | 'register' | 'forgot' | 'forgot_sent'
  const [view, setView] = useState('main');

  const [signEmail, setSignEmail]     = useState('');
  const [signPassword, setSignPassword] = useState('');
  const [showSignPwd, setShowSignPwd] = useState(false);

  const [regName, setRegName]         = useState('');
  const [regEmail, setRegEmail]       = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm]   = useState('');
  const [regRole, setRegRole]         = useState('student');
  const [showRegPwd, setShowRegPwd]   = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [refValid, setRefValid]       = useState(null);

  const [mainReferral, setMainReferral] = useState('');

  // Profile completion step (shown after new email registration)
  const [profileUserId, setProfileUserId] = useState(null);
  const [profileEmail, setProfileEmail] = useState('');
  const [profFirstName, setProfFirstName] = useState('');
  const [profLastName, setProfLastName]   = useState('');
  const [profCountry, setProfCountry]     = useState('+91');
  const [profWhatsapp, setProfWhatsapp]   = useState('');
  const [profSubmitting, setProfSubmitting] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const fpRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setView('main'); setError('');
      setProfFirstName(''); setProfLastName(''); setProfWhatsapp(''); setProfCountry('+91'); setProfileUserId(null);
      getFingerprint().then(fp => { fpRef.current = fp; });
      // Pre-fill referral from localStorage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('pending_referral_code');
        if (saved) { setMainReferral(saved); setReferralCode(saved); }
      }
    }
  }, [isOpen]);

  useEffect(() => { setError(''); }, [view]);

  // referral validation
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const code = referralCode || mainReferral;
    if (!code || code.trim().length < 3) { setRefValid(null); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/referral/validate?code=${code.trim()}`);
        const data = await res.json();
        setRefValid(data?.valid ?? false);
      } catch { setRefValid(null); }
    }, 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [referralCode, mainReferral]);

  if (!isOpen) return null;

  const handleSignin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signEmail, password: signPassword, fingerprint_id: fpRef.current }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === 'wallet_only_user'
          ? 'This account uses wallet login. Use "Forgot Password" to set a password.'
          : data.error || 'Invalid email or password');
        return;
      }
      localStorage.setItem('dagarmy_token', data.token);
      localStorage.setItem('dagarmy_user', JSON.stringify(data.user));
      // Show profile completion if WhatsApp / name is missing
      if (data.user?.needs_profile_completion) {
        setProfileUserId(data.user.id);
        setProfileEmail(data.user.email || signEmail);
        setProfFirstName(data.user.first_name || '');
        setProfLastName(data.user.last_name || '');
        setView('profile');
      } else {
        window.location.href = data.user?.is_admin ? '/admin/dashboard' : '/student-dashboard';
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError('');
    if (regPassword !== regConfirm) { setError('Passwords do not match'); return; }
    if (regPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, password: regPassword, full_name: regName, role: regRole, fingerprint_id: fpRef.current, referral_code: referralCode || mainReferral || undefined }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Registration failed');
      else {
        localStorage.setItem('dagarmy_token', data.token);
        localStorage.setItem('dagarmy_user', JSON.stringify(data.user));
        // New user — show profile completion step
        if (data.isNewUser && !data.user?.profile_completed) {
          setProfileUserId(data.user.id);
          setProfileEmail(data.user.email || regEmail);
          // Pre-split full_name into first/last if present
          const parts = (data.user.full_name || regName || '').trim().split(' ');
          setProfFirstName(parts[0] || regName);
          setProfLastName(parts.slice(1).join(' ') || '');
          setView('profile');
        } else {
          window.location.href = '/student-dashboard';
        }
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleProfileComplete = async (e) => {
    e.preventDefault(); setError('');
    const digitsOnly = profWhatsapp.replace(/\D/g, '');
    if (!profFirstName.trim()) { setError('First name is required'); return; }
    if (!profLastName.trim()) { setError('Last name is required'); return; }
    if (digitsOnly.length < 7 || digitsOnly.length > 15) { setError('Valid WhatsApp number required (7–15 digits)'); return; }
    setProfSubmitting(true);
    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profileEmail,
          first_name: profFirstName.trim(),
          last_name: profLastName.trim(),
          country_code: profCountry,
          whatsapp_number: profWhatsapp.trim(),
          referral_code: referralCode || mainReferral || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save profile'); return; }
      if (typeof window !== 'undefined') localStorage.removeItem('pending_referral_code');
      window.location.href = '/student-dashboard';
    } catch { setError('Network error. Please try again.'); }
    finally { setProfSubmitting(false); }
  };

  const handleForgot = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: forgotEmail }) });
      setView('forgot_sent');
    } catch { setError('Network error.'); }
    finally { setLoading(false); }
  };

  // ── Card shell
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      {/* Backdrop */}
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      />

      {/* Card — EXACT DAGCHAIN light style */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          borderRadius: '20px',
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '14px', zIndex: 10,
            width: '30px', height: '30px', borderRadius: '8px', border: 'none',
            background: '#e2e8f0', color: '#6b7280', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#cbd5e1'; e.currentTarget.style.color = '#111827'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#6b7280'; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div style={{ padding: '28px 28px 24px' }}>
          <AnimatePresence mode="wait">

            {/* ══ MAIN VIEW ══ */}
            {view === 'main' && (
              <motion.div key="main" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
                    <Shield size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>Welcome to DAGARMY</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Sign in or create your account</div>
                  </div>
                </div>

                {/* Referral */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    Referral Code <span style={{ color: '#f59e0b', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={mainReferral}
                      onChange={e => setMainReferral(e.target.value.toUpperCase())}
                      placeholder="e.g. DAG1234ABCD"
                      maxLength={12}
                      style={{
                        ...inputStyle,
                        borderColor: refValid === true ? '#22c55e' : refValid === false ? '#ef4444' : '#e5e7eb',
                        fontFamily: 'monospace',
                        letterSpacing: '0.05em',
                        paddingRight: mainReferral ? '36px' : '14px',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = refValid === true ? '#22c55e' : refValid === false ? '#ef4444' : '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                    {refValid === true && <Check size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#22c55e' }} />}
                    {refValid === false && <AlertCircle size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} />}
                  </div>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <OptionBtn icon={<GoogleIcon />} label="Continue with Google" onClick={loginWithGoogle} disabled={loading} />
                  <Divider />
                  <OptionBtn icon={<Mail size={20} />} label="Continue with Email" onClick={() => setView('signin')} disabled={loading} />
                  <Divider />
                  <GradientBtn onClick={() => setView('register')} disabled={loading}>
                    <Wallet size={18} />
                    Create Account
                  </GradientBtn>
                </div>

                <p style={{ marginTop: '16px', fontSize: '11px', color: '#9ca3af', textAlign: 'center', lineHeight: 1.5 }}>
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </motion.div>
            )}

            {/* ══ SIGN IN VIEW ══ */}
            {view === 'signin' && (
              <motion.div key="signin" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                <button onClick={() => setView('main')} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '18px', padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                  <ArrowLeft size={15} /> Back
                </button>

                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Sign In</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Enter your email and password to continue.</div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', fontSize: '13px', color: '#dc2626' }}>
                    <AlertCircle size={15} style={{ marginTop: '1px', flexShrink: 0 }} />{error}
                  </div>
                )}

                <form onSubmit={handleSignin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Email Address</label>
                    <input type="email" value={signEmail} onChange={e => setSignEmail(e.target.value)} required autoFocus placeholder="you@example.com" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showSignPwd ? 'text' : 'password'} value={signPassword} onChange={e => setSignPassword(e.target.value)} required placeholder="••••••••"
                        style={{ ...inputStyle, paddingRight: '40px' }}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                      <button type="button" onClick={() => setShowSignPwd(!showSignPwd)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                        {showSignPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <button type="button" onClick={() => setView('forgot')} style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', float: 'right', marginTop: '4px', padding: 0 }}>
                      Forgot password?
                    </button>
                  </div>
                  <GradientBtn type="submit" disabled={loading}>
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in...</> : 'Sign In'}
                  </GradientBtn>
                </form>

                <p style={{ marginTop: '16px', fontSize: '13px', textAlign: 'center', color: '#6b7280' }}>
                  Don't have an account?{' '}
                  <button onClick={() => setView('register')} style={{ color: '#6366f1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Create one</button>
                </p>
              </motion.div>
            )}

            {/* ══ REGISTER VIEW ══ */}
            {view === 'register' && (
              <motion.div key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                <button onClick={() => setView('main')} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '18px', padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                  <ArrowLeft size={15} /> Back
                </button>

                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Create Account</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '18px' }}>Join DAGARMY and start your journey.</div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', fontSize: '13px', color: '#dc2626' }}>
                    <AlertCircle size={15} style={{ marginTop: '1px', flexShrink: 0 }} />{error}
                  </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Full Name</label>
                    <input type="text" value={regName} onChange={e => setRegName(e.target.value)} required autoFocus placeholder="John Doe" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Email Address</label>
                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required placeholder="you@example.com" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Password</label>
                      <div style={{ position: 'relative' }}>
                        <input type={showRegPwd ? 'text' : 'password'} value={regPassword} onChange={e => setRegPassword(e.target.value)} required placeholder="Min 8 chars"
                          style={{ ...inputStyle, paddingRight: '36px' }}
                          onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                          onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                        <button type="button" onClick={() => setShowRegPwd(!showRegPwd)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                          {showRegPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Confirm</label>
                      <input type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} required placeholder="Repeat"
                        style={{ ...inputStyle, borderColor: regConfirm && regConfirm !== regPassword ? '#ef4444' : '#e5e7eb' }}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = regConfirm && regConfirm !== regPassword ? '#ef4444' : '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                  </div>
                  {/* Role */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>I am a</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {['student', 'trainer'].map(r => (
                        <button key={r} type="button" onClick={() => setRegRole(r)} style={{
                          padding: '9px', borderRadius: '10px', border: `2px solid ${regRole === r ? '#6366f1' : '#e5e7eb'}`,
                          background: regRole === r ? '#eef2ff' : '#fff', color: regRole === r ? '#4f46e5' : '#374151',
                          fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Referral */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                      Referral Code <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())} maxLength={12} placeholder="e.g. DAG1234ABCD"
                        style={{ ...inputStyle, borderColor: refValid === true ? '#22c55e' : refValid === false ? '#ef4444' : '#e5e7eb', fontFamily: 'monospace', letterSpacing: '0.05em', paddingRight: referralCode ? '36px' : '14px' }}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = refValid === true ? '#22c55e' : refValid === false ? '#ef4444' : '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                      {refValid === true && <Check size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#22c55e' }} />}
                      {refValid === false && <AlertCircle size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} />}
                    </div>
                  </div>

                  <GradientBtn type="submit" disabled={loading}>
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Creating...</> : 'Create Account'}
                  </GradientBtn>
                </form>

                <p style={{ marginTop: '14px', fontSize: '13px', textAlign: 'center', color: '#6b7280' }}>
                  Already have an account?{' '}
                  <button onClick={() => setView('signin')} style={{ color: '#6366f1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Sign in</button>
                </p>
              </motion.div>
            )}

            {/* ══ PROFILE COMPLETION VIEW ══ */}
            {view === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={18} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>Complete Your Profile</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>One last step — tell us a bit about yourself</div>
                  </div>
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', fontSize: '13px', color: '#dc2626' }}>
                    <AlertCircle size={15} style={{ marginTop: '1px', flexShrink: 0 }} />{error}
                  </div>
                )}

                <form onSubmit={handleProfileComplete} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>First Name</label>
                      <input type="text" value={profFirstName} onChange={e => setProfFirstName(e.target.value)} required autoFocus placeholder="John"
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Last Name</label>
                      <input type="text" value={profLastName} onChange={e => setProfLastName(e.target.value)} required placeholder="Doe"
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                      WhatsApp Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select value={profCountry} onChange={e => setProfCountry(e.target.value)}
                        style={{ ...inputStyle, width: '100px', flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit' }}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}>
                        {[
                          ['+1','US/CA'],['+ 44','UK'],['+91','IN'],['+971','UAE'],['+966','SA'],
                          ['+92','PK'],['+880','BD'],['+234','NG'],['+254','KE'],['+27','ZA'],
                          ['+49','DE'],['+33','FR'],['+39','IT'],['+34','ES'],['+55','BR'],
                          ['+52','MX'],['+60','MY'],['+65','SG'],['+62','ID'],['+63','PH'],
                          ['+84','VN'],['+66','TH'],['+20','EG'],['+212','MA'],['+213','DZ'],
                        ].map(([code, label]) => (
                          <option key={code} value={code}>{code} {label}</option>
                        ))}
                      </select>
                      <input type="tel" value={profWhatsapp} onChange={e => setProfWhatsapp(e.target.value.replace(/[^0-9\s\-]/g, ''))} required placeholder="Enter number"
                        style={{ ...inputStyle, flex: 1 }}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Used for team communications and support</p>
                  </div>

                  <GradientBtn type="submit" disabled={profSubmitting}>
                    {profSubmitting ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Check size={15} /> Complete Setup</>}
                  </GradientBtn>
                </form>
              </motion.div>
            )}

            {/* ══ FORGOT VIEW ══ */}
            {view === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                <button onClick={() => setView('signin')} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '18px', padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                  <ArrowLeft size={15} /> Back
                </button>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Reset Password</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Enter your email and we'll send a reset link.</div>
                {error && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', fontSize: '13px', color: '#dc2626' }}>
                    <AlertCircle size={15} style={{ marginTop: '1px', flexShrink: 0 }} />{error}
                  </div>
                )}
                <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Email Address</label>
                    <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required autoFocus placeholder="you@example.com" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <GradientBtn type="submit" disabled={loading}>
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : 'Send Reset Link'}
                  </GradientBtn>
                </form>
              </motion.div>
            )}

            {/* ══ FORGOT SENT ══ */}
            {view === 'forgot_sent' && (
              <motion.div key="forgot_sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.22 }} style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={28} color="#16a34a" />
                </div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Check your inbox</div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                  If <strong style={{ color: '#111827' }}>{forgotEmail}</strong> is registered, a reset link is on its way.
                </p>
                <button onClick={() => { setView('signin'); setForgotEmail(''); }} style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>
                  ← Back to Sign In
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
