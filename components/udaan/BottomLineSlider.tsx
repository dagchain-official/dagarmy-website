"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const grad = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export default function BottomLineSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div style={{
          background: "#f8f8fb",
          borderRadius: 20,
          padding: "32px 24px",
          minHeight: 280,
          display: "flex",
          flexDirection: "column" as const,
          gap: 16,
        }}>
          {/* Tag */}
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            color: "#9494aa",
          }}>The Bottom Line</div>

          {/* Heading */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(24px, 6vw, 28px)",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            color: "#0c0c14",
            marginBottom: 8,
          }}>
            The point is not participation.
          </p>

          {/* Sub-heading */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(20px, 5vw, 24px)",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            marginBottom: 0,
          }}>
            The point is{" "}
            <span style={grad}>shipped work.</span>
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
          minHeight: 280,
          display: "flex",
          flexDirection: "column" as const,
          gap: 16,
        }}>
          {/* Text items */}
          {[
            { text: "Demo Day Finals are earned, not attended.", bold: true },
            { text: "Interest is common. Execution is rare.", bold: false },
            { text: "Rank is earned through visible output.", bold: false },
            { text: "This is where builders become founders.", bold: false },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 24,
                height: 1,
                background: "linear-gradient(90deg, #6366f1, transparent)",
              }} />
              <span style={{
                fontSize: item.bold ? 15 : 14,
                fontWeight: item.bold ? 600 : 500,
                color: item.bold ? "#2a2a4a" : "#7070a0",
                lineHeight: 1.6,
              }}>{item.text}</span>
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

  // Slide 1 (Participation) from LEFT, Slide 2 (Execution points) from RIGHT
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
