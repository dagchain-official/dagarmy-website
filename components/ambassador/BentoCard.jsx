"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function BentoCard({ children, className = "", glowColor = "rgba(99,102,241,0.3)", style = {} }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-6deg", "6deg"]);

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
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
        borderRadius: "20px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid",
        borderImageSlice: 1,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        overflow: "hidden",
        ...style,
      }}
      className={className}
      whileHover={{ boxShadow: `0 0 40px ${glowColor}, 0 20px 60px rgba(0,0,0,0.5)` }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient border */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "20px", padding: "1px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.08) 100%)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor", maskComposite: "exclude",
        pointerEvents: "none",
      }} />

      {/* Border beam on hover */}
      <motion.div
        style={{
          position: "absolute", inset: 0, borderRadius: "20px",
          background: `radial-gradient(300px circle at ${mx}px ${my}px, rgba(99,102,241,0.12), transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Noise texture layer */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "20px",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.025, pointerEvents: "none",
      }} />

      {/* Content — translateZ for depth */}
      <div style={{ position: "relative", zIndex: 1, transform: "translateZ(30px)", height: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
}
