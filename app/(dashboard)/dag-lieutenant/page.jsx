"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

/* ── Neumorphic tokens ── */
const BG     = "#eef0f5";
const S_UP   = "6px 6px 14px rgba(0,0,0,0.12), -5px -5px 12px rgba(255,255,255,0.95)";
const S_UP_L = "10px 10px 24px rgba(0,0,0,0.13), -8px -8px 20px rgba(255,255,255,0.97)";
const S_IN   = "inset 5px 5px 12px rgba(0,0,0,0.11), inset -4px -4px 10px rgba(255,255,255,0.9)";
const PURPLE = "#6366f1";

/* ── Perks data ── */
const PERKS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: "20% Direct Sales Commission",
    subtitle: "Double the Soldier Rate",
    points: [
      "Earn 20% commission on every direct referral purchase — DAGChain nodes, DAGGPT credits, validator nodes, and LT upgrades",
      "DAG Soldier earns only 10%. As a Lieutenant you earn 2× more on every direct sale your network makes",
    ],
    accent: "#6366f1",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: "1,000 DAG Points on Referral Join",
    subtitle: "2× the Soldier Referral Bonus",
    points: [
      "Earn 1,000 DAG Points every time someone joins DAGARMY using your referral code — soldiers earn only 500",
      "Plus earn another 1,000 points if your direct referral upgrades to DAG Lieutenant",
    ],
    accent: "#8b5cf6",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    title: "50 DAG Points per $1 Spent",
    subtitle: "Spend-Based Earning on Direct Referrals",
    points: [
      "Earn 50 DAG Points for every $1 spent by your direct (Level 1) referrals on any purchase",
      "DAG Soldiers earn only 25 pts per $1 — your spend-based earning rate is doubled as a Lieutenant",
    ],
    accent: "#10b981",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: "DAG Army Elite Pool",
    subtitle: "Lieutenant-Exclusive · Launches at MainNet",
    points: [
      "Exclusive access to the Elite Pool — funded by 50% of all DAGChain transaction fees at MainNet launch",
      "Proportional share distributed among all active Lieutenants. DAG Soldiers are not eligible for this pool",
    ],
    accent: "#f59e0b",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Fortune 500 Pool — Full Access",
    subtitle: "Monthly DAGGPT Revenue Share",
    points: [
      "Share in 10% of monthly DAGGPT revenue, split equally among all enrolled members who meet the $500 self-purchase requirement",
      "Both Soldiers and Lieutenants are eligible — but Lieutenants earn more overall due to higher commission and referral rates",
    ],
    accent: "#ec4899",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "2× Social Mission Bonus",
    subtitle: "Double Points on Every Task",
    points: [
      "Every social mission (likes, shares, videos, community tasks) earns double DAG Points compared to a Soldier",
      "Example: a Soldier earns 50 pts for creating a Short — a Lieutenant earns 100 pts for the exact same task",
    ],
    accent: "#0ea5e9",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "3% + 2% Deep Network Commissions",
    subtitle: "Earn 3 Levels Deep",
    points: [
      "Earn 3% on Level 2 purchases (referrals of your referrals) and 2% on Level 3 purchases across your entire downline",
      "Your referral network compounds — every person in your chain who buys generates passive commission income for you",
    ],
    accent: "#ef4444",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Priority Status & Early Access",
    subtitle: "Lieutenant Badge + Beta Features",
    points: [
      "Your profile is marked as DAG Lieutenant — visible to the entire DAGARMY network with a verified elite badge",
      "First access to new DAGARMY platform features, beta tools, and partner product launches before general rollout",
    ],
    accent: "#14b8a6",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "149 DGCC Coins — Auto-Staked on DAGChain",
    subtitle: "Earn APY in DGCC Coins",
    points: [
      "Upon upgrade, 149 DGCC Coins are automatically staked on the DAGChain network on your behalf — no manual action required",
      "Earn APY paid in DGCC Coins: 1 Year → 12% APY · 2 Years → 18% APY · 3 Years → 24% APY. Choose your lock duration at checkout",
    ],
    accent: "#f59e0b",
  },
];

/* ── Stat tiles ── */
const STATS = [
  { value: "20%", label: "L1 Sales Rewards" },
  { value: "1,000", label: "pts per Referral Join" },
  { value: "50", label: "pts per $1 Spent" },
  { value: "$149", label: "One-Time, Lifetime" },
];

