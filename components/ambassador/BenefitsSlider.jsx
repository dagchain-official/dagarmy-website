"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Benefits Slider for "Ambassador Benefits" Section
 * Features:
 * - Soft scale & fade animation with spring physics
 * - No pagination dots
 * - Touch swipe support
 */
export default function BenefitsSlider({ items, autoPlayInterval = 4000 }) {
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
    }
    if (isRightSwipe) {
      paginate(-1);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Smooth slide-up with fade for professional look
  const variants = {
    enter: {
      y: 30,
      opacity: 0
    },
    center: {
      y: 0,
      opacity: 1
    },
    exit: {
      y: -30,
      opacity: 0
    }
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
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.4, ease: "easeInOut" }
            }}
            style={{
              width: '100%'
            }}
          >
            {items[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* No pagination dots - removed for clean look */}
    </div>
  );
}
