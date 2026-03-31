"use client";
import "../../app/rewards/rewards.css";
import React from 'react';

const nm = {
  bg: '#ffffff',
  shadow: '6px 6px 16px rgba(0,0,0,0.09), -4px -4px 12px rgba(255,255,255,0.9)',
  shadowSm: '4px 4px 10px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.9)',
  shadowInset: 'inset 3px 3px 8px rgba(0,0,0,0.07), inset -2px -2px 6px rgba(255,255,255,0.9)',
  shadowHover: '10px 10px 24px rgba(0,0,0,0.12), -6px -6px 16px rgba(255,255,255,0.95)',
};

const philosophyItems = [
  { label: 'MERIT PRINCIPLE', title: 'No Free Rides', body: 'You don\'t get rewarded just for signing up. You get recognized for learning, building, and leading.' },
  { label: 'EQUAL ENTRY FRAMEWORK', title: 'Equal Ground', body: 'It doesn\'t matter who you know. Everyone starts at the exact same rank: DAG Soldier.' },
  { label: 'SUSTAINABLE VALUE MODEL', title: 'Real Value', body: 'Our rewards come from actual ecosystem growth, not speculative bubbles.' },
];

const earnItems = [
  { title: 'Learning', body: 'Mastering the ecosystem tools.' },
  { title: 'Sharing', body: 'Referring quality members (not spamming).' },
  { title: 'Creating', body: 'Making videos, content, and meaningful comments.' },
];

const soldierFeatures = ['Open Learning Sessions', 'AI Business & Automation Fundamentals', 'Contribution-Based Reputation Growth'];
const lieutenantFeatures = ['Launch & Validate Real AI Projects', 'Access to Structured Builder Sprints', 'Eligible for Demo Day & Startup Tracks'];

const grantsItems = [
  { label: 'RESOURCE ACCESS FRAMEWORK', title: 'Meritocratic Efficiency', body: 'Your rank dictates your resource access. As you progress from Starter to Mythic, the ecosystem unlocks higher efficiency tiers, ensuring that long-term contributors receive a larger share of the value they generate.' },
  { label: 'IMPACT RECOGNITION SYSTEM', title: 'Performance Fellowships', body: 'Consistency is the primary metric we reward. Contributors who demonstrate sustained, monthly impact are eligible for the Discretionary Excellence Fund—a resource pool reserved specifically for those actively driving ecosystem stability.' },
  { label: 'LEADERSHIP SUPPORT INFRASTRUCTURE', title: 'Ambassador Logistics Program', body: 'For our most dedicated leaders, support extends beyond the digital platform. High-impact contributors can qualify for the Lifestyle Support Tier, which provides assistance for real-world logistical needs.' },
];

