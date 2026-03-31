"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;
const dm = "var(--font-dm, 'DM Sans', sans-serif)";

function useReveal(margin = "-60px") {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: margin as any });
  return { ref, inView };
}

const grad = {
  background: "linear-gradient(110deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export default function ExecutionSection() {
  const sRef = useRef<HTMLElement>(null);
  const inView = useInView(sRef, { once: true, margin: "-80px" as any });

  return (
    <section ref={sRef} style={{
      position: "relative",
      background: "#ffffff",
      paddingTop: "clamp(100px, 12vh, 160px)",
      paddingBottom: "clamp(100px, 12vh, 160px)",
      overflow: "hidden",
    }}>

      {/* ── LARGE GHOST TEXT WATERMARK ── */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: "'Nasalization', sans-serif",
        fontSize: "clamp(120px, 20vw, 280px)",
        fontWeight: 400,
        letterSpacing: "0.1em",
        color: "rgba(0,0,10,0.022)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
        lineHeight: 1,
      }}>UDAAN</div>

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>

        {/* ── SECTION LABEL ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{
            display: "flex", alignItems: "center", gap: 14,
            marginBottom: "clamp(56px, 7vh, 88px)",
          }}
        >
          <span style={{
            fontFamily: "'Nasalization', sans-serif",
            fontSize: 10, letterSpacing: "0.28em",
            textTransform: "uppercase", color: "#6366f1",
          }}>02</span>
          <div style={{ width: 40, height: 1, background: "rgba(99,102,241,0.25)" }} />
          <span style={{
            fontFamily: dm,
            fontSize: 10, fontWeight: 600,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "#aaa8c8",
          }}>From Idea to Execution</span>
        </motion.div>

        {/* ── HERO ROW: big statement left + two stacked pills right ── */}
        <div className="udaan-reality-white-grid" style={{
          gap: "clamp(48px, 7vw, 112px)",
          alignItems: "start",
          marginBottom: "clamp(80px, 10vh, 128px)",
        }}>

          {/* LEFT — massive typographic statement */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.08, ease }}
          >
            <h2 style={{
              fontFamily: dm,
              fontWeight: 800,
              fontSize: "clamp(42px, 5vw, 76px)",
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              color: "#0a0a0f",
              margin: "0 0 28px 0",
            }}>
              What Udaan<br />
              <span style={grad}>Truly</span><br />
              Represents.
            </h2>

            {/* Fine hairline accent */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.45, ease }}
              style={{
                height: 2, width: 64,
                background: "linear-gradient(90deg, #6366f1, transparent)",
                transformOrigin: "left",
                marginBottom: 32,
              }}
            />

            <p style={{
              fontFamily: dm,
              fontSize: "clamp(14px, 1.2vw, 17px)",
              lineHeight: 1.8,
              color: "#5a5a78",
              fontWeight: 400,
              maxWidth: 440,
            }}>
              Udaan is the launch layer of the{" "}
              <strong style={{ color: "#0a0a0f", fontWeight: 700 }}>DAG Army AI Startup Ecosystem.</strong>{" "}
              It is a focused, high-intensity{" "}
              <span style={grad}><strong>AI Startup Program</strong></span>{" "}
              built as a structured{" "}
              <strong style={{ color: "#0a0a0f", fontWeight: 700 }}>Founder Development Platform.</strong>
            </p>
          </motion.div>

          {/* RIGHT — two stacked content blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 8 }}>

            {/* Block A — Execution Over Theory */}
            <ContentBlock
              delay={0.2}
              number="A"
              accent="#6366f1"
              title="Execution Over Theory"
              content={
                <div>
                  <p style={{ fontFamily: dm, fontSize: "clamp(14px, 1.15vw, 16px)", lineHeight: 1.8, color: "#0a0a0f", fontWeight: 600, margin: "0 0 12px 0" }}>
                    Udaan does not reward attendance.<br />
                    It rewards{" "}
                    <span style={grad}>shipped work.</span>
                  </p>
                  <p style={{ fontFamily: dm, fontSize: "clamp(13px, 1.05vw, 15px)", lineHeight: 1.75, color: "#6a6a88", margin: 0 }}>
                    This is the filtration layer of the ecosystem.
                    Execution earns progression.
                    Builders earn responsibility.
                  </p>
                </div>
              }
            />

            {/* Block B — Not passive learning */}
            <ContentBlock
              delay={0.3}
              number="B"
              accent="#8b5cf6"
              title="A Disciplined Startup Runway"
              content={
                <p style={{ fontFamily: dm, fontSize: "clamp(13px, 1.05vw, 15px)", lineHeight: 1.8, color: "#6a6a88", margin: 0 }}>
                  This is not passive learning. It is a disciplined{" "}
                  <span style={grad}><strong>Startup Runway</strong></span>{" "}
                  where ideas are converted into working models through{" "}
                  <strong style={{ color: "#0a0a0f" }}>execution.</strong>{" "}
                  The outcome is not a certificate — it is a{" "}
                  <span style={grad}><strong>functional prototype, early validation,
                  and a monetization pathway</strong></span>{" "}
                  inside real <strong style={{ color: "#0a0a0f" }}>AI entrepreneurship.</strong>
                </p>
              }
            />
          </div>
        </div>

        {/* ── MARKET REALITY STRIP ── */}
        <MarketStrip inView={inView} />

        {/* ── CLOSING MANIFESTO ── */}
        <ClosingManifesto inView={inView} />

      </div>
    </section>
  );
}

