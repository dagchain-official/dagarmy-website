"use client";
import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;
const INDIGO = "#6366f1";
const gradText = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

// Shared wrap style (matches .wrap class behaviour inline for full-bleed rows)
const wrapStyle: React.CSSProperties = {
  maxWidth: 1600,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 60,
  paddingRight: 60,
};

export default function UdaanCodeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const watermarkY = useSpring(useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]), { stiffness: 40, damping: 18 });
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0.6, 0.6, 0]);

  const p1Ref = useRef<HTMLDivElement>(null);
  const p1In = useInView(p1Ref, { once: true, margin: "-80px" });
  const p2Ref = useRef<HTMLDivElement>(null);
  const p2In = useInView(p2Ref, { once: true, margin: "-80px" });
  const p3Ref = useRef<HTMLDivElement>(null);
  const p3In = useInView(p3Ref, { once: true, margin: "-80px" });
  const guardRef = useRef<HTMLDivElement>(null);
  const guardIn = useInView(guardRef, { once: true, margin: "-80px" });
  const closingRef = useRef<HTMLDivElement>(null);
  const closingIn = useInView(closingRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} style={{ background: "#ffffff", padding: "0", position: "relative", overflow: "hidden" }}>

      {/* ── FULL-BLEED HERO MASTHEAD ── */}
      <div style={{
        background: "#f4f3ff",
        borderBottom: "1px solid #ddd9ff",
        padding: "80px 0 0",
        position: "relative",
        overflow: "hidden",
      }}>
        <motion.div aria-hidden style={{
          position: "absolute", bottom: -40, right: -20,
          fontFamily: "'Nasalization', sans-serif",
          fontSize: "clamp(120px, 22vw, 320px)",
          fontWeight: 700, lineHeight: 1,
          color: "rgba(99,102,241,0.07)",
          userSelect: "none", pointerEvents: "none",
          letterSpacing: "-0.04em",
          y: watermarkY, opacity: watermarkOpacity,
        }}>CODE</motion.div>

        <div style={{ ...wrapStyle, position: "relative", zIndex: 1 }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
          >
            <div style={{ height: 1, width: 48, background: INDIGO }} />
            <span style={{ fontFamily: "'Nasalization', sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: INDIGO }}>Constitution Framework · DAG Army</span>
          </motion.div>

          {/* Masthead headline */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 64, alignItems: "flex-end", paddingBottom: 56 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
            >
              <h2 style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(44px, 6vw, 80px)",
                fontWeight: 900, lineHeight: 1.0,
                letterSpacing: "-0.03em", color: "#0c0c14", margin: 0,
              }}>
                Udaan Code<br />
                <span style={gradText}>Constitution</span><br />
                in Action.
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.2, ease }}
              style={{ maxWidth: 320, paddingBottom: 8 }}
            >
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.75, color: "#5a5a72", margin: "0 0 24px" }}>
                Community Governance · Builder Discipline · Ethical Startup Culture
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {[
                  "Udaan operates within a defined framework of Community Governance.",
                  "The Constitution protects the culture.",
                  "Every participant enters a system built on Builder Discipline.",
                ].map((line, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.3 + i * 0.1, ease }}
                    style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                  >
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: INDIGO, marginTop: 8, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#5a5a72", lineHeight: 1.6 }}>{line}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom stat bar */}
          <div style={{ borderTop: "1px solid #ddd9ff", display: "flex", alignItems: "stretch", overflow: "hidden" }}>
            {[
              { num: "3", label: "Core Principles" },
              { num: "0", label: "Tolerance for Shortcuts" },
              { num: "∞", label: "Integrity Standard" },
              { num: "#1", label: "Contribution Rule" },
            ].map((s, i, arr) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease }}
                style={{
                  flex: 1, padding: "24px 32px", display: "flex", alignItems: "center", gap: 16,
                  borderRight: i < arr.length - 1 ? "1px solid #ddd9ff" : "none",
                }}
              >
                <span style={{ fontFamily: "'Nasalization', sans-serif", fontSize: 32, fontWeight: 700, ...gradText, lineHeight: 1 }}>{s.num}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#9494aa", lineHeight: 1.4 }}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ARTICLE 01: No Toxicity ── white bg */}
      <div ref={p1Ref} style={{ borderBottom: "1px solid #ebebf5" }}>
        <div style={{ ...wrapStyle }}>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: 320 }}>
            {/* Left rail */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={p1In ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, ease }}
              style={{
                borderRight: "1px solid #ebebf5",
                padding: "64px 40px 64px 0",
                display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontFamily: "'Nasalization', sans-serif", fontSize: 72, fontWeight: 700, color: "rgba(99,102,241,0.12)", lineHeight: 1, marginBottom: 8 }}>01</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: INDIGO, fontFamily: "'Nasalization', sans-serif" }}>Policy</div>
              </div>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={p1In ? { scaleY: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.3, ease }}
                style={{ width: 2, height: 80, background: `linear-gradient(180deg, ${INDIGO} 0%, transparent 100%)`, transformOrigin: "top" }}
              />
            </motion.div>

            {/* Content */}
            <div style={{ padding: "64px 0 64px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={p1In ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.15, ease }}
              >
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
                  fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.1,
                  letterSpacing: "-0.025em", color: "#0c0c14", margin: "0 0 24px",
                }}>No Toxicity<br />Policy.</h3>
                <p style={{ fontSize: 15, color: "#5a5a72", lineHeight: 1.85, margin: 0 }}>
                  Mocking beginners, ego-driven behavior, aggressive selling, or misleading narratives are not tolerated.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={p1In ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.3, ease }}
                style={{ display: "flex", flexDirection: "column" as const, justifyContent: "space-between" }}
              >
                <div style={{ borderLeft: `3px solid ${INDIGO}`, paddingLeft: 24 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, lineHeight: 1.4, color: "#0c0c14", margin: "0 0 8px", fontStyle: "italic" }}>"Respect is not optional."</p>
                  <span style={{ fontSize: 12, color: "#9494aa", fontWeight: 600, letterSpacing: "0.06em" }}>— The Udaan Code</span>
                </div>
                <div style={{ marginTop: 32, background: "#fafafa", border: "1px solid #ebebf5", borderRadius: 12, padding: "20px 24px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9494aa", marginBottom: 10 }}>Enforcement</div>
                  <p style={{ fontSize: 14, color: "#3a3a5c", lineHeight: 1.65, margin: 0 }}>Violations result in immediate review. Repeat offenses result in rank removal. There are no second chances on culture.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ARTICLE 02: Zero Politics — full-bleed #fafafa band ── */}
      <div ref={p2Ref} style={{ borderBottom: "1px solid #ebebf5", background: "#fafafa" }}>
        <div style={{ ...wrapStyle }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", minHeight: 300 }}>
            <div style={{ padding: "64px 64px 64px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", borderRight: "1px solid #ebebf5" }}>
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={p2In ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.15, ease }}
                style={{ display: "flex", flexDirection: "column" as const, gap: 24 }}
              >
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: 6, padding: "5px 14px", width: "fit-content",
                }}>
                  <span style={{ fontFamily: "'Nasalization', sans-serif", fontSize: 10, letterSpacing: "0.14em", color: INDIGO, textTransform: "uppercase" as const }}>Governance Rule</span>
                </div>
                <p style={{ fontSize: 14, color: "#5a5a72", lineHeight: 1.85, margin: 0 }}>
                  No religious debate. No ideological battles.
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0c0c14", lineHeight: 1.6, margin: 0, padding: "20px 0 0", borderTop: "1px solid #e5e5f0" }}>
                  The focus remains singular: build, validate, improve.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={p2In ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.3, ease }}
              >
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
                  fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.1,
                  letterSpacing: "-0.025em", color: "#0c0c14", margin: 0,
                }}>Zero<br />Politics.</h3>
              </motion.div>
            </div>
            {/* Right rail */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={p2In ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, ease }}
              style={{
                padding: "64px 0 64px 40px",
                display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div style={{ textAlign: "right" as const }}>
                <div style={{ fontFamily: "'Nasalization', sans-serif", fontSize: 72, fontWeight: 700, color: "rgba(99,102,241,0.12)", lineHeight: 1, marginBottom: 8 }}>02</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: INDIGO, fontFamily: "'Nasalization', sans-serif" }}>Rule</div>
              </div>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={p2In ? { scaleY: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.3, ease }}
                style={{ width: 2, height: 80, background: `linear-gradient(180deg, ${INDIGO} 0%, transparent 100%)`, transformOrigin: "top" }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── ARTICLE 03: No Fake Claims — white bg ── */}
      <div ref={p3Ref} style={{ borderBottom: "1px solid #ebebf5" }}>
        <div style={{ ...wrapStyle }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={p3In ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            style={{ display: "grid", gridTemplateColumns: "200px 1fr 1fr", minHeight: 360, position: "relative", overflow: "hidden" }}
          >
            <div aria-hidden style={{
              position: "absolute", right: -20, bottom: -40,
              fontFamily: "'Nasalization', sans-serif", fontSize: "clamp(180px, 25vw, 380px)",
              fontWeight: 700, color: "rgba(99,102,241,0.04)", lineHeight: 1,
              userSelect: "none", pointerEvents: "none",
            }}>03</div>

            <div style={{
              borderRight: "1px solid #ebebf5",
              padding: "64px 40px 64px 0",
              display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontFamily: "'Nasalization', sans-serif", fontSize: 72, fontWeight: 700, color: "rgba(99,102,241,0.12)", lineHeight: 1, marginBottom: 8 }}>03</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: INDIGO, fontFamily: "'Nasalization', sans-serif" }}>Integrity Standard</div>
              </div>
            </div>

            <div style={{ padding: "64px 48px 64px 64px", borderRight: "1px solid #ebebf5", display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={p3In ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.2, ease }}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
                  fontSize: "clamp(32px, 3.5vw, 52px)", lineHeight: 1.0,
                  letterSpacing: "-0.03em", color: "#0c0c14", margin: "0 0 32px",
                }}
              >No Fake<br /><span style={gradText}>Claims.</span></motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={p3In ? { opacity: 1 } : {}}
                transition={{ duration: 0.65, delay: 0.4, ease }}
                style={{ fontSize: 15, color: "#5a5a72", lineHeight: 1.85, margin: 0 }}
              >
                Inflated case studies, artificial traction, or misleading income statements damage trust.
              </motion.p>
            </div>

            <div style={{ padding: "64px 0 64px 48px", display: "flex", flexDirection: "column" as const, justifyContent: "center", gap: 32, position: "relative", zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={p3In ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.35, ease }}
                style={{
                  background: "linear-gradient(135deg, #f4f3ff 0%, #ede9fe 100%)",
                  border: "1px solid #ddd9ff", borderRadius: 16,
                  padding: "32px 32px",
                }}
              >
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 20, lineHeight: 1.4, color: "#0c0c14", margin: "0 0 16px" }}>
                  Trust is treated as an <span style={gradText}>operational asset</span>.
                </p>
                <p style={{ fontSize: 14, color: "#5a5a72", lineHeight: 1.75, margin: 0 }}>
                  Not a marketing slogan. Not a tagline. An asset that compounds in credibility when protected, and collapses when violated.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── CONTRIBUTION FIRST — full-bleed #fafafa ── */}
      <div style={{ borderBottom: "1px solid #ebebf5", background: "#fafafa" }}>
        <div style={{ ...wrapStyle }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", minHeight: 280 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease }}
              style={{ padding: "64px 64px 64px 0", borderRight: "1px solid #ebebf5" }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#9494aa", fontFamily: "'Nasalization', sans-serif", marginBottom: 20 }}>The Advancement Rule</div>
              <h3 style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
                fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.05,
                letterSpacing: "-0.03em", color: "#0c0c14", margin: "0 0 32px",
              }}>
                Advancement follows<br />one rule:{" "}
                <span style={gradText}>Contribution First.</span>
              </h3>
              <p style={{ fontSize: 15, color: "#5a5a72", lineHeight: 1.85, maxWidth: 540, margin: 0 }}>
                You earn recognition by launching, validating, mentoring, or supporting other builders. Status is never transactional. Rank reflects demonstrated execution and service.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.2, ease }}
              style={{ padding: "64px 0 64px 48px", display: "flex", flexDirection: "column" as const, justifyContent: "center", gap: 20 }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9494aa" }}>How You Advance</div>
              {[
                "Launching a validated product",
                "Mentoring incoming Soldiers",
                "Demonstrating market traction",
                "Supporting the ecosystem's growth",
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease }}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    paddingBottom: i < 3 ? 20 : 0,
                    borderBottom: i < 3 ? "1px solid #e5e5f0" : "none",
                  }}
                >
                  <span style={{ fontSize: 16, color: INDIGO, fontWeight: 700, flexShrink: 0 }}>↗</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#3a3a5c" }}>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── RESPONSIBLE CULTURE + GUARDRAIL — white bg ── */}
      <div ref={guardRef} style={{ borderBottom: "1px solid #ebebf5" }}>
        <div style={{ ...wrapStyle }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={guardIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease }}
              style={{ padding: "64px 48px 64px 0", borderRight: "1px solid #ebebf5" }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#9494aa", fontFamily: "'Nasalization', sans-serif", marginBottom: 20 }}>Responsible Founder Culture</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 24, lineHeight: 1.3, color: "#0c0c14", margin: "0 0 24px", letterSpacing: "-0.02em" }}>
                This alignment builds more than startups. It builds a{" "}
                <span style={gradText}>Responsible Founder Culture</span>.
              </p>
              <p style={{ fontSize: 14, color: "#5a5a72", lineHeight: 1.85, margin: "0 0 32px" }}>
                Udaan strengthens its positioning as an <strong style={{ color: "#0c0c14" }}>Ethical AI Community</strong> and a Responsible Startup Ecosystem.
              </p>
              {[
                { label: "Fast execution", note: "Encouraged", ok: true },
                { label: "Shortcut behavior", note: "Not Permitted", ok: false },
                { label: "Builder discipline", note: "Required", ok: true },
              ].map((row, i, arr) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={guardIn ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.1, ease }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid #f0f0f7" : "none",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#3a3a5c" }}>{row.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: row.ok ? "#16a34a" : "#e53935",
                    background: row.ok ? "rgba(22,163,74,0.08)" : "rgba(229,57,53,0.08)",
                    border: `1px solid ${row.ok ? "rgba(22,163,74,0.2)" : "rgba(229,57,53,0.2)"}`,
                    borderRadius: 100, padding: "3px 12px",
                    letterSpacing: "0.06em", textTransform: "uppercase" as const,
                  }}>{row.note}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={guardIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15, ease }}
              style={{ padding: "64px 0 64px 48px" }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#9494aa", fontFamily: "'Nasalization', sans-serif", marginBottom: 20 }}>Integrity as the Guardrail</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 1l5 5M6 1L1 6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9494aa" }}>We Reject</span>
                  </div>
                  {["No MLM logic", "No get-rich shortcuts", "No artificial hierarchy"].map((item, i, arr) => (
                    <motion.div key={item}
                      initial={{ opacity: 0 }}
                      animate={guardIn ? { opacity: 1 } : {}}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      style={{ fontSize: 13, color: "#5a5a72", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px dashed #f0f0f5" : "none", lineHeight: 1.5 }}
                    >{item}</motion.div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2L7 1" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9494aa" }}>We Value</span>
                  </div>
                  {["Applied work", "Earned reputation", "Transparent reporting", "Demonstrated impact"].map((item, i, arr) => (
                    <motion.div key={item}
                      initial={{ opacity: 0 }}
                      animate={guardIn ? { opacity: 1 } : {}}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      style={{ fontSize: 13, color: "#5a5a72", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px dashed #f0f0f5" : "none", lineHeight: 1.5 }}
                    >{item}</motion.div>
                  ))}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={guardIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.5 }}
                style={{ background: "linear-gradient(135deg, #f4f3ff 0%, #ede9fe 100%)", border: "1px solid #ddd9ff", borderRadius: 12, padding: "20px 24px" }}
              >
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#0c0c14", margin: 0, lineHeight: 1.6 }}>
                  Inside this ecosystem, authority is not assigned—it is{" "}
                  <span style={gradText}>demonstrated through action</span>.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── CLOSING DECLARATION ── */}
      <div ref={closingRef} style={{ padding: "96px 0", position: "relative", overflow: "hidden" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div key={i}
            initial={{ scaleX: 0 }}
            animate={closingIn ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: `${10 + i * 20}%`,
              left: 0, right: 0, height: 1,
              background: i % 2 === 0 ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.03)",
              transformOrigin: "left",
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={closingIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          style={{ ...wrapStyle, position: "relative", zIndex: 1, textAlign: "center" as const }}
        >
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase" as const, color: "#9494aa",
            fontFamily: "'Nasalization', sans-serif", marginBottom: 32,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
          }}>
            <div style={{ height: 1, width: 48, background: "#e2e2ee" }} />
            Constitutional Declaration
            <div style={{ height: 1, width: 48, background: "#e2e2ee" }} />
          </div>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
            fontSize: "clamp(28px, 4.5vw, 60px)", lineHeight: 1.1,
            letterSpacing: "-0.03em", color: "#0c0c14", margin: "0 0 16px",
          }}>
            When builders operate within discipline,
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
            fontSize: "clamp(28px, 4.5vw, 60px)", lineHeight: 1.1,
            letterSpacing: "-0.03em", margin: "0 0 48px",
            ...gradText,
          }}>
            the ecosystem compounds in credibility.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={closingIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" as const }}
          >
            {[
              { tag: "The Rule", text: "Contribution First. Always." },
              { tag: "The Standard", text: "Trust is an operational asset." },
              { tag: "The Code", text: "That is the code." },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={closingIn ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.12, ease }}
                style={{ textAlign: "center" as const }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: INDIGO, fontFamily: "'Nasalization', sans-serif", marginBottom: 6 }}>{item.tag}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#3a3a5c" }}>{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
