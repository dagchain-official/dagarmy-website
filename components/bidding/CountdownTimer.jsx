"use client";
import { useState, useEffect } from "react";

export default function CountdownTimer({
  endsAt, startsAt, status,
  className = "",
  theme  = "dark",   // "light" | "dark"
  inline = false,    // true → single "HH:MM:SS" span, false → segmented blocks
}) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const raw = status === "upcoming" ? startsAt : endsAt;
    if (!raw) return;
    const target = new Date(raw);
    if (isNaN(target.getTime())) return;
    const calc = () => {
      const diff = target - new Date();
      if (diff <= 0) { setTimeLeft(null); return; }
      setTimeLeft({
        d:       Math.floor(diff / 86400000),
        h:       Math.floor((diff % 86400000) / 3600000),
        m:       Math.floor((diff % 3600000)  / 60000),
        s:       Math.floor((diff % 60000)    / 1000),
        totalMs: diff,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endsAt, startsAt, status]);

  const isUrgent  = timeLeft?.totalMs < 60 * 60 * 1000;
  const isWarning = timeLeft?.totalMs < 6  * 60 * 60 * 1000;

  const color = theme === "light"
    ? (isUrgent ? "#dc2626" : isWarning ? "#d97706" : "#8a2be2")
    : (isUrgent ? "#EF4444" : isWarning ? "#F59E0B" : "#10B981");

  if (!timeLeft) {
    return (
      <span style={{ fontSize: inline ? "inherit" : 12, fontWeight: 700, color: "#dc2626" }} className={className}>
        {status === "upcoming" ? "Starting…" : "Ended"}
      </span>
    );
  }

  /* ── INLINE mode: "14:32:05" or "2d 14:32:05" ── */
  if (inline) {
    const hh = String(timeLeft.h).padStart(2, "0");
    const mm = String(timeLeft.m).padStart(2, "0");
    const ss = String(timeLeft.s).padStart(2, "0");
    const str = timeLeft.d > 0 ? `${timeLeft.d}d ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
    return (
      <span style={{ fontWeight: 900, letterSpacing: "0.08em", color, fontFamily: "inherit" }} className={className}>
        {str}
      </span>
    );
  }

  /* ── SEGMENTED mode (default) ── */
  const label = status === "upcoming" ? "Starts in" : "Ends in";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }} className={className}>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color, opacity: 0.65 }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        {timeLeft.d > 0 && (<><Seg v={timeLeft.d} l="d" color={color} theme={theme}/><Sep color={color}/></>)}
        <Seg v={timeLeft.h} l="h" color={color} theme={theme}/>
        <Sep color={color}/>
        <Seg v={timeLeft.m} l="m" color={color} theme={theme}/>
        <Sep color={color}/>
        <Seg v={timeLeft.s} l="s" color={color} theme={theme}/>
      </div>
    </div>
  );
}

function Seg({ v, l, color, theme }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{
        fontFamily: "monospace", fontWeight: 900, lineHeight: 1,
        fontSize: "clamp(13px, 1.8vw, 22px)", color,
        textShadow: theme === "dark" ? `0 0 14px ${color}66` : "none",
      }}>
        {String(v).padStart(2, "0")}
      </span>
      <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.06em", color, opacity: 0.5 }}>{l}</span>
    </div>
  );
}

function Sep({ color }) {
  return <span style={{ fontWeight: 900, fontSize: 15, paddingBottom: 4, color, opacity: 0.35 }}>:</span>;
}
