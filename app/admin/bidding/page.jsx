"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const STATUS = {
  active:    { label: "🔴 Live",     bg: "#dcfce7", text: "#15803d", border: "#86efac" },
  upcoming:  { label: "🟡 Upcoming", bg: "#fef9c3", text: "#a16207", border: "#fde68a" },
  closed:    { label: "⬛ Ended",    bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" },
  cancelled: { label: "🚫 Cancelled",bg: "#fef2f2", text: "#dc2626", border: "#fca5a5" },
};

export default function AdminBiddingPage() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("all");
  const [closing, setClosing] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/bidding/admin/items");
      const data = await res.json();
      setItems(data.items || []);
    } catch { setItems([]); }
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  const handleClose = async (id, title) => {
    if (!confirm(`Close auction "${title}"? This will select winners and refund all losers.`)) return;
    setClosing(id);
    const res  = await fetch(`/api/bidding/admin/items/${id}/close`, { method: "POST" });
    const data = await res.json();
    if (data.success) { alert(`✅ Closed. ${data.winners} winner(s) selected.`); fetchItems(); }
    else alert(`❌ ${data.error}`);
    setClosing(null);
  };

  const handleCancel = async (id, title) => {
    if (!confirm(`Cancel & refund all bids for "${title}"? This cannot be undone.`)) return;
    const res  = await fetch(`/api/bidding/admin/items/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { alert("✅ Cancelled and all bids refunded."); fetchItems(); }
    else alert(`❌ ${data.error}`);
  };

  const filtered = tab === "all" ? items : items.filter(i => i.status === tab);

  // Stats
  const live   = items.filter(i => i.status === "active").length;
  const coming = items.filter(i => i.status === "upcoming").length;
  const ended  = items.filter(i => i.status === "closed").length;
  const totalBids = items.reduce((s, i) => s + (i.total_bids_count || 0), 0);
  const totalDAG  = items.reduce((s, i) => s + (i.total_dag_locked || 0), 0);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Page header ── */}
      <div style={{ padding: "28px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 900, color: "#1e293b", letterSpacing: "-0.5px" }}>
              🔨 Auction House Manager
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
              Create, monitor and close live auctions. Winners auto-selected on close.
            </p>
          </div>
          <Link href="/admin/bidding/create" style={{
            padding: "11px 22px", borderRadius: 12, fontSize: 13, fontWeight: 700,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            color: "#fff", textDecoration: "none",
            boxShadow: "0 6px 18px rgba(79,70,229,0.35)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            + Create Auction
          </Link>
        </div>

        {/* ── Stats cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total Auctions",  value: items.length,  icon: "🏆" },
            { label: "Live Now",        value: live,          icon: "🔴" },
            { label: "Upcoming",        value: coming,        icon: "🟡" },
            { label: "Ended",           value: ended,         icon: "✅" },
            { label: "Total Bid DAG",   value: `⬡${(totalDAG/1000).toFixed(1)}K`, icon: "💰" },
          ].map(s => (
            <div key={s.label} style={{
              padding: "16px", borderRadius: 16, background: "#fff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1e293b" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tab filters ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { key: "all",       label: `All (${items.length})` },
            { key: "active",   label: `🔴 Live (${live})` },
            { key: "upcoming", label: `🟡 Upcoming (${coming})` },
            { key: "closed",   label: `✅ Ended (${ended})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              background: tab === t.key ? "linear-gradient(135deg, #ede9fe, #e0e7ff)" : "#fff",
              color: tab === t.key ? "#4f46e5" : "#64748b",
              boxShadow: tab === t.key ? "0 0 0 1.5px #6366f1" : "0 1px 4px rgba(0,0,0,0.07)",
              transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
          <button onClick={fetchItems} style={{
            marginLeft: "auto", padding: "8px 14px", borderRadius: 10, border: "1px solid #e2e8f0",
            background: "#fff", fontSize: 12, fontWeight: 600, color: "#64748b", cursor: "pointer",
          }}>↻ Refresh</button>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ padding: "0 32px 32px" }}>
        {loading ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", border: "1px solid #e2e8f0" }}>
            <p style={{ color: "#94a3b8" }}>Loading auctions…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: 64, textAlign: "center", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: 48 }}>📭</span>
            <p style={{ margin: "12px 0 0", fontSize: 16, fontWeight: 700, color: "#64748b" }}>No auctions found</p>
            <Link href="/admin/bidding/create" style={{
              display: "inline-block", marginTop: 16, padding: "10px 20px", borderRadius: 10,
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff",
              textDecoration: "none", fontSize: 13, fontWeight: 700,
            }}>+ Create First Auction</Link>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            {/* Table head */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 160px",
              padding: "12px 20px", background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              <span>Auction</span>
              <span>Status</span>
              <span>Bidders</span>
              <span>Highest Bid</span>
              <span>Ends At</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>

            {/* Rows */}
            {filtered.map((item, idx) => {
              const st  = STATUS[item.status] || STATUS.closed;
              const img = item.images?.find(i => i.is_primary) || item.images?.[0];
              return (
                <div key={item.id} style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 160px",
                  padding: "14px 20px", alignItems: "center",
                  borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Title + image */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, overflow: "hidden", flexShrink: 0,
                      background: "#f1f5f9", border: "1px solid #e2e8f0",
                    }}>
                      {img ? <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 18, opacity: 0.3 }}>📦</span>}
                    </div>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{item.title}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>
                        Start: ⬡{item.starting_bid?.toLocaleString()} · +{item.min_increment?.toLocaleString()} step · {item.max_winners} winner{item.max_winners !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", padding: "4px 10px",
                    borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: st.bg, color: st.text, border: `1px solid ${st.border}`,
                  }}>{st.label}</span>

                  {/* Bidders */}
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>
                    {item.total_bids_count || 0}
                  </span>

                  {/* Highest bid */}
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B" }}>
                    ⬡ {(item.current_highest_bid || item.starting_bid)?.toLocaleString()}
                  </span>

                  {/* Ends at */}
                  <span style={{ fontSize: 11, color: "#64748b" }}>
                    {item.ends_at ? new Date(item.ends_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                  </span>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    <Link href={`/admin/bidding/${item.id}`}
                      style={{ padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: "none", background: "#ede9fe", color: "#4f46e5", border: "1px solid #c7d2fe" }}>
                      View
                    </Link>
                    <Link href={`/admin/bidding/create?edit=${item.id}`}
                      style={{ padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: "none", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}>
                      Edit
                    </Link>
                    {item.status === "active" && (
                      <button onClick={() => handleClose(item.id, item.title)}
                        disabled={closing === item.id}
                        style={{
                          padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                          border: "1px solid #86efac", background: "#dcfce7", color: "#15803d", cursor: "pointer",
                        }}>
                        {closing === item.id ? "…" : "Close"}
                      </button>
                    )}
                    {(item.status === "active" || item.status === "upcoming") && (
                      <button onClick={() => handleCancel(item.id, item.title)}
                        style={{
                          padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                          border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", cursor: "pointer",
                        }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
