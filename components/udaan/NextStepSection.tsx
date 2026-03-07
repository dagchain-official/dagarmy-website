"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

export default function NextStepSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const paths = [
    {
      label: "Build",
      title: "If you are ready to build an AI Startup Prototype and test it with real users:",
      action: "Apply for the Udaan Cohort.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
      ),
    },
    {
      label: "Earn",
      title: "If you are prepared to earn rank through contribution:",
      action: "Enter the Founder Track.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
      ),
    },
    {
      label: "Contribute",
      title: "If you want to contribute to the 1 Lakh Founder Mission through measurable work:",
      action: "Start Your Application Today.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      ),
    },
  ];

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "80px 0 72px 0", position: "relative" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>

        {/* HEADER */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0)} style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 700, color: "#0c0c14", marginBottom: 16, letterSpacing: "-0.01em" }}>
            Your Next Step Into the <span style={{ color: "#6366f1" }}>AI Startup Ecosystem</span>
          </h2>
          <div style={{ width: 60, height: 4, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", margin: "0 auto 24px auto", borderRadius: 2 }} />

          <p style={{ fontSize: "16px", color: "#374151", lineHeight: 1.6, maxWidth: 700, margin: "0 auto" }}>
            You have seen the ranks. You understand the pathway. <strong style={{ color: "#0c0c14" }}>The difference between learning and building is now clear.</strong>
          </p>
        </motion.div>

        {/* COMPACT CONTEXT — single unified block */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.15)} style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 14, padding: "28px 32px", marginBottom: 40 }}>
          <div className="nextstep-context-grid">
            <p style={{ fontSize: "14.5px", color: "#374151", lineHeight: 1.65, margin: 0 }}>
              <strong style={{ color: "#0c0c14" }}>Udaan is not an information layer.</strong> It is a structured entry into a disciplined AI Startup Ecosystem built for founders who intend to launch, validate, and scale responsibly.
            </p>
            <div className="nextstep-context-divider" />
            <p style={{ fontSize: "14.5px", color: "#374151", lineHeight: 1.65, margin: 0 }}>
              Each cohort follows a defined <strong style={{ color: "#0c0c14" }}>Builder Selection Process</strong>. Seats are limited to preserve focus, execution depth, and serious peer collaboration.
            </p>
          </div>
        </motion.div>

        {/* INTENTION BECOMES EXECUTION */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.25)} style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontSize: "18px", fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontWeight: 700, fontStyle: "italic", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            This is where intention becomes execution.
          </p>
        </motion.div>

        {/* 3 COMPACT ACTION ROWS */}
        <div className="nextstep-actions-grid" style={{ marginBottom: 48 }}>
          {paths.map((path, idx) => (
            <motion.div
              key={idx}
              initial="initial"
              animate={inView ? "animate" : "initial"}
              variants={fadeUp(0.3 + idx * 0.1)}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className="nextstep-action-card"
              style={{
                background: "#ffffff",
                border: hoveredCard === idx ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(0,0,0,0.06)",
                borderRadius: 14,
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                boxShadow: hoveredCard === idx ? "0 8px 28px rgba(99,102,241,0.08)" : "0 4px 16px rgba(0,0,0,0.03)",
                transform: hoveredCard === idx ? "translateY(-3px)" : "none",
                transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer"
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", opacity: hoveredCard === idx ? 1 : 0, transition: "opacity 0.4s ease" }} />

              {/* Top row: badge + description */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(99, 102, 241, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", flexShrink: 0 }}>
                  {path.icon}
                </div>
                <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
                  {path.title}
                </p>
              </div>

              {/* Action link */}
              <div style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 8, color: "#6366f1", fontWeight: 700, fontSize: "14.5px", paddingLeft: 52 }}>
                {path.action}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.3s ease", transform: hoveredCard === idx ? "translateX(4px)" : "none" }}>
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FINAL CLOSING */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.7)} style={{ textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: -24, left: "20%", right: "20%", height: 1, background: "linear-gradient(to right, transparent, rgba(229,231,235,0.7), transparent)" }} />

          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "20px 44px", borderRadius: 32, border: "1px solid rgba(99,102,241,0.1)", background: "linear-gradient(135deg, rgba(99,102,241,0.03), rgba(139,92,246,0.03))" }}>
            <p style={{ fontSize: "15px", color: "#0c0c14", lineHeight: 1.7, margin: 0, textAlign: "center", fontWeight: 700 }}>
              The ecosystem is structured.
            </p>
            <p style={{ fontSize: "15px", color: "#0c0c14", lineHeight: 1.7, margin: 0, textAlign: "center", fontWeight: 700 }}>
              Execution is expected.
            </p>
            <p style={{ fontSize: "15px", margin: 0, textAlign: "center", fontWeight: 700, color: "#6366f1" }}>
              The decision is yours.
            </p>
          </div>
        </motion.div>

      </div>

      <style jsx>{`
        .nextstep-context-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 28px;
          align-items: center;
        }
        .nextstep-context-divider {
          width: 1px;
          height: 100%;
          min-height: 40px;
          background: linear-gradient(to bottom, transparent, #d1d5db, transparent);
        }
        @media (max-width: 700px) {
          .nextstep-context-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .nextstep-context-divider {
            display: none;
          }
        }
        .nextstep-actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 820px) {
          .nextstep-actions-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        .nextstep-action-card:hover .nextstep-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}
