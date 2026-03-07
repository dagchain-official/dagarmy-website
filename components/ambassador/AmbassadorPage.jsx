"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/* ─── SVG Icons ─────────────────────────────────────────── */
const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const IconStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const IconGlobe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconAward = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
);
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

/* ─── FAQ Item ────────────────────────────────────────────── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #e2e8f0' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', padding: '20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', textAlign: 'left', gap: '16px',
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', lineHeight: '1.4' }}>{q}</span>
        <span style={{ flexShrink: 0, color: '#3b82f6', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
          <IconChevronDown />
        </span>
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '300px' : '0',
        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <p style={{ padding: '0 0 20px', margin: 0, color: '#475569', fontSize: '15px', lineHeight: '1.7' }}>{a}</p>
      </div>
    </div>
  );
}

/* ─── Tier Card ───────────────────────────────────────────── */
function TierCard({ tier, color, gradient, icon, followers, benefits, highlight }) {
  return (
    <div className="tier-card" style={{
      background: highlight ? gradient : '#fff',
      border: highlight ? 'none' : '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '32px 28px',
      position: 'relative',
      overflow: 'hidden',
      transform: highlight ? 'scale(1.04)' : 'scale(1)',
      boxShadow: highlight ? '0 20px 60px rgba(59,130,246,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      flex: '1',
      minWidth: '240px',
    }}>
      {highlight && (
        <div style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'rgba(255,255,255,0.2)', borderRadius: '100px',
          padding: '4px 12px', fontSize: '11px', fontWeight: '700',
          color: '#fff', letterSpacing: '0.5px', textTransform: 'uppercase',
        }}>Most Popular</div>
      )}
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px',
        background: highlight ? 'rgba(255,255,255,0.2)' : `${color}15`,
        color: highlight ? '#fff' : color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px',
      }}>{icon}</div>
      <h3 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: highlight ? '#fff' : '#0f172a' }}>{tier}</h3>
      <p style={{ margin: '0 0 20px', fontSize: '13px', color: highlight ? 'rgba(255,255,255,0.7)' : '#94a3b8', fontWeight: '500' }}>{followers}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {benefits.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: highlight ? 'rgba(255,255,255,0.8)' : color, marginTop: '1px', flexShrink: 0 }}><IconCheck /></span>
            <span style={{ fontSize: '14px', color: highlight ? 'rgba(255,255,255,0.85)' : '#475569', lineHeight: '1.5' }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Application Modal ───────────────────────────────────── */
function ApplicationModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    full_name: '', email: '', country: '', telegram: '',
    social_links: '', follower_count: '', content_niche: '', statement: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.country) {
      setError('Full name, email and country are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ambassador/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', color: '#0f172a',
    background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', backdropFilter: 'blur(4px)',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '580px',
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#fff' }}>Apply to Become an Ambassador</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Our team reviews all applications personally</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff', display: 'flex' }}>
            <IconClose />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="John Doe" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@email.com" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Country <span style={{ color: '#ef4444' }}>*</span></label>
              <input name="country" value={form.country} onChange={handleChange} placeholder="India" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Telegram / WhatsApp</label>
              <input name="telegram" value={form.telegram} onChange={handleChange} placeholder="@yourusername" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Social Media Links</label>
            <input name="social_links" value={form.social_links} onChange={handleChange} placeholder="YouTube, Instagram, Twitter, LinkedIn links" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Total Follower / Subscriber Count</label>
              <input name="follower_count" value={form.follower_count} onChange={handleChange} placeholder="e.g. 25,000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Content Niche</label>
              <input name="content_niche" value={form.content_niche} onChange={handleChange} placeholder="AI, Web3, Tech, Finance..." style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Why do you want to be a DAG Army Ambassador?</label>
            <textarea
              name="statement" value={form.statement} onChange={handleChange}
              placeholder="Tell us about yourself and why you'd be a great ambassador..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 14px', color: '#dc2626', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
              color: '#fff', border: 'none', borderRadius: '12px',
              padding: '14px', fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
            {!loading && <IconArrow />}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Success Modal ───────────────────────────────────────── */
function SuccessModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', padding: '48px 40px',
        textAlign: 'center', maxWidth: '440px', width: '100%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', color: '#fff',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ margin: '0 0 12px', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Application Submitted!</h2>
        <p style={{ margin: '0 0 8px', color: '#475569', fontSize: '15px', lineHeight: '1.6' }}>
          Thank you for applying to the DAG Army Ambassador Program. Our team will review your application and reach out to shortlisted candidates.
        </p>
        <p style={{ margin: '0 0 28px', color: '#94a3b8', fontSize: '13px' }}>Check your email for a confirmation.</p>
        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #1e3a5f, #3b82f6)', color: '#fff',
            border: 'none', borderRadius: '12px', padding: '13px 32px',
            fontSize: '15px', fontWeight: '700', cursor: 'pointer',
          }}
        >
          Back to Ambassador Page
        </button>
      </div>
    </div>
  );
}

