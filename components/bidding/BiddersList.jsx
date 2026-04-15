"use client";

// Live-updated bidders leaderboard — sorted by bid_amount DESC.
// Animated rank changes via CSS transitions.
const MEDAL = ["🥇", "🥈", "🥉"];

export default function BiddersList({ bids = [], currentUserId, maxWinners = 1 }) {
  if (!bids.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="text-4xl">🎯</div>
        <p className="text-sm font-semibold" style={{ color: "#6B7280" }}>
          No bids yet — be the first!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {bids.map((bid, idx) => {
        const rank      = idx + 1;
        const isWinner  = rank <= maxWinners;
        const isMe      = bid.user?.id === currentUserId;
        const medal     = MEDAL[idx] || null;
        const name      = bid.user?.full_name || "Anonymous";
        const initials  = name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
        const isTop     = rank === 1;

        return (
          <div
            key={bid.id}
            className="relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-500"
            style={{
              background: isTop
                ? "linear-gradient(135deg, #78350f22, #92400e33)"
                : isMe
                ? "linear-gradient(135deg, #1e3a5f22, #1e40af22)"
                : "rgba(255,255,255,0.04)",
              border: isTop
                ? "1px solid #F59E0B44"
                : isMe
                ? "1px solid #3B82F644"
                : "1px solid rgba(255,255,255,0.07)",
              boxShadow: isTop ? "0 0 20px #F59E0B18" : "none",
            }}
          >
            {/* Rank badge */}
            <div className="w-8 flex-shrink-0 text-center">
              {medal ? (
                <span className="text-xl">{medal}</span>
              ) : (
                <span className="text-sm font-bold" style={{ color: "#6B7280" }}>
                  #{rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center
                         text-xs font-bold shadow-lg"
              style={{
                background: isTop
                  ? "linear-gradient(135deg, #F59E0B, #D97706)"
                  : isMe
                  ? "linear-gradient(135deg, #3B82F6, #1D4ED8)"
                  : "linear-gradient(135deg, #374151, #1F2937)",
                color: "#fff",
              }}
            >
              {initials}
            </div>

            {/* Name + winner badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-semibold text-sm truncate"
                  style={{ color: isTop ? "#FCD34D" : isMe ? "#93C5FD" : "#E5E7EB" }}
                >
                  {name}
                </span>
                {isMe && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "#1D4ED8", color: "#BFDBFE" }}>
                    You
                  </span>
                )}
                {isWinner && !isMe && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "#78350F", color: "#FDE68A" }}>
                    Top {maxWinners > 1 ? `#${rank}` : "Bidder"}
                  </span>
                )}
              </div>
            </div>

            {/* Bid amount */}
            <div className="flex flex-col items-end flex-shrink-0">
              <span
                className="font-black text-base tabular-nums"
                style={{
                  color: isTop ? "#F59E0B" : "#D1D5DB",
                  textShadow: isTop ? "0 0 12px #F59E0B44" : "none",
                }}
              >
                ⬡ {bid.bid_amount?.toLocaleString()}
              </span>
              <span className="text-[10px]" style={{ color: "#6B7280" }}>DAG Points</span>
            </div>

            {/* Top glow */}
            {isTop && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, #F59E0B08, transparent)",
                  animation: "pulse 3s ease-in-out infinite",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
