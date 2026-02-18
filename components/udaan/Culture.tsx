"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const diffs = [
  { old: "Most programs teach AI tools.",       udaan: "We focus on building AI ventures." },
  { old: "Most communities reward attendance.", udaan: "We reward contribution." },
  { old: "Most platforms stop at education.",   udaan: "We begin at execution." },
];

const pillars = [
  {
    icon: "✦",
    title: "Ideas get refined.",
    desc: "If you have an idea, the network sharpens it. No idea dies in a vacuum.",
    color: "rgba(91,75,236,0.08)",
    border: "rgba(91,75,236,0.12)",
    iconColor: "var(--v)",
  },
  {
    icon: "◈",
    title: "Skills get matched.",
    desc: "What you bring finds where it is needed. Collaboration is the default mode.",
    color: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.12)",
    iconColor: "var(--amber)",
  },
  {
    icon: "↑",
    title: "Traction gets amplified.",
    desc: "When you get momentum, the community becomes your multiplier.",
    color: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.12)",
    iconColor: "var(--green)",
  },
];

function DiffRow({ old: o, udaan: u, i }: { old: string; udaan: string; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease }}
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
    >
      {/* Old */}
      <motion.div
        whileHover={{ x: -4, backgroundColor: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.22)" }}
        transition={{ duration: 0.2 }}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 20px", borderRadius: 14, cursor: "default",
          background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)",
        }}
      >
        <span style={{ color: "var(--red)", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>✕</span>
        <span style={{ fontSize: "14px", color: "var(--sub)", textDecoration: "line-through", textDecorationColor: "rgba(239,68,68,0.3)" }}>{o}</span>
      </motion.div>
      {/* Udaan */}
      <motion.div
        whileHover={{ x: 4, backgroundColor: "rgba(91,75,236,0.1)", borderColor: "rgba(91,75,236,0.25)" }}
        transition={{ duration: 0.2 }}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 20px", borderRadius: 14, cursor: "default",
          background: "rgba(91,75,236,0.05)", border: "1px solid rgba(91,75,236,0.12)",
        }}
      >
        <motion.span
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.18 }}
          style={{
            width: 18, height: 18, borderRadius: "50%", background: "var(--vbg2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px", color: "var(--v)", fontWeight: 700, flexShrink: 0,
          }}
        >✓</motion.span>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{u}</span>
      </motion.div>
    </motion.div>
  );
}

function Pillar({ icon, title, desc, color, border, iconColor, i }: {
  icon: string; title: string; desc: string;
  color: string; border: string; iconColor: string; i: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(91,75,236,0.12)" }}
      transition={{ duration: 0.65, delay: i * 0.1, ease }}
      className="surface"
      style={{ padding: 28, cursor: "default" }}
    >
      <motion.div
        whileHover={{ scale: 1.12, rotate: 6 }}
        transition={{ duration: 0.22 }}
        style={{
          width: 44, height: 44, borderRadius: 14,
          background: color, border: `1px solid ${border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", fontWeight: 800, color: iconColor, marginBottom: 18,
        }}
      >
        {icon}
      </motion.div>
      <h4 style={{ fontWeight: 700, fontSize: "16px", color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.02em" }}>{title}</h4>
      <p style={{ fontSize: "13px", lineHeight: 1.65, color: "var(--sub)" }}>{desc}</p>
    </motion.div>
  );
}

export default function Culture() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="community" style={{ background: "var(--bg)", padding: "120px 0" }}>
      <div className="wrap">

        {/* ── What makes this different ── */}
        <div style={{ marginBottom: 100 }}>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            style={{ marginBottom: 48 }}
          >
            <h2 className="t-section" style={{ color: "var(--ink)", maxWidth: 680 }}>
              We don&apos;t promise shortcuts.{" "}
              <span className="grad-v">We build founders.</span>
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {diffs.map(({ old, udaan }, i) => (
              <DiffRow key={i} old={old} udaan={udaan} i={i} />
            ))}
          </div>

          {/* Disclaimer strip */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ease }}
            style={{
              padding: "20px 24px",
              background: "var(--bg2)",
              border: "1px solid var(--line)",
              borderRadius: 16,
              display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center",
            }}
          >
            {[
              "We do not promise overnight income.",
              "We do not guarantee outcomes.",
              "We do not sell shortcuts.",
            ].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: "var(--vbg)", border: "1px solid rgba(91,75,236,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                    <circle cx="3.5" cy="3.5" r="3" stroke="var(--v)" strokeWidth="0.8"/>
                    <path d="M2 3.5l1 1 2-2" stroke="var(--v)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: "13px", color: "var(--sub)" }}>{t}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Culture pillars ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            style={{ marginBottom: 48 }}
          >
            <h2 className="t-section" style={{ color: "var(--ink)", maxWidth: 720 }}>
              Collaboration compounds{" "}
              <span className="grad-v">faster than competition.</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {pillars.map(({ icon, title, desc, color, border, iconColor }, i) => (
              <Pillar key={title} icon={icon} title={title} desc={desc} color={color} border={border} iconColor={iconColor} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
