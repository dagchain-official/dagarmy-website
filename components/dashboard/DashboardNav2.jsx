"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

/* ── True 3D White Neumorphic tokens ── */
const nm = {
  bg: '#f0f2f5',
  /* raised — item floats above surface */
  shadow: '8px 8px 20px rgba(0,0,0,0.16), -6px -6px 16px rgba(255,255,255,0.95)',
  shadowSm: '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9)',
  /* active — deep inset pressed into surface */
  shadowActive: 'inset 6px 6px 14px rgba(0,0,0,0.14), inset -4px -4px 10px rgba(255,255,255,0.9)',
  shadowActiveAccent: 'inset 5px 5px 12px rgba(99,102,241,0.22), inset -4px -4px 10px rgba(255,255,255,0.9)',
  /* icon box — small raised bubble */
  iconShadow: '4px 4px 9px rgba(0,0,0,0.13), -3px -3px 7px rgba(255,255,255,0.9)',
  iconShadowActive: 'inset 4px 4px 9px rgba(99,102,241,0.22), inset -3px -3px 7px rgba(255,255,255,0.9)',
  accent: '#4f46e5',
  textIdle: '#64748b',
  textActive: '#4f46e5',
  iconIdle: '#94a3b8',
  iconActive: '#4f46e5',
};

const dashboardItems = [
  {
    href: "/student-dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Dashboard",
  },
  {
    href: "/student-my-courses",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "My Courses",
  },
  {
    href: "/student-my-team",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "My Team",
  },
  {
    href: "/student-leaderboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M16 16v-3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="3" y="10" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Leaderboard",
  },
  {
    href: "/student-tasks",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Mission",
  },
  {
    href: "/student-events",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Events",
    divider: true,
  },
  {
    href: "/student-notifications",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Notifications",
  },
  {
    href: "/student-support",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Support",
    divider: true,
  },
  {
    href: "/student-setting",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Settings/Profile",
  },
  {
    href: "/dag-lieutenant",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "DAG Lieutenant",
  },
];


/* ── Shared item style helpers ── */
function getItemStyle(isActive) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '11px 14px',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    background: nm.bg,
    boxShadow: isActive ? nm.shadowActiveAccent : nm.shadowSm,
    color: isActive ? nm.textActive : nm.textIdle,
    transform: isActive ? 'scale(0.98)' : 'scale(1)',
    position: 'relative',
  };
}

function getIconStyle(isActive) {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    flexShrink: 0,
    background: nm.bg,
    boxShadow: isActive ? nm.iconShadowActive : nm.iconShadow,
    color: isActive ? nm.iconActive : nm.iconIdle,
    transition: 'all 0.2s',
  };
}

