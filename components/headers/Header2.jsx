"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import MobileNav from "./MobileNav";
import LoginModal from "../auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/dashboard/NotificationBell";
import UdaanDropdown from "./UdaanDropdown";
import styles from "./AnimatedSignInButton.module.css";


export default function Header2() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUdaanDropdown, setShowUdaanDropdown] = useState(false);
  const { isAuthenticated, userRole, isAdmin } = useAuth();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const udaanCloseTimeoutRef = useRef(null);

  // Close modal if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated]);

  const handleSignInClick = async () => {
    sessionStorage.removeItem('dagarmy_logged_out');
    
    // Disconnect any existing wallet connection to show account selection
    try {
      await disconnect();
    } catch (error) {
      console.log('No wallet to disconnect:', error);
    }
    
    setShowLoginModal(true);
    
    // Small delay to ensure disconnect completes before opening modal
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.modal) {
        window.modal.open();
      }
    }, 100);
  };

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
    <header id="header_main" className="header style-2" style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 0' }}>
      <div className="header-inner">
        {/* Single Row: Logo - Search - Menu - Login - Register */}
        <div className="header-inner-wrap" style={{ display: 'flex', alignItems: 'center', gap: '80px', maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Logo Section */}
          <div id="site-logo" className="flex items-center gap-3" style={{ minWidth: '180px' }}>
            <Link href={`/`} rel="home" className="flex items-center gap-3">
              <Image
                id="logo-header"
                alt="DAGARMY"
                src="/images/logo/logo.png"
                width={62}
                height={18}
              />
              <span className="fw-7" style={{ color: '#1f2937', fontFamily: 'Nasalization, sans-serif', fontSize: '25px' }}>DAGARMY</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
            flex: 1
          }}>
            <Link href="/about" style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '4px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              About
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: '#1f2937',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/courses" style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '4px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              Course
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: '#1f2937',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/careers" style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '4px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              Careers
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: '#1f2937',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/ambassador" style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '4px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              Ambassador
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: '#1f2937',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
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
              fontSize: '15px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '4px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              Jobs
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: '#1f2937',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/mentorship" style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '4px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              Mentorship
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: '#1f2937',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/rewards" style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '4px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              Rewards
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: '#1f2937',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/hackathons" style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '4px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              Hackathons
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: '#1f2937',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/blog" style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '4px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1f2937';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              Blog
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: '#1f2937',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
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

          {/* Mobile Menu Toggle */}
          <a
            className="mobile-nav-toggler mobile-button d-lg-none flex"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
            style={{ marginLeft: '12px' }}
          />
        </div>
      </div>
      <MobileNav />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  );
}
