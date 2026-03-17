"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const gradText = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export default function ConstitutionStatsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cycles = [
    {
      id: 0,
      stats: [
        { num: "3", label: "Core Principles" },
        { num: "0", label: "Tolerance for Shortcuts" },
      ],
    },
    {
      id: 1,
      stats: [
        { num: "∞", label: "Integrity Standard" },
        { num: "#1", label: "Contribution Rule" },
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cycles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: "100%",
      borderTop: "1px solid #ddd9ff",
      padding: "24px 16px",
      minHeight: 120,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            width: "100%",
          }}
        >
          {cycles[currentIndex].stats.map((stat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                gap: 8,
                padding: "16px 12px",
                background: "#ffffff",
                border: "1px solid #e8e8f5",
                borderRadius: 12,
              }}
            >
              <span style={{
                fontFamily: "'Nasalization', sans-serif",
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1,
                ...gradText,
              }}>{stat.num}</span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "#9494aa",
                lineHeight: 1.4,
                textAlign: "center" as const,
              }}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
