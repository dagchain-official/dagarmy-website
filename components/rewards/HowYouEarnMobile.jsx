"use client";
import React from 'react';

// Professional Icons for How You Earn
export const LearningIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

export const SharingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export const CreatingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
  </svg>
);

// Checklist Card Component for Mobile Slider
export const ChecklistCard = ({ icon, title, description }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '32px 24px',
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }}>
    <div style={{
      width: '56px',
      height: '56px',
      background: 'rgba(99, 102, 241, 0.1)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px'
    }}>
      {icon}
    </div>
    <h4 style={{
      fontSize: '20px',
      fontWeight: '700',
      color: '#000000',
      marginBottom: '12px',
      letterSpacing: '-0.01em'
    }}>
      {title}
    </h4>
    <p style={{
      fontSize: '14px',
      color: '#6b7280',
      lineHeight: '1.6',
      margin: 0,
      maxWidth: '280px'
    }}>
      {description}
    </p>
  </div>
);
