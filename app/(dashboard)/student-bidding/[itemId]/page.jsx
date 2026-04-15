"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ImageCarousel from "@/components/bidding/ImageCarousel";
import CountdownTimer from "@/components/bidding/CountdownTimer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MEDALS = ["🥇", "🥈", "🥉"];

export default function AuctionDetailPage() {
  const { itemId } = useParams();
  const router     = useRouter();

  const [item,         setItem]         = useState(null);
  const [bids,         setBids]         = useState([]);
  const [activity,     setActivity]     = useState([]);
  const [chatMsgs,     setChatMsgs]     = useState([]);
  const [chatInput,    setChatInput]    = useState("");
  const [loading,      setLoading]      = useState(true);
  const [userId,       setUserId]       = useState(null);
  const [userName,     setUserName]     = useState("");
  const [userPoints,   setUserPoints]   = useState(0);
  const [userBid,      setUserBid]      = useState(null);
  const [bidAmount,    setBidAmount]    = useState("");
  const [bidLoading,   setBidLoading]   = useState(false);
  const [bidMsg,       setBidMsg]       = useState(null);
  const [newBidFlash,  setNewBidFlash]  = useState(false);
  const chatEndRef = useRef(null);

  // ── Auth + data ────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [pageRes, { data: authData }] = await Promise.all([
        fetch(`/api/bidding/items/${itemId}`),
        supabase.auth.getUser(),
      ]);
      const pageData = await pageRes.json();
      if (!pageData.success) { router.push("/student-bidding"); return; }
      setItem(pageData.item);
      setBids(pageData.bids || []);
      setActivity((pageData.activity || []).reverse());
      setChatMsgs((pageData.activity || []).reverse().slice(-15).map(a => ({
        id: a.id, type: "bid",
        user: a.user?.full_name || "Someone",
        text: `${a.action === "top_up" ? "topped up to" : "bid"} ⬡ ${a.total_bid?.toLocaleString()} DAG Points`,
        ts: a.created_at,
      })));

      const uid = authData?.user?.id;
      setUserId(uid);
      if (uid) {
        const { data: u } = await supabase.from("users").select("dag_points, full_name").eq("id", uid).single();
        setUserPoints(u?.dag_points || 0);
        setUserName(u?.full_name || "");
        const myBid = pageData.bids?.find(b => b.user?.id === uid);
        setUserBid(myBid || null);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [itemId, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Supabase Realtime ─────────────────────────────────────────
  useEffect(() => {
    if (!itemId) return;
    const ch = supabase.channel(`detail-${itemId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "bids", filter: `item_id=eq.${itemId}` },
        () => { fetchData(); setNewBidFlash(true); setTimeout(() => setNewBidFlash(false), 1500); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "bid_activity_log", filter: `item_id=eq.${itemId}` },
        async (payload) => {
          const { data: u } = await supabase.from("users").select("full_name").eq("id", payload.new.user_id).single();
          const msg = {
            id: payload.new.id, type: "bid",
            user: u?.full_name || "Someone",
            text: `${payload.new.action === "top_up" ? "topped up to" : "bid"} ⬡ ${payload.new.total_bid?.toLocaleString()} DAG Points`,
            ts: payload.new.created_at,
          };
          setChatMsgs(prev => [...prev, msg].slice(-60));
        })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "bid_items", filter: `id=eq.${itemId}` },
        (payload) => setItem(prev => ({ ...prev, ...payload.new })))
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [itemId, fetchData]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs]);

  // ── Bid handler ───────────────────────────────────────────────
  const minRequired = (() => {
    if (!item) return 0;
    if (item.current_highest_bid === 0) return item.starting_bid;
    if (userBid && item.current_highest_bidder_id === userBid?.user?.id) return item.min_increment;
    const needed = item.current_highest_bid + item.min_increment;
    if (userBid) return Math.max(1, needed - (userBid.bid_amount || 0));
    return needed;
  })();

  const amtInt   = parseInt(bidAmount) || 0;
  const newTotal = (userBid?.bid_amount || 0) + amtInt;
  const canAfford = amtInt <= userPoints;
  const meetsMin  = userBid
    ? newTotal >= (item?.current_highest_bid + item?.min_increment) || item?.current_highest_bidder_id === userId
    : amtInt >= minRequired;
  const isValid   = amtInt > 0 && canAfford && meetsMin;

  const handleBid = async () => {
    if (!isValid || bidLoading) return;
    setBidLoading(true); setBidMsg(null);
    try {
      const res = await fetch(`/api/bidding/items/${itemId}/bid`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: amtInt }),
      });
      const data = await res.json();
      if (data.success) {
        setBidMsg({ ok: true, text: `🎉 ${data.action === "top_up" ? "Bid topped up" : "Bid placed"}! Total: ⬡ ${data.new_total?.toLocaleString()} DAG Pts` });
        setUserPoints(data.dag_points ?? userPoints - amtInt);
        setBidAmount("");
      } else {
        setBidMsg({ ok: false, text: data.error || "Bid failed." });
      }
    } catch { setBidMsg({ ok: false, text: "Network error." }); }
    setBidLoading(false);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMsgs(prev => [...prev, { id: Date.now(), type: "user", user: userName || "You", text: chatInput.trim(), ts: new Date().toISOString() }]);
    setChatInput("");
  };

  if (loading) return <Skeleton />;
  if (!item)   return null;

  const isActive = item.status === "active";
  const isClosed = item.status === "closed" || item.status === "cancelled";
  const winners  = bids.filter(b => b.status === "won");

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>

      {/* ── LIVE TICKER ── */}
      {activity.length > 0 && (
        <div style={{
          background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
          overflow: "hidden", position: "sticky", top: 0, zIndex: 100,
          borderBottom: "2px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ display: "flex" }}>
            <div style={{
              background: "#F59E0B", padding: "7px 14px", display: "flex",
              alignItems: "center", gap: 6, flexShrink: 0,
            }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#1F2937", letterSpacing: "0.08em" }}>🔨 LIVE</span>
            </div>
            <div style={{ overflow: "hidden", flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{
                display: "flex", gap: 28, padding: "7px 20px", whiteSpace: "nowrap",
                animation: "ticker-scroll 30s linear infinite",
              }}>
                {[...activity, ...activity].map((a, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                    <span style={{ color: "#c7d2fe", fontWeight: 600 }}>{a.user?.full_name?.split(" ")[0] || "Someone"}</span>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>{a.action === "top_up" ? "→" : "bid"}</span>
                    <span style={{ color: "#FCD34D", fontWeight: 800 }}>⬡{a.total_bid?.toLocaleString()}</span>
                    <span style={{ color: "rgba(255,255,255,0.15)" }}>•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BREADCRUMB ── */}
      <div style={{ padding: "14px 24px 0", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
        <a href="/student-bidding" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>← Auction House</a>
        <span>/</span>
        <span style={{ color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>
          {item.title}
        </span>
      </div>

      {/* ── 3-COLUMN LAYOUT ── */}
      <div style={{ display: "flex", gap: 0, height: "calc(100vh - 72px)", overflow: "hidden" }}>

        {/* LEFT: Product Info (55%) */}
        <div style={{ flex: "0 0 55%", overflowY: "auto", padding: "20px 16px 20px 24px" }}>

          {/* Status + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{
              padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800,
              letterSpacing: "0.07em",
              background: isActive ? "#dcfce7" : isClosed ? "#f1f5f9" : "#fef9c3",
              color:       isActive ? "#15803d" : isClosed ? "#64748b"  : "#a16207",
              border:      `1px solid ${isActive ? "#86efac" : isClosed ? "#e2e8f0" : "#fde68a"}`,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: isActive ? "#22c55e" : isClosed ? "#94a3b8" : "#f59e0b",
                ...(isActive ? { animation: "ping 1.2s ease-in-out infinite" } : {}),
              }} />
              {item.status?.toUpperCase()}
            </span>
          </div>

          <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#1e293b", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
            {item.title}
          </h1>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
            {item.description}
          </p>

          {/* Image carousel */}
          <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 20,
            boxShadow: "8px 8px 20px rgba(174,174,192,0.3), -4px -4px 12px rgba(255,255,255,0.9)" }}>
            <ImageCarousel images={item.images || []} />
          </div>

          {/* Features */}
          {item.features?.length > 0 && (
            <div style={{
              borderRadius: 20, padding: "20px",
              background: "#fff",
              boxShadow: "6px 6px 16px rgba(174,174,192,0.25), -4px -4px 10px rgba(255,255,255,0.9)",
              marginBottom: 20,
            }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                ✦ Key Features
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                {item.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700, color: "#fff", marginTop: 1,
                    }}>✓</span>
                    <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auction stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20,
          }}>
            {[
              { label: "Total Bidders",   value: item.total_bids_count || 0, icon: "👥" },
              { label: "Total Locked",    value: `⬡ ${(item.total_dag_locked || 0).toLocaleString()}`, icon: "🔒" },
              { label: "Min Increment",   value: `+${item.min_increment?.toLocaleString()}`, icon: "📈" },
            ].map(s => (
              <div key={s.label} style={{
                borderRadius: 16, padding: "14px", textAlign: "center",
                background: "#fff",
                boxShadow: "5px 5px 14px rgba(174,174,192,0.25), -3px -3px 8px rgba(255,255,255,0.9)",
              }}>
                <p style={{ margin: "0 0 4px", fontSize: 22 }}>{s.icon}</p>
                <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 800, color: "#1e293b" }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Winner section */}
          {isClosed && winners.length > 0 && (
            <div style={{
              borderRadius: 20, padding: "20px",
              background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
              border: "1px solid #fde68a",
              boxShadow: "6px 6px 16px rgba(174,174,192,0.25), -4px -4px 10px rgba(255,255,255,0.9)",
            }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 800, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                🏆 Auction Winners
              </h3>
              {winners.map((w, i) => (
                <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{MEDALS[i] || "🏅"}</span>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #F59E0B, #D97706)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#fff",
                  }}>
                    {(w.user?.full_name || "?")[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#78350f" }}>{w.user?.full_name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#92400e" }}>⬡ {w.bid_amount?.toLocaleString()} DAG Points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Bid + Leaderboard + Chat (45%) */}
        <div style={{
          flex: "0 0 45%",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
          padding: "20px 24px 20px 8px",
          gap: 16,
          borderLeft: "1px solid rgba(0,0,0,0.05)",
        }}>

          {/* ── COUNTDOWN CARD ── */}
          <div style={{
            borderRadius: 20, padding: "20px",
            background: "#fff",
            boxShadow: newBidFlash
              ? "8px 8px 20px rgba(99,102,241,0.25), -4px -4px 12px rgba(255,255,255,1), 0 0 0 2px #6366f1"
              : "8px 8px 20px rgba(174,174,192,0.3), -4px -4px 12px rgba(255,255,255,0.9)",
            transition: "box-shadow 0.5s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {isClosed ? "Auction Ended" : item.status === "upcoming" ? "Auction Starts" : "Closing In"}
                </p>
                <CountdownTimer endsAt={item.ends_at} startsAt={item.starts_at} status={item.status} theme="light" />
              </div>
              {isActive && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: "#dcfce7", border: "1px solid #86efac" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "ping 1.2s ease-in-out infinite" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#15803d" }}>LIVE · {item.total_bids_count || 0} bids</span>
                </div>
              )}
            </div>

            {/* Current highest bid */}
            <div style={{
              marginTop: 16, padding: "14px 16px", borderRadius: 14,
              background: "#f8fafc",
              boxShadow: "inset 3px 3px 8px rgba(174,174,192,0.2), inset -2px -2px 6px rgba(255,255,255,0.9)",
              display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {item.current_highest_bid > 0 ? "Highest Bid" : "Starting Bid"}
                </p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#F59E0B", lineHeight: 1, letterSpacing: "-1px" }}>
                  ⬡ {(item.current_highest_bid || item.starting_bid)?.toLocaleString()}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 10, color: "#94a3b8" }}>DAG Points</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 2px", fontSize: 10, color: "#94a3b8" }}>Min step</p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#6366f1" }}>+{item.min_increment?.toLocaleString()}</p>
              </div>
            </div>

            {/* User's available balance */}
            {userId && (
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  Available: <strong style={{ color: "#1e293b" }}>⬡ {userPoints?.toLocaleString()}</strong> DAG Points
                </span>
                {userBid && (
                  <span style={{
                    marginLeft: "auto", padding: "2px 10px", borderRadius: 20,
                    background: "#ede9fe", color: "#4f46e5", fontSize: 11, fontWeight: 700,
                  }}>
                    Your stake: ⬡ {userBid.bid_amount?.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── BID PANEL ── */}
          {isActive && (
            <div style={{
              borderRadius: 20, padding: "20px",
              background: "#fff",
              boxShadow: "8px 8px 20px rgba(174,174,192,0.3), -4px -4px 12px rgba(255,255,255,0.9)",
            }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 800, color: "#1e293b" }}>
                {userBid ? "⬆ Top-Up Your Bid" : "🔨 Place Your Bid"}
              </h3>

              {userId ? (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                      {userBid ? "Points to add (DAG Points)" : "Bid amount (DAG Points)"}
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, fontWeight: 900, color: "#F59E0B" }}>⬡</span>
                      <input
                        type="number" value={bidAmount} min={minRequired}
                        onChange={e => setBidAmount(e.target.value)}
                        placeholder={`Min ${minRequired?.toLocaleString()}`}
                        onKeyDown={e => e.key === "Enter" && handleBid()}
                        style={{
                          width: "100%", padding: "13px 14px 13px 38px",
                          borderRadius: 14, border: "none", outline: "none",
                          fontSize: 16, fontWeight: 700, color: "#1e293b",
                          background: "#f8fafc",
                          boxShadow: amtInt > 0
                            ? (isValid ? "inset 3px 3px 8px rgba(99,102,241,0.12), inset -2px -2px 6px rgba(255,255,255,0.9), 0 0 0 2px #6366f1" : "inset 3px 3px 8px rgba(220,38,38,0.1), inset -2px -2px 6px rgba(255,255,255,0.9), 0 0 0 2px #fca5a5")
                            : "inset 3px 3px 8px rgba(174,174,192,0.2), inset -2px -2px 6px rgba(255,255,255,0.9)",
                          transition: "box-shadow 0.2s",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Hints */}
                    {amtInt > 0 && userBid && (
                      <p style={{ margin: "6px 0 0", fontSize: 11, color: "#6366f1" }}>
                        New total: ⬡ <strong>{newTotal.toLocaleString()}</strong> DAG Points
                      </p>
                    )}
                    {amtInt > 0 && !canAfford && (
                      <p style={{ margin: "6px 0 0", fontSize: 11, color: "#dc2626" }}>⚠ Insufficient DAG Points</p>
                    )}
                    {amtInt > 0 && canAfford && !meetsMin && (
                      <p style={{ margin: "6px 0 0", fontSize: 11, color: "#d97706" }}>
                        ⚠ {userBid ? `Your total must reach ⬡ ${(item.current_highest_bid + item.min_increment).toLocaleString()}` : `Minimum is ⬡ ${minRequired?.toLocaleString()}`}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleBid}
                    disabled={!isValid || bidLoading}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 14, border: "none",
                      fontSize: 14, fontWeight: 800, cursor: isValid ? "pointer" : "not-allowed",
                      background: isValid
                        ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                        : "#f1f5f9",
                      color: isValid ? "#fff" : "#94a3b8",
                      boxShadow: isValid ? "0 6px 20px rgba(79,70,229,0.35)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {bidLoading
                      ? "Placing Bid…"
                      : userBid ? "⬆ Top-Up Bid" : "🔨 Place Bid"}
                  </button>

                  {bidMsg && (
                    <div style={{
                      marginTop: 10, padding: "10px 14px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                      background: bidMsg.ok ? "#f0fdf4" : "#fef2f2",
                      color: bidMsg.ok ? "#15803d" : "#dc2626",
                      border: `1px solid ${bidMsg.ok ? "#86efac" : "#fca5a5"}`,
                    }}>
                      {bidMsg.text}
                    </div>
                  )}
                </>
              ) : (
                <a href="/auth/login" style={{
                  display: "block", textAlign: "center", padding: "14px",
                  borderRadius: 14, fontSize: 14, fontWeight: 800, textDecoration: "none",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff",
                  boxShadow: "0 6px 18px rgba(79,70,229,0.35)",
                }}>
                  Login to Bid
                </a>
              )}

              <p style={{ margin: "10px 0 0", fontSize: 10, textAlign: "center", color: "#94a3b8" }}>
                Starting bid: ⬡ {item.starting_bid?.toLocaleString()} · Max winners: {item.max_winners}
              </p>
            </div>
          )}

          {/* ── LEADERBOARD ── */}
          <div style={{
            borderRadius: 20, padding: "20px",
            background: "#fff",
            boxShadow: "8px 8px 20px rgba(174,174,192,0.3), -4px -4px 12px rgba(255,255,255,0.9)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#1e293b" }}>
                🏆 Leaderboard
              </h3>
              {newBidFlash && (
                <span style={{
                  padding: "3px 8px", borderRadius: 20, fontSize: 10, fontWeight: 800,
                  background: "#dcfce7", color: "#15803d", animation: "pulse 0.8s ease-in-out",
                }}>
                  ● NEW BID
                </span>
              )}
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{bids.length} bidder{bids.length !== 1 ? "s" : ""}</span>
            </div>

            {bids.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}>
                <p style={{ fontSize: 28, margin: "0 0 8px" }}>🎯</p>
                <p style={{ margin: 0, fontSize: 13 }}>Be the first to bid!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {bids.map((bid, idx) => {
                  const isWinner = idx < (item.max_winners || 1);
                  const isMe     = bid.user?.id === userId;
                  const medal    = MEDALS[idx];
                  return (
                    <div key={bid.id} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                      borderRadius: 14, transition: "all 0.3s ease",
                      background: idx === 0
                        ? "linear-gradient(135deg, #fffbeb, #fef3c7)"
                        : isMe ? "linear-gradient(135deg, #ede9fe, #e0e7ff)" : "#f8fafc",
                      border: idx === 0
                        ? "1px solid #fde68a"
                        : isMe ? "1px solid #c7d2fe" : "1px solid #f1f5f9",
                      boxShadow: idx === 0
                        ? "0 4px 12px rgba(245,158,11,0.15)"
                        : isMe ? "0 4px 12px rgba(99,102,241,0.12)" : "none",
                    }}>
                      {/* Rank */}
                      <div style={{ width: 28, textAlign: "center", flexShrink: 0 }}>
                        {medal
                          ? <span style={{ fontSize: 16 }}>{medal}</span>
                          : <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>#{idx + 1}</span>
                        }
                      </div>
                      {/* Avatar */}
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: idx === 0
                          ? "linear-gradient(135deg, #F59E0B, #D97706)"
                          : isMe ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                          : "linear-gradient(135deg, #cbd5e1, #94a3b8)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: "#fff",
                      }}>
                        {(bid.user?.full_name || "?")[0]?.toUpperCase()}
                      </div>
                      {/* Name */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          margin: 0, fontSize: 13, fontWeight: 700,
                          color: idx === 0 ? "#78350f" : isMe ? "#4338ca" : "#374151",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {isMe ? `You (${bid.user?.full_name})` : bid.user?.full_name || "Bidder"}
                        </p>
                        {isWinner && (
                          <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: idx === 0 ? "#d97706" : "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {isClosed ? "WINNER" : "TOP BIDDER"}
                          </p>
                        )}
                      </div>
                      {/* Amount */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: idx === 0 ? "#F59E0B" : "#6366f1" }}>
                          ⬡ {bid.bid_amount?.toLocaleString()}
                        </p>
                        <p style={{ margin: 0, fontSize: 9, color: "#94a3b8" }}>DAG Pts</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── LIVE CHAT PANEL ── */}
          <div style={{
            borderRadius: 20, overflow: "hidden",
            background: "#fff",
            boxShadow: "8px 8px 20px rgba(174,174,192,0.3), -4px -4px 12px rgba(255,255,255,0.9)",
            display: "flex", flexDirection: "column",
            maxHeight: 340, flexShrink: 0,
          }}>
            <div style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "ping 1.5s ease infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#1e293b" }}>Live Bid Feed</span>
              <span style={{ marginLeft: "auto", fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#dcfce7", color: "#15803d", fontWeight: 600 }}>
                {chatMsgs.length} events
              </span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
              {chatMsgs.map((msg, i) => {
                const isBid   = msg.type === "bid";
                const initials = (msg.user || "?")[0]?.toUpperCase();
                return (
                  <div key={msg.id || i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                      background: isBid ? "linear-gradient(135deg,#F59E0B,#D97706)" : "linear-gradient(135deg,#6366f1,#4f46e5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: "#fff",
                    }}>{initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isBid ? "#b45309" : "#4338ca" }}>{msg.user} </span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{msg.text}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding: "10px 14px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 8 }}>
              {userId ? (
                <>
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendChat()}
                    placeholder="Add a comment…"
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: 10, border: "none", outline: "none",
                      fontSize: 12, background: "#f8fafc",
                      boxShadow: "inset 2px 2px 6px rgba(174,174,192,0.2), inset -2px -2px 5px rgba(255,255,255,0.9)",
                      color: "#1e293b",
                    }}
                  />
                  <button onClick={sendChat} style={{
                    width: 32, height: 32, borderRadius: 9, border: "none",
                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                    color: "#fff", cursor: "pointer", fontSize: 12, flexShrink: 0,
                    boxShadow: "0 3px 8px rgba(79,70,229,0.35)",
                  }}>➤</button>
                </>
              ) : (
                <a href="/auth/login" style={{ flex: 1, textAlign: "center", padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: "none", color: "#6366f1", background: "#ede9fe" }}>
                  Login to comment
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.4)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
      `}</style>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh", padding: "20px 24px" }}>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: "0 0 55%", display: "flex", flexDirection: "column", gap: 16 }}>
          {[380, 120, 100].map((h, i) => (
            <div key={i} style={{ height: h, borderRadius: 20, background: "#e2e8f0", animation: "pulse 1.5s ease infinite" }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          {[140, 180, 220].map((h, i) => (
            <div key={i} style={{ height: h, borderRadius: 20, background: "#e2e8f0", animation: "pulse 1.5s ease infinite" }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}
