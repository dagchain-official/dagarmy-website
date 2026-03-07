"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from "framer-motion";
import HolographicCard from "./HolographicCard";
import MagneticButton from "./MagneticButton";
import RewardDashboard from "./RewardDashboard";
import GlassTerminalForm from "./GlassTerminalForm";

/* ─────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const seen = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !seen.current) {
        seen.current = true;
        const ctrl = animate(0, to, {
          duration: 2, ease: [0.22, 1, 0.36, 1],
          onUpdate: v => setVal(Math.round(v)),
        });
        return () => ctrl.stop();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────────
   DAG NODE SVG ILLUSTRATION (animated)
───────────────────────────────────────────────── */
function DAGNetworkSVG() {
  const nodes = [
    { x: 300, y: 80, r: 14, color: "#a78bfa", delay: 0 },
    { x: 120, y: 180, r: 10, color: "#818cf8", delay: 0.4 },
    { x: 480, y: 160, r: 10, color: "#60a5fa", delay: 0.8 },
    { x: 220, y: 300, r: 16, color: "#6366f1", delay: 0.2 },
    { x: 400, y: 280, r: 12, color: "#c4b5fd", delay: 1.0 },
    { x: 560, y: 320, r: 8,  color: "#93c5fd", delay: 0.6 },
    { x: 100, y: 380, r: 9,  color: "#a78bfa", delay: 1.2 },
    { x: 330, y: 420, r: 13, color: "#8b5cf6", delay: 0.3 },
    { x: 500, y: 440, r: 8,  color: "#60a5fa", delay: 0.9 },
    { x: 180, y: 480, r: 7,  color: "#818cf8", delay: 1.5 },
    { x: 440, y: 180, r: 6,  color: "#c4b5fd", delay: 0.7 },
    { x: 260, y: 220, r: 8,  color: "#6366f1", delay: 1.1 },
  ];
  const edges = [
    [0,1],[0,2],[0,3],[1,3],[2,4],[2,5],[3,4],[3,7],[4,5],
    [4,8],[5,8],[6,7],[7,8],[7,9],[1,6],[3,11],[0,11],[11,4],[10,2],[10,4],
  ];
  return (
    <svg viewBox="0 0 660 560" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="edge1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1"/>
        </linearGradient>
        <linearGradient id="edge2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="bgOrb1" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="bgOrb2" cx="70%" cy="70%" r="40%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Background orbs */}
      <ellipse cx="300" cy="220" rx="220" ry="180" fill="url(#bgOrb1)"/>
      <ellipse cx="440" cy="380" rx="160" ry="140" fill="url(#bgOrb2)"/>

      {/* Edges */}
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke={i % 2 === 0 ? "url(#edge1)" : "url(#edge2)"}
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Pulse rings */}
      {[nodes[0], nodes[3], nodes[7]].map((n, i) => (
        <motion.circle
          key={`pulse-${i}`}
          cx={n.x} cy={n.y} r={n.r}
          stroke={n.color}
          strokeWidth="1"
          fill="none"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, delay: i * 0.8, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={n.x} cy={n.y} r={n.r + 5}
            fill={n.color}
            fillOpacity="0.12"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: n.delay + 0.8, type: "spring", stiffness: 200 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
          <motion.circle
            cx={n.x} cy={n.y} r={n.r}
            fill={n.color}
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
            transition={{
              scale: { duration: 0.5, delay: n.delay + 0.6, type: "spring", stiffness: 200 },
              opacity: { duration: 0.5, delay: n.delay + 0.6 },
              y: { duration: 3 + i * 0.3, delay: n.delay + 1.2, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        </motion.g>
      ))}

      {/* Floating labels on key nodes */}
      {[
        { x: 300, y: 55, text: "DAGChain" },
        { x: 220, y: 330, text: "DAGGPT" },
        { x: 330, y: 450, text: "DAG Army" },
      ].map((l, i) => (
        <motion.text
          key={i}
          x={l.x} y={l.y}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.4)"
          fontFamily="monospace"
          letterSpacing="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 + i * 0.2 }}
        >
          {l.text}
        </motion.text>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────────────── */
function FAQItem({ q, a, i }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", padding: "22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: "24px", textAlign: "left" }}
      >
        <span style={{ fontSize: "16px", fontWeight: 650, color: "#0a0a0a", lineHeight: 1.5, letterSpacing: "-0.2px" }}>{q}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0, background: open ? "#6366f1" : "rgba(99,102,241,0.08)" }}
          transition={{ duration: 0.3 }}
          style={{ width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke={open ? "#fff" : "#6366f1"} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p style={{ margin: "0 0 22px", color: "#6b7280", fontSize: "15px", lineHeight: 1.9 }}>{a}</p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────── */
export default function AmbassadorPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const faqs = [
    { q: "Is this an investment program?", a: "No. The DAG Army Ambassador Program is a performance-based referral and marketing initiative linked to verified product usage. There is no investment element." },
    { q: "Is there a joining fee?", a: "No. Applying and joining is completely free. No payment or investment is required at any stage of the program." },
    { q: "Are earnings guaranteed?", a: "No. All rewards are earned solely through verified ecosystem activity generated via your referral link and content performance." },
    { q: "Can I create content in my regional language?", a: "Absolutely. Regional language content is strongly encouraged. We actively prioritize creators who can engage local communities in their native language." },
    { q: "How long does the review take?", a: "Our team personally reviews each application within 5–10 business days. Shortlisted candidates are contacted via email with next steps." },
    { q: "What content performs best?", a: "Product walkthroughs, AI tool comparisons, node infrastructure explainers, blockchain education, and ecosystem overview content consistently perform best." },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Geist', -apple-system, system-ui, sans-serif", background: "#eceef5" }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes drift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
      `}</style>

      {/* Outer wrapper: soft grey body */}
      <div style={{ padding: "28px 16px 56px", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", borderRadius: "32px", overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.12)" }}>

          {/* ═══════════════════════════════════════════
              HERO — DARK / LIGHT SPLIT
          ═══════════════════════════════════════════ */}
          <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "95vh" }}>

            {/* LEFT — DARK */}
            <div style={{ background: "#08081a", padding: "72px 60px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>

              {/* Radial glow behind text */}
              <div style={{ position: "absolute", top: "50%", left: "10%", transform: "translateY(-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />

              {/* Grid lines decoration */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 2 }}>
                {/* Status */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "100px", padding: "7px 16px 7px 10px", marginBottom: "52px", background: "rgba(34,197,94,0.06)" }}
                >
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", animation: "blink 2s infinite" }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(134,239,172,0.9)", letterSpacing: "0.04em" }}>2026 Applications Open</span>
                </motion.div>

                {/* Headline — line by line */}
                {[
                  { text: "Become a", color: "rgba(255,255,255,0.95)" },
                  { text: "DAG Army", gradient: true },
                  { text: "Ambassador.", color: "rgba(255,255,255,0.95)" },
                ].map((line, i) => (
                  <div key={i} style={{ overflow: "hidden", marginBottom: i === 2 ? "36px" : "2px" }}>
                    <motion.h1
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1.1, delay: 0.08 + i * 0.11, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        margin: 0,
                        fontSize: "clamp(56px, 6.5vw, 90px)",
                        fontWeight: 900,
                        letterSpacing: "-4px",
                        lineHeight: 0.95,
                        paddingBottom: "4px",
                        ...(line.gradient
                          ? { background: "linear-gradient(125deg, #818cf8 0%, #a78bfa 40%, #67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }
                          : { color: line.color })
                      }}
                    >
                      {line.text}
                    </motion.h1>
                  </div>
                ))}

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", lineHeight: 1.85, maxWidth: "380px", marginBottom: "40px" }}
                >
                  Represent the future of AI-native blockchain. Build your personal brand, earn real rewards, and grow alongside a global ecosystem.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
                >
                  <button
                    onClick={() => setFormOpen(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "100px", padding: "14px 30px", fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: "0 0 40px rgba(99,102,241,0.5)", letterSpacing: "-0.01em", fontFamily: "inherit" }}
                  >
                    Apply Now →
                  </button>
                  <button
                    onClick={() => document.getElementById("amb-tiers")?.scrollIntoView({ behavior: "smooth" })}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px", padding: "13px 26px", fontSize: "14px", fontWeight: 600, cursor: "pointer", letterSpacing: "-0.01em", fontFamily: "inherit" }}
                  >
                    Explore Program
                  </button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.85, duration: 0.8 }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", marginTop: "56px", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {[
                    { n: 10000, suffix: "+", l: "Members" },
                    { n: 3, suffix: "", l: "Platforms" },
                    { n: 5, suffix: "", l: "Continents" },
                    { n: 0, suffix: "Free", l: "No Cost" },
                  ].map((s, i) => (
                    <div key={i} style={{ paddingRight: "16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", paddingLeft: i > 0 ? "16px" : "0" }}>
                      <p style={{ margin: "0 0 3px", fontSize: "22px", fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>
                        {s.n === 0 ? s.suffix : <><Counter to={s.n} suffix={s.suffix} /></>}
                      </p>
                      <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>{s.l}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* RIGHT — WHITE with SVG */}
            <div style={{ background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px", position: "relative", overflow: "hidden" }}>
              {/* Subtle grid */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

              {/* Top-right corner label */}
              <div style={{ position: "absolute", top: "32px", right: "32px", display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6366f1", animation: "blink 3s infinite" }} />
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase" }}>DAG Network</span>
              </div>

              <div style={{ width: "100%", maxWidth: "580px", height: "480px", position: "relative", zIndex: 1 }}>
                <DAGNetworkSVG />
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              MARQUEE — VIOLET
          ═══════════════════════════════════════════ */}
          <div style={{ background: "#6366f1", padding: "14px 0", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: "0", width: "max-content", animation: "marquee 24s linear infinite" }}>
              {[...Array(3)].map((_, rep) => (
                <div key={rep} style={{ display: "flex", gap: "0" }}>
                  {["DAG Army", "DAGGPT", "DAGChain", "Web3 Infrastructure", "AI Native", "Layer 1 Blockchain", "Earn Rewards", "Free Access", "Ambassador Program", "Global Community"].map((t, i) => (
                    <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: "24px", padding: "0 24px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{t}</span>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              ECOSYSTEM — DEEP DARK VIOLET
          ═══════════════════════════════════════════ */}
          <section style={{ background: "#0c0a2e", padding: "100px 72px", position: "relative", overflow: "hidden" }}>
            {/* Grid */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />
            {/* Glow orbs */}
            <div style={{ position: "absolute", top: "0", left: "30%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "1px", background: "rgba(99,102,241,0.8)" }} />
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "rgba(165,180,252,0.8)", letterSpacing: "0.12em", textTransform: "uppercase" }}>The Ecosystem</span>
                </div>
              </motion.div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px", flexWrap: "wrap", gap: "32px" }}>
                <motion.h2
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ margin: 0, fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1, color: "#fff" }}
                >
                  Built on<br /><span style={{ background: "linear-gradient(125deg, #818cf8, #a78bfa, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>three pillars.</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ margin: 0, fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: 1.9, maxWidth: "280px" }}
                >
                  A community, an AI platform, and a blockchain — interconnected.
                </motion.p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr", gap: "20px" }}>
                {/* DAG Army — large */}
                {[
                  {
                    num: "01", tag: "Community", name: "DAG Army", desc: "A global community-driven AI and Web3 movement. Ambassadors are the human face of this mission — representing the ecosystem in every corner of the world.",
                    border: "rgba(99,102,241,0.3)", accent: "#818cf8", wide: true,
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(165,180,252,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  },
                  {
                    num: "02", tag: "AI Platform", name: "DAGGPT", desc: "Multi-module AI platform. Free full access for all ambassadors — replacing multiple AI subscriptions in one place.",
                    border: "rgba(96,165,250,0.25)", accent: "#60a5fa", wide: false,
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                  },
                  {
                    num: "03", tag: "Blockchain", name: "DAGChain", desc: "AI-native Layer-1 blockchain. The infrastructure powering the entire ecosystem — built for the next generation of decentralized apps.",
                    border: "rgba(167,139,250,0.25)", accent: "#a78bfa", wide: false,
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  },
                ].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.8, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6 }}
                    style={{ gridColumn: c.wide ? "1 / 2" : "auto", background: "rgba(255,255,255,0.03)", border: `1px solid ${c.border}`, borderRadius: "24px", padding: c.wide ? "44px" : "32px", minHeight: c.wide ? "320px" : "auto", position: "relative", overflow: "hidden", cursor: "default", backdropFilter: "blur(20px)" }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, transparent, ${c.accent}40, transparent)` }} />
                    <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: `${c.accent}15`, border: `1px solid ${c.accent}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                      {c.icon}
                    </div>
                    <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 800, color: `${c.accent}80`, letterSpacing: "0.12em", textTransform: "uppercase" }}>{c.num} — {c.tag}</p>
                    <h3 style={{ margin: "0 0 14px", fontSize: c.wide ? "30px" : "22px", fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>{c.name}</h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.85 }}>{c.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              WHO CAN APPLY — WHITE
          ═══════════════════════════════════════════ */}
          <section style={{ background: "#fff", padding: "100px 72px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: "-60px", top: "50%", transform: "translateY(-50%)", fontSize: "380px", fontWeight: 900, color: "transparent", WebkitTextStroke: "1px rgba(99,102,241,0.04)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>02</div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.12em", textTransform: "uppercase" }}>Who Can Apply</span>
                </div>
              </motion.div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", flexWrap: "wrap", gap: "32px" }}>
                <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ margin: 0, fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1, color: "#0a0a0a" }}>
                  Built for creators<br />and builders.
                </motion.h2>
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} style={{ margin: 0, fontSize: "15px", color: "#6b7280", lineHeight: 1.9, maxWidth: "280px" }}>
                  We welcome passionate voices who can tell the AI and Web3 story in their language.
                </motion.p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "48px" }}>
                {[
                  { title: "YouTubers", desc: "Long-form video creators in AI, crypto & tech", accent: "#ef4444", bg: "rgba(239,68,68,0.07)" },
                  { title: "Instagram Creators", desc: "Visual storytellers with engaged communities", accent: "#ec4899", bg: "rgba(236,72,153,0.07)" },
                  { title: "AI Educators", desc: "Experts simplifying AI for mainstream audiences", accent: "#6366f1", bg: "rgba(99,102,241,0.07)" },
                  { title: "Web3 Influencers", desc: "Voices shaping decentralized tech adoption", accent: "#8b5cf6", bg: "rgba(139,92,246,0.07)" },
                  { title: "Blockchain Analysts", desc: "Research-driven content on Layer-1 ecosystems", accent: "#06b6d4", bg: "rgba(6,182,212,0.07)" },
                  { title: "Facebook Creators", desc: "Community builders with strong regional reach", accent: "#3b82f6", bg: "rgba(59,130,246,0.07)" },
                  { title: "Tech Leaders", desc: "Forum moderators and developer advocates", accent: "#10b981", bg: "rgba(16,185,129,0.07)" },
                  { title: "Regional Language", desc: "Local-language voices driving global adoption", accent: "#f59e0b", bg: "rgba(245,158,11,0.07)" },
                ].map((c, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -5, boxShadow: "0 20px 48px rgba(0,0,0,0.09)" }}
                    style={{ background: "#fff", borderRadius: "20px", padding: "22px 20px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", cursor: "default" }}
                  >
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: c.accent }} />
                    </div>
                    <p style={{ margin: "0 0 5px", fontSize: "13px", fontWeight: 800, color: "#0a0a0a" }}>{c.title}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af", lineHeight: 1.65 }}>{c.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* 3 requirements */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "24px", overflow: "hidden" }}>
                {[
                  { n: "01", title: "Active Audience", desc: "Minimum 1,000 engaged followers across any channel." },
                  { n: "02", title: "Consistent Creator", desc: "Established publishing history with a real community voice." },
                  { n: "03", title: "Clear Communicator", desc: "Ability to explain AI or blockchain clearly in your language." },
                ].map((r, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                    style={{ padding: "32px 28px", borderRight: i < 2 ? "1px solid rgba(0,0,0,0.07)" : "none", transition: "background 0.25s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.025)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <p style={{ margin: "0 0 12px", fontSize: "40px", fontWeight: 900, color: "rgba(0,0,0,0.05)", letterSpacing: "-2px" }}>{r.n}</p>
                    <p style={{ margin: "0 0 7px", fontSize: "15px", fontWeight: 800, color: "#0a0a0a" }}>{r.title}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", lineHeight: 1.85 }}>{r.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              BENEFITS — WARM OFF-WHITE
          ═══════════════════════════════════════════ */}
          <section style={{ background: "#faf9f7", padding: "100px 72px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: "-60px", top: "50%", transform: "translateY(-50%)", fontSize: "380px", fontWeight: 900, color: "transparent", WebkitTextStroke: "1px rgba(99,102,241,0.04)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>03</div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.12em", textTransform: "uppercase" }}>The Rewards</span>
                </div>
              </motion.div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px", flexWrap: "wrap", gap: "32px" }}>
                <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ margin: 0, fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1, color: "#0a0a0a" }}>
                  A unified<br />reward network.
                </motion.h2>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
                  <MagneticButton onClick={() => setFormOpen(true)} variant="primary">Apply Now →</MagneticButton>
                </motion.div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { title: "Free DAGGPT", metric: "10+ AI Modules", accent: "#6366f1", bg: "linear-gradient(145deg,#f5f3ff,#ede9fe)", border: "rgba(196,181,254,0.4)", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>, desc: "Full access to DAGGPT's multi-module AI — replaces multiple subscriptions." },
                    { title: "Referral Earnings", metric: "Real Crypto", accent: "#3b82f6", bg: "linear-gradient(145deg,#eff6ff,#dbeafe)", border: "rgba(147,197,253,0.4)", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>, desc: "Earn based on verified ecosystem activity via your referral link." },
                    { title: "DAG Points", metric: "Redeemable", accent: "#ec4899", bg: "linear-gradient(145deg,#fdf2f8,#fce7f3)", border: "rgba(249,168,212,0.4)", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, desc: "Points redeemable for GasCoin, credits, and premium feature access." },
                    { title: "Verified Status", metric: "Official Badge", accent: "#10b981", bg: "linear-gradient(145deg,#f0fdf4,#d1fae5)", border: "rgba(110,231,183,0.4)", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, desc: "Official badge, featured profile, and exclusive ambassador events." },
                  ].map((b, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.1 }}
                      whileHover={{ y: -5, boxShadow: "0 24px 48px rgba(0,0,0,0.09)" }}
                      style={{ background: b.bg, borderRadius: "22px", padding: "26px", border: `1px solid ${b.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.04)", cursor: "default" }}
                    >
                      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>{b.icon}</div>
                      <p style={{ margin: "0 0 2px", fontSize: "20px", fontWeight: 900, color: b.accent, letterSpacing: "-0.6px" }}>{b.metric}</p>
                      <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 800, color: "#0a0a0a" }}>{b.title}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", lineHeight: 1.75 }}>{b.desc}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                  <RewardDashboard />
                </motion.div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              TIERS — FULL DARK (horizontal rows)
          ═══════════════════════════════════════════ */}
          <section id="amb-tiers" style={{ background: "#08081a", padding: "100px 72px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)", backgroundSize: "72px 72px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "600px", background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "1px", background: "rgba(99,102,241,0.8)" }} />
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "rgba(165,180,252,0.8)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Select Your Path</span>
                  <div style={{ width: "32px", height: "1px", background: "rgba(99,102,241,0.8)" }} />
                </div>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ margin: "0 auto 12px", fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1, color: "#fff", textAlign: "center" }}>
                Ambassador Tiers
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ margin: "0 auto 64px", fontSize: "15px", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
                Tiers reviewed and upgraded based on performance and growth.
              </motion.p>

              {/* Horizontal tier rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  {
                    level: "Silver", range: "1,000+ followers", accent: "#94a3b8", bg: "rgba(148,163,184,0.06)", border: "rgba(148,163,184,0.15)",
                    perks: ["Standard referral rewards", "Free DAGGPT access", "Ambassador badge", "Private community", "Monthly report"],
                  },
                  {
                    level: "Gold", range: "50,000+ followers", accent: "#fbbf24", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)",
                    perks: ["Enhanced reward rate", "Performance bonuses", "Featured profile", "Priority support", "Early ecosystem access", "Account manager"],
                  },
                  {
                    level: "Platinum", range: "100,000+ followers", accent: "#a78bfa", bg: "rgba(99,102,241,0.1)", border: "rgba(167,139,250,0.35)", featured: true,
                    perks: ["Custom partnership terms", "Regional leadership", "Revenue-share", "Executive access", "Co-branded campaigns", "Governance input"],
                  },
                ].map((t, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ x: 6 }}
                    style={{ display: "grid", gridTemplateColumns: "200px 1fr auto", alignItems: "center", gap: "40px", background: t.bg, border: `1px solid ${t.border}`, borderRadius: "20px", padding: "28px 36px", position: "relative", overflow: "hidden", cursor: "default" }}
                  >
                    {t.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #a78bfa, #67e8f9, transparent)" }} />}
                    {/* Level name */}
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 800, color: t.accent, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>{t.range}</p>
                      <h3 style={{ margin: 0, fontSize: "30px", fontWeight: 900, color: t.featured ? t.accent : "#fff", letterSpacing: "-1.2px" }}>{t.level}</h3>
                    </div>
                    {/* Perks chips */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {t.perks.map((p, j) => (
                        <span key={j} style={{ background: `${t.accent}15`, border: `1px solid ${t.accent}25`, borderRadius: "100px", padding: "5px 12px", fontSize: "12px", color: `${t.accent}dd`, fontWeight: 600 }}>{p}</span>
                      ))}
                    </div>
                    {/* CTA */}
                    <button
                      onClick={() => setFormOpen(true)}
                      style={{ whiteSpace: "nowrap", background: t.featured ? t.accent : "transparent", color: t.featured ? "#fff" : t.accent, border: `1px solid ${t.accent}50`, borderRadius: "100px", padding: "11px 22px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Apply →
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              FAQ — WHITE
          ═══════════════════════════════════════════ */}
          <section style={{ background: "#fff", padding: "100px 72px" }}>
            <div style={{ maxWidth: "760px", margin: "0 auto" }}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.12em", textTransform: "uppercase" }}>FAQ</span>
                </div>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ margin: "0 0 52px", fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1, color: "#0a0a0a" }}>
                Common<br />Questions
              </motion.h2>
              {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} i={i} />)}
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ marginTop: "36px", fontSize: "12px", color: "#c4c9d4", lineHeight: 2 }}>
                COMPLIANCE: The DAG Army Ambassador Program is a referral-based marketing initiative — not an investment scheme. All rewards are conditional on verified product usage and activity. Full Terms &amp; Conditions apply.
              </motion.p>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              CTA — DEEP VIOLET GRADIENT
          ═══════════════════════════════════════════ */}
          <section style={{ background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)", padding: "120px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(165,180,252,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(165,180,252,0.05) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "900px", height: "600px", background: "radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(165,180,252,0.3), transparent)" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "24px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "1px", background: "rgba(165,180,252,0.6)" }} />
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "rgba(165,180,252,0.7)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Join the Movement</span>
                  <div style={{ width: "32px", height: "1px", background: "rgba(165,180,252,0.6)" }} />
                </div>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} style={{ margin: "0 auto 20px", fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 900, letterSpacing: "-3.5px", lineHeight: 0.95, color: "#fff", maxWidth: "700px" }}>
                Join the DAG Army<br />
                <span style={{ background: "linear-gradient(125deg, #818cf8, #a78bfa, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Ambassador Program</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ margin: "0 auto 48px", fontSize: "16px", color: "rgba(255,255,255,0.45)", lineHeight: 1.9, maxWidth: "440px" }}>
                Early contributors gain early positioning. Be part of the infrastructure shift combining AI and blockchain at global scale.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => setFormOpen(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", color: "#4338ca", border: "none", borderRadius: "100px", padding: "15px 32px", fontSize: "15px", fontWeight: 800, cursor: "pointer", boxShadow: "0 0 60px rgba(255,255,255,0.2)", letterSpacing: "-0.02em", fontFamily: "inherit" }}
                >
                  Apply Now — It&apos;s Free →
                </button>
                <a
                  href="mailto:hr@dagchain.network?subject=Ambassador Program"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "100px", padding: "14px 28px", fontSize: "14px", fontWeight: 600, cursor: "pointer", letterSpacing: "-0.01em", textDecoration: "none", fontFamily: "inherit" }}
                >
                  Contact the Team
                </a>
              </motion.div>
            </div>
          </section>

        </div>
      </div>

      {/* ═══════════════════════════════════════════
          APPLY MODAL
      ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {formOpen && !success && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(14px)", overflow: "auto" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", maxWidth: "780px", position: "relative" }}
            >
              <button onClick={() => setFormOpen(false)} style={{ position: "absolute", top: "-14px", right: "12px", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", width: "36px", height: "36px", color: "#6b7280", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>×</button>
              <GlassTerminalForm onSuccess={() => { setFormOpen(false); setSuccess(true); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSuccess(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(14px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "#fff", borderRadius: "32px", padding: "60px 52px", textAlign: "center", maxWidth: "440px", width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.2)" }}
            >
              <div style={{ width: "60px", height: "60px", borderRadius: "20px", background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "24px", height: "1px", background: "#6366f1" }} />
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>Application Received</span>
                <div style={{ width: "24px", height: "1px", background: "#6366f1" }} />
              </div>
              <h2 style={{ margin: "0 0 14px", fontSize: "28px", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-1px" }}>Enrollment Confirmed</h2>
              <p style={{ margin: "0 0 36px", color: "#9ca3af", fontSize: "14px", lineHeight: 1.9 }}>Our team will review your application personally and reach out within 5–10 business days.</p>
              <MagneticButton onClick={() => setSuccess(false)} variant="primary" style={{ width: "100%", justifyContent: "center" }}>Done</MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
