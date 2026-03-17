"use client";
import React from 'react';

/**
 * Ecosystem Grants Card Component for Mobile Slider
 * Professional card design for Ecosystem Grants & Fellowships section
 */
export const EcosystemCard = ({ tag, title, description }) => {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
      width: '100%'
    }}>
      {/* Tag */}
      <p style={{
        fontSize: '9px',
        fontWeight: '700',
        color: '#6366f1',
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        marginBottom: '12px'
      }}>
        {tag}
      </p>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        fontWeight: '700',
        color: '#000000',
        marginBottom: '12px',
        letterSpacing: '-0.01em',
        lineHeight: '1.2'
      }}>
        {title}
      </h3>

      {/* Divider */}
      <div style={{
        width: '40px',
        height: '2px',
        background: '#d1d5db',
        marginBottom: '12px'
      }} />

      {/* Description */}
      <p style={{
        fontSize: '13px',
        color: '#6b7280',
        lineHeight: '1.6',
        margin: 0
      }}>
        {description}
      </p>
    </div>
  );
};
