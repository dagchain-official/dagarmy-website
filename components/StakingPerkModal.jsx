"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";

/**
 * StakingPerkModal — Dribbble-tier premium white aesthetic.
 * Motion: spring physics, animated count-up, layoutId morph, SVG path draw-in.
 *
 * Props:
 *   type        — 'lt_upgrade' | 'dgcc_transfer'
 *   dgccAmount  — number
 *   userId      — string
 *   paymentId   — string|null
 *   transferId  — string|null
 *   onClose     — () => void
 */

const STAKING_OPTIONS = [
  { duration: 1, apy: 12 },
  { duration: 2, apy: 18 },
  { duration: 3, apy: 24 },
];

// ─── Design tokens ──────────────────────────────────────────────
const C = {
  bg:          "#FFFFFF",
  canvas:      "#FAFAF7",
  ink:         "#0A0A0A",
  ink2:        "#1C1C1C",
  muted:       "#71717A",
  subtle:      "#A1A1AA",
  line:        "#EAEAE6",
  lineSoft:    "#F2F1EC",
  accentA:     "#059669",   // emerald-600
  accentB:     "#34D399",   // emerald-400
  accentGrad:  "linear-gradient(135deg, #059669 0%, #34D399 100%)",
  accentTint:  "#ECFDF5",   // emerald-50
  ok:          "#10B981",
};

const SERIF = '"Fraunces", "Instrument Serif", Georgia, serif';
const MONO  = '"JetBrains Mono", ui-monospace, Menlo, monospace';

// ─── Animated count-up number ───────────────────────────────────
function CountUp({ to, duration = 1.1, format = (n) => Math.round(n).toLocaleString() }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, Number(to) || 0, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => { node.textContent = format(v); },
    });
    return () => controls.stop();
  }, [to, duration, format]);
  return <span ref={ref}>{format(0)}</span>;
}

