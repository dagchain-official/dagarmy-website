"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntegrityGuardrailSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div style={{
          display: "flex",
          flexDirection: "column" as const,
          gap: 16,
          padding: "24px 0",
        }}>
          {/* Tags */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 8 }}>
            <span style={{
              fontFamily: "'Nasalization', sans-serif",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#9494aa",
            }}>NON-NEGOTIABLE</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: 2, background: "#ef4444", flexShrink: 0 }} />
              <span style={{
                fontFamily: "'Nasalization', sans-serif",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "#9494aa",
              }}>What We Reject</span>
            </div>
          </div>

          {/* List Items */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {["No MLM logic", "No get-rich shortcuts", "No artificial hierarchy"].map((item, i, arr) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingBottom: i < arr.length - 1 ? 12 : 0,
                  borderBottom: i < arr.length - 1 ? "1px solid #f0f0f7" : "none",
                }}
              >
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 1l6 6M7 1L1 7" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0c0c14",
                  lineHeight: 1.5,
                }}>{item}</span>
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
          padding: "24px 0",
        }}>
          {/* Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: 2, background: "#22c55e", flexShrink: 0 }} />
            <span style={{
              fontFamily: "'Nasalization', sans-serif",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#9494aa",
            }}>What We Value</span>
          </div>

          {/* List Items */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {[
              "Applied work",
              "Earned reputation",
              "Transparent reporting",
              "Demonstrated impact",
            ].map((item, i, arr) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingBottom: i < arr.length - 1 ? 12 : 0,
                  borderBottom: i < arr.length - 1 ? "1px solid #f0f0f7" : "none",
                }}
              >
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5l2.5 2.5L8 1" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#5a5a72",
                  lineHeight: 1.5,
                }}>{item}</span>
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

  // Slide 1 (What We Reject) from LEFT, Slide 2 (What We Value) from RIGHT
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