function PerkCard({ perk, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: BG,
        borderRadius: "20px",
        padding: "24px",
        boxShadow: hovered ? S_UP_L : S_UP,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        animation: `nm-up 0.4s ease-out ${index * 0.06}s both`,
        cursor: "default",
        borderTop: hovered ? `2px solid ${perk.accent}22` : "2px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
        <div style={{
          width: "50px", height: "50px", borderRadius: "15px", flexShrink: 0,
          background: BG, boxShadow: S_UP,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: perk.accent,
        }}>
          {perk.icon}
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", lineHeight: 1.3 }}>{perk.title}</div>
          <div style={{ fontSize: "11.5px", fontWeight: "700", color: perk.accent, marginTop: "3px" }}>{perk.subtitle}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {perk.points.map((pt, j) => (
          <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
              background: BG, boxShadow: S_UP,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke={perk.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: "12.5px", color: "#475569", lineHeight: "1.6", fontWeight: "450" }}>{pt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DagLieutenantPage() {
  const { userProfile } = useAuth();
  const [userData, setUserData] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dagarmy_user");
    if (stored) {
      try { setUserData(JSON.parse(stored)); } catch {}
    }
  }, []);

  const isLieutenant =
    userProfile?.tier === "DAG_LIEUTENANT" ||
    userProfile?.tier === "DAG LIEUTENANT";

  const handleUpgrade = async () => {
    const uid  = userProfile?.id  || userData?.id;
    const mail = userProfile?.email || userData?.email;
    if (!uid || !mail) return;
    setStripeLoading(true);
    try {
      const res  = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, userEmail: mail, test: false }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Could not start checkout. Please try again.");
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", padding: "32px 36px", background: BG, minHeight: "100vh", boxSizing: "border-box" }}>
      <style>{`
        @keyframes nm-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-6px); } }
        @keyframes shimmer { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
      `}</style>

      {/* ── Hero Banner ── */}
      <div style={{
        background: BG, borderRadius: "28px", boxShadow: S_UP_L,
        padding: "52px 48px", marginBottom: "32px",
        animation: "nm-up 0.4s ease-out 0.06s both",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative embossed circles */}
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", boxShadow: S_UP, opacity: 0.5, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", right: "180px", width: "160px", height: "160px", borderRadius: "50%", boxShadow: S_UP, opacity: 0.35, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "48px", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "6px 14px", borderRadius: "20px", marginBottom: "20px",
            background: BG, boxShadow: S_UP,
            fontSize: "11px", fontWeight: "800", color: PURPLE, letterSpacing: "1px", textTransform: "uppercase",
            animation: "shimmer 3s ease-in-out infinite",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill={PURPLE}><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/></svg>
            Elite Tier — DAG Lieutenant
          </div>

          <h2 style={{ fontSize: "38px", fontWeight: "900", color: "#0f172a", margin: "0 0 16px", letterSpacing: "-1px", lineHeight: 1.15 }}>
            Built for Builders.<br/>
            <span style={{ color: PURPLE }}>Not just Learners.</span>
          </h2>

          <p style={{ fontSize: "16px", color: "#475569", lineHeight: "1.75", margin: "0 0 12px", fontWeight: "450", maxWidth: "580px" }}>
            DAG Lieutenant is for people who refuse to cap their potential. You're not here to consume —
            you're here to <strong style={{ color: "#0f172a", fontWeight: "700" }}>build products, lead teams, and shape the future</strong> of tech and finance.
          </p>
          <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.7", margin: "0 0 32px", fontWeight: "450", maxWidth: "560px" }}>
            While others are still learning the basics, Lieutenants are already shipping, automating,
            collaborating, and getting noticed. This isn't a subscription — it's a <strong style={{ color: "#0f172a", fontWeight: "700" }}>commitment to your own growth</strong>.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            {isLieutenant ? (
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "14px 28px", borderRadius: "14px",
                background: BG, boxShadow: S_IN,
                fontSize: "14px", fontWeight: "800", color: PURPLE,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                You are a DAG Lieutenant
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={stripeLoading}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "15px 32px", borderRadius: "14px", border: "none",
                  background: stripeLoading ? "#a5b4fc" : `linear-gradient(135deg, ${PURPLE} 0%, #8b5cf6 100%)`,
                  boxShadow: stripeLoading ? "none" : `8px 8px 20px rgba(99,102,241,0.38), -3px -3px 10px rgba(255,255,255,0.85)`,
                  fontSize: "15px", fontWeight: "800", color: "#fff",
                  cursor: stripeLoading ? "not-allowed" : "pointer",
                  transition: "all 0.22s", letterSpacing: "0.2px",
                  animation: stripeLoading ? "none" : "float 3s ease-in-out infinite",
                }}
                onMouseEnter={e => { if (!stripeLoading) { e.currentTarget.style.boxShadow = "10px 10px 26px rgba(99,102,241,0.48), -3px -3px 12px rgba(255,255,255,0.9)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.animation = "none"; } }}
                onMouseLeave={e => { if (!stripeLoading) { e.currentTarget.style.boxShadow = "8px 8px 20px rgba(99,102,241,0.38), -3px -3px 10px rgba(255,255,255,0.85)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.animation = "float 3s ease-in-out infinite"; } }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                {stripeLoading ? "Redirecting..." : "Upgrade to Lieutenant"}
                {!stripeLoading && (
                  <span style={{ fontSize: "12px", fontWeight: "900", padding: "3px 9px", borderRadius: "8px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
                    $149
                  </span>
                )}
              </button>
            )}

            <div style={{
              display: "flex", alignItems: "center", gap: "7px",
              fontSize: "12px", color: "#94a3b8", fontWeight: "600",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              One-time payment · Lifetime access
            </div>
          </div>
          </div>

          {/* ── Stats column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", flexShrink: 0, width: "190px" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                background: BG, borderRadius: "18px", boxShadow: S_UP,
                padding: "16px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: "24px", fontWeight: "900", color: PURPLE, letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: "600", marginTop: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section title ── */}
      <div style={{ marginBottom: "20px", animation: "nm-up 0.4s ease-out 0.16s both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.07)" }} />
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", letterSpacing: "1.2px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Lieutenant Advantages — 9 Exclusive Benefits
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.07)" }} />
        </div>
      </div>

      {/* ── Perks Grid — 4 + 4 ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
        {/* Row 1 — first 5 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px" }}>
          {PERKS.slice(0, 5).map((perk, i) => (
            <PerkCard key={i} perk={perk} index={i} />
          ))}
        </div>
        {/* Row 2 — last 4 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {PERKS.slice(5).map((perk, i) => (
            <PerkCard key={i + 5} perk={perk} index={i + 5} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      {!isLieutenant && (
        <div style={{
          background: BG, borderRadius: "24px", boxShadow: S_UP_L,
          padding: "40px 44px", animation: "nm-up 0.4s ease-out 0.5s both",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "32px", flexWrap: "wrap",
        }}>
          <div style={{ maxWidth: "480px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 12px", borderRadius: "20px", marginBottom: "14px",
              background: BG, boxShadow: S_UP,
              fontSize: "10px", fontWeight: "800", color: PURPLE, letterSpacing: "1px", textTransform: "uppercase",
            }}>
              Ready to level up?
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
              One payment. Lifetime access.
            </h3>
            <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0, lineHeight: "1.65", fontWeight: "450" }}>
              Join hundreds of builders who chose to invest in themselves.
              No monthly fees, no hidden costs — just unlimited access to every perk, forever.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "16px 24px", borderRadius: "20px", background: BG, boxShadow: S_UP,
              marginBottom: "4px",
            }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.5px" }}>ONE-TIME</span>
              <span style={{ fontSize: "40px", fontWeight: "900", color: PURPLE, lineHeight: 1.1, letterSpacing: "-2px" }}>$149</span>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8" }}>LIFETIME ACCESS</span>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={stripeLoading}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "14px 30px", borderRadius: "14px", border: "none",
                background: stripeLoading ? "#a5b4fc" : `linear-gradient(135deg, ${PURPLE} 0%, #8b5cf6 100%)`,
                boxShadow: stripeLoading ? "none" : "6px 6px 18px rgba(99,102,241,0.38), -3px -3px 10px rgba(255,255,255,0.85)",
                fontSize: "14px", fontWeight: "800", color: "#fff",
                cursor: stripeLoading ? "not-allowed" : "pointer",
                transition: "all 0.22s", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { if (!stripeLoading) { e.currentTarget.style.boxShadow = "8px 8px 22px rgba(99,102,241,0.48), -3px -3px 12px rgba(255,255,255,0.9)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
              onMouseLeave={e => { if (!stripeLoading) { e.currentTarget.style.boxShadow = "6px 6px 18px rgba(99,102,241,0.38), -3px -3px 10px rgba(255,255,255,0.85)"; e.currentTarget.style.transform = "translateY(0)"; } }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              {stripeLoading ? "Redirecting..." : "Upgrade Now — $149"}
            </button>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>
              Secure checkout via Stripe
            </span>
          </div>
        </div>
      )}

      {/* Already lieutenant message */}
      {isLieutenant && (
        <div style={{
          background: BG, borderRadius: "24px", boxShadow: S_IN,
          padding: "32px 40px", animation: "nm-up 0.4s ease-out 0.5s both",
          display: "flex", alignItems: "center", gap: "20px",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "18px", flexShrink: 0,
            background: BG, boxShadow: S_UP,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: PURPLE,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
              You're already a DAG Lieutenant
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "450" }}>
              All 8 Lieutenant benefits above are active on your account. Your 20% commission, 1,000 pt referral bonuses, and 50 pts/$1 spend rewards are live.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