export default function DashboardNav2() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, userProfile } = useAuth();
  const [availableMissions, setAvailableMissions] = useState(0);

  const handleDAGGPTRedirect = async () => {
    // Get wallet address from localStorage if not in userProfile
    let walletAddress = userProfile?.wallet_address;
    
    if (!walletAddress) {
      try {
        const stored = localStorage.getItem('dagarmy_user');
        if (stored) {
          const userData = JSON.parse(stored);
          walletAddress = userData.wallet_address;
        }
      } catch (error) {
        console.error('Error reading user data:', error);
      }
    }

    if (!walletAddress) {
      // If not logged in, just open DAGGPT
      window.open('https://daggpt.network', '_blank');
      return;
    }

    try {
      // Generate SSO token
      const response = await fetch('https://api.daggpt.network/api/auth/sso/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: walletAddress })
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.redirect_url, '_blank');
      } else {
        // Fallback to regular link if SSO fails
        window.open('https://daggpt.network', '_blank');
      }
    } catch (error) {
      console.error('SSO error:', error);
      window.open('https://daggpt.network', '_blank');
    }
  };

  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const stored = localStorage.getItem('dagarmy_user');
        if (!stored) return;
        const { email } = JSON.parse(stored);
        if (!email) return;
        const res = await fetch(`/api/social-tasks/user?user_email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success) setAvailableMissions(data.stats?.available || 0);
      } catch {}
    };
    fetchAvailable();
    const interval = setInterval(fetchAvailable, 60000);
    return () => clearInterval(interval);
  }, []);


  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleNavigation = (href) => {
    window.location.href = href;
  };

  /* Hover handlers */
  const onEnter = (e, isActive) => {
    if (!isActive) {
      e.currentTarget.style.boxShadow = nm.shadow;
      e.currentTarget.style.color = nm.textActive;
      e.currentTarget.style.transform = 'scale(1.01)';
    }
  };
  const onLeave = (e, isActive) => {
    if (!isActive) {
      e.currentTarget.style.boxShadow = nm.shadowSm;
      e.currentTarget.style.color = nm.textIdle;
      e.currentTarget.style.transform = 'scale(1)';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      height: '100%',
      background: nm.bg,
      padding: '0 8px 12px',
    }}>

      {/* Logo */}
      <div style={{
        padding: '20px 12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <img
          src="/images/logo/logo.png"
          alt="DAGARMY"
          style={{ width: '32px', height: 'auto', display: 'block', flexShrink: 0 }}
        />
        <span style={{
          fontFamily: 'Nasalization, sans-serif',
          fontSize: '16px',
          fontWeight: '700',
          color: '#1f2937',
          letterSpacing: '0.5px',
          lineHeight: 1,
        }}>DAGARMY</span>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', margin: '0 4px 16px' }} />

      {/* Nav items */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <style>{`
          @keyframes pulse-dot {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.55); opacity: 0.75; }
          }
        `}</style>
        {dashboardItems.map((item, index) => {
          const isActive = pathname === item.href;
          const isMission = item.href === '/student-tasks';
          const hasMissions = isMission && availableMissions > 0;
          const itemStyle = {
            ...getItemStyle(isActive),
            ...(hasMissions ? { border: '1.5px solid #ef4444', boxShadow: isActive ? nm.shadowActiveAccent : `${nm.shadowSm}, 0 0 0 0 rgba(239,68,68,0.15)` } : {}),
          };
          return (
            <React.Fragment key={index}>
              <div
                onClick={() => handleNavigation(item.href)}
                style={itemStyle}
                onMouseEnter={(e) => onEnter(e, isActive)}
                onMouseLeave={(e) => onLeave(e, isActive)}
              >
                <div style={getIconStyle(isActive)}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '13.5px', fontWeight: isActive ? '650' : '500', letterSpacing: '-0.1px', color: 'inherit', flex: 1 }}>
                  {item.label}
                </span>
                {hasMissions && (
                  <div style={{
                    width: '9px', height: '9px', borderRadius: '50%',
                    background: '#ef4444',
                    flexShrink: 0,
                    animation: 'pulse-dot 1.4s ease-in-out infinite',
                    boxShadow: '0 0 0 2px rgba(239,68,68,0.25)',
                  }} />
                )}
                {isActive && !hasMissions && (
                  <div style={{
                    marginLeft: 'auto',
                    width: '4px',
                    height: '20px',
                    borderRadius: '4px',
                    background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                    flexShrink: 0,
                  }} />
                )}
              </div>
              {item.divider && (
                <div style={{
                  height: '1px',
                  margin: '6px 4px',
                  background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)',
                }} />
              )}
            </React.Fragment>
          );
        })}

        {/* ── Ecosystem Links ── */}
        <div style={{ margin: '12px 0 6px', padding: '0 2px' }}>
          <div style={{
            fontSize: '9.5px',
            fontWeight: '700',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: '#9099b8',
            marginBottom: '6px',
            paddingLeft: '4px',
          }}>
            Explore Ecosystem
          </div>
          {/* DAGCHAIN */}
          <a
            href="https://dagchain.network"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: '12px',
              marginBottom: '5px',
              textDecoration: 'none',
              background: nm.bg,
              border: '1.5px solid #1a4a8a',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.9), inset 0 1px 0 rgba(98,207,244,0.15)',
              transition: 'all 0.18s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = '6px 5px 14px rgba(0,0,0,0.13), -3px -3px 8px rgba(255,255,255,0.9), inset 0 1px 0 rgba(98,207,244,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.9), inset 0 1px 0 rgba(98,207,244,0.15)'; }}
          >
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
              background: nm.bg,
              boxShadow: '3px 3px 7px rgba(0,0,0,0.12), -2px -2px 5px rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="/images/logo/dagchain-logo.png" alt="DAGCHAIN" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#1e293b', letterSpacing: '-0.1px' }}>DAGCHAIN</div>
              <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '1px' }}>dagchain.network</div>
            </div>
            <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          {/* DAGGPT */}
          <button
            onClick={handleDAGGPTRedirect}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: '12px',
              textDecoration: 'none',
              background: nm.bg,
              border: '1.5px solid #1a4a8a',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.9), inset 0 1px 0 rgba(98,207,244,0.15)',
              transition: 'all 0.18s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = '6px 5px 14px rgba(0,0,0,0.13), -3px -3px 8px rgba(255,255,255,0.9), inset 0 1px 0 rgba(98,207,244,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.9), inset 0 1px 0 rgba(98,207,244,0.15)'; }}
          >
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
              background: nm.bg,
              boxShadow: '3px 3px 7px rgba(0,0,0,0.12), -2px -2px 5px rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="/images/logo/daggpt-logo.png" alt="DAGGPT" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#1e293b', letterSpacing: '-0.1px' }}>DAGGPT</div>
              <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '1px' }}>daggpt.network</div>
            </div>
            <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* ── Logout ── */}
        <div
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            padding: '10px 13px',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
            background: nm.bg,
            boxShadow: '4px 4px 10px rgba(220,80,80,0.12), -3px -3px 8px rgba(255,255,255,1)',
            color: '#c0392b',
            marginTop: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '6px 6px 14px rgba(220,80,80,0.18), -4px -4px 10px rgba(255,255,255,1)';
            e.currentTarget.style.transform = 'scale(1.01)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '4px 4px 10px rgba(220,80,80,0.12), -3px -3px 8px rgba(255,255,255,1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
            background: nm.bg,
            boxShadow: '3px 3px 7px rgba(220,80,80,0.12), -2px -2px 5px rgba(255,255,255,1)',
            color: '#e74c3c',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: '600', letterSpacing: '-0.1px', color: 'inherit' }}>
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
