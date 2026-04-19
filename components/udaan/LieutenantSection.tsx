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

// Gold gradient for Lieutenant (elevated rank)
const goldGrad = {
  background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export default function LieutenantSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.6, delay, ease },
  });

  return (
    <section ref={ref} style={{ background: "#f8f8fb", paddingTop: 0, paddingBottom: 100 }}>

      {/* ── FULL-BLEED HERO BAND ── */}
      <motion.div
        {...fadeUp(0)}
        style={{
          background: "linear-gradient(135deg, #0c0c14 0%, #12101e 60%, #0e0c1a 100%)",
          position: "relative",
          overflow: "hidden",
          marginBottom: 48,
        }}
      >
        {/* Ghost watermark */}
        <div style={{
          position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
          fontFamily: "Nasalization, sans-serif",
          fontSize: "clamp(120px, 20vw, 260px)",
          fontWeight: 700,
          color: "rgba(255,255,255,0.028)",
          lineHeight: 1,
          userSelect: "none", pointerEvents: "none",
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
        }}>LIEUTENANT</div>

        {/* Gold orb */}
        <div style={{
          position: "absolute", left: "35%", top: "-80px",
          width: 440, height: 440,
          background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="wrap" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="udaan-rank-hero-grid">
            {/* Badge */}
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", inset: -12,
                background: "radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)",
                borderRadius: "50%",
              }} />
              <img
                src="/images/badges/dag-lieutenant.svg"
                alt="DAG Lieutenant Badge"
                style={{ width: 160, height: 160, objectFit: "contain", position: "relative", zIndex: 1, filter: "drop-shadow(0 8px 32px rgba(251,191,36,0.3))" }}
              />
            </div>

            {/* Headline */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(251,191,36,0.12)",
                border: "1px solid rgba(251,191,36,0.25)",
                borderRadius: 100,
                padding: "6px 16px",
                marginBottom: 20,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }} />
                <span style={{
                  fontFamily: "Nasalization, sans-serif",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase" as const,
                  color: "#fbbf24",
                }}>Execution Rank · DAG Army</span>
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
                Lieutenant: The Builder<br />
                <span style={goldGrad}>Who Executes</span>
              </h2>
              <p style={{ fontSize: 16, fontWeight: 500, color: "#9494aa", marginBottom: 0 }}>
                The Rank That Is Earned
              </p>
            </div>

            {/* Right stat block */}
            <div style={{
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              paddingLeft: 48,
              display: "flex",
              flexDirection: "column" as const,
              gap: 24,
            }}>
              {[
                  { val: "6", label: "Capabilities" },
                  { val: "02", label: "Rank level" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: "Nasalization, sans-serif",
                    fontSize: 28, fontWeight: 700,
                    ...goldGrad, lineHeight: 1, marginBottom: 4,
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
        <div className="udaan-bento-grid">

          {/* A: Identity - spans 2 cols */}
          <motion.div
            {...fadeUp(0.1)}
            className="udaan-bento-span2"
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "40px 44px",
            }}
          >
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 20,
            }}>What Is a Lieutenant</div>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "#5a5a72", marginBottom: 20 }}>
              A <strong style={{ color: "#0c0c14" }}>Lieutenant</strong> inside the DAG Army AI Startup Ecosystem is no
              longer in preparation. This is the rank of the{" "}
              <strong style={{ color: "#0c0c14" }}>AI Startup Builder.</strong>
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.75, fontWeight: 700, color: "#0c0c14", marginBottom: 20 }}>
              Prestige does not come from talk. It <span style={grad}>comes from output.</span>
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
              {[
                "From learning tools to building systems.",
                "From prompts to products.",
                "From theory to traction.",
              ].map((line, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
                    border: "1px solid rgba(99,102,241,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, ...grad }}>→</span>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#0c0c14", marginBottom: 0 }}>{line}</p>
                </div>
              ))}
            </div>
          </motion.div>

            {/* B: AI Economy - light card with bold statement design */}
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
              }}>LT</div>
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 20,
                }}>Execution in the AI Economy</div>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "#5a5a72", marginBottom: 0 }}>
                  AI literacy is expanding. But literacy alone does not create market position.{" "}
                  <span style={grad}>Focused problem-solving does.</span>
                </p>
              </div>
              <div style={{ borderTop: "1px solid rgba(99,102,241,0.15)", paddingTop: 24 }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#0c0c14", marginBottom: 12, lineHeight: 1.45 }}>
                  This is not experimentation for visibility.
                </p>
                <p style={{ fontSize: 18, fontWeight: 800, marginBottom: 0, lineHeight: 1.45, ...grad }}>
                  This is structured product execution.
                </p>
              </div>
              {/* Two stat pills */}
              <div style={{ display: "flex", gap: 10 }}>
                {["Builder Mindset", "Product Execution"].map((tag) => (
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

          {/* C: Execution capability list - 1 col */}
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
            }}>Execution Capability</div>
            {[
              { num: "01", label: "Build AI MVP" },
              { num: "02", label: "Create functional prototype" },
              { num: "03", label: "Validate with structured feedback" },
              { num: "04", label: "Conduct real market testing" },
              { num: "05", label: "Refine through iteration" },
              { num: "06", label: "Progress toward Founder Track" },
            ].map((item, i) => (
              <div key={item.num} style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "13px 0",
                borderBottom: i < 5 ? "1px solid rgba(12,12,20,0.07)" : "none",
              }}>
                <span style={{
                  fontFamily: "Nasalization, sans-serif",
                  fontSize: 11, fontWeight: 700,
                  color: "#c4c4d4", minWidth: 24,
                }}>{item.num}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0c0c14" }}>{item.label}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(12,12,20,0.07)" }}>
              <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.7, color: "#0c0c14", marginBottom: 0 }}>
                Your MVP becomes your <span style={grad}>proof.</span><br />
                Your traction becomes your <span style={grad}>signal.</span>
              </p>
            </div>
          </motion.div>

              {/* D: Builder to Leader - spans 2 cols, light mode */}
              <motion.div
                {...fadeUp(0.25)}
                className="udaan-bento-span2"
                style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    background: "#fff",
                    border: "1px solid rgba(12,12,20,0.09)",
                    padding: "40px 44px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column" as const,
                    justifyContent: "center",
                }}
              >
                {/* Ghost watermark */}
                <div style={{
                  position: "absolute", right: -10, bottom: -20,
                  fontFamily: "Nasalization, sans-serif", fontSize: 110, fontWeight: 700,
                  color: "rgba(99,102,241,0.05)", lineHeight: 1,
                  userSelect: "none", pointerEvents: "none", letterSpacing: "-0.04em",
                }}>LEAD</div>

                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 16,
                }}>From Builder to Leader</div>

                <p style={{ fontSize: 18, fontWeight: 800, color: "#0c0c14", lineHeight: 1.5, marginBottom: 32 }}>
                  A Lieutenant does not wait for permission.{" "}
                  <span style={grad}>A Lieutenant advances the mission.</span>
                </p>

                <div className="udaan-soldier-pillars-grid">
                  {[
                    { num: "01", label: "Support Soldiers", desc: "Mentor and guide incoming members" },
                    { num: "02", label: "Refine prototypes", desc: "Iterate on your AI product build" },
                    { num: "03", label: "Prepare for Demo Day", desc: "Structure your pitch and traction" },
                    { num: "04", label: "Build toward scale", desc: "Position your startup for growth" },
                  ].map((item) => (
                    <div key={item.num} style={{
                      background: "linear-gradient(145deg, #f8f8fb 0%, #f2f2fa 100%)",
                      border: "1px solid rgba(99,102,241,0.12)",
                      borderRadius: 14,
                      padding: "20px 20px 22px",
                    }}>
                      <div style={{
                        fontFamily: "Nasalization, sans-serif",
                        fontSize: 13, fontWeight: 700,
                        ...grad, marginBottom: 10,
                      }}>{item.num}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#0c0c14", lineHeight: 1.3, marginBottom: 6 }}>{item.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 400, color: "#9494aa", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

        </div>

        {/* ── BOTTOM MANIFESTO - light ── */}
        <motion.div
          {...fadeUp(0.35)}
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
          <div style={{
            position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
            fontFamily: "Nasalization, sans-serif",
            fontSize: "clamp(80px, 12vw, 160px)",
            fontWeight: 700,
            color: "rgba(99,102,241,0.04)", lineHeight: 1,
            userSelect: "none", pointerEvents: "none", letterSpacing: "-0.04em",
          }}>EXECUTE</div>

          {/* Left: closing manifesto */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 16,
            }}>The Bottom Line</div>
            <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.35, color: "#0c0c14", marginBottom: 0 }}>
              Being a Soldier is preparation.<br />
              Becoming a Lieutenant is{" "}
              <span style={grad}>evolution.</span>
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: "rgba(12,12,20,0.08)", alignSelf: "stretch" }} />

          {/* Right: rank spec table */}
          <div style={{ paddingLeft: 8 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 20,
            }}>Rank Specification</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
              {[
                { label: "Rank Type", value: "Execution" },
                { label: "Entry via", value: "Shipped work" },
                { label: "Output", value: "AI MVP + Traction" },
              ].map((row, i) => (
                <div key={row.label} style={{
                  display: "flex",
                  justifyContent: "space-between" as const,
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: i < 2 ? "1px solid rgba(12,12,20,0.07)" : "none",
                }}>
                  <span style={{ fontSize: 13, color: "#9494aa", fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: 14, color: "#0c0c14", fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
