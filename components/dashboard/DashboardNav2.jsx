"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const dashboardItems = [
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
    active: true,
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
    href: "/student-reviews",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Reviews",
  },
  {
    href: "/student-wishlist",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Wishlist",
  },
  { 
    href: "/student-order", 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Order" 
  },
  {
    href: "/student-setting",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Settings",
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
      height: '100%',
    }}>
      {/* Logo Section */}
      <div style={{
        marginBottom: '32px',
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#ffffff',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '800',
          }}>
            D
          </div>
          DAGARMY
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {dashboardItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <div
              key={index}
              onClick={() => handleNavigation(item.href, item.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: isActive ? '#6366f1' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                opacity: isActive ? 1 : 0.8,
              }}>
                {item.icon}
              </div>
              <span style={{ 
                fontSize: '13px', 
                fontWeight: isActive ? '600' : '500',
              }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Logout Section */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: 'transparent',
            color: 'rgba(239, 68, 68, 0.9)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(239, 68, 68, 0.9)';
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ 
            fontSize: '13px', 
            fontWeight: '500',
          }}>
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
