"use client";
import React from 'react';

/**
 * Choose Your Path Card Components for Mobile Slider
 * Professional card design for DAG Soldier and DAG Lieutenant
 */

export const PathCard = ({ 
  badgeImage, 
  title, 
  focus, 
  focusColor = '#3b82f6',
  description, 
  items,
  footerText,
  isPremium = false 
}) => {
  return (
    <div style={{
      background: isPremium 
        ? 'rgba(239, 246, 255, 0.3)' 
        : '#ffffff',
      border: isPremium 
        ? '2px solid transparent' 
        : '1px solid #e5e7eb',
      backgroundImage: isPremium 
        ? 'linear-gradient(white, white), linear-gradient(to right, #3b82f6, #a855f7)' 
        : 'none',
      backgroundOrigin: isPremium ? 'border-box' : 'padding-box',
      backgroundClip: isPremium ? 'padding-box, border-box' : 'padding-box',
      borderRadius: '16px',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: isPremium 
        ? '0 15px 45px rgba(124, 92, 255, 0.12)' 
        : '0 10px 40px rgba(0, 0, 0, 0.05)',
      minHeight: '480px'
    }}>
      {/* Badge Image */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <img 
          src={badgeImage}
          alt={`${title} Badge`}
          style={{
            width: '110px',
            height: '110px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Georgia, serif',
        fontSize: '28px',
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
        marginBottom: '8px'
      }}>
        {title}
      </h3>

      {/* Focus */}
      <p style={{
        textAlign: 'center',
        fontSize: '15px',
        fontWeight: '600',
        marginBottom: '12px',
        letterSpacing: '0.3px'
      }}>
        <span style={{ color: '#9ca3af', fontWeight: '500' }}>Focus:</span>{' '}
        <span style={{ color: focusColor }}>{focus}</span>
      </p>

      {/* Description */}
      <p style={{
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: '1.6',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        {description}
      </p>

      {/* Items List */}
      <ul style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px',
        listStyle: 'none',
        padding: 0
      }}>
        {items.map((item, index) => (
          <li key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '8px 12px',
            background: isPremium 
              ? 'rgba(243, 232, 255, 0.3)' 
              : 'rgba(249, 250, 251, 0.8)',
            borderRadius: '8px',
            border: isPremium 
              ? '1px solid rgba(168, 85, 247, 0.2)' 
              : '1px solid rgba(229, 231, 235, 0.6)'
          }}>
            <svg 
              style={{ 
                width: '18px', 
                height: '18px', 
                color: '#10b981', 
                marginTop: '2px', 
                flexShrink: 0 
              }} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2.5" 
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span style={{
              fontSize: '13px',
              color: '#374151',
              fontWeight: '500',
              lineHeight: '1.5'
            }}>
              {item}
            </span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div style={{
        marginTop: 'auto',
        padding: '16px 20px',
        background: isPremium 
          ? 'rgba(124, 92, 255, 0.06)' 
          : 'rgba(0, 0, 0, 0.02)',
        borderTop: isPremium 
          ? '1px solid rgba(124, 92, 255, 0.2)' 
          : '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '0 0 12px 12px',
        margin: '0 -24px -28px'
      }}>
        <p style={{
          fontSize: '12px',
          color: '#4b5563',
          textAlign: 'center',
          fontWeight: '500',
          lineHeight: '1.5',
          margin: 0
        }}>
          {footerText}
        </p>
      </div>
    </div>
  );
};
