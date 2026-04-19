"use client";
import React, { useEffect, useRef } from "react";

const PERKS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        <path d="M7 8h2m2 0h6M7 11h4"/>
      </svg>
    ),
    title: "The Automation Vault",
    subtitle: "4,000+ n8n Workflows",
    points: [
      "Searchable library of 4,000+ pre-built n8n workflows for Lead Gen, AI Agents, Crypto Tracking & SaaS Operations",
      "One-click import - ready to deploy directly into your n8n instance",
    ],
    accent: "#6366f1",
    bg: "rgba(99,102,241,0.07)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: "The Master Prompt Database",
    subtitle: "Elite AI Super Prompts",
    points: [
      "Private, constantly updated repository of high-level prompts for AI content creation",
      "Industry-specific: SaaS code, photorealistic marketing assets, complex data analysis",
    ],
    accent: "#8b5cf6",
    bg: "rgba(139,92,246,0.07)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Mentorship & Recorded Training",
    subtitle: "1-on-1 War Room Access",
    points: [
      "Direct access to industry veterans for personalized guidance on career paths or startup building",
      "Lifetime vault access to all previous live sessions, masterclasses, and mentorship recordings",
    ],
    accent: "#10b981",
    bg: "rgba(16,185,129,0.07)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: "Exclusive Operations",
    subtitle: "Hackathons & VIP Lectures",
    points: [
      "Lieutenants-Only hackathons with cash prize pools funded by global Business Partners",
      "Live Q&A sessions with Silicon Valley founders, Blockchain architects, and AI pioneers",
    ],
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.07)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Private Alpha Community",
    subtitle: "Discord · Telegram · WhatsApp",
    points: [
      "Dedicated Lieutenants-Only multi-channel community for real-time alpha",
      "First-look intel: breaking tech news, alpha-level job leads, and early-access beta tools",
    ],
    accent: "#ec4899",
    bg: "rgba(236,72,153,0.07)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
      </svg>
    ),
    title: "The Lieutenant's Spotlight",
    subtitle: "Free Marketing & Visibility",
    points: [
      "Weekly feature of your project or profile on DAGARMY's main website and social channels (X/LinkedIn)",
      "Direct exposure to our network of potential employers and venture partners",
    ],
    accent: "#0ea5e9",
    bg: "rgba(14,165,233,0.07)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Beta-Squad Access",
    subtitle: "Early Testing & Feedback Loop",
    points: [
      "Be first to use internal DAGARMY tools and partner software before general release",
      "Shape the development of the tools you use - direct feedback to dev teams",
    ],
    accent: "#ef4444",
    bg: "rgba(239,68,68,0.07)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
      </svg>
    ),
    title: "Demo Day Finals",
    subtitle: "Road to Demo Day - Udaan Program",
    points: [
      "Fast-track access to the 3-stage Udaan selection pipeline: Screening → Validation & Mentor Review → Demo Day Finals, filtering 1,000+ applicants to a curated founder cohort",
      "Your MVP becomes your proof - Demo Day Finals are earned, not attended. Execution becomes reputation and your traction becomes your signal to investors and partners",
    ],
    accent: "#14b8a6",
    bg: "rgba(20,184,166,0.07)",
  },
];

