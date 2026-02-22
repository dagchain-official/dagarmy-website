"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const dashboardItems = [
  // Main Section
  {
    href: "/student-dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Dashboard",
  },
  {
    href: "/student-my-courses",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "My Courses",
  },
  {
    href: "/student-assignments",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Assignments",
  },
  {
    href: "/student-rewards",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Rewards",
  },
  {
    href: "/student-referral",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Referral",
  },
  {
    href: "/student-tasks",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Tasks",
  },
  {
    href: "/student-leaderboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 16v-3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="3" y="10" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Leaderboard",
  },
  {
    href: "/student-hall-of-fame",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M2 19h20v2H2zM2 17l4-10 6 6 4-8 4 12H2z"/>
      </svg>
    ),
    label: "Hall of Fame",
    divider: true,
  },
  // Analytics Section
  {
    href: "/student-analytics",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="20" x2="12" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="18" y1="20" x2="18" y2="4" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="6" y1="20" x2="6" y2="16" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Analytics",
  },
  {
    href: "/student-notifications",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Notifications",
    divider: true,
  },
  // Support Section
  {
    href: "/student-support",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Support",
  },
  {
    href: "/student-setting",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Settings/Profile",
  },
];

export default function DashboardNav2() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  useEffect(() => {
    const toggleElement = document.querySelector(
      ".dashboard_navigationbar .dropbtn"
    );
    const dashboardNav = document.querySelector(
      ".dashboard_navigationbar .instructors-dashboard"
    );
    
    // Only add event listeners if elements exist
    if (!toggleElement || !dashboardNav) {
      return;
    }
    
    const handleOutsideClick = (event) => {
      if (toggleElement && dashboardNav) {
        if (
          !toggleElement.contains(event.target) &&
          !dashboardNav.contains(event.target)
        ) {
          dashboardNav.classList.remove("show");
          toggleElement.classList.remove("show");
        }
      }
    };
    
    const toggleOpen = () => {
      toggleElement.classList.toggle("show");
      dashboardNav.classList.toggle("show");
    };
    
    toggleElement.addEventListener("click", toggleOpen);
    document.addEventListener("click", handleOutsideClick);
    
    return () => {
      toggleElement.removeEventListener("click", toggleOpen);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  
  const handleNavigation = (href, label) => {
    console.log('🖱️ Navigation clicked:', label, href);
    // Use window.location as fallback since router.push seems blocked
    window.location.href = href;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      height: '100%',
      background: '#ffffff',
      borderRight: '1px solid #e5e7eb',
    }}>
      {/* Navigation Items */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'visible' }}>
        {dashboardItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <React.Fragment key={index}>
              <div
                onClick={() => handleNavigation(item.href, item.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : '#6b7280',
                  position: 'relative',
                  boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                  transform: isActive ? 'translateX(2px)' : 'translateX(0)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.color = '#111827';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                }}>
                  {item.icon}
                </div>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: isActive ? '600' : '500',
                  letterSpacing: '-0.2px',
                }}>
                  {item.label}
                </span>
              </div>
              {item.divider && (
                <div style={{
                  height: '1px',
                  background: '#f3f4f6',
                  margin: '12px 0',
                }} />
              )}
            </React.Fragment>
          );
        })}
        
        {/* Ecosystem Links */}
        <div style={{ margin: '16px 0 8px', padding: '0 2px' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#9ca3af',
            marginBottom: '8px',
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
              padding: '10px 12px',
              borderRadius: '10px',
              marginBottom: '6px',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              border: '1px solid rgba(99,102,241,0.2)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.2px' }}>DAGCHAIN</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '1px' }}>dagchain.network</div>
            </div>
            <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          {/* DAGGPT */}
          <a
            href="https://daggpt.network"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #0c1a0f 0%, #14291a 100%)',
              border: '1px solid rgba(34,197,94,0.2)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(34,197,94,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round"/>
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2v4h-4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.2px' }}>DAGGPT</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '1px' }}>daggpt.network</div>
            </div>
            <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Logout Item */}
        <div
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'transparent',
            color: '#ef4444',
            marginTop: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2';
            e.currentTarget.style.color = '#dc2626';
            e.currentTarget.style.transform = 'translateX(2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: '500',
            letterSpacing: '-0.2px',
          }}>
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
