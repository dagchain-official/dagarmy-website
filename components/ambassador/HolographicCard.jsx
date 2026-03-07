"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const TIER_CONFIG = {
  Silver: {
    gradient: "linear-gradient(135deg, #c0c0c0 0%, #808080 50%, #c0c0c0 100%)",
    glow: "rgba(192,192,192,0.25)",
    sheenColor: "rgba(255,255,255,0.15)",
    label: "#9ca3af",
    accent: "#d1d5db",
  },
  Gold: {
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #fbbf24 100%)",
    glow: "rgba(245,158,11,0.3)",
    sheenColor: "rgba(251,191,36,0.2)",
    label: "#fbbf24",
    accent: "#f59e0b",
  },
  Platinum: {
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #06b6d4 80%, #6366f1 100%)",
    glow: "rgba(99,102,241,0.4)",
    sheenColor: "rgba(139,92,246,0.25)",
    label: "#a5b4fc",
    accent: "#6366f1",
    sparkle: true,
  },
};

export default function HolographicCard({ level, followers, perks }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springCfg = { stiffness: 120, damping: 18 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], ["14deg", "-14deg"]), springCfg);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], ["-14deg", "14deg"]), springCfg);
  const shineX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

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
      style={{
        rotateX, rotateY,
        transformStyle: "preserve-3d",
        position: "relative",
        width: "100%",
        borderRadius: "24px",
        background: "#080808",
        overflow: "hidden",
        cursor: "default",
      }}
      whileHover={{ boxShadow: `0 0 60px ${cfg.glow}, 0 30px 80px rgba(0,0,0,0.6)` }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient border */}
      {cfg.sparkle ? (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "24px", padding: "1.5px",
          background: cfg.gradient,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor", maskComposite: "exclude",
          pointerEvents: "none", animation: "borderSpin 4s linear infinite",
        }} />
      ) : (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "24px", padding: "1px",
          background: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor", maskComposite: "exclude",
          pointerEvents: "none",
        }} />
      )}

      {/* Holographic flare that follows mouse */}
      <motion.div style={{
        position: "absolute",
        left: shineX, top: shineY,
        width: "200%", height: "200%",
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${cfg.sheenColor} 0%, transparent 60%)`,
        pointerEvents: "none", mixBlendMode: "overlay",
      }} />

      {/* Rainbow shimmer band */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "24px",
        background: "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.06) 40%, rgba(99,102,241,0.08) 50%, rgba(6,182,212,0.06) 60%, transparent 80%)",
        backgroundSize: "200% 100%",
        animation: "shimmerBand 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Card top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: cfg.gradient }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, transform: "translateZ(40px)", padding: "32px 28px" }}>
        <div style={{ marginBottom: "28px" }}>
          <span style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "3px", textTransform: "uppercase", color: cfg.label, display: "block", marginBottom: "10px" }}>{level} Ambassador</span>
          <h3 style={{ margin: "0 0 6px", fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", color: "#e5e5e5", lineHeight: 1 }}>{level}</h3>
          <p style={{ margin: 0, fontFamily: "monospace", fontSize: "12px", color: cfg.accent }}>{followers}</p>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {perks.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: cfg.accent, flexShrink: 0, boxShadow: `0 0 6px ${cfg.accent}` }} />
              <span style={{ fontSize: "13px", color: "rgba(229,229,229,0.6)", lineHeight: 1.5 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
