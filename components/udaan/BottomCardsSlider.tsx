"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dm = "var(--font-dm, 'DM Sans', sans-serif)";

/**
 * 2-Cycle single slider for bottom split cards
 * Slide 1: Dark "The Bottom Line" card
 * Slide 2: Light "The Ecosystem Model" card
 */
export default function BottomCardsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      type: 'dark',
      content: (
        <div style={{
          padding: "28px 24px",
          background: "#0a0a0f",
          borderRadius: 12,
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Ghost decoration */}
          <div style={{
            position: "absolute",
            top: -24,
            right: -24,
            width: 120,
            height: 120,
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: "50%",
            pointerEvents: "none",
          }} />

          <div style={{
            fontFamily: "'Nasalization', sans-serif",
            fontSize: 8,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            marginBottom: 16,
          }}>The Bottom Line</div>
          <p style={{
            fontFamily: dm,
            fontWeight: 800,
            fontSize: "20px",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            margin: 0,
          }}>
            Udaan is not a learning track.{" "}
            <span style={{
              background: "linear-gradient(110deg, #818cf8, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              It is an execution runway.
            </span>
          </p>
        </div>
      )
    },
    {
      type: 'light',
      content: (
        <div style={{
          padding: "28px 24px",
          background: "#f4f4f8",
          borderRadius: 12,
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div style={{
            fontFamily: "'Nasalization', sans-serif",
            fontSize: 8,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#a0a0c0",
            marginBottom: 16,
          }}>The Ecosystem Model</div>
          <p style={{
            fontFamily: dm,
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#4a4a6a",
            fontWeight: 400,
            margin: 0,
          }}>
            Startups supported by collaborative ecosystems achieve faster early traction,
            reinforcing a builder-first culture grounded in{" "}
            <strong style={{ color: "#0a0a0f" }}>accountability and execution.</strong>
          </p>
        </div>
      )
    }
  ];

  // Auto-cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Customized slide animations for conversational flow
  // Slide 1 (Dark "The Bottom Line"): from LEFT
  // Slide 2 (Light "The Ecosystem Model"): from RIGHT
  const getSlideVariants = (index: number) => {
    if (index === 0) {
      // Slide 1: from LEFT
      return {
        enter: { x: -100, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 }
      };
    } else {
      // Slide 2: from RIGHT
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
