"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BentoCard from "./BentoCard";
import HolographicCard from "./HolographicCard";
import MagneticButton from "./MagneticButton";
import RewardDashboard from "./RewardDashboard";
import GlassTerminalForm from "./GlassTerminalForm";

/* ── scroll reveal ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Reveal({ children, delay = 0, style = {}, className = "" }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={delay}
      variants={fadeUp}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── FAQ ── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none",
          padding: "20px 0", display: "flex", justifyContent: "space-between",
          alignItems: "center", cursor: "pointer", gap: "20px", textAlign: "left",
        }}
      >
        <span style={{ fontSize: "15px", fontWeight: 600, color: "#111", lineHeight: 1.5 }}>{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ color: "#6366f1", flexShrink: 0, fontSize: "20px", lineHeight: 1, fontWeight: 300 }}
        >
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: "14px", lineHeight: 1.85, maxWidth: "680px" }}>{a}</p>
      </motion.div>
    </div>
  );
}

/* ── Abstract SVG blobs for card visuals ── */
function BlobViolet() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ filter: "blur(1px)" }}>
      <path d="M60 10 C80 10 105 30 105 60 C105 90 85 110 60 110 C35 110 15 88 15 60 C15 32 40 10 60 10Z" fill="url(#bv1)" />
      <circle cx="72" cy="44" r="16" fill="rgba(255,255,255,0.3)" />
      <circle cx="46" cy="76" r="10" fill="rgba(255,255,255,0.2)" />
      <defs>
        <linearGradient id="bv1" x1="15" y1="10" x2="105" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" /><stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BlobBlue() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" style={{ filter: "blur(1px)" }}>
      <path d="M55 8 C78 12 100 28 100 55 C100 82 78 102 55 102 C32 102 10 82 10 55 C10 28 32 4 55 8Z" fill="url(#bb1)" />
      <circle cx="68" cy="38" r="14" fill="rgba(255,255,255,0.25)" />
      <circle cx="38" cy="70" r="9" fill="rgba(255,255,255,0.15)" />
      <defs>
        <linearGradient id="bb1" x1="10" y1="8" x2="100" y2="102" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" /><stop offset="1" stopColor="#34d399" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BlobPink() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={{ filter: "blur(0.5px)" }}>
      <path d="M50 6 C70 6 94 24 94 50 C94 76 72 94 50 94 C28 94 6 74 6 50 C6 26 30 6 50 6Z" fill="url(#bp1)" />
      <circle cx="62" cy="34" r="12" fill="rgba(255,255,255,0.3)" />
      <defs>
        <linearGradient id="bp1" x1="6" y1="6" x2="94" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f9a8d4" /><stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Creator icon ── */
