"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const grad = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export default function PipelineGlanceSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const stages = [
    { num: "01", label: "Screening", sub: "Entry Gate" },
    { num: "02", label: "Validation & Mentor Review", sub: "Proof Gate" },
    { num: "03", label: "Demo Day Finals", sub: "Finals" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column" as const,
      padding: 24,
      background: "linear-gradient(145deg, #f0f0ff 0%, #eae8ff 100%)",
      border: "1px solid rgba(99,102,241,0.15)",
      borderRadius: 20,
      gap: 20,
    }}>
      {/* Static Header */}
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        color: "#9494aa",
      }}>The Pipeline at a Glance</div>

      {/* Inner Slider */}
      <div style={{ 
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 20px",
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(99,102,241,0.12)",
              width: "100%",
            }}
          >
            <span style={{
              fontFamily: "'Nasalization', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              ...grad,
              minWidth: 48,
            }}>{stages[currentIndex].num}</span>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: 15, 
                fontWeight: 700, 
                color: "#0c0c14", 
                lineHeight: 1.3,
                marginBottom: 4,
              }}>{stages[currentIndex].label}</div>
              <div style={{ 
                fontSize: 11, 
                color: "#9494aa",
                fontWeight: 600,
              }}>{stages[currentIndex].sub}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Static Footer */}
      <div style={{
        borderTop: "1px solid rgba(99,102,241,0.12)",
        paddingTop: 16,
      }}>
        <p style={{ 
          fontSize: 12, 
          fontWeight: 700, 
          color: "#0c0c14", 
          lineHeight: 1.6, 
          marginBottom: 0,
        }}>
          Only builders who demonstrate{" "}
          <span style={grad}>real execution</span>{" "}
          reach the Finals.
        </p>
      </div>
    </div>
  );
}
