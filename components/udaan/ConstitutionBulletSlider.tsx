"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INDIGO = "#6366f1";

export default function ConstitutionBulletSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const bullets = [
    "Udaan operates within a defined framework of Community Governance.",
    "The Constitution protects the culture.",
    "Every participant enters a system built on Builder Discipline.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bullets.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: 60, display: "flex", alignItems: "center" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ display: "flex", gap: 10, alignItems: "flex-start", width: "100%" }}
        >
          <div style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: INDIGO,
            marginTop: 8,
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 13,
            color: "#5a5a72",
            lineHeight: 1.6,
            flex: 1,
          }}>{bullets[currentIndex]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
