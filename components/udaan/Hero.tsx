"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, animate } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

function useCounter(to: number, duration = 2.2) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const c = animate(0, to, { duration, ease: "easeOut", onUpdate: v => setVal(Math.round(v)) });
        return () => c.stop();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return { val, ref };
}

function Stat({ num, suffix = "", label, delay = 0 }: { num: number; suffix?: string; label: string; delay?: number }) {
  const { val, ref } = useCounter(num);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease }}
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      <div style={{
        fontFamily: "'Nasalization', sans-serif",
        fontWeight: 400,
        fontSize: "clamp(28px, 3vw, 48px)",
        letterSpacing: "0.02em",
        lineHeight: 1,
        color: "#0a0a0f",
      }}>
        <span ref={ref}>{num >= 1000 ? val.toLocaleString() : val}{suffix}</span>
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#9898b0",
        fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
      }}>
        {label}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const yContent = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "12%"]), { stiffness: 55, damping: 18 });
  const fadeOut = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse orb
  const mx = useSpring(0, { stiffness: 60, damping: 22 });
  const my = useSpring(0, { stiffness: 60, damping: 22 });
  useEffect(() => {
    const h = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [mx, my]);

  return (
    <section ref={sectionRef} style={{
      position: "relative",
      background: "#ffffff",
      minHeight: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── CURSOR AURA ── */}
      <motion.div style={{
        position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 1,
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)",
        x: mx, y: my, translateX: "-50%", translateY: "-50%",
      }} />

      {/* ── FINE GRID ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(0,0,10,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,10,0.028) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* ── ACCENT LINES — architectural framing ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {/* Top-right corner accent */}
        <div style={{
          position: "absolute", top: 0, right: "8%",
          width: 1, height: "35vh",
          background: "linear-gradient(180deg, transparent, rgba(99,102,241,0.15), transparent)",
        }} />
        {/* Bottom-left corner accent */}
        <div style={{
          position: "absolute", bottom: 0, left: "8%",
          width: 1, height: "30vh",
          background: "linear-gradient(0deg, transparent, rgba(99,102,241,0.1), transparent)",
        }} />
        {/* Horizontal accent */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: "18%",
          height: 1,
          background: "linear-gradient(90deg, transparent 5%, rgba(0,0,10,0.05) 20%, rgba(0,0,10,0.05) 80%, transparent 95%)",
        }} />
      </div>

      {/* ── SOFT ORB TOP RIGHT ── */}
      <div style={{
        position: "absolute", top: "-10%", right: "-8%",
        width: "50vw", height: "50vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.055) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* ── MAIN CONTENT ── */}
      <motion.div
        style={{
          position: "relative", zIndex: 2,
          y: yContent, opacity: fadeOut,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: "clamp(50px, 6vh, 50px)",
          paddingBottom: "clamp(60px, 8vh, 100px)",
        }}
      >
        {/* ── HEADLINE BLOCK ── */}
        <div className="wrap" style={{ textAlign: "center" }}>

          {/* Tag line above */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              marginBottom: "clamp(28px, 3.5vh, 44px)",
            }}
          >
            <div style={{ width: 28, height: 1, background: "#c7c7e0" }} />
            <span style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontSize: 11, fontWeight: 600,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#8080a8",
            }}>
              DAG Army · AI Builders Program
            </span>
            <div style={{ width: 28, height: 1, background: "#c7c7e0" }} />
          </motion.div>

          {/* UDAAN — Nasalization, commanding */}
          <div style={{ marginBottom: "clamp(12px, 1.5vh, 20px)", overflow: "hidden" }}>
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.22, ease }}
              style={{
                fontFamily: "'Nasalization', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(80px, 14vw, 200px)",
                letterSpacing: "0.12em",
                lineHeight: 0.92,
                color: "#0a0a0f",
                textAlign: "center",
              }}
            >
              UDAAN
            </motion.div>
          </div>

          {/* Subtitle — single line */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.3em",
              flexWrap: "nowrap",
              whiteSpace: "nowrap",
              marginBottom: "clamp(48px, 6vh, 72px)",
            }}
          >
            <span style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontWeight: 700,
              fontSize: "clamp(18px, 2.4vw, 36px)",
              letterSpacing: "-0.02em",
              color: "#3c3c5c",
            }}>Where AI</span>
            <span style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontWeight: 700,
              fontSize: "clamp(18px, 2.4vw, 36px)",
              letterSpacing: "-0.02em",
              background: "linear-gradient(110deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Builders</span>
            <span style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontWeight: 700,
              fontSize: "clamp(18px, 2.4vw, 36px)",
              letterSpacing: "-0.02em",
              color: "#3c3c5c",
            }}>Rise.</span>
          </motion.div>

          {/* ── MISSION + CTA ROW ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68, ease }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "start",
              gap: "clamp(32px, 4vw, 64px)",
              paddingTop: "clamp(32px, 4vh, 48px)",
              borderTop: "1px solid rgba(0,0,10,0.07)",
              textAlign: "left",
            }}
          >
            {/* Left: Mission */}
            <div>
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#a0a0c0",
                marginBottom: 12,
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              }}>Mission</div>
              <p style={{
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                fontSize: "clamp(13px, 1.1vw, 16px)",
                lineHeight: 1.7,
                color: "#4a4a6a",
                fontWeight: 400,
              }}>
                <strong style={{ color: "#0a0a0f", fontWeight: 600 }}>100,000 AI Startup Founders by 2030.</strong>
                {" "}Rank through contribution inside a disciplined AI Startup Ecosystem.
              </p>
            </div>

            {/* Center: CTA */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 28 }}>
              <motion.button
                onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))}
                whileHover={{ scale: 1.04, boxShadow: "0 20px 56px rgba(99,102,241,0.38)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "16px 36px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 100,
                  fontSize: "clamp(13px, 1vw, 15px)",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                  letterSpacing: "0.04em",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.28)",
                  whiteSpace: "nowrap",
                }}
              >
                Enter as a Soldier
              </motion.button>
              <span style={{
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                fontSize: 11, color: "#b0b0c8", letterSpacing: "0.06em",
              }}>
                Cohort now open
              </span>
            </div>

            {/* Right: Manifesto */}
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#a0a0c0",
                marginBottom: 12,
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              }}>Manifesto</div>
              <p style={{
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                fontSize: "clamp(13px, 1.1vw, 16px)",
                lineHeight: 1.7,
                color: "#4a4a6a",
                fontWeight: 400,
              }}>
                AI is reshaping ownership and opportunity.
                The question is not whether AI will define the future —
                it is <strong style={{ color: "#0a0a0f", fontWeight: 600 }}>who will build within it.</strong>
              </p>
            </div>
          </motion.div>

          {/* ── STATS ROW ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.88, ease }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              marginTop: "clamp(48px, 6vh, 72px)",
              paddingTop: "clamp(28px, 3.5vh, 40px)",
              borderTop: "1px solid rgba(0,0,10,0.06)",
            }}
          >
            {[
              { num: 2400, suffix: "+", label: "Active Builders", delay: 0.9 },
              { num: 3, suffix: "", label: "Nations Unified", delay: 0.97 },
              { num: 1, suffix: "M+", label: "Jobs Targeted", delay: 1.04 },
              { num: 100000, suffix: "", label: "Founders by 2030", delay: 1.11 },
            ].map((s, i) => (
              <div key={i} style={{
                borderRight: i < 3 ? "1px solid rgba(0,0,10,0.06)" : "none",
                paddingLeft: i > 0 ? "clamp(20px, 2.5vw, 40px)" : 0,
                paddingRight: i < 3 ? "clamp(20px, 2.5vw, 40px)" : 0,
              }}>
                <Stat num={s.num} suffix={s.suffix} label={s.label} delay={s.delay} />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── MARQUEE TICKER ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        style={{
          position: "relative", zIndex: 2,
          borderTop: "1px solid rgba(0,0,10,0.06)",
          background: "#f8f8fc",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div style={{
          display: "flex", width: "max-content",
          animation: "udaan-marquee-left 36s linear infinite",
          padding: "14px 0",
        }}>
          {[...Array(4)].map((_, g) => (
            <span key={g} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {[
                "Rank Through Contribution",
                "100K Founders by 2030",
                "AI Startup Ecosystem",
                "Soldiers Prepare — Lieutenants Build",
                "Action Over Observation",
                "Contribution-Based Ranking",
                "Serious Startup Execution",
                "DAG Army Udaan",
              ].map((t, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.16em",
                    textTransform: "uppercase", color: "#b8b8d0",
                    padding: "0 32px", whiteSpace: "nowrap",
                    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                  }}>{t}</span>
                  <span style={{ color: "rgba(99,102,241,0.25)", fontSize: 4 }}>◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        style={{
          position: "absolute", right: 40, bottom: 80,
          zIndex: 3, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 12,
        }}
      >
        <span style={{
          writingMode: "vertical-rl", fontSize: 9, fontWeight: 600,
          letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8c8dc",
          fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
        }}>Scroll</span>
        <div style={{ width: 1, height: 52, background: "rgba(0,0,10,0.07)", position: "relative", overflow: "hidden" }}>
          <motion.div
            style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #6366f1, transparent)" }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
          />
        </div>
      </motion.div>

    </section>
  );
}
