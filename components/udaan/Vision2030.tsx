"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const CITIES = [
  { cc: "IN", city: "Delhi", desc: "Leading India's AI startup surge", founders: "820+" },
  { cc: "PK", city: "Lahore", desc: "Pakistan's founder capital", founders: "410+" },
  { cc: "BD", city: "Dhaka", desc: "Fastest-growing founder city in BD", founders: "290+" },
  { cc: "IN", city: "Mumbai", desc: "Finance meets AI innovation", founders: "340+" },
  { cc: "PK", city: "Karachi", desc: "Ocean city, startup momentum", founders: "180+" },
  { cc: "--", city: "Tier-2 Cities", desc: "Where the real story is written", founders: "360+" },
];

const rowVariants = {
  rest: { x: 0, backgroundColor: "transparent" },
  hover: { x: 6, backgroundColor: "var(--vbg)" },
};
const arrowVariants = {
  rest: { opacity: 0, x: -6 },
  hover: { opacity: 1, x: 0 },
};
const badgeVariants = {
  rest: { background: "var(--bg2)", borderColor: "var(--line)", color: "var(--sub2)" },
  hover: { background: "var(--vbg2)", borderColor: "rgba(91,75,236,0.3)", color: "var(--v)" },
};
const countVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.12 },
};

function CityRow({ c, i }: { c: typeof CITIES[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      variants={rowVariants}
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0, backgroundColor: "transparent" } : {}}
      whileHover="hover"
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as any }}
      style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 12px", borderBottom: "1px solid var(--line)", cursor: "pointer", borderRadius: 10, marginLeft: -12, marginRight: -12 }}
    >
      <motion.div
        variants={badgeVariants}
        transition={{ duration: 0.18 }}
        style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 800, letterSpacing: "0.05em", flexShrink: 0 }}
      >{c.cc}</motion.div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)" }}>{c.city}</div>
        <div style={{ fontSize: "12px", color: "var(--sub)", marginTop: 2 }}>{c.desc}</div>
      </div>
      <motion.div
        variants={countVariants}
        transition={{ duration: 0.18 }}
        style={{ textAlign: "right" }}
      >
        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--v)" }}>{c.founders}</div>
        <div style={{ fontSize: "10px", color: "var(--sub2)", marginTop: 1 }}>founders</div>
      </motion.div>
      <motion.svg
        variants={arrowVariants}
        transition={{ duration: 0.18 }}
        width="14" height="14" viewBox="0 0 14 14" fill="none"
        style={{ flexShrink: 0 }}
      >
        <path d="M2.5 7H11.5M8 3L11.5 7L8 11" stroke="var(--v)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </motion.svg>
    </motion.div>
  );
}

