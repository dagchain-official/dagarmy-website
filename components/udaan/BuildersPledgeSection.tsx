"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function BuildersPledgeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#ffffff",
        paddingTop: 80,
        paddingBottom: 100,
      }}
    >
      <div className="wrap udaan-pledge-wrap" style={{ position: "relative", zIndex: 1, margin: "0 auto", padding: "0 24px" }}>

        {/* Section Header */}
        <motion.div
          initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0)}
          style={{ marginBottom: 40, textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 44px)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "#0c0c14",
              marginBottom: 0,
            }}
          >
            Builder's Pledge
          </h2>
          <div style={{ width: 60, height: 4, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", margin: "20px auto 0 auto", borderRadius: 2 }} />
        </motion.div>

        {/* The "Every member enters..." Subheading sequence */}
        <motion.div
          initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.1)}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <p style={{ fontSize: "15px", color: "#5a5a72", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20 }}>
            Every member enters with a simple commitment:
          </p>
          <p style={{ fontSize: "20px", fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontWeight: 700, color: "#0c0c14", margin: 0, lineHeight: 1.4 }}>
            I will build. I will support others.<br />I will not wait for opportunity. <span style={{ color: "#6366f1" }}>I will create it.</span>
          </p>
        </motion.div>

        {/* Full Pledge Card */}
        <motion.div
          initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.2)}
          style={{
            maxWidth: 700,
            margin: "0 auto 40px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            padding: "2px",
            borderRadius: 16,
            boxShadow: "0 12px 32px rgba(99,102,241,0.12)",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 14,
              padding: "40px 48px",
            }}
          >
            {/* Header Section: Centered Logo + DAGARMY */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e5e5e5" }}>
              <img src="/images/logo/logo.png" alt="DAG Army Logo" style={{ width: 32, height: 32, objectFit: "contain" }} />
              <div style={{ fontFamily: "'Nasalization', 'Arial Black', sans-serif", fontSize: "20px", fontWeight: 700, letterSpacing: "0.05em", color: "#0c0c14", textTransform: "uppercase" }}>DAGARMY</div>
            </div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#374151", marginBottom: 16, fontWeight: 500 }}>I understand that learning is not the same as building.</p>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#374151", marginBottom: 16, fontWeight: 500 }}>I may begin as a learner, but I do not intend to stay there. I choose to take responsibility for what I create.</p>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#374151", marginBottom: 16, fontWeight: 500 }}>I will move beyond ideas and turn them into working solutions. I will test them with real people. I will improve them when they fail. I will not hide behind research or endless preparation.</p>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#374151", marginBottom: 16, fontWeight: 500 }}>I accept that being a founder requires discipline. It requires honesty about results. It requires consistency when motivation fades.</p>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#374151", marginBottom: 24, fontWeight: 500 }}>I will not make fake claims. I will not chase shortcuts. I will earn progress through contribution.</p>
              <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#0c0c14", marginBottom: 24, fontWeight: 700 }}>I will support other builders, because no one truly builds alone.</p>
            </div>

            {/* Final Commitment Declaration */}
            <div style={{ textAlign: "center", paddingTop: 24, borderTop: "1px solid #e5e5e5" }}>
              <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#0c0c14", fontWeight: 700, marginBottom: 8 }}>
                This is my <span style={{ color: "#6366f1" }}>AI Builder Commitment</span>.
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#0c0c14", fontWeight: 700, marginBottom: 0 }}>
                This is my step into the <span style={{ color: "#6366f1" }}>Founder Track</span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bare Button & Subtext */}
        <motion.div
          initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.3)}
          style={{ textAlign: "center" }}
        >
          <p style={{ color: "#5a5a72", fontSize: "14px", marginBottom: 20, fontWeight: 600 }}>
            This is not symbolic. It defines the culture.
          </p>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-pledge"))}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#ffffff",
              padding: "16px 40px",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: 40,
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.3)";
            }}
          >
            Take the Pledge
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
