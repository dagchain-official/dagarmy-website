"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as any } }),
};

function RevealBlock({ children, i = 0 }: { children: React.ReactNode; i?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={fadeUp} custom={i} initial="hidden" animate={inView ? "show" : "hidden"}>
      {children}
    </motion.div>
  );
}

export default function Reality() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ background: "var(--bg)", padding: "120px 0 0" }}>
      {/* Full-width dark banner */}
      <div style={{ background: "var(--ink)", padding: "80px 5vw" }}>
          {/* Headline — full width */}
          <RevealBlock i={0}>
            <h2 className="reality-headline" style={{ color: "#fff", marginBottom: 48 }}>
              Everyone is learning AI.<br />
              <span style={{ color: "#f59e0b" }}>Almost no one</span> is building<br />
              <span className="grad-v">Companies.</span>
            </h2>
          </RevealBlock>

          {/* Body + panel in grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 460px", gap: 40, alignItems: "start" }}>
            {/* Left — body text */}
            <div>
              <RevealBlock i={2}>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "17px", lineHeight: 1.8, maxWidth: 480, marginBottom: 32 }}>
                  This movement exists to change that equation. We don&apos;t optimize for
                  content consumption. We optimize for{" "}
                  <strong style={{ color: "#fff" }}>execution.</strong>
                </p>
              </RevealBlock>

              {/* Who this is for */}
              <RevealBlock i={3}>
                <div style={{ marginBottom: 36 }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>Who this is for</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      "AI builders who are tired of just consuming content",
                      "Founders who want peers, not just instructors",
                      "Builders from India, Pakistan & Bangladesh ready to ship",
                      "Anyone who believes ownership beats employment",
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(91,75,236,0.3)", border: "1px solid rgba(91,75,236,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l1.5 1.5 3.5-3" stroke="#a89ff7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealBlock>

              {/* Quote */}
              <RevealBlock i={4}>
                <div style={{ borderLeft: "2px solid rgba(91,75,236,0.5)", paddingLeft: 20 }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>
                    &ldquo;Talent without structure becomes noise. Skill without ownership becomes dependency.&rdquo;
                  </p>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: 8, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>— The Udaan Manifesto</div>
                </div>
              </RevealBlock>
            </div>

            {/* Right — contrast panel + stats below */}
            <RevealBlock i={2}>
              <div>
                {/* Comparison table */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden", textAlign: "center", marginBottom: 12 }}>
                  {/* Header */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ padding: "14px 12px", borderRight: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "center" }}>
                      <span className="pill pill-red" style={{ fontSize: "10px", padding: "4px 10px" }}>✕ Old Way</span>
                    </div>
                    <div style={{ padding: "14px 12px", display: "flex", justifyContent: "center" }}>
                      <span className="pill pill-green" style={{ fontSize: "10px", padding: "4px 10px" }}>✓ Udaan Way</span>
                    </div>
                  </div>
                  {[
                    ["Learn AI tools", "Build AI ventures"],
                    ["Reward attendance", "Reward contribution"],
                    ["Stop at education", "Begin at execution"],
                    ["Solo freelancing", "Collaborative ownership"],
                  ].map(([bad, good], i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ padding: "13px 16px", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ color: "var(--red)", fontSize: "11px" }}>✕</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{bad}</span>
                      </div>
                      <div style={{ padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ color: "var(--green)", fontSize: "11px" }}>✓</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{good}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats below the panel */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                  {[
                    { v: "0", l: "Certificates sold" },
                    { v: "∞", l: "Collaboration potential" },
                    { v: "1M+", l: "Jobs we aim to create" },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: "18px 16px", background: "rgba(255,255,255,0.03)", textAlign: "center" }}>
                      <div style={{ fontSize: "26px", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.v}</div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginTop: 5, lineHeight: 1.4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealBlock>
          </div>
      </div>

      {/* White section below */}
      <div style={{ background: "var(--bg)", padding: "100px 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            {/* Big statement left */}
            <div>
              <RevealBlock i={0}>
                <h2 className="t-section" style={{ color: "var(--ink)" }}>
                  Not a course platform.{" "}
                  <span className="grad-v">A founder engine.</span>
                </h2>
              </RevealBlock>
              <RevealBlock i={2}>
                <p className="t-body" style={{ marginTop: 24, maxWidth: 400 }}>
                  Inside this ecosystem, builders don&apos;t sit in isolation. They validate
                  ideas together, collaborate across borders, and ship with feedback loops built in.
                </p>
              </RevealBlock>
              <RevealBlock i={3}>
                <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { icon: "→", title: "Idea Validation", sub: "Crowdsourced feedback before you build" },
                    { icon: "↺", title: "Feedback Loops", sub: "Continuous iteration with peers" },
                    { icon: "✦", title: "Accountability", sub: "Ship with momentum, not in isolation" },
                    { icon: "◎", title: "Cross-border", sub: "India · Pakistan · Bangladesh unified" },
                  ].map(f => (
                    <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg2)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{f.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--ink)" }}>{f.title}</div>
                        <div style={{ fontSize: "13px", color: "var(--sub)", marginTop: 2 }}>{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </RevealBlock>
            </div>

            {/* Right — comparison cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <RevealBlock i={1}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* NOT THIS */}
                  <div className="surface2" style={{ padding: 24 }}>
                    <span className="pill pill-red" style={{ marginBottom: 16, fontSize: "10px", padding: "4px 10px" }}>✕ Not This</span>
                    <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--ink)", marginBottom: 6 }}>Education Institute</div>
                    <div style={{ fontSize: "13px", color: "var(--sub)", marginBottom: 16, lineHeight: 1.5 }}>The old model that keeps you consuming.</div>
                    {["Passive content consumption", "Certificate as the end goal", "Instructor-led dependency", "Zero accountability systems", "No peer collaboration"].map(p => (
                      <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ color: "var(--red)", fontSize: "12px", fontWeight: 700 }}>✕</span>
                        <span style={{ fontSize: "13px", color: "var(--sub)" }}>{p}</span>
                      </div>
                    ))}
                  </div>

                  {/* YES THIS */}
                  <div style={{ background: "var(--ink)", borderRadius: "var(--r)", padding: 24 }}>
                    <span className="pill pill-green" style={{ marginBottom: 16, fontSize: "10px", padding: "4px 10px" }}>✓ Yes This</span>
                    <div style={{ fontWeight: 700, fontSize: "16px", color: "#fff", marginBottom: 6 }}>Founder Community</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: 16, lineHeight: 1.5 }}>The new model that makes you build.</div>
                    {["Active execution focus", "Ownership as the end goal", "Peer-driven accountability", "Built-in feedback systems", "Cross-border collaboration"].map(p => (
                      <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ color: "var(--green)", fontSize: "12px", fontWeight: 700 }}>✓</span>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealBlock>

              {/* The Difference */}
              <RevealBlock i={2}>
                <div className="surface" style={{ padding: 28 }}>
                  <div className="t-label" style={{ marginBottom: 14 }}>The Difference</div>
                  <div style={{ fontSize: "19px", fontWeight: 700, color: "var(--ink)", marginBottom: 20, lineHeight: 1.3 }}>
                    This is not education. It is{" "}
                    <span className="grad-v">coordinated ambition.</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {[
                      { icon: "→", label: "Side project → Venture" },
                      { icon: "✦", label: "Skill → Startup" },
                      { icon: "◎", label: "Idea → Product" },
                    ].map(t => (
                      <div key={t.label} className="pill" style={{ fontSize: "12px" }}>{t.icon} {t.label}</div>
                    ))}
                  </div>
                </div>
              </RevealBlock>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
