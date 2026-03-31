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
    title: "Ideas get refined.",
    desc: "If you have an idea, the network sharpens it. No idea dies in a vacuum.",
  },
  {
    title: "Skills get matched.",
    desc: "What you bring finds where it is needed. Collaboration is the default mode.",
  },
  {
    title: "Traction gets amplified.",
    desc: "When you get momentum, the community becomes your multiplier.",
  },
];

function DiffRow({ old: o, udaan: u, i }: { old: string; udaan: string; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className="udaan-culture-diff-row"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease }}
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
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/></svg>
        <span style={{ fontSize: "14px", color: "#999", textDecoration: "line-through", textDecorationColor: "rgba(239,68,68,0.3)" }}>{o}</span>
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
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1 5 3.5 7.5 9 2" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>{u}</span>
      </motion.div>
    </motion.div>
  );
}

function Pillar({ title, desc, i }: { title: string; desc: string; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
      style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 18, padding: 28, cursor: "default" }}
    >
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#111", marginBottom: 18 }} />
      <h4 style={{ fontWeight: 700, fontSize: "16px", color: "#111", marginBottom: 8, letterSpacing: "-0.02em" }}>{title}</h4>
      <p style={{ fontSize: "13px", lineHeight: 1.65, color: "#666" }}>{desc}</p>
    </motion.div>
  );
}

export default function Culture() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="community" style={{ background: "#fafafa", padding: "120px 0" }}>
      <div className="wrap">

        {/* ── What makes this different ── */}
        <div style={{ marginBottom: 100 }}>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
            style={{ marginBottom: 48 }}
          >
            <h2 style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.08, color: "#111", maxWidth: 680 }}>
              We don&apos;t promise shortcuts.{" "}
              <span style={{ color: "#888" }}>We build founders.</span>
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
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            style={{
              padding: "20px 24px",
              background: "#f5f5f5",
              border: "1px solid #ebebeb",
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
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#111", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: "#666" }}>{t}</span>
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
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            style={{ marginBottom: 48 }}
          >
            <h2 style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.08, color: "#111", maxWidth: 720 }}>
              Collaboration compounds{" "}
              <span style={{ color: "#888" }}>faster than competition.</span>
            </h2>
          </motion.div>

          <div className="udaan-culture-pillars">
            {pillars.map(({ title, desc }, i) => (
              <Pillar key={title} title={title} desc={desc} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
