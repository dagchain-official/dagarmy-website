"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

export default function Vision2030() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4500); // 4.5 seconds per slide
    return () => clearInterval(interval);
  }, []);

  const slideVariants: any = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: ease } }
  };

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "80px 0", position: "relative" }}>
      <div className="wrap" style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>

        {/* HEADER */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0)} style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 700, color: "#0c0c14", marginBottom: 16, letterSpacing: "-0.01em" }}>
            Why This Movement Matters – Vision 2030
          </h2>
          <div style={{ width: 60, height: 4, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", margin: "0 auto", borderRadius: 2 }} />
        </motion.div>

        {/* HERO IMAGE */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.1)} style={{ marginBottom: 40, display: "flex", justifyContent: "center" }}>
          <img src="/images/udaan/Vision 2030/Vision.png" alt="Vision 2030 - Enable 100,000 AI Startup Founders" style={{ width: "100%", maxWidth: 800, height: "auto", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", display: "block" }} />
        </motion.div>

        {/* TOP INTRO TEXT */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.2)} style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: "16px", color: "#374151", lineHeight: 1.6, marginBottom: 8, maxWidth: 800, margin: "0 auto 8px" }}>
            Artificial intelligence is redefining how value is created, owned, and scaled. The shift is not about learning tools. It is about building systems.
          </p>
          <p style={{ fontSize: "17px", color: "#0c0c14", lineHeight: 1.6, fontWeight: 700, margin: "0 auto 16px", maxWidth: 800 }}>
            The difference in the coming decade will not be knowledge alone. <span style={{ color: "#6366f1" }}>It will be execution.</span>
          </p>
          <p style={{ fontSize: "15px", color: "#5a5a72", lineHeight: 1.6, maxWidth: 800, margin: "0 auto" }}>
            The <strong style={{ color: "#0c0c14" }}>1 Lakh Founder Mission</strong> exists because talent is widespread, but structured opportunity is limited. Many professionals, freelancers, and early entrepreneurs have ideas and skill.
          </p>
        </motion.div>

        {/* 2 COLUMNS COMPACT GRID */}
        <div className="vision-cards-grid">

          {/* LEFT CARD */}
          <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.3)} onMouseEnter={() => setHoveredCard(0)} onMouseLeave={() => setHoveredCard(null)} style={{ background: "#ffffff", border: hoveredCard === 0 ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: "32px", display: "flex", flexDirection: "column", boxShadow: hoveredCard === 0 ? "0 12px 32px rgba(99,102,241,0.08)" : "0 4px 16px rgba(0,0,0,0.03)", transform: hoveredCard === 0 ? "translateY(-4px)" : "none", transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", opacity: hoveredCard === 0 ? 1 : 0, transition: "opacity 0.4s ease" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontSize: "20px", fontWeight: 700, color: "#0c0c14", margin: 0 }}>
                What they lack is:
              </h3>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "32px", alignContent: "flex-start" }}>
              {[
                "A disciplined runway",
                "Peer accountability",
                "A contribution-driven ecosystem"
              ].map((item, i) => (
                <div key={i} className="vision-badge-item">
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(99,102,241,0.04)", padding: "12px 16px", borderRadius: 8, borderLeft: "3px solid #6366f1" }}>
                <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 700, color: "#0c0c14" }}>
                  ↳ Converts potential into <span style={{ color: "#6366f1" }}>ownership.</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.4)} onMouseEnter={() => setHoveredCard(1)} onMouseLeave={() => setHoveredCard(null)} style={{ background: "#ffffff", border: hoveredCard === 1 ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: "32px", display: "flex", flexDirection: "column", boxShadow: hoveredCard === 1 ? "0 12px 32px rgba(99,102,241,0.08)" : "0 4px 16px rgba(0,0,0,0.03)", transform: hoveredCard === 1 ? "translateY(-4px)" : "none", transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", opacity: hoveredCard === 1 ? 1 : 0, transition: "opacity 0.4s ease" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-fraunces, 'Fraunces', serif)", fontSize: "20px", fontWeight: 700, color: "#0c0c14", margin: 0 }}>
                Collaborative Community
              </h3>
            </div>

            <p style={{ fontSize: "14.5px", color: "#5a5a72", marginBottom: 4, lineHeight: 1.5 }}>
              This is where a <strong style={{ color: "#0c0c14" }}>Collaborative AI Founder Community</strong> becomes essential.
            </p>
            <p style={{ fontSize: "14px", color: "#0c0c14", fontWeight: 600, marginBottom: 16, lineHeight: 1.5 }}>
              Inside this structure:
            </p>

            <div style={{ position: "relative", minHeight: "100px", marginTop: "auto" }}>
              <AnimatePresence mode="wait">
                {activeSlide === 0 ? (
                  <motion.div key="slide0" variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ position: "absolute", width: "100%", display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
                    {[
                      "Ideas are refined through collective feedback",
                      "Early traction is strengthened through collaboration"
                    ].map((item, i) => (
                      <div key={i} className="vision-contrib-item" style={{ background: "#fafafa", border: "1px solid #f1f1f1", padding: "10px 14px", borderRadius: 8, display: "inline-flex", alignItems: "flex-start", gap: 10, transition: "all 0.2s ease", cursor: "default" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", flexShrink: 0, marginTop: 7 }} />
                        <span style={{ fontSize: "13.5px", color: "#374151", fontWeight: 600, lineHeight: 1.4 }}>{item}</span>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="slide1" variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ position: "absolute", width: "100%", display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
                    {[
                      "Execution challenges are addressed openly",
                      "Progress compounds across the network"
                    ].map((item, i) => (
                      <div key={i} className="vision-contrib-item" style={{ background: "#fafafa", border: "1px solid #f1f1f1", padding: "10px 14px", borderRadius: 8, display: "inline-flex", alignItems: "flex-start", gap: 10, transition: "all 0.2s ease", cursor: "default" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", flexShrink: 0, marginTop: 7 }} />
                        <span style={{ fontSize: "13.5px", color: "#374151", fontWeight: 600, lineHeight: 1.4 }}>{item}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slider Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
              <div style={{ width: 16, height: 4, borderRadius: 2, background: activeSlide === 0 ? "#6366f1" : "#e5e7eb", transition: "background 0.3s ease" }} />
              <div style={{ width: 16, height: 4, borderRadius: 2, background: activeSlide === 1 ? "#6366f1" : "#e5e7eb", transition: "background 0.3s ease" }} />
            </div>

          </motion.div>
        </div>

        {/* HIGHLIGHT BLOCK */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.5)} style={{ position: "relative", background: "linear-gradient(to right, rgba(99,102,241,0.03), transparent)", padding: "20px 28px", borderRadius: 10, borderLeft: "4px solid #6366f1", marginBottom: 40, maxWidth: 900, margin: "0 auto 40px" }}>
          <p style={{ fontSize: "15px", color: "#0c0c14", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            By 2030, enabling <strong style={{ color: "#6366f1" }}>100,000 AI startup founders</strong> is not a symbolic target. It represents structured accumulation of builders through repeatable execution cycles.
          </p>
        </motion.div>

        {/* BOTTOM SECTION */}
        <motion.div initial="initial" animate={inView ? "animate" : "initial"} variants={fadeUp(0.6)} style={{ textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: -20, left: "25%", right: "25%", height: 1, background: "linear-gradient(to right, transparent, rgba(229,231,235,0.7), transparent)" }} />

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#5a5a72", fontWeight: 500 }}>Learning resources will continue to expand.</p>
            </div>
            <div style={{ width: 1, height: 16, background: "#d1d5db" }} className="hide-on-mobile" />
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#0c0c14", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Structured builder ecosystems remain rare.</p>
            </div>
          </div>

          <div style={{ display: "inline-block", background: "linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04))", padding: "16px 32px", borderRadius: 32, border: "1px solid rgba(99,102,241,0.1)", maxWidth: 700 }}>
            <p style={{ fontSize: "14.5px", color: "#374151", lineHeight: 1.6, margin: 0, textAlign: "center", fontWeight: 500 }}>
              This movement matters because it shifts identity from consumption to creation and replaces <strong style={{ color: "#0c0c14", fontWeight: 700 }}>passive awareness</strong> with <strong style={{ color: "#0c0c14", fontWeight: 700 }}>accountable execution</strong>.
            </p>
          </div>
        </motion.div>

      </div >

      <style jsx>{`
        .vision-cards-grid {
          display: grid;
          grid-template-columns: minmax(320px, 420px) minmax(320px, 460px);
          justify-content: center;
          gap: 28px;
          align-items: stretch;
          margin-bottom: 56px;
        }
        @media (max-width: 900px) {
          .vision-cards-grid {
            grid-template-columns: minmax(300px, 500px);
          }
        }
        .vision-badge-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fafafa;
          border: 1px solid #e5e7eb;
          padding: 8px 14px;
          border-radius: 40px;
          font-size: 14px;
          color: #374151;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: default;
        }
        .vision-badge-item:hover {
          background: #ffffff;
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 4px 12px rgba(99,102,241,0.08);
          transform: translateY(-2px);
        }
        .vision-contrib-item:hover {
          background: #ffffff !important;
          border-color: #6366f1 !important;
          box-shadow: 0 4px 12px rgba(99,102,241,0.08) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none;
          }
        }
      `}</style>
    </section >
  );
}
