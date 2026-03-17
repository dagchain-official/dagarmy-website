"use client";
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Arrow Divider Component
 * Animated downward arrow with "Earn Your Rank" text
 * Used in Choose Your Path section for mobile storytelling
 */
export default function ArrowDivider({ delay = 1.0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 0',
        position: 'relative'
      }}
    >
      {/* Text Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #6366f1 100%)'
        }} />
        <span style={{
          fontSize: '12px',
          fontWeight: '700',
          color: '#6366f1',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          textAlign: 'center'
        }}>
          Earn Your Rank
        </span>
        <div style={{
          width: '40px',
          height: '2px',
          background: 'linear-gradient(90deg, #6366f1 0%, transparent 100%)'
        }} />
      </div>

      {/* Premium SVG Arrow */}
      <motion.div
        animate={{
          y: [0, 8, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Circle */}
          <circle
            cx="24"
            cy="24"
            r="23"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="rgba(99, 102, 241, 0.05)"
          />
          
          {/* Arrow Path */}
          <path
            d="M24 14 L24 34 M24 34 L18 28 M24 34 L30 28"
            stroke="url(#gradient2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="24" y1="14" x2="24" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Subtitle */}
      <p style={{
        fontSize: '11px',
        color: '#9ca3af',
        marginTop: '12px',
        fontWeight: '500',
        letterSpacing: '0.5px'
      }}>
        Path to Advancement
      </p>
    </motion.div>
  );
}
