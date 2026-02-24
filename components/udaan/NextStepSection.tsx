"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function NextStepSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const ease = [0.22, 1, 0.36, 1] as any;

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
      <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 900, paddingLeft: 0, paddingRight: 0 }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 32, textAlign: "center" }}
        >
          {/* Section Label */}
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9494aa",
              marginBottom: 20,
            }}
          >
            SECTION 12
          </div>

          {/* Main Heading */}
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
            Your Next Step Into the AI Startup Ecosystem
          </h2>
        </motion.div>

        {/* Visual Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          style={{
            maxWidth: 900,
            margin: "0 auto 64px",
            background: "#ffffff",
            borderRadius: 16,
            padding: "48px 56px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "1px solid #e5e5e5",
          }}
        >
          {/* Top Stats Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 40,
              marginBottom: 40,
              paddingBottom: 40,
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            {/* Stat 1 */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 8,
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                }}
              >
                Structured
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#5a5a72",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Ecosystem
              </div>
            </div>

            {/* Stat 2 */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 8,
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                }}
              >
                Curated
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#5a5a72",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Selection
              </div>
            </div>

            {/* Stat 3 */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 8,
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                }}
              >
                Execution
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#5a5a72",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Focused
              </div>
            </div>
          </div>

          {/* Opening Context */}
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 0,
              textAlign: "center",
            }}
          >
            You have read about the ranks. You have seen the pathway. You understand the difference between learning tools and building real solutions. The only question left is whether you are ready to move.
          </p>
        </motion.div>

        {/* Block 2 - Udaan Definition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          style={{
            maxWidth: 900,
            margin: "0 auto 64px",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 0,
              fontWeight: 600,
            }}
          >
            Udaan is not an information program. It is a structured entry into a serious AI Startup Ecosystem built for people who want to launch, validate, and scale responsibly. If you are looking for passive sessions or symbolic participation, this will not feel comfortable. If you are ready to work on an idea, build an MVP, validate with real users, and step into structured founder accountability, this is where that journey begins.
          </p>
        </motion.div>

        {/* Block 3 - Builder Selection Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          style={{
            maxWidth: 900,
            margin: "0 auto 64px",
            paddingLeft: 24,
            borderLeft: "2px solid #e5e5e5",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 0,
            }}
          >
            Every cohort is curated through a defined{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
              }}
            >
              Builder Selection Process
            </span>
            . Seats are limited intentionally, not for marketing, but to protect focus and mentorship depth. You will be surrounded by early stage AI founders who are working toward the same goal: execution.
          </p>
        </motion.div>

        {/* Block 4 - Invitation to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
          style={{
            maxWidth: 900,
            margin: "0 auto 64px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 0,
              fontWeight: 600,
            }}
          >
            This is your invitation to{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
              }}
            >
              move from intention to action
            </span>
            .
          </p>
        </motion.div>

        {/* Block 5 - Three Action Paths with Visual Hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
          style={{
            maxWidth: 900,
            margin: "0 auto 64px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {/* Path 1 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: 12,
              padding: "28px 24px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                1
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#5a5a72",
                marginBottom: 16,
              }}
            >
              If you are ready to build your AI startup prototype and test it in the market,
            </p>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.4,
                marginBottom: 0,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Apply for the Udaan Cohort.
              </span>
            </p>
          </div>

          {/* Path 2 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: 12,
              padding: "28px 24px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                2
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#5a5a72",
                marginBottom: 16,
              }}
            >
              If you are prepared to enter the Founder Track and earn your rank through contribution,
            </p>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.4,
                marginBottom: 0,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Start Your Application Now.
              </span>
            </p>
          </div>

          {/* Path 3 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: 12,
              padding: "28px 24px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                3
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#5a5a72",
                marginBottom: 16,
              }}
            >
              If you believe you can contribute to the 1 Lakh Founder Mission through real work,
            </p>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.4,
                marginBottom: 0,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Step Into the Builder Circle.
              </span>
            </p>
          </div>
        </motion.div>

        {/* Final Declaration Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.6 }}
          style={{
            textAlign: "center",
            maxWidth: 900,
            margin: "0 auto",
            paddingTop: 32,
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.8,
              color: "#0c0c14",
              marginBottom: 0,
              fontWeight: 700,
            }}
          >
            The ecosystem is structured.<br />
            The pathway is clear.<br />
            The next move belongs to you.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