/* ─── Counter ─────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = 16;
          const increment = target / (duration / step);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Main Component ──────────────────────────────────────── */
export default function AmbassadorPage() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const heroRef = useRef(null);
  const gsapLoaded = useRef(false);

  // GSAP Animations
  useEffect(() => {
    if (gsapLoaded.current) return;
    gsapLoaded.current = true;

    const loadGSAP = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        // Hero animation
        gsap.fromTo('.amb-hero-badge',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.2 }
        );
        gsap.fromTo('.amb-hero-title',
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 }
        );
        gsap.fromTo('.amb-hero-sub',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 }
        );
        gsap.fromTo('.amb-hero-btns',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.8 }
        );
        gsap.fromTo('.amb-hero-particles .particle',
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: 'back.out(1.7)', delay: 0.3 }
        );

        // Scroll-triggered section reveals
        gsap.utils.toArray('.amb-section-reveal').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            }
          );
        });

        // Stagger card reveals
        gsap.utils.toArray('.amb-stagger-group').forEach((group) => {
          const cards = group.querySelectorAll('.amb-stagger-item');
          gsap.fromTo(cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
              scrollTrigger: { trigger: group, start: 'top 80%', toggleActions: 'play none none none' }
            }
          );
        });

        // Floating particles in hero
        gsap.utils.toArray('.particle').forEach((p, i) => {
          gsap.to(p, {
            y: -20 - (i % 3) * 10,
            x: (i % 2 === 0 ? 1 : -1) * (10 + i * 3),
            duration: 3 + i * 0.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2,
          });
        });

      } catch (e) {
        console.warn('GSAP not available:', e);
      }
    };

    loadGSAP();
  }, []);

  const handleSuccess = () => {
    setShowModal(false);
    setShowSuccess(true);
  };

  const stats = [
    { value: 150, suffix: '+', label: 'Active Ambassadors' },
    { value: 40, suffix: '+', label: 'Countries Represented' },
    { value: 2, suffix: 'M+', label: 'Community Reach' },
    { value: 3, suffix: '', label: 'Ecosystem Products' },
  ];

  const benefits = [
    { icon: <IconZap />, color: '#f59e0b', title: 'Free DAGGPT Access', desc: 'All approved ambassadors receive complimentary access to DAGGPT\'s full multi-module AI system.' },
    { icon: <IconGlobe />, color: '#3b82f6', title: 'Referral Earnings', desc: 'Earn rewards from ecosystem activity — subscriptions, validator nodes, storage nodes and upgrades.' },
    { icon: <IconStar />, color: '#8b5cf6', title: 'Reward Points', desc: 'Accumulate points for every referral, signup and node participation. Redeem for GasCoin, credits and more.' },
    { icon: <IconAward />, color: '#10b981', title: 'Official Badge', desc: 'Get a verified Ambassador Badge, featured profile, early access and private ambassador group entry.' },
    { icon: <IconShield />, color: '#ef4444', title: 'Priority Support', desc: 'Dedicated ambassador support channel, early feature previews, and direct team access.' },
    { icon: <IconUsers />, color: '#06b6d4', title: 'Community Leadership', desc: 'Represent your region, lead local events, and shape the DAGArmy community from the ground up.' },
  ];

  const tiers = [
    {
      tier: 'Silver', followers: '1,000+ followers', color: '#64748b',
      gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
      icon: <IconStar />, highlight: false,
      benefits: ['Standard referral rewards', 'Free DAGGPT access', 'Official Ambassador Badge', 'Ambassador community access'],
    },
    {
      tier: 'Gold', followers: '50,000+ followers', color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
      icon: <IconStar />, highlight: true,
      benefits: ['Enhanced reward percentage', 'Performance bonuses', 'Priority support channel', 'Featured website profile', 'Early ecosystem access'],
    },
    {
      tier: 'Platinum', followers: '100,000+ followers', color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
      icon: <IconStar />, highlight: false,
      benefits: ['Custom partnership structure', 'Regional leadership role', 'Revenue-share agreements', 'Direct executive access', 'Co-branded content opportunities'],
    },
  ];

  const faqs = [
    { q: 'Is this an investment program?', a: 'No. The Ambassador Program is a performance-based referral and marketing initiative linked to actual product usage within the ecosystem. There is no investment element.' },
    { q: 'Is there any joining fee?', a: 'No. There is no mandatory investment or fee required to apply. The program is completely free to join for approved ambassadors.' },
    { q: 'Are earnings guaranteed?', a: 'No. Rewards are based solely on verified ecosystem activity and product usage generated through your referral link. There are no guaranteed income claims.' },
    { q: 'Can I create content in my local language?', a: 'Yes. Regional language content is highly encouraged to help expand global adoption. We actively seek ambassadors who can engage local communities in their native language.' },
    { q: 'How long does review take?', a: 'Our team typically reviews applications within 5–10 business days. Shortlisted candidates will be contacted directly via email.' },
    { q: 'What content should I create?', a: 'Product walkthroughs, AI tool demos, validator node explanations, blockchain education content, use-case tutorials — anything that educates your audience about DAGArmy, DAGGPT, or DAGChain.' },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'inherit' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div ref={heroRef} style={{
        background: 'linear-gradient(135deg, #020817 0%, #0f172a 40%, #1e3a5f 100%)',
        padding: '120px 24px 100px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Radial glow */}
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '500px', background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Floating particles */}
        <div className="amb-hero-particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[
            { top: '20%', left: '10%', size: 6, color: '#3b82f6' },
            { top: '60%', left: '5%', size: 4, color: '#8b5cf6' },
            { top: '30%', right: '8%', size: 8, color: '#06b6d4' },
            { top: '70%', right: '12%', size: 5, color: '#3b82f6' },
            { top: '15%', left: '30%', size: 3, color: '#f59e0b' },
            { top: '80%', left: '25%', size: 5, color: '#10b981' },
            { top: '45%', right: '30%', size: 4, color: '#8b5cf6' },
          ].map((p, i) => (
            <div key={i} className="particle" style={{
              position: 'absolute', top: p.top, left: p.left, right: p.right,
              width: p.size, height: p.size, borderRadius: '50%', background: p.color,
              opacity: 0.6, filter: 'blur(1px)',
            }} />
          ))}
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div className="amb-hero-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: '100px', padding: '7px 18px', marginBottom: '28px',
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6', animation: 'ambPulse 2s infinite' }} />
            <span style={{ fontSize: '13px', color: '#93c5fd', fontWeight: '600', letterSpacing: '0.5px' }}>Official Ambassador Program</span>
          </div>

          <h1 className="amb-hero-title" style={{ fontSize: 'clamp(38px, 5.5vw, 64px)', fontWeight: '900', color: '#fff', letterSpacing: '-2px', lineHeight: 1.05, margin: '0 0 24px' }}>
            Represent the Future of
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              AI &amp; Blockchain
            </span>
          </h1>

          <p className="amb-hero-sub" style={{
            fontSize: '18px', color: '#94a3b8', lineHeight: '1.75', margin: '0 0 40px',
            maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto',
          }}>
            Join the official Ambassador Program of DAG Army. Build your personal brand, earn performance rewards, and help grow the ecosystem powered by DAGGPT and DAGChain.
          </p>

          <div className="amb-hero-btns" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#fff', border: 'none', borderRadius: '12px',
                padding: '15px 32px', fontSize: '15px', fontWeight: '700',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(59,130,246,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.35)'; }}
            >
              Apply Now <IconArrow />
            </button>
            <a
              href="#about"
              style={{
                background: 'rgba(255,255,255,0.06)', color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px',
                padding: '15px 32px', fontSize: '15px', fontWeight: '600',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              Learn More <IconChevronDown />
            </a>
          </div>
        </div>

        <style>{`
          @keyframes ambPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        `}</style>
      </div>

      {/* ── STATS BAR ─────────────────────────────────────── */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ─────────────────────────────────────────── */}
      <div id="about" style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
        <div className="amb-section-reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>The Ecosystem</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px', margin: '0 0 16px' }}>About DAG Army</h2>
          <p style={{ color: '#475569', fontSize: '17px', lineHeight: '1.7', maxWidth: '640px', margin: '0 auto' }}>
            DAG Army is a global community focused on AI and blockchain education, innovation, and infrastructure. We are building a decentralized, AI-powered future — and ambassadors play a key role.
          </p>
        </div>

        <div className="amb-stagger-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[
            { name: 'DAG Army', desc: 'Community-driven AI & Web3 movement with a global reach', color: '#3b82f6', bg: '#eff6ff' },
            { name: 'DAGGPT', desc: 'Multi-module AI platform eliminating multiple subscription costs', color: '#8b5cf6', bg: '#f5f3ff' },
            { name: 'DAGChain', desc: 'AI-native Layer 1 blockchain infrastructure built for scale', color: '#10b981', bg: '#f0fdf4' },
            { name: 'Node Ecosystem', desc: 'Validator & Storage node network powering decentralized infrastructure', color: '#f59e0b', bg: '#fffbeb' },
          ].map((item, i) => (
            <div key={i} className="amb-stagger-item" style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px',
              padding: '24px', transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, marginBottom: '14px' }} />
              <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>{item.name}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHO CAN APPLY ─────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="amb-section-reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ display: 'inline-block', background: 'rgba(59,130,246,0.15)', color: '#93c5fd', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Eligibility</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', color: '#fff', letterSpacing: '-1px', margin: '0 0 16px' }}>Who Can Apply?</h2>
            <p style={{ color: '#94a3b8', fontSize: '17px', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto' }}>
              We are looking for passionate creators and community builders who can bring the AI &amp; Web3 story to life.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
            {/* Creator types */}
            <div className="amb-stagger-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                'YouTubers (1,000+ subscribers)',
                'Instagram Creators (1,000+ followers)',
                'Facebook Content Creators',
                'AI Educators',
                'Blockchain Analysts',
                'Web3 Influencers',
                'Tech Community Leaders',
                'Regional Language Creators',
              ].map((t, i) => (
                <div key={i} className="amb-stagger-item" style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <span style={{ color: '#60a5fa', flexShrink: 0 }}><IconCheck /></span>
                  <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500', lineHeight: '1.4' }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="amb-section-reveal" style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '32px',
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800', color: '#fff' }}>Minimum Requirements</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Active and engaged audience (any platform)',
                  'Consistent content creation track record',
                  'Ability to explain AI or blockchain concepts clearly',
                  'Strong community engagement metrics',
                  'Regional language creators highly encouraged',
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <IconCheck />
                    </div>
                    <span style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BENEFITS ──────────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
        <div className="amb-section-reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ display: 'inline-block', background: '#f0fdf4', color: '#16a34a', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>What You Get</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px', margin: '0 0 16px' }}>Ambassador Benefits</h2>
          <p style={{ color: '#475569', fontSize: '17px', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto' }}>
            Real rewards for real impact. Our ambassadors are valued partners in the ecosystem.
          </p>
        </div>
        <div className="amb-stagger-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {benefits.map((b, i) => (
            <div key={i} className="amb-stagger-item" style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${b.color}15`, color: b.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
              }}>{b.icon}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{b.title}</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TIERS ─────────────────────────────────────────── */}
      <div style={{ background: '#f1f5f9', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="amb-section-reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Tier System</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px', margin: '0 0 16px' }}>Ambassador Levels</h2>
            <p style={{ color: '#475569', fontSize: '17px', lineHeight: '1.7', maxWidth: '500px', margin: '0 auto' }}>
              Grow through the tiers as your reach and performance expand. Level upgrades are reviewed periodically.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch' }}>
            {tiers.map((t, i) => <TierCard key={i} {...t} />)}
          </div>
        </div>
      </div>

      {/* ── RESPONSIBILITIES ──────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
          <div className="amb-section-reveal">
            <span style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Your Role</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.8px', margin: '0 0 20px' }}>Role & Responsibilities</h2>
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
              As a DAG Army Ambassador, you create, educate, and grow. Your content helps communities understand the future of AI-native blockchain.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Create educational videos about DAGGPT and DAGChain',
                'Publish content on your social media platforms',
                'Use and share your unique referral link',
                'Tag official community pages in your content',
                'Introduce new users to the ecosystem',
                'Support community growth in your region',
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <IconCheck />
                  </div>
                  <span style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="amb-section-reveal">
            <span style={{ display: 'inline-block', background: '#f5f3ff', color: '#7c3aed', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Content Ideas</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.8px', margin: '0 0 20px' }}>Content Examples</h2>
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
              Not sure what to make? Here are proven content types that work well for our ecosystem.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                'Product walkthroughs',
                'AI tool demonstrations',
                'Validator node guides',
                'Blockchain basics',
                'Use-case tutorials',
                'Ecosystem overviews',
                'Live Q&A sessions',
                'Community updates',
              ].map((c, i) => (
                <div key={i} style={{
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
                  padding: '12px 14px', fontSize: '13px', fontWeight: '500', color: '#374151',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ color: '#8b5cf6' }}><IconCheck /></span>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY JOIN ──────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)',
        padding: '80px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="amb-section-reveal">
            <span style={{ display: 'inline-block', background: 'rgba(59,130,246,0.15)', color: '#93c5fd', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px' }}>The Opportunity</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: '900', color: '#fff', letterSpacing: '-1.5px', margin: '0 0 16px' }}>
              Why Join Now?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '17px', lineHeight: '1.75', marginBottom: '48px' }}>
              AI and blockchain are reshaping global infrastructure. Early contributors benefit from early positioning in a rapidly growing Layer 1 network.
            </p>
          </div>
          <div className="amb-stagger-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
            {[
              'Build authority in AI + Web3',
              'Earn performance-based rewards',
              'Early access to innovations',
              'Grow with a Layer 1 network',
              'Long-term technology movement',
              'Expand your global network',
            ].map((r, i) => (
              <div key={i} className="amb-stagger-item" style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '16px',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <span style={{ color: '#60a5fa', flexShrink: 0 }}><IconCheck /></span>
                <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>{r}</span>
              </div>
            ))}
          </div>
          <div className="amb-section-reveal">
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#fff', border: 'none', borderRadius: '14px',
                padding: '17px 40px', fontSize: '16px', fontWeight: '700',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(59,130,246,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.35)'; }}
            >
              Apply Now — It&apos;s Free <IconArrow />
            </button>
          </div>
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px' }}>
        <div className="amb-section-reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ display: 'inline-block', background: '#f0fdf4', color: '#16a34a', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>FAQs</span>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.8px', margin: 0 }}>Frequently Asked Questions</h2>
        </div>
        <div className="amb-section-reveal">
          {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </div>
      </div>

      {/* ── COMPLIANCE ────────────────────────────────────── */}
      <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '40px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.8', margin: 0 }}>
            <strong style={{ color: '#64748b' }}>Compliance Notice:</strong> The DAG Army Ambassador Program is a referral-based marketing initiative designed to promote ecosystem products and services. It is not an investment scheme. It does not guarantee income. Rewards depend on verified product usage and network participation. All commissions and incentives are subject to terms and compliance policies. Full Terms &amp; Conditions apply.
          </p>
        </div>
      </div>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="amb-section-reveal">
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px', margin: '0 0 16px' }}>
              Ready to Make an Impact?
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>
              Submit your application today. Our team reviews every application personally and will reach out to shortlisted candidates within 5–10 business days.
            </p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
                color: '#fff', border: 'none', borderRadius: '14px',
                padding: '16px 40px', fontSize: '16px', fontWeight: '700',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 8px 24px rgba(15,23,42,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,23,42,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.2)'; }}
            >
              Apply Now <IconArrow />
            </button>
          </div>
        </div>
      </div>

      {showModal && <ApplicationModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
}
