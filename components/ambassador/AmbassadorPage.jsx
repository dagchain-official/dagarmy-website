"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import BentoCard from "./BentoCard";
import HolographicCard from "./HolographicCard";
import MagneticButton from "./MagneticButton";
import RewardDashboard from "./RewardDashboard";
import GlassTerminalForm from "./GlassTerminalForm";

const LiquidBackground = dynamic(() => import("./LiquidBackground"), { ssr: false });

/* ── Fade-up reveal variant ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Mask text reveal ── */
function MaskText({ children, delay = 0, as = "span", style = {} }) {
  const Tag = motion[as] || motion.span;
  return (
    <span style={{ display: "block", overflow: "hidden", ...style }}>
      <Tag
        initial={{ y: "110%", rotate: 3, opacity: 0 }}
        whileInView={{ y: "0%", rotate: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "block", originX: 0 }}
      >
        {children}
      </Tag>
    </span>
  );
}

/* ── Section reveal wrapper ── */
function Reveal({ children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={delay}
      variants={fadeUp}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── FAQ item ── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", padding: "22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: "20px", textAlign: "left" }}
      >
        <span style={{ fontSize: "15px", fontWeight: 600, color: "#e5e5e5", lineHeight: 1.5 }}>{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0, fontSize: "18px" }}
        >
          ↓
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p style={{ margin: "0 0 22px", color: "rgba(229,229,229,0.5)", fontSize: "14px", lineHeight: 1.85, maxWidth: "680px" }}>{a}</p>
      </motion.div>
    </div>
  );
}

