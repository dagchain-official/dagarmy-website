"use client";
import React from "react";
import { usePathname } from "next/navigation";
import "./MobileNav.css";

export default function MobileNav({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      {/* Dark Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          backdropFilter: 'blur(3px)'
        }}
        onClick={onClose}
      />
      
      {/* Mobile Navigation Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '85vw',
        maxWidth: '320px',
        height: '100vh',
        background: '#ffffff',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.2)',
        zIndex: 9999,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderTopRightRadius: '18px',
        borderBottomRightRadius: '18px'
      }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          background: '#ffffff',
          flexShrink: 0
        }}>
          <div style={{
            fontFamily: 'Nasalization, sans-serif',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            letterSpacing: '0.5px'
          }}>
            DAGARMY
          </div>
          <button 
            onClick={onClose}
            aria-label="Close menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#6b7280',
              cursor: 'pointer'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          margin: 0,
          flex: 1,
          background: '#ffffff'
        }}>
          <a href="/" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>Home</a>
          <a href="/about" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/about'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>About</a>
          <a href="/courses" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/courses'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>Courses</a>
          <a href="/careers" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/careers'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>Careers</a>
          <a href="/ambassador" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/ambassador'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>Ambassador</a>
          <a href="/udaan" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/udaan'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>
            <span style={{ fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)', backgroundSize: '300% 300%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Udaan</span>
          </a>
          <a href="/jobs" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/jobs'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>Jobs</a>
          <a href="/mentorship" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/mentorship'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>Mentorship</a>
          <a href="/rewards" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/rewards'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>Rewards</a>
          <a href="/hackathons" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/hackathons'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>Hackathons</a>
          <a href="/blog" onClick={(e) => { e.preventDefault(); onClose(); window.location.href = '/blog'; }} style={{ display: 'flex', alignItems: 'center', minHeight: '48px', padding: '14px 24px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>Blog</a>
        </div>
      </div>
    </>
  );
}
