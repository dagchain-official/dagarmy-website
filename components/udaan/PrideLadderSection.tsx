"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function PrideLadderSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [currentPrincipleSlide, setCurrentPrincipleSlide] = useState(0);
  const [currentCredibilitySlide, setCurrentCredibilitySlide] = useState(0);

  const principleStatements = [
    "Rank cannot be bought.",
    "Rank cannot be assigned.",
    "Rank follows demonstrated output.",
  ];

  const credibilitySlides = [
    ["No MLM structure", "No get-rich schemes"],
    ["No artificial hierarchy", "No inflated claims"],
  ];

  // Auto-rotate principle statements every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrincipleSlide((prev) => (prev + 1) % principleStatements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [principleStatements.length]);

  // Auto-rotate credibility slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCredibilitySlide((prev) => (prev + 1) % credibilitySlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [credibilitySlides.length]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#fafafa",
        paddingTop: 70,
        paddingBottom: 70,
      }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 32, textAlign: "center" }}
        >
          
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "clamp(40px, 5vw, 52px)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              marginBottom: 12,
              color: "#0c0c14",
            }}
          >
            The <span style={{
              background: 'linear-gradient(135deg, #090912ff 0%, #010102ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Pride Ladder</span> – Rank Through Contribution
          </h2>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#5a5a72",
              marginBottom: 0,
            }}
          >
            A Meritocracy, Not a Marketplace
          </p>
        </motion.div>

        {/* Introduction Block */}
        <motion.div
          {...fadeUp(0.2)}
          style={{
            maxWidth: 750,
            margin: "0 auto 32px auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              color: "#0c0c14",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            The DAG Army operates on one rule: contribution determines progression.
          </p>
          
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#5a5a72",
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            The Pride Ladder formalizes this principle. Growth reflects visible Execution Milestones, not tenure, payment, or self-claimed status.
          </p>

          {/* Animated Principle Block */}
          <div
            style={{
              
              
              minHeight: "55px",
              marginBottom: 20,
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPrincipleSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize: "18px",
                  lineHeight: 1.5,
                  color: "#0c0c14",
                  fontWeight: 700,
                  marginBottom: 0,
                  textAlign: "center",
                }}
              >
                {principleStatements[currentPrincipleSlide]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.6,
              color: "#5a5a72",
              marginBottom: 24,
            }}
          >
            This system is built on <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Contribution-Based Ranking</strong> and measurable <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Merit-Based Growth.</strong>
          </p>

          {/* Divider Line */}
          <div style={{ width: "100%", height: "1px", background: "#e5e5e5", marginBottom: 0 }} />
        </motion.div>

        {/* Main Ladder Visual - Horizontal Two-Card Layout with Arrow */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            marginBottom: 32,
            maxWidth: 1100,
            margin: "0 auto 32px",
          }}
        >
          {/* Soldier Card */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              padding: "24px 22px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              textAlign: "center",
            }}
          >
            {/* Badge Image at Top Center */}
            <div
              style={{
                width: 100,
                height: 100,
                margin: "0 auto 16px",
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

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontSize: "24px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 8,
                letterSpacing: "-0.01em",
              }}
            >
              Soldier
            </h3>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#9494aa",
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Foundation Rank
            </p>

            {/* Description */}
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.65,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              Entry stage. AI foundations, experimentation, and clarity building.
            </p>

            {/* Focus Label */}
            <div
              style={{
                padding: "8px 14px",
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                display: "inline-block",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#6b7280",
                  marginBottom: 0,
                  letterSpacing: "0.02em",
                }}
              >
                Focus: Skill Development
              </p>
            </div>
          </div>

          {/* Progression Arrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Lieutenant Card */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              borderRadius: 16,
              padding: "24px 22px",
              boxShadow: "0 4px 16px rgba(99,102,241,0.1)",
              textAlign: "center",
            }}
          >
            {/* Badge Image at Top Center */}
            <div
              style={{
                width: 100,
                height: 100,
                margin: "0 auto 16px",
              }}
            >
              <img
                src="/BADGES  and  RANK png+svg/DAGARMY BADGES/DAG LIEUTENANT.svg"
                alt="Lieutenant Badge"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontSize: "24px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 8,
                letterSpacing: "-0.01em",
              }}
            >
              Lieutenant
            </h3>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#6366f1",
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Execution Rank
            </p>

            {/* Description */}
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.65,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              Earned through real Startup Execution. Requires launching an AI Startup Prototype, validating an MVP, or generating measurable traction.
            </p>

            {/* Focus Label */}
            <div
              style={{
                padding: "8px 14px",
                background: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                display: "inline-block",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#4b5563",
                  marginBottom: 0,
                  letterSpacing: "0.02em",
                }}
              >
                Focus: Building & Contribution
              </p>
            </div>
          </div>
        </motion.div>

        {/* Credibility Protection Block */}
        <motion.div
          {...fadeUp(0.4)}
          style={{
            maxWidth: 650,
            margin: "0 auto 32px",
            padding: "24px 28px",
            background: "#fafbfc",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          {/* Heading */}
          <h3
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "22px",
              fontWeight: 700,
              color: "#0c0c14",
              marginBottom: 20,
              letterSpacing: "-0.01em",
            }}
          >
            The ladder protects credibility.
          </h3>

          {/* Animated Credibility Points - Pill-Style Containers */}
          <div style={{ position: "relative", minHeight: "70px", overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCredibilitySlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {credibilitySlides[currentCredibilitySlide].map((item, i) => (
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
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#6b7280",
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Final Principle Statements */}
        <motion.div
          {...fadeUp(0.5)}
          style={{
            textAlign: "center",
            maxWidth: 750,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.65,
              color: "#0c0c14",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Knowledge alone does not elevate rank. <strong style={{ fontWeight: 900 }}>Applied execution does.</strong>
          </p>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#5a5a72",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Reputation is treated as earned trust. <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Transparent reporting</strong> outweighs presentation.
          </p>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#5a5a72",
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Demonstrated impact</strong> outweighs narrative.
          </p>

          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.6,
              color: "#0c0c14",
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            Inside this ecosystem, authority is not assigned. It is <strong style={{ fontWeight: 900 }}>demonstrated.</strong>
          </p>

          <p
            style={{
              fontSize: "19px",
              lineHeight: 1.6,
              color: "#0c0c14",
              fontWeight: 700,
              marginBottom: 0,
            }}
          >
            The Pride Ladder is not about status.<br />
            It is about <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 900,
            }}>responsibility</span> within a disciplined <strong style={{ fontWeight: 900 }}>Builder-First Culture.</strong>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
