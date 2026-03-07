"use client";
import React, { useState, useEffect, useRef } from "react";

/* ── Minimal Icons ──────────────────────────────────────── */
const IArrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const ICheck = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IClose = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;

/* ── Apply Modal ────────────────────────────────────────── */
function ApplyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ full_name: '', email: '', country: '', telegram: '', social_links: '', follower_count: '', content_niche: '', statement: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

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

  const iStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', color: '#111', background: '#fafafa', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' };
  const lStyle = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#111', marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '28px 32px 22px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '10px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa' }}>Ambassador Program</p>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111', letterSpacing: '-0.5px' }}>Submit Your Application</h2>
          </div>
          <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555' }}><IClose /></button>
        </div>
        <form onSubmit={submit} style={{ overflowY: 'auto', padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div><label style={lStyle}>Full Name <span style={{ color: '#e00' }}>*</span></label><input value={form.full_name} onChange={set('full_name')} placeholder="Your name" style={iStyle} onFocus={e => e.target.style.borderColor = '#111'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} /></div>
            <div><label style={lStyle}>Email <span style={{ color: '#e00' }}>*</span></label><input type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" style={iStyle} onFocus={e => e.target.style.borderColor = '#111'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div><label style={lStyle}>Country <span style={{ color: '#e00' }}>*</span></label><input value={form.country} onChange={set('country')} placeholder="India, UAE..." style={iStyle} onFocus={e => e.target.style.borderColor = '#111'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} /></div>
            <div><label style={lStyle}>Telegram / WhatsApp</label><input value={form.telegram} onChange={set('telegram')} placeholder="@handle" style={iStyle} onFocus={e => e.target.style.borderColor = '#111'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} /></div>
          </div>
          <div><label style={lStyle}>Social Media Links</label><input value={form.social_links} onChange={set('social_links')} placeholder="YouTube, Instagram, Twitter, LinkedIn links" style={iStyle} onFocus={e => e.target.style.borderColor = '#111'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div><label style={lStyle}>Total Followers</label><input value={form.follower_count} onChange={set('follower_count')} placeholder="e.g. 25,000" style={iStyle} onFocus={e => e.target.style.borderColor = '#111'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} /></div>
            <div><label style={lStyle}>Content Niche</label><input value={form.content_niche} onChange={set('content_niche')} placeholder="AI, Web3, Finance..." style={iStyle} onFocus={e => e.target.style.borderColor = '#111'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} /></div>
          </div>
          <div><label style={lStyle}>Why do you want to be an Ambassador?</label><textarea value={form.statement} onChange={set('statement')} rows={4} placeholder="Tell us about yourself and your audience..." style={{ ...iStyle, resize: 'vertical', lineHeight: '1.7' }} onFocus={e => e.target.style.borderColor = '#111'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} /></div>
          {err && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '8px', padding: '11px 14px', color: '#dc2626', fontSize: '13px' }}>{err}</div>}
          <button type="submit" disabled={loading} style={{ background: loading ? '#ccc' : '#111', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '-0.2px' }}>
            {loading ? 'Submitting...' : <><span>Submit Application</span><IArrow /></>}
          </button>
          <p style={{ margin: 0, textAlign: 'center', fontSize: '11px', color: '#bbb' }}>Reviewed personally within 5–10 days.</p>
        </form>
      </div>
    </div>
  );
}

function SuccessModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '52px 44px', textAlign: 'center', maxWidth: '420px', width: '100%', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', color: '#fff' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: '800', color: '#111', letterSpacing: '-0.5px' }}>Application Received</h2>
        <p style={{ margin: '0 0 28px', color: '#777', fontSize: '14px', lineHeight: 1.7 }}>Thank you for applying. Our team will review your application and reach out to shortlisted candidates within 5–10 days.</p>
        <button onClick={onClose} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Back to Page</button>
      </div>
    </div>
  );
}

