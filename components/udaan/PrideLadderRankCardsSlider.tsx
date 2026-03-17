"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GRADIENT = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";

export default function PrideLadderRankCardsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 0,
      content: (
        <div style={{
          background: "#ffffff",
          border: "1px solid #e2e2ee",
          borderRadius: 20,
          padding: "32px 24px",
          minHeight: 380,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "space-between",
        }}>
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: "linear-gradient(90deg, transparent 0%, #6366f1 40%, #8b5cf6 70%, transparent 100%)",
            borderRadius: "20px 20px 0 0",
          }} />
          <div style={{
            position: "absolute", bottom: -12, right: -8,
            fontFamily: "'Nasalization', sans-serif",
            fontSize: 72, fontWeight: 700,
            color: "rgba(99,102,241,0.04)",
            letterSpacing: "-0.04em", lineHeight: 1,
            userSelect: "none", pointerEvents: "none",
          }}>01</div>

          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{
                  display: "inline-block",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: 6, padding: "4px 10px",
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: 9, letterSpacing: "0.1em",
                  color: "#6366f1", textTransform: "uppercase" as const, marginBottom: 12,
                }}>Foundation Rank</div>
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800, fontSize: 26,
                  color: "#0c0c14", letterSpacing: "-0.02em", marginBottom: 0,
                }}>Soldier</h3>
              </div>
              <img
                src="/images/badges/dag-soldier.svg"
                alt="Soldier Badge"
                style={{ width: 72, height: 72, objectFit: "contain" }}
              />
            </div>

            <div style={{ borderTop: "1px solid #ebebf5", paddingTop: 20, marginBottom: 20 }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, lineHeight: 1.7, color: "#5a5a72", marginBottom: 0,
              }}>
                The entry point. Soldiers are learners in formation—building foundational AI skills, testing tools, and developing clarity on real-world application. This is not passive consumption. It is structured preparation.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {["Core AI Skills", "Tool Testing", "Real-world Clarity", "Structured Prep"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 600,
                  color: "#6366f1",
                  background: "rgba(99,102,241,0.07)",
                  borderRadius: 8, padding: "4px 10px",
                }}
              >{tag}</span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: "32px 24px",
          minHeight: 380,
          position: "relative",
          overflow: "hidden",
          border: "2px solid transparent",
          backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow: "0 6px 32px rgba(99,102,241,0.10)",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "space-between",
        }}>
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: GRADIENT,
            borderRadius: "20px 20px 0 0",
          }} />
          <div style={{
            position: "absolute", bottom: -12, right: -8,
            fontFamily: "'Nasalization', sans-serif",
            fontSize: 72, fontWeight: 700,
            color: "rgba(99,102,241,0.05)",
            letterSpacing: "-0.04em", lineHeight: 1,
            userSelect: "none", pointerEvents: "none",
          }}>02</div>

          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{
                  display: "inline-block",
                  background: GRADIENT,
                  borderRadius: 6, padding: "4px 10px",
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: 9, letterSpacing: "0.1em",
                  color: "#ffffff", textTransform: "uppercase" as const, marginBottom: 12,
                }}>Execution Rank</div>
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800, fontSize: 26,
                  color: "#0c0c14", letterSpacing: "-0.02em", marginBottom: 0,
                }}>Lieutenant</h3>
              </div>
              <img
                src="/images/badges/dag-lieutenant.svg"
                alt="Lieutenant Badge"
                style={{ width: 72, height: 72, objectFit: "contain" }}
              />
            </div>

            <div style={{ borderTop: "1px solid #ebebf5", paddingTop: 20, marginBottom: 20 }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, lineHeight: 1.7, color: "#5a5a72", marginBottom: 0,
              }}>
                The builder rank. Lieutenants are no longer preparing—they are executing. They build prototypes, validate ideas with real users, and generate early market signals. This is where learning transitions into applied work.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {["Build Prototypes", "Validate with Users", "Market Signals", "Applied Work"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 600,
                  color: "#6366f1",
                  background: "rgba(99,102,241,0.07)",
                  borderRadius: 8, padding: "4px 10px",
                }}
              >{tag}</span>
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

  // Slide 1 (Soldier) from LEFT, Slide 2 (Lieutenant) from RIGHT
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
