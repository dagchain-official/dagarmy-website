"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

export default function UdaanCodeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activePolicy, setActivePolicy] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePolicy((p) => (p + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const policies = [
    {
      title: "No Toxicity Policy",
      items: ["No mocking beginners.", "No ego-driven behavior.", "No aggressive selling."],
    },
    {
      title: "Zero Politics",
      items: ["No religious debate.", "No ideological conflict.", "The focus remains on building and validation."],
    },
    {
      title: "No Fake Claims",
      items: ["No inflated traction.", "No fabricated case studies.", "No misleading income narratives."],
    },
  ];

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "72px 0", position: "relative" }}>
      <div className="wrap" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        {/* HEADER */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0)} style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, color: "#0c0c14", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Udaan Code – Constitution in Action
          </h2>
          <div style={{ width: 40, height: 3, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", margin: "0 auto", borderRadius: 2 }} />
        </motion.div>

        {/* INTRODUCTION */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.1)} style={{ marginBottom: 32 }}>
          <p style={{ fontSize: "15.5px", color: "#374151", lineHeight: 1.5, textAlign: "center", marginBottom: 16, fontWeight: 500 }}>
            Udaan operates under defined Community Governance. Growth is structured. Standards are protected.
          </p>
          <p style={{ fontSize: "14.5px", color: "#5a5a72", lineHeight: 1.6, textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
            The Constitution exists to ensure that speed does not dilute discipline. Every participant enters a system grounded in Builder Discipline, where action carries weight and integrity carries consequence.
          </p>
        </motion.div>

        {/* FRAMING STATEMENT */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.2)} style={{ position: "relative", background: "linear-gradient(to right, rgba(99,102,241,0.04), transparent)", padding: "24px 32px", borderRadius: 12, borderLeft: "4px solid #6366f1", marginBottom: 48, maxWidth: 860, margin: "0 auto 48px" }}>
          <p style={{ fontSize: "15px", color: "#0c0c14", fontWeight: 600, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
            "Discipline is not a restriction; it is an armor. It exists to protect credibility, foster builder trust, and guarantee ecosystem integrity against noise."
          </p>
        </motion.div>

        {/* NON-NEGOTIABLES & CONTRIBUTION FIRST (2 Columns) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, alignItems: "stretch" }}>

          {/* LEFT: NON-NEGOTIABLES */}
          <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.3)} onMouseEnter={() => setHoveredCard(0)} onMouseLeave={() => setHoveredCard(null)} style={{ background: "#ffffff", border: hoveredCard === 0 ? "2px solid #6366f1" : "1px solid #e5e7eb", borderRadius: 16, padding: "32px 28px", display: "flex", flexDirection: "column", boxShadow: hoveredCard === 0 ? "0 12px 32px rgba(99,102,241,0.08)" : "0 2px 12px rgba(0,0,0,0.02)", transform: hoveredCard === 0 ? "translateY(-2px)" : "none", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}>
            {/* Top Accent Line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", opacity: hoveredCard === 0 ? 1 : 0, transition: "opacity 0.3s ease" }} />

            <h3 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontSize: "24px", fontWeight: 700, color: "#0c0c14", marginBottom: 12 }}>
              Non-Negotiables
            </h3>
            <p style={{ fontSize: "14px", color: "#5a5a72", marginBottom: 28, lineHeight: 1.5 }}>
              To maintain an <strong style={{ color: "#0c0c14", fontWeight: 800 }}>Ethical Startup Culture</strong>, the following are enforced.
            </p>

            {/* SLIDER / FADE */}
            <div style={{ flex: 1, position: "relative", minHeight: 140 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                {policies.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePolicy(i)}
                    aria-label={`View policy ${i + 1}`}
                    style={{
                      height: 4, flex: 1, background: activePolicy === i ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#eae0f9",
                      borderRadius: 2, border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0
                    }}
                  />
                ))}
              </div>
              <div style={{ position: "relative", overflow: "hidden", minHeight: 120 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePolicy}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <h4 style={{ fontSize: "16px", fontWeight: 800, background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 14 }}>{policies[activePolicy].title}</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {policies[activePolicy].items.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ width: 5, height: 5, background: "#0c0c14", borderRadius: "50%", marginTop: 7, flexShrink: 0 }} />
                          <span style={{ fontSize: "14px", color: "#374151", lineHeight: 1.5, fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Static statement */}
            <div style={{ marginTop: 28, background: "rgba(99, 102, 241, 0.04)", border: "1px solid rgba(99, 102, 241, 0.1)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#4f46e5" }}>Trust is treated as an operational asset.</span>
            </div>
          </motion.div>

          {/* RIGHT: CONTRIBUTION FIRST */}
          <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.4)} onMouseEnter={() => setHoveredCard(1)} onMouseLeave={() => setHoveredCard(null)} style={{ background: "#ffffff", border: hoveredCard === 1 ? "2px solid #6366f1" : "1px solid #e5e7eb", borderRadius: 16, padding: "32px 28px", display: "flex", flexDirection: "column", boxShadow: hoveredCard === 1 ? "0 12px 32px rgba(99,102,241,0.08)" : "0 2px 12px rgba(0,0,0,0.02)", transform: hoveredCard === 1 ? "translateY(-2px)" : "none", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}>
            {/* Top Accent Line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", opacity: hoveredCard === 1 ? 1 : 0, transition: "opacity 0.3s ease" }} />

            <h3 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontSize: "24px", fontWeight: 700, color: "#0c0c14", marginBottom: 12 }}>
              Contribution First
            </h3>
            <p style={{ fontSize: "14px", color: "#5a5a72", marginBottom: 28, lineHeight: 1.5 }}>
              Advancement follows demonstrated execution.
            </p>

            <p style={{ fontSize: "14.5px", color: "#0c0c14", fontWeight: 800, margin: "0 0 16px 0" }}>
              Recognition comes from:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "auto" }}>
              {["Launching", "Validating", "Mentoring", "Supporting builders"].map((item, i) => (
                <div key={i} className="contrib-item" style={{ background: "rgba(99, 102, 241, 0.03)", border: "1px solid rgba(99, 102, 241, 0.1)", padding: "10px 14px", borderRadius: 8, fontSize: "13px", fontWeight: 700, color: "#0c0c14", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s ease", cursor: "default" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, background: "rgba(243, 244, 246, 0.6)", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 18px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#374151", margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>
                Rank is never transactional. It reflects visible contribution and service.
              </p>
            </div>
          </motion.div>

        </div>

        {/* CLOSING PHILOSOPHY */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.5)} style={{ marginTop: 56, textAlign: "center", paddingTop: 40, position: "relative" }}>
          {/* Subtle Divider */}
          <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 1, background: "linear-gradient(to right, transparent, #e5e7eb, transparent)" }} />

          <p style={{ fontSize: "14.5px", lineHeight: 1.5, color: "#5a5a72", maxWidth: 660, margin: "0 auto 32px" }}>
            This structure positions Udaan as an <strong style={{ color: "#0c0c14", fontWeight: 800 }}>Ethical AI Community</strong> within a <strong style={{ color: "#0c0c14", fontWeight: 800 }}>Responsible Startup Ecosystem</strong>.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 32 }}>
            <div style={{ textAlign: "right", flex: 1 }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "13.5px", color: "#0c0c14", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Fast execution is encouraged.</p>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#5a5a72", fontWeight: 500 }}>Shortcut behavior is not.</p>
            </div>
            <div style={{ width: 1, background: "linear-gradient(to bottom, transparent, #d1d5db, transparent)" }} />
            <div style={{ textAlign: "left", flex: 1 }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "13.5px", color: "#0c0c14", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Discipline protects credibility.</p>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#5a5a72", fontWeight: 500 }}>Credibility compounds impact.</p>
            </div>
          </div>

          <div style={{ display: "inline-block", background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))", padding: "14px 28px", borderRadius: 40, border: "1px solid rgba(99,102,241,0.15)" }}>
            <p style={{ fontSize: "15px", fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontWeight: 700, margin: 0, color: "#0c0c14" }}>
              Builder discipline is the foundation of ecosystem integrity.
            </p>
          </div>
        </motion.div>

      </div>

      <style jsx>{`
        .contrib-item:hover {
          background: #ffffff !important;
          border-color: #6366f1 !important;
          box-shadow: 0 4px 12px rgba(99,102,241,0.1) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
