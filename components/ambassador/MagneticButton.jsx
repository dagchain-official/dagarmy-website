"use client";
import { useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function MagneticButton({ children, onClick, variant = "primary", href, className = "", style: extStyle = {} }) {
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
      x.set((e.clientX - cx) * 0.3);
      y.set((e.clientY - cy) * 0.3);
    }
  };

  const onLeave = () => { x.set(0); y.set(0); };

  const base = {
    position: "relative", display: "inline-flex", alignItems: "center",
    justifyContent: "center", gap: "8px", borderRadius: "100px",
    fontWeight: 700, fontSize: "14px", cursor: "pointer",
    letterSpacing: "-0.01em", overflow: "hidden", whiteSpace: "nowrap",
    border: "none", transition: "all 0.25s ease",
  };

  const styles = variant === "primary"
    ? { ...base, padding: "13px 28px", background: "#6366f1", color: "#ffffff", boxShadow: "0 4px 20px rgba(99,102,241,0.35)", ...extStyle }
    : { ...base, padding: "12px 26px", background: "transparent", color: "#6366f1", border: "1.5px solid rgba(99,102,241,0.35)", ...extStyle };

  const inner = (
    <motion.span
      ref={ref}
      style={{ x: springX, y: springY, display: "inline-flex", alignItems: "center", gap: "8px" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      {variant === "primary" && (
        <motion.span
          style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)", backgroundSize: "200% 100%", backgroundPosition: "-100% 0" }}
          whileHover={{ backgroundPosition: ["200% 0", "-100% 0"] }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}
    </motion.span>
  );

  if (href) return <a href={href} style={styles} className={className}>{inner}</a>;
  return <button onClick={onClick} style={styles} className={className}>{inner}</button>;
}
