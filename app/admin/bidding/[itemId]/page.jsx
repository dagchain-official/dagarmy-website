"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function AdminAuctionControlPage() {
  const { itemId } = useParams();
  const router     = useRouter();
  const [item,     setItem]     = useState(null);
  const [bids,     setBids]     = useState([]);
  const [activity, setActivity] = useState([]);
  const [notes,    setNotes]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [closing,  setClosing]  = useState(false);
  const [saved,    setSaved]    = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/bidding/items/${itemId}`);
      const data = await res.json();
      if (data.success) {
        setItem(data.item);
        setBids(data.bids || []);
        setActivity((data.activity || []).reverse());
      }
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const handleClose = async () => {
    if (!confirm(`Close "${item?.title}" now? This will select winners and refund all other bidders.`)) return;
    setClosing(true);
    const res  = await fetch(`/api/bidding/admin/items/${itemId}/close`, { method: "POST" });
    const data = await res.json();
    if (data.success) { alert(`✅ Closed. ${data.winners} winner(s) selected.`); load(); }
    else alert(`❌ ${data.error}`);
    setClosing(false);
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this auction and refund ALL bids? Cannot be undone.")) return;
    const res  = await fetch(`/api/bidding/admin/items/${itemId}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { alert("✅ Cancelled. All points refunded."); router.push("/admin/bidding"); }
    else alert(`❌ ${data.error}`);
  };

  if (loading) return (
    <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
      <p>Loading auction data…</p>
    </div>
  );
  if (!item) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p style={{ color: "#94a3b8" }}>Auction not found.</p>
      <Link href="/admin/bidding" style={{ color: "#4f46e5" }}>← Back to Auctions</Link>
    </div>
  );

  const isActive   = item.status === "active";
  const isClosed   = item.status === "closed" || item.status === "cancelled";
  const winners    = bids.filter(b => b.status === "won");
  const img        = item.images?.find(i => i.is_primary) || item.images?.[0];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "28px 32px" }}>

      {/* ── Breadcrumb + header ── */}
      <div style={{ marginBottom: 6, fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
        <Link href="/admin/bidding" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>← Auction Manager</Link>
        <span>/</span>
        <span>{item.title}</span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {img && (
            <img src={img.url} alt="" style={{
              width: 56, height: 56, borderRadius: 12, objectFit: "cover",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }} />
          )}
          <div>
            <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#1e293b", letterSpacing: "-0.3px" }}>
              {item.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: isActive ? "#dcfce7" : isClosed ? "#f1f5f9" : "#fef9c3",
                color:      isActive ? "#15803d" : isClosed ? "#64748b"  : "#a16207",
                border:     `1px solid ${isActive ? "#86efac" : isClosed ? "#e2e8f0" : "#fde68a"}`,
              }}>{item.status?.toUpperCase()}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                Ends {item.ends_at ? new Date(item.ends_at).toLocaleString() : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <Link href={`/admin/bidding/create?edit=${itemId}`} style={{
            padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: "#fff", color: "#475569", textDecoration: "none",
            border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}>✏️ Edit</Link>
          {isActive && (
            <button onClick={handleClose} disabled={closing} style={{
              padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff",
              border: "none", cursor: "pointer",
              boxShadow: "0 5px 14px rgba(79,70,229,0.35)",
            }}>
              {closing ? "Closing…" : "🏁 Close Now"}
            </button>
          )}
          {!isClosed && (
            <button onClick={handleCancel} style={{
              padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5", cursor: "pointer",
            }}>🚫 Cancel & Refund</button>
          )}
        </div>
      </div>

      {/* ── 3-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>

        {/* ─ Stats ─ */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 800, color: "#1e293b" }}>📊 Auction Stats</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Starting Bid",   value: `⬡ ${item.starting_bid?.toLocaleString()}` },
              { label: "Current Highest",value: `⬡ ${(item.current_highest_bid || item.starting_bid)?.toLocaleString()}`, highlight: true },
              { label: "Min Increment",  value: `+${item.min_increment?.toLocaleString()}` },
              { label: "Max Winners",    value: item.max_winners },
              { label: "Total Bidders",  value: item.total_bids_count || 0 },
              { label: "Total DAG Staked", value: `⬡ ${(item.total_dag_locked || 0)?.toLocaleString()}` },
            ].map(s => (
              <div key={s.label} style={{
                display: "flex", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8,
                background: s.highlight ? "#fef9c3" : "#f8fafc",
                border: s.highlight ? "1px solid #fde68a" : "1px solid #f1f5f9",
              }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.highlight ? "#92400e" : "#1e293b" }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Internal notes */}
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
              Internal Notes
            </label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Add notes about this auction…"
              style={{
                width: "100%", padding: "8px 10px", borderRadius: 8,
                border: "1px solid #e2e8f0", fontSize: 12, color: "#374151",
                background: "#f8fafc", resize: "vertical", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
              }} />
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
              style={{
                marginTop: 6, padding: "6px 14px", borderRadius: 8, border: "none",
                background: saved ? "#dcfce7" : "#f1f5f9",
                color: saved ? "#15803d" : "#64748b",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
              {saved ? "✅ Saved" : "Save Notes"}
            </button>
          </div>
        </div>

        {/* ─ Leaderboard ─ */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 800, color: "#1e293b" }}>
            🏆 Bidder Leaderboard
            <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>
              {bids.length} bidder{bids.length !== 1 ? "s" : ""}
            </span>
          </h3>

          {/* Winner section for closed auctions */}
          {isClosed && winners.length > 0 && (
            <div style={{ padding: "10px 12px", borderRadius: 10, background: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "1px solid #fde68a", marginBottom: 12 }}>
              <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 800, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.06em" }}>🏆 Winners</p>
              {winners.map((w, i) => (
                <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span>{MEDALS[i] || "🏅"}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#78350f" }}>{w.user?.full_name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 800, color: "#d97706" }}>⬡ {w.bid_amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 380, overflowY: "auto" }}>
            {bids.length === 0 ? (
              <p style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 12 }}>No bids yet</p>
            ) : bids.map((bid, i) => {
              const isWinner = bid.status === "won";
              return (
                <div key={bid.id} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10,
                  background: i === 0 ? "#fffbeb" : isWinner ? "#f0fdf4" : "#f8fafc",
                  border: `1px solid ${i === 0 ? "#fde68a" : isWinner ? "#86efac" : "#f1f5f9"}`,
                }}>
                  <span style={{ width: 22, textAlign: "center", fontSize: 14 }}>{MEDALS[i] || <span style={{ fontSize: 11, color: "#94a3b8" }}>#{i+1}</span>}</span>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: i === 0 ? "linear-gradient(135deg,#F59E0B,#D97706)" : "linear-gradient(135deg,#c7d2fe,#a5b4fc)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "#fff",
                  }}>
                    {(bid.user?.full_name || "?")[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {bid.user?.full_name || "Unknown"} {isWinner && <span style={{ color: "#15803d", fontSize: 10 }}>✅</span>}
                    </p>
                    <p style={{ margin: 0, fontSize: 10, color: "#94a3b8" }}>{bid.user?.email || ""}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? "#D97706" : "#6366f1" }}>
                    ⬡ {bid.bid_amount?.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─ Activity Log ─ */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 800, color: "#1e293b" }}>
            📋 Bid Activity Log
            <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>{activity.length} events</span>
          </h3>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: 480, display: "flex", flexDirection: "column", gap: 6 }}>
            {activity.length === 0 ? (
              <p style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 12 }}>No activity yet</p>
            ) : activity.map((a, i) => (
              <div key={a.id || i} style={{
                display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px",
                borderRadius: 8, background: "#f8fafc", border: "1px solid #f1f5f9",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: a.action === "top_up" ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "linear-gradient(135deg,#F59E0B,#D97706)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "#fff",
                }}>
                  {(a.user?.full_name || "?")[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, color: "#1e293b" }}>
                    {a.user?.full_name || "Unknown"}
                    <span style={{ fontWeight: 400, color: "#94a3b8" }}> {a.action === "top_up" ? "topped up to" : "bid"}</span>
                    <span style={{ fontWeight: 800, color: "#F59E0B" }}> ⬡{a.total_bid?.toLocaleString()}</span>
                  </p>
                  <p style={{ margin: 0, fontSize: 9, color: "#94a3b8" }}>
                    {a.created_at ? new Date(a.created_at).toLocaleTimeString() : ""} · added ⬡{a.amount_added?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
