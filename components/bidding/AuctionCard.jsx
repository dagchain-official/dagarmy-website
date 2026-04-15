"use client";
import CountdownTimer from "./CountdownTimer";
import Link from "next/link";

const STATUS_BADGE = {
  active:    { label: "🔴 LIVE",     bg: "#DC2626", text: "#FEE2E2" },
  upcoming:  { label: "🟡 UPCOMING", bg: "#D97706", text: "#FEF3C7" },
  closed:    { label: "⬛ CLOSED",   bg: "#374151", text: "#9CA3AF" },
  cancelled: { label: "❌ CANCELLED",bg: "#7F1D1D", text: "#FCA5A5" },
};

export default function AuctionCard({ item }) {
  const badge   = STATUS_BADGE[item.status] || STATUS_BADGE.upcoming;
  const primary = item.images?.find(i => i.is_primary) || item.images?.[0];
  const isLive  = item.status === "active";

  return (
    <Link href={`/student-bidding/${item.id}`} className="block group">
      <div
        className="relative rounded-3xl overflow-hidden flex flex-col transition-all duration-300"
        style={{
          background: "linear-gradient(160deg, #0d1117, #161b22)",
          border: `1px solid ${isLive ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.07)"}`,
          boxShadow: isLive
            ? "0 8px 40px rgba(245,158,11,0.12), 0 2px 8px rgba(0,0,0,0.4)"
            : "0 4px 20px rgba(0,0,0,0.3)",
          transform: "translateY(0)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = isLive
            ? "0 20px 60px rgba(245,158,11,0.2), 0 4px 16px rgba(0,0,0,0.5)"
            : "0 16px 48px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = isLive
            ? "0 8px 40px rgba(245,158,11,0.12), 0 2px 8px rgba(0,0,0,0.4)"
            : "0 4px 20px rgba(0,0,0,0.3)";
        }}
      >
        {/* Product Image */}
        <div className="relative w-full overflow-hidden" style={{ height: "220px" }}>
          {primary ? (
            <img
              src={primary.url}
              alt={primary.alt || item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1c1f26, #252b36)" }}>
              <span className="text-6xl opacity-20">📦</span>
            </div>
          )}

          {/* Gradient bottom overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(13,17,23,0.95) 0%, transparent 55%)" }} />

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span
              className="text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider"
              style={{ background: badge.bg, color: badge.text }}
            >
              {badge.label}
            </span>
          </div>

          {/* Live pulse ring */}
          {isLive && (
            <div className="absolute top-3 left-3 -z-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "#EF4444" }} />
                <span className="relative inline-flex rounded-full h-3 w-3"
                  style={{ background: "#EF4444" }} />
              </span>
            </div>
          )}

          {/* Bidder count pill */}
          <div className="absolute bottom-3 right-3">
            <span className="text-[11px] font-bold px-2 py-1 rounded-full"
              style={{ background: "rgba(0,0,0,0.6)", color: "#9CA3AF",
                backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.08)" }}>
              👥 {item.total_bids_count || 0} bidder{item.total_bids_count !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col gap-3 p-4">
          {/* Title */}
          <h3 className="font-bold text-base leading-tight line-clamp-2"
            style={{ color: "#F9FAFB" }}>
            {item.title}
          </h3>

          {/* Current highest bid */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5"
                style={{ color: "#6B7280" }}>
                {item.current_highest_bid > 0 ? "Highest Bid" : "Starting Bid"}
              </p>
              <p className="text-xl font-black"
                style={{
                  color: "#F59E0B",
                  textShadow: "0 0 16px rgba(245,158,11,0.4)",
                }}>
                ⬡ {(item.current_highest_bid || item.starting_bid)?.toLocaleString()}
              </p>
              <p className="text-[10px]" style={{ color: "#4B5563" }}>DAG Points</p>
            </div>

            {/* Countdown */}
            {item.status !== "closed" && item.status !== "cancelled" && (
              <CountdownTimer
                endsAt={item.ends_at}
                startsAt={item.starts_at}
                status={item.status}
              />
            )}
          </div>

          {/* CTA bar */}
          <div
            className="w-full py-2.5 rounded-xl text-center text-sm font-bold
                       transition-all duration-200"
            style={{
              background: isLive
                ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))"
                : "rgba(255,255,255,0.04)",
              color: isLive ? "#F59E0B" : "#6B7280",
              border: `1px solid ${isLive ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            {isLive ? "🔨 Bid Now →" : item.status === "upcoming" ? "🔔 View Details" : "📋 View Results"}
          </div>
        </div>
      </div>
    </Link>
  );
}
