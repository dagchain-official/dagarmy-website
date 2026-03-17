"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Specialized Tier Mobile Slider for Ambassador Tiers Section
 * Features:
 * - Dynamic auto-play timing (Silver: 3s, Gold: 3s, Platinum: 6s)
 * - Thematic dot colors (Silver: gray, Gold: gold, Platinum: metallic)
 * - Platinum dot pulsing animation
 * - Touch swipe support
 */
export default function TierMobileSlider({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Dynamic timing based on current slide
  const getSlideInterval = (index) => {
    if (index === 0) return 3000; // Silver: 3 seconds
    if (index === 1) return 3000; // Gold: 3 seconds
    if (index === 2) return 6000; // Platinum: 6 seconds
    return 3000;
  };

  // Auto-cycle with dynamic timing
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      paginate(1);
    }, getSlideInterval(currentIndex));

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

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
    }
    if (isRightSwipe) {
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

  // Get thematic color for active dot
  const getDotColor = (index) => {
    if (index === 0) return '#9ca3af'; // Silver
    if (index === 1) return 'linear-gradient(to right, #bf953f, #b38728)'; // Gold
    if (index === 2) return '#111111'; // Platinum (dark obsidian/chrome)
    return '#d1d5db';
  };

  return (
    <div 
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

      {/* Custom Thematic Dot Indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '24px',
        paddingBottom: '8px'
      }}>
        {items.map((_, index) => {
          const isActive = currentIndex === index;
          const isPlatinum = index === 2 && isActive;
          
          return (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              style={{
                width: isActive ? '24px' : '8px',
                height: '8px',
                borderRadius: isPlatinum ? '12px' : '4px',
                border: isPlatinum ? '1.5px solid #e5e7eb' : 'none',
                background: isActive ? getDotColor(index) : '#d1d5db',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                animation: isPlatinum ? 'platinumBreathingGlow 2s ease-in-out infinite' : 'none'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>

      {/* Platinum Breathing Glow Animation */}
      <style jsx>{`
        @keyframes platinumBreathingGlow {
          0% {
            box-shadow: 0 0 0px rgba(209, 213, 219, 0);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 14px rgba(209, 213, 219, 1);
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 0 0px rgba(209, 213, 219, 0);
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
