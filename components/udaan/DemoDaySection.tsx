"use client";
import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const grad = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const gradBg = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";

export default function DemoDaySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const stagesInView = useInView(stagesRef, { once: true, margin: "-60px" });
  const closingInView = useInView(closingRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orbY1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), {
    stiffness: 80, damping: 20,
  });
  const orbY2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), {
    stiffness: 60, damping: 20,
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [20, -80]);



  return (
    <section
      ref={sectionRef}
      style={{ background: "#fff", paddingTop: 0, paddingBottom: 100, position: "relative", overflow: "hidden" }}
    >
      {/* ── Parallax ambient orbs ── */}
      <motion.div style={{
        position: "absolute", top: "5%", right: "-12%",
        width: 560, height: 560, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
        pointerEvents: "none", y: orbY1, zIndex: 0,
      }} />
      <motion.div style={{
        position: "absolute", bottom: "8%", left: "-10%",
        width: 440, height: 440, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
        pointerEvents: "none", y: orbY2, zIndex: 0,
      }} />

        {/* ── HERO HEADER BAND (light) ── */}
        <div style={{
          background: "linear-gradient(135deg, #f8f8fb 0%, #f0f0ff 100%)",
          borderBottom: "1px solid rgba(99,102,241,0.12)",
          position: "relative",
          overflow: "hidden",
          marginBottom: 48,
        }}>
          {/* Watermark */}
          <motion.div style={{
            position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
            fontFamily: "Nasalization, sans-serif",
            fontSize: "clamp(120px, 20vw, 260px)",
            fontWeight: 700, color: "rgba(99,102,241,0.045)",
            lineHeight: 1, userSelect: "none", pointerEvents: "none",
            letterSpacing: "-0.04em", whiteSpace: "nowrap", y: watermarkY,
          }}>DEMO</motion.div>

          {/* Orb */}
          <div style={{
            position: "absolute", left: "35%", top: "-80px",
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="wrap" style={{ paddingTop: 72, paddingBottom: 72 }} ref={headerRef}>
            <div className="udaan-demoday-header-grid">
              {/* Left: identity */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0, ease }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(99,102,241,0.10)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: 100, padding: "6px 16px", marginBottom: 20,
                  }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: gradBg }} />
                  <span style={{
                    fontFamily: "Nasalization, sans-serif",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                    textTransform: "uppercase" as const, color: "#6366f1",
                  }}>Selection Pipeline · DAG Army</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.08, ease }}
                  style={{
                    fontFamily: "DM Sans, sans-serif", fontWeight: 800,
                    fontSize: "clamp(36px, 4vw, 60px)", lineHeight: 1.1,
                    letterSpacing: "-0.03em", color: "#0c0c14", marginBottom: 16,
                  }}>
                  Road to{" "}
                  <span style={grad}>Demo Day Finals</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.15, ease }}
                  style={{
                    fontSize: 16, fontWeight: 500, color: "#7070a0",
                    letterSpacing: "0.01em", marginBottom: 0,
                  }}>
                  The Prestige Layer of the DAG Army Ecosystem
                </motion.p>
              </div>

              {/* Right: stats */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={headerInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.22, ease }}
                style={{
                  borderLeft: "1px solid rgba(99,102,241,0.15)",
                  paddingLeft: 48, display: "flex", flexDirection: "column" as const, gap: 24,
                }}
              >
                {[
                  { val: "3", label: "Pipeline Stages" },
                  { val: "1,000+", label: "Applicants Filtered" },
                  { val: "Earned", label: "Not Attended" },
                ].map((s, i) => (
                  <motion.div key={s.label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={headerInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.28 + i * 0.08, ease }}
                  >
                    <div style={{
                      fontFamily: "Nasalization, sans-serif", fontSize: 28, fontWeight: 700,
                      ...grad, lineHeight: 1, marginBottom: 4,
                    }}>{s.val}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#9494aa", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{s.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Manifesto bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.42, ease }}
              className="udaan-nextstep-header-stats"
              style={{
                marginTop: 48, borderTop: "1px solid rgba(99,102,241,0.12)",
                paddingTop: 28,
              }}
            >
              {[
                { label: "Filtered", body: "The AI Startup Selection Program separates interest from execution." },
                { label: "Proven", body: "Only proven builders move forward." },
                { label: "Outcomes", body: "Demo Day Finals are a stage for outcomes, not announcements." },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.48 + i * 0.07, ease }}
                  style={{
                    paddingRight: 32,
                    borderRight: i < 2 ? "1px solid rgba(99,102,241,0.12)" : "none",
                    paddingLeft: i > 0 ? 32 : 0,
                  }}
                >
                  <div style={{
                    fontFamily: "Nasalization, sans-serif", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.15em", color: "#6366f1", textTransform: "uppercase" as const,
                    marginBottom: 8,
                  }}>{item.label}</div>
                  <p style={{ fontSize: 13, color: "#7070a0", lineHeight: 1.6, margin: 0 }}>
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      {/* ── BENTO STAGE GRID ── */}
      <div className="wrap" style={{ position: "relative", zIndex: 1 }} ref={stagesRef}>

        {/* Section label row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={stagesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}
        >
          <span style={{
            fontFamily: "Nasalization, sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.15em", color: "#6366f1", textTransform: "uppercase" as const,
          }}>Pipeline Stages</span>
          <div style={{ flex: 1, height: 1, background: "#e8e8f0" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#9494aa" }}>
            3 gates · only builders advance
          </span>
        </motion.div>

        {/* Stage cards - asymmetric bento */}
        <div className="udaan-bento-grid" style={{ gridTemplateRows: "auto auto" }}>

          {/* ── STAGE 1: Screening - spans full top row ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={stagesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.08, ease }}
            whileHover={{ y: -3, boxShadow: "0 16px 48px rgba(99,102,241,0.10)" }}
            className="udaan-bento-span2"
            style={{
              background: "#f8f8fb",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(12,12,20,0.08)",
              position: "relative",
            }}
          >
            {/* Top accent bar */}
            <div style={{ height: 3, background: gradBg }} />
            <div className="udaan-stage-two-col" style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 280,
            }}>
              {/* Left */}
              <div style={{ padding: "36px 40px", borderRight: "1px solid rgba(12,12,20,0.07)" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(99,102,241,0.10)", borderRadius: 6,
                  padding: "4px 12px", marginBottom: 20,
                }}>
                  <span style={{
                    fontFamily: "Nasalization, sans-serif", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#6366f1",
                  }}>Stage 1 · Entry Gate</span>
                </div>
                <h3 style={{
                  fontFamily: "DM Sans, sans-serif", fontWeight: 800,
                  fontSize: 28, lineHeight: 1.2, letterSpacing: "-0.02em",
                  color: "#0c0c14", marginBottom: 8,
                }}>Screening</h3>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#7070a0", lineHeight: 1.6, marginBottom: 28 }}>
                  Testing thinking clarity and problem depth.
                </p>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 14,
                }}>Evaluation Criteria</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                  {[
                    "AI Problem Solving clarity",
                    "Use case relevance and differentiation",
                    "Feasibility within a realistic build cycle",
                    "Early revenue logic or adoption logic",
                  ].map((c, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={stagesInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.18 + i * 0.07, ease }}
                      style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: 4,
                        background: "rgba(99,102,241,0.10)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 2,
                      }}>
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span style={{ fontSize: 14, color: "#3a3a5c", lineHeight: 1.5 }}>{c}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Right */}
              <div style={{
                padding: "36px 40px", background: "#fff",
                display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
              }}>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 16,
                  }}>Stage Outcome</div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#2a2a4a", lineHeight: 1.7 }}>
                    Filters 1,000+ applicants into a Curated Founder Cohort shortlist.
                  </p>
                </div>
                {/* Progress bar */}
                <div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    {[1, 2, 3].map((s) => (
                      <div key={s} style={{
                        flex: s === 1 ? 2 : 1, height: 6, borderRadius: 3,
                        background: s === 1 ? gradBg : "#e8e8f0",
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#9494aa" }}>Stage 1 of 3</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── STAGE 1 stat card - 1 col tall ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={stagesInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.14, ease }}
            className="udaan-bento-row2"
            style={{
              background: "linear-gradient(145deg, #f0f0ff 0%, #eae8ff 100%)",
              border: "1px solid rgba(99,102,241,0.15)",
              borderRadius: 20,
              padding: "40px 36px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "space-between",
            }}
          >
            {/* Ghost watermark */}
            <div style={{
              position: "absolute", right: -12, bottom: -12,
              fontFamily: "Nasalization, sans-serif", fontSize: 120, fontWeight: 700,
              color: "rgba(99,102,241,0.06)", lineHeight: 1,
              userSelect: "none", pointerEvents: "none",
            }}>03</div>

            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 24,
              }}>The Pipeline at a Glance</div>

              {[
                { num: "01", label: "Screening", sub: "Entry Gate" },
                { num: "02", label: "Validation & Mentor Review", sub: "Proof Gate" },
                { num: "03", label: "Demo Day Finals", sub: "Finals" },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={stagesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.09, ease }}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "14px 0",
                    borderBottom: i < 2 ? "1px solid rgba(99,102,241,0.12)" : "none",
                  }}
                >
                  <span style={{
                    fontFamily: "Nasalization, sans-serif", fontSize: 11, fontWeight: 700,
                    color: "rgba(99,102,241,0.5)", minWidth: 24,
                  }}>{item.num}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0c0c14", lineHeight: 1.3 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: "#9494aa", marginTop: 2 }}>{item.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0c0c14", lineHeight: 1.7, marginBottom: 0 }}>
                Only builders who demonstrate <span style={grad}>real execution</span> reach the Finals.
              </p>
            </div>
          </motion.div>

          {/* ── STAGE 2: Validation & Mentor Review - spans 2 cols ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={stagesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.18, ease }}
            whileHover={{ y: -3, boxShadow: "0 16px 48px rgba(99,102,241,0.10)" }}
            className="udaan-bento-span2"
            style={{
              background: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(12,12,20,0.08)",
              position: "relative",
            }}
          >
            <div style={{ height: 3, background: "linear-gradient(90deg, #7c3aed, #6366f1)" }} />
            <div className="udaan-stage-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 280 }}>
              {/* Left */}
              <div style={{ padding: "36px 40px", borderRight: "1px solid rgba(12,12,20,0.07)" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(124,58,237,0.08)", borderRadius: 6,
                  padding: "4px 12px", marginBottom: 20,
                }}>
                  <span style={{
                    fontFamily: "Nasalization, sans-serif", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#7c3aed",
                  }}>Stage 2 · Proof Gate</span>
                </div>
                <h3 style={{
                  fontFamily: "DM Sans, sans-serif", fontWeight: 800,
                  fontSize: 28, lineHeight: 1.2, letterSpacing: "-0.02em",
                  color: "#0c0c14", marginBottom: 8,
                }}>Validation &amp; Mentor Review</h3>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#7070a0", lineHeight: 1.6, marginBottom: 28 }}>
                  Testing proof through real execution.
                </p>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 14,
                }}>Evaluation Criteria</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                  {[
                    "Functional AI Startup Prototype",
                    "Evidence of Market Testing",
                    "AI Product Validation insights",
                    "5–10 structured validation conversations",
                    "Mentor feedback adoption and iteration discipline",
                  ].map((c, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={stagesInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.28 + i * 0.06, ease }}
                      style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: 4,
                        background: "rgba(124,58,237,0.08)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 2,
                      }}>
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span style={{ fontSize: 14, color: "#3a3a5c", lineHeight: 1.5 }}>{c}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Right */}
              <div style={{
                padding: "36px 40px",
                background: "linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(99,102,241,0.06) 100%)",
                display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
              }}>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 16,
                  }}>Stage Outcome</div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#2a2a4a", lineHeight: 1.7 }}>
                    Builds investor-grade clarity and startup funding readiness.
                  </p>
                </div>
                <div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    {[1, 2, 3].map((s) => (
                      <div key={s} style={{
                        flex: s <= 2 ? 2 : 1, height: 6, borderRadius: 3,
                        background: s <= 2
                          ? "linear-gradient(90deg, #7c3aed, #6366f1)"
                          : "#e8e8f0",
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#9494aa" }}>Stage 2 of 3</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── STAGE 3: Demo Day Finals - full width feature card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={stagesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.28, ease }}
          whileHover={{ y: -3, boxShadow: "0 20px 60px rgba(99,102,241,0.12)" }}
          style={{
            marginTop: 16,
            background: "linear-gradient(135deg, #f8f8fb 0%, #f2f0ff 100%)",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(99,102,241,0.2)",
            position: "relative",
          }}
        >
          <div style={{ height: 4, background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)" }} />

          {/* Ghost FINALS watermark */}
          <div style={{
            position: "absolute", right: -20, bottom: -20,
            fontFamily: "Nasalization, sans-serif",
            fontSize: "clamp(80px, 12vw, 160px)",
            fontWeight: 700, color: "rgba(99,102,241,0.04)",
            lineHeight: 1, userSelect: "none", pointerEvents: "none",
            letterSpacing: "-0.04em",
          }}>FINALS</div>

          <div className="udaan-stage-three-col" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            position: "relative", zIndex: 1,
          }}>
            {/* Col 1: Stage identity */}
            <div style={{ padding: "44px 44px", borderRight: "1px solid rgba(99,102,241,0.12)" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(99,102,241,0.12)", borderRadius: 6,
                padding: "4px 12px", marginBottom: 24,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: gradBg }} />
                <span style={{
                  fontFamily: "Nasalization, sans-serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#6366f1",
                }}>Stage 3 · Finals</span>
              </div>
              <h3 style={{
                fontFamily: "DM Sans, sans-serif", fontWeight: 800,
                fontSize: 32, lineHeight: 1.15, letterSpacing: "-0.02em",
                color: "#0c0c14", marginBottom: 12,
              }}>Demo Day Finals</h3>
              <p style={{ fontSize: 15, fontWeight: 500, color: "#7070a0", lineHeight: 1.65, marginBottom: 28 }}>
                Execution becomes reputation.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                {["AI Jury", "Investor Pitch", "Live Demo"].map((tag) => (
                  <div key={tag} style={{
                    background: "#fff", border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: 100, padding: "6px 14px",
                    fontSize: 12, fontWeight: 700, color: "#6366f1",
                  }}>{tag}</div>
                ))}
              </div>
            </div>

            {/* Col 2: Evaluation Criteria */}
            <div style={{ padding: "44px 40px", borderRight: "1px solid rgba(99,102,241,0.12)" }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 20,
              }}>Evaluation Criteria</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {[
                  "AI Startup Pitch to independent AI Jury",
                  "Problem strength and validation depth",
                  "Product build quality",
                  "Scalability logic",
                  "Founder maturity",
                ].map((c, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={stagesInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.38 + i * 0.07, ease }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      background: "rgba(99,102,241,0.10)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 14, color: "#3a3a5c", lineHeight: 1.5 }}>{c}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Col 3: Founder Benefits */}
            <div style={{
              padding: "44px 40px",
              background: "rgba(99,102,241,0.04)",
              display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
            }}>
              <div>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 20,
                }}>Founder Benefits</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {[
                    "Pre-Seed Grant support",
                    "Direct Investor Exposure",
                    "Continued Mentor Access",
                    "AI Startup Accelerator pathway entry",
                  ].map((b, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={stagesInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.38 + i * 0.08, ease }}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 16px", borderRadius: 10,
                        background: "#fff", border: "1px solid rgba(99,102,241,0.15)",
                        boxShadow: "0 2px 8px rgba(99,102,241,0.06)",
                      }}
                    >
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: gradBg, flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#2a2a4a" }}>{b}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0c0c14", lineHeight: 1.7, marginBottom: 0 }}>
                  Your MVP becomes your <span style={grad}>proof.</span><br />
                  Your traction becomes your <span style={grad}>signal.</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CLOSING MANIFESTO STRIP ── */}
        <div ref={closingRef}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={closingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease }}
            className="udaan-lt-manifesto"
            style={{
              marginTop: 16,
              background: "#fff",
              border: "1px solid rgba(12,12,20,0.09)",
              borderRadius: 20,
              padding: "52px 56px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ghost watermark */}
            <div style={{
              position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
              fontFamily: "Nasalization, sans-serif",
              fontSize: "clamp(80px, 12vw, 160px)",
              fontWeight: 700, color: "rgba(99,102,241,0.04)",
              lineHeight: 1, userSelect: "none", pointerEvents: "none",
              letterSpacing: "-0.04em",
            }}>SHIPPED</div>

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={closingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1, ease }}
            >
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 16,
              }}>The Bottom Line</div>
              <p style={{
                fontFamily: "DM Sans, sans-serif", fontWeight: 800,
                fontSize: "clamp(20px, 2.5vw, 30px)", lineHeight: 1.25,
                letterSpacing: "-0.02em", color: "#0c0c14", marginBottom: 0,
              }}>
                The point is not participation.<br />
                The point is{" "}
                <span style={grad}>shipped work.</span>
              </p>
            </motion.div>

            {/* Divider */}
            <div style={{ width: 1, background: "rgba(12,12,20,0.08)", alignSelf: "stretch" }} />

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={closingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.18, ease }}
              style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}
            >
              <p style={{ fontSize: 17, fontWeight: 600, color: "#3a3a5c", lineHeight: 1.6, margin: 0 }}>
                Demo Day Finals are earned, not attended.
              </p>
              {[
                "Interest is common. Execution is rare.",
                "Rank is earned through visible output.",
                "This is where builders become founders.",
              ].map((line, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={closingInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.24 + i * 0.08, ease }}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <div style={{
                    width: 24, height: 1,
                    background: "linear-gradient(90deg, #6366f1, transparent)",
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#9494aa" }}>{line}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
