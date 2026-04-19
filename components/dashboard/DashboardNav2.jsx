"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/* ── Neumorphic tokens ── */
const nm = {
  bg: '#f0f2f5',
  shadow:             '8px 8px 20px rgba(0,0,0,0.16), -6px -6px 16px rgba(255,255,255,0.95)',
  shadowSm:           '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9)',
  shadowActive:       'inset 6px 6px 14px rgba(0,0,0,0.14), inset -4px -4px 10px rgba(255,255,255,0.9)',
  shadowActiveAccent: 'inset 5px 5px 12px rgba(99,102,241,0.22), inset -4px -4px 10px rgba(255,255,255,0.9)',
  iconShadow:         '4px 4px 9px rgba(0,0,0,0.13), -3px -3px 7px rgba(255,255,255,0.9)',
  iconShadowActive:   'inset 4px 4px 9px rgba(99,102,241,0.22), inset -3px -3px 7px rgba(255,255,255,0.9)',
  accent:     '#4f46e5',
  textIdle:   '#64748b',
  textActive: '#4f46e5',
  iconIdle:   '#94a3b8',
  iconActive: '#4f46e5',
};

export default function DashboardNav2() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { logout, userProfile } = useAuth();
  const [availableMissions, setAvailableMissions] = useState(0);

  /* ── Is user a DAG Lieutenant? ── */
  const isLieutenant = userProfile?.tier === 'DAG_LIEUTENANT';

  /* ── SSO jump handler ── */
  const handleSSOJump = useCallback(async (target) => {
    const URLS = {
      dagchain: process.env.NEXT_PUBLIC_DAGCHAIN_URL || 'https://dagchain.network',
      daggpt:   process.env.NEXT_PUBLIC_DAGGPT_URL   || 'https://daggpt.network',
    };
    const baseUrl = URLS[target];
    const token = typeof window !== 'undefined' ? localStorage.getItem('dagarmy_token') : null;
    if (!token) { window.open(baseUrl, '_blank'); return; }
    try {
      const res = await fetch('/api/auth/sso/issue-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ target }),
      });
      if (res.ok) { const { redirect_url } = await res.json(); window.open(redirect_url, '_blank'); }
      else window.open(baseUrl, '_blank');
    } catch { window.open(baseUrl, '_blank'); }
  }, []);

  /* ── Mission badge ── */
  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const stored = localStorage.getItem('dagarmy_user');
        if (!stored) return;
        const { email } = JSON.parse(stored);
        if (!email) return;
        const res  = await fetch(`/api/social-tasks/user?user_email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success) setAvailableMissions(data.stats?.available || 0);
      } catch {}
    };
    fetchAvailable();
    const interval = setInterval(fetchAvailable, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => { await logout(); router.push('/'); };

  /* ── Per-item hover helpers ── */
  const onEnter = (e, isActive, disabled) => {
    if (!isActive && !disabled) {
      e.currentTarget.style.boxShadow = nm.shadow;
      e.currentTarget.style.transform = 'scale(1.01)';
    }
  };
  const onLeave = (e, isActive, disabled) => {
    if (!isActive && !disabled) {
      e.currentTarget.style.boxShadow = nm.shadowSm;
      e.currentTarget.style.transform = 'scale(1)';
    }
  };

  /* ── Shared item style ── */
  const itemStyle = (isActive, disabled, hasMissionBorder) => ({
    display: 'flex', alignItems: 'center', gap: '11px',
    padding: '11px 14px', borderRadius: '14px',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    background: nm.bg,
    boxShadow: isActive ? nm.shadowActiveAccent : nm.shadowSm,
    color: isActive ? nm.textActive : disabled ? '#b0b8c8' : nm.textIdle,
    transform: isActive ? 'scale(0.98)' : 'scale(1)',
    position: 'relative',
    opacity: disabled ? 0.7 : 1,
    /* Red animated border for missions */
    border: hasMissionBorder ? '1.5px solid #ef4444' : '1.5px solid transparent',
    animation: hasMissionBorder ? 'pulse-border 1.5s ease-in-out infinite' : 'none',
  });

  const iconStyle = (isActive, disabled) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
    background: nm.bg,
    boxShadow: isActive ? nm.iconShadowActive : nm.iconShadow,
    color: isActive ? nm.iconActive : disabled ? '#c1c9d8' : nm.iconIdle,
    transition: 'all 0.2s',
  });

  return (
    /* ── Flat single column - layout wrapper handles overflow/scroll ── */
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 8px 20px', background: nm.bg }}>

      <style>{`
        @keyframes pulse-border {
          0%, 100% { box-shadow: 6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9), 0 0 0 0 rgba(239,68,68,0); border-color: #ef4444; }
          50%       { box-shadow: 6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9), 0 0 8px 2px rgba(239,68,68,0.35); border-color: #f87171; }
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.55); opacity: 0.75; }
        }
      `}</style>

      {/* ── Logo ── */}
      <div style={{ padding: '20px 12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="/images/logo/logo.png" alt="DAGARMY" style={{ width: '32px', height: 'auto', display: 'block', flexShrink: 0 }}/>
        <span style={{ fontFamily: 'Nasalization, sans-serif', fontSize: '16px', fontWeight: '700', color: '#1f2937', letterSpacing: '0.5px' }}>DAGARMY</span>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', margin: '0 4px 14px' }}/>

      {/* ═══════════════════════════════════════
          NAV ITEMS - flat, no sub-container
      ═══════════════════════════════════════ */}

      {/* 1. Dashboard */}
      {(() => {
        const isActive = pathname === '/dashboard';
        return (
          <div onClick={() => window.location.href='/dashboard'}
            style={{ ...itemStyle(isActive, false, false), marginBottom: 7 }}
            onMouseEnter={e => onEnter(e, isActive, false)}
            onMouseLeave={e => onLeave(e, isActive, false)}>
            <div style={iconStyle(isActive, false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: isActive ? 650 : 500, letterSpacing: '-0.1px', flex: 1 }}>Dashboard</span>
            {isActive && <div style={{ width: '4px', height: '20px', borderRadius: '4px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)', flexShrink: 0 }}/>}
          </div>
        );
      })()}


      {/* ── My Courses - HIDDEN (restore when ready) ──
      <div onClick={() => window.location.href='/my-courses'} style={{ ...itemStyle(pathname==='/my-courses',false,false), marginBottom:7 }}>
        ...
      </div>
      ── End My Courses ── */}

      {/* 3. My Team */}
      {(() => {
        const isActive = pathname === '/my-team';
        return (
          <div onClick={() => window.location.href='/my-team'}
            style={{ ...itemStyle(isActive, false, false), marginBottom: 7 }}
            onMouseEnter={e => onEnter(e, isActive, false)}
            onMouseLeave={e => onLeave(e, isActive, false)}>
            <div style={iconStyle(isActive, false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: isActive ? 650 : 500, letterSpacing: '-0.1px', flex: 1 }}>My Team</span>
            {isActive && <div style={{ width: '4px', height: '20px', borderRadius: '4px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)', flexShrink: 0 }}/>}
          </div>
        );
      })()}

      {/* 4. Leaderboard */}
      {(() => {
        const isActive = pathname === '/leaderboard';
        return (
          <div onClick={() => window.location.href='/leaderboard'}
            style={{ ...itemStyle(isActive, false, false), marginBottom: 7 }}
            onMouseEnter={e => onEnter(e, isActive, false)}
            onMouseLeave={e => onLeave(e, isActive, false)}>
            <div style={iconStyle(isActive, false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M16 16v-3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="10" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: isActive ? 650 : 500, letterSpacing: '-0.1px', flex: 1 }}>Leaderboard</span>
            {isActive && <div style={{ width: '4px', height: '20px', borderRadius: '4px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)', flexShrink: 0 }}/>}
          </div>
        );
      })()}


      {/* 6. Business Validation - Lieutenants only */}
      {isLieutenant && (() => {
        const isActive = pathname === '/notifications';
        return (
          <div onClick={() => window.location.href='/notifications'}
            style={{ ...itemStyle(isActive, false, false), marginBottom: 7 }}
            onMouseEnter={e => onEnter(e, isActive, false)}
            onMouseLeave={e => onLeave(e, isActive, false)}>
            <div style={iconStyle(isActive, false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: isActive ? 650 : 500, letterSpacing: '-0.1px', flex: 1 }}>Business Validation</span>
            {isActive && <div style={{ width: '4px', height: '20px', borderRadius: '4px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)', flexShrink: 0 }}/>}
          </div>
        );
      })()}

      {/* 7. Mission - red pulsing border when tasks available */}
      {(() => {
        const isActive = pathname === '/missions';
        const hasMission = availableMissions > 0;
        return (
          <div onClick={() => window.location.href='/missions'}
            style={{ ...itemStyle(isActive, false, hasMission), marginBottom: 7 }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'scale(1.01)'; }}}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.boxShadow = hasMission ? nm.shadowSm : nm.shadowSm; e.currentTarget.style.transform = 'scale(1)'; }}}>
            <div style={iconStyle(isActive, false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: isActive ? 650 : 500, letterSpacing: '-0.1px', flex: 1 }}>Mission</span>
            {hasMission && (
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', flexShrink: 0, animation: 'pulse-dot 1.4s ease-in-out infinite', boxShadow: '0 0 0 2px rgba(239,68,68,0.25)' }}/>
            )}
            {isActive && !hasMission && <div style={{ width: '4px', height: '20px', borderRadius: '4px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)', flexShrink: 0 }}/>}
          </div>
        );
      })()}

      {/* 8. Events */}
      {(() => {
        const isActive = pathname === '/events';
        return (
          <div onClick={() => window.location.href='/events'}
            style={{ ...itemStyle(isActive, false, false), marginBottom: 7 }}
            onMouseEnter={e => onEnter(e, isActive, false)}
            onMouseLeave={e => onLeave(e, isActive, false)}>
            <div style={iconStyle(isActive, false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: isActive ? 650 : 500, letterSpacing: '-0.1px', flex: 1 }}>Events</span>
            {isActive && <div style={{ width: '4px', height: '20px', borderRadius: '4px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)', flexShrink: 0 }}/>}
          </div>
        );
      })()}

      {/* 9. Settings/Profile */}
      {(() => {
        const isActive = pathname === '/settings';
        return (
          <div onClick={() => window.location.href='/settings'}
            style={{ ...itemStyle(isActive, false, false), marginBottom: 7 }}
            onMouseEnter={e => onEnter(e, isActive, false)}
            onMouseLeave={e => onLeave(e, isActive, false)}>
            <div style={iconStyle(isActive, false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: isActive ? 650 : 500, letterSpacing: '-0.1px', flex: 1 }}>Settings/Profile</span>
            {isActive && <div style={{ width: '4px', height: '20px', borderRadius: '4px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)', flexShrink: 0 }}/>}
          </div>
        );
      })()}

      {/* 9. Support */}
      {(() => {
        const isActive = pathname === '/support';
        return (
          <div onClick={() => window.location.href='/support'}
            style={{ ...itemStyle(isActive, false, false), marginBottom: 7 }}
            onMouseEnter={e => onEnter(e, isActive, false)}
            onMouseLeave={e => onLeave(e, isActive, false)}>
            <div style={iconStyle(isActive, false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: isActive ? 650 : 500, letterSpacing: '-0.1px', flex: 1 }}>Support</span>
            {isActive && <div style={{ width: '4px', height: '20px', borderRadius: '4px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)', flexShrink: 0 }}/>}
          </div>
        );
      })()}

      {/* 10. DAG Lieutenant */}
      {(() => {
        const isActive = pathname === '/dag-lieutenant';
        return (
          <div onClick={() => window.location.href='/dag-lieutenant'}
            style={{ ...itemStyle(isActive, false, false), marginBottom: 7 }}
            onMouseEnter={e => onEnter(e, isActive, false)}
            onMouseLeave={e => onLeave(e, isActive, false)}>
            <div style={iconStyle(isActive, false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: isActive ? 650 : 500, letterSpacing: '-0.1px', flex: 1 }}>DAG Lieutenant</span>
            {isActive && <div style={{ width: '4px', height: '20px', borderRadius: '4px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)', flexShrink: 0 }}/>}
          </div>
        );
      })()}

      {/* DAG WAR Room - Coming Soon, after DAG Lieutenant */}
      <div style={{ ...itemStyle(false, true, false), marginBottom: 7, cursor: 'default' }}>
        <div style={iconStyle(false, true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 5l4 4" strokeLinecap="round"/>
            <path d="M9 11l-6 6 2 2 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.5 7.5l-5 5" strokeLinecap="round"/>
            <path d="M20 4l-1 1-4-4 1-1 4 4z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontSize: '13.5px', fontWeight: 500, letterSpacing: '-0.1px', flex: 1, color: '#b0b8c8' }}>DAG WAR Room</span>
        <span style={{ fontSize: '8px', fontWeight: 800, color: '#7c3aed', background: 'rgba(124,58,237,0.1)', borderRadius: 6, padding: '2px 5px', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>Soon</span>
      </div>

      {/* ═══════════════════════════════════════
          EXPLORE ECOSYSTEM - flows right after DAG Lieutenant,
          no wrapping container, layout sidebar handles scroll
      ═══════════════════════════════════════ */}

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(0,0,0,0.08),transparent)', margin: '10px 4px 10px' }}/>

      {/* Section label */}
      <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#9099b8', marginBottom: '8px', paddingLeft: '6px' }}>
        Explore Ecosystem
      </div>

      {/* DAGCHAIN */}
      <button onClick={() => handleSSOJump('dagchain')} style={{
        display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
        borderRadius: '12px', marginBottom: '6px', background: nm.bg, border: '1.5px solid #1a4a8a',
        boxShadow: '4px 4px 10px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.9)',
        transition: 'all 0.18s ease', cursor: 'pointer', width: '100%',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = '6px 5px 14px rgba(0,0,0,0.13), -3px -3px 8px rgba(255,255,255,0.9)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.9)'; }}
      >
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, background: nm.bg, boxShadow: '3px 3px 7px rgba(0,0,0,0.12), -2px -2px 5px rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src="/images/logo/dagchain-logo.png" alt="DAGCHAIN" style={{ width: '20px', height: '20px', objectFit: 'contain' }}/>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.1px' }}>DAGCHAIN</div>
          <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '1px' }}>dagchain.network</div>
        </div>
        <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* DAGGPT - same size as DAGCHAIN */}
      <button onClick={() => handleSSOJump('daggpt')} style={{
        display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
        borderRadius: '12px', marginBottom: '10px', background: nm.bg, border: '1.5px solid #1a4a8a',
        boxShadow: '4px 4px 10px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.9)',
        transition: 'all 0.18s ease', cursor: 'pointer', width: '100%',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = '6px 5px 14px rgba(0,0,0,0.13), -3px -3px 8px rgba(255,255,255,0.9)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.9)'; }}
      >
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, background: nm.bg, boxShadow: '3px 3px 7px rgba(0,0,0,0.12), -2px -2px 5px rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src="/images/logo/daggpt-logo.png" alt="DAGGPT" style={{ width: '20px', height: '20px', objectFit: 'contain' }}/>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.1px' }}>DAGGPT</div>
          <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '1px' }}>daggpt.network</div>
        </div>
        <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* DAG Academy - Coming Soon, same button pattern as DAGCHAIN/DAGGPT but greyed out */}
      <button disabled style={{
        display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
        borderRadius: '12px', marginBottom: '10px', background: nm.bg,
        border: '1.5px solid #c9cfe0',
        boxShadow: '4px 4px 10px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.9)',
        transition: 'all 0.18s ease', cursor: 'not-allowed', width: '100%', opacity: 0.65,
      }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, background: nm.bg, boxShadow: '3px 3px 7px rgba(0,0,0,0.12), -2px -2px 5px rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src="/images/logo/logo.png" alt="DAG Academy" style={{ width: '20px', height: '20px', objectFit: 'contain', filter: 'grayscale(60%)' }}/>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', letterSpacing: '-0.1px' }}>DAG Academy</div>
          <div style={{ fontSize: '9.5px', color: '#b0b8c8', marginTop: '1px' }}>dagarmy.network</div>
        </div>
        <span style={{ fontSize: '8px', fontWeight: 800, color: '#7c3aed', background: 'rgba(124,58,237,0.1)', borderRadius: 5, padding: '2px 5px', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0, marginLeft: 'auto' }}>Soon</span>
      </button>

      {/* Logout */}
      <div onClick={handleLogout} style={{
        display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 13px',
        borderRadius: '14px', cursor: 'pointer', transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
        background: nm.bg, boxShadow: '4px 4px 10px rgba(220,80,80,0.12), -3px -3px 8px rgba(255,255,255,1)', color: '#c0392b',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '6px 6px 14px rgba(220,80,80,0.18), -4px -4px 10px rgba(255,255,255,1)'; e.currentTarget.style.transform = 'scale(1.01)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '4px 4px 10px rgba(220,80,80,0.12), -3px -3px 8px rgba(255,255,255,1)'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0, background: nm.bg, boxShadow: '3px 3px 7px rgba(220,80,80,0.12), -2px -2px 5px rgba(255,255,255,1)', color: '#e74c3c' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontSize: '13.5px', fontWeight: 600, letterSpacing: '-0.1px', color: 'inherit' }}>Logout</span>
      </div>

    </div>
  );
}