export default function Vision2030() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "var(--bg)", padding: "120px 0" }}>
      <div className="wrap">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 24 }}
        >
        </motion.div>

        {/* Giant number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] as any }}
          style={{ textAlign: "center", marginBottom: 16, overflow: "visible" }}
        >
          <div style={{
            fontFamily: "var(--font-fraunces, serif)",
            fontStyle: "italic",
            fontSize: "clamp(72px, 13vw, 200px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            background: "linear-gradient(135deg, #5b4bec 0%, #a89ff7 50%, #5b4bec 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}>
            100,000
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 12 }}
        >
          <h2 style={{ fontSize: "clamp(22px, 3vw, 40px)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em" }}>
            AI startup founders. By 2030.
          </h2>
          <p style={{ fontSize: "16px", color: "var(--sub)", marginTop: 10, maxWidth: 520, margin: "10px auto 0" }}>
            Not from Silicon Valley. From our cities. Our towns. Our communities.
          </p>
        </motion.div>

        {/* Impact stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginTop: 72, background: "var(--line)", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden" }}
        >
          {[
            { v: "2,400+", l: "Active builders" },
            { v: "3", l: "Nations unified" },
            { v: "47", l: "MVPs shipped / week" },
            { v: "2030", l: "Target year" },
          ].map((s, i) => (
            <div key={s.l} style={{ background: "var(--bg)", padding: "28px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 900, letterSpacing: "-0.05em", color: "var(--ink)", lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: "12px", color: "var(--sub)", marginTop: 6, fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </motion.div>

        {/* Milestone timeline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
          style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}
        >
          {[
            { year: "2024", label: "Foundation", desc: "Community launched. First 500 builders onboarded across 3 nations.", active: true },
            { year: "2026", label: "Acceleration", desc: "10,000 founders. First cross-border ventures shipping product.", active: false },
            { year: "2027", label: "Scale", desc: "50,000 founders. Regional hubs in 10+ cities. Institutional recognition.", active: false },
            { year: "2030", label: "Mission Complete", desc: "100,000 AI startup founders. South Asia's startup decade begins.", active: false },
          ].map((m) => (
            <div key={m.year} style={{ padding: "24px 20px", background: m.active ? "var(--vbg)" : "var(--bg2)", borderRadius: 16, border: `1px solid ${m.active ? "rgba(91,75,236,0.2)" : "var(--line)"}` }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: m.active ? "var(--v)" : "var(--sub2)", marginBottom: 8 }}>{m.year}</div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)", marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: "12px", color: "var(--sub)", lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Two column below */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 48 }}>
          {/* City list — staggered animation */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
            >
              <div className="t-label" style={{ marginBottom: 20 }}>Where We&apos;re Building</div>
            </motion.div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {CITIES.map((c, i) => <CityRow key={c.city} c={c} i={i} />)}
            </div>
          </div>

          {/* Dark card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="surface-ink" style={{ padding: 36, height: "100%", position: "relative", overflow: "hidden" }}>
              {/* Glow */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 30%, rgba(91,75,236,0.22) 0%, transparent 60%)", pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                  <div>
                    <div className="t-label" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>By 2030</div>
                    <div style={{ fontSize: "56px", fontWeight: 900, letterSpacing: "-0.07em", color: "#fff", lineHeight: 1 }}>100K</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: 4 }}>AI Startup Founders</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Current progress</div>
                    <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--v2)", letterSpacing: "-0.04em" }}>2.4%</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>2,400 / 100,000</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ position: "relative", height: 6, marginBottom: 10 }}>
                    {/* Track */}
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", borderRadius: 99 }} />
                    {/* Fill */}
                    <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "max(2.4%, 20px)", background: "linear-gradient(90deg, #5b4bec, #a89ff7)", borderRadius: 99 }} />
                    {/* Dot at fill end */}
                    <div style={{ position: "absolute", top: "50%", left: "max(2.4%, 20px)", transform: "translate(-50%, -50%)", width: 12, height: 12, borderRadius: "50%", background: "#a89ff7", border: "2px solid var(--ink)", boxShadow: "0 0 8px rgba(168,159,247,0.6)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>0</span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--v2)" }}>2,400 founders so far</span>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>100,000</span>
                  </div>
                </div>

                {/* Nation breakdown with bars */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {[
                    { pct: "60%", label: "India", cc: "IN", w: "60%", col: "#5b4bec" },
                    { pct: "25%", label: "Pakistan", cc: "PK", w: "25%", col: "#f59e0b" },
                    { pct: "15%", label: "Bangladesh", cc: "BD", w: "15%", col: "#10b981" },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{s.cc} · {s.label}</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{s.pct}</span>
                      </div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 99 }}>
                        <div style={{ height: "100%", width: s.w, background: s.col, borderRadius: 99, opacity: 0.8 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Manifesto quote */}
                <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 20 }}>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontStyle: "italic" }}>
                    &ldquo;When 100,000 choose ownership over employment, the economic trajectory of South Asia shifts permanently.&rdquo;
                  </p>
                </div>

                {/* Mini stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { v: "$0", l: "Certificates sold" },
                    { v: "1M+", l: "Jobs to be created" },
                    { v: "47/wk", l: "MVPs shipping now" },
                    { v: "2030", l: "The deadline" },
                  ].map(s => (
                    <div key={s.l} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{s.v}</div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
