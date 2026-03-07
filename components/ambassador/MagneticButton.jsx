"use client";
import { useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function MagneticButton({ children, onClick, variant = "primary", href, className = "", style: extStyle = {} }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 14, stiffness: 160, mass: 0.08 });
  const springY = useSpring(y, { damping: 14, stiffness: 160, mass: 0.08 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
    if (dist < 110) {
      x.set((e.clientX - cx) * 0.28);
      y.set((e.clientY - cy) * 0.28);
    }
  };

  const onLeave = () => { x.set(0); y.set(0); setHovered(false); };
  const onEnter = () => setHovered(true);

  const isPrimary = variant === "primary";

  const base = {
    position: "relative", display: "inline-flex", alignItems: "center",
    justifyContent: "center", gap: "7px", borderRadius: "100px",
    fontWeight: 700, fontSize: "14px", cursor: "pointer",
    letterSpacing: "-0.01em", overflow: "hidden", whiteSpace: "nowrap",
    border: "none", outline: "none", transition: "box-shadow 0.3s ease, background 0.3s ease",
    fontFamily: "inherit",
  };

  const styles = isPrimary
    ? {
        ...base,
        padding: "13px 28px",
        background: hovered ? "#5254cc" : "#6366f1",
        color: "#ffffff",
        boxShadow: hovered
          ? "0 8px 32px rgba(99,102,241,0.5), 0 2px 8px rgba(99,102,241,0.3)"
          : "0 4px 20px rgba(99,102,241,0.35)",
        ...extStyle,
      }
    : {
        ...base,
        padding: "12px 26px",
        background: hovered ? "rgba(99,102,241,0.06)" : "transparent",
        color: "#6366f1",
        border: "1.5px solid rgba(99,102,241,0.3)",
        boxShadow: hovered ? "0 4px 20px rgba(99,102,241,0.1)" : "none",
        ...extStyle,
      };

  const inner = (
    <motion.span
      ref={ref}
      style={{ x: springX, y: springY, display: "inline-flex", alignItems: "center", gap: "7px" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
    >
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      {isPrimary && (
        <motion.span
          initial={{ x: "-100%", opacity: 0 }}
          animate={hovered ? { x: "100%", opacity: 1 } : { x: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%)",
            pointerEvents: "none",
          }}
        />
      )}
    </motion.span>
  );

  if (href) return <a href={href} style={styles} className={className}>{inner}</a>;
  return <button onClick={onClick} style={styles} className={className}>{inner}</button>;
}
