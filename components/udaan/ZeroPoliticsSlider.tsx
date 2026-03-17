"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INDIGO = "#6366f1";

export default function ZeroPoliticsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div>
          <h3 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 900,
            fontSize: 28,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "#0c0c14",
            marginBottom: 0,
          }}>Zero<br />Politics.</h3>
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(99,102,241,0.07)",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 6,
            padding: "5px 14px",
            width: "fit-content",
          }}>
            <span style={{
              fontFamily: "'Nasalization', sans-serif",
              fontSize: 10,
              letterSpacing: "0.14em",
              color: INDIGO,
              textTransform: "uppercase" as const,
            }}>Governance Rule</span>
          </div>
          <p style={{
            fontSize: 14,
            color: "#5a5a72",
            lineHeight: 1.85,
            marginBottom: 0,
          }}>
            No religious debate. No ideological battles.
          </p>
          <p style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#0c0c14",
            lineHeight: 1.6,
            marginBottom: 0,
            paddingTop: 12,
            borderTop: "1px solid #e5e5f0",
          }}>
            The focus remains singular: build, validate, improve.
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

  return (
    <div style={{ minHeight: 180, display: "flex", alignItems: "flex-start" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: "100%" }}
        >
          {slides[currentIndex].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
