"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const paths = [
  {
    num: "01",
    condition: "If you are ready to build your AI startup prototype and test it in the market,",
    cta: "Apply for the Udaan Cohort.",
    accent: "#6366f1",
  },
  {
    num: "02",
    condition: "If you are prepared to enter the Founder Track and earn your rank through contribution,",
    cta: "Start Your Application Now.",
    accent: "#8b5cf6",
  },
  {
    num: "03",
    condition: "If you believe you can contribute to the 1 Lakh Founder Mission through real work,",
    cta: "Step Into the Builder Circle.",
    accent: "#a78bfa",
  },
];

function PathCard({ item, index, inView }: { item: typeof paths[0]; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [...ease], delay: 0.5 + index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? "#0c0c14" : "#ffffff",
        border: `1px solid ${hovered ? item.accent : "#e8e8f0"}`,
        borderRadius: 20,
        padding: "40px 36px 36px",
        cursor: "default",
        transition: "background 0.35s ease, border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 60px rgba(99,102,241,0.18), 0 4px 20px rgba(0,0,0,0.12)`
          : "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${item.accent}22 0%, transparent 70%)`,
          transition: "opacity 0.35s ease",
          opacity: hovered ? 1 : 0,
          pointerEvents: "none",
        }}
      />
      {/* Number */}
      <div
        style={{
          fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
          fontSize: 72,
          fontWeight: 900,
          lineHeight: 1,
          color: hovered ? `${item.accent}30` : "#f0f0f8",
          position: "absolute",
          top: 16,
          right: 28,
          transition: "color 0.35s ease",
          userSelect: "none",
        }}
      >
        {item.num}
      </div>
      {/* Pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: hovered ? `${item.accent}20` : "#f4f4ff",
          border: `1px solid ${hovered ? item.accent + "50" : "#e0e0f8"}`,
          borderRadius: 100,
          padding: "4px 14px",
          marginBottom: 24,
          transition: "background 0.35s ease, border-color 0.35s ease",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: item.accent,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: item.accent,
          }}
        >
          Path {item.num}
        </span>
      </div>
      {/* Condition text */}
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: hovered ? "#a0a0c0" : "#5a5a72",
          marginBottom: 28,
          transition: "color 0.35s ease",
        }}
      >
        {item.condition}
      </p>
      {/* CTA line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingTop: 20,
          borderTop: `1px solid ${hovered ? item.accent + "30" : "#e8e8f0"}`,
          transition: "border-color 0.35s ease",
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${item.accent} 0%, #a78bfa 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {item.cta}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ flexShrink: 0, transition: "transform 0.3s ease", transform: hovered ? "translateX(4px)" : "translateX(0)" }}
        >
          <path d="M3 8h10M9 4l4 4-4 4" stroke={item.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  );
}

export default function NextStepSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  const wrapStyle: React.CSSProperties = {
    maxWidth: 1280,
    margin: "0 auto",
    paddingLeft: 60,
    paddingRight: 60,
  };

  return (
    <section
      ref={ref}
      style={{ position: "relative", background: "#fafafa", overflow: "hidden" }}
    >
      {/* ── HERO MASTHEAD ─────────────────────────────── */}
      <div
        style={{
          position: "relative",
          background: "#0c0c14",
          paddingTop: 120,
          paddingBottom: 120,
          overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />
        {/* Gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 500,
            background: "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ ...wrapStyle, position: "relative", zIndex: 1 }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [...ease] }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 40,
            }}
          >
            <div style={{ height: 1, width: 40, background: "#6366f1" }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#6366f1",
              }}
            >
              Your Next Step
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [...ease], delay: 0.08 }}
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "clamp(48px, 6vw, 88px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: 0,
              maxWidth: 900,
            }}
          >
            Into the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI Startup
            </span>
            <br />
            Ecosystem.
          </motion.h2>

          {/* Divider + sub row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [...ease], delay: 0.18 }}
            className="udaan-nextstep-header-stats"
            style={{
              marginTop: 56,
              paddingTop: 40,
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {[
              { label: "Structured", sub: "Ecosystem" },
              { label: "Curated", sub: "Selection" },
              { label: "Execution", sub: "Focused" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  paddingRight: 40,
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  paddingLeft: i > 0 ? 40 : 0,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                    fontSize: 28,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: 6,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#5a5a80",
                  }}
                >
                  {item.sub}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────── */}
      <div style={{ ...wrapStyle, paddingTop: 100, paddingBottom: 20 }}>

        {/* Manifesto statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [...ease], delay: 0.25 }}
          className="udaan-reality-white-grid"
          style={{
            gap: 80,
            alignItems: "start",
            marginBottom: 80,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontSize: "clamp(22px, 2.4vw, 32px)",
                fontWeight: 700,
                lineHeight: 1.45,
                color: "#0c0c14",
                margin: 0,
              }}
            >
              You have read about the ranks. You have seen the pathway. You understand the difference between learning tools and building real solutions.
            </p>
          </div>
          <div style={{ paddingTop: 6 }}>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: "#5a5a72",
                margin: "0 0 24px",
              }}
            >
              The only question left is whether you are ready to move.
            </p>
            <div
              style={{
                padding: "24px 28px",
                background: "#f0f0ff",
                borderRadius: 14,
                borderLeft: "3px solid #6366f1",
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "#3d3d5c",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Every cohort is curated through a defined{" "}
                <strong style={{ color: "#6366f1" }}>Builder Selection Process</strong>.
                Seats are limited intentionally - not for marketing, but to protect focus
                and mentorship depth. You will be surrounded by early-stage AI founders
                working toward the same goal:{" "}
                <strong style={{ color: "#0c0c14" }}>execution</strong>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Full-width manifesto block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [...ease], delay: 0.32 }}
          style={{
            position: "relative",
            background: "#0c0c14",
            borderRadius: 24,
            padding: "60px 72px",
            marginBottom: 80,
            overflow: "hidden",
          }}
        >
          {/* BG accent */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.15) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 780 }}>
            <p
              style={{
                fontSize: "clamp(15px, 1.4vw, 18px)",
                lineHeight: 1.85,
                color: "#c0c0d8",
                margin: "0 0 32px",
              }}
            >
              Udaan is not an information program. It is a structured entry into a serious AI Startup
              Ecosystem built for people who want to launch, validate, and scale responsibly. If you
              are looking for passive sessions or symbolic participation,{" "}
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                this will not feel comfortable.
              </span>
            </p>
            <p
              style={{
                fontSize: "clamp(15px, 1.4vw, 18px)",
                lineHeight: 1.85,
                color: "#c0c0d8",
                margin: 0,
              }}
            >
              If you are ready to work on an idea, build an MVP, validate with real users,
              and step into structured founder accountability,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 700,
                }}
              >
                this is where that journey begins.
              </span>
            </p>
          </div>
        </motion.div>

      </div>

      {/* ── INVITATION BAND ───────────────────────────── */}
      <div
        style={{
          background: "#f0f0ff",
          borderTop: "1px solid #e0e0f8",
          borderBottom: "1px solid #e0e0f8",
          padding: "40px 0",
          marginBottom: 80,
        }}
      >
        <div style={wrapStyle}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: [...ease], delay: 0.38 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 600, color: "#0c0c14" }}>
              This is your invitation to
            </span>
            <span
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontSize: "clamp(20px, 2.2vw, 30px)",
                fontWeight: 800,
                background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontStyle: "italic",
              }}
            >
              move from intention to action.
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── THREE PATHS ───────────────────────────────── */}
      <div style={{ ...wrapStyle, paddingBottom: 100 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [...ease], delay: 0.44 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 48,
          }}
        >
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, #e8e8f0, transparent)" }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#9494b0",
            }}
          >
            Choose Your Path
          </span>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, #e8e8f0, transparent)" }} />
        </motion.div>

        <div
          className="udaan-nextstep-grid"
          style={{ marginBottom: 80 }}
        >
          {paths.map((item, i) => (
            <PathCard key={i} item={item} index={i} inView={inView} />
          ))}
        </div>

        {/* ── CLOSING DECLARATION ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [...ease], delay: 0.75 }}
          style={{
            position: "relative",
            textAlign: "center",
            paddingTop: 80,
          }}
        >
          {/* rule lines */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: [...ease], delay: 0.85 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(to right, transparent, #6366f1 30%, #a78bfa 70%, transparent)",
              transformOrigin: "center",
            }}
          />

          {/* Ghost word */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "clamp(80px, 14vw, 200px)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "1.5px #e0e0f0",
              letterSpacing: "-0.04em",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 0,
              lineHeight: 1,
            }}
          >
            ACTION
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 800,
                lineHeight: 1.4,
                color: "#0c0c14",
                margin: "0 auto 16px",
                maxWidth: 640,
              }}
            >
              The ecosystem is structured.<br />
              The pathway is clear.
            </p>
            <p
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 800,
                fontStyle: "italic",
                background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: "0 auto 80px",
              }}
            >
              The next move belongs to you.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
