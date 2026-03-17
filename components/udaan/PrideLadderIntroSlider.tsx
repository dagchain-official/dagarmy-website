"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GRADIENT = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";

export default function PrideLadderIntroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div style={{
          background: "#0c0c14",
          borderRadius: 20,
          padding: "32px 24px",
          minHeight: 320,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center",
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            lineHeight: 1.45,
            color: "#ffffff",
            marginBottom: 16,
          }}>
            The DAG Army does not run on titles. It runs on contribution.
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.55)",
            marginBottom: 0,
          }}>
            The Pride Ladder exists to make one principle clear: growth here is earned through visible execution across your AI Startup Journey, not through passive participation or purchased status.
          </p>
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div style={{
          background: "#ffffff",
          border: "1px solid #e2e2ee",
          borderRadius: 20,
          padding: "32px 24px",
          minHeight: 320,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center",
          gap: 16,
        }}>
          <div style={{
            fontFamily: "'Nasalization', sans-serif",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "#9494aa",
            marginBottom: 8,
          }}>
            The Core Rule
          </div>
          {["Rank cannot be bought.", "Rank cannot be gifted.", "Rank cannot be self-declared."].map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingBottom: i < 2 ? 16 : 0,
                borderBottom: i < 2 ? "1px solid #ebebf5" : "none",
              }}
            >
              <span style={{
                fontFamily: "'Nasalization', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                flexShrink: 0,
              }}>
                0{i + 1}
              </span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#0c0c14",
              }}>
                {line}
              </span>
            </div>
          ))}
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

  // Slide 1 (dark card) from LEFT, Slide 2 (light list) from RIGHT
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
