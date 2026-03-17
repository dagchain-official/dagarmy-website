"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Animated Progress Arrow Component
 * Loading bar style arrow with text animation
 * Used between DAG Soldier and DAG Lieutenant cards
 */
export default function ProgressArrow({ onComplete, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Trigger completion after animation finishes
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onComplete]);

  if (!isVisible) return null;

  return (
    <div style={{
      padding: '40px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      {/* Animated Text Above Arrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          fontSize: '12px',
          fontWeight: '700',
          color: '#6366f1',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          textAlign: 'center',
          marginBottom: '8px'
        }}
      >
        Path to Advancement
      </motion.div>

      {/* Large Right-Pointing Arrow with Text */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '24px 32px',
          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.15) 100%)',
          borderRadius: '12px',
          position: 'relative'
        }}
      >
        {/* Text on Arrow */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#6366f1',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            whiteSpace: 'nowrap'
          }}
        >
          Earn Your Rank
        </motion.span>

        {/* Large Right Arrow SVG */}
        <motion.svg
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut"
          }}
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Circle */}
          <circle
            cx="32"
            cy="32"
            r="30"
            stroke="url(#arrowGradient)"
            strokeWidth="3"
            fill="rgba(99, 102, 241, 0.08)"
          />
          
          {/* Right-Pointing Arrow */}
          <path
            d="M22 32 L42 32 M42 32 L36 26 M42 32 L36 38"
            stroke="url(#arrowGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="arrowGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Pulse Animation on Arrow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            right: '20px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      </motion.div>

      {/* Subtitle Below Arrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{
          fontSize: '11px',
          color: '#9ca3af',
          fontWeight: '500',
          letterSpacing: '0.5px',
          textAlign: 'center',
          marginTop: '12px'
        }}
      >
        Building Your Leadership Path
      </motion.div>
    </div>
  );
}
