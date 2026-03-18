"use client";
import React, { useState, useEffect } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1281px)");
    setIsDesktop(mq.matches);
    const handler = (e) => {
      setIsDesktop(e.matches);
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#f0f2f5" }}>

      {isDesktop ? (
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
      ) : (
        <>
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(2px)",
                zIndex: 9998,
              }}
            />
          )}
          <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "248px",
            height: "100vh",
            background: "#f0f2f5",
            boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
            zIndex: 9999,
            overflowY: "auto",
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <DashboardNav2 />
          </div>
        </>
      )}

      <div style={{ flex: 1, minWidth: 0, background: "#f0f2f5", position: "relative" }}>
        {!isDesktop && (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            style={{
              position: "fixed",
              top: "16px", left: "16px",
              zIndex: 9997,
              background: "#f0f2f5",
              border: "none",
              borderRadius: "12px",
              width: "42px", height: "42px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "5px", cursor: "pointer",
              boxShadow: "6px 6px 14px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)",
            }}
          >
            <span style={{ width: "20px", height: "2px", background: "#374151", borderRadius: "2px" }} />
            <span style={{ width: "20px", height: "2px", background: "#374151", borderRadius: "2px" }} />
            <span style={{ width: "20px", height: "2px", background: "#374151", borderRadius: "2px" }} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
