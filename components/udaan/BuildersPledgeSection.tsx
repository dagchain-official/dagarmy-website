"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function BuildersPledgeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#fafafa",
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 56, textAlign: "center" }}
        >
          
          
          
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "clamp(40px, 5vw, 52px)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "#0c0c14",
              marginBottom: 0,
            }}
          >
            Builder's Pledge
          </h2>
        </motion.div>

        {/* Pledge Content Card with Gradient Border */}
        <motion.div
          {...fadeUp(0.2)}
          style={{
            maxWidth: 780,
            margin: "0 auto",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            padding: "2px",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(99,102,241,0.12)",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 8,
              padding: "48px 56px 56px",
              position: "relative",
            }}
          >
            {/* Header Section: Centered Logo + DAGARMY */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginBottom: 40,
                paddingBottom: 32,
                borderBottom: "1px solid #e5e5e5",
              }}
            >
              {/* Logo */}
              <img
                src="/images/logo/logo.png"
                alt="DAG Army Logo"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "contain",
                }}
              />

              {/* DAGARMY Text in Nasalization Font */}
              <div
                style={{
                  fontFamily: "'Nasalization', 'Arial Black', sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "#0c0c14",
                  textTransform: "uppercase",
                }}
              >
                DAGARMY
              </div>
            </div>

            {/* Opening Declaration */}
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.85,
                color: "#0c0c14",
                marginBottom: 28,
                fontWeight: 600,
              }}
            >
              I understand that learning is not the same as building.
            </p>

            {/* Responsibility Line */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.85,
                color: "#0c0c14",
                marginBottom: 28,
                fontWeight: 600,
              }}
            >
              I may begin as a learner, but I do not intend to stay there. I choose to take responsibility for what I create.
            </p>

            {/* Execution Commitment Paragraph */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.85,
                color: "#0c0c14",
                marginBottom: 28,
                fontWeight: 600,
              }}
            >
              I will move beyond ideas and turn them into working solutions. I will test them with real people. I will improve them when they fail. I will not hide behind research or endless preparation.
            </p>

            {/* Discipline Paragraph */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.85,
                color: "#0c0c14",
                marginBottom: 28,
                fontWeight: 600,
              }}
            >
              I accept that being a founder requires discipline. It requires honesty about results. It requires consistency when motivation fades.
            </p>

            {/* Integrity Paragraph */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.85,
                color: "#0c0c14",
                marginBottom: 36,
                fontWeight: 600,
              }}
            >
              I will not make fake claims. I will not chase shortcuts. I will earn progress through contribution.
            </p>

            {/* Community Line */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.85,
                color: "#0c0c14",
                marginBottom: 48,
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              I will support other builders, because no one truly builds alone.
            </p>

            {/* Final Commitment Declaration */}
            <div
              style={{
                textAlign: "center",
                paddingTop: 32,
                borderTop: "1px solid #e5e5e5",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: 1.7,
                  color: "#0c0c14",
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                This is my{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 700,
                  }}
                >
                  AI Builder Commitment
                </span>
                .
              </p>
              <p
                style={{
                  fontSize: "17px",
                  lineHeight: 1.7,
                  color: "#0c0c14",
                  fontWeight: 600,
                  marginBottom: 0,
                }}
              >
                This is my step into the{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 700,
                  }}
                >
                  Founder Track
                </span>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