/* ── REUSABLE CONTENT BLOCK ── */
function ContentBlock({ delay, number, accent, title, content }: {
  delay: number;
  number: string;
  accent: string;
  title: string;
  content: React.ReactNode;
}) {
  const { ref, inView } = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      style={{
        padding: "clamp(28px, 3vw, 44px)",
        background: "#fafafa",
          borderLeft: `3px solid ${accent}`,
          borderRadius: 16,
          position: "relative",
          overflow: "hidden",
      }}
    >
      {/* ghost number */}
      <div style={{
        position: "absolute", right: 20, bottom: -12,
        fontFamily: "'Nasalization', sans-serif",
        fontSize: 88, fontWeight: 400,
        color: "rgba(0,0,10,0.025)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        letterSpacing: "0.04em",
      }}>{number}</div>

      <div style={{
        fontFamily: "'Nasalization', sans-serif",
        fontSize: 9, letterSpacing: "0.25em",
        textTransform: "uppercase", color: accent, marginBottom: 14,
      }}>{number}</div>

      <h3 style={{
        fontFamily: dm,
        fontWeight: 700,
        fontSize: "clamp(15px, 1.4vw, 19px)",
        letterSpacing: "-0.025em",
        color: "#0a0a0f",
        margin: "0 0 14px 0",
        lineHeight: 1.2,
      }}>{title}</h3>

      {content}
    </motion.div>
  );
}

/* ── MARKET REALITY STRIP ── */
function MarketStrip({ inView }: { inView: boolean }) {
  const stats = [
    { num: "90%", label: "of startups fail globally", detail: "Startups supported by collaborative ecosystems achieve faster early traction." },
    { num: "42%", label: "fail due to lack of market need", detail: "Udaan directly addresses this through structured validation before expansion." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.4, ease }}
      className="udaan-execution-strip"
      style={{
        marginBottom: "clamp(72px, 9vh, 112px)",
        border: "1px solid rgba(0,0,10,0.07)",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {/* Label panel */}
      <div style={{
        padding: "clamp(28px, 3vw, 44px)",
        background: "#0a0a0f",
        display: "flex", flexDirection: "column", justifyContent: "center",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        minWidth: "clamp(140px, 14vw, 200px)",
      }}>
        <div style={{
          fontFamily: "'Nasalization', sans-serif",
          fontSize: 9, letterSpacing: "0.28em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
          marginBottom: 10,
        }}>Why This<br />Model Matters</div>
        <div style={{
          width: 28, height: 2,
          background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
        }} />
      </div>

      {/* Two stat panels */}
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            padding: "clamp(28px, 3vw, 44px)",
            borderRight: i === 0 ? "1px solid rgba(0,0,10,0.07)" : "none",
            background: i === 0 ? "#ffffff" : "#fafafa",
          }}
        >
          <div style={{
            fontFamily: "'Nasalization', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 4vw, 56px)",
            letterSpacing: "0.02em",
            lineHeight: 1,
            marginBottom: 10,
            background: i === 0
              ? "linear-gradient(110deg, #6366f1, #8b5cf6)"
              : "linear-gradient(110deg, #8b5cf6, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{s.num}</div>
          <div style={{
            fontFamily: dm, fontSize: "clamp(12px, 1vw, 14px)",
            fontWeight: 700, color: "#0a0a0f",
            marginBottom: 8,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>{s.label}</div>
          <p style={{
            fontFamily: dm, fontSize: "clamp(12px, 1vw, 13px)",
            lineHeight: 1.65, color: "#8080a0", margin: 0, fontWeight: 400,
          }}>{s.detail}</p>
        </div>
      ))}
    </motion.div>
  );
}

/* ── CLOSING MANIFESTO ── */
function ClosingManifesto({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.55, ease }}
      className="udaan-execution-closing"
      style={{
        gap: 2,
        alignItems: "stretch",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {/* Left — builder-first culture text */}
      <div style={{
        padding: "clamp(36px, 4vw, 56px)",
        background: "#f4f4f8",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <div style={{
          fontFamily: "'Nasalization', sans-serif",
          fontSize: 9, letterSpacing: "0.28em",
          textTransform: "uppercase", color: "#a0a0c0",
          marginBottom: 20,
        }}>The Ecosystem Model</div>
        <p style={{
          fontFamily: dm,
          fontSize: "clamp(14px, 1.2vw, 17px)",
          lineHeight: 1.8, color: "#4a4a6a",
          fontWeight: 400, margin: "0 0 0 0", flex: 1,
        }}>
          Startups supported by collaborative ecosystems achieve faster early traction,
          reinforcing a builder-first culture grounded in{" "}
          <strong style={{ color: "#0a0a0f" }}>accountability and execution.</strong>
        </p>
      </div>

      {/* Right — closing statement, full black */}
      <div style={{
        padding: "clamp(36px, 4vw, 56px)",
        background: "#0a0a0f",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        position: "relative", overflow: "hidden",
      }}>
        {/* ghost decoration */}
        <div style={{
          position: "absolute", top: -24, right: -24,
          width: 160, height: 160,
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 260, height: 260,
          border: "1px solid rgba(255,255,255,0.025)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        <div style={{
          fontFamily: "'Nasalization', sans-serif",
          fontSize: 9, letterSpacing: "0.28em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
          marginBottom: 20,
        }}>The Bottom Line</div>
        <p style={{
          fontFamily: dm,
          fontWeight: 800,
          fontSize: "clamp(22px, 2.4vw, 34px)",
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
          color: "#ffffff",
          margin: 0,
        }}>
          Udaan is not a learning track.{" "}
          <span style={{
            background: "linear-gradient(110deg, #818cf8, #c4b5fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            It is an execution runway.
          </span>
        </p>
      </div>
    </motion.div>
  );
}
