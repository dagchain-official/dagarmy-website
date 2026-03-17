"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WeeklyStatsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const stats = [
    { val: "4", label: "Defined Phases", sub: "Structured weekly progression" },
    { val: "4", label: "Tangible Deliverables", sub: "One measurable output per week" },
    { val: "Live", label: "Market Validation", sub: "Real user feedback before scale" },
    { val: "Founder", label: "Positioning Path", sub: "Pitch, traction, evaluation" },
  ];

  // Auto-cycle through stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length);
    }, 4000); // 4 seconds per stat
    return () => clearInterval(interval);
  }, []);

  // Bottom-to-top animation
  const variants = {
    enter: {
      y: 50,
      opacity: 0
    },
    center: {
      y: 0,
      opacity: 1
    },
    exit: {
      y: -50,
      opacity: 0
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', padding: '0 12px', minWidth: 0 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'absolute', top: '50%', left: '12px', right: '12px', transform: 'translateY(-50%)', minWidth: 0 }}
        >
          <div style={{ padding: "0", minWidth: 0 }}>
            <div style={{
              fontFamily: "'Nasalization', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              marginBottom: 4,
            }}>
              {stats[currentIndex].val}
            </div>
            <div style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontSize: 11,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 2,
            }}>
              {stats[currentIndex].label}
            </div>
            <div style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontSize: 9,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.4,
            }}>
              {stats[currentIndex].sub}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
