"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import React from "react";
import WeeklyStatsSlider from "./WeeklyStatsSlider";

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
          className="weekly-header-container"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "flex-end",
            marginBottom: 72,
          }}
        >
          {/* Left — headline */}
          <div className="weekly-header-left">
            <div className="weekly-tag-line" style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}>
              <div style={{ width: 28, height: 1, background: "#6366f1" }} />
              <span className="whitespace-nowrap" style={{
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
            <h2 className="weekly-main-heading" style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "#0c0c14",
              margin: 0,
            }}>
              <span className="hidden md:inline">4 Weeks of<br /></span>
              <span className="block md:hidden">4 Weeks of</span>
              <span className="block whitespace-nowrap" style={{
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
          <div className="weekly-right-text hidden md:flex" style={{ paddingBottom: 4, flexDirection: 'column' }}>
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
        <div className="weekly-cards-container" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 20,
        }}>
          {weeks.map((w, i) => (
            <motion.div
              key={w.num}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease }}
              style={{ height: '100%' }}
            >
              <Link href={w.route} style={{ textDecoration: "none", display: "block", height: "100%" }} className="weekly-card-link">
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
                  <p className="line-clamp-3 md:line-clamp-none" style={{
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
                  <div className="mt-auto" style={{
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
          className="weekly-bottom-banner"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55, ease }}
          style={{
            background: "#0c0c14",
            borderRadius: 20,
            padding: "36px 48px",
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr 1px 1fr 1px 1fr 1px 2fr",
            alignItems: "center",
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

          {/* Mobile slider - hidden on desktop */}
          <div className="weekly-mobile-slider" style={{ display: 'none' }}>
            <WeeklyStatsSlider />
          </div>

          {[
            { val: "4", label: "Defined Phases", sub: "Structured weekly progression" },
            { val: "4", label: "Tangible Deliverables", sub: "One measurable output per week" },
            { val: "Live", label: "Market Validation", sub: "Real user feedback before scale" },
            { val: "Founder", label: "Positioning Path", sub: "Pitch, traction, evaluation" },
          ].flatMap((item, i) => {
            const cell = (
              <div key={item.label} className="weekly-stat-cell" style={{ padding: "0 32px" }}>
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
              ? [cell, <div key={`sep-${i}`} style={{ width: 1, height: 56, background: "rgba(255,255,255,0.08)" }} />]
              : [cell];
          })}

          <div key="sep-end" className="weekly-separator" style={{ width: 1, height: 56, background: "rgba(255,255,255,0.08)" }} />

          <div key="closing" className="weekly-closing-text" style={{ padding: "0 32px" }}>
            <div className="flex flex-col justify-center text-xs">
              <span style={{
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.5,
                display: "block",
                marginBottom: 4,
              }}>
                Each week ends with visible progress.
              </span>
              <span style={{
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 700,
                lineHeight: 1.5,
                display: "block",
              }}>
                No passive participation.
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Mobile CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          /* Section padding reduction */
          section {
            padding: 60px 0 !important;
          }

          /* Header - stack vertically */
          .weekly-header-container {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            margin-bottom: 40px !important;
          }

          /* Header left - force vertical stack */
          .weekly-header-left {
            display: flex !important;
            flex-direction: column !important;
          }

          /* Tag line - keep on single line */
          .weekly-tag-line {
            flex-wrap: nowrap !important;
            white-space: nowrap !important;
            margin-bottom: 16px !important;
          }

          .weekly-tag-line > div:first-child {
            flex-shrink: 0 !important;
          }

          .weekly-tag-line > span {
            white-space: nowrap !important;
            overflow: visible !important;
          }

          /* Heading - proper line breaks */
          .weekly-header-left h2 {
            line-height: 1.1 !important;
            display: block !important;
          }

          /* Weekly cards - 2x2 grid */
          .weekly-cards-container {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
            margin-bottom: 16px !important;
          }

          /* Equal height cards with flex layout */
          .weekly-cards-container > div {
            height: 100% !important;
          }

          .weekly-card-link {
            height: 100% !important;
            display: flex !important;
          }

          /* Scale down card typography and padding */
          .weekly-cards-container > div > a > div {
            padding: 16px !important;
            min-height: 280px !important;
            border-radius: 12px !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            flex: 1 !important;
            box-sizing: border-box !important;
          }

          /* Ghost number - smaller */
          .weekly-cards-container > div > a > div > div:first-child {
            font-size: 48px !important;
            top: -4px !important;
            right: 8px !important;
          }

          /* Week chip */
          .weekly-cards-container > div > a > div > div:nth-child(2) {
            margin-bottom: 12px !important;
          }

          .weekly-cards-container > div > a > div > div:nth-child(2) > div {
            width: 4px !important;
            height: 4px !important;
          }

          .weekly-cards-container > div > a > div > div:nth-child(2) > span {
            font-size: 9px !important;
          }

          /* Title - text-sm */
          .weekly-cards-container h3 {
            font-size: 14px !important;
            margin-bottom: 4px !important;
            line-height: 1.3 !important;
          }

          /* Subtitle - text-xs */
          .weekly-cards-container > div > a > div > div:nth-child(4) {
            font-size: 8px !important;
            margin-bottom: 8px !important;
          }

          /* Divider */
          .weekly-cards-container > div > a > div > div:nth-child(5) {
            width: 20px !important;
            margin-bottom: 8px !important;
          }

          /* Description - text-xs */
          .weekly-cards-container p {
            font-size: 11px !important;
            line-height: 1.5 !important;
            margin-bottom: 12px !important;
          }

          /* Arrow link - text-xs */
          .weekly-cards-container > div > a > div > div:last-child {
            font-size: 10px !important;
          }

          /* Bottom banner - fixed-height grid layout */
          .weekly-bottom-banner {
            display: grid !important;
            grid-template-columns: 50% 50% !important;
            height: 120px !important;
            width: 100% !important;
            align-items: center !important;
            padding: 20px 12px !important;
            gap: 12px !important;
          }

          /* Hide all desktop stat cells and separators */
          .weekly-stat-cell,
          .weekly-separator {
            display: none !important;
          }

          /* Show mobile slider in left column - isolated with overflow hidden */
          .weekly-mobile-slider {
            display: block !important;
            height: 100% !important;
            overflow: hidden !important;
            position: relative !important;
            min-width: 0 !important;
            width: 100% !important;
            flex-shrink: 0 !important;
          }

          /* Right column - static text stacked vertically (NO ANIMATION) */
          .weekly-closing-text {
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            height: 100% !important;
            min-width: 0 !important;
            width: 100% !important;
            position: relative !important;
          }

          .weekly-closing-text > div {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .weekly-closing-text span {
            font-size: 10px !important;
            line-height: 1.5 !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
