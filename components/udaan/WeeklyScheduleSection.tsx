"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import React from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const weeks = [
  {
    num: "01",
    week: "Week 1",
    title: "Problem Discovery",
    subtitle: "Structured Idea Validation",
    description: "Define the right problem before building anything. Clarify users. Validate direction.",
    route: "/udaan/week-1",
  },
  {
    num: "02",
    week: "Week 2",
    title: "AI MVP Development",
    subtitle: "Functional Build",
    description: "Convert your concept into a working AI prototype using structured tools.",
    route: "/udaan/week-2",
  },
  {
    num: "03",
    week: "Week 3",
    title: "Validation & Testing",
    subtitle: "Evidence Before Scale",
    description: "Test with real users. Refine before expansion.",
    route: "/udaan/week-3",
  },
  {
    num: "04",
    week: "Week 4",
    title: "Pitch & Positioning",
    subtitle: "Structured Evaluation",
    description: "Prepare your narrative. Define traction. Enter the Founder Track.",
    route: "/udaan/week-4",
  },
];

export default function WeeklyScheduleSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#f9f9fb",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: "absolute",
        top: -120,
        right: -120,
        width: 480,
        height: 480,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="wrap" style={{ maxWidth: 1200 }}>

        {/* ── Section header ── */}
        <motion.div
          className="udaan-reality-white-grid"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{
            gap: 48,
            alignItems: "flex-end",
            marginBottom: 72,
          }}
        >
          {/* Left — headline */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}>
              <div style={{ width: 28, height: 1, background: "#6366f1" }} />
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#6366f1",
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              }}>
                The Transformation Path
              </span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "#0c0c14",
              margin: 0,
            }}>
              4 Weeks of<br />
              <span style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Measured Execution
              </span>
            </h2>
          </div>

          {/* Right — description + stats */}
          <div style={{ paddingBottom: 4 }}>
            <p style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontSize: 16,
              lineHeight: 1.75,
              color: "#5a5a72",
              marginBottom: 28,
            }}>
              A disciplined AI Startup build cycle designed to convert intent into execution.
            </p>
            <div style={{ display: "flex", gap: 36 }}>
              {[
                { val: "4", label: "Defined Phases" },
                { val: "4", label: "Deliverables" },
                { val: "Live", label: "Market Validation" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: "'Nasalization', sans-serif",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#0c0c14",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}>{s.val}</div>
                  <div style={{
                    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                    fontSize: 11,
                    color: "#9ca3af",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Week cards ── */}
        <div className="udaan-weekly-grid" style={{ marginBottom: 20 }}>
          {weeks.map((w, i) => (
            <motion.div
              key={w.num}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease }}
            >
              <Link href={w.route} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #ebebf0",
                    borderRadius: 20,
                    padding: 28,
                    minHeight: 280,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                    transition: "box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(99,102,241,0.1)";
                    e.currentTarget.style.borderColor = "#c7c7f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#ebebf0";
                  }}
                >
                  {/* Ghost number */}
                  <div style={{
                    position: "absolute",
                    top: -8,
                    right: 16,
                    fontFamily: "'Nasalization', sans-serif",
                    fontSize: 80,
                    fontWeight: 700,
                    color: "rgba(99,102,241,0.05)",
                    lineHeight: 1,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}>
                    {w.num}
                  </div>

                  {/* Week chip */}
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 20,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
                    <span style={{
                      fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#6366f1",
                    }}>
                      {w.week}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#0c0c14",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                    marginBottom: 6,
                  }}>
                    {w.title}
                  </h3>

                  {/* Subtitle */}
                  <div style={{
                    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#b0b0c3",
                    marginBottom: 14,
                  }}>
                    {w.subtitle}
                  </div>

                  <div style={{ width: 32, height: 1, background: "#e5e5f0", marginBottom: 14 }} />

                  {/* Description */}
                  <p style={{
                    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    color: "#6b7280",
                    flexGrow: 1,
                    marginBottom: 20,
                  }}>
                    {w.description}
                  </p>

                  {/* Arrow link */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#6366f1",
                    letterSpacing: "0.02em",
                  }}>
                    View {w.week}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom architecture strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55, ease }}
          className="udaan-weekly-arch-strip"
          style={{
            background: "#0c0c14",
            borderRadius: 20,
            padding: "36px 48px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{
            position: "absolute",
            top: -60,
            left: "40%",
            width: 320,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Stats + closing text row */}
          <div className="udaan-arch-inner">

            {/* 4 stat cells with separators */}
            <div className="udaan-arch-stats-grid">
              {[
                { val: "4", label: "Defined Phases", sub: "Structured weekly progression" },
                { val: "4", label: "Tangible Deliverables", sub: "One measurable output per week" },
                { val: "Live", label: "Market Validation", sub: "Real user feedback before scale" },
                { val: "Founder", label: "Positioning Path", sub: "Pitch, traction, evaluation" },
              ].flatMap((item, i) => {
                const cell = (
                  <div key={item.label} className="udaan-arch-cell">
                    <div style={{
                      fontFamily: "'Nasalization', sans-serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                      marginBottom: 6,
                    }}>
                      {item.val}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#ffffff",
                      marginBottom: 3,
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                      lineHeight: 1.4,
                    }}>
                      {item.sub}
                    </div>
                  </div>
                );
                return i < 3
                  ? [cell, <div key={`sep-${i}`} className="udaan-arch-sep" style={{ width: 1, height: 56, background: "rgba(255,255,255,0.08)" }} />]
                  : [cell];
              })}
            </div>

            {/* Vertical separator before closing text (desktop only) */}
            <div className="udaan-arch-sep-end" style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.08)" }} />

            {/* Closing text */}
            <div className="udaan-arch-closing">
              <p style={{
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.65,
                margin: 0,
              }}>
                Each week ends with visible progress.<br />
                <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>No passive participation.</strong>
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
