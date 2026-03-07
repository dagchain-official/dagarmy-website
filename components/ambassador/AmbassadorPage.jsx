"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HolographicCard from "./HolographicCard";
import MagneticButton from "./MagneticButton";
import RewardDashboard from "./RewardDashboard";
import GlassTerminalForm from "./GlassTerminalForm";

/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {}, y = 28 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   NOISE TEXTURE SVG (inline, for card depth)
───────────────────────────────────────── */
const NoiseOverlay = () => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none", mixBlendMode: "overlay" }} xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)"/>
  </svg>
);

/* ─────────────────────────────────────────
   PREMIUM CARD  (glass + depth + noise)
───────────────────────────────────────── */
function PCard({ children, bg, border, shadow, style = {}, hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, boxShadow: shadow || "0 32px 64px rgba(99,102,241,0.18)" } : {}}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative", borderRadius: "28px", overflow: "hidden",
        background: bg || "#fff",
        border: border || "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      <NoiseOverlay />
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────── */
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
        style={{
          width: "100%", background: "none", border: "none",
          padding: "22px 0", display: "flex", justifyContent: "space-between",
          alignItems: "center", cursor: "pointer", gap: "24px", textAlign: "left",
        }}
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
        <p style={{ margin: "0 0 22px", color: "#6b7280", fontSize: "15px", lineHeight: 1.9, maxWidth: "640px" }}>{a}</p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function AmbassadorPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const tiers = [
    {
      level: "Silver", followers: "1,000+ followers",
      perks: ["Standard referral rewards", "Free DAGGPT access", "Ambassador badge", "Private community access", "Monthly performance report"],
    },
    {
      level: "Gold", followers: "50,000+ followers",
      perks: ["Enhanced reward rate", "Performance bonuses", "Featured website profile", "Priority support channel", "Early ecosystem access", "Dedicated account manager"],
    },
    {
      level: "Platinum", followers: "100,000+ followers",
      perks: ["Custom partnership terms", "Regional leadership role", "Revenue-share agreements", "Executive direct access", "Co-branded campaigns", "Ecosystem governance input"],
    },
  ];

  const creators = [
    { title: "YouTubers", desc: "Long-form video creators in AI, blockchain & tech", icon: "▶", accent: "#ef4444", bg: "rgba(239,68,68,0.08)" },
    { title: "Instagram Creators", desc: "Visual storytellers with engaged communities", icon: "◈", accent: "#ec4899", bg: "rgba(236,72,153,0.08)" },
    { title: "AI Educators", desc: "Experts simplifying AI for mainstream audiences", icon: "✦", accent: "#6366f1", bg: "rgba(99,102,241,0.08)" },
    { title: "Web3 Influencers", desc: "Voices shaping decentralized technology adoption", icon: "◎", accent: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
    { title: "Blockchain Analysts", desc: "Research-driven content on Layer-1 ecosystems", icon: "◇", accent: "#06b6d4", bg: "rgba(6,182,212,0.08)" },
    { title: "Facebook Creators", desc: "Community builders with strong regional reach", icon: "◉", accent: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
    { title: "Tech Community Leaders", desc: "Forum moderators and developer advocates", icon: "⊕", accent: "#10b981", bg: "rgba(16,185,129,0.08)" },
    { title: "Regional Language Creators", desc: "Local-language voices driving global adoption", icon: "⊙", accent: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  ];

  const faqs = [
    { q: "Is this an investment program?", a: "No. The DAG Army Ambassador Program is a performance-based referral and marketing initiative linked to verified product usage. There is no investment element whatsoever." },
    { q: "Is there a joining fee?", a: "No. Applying and joining is completely free. No payment or investment is required at any stage of the program." },
    { q: "Are earnings guaranteed?", a: "No. All rewards are earned solely through verified ecosystem activity generated via your unique referral link and content performance." },
    { q: "Can I create content in my regional language?", a: "Absolutely. Regional language content is strongly encouraged. We actively prioritize creators who can engage local communities in their native language." },
    { q: "How long does the review take?", a: "Our team personally reviews each application within 5–10 business days. Shortlisted candidates are contacted directly via email with next steps." },
    { q: "What kind of content performs best?", a: "Product walkthroughs, AI tool comparisons, node infrastructure explainers, blockchain education, and ecosystem overview content consistently perform best." },
  ];

  return (
    <div style={{ background: "#eef0f7", minHeight: "100vh", padding: "32px 16px 64px", fontFamily: "'Inter', 'Geist', -apple-system, system-ui, sans-serif" }}>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes drift { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
        @keyframes driftAlt { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(-4deg)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        * { box-sizing: border-box; }
      `}</style>

      {/* ══════════════════════════════════════════
          OUTER WHITE CONTAINER
      ══════════════════════════════════════════ */}
      <div style={{ maxWidth: "1360px", margin: "0 auto", background: "#ffffff", borderRadius: "36px", boxShadow: "0 40px 100px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.04)", overflow: "hidden" }}>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section style={{ padding: "80px 72px 72px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", position: "relative", overflow: "hidden", minHeight: "92vh" }}>

          {/* Ghost watermark */}
          <div style={{ position: "absolute", right: "-60px", top: "50%", transform: "translateY(-50%)", fontSize: "340px", fontWeight: 900, letterSpacing: "-20px", color: "transparent", WebkitTextStroke: "1px rgba(99,102,241,0.05)", lineHeight: 1, pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
            DAG
          </div>

          {/* Soft glow orbs */}
          <div style={{ position: "absolute", top: "-120px", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "30%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />

          {/* ── LEFT COLUMN ── */}
          <div style={{ position: "relative", zIndex: 2 }}>

            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f0fdf4", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "100px", padding: "6px 16px 6px 10px", marginBottom: "44px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(34,197,94,0.12)", borderRadius: "100px", padding: "3px 8px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", animation: "blink 2s infinite" }} />
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#15803d", letterSpacing: "0.06em", textTransform: "uppercase" }}>Live</span>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#166534" }}>2026 Applications Open</span>
            </motion.div>

            {/* Headline — staggered lines */}
            <div style={{ marginBottom: "32px" }}>
              {["Become a", "DAG Army", "Ambassador."].map((line, i) => (
                <div key={i} style={{ overflow: "hidden" }}>
                  <motion.div
                    initial={{ y: "105%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.1, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h1 style={{
                      margin: 0,
                      fontSize: "clamp(58px, 7vw, 96px)",
                      fontWeight: 900,
                      letterSpacing: "-4.5px",
                      lineHeight: 0.93,
                      paddingBottom: "6px",
                      ...(i === 1 ? {
                        background: "linear-gradient(125deg, #6366f1 0%, #8b5cf6 45%, #06b6d4 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      } : { color: "#0a0a0a" })
                    }}>
                      {line}
                    </h1>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Horizontal rule + body copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "36px" }}>
                <div style={{ width: "2px", height: "64px", background: "linear-gradient(to bottom, #6366f1, transparent)", borderRadius: "1px", flexShrink: 0, marginTop: "4px" }} />
                <p style={{ margin: 0, fontSize: "16px", color: "#5a6273", lineHeight: 1.85, maxWidth: "380px" }}>
                  Represent the future of AI-native blockchain. Build your personal brand, earn real rewards, and grow alongside a global ecosystem powered by DAGGPT and DAGChain.
                </p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.54, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}
            >
              <MagneticButton onClick={() => setFormOpen(true)} variant="primary">
                Apply Now →
              </MagneticButton>
              <MagneticButton
                onClick={() => document.getElementById("amb-tiers")?.scrollIntoView({ behavior: "smooth" })}
                variant="ghost"
              >
                Explore the Program
              </MagneticButton>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.8 }}
              style={{ display: "flex", gap: "0", marginTop: "52px" }}
            >
              {[
                { n: "10K+", l: "Community Members" },
                { n: "3", l: "Core Platforms" },
                { n: "5", l: "Continents" },
                { n: "Free", l: "No Entry Cost" },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, paddingRight: "20px", borderRight: i < 3 ? "1px solid #ebebeb" : "none", paddingLeft: i > 0 ? "20px" : "0" }}>
                  <p style={{ margin: "0 0 2px", fontSize: "22px", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-1px" }}>{s.n}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af", fontWeight: 500, lineHeight: 1.5 }}>{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Premium card stack ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", zIndex: 2 }}
          >
            {/* Main hero card */}
            <PCard
              bg="linear-gradient(145deg, #5a5fcf 0%, #7c3aed 50%, #6366f1 100%)"
              border="none"
              shadow="0 40px 80px rgba(99,102,241,0.35)"
              style={{ padding: "40px", marginBottom: "16px", minHeight: "260px", overflow: "hidden" }}
            >
              {/* Decorative circles */}
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", animation: "drift 8s ease-in-out infinite" }} />
              <div style={{ position: "absolute", bottom: "-30px", right: "40px", width: "130px", height: "130px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", animation: "driftAlt 10s ease-in-out infinite" }} />
              <div style={{ position: "absolute", top: "30px", right: "30px", width: "80px", height: "80px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)", animation: "drift 6s ease-in-out infinite" }} />

              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", textTransform: "uppercase" }}>AI × Blockchain × Community</span>
                </div>
                <h2 style={{ margin: "0 0 12px", fontSize: "34px", fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1.05, maxWidth: "280px" }}>
                  Represent<br />the Future
                </h2>
                <p style={{ margin: "0 0 28px", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: "280px" }}>
                  Join the movement at the intersection of AI and decentralized infrastructure.
                </p>
                <button
                  onClick={() => setFormOpen(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", padding: "10px 20px", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", backdropFilter: "blur(12px)", letterSpacing: "-0.01em" }}
                >
                  Apply Now
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </PCard>

            {/* Two small cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* DAGGPT */}
              <PCard
                bg="linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)"
                border="1px solid rgba(147,197,253,0.3)"
                style={{ padding: "26px", minHeight: "170px", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "110px", height: "110px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", animation: "driftAlt 9s ease-in-out infinite" }} />
                <div style={{ position: "absolute", top: "12px", right: "12px", width: "40px", height: "40px", borderRadius: "50%", border: "1px dashed rgba(59,130,246,0.15)", animation: "spin 20s linear infinite" }} />
                <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 800, color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase" }}>AI Platform</p>
                <h3 style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: 900, color: "#1e3a5f", letterSpacing: "-0.8px", lineHeight: 1 }}>DAGGPT</h3>
                <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#4b6184", lineHeight: 1.7 }}>Multi-module AI. One subscription.</p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ height: "2px", flex: 1, borderRadius: "1px", background: "linear-gradient(to right, #3b82f6, rgba(59,130,246,0.15))" }} />
                  <span style={{ fontSize: "10px", color: "#93c5fd", fontWeight: 700 }}>10+ modules</span>
                </div>
              </PCard>

              {/* DAGChain */}
              <PCard
                bg="linear-gradient(145deg, #fdf4ff 0%, #f3e8ff 100%)"
                border="1px solid rgba(216,180,254,0.3)"
                style={{ padding: "26px", minHeight: "170px", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "110px", height: "110px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", animation: "drift 11s ease-in-out infinite" }} />
                <div style={{ position: "absolute", top: "12px", right: "12px", width: "40px", height: "40px", borderRadius: "50%", border: "1px dashed rgba(139,92,246,0.15)", animation: "spin 16s linear infinite reverse" }} />
                <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 800, color: "#8b5cf6", letterSpacing: "0.1em", textTransform: "uppercase" }}>Layer 1</p>
                <h3 style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: 900, color: "#3b0764", letterSpacing: "-0.8px", lineHeight: 1 }}>DAGChain</h3>
                <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#6d28d9", lineHeight: 1.7 }}>AI-native blockchain infrastructure.</p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ height: "2px", flex: 1, borderRadius: "1px", background: "linear-gradient(to right, #8b5cf6, rgba(139,92,246,0.15))" }} />
                  <span style={{ fontSize: "10px", color: "#c4b5fd", fontWeight: 700 }}>Live network</span>
                </div>
              </PCard>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            MARQUEE STRIP
        ══════════════════════════════════════════ */}
        <div style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", padding: "18px 0", overflow: "hidden", background: "#fafbff" }}>
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ display: "flex", gap: "0", whiteSpace: "nowrap", width: "max-content" }}
          >
            {[...Array(2)].map((_, rep) => (
              <div key={rep} style={{ display: "flex", gap: "0" }}>
                {["DAG Army", "DAGGPT", "DAGChain", "Web3", "AI Native", "Layer 1", "Earn Rewards", "Free Access", "Ambassador Program", "Global Community"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "32px", padding: "0 32px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t}</span>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#6366f1", opacity: 0.4 }} />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════
            ECOSYSTEM — 3 PILLARS
        ══════════════════════════════════════════ */}
        <section style={{ padding: "100px 72px", background: "#fff", position: "relative", overflow: "hidden" }}>

          {/* Ghost number */}
          <div style={{ position: "absolute", left: "-20px", top: "50%", transform: "translateY(-50%)", fontSize: "400px", fontWeight: 900, color: "transparent", WebkitTextStroke: "1.5px rgba(99,102,241,0.03)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>01</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>The Ecosystem</span>
              </div>
            </Reveal>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", gap: "40px", flexWrap: "wrap" }}>
              <Reveal>
                <h2 style={{ margin: 0, fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1, color: "#0a0a0a" }}>
                  Built on<br /><span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>three pillars.</span>
                </h2>
              </Reveal>
              <Reveal delay={3}>
                <p style={{ margin: 0, fontSize: "15px", color: "#6b7280", lineHeight: 1.9, maxWidth: "300px" }}>
                  A community, an AI platform, and a blockchain — interconnected and growing together.
                </p>
              </Reveal>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr", gap: "20px" }}>

              {/* DAG Army — large */}
              <Reveal>
                <PCard
                  bg="linear-gradient(155deg, #5558d9 0%, #7c3aed 55%, #6366f1 100%)"
                  border="none"
                  shadow="0 40px 80px rgba(99,102,241,0.3)"
                  style={{ padding: "44px", minHeight: "320px", overflow: "hidden" }}
                >
                  <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)", animation: "drift 9s ease-in-out infinite" }} />
                  <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "100px", height: "100px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", animation: "driftAlt 7s ease-in-out infinite" }} />
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>01 — Community</span>
                    <h3 style={{ margin: "8px 0 16px", fontSize: "30px", fontWeight: 900, color: "#fff", letterSpacing: "-1.2px", lineHeight: 1 }}>DAG Army</h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85, maxWidth: "260px" }}>
                      A global community-driven AI and Web3 movement. Ambassadors are the human face of this mission.
                    </p>
                  </div>
                </PCard>
              </Reveal>

              {/* DAGGPT */}
              <Reveal delay={2}>
                <PCard
                  bg="linear-gradient(155deg, #f0f9ff 0%, #dbeafe 55%, #e0f2fe 100%)"
                  border="1px solid rgba(147,197,253,0.25)"
                  style={{ padding: "32px", minHeight: "320px", overflow: "hidden" }}
                >
                  <div style={{ position: "absolute", bottom: "-30px", right: "-30px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", animation: "drift 10s ease-in-out infinite" }} />
                  <div style={{ position: "absolute", top: "16px", right: "16px", width: "50px", height: "50px", borderRadius: "50%", border: "1px dashed rgba(59,130,246,0.2)", animation: "spin 25s linear infinite" }} />
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase" }}>02 — AI Platform</span>
                    <h3 style={{ margin: "8px 0 12px", fontSize: "24px", fontWeight: 900, color: "#1e3a5f", letterSpacing: "-0.8px" }}>DAGGPT</h3>
                    <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#4b6184", lineHeight: 1.8 }}>Multi-module AI platform replacing multiple tool subscriptions. Full access free for all ambassadors.</p>
                    <div style={{ height: "1px", background: "linear-gradient(to right, rgba(59,130,246,0.2), transparent)" }} />
                    <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6" }} />
                      <span style={{ fontSize: "11px", color: "#3b82f6", fontWeight: 700 }}>10+ AI modules included</span>
                    </div>
                  </div>
                </PCard>
              </Reveal>

              {/* DAGChain */}
              <Reveal delay={4}>
                <PCard
                  bg="linear-gradient(155deg, #faf5ff 0%, #ede9fe 55%, #f5f3ff 100%)"
                  border="1px solid rgba(196,181,254,0.25)"
                  style={{ padding: "32px", minHeight: "320px", overflow: "hidden" }}
                >
                  <div style={{ position: "absolute", bottom: "-30px", right: "-30px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", animation: "driftAlt 12s ease-in-out infinite" }} />
                  <div style={{ position: "absolute", top: "16px", right: "16px", width: "50px", height: "50px", borderRadius: "50%", border: "1px dashed rgba(139,92,246,0.2)", animation: "spin 20s linear infinite reverse" }} />
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2"/>
                        <path d="M8 21h8M12 17v4"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: "#8b5cf6", letterSpacing: "0.1em", textTransform: "uppercase" }}>03 — Blockchain</span>
                    <h3 style={{ margin: "8px 0 12px", fontSize: "24px", fontWeight: 900, color: "#3b0764", letterSpacing: "-0.8px" }}>DAGChain</h3>
                    <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#5b21b6", lineHeight: 1.8 }}>AI-native Layer-1 blockchain. The infrastructure powering the entire ecosystem.</p>
                    <div style={{ height: "1px", background: "linear-gradient(to right, rgba(139,92,246,0.2), transparent)" }} />
                    <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8b5cf6" }} />
                      <span style={{ fontSize: "11px", color: "#8b5cf6", fontWeight: 700 }}>Live mainnet active</span>
                    </div>
                  </div>
                </PCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            WHO CAN APPLY
        ══════════════════════════════════════════ */}
        <section style={{ padding: "100px 72px", background: "#fafbff", position: "relative", overflow: "hidden" }}>

          <div style={{ position: "absolute", right: "-30px", top: "50%", transform: "translateY(-50%)", fontSize: "400px", fontWeight: 900, color: "transparent", WebkitTextStroke: "1.5px rgba(99,102,241,0.03)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>02</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>Who Can Apply</span>
              </div>
            </Reveal>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", gap: "40px", flexWrap: "wrap" }}>
              <Reveal>
                <h2 style={{ margin: 0, fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1, color: "#0a0a0a" }}>
                  Built for creators<br />and builders.
                </h2>
              </Reveal>
              <Reveal delay={3}>
                <p style={{ margin: 0, fontSize: "15px", color: "#6b7280", lineHeight: 1.9, maxWidth: "300px" }}>
                  We welcome passionate voices who can tell the AI and Web3 story in their language and region.
                </p>
              </Reveal>
            </div>

            {/* Creator grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "48px" }}>
              {creators.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.65, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, boxShadow: `0 20px 48px rgba(0,0,0,0.08)` }}
                  style={{
                    background: "#fff", borderRadius: "20px", padding: "24px 20px",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)", cursor: "default",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", fontSize: "16px", color: c.accent }}>
                    {c.icon}
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.2px" }}>{c.title}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.65 }}>{c.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Requirements */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", background: "#fff" }}>
              {[
                { n: "01", title: "Active Audience", desc: "An engaged following on at least one platform — minimum 1,000 total across any channel." },
                { n: "02", title: "Consistent Creator", desc: "Established publishing history with a recognizable voice and real community presence." },
                { n: "03", title: "Clear Communicator", desc: "Ability to explain AI or blockchain concepts in an accessible way in your language." },
              ].map((r, i) => (
                <Reveal key={i} delay={i * 2}>
                  <div
                    style={{ padding: "32px 28px", borderRight: i < 2 ? "1px solid rgba(0,0,0,0.07)" : "none", transition: "background 0.25s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.025)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <p style={{ margin: "0 0 14px", fontSize: "36px", fontWeight: 900, color: "rgba(0,0,0,0.05)", letterSpacing: "-2px" }}>{r.n}</p>
                    <p style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.3px" }}>{r.title}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", lineHeight: 1.85 }}>{r.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BENEFITS + DASHBOARD
        ══════════════════════════════════════════ */}
        <section style={{ padding: "100px 72px", background: "#fff", position: "relative", overflow: "hidden" }}>

          <div style={{ position: "absolute", left: "-30px", top: "50%", transform: "translateY(-50%)", fontSize: "400px", fontWeight: 900, color: "transparent", WebkitTextStroke: "1.5px rgba(99,102,241,0.03)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>03</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>The Rewards</span>
              </div>
            </Reveal>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px", gap: "40px", flexWrap: "wrap" }}>
              <Reveal>
                <h2 style={{ margin: 0, fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1, color: "#0a0a0a" }}>
                  A unified<br />reward network.
                </h2>
              </Reveal>
              <Reveal delay={3}>
                <MagneticButton onClick={() => setFormOpen(true)} variant="primary">Apply Now →</MagneticButton>
              </Reveal>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>

              {/* Benefits 2x2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  {
                    title: "Free DAGGPT Access", metric: "10+ AI Modules", accent: "#6366f1",
                    bg: "linear-gradient(145deg, #f5f3ff 0%, #ede9fe 100%)",
                    border: "rgba(196,181,254,0.35)",
                    desc: "Full access to DAGGPT's multi-module platform — replacing multiple AI tool subscriptions.",
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                  },
                  {
                    title: "Referral Earnings", metric: "Real Crypto", accent: "#3b82f6",
                    bg: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)",
                    border: "rgba(147,197,253,0.35)",
                    desc: "Earn based on verified ecosystem activity — node purchases, subscriptions, and upgrades.",
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                  },
                  {
                    title: "DAG Points", metric: "Redeemable Rewards", accent: "#ec4899",
                    bg: "linear-gradient(145deg, #fdf2f8 0%, #fce7f3 100%)",
                    border: "rgba(249,168,212,0.35)",
                    desc: "Accumulate DAG points redeemable for GasCoin, credits, and premium feature access.",
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  },
                  {
                    title: "Ambassador Status", metric: "Verified Badge", accent: "#10b981",
                    bg: "linear-gradient(145deg, #f0fdf4 0%, #d1fae5 100%)",
                    border: "rgba(110,231,183,0.35)",
                    desc: "Official badge, featured website profile, and access to exclusive ambassador-only events.",
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  },
                ].map((b, i) => (
                  <Reveal key={i} delay={i * 1.5}>
                    <PCard
                      bg={b.bg}
                      border={`1px solid ${b.border}`}
                      shadow={`0 24px 48px rgba(0,0,0,0.08)`}
                      style={{ padding: "26px" }}
                    >
                      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                        {b.icon}
                      </div>
                      <p style={{ margin: "0 0 2px", fontSize: "18px", fontWeight: 900, color: b.accent, letterSpacing: "-0.5px" }}>{b.metric}</p>
                      <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.1px" }}>{b.title}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", lineHeight: 1.75 }}>{b.desc}</p>
                    </PCard>
                  </Reveal>
                ))}
              </div>

              {/* Live dashboard */}
              <Reveal delay={6}>
                <RewardDashboard />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            AMBASSADOR TIERS
        ══════════════════════════════════════════ */}
        <section id="amb-tiers" style={{ padding: "100px 72px", background: "#fafbff", position: "relative", overflow: "hidden" }}>

          <div style={{ position: "absolute", right: "-40px", top: "40%", fontSize: "400px", fontWeight: 900, color: "transparent", WebkitTextStroke: "1.5px rgba(99,102,241,0.03)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>04</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Reveal style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>Select Your Path</span>
                <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
              </div>
            </Reveal>
            <Reveal style={{ textAlign: "center", marginBottom: "12px" }}>
              <h2 style={{ margin: 0, fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1, color: "#0a0a0a" }}>Ambassador Tiers</h2>
            </Reveal>
            <Reveal style={{ textAlign: "center", marginBottom: "60px" }}>
              <p style={{ margin: 0, fontSize: "15px", color: "#9ca3af", lineHeight: 1.8 }}>Tiers are reviewed and upgraded based on performance and audience growth.</p>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.12fr 1fr", gap: "20px", alignItems: "center" }}>
              {tiers.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: i === 1 ? -12 : 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <HolographicCard {...t} />
                  <div style={{ marginTop: "12px" }}>
                    <MagneticButton onClick={() => setFormOpen(true)} variant="ghost" style={{ width: "100%", justifyContent: "center" }}>
                      Apply as {t.level} →
                    </MagneticButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════ */}
        <section style={{ padding: "100px 72px", background: "#fff" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <Reveal style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>FAQ</span>
              </div>
            </Reveal>
            <Reveal style={{ marginBottom: "52px" }}>
              <h2 style={{ margin: 0, fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1, color: "#0a0a0a" }}>
                Common<br />Questions
              </h2>
            </Reveal>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} i={i} />)}
            <Reveal>
              <p style={{ marginTop: "36px", fontSize: "12px", color: "#c4c9d4", lineHeight: 2 }}>
                COMPLIANCE: The DAG Army Ambassador Program is a referral-based marketing initiative — not an investment scheme. All rewards are conditional on verified product usage and activity. Full Terms &amp; Conditions apply.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════ */}
        <section style={{ padding: "120px 72px", background: "#fafbff", textAlign: "center", position: "relative", overflow: "hidden" }}>

          {/* Layered glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "600px", background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", height: "400px", background: "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

          {/* Decorative lines */}
          <div style={{ position: "absolute", top: "0", left: "0", right: "0", height: "1px", background: "linear-gradient(to right, transparent, rgba(99,102,241,0.15), transparent)" }} />
          <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", height: "1px", background: "linear-gradient(to right, transparent, rgba(99,102,241,0.15), transparent)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>Join the Movement</span>
                <div style={{ width: "32px", height: "1px", background: "#6366f1" }} />
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 style={{ margin: "0 auto 20px", fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 900, letterSpacing: "-3.5px", lineHeight: 0.95, color: "#0a0a0a", maxWidth: "700px" }}>
                Join the DAG Army<br />
                <span style={{ background: "linear-gradient(125deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Ambassador Program</span>
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ margin: "0 auto 44px", fontSize: "16px", color: "#6b7280", lineHeight: 1.9, maxWidth: "460px" }}>
                Early contributors gain early positioning. Be part of the infrastructure shift combining AI and blockchain at global scale.
              </p>
            </Reveal>
            <Reveal delay={3} style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <MagneticButton onClick={() => setFormOpen(true)} variant="primary">
                Apply Now — It&apos;s Free →
              </MagneticButton>
              <MagneticButton href="mailto:hr@dagchain.network?subject=Ambassador Program Inquiry" variant="ghost">
                Contact the Team
              </MagneticButton>
            </Reveal>
          </div>
        </section>

      </div>
      {/* end outer container */}

      {/* ══════════════════════════════════════════
          APPLY MODAL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {formOpen && !success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(12px)", overflow: "auto" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", maxWidth: "780px", position: "relative" }}
            >
              <button
                onClick={() => setFormOpen(false)}
                style={{ position: "absolute", top: "-14px", right: "12px", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", width: "36px", height: "36px", color: "#6b7280", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
              >
                ×
              </button>
              <GlassTerminalForm onSuccess={() => { setFormOpen(false); setSuccess(true); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          SUCCESS MODAL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSuccess(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "#fff", borderRadius: "32px", padding: "60px 52px", textAlign: "center", maxWidth: "440px", width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.14)", border: "1px solid rgba(99,102,241,0.1)" }}
            >
              <div style={{ width: "60px", height: "60px", borderRadius: "20px", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "24px", height: "1px", background: "#6366f1" }} />
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase" }}>Application Received</span>
                <div style={{ width: "24px", height: "1px", background: "#6366f1" }} />
              </div>
              <h2 style={{ margin: "0 0 14px", fontSize: "28px", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-1px" }}>Enrollment Confirmed</h2>
              <p style={{ margin: "0 0 36px", color: "#9ca3af", fontSize: "14px", lineHeight: 1.9 }}>
                Our team will review your application personally and reach out to shortlisted candidates within 5–10 business days.
              </p>
              <MagneticButton onClick={() => setSuccess(false)} variant="primary" style={{ width: "100%", justifyContent: "center" }}>
                Done
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
