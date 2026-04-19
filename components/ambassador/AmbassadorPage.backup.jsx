"use client";
import React, { useState, useEffect, useRef } from "react";

/* ── Icons ─────────────────────────────────────────────────── */
const Ic = {
  chevron: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  check: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  play: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  zap: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  globe: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  award: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  cpu: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  coins: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>,
};

/* ── Animated Counter ──────────────────────────────────────── */
function Counter({ end, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let cur = 0;
        const step = end / 60;
        const t = setInterval(() => {
          cur += step;
          if (cur >= end) { setVal(end); clearInterval(t); } else setVal(Math.floor(cur));
        }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ── FAQ ───────────────────────────────────────────────────── */
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', background: 'none', border: 'none', padding: '22px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', gap: '20px', textAlign: 'left',
      }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#111', lineHeight: 1.5 }}>{q}</span>
        <span style={{ flexShrink: 0, color: '#111', transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none', display: 'flex' }}>
          <Ic.chevron />
        </span>
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? '200px' : '0', transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
        <p style={{ margin: '0 0 22px', color: '#666', fontSize: '14px', lineHeight: 1.8 }}>{a}</p>
      </div>
    </div>
  );
}

/* ── Apply Modal ───────────────────────────────────────────── */
function ApplyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ full_name: '', email: '', country: '', telegram: '', social_links: '', follower_count: '', content_niche: '', statement: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.country) { setErr('Full name, email and country are required.'); return; }
    setLoading(true); setErr('');
    try {
      const res = await fetch('/api/ambassador/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Submission failed');
      onSuccess();
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const inp = (extra = {}) => ({
    style: {
      width: '100%', padding: '11px 14px', border: '1.5px solid #eee',
      borderRadius: '10px', fontSize: '14px', color: '#111', background: '#fafafa',
      outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
      transition: 'border-color 0.2s, background 0.2s',
      ...extra,
    },
    onFocus: (e) => { e.target.style.borderColor = '#111'; e.target.style.background = '#fff'; },
    onBlur: (e) => { e.target.style.borderColor = '#eee'; e.target.style.background = '#fafafa'; },
  });
  const lbl = { display: 'block', fontSize: '12px', fontWeight: '700', color: '#111', marginBottom: '6px', letterSpacing: '0.3px', textTransform: 'uppercase' };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }}>
      <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999' }}>Ambassador Program</p>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#111', letterSpacing: '-0.5px' }}>Submit Your Application</h2>
          </div>
          <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', flexShrink: 0 }}>
            <Ic.close />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={submit} style={{ overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={lbl}>Full Name <span style={{ color: '#e00' }}>*</span></label>
              <input value={form.full_name} onChange={set('full_name')} placeholder="Your full name" {...inp()} />
            </div>
            <div>
              <label style={lbl}>Email Address <span style={{ color: '#e00' }}>*</span></label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" {...inp()} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={lbl}>Country <span style={{ color: '#e00' }}>*</span></label>
              <input value={form.country} onChange={set('country')} placeholder="India, UAE, USA..." {...inp()} />
            </div>
            <div>
              <label style={lbl}>Telegram / WhatsApp</label>
              <input value={form.telegram} onChange={set('telegram')} placeholder="@handle or +number" {...inp()} />
            </div>
          </div>
          <div>
            <label style={lbl}>Social Media Links</label>
            <input value={form.social_links} onChange={set('social_links')} placeholder="YouTube, Instagram, Twitter, LinkedIn - paste all links" {...inp()} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={lbl}>Total Followers / Subscribers</label>
              <input value={form.follower_count} onChange={set('follower_count')} placeholder="e.g. 25,000" {...inp()} />
            </div>
            <div>
              <label style={lbl}>Content Niche</label>
              <input value={form.content_niche} onChange={set('content_niche')} placeholder="AI, Web3, Finance, Tech..." {...inp()} />
            </div>
          </div>
          <div>
            <label style={lbl}>Why do you want to be an Ambassador?</label>
            <textarea value={form.statement} onChange={set('statement')} rows={4} placeholder="Tell us about yourself, your audience, and what excites you about DAG Army..." style={{ ...inp().style, resize: 'vertical', lineHeight: '1.7' }} onFocus={inp().onFocus} onBlur={inp().onBlur} />
          </div>
          {err && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '13px' }}>{err}</div>}
          <button type="submit" disabled={loading} style={{
            background: loading ? '#ddd' : '#111', color: loading ? '#999' : '#fff',
            border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px',
            fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            letterSpacing: '-0.2px', transition: 'background 0.2s',
          }}>
            {loading ? 'Submitting...' : <><span>Submit Application</span><Ic.arrow /></>}
          </button>
          <p style={{ margin: 0, textAlign: 'center', fontSize: '12px', color: '#aaa' }}>Our team reviews every application personally within 5–10 days.</p>
        </form>
      </div>
    </div>
  );
}