export default function LieutenantUpgradeModal({ onClose, onConfirm, loading }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  /* ── neumorphic palette ── */
  const bg = "#eef0f5";
  const shadow = (inset = false) =>
    inset
      ? "inset 4px 4px 10px rgba(166,180,200,0.6), inset -4px -4px 10px rgba(255,255,255,0.9)"
      : "8px 8px 20px rgba(166,180,200,0.55), -8px -8px 20px rgba(255,255,255,0.95)";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: bg,
          borderRadius: "28px",
          boxShadow: "20px 20px 50px rgba(166,180,200,0.6), -20px -20px 50px rgba(255,255,255,0.95)",
          width: "100%", maxWidth: "780px",
          maxHeight: "90vh",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "32px 36px 24px",
            borderBottom: "1px solid rgba(99,102,241,0.1)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
            <div>
              {/* badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "5px 12px", borderRadius: "20px", marginBottom: "12px",
                background: bg,
                boxShadow: shadow(),
                fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "0.8px", textTransform: "uppercase",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#6366f1"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/></svg>
                DAG LIEUTENANT
              </div>
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
                The Lieutenant's War Chest
              </h2>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                8 elite perks unlocked the moment you upgrade
              </p>
            </div>

            {/* price badge */}
            <div style={{
              flexShrink: 0,
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "14px 20px", borderRadius: "18px",
              background: bg,
              boxShadow: shadow(),
            }}>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", letterSpacing: "0.5px" }}>ONE-TIME</span>
              <span style={{ fontSize: "28px", fontWeight: "900", color: "#6366f1", lineHeight: 1.1 }}>$149</span>
              <span style={{ fontSize: "10px", fontWeight: "600", color: "#94a3b8" }}>LIFETIME ACCESS</span>
            </div>
          </div>

          {/* close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "20px", right: "20px",
              width: "36px", height: "36px", borderRadius: "50%",
              border: "none", cursor: "pointer",
              background: bg, boxShadow: shadow(),
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#94a3b8", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#0f172a"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* ── Perks grid (scrollable) ── */}
        <div
          style={{
            overflowY: "auto", flex: 1,
            padding: "28px 36px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
            gap: "16px",
          }}
        >
          {PERKS.map((perk, i) => (
            <div
              key={i}
              style={{
                background: bg,
                borderRadius: "18px",
                padding: "20px",
                boxShadow: shadow(),
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "12px 12px 28px rgba(166,180,200,0.65), -12px -12px 28px rgba(255,255,255,0.98)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = shadow();
              }}
            >
              {/* icon + title row */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "13px", flexShrink: 0,
                  background: bg, boxShadow: shadow(),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: perk.accent,
                }}>
                  {perk.icon}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", lineHeight: 1.3 }}>{perk.title}</div>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: perk.accent, marginTop: "2px" }}>{perk.subtitle}</div>
                </div>
              </div>

              {/* bullet points */}
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {perk.points.map((pt, j) => (
                  <div key={j} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
                      background: bg, boxShadow: shadow(),
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={perk.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "12px", color: "#475569", lineHeight: "1.55", fontWeight: "450" }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer CTA ── */}
        <div
          style={{
            padding: "20px 36px 28px",
            borderTop: "1px solid rgba(99,102,241,0.1)",
            flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", fontWeight: "500", maxWidth: "360px" }}>
            One-time payment of <strong style={{ color: "#6366f1" }}>$149</strong>. Lifetime access.
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={onClose}
              style={{
                padding: "11px 22px", borderRadius: "12px", border: "none",
                background: bg, boxShadow: shadow(),
                fontSize: "13px", fontWeight: "700", color: "#64748b",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = shadow(true); e.currentTarget.style.color = "#0f172a"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = shadow(); e.currentTarget.style.color = "#64748b"; }}
            >
              Maybe Later
            </button>
            <button
              onClick={onConfirm}
              disabled={!!loading}
              style={{
                padding: "11px 28px", borderRadius: "12px", border: "none",
                background: loading ? "#a5b4fc" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: loading ? "none" : "6px 6px 16px rgba(99,102,241,0.35), -2px -2px 8px rgba(255,255,255,0.8)",
                fontSize: "13px", fontWeight: "800", color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: "8px",
                transition: "all 0.2s", letterSpacing: "0.2px",
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = "8px 8px 20px rgba(99,102,241,0.45), -2px -2px 10px rgba(255,255,255,0.9)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.boxShadow = "6px 6px 16px rgba(99,102,241,0.35), -2px -2px 8px rgba(255,255,255,0.8)"; e.currentTarget.style.transform = "translateY(0)"; } }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              {loading ? "Redirecting..." : "Upgrade to Lieutenant - $149"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
