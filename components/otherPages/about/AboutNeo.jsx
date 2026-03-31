"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Neumorphic tokens ── */
const nm = {
  bg: '#ffffff',
  shadow: '6px 6px 16px rgba(0,0,0,0.09), -4px -4px 12px rgba(255,255,255,0.9)',
  shadowSm: '4px 4px 10px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.9)',
  shadowInset: 'inset 3px 3px 8px rgba(0,0,0,0.07), inset -2px -2px 6px rgba(255,255,255,0.9)',
  shadowHover: '10px 10px 24px rgba(0,0,0,0.12), -6px -6px 16px rgba(255,255,255,0.95)',
};

const NmCard = ({ children, style = {}, hover = true, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: nm.bg,
      borderRadius: '18px',
      boxShadow: nm.shadow,
      transition: 'box-shadow 0.25s, transform 0.25s',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
    onMouseEnter={hover ? e => {
      e.currentTarget.style.boxShadow = nm.shadowHover;
      e.currentTarget.style.transform = 'translateY(-3px)';
    } : undefined}
    onMouseLeave={hover ? e => {
      e.currentTarget.style.boxShadow = nm.shadow;
      e.currentTarget.style.transform = 'translateY(0)';
    } : undefined}
  >
    {children}
  </div>
);

const gaps = [
  {
    title: 'The Skill Gap',
    body: 'Universities teach theory, but the industry demands practitioners. We train "Vibe Coders" who can build, not just memorize.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    title: 'The Penetration Gap',
    body: 'Global companies want to hire from Tier 2 and Tier 3 cities but don\'t know where to look. We are their "boots on the ground," vetting the world\'s most loyal and skilled talent.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    title: 'The Founder Gap',
    body: 'Many students have world-changing ideas but no roadmap. We provide the mentorship to turn those ideas into sustainable startups.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
];

const visionPoints = [
  { label: 'A Training Camp', body: 'We teach practical, "battle-ready" skills for the 2026 economy—from AI to Blockchain security.' },
  { label: 'A Launchpad', body: 'We provide mentorship and strategic guidance to turn prototypes into products and ideas into startups.' },
  { label: 'A Bridge', body: 'We vet our "Soldiers" through real-world challenges so companies hire proven excellence.' },
];

export default function AboutNeo() {
  const [activeGap, setActiveGap] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveGap(p => (p + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: nm.bg, minHeight: '100vh' }}>

      {/* ═══ HERO ═══ */}
      <section className="about-hero-section">
        {/* Label */}
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', textAlign: 'center' }}>
          WHO WE ARE
        </p>

        {/* Headline + intro — two columns */}
        <div className="about-hero-grid">
          <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a', lineHeight: '1.2', margin: 0 }}>
            We Are Building a{' '}
            <span style={{ fontFamily: 'Nasalization, sans-serif' }}>GLOBAL ARMY</span>{' '}
            of "Vibe Coders," Technical Experts, and Visionary Entrepreneurs
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.8', margin: 0, paddingTop: '6px' }}>
            At DAGARMY, we believe that brilliance is universal, but opportunity is not. We are not just another EdTech platform—we are a Talent Engagement and Incubation Engine, bridging the gap between hidden talent and global tech giants.
          </p>
        </div>

        {/* Photo grid — neumorphic frame */}
        <NmCard hover={false} style={{ padding: '16px', borderRadius: '24px' }}>
          <div className="about-photo-mosaic">
            {/* Top-left wide */}
            <div style={{ gridColumn: '1/6', gridRow: '1/3', borderRadius: '12px', overflow: 'hidden', boxShadow: nm.shadowSm }}>
              <Image src="/images/about  us/herosectionimages/imageabout.png" alt="DAGARMY Team" width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Center large */}
            <div style={{ gridColumn: '6/13', gridRow: '1/5', borderRadius: '12px', overflow: 'hidden', boxShadow: nm.shadowSm }}>
              <Image src="/images/about  us/herosectionimages/main image .png" alt="DAGARMY Vision" width={800} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Bottom-left small */}
            <div style={{ gridColumn: '1/4', gridRow: '3/5', borderRadius: '12px', overflow: 'hidden', boxShadow: nm.shadowSm }}>
              <Image src="/images/about  us/herosectionimages/image 2.png" alt="DAGARMY Innovation" width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
            </div>
            {/* Bottom-left next */}
            <div style={{ gridColumn: '4/6', gridRow: '3/5', borderRadius: '12px', overflow: 'hidden', boxShadow: nm.shadowSm }}>
              <Image src="/images/about  us/herosectionimages/iamge 5.png" alt="DAGARMY Technology" width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
            </div>
            {/* Bottom spanning left */}
            <div style={{ gridColumn: '1/7', gridRow: '5/7', borderRadius: '12px', overflow: 'hidden', boxShadow: nm.shadowSm }}>
              <Image src="/images/about  us/herosectionimages/image 4.png" alt="DAGARMY Growth" width={700} height={300} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
            </div>
            {/* Quote card */}
            <div className="about-mosaic-quote" style={{
              gridColumn: '7/13', gridRow: '5/7',
              borderRadius: '12px', boxShadow: nm.shadowSm,
              background: nm.bg,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '28px 32px', textAlign: 'center',
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                </svg>
              </div>
              <p style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', lineHeight: '1.5', margin: '0 0 14px', fontFamily: 'Cardo, serif' }}>
                "No Talent Left Behind.<br />No Territory Left Unreached."
              </p>
              <div style={{ width: '40px', height: '3px', borderRadius: '2px', background: nm.bg, boxShadow: nm.shadowInset }} />
            </div>
          </div>
        </NmCard>
      </section>

      {/* ═══ THREE GAPS ═══ */}
      <section className="about-section">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>OUR PURPOSE</p>
          <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>Bridging the Three Gaps</h2>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '620px', margin: '0 auto', lineHeight: '1.7' }}>
            The world is changing faster than the classroom. We exist to solve three critical failures of the modern tech landscape.
          </p>
        </div>

        <div className="about-gaps-grid">
          {gaps.map((gap, i) => (
            <NmCard
              key={gap.title}
              style={{
                padding: '36px 28px',
                textAlign: 'center',
                outline: activeGap === i ? `2px solid rgba(129,140,248,0.4)` : '2px solid transparent',
                transition: 'box-shadow 0.25s, transform 0.25s, outline 0.4s',
              }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: nm.bg, boxShadow: nm.shadowSm,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 22px',
              }}>
                {gap.icon}
              </div>
              <h4 style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>{gap.title}</h4>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.7', margin: 0 }}>{gap.body}</p>
            </NmCard>
          ))}
        </div>

        {/* Dot indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
          {gaps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveGap(i)}
              style={{
                width: activeGap === i ? '24px' : '8px', height: '8px',
                borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: nm.bg,
                boxShadow: activeGap === i ? nm.shadowSm : nm.shadowInset,
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </section>

      {/* ═══ OUR VISION ═══ */}
      <section className="about-section">
        <div className="about-vision-grid">
          {/* Image */}
          <NmCard hover={false} style={{ padding: '12px', borderRadius: '22px' }}>
            <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <Image
                src="/images/about  us/The Training Ground for Future Tech Leaders/The Training Ground for Future Tech Leaders.png"
                alt="Training Ground for Future Tech Leaders"
                width={1372} height={1101}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                unoptimized
              />
            </div>
          </NmCard>

          {/* Content */}
          <div>
            {/* Tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '10px 16px', borderRadius: '12px',
              background: nm.bg, boxShadow: nm.shadowSm,
              marginBottom: '24px',
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#475569" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="6" stroke="#475569" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2" fill="#475569"/>
                </svg>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>How We Operate</span>
            </div>

            <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', lineHeight: '1.25' }}>
              The Training Ground for Future Tech Leaders
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '28px' }}>
              DAGARMY is a community-driven ecosystem where rank is earned through skill. We are the direct link between hidden talent in small towns and global tech giants.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {visionPoints.map(point => (
                <NmCard key={point.label} hover={false} style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{point.label}: </span>
                    <span style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>{point.body}</span>
                  </div>
                </NmCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BANNER / CTA ═══ */}
      <section className="about-section" style={{ paddingTop: 0 }}>
        <NmCard hover={false} style={{ borderRadius: '24px', overflow: 'hidden', padding: 0, position: 'relative', minHeight: '320px' }}>
          {/* Background image */}
          <Image
            src="/images/about  us/cardbackgorund iamge .png"
            alt="DAGARMY Background"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(5,8,20,0.88) 0%, rgba(5,8,20,0.70) 50%, rgba(5,8,20,0.55) 100%)',
          }} />
          {/* Content */}
          <div className="about-cta-content" style={{ position: 'relative', zIndex: 1, padding: '72px 60px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#ffffff', marginBottom: '18px', lineHeight: '1.3', fontFamily: 'Cardo, serif' }}>
              Join the Army.<br />Claim Your Future.
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', maxWidth: '680px', margin: '0 auto 36px', lineHeight: '1.7' }}>
              Our vision is a future where "DAGARMY Certified" is the ultimate signal of technical mastery. We are building an army of 1,000,000+ pre-vetted professionals and launching 100+ soldier-led startups every year.
            </p>
            <Link
              href="/courses"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)',
                boxShadow: '6px 6px 18px rgba(96,165,250,0.35)',
                fontSize: '15px', fontWeight: '700', color: '#fff',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '8px 8px 24px rgba(96,165,250,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '6px 6px 18px rgba(96,165,250,0.35)';
              }}
            >
              Join DAG ARMY
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </Link>
          </div>
        </NmCard>
      </section>

    </div>
  );
}
