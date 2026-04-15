"use client";
import { useState, useCallback } from "react";

export default function ImageCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);

  const primary = images.find(i => i.is_primary) || images[0];
  const sorted  = primary ? [primary, ...images.filter(i => i !== primary)] : images;

  const prev = useCallback(() => setCurrent(c => (c - 1 + sorted.length) % sorted.length), [sorted.length]);
  const next = useCallback(() => setCurrent(c => (c + 1) % sorted.length), [sorted.length]);

  if (!sorted.length) {
    return (
      <div style={{
        width: "100%", aspectRatio: "4/3",
        background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        borderRadius: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "8px 8px 20px rgba(174,174,192,0.3), -4px -4px 12px rgba(255,255,255,0.9)",
      }}>
        <span style={{ fontSize: 56, opacity: 0.25 }}>📦</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, userSelect: "none" }}>
      {/* Main image */}
      <div style={{
        position: "relative", width: "100%", aspectRatio: "4/3",
        borderRadius: 20, overflow: "hidden",
        background: "#f8fafc",
        boxShadow: "8px 8px 20px rgba(174,174,192,0.3), -4px -4px 12px rgba(255,255,255,0.9)",
      }}
        className="carousel-group"
      >
        <img
          key={current}
          src={sorted[current]?.url}
          alt={sorted[current]?.alt || "Product image"}
          draggable={false}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            animation: "carouselFade 0.3s ease",
          }}
        />

        {/* Bottom gradient — light, subtle */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 45%)",
        }} />

        {/* Counter pill */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          padding: "4px 10px", borderRadius: 20,
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
          fontSize: 11, fontWeight: 700, color: "#374151",
          border: "1px solid rgba(0,0,0,0.06)",
        }}>
          {current + 1} / {sorted.length}
        </div>

        {/* Prev / Next — shown on hover */}
        {sorted.length > 1 && (
          <>
            <button onClick={prev} className="carousel-nav carousel-nav-left"
              style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                width: 38, height: 38, borderRadius: "50%", border: "none", cursor: "pointer",
                background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)",
                color: "#374151", fontSize: 18, fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "4px 4px 10px rgba(174,174,192,0.35), -2px -2px 6px rgba(255,255,255,0.9)",
                transition: "all 0.2s",
              }}>‹</button>
            <button onClick={next} className="carousel-nav carousel-nav-right"
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                width: 38, height: 38, borderRadius: "50%", border: "none", cursor: "pointer",
                background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)",
                color: "#374151", fontSize: 18, fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "4px 4px 10px rgba(174,174,192,0.35), -2px -2px 6px rgba(255,255,255,0.9)",
                transition: "all 0.2s",
              }}>›</button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {sorted.length > 1 && (
        <div style={{
          display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2,
          scrollbarWidth: "none",
        }}>
          {sorted.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{
                flex: "0 0 64px", height: 64, borderRadius: 12, overflow: "hidden",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.2s",
                outline: i === current ? "2.5px solid #6366f1" : "2.5px solid transparent",
                outlineOffset: 2,
                boxShadow: i === current
                  ? "4px 4px 10px rgba(99,102,241,0.25), -2px -2px 6px rgba(255,255,255,0.9)"
                  : "4px 4px 10px rgba(174,174,192,0.25), -2px -2px 6px rgba(255,255,255,0.9)",
                opacity: i === current ? 1 : 0.55,
                transform: i === current ? "scale(1.08)" : "scale(1)",
              }}>
              <img src={img.url} alt={img.alt || `Image ${i + 1}`} draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes carouselFade {
          from { opacity: 0; transform: scale(1.02); }
          to   { opacity: 1; transform: scale(1); }
        }
        .carousel-nav { opacity: 0; }
        .carousel-group:hover .carousel-nav { opacity: 1; }
        .carousel-nav:hover { background: rgba(255,255,255,1) !important; transform: translateY(-50%) scale(1.08) !important; }
      `}</style>
    </div>
  );
}
