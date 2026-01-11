"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import MobileNav from "./MobileNav";
import PremiumButton from "../homes/home-2/PremiumButton";
export default function Header2() {
  return (
    <header id="header_main" className="header style-2" style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '8px 0' }}>
      <div className="header-inner">
        {/* Top Row: Logo, Search, Buttons */}
        <div className="header-inner-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          {/* Logo Section - Left */}
          <div id="site-logo" className="flex items-center gap-3" style={{ minWidth: '200px' }}>
            <Link href={`/`} rel="home" className="flex items-center gap-3">
              <Image
                id="logo-header"
                alt="DAGARMY"
                src="/images/logo/logo.png"
                width={62}
                height={18}
              />
              <span className="fw-7 fs-20" style={{ color: '#1f2937', fontFamily: 'Nasalization, sans-serif' }}>DAGARMY</span>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <div style={{ flex: '1', maxWidth: '600px', margin: '0 40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '24px',
              background: '#fff'
            }}>
              <i className="icon-search" style={{ color: '#6b7280', fontSize: '20px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search Opportunities"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  color: '#1f2937'
                }}
              />
            </div>
          </div>

          {/* Buttons - Right */}
          <div className="header-btn" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <PremiumButton
              text="Login"
              href="/login"
              style={{ minWidth: '100px', height: '42px', fontSize: '14px' }}
            />
            <Link
              href={`/register`}
              style={{
                height: '42px',
                padding: '0 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#8b5cf6',
                background: '#fff',
                border: '1px solid #8b5cf6',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f3ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
            >
              For Business
            </Link>
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

        {/* Bottom Row: Navigation Menu */}
        <div style={{
          borderTop: '1px solid #f3f4f6',
          background: '#fff'
        }}>
          <nav style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            justifyContent: 'center',
            height: '38px'
          }}>
            <Link href="/about" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              About
            </Link>
            <Link href="/courses" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              Courses
            </Link>
            <Link href="/jobs" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              Jobs
            </Link>
            <Link href="/training" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              Training
            </Link>
            <Link href="/mentorship" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              Mentorship
            </Link>
            <Link href="/competitions" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              Competitions
            </Link>
            <Link href="/quizzes" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              Quizzes
            </Link>
            <Link href="/hackathons" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              Hackathons
            </Link>
            <Link href="/blogs" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              Blogs
            </Link>
          </nav>
        </div>
      </div>
      <MobileNav />
    </header>
  );
}
