"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const regions = [
  {
    id: "india",
    code: "IN",
    flag: "IN",
    label: "India",
    title: "From IT powerhouse to AI startup nation.",
    subtitle: "Freelancer → Founder",
    color: "#5b4bec",
    emotion: "The world's largest democracy is writing its greatest chapter yet - not in boardrooms abroad, but in co-working spaces in Pune, Hyderabad, and Jaipur. AI is the new infrastructure.",
    stat: "680M+",
    statLabel: "Internet users by 2025",
    cities: ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Jaipur"],
    quote: '"AI entrepreneurship defining the next chapter of economic leadership."',
    ctaLabel: "Join from India",
    accent: "#5b4bec",
  },
  {
    id: "pakistan",
    code: "PK",
    flag: "PK",
    label: "Pakistan",
    title: "The next Silicon Valley is being written in Urdu.",
    subtitle: "Talent → Capital",
    color: "#10b981",
    emotion: "Pakistan's developer talent is world-class. What it needs is direction and ownership. Udaan Pakistan converts skills into equity-building ventures with cross-border reach.",
    stat: "220M+",
    statLabel: "Population, 65% under 30",
    cities: ["Lahore", "Karachi", "Islamabad", "Peshawar", "Faisalabad"],
    quote: '"Pakistan has the hunger. Udaan gives it the structure."',
    ctaLabel: "Join from Pakistan",
    accent: "#10b981",
  },
  {
    id: "bangladesh",
    code: "BD",
    flag: "BD",
    label: "Bangladesh",
    title: "The rising tiger is going digital.",
    subtitle: "Skill → Startup",
    color: "#f59e0b",
    emotion: "Bangladesh's rise in global tech outsourcing is a foundation - not a ceiling. Dhaka's next generation isn't freelancing. They're founding.",
    stat: "170M+",
    statLabel: "Population, fastest growing economy",
    cities: ["Dhaka", "Chittagong", "Sylhet", "Rajshahi"],
    quote: '"Bangladesh is not behind. It is next."',
    ctaLabel: "Join from Bangladesh",
    accent: "#f59e0b",
  },
];

export default function RegionalSwitcher() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const r = regions[active];

  return (
    <section ref={ref} style={{ background: "#fff", padding: "120px 0" }}>
      <div className="wrap">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 56 }}
        >
          <h2 style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.08, color: "#111" }}>
            One movement.{" "}
            <span style={{ color: "#888" }}>Three nations.</span>
          </h2>
        </motion.div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 40, padding: "6px", background: "#f5f5f5", borderRadius: 999, width: "fit-content", border: "1px solid #ebebeb" }}>
          {regions.map((reg, i) => (
            <button
              key={reg.id}
              onClick={() => setActive(i)}
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "-0.01em",
                transition: "all 0.2s",
                background: active === i ? "#fff" : "transparent",
                color: active === i ? "#111" : "#888",
                boxShadow: active === i ? "0 1px 8px rgba(10,10,15,0.08)" : "none",
              }}
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
              {/* Left */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa" }}>{r.code} - {r.label}</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: r.accent, marginBottom: 12 }}>{r.subtitle}</div>
                <h3 style={{ fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#111", marginBottom: 20, maxWidth: 440 }}>{r.title}</h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.75, maxWidth: 420, marginBottom: 32 }}>{r.emotion}</p>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: "45px", fontWeight: 900, letterSpacing: "-0.05em", color: r.accent, lineHeight: 1 }}>{r.stat}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: 4, fontWeight: 500 }}>{r.statLabel}</div>
                </div>

                <button onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))} className="btn btn-ink" style={{ cursor: "pointer" }}>{r.ctaLabel} →</button>
              </div>

              {/* Right card */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Cities */}
                <div style={{ padding: 24, background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 16 }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999", marginBottom: 14 }}>Active Cities</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {r.cities.map(c => (
                      <div key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: r.accent, display: "inline-block" }} />
                        <span style={{ fontSize: "13px", color: "#111", fontWeight: 600 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div style={{ background: "#111", borderRadius: 16, padding: 28 }}>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.55, marginBottom: 16 }}>
                    {r.quote}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{r.code}</div>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Udaan {r.label} Chapter</span>
                  </div>
                </div>

                {/* Bottom note */}
                <div style={{ padding: "14px 20px", background: "#f5f5f5", borderRadius: 14, border: "1px solid #ebebeb", textAlign: "center" }}>
                  <span style={{ fontSize: "12px", color: "#aaa" }}>Different contexts. </span>
                  <strong style={{ fontSize: "12px", color: "#111" }}>Same standard of execution.</strong>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
