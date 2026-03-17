"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const grad = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export default function SoldierProgressStepsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const steps = [
    { num: "01", label: "Learn the system", desc: "Understand the DAG ecosystem" },
    { num: "02", label: "Build foundations", desc: "Core AI skills and mindset" },
    { num: "03", label: "Prepare for execution", desc: "Ready to move to action" },
    { num: "04", label: "Advance to Lieutenant", desc: "Earn your execution rank" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Slide from left with fade
  const variants = {
    enter: {
      x: -50,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: 50,
      opacity: 0
    }
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div style={{
            background: "linear-gradient(145deg, #f8f8fb 0%, #f2f2fa 100%)",
            border: "1px solid rgba(99,102,241,0.12)",
            borderRadius: 14,
            padding: "24px 20px",
            textAlign: "center" as const,
          }}>
            <div style={{
              fontFamily: "Nasalization, sans-serif",
              fontSize: 24,
              fontWeight: 700,
              ...grad,
              marginBottom: 10,
            }}>{steps[currentIndex].num}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0c0c14", lineHeight: 1.3, marginBottom: 6 }}>
              {steps[currentIndex].label}
            </div>
            <div style={{ fontSize: 11, fontWeight: 400, color: "#9494aa", lineHeight: 1.5 }}>
              {steps[currentIndex].desc}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
