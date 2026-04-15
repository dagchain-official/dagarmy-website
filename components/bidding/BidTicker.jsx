"use client";
import { useEffect, useRef, useState } from "react";

// Light-themed horizontally scrolling live bid ticker
export default function BidTicker({ items = [] }) {
  const [visible, setVisible] = useState([]);
  useEffect(() => { if (items.length) setVisible(items); }, [items]);
  const looped = [...visible, ...visible, ...visible];

  if (!visible.length) return null;

  return (
    <div style={{
      background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
      overflow: "hidden", width: "100%", position: "relative",
      borderBottom: "2px solid rgba(255,255,255,0.1)",
    }}>
      <div style={{ display: "flex" }}>
        {/* Label pill */}
        <div style={{
          background: "#F59E0B", padding: "8px 14px", flexShrink: 0,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#fff",
            animation: "ping-bid 1.2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: "#1F2937", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
            LIVE BIDS
          </span>
        </div>

        {/* Fade left */}
        <div style={{
          position: "absolute", left: 102, top: 0, bottom: 0, width: 24, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to right, #4f46e5, transparent)",
        }} />
        {/* Fade right */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 40, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to left, #7c3aed, transparent)",
        }} />

        {/* Track */}
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div style={{
            display: "flex", gap: 28, padding: "8px 20px", whiteSpace: "nowrap",
            animation: "ticker-scroll-bid 38s linear infinite",
          }}>
            {looped.map((item, i) => {
              const name = item.user?.full_name || "Someone";
              const initials = name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
              return (
                <span key={`${item.id}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.2)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700, color: "#fff",
                  }}>{initials}</span>
                  <span style={{ color: "#c7d2fe", fontWeight: 700 }}>{name.split(" ")[0]}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{item.action === "top_up" ? "→" : "bid"}</span>
                  <span style={{ color: "#FCD34D", fontWeight: 800 }}>⬡ {item.total_bid?.toLocaleString()}</span>
                  <span style={{ color: "rgba(255,255,255,.18)" }}>|</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll-bid { 0%{transform:translateX(0)} 100%{transform:translateX(-33.333%)} }
        @keyframes ping-bid { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.5)} }
      `}</style>
    </div>
  );
}
