"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const tiers = [
  {
    icon: "🌐",
    title: "Open Network",
    badge: "Free Access",
    badgeClass: "pill-green",
    cta: "Join for Free",
    ctaClass: "btn-ghost",
    desc: "The entry point — anyone can join. No gatekeeping. No hierarchy of credentials. Only contribution.",
    features: ["Weekly founder sessions", "Idea validation rooms", "Collaborative problem-solving", "Peer-driven discussions"],
    locked: false,
  },
  {
    icon: "⚡",
    title: "Builder Circle",
    badge: "By Contribution",
    badgeClass: "pill-v",
    cta: "Apply to Builder Circle",
    ctaClass: "btn-v",
    desc: "For founders who are launching, not experimenting. Structured mentorship, cohort-based acceleration, full accountability systems.",
    features: ["Structured mentorship", "Cohort-based acceleration", "Execution frameworks", "Demo opportunities"],
    locked: false,
  },
  {
    icon: "🏆",
    title: "General",
    badge: "Status Earned",
    badgeClass: "pill-amber",
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
    <section ref={ref} style={{ background: "var(--bg2)", padding: "120px 0" }}>
      <div className="wrap">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 64 }}
        >
          <h2 className="t-section" style={{ color: "var(--ink)", maxWidth: 640 }}>
            Three tiers. One{" "}
            <span className="grad-v">standard.</span>
          </h2>
          <p className="t-body" style={{ marginTop: 16, maxWidth: 520 }}>
            From open access to earned leadership — every level is unlocked through what you ship, not what you pay.
          </p>
        </motion.div>

        {/* Tier tabs + content */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
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
                  background: active === i ? "var(--bg)" : "transparent",
                  border: active === i ? "1px solid var(--line)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: "19px" }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: active === i ? "var(--ink)" : "var(--sub)", transition: "color 0.2s" }}>{t.title}</div>
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
                    className="surface"
                    style={{
                      padding: 40,
                      opacity: t.locked ? 0.6 : 1,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {t.locked && (
                      <div style={{
                        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(255,255,255,0.5)", backdropFilter: "blur(2px)", zIndex: 10, borderRadius: "var(--r)",
                      }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "32px", marginBottom: 8 }}>🔒</div>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--ink)" }}>Earned through contribution</div>
                          <div style={{ fontSize: "12px", color: "var(--sub)", marginTop: 4 }}>No hierarchy of credentials. Only contribution. Only execution.</div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--bg2)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{t.icon}</div>
                        <div>
                          <h3 style={{ fontWeight: 800, fontSize: "21px", color: "var(--ink)", letterSpacing: "-0.025em" }}>{t.title}</h3>
                          <p style={{ fontSize: "13px", color: "var(--sub)", marginTop: 2 }}>{t.desc.split(".")[0]}.</p>
                        </div>
                      </div>
                      <span className={`pill ${t.badgeClass}`}>{t.badge}</span>
                    </div>

                    <p style={{ fontSize: "14px", color: "var(--sub)", lineHeight: 1.7, marginBottom: 24, maxWidth: 600 }}>{t.desc}</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
                      {t.features.map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "var(--green)", fontWeight: 700, fontSize: "12px" }}>✓</span>
                          <span style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {!t.locked && (
                      <button onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))} className={`btn ${t.ctaClass}`} style={{ cursor: "pointer" }}>{t.cta} →</button>
                    )}
                    {t.locked && (
                      <div style={{ fontSize: "13px", color: "var(--amber)", fontWeight: 700 }}>&#x1F512; {t.cta}</div>
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
          <p style={{ fontSize: "14px", color: "var(--sub2)" }}>
            <strong style={{ color: "var(--ink)" }}>No hierarchy of credentials.</strong>{" "}
            Only contribution. Only execution.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
