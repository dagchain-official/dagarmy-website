"use client";
import { motion } from "framer-motion";

const bars = [38, 62, 44, 85, 60, 78, 100];

export default function RewardDashboard() {
  return (
    <div style={{
      background: "#ffffff", borderRadius: "24px",
      border: "1px solid rgba(0,0,0,0.07)",
      padding: "28px",
      boxShadow: "0 20px 60px rgba(99,102,241,0.08), 0 4px 16px rgba(0,0,0,0.05)",
    }}>
      {/* Top label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1" }} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#6366f1", letterSpacing: "0.05em", textTransform: "uppercase" }}>Live Dashboard</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", animation: "blink 2s infinite" }} />
          <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>Active</span>
        </div>
      </div>

      {/* Main stat + chart */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>Estimated Earnings</p>
          <h4 style={{ margin: 0, fontSize: "32px", fontWeight: 900, color: "#0f0f0f", letterSpacing: "-1.5px" }}>
            12,450 <span style={{ fontSize: "15px", color: "#6366f1", fontWeight: 700 }}>DAG</span>
          </h4>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#22c55e", fontWeight: 600 }}>+24.8% this month</p>
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "flex-end", height: "52px" }}>
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "9px",
                background: i === bars.length - 1
                  ? "linear-gradient(to top, #6366f1, #8b5cf6)"
                  : "linear-gradient(to top, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
                borderRadius: "3px 3px 0 0",
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {[
          { label: "Referral Tree",   value: "452",      color: "#0f0f0f",  bg: "#f8f9fb" },
          { label: "Current Tier",    value: "Platinum", color: "#6366f1",  bg: "rgba(99,102,241,0.06)" },
          { label: "Active Referrals",value: "38",       color: "#0f0f0f",  bg: "#f8f9fb" },
          { label: "DAG Points",      value: "9,200",    color: "#06b6d4",  bg: "rgba(6,182,212,0.06)" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "14px 14px", borderRadius: "14px", background: s.bg, border: "1px solid rgba(0,0,0,0.05)" }}>
            <p style={{ margin: "0 0 4px", fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: s.color, letterSpacing: "-0.5px" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ background: "#f3f4f6", borderRadius: "12px", padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280" }}>Network Activity</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1" }}>78%</span>
        </div>
        <div style={{ height: "4px", background: "rgba(0,0,0,0.07)", borderRadius: "3px", overflow: "hidden" }}>
          <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: "78%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", background: "linear-gradient(to right, #6366f1, #8b5cf6)", borderRadius: "3px" }}
          />
        </div>
      </div>
    </div>
  );
}
