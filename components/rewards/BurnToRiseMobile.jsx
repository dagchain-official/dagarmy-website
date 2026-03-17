"use client";
import React from 'react';

// Burn To Rise Card Component for Mobile Slider - Unique Dark Design
export const BurnToRiseCard = ({ title, description, cardIndex = 0 }) => {
  // Different gradient backgrounds for each card
  const gradients = [
    'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)', // Orange-Red for Commitment
    'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)', // Purple for Reward
    'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)'  // Green-Blue for Benefit
  ];

  const accentColors = [
    'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)', // Orange-Red
    'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', // Purple
    'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)'  // Green-Blue
  ];

  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)`,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '32px 28px',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      width: '100%',
      margin: 0
    }}>
      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: gradients[cardIndex % 3],
        opacity: 0.6,
        zIndex: 0
      }} />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '50px',
          height: '4px',
          background: accentColors[cardIndex % 3],
          marginBottom: '18px',
          borderRadius: '2px'
        }} />
        <h5 style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '14px',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          {title}
        </h5>
        <p style={{
          fontSize: '15px',
          color: 'rgba(255, 255, 255, 0.85)',
          lineHeight: '1.7',
          margin: 0
        }}>
          {description}
        </p>
      </div>
    </div>
  );
};
