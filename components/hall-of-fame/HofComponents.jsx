"use client";
import React from "react";

export const CATS = {
  points: {
    key: "points",
    label: "Top DAG Points Earner",
    sublabel: "Most points earned this month",
    color: "#6366f1",
    light: "#eef2ff",
    border: "#c7d2fe",
    muted: "#818cf8",
    valueLabel: "Points Earned",
    suffix: " pts",
    prefix: "",
    rank: "1st",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  sales: {
    key: "sales",
    label: "Top Sales Commission Earner",
    sublabel: "Highest commission earned this month",
    color: "#d97706",
    light: "#fffbeb",
    border: "#fde68a",
    muted: "#f59e0b",
    valueLabel: "Commission",
    suffix: "",
    prefix: "$",
    rank: "3rd",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  referrals: {
    key: "referrals",
    label: "Top Referrer",
    sublabel: "Most referrals brought in this month",
    color: "#059669",
    light: "#ecfdf5",
    border: "#a7f3d0",
    muted: "#10b981",
    valueLabel: "Referrals",
    suffix: "",
    prefix: "",
    rank: "2nd",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
};

export const RANK_COLORS = {
  MYTHIC: "#fbbf24", PARAGON: "#7c3aed", CONQUEROR: "#dc2626",
  CHAMPION: "#ef4444", COMMANDER: "#f59e0b", INVOKER: "#ec4899",
  STRIKER: "#8b5cf6", GUARDIAN: "#3b82f6", VANGUARD: "#10b981", INITIATOR: "#6b7280",
};

export const HOF_CSS = `
  @keyframes hof-spin { to { transform: rotate(360deg); } }
  @keyframes hof-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .hof-champion-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
  .hof-champion-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.10) !important; transform: translateY(-2px); }
  .hof-month-btn { transition: all 0.15s ease; }
  .hof-month-btn:hover { border-color: #d97706 !important; color: #b45309 !important; }
  .hof-archive-row { transition: background 0.15s ease; cursor: pointer; }
  .hof-archive-row:hover { background: #f8fafc !important; }
`;

export function CrownIcon({ size = 16, color = "#d97706" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M2 19h20v2H2zM2 17l4-10 6 6 4-8 4 12H2z"/>
    </svg>
  );
}

function UserAvatar({ src, name, size = 48 }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : "??";
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, display: "block" }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "#e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: "700", color: "#64748b", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export function ChampionCard({ champion, category, isCurrentUser, isLoading }) {
  const cat = CATS[category];
  const fmtVal = v => `${cat.prefix}${Number(v).toLocaleString()}${cat.suffix}`;
  const rColor = champion ? (RANK_COLORS[champion.current_rank] || "#94a3b8") : "#94a3b8";

  return (
    <div
      className="hof-champion-card"
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animation: "hof-fadein 0.35s ease both",
        flex: 1,
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: "4px", background: `linear-gradient(90deg, ${cat.color}, ${cat.border})` }} />

      <div style={{ padding: "20px 22px" }}>
        {/* Header row: category label + rank badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: cat.light, border: `1px solid ${cat.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: cat.color, flexShrink: 0 }}>
              {cat.icon}
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{cat.label}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px" }}>{cat.sublabel}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "100px", background: cat.light, border: `1px solid ${cat.border}` }}>
            <CrownIcon size={12} color={cat.color} />
            <span style={{ fontSize: "11px", fontWeight: "700", color: cat.color }}>{cat.rank}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#f1f5f9", marginBottom: "18px" }} />

        {/* Champion body */}
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#f1f5f9", flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "7px" }}>
                <div style={{ height: "12px", width: "60%", borderRadius: "6px", background: "#f1f5f9" }} />
                <div style={{ height: "10px", width: "40%", borderRadius: "6px", background: "#f1f5f9" }} />
              </div>
            </div>
            <div style={{ height: "52px", borderRadius: "10px", background: "#f8fafc", marginTop: "4px" }} />
          </div>
        ) : champion ? (
          <>
            {/* Avatar + name row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <UserAvatar src={champion.avatar} name={champion.name} size={48} />
                {isCurrentUser && (
                  <div style={{ position: "absolute", bottom: "-2px", right: "-2px", background: cat.color, color: "#fff", fontSize: "7px", fontWeight: "900", padding: "1px 5px", borderRadius: "100px", border: "2px solid #fff", letterSpacing: "0.3px" }}>YOU</div>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{champion.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "5px", flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: "10px", fontWeight: "600", padding: "2px 7px", borderRadius: "5px",
                    background: champion.tier === "DAG_LIEUTENANT" ? "#dcfce7" : "#f1f5f9",
                    color: champion.tier === "DAG_LIEUTENANT" ? "#059669" : "#64748b",
                    border: `1px solid ${champion.tier === "DAG_LIEUTENANT" ? "#bbf7d0" : "#e2e8f0"}`,
                  }}>
                    {champion.tier === "DAG_LIEUTENANT" ? "Lieutenant" : "Soldier"}
                  </span>
                  {champion.current_rank && (
                    <span style={{ fontSize: "10px", fontWeight: "600", padding: "2px 7px", borderRadius: "5px", background: `${rColor}15`, color: rColor, border: `1px solid ${rColor}25` }}>
                      {champion.current_rank}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stat block */}
            <div style={{ background: cat.light, border: `1px solid ${cat.border}`, borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: cat.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{cat.valueLabel}</div>
                <div style={{ fontSize: "26px", fontWeight: "900", color: cat.color, letterSpacing: "-1.5px", lineHeight: 1 }}>{fmtVal(champion.value)}</div>
              </div>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fff", border: `1px solid ${cat.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: cat.color, opacity: 0.8 }}>
                {cat.icon}
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: "8px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1" }}>
              {cat.icon}
            </div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8" }}>No champion yet</div>
            <div style={{ fontSize: "11px", color: "#cbd5e1" }}>No activity recorded this month</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MiniChip({ champion, category }) {
  const cat = CATS[category];
  if (!champion) {
    return <span style={{ fontSize: "12px", color: "#cbd5e1" }}>—</span>;
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <UserAvatar src={champion.avatar} name={champion.name} size={28} />
      <div>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "110px" }}>{champion.name}</div>
        <div style={{ fontSize: "11px", color: cat.color, fontWeight: "600" }}>{cat.prefix}{Number(champion.value).toLocaleString()}{cat.suffix}</div>
      </div>
    </div>
  );
}
