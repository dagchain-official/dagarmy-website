"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const ACTIVITY_POOL = [
  { cc: "IN", name: "Arjun S.",    action: "shipped MVP",              col: "#5b4bec" },
  { cc: "PK", name: "Fatima K.",   action: "validated idea",           col: "#f59e0b" },
  { cc: "BD", name: "Rashed M.",   action: "joined Builder Circle",    col: "#10b981" },
  { cc: "IN", name: "Priya T.",    action: "raised pre-seed",          col: "#5b4bec" },
  { cc: "PK", name: "Zara A.",     action: "posted idea for feedback", col: "#f59e0b" },
  { cc: "IN", name: "Karan V.",    action: "got 3 co-founder pings",   col: "#5b4bec" },
  { cc: "BD", name: "Nadia H.",    action: "completed week 4 sprint",  col: "#10b981" },
  { cc: "IN", name: "Rohan D.",    action: "launched landing page",    col: "#5b4bec" },
  { cc: "PK", name: "Omar F.",     action: "earned Builder rank",      col: "#f59e0b" },
  { cc: "IN", name: "Sneha R.",    action: "shipped v2 of product",    col: "#5b4bec" },
  { cc: "BD", name: "Tariq I.",    action: "onboarded first user",     col: "#10b981" },
  { cc: "IN", name: "Amit G.",     action: "validated with 50 users",  col: "#5b4bec" },
  { cc: "PK", name: "Hina B.",     action: "joined Open Network",      col: "#f59e0b" },
  { cc: "IN", name: "Divya M.",    action: "closed first paying user", col: "#5b4bec" },
  { cc: "BD", name: "Sajid R.",    action: "shipped AI prototype",     col: "#10b981" },
  { cc: "IN", name: "Vikram P.",   action: "mentored 2 founders",      col: "#5b4bec" },
  { cc: "PK", name: "Ayesha N.",   action: "posted weekly update",     col: "#f59e0b" },
  { cc: "IN", name: "Rahul S.",    action: "hit 100 waitlist signups", col: "#5b4bec" },
  { cc: "BD", name: "Minhaj U.",   action: "joined Builder Circle",    col: "#10b981" },
  { cc: "IN", name: "Pooja L.",    action: "shipped MVP in 7 days",    col: "#5b4bec" },
  { cc: "PK", name: "Bilal Ch.",   action: "validated idea publicly",  col: "#f59e0b" },
  { cc: "IN", name: "Nikhil A.",   action: "earned General rank",      col: "#5b4bec" },
  { cc: "BD", name: "Farhan K.",   action: "launched beta product",    col: "#10b981" },
  { cc: "IN", name: "Ananya B.",   action: "got co-founder match",     col: "#5b4bec" },
  { cc: "PK", name: "Sana M.",     action: "shipped first feature",    col: "#f59e0b" },
  { cc: "IN", name: "Deepak R.",   action: "onboarded 10 beta users",  col: "#5b4bec" },
  { cc: "BD", name: "Rabeya A.",   action: "completed idea sprint",    col: "#10b981" },
  { cc: "IN", name: "Suresh K.",   action: "raised angel round",       col: "#5b4bec" },
];

function LiveActivity() {
  const [startIdx, setStartIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setStartIdx(prev => (prev + 1) % ACTIVITY_POOL.length);
        setVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const rows = [0, 1, 2].map(offset => ACTIVITY_POOL[(startIdx + offset) % ACTIVITY_POOL.length]);

  return (
    <div>
      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9494aa", marginBottom: 8 }}>Live Activity</div>
      <div style={{ transition: "opacity 0.3s ease", opacity: visible ? 1 : 0 }}>
        {rows.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderTop: "1px solid rgba(12,12,20,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: `${a.col}18`, border: `1px solid ${a.col}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 800, color: a.col, flexShrink: 0 }}>{a.cc}</div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#0c0c14" }}>{a.name}</span>
              <span style={{ fontSize: "11px", color: "#9494aa" }}>{a.action}</span>
            </div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease },
});

