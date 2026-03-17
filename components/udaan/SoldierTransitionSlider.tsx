"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const grad = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const gradBg = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";

export default function SoldierTransitionSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div style={{
          padding: "32px 24px",
          background: "#fff",
          borderRadius: 16,
          minHeight: 280,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "space-between",
          gap: 20,
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(12,12,20,0.05)",
            borderRadius: 6,
            padding: "4px 12px",
            width: "fit-content",
          }}>
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#9494aa",
            }}>Old Question</span>
          </div>
          <p style={{ fontSize: 20, lineHeight: 1.4, color: "#b0b0c0", fontWeight: 500, marginBottom: 0 }}>
            How do I apply AI inside a company?
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "#c4c4d4", marginBottom: 0 }}>
            The old model focused on AI as a tool to enhance existing company workflows — a support function, not a foundation for building.
          </p>
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div style={{
          padding: "32px 24px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.08) 100%)",
          borderRadius: 16,
          minHeight: 280,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "space-between",
          gap: 20,
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(99,102,241,0.12)",
            borderRadius: 6,
            padding: "4px 12px",
            width: "fit-content",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: gradBg }} />
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#6366f1",
            }}>New Question</span>
          </div>
          <p style={{ fontSize: 20, lineHeight: 1.4, fontWeight: 800, marginBottom: 0, ...grad }}>
            What real problem can I solve with AI?
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
            The Soldier mindset is builder-first. You are not here to enhance someone else's system. You are here to build your own.
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Both slides animate from BOTTOM to TOP
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
    <div style={{ width: '100%', overflow: 'hidden', padding: '0 16px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {slides[currentIndex].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
