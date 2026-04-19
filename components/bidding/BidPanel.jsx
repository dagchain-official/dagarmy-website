"use client";
import { useState } from "react";

// The main bidding action panel on the item detail page.
// Shows user's current stake, min required, and input to place/top-up.
export default function BidPanel({
  item,
  userBid,       // user's existing bid row (or null)
  userPoints,    // user's current available DAG Points
  onBid,         // async (amount: number) => { success, error, new_total, dag_points }
  disabled,      // true when auction not active
  isLoggedIn,
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState(null); // { type: 'success'|'error', text }

  const minRequired = (() => {
    if (item.current_highest_bid === 0) return item.starting_bid;
    if (userBid) {
      // existing bidder - top-up must make total > current_highest + increment
      // unless they ARE the current highest
      if (item.current_highest_bidder_id === userBid?.user_id) return item.min_increment;
      const needed = item.current_highest_bid + item.min_increment;
      return Math.max(1, needed - (userBid.bid_amount || 0));
    }
    return item.current_highest_bid + item.min_increment;
  })();

  const amountInt   = parseInt(amount) || 0;
  const newTotal    = (userBid?.bid_amount || 0) + amountInt;
  const canAfford   = amountInt <= userPoints;
  const meetsMin    = userBid
    ? newTotal >= (item.current_highest_bid + item.min_increment)
    : amountInt >= minRequired;
  const isValid     = amountInt > 0 && canAfford && meetsMin;

  const handleBid = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setMsg(null);
    try {
      const result = await onBid(amountInt);
      if (result?.success) {
        setMsg({ type: "success", text: `🎉 Bid placed! Your total stake: ⬡ ${result.new_total?.toLocaleString()} DAG Points` });
        setAmount("");
      } else {
        setMsg({ type: "error", text: result?.error || "Bid failed. Please try again." });
      }
    } catch (e) {
      setMsg({ type: "error", text: "Something went wrong." });
    }
    setLoading(false);
  };

  return (
    <div
      className="rounded-3xl p-6 flex flex-col gap-5"
      style={{
        background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
        border: "1px solid rgba(245,158,11,0.2)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg" style={{ color: "#F9FAFB" }}>Place Your Bid</h3>
        {userBid && (
          <span className="text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: "#1e3a5f", color: "#93C5FD" }}>
            Your stake: ⬡ {userBid.bid_amount?.toLocaleString()}
          </span>
        )}
      </div>

      {/* Current highest */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
        style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold"
            style={{ color: "#92400E" }}>Current Highest</p>
          <p className="text-2xl font-black mt-0.5" style={{ color: "#F59E0B" }}>
            ⬡ {item.current_highest_bid === 0 ? "-" : item.current_highest_bid?.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-widest font-semibold"
            style={{ color: "#4B5563" }}>Min increment</p>
          <p className="text-lg font-bold mt-0.5" style={{ color: "#D1D5DB" }}>
            +{item.min_increment?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Available points */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
        <span className="text-sm" style={{ color: "#9CA3AF" }}>
          Available: <strong style={{ color: "#E5E7EB" }}>⬡ {userPoints?.toLocaleString() ?? "-"}</strong> DAG Points
        </span>
      </div>

      {/* Bid input */}
      {!disabled && isLoggedIn ? (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#6B7280" }}>
              {userBid ? "Add to your bid (DAG Points)" : "Your bid amount (DAG Points)"}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black"
                style={{ color: "#F59E0B" }}>⬡</span>
              <input
                type="number"
                min={minRequired}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder={`Min ${minRequired?.toLocaleString()}`}
                className="w-full pl-10 pr-4 py-4 rounded-2xl text-lg font-bold
                           outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${!amount ? "rgba(255,255,255,0.1)"
                    : isValid ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)"}`,
                  color: "#F9FAFB",
                  caretColor: "#F59E0B",
                }}
                onKeyDown={e => e.key === "Enter" && handleBid()}
              />
            </div>

            {/* New total preview */}
            {amountInt > 0 && userBid && (
              <p className="text-xs" style={{ color: "#6B7280" }}>
                New total stake: <strong style={{ color: "#F59E0B" }}>
                  ⬡ {newTotal.toLocaleString()}
                </strong>
              </p>
            )}

            {/* Error hints */}
            {amountInt > 0 && !canAfford && (
              <p className="text-xs" style={{ color: "#EF4444" }}>⚠ Insufficient DAG Points</p>
            )}
            {amountInt > 0 && canAfford && !meetsMin && (
              <p className="text-xs" style={{ color: "#F59E0B" }}>
                ⚠ {userBid
                  ? `Top-up must bring total to ⬡ ${(item.current_highest_bid + item.min_increment).toLocaleString()}`
                  : `Minimum bid is ⬡ ${minRequired.toLocaleString()}`}
              </p>
            )}
          </div>

          {/* Bid CTA */}
          <button
            onClick={handleBid}
            disabled={!isValid || loading}
            className="w-full py-4 rounded-2xl font-black text-base tracking-wide
                       transition-all duration-200 relative overflow-hidden"
            style={{
              background: isValid && !loading
                ? "linear-gradient(135deg, #F59E0B, #D97706)"
                : "rgba(255,255,255,0.07)",
              color: isValid && !loading ? "#1F2937" : "#4B5563",
              cursor: isValid && !loading ? "pointer" : "not-allowed",
              boxShadow: isValid && !loading ? "0 4px 20px rgba(245,158,11,0.4)" : "none",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Placing Bid…
              </span>
            ) : userBid ? "⬆ Top-Up My Bid" : "🔨 Place Bid"}
          </button>

          {/* Message */}
          {msg && (
            <div
              className="text-sm px-4 py-3 rounded-2xl font-semibold text-center"
              style={{
                background: msg.type === "success" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                color: msg.type === "success" ? "#34D399" : "#F87171",
                border: `1px solid ${msg.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}
            >
              {msg.text}
            </div>
          )}
        </>
      ) : !isLoggedIn ? (
        <a href="/auth/login"
          className="w-full py-4 rounded-2xl font-black text-base text-center block"
          style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#1F2937" }}>
          Login to Bid
        </a>
      ) : (
        <div className="text-center py-4 rounded-2xl text-sm font-semibold"
          style={{ background: "rgba(239,68,68,0.08)", color: "#F87171",
            border: "1px solid rgba(239,68,68,0.2)" }}>
          {item.status === "upcoming" ? "⏳ Auction hasn't started yet" : "🔒 Auction has ended"}
        </div>
      )}

      {/* Min bid info footer */}
      <p className="text-center text-[11px]" style={{ color: "#4B5563" }}>
        Starting bid: ⬡ {item.starting_bid?.toLocaleString()} · Increment: +{item.min_increment?.toLocaleString()} DAG Points
      </p>
    </div>
  );
}