const CARDS = [
  {
    id: 0,
    label: "Udaan Dashboard",
    labelColor: "#5b4bec",
    dark: false,
    content: (
      <div>
        {/* 100K counter */}
        <div style={{ textAlign: "center", padding: "18px 0", background: "var(--bg2)", borderRadius: 14, marginBottom: 14 }}>
          <div style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-0.06em", color: "var(--v)", lineHeight: 1 }}>100K</div>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--sub2)", marginTop: 4 }}>AI Founders Goal</div>
          <div style={{ height: 5, background: "var(--bg3)", borderRadius: 99, margin: "12px 20px 0" }}>
            <div style={{ height: "100%", width: "max(2.4%, 12px)", background: "var(--v)", borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: "11px", color: "var(--sub2)", marginTop: 5 }}>24% of journey complete</div>
        </div>
        {/* Country grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[{ cc: "IN", l: "India", col: "#5b4bec" }, { cc: "PK", l: "Pakistan", col: "#f59e0b" }, { cc: "BD", l: "Bangladesh", col: "#10b981" }].map(s => (
            <div key={s.l} style={{ textAlign: "center", padding: "10px 6px", background: "var(--bg2)", borderRadius: 10 }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: s.col }}>{s.cc}</div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--sub2)", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <LiveActivity />
      </div>
    ),
  },
  {
    id: 1,
    label: "Weekly Momentum",
    labelColor: "#5b4bec",
    dark: false,
    content: (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-0.06em", color: "#0c0c14", lineHeight: 1 }}>47</div>
            <div style={{ fontSize: "12px", color: "#9494aa", marginTop: 6 }}>MVPs shipped this week</div>
          </div>
          <div style={{ padding: "6px 12px", background: "#f4f3ff", borderRadius: 8, border: "1px solid rgba(91,75,236,0.15)" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#5b4bec" }}>+12%</div>
            <div style={{ fontSize: "10px", color: "#9494aa", marginTop: 1 }}>vs last week</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 56, marginBottom: 8 }}>
          {[30,55,40,70,60,85,47].map((v, i) => (
            <div key={i} style={{ flex: 1, height: `${v}%`, background: i === 5 ? "#5b4bec" : "rgba(91,75,236,0.15)", borderRadius: "4px 4px 0 0", alignSelf: "flex-end" }} />
          ))}
        </div>
        <div style={{ display: "flex", marginBottom: 20 }}>
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <span key={i} style={{ flex: 1, textAlign: "center", fontSize: "10px", color: i === 5 ? "#5b4bec" : "#c0c0d0", fontWeight: i === 5 ? 700 : 400 }}>{d}</span>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ v: "2,400+", l: "Builders" }, { v: "3", l: "Nations" }, { v: "340+", l: "Circle" }].map(s => (
            <div key={s.l} style={{ padding: "10px 8px", background: "#f7f7f9", borderRadius: 10, textAlign: "center", border: "1px solid rgba(12,12,20,0.06)" }}>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#0c0c14", letterSpacing: "-0.03em" }}>{s.v}</div>
              <div style={{ fontSize: "10px", color: "#9494aa", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    label: "Idea Validation",
    labelColor: "#10b981",
    dark: false,
    content: (
      <div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)", marginBottom: 4 }}>AI Hiring Tool for SMEs</div>
          <div style={{ fontSize: "12px", color: "var(--sub)", lineHeight: 1.6 }}>Automates first-round screening for small businesses in tier-2 cities.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[{ v: "128", l: "Reactions", col: "#5b4bec" }, { v: "34", l: "Co-founder pings", col: "#10b981" }, { v: "12", l: "Mentors viewed", col: "#f59e0b" }].map(s => (
            <div key={s.l} style={{ padding: "10px 8px", background: "var(--bg2)", borderRadius: 10, textAlign: "center", border: "1px solid var(--line)" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: s.col, letterSpacing: "-0.04em" }}>{s.v}</div>
              <div style={{ fontSize: "10px", color: "var(--sub2)", marginTop: 2, lineHeight: 1.3 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { step: "Idea posted", done: true },
            { step: "12 reactions received", done: true },
            { step: "3 co-founder pings", done: true },
            { step: "MVP scope defined", done: false },
          ].map((s, i) => (
            <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: s.done ? "var(--v)" : "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.done && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{ fontSize: "12px", color: s.done ? "var(--ink)" : "var(--sub2)", fontWeight: s.done ? 600 : 400 }}>{s.step}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    label: "Rank & Contribution",
    labelColor: "#f59e0b",
    dark: false,
    content: (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "var(--vbg)", borderRadius: 14, border: "1px solid rgba(91,75,236,0.15)", marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--v)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.4 5.2 5.6.8-4 4 .9 5.6L10 15l-4.9 2.6.9-5.6-4-4 5.6-.8L10 2z" fill="white" fillOpacity="0.9"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--ink)" }}>Builder Circle</div>
            <div style={{ fontSize: "11px", color: "var(--sub)", marginTop: 2 }}>Rank earned through contribution</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "var(--v)", letterSpacing: "-0.04em" }}>847</div>
            <div style={{ fontSize: "10px", color: "var(--sub2)" }}>points</div>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "11px", color: "var(--sub)", fontWeight: 600 }}>Progress to General</span>
            <span style={{ fontSize: "11px", color: "var(--v)", fontWeight: 700 }}>847 / 1,000</span>
          </div>
          <div style={{ height: 6, background: "var(--bg3)", borderRadius: 99 }}>
            <div style={{ height: "100%", width: "84.7%", background: "linear-gradient(90deg, #5b4bec, #a89ff7)", borderRadius: 99 }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { action: "Shipped MVP", pts: "+120", col: "#5b4bec" },
            { action: "Mentored 2 founders", pts: "+80", col: "#10b981" },
            { action: "Validated 5 ideas", pts: "+50", col: "#f59e0b" },
          ].map(a => (
            <div key={a.action} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--bg2)", borderRadius: 10, border: "1px solid var(--line)" }}>
              <span style={{ fontSize: "12px", color: "var(--ink)", fontWeight: 600 }}>{a.action}</span>
              <span style={{ fontSize: "12px", fontWeight: 800, color: a.col }}>{a.pts}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function HeroCards() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % CARDS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 1, ease }}
      style={{ position: "relative" }}
    >
      {/* Stacked cards */}
      <div style={{ position: "relative" }}>
        <AnimatePresence mode="wait">
        {CARDS.map((card, i) => {
          const offset = (i - active + CARDS.length) % CARDS.length;
          const isTop = offset === 0;

          if (!isTop) return null;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%" }}
            >
              <div
                style={{
                  padding: 24,
                  background: card.dark ? "#0c0c14" : "#ffffff",
                  borderRadius: 20,
                  border: card.dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(12,12,20,0.08)",
                  boxShadow: "0 24px 60px rgba(9,9,14,0.12), 0 4px 20px rgba(9,9,14,0.06)",
                  minHeight: 420,
                }}
              >
                {/* Card header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: card.labelColor }} />
                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: card.dark ? "rgba(255,255,255,0.45)" : "#9494aa" }}>{card.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {["#ef4444","#f59e0b","#10b981"].map(c => (
                      <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />
                    ))}
                  </div>
                </div>
                {card.content}
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY  = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOp = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "var(--bg)",
        paddingTop: 160,
        paddingBottom: 140,
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.55, pointerEvents: "none" }} />

      {/* Violet glow top-right */}
      <div style={{
        position: "absolute", right: "5%", top: "-10%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(91,75,236,0.09) 0%, transparent 68%)",
        pointerEvents: "none",
      }} />
      {/* Amber glow bottom-left */}
      <div style={{
        position: "absolute", left: "-5%", bottom: "5%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 68%)",
        pointerEvents: "none",
      }} />

      <motion.div
        style={{ y: heroY, opacity: heroOp, position: "relative", zIndex: 1 }}
        className="wrap"
      >
        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "start" }}>

          {/* ── Left column ── */}
          <div>

            {/* Giant headline */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              style={{ marginBottom: 36 }}
            >
              {/* Line 1 */}
              <div style={{ overflow: "hidden", marginBottom: 8 }}>
                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 48 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } } }}
                  className="t-giant"
                  style={{ color: "var(--ink)", fontSize: "clamp(52px, 5.5vw, 88px)" }}
                >
                  100,000
                </motion.h1>
              </div>
              {/* Line 2 — AI Founders. must stay on one line */}
              <div style={{ overflow: "hidden", marginBottom: 8 }}>
                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 48 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } } }}
                  className="t-giant"
                  style={{ color: "var(--ink)", fontSize: "clamp(52px, 5.5vw, 88px)", display: "block" }}
                >
                  AI&nbsp;<span className="grad-v" style={{ display: "inline" }}>Founders.</span>
                </motion.h1>
              </div>
              {/* Line 3 */}
              <div style={{ overflow: "hidden" }}>
                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 48 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } } }}
                  className="t-giant"
                  style={{ color: "var(--ink)", fontSize: "clamp(52px, 5.5vw, 88px)" }}
                >
                  Built here.
                </motion.h1>
              </div>
            </motion.div>

            {/* Subtext */}
            <motion.p
              {...fadeUp(0.5)}
              style={{
                fontSize: "17px", lineHeight: 1.72,
                color: "var(--sub)", maxWidth: 460, marginBottom: 40,
              }}
            >
              South Asia has the talent. The ambition. The hunger.
              What it lacks is a coordinated ecosystem that turns
              AI skill into ownership.{" "}
              <strong style={{ color: "var(--ink)", fontWeight: 700 }}>We are building that.</strong>
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.62)} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 64 }}>
              <button onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))} className="btn btn-ink" style={{ cursor: "pointer" }}>
                Join the Founder Network
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <a href="/blog" className="btn btn-ghost">Learn More</a>
            </motion.div>

            {/* Stats strip */}
            <motion.div {...fadeUp(0.74)}>
              <div className="rule" />
              <div style={{ display: "flex", gap: 0, paddingTop: 24, flexWrap: "wrap" }}>
                {[
                  { n: "2,400+", l: "Founders building" },
                  { n: "3",      l: "Nations unified" },
                  { n: "∞",      l: "Collaboration" },
                  { n: "1M+",    l: "Jobs to create" },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      flex: "1 1 110px",
                      paddingRight: 24,
                      paddingLeft: i > 0 ? 24 : 0,
                      borderRight: i < 3 ? "1px solid var(--line)" : "none",
                    }}
                  >
                    <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1 }}>{s.n}</div>
                    <div style={{ marginTop: 4, fontSize: "12px", color: "var(--sub2)", fontWeight: 500 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* City tags — below stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5, ease }}
              style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}
            >
              {[
                { label: "Delhi — Founding" },
                { label: "Lahore — Launching" },
                { label: "Dhaka — Building" },
              ].map((tag, i) => (
                <motion.div
                  key={tag.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.15, duration: 0.5, ease }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 13px",
                    background: "rgba(255,255,255,0.85)",
                    border: "1px solid var(--line)",
                    borderRadius: 999,
                    backdropFilter: "blur(8px)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--sub)",
                    boxShadow: "0 2px 12px rgba(9,9,14,0.07)",
                  }}
                >
                  <span style={{ color: "var(--v)" }}>●</span>
                  {tag.label}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — 4 shuffling cards ── */}
          <HeroCards />
        </div>

      </motion.div>
    </section>
  );
}
