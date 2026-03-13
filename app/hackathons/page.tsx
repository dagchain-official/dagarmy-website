"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";

export default function HackathonComingSoon() {
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const nm = {
    bg: '#ffffff',
    shadow: '6px 6px 16px rgba(0,0,0,0.09), -4px -4px 12px rgba(255,255,255,0.9)',
    shadowSm: '4px 4px 10px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.9)',
    shadowInset: 'inset 3px 3px 8px rgba(0,0,0,0.07), inset -2px -2px 6px rgba(255,255,255,0.9)',
  };

  const tabs = [
    {
      title: 'What Participants Will Build',
      items: ['AI-driven tools and workflows', 'Full-stack systems and applications', 'Automation agents', 'Blockchain-backed verification or utility layers', 'Data dashboards and analytical systems'],
    },
    {
      title: 'How It Works',
      items: ['Clearly defined problem statements', 'Individual or team participation', 'Time-bound execution with checkpoints', 'Mentorship support during the hackathon', 'Evaluation based on Logic, Architecture & Practical usefulness'],
    },
    {
      title: 'Who Should Participate',
      items: ['Students and early-stage developers', 'Builders looking to test real skills', 'Professionals exploring new domains', 'Teams validating technical ideas'],
    },
    {
      title: 'Outcomes',
      items: ['Real project artifacts', 'Public proof of work', 'Feedback from experienced reviewers', 'Potential pathway into DAGARMY programs'],
    },
  ];

  const socials = [
    { href: 'https://www.facebook.com/profile.php?id=61587859905614', label: 'Facebook', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
    { href: 'https://x.com/dagarmy_network', label: 'X', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
    { href: 'https://www.instagram.com/dagarmy.network/', label: 'Instagram', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
    { href: 'https://www.linkedin.com/company/dag-army', label: 'LinkedIn', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
    { href: 'https://www.youtube.com/channel/UCmDPRCQf8-SvEf5OBLqHRFQ', label: 'YouTube', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg> },
    { href: 'https://www.tiktok.com/@dagarmy_dagchain', label: 'TikTok', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg> },
  ];

  return (
    <>
      <Header2 />
      <div style={{ minHeight: '100vh', background: nm.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ maxWidth: '660px', width: '100%' }}>

          {/* Main Card */}
          <div style={{ background: nm.bg, borderRadius: '28px', boxShadow: nm.shadow, padding: '52px 44px', textAlign: 'center' }}>
            {/* Logo */}
            <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: nm.bg, boxShadow: nm.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <Image src="/images/logo/logo.png" alt="DAGARMY" width={36} height={36} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', fontFamily: 'Nasalization, sans-serif' }}>DAGARMY</span>
            </div>

            {/* Label */}
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}>WE'RE STILL</p>

            {/* Heading */}
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '800', color: '#0f172a', marginBottom: '18px', lineHeight: '1.2' }}>
              Preparing Our <span style={{ fontFamily: 'Nasalization, sans-serif' }}>Hackathon</span> Program.
            </h1>

            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.7', margin: '0 auto 36px', maxWidth: '520px' }}>
              A <strong style={{ color: '#0f172a' }}>problem-first</strong> hackathon series focused on building real solutions, not demo projects.
            </p>

            {/* Why section */}
            <div style={{ background: nm.bg, borderRadius: '16px', boxShadow: nm.shadowSm, padding: '24px', textAlign: 'left', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Why DAGARMY Hackathons</h2>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.7', marginBottom: '10px' }}>
                Most hackathons reward speed and surface-level ideas. DAGARMY hackathons are designed to:
              </p>
              {['Encourage deep thinking', 'Solve realistic problems', 'Simulate real-world constraints'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontSize: '13px', color: '#475569' }}>{item}</span>
                </div>
              ))}
              <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: '700', marginTop: '12px', marginBottom: 0 }}>Output matters more than presentation.</p>
            </div>

            {/* Rotating tab card */}
            <div style={{ background: nm.bg, borderRadius: '16px', boxShadow: nm.shadowSm, padding: '24px', textAlign: 'left', marginBottom: '28px', minHeight: '180px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>{tabs[activeTab].title}</h2>
              {tabs[activeTab].items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
              {tabs.map((_, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{ width: activeTab === i ? '24px' : '8px', height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: nm.bg, boxShadow: activeTab === i ? nm.shadowSm : nm.shadowInset, transition: 'all 0.3s' }} />
              ))}
            </div>

            {/* CTA text */}
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Get notified when the first hackathon opens.</p>

            {/* Email + Notify */}
            <div style={{ display: 'flex', gap: '10px', maxWidth: '480px', margin: '0 auto 32px' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, padding: '13px 18px', fontSize: '14px', color: '#0f172a', background: nm.bg, border: 'none', borderRadius: '50px', outline: 'none', boxShadow: nm.shadowInset }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = 'inset 4px 4px 10px rgba(0,0,0,0.09), inset -3px -3px 8px rgba(255,255,255,0.9)'; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = nm.shadowInset; }}
              />
              <button
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '13px 24px', fontSize: '14px', fontWeight: '700', color: '#fff', background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '6px 6px 14px rgba(96,165,250,0.3)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '8px 8px 20px rgba(96,165,250,0.45)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '6px 6px 14px rgba(96,165,250,0.3)'; }}
              >
                Notify Me
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </button>
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ width: '38px', height: '38px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', textDecoration: 'none', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '10px 10px 24px rgba(0,0,0,0.12), -6px -6px 16px rgba(255,255,255,0.95)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadow; }}>
                  {s.icon}
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>
      <Footer1 />
    </>
  );
}
