"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const grad = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const gradBg = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";

export default function SoldierSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.6, delay, ease },
  });

  return (
    <section ref={ref} style={{ background: "#fff", paddingTop: 0, paddingBottom: 100 }}>

      {/* ── FULL-BLEED HERO BAND ── */}
      <motion.div
        {...fadeUp(0)}
        style={{
          background: "#0c0c14",
          position: "relative",
          overflow: "hidden",
          marginBottom: 48,
        }}
      >
        {/* Huge ghost text watermark */}
        <div style={{
          position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
          fontFamily: "Nasalization, sans-serif",
          fontSize: "clamp(120px, 20vw, 260px)",
          fontWeight: 700,
          color: "rgba(255,255,255,0.028)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
        }}>SOLDIER</div>

        {/* Subtle gradient orb */}
        <div style={{
          position: "absolute", left: "30%", top: "-60px",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="wrap" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="udaan-rank-hero-grid">
            {/* Badge */}
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", inset: -12,
                background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
                borderRadius: "50%",
              }} />
              <img
                src="/images/badges/dag-soldier.svg"
                alt="DAG Soldier Badge"
                style={{ width: 160, height: 160, objectFit: "contain", position: "relative", zIndex: 1, filter: "drop-shadow(0 8px 32px rgba(99,102,241,0.35))" }}
              />
            </div>

            {/* Headline */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: 100,
                padding: "6px 16px",
                marginBottom: 20,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: gradBg }} />
                <span style={{
                  fontFamily: "Nasalization, sans-serif",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase" as const,
                  color: "#a5b4fc",
                }}>Foundation Rank · DAG Army</span>
              </div>
              <h2 style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(36px, 4vw, 60px)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#fff",
                marginBottom: 16,
              }}>
                Soldier: The Learner<br />
                <span style={grad}>in Formation</span>
              </h2>
              <p style={{
                fontSize: 16, fontWeight: 500, color: "#9494aa", letterSpacing: "0.01em", marginBottom: 0,
              }}>
                The Entry Rank Inside DAG Army
              </p>
            </div>

            {/* Right stat block */}
            <div className="udaan-rank-stat-block" style={{
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              paddingLeft: 48,
              display: "flex",
              flexDirection: "column" as const,
              gap: 24,
            }}>
              {[
                { val: "4", label: "Core modules" },
                { val: "01", label: "Rank level" },
                { val: "→ LT", label: "Advances to" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: "Nasalization, sans-serif",
                    fontSize: 28, fontWeight: 700,
                    ...grad, lineHeight: 1, marginBottom: 4,
                  }}>{s.val}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#5a5a72", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── BENTO GRID ── */}
      <div className="wrap">
        <div className="udaan-bento-grid" style={{ gridTemplateRows: "auto auto" }}>

          {/* A: Identity - spans 2 cols */}
          <motion.div
            {...fadeUp(0.1)}
            className="udaan-bento-span2"
            style={{
              background: "#f8f8fb",
              borderRadius: 20,
              padding: "40px 44px",
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 20,
              }}>What Is a Soldier</div>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "#5a5a72", marginBottom: 20 }}>
                A <strong style={{ color: "#0c0c14" }}>Soldier</strong> is the structured entry rank inside the{" "}
                <strong style={{ color: "#0c0c14" }}>DAG Army AI Startup Ecosystem.</strong> It is a deliberate
                starting point within a disciplined{" "}
                <strong style={{ color: "#0c0c14" }}>AI Learning Track.</strong>
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.75, fontWeight: 700, color: "#0c0c14", marginBottom: 20 }}>
                This phase builds <span style={grad}>preparation.</span> It does not represent completion.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "#5a5a72", marginBottom: 0 }}>
                The Soldier stage exists to create the foundation required for long-term{" "}
                <strong style={{ color: "#0c0c14" }}>AI Entrepreneurship.</strong> It transforms interest into
                capability and capability into direction.
              </p>
            </div>
          </motion.div>

            {/* B: Mindset shift - 1 col, light */}
            <motion.div
              {...fadeUp(0.15)}
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
                gap: 24,
              }}
            >
              <div style={{
                position: "absolute", right: -8, bottom: -8,
                fontFamily: "Nasalization, sans-serif", fontSize: 96, fontWeight: 700,
                color: "rgba(99,102,241,0.06)", lineHeight: 1,
                userSelect: "none", pointerEvents: "none",
              }}>AI</div>
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 20,
                }}>From Tool Usage to Real Value</div>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "#5a5a72", marginBottom: 0 }}>
                  AI adoption is expanding rapidly. But adoption alone does not create distinction.
                </p>
              </div>
              <div style={{ borderTop: "1px solid rgba(99,102,241,0.15)", paddingTop: 24 }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#0c0c14", marginBottom: 12, lineHeight: 1.45 }}>
                  Using AI makes you current.
                </p>
                <p style={{ fontSize: 18, fontWeight: 800, marginBottom: 0, lineHeight: 1.45, ...grad }}>
                  Building with AI makes you relevant.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {["AI Tools", "Real Value"].map((tag) => (
                  <div key={tag} style={{
                    background: "#fff",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: 100,
                    padding: "6px 14px",
                    fontSize: 12, fontWeight: 700,
                    color: "#6366f1",
                  }}>{tag}</div>
                ))}
              </div>
            </motion.div>

          {/* C: Skills list - 1 col */}
          <motion.div
            {...fadeUp(0.2)}
            style={{
              background: "#fff",
              border: "1px solid rgba(12,12,20,0.09)",
              borderRadius: 20,
              padding: "36px 36px",
            }}
          >
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 24,
            }}>What the Soldier Phase Builds</div>
            {[
              { num: "01", label: "Core AI Foundations" },
              { num: "02", label: "Practical AI Skill Development" },
              { num: "03", label: "AI Tool Ecosystem Mastery" },
              { num: "04", label: "Automation & Opportunity Identification" },
            ].map((item, i) => (
              <div key={item.num} style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 0",
                borderBottom: i < 3 ? "1px solid rgba(12,12,20,0.07)" : "none",
              }}>
                <span style={{
                  fontFamily: "Nasalization, sans-serif",
                  fontSize: 11, fontWeight: 700,
                  color: "#c4c4d4", minWidth: 24,
                }}>{item.num}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0c0c14" }}>{item.label}</span>
              </div>
            ))}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(12,12,20,0.07)" }}>
              <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.7, color: "#0c0c14", marginBottom: 0 }}>
                Your foundation becomes your <span style={grad}>strength.</span><br />
                Your learning becomes your <span style={grad}>advantage.</span>
              </p>
            </div>
          </motion.div>

          {/* D: Skill-to-startup transition - spans 2 cols */}
          <motion.div
            {...fadeUp(0.25)}
            className="udaan-bento-span2"
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(12,12,20,0.09)",
              display: "flex",
              flexDirection: "column" as const,
            }}
          >
            <div style={{
              padding: "24px 36px",
              borderBottom: "1px solid rgba(12,12,20,0.07)",
              background: "#fff",
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase" as const, color: "#9494aa",
              }}>The Skill-to-Startup Transition</div>
            </div>
            <div className="udaan-transition-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1 }}>
              {/* Old Q */}
                <div style={{
                  padding: "40px 36px",
                  borderRight: "1px solid rgba(12,12,20,0.07)",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column" as const,
                  justifyContent: "space-between",
                  gap: 24,
                }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(12,12,20,0.05)",
                    borderRadius: 6, padding: "4px 12px",
                    width: "fit-content",
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                      textTransform: "uppercase" as const, color: "#9494aa",
                    }}>Old Question</span>
                  </div>
                  <p style={{ fontSize: 22, lineHeight: 1.5, color: "#b0b0c0", fontWeight: 500, marginBottom: 0 }}>
                    How do I apply AI inside a company?
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "#c4c4d4", marginBottom: 0 }}>
                    The old model focused on AI as a tool to enhance existing company workflows - a support function, not a foundation for building.
                  </p>
                </div>
                {/* New Q */}
                <div style={{
                  padding: "40px 36px",
                  background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.08) 100%)",
                  display: "flex",
                  flexDirection: "column" as const,
                  justifyContent: "space-between",
                  gap: 24,
                }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(99,102,241,0.12)",
                    borderRadius: 6, padding: "4px 12px",
                    width: "fit-content",
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: gradBg }} />
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                      textTransform: "uppercase" as const, color: "#6366f1",
                    }}>New Question</span>
                  </div>
                  <p style={{ fontSize: 22, lineHeight: 1.5, fontWeight: 800, marginBottom: 0, ...grad }}>
                    What real problem can I solve with AI?
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "#5a5a72", marginBottom: 0 }}>
                    The Soldier mindset is builder-first. You are not here to enhance someone else's system. You are here to build your own.
                  </p>
                </div>
            </div>
          </motion.div>

        </div>

          {/* ── BOTTOM FULL-WIDTH MANIFESTO STRIP - light ── */}
          <motion.div
            {...fadeUp(0.35)}
            className="udaan-soldier-manifesto"
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
              fontWeight: 700,
              color: "rgba(99,102,241,0.04)", lineHeight: 1,
              userSelect: "none", pointerEvents: "none", letterSpacing: "-0.04em",
            }}>PROGRESS</div>

            {/* Label */}
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 16,
              }}>Progress Over Comfort</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#5a5a72", marginBottom: 0 }}>
                Inside this ecosystem, comfort is not rewarded. <span style={grad}>Progress is.</span>
              </p>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: "100%", background: "rgba(12,12,20,0.08)", alignSelf: "stretch" }} />

            {/* 4 pillars */}
            <div className="udaan-soldier-pillars-grid">
              {[
                { num: "01", label: "Learn the system", desc: "Understand the DAG ecosystem" },
                { num: "02", label: "Build foundations", desc: "Core AI skills and mindset" },
                { num: "03", label: "Prepare for execution", desc: "Ready to move to action" },
                { num: "04", label: "Advance to Lieutenant", desc: "Earn your execution rank" },
              ].map((item) => (
                <div key={item.num} style={{
                  background: "linear-gradient(145deg, #f8f8fb 0%, #f2f2fa 100%)",
                  border: "1px solid rgba(99,102,241,0.12)",
                  borderRadius: 14,
                  padding: "20px 16px",
                  textAlign: "center" as const,
                }}>
                  <div style={{
                    fontFamily: "Nasalization, sans-serif",
                    fontSize: 20, fontWeight: 700,
                    ...grad, marginBottom: 8,
                  }}>{item.num}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0c0c14", lineHeight: 1.3, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 400, color: "#9494aa", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

        {/* ── CLOSING LINE ── */}
        <motion.div
          {...fadeUp(0.4)}
          style={{
            marginTop: 16,
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.06) 100%)",
            border: "1px solid rgba(99,102,241,0.15)",
            padding: "32px 56px",
            textAlign: "center" as const,
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 800, color: "#0c0c14", marginBottom: 0 }}>
            Being a Soldier is <strong>preparation.</strong>{" "}
            Your direction is <span style={grad}>forward.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
