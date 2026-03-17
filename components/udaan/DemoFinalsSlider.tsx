"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoFinalsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div style={{
          display: "flex",
          flexDirection: "column" as const,
          gap: 16,
          padding: "20px 0",
        }}>
          {/* Section Label */}
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "#9494aa",
          }}>Evaluation Criteria</div>

          {/* List Items */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {[
              "AI Startup Pitch to independent AI Jury",
              "Problem strength and validation depth",
              "Product build quality",
              "Scalability logic",
              "Founder maturity",
            ].map((c, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
              >
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: "rgba(99,102,241,0.10)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: 13, color: "#3a3a5c", lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div style={{
          display: "flex",
          flexDirection: "column" as const,
          gap: 16,
          padding: "20px 0",
        }}>
          {/* Section Label */}
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "#9494aa",
          }}>Founder Benefits</div>

          {/* List Items */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {[
              "Pre-Seed Grant support",
              "Direct Investor Exposure",
              "Continued Mentor Access",
              "AI Startup Accelerator pathway entry",
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "#fff",
                  border: "1px solid rgba(99,102,241,0.15)",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.06)",
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#2a2a4a" }}>{b}</span>
              </div>
            ))}
          </div>
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

  // Slide 1 (Evaluation Criteria) from LEFT, Slide 2 (Founder Benefits) from RIGHT
  const getSlideVariants = (index: number) => {
    if (index === 0) {
      return {
        enter: { x: -100, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 }
      };
    } else {
      return {
        enter: { x: 100, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 }
      };
    }
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={getSlideVariants(currentIndex)}
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
