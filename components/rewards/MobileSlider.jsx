"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Professional Cycle Loop Slider Component
 * Features:
 * - Smooth slide animations
 * - Auto-cycle with pause on hover
 * - Touch swipe support
 * - Dot indicators
 * - Only active on mobile (<768px)
 */
export default function MobileSlider({ 
  items, 
  autoPlayInterval = 4000,
  className = ""
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-cycle logic
  useEffect(() => {
    if (isPaused || !autoPlayInterval) return;
    
    const interval = setInterval(() => {
      paginate(1);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, autoPlayInterval]);

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return (prevIndex + 1) % items.length;
      } else {
        return prevIndex === 0 ? items.length - 1 : prevIndex - 1;
      }
    });
  }, [items.length]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      paginate(1);
    } else if (isRightSwipe) {
      paginate(-1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  return (
    <div 
      className={className}
      style={{ 
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Container */}
      <div style={{ 
        position: 'relative',
        width: '100%'
      }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            style={{
              width: '100%'
            }}
          >
            {items[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '24px',
        paddingBottom: '8px'
      }}>
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            style={{
              width: currentIndex === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              border: 'none',
              background: currentIndex === index 
                ? 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
                : '#d1d5db',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows (Optional - shown on hover) */}
      <button
        onClick={() => paginate(-1)}
        style={{
          position: 'absolute',
          left: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: isPaused ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
        aria-label="Previous slide"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        onClick={() => paginate(1)}
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: isPaused ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
        aria-label="Next slide"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
