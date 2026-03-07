"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FloatingShapesBg } from "@/components/ui/floating-shapes-bg";
import { UdaanParticleAnimation } from "@/components/ui/udaan-particle-animation";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#ffffff",
        paddingTop: 40,
        paddingBottom: 40,
        overflow: "hidden",
        minHeight: "calc(100vh - 80px)",
        maxHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Floating shapes background */}
      <FloatingShapesBg color="#6366f1" opacity={0.4} />

      {/* Subtle grid overlay - very light grey */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      {/* Optional soft radial fade using warm grey */}
      <div 
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100,100,100,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="wrap" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 80, alignItems: "center", maxWidth: "100%" }}>

          {/* ── Left Column: Content ── */}
          <div>
            {/* Heading - Split into two lines */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease }}
              style={{ marginBottom: 24 }}
            >
              {/* Identity Label */}
              <div
                style={{
                  fontFamily: "Nasalization, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(50px, 2vw, 68px)",
                  letterSpacing: "0.02em",
                  color: "#000000ff",
                  marginBottom: 8,
                }}
              >
                UDAAN:
              </div>
              {/* Main Headline */}
              <h1
                style={{
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontWeight: 800,
                  fontSize: "clamp(40px, 5vw, 62px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "#0c0c14",
                  marginBottom: 0,
                }}
              >
                Where AI Builders Rise
              </h1>
            </motion.div>

            {/* Vision Statement - 100,000 dominant */}
            <motion.div
              {...fadeUp(0.2)}
              style={{ marginBottom: 24 }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                    fontWeight: 800,
                    fontSize: "clamp(28px, 5vw, 32px)",
                    lineHeight: 1,
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.02em",
                  }}
                >
                  100,000
                </span>
                <span
                  style={{
                    fontSize: "clamp(16px, 1.5vw, 20px)",
                    fontWeight: 600,
                    color: "#0c0c14",
                    lineHeight: 1.4,
                  }}
                >
                  AI startup founders by 2030.
                </span>
              </div>
              <p style={{
                  fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#5a5a72",
                marginBottom: 0,
              }}>
                Rank through contribution inside a disciplined AI startup ecosystem.
              </p>
            </motion.div>

            {/* Description Block - Structured readable format */}
            <motion.div
              {...fadeUp(0.35)}
              style={{ marginBottom: 28 }}
            >
              <p style={{
                  fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#5a5a72",
                marginBottom: 12,
              }}>
                Artificial Intelligence is reshaping ownership, opportunity, and execution.
                <br />
                The question is not whether AI will define the future.
                <br />
                The question is <strong style={{ fontWeight: 700, color: "#0c0c14" }}>who will build within it.</strong>
              </p>
              <p style={{
                  fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#5a5a72",
                marginBottom: 12,
              }}>
                DAG Army is a structured AI Startup Ecosystem built for serious startup execution.
                <br />
                Here, <strong style={{ fontWeight: 700, color: "#0c0c14" }}>rank is earned through contribution.</strong>
                <br />
                Soldiers prepare. Lieutenants build.
              </p>
              <p style={{
                  fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#5a5a72",
                marginBottom: 0,
              }}>
                This is the runway for those who choose <strong style={{ fontWeight: 700, color: "#0c0c14" }}>action over observation.</strong>
              </p>
            </motion.div>

            {/* CTA Buttons - Black & White Professional */}
            <motion.div
              {...fadeUp(0.5)}
              style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 32 }}
            >
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))}
                style={{
                  padding: "16px 36px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "#000000",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(0, 0, 0, 0.25)";
                  e.currentTarget.style.background = "#1a1a1a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.15)";
                  e.currentTarget.style.background = "#000000";
                }}
              >
                Enter as a Soldier
              </button>
              <button
                onClick={() => {
                  const heroSection = document.querySelector('section');
                  if (heroSection && heroSection.nextElementSibling) {
                    heroSection.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  padding: "16px 36px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "#ffffff",
                  color: "#000000",
                  border: "2px solid #000000",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#000000";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.color = "#000000";
                }}
              >
                Explore More
              </button>
            </motion.div>

            {/* Stats Strip - Minimal stat blocks */}
            <motion.div {...fadeUp(0.65)}>
              <div style={{ height: 1, background: "rgba(99, 102, 241, 0.15)", marginBottom: 20 }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                {[
                  { n: "2,400+", l: "Active Builders" },
                  { n: "3", l: "Nations Unified" },
                  { n: "Contribution-Based", l: "Ranking" },
                  { n: "1M+", l: "Jobs Targeted" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      letterSpacing: "-0.01em",
                      color: "#000000",
                      lineHeight: 1,
                      marginBottom: 6,
                    }}>
                      {stat.n}
                    </div>
                    <div style={{
                      fontSize: "11px",
                      color: "#000000",
                      fontWeight: 600,
                      lineHeight: 1.3,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>
                      {stat.l}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right Column: Subtle AI Visualization ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 480,
                height: 480,
                background: "transparent",
                borderRadius: 24,
                padding: 16,
                boxShadow: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <UdaanParticleAnimation
                width={448}
                height={448}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