/* ── SVG Icons ── */
const IconDAGArmy = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="url(#g1)" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 2v20M3 7l9 5 9-5" stroke="url(#g1)" strokeWidth="1.5" />
    <defs><linearGradient id="g1" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
  </svg>
);
const IconDAGGPT = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="url(#g2)" strokeWidth="1.5"/>
    <path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="url(#g2)" strokeWidth="1.5" strokeLinecap="round"/>
    <defs><linearGradient id="g2" x1="1" y1="1" x2="23" y2="23" gradientUnits="userSpaceOnUse"><stop stopColor="#8b5cf6"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
  </svg>
);
const IconDAGChain = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="7" width="6" height="4" rx="1" stroke="url(#g3)" strokeWidth="1.5"/>
    <rect x="9" y="7" width="6" height="4" rx="1" stroke="url(#g3)" strokeWidth="1.5"/>
    <rect x="16" y="7" width="6" height="4" rx="1" stroke="url(#g3)" strokeWidth="1.5"/>
    <path d="M8 9h1M15 9h1" stroke="url(#g3)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 11v3M7 14h10M7 14a2 2 0 01-2 2H4M17 14a2 2 0 002 2h1" stroke="url(#g3)" strokeWidth="1.5" strokeLinecap="round"/>
    <defs><linearGradient id="g3" x1="2" y1="7" x2="22" y2="18" gradientUnits="userSpaceOnUse"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#6366f1"/></linearGradient></defs>
  </svg>
);

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function AmbassadorPage() {
  const [formVisible, setFormVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  const tiers = [
    {
      level: "Silver",
      followers: "1,000+ followers",
      perks: ["Standard referral rewards", "Free DAGGPT access", "Ambassador Badge", "Private community access", "Monthly performance reports"],
    },
    {
      level: "Gold",
      followers: "50,000+ followers",
      perks: ["Enhanced reward rate", "Performance bonuses", "Featured website profile", "Priority support channel", "Early ecosystem access", "Dedicated account manager"],
    },
    {
      level: "Platinum",
      followers: "100,000+ followers",
      perks: ["Custom partnership terms", "Regional leadership role", "Revenue-share agreements", "Executive direct access", "Co-branded campaigns", "Ecosystem governance input"],
    },
  ];

  const creators = [
    "YouTubers", "Instagram Creators", "Facebook Creators",
    "AI Educators", "Blockchain Analysts", "Web3 Influencers",
    "Tech Community Leaders", "Regional Language Creators",
  ];

  const faqs = [
    { q: "Is this an investment program?", a: "No. The DAG Army Ambassador Program is a performance-based referral and marketing initiative linked to actual product usage. There is no investment element whatsoever." },
    { q: "Is there a joining fee?", a: "No. Applying and joining is completely free. There is no mandatory payment or investment required at any stage." },
    { q: "Are earnings guaranteed?", a: "No. All rewards are based solely on verified ecosystem activity and product usage generated through your unique referral link." },
    { q: "Can I create content in my regional language?", a: "Yes. Regional language content is highly encouraged. We actively seek creators who can engage local communities in their native language." },
    { q: "How long does the review take?", a: "Our team reviews applications personally within 5–10 business days. Shortlisted candidates are contacted directly via email." },
    { q: "What content should I create?", a: "Product walkthroughs, AI tool demos, node infrastructure guides, blockchain education, ecosystem overviews, and use-case tutorials." },
  ];

  const gradText = {
    background: "linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #67e8f9 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  };

  const monoLabel = { fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(99,102,241,0.7)", marginBottom: "16px", display: "block" };

  return (
    <div style={{ background: "#000", color: "#e5e5e5", overflowX: "hidden", position: "relative", fontFamily: "'Inter', 'Geist', system-ui, sans-serif" }}>

      {/* Global grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99,
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* GLSL Liquid Background */}
      <LiquidBackground />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes shimmerBand { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes borderSpin { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)} 50%{box-shadow:0 0 0 12px rgba(99,102,241,0)} }
      `}</style>

      {/* ═══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 24px 100px" }}>
        {/* Radial edge bleeds */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "60%", background: "radial-gradient(ellipse at 0% 0%, rgba(79,70,229,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "40%", height: "60%", background: "radial-gradient(ellipse at 100% 100%, rgba(6,182,212,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "860px", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "100px", padding: "7px 18px", marginBottom: "40px" }}
          >
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "blink 2s ease-in-out infinite", boxShadow: "0 0 8px rgba(34,197,94,0.7)" }} />
            <span style={{ fontFamily: "monospace", fontSize: "11px", color: "rgba(165,180,252,0.8)", letterSpacing: "1.5px" }}>2026 COHORT — APPLICATIONS OPEN</span>
          </motion.div>

          {/* Main headline */}
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{ fontSize: "clamp(52px, 8vw, 100px)", fontWeight: 900, letterSpacing: "-4px", lineHeight: 0.95, margin: "0 0 8px", color: "#e5e5e5" }}
            >
              Become a
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
              style={{ fontSize: "clamp(52px, 8vw, 100px)", fontWeight: 900, letterSpacing: "-4px", lineHeight: 0.95, margin: "0 0 8px", ...gradText }}
            >
              DAG Army
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.26 }}
              style={{ fontSize: "clamp(52px, 8vw, 100px)", fontWeight: 900, letterSpacing: "-4px", lineHeight: 0.95, margin: "0 0 40px", color: "#e5e5e5" }}
            >
              Ambassador
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(229,229,229,0.55)", lineHeight: 1.8, maxWidth: "560px", margin: "0 auto 52px" }}
          >
            Represent the Future of AI-Native Blockchain. Build your brand, earn real rewards, and grow alongside a global ecosystem powered by DAGGPT and DAGChain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <MagneticButton onClick={() => setFormVisible(true)} variant="primary">Apply Now →</MagneticButton>
            <MagneticButton onClick={() => document.getElementById("amb-ecosystem")?.scrollIntoView({ behavior: "smooth" })} variant="ghost">Explore Program</MagneticButton>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ marginTop: "72px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
          >
            <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>SCROLL</span>
            <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)" }} />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ECOSYSTEM BENTO GRID
      ══════════════════════════════════════════════════ */}
      <section id="amb-ecosystem" style={{ position: "relative", zIndex: 10, padding: "120px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <span style={monoLabel}>The Infrastructure</span>
          </Reveal>
          <div style={{ marginBottom: "56px" }}>
            <MaskText style={{ fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1.05, color: "#e5e5e5" }}>
              The Ecosystem
            </MaskText>
            <MaskText delay={0.08} style={{ fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1.05, ...gradText }}>
              Behind the Mission
            </MaskText>
          </div>

          {/* Bento grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "auto auto", gap: "16px" }}>

            {/* DAG Army — large */}
            <Reveal delay={0} style={{ gridColumn: "span 2", gridRow: "span 2" }}>
              <BentoCard glowColor="rgba(99,102,241,0.35)" style={{ height: "100%", minHeight: "360px", padding: "36px" }}>
                <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", animation: "floatY 4s ease-in-out infinite" }}>
                      <IconDAGArmy />
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(99,102,241,0.6)", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>01 — Community</span>
                    <h3 style={{ margin: "0 0 16px", fontSize: "28px", fontWeight: 900, color: "#e5e5e5", letterSpacing: "-1px" }}>DAG Army</h3>
                    <p style={{ margin: 0, fontSize: "15px", color: "rgba(229,229,229,0.5)", lineHeight: 1.8 }}>A global community-driven AI and Web3 movement shaping the decentralized future. Ambassadors are the human face of this movement — bridging technology and people across every language and region.</p>
                  </div>
                  <div style={{ marginTop: "28px", height: "1px", background: "linear-gradient(to right, rgba(99,102,241,0.5), transparent)" }} />
                </div>
              </BentoCard>
            </Reveal>

            {/* DAGGPT */}
            <Reveal delay={1} style={{ gridColumn: "span 2" }}>
              <BentoCard glowColor="rgba(139,92,246,0.35)" style={{ padding: "28px", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "floatY 5s ease-in-out infinite" }}>
                    <IconDAGGPT />
                  </div>
                  <div>
                    <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(139,92,246,0.6)", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>02 — AI Platform</span>
                    <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 900, color: "#e5e5e5", letterSpacing: "-0.6px" }}>DAGGPT</h3>
                    <p style={{ margin: 0, fontSize: "13px", color: "rgba(229,229,229,0.45)", lineHeight: 1.75 }}>Multi-module AI platform — one subscription replacing multiple AI tools. Ambassadors receive free full access.</p>
                  </div>
                </div>
              </BentoCard>
            </Reveal>

            {/* DAGChain */}
            <Reveal delay={2} style={{ gridColumn: "span 2" }}>
              <BentoCard glowColor="rgba(6,182,212,0.35)" style={{ padding: "28px", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "floatY 6s ease-in-out infinite" }}>
                    <IconDAGChain />
                  </div>
                  <div>
                    <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(6,182,212,0.6)", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>03 — Blockchain</span>
                    <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 900, color: "#e5e5e5", letterSpacing: "-0.6px" }}>DAGChain</h3>
                    <p style={{ margin: 0, fontSize: "13px", color: "rgba(229,229,229,0.45)", lineHeight: 1.75 }}>AI-native Layer 1 blockchain. The infrastructure powering the entire digital ecosystem that ambassadors represent.</p>
                  </div>
                </div>
              </BentoCard>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHO CAN APPLY
      ══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 10, padding: "120px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <span style={monoLabel}>Who Can Apply</span>
          </Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <MaskText style={{ fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, color: "#e5e5e5" }}>
                Built for creators
              </MaskText>
              <MaskText delay={0.08} style={{ fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, ...gradText }}>
                and builders.
              </MaskText>
            </div>
            <Reveal delay={2}>
              <p style={{ maxWidth: "300px", fontSize: "14px", color: "rgba(229,229,229,0.4)", lineHeight: 1.85, margin: 0 }}>
                We look for passionate creators who can bring the AI and Web3 story to life in their own language and region.
              </p>
            </Reveal>
          </div>

          {/* Creator grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "40px" }}>
            {creators.map((c, i) => (
              <Reveal key={i} delay={i * 0.5}>
                <motion.div
                  whileHover={{ scale: 1.03, background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.3)" }}
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "20px 18px", cursor: "default", transition: "all 0.2s" }}
                >
                  <p style={{ margin: "0 0 5px", fontFamily: "monospace", fontSize: "9px", color: "rgba(99,102,241,0.5)", letterSpacing: "2px" }}>0{i + 1}</p>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#e5e5e5", letterSpacing: "-0.2px" }}>{c}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Requirements */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", overflow: "hidden" }}>
            {[
              { n: "01", t: "Active Audience", d: "An engaged following on at least one platform. 1,000+ minimum across any channel." },
              { n: "02", t: "Consistent Creator", d: "Established publishing history with a real community presence and recognizable voice." },
              { n: "03", t: "Clear Communicator", d: "Ability to explain AI or blockchain concepts accessibly in your language and region." },
            ].map((r, i) => (
              <Reveal key={i} delay={i}>
                <div style={{ padding: "32px 28px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <p style={{ margin: "0 0 12px", fontSize: "32px", fontWeight: 900, color: "rgba(255,255,255,0.04)", letterSpacing: "-2px" }}>{r.n}</p>
                  <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "15px", color: "#e5e5e5" }}>{r.t}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "rgba(229,229,229,0.4)", lineHeight: 1.8 }}>{r.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          REWARDS — BENTO + DASHBOARD
      ══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 10, padding: "120px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <span style={monoLabel}>The Rewards</span>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", marginTop: "24px" }}>
            <div>
              <div style={{ marginBottom: "32px" }}>
                <MaskText style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, color: "#e5e5e5" }}>
                  A Unified
                </MaskText>
                <MaskText delay={0.08} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, ...gradText }}>
                  Reward Network
                </MaskText>
              </div>
              <Reveal delay={2}>
                <p style={{ fontSize: "15px", color: "rgba(229,229,229,0.5)", lineHeight: 1.85, marginBottom: "36px" }}>
                  Track your impact across the DAGChain ecosystem with a real-time, transparent reward dashboard. Every referral, every subscription, every node — counted.
                </p>
              </Reveal>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { label: "Free DAGGPT Access", sub: "Full multi-module AI access — no additional subscriptions needed.", color: "#6366f1" },
                  { label: "Referral Earnings", sub: "Rewards tied to real ecosystem activity — subscriptions, nodes, upgrades.", color: "#8b5cf6" },
                  { label: "Reward Points", sub: "DAG points redeemable for GasCoin, credits, and feature access.", color: "#06b6d4" },
                  { label: "Official Recognition", sub: "Verified badge, featured profile, and private ambassador access.", color: "#f59e0b" },
                ].map((b, i) => (
                  <Reveal key={i} delay={i}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: b.color, marginTop: "8px", boxShadow: `0 0 8px ${b.color}`, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#e5e5e5", display: "block", marginBottom: "3px" }}>{b.label}</span>
                        <span style={{ fontSize: "13px", color: "rgba(229,229,229,0.4)", lineHeight: 1.7 }}>{b.sub}</span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={5} style={{ marginTop: "36px" }}>
                <MagneticButton onClick={() => setFormVisible(true)} variant="primary">Apply Now →</MagneticButton>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <RewardDashboard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOLOGRAPHIC TIER CARDS
      ══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 10, padding: "120px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={monoLabel}>Select Your Path</span>
            <MaskText style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, color: "#e5e5e5", fontStyle: "italic" }}>
              Ambassador Tiers
            </MaskText>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", alignItems: "end" }}>
            {tiers.map((t, i) => (
              <Reveal key={i} delay={i + 1}>
                <HolographicCard {...t} />
                <div style={{ marginTop: "14px" }}>
                  <MagneticButton onClick={() => setFormVisible(true)} variant="ghost" className="w-full">
                    Apply as {t.level} →
                  </MagneticButton>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p style={{ textAlign: "center", marginTop: "36px", fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.18)", letterSpacing: "1.5px" }}>
              TIERS_REVIEWED_AND_UPGRADED_BASED_ON_PERFORMANCE_METRICS
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 10, padding: "120px 24px" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <Reveal style={{ marginBottom: "56px" }}>
            <span style={monoLabel}>FAQ</span>
            <MaskText style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, color: "#e5e5e5" }}>
              Common Questions
            </MaskText>
          </Reveal>
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 0.5}>
              <FAQItem q={f.q} a={f.a} />
            </Reveal>
          ))}
          <Reveal>
            <p style={{ marginTop: "40px", fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.15)", lineHeight: 1.9, letterSpacing: "0.5px" }}>
              COMPLIANCE: The DAG Army Ambassador Program is a referral-based marketing initiative. Not an investment scheme. All rewards depend on verified product usage. Full T&amp;C apply.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 10, padding: "160px 24px", textAlign: "center" }}>
        {/* Glow behind CTA */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <span style={monoLabel}>Join the Movement</span>
          </Reveal>
          <MaskText style={{ fontSize: "clamp(36px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: 0.97, color: "#e5e5e5" }}>
            Join the DAG Army
          </MaskText>
          <MaskText delay={0.08} style={{ fontSize: "clamp(36px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: 0.97, marginBottom: "32px", ...gradText }}>
            Ambassador Program
          </MaskText>
          <Reveal delay={2}>
            <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "rgba(229,229,229,0.45)", lineHeight: 1.85, maxWidth: "520px", margin: "0 auto 52px" }}>
              Early contributors gain early positioning. Be part of the infrastructure shift combining AI and blockchain at global scale.
            </p>
          </Reveal>
          <Reveal delay={3} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <MagneticButton onClick={() => setFormVisible(true)} variant="primary">Apply Now — It&apos;s Free →</MagneticButton>
            <MagneticButton href="mailto:hr@dagchain.network?subject=Ambassador Program Inquiry" variant="ghost">Contact the Team</MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GLASS TERMINAL MODAL
      ══════════════════════════════════════════════════ */}
      {formVisible && !success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setFormVisible(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(16px)", overflow: "auto" }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%", maxWidth: "720px", position: "relative" }}
          >
            <button
              onClick={() => setFormVisible(false)}
              style={{ position: "absolute", top: "-14px", right: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", width: "34px", height: "34px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
              ×
            </button>
            <GlassTerminalForm onSuccess={() => { setFormVisible(false); setSuccess(true); }} />
          </motion.div>
        </motion.div>
      )}

      {/* Success toast */}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSuccess(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(16px)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "rgba(5,5,5,0.95)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "24px", padding: "56px 48px", textAlign: "center", maxWidth: "440px", width: "100%", boxShadow: "0 0 60px rgba(99,102,241,0.15)" }}
          >
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "pulseGlow 2s ease-in-out infinite" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#gs)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
                <defs><linearGradient id="gs" x1="4" y1="6" x2="20" y2="17"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
              </svg>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(99,102,241,0.6)", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>APPLICATION_RECEIVED</span>
            <h2 style={{ margin: "0 0 14px", fontSize: "24px", fontWeight: 900, color: "#e5e5e5", letterSpacing: "-0.8px" }}>Enrollment Confirmed</h2>
            <p style={{ margin: "0 0 32px", color: "rgba(229,229,229,0.45)", fontSize: "14px", lineHeight: 1.8 }}>Our team will review your application personally and reach out to shortlisted candidates within 5–10 business days.</p>
            <button onClick={() => setSuccess(false)} style={{ background: "rgba(99,102,241,0.9)", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 28px", fontSize: "13px", fontFamily: "monospace", fontWeight: 700, cursor: "pointer", letterSpacing: "1px" }}>CLOSE_TERMINAL</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
