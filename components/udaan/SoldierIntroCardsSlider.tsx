"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const grad = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const gradBg = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";

export default function SoldierIntroCardsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div style={{
          background: "#f8f8fb",
          borderRadius: 20,
          padding: "32px 24px",
          minHeight: 320,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#9494aa",
              marginBottom: 16,
            }}>What Is a Soldier</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#5a5a72", marginBottom: 16 }}>
              A <strong style={{ color: "#0c0c14" }}>Soldier</strong> is the structured entry rank inside the{" "}
              <strong style={{ color: "#0c0c14" }}>DAG Army AI Startup Ecosystem.</strong> It is a deliberate
              starting point within a disciplined{" "}
              <strong style={{ color: "#0c0c14" }}>AI Learning Track.</strong>
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 700, color: "#0c0c14", marginBottom: 16 }}>
              This phase builds <span style={grad}>preparation.</span> It does not represent completion.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#5a5a72", marginBottom: 0 }}>
              The Soldier stage exists to create the foundation required for long-term{" "}
              <strong style={{ color: "#0c0c14" }}>AI Entrepreneurship.</strong> It transforms interest into
              capability and capability into direction.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div style={{
          background: "linear-gradient(145deg, #f0f0ff 0%, #eae8ff 100%)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderRadius: 20,
          padding: "32px 24px",
          minHeight: 320,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "space-between",
          gap: 20,
        }}>
          <div style={{
            position: "absolute",
            right: -8,
            bottom: -8,
            fontFamily: "Nasalization, sans-serif",
            fontSize: 80,
            fontWeight: 700,
            color: "rgba(99,102,241,0.06)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}>AI</div>
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#9494aa",
              marginBottom: 16,
            }}>From Tool Usage to Real Value</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#5a5a72", marginBottom: 0 }}>
              AI adoption is expanding rapidly. But adoption alone does not create distinction.
            </p>
          </div>
          <div style={{ borderTop: "1px solid rgba(99,102,241,0.15)", paddingTop: 20 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#0c0c14", marginBottom: 10, lineHeight: 1.4 }}>
              Using AI makes you current.
            </p>
            <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 0, lineHeight: 1.4, ...grad }}>
              Building with AI makes you relevant.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {["AI Tools", "Real Value"].map((tag) => (
              <div key={tag} style={{
                background: "#fff",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 100,
                padding: "5px 12px",
                fontSize: 11,
                fontWeight: 700,
                color: "#6366f1",
              }}>{tag}</div>
            ))}
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

  // Slide 1 from LEFT, Slide 2 from RIGHT
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