/* ── FAQ ─────────────────────────────────────────────────── */
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', background: 'none', border: 'none', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', gap: '16px', textAlign: 'left' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#111', lineHeight: 1.5 }}>{q}</span>
        <span style={{ color: '#111', transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none', display: 'flex', flexShrink: 0 }}><IChevron /></span>
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? '200px' : '0', transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
        <p style={{ margin: '0 0 20px', color: '#666', fontSize: '14px', lineHeight: 1.8 }}>{a}</p>
      </div>
    </div>
  );
}

/* ── Counter ─────────────────────────────────────────────── */
function Counter({ end, suffix = '' }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let c = 0; const step = end / 55;
        const t = setInterval(() => { c += step; if (c >= end) { setV(end); clearInterval(t); } else setV(Math.floor(c)); }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [end]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
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

        /* ─ Scene 1: Hero ─ */
        const heroTl = gsap.timeline({ delay: 0.1 });
        heroTl
          .fromTo('.s1-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
          .fromTo('.s1-word', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.05 }, '-=0.3')
          .fromTo('.s1-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
          .fromTo('.s1-btns', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
          .fromTo('.s1-panel', { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, '-=0.5');

        /* Floating panels */
        document.querySelectorAll('.s1-panel').forEach((el, i) => {
          gsap.to(el, { y: i % 2 === 0 ? -10 : 10, duration: 3.5 + i * 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.4 });
        });

        /* Hero scroll parallax — headline scales down */
        gsap.to('.s1-headline', {
          scale: 0.82, y: -60, opacity: 0.3,
          scrollTrigger: { trigger: '#scene1', start: 'top top', end: 'bottom top', scrub: 1 },
        });
        gsap.to('.s1-panels-wrap', {
          y: -80, opacity: 0,
          scrollTrigger: { trigger: '#scene1', start: 'top top', end: 'bottom top', scrub: 1.2 },
        });

        /* ─ Scene 2: Ecosystem ─ */
        gsap.fromTo('.s2-label', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '#scene2', start: 'top 80%' } });
        gsap.fromTo('.s2-pillar', { opacity: 0, y: 50, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.14, scrollTrigger: { trigger: '.s2-pillars', start: 'top 80%' } });
        gsap.fromTo('.s2-line', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: '.s2-pillars', start: 'top 75%' } });
        gsap.fromTo('.s2-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.s2-desc', start: 'top 85%' } });

        /* ─ Scene 3: Creators ─ */
        gsap.fromTo('.s3-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '#scene3', start: 'top 75%' } });
        gsap.fromTo('.s3-tile', { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: '.s3-grid', start: 'top 80%' } });
        gsap.fromTo('.s3-req', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.s3-reqs', start: 'top 82%' } });

        /* ─ Scene 4: Journey Timeline ─ */
        gsap.fromTo('.s4-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '#scene4', start: 'top 75%' } });
        gsap.fromTo('.s4-line-fill', { scaleY: 0 }, { scaleY: 1, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: '.s4-timeline', start: 'top 80%', end: 'bottom 60%', scrub: 1 } });
        document.querySelectorAll('.s4-step-left').forEach(el => {
          gsap.fromTo(el, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
        });
        document.querySelectorAll('.s4-step-right').forEach(el => {
          gsap.fromTo(el, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
        });

        /* ─ Scene 5: Benefits ─ */
        gsap.fromTo('.s5-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '#scene5', start: 'top 75%' } });
        gsap.fromTo('.s5-card', { opacity: 0, y: 40, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.s5-grid', start: 'top 80%' } });

        /* ─ Scene 6: Tiers ─ */
        gsap.fromTo('.s6-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '#scene6', start: 'top 75%' } });
        gsap.fromTo('.s6-tier', { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: '.s6-tiers', start: 'top 80%' },
        });

        /* ─ Scene 7: Final CTA ─ */
        const s7tl = gsap.timeline({ scrollTrigger: { trigger: '#scene7', start: 'top 70%' } });
        s7tl
          .fromTo('.s7-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
          .fromTo('.s7-headline', { opacity: 0, y: 40, letterSpacing: '4px' }, { opacity: 1, y: 0, letterSpacing: '-2px', duration: 1.1, ease: 'power3.out' }, '-=0.2')
          .fromTo('.s7-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
          .fromTo('.s7-btn', { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)', stagger: 0.12 }, '-=0.3');

      } catch (e) { /* gsap unavailable */ }
    })();
  }, []);

  /* ── Data ──────────────────────────────────────────────── */
  const creators = [
    { t: 'YouTubers', r: '1,000+ subscribers' },
    { t: 'Instagram Creators', r: '1,000+ followers' },
    { t: 'Facebook Creators', r: '1,000+ followers' },
    { t: 'AI Educators', r: 'Any platform' },
    { t: 'Blockchain Analysts', r: 'Any platform' },
    { t: 'Web3 Influencers', r: 'Any platform' },
    { t: 'Tech Community Leaders', r: 'Discord, Telegram' },
    { t: 'Regional Language Creators', r: 'All languages welcome' },
  ];

  const journeySteps = [
    { n: '01', title: 'Create Content', desc: 'Produce educational videos and posts about DAGGPT and DAGChain for your audience.' },
    { n: '02', title: 'Share Your Link', desc: 'Use and distribute your unique referral link across all your platforms.' },
    { n: '03', title: 'Tag & Engage', desc: 'Tag official DAGArmy community pages and engage with new members.' },
    { n: '04', title: 'Introduce Users', desc: 'Onboard new users into the ecosystem — subscriptions, nodes, and community.' },
    { n: '05', title: 'Build Regional Reach', desc: 'Lead awareness in your language and region, becoming a local ecosystem voice.' },
  ];

  const benefits = [
    { title: 'Free DAGGPT Access', desc: 'All approved ambassadors receive full complimentary access to DAGGPT\'s multi-module AI system — eliminating the need for multiple AI subscriptions.', accent: '#3b82f6' },
    { title: 'Referral Earnings', desc: 'Earn rewards tied to real ecosystem activity — subscriptions, validator nodes, storage nodes, and ecosystem upgrades generated through your referral link.', accent: '#8b5cf6' },
    { title: 'Reward Points', desc: 'Accumulate DAG points for every referral, signup, and ecosystem activity. Redeem for GasCoin, DAGGPT credits, or premium feature access.', accent: '#10b981' },
    { title: 'Official Recognition', desc: 'Receive a verified Ambassador Badge, a featured profile on the website (performance-based), early feature previews, and private ambassador group access.', accent: '#f59e0b' },
    { title: 'Priority Support', desc: 'Dedicated ambassador support channel, direct team access, and first look at ecosystem innovations before public launch.', accent: '#ef4444' },
    { title: 'Regional Leadership', desc: 'Represent your region, lead local events and community initiatives, and shape DAGArmy\'s growth in your local language.', accent: '#06b6d4' },
  ];

  const tiers = [
    { name: 'Silver', req: '1,000+ followers', color: '#6b7280', border: '#e5e7eb', perks: ['Standard referral rewards', 'Free DAGGPT access', 'Official Ambassador Badge', 'Private community access'] },
    { name: 'Gold', req: '50,000+ followers', color: '#d97706', border: '#fde68a', perks: ['Enhanced reward rate', 'Performance bonuses', 'Featured website profile', 'Priority support', 'Early ecosystem access'], featured: true },
    { name: 'Platinum', req: '100,000+ followers', color: '#111', border: '#111', perks: ['Custom partnership terms', 'Regional leadership role', 'Revenue-share agreements', 'Direct executive access', 'Co-branded campaigns'] },
  ];

  const faqs = [
    { q: 'Is this an investment program?', a: 'No. It is a performance-based referral and marketing initiative linked to actual product usage. There is no investment element.' },
    { q: 'Is there a joining fee?', a: 'No. Applying and joining is completely free. There is no mandatory payment or investment required.' },
    { q: 'Are earnings guaranteed?', a: 'No. All rewards are based solely on verified ecosystem activity and product usage generated through your referral link.' },
    { q: 'Can I create content in my regional language?', a: 'Yes. Regional content is highly encouraged. We actively look for creators who engage local communities in their native language.' },
    { q: 'How long does the review take?', a: 'Our team reviews applications personally within 5–10 business days. Shortlisted candidates are contacted via email.' },
    { q: 'What content should I create?', a: 'Product walkthroughs, AI tool demos, node guides, blockchain education, ecosystem overviews, use-case tutorials — anything that educates your audience.' },
  ];

  /* ── Shared Styles ─────────────────────────────────────── */
  const sectionPad = { padding: '130px 24px' };
  const maxW = (w = 1100) => ({ maxWidth: w, margin: '0 auto' });
  const eyebrow = { margin: '0 0 14px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa' };
  const h2Style = { fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '900', color: '#111', letterSpacing: '-2px', lineHeight: 1.05, margin: 0 };

  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: 'inherit', overflowX: 'hidden' }}>

      {/* ══ SCENE 1 — THE INVITATION ══════════════════════════ */}
      <section id="scene1" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#fff', padding: '120px 24px 100px' }}>
        {/* Gradient mesh background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 50%, rgba(139,92,246,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 20% 80%, rgba(16,185,129,0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        {/* Dot pattern corners */}
        <div style={{ position: 'absolute', top: '80px', right: '80px', display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '7px', opacity: 0.15, pointerEvents: 'none' }}>
          {Array.from({ length: 48 }).map((_, i) => <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#111' }} />)}
        </div>
        <div style={{ position: 'absolute', bottom: '80px', left: '60px', display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '7px', opacity: 0.1, pointerEvents: 'none' }}>
          {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#111' }} />)}
        </div>

        <div style={{ ...maxW(1200), width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Left — Copy */}
          <div>
            <div className="s1-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #eee', borderRadius: '100px', padding: '6px 14px', marginBottom: '32px', opacity: 0 }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#555', letterSpacing: '0.5px' }}>2026 Cohort — Applications Open</span>
            </div>

            <div className="s1-headline" style={{ transformOrigin: 'left center' }}>
              <h1 style={{ fontSize: 'clamp(44px, 5.5vw, 72px)', fontWeight: '900', letterSpacing: '-3px', lineHeight: 1.0, margin: '0 0 24px', color: '#111' }}>
                {['Become', 'a'].map((w, i) => (
                  <span key={i} className="s1-word" style={{ display: 'inline-block', marginRight: '0.25em', opacity: 0 }}>{w}</span>
                ))}
                <br />
                {['DAG', 'Army'].map((w, i) => (
                  <span key={i} className="s1-word" style={{ display: 'inline-block', marginRight: '0.25em', opacity: 0 }}>{w}</span>
                ))}
                <br />
                <span className="s1-word" style={{ display: 'inline-block', opacity: 0, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Ambassador</span>
              </h1>
            </div>

            <p className="s1-sub" style={{ fontSize: '18px', color: '#666', lineHeight: 1.75, maxWidth: '460px', margin: '0 0 40px', opacity: 0 }}>
              Represent the future of AI-native blockchain. Build your brand, earn real rewards, and grow alongside a global ecosystem powered by DAGGPT and DAGChain.
            </p>

            <div className="s1-btns" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', opacity: 0 }}>
              <button onClick={() => setModal(true)} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '100px', padding: '14px 28px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.25s', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.22)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}>
                Apply Now <IArrow />
              </button>
              <button onClick={() => document.getElementById('scene2')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', color: '#111', border: '1.5px solid #e0e0e0', borderRadius: '100px', padding: '14px 28px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = '#f9f9f9'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = 'transparent'; }}>
                Explore Program <IChevron />
              </button>
            </div>
          </div>

          {/* Right — Floating Panels */}
          <div className="s1-panels-wrap" style={{ position: 'relative', height: '440px' }}>
            {[
              { label: 'DAGGPT', sub: 'Multi-module AI Platform', top: '0%', left: '10%', accent: '#3b82f6', delay: 0 },
              { label: 'DAGChain', sub: 'AI-Native Layer 1 Blockchain', top: '30%', left: '40%', accent: '#8b5cf6', delay: 1 },
              { label: 'Node Network', sub: 'Validator & Storage Infrastructure', top: '62%', left: '5%', accent: '#10b981', delay: 2 },
            ].map((p, i) => (
              <div key={i} className="s1-panel" style={{
                position: 'absolute', top: p.top, left: p.left,
                background: '#fff', border: '1px solid #f0f0f0', borderRadius: '18px',
                padding: '20px 22px', opacity: 0,
                boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
                minWidth: '210px', transition: 'box-shadow 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 56px rgba(0,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.07)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${p.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.accent }} />
                  </div>
                  <span style={{ fontWeight: '800', fontSize: '14px', color: '#111', letterSpacing: '-0.3px' }}>{p.label}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#888', lineHeight: 1.5 }}>{p.sub}</p>
                <div style={{ marginTop: '12px', height: '2px', borderRadius: '2px', background: `linear-gradient(to right, ${p.accent}, transparent)` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.3 }}>
          <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, transparent, #111)', animation: 'scrollCue 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ══ SCENE 2 — THE ECOSYSTEM ═══════════════════════════ */}
      <section id="scene2" style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', ...sectionPad }}>
        <div style={maxW()}>
          <div className="s2-label" style={{ marginBottom: '72px', textAlign: 'center' }}>
            <p style={eyebrow}>The Ecosystem</p>
            <h2 style={h2Style}>Three pillars.<br />One movement.</h2>
          </div>

          <div className="s2-pillars" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', position: 'relative' }}>
            {/* Connecting line */}
            <div className="s2-line" style={{ position: 'absolute', top: '50%', left: '16.6%', right: '16.6%', height: '1px', background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #10b981)', transformOrigin: 'left', zIndex: 0 }} />
            {[
              { name: 'DAG Army', desc: 'A global community-driven AI & Web3 movement shaping the decentralized future.', color: '#3b82f6', idx: '01' },
              { name: 'DAGGPT', desc: 'A multi-module AI platform — one subscription replacing multiple AI tools simultaneously.', color: '#8b5cf6', idx: '02' },
              { name: 'DAGChain', desc: 'An AI-native Layer 1 blockchain — the infrastructure that powers the entire ecosystem.', color: '#10b981', idx: '03' },
            ].map((p, i) => (
              <div key={i} className="s2-pillar" style={{
                background: '#fff', border: '1px solid #eee', borderRadius: '20px', padding: '36px 28px',
                position: 'relative', zIndex: 1, textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 56px rgba(0,0,0,0.08), 0 0 0 1px ${p.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: `${p.color}10`, border: `1px solid ${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: p.color }} />
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc' }}>{p.idx}</p>
                <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '800', color: '#111', letterSpacing: '-0.5px' }}>{p.name}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.75 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <p className="s2-desc" style={{ textAlign: 'center', marginTop: '48px', fontSize: '15px', color: '#aaa', lineHeight: 1.7 }}>
            Ambassadors sit at the intersection — representing all three pillars to the world.
          </p>
        </div>
      </section>

      {/* Stats */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ ...maxW(800), display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderLeft: '1px solid #f0f0f0' }}>
          {[{ n: 150, s: '+', l: 'Active Ambassadors' }, { n: 40, s: '+', l: 'Countries' }, { n: 2, s: 'M+', l: 'Combined Reach' }, { n: 3, s: '', l: 'Ecosystem Products' }].map((s, i) => (
            <div key={i} style={{ padding: '36px 20px', textAlign: 'center', borderRight: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: '34px', fontWeight: '900', color: '#111', letterSpacing: '-1.5px', lineHeight: 1 }}><Counter end={s.n} suffix={s.s} /></div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#bbb', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SCENE 3 — WHO THIS IS FOR ═════════════════════════ */}
      <section id="scene3" style={sectionPad}>
        <div style={maxW()}>
          <div className="s3-header" style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <p style={eyebrow}>Who Can Apply</p>
              <h2 style={h2Style}>Built for creators<br />and builders.</h2>
            </div>
            <p style={{ margin: 0, maxWidth: '320px', fontSize: '14px', color: '#888', lineHeight: 1.8 }}>We look for passionate creators and community builders who can bring the AI &amp; Web3 story to life in their language and region.</p>
          </div>

          <div className="s3-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '48px' }}>
            {creators.map((c, i) => (
              <div key={i} className="s3-tile" style={{
                background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '16px',
                padding: '22px 20px', cursor: 'default', transition: 'all 0.25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; e.currentTarget.querySelector('p.ct').style.color = '#fff'; e.currentTarget.querySelector('p.cr').style.color = 'rgba(255,255,255,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.querySelector('p.ct').style.color = '#111'; e.currentTarget.querySelector('p.cr').style.color = '#aaa'; }}
              >
                <p className="ct" style={{ margin: '0 0 5px', fontWeight: '700', fontSize: '14px', color: '#111', letterSpacing: '-0.2px', transition: 'color 0.2s' }}>{c.t}</p>
                <p className="cr" style={{ margin: 0, fontSize: '12px', color: '#aaa', transition: 'color 0.2s' }}>{c.r}</p>
              </div>
            ))}
          </div>

          <div className="s3-reqs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', border: '1px solid #f0f0f0', borderRadius: '20px', overflow: 'hidden' }}>
            {[
              { n: '01', t: 'Active Audience', d: 'An engaged following on at least one platform — size matters less than engagement quality.' },
              { n: '02', t: 'Consistent Creator', d: 'A track record of publishing content regularly with an established community presence.' },
              { n: '03', t: 'Clear Communicator', d: 'Ability to explain AI or blockchain concepts in accessible, simple, engaging language.' },
            ].map((r, i) => (
              <div key={i} className="s3-req" style={{ padding: '32px', borderRight: i < 2 ? '1px solid #f0f0f0' : 'none', background: '#fff', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <p style={{ margin: '0 0 12px', fontSize: '28px', fontWeight: '900', color: '#f0f0f0', letterSpacing: '-1px' }}>{r.n}</p>
                <p style={{ margin: '0 0 8px', fontWeight: '700', fontSize: '15px', color: '#111' }}>{r.t}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.75 }}>{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SCENE 4 — THE AMBASSADOR JOURNEY ═════════════════ */}
      <section id="scene4" style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', ...sectionPad }}>
        <div style={maxW(800)}>
          <div className="s4-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <p style={eyebrow}>Your Role</p>
            <h2 style={h2Style}>The Ambassador Journey</h2>
          </div>

          <div className="s4-timeline" style={{ position: 'relative' }}>
            {/* Center line */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: '#eee', transform: 'translateX(-50%)' }} />
            <div className="s4-line-fill" style={{ position: 'absolute', left: '50%', top: 0, width: '1px', background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6, #10b981)', transform: 'translateX(-50%)', transformOrigin: 'top', height: '100%' }} />

            {journeySteps.map((s, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', marginBottom: i < 4 ? '48px' : '0', position: 'relative' }}>
                  {/* Center dot */}
                  <div style={{ position: 'absolute', left: '50%', top: '28px', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#fff', border: '2px solid #ddd', zIndex: 2 }} />
                  <div className={isLeft ? 's4-step-left' : 's4-step-right'} style={{ width: '44%', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '24px', transition: 'box-shadow 0.25s, transform 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = isLeft ? 'translateX(-4px)' : 'translateX(4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc' }}>{s.n}</p>
                    <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '800', color: '#111', letterSpacing: '-0.4px' }}>{s.title}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ SCENE 5 — THE REWARDS ════════════════════════════ */}
      <section id="scene5" style={sectionPad}>
        <div style={maxW()}>
          <div className="s5-header" style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <p style={eyebrow}>Ambassador Benefits</p>
              <h2 style={h2Style}>Real rewards.<br />Real impact.</h2>
            </div>
            <button onClick={() => setModal(true)} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '100px', padding: '13px 24px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              Apply Now <IArrow />
            </button>
          </div>

          <div className="s5-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {benefits.map((b, i) => (
              <div key={i} className="s5-card" style={{
                background: '#fff', border: '1px solid #f0f0f0', borderRadius: '20px',
                padding: '32px 28px', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 56px rgba(0,0,0,0.08), inset 0 0 0 1px ${b.accent}30`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: b.accent, opacity: 0.6 }} />
                <h3 style={{ margin: '0 0 12px', fontSize: '17px', fontWeight: '800', color: '#111', letterSpacing: '-0.4px', lineHeight: 1.3 }}>{b.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#777', lineHeight: 1.8 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SCENE 6 — AMBASSADOR TIERS ════════════════════════ */}
      <section id="scene6" style={{ background: '#0c0c0c', ...sectionPad }}>
        <div style={maxW()}>
          <div className="s6-header" style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ ...eyebrow, color: '#444' }}>Program Levels</p>
            <h2 style={{ ...h2Style, color: '#fff' }}>Ambassador Tiers</h2>
            <p style={{ margin: '16px auto 0', maxWidth: '440px', fontSize: '15px', color: '#555', lineHeight: 1.75 }}>Grow through levels as your reach and performance expand. Reviewed and upgraded periodically.</p>
          </div>

          <div className="s6-tiers" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'end' }}>
            {tiers.map((t, i) => (
              <div key={i} className="s6-tier" style={{
                background: t.featured ? '#fff' : '#161616',
                border: `1px solid ${t.featured ? 'transparent' : '#222'}`,
                borderRadius: '22px', padding: t.featured ? '40px 32px' : '32px 28px',
                position: 'relative', transform: t.featured ? 'translateY(-12px)' : 'none',
                boxShadow: t.featured ? '0 24px 80px rgba(0,0,0,0.35)' : 'none',
                transition: 'transform 0.3s',
              }}>
                {t.featured && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff', borderRadius: '100px', padding: '5px 16px', fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap', border: '1px solid #333' }}>
                    Most Popular
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color }} />
                  <span style={{ fontSize: '20px', fontWeight: '900', color: t.featured ? '#111' : '#fff', letterSpacing: '-0.5px' }}>{t.name}</span>
                </div>
                <p style={{ margin: '0 0 24px', fontSize: '13px', color: t.featured ? '#aaa' : '#444' }}>{t.req}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  {t.perks.map((p, j) => (
                    <div key={j} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: t.featured ? '#f0f0f0' : '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: t.featured ? '#111' : '#444' }}>
                        <ICheck />
                      </div>
                      <span style={{ fontSize: '13px', color: t.featured ? '#444' : '#555', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setModal(true)} style={{
                  width: '100%', background: t.featured ? '#111' : '#1e1e1e',
                  color: t.featured ? '#fff' : '#555', border: t.featured ? 'none' : '1px solid #2a2a2a',
                  borderRadius: '12px', padding: '13px', fontSize: '13px', fontWeight: '700',
                  cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '-0.2px',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.featured ? '#333' : '#252525'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = t.featured ? '#111' : '#1e1e1e'; e.currentTarget.style.color = t.featured ? '#fff' : '#555'; }}
                >
                  Apply for {t.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════ */}
      <section style={sectionPad}>
        <div style={maxW(700)}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={eyebrow}>FAQ</p>
            <h2 style={{ ...h2Style, fontSize: 'clamp(28px, 3.5vw, 44px)' }}>Common Questions</h2>
          </div>
          {faqs.map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* Compliance */}
      <div style={{ borderTop: '1px solid #f8f8f8', padding: '32px 24px' }}>
        <p style={{ ...maxW(720), margin: '0 auto', fontSize: '11px', color: '#ccc', lineHeight: 1.9, textAlign: 'center' }}>
          <strong style={{ color: '#bbb' }}>Compliance Notice:</strong> The DAG Army Ambassador Program is a referral-based marketing initiative. It is not an investment scheme, does not guarantee income, and all rewards depend on verified product usage. Full Terms &amp; Conditions apply.
        </p>
      </div>

      {/* ══ SCENE 7 — THE CALL TO JOIN ════════════════════════ */}
      <section id="scene7" style={{ position: 'relative', overflow: 'hidden', padding: '160px 24px', textAlign: 'center', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        {/* Animated gradient wave */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 80% at 50% 100%, rgba(59,130,246,0.04) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 20% 50%, rgba(139,92,246,0.03) 0%, transparent 60%)', animation: 's7Wave 8s ease-in-out infinite alternate', pointerEvents: 'none' }} />
        <div style={maxW(620)}>
          <p className="s7-tag" style={{ ...eyebrow, textAlign: 'center', opacity: 0 }}>Join the Movement</p>
          <h2 className="s7-headline" style={{ ...h2Style, fontSize: 'clamp(40px, 5.5vw, 72px)', margin: '0 0 24px', opacity: 0 }}>
            Join the DAG Army<br />Ambassador Program
          </h2>
          <p className="s7-sub" style={{ fontSize: '18px', color: '#888', lineHeight: 1.75, margin: '0 0 48px', opacity: 0 }}>
            Early contributors benefit from early positioning. Be part of the infrastructure shift combining AI and blockchain.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="s7-btn" onClick={() => setModal(true)} style={{
              background: '#111', color: '#fff', border: 'none', borderRadius: '100px',
              padding: '16px 36px', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px', opacity: 0,
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)', transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.22)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)'; }}
            >
              Apply Now — It&apos;s Free <IArrow />
            </button>
            <a className="s7-btn" href="mailto:hr@dagchain.network?subject=Ambassador Program Inquiry" style={{
              background: 'transparent', color: '#111', border: '1.5px solid #e0e0e0',
              borderRadius: '100px', padding: '16px 36px', fontSize: '15px', fontWeight: '600',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
              textDecoration: 'none', opacity: 0, transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = '#f9f9f9'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = 'transparent'; }}
            >
              Contact the Team
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollCue {
          0% { transform: scaleY(0); transform-origin: top; opacity: 1; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }
        @keyframes s7Wave {
          0% { transform: scale(1) translateY(0px); }
          100% { transform: scale(1.05) translateY(-10px); }
        }
        @media (max-width: 900px) {
          #scene1 > div { grid-template-columns: 1fr !important; }
          .s1-panels-wrap { display: none !important; }
          .s2-pillars { grid-template-columns: 1fr !important; }
          .s3-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .s3-reqs { grid-template-columns: 1fr !important; }
          .s3-reqs > div { border-right: none !important; border-bottom: 1px solid #f0f0f0 !important; }
          .s5-grid { grid-template-columns: 1fr !important; }
          .s6-tiers { grid-template-columns: 1fr !important; }
          .s6-tiers > div { transform: none !important; }
        }
      `}</style>

      {modal && <ApplyModal onClose={() => setModal(false)} onSuccess={() => { setModal(false); setSuccess(true); }} />}
      {success && <SuccessModal onClose={() => setSuccess(false)} />}
    </div>
  );
}
