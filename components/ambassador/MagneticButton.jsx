"use client";
import { useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function MagneticButton({ children, onClick, variant = "primary", href, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 });
  const springY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
    if (dist < 100) {
      x.set((e.clientX - cx) * 0.35);
      y.set((e.clientY - cy) * 0.35);
    }
  };

  const onLeave = () => { x.set(0); y.set(0); };

  const base = {
    position: "relative", display: "inline-flex", alignItems: "center",
    justifyContent: "center", gap: "8px", borderRadius: "100px",
    fontWeight: 700, fontSize: "14px", cursor: "pointer",
    letterSpacing: "-0.01em", overflow: "hidden", whiteSpace: "nowrap",
    transition: "background 0.3s, box-shadow 0.3s",
  };

  const styles = variant === "primary"
    ? { ...base, padding: "14px 32px", background: "#fff", color: "#000", boxShadow: "0 0 20px rgba(255,255,255,0.15), 0 0 60px rgba(99,102,241,0.1)" }
    : { ...base, padding: "13px 30px", background: "transparent", color: "#e5e5e5", border: "1px solid rgba(255,255,255,0.15)" };

  const inner = (
    <motion.span
      ref={ref}
      style={{ x: springX, y: springY, display: "inline-flex", alignItems: "center", gap: "8px" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {variant === "primary" ? (
        <>
          <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
          {/* shimmer sweep */}
          <motion.span
            style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)", backgroundSize: "200% 100%", backgroundPosition: "-100% 0" }}
            whileHover={{ backgroundPosition: ["200% 0", "-100% 0"] }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </>
      ) : (
        <>
          <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
          {/* border shimmer */}
          <motion.span
            style={{ position: "absolute", inset: -1, borderRadius: "100px", background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.5), transparent)", backgroundSize: "200% 100%", backgroundPosition: "-100% 0", pointerEvents: "none" }}
            whileHover={{ backgroundPosition: ["200% 0", "-100% 0"] }}
            transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
          />
        </>
      )}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} style={styles} className={className}>
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} style={styles} className={className}>
      {inner}
    </button>
  );
}
