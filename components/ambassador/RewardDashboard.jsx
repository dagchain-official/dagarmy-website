"use client";
import { motion } from "framer-motion";

const bars = [38, 62, 44, 85, 60, 78, 100];

export default function RewardDashboard() {
  return (
    <div style={{
      background: "rgba(5,5,5,0.9)", borderRadius: "20px",
      border: "1px solid rgba(255,255,255,0.06)",
      padding: "28px", backdropFilter: "blur(30px)",
      WebkitBackdropFilter: "blur(30px)",
    }}>
      {/* Terminal header dots */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(239,68,68,0.5)" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(234,179,8,0.5)" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(34,197,94,0.5)" }} />
        <span style={{ marginLeft: "10px", fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "2px", textTransform: "uppercase" }}>AMBASSADOR_DASHBOARD_V2</span>
      </div>

      {/* Main stat + chart */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", textTransform: "uppercase" }}>Estimated Earnings</p>
          <h4 style={{ margin: 0, fontSize: "30px", fontWeight: 900, color: "#e5e5e5", letterSpacing: "-1px" }}>
            12,450 <span style={{ fontSize: "14px", color: "#6366f1", fontWeight: 700 }}>DAG</span>
          </h4>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "rgba(34,197,94,0.8)", fontFamily: "monospace" }}>+24.8% this month</p>
        </div>
        {/* Mini bar chart */}
        <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "52px" }}>
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "8px",
                background: i === bars.length - 1
                  ? "linear-gradient(to top, #6366f1, #06b6d4)"
                  : "linear-gradient(to top, rgba(99,102,241,0.5), rgba(6,182,212,0.3))",
                borderRadius: "2px 2px 0 0",
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {[
          { label: "Referral Tree", value: "452", color: "#e5e5e5" },
          { label: "Current Tier", value: "Platinum", color: "#6366f1" },
          { label: "Active Referrals", value: "38", color: "#e5e5e5" },
          { label: "DAG Points", value: "9,200", color: "#06b6d4" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ margin: "0 0 5px", fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase" }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: s.color, letterSpacing: "-0.5px" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Activity bar */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "10px", padding: "12px 14px", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.25)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Network Activity</span>
          <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(34,197,94,0.7)" }}>LIVE</span>
        </div>
        <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
          <motion.div
            animate={{ width: ["0%", "78%"] }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", background: "linear-gradient(to right, #6366f1, #06b6d4)", borderRadius: "2px" }}
          />
        </div>
      </div>
    </div>
  );
}
