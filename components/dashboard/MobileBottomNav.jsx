"use client";
import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/* ── Neumorphic tokens (same as DashboardNav2) ── */
const nm = {
  bg: '#f0f2f5',
  shadow:       '8px 8px 20px rgba(0,0,0,0.16), -6px -6px 16px rgba(255,255,255,0.95)',
  shadowSm:     '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9)',
  accent:       '#4f46e5',
  textIdle:     '#64748b',
  textActive:   '#4f46e5',
  iconIdle:     '#94a3b8',
  iconActive:   '#4f46e5',
};

/* ── Inline SVG icons ── */
const IconHome = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? nm.iconActive : nm.iconIdle} strokeWidth="1.9">
    <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconMissions = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? nm.iconActive : nm.iconIdle} strokeWidth="1.9">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconTeam = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? nm.iconActive : nm.iconIdle} strokeWidth="1.9">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/>
  </svg>
);

const IconLeaderboard = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? nm.iconActive : nm.iconIdle} strokeWidth="1.9">
    <path d="M18 20V10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 20V4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 20v-6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconMore = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? nm.iconActive : nm.iconIdle} strokeWidth="1.9">
    <circle cx="12" cy="12" r="1.2" fill={active ? nm.iconActive : nm.iconIdle}/>
    <circle cx="5"  cy="12" r="1.2" fill={active ? nm.iconActive : nm.iconIdle}/>
    <circle cx="19" cy="12" r="1.2" fill={active ? nm.iconActive : nm.iconIdle}/>
  </svg>
);

/* ── Each tab definition ── */
const TABS = [
  { key: 'home',        label: 'Home',        routes: ['/dashboard'],   Icon: IconHome },
  { key: 'team',        label: 'My Team',     routes: ['/my-team'],     Icon: IconTeam },
  { key: 'missions',    label: 'Missions',    routes: ['/missions'],    Icon: IconMissions },
  { key: 'leaderboard', label: 'Rankings',    routes: ['/leaderboard'], Icon: IconLeaderboard },
  { key: 'more',        label: 'More',        routes: [],               Icon: IconMore },
];