// ─── Ambient drifting orbs (background) ─────────────────────────
function AmbientOrbs() {
  return (
    <div aria-hidden style={{
      position: "absolute", inset: 0, overflow: "hidden",
      pointerEvents: "none", borderRadius: "inherit",
    }}>
      {[
        { bg: "#FFE4CC", size: 420, x: "-12%",  y: "-18%", delay: 0 },
        { bg: "#FFD6E8", size: 380, x: "75%",   y: "-10%", delay: 2 },
        { bg: "#E8E2FF", size: 340, x: "30%",   y: "80%",  delay: 4 },
      ].map((o, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, x: [0, 20, 0, -20, 0], y: [0, -15, 0, 15, 0] }}
          transition={{
            opacity: { duration: 1.2, delay: 0.1 * i },
            x: { duration: 18 + i * 2, repeat: Infinity, ease: "easeInOut", delay: o.delay },
            y: { duration: 22 + i * 2, repeat: Infinity, ease: "easeInOut", delay: o.delay },
          }}
          style={{
            position: "absolute",
            left: o.x, top: o.y,
            width: o.size, height: o.size,
            borderRadius: "50%",
            background: o.bg,
            filter: "blur(80px)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Stylized yield curve SVG (draws in on mount) ───────────────
function YieldCurve({ highlight }) {
  // Curve represents exponential growth; 3 points = 1Y, 2Y, 3Y
  return (
    <svg viewBox="0 0 200 120" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="sgp-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.accentA} />
          <stop offset="100%" stopColor={C.accentB} />
        </linearGradient>
        <linearGradient id="sgp-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.accentA} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.accentB} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid guides */}
      {[30, 60, 90].map((y) => (
        <line key={y} x1="0" y1={y} x2="200" y2={y} stroke={C.line} strokeDasharray="2 4" strokeWidth="0.5" />
      ))}

      {/* Area under curve (fades in) */}
      <motion.path
        d="M 10 100 Q 70 92 100 72 T 190 18 L 190 110 L 10 110 Z"
        fill="url(#sgp-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      />

      {/* Main curve — draws in */}
      <motion.path
        d="M 10 100 Q 70 92 100 72 T 190 18"
        stroke="url(#sgp-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />

      {/* Data points */}
      {[
        { cx: 10,  cy: 100, label: "0Y", apy: null, visible: true },
        { cx: 70,  cy: 90,  label: "1Y", apy: "12%" },
        { cx: 130, cy: 60,  label: "2Y", apy: "18%" },
        { cx: 190, cy: 18,  label: "3Y", apy: "24%" },
      ].map((p, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.12, type: "spring", stiffness: 260, damping: 18 }}
        >
          <circle cx={p.cx} cy={p.cy} r="5" fill="#fff" stroke="url(#sgp-stroke)" strokeWidth="2" />
          {p.apy && (
            <text x={p.cx} y={p.cy - 10} textAnchor="middle"
                  fill={highlight === p.apy ? C.ink : C.muted}
                  fontSize="9" fontWeight="600"
                  fontFamily={MONO}>
              {p.apy}
            </text>
          )}
        </motion.g>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
export default function StakingPerkModal({ type, dgccAmount, userId, paymentId, transferId, onClose }) {
  const [step, setStep]             = useState(1);
  const [selected, setSelected]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [done, setDone]             = useState(false);

  const amount = Number(dgccAmount) || (type === "lt_upgrade" ? 149 : 0);
  const eyebrow =
    type === "lt_upgrade" ? "DAG LIEUTENANT · STAKING PERK" : "DAGGPT TRANSFER · STAKING PERK";

  const projected = (amt, apy, years) => amt + amt * (apy / 100) * years;
  const maxYield  = amount * 0.24 * 3;
  // Smart DGCC formatter — shows decimals for small values, round for large
  const fmt = (n) => {
    const num = Number(n) || 0;
    if (num === 0) return "0";
    if (Math.abs(num) >= 100) return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (Math.abs(num) >= 1)   return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  const submit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    const body = {
      type, userId,
      stakingDuration: selected.duration,
      stakingApy:      selected.apy,
    };
    if (type === "lt_upgrade") body.paymentId = paymentId || null;
    else { body.transferId = transferId; body.dgccAmount = amount; }

    try {
      const res = await fetch("/api/rewards/staking-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
        setTimeout(() => onClose?.(), 3200);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Spring preset reused across elements
  const spring = { type: "spring", stiffness: 380, damping: 32 };
  const stagger = (i) => ({ ...spring, delay: 0.08 + i * 0.06 });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes spmShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(245, 243, 238, 0.72)",
          backdropFilter: "blur(20px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
          fontFamily: '"Inter", -apple-system, sans-serif',
        }}
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: step === 1 ? "720px" : "560px",
            background: C.bg,
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 4px rgba(10,10,10,0.04), 0 24px 80px -20px rgba(10,10,10,0.22)",
            border: `1px solid ${C.line}`,
          }}
        >
          <AmbientOrbs />

          <AnimatePresence mode="wait">
            {/* ══════════ SUCCESS ══════════ */}
            {done && (
              <motion.div
                key="done"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: "relative", padding: "72px 56px", textAlign: "center" }}
              >
                {/* Spring checkmark + ripple */}
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.05 }}
                  style={{ position: "relative", width: "88px", height: "88px", margin: "0 auto 28px" }}
                >
                  {[0, 1].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.4, opacity: 0.6 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1.6, delay: 0.3 + i * 0.5, repeat: Infinity }}
                      style={{
                        position: "absolute", inset: 0, borderRadius: "50%",
                        background: C.accentGrad, opacity: 0.15,
                      }}
                    />
                  ))}
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    background: C.accentGrad,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 12px 32px -8px rgba(16,185,129,0.5)",
                  }}>
                    <motion.svg
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      width="40" height="40" viewBox="0 0 24 24" fill="none"
                      stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <motion.polyline points="20 6 9 17 4 12"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.35 }} />
                    </motion.svg>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  style={{
                    fontFamily: MONO, fontSize: "10px", letterSpacing: "0.28em",
                    color: C.ok, fontWeight: 600, marginBottom: "18px",
                  }}
                >
                  ✦ ON-CHAIN · CONFIRMED
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, type: "spring", stiffness: 180, damping: 22 }}
                  style={{
                    fontFamily: SERIF, fontSize: "44px", lineHeight: 1.05,
                    color: C.ink, fontWeight: 400, letterSpacing: "-0.03em",
                    margin: "0 0 14px",
                  }}
                >
                  Your stake is <em style={{ fontStyle: "italic", background: C.accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block", padding: "0 0.08em" }}>registered</em>.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  style={{ fontSize: "15px", color: C.muted, lineHeight: 1.6, margin: "0 auto", maxWidth: "420px" }}
                >
                  <span style={{ fontFamily: MONO, color: C.ink, fontWeight: 600 }}>{amount.toLocaleString()} DGCC</span> locked for{" "}
                  <span style={{ fontFamily: MONO, color: C.ink, fontWeight: 600 }}>{selected?.duration}Y</span> at{" "}
                  <span style={{ fontFamily: MONO, fontWeight: 700, background: C.accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {selected?.apy}% APY
                  </span>. Rewards accrue daily on DAGChain.
                </motion.p>
              </motion.div>
            )}

            {/* ══════════ STEP 1 ══════════ */}
            {!done && step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ position: "relative", display: "grid", gridTemplateColumns: "1.15fr 0.85fr" }}
              >
                {/* LEFT — Editorial content */}
                <div style={{ padding: "40px 36px 36px 40px" }}>
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={stagger(0)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}
                  >
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accentGrad }} />
                    <span style={{
                      fontFamily: MONO, fontSize: "10px", letterSpacing: "0.22em",
                      color: C.ink, fontWeight: 600,
                    }}>
                      {eyebrow}
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={stagger(1)}
                    style={{
                      fontFamily: SERIF, fontSize: "46px", lineHeight: 1.0,
                      color: C.ink, fontWeight: 400, letterSpacing: "-0.035em",
                      margin: "0 0 18px",
                    }}
                  >
                    {type === "lt_upgrade" ? (
                      <>
                        Your Lieutenant<br />
                        perk, <em style={{
                          fontStyle: "italic",
                          background: C.accentGrad,
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                          display: "inline-block", padding: "0 0.08em",
                        }}>yielding</em>.
                      </>
                    ) : (
                      <>
                        Put <em style={{
                          fontStyle: "italic",
                          background: C.accentGrad,
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                          display: "inline-block", padding: "0 0.08em",
                        }}>{fmt(amount)}</em> DGCC<br />
                        to work.
                      </>
                    )}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={stagger(2)}
                    style={{
                      fontSize: "14px", color: C.muted, lineHeight: 1.65,
                      margin: "0 0 28px", maxWidth: "380px",
                    }}
                  >
                    {type === "lt_upgrade"
                      ? "149 DGCC Coins are waiting to auto-stake on DAGChain. Choose a lock-up term and start earning daily."
                      : "Instead of sitting in your balance, lock these coins into DAGChain's native program and earn yield until maturity."}
                  </motion.p>

                  {/* Metric pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={stagger(3)}
                    style={{ display: "flex", gap: "10px", marginBottom: "32px", flexWrap: "wrap" }}
                  >
                    <div style={{
                      padding: "10px 14px", borderRadius: "999px",
                      background: C.canvas, border: `1px solid ${C.line}`,
                      display: "inline-flex", alignItems: "center", gap: "8px",
                    }}>
                      <span style={{ fontFamily: MONO, fontSize: "10px", color: C.muted, letterSpacing: "0.1em" }}>
                        STAKEABLE
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: "13px", color: C.ink, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                        {fmt(amount)} DGCC
                      </span>
                    </div>
                    <div style={{
                      padding: "10px 14px", borderRadius: "999px",
                      background: C.accentTint, border: `1px solid #A7F3D0`,
                      display: "inline-flex", alignItems: "center", gap: "8px",
                    }}>
                      <span style={{ fontFamily: MONO, fontSize: "10px", color: "#065F46", letterSpacing: "0.1em", fontWeight: 600 }}>
                        MAX YIELD
                      </span>
                      <span style={{
                        fontFamily: MONO, fontSize: "13px", fontWeight: 700, fontVariantNumeric: "tabular-nums",
                        background: C.accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      }}>
                        +{fmt(maxYield)} DGCC
                      </span>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={stagger(4)}
                    style={{ display: "flex", gap: "10px", alignItems: "center" }}
                  >
                    <motion.button
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(2)}
                      style={{
                        position: "relative", overflow: "hidden",
                        padding: "14px 24px", borderRadius: "999px",
                        background: C.ink, color: C.bg, border: "none",
                        fontSize: "13px", fontWeight: 600, letterSpacing: "0.02em",
                        cursor: "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        boxShadow: "0 4px 12px -2px rgba(10,10,10,0.2)",
                      }}
                    >
                      <span style={{ position: "relative", zIndex: 1 }}>Choose Duration</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ position: "relative", zIndex: 1 }}
                      >
                        →
                      </motion.span>
                      {/* Shimmer */}
                      <span style={{
                        position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                        animation: "spmShimmer 2.8s infinite",
                      }} />
                    </motion.button>
                    <button
                      onClick={() => onClose?.()}
                      style={{
                        padding: "14px 18px", background: "transparent",
                        color: C.muted, border: "none",
                        fontSize: "13px", fontWeight: 500, cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Maybe later
                    </button>
                  </motion.div>
                </div>

                {/* RIGHT — Yield visualization */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{
                    position: "relative",
                    background: `linear-gradient(135deg, ${C.canvas} 0%, ${C.accentTint} 100%)`,
                    padding: "40px 32px",
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    borderLeft: `1px solid ${C.line}`,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <div style={{
                      fontFamily: MONO, fontSize: "10px", letterSpacing: "0.2em",
                      color: C.muted, marginBottom: "6px", fontWeight: 600,
                    }}>
                      YIELD PROJECTION
                    </div>
                    <div style={{
                      fontFamily: SERIF, fontSize: "20px", color: C.ink,
                      fontWeight: 500, letterSpacing: "-0.02em",
                    }}>
                      1Y → 3Y Lock
                    </div>
                  </div>

                  <div style={{ margin: "20px 0", position: "relative" }}>
                    <YieldCurve highlight="24%" />
                  </div>

                  {/* Up-to APY */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontFamily: MONO, fontSize: "10px", color: C.muted, letterSpacing: "0.18em" }}>
                      UP&nbsp;TO
                    </span>
                    <span style={{
                      fontFamily: SERIF, fontSize: "56px", fontWeight: 400, lineHeight: 0.9,
                      letterSpacing: "-0.04em",
                      background: C.accentGrad,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>
                      24<span style={{ fontSize: "28px" }}>%</span>
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: "11px", color: C.muted, letterSpacing: "0.18em", marginLeft: "4px" }}>
                      APY
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ══════════ STEP 2 ══════════ */}
            {!done && step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ position: "relative", padding: "32px 40px 32px" }}
              >
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                  onClick={() => setStep(1)}
                  whileHover={{ x: -2 }}
                  style={{
                    fontFamily: MONO, fontSize: "10px", letterSpacing: "0.18em",
                    color: C.ink, fontWeight: 600, background: "none", border: "none",
                    cursor: "pointer", padding: 0, marginBottom: "18px",
                    display: "inline-flex", alignItems: "center", gap: "6px",
                  }}
                >
                  ← BACK
                </motion.button>

                <motion.h2
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={stagger(1)}
                  style={{
                    fontFamily: SERIF, fontSize: "36px", lineHeight: 1.02,
                    color: C.ink, fontWeight: 400, letterSpacing: "-0.03em",
                    margin: "0 0 10px",
                  }}
                >
                  Lock it for how <em style={{
                    fontStyle: "italic",
                    background: C.accentGrad,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    display: "inline-block", padding: "0 0.08em",
                  }}>long</em>?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={stagger(2)}
                  style={{ fontSize: "13px", color: C.muted, margin: "0 0 24px", lineHeight: 1.6 }}
                >
                  Longer = higher APY. Your{" "}
                  <span style={{ fontFamily: MONO, color: C.ink, fontWeight: 600 }}>
                    {amount.toLocaleString()} DGCC
                  </span>{" "}
                  stays locked on DAGChain until maturity.
                </motion.p>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  {STAKING_OPTIONS.map((opt, i) => {
                    const isSelected = selected?.duration === opt.duration;
                    const gained = projected(amount, opt.apy, opt.duration) - amount;
                    const gainedStr = fmt(gained);
                    return (
                      <motion.button
                        key={opt.duration}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...stagger(3 + i) }}
                        onClick={() => setSelected(opt)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        style={{
                          position: "relative",
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          alignItems: "center",
                          gap: "20px",
                          padding: "18px 22px",
                          borderRadius: "16px",
                          background: isSelected
                            ? `linear-gradient(135deg, ${C.accentTint} 0%, #D1FAE5 100%)`
                            : C.bg,
                          border: isSelected ? `1.5px solid ${C.accentA}` : `1px solid ${C.line}`,
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "inherit",
                          transition: "background 0.2s, border 0.2s",
                          boxShadow: isSelected
                            ? "0 8px 24px -8px rgba(16,185,129,0.35)"
                            : "0 1px 2px rgba(10,10,10,0.02)",
                        }}
                      >
                        {/* layoutId accent bar */}
                        {isSelected && (
                          <motion.div
                            layoutId="spm-active"
                            style={{
                              position: "absolute", left: "0", top: "14%", bottom: "14%",
                              width: "3px", borderRadius: "999px",
                              background: C.accentGrad,
                            }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}

                        <div>
                          <div style={{
                            fontFamily: SERIF, fontSize: "24px", color: C.ink,
                            fontWeight: 500, letterSpacing: "-0.02em", marginBottom: "4px",
                            display: "flex", alignItems: "baseline", gap: "6px",
                          }}>
                            {opt.duration}
                            <span style={{ fontSize: "14px", color: C.muted, fontWeight: 400 }}>
                              {opt.duration === 1 ? "year" : "years"}
                            </span>
                          </div>
                          <div style={{
                            fontFamily: MONO, fontSize: "11px", color: C.muted,
                            letterSpacing: "0.04em",
                          }}>
                            +{gainedStr} DGCC earned
                          </div>
                        </div>

                        <div style={{ textAlign: "right", minWidth: "74px" }}>
                          <div style={{
                            fontFamily: SERIF, fontSize: "32px", fontWeight: 400,
                            lineHeight: 1, letterSpacing: "-0.03em",
                            fontVariantNumeric: "tabular-nums",
                            background: isSelected ? C.accentGrad : "none",
                            WebkitBackgroundClip: isSelected ? "text" : "initial",
                            WebkitTextFillColor: isSelected ? "transparent" : C.ink,
                            color: isSelected ? "transparent" : C.ink,
                          }}>
                            {opt.apy}%
                          </div>
                          <div style={{
                            fontFamily: MONO, fontSize: "9px",
                            color: C.muted, letterSpacing: "0.2em", marginTop: "2px",
                          }}>
                            APY
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Summary */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden", marginBottom: "16px" }}
                    >
                      <div style={{
                        padding: "14px 16px",
                        background: C.canvas,
                        border: `1px solid ${C.line}`,
                        borderRadius: "12px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: "12px",
                      }}>
                        <div>
                          <div style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.2em", color: C.muted, marginBottom: "2px" }}>
                            AT MATURITY
                          </div>
                          <div style={{ fontFamily: MONO, fontSize: "14px", color: C.ink, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                            {fmt(projected(amount, selected.apy, selected.duration))}
                            <span style={{ color: C.muted, fontWeight: 400 }}> DGCC</span>
                          </div>
                        </div>
                        <div style={{
                          fontFamily: MONO, fontSize: "10px", color: C.muted,
                          letterSpacing: "0.08em", textAlign: "right",
                        }}>
                          {new Date(Date.now() + selected.duration * 365 * 24 * 60 * 60 * 1000)
                            .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                            .toUpperCase()}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginBottom: "14px", padding: "10px 14px",
                      background: "#FEF2F2", border: "1px solid #FECACA",
                      borderRadius: "10px", fontSize: "12px", color: "#991B1B",
                      fontFamily: MONO,
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <motion.button
                    whileHover={selected && !submitting ? { y: -1 } : {}}
                    whileTap={selected && !submitting ? { scale: 0.99 } : {}}
                    onClick={submit}
                    disabled={!selected || submitting}
                    style={{
                      flex: 1, position: "relative", overflow: "hidden",
                      padding: "15px 24px", borderRadius: "999px",
                      background: selected ? C.ink : C.lineSoft,
                      color: selected ? C.bg : C.subtle,
                      border: "none",
                      fontSize: "13px", fontWeight: 600, letterSpacing: "0.01em",
                      cursor: selected && !submitting ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                      boxShadow: selected ? "0 4px 14px -2px rgba(10,10,10,0.25)" : "none",
                      opacity: submitting ? 0.75 : 1,
                    }}
                  >
                    <span style={{ position: "relative", zIndex: 1 }}>
                      {submitting
                        ? "Submitting to DAGChain..."
                        : selected
                          ? `Stake ${amount.toLocaleString()} DGCC · ${selected.apy}% APY`
                          : "Select a duration"}
                    </span>
                    {selected && !submitting && (
                      <span style={{
                        position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
                        animation: "spmShimmer 2.8s infinite",
                      }} />
                    )}
                  </motion.button>
                  <button
                    onClick={() => onClose?.()}
                    style={{
                      padding: "15px 18px", background: "transparent",
                      color: C.muted, border: "none",
                      fontSize: "13px", fontWeight: 500, cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Skip
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
