"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdvancementSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    "Launching a validated product",
    "Mentoring incoming Soldiers",
    "Demonstrating market traction",
    "Supporting the ecosystem's growth",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Static Heading */}
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        color: "#9494aa",
        fontFamily: "'Nasalization', sans-serif",
        marginBottom: 16,
      }}>How You Advance</div>

      {/* Animated Slider */}
      <div style={{ minHeight: 60, display: "flex", alignItems: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <div style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#6366f1",
              marginTop: 8,
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 14,
              color: "#5a5a72",
              lineHeight: 1.6,
              flex: 1,
            }}>{slides[currentIndex]}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
