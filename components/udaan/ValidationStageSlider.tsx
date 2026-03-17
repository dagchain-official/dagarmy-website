"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const gradBg = "linear-gradient(90deg, #7c3aed, #6366f1)";

export default function ValidationStageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div style={{
          background: "#fff",
          border: "1px solid rgba(12,12,20,0.08)",
          borderRadius: 20,
          padding: "28px 24px",
          minHeight: 480,
          display: "flex",
          flexDirection: "column" as const,
          gap: 20,
        }}>
          {/* Top accent bar */}
          <div style={{ height: 3, background: gradBg, marginLeft: -24, marginRight: -24, marginTop: -28 }} />

          {/* Tag */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(124,58,237,0.08)",
            borderRadius: 6,
            padding: "4px 12px",
            alignSelf: "flex-start",
          }}>
            <span style={{
              fontFamily: "'Nasalization', sans-serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#7c3aed",
            }}>Stage 2 · Proof Gate</span>
          </div>

          {/* Heading */}
          <div>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: 24,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#0c0c14",
              marginBottom: 8,
            }}>Validation &amp; Mentor Review</h3>
            <p style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#7070a0",
              lineHeight: 1.6,
              marginBottom: 0,
            }}>
              Testing proof through real execution.
            </p>
          </div>

          {/* Evaluation Criteria */}
          <div>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#9494aa",
              marginBottom: 12,
            }}>Evaluation Criteria</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
              {[
                "Functional AI Startup Prototype",
                "Evidence of Market Testing",
                "AI Product Validation insights",
                "5–10 structured validation conversations",
                "Mentor feedback adoption and iteration discipline",
              ].map((c, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                >
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: "rgba(124,58,237,0.08)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, color: "#3a3a5c", lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(99,102,241,0.06) 100%)",
          border: "1px solid #e2e2ee",
          borderRadius: 20,
          padding: "28px 24px",
          minHeight: 480,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "space-between",
        }}>
          {/* Top accent bar */}
          <div style={{ height: 3, background: gradBg, marginLeft: -24, marginRight: -24, marginTop: -28 }} />

          {/* Stage Outcome */}
          <div>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#9494aa",
              marginBottom: 16,
            }}>Stage Outcome</div>
            <p style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#2a2a4a",
              lineHeight: 1.7,
              marginBottom: 0,
            }}>
              Builds investor-grade clarity and startup funding readiness.
            </p>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {[1, 2, 3].map((s) => (
                <div key={s} style={{
                  flex: s <= 2 ? 2 : 1,
                  height: 6,
                  borderRadius: 3,
                  background: s <= 2 ? gradBg : "#e8e8f0",
                }} />
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9494aa" }}>Stage 2 of 3</div>
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

  // Slide 1 (Evaluation Criteria) from LEFT, Slide 2 (Stage Outcome) from RIGHT
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
    <div style={{ width: '100%', overflow: 'hidden', padding: '0 16px' }}>
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
