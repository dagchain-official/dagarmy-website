"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dm = "var(--font-dm, 'DM Sans', sans-serif)";
const grad = {
  background: "linear-gradient(110deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

/**
 * Right-to-left sliding loop for Cards A & B (Execution Over Theory + Disciplined Startup Runway)
 */
export default function ExecutionCardsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const cards = [
    {
      number: "A",
      accent: "#6366f1",
      title: "Execution Over Theory",
      content: (
        <div>
          <p style={{ fontFamily: dm, fontSize: "14px", lineHeight: 1.6, color: "#0a0a0f", fontWeight: 600, margin: "0 0 10px 0" }}>
            Udaan does not reward attendance.<br />
            It rewards <span style={grad}>shipped work.</span>
          </p>
          <p style={{ fontFamily: dm, fontSize: "13px", lineHeight: 1.65, color: "#6a6a88", margin: 0 }}>
            This is the filtration layer of the ecosystem. Execution earns progression. Builders earn responsibility.
          </p>
        </div>
      )
    },
    {
      number: "B",
      accent: "#8b5cf6",
      title: "A Disciplined Startup Runway",
      content: (
        <p style={{ fontFamily: dm, fontSize: "13px", lineHeight: 1.65, color: "#6a6a88", margin: 0 }}>
          This is not passive learning. It is a disciplined{" "}
          <span style={grad}><strong>Startup Runway</strong></span>{" "}
          where ideas are converted into working models through{" "}
          <strong style={{ color: "#0a0a0f" }}>execution.</strong>{" "}
          The outcome is not a certificate — it is a{" "}
          <span style={grad}><strong>functional prototype, early validation, and a monetization pathway</strong></span>{" "}
          inside real <strong style={{ color: "#0a0a0f" }}>AI entrepreneurship.</strong>
        </p>
      )
    }
  ];

  // Auto-cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % cards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentIndex(prev => (prev + 1) % cards.length);
    }
    if (isRightSwipe) {
      setCurrentIndex(prev => prev === 0 ? cards.length - 1 : prev - 1);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Right-to-left slide animation
  const variants = {
    enter: {
      x: 100,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: -100,
      opacity: 0
    }
  };

  const card = cards[currentIndex];

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ width: '100%', overflow: 'hidden' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            padding: "24px",
            background: "#fafafa",
            borderLeft: `3px solid ${card.accent}`,
            borderRadius: 12,
            position: "relative",
            overflow: "hidden",
            width: '100%'
          }}
        >
          {/* Ghost number */}
          <div style={{
            position: "absolute", right: 16, bottom: -8,
            fontFamily: "'Nasalization', sans-serif",
            fontSize: 64, fontWeight: 400,
            color: "rgba(0,0,10,0.025)",
            lineHeight: 1, userSelect: "none", pointerEvents: "none",
          }}>{card.number}</div>

          <div style={{
            fontFamily: "'Nasalization', sans-serif",
            fontSize: 8, letterSpacing: "0.25em",
            textTransform: "uppercase", color: card.accent, marginBottom: 12,
          }}>{card.number}</div>

          <h3 style={{
            fontFamily: dm,
            fontWeight: 700,
            fontSize: "16px",
            letterSpacing: "-0.02em",
            color: "#0a0a0f",
            margin: "0 0 12px 0",
            lineHeight: 1.2,
          }}>{card.title}</h3>

          {card.content}
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
        {cards.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              width: currentIndex === i ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: currentIndex === i ? '#6366f1' : '#d1d5db',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
