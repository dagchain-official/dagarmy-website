"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const tiers = [
  {
    title: "Open Network",
    badge: "Free Access",
    badgeColor: "rgba(16,185,129,0.1)",
    badgeBorder: "rgba(16,185,129,0.2)",
    badgeText: "#059669",
    cta: "Join for Free",
    ctaClass: "btn-ghost",
    desc: "The entry point — anyone can join. No gatekeeping. No hierarchy of credentials. Only contribution.",
    features: ["Weekly founder sessions", "Idea validation rooms", "Collaborative problem-solving", "Peer-driven discussions"],
    locked: false,
  },
  {
    title: "Builder Circle",
    badge: "By Contribution",
    badgeColor: "rgba(91,75,236,0.1)",
    badgeBorder: "rgba(91,75,236,0.2)",
    badgeText: "#5b4bec",
    cta: "Apply to Builder Circle",
    ctaClass: "btn-ink",
    desc: "For founders who are launching, not experimenting. Structured mentorship, cohort-based acceleration, full accountability systems.",
    features: ["Structured mentorship", "Cohort-based acceleration", "Execution frameworks", "Demo opportunities"],
    locked: false,
  },
  {
    title: "General",
    badge: "Status Earned",
    badgeColor: "rgba(245,158,11,0.1)",
    badgeBorder: "rgba(245,158,11,0.2)",
    badgeText: "#d97706",
    cta: "Earned through contribution",
    ctaClass: "btn-ghost",
    desc: "Earned through contribution — never bought. Rank inside this movement is earned through contribution, not payment.",
    features: ["Lead regional chapters", "Mentor next cohorts", "Represent the movement", "Shape the ecosystem"],
    locked: true,
  },
];

export default function Ecosystem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(1);

  return (
    <section ref={ref} style={{ background: "#fafafa", padding: "120px 0" }}>
      <div className="wrap">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 64 }}
        >
          <h2 style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.08, color: "#111", maxWidth: 640 }}>
            Three tiers. One{" "}
            <span style={{ color: "#888" }}>standard.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.75, marginTop: 16, maxWidth: 520 }}>
            From open access to earned leadership — every level is unlocked through what you ship, not what you pay.
          </p>
        </motion.div>

        {/* Tier tabs + content */}
        <div className="udaan-ecosystem-grid" style={{ gap: 24 }}>
          {/* Vertical nav */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 4 }}>
            {tiers.map((t, i) => (
              <button
                key={t.title}
                onClick={() => setActive(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: active === i ? "#fff" : "transparent",
                  border: active === i ? "1px solid #ebebeb" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: active === i ? "#111" : "#ccc", transition: "background 0.2s", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: active === i ? "#111" : "#888", transition: "color 0.2s" }}>{t.title}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Active tier card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {(() => {
                const t = tiers[active];
                return (
                  <div
                    style={{
                      background: "#fff", border: "1px solid #f0f0f0", borderRadius: 18,
                      padding: 40,
                      opacity: t.locked ? 0.6 : 1,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {t.locked && (
                      <div style={{
                        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(255,255,255,0.5)", backdropFilter: "blur(2px)", zIndex: 10, borderRadius: 18,
                      }}>
                        <div style={{ textAlign: "center" }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>Earned through contribution</div>
                          <div style={{ fontSize: "12px", color: "#888", marginTop: 4 }}>No hierarchy of credentials. Only contribution. Only execution.</div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "#f5f5f5", border: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#111" }} /></div>
                        <div>
                          <h3 style={{ fontWeight: 800, fontSize: "21px", color: "#111", letterSpacing: "-0.025em" }}>{t.title}</h3>
                          <p style={{ fontSize: "13px", color: "#888", marginTop: 2 }}>{t.desc.split(".")[0]}.</p>
                        </div>
                      </div>
                      <span style={{ display:"inline-flex", alignItems:"center", padding:"4px 12px", borderRadius:999, fontSize:"11px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", background:t.badgeColor, border:`1px solid ${t.badgeBorder}`, color:t.badgeText }}>{t.badge}</span>
                    </div>

                    <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, marginBottom: 24, maxWidth: 600 }}>{t.desc}</p>

                    <div className="udaan-reality-white-grid" style={{ gap: 10, marginBottom: 28 }}>
                      {t.features.map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1 5 3.5 7.5 9 2" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span style={{ fontSize: "13px", color: "#111", fontWeight: 500 }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {!t.locked && (
                      <button onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))} className={`btn ${t.ctaClass}`} style={{ cursor: "pointer" }}>{t.cta} →</button>
                    )}
                    {t.locked && (
                      <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"13px", color:"#d97706", fontWeight:700 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> {t.cta}</div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <p style={{ fontSize: "14px", color: "#999" }}>
            <strong style={{ color: "#111" }}>No hierarchy of credentials.</strong>{" "}
            Only contribution. Only execution.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
