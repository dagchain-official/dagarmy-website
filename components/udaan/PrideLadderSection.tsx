"use client";
import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;
const GRADIENT = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";

/* ── Scroll-triggered fade-up helper ── */
function FadeUp({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ── Mouse-tilt 3D badge ── */
function TiltBadge({ src, alt }: { src: string; alt: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-40, 40], [14, -14]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-40, 40], [-14, 14]), { stiffness: 200, damping: 20 });

  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left - r.width / 2);
        my.set(e.clientY - r.top - r.height / 2);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ perspective: 400, flexShrink: 0 }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ width: 96, height: 96, objectFit: "contain", rotateX, rotateY, display: "block" }}
      />
    </div>
  );
}

export default function PrideLadderSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Watermark drifts upward at 20% scroll speed */
  const watermarkY = useSpring(
    useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]),
    { stiffness: 55, damping: 22 }
  );
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);

  /* Two ambient orbs at different depths */
  const orb1Y = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]),
    { stiffness: 45, damping: 18 }
  );
  const orb2Y = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "22%"]),
    { stiffness: 38, damping: 16 }
  );

  /* Section header slides in from left on scroll enter */
  const headerX = useSpring(
    useTransform(scrollYProgress, [0, 0.18], [-50, 0]),
    { stiffness: 75, damping: 20 }
  );
  const headerOpacity = useTransform(scrollYProgress, [0, 0.14], [0, 1]);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#f7f7fb",
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Parallax orb — top left ── */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "6%",
          left: "-12%",
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          y: orb1Y,
        }}
      />

      {/* ── Parallax orb — bottom right ── */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "4%",
          right: "-10%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          y: orb2Y,
        }}
      />

      {/* ── Parallax watermark ── */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: watermarkY,
          translateY: "-50%",
          opacity: watermarkOpacity,
          fontFamily: "'Nasalization', sans-serif",
          fontSize: "clamp(130px, 17vw, 250px)",
          fontWeight: 700,
          color: "rgba(99,102,241,0.028)",
          letterSpacing: "-0.04em",
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        PRIDE
      </motion.div>

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>

        {/* ── SECTION HEADER ── */}
        <motion.div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 48,
            marginBottom: 64,
            paddingBottom: 40,
            borderBottom: "1px solid #e2e2ee",
            x: headerX,
            opacity: headerOpacity,
          }}
        >
          <div style={{ flex: "0 0 auto", maxWidth: 600 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.18)",
              borderRadius: 99,
              padding: "5px 14px",
              marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: GRADIENT, flexShrink: 0 }} />
              <span style={{
                fontFamily: "'Nasalization', sans-serif",
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "#6366f1",
                textTransform: "uppercase",
              }}>
                Pride Ladder
              </span>
            </div>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 4.5vw, 54px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#0c0c14",
              marginBottom: 16,
            }}>
              Rank Through{" "}
              <span style={{
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Contribution
              </span>
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 17,
              fontWeight: 600,
              color: "#5a5a72",
              marginBottom: 0,
            }}>
              A Meritocracy, Not a Marketplace
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: "0 0 auto" }}>
            {[
              { label: "RANKS", value: "02" },
              { label: "ENTRY", value: "Earned" },
              { label: "MODEL", value: "Merit" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: "#ffffff",
                  border: "1px solid #e2e2ee",
                  borderRadius: 12,
                  padding: "10px 20px",
                }}
              >
                <span style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  background: GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}>
                  {s.value}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9494aa",
                }}>
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── PRINCIPLE STATEMENT ── */}
        <FadeUp delay={0} style={{ marginBottom: 48 }}>
          <motion.div
            whileHover={{ scale: 1.006 }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid #e2e2ee",
            }}
          >
            <div style={{
              background: "#0c0c14",
              padding: "44px 48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                lineHeight: 1.45,
                color: "#ffffff",
                marginBottom: 20,
              }}>
                The DAG Army does not run on titles. It runs on contribution.
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.55)",
                marginBottom: 0,
              }}>
                The Pride Ladder exists to make one principle clear: growth here is earned through visible execution across your AI Startup Journey, not through passive participation or purchased status.
              </p>
            </div>
            <div style={{
              background: "#ffffff",
              padding: "44px 48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 20,
            }}>
              <div style={{
                fontFamily: "'Nasalization', sans-serif",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9494aa",
                marginBottom: 4,
              }}>
                The Core Rule
              </div>
              {["Rank cannot be bought.", "Rank cannot be gifted.", "Rank cannot be self-declared."].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -22 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    paddingBottom: i < 2 ? 20 : 0,
                    borderBottom: i < 2 ? "1px solid #ebebf5" : "none",
                  }}
                >
                  <span style={{
                    fontFamily: "'Nasalization', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    background: GRADIENT,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    flexShrink: 0,
                  }}>
                    0{i + 1}
                  </span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0c0c14",
                  }}>
                    {line}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </FadeUp>

        {/* ── RANK CARDS ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 48,
        }}>
          {/* Soldier */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0, ease }}
            whileHover={{ y: -6, boxShadow: "0 20px 56px rgba(99,102,241,0.12)" }}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e2ee",
              borderRadius: 20,
              padding: "40px 40px 36px",
              position: "relative",
              overflow: "hidden",
              cursor: "default",
              transition: "box-shadow 0.3s ease",
            }}
          >
            {/* Animated top border sweep */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 3,
                background: "linear-gradient(90deg, transparent 0%, #6366f1 40%, #8b5cf6 70%, transparent 100%)",
                transformOrigin: "left",
                borderRadius: "20px 20px 0 0",
              }}
            />
            <div aria-hidden style={{
              position: "absolute", bottom: -16, right: -8,
              fontFamily: "'Nasalization', sans-serif",
              fontSize: 96, fontWeight: 700,
              color: "rgba(99,102,241,0.04)",
              letterSpacing: "-0.04em", lineHeight: 1,
              userSelect: "none", pointerEvents: "none",
            }}>01</div>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <div style={{
                  display: "inline-block",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: 6, padding: "4px 10px",
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: 10, letterSpacing: "0.1em",
                  color: "#6366f1", textTransform: "uppercase", marginBottom: 14,
                }}>Foundation Rank</div>
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800, fontSize: 30,
                  color: "#0c0c14", letterSpacing: "-0.02em", marginBottom: 0,
                }}>Soldier</h3>
              </div>
              <TiltBadge src="/BADGES  and  RANK png+svg/DAGARMY BADGES/DAG SOLDIER.svg" alt="Soldier Badge" />
            </div>

            <div style={{ borderTop: "1px solid #ebebf5", paddingTop: 24, marginBottom: 24 }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, lineHeight: 1.75, color: "#5a5a72", marginBottom: 0,
              }}>
                The entry point. Soldiers are learners in formation—building foundational AI skills, testing tools, and developing clarity on real-world application. This is not passive consumption. It is structured preparation.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["Core AI Skills", "Tool Testing", "Real-world Clarity", "Structured Prep"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.06 * i, type: "spring", stiffness: 220 }}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12, fontWeight: 600,
                    color: "#6366f1",
                    background: "rgba(99,102,241,0.07)",
                    borderRadius: 8, padding: "5px 12px",
                  }}
                >{tag}</motion.span>
              ))}
            </div>
          </motion.div>

          {/* Lieutenant */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.15, ease }}
            whileHover={{ y: -6, boxShadow: "0 24px 64px rgba(99,102,241,0.20)" }}
            style={{
              background: "#ffffff",
              borderRadius: 20,
              padding: "40px 40px 36px",
              position: "relative",
              overflow: "hidden",
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              boxShadow: "0 6px 32px rgba(99,102,241,0.10)",
              cursor: "default",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.35, ease }}
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 3,
                background: GRADIENT,
                transformOrigin: "left",
                borderRadius: "20px 20px 0 0",
              }}
            />
            <div aria-hidden style={{
              position: "absolute", bottom: -16, right: -8,
              fontFamily: "'Nasalization', sans-serif",
              fontSize: 96, fontWeight: 700,
              color: "rgba(99,102,241,0.05)",
              letterSpacing: "-0.04em", lineHeight: 1,
              userSelect: "none", pointerEvents: "none",
            }}>02</div>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <div style={{
                  display: "inline-block",
                  background: GRADIENT,
                  borderRadius: 6, padding: "4px 10px",
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: 10, letterSpacing: "0.1em",
                  color: "#ffffff", textTransform: "uppercase", marginBottom: 14,
                }}>Execution Rank</div>
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800, fontSize: 30,
                  color: "#0c0c14", letterSpacing: "-0.02em", marginBottom: 0,
                }}>Lieutenant</h3>
              </div>
              <TiltBadge src="/BADGES  and  RANK png+svg/DAGARMY BADGES/DAG LIEUTENANT.svg" alt="Lieutenant Badge" />
            </div>

            <div style={{ borderTop: "1px solid #ebebf5", paddingTop: 24, marginBottom: 24 }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, lineHeight: 1.75, color: "#5a5a72", marginBottom: 0,
              }}>
                The builder rank. Lieutenants are no longer preparing—they are executing. They build prototypes, validate ideas with real users, and generate early market signals. This is where learning transitions into applied work.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["Build Prototypes", "Validate with Users", "Market Signals", "Applied Work"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.15 + 0.06 * i, type: "spring", stiffness: 220 }}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12, fontWeight: 600,
                    color: "#6366f1",
                    background: "rgba(99,102,241,0.07)",
                    borderRadius: 8, padding: "5px 12px",
                  }}
                >{tag}</motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── INTEGRITY GUARDRAIL ── */}
        <FadeUp delay={0} style={{ marginBottom: 40 }}>
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e2ee",
            borderRadius: 20,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "28px 44px",
              borderBottom: "1px solid #e2e2ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <h3 style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800, fontSize: 22,
                color: "#0c0c14", letterSpacing: "-0.01em", marginBottom: 0,
              }}>Integrity as the Guardrail</h3>
              <span style={{
                fontFamily: "'Nasalization', sans-serif",
                fontSize: 10, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#9494aa",
              }}>Non-negotiable</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "36px 44px", borderRight: "1px solid #e2e2ee" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: "#ef4444", flexShrink: 0 }} />
                  <span style={{
                    fontFamily: "'Nasalization', sans-serif",
                    fontSize: 10, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "#9494aa",
                  }}>What We Reject</span>
                </div>
                {["No MLM logic", "No get-rich shortcuts", "No artificial hierarchy for display"].map((item, i, arr) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: i * 0.1, ease }}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "16px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid #f0f0f7" : "none",
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 1l6 6M7 1L1 7" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15, fontWeight: 600, color: "#0c0c14",
                    }}>{item}</span>
                  </motion.div>
                ))}
              </div>

              <div style={{ padding: "36px 44px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: "#22c55e", flexShrink: 0 }} />
                  <span style={{
                    fontFamily: "'Nasalization', sans-serif",
                    fontSize: 10, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "#9494aa",
                  }}>What We Value</span>
                </div>
                {[
                  { text: <><strong style={{ color: "#0c0c14" }}>Applied work</strong> over knowledge alone</> },
                  { text: <>Reputation as earned trust</> },
                  { text: <>Transparent reporting over claims</> },
                  { text: <><strong style={{ color: "#0c0c14" }}>Demonstrated</strong> impact over presentation</> },
                ].map((item, i, arr) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: i * 0.1, ease }}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "16px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid #f0f0f7" : "none",
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: "rgba(34,197,94,0.08)",
                      border: "1px solid rgba(34,197,94,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5l2.5 2.5L8 1" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15, fontWeight: 500, color: "#5a5a72",
                    }}>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.3 }}
              style={{
                padding: "24px 44px",
                borderTop: "1px solid #e2e2ee",
                background: "#fafafa",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16, fontWeight: 700,
                color: "#0c0c14", marginBottom: 0, textAlign: "center",
              }}>
                Inside this ecosystem, authority is not assigned—it is{" "}
                <span style={{
                  background: GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>demonstrated through action</span>.
              </p>
            </motion.div>
          </div>
        </FadeUp>

        {/* ── CLOSING STATEMENT ── */}
        <FadeUp delay={0.1}>
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2, borderRadius: 20, overflow: "hidden",
              border: "1px solid #e2e2ee",
            }}
          >
            <div style={{
              background: "#f0f0ff",
              padding: "36px 48px",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <div style={{
                fontFamily: "'Nasalization', sans-serif",
                fontSize: 10, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#6366f1", marginBottom: 16,
              }}>The Bottom Line</div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 20, fontWeight: 800, lineHeight: 1.4,
                color: "#0c0c14", marginBottom: 0,
              }}>The Pride Ladder is not about status.</p>
            </div>
            <div style={{
              background: "#ffffff", padding: "36px 48px",
              display: "flex", alignItems: "center",
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 18, fontWeight: 600, lineHeight: 1.55,
                color: "#5a5a72", marginBottom: 0,
              }}>
                It is about{" "}
                <span style={{
                  background: GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 800,
                }}>responsibility</span>{" "}
                within a disciplined Builder-First Culture.
              </p>
            </div>
          </motion.div>
        </FadeUp>

      </div>
    </section>
  );
}
