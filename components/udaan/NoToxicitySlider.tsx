"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INDIGO = "#6366f1";

export default function NoToxicitySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div>
          <h3 style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#0c0c14",
            lineHeight: 1.2,
            marginBottom: 12,
          }}>No Toxicity<br />Policy.</h3>
          <p style={{
            fontSize: 14,
            color: "#5a5a72",
            lineHeight: 1.6,
            marginBottom: 0,
          }}>
            Mocking beginners, ego-driven behavior, aggressive selling, or misleading narratives are not tolerated.
          </p>
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div>
          <p style={{
            fontSize: 18,
            fontWeight: 800,
            fontStyle: "italic",
            color: "#0c0c14",
            lineHeight: 1.4,
            marginBottom: 8,
          }}>"Respect is not optional."</p>
          <span style={{
            fontSize: 12,
            color: "#9494aa",
            fontWeight: 600,
            letterSpacing: "0.06em",
            display: "block",
            marginBottom: 16,
          }}>— The Udaan Code</span>
          
          <div style={{
            background: "#fafafa",
            border: "1px solid #ebebf5",
            borderRadius: 12,
            padding: "12px 16px",
            marginTop: 8,
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#9494aa",
              marginBottom: 8,
            }}>Enforcement</div>
            <p style={{
              fontSize: 12,
              color: "#3a3a5c",
              lineHeight: 1.65,
              marginBottom: 0,
            }}>
              Violations result in immediate review. Repeat offenses result in rank removal. There are no second chances on culture.
            </p>
          </div>
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
