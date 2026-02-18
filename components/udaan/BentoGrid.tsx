"use client";
// BentoGrid — exact reference layout, rem→px, no emojis
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Card({ children, i = 0, style = {} }: { children: React.ReactNode; i?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as any }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default function BentoGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section style={{ background: "var(--bg2)", padding: "120px 0" }}>
      <div className="wrap">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
          style={{ marginBottom: 60 }}
        >
          <h2 className="t-section" style={{ color: "var(--ink)" }}>
            A hierarchy built on{" "}
            <span className="grad-v">contribution.</span>
          </h2>
          <p className="t-body" style={{ marginTop: 20 }}>
            Rank is earned through action, not payment. The more you build and give back, the higher you rise.
          </p>
        </motion.div>

        {/* Bento grid — exact reference layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto", gap: 16 }}>

          {/* Big card — spans 2 cols */}
          <Card i={0} style={{ gridColumn: "span 2" }}>
            <div className="surface-ink" style={{ padding: 40, height: "100%", minHeight: 280, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -40, top: -40, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(91,75,236,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div className="pill pill-v" style={{ marginBottom: 20 }}>Live Platform</div>
              <h3 className="t-card" style={{ color: "#fff", marginBottom: 12 }}>The Founder Operating System</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 380 }}>
                From first idea to shipped product — structured accountability, peer validation,
                and cross-border collaboration baked in.
              </p>
              <div style={{ position: "absolute", bottom: 32, right: 32 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {["IN", "PK", "BD"].map(f => (
                    <div key={f} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{f}</div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Tall card — spans 2 rows */}
          <Card i={1} style={{ gridRow: "span 2" }}>
            <div className="surface" style={{ padding: 28, height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}>
              <div className="pill pill-green" style={{ marginBottom: 20, alignSelf: "flex-start" }}>✓ Execution Focus</div>
              <h3 className="t-card" style={{ color: "var(--ink)", marginBottom: 12 }}>Validate before you build</h3>
              <p style={{ fontSize: "13px", color: "var(--sub)", lineHeight: 1.65, marginBottom: 20 }}>
                Post your idea. Get crowdsourced feedback from 2,400+ builders before writing a line of code.
              </p>

              {/* Live idea preview */}
              <div style={{ background: "var(--bg2)", borderRadius: 14, padding: "16px", border: "1px solid var(--line)", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--vbg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "var(--v)" }}>AK</div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink)" }}>Arjun K.</div>
                    <div style={{ fontSize: "10px", color: "var(--sub2)" }}>Posted 4 min ago</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>AI Resume Screener for SMEs</div>
                <div style={{ fontSize: "11px", color: "var(--sub)", lineHeight: 1.55 }}>Automates first-round hiring for small businesses in tier-2 cities using LLMs.</div>
              </div>

              {/* Reaction stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[{ v: "128", l: "Reactions", col: "var(--v)" }, { v: "34", l: "Co-founder pings", col: "#10b981" }, { v: "12", l: "Mentors viewed", col: "#f59e0b" }].map(s => (
                  <div key={s.l} style={{ padding: "10px 8px", background: "var(--bg2)", borderRadius: 10, textAlign: "center", border: "1px solid var(--line)" }}>
                    <div style={{ fontSize: "18px", fontWeight: 900, color: s.col, letterSpacing: "-0.04em" }}>{s.v}</div>
                    <div style={{ fontSize: "9px", color: "var(--sub2)", marginTop: 2, lineHeight: 1.3, fontWeight: 600 }}>{s.l}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                {["Idea posted", "12 reactions", "3 co-founder pings", "MVP scope defined"].map((step, idx) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: idx < 3 ? "var(--v)" : "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: idx < 3 ? "#fff" : "var(--sub2)", flexShrink: 0 }}>{idx + 1}</div>
                    <span style={{ fontSize: "13px", color: idx < 3 ? "var(--ink)" : "var(--sub2)", fontWeight: idx < 3 ? 600 : 400 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Metric card */}
          <Card i={2}>
            <div className="surface" style={{ padding: 28 }}>
              <div className="t-label" style={{ marginBottom: 16 }}>Cross-border reach</div>
              <div style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-0.06em", color: "var(--ink)", lineHeight: 1 }}>3</div>
              <div style={{ fontSize: "14px", color: "var(--sub)", marginTop: 6, fontWeight: 600 }}>Nations, one standard of execution</div>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                {[{ c: "India", w: "60%", col: "#5b4bec" }, { c: "Pakistan", w: "25%", col: "#f59e0b" }, { c: "Bangladesh", w: "15%", col: "#10b981" }].map(b => (
                  <div key={b.c}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "12px", color: "var(--sub)", fontWeight: 600 }}>{b.c}</span>
                      <span style={{ fontSize: "12px", color: "var(--sub2)" }}>{b.w}</span>
                    </div>
                    <div style={{ height: 5, background: "var(--bg3)", borderRadius: 99 }}>
                      <div style={{ height: "100%", width: b.w, background: b.col, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Activity card */}
          <Card i={3}>
            <div style={{ background: "var(--v)", borderRadius: "var(--r)", padding: 28, height: "100%" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>Weekly Momentum</div>
              <div style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-0.06em", color: "#fff", lineHeight: 1 }}>47</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", marginTop: 6, fontWeight: 600 }}>MVPs shipped this week</div>
              <div style={{ marginTop: 20, display: "flex", gap: 4, height: 40 }}>
                {[30,55,40,70,60,85,47].map((v, i) => (
                  <div key={i} style={{ flex: 1, height: `${v}%`, background: "rgba(255,255,255,0.3)", borderRadius: 3, alignSelf: "flex-end" }} />
                ))}
              </div>
            </div>
          </Card>

          {/* Wide bottom card — spans 3 cols */}
          <Card i={4} style={{ gridColumn: "span 3" }}>
            <div className="surface" style={{ padding: "28px 36px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
              {[
                { icon: "→", title: "Idea Validation", desc: "Crowdsource before you code" },
                { icon: "↺", title: "Feedback Loops", desc: "Continuous iteration with peers" },
                { icon: "✦", title: "Accountability", desc: "Ship with momentum, not isolation" },
                { icon: "◎", title: "Cross-border", desc: "IN · PK · BD unified" },
              ].map((f) => (
                <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--bg2)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "var(--v)", fontWeight: 700, flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--ink)" }}>{f.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--sub)", marginTop: 3 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
