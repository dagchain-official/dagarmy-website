"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dm = "var(--font-dm, 'DM Sans', sans-serif)";

/**
 * 3-Cycle single slider for "Why This Model Matters" section
 * Slide 1: Dark "Why This Model Matters" card
 * Slide 2: 90% stat card
 * Slide 3: 42% stat card
 */
export default function WhyThisMattersSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      type: 'dark',
      content: (
        <div style={{
          padding: "28px 24px",
          background: "#0a0a0f",
          borderRadius: 12,
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div style={{
            fontFamily: "'Nasalization', sans-serif",
            fontSize: 8,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 12,
          }}>Why This<br />Model Matters</div>
          <div style={{
            width: 28,
            height: 2,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
          }} />
        </div>
      )
    },
    {
      type: 'stat',
      content: (
        <div style={{
          padding: "28px 24px",
          background: "#ffffff",
          borderRadius: 12,
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div style={{
            fontFamily: "'Nasalization', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 10vw, 48px)",
            letterSpacing: "0.02em",
            lineHeight: 1,
            marginBottom: 10,
            background: "linear-gradient(110deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>90%</div>
          <div style={{
            fontFamily: dm,
            fontSize: "11px",
            fontWeight: 700,
            color: "#0a0a0f",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>of startups fail globally</div>
          <p style={{
            fontFamily: dm,
            fontSize: "12px",
            lineHeight: 1.6,
            color: "#8080a0",
            margin: 0,
            fontWeight: 400,
            maxWidth: "250px",
          }}>Startups supported by collaborative ecosystems achieve faster early traction.</p>
        </div>
      )
    },
    {
      type: 'stat',
      content: (
        <div style={{
          padding: "28px 24px",
          background: "#fafafa",
          borderRadius: 12,
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div style={{
            fontFamily: "'Nasalization', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 10vw, 48px)",
            letterSpacing: "0.02em",
            lineHeight: 1,
            marginBottom: 10,
            background: "linear-gradient(110deg, #8b5cf6, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>42%</div>
          <div style={{
            fontFamily: dm,
            fontSize: "11px",
            fontWeight: 700,
            color: "#0a0a0f",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>fail due to lack of market need</div>
          <p style={{
            fontFamily: dm,
            fontSize: "12px",
            lineHeight: 1.6,
            color: "#8080a0",
            margin: 0,
            fontWeight: 400,
            maxWidth: "250px",
          }}>Udaan directly addresses this through structured validation before expansion.</p>
        </div>
      )
    }
  ];

  // Auto-cycle with custom timing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, currentIndex === 0 ? 3000 : 4000); // First slide 3s, others 4s
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Customized slide animations for conversational flow
  // Slide 1 (Dark "Why This Model Matters"): from LEFT
  // Slide 2 (90%): from RIGHT
  // Slide 3 (42%): from RIGHT
  const getSlideVariants = (index: number) => {
    if (index === 0) {
      // Slide 1: from LEFT
      return {
        enter: { x: -100, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 }
      };
    } else {
      // Slides 2 & 3: from RIGHT
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
