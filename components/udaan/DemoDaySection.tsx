"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;
const V = "#6366f1";

function Bullet({ text, highlight }: { text: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 2 }}>
      <span style={{ width: highlight ? 6 : 5, height: highlight ? 6 : 5, borderRadius: "50%", background: V, flexShrink: 0, marginTop: highlight ? 6 : 5, transition: "all 0.4s ease" }} />
      <span style={{ fontSize: highlight ? "14px" : "13.5px", color: highlight ? "#0c0c14" : "#374151", lineHeight: 1.5, fontWeight: highlight ? 700 : 500, transition: "all 0.4s ease" }}>{text}</span>
    </div>
  );
}

export default function DemoDaySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const cardRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useEffect(() => {
    if (hoveredCard !== null && cardRefs[hoveredCard]?.current) {
      setTimeout(() => {
        const el = cardRefs[hoveredCard]?.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // If bottom of card is below viewport, scroll down smoothly
        if (rect.bottom > vh - 20) {
          window.scrollBy({ top: rect.bottom - vh + 40, behavior: "smooth" });
        }
        // If top of card is above viewport (e.g. under fixed header), scroll up
        else if (rect.top < 90) {
          window.scrollBy({ top: rect.top - 100, behavior: "smooth" });
        }
      }, 300); // Wait for the smooth expansion transition to conclude
    }
  }, [hoveredCard]);

  const isH = (i: number) => hoveredCard === i;
  const isO = (i: number) => hoveredCard !== null && hoveredCard !== i;

  const secLabel = (text: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, marginTop: 16 }}>
      <span style={{ width: 14, height: 2, background: V, borderRadius: 1 }} />
      <span style={{ fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0c0c14" }}>{text}</span>
    </div>
  );

  const stageBadge = (num: number) => (
    <div style={{ display: "inline-flex", alignItems: "center", marginBottom: 14 }}>
      <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: V }}>STAGE {num}</span>
    </div>
  );

  const card = (i: number): React.CSSProperties => {
    const defaultPad = i === 0 ? "24px 20px" : i === 1 ? "32px 26px" : "40px 32px";
    const hoverPad = i === 0 ? "30px 24px" : i === 1 ? "40px 32px" : "50px 38px";
    return {
      position: "relative", borderRadius: 14, overflow: "hidden",
      background: "#ffffff",
      border: isH(i) ? `2px solid ${V}` : "1px solid #e5e7eb",
      padding: isH(i) ? hoverPad : defaultPad,
      boxShadow: isH(i) ? `0 12px 36px rgba(99,102,241,0.12)` : "0 2px 10px rgba(0,0,0,0.04)",
      transform: isH(i) ? "translateY(-4px)" : isO(i) ? "scale(0.97)" : "none",
      opacity: isO(i) ? 0.45 : 1,
      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
      zIndex: isH(i) ? 20 : 1, cursor: "default",
      display: "flex", flexDirection: "column" as const,
    };
  };

  return (
    <section ref={ref} style={{ position: "relative", background: "#ffffff", paddingTop: 64, paddingBottom: 64 }}>
      <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 1200 }}>

        {/* ═══ Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 40, textAlign: "center" }}
        >
          <h2 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontWeight: 700, fontSize: "clamp(32px, 3.5vw, 44px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "#0c0c14", marginBottom: 10 }}>
            Road to Demo Day Finals
          </h2>
          <p style={{ fontSize: "18px", fontWeight: 600, color: "#5a5a72", marginBottom: 18, lineHeight: 1.4 }}>
            The prestige of Demo Day comes from filtration, not volume.
          </p>
          <div style={{ maxWidth: 740, margin: "0 auto" }}>
            <p style={{ fontSize: "15px", lineHeight: 1.7, fontWeight: 600, color: "#374151", marginBottom: 0 }}>
              The <strong style={{ fontWeight: 800, color: "#0c0c14" }}>AI Startup Selection Program</strong> exists to move only proven builders into a curated evaluation environment. It is a structured <strong style={{ fontWeight: 800, color: "#0c0c14" }}>Startup Screening Process</strong> supported by Mentor Review and execution checkpoints.
            </p>
          </div>
        </motion.div>

        {/* ═══ Cards ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15, ease }}
          style={{ display: "grid", gridTemplateColumns: "0.6fr 0.8fr 1fr", gap: 24, alignItems: "start" }}
        >

          {/* ════ CARD 1 — Screening ════ */}
          <div ref={cardRefs[0]} onMouseEnter={() => setHoveredCard(0)} onMouseLeave={() => setHoveredCard(null)} style={card(0)}>
            {stageBadge(1)}
            <h3 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontWeight: 700, fontSize: isH(0) ? "28px" : "22px", lineHeight: 1.2, color: "#0c0c14", marginBottom: 6, transition: "font-size 0.4s ease" }}>Screening</h3>
            <p style={{ fontSize: "13px", lineHeight: 1.55, color: "#5a5a72", marginBottom: 2 }}>Testing thinking clarity and problem depth.</p>

            {secLabel("EVALUATION CRITERIA")}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["AI Problem Solving clarity", "Use case differentiation", "Execution feasibility", "Early revenue or adoption logic"].map(t => (
                <Bullet key={t} text={t} highlight={isH(0)} />
              ))}
            </div>

            <div style={{ paddingTop: 14, marginTop: "auto", borderTop: "1px solid #eee" }}>
              <p style={{ fontSize: "12.5px", lineHeight: 1.55, color: "#374151", marginBottom: 0 }}>
                Filters 1,000+ applicants into a <strong style={{ fontWeight: 800, color: "#0c0c14" }}>Curated Founder Cohort</strong> shortlist.
              </p>
            </div>
          </div>

          {/* ════ CARD 2 — Validation ════ */}
          <div ref={cardRefs[1]} onMouseEnter={() => setHoveredCard(1)} onMouseLeave={() => setHoveredCard(null)} style={card(1)}>
            {stageBadge(2)}
            <h3 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontWeight: 700, fontSize: isH(1) ? "34px" : "27px", lineHeight: 1.2, color: "#0c0c14", marginBottom: 6, transition: "font-size 0.4s ease" }}>Validation & Mentor Review</h3>
            <p style={{ fontSize: "13.5px", lineHeight: 1.55, color: "#5a5a72", marginBottom: 2 }}>Testing proof through real execution.</p>

            {secLabel("EVALUATION CRITERIA")}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                "Functional workflow or AI Startup Prototype", "Documented Market Testing", "Structured AI Product Validation",
                "Clear Problem–Solution Fit Demonstration", "5–10 user validation conversations", "Iteration based on mentor feedback",
              ].map(t => (
                <Bullet key={t} text={t} highlight={isH(1)} />
              ))}
            </div>

            <div style={{ paddingTop: 14, marginTop: "auto", borderTop: "1px solid #eee" }}>
              <p style={{ fontSize: "12.5px", lineHeight: 1.55, color: "#374151", marginBottom: 0 }}>
                Builds investor-grade clarity and <strong style={{ fontWeight: 800, color: "#0c0c14" }}>Startup Funding Readiness</strong>.
              </p>
            </div>
          </div>

          {/* ════ CARD 3 — Demo Day Finals ════ */}
          <div ref={cardRefs[2]} onMouseEnter={() => setHoveredCard(2)} onMouseLeave={() => setHoveredCard(null)} style={card(2)}>
            {stageBadge(3)}
            <h3 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontWeight: 700, fontSize: isH(2) ? "40px" : "32px", lineHeight: 1.2, color: "#0c0c14", marginBottom: 6, transition: "font-size 0.4s ease" }}>Demo Day Finals</h3>
            <p style={{ fontSize: "14px", lineHeight: 1.5, color: "#5a5a72", marginBottom: 2 }}>
              Execution becomes reputation. Limited <strong style={{ color: "#0c0c14", fontWeight: 700 }}>Top 20 Finalists</strong> present perfectly to an independent <strong style={{ color: "#0c0c14", fontWeight: 700 }}>AI Startup Jury</strong>.
            </p>

            {secLabel("EVALUATION CRITERIA")}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {["Problem strength", "Validation depth", "Build quality", "Scalability logic", "Founder capability", "AI Product & Build Quality"].map(t => (
                <Bullet key={t} text={t} highlight={isH(2)} />
              ))}
            </div>

            {secLabel("SELECTED FOUNDERS RECEIVE")}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {["Pre-Seed Grant support", "Direct Investor Exposure", "Continued Mentor Access", "AI Startup Accelerator pathway entry"].map(t => (
                <Bullet key={t} text={t} highlight={isH(2)} />
              ))}
            </div>

            <div style={{ paddingTop: 14, marginTop: "auto", borderTop: "1px solid #eee" }}>
              <p style={{ fontSize: isH(2) ? "14px" : "13.5px", lineHeight: 1.5, color: "#0c0c14", fontWeight: 800, marginBottom: 0, transition: "font-size 0.4s ease" }}>
                Demo Day is not attended. It is{" "}
                <span style={{ background: `linear-gradient(135deg, ${V} 0%, #8b5cf6 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 900 }}>earned</span>.
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
