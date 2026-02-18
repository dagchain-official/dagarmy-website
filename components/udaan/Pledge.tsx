"use client";

const lines: { text: string; accent: boolean }[] = [
  { text: "I will build.",                     accent: false },
  { text: "I will support others.",            accent: false },
  { text: "I will not wait for opportunity.",  accent: false },
  { text: "I will create it.",                 accent: true  },
];

export default function Pledge() {
  return (
    <section style={{ background: "var(--bg2)", position: "relative", overflow: "hidden" }}>
      {/* Subtle dot background */}
      <div className="dot-bg" style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }} />

      {/* Soft violet glow center */}
      <div style={{
        position: "absolute",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(91,75,236,0.06) 0%, transparent 70%)",
        borderRadius: "50%",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />

      {/* Top rule */}
      <div className="rule" />

      <div style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
        <div className="wrap" style={{ maxWidth: 800, textAlign: "center" }}>

          {/* Intro */}
          <p style={{ color: "var(--sub)", fontSize: "16px", fontWeight: 500, marginBottom: 48 }}>
            Every member enters with a simple commitment:
          </p>

          {/* Pledge lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 60 }}>
            {lines.map(({ text, accent }) => (
              <p
                key={text}
                className={accent ? "t-serif grad-v" : "t-serif"}
                style={{
                  fontSize: "clamp(32px, 5vw, 72px)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.08,
                  fontWeight: 700,
                  display: "block",
                  color: accent ? undefined : "var(--ink)",
                  margin: 0,
                }}
              >
                {text}
              </p>
            ))}
          </div>

          {/* Divider line */}
          <div style={{
            height: 1,
            maxWidth: 200,
            margin: "0 auto 48px",
            background: "linear-gradient(90deg, transparent, var(--v3), transparent)",
          }} />

          {/* Sub-note */}
          <p style={{ color: "var(--sub)", fontSize: "15px", marginBottom: 40, lineHeight: 1.7 }}>
            This is not symbolic. It defines the culture.
          </p>

          {/* CTA */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-pledge"))}
            className="btn btn-v"
            style={{ padding: "15px 48px", fontSize: "15px", cursor: "pointer" }}
          >
            Take the Pledge
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1 7.5h13M8 2l6 5.5-6 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="rule" />
    </section>
  );
}
