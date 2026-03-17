"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dm = "var(--font-dm, 'DM Sans', sans-serif)";

/**
 * Dynamic slider for "Why This Model Matters" right side stats
 * Cycles between 90% and 42% stats
 */
export default function MarketStatsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const stats = [
    { num: "90%", label: "of startups fail globally", detail: "Startups supported by collaborative ecosystems achieve faster early traction." },
    { num: "42%", label: "fail due to lack of market need", detail: "Udaan directly addresses this through structured validation before expansion." },
  ];

  // Auto-cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % stats.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stat = stats[currentIndex];

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '20px 16px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div style={{
            fontFamily: "'Nasalization', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(32px, 10vw, 40px)",
            letterSpacing: "0.02em",
            lineHeight: 1,
            marginBottom: 8,
            background: currentIndex === 0
              ? "linear-gradient(110deg, #6366f1, #8b5cf6)"
              : "linear-gradient(110deg, #8b5cf6, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{stat.num}</div>
          <div style={{
            fontFamily: dm, fontSize: "11px",
            fontWeight: 700, color: "#0a0a0f",
            marginBottom: 6,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>{stat.label}</div>
          <p style={{
            fontFamily: dm, fontSize: "12px",
            lineHeight: 1.6, color: "#8080a0", margin: 0, fontWeight: 400,
          }}>{stat.detail}</p>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
        {stats.map((_, i) => (
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
