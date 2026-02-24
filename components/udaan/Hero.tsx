"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#ffffff",
        paddingTop: 120,
        paddingBottom: 80,
        overflow: "hidden",
      }}
    >
      {/* Subtle grid overlay - very light grey */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      {/* Optional soft radial fade using warm grey */}
      <div 
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100,100,100,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: 60, alignItems: "start", maxWidth: "100%" }}>

          {/* ── Left Column: Content ── */}
          <div>
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease }}
              style={{ marginBottom: 32 }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontWeight: 700,
                  fontSize: "clamp(42px, 4.5vw, 64px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#0c0c14",
                  marginBottom: 0,
                }}
              >
                <span style={{ color: "#0c0c14" }}>Udaan:</span>{" "}
                <span style={{ color: "#0c0c14" }}>Where AI Builders</span>{" "}
                <span style={{ color: "#5b4bec" }}>Rise</span>
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.div
              {...fadeUp(0.2)}
              style={{ marginBottom: 28 }}
            >
              <p style={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: 1.6,
                color: "#5a5a72",
                marginBottom: 0,
              }}>
                <strong style={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 600 
                }}>100,000 AI Startup Founders by 2030.</strong>
                <br />
                Rank Through Contribution inside a disciplined AI Startup Ecosystem.
              </p>
            </motion.div>

            {/* Description Block */}
            <motion.div
              {...fadeUp(0.35)}
              style={{ marginBottom: 36 }}
            >
              <p style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 14,
              }}>
                Artificial Intelligence is reshaping ownership, opportunity, and execution. The question is not whether AI will define the future. The question is <strong style={{ fontWeight: 600, color: "#0c0c14" }}>who will build within it.</strong>
              </p>
              <p style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 14,
              }}>
                DAG Army is a structured AI Startup Ecosystem built for serious Startup Execution. Here, <strong style={{ fontWeight: 600, color: "#0c0c14" }}>rank is earned through contribution.</strong> Soldiers prepare. Lieutenants build.
              </p>
              <p style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 0,
              }}>
                This is the runway for those who choose <strong style={{ fontWeight: 600, color: "#0c0c14" }}>action over observation.</strong>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              {...fadeUp(0.5)}
              style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}
            >
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))}
                className="btn btn-v"
                style={{
                  padding: "14px 32px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Enter as a Soldier
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))}
                className="btn btn-ghost"
                style={{
                  padding: "14px 32px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Rise as a Lieutenant
              </button>
            </motion.div>

            {/* Stats Strip */}
            <motion.div {...fadeUp(0.65)}>
              <div style={{ height: 1, background: "rgba(12,12,20,0.08)", marginBottom: 28 }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                {[
                  { n: "2,400+", l: "Active Builders" },
                  { n: "3", l: "Nations Unified" },
                  { n: "Contribution-Based", l: "Ranking" },
                  { n: "1M+", l: "Jobs Targeted" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: "#0c0c14",
                      lineHeight: 1,
                      marginBottom: 6,
                    }}>
                      {stat.n}
                    </div>
                    <div style={{
                      fontSize: "12px",
                      color: "#9494aa",
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}>
                      {stat.l}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right Column: Rank Progression Panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid rgba(12,12,20,0.1)",
                borderRadius: 16,
                padding: 36,
                boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
              }}
            >
              {/* Panel Header */}
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9494aa",
                  marginBottom: 16,
                }}>
                  RANK & PROGRESSION
                </div>

                {/* Current Entry */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{
                    fontSize: "13px",
                    color: "#5a5a72",
                    marginBottom: 4,
                    fontWeight: 500,
                  }}>
                    Current Entry:
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#0c0c14",
                    letterSpacing: "-0.01em",
                  }}>
                    Soldier
                  </div>
                </div>

                {/* Next Rank */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: "13px",
                    color: "#5a5a72",
                    marginBottom: 4,
                    fontWeight: 500,
                  }}>
                    Next Rank:
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#5b4bec",
                    letterSpacing: "-0.01em",
                  }}>
                    Lieutenant
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}>
                    <span style={{ fontSize: "12px", color: "#5a5a72", fontWeight: 500 }}>
                      Progress
                    </span>
                    <span style={{ fontSize: "12px", color: "#5b4bec", fontWeight: 700 }}>
                      340 / 500
                    </span>
                  </div>
                  <div style={{
                    height: 8,
                    background: "rgba(12,12,20,0.06)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: "68%",
                      background: "#5b4bec",
                      borderRadius: 4,
                    }} />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(12,12,20,0.08)", marginBottom: 24 }} />

              {/* Metrics */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Contributions Completed", value: "12" },
                  { label: "Builds Shipped", value: "3" },
                  { label: "Validation Actions", value: "8" },
                ].map((metric, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "rgba(12,12,20,0.02)",
                      borderRadius: 10,
                      border: "1px solid rgba(12,12,20,0.06)",
                    }}
                  >
                    <span style={{
                      fontSize: "13px",
                      color: "#5a5a72",
                      fontWeight: 500,
                    }}>
                      {metric.label}
                    </span>
                    <span style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#0c0c14",
                      letterSpacing: "-0.01em",
                    }}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
