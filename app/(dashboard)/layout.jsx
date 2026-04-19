"use client";
import React, { useState, useEffect } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";

export default function DashboardLayout({ children }) {
  // null = not yet measured (suppress nav during SSR to avoid desktop flash on mobile)
  const [isDesktop, setIsDesktop] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1281px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#f0f2f5" }}>

      {/* ── Desktop: sticky left sidebar — only shown after client resolves breakpoint ── */}
      {isDesktop === true && (
        <div style={{
          width: "clamp(200px, 18vw, 248px)",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          background: "#f0f2f5",
        }}>
          <DashboardNav2 />
        </div>
      )}

      {/* ── Page content ── */}
      <div style={{
        flex: 1,
        minWidth: 0,
        background: "#f0f2f5",
        position: "relative",
        /* Push content above the bottom nav on mobile */
        paddingBottom: isDesktop ? 0 : "calc(64px + env(safe-area-inset-bottom, 8px))",
      }}>
        {children}
      </div>

      {/* ── Mobile: fixed bottom nav — only shown after client resolves breakpoint ── */}
      {isDesktop === false && <MobileBottomNav />}

    </div>
  );
}
