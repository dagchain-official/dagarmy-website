"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

function useCounter(to: number) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        let start: number | null = null;
        const dur = 2200;
        const tick = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return { val, ref };
}

function Reveal({ children, delay = 0, y = 24, style }: {
  children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease, delay }}
      style={style}
    >{children}</motion.div>
  );
}

const PATHS = [
  {
    num: "01", label: "Build",
    condition: "Ready to build your AI startup prototype and test it in the market",
    cta: "Apply for Udaan Cohort",
    accent: "#6366f1",
  },
  {
    num: "02", label: "Rank",
    condition: "Prepared to enter the Founder Track and earn your rank through contribution",
    cta: "Start Your Application",
    accent: "#8b5cf6",
  },
  {
    num: "03", label: "Contribute",
    condition: "Believe you can contribute to the 1 Lakh Founder Mission through real work",
    cta: "Join Builder Circle",
    accent: "#a78bfa",
  },
];

export default function Vision2030() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const c1 = useCounter(100000);
  const c2 = useCounter(2030);
  const c3 = useCounter(4);

  const [hovPath, setHovPath] = useState<number | null>(null);

  return (
    <section ref={sectionRef} style={{
      background: "#ffffff",
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-dm,'DM Sans',sans-serif)",
    }}>
      {/* Subtle dot grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.055) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }} />
      {/* Ambient orb */}
      <motion.div style={{
        position: "absolute", top: "-8%", right: "-12%",
        width: "60vw", height: "60vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0, y: parallaxY,
      }} />

      {/* ═══════════════════════════════════════════════════
          HERO ROW - Vision 2030 Masthead + Opening Statement
      ═══════════════════════════════════════════════════ */}
      <div className="v2030-hero-row" style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "120px 64px 0",
        position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 520px",
        gap: "0 80px",
        alignItems: "end",
      }}>
        {/* Masthead */}
        <Reveal>
          <div style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.28em",
            textTransform: "uppercase", color: "#6366f1",
            marginBottom: 20,
          }}>The Movement</div>
            <h1 style={{
              fontFamily: "'Nasalization',sans-serif",
              fontSize: "clamp(96px, 14vw, 200px)",
              fontWeight: 400, lineHeight: 0.86,
              letterSpacing: "-0.04em",
              margin: "0 0 0 -5px",
              background: "linear-gradient(140deg, #07070f 0%, #2d2d60 55%, #6366f1 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Vision<br />2030.
            </h1>
        </Reveal>

        {/* Opening statement */}
        <Reveal delay={0.12}>
          <div style={{ paddingBottom: 12 }}>
            <p style={{
              fontSize: 18, lineHeight: 1.85, color: "#4a4a68",
              margin: "0 0 20px",
            }}>
              Artificial intelligence is not simply another skill to learn. It is a
              structural layer reshaping how products are built, how services are
              delivered, and how value is created.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.85, color: "#4a4a68", margin: 0 }}>
              The real difference is between those who{" "}
              <strong style={{ color: "#07070f", fontWeight: 700 }}>choose to build with it</strong>
              {" "}and those who remain observers. The transition is now.
            </p>
          </div>
        </Reveal>
      </div>

      {/* ═══════════════════════════════════════════════════
          BENTO GRID ROW 1 - Stat + Landscape Image (no purple card here)
      ═══════════════════════════════════════════════════ */}
      <div className="v2030-bento-row1" style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "56px 64px 0",
        position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        gap: 16,
      }}>
        {/* CELL A - 100,000 stat */}
        <Reveal>
            <div style={{
              background: "linear-gradient(135deg, #f8f8ff 0%, #f0f0fa 100%)",
              border: "1px solid rgba(99,102,241,0.1)",
              borderRadius: 20,
              padding: "36px 32px",
              height: "100%",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              overflow: "hidden",
            }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.24em",
                textTransform: "uppercase", color: "#6366f1", marginBottom: 20,
              }}>Target</div>
              <div>
                <div style={{
                  fontFamily: "'Nasalization',sans-serif",
                  fontSize: "clamp(36px, 4.5vw, 56px)",
                  fontWeight: 400, lineHeight: 1, color: "#07070f",
                  letterSpacing: "-0.03em", marginBottom: 12,
                  whiteSpace: "nowrap",
                }}>
                  <span ref={c1.ref}>{c1.val.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 12, color: "#8888a8", fontWeight: 500, letterSpacing: "0.04em", lineHeight: 1.5 }}>
                  AI Startup Founders<br />by 2030
                </div>
              </div>
            </div>
        </Reveal>

        {/* CELL B - Vision image, full landscape */}
        <Reveal delay={0.06}>
          <div style={{
            borderRadius: 20,
            overflow: "hidden",
            position: "relative",
            height: 320,
          }}>
            <img
              src="/images/udaan/Vision 2030/Vision.png"
              alt="Vision 2030"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
            />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(to top, rgba(7,7,15,0.75) 0%, transparent 100%)",
              padding: "40px 36px 28px",
            }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.65)",
                marginBottom: 8,
              }}>DAG Army × DAGChain</div>
              <div style={{ fontSize: 16, color: "#ffffff", fontWeight: 600, lineHeight: 1.4 }}>
                The Prestige Layer of South Asia's AI Startup Movement
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ═══════════════════════════════════════════════════
          BENTO GRID ROW 2 - Year + Cycle + Mission + Community + Purple card
      ═══════════════════════════════════════════════════ */}
      <div className="v2030-bento-row2" style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "16px 64px 0",
        position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: "180px 180px 1fr 1fr 280px",
        gap: 16,
      }}>
          {/* CELL - 2030 */}
          <Reveal>
            <div style={{
              background: "#07070f",
              borderRadius: 20,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.24em",
                textTransform: "uppercase", color: "rgba(163,163,255,0.6)",
                position: "absolute", top: 24,
              }}>Target year</div>
              <div style={{
                fontFamily: "'Nasalization',sans-serif",
                fontSize: "clamp(42px, 4.5vw, 62px)",
                fontWeight: 400, lineHeight: 1, color: "#ffffff",
                letterSpacing: "-0.02em",
                transform: "rotate(-90deg)",
                whiteSpace: "nowrap",
              }}>
                <span ref={c2.ref}>{c2.val}</span>
              </div>
            </div>
          </Reveal>

        {/* CELL - 4× */}
        <Reveal delay={0.04}>
          <div style={{
            background: "linear-gradient(135deg, #faf8ff 0%, #f3f0ff 100%)",
            border: "1px solid rgba(99,102,241,0.12)",
            borderRadius: 20, padding: "40px 32px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            height: "100%",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.24em",
              textTransform: "uppercase", color: "#6366f1",
            }}>Cycle</div>
            <div>
              <div style={{
                fontFamily: "'Nasalization',sans-serif",
                fontSize: "clamp(38px, 4vw, 58px)",
                fontWeight: 400, lineHeight: 1, color: "#07070f",
                letterSpacing: "-0.02em", marginBottom: 8,
              }}>
                <span ref={c3.ref}>{c3.val}</span>×
              </div>
              <div style={{ fontSize: 11, color: "#9090b8", fontWeight: 500 }}>
                Week builder cycle
              </div>
            </div>
          </div>
        </Reveal>

        {/* CELL - 1 Lakh Mission */}
        <Reveal delay={0.08}>
          <div style={{
            background: "#ffffff",
            border: "1px solid rgba(99,102,241,0.09)",
            borderRadius: 20, padding: "40px 40px",
            height: "100%",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              marginBottom: 28,
            }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.24em",
                textTransform: "uppercase", color: "#6366f1",
              }}>The Mission</div>
                <div style={{
                  fontFamily: "'Nasalization',sans-serif",
                  fontSize: 64, fontWeight: 400, lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: "1px rgba(99,102,241,0.1)",
                letterSpacing: "-0.04em",
                userSelect: "none",
              }}>1L</div>
            </div>
              <h3 style={{
                fontFamily: "'Nasalization',sans-serif",
                fontSize: "clamp(18px, 1.8vw, 24px)",
                fontWeight: 400, lineHeight: 1.2,
                letterSpacing: "-0.01em", color: "#07070f",
                margin: "0 0 20px",
              }}>
                1 Lakh Founder Mission.
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { n: "01", t: "Working professionals with validated ideas" },
                { n: "02", t: "Disciplined runway from idea to prototype" },
                { n: "03", t: "Peer accountability inside a builder cohort" },
                { n: "04", t: "Contribution-driven ownership ecosystem" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "12px 0",
                  borderTop: i > 0 ? "1px solid rgba(99,102,241,0.06)" : "none",
                }}>
                  <span style={{
                    fontFamily: "'Nasalization',sans-serif",
                    fontSize: 10, color: "#6366f1",
                    letterSpacing: "0.06em", flexShrink: 0,
                    opacity: 0.5,
                  }}>{item.n}</span>
                  <span style={{
                    fontSize: 13, lineHeight: 1.5, color: "#44445a", fontWeight: 500,
                  }}>{item.t}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* CELL - Collaborative AI Community */}
        <Reveal delay={0.12}>
          <div style={{
            background: "#ffffff",
            border: "1px solid rgba(99,102,241,0.09)",
            borderRadius: 20, padding: "40px 40px",
            height: "100%",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.24em",
              textTransform: "uppercase", color: "#6366f1",
              marginBottom: 28,
            }}>Operating Principle</div>
              <h3 style={{
                fontFamily: "'Nasalization',sans-serif",
                fontSize: "clamp(18px, 1.8vw, 24px)",
                fontWeight: 400, lineHeight: 1.2,
                letterSpacing: "-0.01em", color: "#07070f",
                margin: "0 0 24px",
              }}>
                Collaborative AI<br />Founder Community.
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                "Ideas refined through collective feedback",
                "Traction strengthened from the start",
                "Challenges addressed openly",
                "No founder struggles in silence",
                "Network grows stronger with every builder",
              ].map((text, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "11px 0",
                  borderTop: i > 0 ? "1px solid rgba(99,102,241,0.06)" : "none",
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 2,
                  }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4h5M4 1.5l2.5 2.5L4 6.5" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, lineHeight: 1.55, color: "#44445a", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          </Reveal>

        {/* CELL - Purple "Compounding impact" card (was Row 1 CELL C) */}
        <Reveal delay={0.14}>
          <div style={{
            background: "linear-gradient(160deg, #5457e8 0%, #7c3aed 100%)",
            borderRadius: 20,
            padding: "40px 32px",
            height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.24em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
              marginBottom: 20,
            }}>Impact</div>
            <div>
              <div style={{
                fontFamily: "'Nasalization',sans-serif",
                fontSize: "clamp(20px, 2.2vw, 28px)",
                fontWeight: 400, lineHeight: 1.25,
                color: "#ffffff",
                marginBottom: 16,
                letterSpacing: "-0.01em",
              }}>
                Not a symbolic number.<br />Compounding impact.
              </div>
              <p style={{
                fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.65)",
                margin: 0,
              }}>
                Structured builder cycles shifting identity from consumption to creation,
                building ownership-driven founders across South Asia.
              </p>
            </div>
          </div>
        </Reveal>
        </div>

        {/* ═══════════════════════════════════════════════════
            THE PRINCIPLE - Full-width editorial quote strip
      ═══════════════════════════════════════════════════ */}
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "16px 64px 0",
        position: "relative", zIndex: 1,
      }}>
        <Reveal>
          <div className="v2030-principle-strip" style={{
            background: "linear-gradient(135deg, #07070f 0%, #1a1a3e 100%)",
            borderRadius: 20,
            padding: "72px 80px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 80px",
            alignItems: "center",
          }}>
            {/* Left - label + quote */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 14, marginBottom: 40,
              }}>
                <div style={{ height: 2, width: 32, background: "linear-gradient(90deg,#6366f1,#a78bfa)", flexShrink: 0 }} />
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.28em",
                  textTransform: "uppercase", color: "rgba(163,163,255,0.7)",
                }}>The Principle</span>
              </div>
              <blockquote style={{ margin: 0 }}>
                  <p style={{
                    fontFamily: "'Nasalization',sans-serif",
                    fontStyle: "normal", fontWeight: 400,
                    fontSize: "clamp(18px, 2vw, 28px)",
                    lineHeight: 1.5, color: "rgba(255,255,255,0.9)",
                    margin: "0 0 16px",
                  }}>
                    "Learning tools will always be available.
                    Structured builder ecosystems are rare.
                  </p>
                  <p style={{
                    fontFamily: "'Nasalization',sans-serif",
                    fontStyle: "normal", fontWeight: 400,
                    fontSize: "clamp(18px, 2vw, 28px)",
                    lineHeight: 1.5,
                    background: "linear-gradient(120deg,#818cf8,#c4b5fd)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    margin: 0,
                  }}>
                    This movement replaces passive awareness with accountable action."
                  </p>
                </blockquote>
            </div>

            {/* Right - 3 pillars + description */}
            <div>
              <div className="v2030-pillars" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 40 }}>
                {[
                  { label: "Structured", sub: "Ecosystem" },
                  { label: "Curated", sub: "Selection" },
                  { label: "Execution", sub: "Focused" },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, padding: "20px 18px",
                  }}>
                      <div style={{
                        fontFamily: "'Nasalization',sans-serif",
                        fontSize: 15, fontWeight: 400, color: "#818cf8",
                        marginBottom: 6,
                        letterSpacing: "0.01em",
                      }}>{item.label}</div>
                    <div style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
                      textTransform: "uppercase", color: "rgba(163,163,255,0.45)",
                    }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <p style={{
                fontSize: 15, lineHeight: 1.9, color: "rgba(255,255,255,0.55)",
                margin: "0 0 16px",
              }}>
                It turns ambition into measurable execution - and execution into a credential
                that compounds in credibility over time.
              </p>
              <p style={{
                fontSize: 15, lineHeight: 1.9,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 600, margin: 0,
              }}>
                Udaan is not an information program. It is a structured entry into a
                serious AI Startup Ecosystem.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ═══════════════════════════════════════════════════
            YOUR NEXT STEP + CHOOSE YOUR PATH - Side by side
        ═══════════════════════════════════════════════════ */}
        <div className="v2030-nextstep-row" style={{
          maxWidth: 1400, margin: "0 auto",
          padding: "16px 64px 0",
          position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: 16,
          alignItems: "stretch",
        }}>
          {/* Left - Your Next Step narrative */}
          <Reveal style={{ height: "100%" }}>
            <div style={{
              background: "linear-gradient(180deg, #f8f8ff 0%, #f0f0fa 100%)",
              border: "1px solid rgba(99,102,241,0.1)",
              borderRadius: 20,
                padding: "72px 64px",
                height: "100%",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
            <div>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.28em",
                textTransform: "uppercase", color: "#6366f1", marginBottom: 28,
              }}>Your Next Step</div>
                <h2 style={{
                  fontFamily: "'Nasalization',sans-serif",
                  fontSize: "clamp(32px, 3.5vw, 52px)",
                  fontWeight: 400, lineHeight: 1.1,
                  letterSpacing: "-0.02em", color: "#07070f",
                  margin: "0 0 36px",
                }}>
                  Into the<br />
                  <span style={{ color: "#6366f1" }}>AI Startup</span><br />
                  Ecosystem.
                </h2>
              <p style={{
                fontSize: 15, lineHeight: 1.9, color: "#5a5a78",
                margin: "0 0 24px",
              }}>
                You have read about the ranks. You have seen the pathway. You understand
                the difference between learning tools and building real solutions.
              </p>
              <p style={{
                fontSize: 15, lineHeight: 1.9, color: "#5a5a78",
                margin: "0 0 32px",
              }}>
                Built for people who want to launch, validate, and scale responsibly.
                Every cohort is curated through a defined{" "}
                <strong style={{ color: "#6366f1", fontWeight: 700 }}>Builder Selection Process</strong>.
                Seats are limited - not for marketing, but to protect focus and mentorship depth.
              </p>
            </div>
            <div style={{
              borderLeft: "3px solid #6366f1", paddingLeft: 18,
            }}>
              <p style={{
                fontSize: 14, lineHeight: 1.85, color: "#44445a", fontWeight: 600,
                margin: 0,
              }}>
                If you are ready to build an MVP, validate with real users, and step into
                structured founder accountability -{" "}
                <span style={{ color: "#6366f1" }}>this is where that journey begins.</span>
              </p>
            </div>
          </div>
        </Reveal>

          {/* Right - Choose Your Path + Closing Declaration stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Reveal delay={0.04}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.28em",
                textTransform: "uppercase", color: "#a0a0c4",
                paddingLeft: 4,
              }}>Choose Your Path</div>
            </Reveal>
            {PATHS.map((item, i) => (
              <Reveal key={i} delay={0.06 + i * 0.08}>
                <div
                  onMouseEnter={() => setHovPath(i)}
                  onMouseLeave={() => setHovPath(null)}
                  style={{
                    background: hovPath === i ? "#ffffff" : "#fafafa",
                    border: `1px solid ${hovPath === i ? item.accent + "44" : "rgba(99,102,241,0.08)"}`,
                    borderRadius: 16,
                    padding: "28px 32px",
                    display: "grid",
                    gridTemplateColumns: "48px 1fr auto",
                    gap: "0 24px",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)",
                    boxShadow: hovPath === i ? `0 16px 48px rgba(99,102,241,0.10)` : "none",
                    transform: hovPath === i ? "translateX(6px)" : "translateX(0)",
                  }}
                >
                  <div style={{
                    fontFamily: "'Nasalization',sans-serif",
                    fontSize: 13, color: item.accent,
                    letterSpacing: "0.06em", opacity: hovPath === i ? 1 : 0.45,
                    transition: "opacity 0.3s",
                  }}>{item.num}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.accent, flexShrink: 0 }} />
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: item.accent,
                      }}>{item.label}</span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#44445a", margin: 0, fontWeight: 500 }}>{item.condition}</p>
                  </div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      opacity: hovPath === i ? 1 : 0,
                      transition: "opacity 0.3s", whiteSpace: "nowrap",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke={item.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

                    </svg>
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Closing declaration - fills remaining height to align with left card bottom */}
            <Reveal delay={0.28} style={{ flex: 1 }}>
              <div className="v2030-closing-decl" style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 48px",
                alignItems: "center",
                padding: "48px 56px",
                background: "linear-gradient(135deg, #fafafe 0%, #f4f0ff 100%)",
                border: "1px solid rgba(99,102,241,0.1)",
                borderRadius: 20,
                position: "relative",
                overflow: "hidden",
                height: "100%",
              }}>
                {/* Ghost watermark */}
                <div style={{
                  position: "absolute", right: -10, top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "'Nasalization',sans-serif",
                  fontSize: "clamp(60px, 8vw, 120px)",
                  fontWeight: 400, lineHeight: 1,
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(99,102,241,0.06)",
                  letterSpacing: "-0.04em",
                  userSelect: "none", pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}>ACTION</div>

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ height: 2, width: 40, background: "linear-gradient(90deg,#6366f1,#a78bfa)", marginBottom: 28 }} />
                  <p style={{
                    fontFamily: "'Nasalization',sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(16px, 1.8vw, 26px)",
                    lineHeight: 1.35, color: "#07070f",
                    margin: "0 0 10px",
                    letterSpacing: "-0.02em",
                  }}>
                    The ecosystem is structured.<br />The pathway is clear.
                  </p>
                  <p style={{
                    fontFamily: "'Nasalization',sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(16px, 1.8vw, 26px)",
                    lineHeight: 1.35,
                    letterSpacing: "-0.02em",
                    background: "linear-gradient(120deg,#6366f1,#a78bfa)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    margin: 0,
                  }}>
                    The next move belongs to you.
                  </p>
                </div>

                <div style={{ position: "relative", zIndex: 1 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.9, color: "#6060a8", margin: "0 0 6px" }}>
                    This is your invitation to
                  </p>
                  <p style={{
                    fontFamily: "'Nasalization',sans-serif",
                    fontSize: "clamp(13px, 1.4vw, 20px)",
                    fontWeight: 400,
                    background: "linear-gradient(120deg,#6366f1,#a78bfa)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    margin: "0 0 28px", lineHeight: 1.4, letterSpacing: "-0.01em",
                  }}>
                    move from intention to action.
                  </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))} style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        color: "#ffffff", textDecoration: "none",
                        fontFamily: "var(--font-dm,'DM Sans',sans-serif)",
                        fontSize: 13, fontWeight: 700, letterSpacing: "0.02em",
                        padding: "12px 24px", borderRadius: 100,
                        boxShadow: "0 8px 24px rgba(99,102,241,0.28)",
                        border: "none", cursor: "pointer",
                      }}>
                        Apply Now
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <a href="/blog" style={{
                        display: "inline-flex", alignItems: "center",
                        background: "transparent", color: "#6366f1", textDecoration: "none",
                        fontFamily: "var(--font-dm,'DM Sans',sans-serif)",
                        fontSize: 13, fontWeight: 700,
                        padding: "12px 24px", borderRadius: 100,
                        border: "1.5px solid rgba(99,102,241,0.25)",
                      }}>
                        Learn More
                      </a>
                    </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* bottom spacer */}
        <div style={{ height: 120 }} />

    </section>
  );
}
