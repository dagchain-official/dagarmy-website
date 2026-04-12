"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
// wagmi removed — no longer needed

import MobileNav from "./MobileNav";
import LoginModal from "../auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/dashboard/NotificationBell";
import UdaanDropdown from "./UdaanDropdown";
import styles from "./AnimatedSignInButton.module.css";


export default function Header2() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUdaanDropdown, setShowUdaanDropdown] = useState(false);
  const [showSupportDropdown, setShowSupportDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, userRole, isAdmin } = useAuth();
  const router = useRouter();
  const { logout } = useAuth();

  const udaanCloseTimeoutRef = useRef(null);
  const supportCloseTimeoutRef = useRef(null);

  // Close modal if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated]);

  const handleSignInClick = async () => {
    sessionStorage.removeItem('dagarmy_logged_out');
    
    // Wallet disconnection removed — now using email/Google auth
    setShowLoginModal(true);

  };

  // Auto-open signin modal when redirected from /register
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('signin') === '1') handleSignInClick();
    }
  }, [isAuthenticated]);

  // Listen for sign-in trigger from other components (e.g. Pledge modal)
  useEffect(() => {
    const handler = () => handleSignInClick();
    window.addEventListener("dagarmy:open-signin", handler);
    return () => window.removeEventListener("dagarmy:open-signin", handler);
  }, [handleSignInClick]);

  const handleDashboardClick = () => {
    // Navigate to appropriate dashboard based on role
    if (isAdmin) {
      router.push('/admin/dashboard');
    } else {
      router.push('/student-dashboard');
    }
  };
  return (
    <header 
      id="header_main" 
      className="header style-2"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        zIndex: '9999',
        width: '100%',
        background: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '10px 0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)'
      }}
    >
      <div className="header-inner">
        {/* Single Row: Logo - Search - Menu - Login - Register */}
        <div className="header-inner-wrap" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 40px)', maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(12px, 2vw, 24px)' }}>
          
          {/* Logo Section */}
          <div id="site-logo" className="flex items-center gap-3" style={{ minWidth: 'clamp(140px, 13vw, 180px)' }}>
            <Link href={`/`} rel="home" className="flex items-center gap-3">
              <Image
                id="logo-header"
                alt="DAGARMY"
                src="/images/logo/logo.png"
                width={62}
                height={18}
              />
              <span className="fw-7" style={{ color: '#1f2937', fontFamily: 'Nasalization, sans-serif', fontSize: 'clamp(17px, 1.6vw, 25px)' }}>DAGARMY</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav style={{
            display: 'flex',
            gap: 'clamp(4px, 0.8vw, 16px)',
            alignItems: 'center',
            flex: 1
          }}>
            <Link href="/about" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '50px',
              background: '#ffffff',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                e.currentTarget.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)';
              }}>
              About
            </Link>
            <Link href="/courses" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '50px',
              background: '#ffffff',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                e.currentTarget.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)';
              }}>
              Course
            </Link>
            <Link href="/careers" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '50px',
              background: '#ffffff',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                e.currentTarget.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)';
              }}>
              Careers
            </Link>
            <Link href="/ambassador" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '50px',
              background: '#ffffff',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                e.currentTarget.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)';
              }}>
              Ambassador
            </Link>
            <div
              style={{ position: 'relative', paddingBottom: '8px' }}
              onMouseEnter={() => {
                // Clear any pending close timeout
                if (udaanCloseTimeoutRef.current) {
                  clearTimeout(udaanCloseTimeoutRef.current);
                  udaanCloseTimeoutRef.current = null;
                }
                setShowUdaanDropdown(true);
              }}
              onMouseLeave={() => {
                // Add 300ms delay before closing
                udaanCloseTimeoutRef.current = setTimeout(() => {
                  setShowUdaanDropdown(false);
                }, 300);
              }}
            >
              <Link href="/udaan" className="udaan-menu-item" style={{
                fontSize: '15px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                position: 'relative',
                paddingBottom: '4px',
                display: 'inline-block',
                animation: 'udaanGlow 4s ease infinite, udaanFloat 2s ease-in-out infinite',
                filter: 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.4))'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                  e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(102, 126, 234, 0.6))';
                  const underline = e.currentTarget.querySelector('.nav-underline');
                  if (underline) underline.style.width = '100%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.4))';
                  const underline = e.currentTarget.querySelector('.nav-underline');
                  if (underline) underline.style.width = '0%';
                }}>
                Udaan
                <span className="nav-underline" style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '0%',
                  height: '2px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
                  boxShadow: '0 0 8px rgba(102, 126, 234, 0.5)',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </Link>
              <UdaanDropdown isVisible={showUdaanDropdown} />
            </div>
            <style jsx>{`
              @keyframes udaanGlow {
                0%, 100% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
              }
              @keyframes udaanFloat {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-3px);
                }
              }
            `}</style>
            <Link href="/jobs" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '50px',
              background: '#ffffff',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                e.currentTarget.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)';
              }}>
              Jobs
            </Link>
            <Link href="/mentorship" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '50px',
              background: '#ffffff',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                e.currentTarget.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)';
              }}>
              Mentorship
            </Link>
            <Link href="/rewards" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '50px',
              background: '#ffffff',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                e.currentTarget.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)';
              }}>
              Rewards
            </Link>
            <Link href="/hackathons" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '50px',
              background: '#ffffff',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                e.currentTarget.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)';
              }}>
              Hackathons
            </Link>
            <div
              style={{ position: 'relative', paddingBottom: '8px' }}
              onMouseEnter={() => {
                if (supportCloseTimeoutRef.current) {
                  clearTimeout(supportCloseTimeoutRef.current);
                  supportCloseTimeoutRef.current = null;
                }
                setShowSupportDropdown(true);
              }}
              onMouseLeave={() => {
                supportCloseTimeoutRef.current = setTimeout(() => {
                  setShowSupportDropdown(false);
                }, 250);
              }}
            >
              <button
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: showSupportDropdown ? '#1f2937' : '#4b5563',
                  background: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '50px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  boxShadow: showSupportDropdown
                    ? 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)'
                    : '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)',
                  transition: 'all 0.25s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#1f2937';
                  e.currentTarget.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = showSupportDropdown ? '#1f2937' : '#4b5563';
                  e.currentTarget.style.boxShadow = showSupportDropdown
                    ? 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)'
                    : '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)';
                }}
              >
                Support
                <svg
                  width="13" height="13"
                  viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: 'transform 0.2s ease', transform: showSupportDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Support dropdown */}
              {showSupportDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: '6px 6px 20px rgba(0,0,0,0.10), -2px -2px 8px rgba(255,255,255,0.9)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(8px)',

                  padding: '8px',
                  minWidth: '180px',
                  zIndex: 1000,
                  animation: 'fadeInDown 0.18s ease',
                }}>
                  <Link
                    href="/blog"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '9px 14px', borderRadius: '9px',
                      textDecoration: 'none', color: '#374151',
                      fontSize: '14px', fontWeight: '500',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.boxShadow = 'inset 2px 2px 5px #c5c7cd, inset -2px -2px 5px #ffffff'; e.currentTarget.style.borderRadius = '50px'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                    onClick={() => setShowSupportDropdown(false)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6b7280' }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Blog
                  </Link>
                  <Link
                    href="/faq"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '9px 14px', borderRadius: '9px',
                      textDecoration: 'none', color: '#374151',
                      fontSize: '14px', fontWeight: '500',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.boxShadow = 'inset 2px 2px 5px #c5c7cd, inset -2px -2px 5px #ffffff'; e.currentTarget.style.borderRadius = '50px'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                    onClick={() => setShowSupportDropdown(false)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6b7280' }}>
                      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    FAQ
                  </Link>
                </div>
              )}
            </div>
            <style>{`
              @keyframes fadeInDown {
                from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
                to   { opacity: 1; transform: translateX(-50%) translateY(0); }
              }
            `}</style>
          </nav>

          {/* Sign In / Dashboard Button - Animated */}
          <div className="header-btn" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Notification Bell - Only show for authenticated users */}
            {isAuthenticated && <NotificationBell />}
            
            <button
              onClick={isAuthenticated ? handleDashboardClick : handleSignInClick}
              className={styles.animatedSigninBtn}
            >
              {isAuthenticated ? (
                <>
                  <span>D</span>
                  <span>a</span>
                  <span>s</span>
                  <span>h</span>
                  <span>b</span>
                  <span>o</span>
                  <span>a</span>
                  <span>r</span>
                  <span>d</span>
                </>
              ) : (
                <>
                  <span>S</span>
                  <span>i</span>
                  <span>g</span>
                  <span>n</span>
                  <span> </span>
                  <span>I</span>
                  <span>n</span>
                </>
              )}
            </button>
            {/* Register button commented out - using Sign In for both new and returning users */}
            {/* <Link
              href={`/register`}
              className="relative flex items-center gap-1 bg-[#1f2937] px-5 py-2 border-2 border-[#1f2937] text-sm rounded-xl font-semibold text-white cursor-pointer overflow-hidden transition-all duration-600 ease-in-out hover:text-white hover:rounded-3xl group hover:transition-all hover:duration-700"
              style={{ textDecoration: 'none', height: '38px', minWidth: '120px', justifyContent: 'center' }}
            >
              <svg
                viewBox="0 0 24 24"
                className="absolute w-4 fill-white z-[20] transition-all duration-700 ease-in-out -left-1/4 group-hover:left-2 group-hover:fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                ></path>
              </svg>
              <span
                className="relative z-[10] transition-all duration-700 ease-in-out -translate-x-2 group-hover:translate-x-2"
              >
                Register
              </span>
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#131836] rounded-full opacity-0 transition-all duration-700 ease-in-out group-hover:w-[150px] group-hover:h-[150px] group-hover:opacity-100 z-[0]"
              ></span>
              <svg
                viewBox="0 0 24 24"
                className="absolute w-4 fill-white z-[20] transition-all duration-700 ease-in-out right-2 group-hover:-right-1/4 group-hover:fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                ></path>
              </svg>
            </Link> */}
          </div>

          {/* Mobile Menu Toggle - Hamburger to X Animation */}
          <button
            className="mobile-nav-toggler"
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.boxShadow = 'inset 2px 2px 5px rgba(0,0,0,0.07), inset -1px -1px 4px rgba(255,255,255,0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{
              width: '24px',
              height: '2.5px',
              background: '#1f2937',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: isMobileMenuOpen ? 'rotate(45deg) translateY(7.5px)' : 'rotate(0)',
            }} />
            <span style={{
              width: '24px',
              height: '2.5px',
              background: '#1f2937',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              opacity: isMobileMenuOpen ? 0 : 1,
            }} />
            <span style={{
              width: '24px',
              height: '2.5px',
              background: '#1f2937',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-7.5px)' : 'rotate(0)',
            }} />
          </button>
        </div>
      </div>
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  );
}
