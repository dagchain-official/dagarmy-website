"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const grad = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export default function LieutenantIntroCardsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div style={{
          background: "#fff",
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
            }}>What Is a Lieutenant</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#5a5a72", marginBottom: 16 }}>
              A <strong style={{ color: "#0c0c14" }}>Lieutenant</strong> inside the DAG Army AI Startup Ecosystem is no
              longer in preparation. This is the rank of the{" "}
              <strong style={{ color: "#0c0c14" }}>AI Startup Builder.</strong>
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 700, color: "#0c0c14", marginBottom: 16 }}>
              Prestige does not come from talk. It <span style={grad}>comes from output.</span>
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
              {[
                "From learning tools to building systems.",
                "From prompts to products.",
                "From theory to traction.",
              ].map((line, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
                    border: "1px solid rgba(99,102,241,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 700, ...grad }}>→</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0c0c14", marginBottom: 0 }}>{line}</p>
                </div>
              ))}
            </div>
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
          }}>LT</div>
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#9494aa",
              marginBottom: 16,
            }}>Execution in the AI Economy</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#5a5a72", marginBottom: 0 }}>
              AI literacy is expanding. But literacy alone does not create market position.{" "}
              <span style={grad}>Focused problem-solving does.</span>
            </p>
          </div>
          <div style={{ borderTop: "1px solid rgba(99,102,241,0.15)", paddingTop: 20 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#0c0c14", marginBottom: 10, lineHeight: 1.4 }}>
              This is not experimentation for visibility.
            </p>
            <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 0, lineHeight: 1.4, ...grad }}>
              This is structured product execution.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {["Builder Mindset", "Product Execution"].map((tag) => (
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