/* ── Success Modal ─────────────────────────────────────────── */
function SuccessModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '52px 44px', textAlign: 'center', maxWidth: '440px', width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.16)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#fff' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ margin: '0 0 12px', fontSize: '24px', fontWeight: '800', color: '#111', letterSpacing: '-0.8px' }}>Application Received</h2>
        <p style={{ margin: '0 0 32px', color: '#666', fontSize: '15px', lineHeight: 1.7 }}>Thank you for applying. Our team will review your application and reach out to shortlisted candidates. Check your email for a confirmation.</p>
        <button onClick={onClose} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px 32px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', letterSpacing: '-0.2px' }}>
          Back to Ambassador Page
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function AmbassadorPage() {
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const gsapDone = useRef(false);

  useEffect(() => {
    if (gsapDone.current) return;
    gsapDone.current = true;
    (async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        // Hero word-by-word
        gsap.fromTo('.amb-word', { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.7, ease: 'power3.out', delay: 0.3 });
        gsap.fromTo('.amb-hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.9 });
        gsap.fromTo('.amb-hero-actions', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 1.1 });
        gsap.fromTo('.amb-hero-badge', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.1 });

        // Scroll reveals
        gsap.utils.toArray('.amb-reveal').forEach(el => {
          gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
        });

        // Staggered grids
        gsap.utils.toArray('.amb-grid').forEach(g => {
          gsap.fromTo(g.querySelectorAll('.amb-card'), { opacity: 0, y: 36, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out', scrollTrigger: { trigger: g, start: 'top 85%' } });
        });

        // Floating orbs in hero
        gsap.utils.toArray('.amb-orb').forEach((orb, i) => {
          gsap.to(orb, { y: -30 - i * 8, x: (i % 2 === 0 ? 12 : -12), duration: 4 + i * 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3 });
        });

        // Stats line fill
        gsap.fromTo('.amb-stat-line', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: '.amb-stats-row', start: 'top 85%' } });

      } catch (e) { /* GSAP unavailable */ }
    })();
  }, []);

  const tiers = [
    { name: 'Silver', req: '1,000+ followers', color: '#6b7280', accent: '#f9fafb', perks: ['Standard referral rewards', 'Free DAGGPT access', 'Official Ambassador Badge', 'Private community access'] },
    { name: 'Gold', req: '50,000+ followers', color: '#d97706', accent: '#fffbeb', perks: ['Enhanced reward rate', 'Performance bonuses', 'Featured website profile', 'Priority support channel', 'Early ecosystem access'], featured: true },
    { name: 'Platinum', req: '100,000+ followers', color: '#111', accent: '#f8fafc', perks: ['Custom partnership terms', 'Regional leadership role', 'Revenue-share agreements', 'Direct executive access', 'Co-branded campaigns'] },
  ];

  const benefits = [
    { icon: <Ic.cpu />, label: 'Free DAGGPT Access', desc: 'All approved ambassadors receive full complimentary access to DAGGPT\'s multi-module AI platform.' },
    { icon: <Ic.coins />, label: 'Referral Earnings', desc: 'Earn rewards tied to real ecosystem activity - subscriptions, validator & storage nodes, upgrades.' },
    { icon: <Ic.star />, label: 'Points & Redemptions', desc: 'Accumulate DAG points per referral and activity. Redeem for GasCoin, credits, or premium features.' },
    { icon: <Ic.award />, label: 'Official Badge & Recognition', desc: 'Verified badge, featured profile on website (performance-based), and early feature previews.' },
    { icon: <Ic.globe />, label: 'Regional Leadership', desc: 'Represent your region, lead local community events, and shape adoption in your language.' },
    { icon: <Ic.users />, label: 'Private Ambassador Network', desc: 'Access an exclusive group of top ambassadors for collaboration, support, and opportunities.' },
  ];

  const faqs = [
    { q: 'Is this an investment program?', a: 'No. The Ambassador Program is a performance-based referral and marketing initiative tied to actual product usage. There is no investment element.' },
    { q: 'Is there a joining fee?', a: 'No. Applying and joining is completely free. There is no mandatory investment or payment required.' },
    { q: 'Are earnings guaranteed?', a: 'No. All rewards are based solely on verified ecosystem activity and product usage generated through your referral link.' },
    { q: 'Can I create content in my regional language?', a: 'Yes - regional language content is highly encouraged. We actively look for creators who can reach local communities in their native language.' },
    { q: 'How long does the review take?', a: 'Our team reviews applications personally within 5–10 business days. Shortlisted candidates are contacted directly via email.' },
    { q: 'What type of content should I create?', a: 'Product walkthroughs, AI tool demos, validator node guides, blockchain education, ecosystem overviews, use-case tutorials - anything that educates your audience.' },
  ];

  const CTABtn = ({ children, dark, onClick }) => (
    <button onClick={onClick} style={{
      background: dark ? '#111' : '#fff',
      color: dark ? '#fff' : '#111',
      border: dark ? 'none' : '1.5px solid #e0e0e0',
      borderRadius: '100px', padding: '13px 28px',
      fontSize: '14px', fontWeight: '700', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      letterSpacing: '-0.2px', transition: 'all 0.2s',
      boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.15)' : 'none',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = dark ? '0 8px 28px rgba(0,0,0,0.22)' : '0 4px 16px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = dark ? '0 4px 20px rgba(0,0,0,0.15)' : 'none'; }}
    >{children}</button>
  );

  return (
    <div style={{ background: '#fff', minHeight: '100vh', color: '#111', fontFamily: 'inherit' }}>

      {/* ═══ HERO ═════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '130px 24px 100px', background: '#fff' }}>
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.6 }} />
        {/* Gradient overlay top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to bottom, #fff, transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to top, #fff, transparent)' }} />

        {/* Decorative orbs */}
        <div className="amb-orb" style={{ position: 'absolute', top: '15%', left: '8%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="amb-orb" style={{ position: 'absolute', top: '25%', right: '6%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="amb-orb" style={{ position: 'absolute', bottom: '10%', left: '30%', width: '400px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Dot cluster top right */}
        <div style={{ position: 'absolute', top: '60px', right: '80px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', opacity: 0.25, pointerEvents: 'none' }}>
          {Array.from({ length: 36 }).map((_, i) => <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#111' }} />)}
        </div>
        <div style={{ position: 'absolute', bottom: '80px', left: '60px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', opacity: 0.15, pointerEvents: 'none' }}>
          {Array.from({ length: 25 }).map((_, i) => <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#111' }} />)}
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div className="amb-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #e8e8e8', borderRadius: '100px', padding: '7px 16px', marginBottom: '36px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }} />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#555', letterSpacing: '0.3px' }}>Applications Now Open</span>
            <span style={{ background: '#111', color: '#fff', borderRadius: '100px', padding: '2px 10px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>2026 Cohort</span>
          </div>

          {/* Headline - word by word */}
          <h1 style={{ fontSize: 'clamp(42px, 6vw, 76px)', fontWeight: '900', letterSpacing: '-3px', lineHeight: 1.0, margin: '0 0 28px', color: '#111' }}>
            {['Represent', 'the', 'Future', 'of'].map((w, i) => (
              <span key={i} className="amb-word" style={{ display: 'inline-block', marginRight: '0.28em', opacity: 0 }}>{w}</span>
            ))}
            <br />
            {['AI', '&', 'Blockchain'].map((w, i) => (
              <span key={i} className="amb-word" style={{
                display: 'inline-block', marginRight: '0.28em', opacity: 0,
                background: i === 1 ? 'none' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: i === 1 ? 'none' : 'text',
                WebkitTextFillColor: i === 1 ? '#111' : 'transparent',
                backgroundClip: i === 1 ? 'none' : 'text',
              }}>{w}</span>
            ))}
          </h1>

          <p className="amb-hero-sub" style={{ fontSize: '18px', color: '#666', lineHeight: 1.75, maxWidth: '580px', margin: '0 auto 44px', opacity: 0 }}>
            Join the official DAG Army Ambassador Program. Build your personal brand, earn performance rewards, and grow alongside a global AI-native blockchain ecosystem.
          </p>

          <div className="amb-hero-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', opacity: 0 }}>
            <CTABtn dark onClick={() => setModal(true)}>
              Apply Now - It&apos;s Free <Ic.arrow />
            </CTABtn>
            <CTABtn onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More <Ic.chevron />
            </CTABtn>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.3 }}>
          <div style={{ width: '1px', height: '40px', background: '#111', animation: 'ambScrollLine 1.8s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ═══ STATS ════════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
        <div className="amb-stats-row" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { n: 150, suf: '+', l: 'Active Ambassadors' },
            { n: 40, suf: '+', l: 'Countries Represented' },
            { n: 2, suf: 'M+', l: 'Combined Reach' },
            { n: 3, suf: '', l: 'Ecosystem Products' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '36px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid #eee' : 'none' }}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#111', letterSpacing: '-1.5px', lineHeight: 1 }}>
                <Counter end={s.n} suffix={s.suf} />
              </div>
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#999', fontWeight: '600', letterSpacing: '0.3px' }}>{s.l}</div>
              <div className="amb-stat-line" style={{ height: '2px', background: '#111', marginTop: '16px', transformOrigin: 'left', transform: 'scaleX(0)' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ABOUT ════════════════════════════════════════════ */}
      <section id="about-section" style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div className="amb-reveal">
            <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>The Ecosystem</p>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', fontWeight: '900', color: '#111', letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 20px' }}>
              Three products.<br />One unified vision.
            </h2>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.8, margin: '0 0 32px' }}>
              DAG Army is a global community building the infrastructure for a decentralized, AI-powered future. Ambassadors are the backbone of this movement.
            </p>
            <CTABtn dark onClick={() => setModal(true)}>Join the Movement <Ic.arrow /></CTABtn>
          </div>
          <div className="amb-grid amb-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'DAG Army', sub: 'Community-driven AI & Web3 movement', dot: '#3b82f6' },
              { label: 'DAGGPT', sub: 'Multi-module AI platform - one subscription, all tools', dot: '#8b5cf6' },
              { label: 'DAGChain', sub: 'AI-native Layer 1 blockchain infrastructure', dot: '#10b981' },
              { label: 'Node Ecosystem', sub: 'Validator & Storage nodes for decentralized compute', dot: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} className="amb-card" style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px 20px', border: '1px solid #f0f0f0', borderRadius: '14px',
                background: '#fff', transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#111' }}>{item.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888', lineHeight: 1.5 }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHO CAN APPLY ════════════════════════════════════ */}
      <section style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '120px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="amb-reveal" style={{ marginBottom: '64px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>Eligibility</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '900', color: '#111', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>Who Can Apply?</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#888', maxWidth: '360px', lineHeight: 1.7 }}>We look for passionate creators and community builders who can bring the AI &amp; Web3 story to life in their language.</p>
            </div>
          </div>

          <div className="amb-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {[
              { type: 'YouTubers', req: '1,000+ subscribers' },
              { type: 'Instagram Creators', req: '1,000+ followers' },
              { type: 'Facebook Creators', req: '1,000+ followers' },
              { type: 'AI Educators', req: 'Any platform' },
              { type: 'Blockchain Analysts', req: 'Any platform' },
              { type: 'Web3 Influencers', req: 'Any platform' },
              { type: 'Tech Community Leaders', req: 'Discord, Telegram' },
              { type: 'Regional Creators', req: 'All languages welcome' },
            ].map((t, i) => (
              <div key={i} className="amb-card" style={{
                background: '#fff', border: '1px solid #eee', borderRadius: '14px',
                padding: '20px 18px', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.borderColor = '#111'; e.currentTarget.querySelector('.ct').style.color = '#fff'; e.currentTarget.querySelector('.cr').style.color = 'rgba(255,255,255,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#eee'; e.currentTarget.querySelector('.ct').style.color = '#111'; e.currentTarget.querySelector('.cr').style.color = '#999'; }}
              >
                <p className="ct" style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '14px', color: '#111', transition: 'color 0.2s' }}>{t.type}</p>
                <p className="cr" style={{ margin: 0, fontSize: '12px', color: '#999', transition: 'color 0.2s' }}>{t.req}</p>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="amb-reveal" style={{ marginTop: '48px', background: '#fff', border: '1px solid #eee', borderRadius: '20px', padding: '40px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '28px' }}>
            {[
              { n: '01', t: 'Active Audience', d: 'You have a real, engaged audience on at least one platform.' },
              { n: '02', t: 'Consistent Creator', d: 'You publish content regularly and have an established presence.' },
              { n: '03', t: 'Explain Clearly', d: 'You can explain AI or blockchain concepts in simple, accessible language.' },
            ].map((r, i) => (
              <div key={i}>
                <p style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: '900', color: '#f0f0f0', letterSpacing: '-1px' }}>{r.n}</p>
                <p style={{ margin: '0 0 6px', fontWeight: '700', fontSize: '15px', color: '#111' }}>{r.t}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.7 }}>{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS ═════════════════════════════════════════ */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 24px' }}>
        <div className="amb-reveal" style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>What You Get</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '900', color: '#111', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>Ambassador Benefits</h2>
          </div>
          <CTABtn dark onClick={() => setModal(true)}>Apply Now <Ic.arrow /></CTABtn>
        </div>
        <div className="amb-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {benefits.map((b, i) => (
            <div key={i} className="amb-card" style={{
              padding: '28px', border: '1px solid #f0f0f0', borderRadius: '18px',
              background: '#fff', transition: 'all 0.25s', position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: '#111' }}>
                {b.icon}
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '800', color: '#111', letterSpacing: '-0.3px' }}>{b.label}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.7 }}>{b.desc}</p>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.3s' }} className="amb-underline" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TIERS ════════════════════════════════════════════ */}
      <section style={{ background: '#111', padding: '120px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="amb-reveal" style={{ marginBottom: '64px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#555' }}>Program Levels</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: '900', color: '#fff', letterSpacing: '-1.5px', margin: '0 0 16px' }}>Ambassador Tiers</h2>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>Grow through levels based on your reach and performance. Tiers are reviewed and upgraded periodically.</p>
          </div>
          <div className="amb-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {tiers.map((t, i) => (
              <div key={i} className="amb-card" style={{
                background: t.featured ? '#fff' : '#1a1a1a',
                border: t.featured ? 'none' : '1px solid #222',
                borderRadius: '20px', padding: '32px 28px',
                position: 'relative', transition: 'transform 0.25s',
                transform: t.featured ? 'translateY(-8px)' : 'none',
              }}>
                {t.featured && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff', borderRadius: '100px', padding: '4px 14px', fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Most Popular
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color }} />
                  <span style={{ fontSize: '18px', fontWeight: '900', color: t.featured ? '#111' : '#fff', letterSpacing: '-0.5px' }}>{t.name}</span>
                </div>
                <p style={{ margin: '0 0 24px', fontSize: '13px', color: t.featured ? '#888' : '#555' }}>{t.req}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {t.perks.map((p, j) => (
                    <div key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: t.featured ? '#f5f5f5' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: t.featured ? '#111' : '#555', marginTop: '1px' }}>
                        <Ic.check />
                      </div>
                      <span style={{ fontSize: '13px', color: t.featured ? '#444' : '#666', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setModal(true)} style={{
                  width: '100%', marginTop: '28px', background: t.featured ? '#111' : '#222',
                  color: t.featured ? '#fff' : '#666', border: t.featured ? 'none' : '1px solid #333',
                  borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: '700',
                  cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '-0.2px',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.featured ? '#333' : '#2a2a2a'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = t.featured ? '#111' : '#222'; e.currentTarget.style.color = t.featured ? '#fff' : '#666'; }}
                >
                  Apply for {t.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESPONSIBILITIES ═════════════════════════════════ */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
          <div className="amb-reveal">
            <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>Your Role</p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: '900', color: '#111', letterSpacing: '-1px', lineHeight: 1.15, margin: '0 0 24px' }}>What you&apos;ll do as an Ambassador</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                'Create educational content about DAGGPT and DAGChain',
                'Publish and distribute content on your platforms',
                'Use and share your unique referral link',
                'Introduce new users to the ecosystem',
                'Tag official community pages in your posts',
                'Support regional community growth',
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px 0', borderBottom: i < 5 ? '1px solid #f5f5f5' : 'none' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#ddd', width: '24px', flexShrink: 0, paddingTop: '2px' }}>0{i + 1}</span>
                  <span style={{ fontSize: '14px', color: '#444', lineHeight: 1.6 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="amb-reveal">
            <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>Content Ideas</p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: '900', color: '#111', letterSpacing: '-1px', lineHeight: 1.15, margin: '0 0 24px' }}>What to create</h2>
            <div className="amb-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                'Product walkthroughs', 'AI tool demos',
                'Validator node guides', 'Blockchain basics',
                'Use-case tutorials', 'Ecosystem overviews',
                'Live Q&A sessions', 'Community updates',
              ].map((c, i) => (
                <div key={i} className="amb-card" style={{
                  background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px',
                  padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#444',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#111'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.color = '#444'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
                >
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY JOIN - FULL WIDTH BANNER ═════════════════════ */}
      <section style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '120px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div className="amb-reveal">
            <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>The Opportunity</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: '900', color: '#111', letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 20px' }}>
              Early contributors benefit from early positioning.
            </h2>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.8, margin: '0 0 32px' }}>
              AI and blockchain are reshaping global infrastructure. As a DAG Army Ambassador, you grow alongside a Layer 1 network from day one.
            </p>
            <CTABtn dark onClick={() => setModal(true)}>Apply Now - Free <Ic.arrow /></CTABtn>
          </div>
          <div className="amb-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Build authority in AI + Web3',
              'Earn performance-based rewards',
              'Early access to ecosystem innovations',
              'Grow with an expanding Layer 1 network',
              'Become part of a long-term movement',
              'Expand your global network',
            ].map((r, i) => (
              <div key={i} className="amb-card" style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '16px 18px', background: '#fff', border: '1px solid #eee', borderRadius: '12px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                  <Ic.check />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ══════════════════════════════════════════════ */}
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '120px 24px' }}>
        <div className="amb-reveal" style={{ marginBottom: '56px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>FAQ</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: '900', color: '#111', letterSpacing: '-1.5px', margin: 0 }}>Frequently Asked Questions</h2>
        </div>
        <div className="amb-reveal">
          {faqs.map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ═══ COMPLIANCE ════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #f0f0f0', padding: '40px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#bbb', lineHeight: 1.9, margin: 0 }}>
            <strong style={{ color: '#999' }}>Compliance Notice:</strong> The DAG Army Ambassador Program is a referral-based marketing initiative promoting ecosystem products and services. It is not an investment scheme, does not guarantee income, and all rewards depend on verified product usage. Full Terms &amp; Conditions apply.
          </p>
        </div>
      </section>

      {/* ═══ FINAL CTA ════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px 100px', textAlign: 'center', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }} className="amb-reveal">
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '900', color: '#111', letterSpacing: '-1.5px', margin: '0 0 16px' }}>
            Ready to make an impact?
          </h2>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.75, margin: '0 0 36px' }}>
            Applications are reviewed personally by our team. Shortlisted candidates are contacted within 5–10 business days.
          </p>
          <CTABtn dark onClick={() => setModal(true)}>
            Submit Application <Ic.arrow />
          </CTABtn>
        </div>
      </section>

      <style>{`
        @keyframes ambScrollLine { 0% { transform: scaleY(0); transform-origin: top; opacity: 1; } 50% { transform: scaleY(1); transform-origin: top; opacity: 1; } 100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; } }
        @media (max-width: 768px) {
          .amb-two-col { grid-template-columns: 1fr !important; gap: 48px !important; }
          .amb-three-col { grid-template-columns: 1fr !important; }
          .amb-stats-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {modal && <ApplyModal onClose={() => setModal(false)} onSuccess={() => { setModal(false); setSuccess(true); }} />}
      {success && <SuccessModal onClose={() => setSuccess(false)} />}
    </div>
  );
}
