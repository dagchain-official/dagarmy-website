"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import { ChampionCard, MiniChip, CrownIcon, CATS, HOF_CSS } from "@/components/hall-of-fame/HofComponents";

function getLast12Months() {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "long", year: "numeric" });
    const short = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    months.push({ value, label, short, isCurrent: i === 0 });
  }
  return months;
}

const MONTHS = getLast12Months();
const CAT_ORDER = ["sales", "points", "referrals"];

export default function HallOfFamePage() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0].value);
  const [champions, setChampions] = useState(null);
  const [monthLabel, setMonthLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [archiveData, setArchiveData] = useState({});
  const [expandedArchive, setExpandedArchive] = useState(null);
  const [archiveLoading, setArchiveLoading] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) =>
      setCurrentUserId(session?.user?.id || null)
    );
  }, []);

  const fetchChampions = useCallback(async (month) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/hall-of-fame?month=${month}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setChampions(data.champions);
      setMonthLabel(data.monthLabel);
    } catch (err) {
      setError(err.message || "Failed to load");
      setChampions(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchChampions(selectedMonth); }, [selectedMonth, fetchChampions]);

  const fetchArchiveMonth = async (month) => {
    if (archiveData[month]) return;
    setArchiveLoading(p => ({ ...p, [month]: true }));
    try {
      const res = await fetch(`/api/hall-of-fame?month=${month}`, { cache: "no-store" });
      const data = await res.json();
      setArchiveData(p => ({ ...p, [month]: data.champions }));
    } catch {}
    finally { setArchiveLoading(p => ({ ...p, [month]: false })); }
  };

  const toggleArchive = (month) => {
    if (expandedArchive === month) { setExpandedArchive(null); return; }
    setExpandedArchive(month);
    fetchArchiveMonth(month);
  };

  const archiveMonths = MONTHS.slice(1);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f0f2f5' }}>
      <style>{HOF_CSS}</style>
      <div style={{ width: '248px', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: '#f0f2f5' }}>
        <DashboardNav2 />
      </div>
      <div style={{ flex: 1, background: '#f0f2f5', minWidth: 0, overflowX: 'hidden', padding: '36px 40px 56px' }}>

              {/* ══ PAGE HEADER ══ */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", marginBottom: "28px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#d97706,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(217,119,6,0.25)", flexShrink: 0 }}>
                    <CrownIcon size={22} color="#fff" />
                  </div>
                  <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>Hall of Fame</h1>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "3px 0 0" }}>Monthly top performers across Points, Sales &amp; Referrals</p>
                  </div>
                </div>
              </div>

              {/* ══ MONTH SELECTOR ══ */}
              <div style={{ background: '#f0f2f5', borderRadius: "12px", border: "1px solid #e2e8f0", padding: "14px 18px", marginBottom: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", flexShrink: 0 }}>Select Month</span>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {MONTHS.map(m => (
                      <button
                        key={m.value}
                        className="hof-month-btn"
                        onClick={() => setSelectedMonth(m.value)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "7px",
                          fontSize: "12px",
                          fontWeight: selectedMonth === m.value ? "700" : "500",
                          cursor: "pointer",
                          border: selectedMonth === m.value ? "1.5px solid #d97706" : "1.5px solid #e2e8f0",
                          background: selectedMonth === m.value ? "#fffbeb" : "transparent",
                          color: selectedMonth === m.value ? "#b45309" : "#64748b",
                          outline: "none",
                        }}
                      >
                        {m.isCurrent ? `${m.short} (Current)` : m.short}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ══ SECTION LABEL ══ */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CrownIcon size={15} color="#d97706" />
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                    {loading ? "Loading…" : error ? "Error loading data" : `${monthLabel} Champions`}
                  </span>
                  {!loading && !error && (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>— one winner per category</span>
                  )}
                </div>
              </div>

              {/* ══ CHAMPION CARDS ══ */}
              {error ? (
                <div style={{ background: '#f0f2f5', borderRadius: "12px", border: "1px solid #fee2e2", padding: "40px", textAlign: "center" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <p style={{ fontSize: "14px", color: "#dc2626", fontWeight: "600", marginBottom: "14px" }}>{error}</p>
                  <button onClick={() => fetchChampions(selectedMonth)} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", background: "#6366f1", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                    Try Again
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
                  {CAT_ORDER.map(cat => (
                    <ChampionCard
                      key={cat}
                      champion={champions?.[cat]}
                      category={cat}
                      isCurrentUser={champions?.[cat]?.id === currentUserId}
                      isLoading={loading}
                    />
                  ))}
                </div>
              )}

              {/* ══ ARCHIVE ══ */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: '#f0f2f5', border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                </div>
                <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Past Champions Archive</h2>
              </div>

              <div style={{ background: '#f0f2f5', borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                {archiveMonths.map((m, idx) => {
                  const isExpanded = expandedArchive === m.value;
                  const data = archiveData[m.value];
                  const isLoadingA = archiveLoading[m.value];
                  const isLast = idx === archiveMonths.length - 1;

                  return (
                    <div key={m.value} style={{ borderBottom: isLast ? "none" : "1px solid #f1f5f9" }}>

                      {/* Row */}
                      <div
                        className="hof-archive-row"
                        onClick={() => toggleArchive(m.value)}
                        style={{ display: "flex", alignItems: "center", padding: "13px 20px", background: isExpanded ? "#fafbfc" : "#fff", gap: "16px" }}
                      >
                        {/* Month */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "180px", flexShrink: 0 }}>
                          <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "#fffbeb", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <CrownIcon size={12} color="#d97706" />
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>{m.label}</span>
                        </div>

                        {/* Mini chips — only when collapsed */}
                        {!isExpanded && (
                          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0" }}>
                            {CAT_ORDER.map((cat, ci) => (
                              <div key={cat} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 16px", borderLeft: ci > 0 ? "1px solid #f1f5f9" : "none" }}>
                                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: CATS[cat].color, flexShrink: 0 }} />
                                <MiniChip champion={data?.[cat]} category={cat} />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Chevron */}
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"
                          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0, marginLeft: "auto" }}
                        >
                          <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>

                      {/* Expanded */}
                      {isExpanded && (
                        <div style={{ padding: "20px", background: "#fafbfc", borderTop: "1px solid #f1f5f9" }}>
                          {isLoadingA ? (
                            <div style={{ textAlign: "center", padding: "28px" }}>
                              <div style={{ width: "26px", height: "26px", border: "3px solid #fef3c7", borderTop: "3px solid #d97706", borderRadius: "50%", animation: "hof-spin 0.8s linear infinite", margin: "0 auto" }} />
                            </div>
                          ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
                              {CAT_ORDER.map(cat => (
                                <ChampionCard
                                  key={cat}
                                  champion={data?.[cat]}
                                  category={cat}
                                  isCurrentUser={data?.[cat]?.id === currentUserId}
                                  isLoading={false}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

      </div>
    </div>
  );
}









