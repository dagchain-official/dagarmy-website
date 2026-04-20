"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import "./MobileNav.css";

export default function MobileNav({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const handleAuthClick = () => {
    onClose();
    if (isAuthenticated) {
      router.push(isAdmin ? '/admin/dashboard' : '/dashboard');
    } else {
      // Trigger the sign-in modal via custom event
      window.dispatchEvent(new Event('dagarmy:open-signin'));
    }
  };

  const navLink = (href, label, isGradient = false) => (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); onClose(); window.location.href = href; }}
      style={{
        display: 'flex', alignItems: 'center', minHeight: '50px',
        padding: '14px 24px', textDecoration: 'none',
        borderBottom: '1px solid #f3f4f6', background: '#ffffff',
        fontSize: '15px', fontWeight: pathname === href ? '700' : '500',
        color: pathname === href ? '#4f46e5' : '#374151',
        borderLeft: pathname === href ? '3px solid #4f46e5' : '3px solid transparent',
        transition: 'all 0.15s ease',
      }}
    >
      {isGradient ? (
        <span style={{
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>{label}</span>
      ) : label}
    </a>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.45)', zIndex: 9998, backdropFilter: 'blur(3px)',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '82vw', maxWidth: '300px',
        height: '70vh', maxHeight: '560px',
        background: '#ffffff',
        boxShadow: '4px 0 32px rgba(0,0,0,0.18)',
        zIndex: 9999, overflowY: 'hidden', overflowX: 'hidden',
        display: 'flex', flexDirection: 'column',
        borderTopRightRadius: '20px', borderBottomRightRadius: '20px',
      }}>

        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid #e5e7eb',
          background: '#ffffff', flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'Nasalization, sans-serif',
            fontSize: '18px', fontWeight: '700', color: '#1f2937', letterSpacing: '0.5px',
          }}>DAGARMY</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', background: '#f9fafb',
              border: 'none', borderRadius: '8px', color: '#6b7280', cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav links — scrollable inside the capped drawer */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          {navLink('/', 'Home')}
          {navLink('/about', 'About')}
          {/* COMING SOON — Courses hidden from nav, in footer with Soon tag
          {navLink('/courses', 'Courses')}
          */}
          {navLink('/careers', 'Careers')}
          {navLink('/ambassador', 'Ambassador')}
          {navLink('/udaan', 'Udaan ✦', true)}
          {navLink('/jobs', 'Jobs')}
          {/* COMING SOON — Mentorship hidden from nav, in footer with Soon tag
          {navLink('/mentorship', 'Mentorship')}
          */}
          {navLink('/rewards-overview', 'Rewards')}
          {/* COMING SOON — Hackathons hidden from nav, in footer with Soon tag
          {navLink('/hackathons', 'Hackathons')}
          */}
          {navLink('/blog', 'Blog')}
          {navLink('/faq', 'FAQ')}
        </div>

        {/* Auth CTA pinned at bottom */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', flexShrink: 0 }}>
          <button
            onClick={handleAuthClick}
            style={{
              width: '100%', padding: '14px 20px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#ffffff', border: 'none', borderRadius: '14px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
              letterSpacing: '0.2px',
            }}
          >
            {isAuthenticated ? '→ Go to Dashboard' : 'Sign In / Join Free'}
          </button>
        </div>
      </div>
    </>
  );
}
