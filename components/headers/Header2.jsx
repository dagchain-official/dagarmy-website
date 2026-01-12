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
              className="relative flex items-center gap-1 bg-[#8b5cf6] px-6 py-2 border-2 border-[#8b5cf6] text-sm rounded-xl font-semibold text-white cursor-pointer overflow-hidden transition-all duration-600 ease-in-out hover:text-white hover:rounded-3xl group hover:transition-all hover:duration-700"
              style={{ textDecoration: 'none', height: '42px', minWidth: '140px', justifyContent: 'center' }}
            >
              <svg
                viewBox="0 0 24 24"
                className="absolute w-5 fill-white z-[20] transition-all duration-700 ease-in-out -left-1/4 group-hover:left-3 group-hover:fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                ></path>
              </svg>
              <span
                className="relative z-[10] transition-all duration-700 ease-in-out -translate-x-2 group-hover:translate-x-2"
              >
                For Business
              </span>
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#131836] rounded-full opacity-0 transition-all duration-700 ease-in-out group-hover:w-[150px] group-hover:h-[150px] group-hover:opacity-100 z-[0]"
              ></span>
              <svg
                viewBox="0 0 24 24"
                className="absolute w-5 fill-white z-[20] transition-all duration-700 ease-in-out right-3 group-hover:-right-1/4 group-hover:fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                ></path>
              </svg>
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
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '6px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b5cf6';
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
                background: 'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/courses" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '6px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b5cf6';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              Courses
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/jobs" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '6px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b5cf6';
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
                background: 'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/mentorship" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '6px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b5cf6';
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
                background: 'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/hackathons" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '6px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b5cf6';
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
                background: 'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
            <Link href="/blogs" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
              paddingBottom: '6px',
              display: 'inline-block'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b5cf6';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                const underline = e.currentTarget.querySelector('.nav-underline');
                if (underline) underline.style.width = '0%';
              }}>
              Blogs
              <span className="nav-underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '0%',
                height: '2px',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </Link>
          </nav>
        </div>
      </div>
      <MobileNav />
    </header>
  );
}
