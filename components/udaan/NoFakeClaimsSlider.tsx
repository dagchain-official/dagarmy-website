"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const gradText = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export default function NoFakeClaimsSlider() {
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
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            color: "#0c0c14",
            marginBottom: 16,
          }}>
            No Fake<br />
            <span style={gradText}>Claims.</span>
          </h3>
          <p style={{
            fontSize: 14,
            color: "#5a5a72",
            lineHeight: 1.85,
            marginBottom: 0,
          }}>
            Inflated case studies, artificial traction, or misleading income statements damage trust.
          </p>
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div style={{
          background: "linear-gradient(135deg, #f4f3ff 0%, #ede9fe 100%)",
          border: "1px solid #ddd9ff",
          borderRadius: 16,
          padding: "20px 20px",
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            lineHeight: 1.4,
            color: "#0c0c14",
            marginBottom: 12,
          }}>
            Trust is treated as an <span style={gradText}>operational asset</span>.
          </p>
          <p style={{
            fontSize: 13,
            color: "#5a5a72",
            lineHeight: 1.75,
            marginBottom: 0,
          }}>
            Not a marketing slogan. Not a tagline. An asset that compounds in credibility when protected, and collapses when violated.
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
    <div style={{ minHeight: 200, display: "flex", alignItems: "flex-start" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: "100%" }}
        >
          {slides[currentIndex].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