function CreatorIcon({ color }) {
  return (
    <div style={{ width: 40, height: 40, borderRadius: 12, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function AmbassadorPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const tiers = [
    {
      level: "Silver",
      followers: "1,000+ followers",
      perks: [
        "Standard referral rewards",
        "Free DAGGPT access",
        "Ambassador badge",
        "Private community access",
        "Monthly performance report",
      ],
    },
    {
      level: "Gold",
      followers: "50,000+ followers",
      perks: [
        "Enhanced reward rate",
        "Performance bonuses",
        "Featured website profile",
        "Priority support channel",
        "Early ecosystem access",
        "Dedicated account manager",
      ],
    },
    {
      level: "Platinum",
      followers: "100,000+ followers",
      perks: [
        "Custom partnership terms",
        "Regional leadership role",
        "Revenue-share agreements",
        "Executive direct access",
        "Co-branded campaigns",
        "Ecosystem governance input",
      ],
    },
  ];

  const creators = [
    { title: "YouTubers", desc: "Video creators covering AI, blockchain, and tech", color: "rgba(239,68,68,0.12)", dot: "#ef4444" },
    { title: "Instagram Creators", desc: "Visual storytellers with engaged communities", color: "rgba(236,72,153,0.12)", dot: "#ec4899" },
    { title: "AI Educators", desc: "Experts simplifying artificial intelligence concepts", color: "rgba(99,102,241,0.12)", dot: "#6366f1" },
    { title: "Web3 Influencers", desc: "Voices shaping decentralized technology adoption", color: "rgba(139,92,246,0.12)", dot: "#8b5cf6" },
    { title: "Blockchain Analysts", desc: "Research-driven content on Layer-1 ecosystems", color: "rgba(6,182,212,0.12)", dot: "#06b6d4" },
    { title: "Facebook Creators", desc: "Community builders with regional audience reach", color: "rgba(59,130,246,0.12)", dot: "#3b82f6" },
    { title: "Tech Community Leaders", desc: "Forum moderators and developer advocates", color: "rgba(16,185,129,0.12)", dot: "#10b981" },
    { title: "Regional Language Creators", desc: "Local-language voices driving adoption globally", color: "rgba(245,158,11,0.12)", dot: "#f59e0b" },
  ];

  const benefits = [
    {
      title: "Free DAGGPT Access",
      metric: "10+ AI Modules",
      desc: "Full access to DAGGPT's multi-module platform — replacing multiple AI tool subscriptions.",
      gradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
      accent: "#6366f1",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
      ),
    },
    {
      title: "Referral Earnings",
      metric: "Real Crypto Rewards",
      desc: "Earn based on verified ecosystem activity — node purchases, subscriptions, and upgrades.",
      gradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      accent: "#3b82f6",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      ),
    },
    {
      title: "Reward Points System",
      metric: "DAG Points",
      desc: "Accumulate DAG points redeemable for GasCoin, platform credits, and premium feature access.",
      gradient: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
      accent: "#ec4899",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
    {
      title: "Ambassador Recognition",
      metric: "Verified Status",
      desc: "Receive an official badge, a featured profile on the website, and exclusive ambassador-only events.",
      gradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
      accent: "#10b981",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
  ];

  const faqs = [
    { q: "Is this an investment program?", a: "No. The DAG Army Ambassador Program is a performance-based referral and marketing initiative linked to actual product usage. There is no investment element." },
    { q: "Is there a joining fee?", a: "No. Applying and joining is completely free. There is no mandatory payment or investment required at any stage." },
    { q: "Are earnings guaranteed?", a: "No. All rewards are based solely on verified ecosystem activity generated through your unique referral link." },
    { q: "Can I create content in my regional language?", a: "Yes. Regional language content is highly encouraged. We actively seek creators who can engage local communities in their native language." },
    { q: "How long does the review take?", a: "Our team reviews applications personally within 5–10 business days. Shortlisted candidates are contacted directly via email." },
    { q: "What content should I create?", a: "Product walkthroughs, AI tool demos, node infrastructure guides, blockchain education, and ecosystem overview content perform best." },
  ];

  /* ── Shared styles ── */
  const sectionLabel = {
    display: "inline-flex", alignItems: "center", gap: "7px",
    background: "rgba(99,102,241,0.08)", borderRadius: "100px",
    padding: "5px 14px", marginBottom: "20px",
    fontSize: "11px", fontWeight: 700, color: "#6366f1",
    letterSpacing: "0.06em", textTransform: "uppercase",
  };

  const sectionTitle = {
    fontSize: "clamp(32px, 3.5vw, 44px)", fontWeight: 900,
    letterSpacing: "-2px", lineHeight: 1.05, color: "#0f0f0f", margin: 0,
  };

  const bodyText = {
    fontSize: "16px", color: "#6b7280", lineHeight: 1.85,
  };

  return (
    /* ── Outer body wrapper: soft grey ── */
    <div style={{ background: "#f0f2f8", padding: "40px 20px 60px", fontFamily: "'Inter', 'Geist', system-ui, sans-serif", minHeight: "100vh" }}>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes shimmerBand { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes floatSlow { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
      `}</style>

      {/* ── Main rounded container ── */}
      <div style={{
        maxWidth: "1380px", margin: "0 auto",
        background: "#ffffff", borderRadius: "32px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}>

        {/* ════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════ */}
        <section style={{ padding: "80px 64px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", position: "relative", overflow: "hidden" }}>

          {/* Subtle background glow */}
          <div style={{ position: "absolute", top: "-100px", right: "0", width: "600px", height: "600px", background: "radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Left: Editorial text */}
          <div>
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f0fdf4", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", padding: "6px 16px", marginBottom: "36px" }}
            >
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "blink 2s infinite" }} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#15803d", letterSpacing: "0.04em" }}>2026 Applications Open</span>
            </motion.div>

            {/* Hero headline */}
            <div style={{ overflow: "hidden", marginBottom: "4px" }}>
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                style={{ fontSize: "clamp(52px, 6.5vw, 88px)", fontWeight: 900, letterSpacing: "-4px", lineHeight: 0.95, margin: 0, color: "#0f0f0f" }}
              >
                Become a
              </motion.h1>
            </div>
            <div style={{ overflow: "hidden", marginBottom: "4px" }}>
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                style={{ fontSize: "clamp(52px, 6.5vw, 88px)", fontWeight: 900, letterSpacing: "-4px", lineHeight: 0.95, margin: 0, background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                DAG Army
              </motion.h1>
            </div>
            <div style={{ overflow: "hidden", marginBottom: "32px" }}>
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.19 }}
                style={{ fontSize: "clamp(52px, 6.5vw, 88px)", fontWeight: 900, letterSpacing: "-4px", lineHeight: 0.95, margin: 0, color: "#0f0f0f" }}
              >
                Ambassador
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: "17px", color: "#6b7280", lineHeight: 1.8, maxWidth: "440px", marginBottom: "40px" }}
            >
              Represent the future of AI-native blockchain. Build your personal brand, earn real rewards, and grow alongside a global ecosystem powered by DAGGPT and DAGChain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
            >
              <MagneticButton onClick={() => setFormOpen(true)} variant="primary">
                Apply Now →
              </MagneticButton>
              <MagneticButton onClick={() => document.getElementById("amb-tiers")?.scrollIntoView({ behavior: "smooth" })} variant="ghost">
                View Program Guide
              </MagneticButton>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ display: "flex", gap: "28px", marginTop: "48px", paddingTop: "28px", borderTop: "1px solid #f0f0f0", flexWrap: "wrap" }}
            >
              {[
                { n: "10K+", l: "Community" },
                { n: "3", l: "Platforms" },
                { n: "5", l: "Continents" },
                { n: "Free", l: "To Join" },
              ].map((s, i) => (
                <div key={i}>
                  <p style={{ margin: 0, fontSize: "20px", fontWeight: 900, color: "#0f0f0f", letterSpacing: "-0.8px" }}>{s.n}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Asymmetric card composition */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: "16px" }}
          >
            {/* Large hero card — violet */}
            <BentoCard
              gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%)"
              shadowColor="rgba(99,102,241,0.3)"
              style={{ gridColumn: "1 / 3", padding: "32px", minHeight: "180px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)", opacity: 0.6, animation: "floatSlow 5s ease-in-out infinite" }}>
                <BlobViolet />
              </div>
              <div style={{ position: "relative", zIndex: 2 }}>
                <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>AI + Blockchain</p>
                <h2 style={{ margin: "0 0 10px", fontSize: "26px", fontWeight: 900, color: "#fff", letterSpacing: "-1px", lineHeight: 1.1, maxWidth: "240px" }}>Represent the Future</h2>
                <p style={{ margin: "0 0 20px", fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: "260px" }}>Join the movement at the intersection of AI and Web3 infrastructure.</p>
                <button
                  onClick={() => setFormOpen(true)}
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "100px", padding: "8px 18px", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", backdropFilter: "blur(8px)" }}
                >
                  Apply Now →
                </button>
              </div>
            </BentoCard>

            {/* DAGGPT card */}
            <BentoCard
              gradient="linear-gradient(135deg, #dbeafe 0%, #bfdbfe 80%)"
              shadowColor="rgba(59,130,246,0.2)"
              style={{ padding: "24px", minHeight: "160px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", bottom: "-10px", right: "-10px", opacity: 0.5, animation: "floatSlow 6s ease-in-out infinite" }}>
                <BlobBlue />
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 700, color: "#3b82f6", letterSpacing: "0.08em", textTransform: "uppercase" }}>AI Platform</p>
                <h3 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: 900, color: "#1e3a5f", letterSpacing: "-0.6px" }}>DAGGPT</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#4b6184", lineHeight: 1.65 }}>Multi-module AI. One subscription.</p>
              </div>
            </BentoCard>

            {/* DAGChain card */}
            <BentoCard
              gradient="linear-gradient(135deg, #fce7f3 0%, #f9a8d4 80%)"
              shadowColor="rgba(236,72,153,0.2)"
              style={{ padding: "24px", minHeight: "160px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", bottom: "-10px", right: "-10px", opacity: 0.55, animation: "floatSlow 7s ease-in-out infinite" }}>
                <BlobPink />
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 700, color: "#be185d", letterSpacing: "0.08em", textTransform: "uppercase" }}>Layer 1</p>
                <h3 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: 900, color: "#831843", letterSpacing: "-0.6px" }}>DAGChain</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#9d174d", lineHeight: 1.65 }}>AI-native blockchain infrastructure.</p>
              </div>
            </BentoCard>
          </motion.div>
        </section>

        {/* ════════════════════════════════════
            ECOSYSTEM SECTION
        ════════════════════════════════════ */}
        <section style={{ padding: "80px 64px", background: "#fafbfe" }}>
          <Reveal>
            <div style={sectionLabel}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6366f1" }} />
              The Ecosystem
            </div>
          </Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
            <Reveal>
              <h2 style={sectionTitle}>Built on three pillars.</h2>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ ...bodyText, maxWidth: "320px", margin: 0 }}>A community, an AI platform, and a blockchain — interconnected and growing together.</p>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "16px" }}>
            {/* DAG Army — large */}
            <Reveal style={{ gridRow: "span 1" }}>
              <BentoCard
                gradient="linear-gradient(145deg, #6366f1 0%, #8b5cf6 55%, #a78bfa 100%)"
                shadowColor="rgba(99,102,241,0.25)"
                style={{ padding: "36px", minHeight: "280px", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", bottom: "-20px", right: "-20px", opacity: 0.4, animation: "floatSlow 5s ease-in-out infinite" }}>
                  <BlobViolet />
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/>
                      <path d="M3 7l9 5 9-5M12 12v10"/>
                    </svg>
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase" }}>01 — Community</p>
                  <h3 style={{ margin: "0 0 12px", fontSize: "26px", fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>DAG Army</h3>
                  <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, maxWidth: "280px" }}>A global community-driven AI and Web3 movement shaping the decentralized future. Ambassadors are the human face of this movement.</p>
                </div>
              </BentoCard>
            </Reveal>

            {/* DAGGPT */}
            <Reveal delay={1}>
              <BentoCard
                gradient="linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)"
                shadowColor="rgba(59,130,246,0.15)"
                style={{ padding: "28px", minHeight: "280px", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", bottom: "-15px", right: "-15px", opacity: 0.45, animation: "floatSlow 7s ease-in-out infinite" }}>
                  <BlobBlue />
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/>
                    </svg>
                  </div>
                  <p style={{ margin: "0 0 5px", fontSize: "10px", fontWeight: 700, color: "#3b82f6", letterSpacing: "0.08em", textTransform: "uppercase" }}>02 — AI Platform</p>
                  <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 900, color: "#1e3a5f", letterSpacing: "-0.6px" }}>DAGGPT</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#4b6184", lineHeight: 1.75 }}>Multi-module AI platform replacing multiple subscriptions. Free full access for all ambassadors.</p>
                </div>
              </BentoCard>
            </Reveal>

            {/* DAGChain */}
            <Reveal delay={2}>
              <BentoCard
                gradient="linear-gradient(145deg, #fdf4ff 0%, #f3e8ff 100%)"
                shadowColor="rgba(139,92,246,0.15)"
                style={{ padding: "28px", minHeight: "280px", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", bottom: "-15px", right: "-15px", opacity: 0.4, animation: "floatSlow 6s ease-in-out infinite" }}>
                  <BlobPink />
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="6" height="4" rx="1"/><rect x="9" y="7" width="6" height="4" rx="1"/><rect x="16" y="7" width="6" height="4" rx="1"/>
                      <path d="M8 9h1M15 9h1M12 11v3M7 14h10"/>
                    </svg>
                  </div>
                  <p style={{ margin: "0 0 5px", fontSize: "10px", fontWeight: 700, color: "#8b5cf6", letterSpacing: "0.08em", textTransform: "uppercase" }}>03 — Blockchain</p>
                  <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 900, color: "#3b0764", letterSpacing: "-0.6px" }}>DAGChain</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#5b21b6", lineHeight: 1.75 }}>AI-native Layer-1 blockchain. The infrastructure powering the entire ecosystem.</p>
                </div>
              </BentoCard>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════
            CREATOR COMMUNITY
        ════════════════════════════════════ */}
        <section style={{ padding: "80px 64px" }}>
          <Reveal>
            <div style={sectionLabel}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6366f1" }} />
              Who Can Apply
            </div>
          </Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
            <Reveal>
              <h2 style={sectionTitle}>Built for creators<br />and builders.</h2>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ ...bodyText, maxWidth: "300px", margin: 0 }}>We look for passionate creators who can bring the AI and Web3 story to life in their language and region.</p>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "40px" }}>
            {creators.map((c, i) => (
              <Reveal key={i} delay={i * 0.5}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
                  style={{
                    background: "#ffffff", borderRadius: "20px", padding: "22px 20px",
                    border: "1px solid rgba(0,0,0,0.06)", cursor: "default",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transition: "all 0.25s ease",
                  }}
                >
                  <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.dot }} />
                  </div>
                  <p style={{ margin: "0 0 5px", fontSize: "14px", fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.2px" }}>{c.title}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.6 }}>{c.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Requirements row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid #f0f0f0", borderRadius: "20px", overflow: "hidden" }}>
            {[
              { n: "01", title: "Active Audience", desc: "An engaged following on at least one platform. 1,000+ minimum across any channel." },
              { n: "02", title: "Consistent Creator", desc: "Established publishing history with a real community presence and recognizable voice." },
              { n: "03", title: "Clear Communicator", desc: "Ability to explain AI or blockchain concepts accessibly in your language and region." },
            ].map((r, i) => (
              <Reveal key={i} delay={i}>
                <div
                  style={{ padding: "28px 24px", borderRight: i < 2 ? "1px solid #f0f0f0" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}
                >
                  <p style={{ margin: "0 0 10px", fontSize: "28px", fontWeight: 900, color: "rgba(0,0,0,0.06)", letterSpacing: "-1.5px" }}>{r.n}</p>
                  <p style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 800, color: "#0f0f0f" }}>{r.title}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", lineHeight: 1.8 }}>{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════
            BENEFITS + DASHBOARD
        ════════════════════════════════════ */}
        <section style={{ padding: "80px 64px", background: "#fafbfe" }}>
          <Reveal>
            <div style={sectionLabel}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6366f1" }} />
              The Rewards
            </div>
          </Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
            <Reveal>
              <h2 style={sectionTitle}>A unified reward<br />network.</h2>
            </Reveal>
            <Reveal delay={2}>
              <MagneticButton onClick={() => setFormOpen(true)} variant="primary">Apply Now →</MagneticButton>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>
            {/* Benefits 2x2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {benefits.map((b, i) => (
                <Reveal key={i} delay={i}>
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
                    style={{
                      background: b.gradient, borderRadius: "20px", padding: "24px",
                      border: "1px solid rgba(0,0,0,0.04)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.04)", cursor: "default",
                    }}
                  >
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                      {b.icon}
                    </div>
                    <p style={{ margin: "0 0 3px", fontSize: "17px", fontWeight: 900, color: b.accent, letterSpacing: "-0.4px" }}>{b.metric}</p>
                    <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 800, color: "#0f0f0f" }}>{b.title}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", lineHeight: 1.7 }}>{b.desc}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            {/* Live dashboard */}
            <Reveal delay={4}>
              <RewardDashboard />
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════
            AMBASSADOR TIERS
        ════════════════════════════════════ */}
        <section id="amb-tiers" style={{ padding: "80px 64px" }}>
          <Reveal style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ ...sectionLabel, margin: "0 auto 20px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6366f1" }} />
              Select Your Path
            </div>
            <h2 style={{ ...sectionTitle, textAlign: "center" }}>Ambassador Tiers</h2>
            <p style={{ ...bodyText, textAlign: "center", maxWidth: "420px", margin: "14px auto 0" }}>Tiers are reviewed and upgraded based on your performance and audience growth.</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr", gap: "20px", alignItems: "center" }}>
            {tiers.map((t, i) => (
              <Reveal key={i} delay={i + 1}>
                <HolographicCard {...t} />
                <div style={{ marginTop: "12px" }}>
                  <MagneticButton
                    onClick={() => setFormOpen(true)}
                    variant="ghost"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Apply as {t.level} →
                  </MagneticButton>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════
            FAQ
        ════════════════════════════════════ */}
        <section style={{ padding: "80px 64px", background: "#fafbfe" }}>
          <div style={{ maxWidth: "740px", margin: "0 auto" }}>
            <Reveal style={{ marginBottom: "48px" }}>
              <div style={sectionLabel}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6366f1" }} />
                FAQ
              </div>
              <h2 style={sectionTitle}>Common Questions</h2>
            </Reveal>
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 0.5}>
                <FAQItem q={f.q} a={f.a} />
              </Reveal>
            ))}
            <Reveal>
              <p style={{ marginTop: "32px", fontSize: "12px", color: "#9ca3af", lineHeight: 1.9 }}>
                COMPLIANCE: The DAG Army Ambassador Program is a referral-based marketing initiative — not an investment scheme. All rewards depend on verified product usage. Full T&amp;C apply.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════
            FINAL CTA
        ════════════════════════════════════ */}
        <section style={{ padding: "100px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          {/* Soft radial glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "500px", background: "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <Reveal>
              <div style={{ ...sectionLabel, margin: "0 auto 24px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6366f1" }} />
                Join the Movement
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 style={{ ...sectionTitle, fontSize: "clamp(36px, 5vw, 64px)", maxWidth: "660px", margin: "0 auto 20px" }}>
                Join the DAG Army Ambassador Program
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ ...bodyText, maxWidth: "480px", margin: "0 auto 40px" }}>
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
      {/* end main container */}

      {/* ════════════════════════════════════
          APPLY MODAL
      ════════════════════════════════════ */}
      <AnimatePresence>
        {formOpen && !success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 99999,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "24px", backdropFilter: "blur(10px)", overflow: "auto",
            }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", maxWidth: "760px", position: "relative" }}
            >
              <button
                onClick={() => setFormOpen(false)}
                style={{
                  position: "absolute", top: "-12px", right: "12px",
                  background: "#fff", border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "10px", width: "34px", height: "34px",
                  color: "#6b7280", cursor: "pointer", fontSize: "18px",
                  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                ×
              </button>
              <GlassTerminalForm onSuccess={() => { setFormOpen(false); setSuccess(true); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════
          SUCCESS MODAL
      ════════════════════════════════════ */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSuccess(false)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99999,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "24px", backdropFilter: "blur(10px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: "#fff", borderRadius: "28px", padding: "56px 48px",
                textAlign: "center", maxWidth: "420px", width: "100%",
                boxShadow: "0 32px 80px rgba(0,0,0,0.12)",
                border: "1px solid rgba(99,102,241,0.12)",
              }}
            >
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ ...sectionLabel, margin: "0 auto 16px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6366f1" }} />
                Application Received
              </div>
              <h2 style={{ margin: "0 0 12px", fontSize: "24px", fontWeight: 900, color: "#0f0f0f", letterSpacing: "-0.8px" }}>Enrollment Confirmed</h2>
              <p style={{ margin: "0 0 32px", color: "#9ca3af", fontSize: "14px", lineHeight: 1.85 }}>
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