export default function RewardsOverviewNeo() {
  return (
    <main style={{ background: nm.bg, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ background: nm.bg, padding: '56px 24px 48px' }}>
        <div className="tf-container">
          <div className="rewards-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Left */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 18px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowSm, marginBottom: '20px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Reward System</span>
              </div>

              <h1 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: '800', color: '#0f172a', lineHeight: '1.1', marginBottom: '4px' }}>
                PROOF OF WORK.
              </h1>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px', background: 'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                NOT PROOF OF HYPE.
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '1.65', color: '#475569', marginBottom: '28px', maxWidth: '480px' }}>
                A reward system that values what you actually contribute—not just when you joined.
              </p>

              {/* Download CTA */}
              <a
                href="/api/download/rewards-pdf"
                download="DAG-Army-Reward-System.pdf"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', borderRadius: '14px', background: nm.bg, boxShadow: nm.shadow, fontSize: '15px', fontWeight: '700', color: '#0f172a', textDecoration: 'none', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadowHover; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadow; }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#818cf8,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5m0 14-4-4m4 4 4-4"/><line x1="5" y1="22" x2="19" y2="22"/></svg>
                </div>
                Download Full Guide (PDF)
              </a>
            </div>

            {/* Right — shield image */}
            <div style={{ background: nm.bg, borderRadius: '20px', boxShadow: nm.shadow, padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/finalendingframe.png" alt="Merit Shield" style={{ width: '100%', maxWidth: '420px', height: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>

          </div>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section style={{ background: nm.bg, padding: '64px 24px' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>The Philosophy</h2>
              <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 10px' }}>
                Most tech communities promise "easy rewards" just for being early. We don't.
              </p>
              <p style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>At DAG Army, we operate on Merit.</p>
            </div>

            <div style={{ background: nm.bg, borderRadius: '20px', boxShadow: nm.shadow, padding: '40px 36px' }}>
              <div className="rewards-three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0' }}>
                {philosophyItems.map((item, i) => (
                  <div key={i} style={{ paddingLeft: i > 0 ? '36px' : 0, paddingRight: i < 2 ? '36px' : 0, borderRight: i < 2 ? '1px solid rgba(148,163,184,0.2)' : 'none' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>{item.label}</p>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '12px', lineHeight: '1.2' }}>{item.title}</h3>
                    <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg,#818cf8,#a78bfa)', borderRadius: '2px', marginBottom: '12px' }} />
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.65', margin: 0 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How You Earn ── */}
      <section style={{ background: nm.bg, padding: '0 24px 64px' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>How You Earn</h2>
              <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto' }}>
                We quantify your impact using <strong style={{ color: '#0f172a' }}>DAG Points</strong> — your Reputation Score.
              </p>
            </div>

            <div style={{ background: nm.bg, borderRadius: '20px', boxShadow: nm.shadow, padding: '36px' }}>
              <div className="rewards-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>

                {/* Left: pillars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '24px', borderRight: '1px solid rgba(148,163,184,0.2)' }}>
                  {earnItems.map((item, i) => (
                    <div key={i} style={{ background: nm.bg, borderRadius: '14px', boxShadow: nm.shadowSm, padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{item.title}</h4>
                        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: score card */}
                <div style={{ paddingLeft: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>Your Reputation Score</p>
                  <div style={{ fontSize: '48px', fontWeight: '800', color: '#0f172a', marginBottom: '12px', lineHeight: '1' }}>
                    847 <span style={{ fontSize: '28px', color: '#94a3b8', fontWeight: '600' }}>/ 1000</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: nm.bg, boxShadow: nm.shadowInset, borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
                    <div style={{ width: '84.7%', height: '100%', background: 'linear-gradient(90deg,#818cf8,#a78bfa)', borderRadius: '4px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(148,163,184,0.2)' }}>
                    {[['Courses Completed', '12'], ['Community Contributions', '28'], ['Projects Built', '5']].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
                        <span style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Important notice */}
              <div style={{ marginTop: '28px', padding: '16px 20px', background: nm.bg, boxShadow: nm.shadowInset, borderRadius: '12px', borderLeft: '3px solid #818cf8' }}>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.65', margin: 0 }}>
                  <strong style={{ color: '#818cf8', display: 'block', marginBottom: '4px' }}>Important:</strong>
                  These points are yours alone. They are non-transferable and cannot be traded. You can't buy a reputation here; you have to earn it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Burn To Rise ── */}
      <section style={{ background: nm.bg, padding: '0 24px 64px' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                The <span style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Burn</span> To Rise
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '600px', margin: '0 auto 8px', lineHeight: '1.7' }}>
                Collecting points is good, but <strong style={{ color: '#0f172a' }}>Rank</strong> is better. To move up the ladder you must make a choice.
              </p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                You have to "<span style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Burn</span>" your points.
              </p>
            </div>

            {/* Rank progression */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '120px', height: '120px', margin: '0 auto 12px', background: nm.bg, borderRadius: '50%', boxShadow: nm.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/images/badges/dag-starter.svg" alt="Starter" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                </div>
                <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px', margin: '0 0 2px' }}>Starter</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Starting Point</p>
              </div>

              <div style={{ flex: '0 0 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: '100%', height: '3px', background: 'linear-gradient(90deg,#94a3b8,#818cf8)', borderRadius: '2px', opacity: 0.5 }} />
                <div style={{ position: 'absolute', zIndex: 2, background: 'linear-gradient(135deg,#f59e0b,#ef4444)', borderRadius: '10px', padding: '8px 20px', color: '#fff', fontSize: '13px', fontWeight: '800', letterSpacing: '0.5px', boxShadow: '0 4px 16px rgba(239,68,68,0.35)', textTransform: 'uppercase' }}>
                  BURN
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '120px', height: '120px', margin: '0 auto 12px', background: nm.bg, borderRadius: '50%', boxShadow: nm.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/images/badges/dag-mythic.svg" alt="Mythic" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                </div>
                <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px', margin: '0 0 2px' }}>Mythic</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Elite Status</p>
              </div>
            </div>

            {/* 3-col card */}
            <div style={{ background: nm.bg, borderRadius: '20px', boxShadow: nm.shadow, padding: '36px' }}>
              <div className="rewards-three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0' }}>
                {[
                  { title: 'The Commitment', body: 'Burning wipes your point balance to zero.' },
                  { title: 'The Reward', body: 'In exchange, you permanently unlock a higher Rank.' },
                  { title: 'The Benefit', body: 'Higher ranks unlock better resource access, larger shares of ecosystem value, and leadership opportunities.' },
                ].map((item, i) => (
                  <div key={i} style={{ paddingLeft: i > 0 ? '32px' : 0, paddingRight: i < 2 ? '32px' : 0, borderRight: i < 2 ? '1px solid rgba(148,163,184,0.2)' : 'none' }}>
                    <div style={{ width: '36px', height: '3px', background: 'linear-gradient(90deg,#818cf8,#a78bfa)', borderRadius: '2px', marginBottom: '14px' }} />
                    <h5 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>{item.title}</h5>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.65', margin: 0 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Choose Your Path ── */}
      <section style={{ background: nm.bg, padding: '0 24px 64px' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>Operational Modes</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Choose Your Path</h2>
              <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '560px', margin: '0 auto' }}>
                Two Roles. One Mission. <strong style={{ color: '#0f172a' }}>Building 100,000 AI Founders by 2030.</strong>
              </p>
            </div>

            <div className="rewards-path-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'center' }}>

              {/* Soldier card */}
              <div style={{ background: nm.bg, borderRadius: '20px', boxShadow: nm.shadow, padding: '28px', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadowHover; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadow; }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '100px', height: '100px', background: nm.bg, borderRadius: '50%', boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/images/dagbadges/DAG SOLDIER.svg" alt="DAG Soldier" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                  </div>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: '6px' }}>DAG Soldier</h3>
                <p style={{ fontSize: '13px', textAlign: 'center', color: '#94a3b8', marginBottom: '10px' }}>Focus: <strong style={{ color: '#60a5fa' }}>Skill Development</strong></p>
                <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', lineHeight: '1.6', marginBottom: '16px' }}>The foundational entry point for members building practical AI capability.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {soldierFeatures.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: nm.bg, boxShadow: nm.shadowSm, borderRadius: '10px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'auto', padding: '12px 16px', background: nm.bg, boxShadow: nm.shadowInset, borderRadius: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: 0, lineHeight: '1.5' }}>Transition from Learner to Builder through consistent action.</p>
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '2px', height: '40px', background: 'linear-gradient(180deg,transparent,#818cf8)', borderRadius: '1px' }} />
                <div style={{ width: '36px', height: '36px', background: nm.bg, boxShadow: nm.shadow, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
                <div style={{ width: '2px', height: '40px', background: 'linear-gradient(180deg,#818cf8,transparent)', borderRadius: '1px' }} />
              </div>

              {/* Lieutenant card */}
              <div style={{ background: nm.bg, borderRadius: '20px', boxShadow: nm.shadow, padding: '28px', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.25s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadowHover; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadow; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#818cf8,#a78bfa)' }} />
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '100px', height: '100px', background: nm.bg, borderRadius: '50%', boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/images/dagbadges/DAG LIEUTENANT.svg" alt="DAG Lieutenant" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                  </div>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: '6px' }}>DAG Lieutenant</h3>
                <p style={{ fontSize: '13px', textAlign: 'center', color: '#94a3b8', marginBottom: '10px' }}>Focus: <strong style={{ color: '#a78bfa' }}>Building & Contribution</strong></p>
                <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', lineHeight: '1.6', marginBottom: '16px' }}>The advanced operating mode for builders ready to launch, execute, and lead within the ecosystem.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {lieutenantFeatures.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: nm.bg, boxShadow: nm.shadowSm, borderRadius: '10px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'auto', padding: '12px 16px', background: nm.bg, boxShadow: nm.shadowInset, borderRadius: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: 0, lineHeight: '1.5' }}>Lieutenant status reflects commitment to execution. Advancement is earned through real-world output.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Grants & Fellowships ── */}
      <section style={{ background: nm.bg, padding: '0 24px 80px' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>Ecosystem Grants & Fellowships</h2>
              <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
                We view our top contributors as partners. The ecosystem is structured to provide merit-based resource allocation.
              </p>
            </div>

            <div style={{ background: nm.bg, borderRadius: '20px', boxShadow: nm.shadow, padding: '40px 36px' }}>
              <div className="rewards-three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0' }}>
                {grantsItems.map((item, i) => (
                  <div key={i} style={{ paddingLeft: i > 0 ? '36px' : 0, paddingRight: i < 2 ? '36px' : 0, borderRight: i < 2 ? '1px solid rgba(148,163,184,0.2)' : 'none' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>{item.label}</p>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '12px', lineHeight: '1.2' }}>{item.title}</h3>
                    <div style={{ width: '36px', height: '2px', background: 'rgba(148,163,184,0.4)', borderRadius: '2px', marginBottom: '12px' }} />
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.65', margin: 0 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