/* ── SSO jump (same logic as DashboardNav2) ── */
async function ssoJump(target) {
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
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ target }),
    });
    if (res.ok) { const { redirect_url } = await res.json(); window.open(redirect_url, '_blank'); }
    else window.open(baseUrl, '_blank');
  } catch { window.open(baseUrl, '_blank'); }
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function MobileBottomNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout } = useAuth();

  const [moreOpen,          setMoreOpen]          = useState(false);
  const [availableMissions, setAvailableMissions] = useState(0);

  /* ── Mission badge polling ── */
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
    const iv = setInterval(fetchAvailable, 60000);
    return () => clearInterval(iv);
  }, []);

  /* ── Close More sheet on route change ── */
  useEffect(() => { setMoreOpen(false); }, [pathname]);

  /* ── Determine active tab ── */
  const activeTab = TABS.find(t => t.routes.some(r => pathname === r))?.key ?? (moreOpen ? 'more' : '');

  const navigate = useCallback((route) => {
    setMoreOpen(false);
    window.location.href = route;
  }, []);

  const handleLogout = useCallback(async () => {
    setMoreOpen(false);
    await logout();
    window.location.href = '/';
  }, [logout]);

  /* ── More sheet item rows ── */
  const MoreItem = ({ icon, label, onClick, danger, soon, ext }) => (
    <button
      onClick={soon ? undefined : onClick}
      disabled={soon}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        width: '100%', padding: '8px 12px',
        background: nm.bg, border: 'none',
        borderRadius: '12px', cursor: soon ? 'default' : 'pointer',
        boxShadow: nm.shadowSm,
        color: danger ? '#dc2626' : '#374151',
        opacity: soon ? 0.5 : 1,
        transition: 'all 0.18s',
        textAlign: 'left',
      }}
      onMouseDown={e => { if (!soon) e.currentTarget.style.boxShadow = 'inset 4px 4px 10px rgba(0,0,0,0.1), inset -3px -3px 8px rgba(255,255,255,0.85)'; }}
      onMouseUp={e =>   { e.currentTarget.style.boxShadow = nm.shadowSm; }}
      onTouchStart={e => { if (!soon) e.currentTarget.style.boxShadow = 'inset 4px 4px 10px rgba(0,0,0,0.1), inset -3px -3px 8px rgba(255,255,255,0.85)'; }}
      onTouchEnd={e =>   { e.currentTarget.style.boxShadow = nm.shadowSm; }}
    >
      <div style={{
        width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
        background: nm.bg, boxShadow: nm.shadowSm,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? '#dc2626' : '#64748b',
      }}>
        {icon}
      </div>
      <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, letterSpacing: '-0.2px' }}>{label}</span>
      {soon && (
        <span style={{ fontSize: '7px', fontWeight: 800, color: '#7c3aed', background: 'rgba(124,58,237,0.1)', borderRadius: 5, padding: '2px 5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Soon
        </span>
      )}
      {ext && !soon && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {!ext && !soon && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );

  return (
    <>
      <style>{`
        @keyframes pulse-dot-mob {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.6); opacity: 0.7; }
        }
        @keyframes sheet-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fade-in-backdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
      <style>{`
        @supports (-webkit-touch-callout: none) {
          .mob-nav-bar {
            padding-bottom: env(safe-area-inset-bottom, 0px) !important;
            height: calc(64px + env(safe-area-inset-bottom, 0px)) !important;
          }
        }
        /* Guarantee edge tabs never clip on any device */
        .mob-nav-bar > button:first-child { padding-left: max(12px, env(safe-area-inset-left, 8px)) !important; }
        .mob-nav-bar > button:last-child  { padding-right: max(12px, env(safe-area-inset-right, 8px)) !important; }
      `}</style>

      {/* ── More sheet backdrop ── */}
      {moreOpen && (
        <div
          onClick={() => setMoreOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.38)',
            backdropFilter: 'blur(3px)',
            zIndex: 9997,
            animation: 'fade-in-backdrop 0.22s ease',
          }}
        />
      )}

      {/* ── More slide-up sheet ── */}
      {moreOpen && (
        <div style={{
          position: 'fixed',
          left: 0, right: 0, bottom: 0,
          zIndex: 9998,
          background: nm.bg,
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
          padding: '8px 14px calc(72px + env(safe-area-inset-bottom, 8px)) 14px',
          animation: 'sheet-up 0.28s cubic-bezier(0.34,1.1,0.64,1)',
        }}>
          {/* Drag handle */}
          <div style={{
            width: '36px', height: '4px', borderRadius: '4px',
            background: '#d1d5db', margin: '0 auto 12px',
          }}/>

          {/* Sheet title */}
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '2px' }}>
            More Options
          </div>

          {/* Sheet items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

            <MoreItem
              icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/></svg>}
              label="Events"
              onClick={() => navigate('/events')}
            />

            <MoreItem
              icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="DAG Lieutenant"
              onClick={() => navigate('/dag-lieutenant')}
            />

            <MoreItem
              icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="DAG War Room"
              soon
            />

            <MoreItem
              icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="DAG Academy"
              soon
            />

            <MoreItem
              icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="Settings / Profile"
              onClick={() => navigate('/settings')}
            />

            <MoreItem
              icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="Support"
              onClick={() => navigate('/support')}
            />

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', margin: '2px 0' }}/>

            <MoreItem
              icon={<img src="/images/logo/dagchain-logo.png" alt="DAGCHAIN" style={{ width: '17px', height: '17px', objectFit: 'contain' }}/>}
              label="DAGCHAIN"
              onClick={() => { setMoreOpen(false); ssoJump('dagchain'); }}
              ext
            />

            <MoreItem
              icon={<img src="/images/logo/daggpt-logo.png" alt="DAGGPT" style={{ width: '17px', height: '17px', objectFit: 'contain' }}/>}
              label="DAGGPT"
              onClick={() => { setMoreOpen(false); ssoJump('daggpt'); }}
              ext
            />

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', margin: '2px 0' }}/>

            <MoreItem
              icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              label="Logout"
              onClick={handleLogout}
              danger
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          BOTTOM NAV BAR
      ══════════════════════════════════════════ */}
      <div
        className="mob-nav-bar"
        style={{
          position: 'fixed',
          left: 0, right: 0, bottom: 0,
          zIndex: 9999,
          background: nm.bg,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.12), -2px -2px 8px rgba(255,255,255,0.9)',
          borderTop: '1px solid rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'stretch',
          /* min 12px side guard on all devices; expands further for notched/curved phones */
          paddingLeft:  'max(12px, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(12px, env(safe-area-inset-right, 0px))',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
          willChange: 'transform',
        }}>
        {TABS.map(({ key, label, Icon }) => {
          const isActive  = key === 'more' ? moreOpen : activeTab === key;
          const isMission = key === 'missions';
          const hasBadge  = isMission && availableMissions > 0;

          return (
            <button
              key={key}
              onClick={() => {
                if (key === 'more') {
                  setMoreOpen(prev => !prev);
                } else {
                  const route = TABS.find(t => t.key === key)?.routes[0];
                  if (route) navigate(route);
                }
              }}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '4px',
                background: 'none', border: 'none',
                cursor: 'pointer',
                padding: '8px 4px 4px',
                position: 'relative',
                transition: 'opacity 0.15s',
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseDown={e => { e.currentTarget.style.opacity = '0.75'; }}
              onMouseUp={e =>   { e.currentTarget.style.opacity = '1'; }}
              onTouchStart={e => { e.currentTarget.style.opacity = '0.75'; }}
              onTouchEnd={e =>   { e.currentTarget.style.opacity = '1'; }}
            >
              {/* Icon container with neumorphic inset when active */}
              <div style={{
                position: 'relative',
                width: '38px', height: '38px',
                borderRadius: '12px',
                background: nm.bg,
                boxShadow: isActive
                  ? 'inset 5px 5px 12px rgba(99,102,241,0.18), inset -4px -4px 10px rgba(255,255,255,0.9)'
                  : '5px 5px 12px rgba(0,0,0,0.10), -4px -4px 10px rgba(255,255,255,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                transform: isActive ? 'scale(0.93)' : 'scale(1)',
              }}>
                <Icon active={isActive} />

                {/* Mission badge */}
                {hasBadge && (
                  <div style={{
                    position: 'absolute', top: '4px', right: '4px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#ef4444',
                    boxShadow: '0 0 0 2px rgba(239,68,68,0.25)',
                    animation: 'pulse-dot-mob 1.4s ease-in-out infinite',
                  }}/>
                )}
              </div>

              {/* Label */}
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? nm.textActive : nm.textIdle,
                letterSpacing: '-0.1px',
                lineHeight: 1,
                transition: 'color 0.2s',
              }}>
                {label}
              </span>

              {/* Active accent dot */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  width: '4px', height: '4px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 0 6px rgba(99,102,241,0.5)',
                }}/>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
