"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const TIER_CONFIG = {
  Silver: {
    topGradient: "linear-gradient(90deg, #94a3b8 0%, #cbd5e1 100%)",
    cardBg: "#ffffff",
    badgeBg: "rgba(148,163,184,0.12)",
    badgeColor: "#64748b",
    accentColor: "#64748b",
    shadow: "rgba(148,163,184,0.2)",
    labelColor: "#94a3b8",
  },
  Gold: {
    topGradient: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
    cardBg: "#ffffff",
    badgeBg: "rgba(245,158,11,0.1)",
    badgeColor: "#d97706",
    accentColor: "#f59e0b",
    shadow: "rgba(245,158,11,0.2)",
    labelColor: "#d97706",
  },
  Platinum: {
    topGradient: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
    cardBg: "linear-gradient(160deg, #f5f3ff 0%, #ede9fe 60%, #e0f2fe 100%)",
    badgeBg: "rgba(99,102,241,0.1)",
    badgeColor: "#6366f1",
    accentColor: "#6366f1",
    shadow: "rgba(99,102,241,0.2)",
    labelColor: "#6366f1",
    featured: true,
  },
};

export default function HolographicCard({ level, followers, perks }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springCfg = { stiffness: 130, damping: 20 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], ["5deg", "-5deg"]), springCfg);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], ["-5deg", "5deg"]), springCfg);

  const cfg = TIER_CONFIG[level] || TIER_CONFIG.Silver;

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, boxShadow: `0 32px 64px ${cfg.shadow}, 0 8px 24px rgba(0,0,0,0.06)` }}
      style={{
        rotateX, rotateY,
        transformStyle: "preserve-3d",
        position: "relative",
        width: "100%",
        borderRadius: "24px",
        background: cfg.cardBg,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        overflow: "hidden",
        cursor: "default",
        border: cfg.featured ? "1.5px solid rgba(99,102,241,0.15)" : "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Top accent stripe */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: cfg.topGradient }} />

      {/* Shimmer band for Platinum */}
      {cfg.featured && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "24px",
          background: "linear-gradient(110deg, transparent 30%, rgba(99,102,241,0.04) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmerBand 4s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* Content */}
      <div style={{ padding: "32px 28px", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: cfg.badgeBg, borderRadius: "100px", padding: "5px 12px", marginBottom: "24px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.accentColor }} />
          <span style={{ fontSize: "10px", fontWeight: 700, color: cfg.badgeColor, letterSpacing: "0.05em", textTransform: "uppercase" }}>{level}</span>
        </div>

        <h3 style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: 900, color: "#0f0f0f", letterSpacing: "-1px", lineHeight: 1 }}>{level} Tier</h3>
        <p style={{ margin: "0 0 24px", fontSize: "13px", color: cfg.labelColor, fontWeight: 600 }}>{followers}</p>

        <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", marginBottom: "20px" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {perks.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <svg style={{ flexShrink: 0, marginTop: "2px" }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="7" fill={cfg.badgeBg} />
                <path d="M4.5 7l1.8 1.8 3.2-3.6" stroke={cfg.accentColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
