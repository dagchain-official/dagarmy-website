"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function SoldierSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [transitionSlide, setTransitionSlide] = useState(0);
  const [isTransitionHovering, setIsTransitionHovering] = useState(false);

  const skillSlides = [
    [
      "Core AI Foundations",
      "Practical AI Skills Development",
      "Understanding the AI Tool Ecosystem",
    ],
    [
      "No-Code Automation Workflows",
      "Structured AI Opportunity Identification",
      "AI Problem Framing",
    ],
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % skillSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + skillSlides.length) % skillSlides.length);
  };

  // Auto-rotate carousel every 4 seconds (pause on hover)
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, isHovering]);

  // Auto-rotate transition card every 4 seconds (pause on hover)
  useEffect(() => {
    if (isTransitionHovering) return;

    const interval = setInterval(() => {
      setTransitionSlide((prev) => (prev + 1) % 2);
    }, 4000);

    return () => clearInterval(interval);
  }, [transitionSlide, isTransitionHovering]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(148,148,170,0.04) 0%, rgba(90,90,114,0.04) 100%)",
        paddingTop: 60,
        paddingBottom: 60,
      }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Section Header - Compact with Badge on Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ 
            marginBottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Badge on Left */}
          <div
            style={{
              width: 100,
              height: 100,
              flexShrink: 0,
            }}
          >
            <img
              src="/BADGES  and  RANK png+svg/DAGARMY BADGES/DAG SOLDIER.svg"
              alt="Soldier Badge"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Title Content */}
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 1000,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#5a5a72",
                marginBottom: 8,
              }}
            >
              FOUNDATION RANK
            </div>
            <h2
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontWeight: 750,
                fontSize: "clamp(36px, 3vw, 46px)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "#0c0c14",
                marginBottom: 6,
              }}
            >
              Soldier  : The Learner in Formation
            </h2>
            
          </div>
        </motion.div>

        {/* Two-Column Layout: Complete Left + Right Content */}
        <motion.div
          {...fadeUp(0.1)}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            marginBottom: 5,
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN - Entry Rank Text + Market Reality */}
          <div>
            {/* Semi-headline */}
            <p
              style={{
                fontSize: "29px",
                fontWeight: 900,
                color: "#000000",
                marginBottom: 20,
              }}
            >
              The Entry Rank Inside the AI Startup Ecosystem
            </p>

            {/* First Paragraph */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 0,
              }}
            >
              In the DAG Army ecosystem, the Soldier is the starting rank. It is not accidental.
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 14,
              }}
            >
              It is the structured entry into the AI Learning Track.
            </p>

            {/* Second Paragraph */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 0,
              }}
            >
              This phase builds discipline before execution. It prepares for entrepreneurship. 
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 90,
              }}
            >
             It does not represent the final destination.
            </p>

            {/* Market Reality Section - MOVED FROM RIGHT COLUMN */}
            <h3
              style={{
                fontSize: "29px",
              fontWeight: 900,
              color: "#000000",
              marginBottom: 20,
              }}
            >
              The Market Reality
            </h3>
            
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 0,
              }}
            >
              AI adoption is rising across industries. Freelancers and professionals are integrating AI tools

            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 16,
              }}
            >
              at scale. However, usage alone does not create distinction.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 2,
              }}
            >
              Using AI keeps you relevant.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 16,
              }}
            >
              Building with AI creates leverage.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 0,
              }}
            >
              The Soldier phase prepares you for that shift.
            </p>
          </div>

          {/* RIGHT COLUMN - Skill Card + Transition Card */}
          <div>
            {/* Heading: What the Soldier Phase Develops - MOVED FROM LEFT COLUMN */}
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontSize: "18px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 20,
                letterSpacing: "-0.01em",
              }}
            >
              What the Soldier Phase Develops
            </h3>

            {/* Animated Skill Card - MOVED FROM LEFT COLUMN */}
            <div
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(12,12,20,0.1)",
                borderRadius: 12,
                padding: "24px 26px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                position: "relative",
                width: "100%",
                marginBottom: 35,
              }}
            >
            {/* Card Semi-Heading */}
            <h4
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 18,
                letterSpacing: "-0.01em",
              }}
            >
              This Startup Preparation Phase focuses on:
            </h4>

            {/* Auto-Rotating Slide Container - Single Vertical Column */}
            <div style={{ position: "relative", minHeight: "180px", overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 10,
                  }}
                >
                  {skillSlides[currentSlide].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: i * 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        padding: "10px 18px",
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#6b7280",
                        flexShrink: 0,
                      }} />
                      {item}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Static Emphasis Line - Always Visible */}
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.6,
                color: "#374151",
                marginTop: 18,
                paddingTop: 18,
                borderTop: "1px solid rgba(12,12,20,0.1)",
              }}
            >
              The goal is <strong style={{ 
                fontWeight: 700, 
                color: "#0c0c14",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>clarity before commitment</strong>.
            </p>
          </div>

            {/* Skill-to-Startup Transition Card - Professional Redesign */}
          <div
            onMouseEnter={() => setIsTransitionHovering(true)}
            onMouseLeave={() => setIsTransitionHovering(false)}
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              border: "1px solid rgba(99,102,241,0.12)",
              borderRadius: 12,
              padding: "24px 22px",
              boxShadow: "0 2px 12px rgba(99,102,241,0.06)",
              position: "relative",
              width: "100%",
            }}
          >
            <h4
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontSize: "18px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              The Skill-to-Startup Transition
            </h4>

            {/* Auto-Sliding Question Block */}
            <div style={{ position: "relative", minHeight: "85px", overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={transitionSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  {transitionSlide === 0 ? (
                    <div style={{
                      background: "rgba(148,148,170,0.05)",
                      padding: "16px 18px",
                      borderRadius: 10,
                      border: "1px solid rgba(148,148,170,0.15)",
                    }}>
                      <p
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#5e5e66ff",
                          marginBottom: 8,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Old Question
                      </p>
                      <p
                        style={{
                          fontSize: "16px",
                          lineHeight: 1.4,
                          color: "#454551ff",
                          fontWeight: 700,
                          marginBottom: 0,
                        }}
                      >
                        How do I use AI at work?
                      </p>
                    </div>
                  ) : (
                    <div style={{
                      background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)",
                      padding: "16px 18px",
                      borderRadius: 10,
                      border: "1px solid rgba(99,102,241,0.2)",
                    }}>
                      <p
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#6366f1",
                          marginBottom: 8,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        New Question
                      </p>
                      <p
                        style={{
                          fontSize: "16px",
                          lineHeight: 1.4,
                          fontWeight: 700,
                          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          marginBottom: 0,
                        }}
                      >
                        What problem can I solve with AI?
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Static Text - Always Visible */}
            <div style={{
              marginTop: 18,
              paddingTop: 18,
              borderTop: "1px solid rgba(99,102,241,0.1)",
            }}>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  fontWeight: 700,
                  color: "#0c0c14",
                  textAlign: "center",
                  marginBottom: 0,
                }}
              >
                This is where the <span style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 900,
                }}>early-stage builder</span> begins to form.
              </p>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          {...fadeUp(0.4)}
          style={{
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.65,
              color: "#5a5a72",
              fontStyle: "italic",
            }}
          >
            The Soldier rank is not a permanent identity. It is a structured preparation phase designed to build clarity, capability, and confidence before advancing to the next level.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
