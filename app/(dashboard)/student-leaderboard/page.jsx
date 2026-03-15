"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { ChampionCard, MiniChip, CrownIcon, CATS, HOF_CSS } from "@/components/hall-of-fame/HofComponents";

const TABS = [
  { id: 'points',         label: 'DAG Points',    color: '#6366f1', bg: '#eef2ff', colLabel: 'DAG POINTS',    valuePrefix: '', valueSuffix: ' pts', description: 'Ranked by DAG Points', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'referral',       label: 'Referrals',     color: '#10b981', bg: '#dcfce7', colLabel: 'REFERRALS',     valuePrefix: '', valueSuffix: '', description: 'Ranked by total referrals', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'sales',          label: 'Sales Commission', color: '#f59e0b', bg: '#fef3c7', colLabel: 'USD EARNED',    valuePrefix: '$', valueSuffix: '', description: 'Ranked by commission earned', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: 'halloffame', label: 'Hall of Fame', color: '#d97706', bg: '#fffbeb', colLabel: 'HALL OF FAME', valuePrefix: '', valueSuffix: '', description: 'Monthly top performers', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M2 19h20v2H2zM2 17l4-10 6 6 4-8 4 12H2z"/></svg> },
];

const RANK_COLORS = { MYTHIC:'#fbbf24',PARAGON:'#7c3aed',CONQUEROR:'#dc2626',CHAMPION:'#ef4444',COMMANDER:'#f59e0b',INVOKER:'#ec4899',STRIKER:'#8b5cf6',GUARDIAN:'#3b82f6',VANGUARD:'#10b981',INITIATOR:'#6b7280' };

function getLast12Months() {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const short = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    months.push({ value, label, short, isCurrent: i === 0 });
  }
  return months;
}
const MONTHS = getLast12Months();
const CAT_ORDER = ['points', 'referrals', 'sales'];

export default function StudentLeaderboardPage() {
  const [activeTab, setActiveTab] = useState('points');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [sortDir, setSortDir] = useState('desc');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [error, setError] = useState(null);

  // ── Hall of Fame state ──
  const [hofMonth, setHofMonth] = useState(MONTHS[0].value);
  const [hofChampions, setHofChampions] = useState(null);
  const [hofMonthLabel, setHofMonthLabel] = useState('');
  const [hofLoading, setHofLoading] = useState(false);
  const [hofError, setHofError] = useState(null);
  const [hofArchiveData, setHofArchiveData] = useState({});
  const [hofExpandedArchive, setHofExpandedArchive] = useState(null);
  const [hofArchiveLoading, setHofArchiveLoading] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setCurrentUserId(session?.user?.id || null));
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const response = await fetch(
        `/api/leaderboard?type=${activeTab}&filter=${timeFilter}&sort=${sortDir}&userId=${currentUserId || ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setLeaderboardData(data.leaderboard || []);
      setCurrentUserRank(data.currentUserRank || null);
    } catch (err) {
      if (err.name === 'AbortError') setError('Request timed out. Please try again.');
      else setError(err.message || 'Failed to load leaderboard');
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, timeFilter, sortDir, currentUserId]);

  useEffect(() => { if (activeTab !== 'halloffame') fetchLeaderboard(); }, [fetchLeaderboard, activeTab]);

  const fetchHofChampions = useCallback(async (month) => {
    try {
      setHofLoading(true);
      setHofError(null);
      const res = await fetch(`/api/hall-of-fame?month=${month}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setHofChampions(data.champions);
      setHofMonthLabel(data.monthLabel);
    } catch (err) {
      setHofError(err.message || 'Failed to load');
      setHofChampions(null);
    } finally {
      setHofLoading(false);
    }
  }, []);

  useEffect(() => { if (activeTab === 'halloffame') fetchHofChampions(hofMonth); }, [activeTab, hofMonth, fetchHofChampions]);

  const fetchHofArchiveMonth = async (month) => {
    if (hofArchiveData[month]) return;
    setHofArchiveLoading(p => ({ ...p, [month]: true }));
    try {
      const res = await fetch(`/api/hall-of-fame?month=${month}`, { cache: 'no-store' });
      const data = await res.json();
      setHofArchiveData(p => ({ ...p, [month]: data.champions }));
    } catch {}
    finally { setHofArchiveLoading(p => ({ ...p, [month]: false })); }
  };

  const toggleHofArchive = (month) => {
    if (hofExpandedArchive === month) { setHofExpandedArchive(null); return; }
    setHofExpandedArchive(month);
    fetchHofArchiveMonth(month);
  };

  const hofArchiveMonths = MONTHS.slice(1);

  const tab = TABS.find(t => t.id === activeTab);
  const fmtValue = (v) => `${tab.valuePrefix}${(Number(v)||0).toLocaleString()}${tab.valueSuffix}`;
  const TIME_OPTIONS = [
    { value: 'all-time', label: 'All Time' },
    { value: 'month-1', label: 'This Month' },
    { value: 'month-2', label: 'Last Month' },
    { value: 'week-1', label: 'This Week' },
    { value: 'week-2', label: 'Last Week' },
  ];

  const posGrad = ['linear-gradient(135deg,#fcd34d,#f59e0b)', 'linear-gradient(135deg,#e2e8f0,#94a3b8)', 'linear-gradient(135deg,#fed7aa,#f97316)'];
  const posText = ['#92400e', '#334155', '#7c2d12'];

  return (
    <div id="wrapper">
      <Header2 />
      <div className="main-content pt-0">
        <div className="page-inner" style={{ padding: '0' }}>
          <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
            <div style={{ width: '240px', flexShrink: 0, padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
              <DashboardNav2 />
            </div>

            <div style={{ flex: 1, padding: '36px 40px', paddingTop: '80px', background: '#f6f8fb', minWidth: 0 }}>
              <style>{HOF_CSS}{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>

              {/* ── Page Header ── */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 22h16" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Leaderboard</h1>
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Compete across 4 categories — Points, Referrals, Sales &amp; Hall of Fame</p>
              </div>

              {/* ── 4 Category Tab Cards ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
                {TABS.map(t => (
                  <button key={t.id} onClick={() => { setActiveTab(t.id); setLeaderboardData([]); }}
                    style={{ padding: '18px 20px', borderRadius: '16px', cursor: 'pointer', textAlign: 'left', border: activeTab === t.id ? `2px solid ${t.color}` : '2px solid transparent', background: activeTab === t.id ? t.bg : '#fff', boxShadow: activeTab === t.id ? `0 4px 16px ${t.color}25` : '0 1px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: activeTab === t.id ? t.color : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeTab === t.id ? '#fff' : '#94a3b8', flexShrink: 0 }}>{t.icon}</div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: activeTab === t.id ? t.color : '#64748b' }}>{t.label}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: activeTab === t.id ? t.color : '#94a3b8', margin: 0, lineHeight: 1.4 }}>{t.description}</p>
                  </button>
                ))}
              </div>

              {/* ── Hall of Fame Panel ── */}
              {activeTab === 'halloffame' && (
                <div>
                  <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '14px 18px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', flexShrink: 0 }}>Select Month</span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {MONTHS.map(m => (
                          <button key={m.value} className="hof-month-btn" onClick={() => setHofMonth(m.value)}
                            style={{ padding: '5px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: hofMonth === m.value ? '700' : '500', cursor: 'pointer', border: hofMonth === m.value ? '1.5px solid #d97706' : '1.5px solid #e2e8f0', background: hofMonth === m.value ? '#fffbeb' : 'transparent', color: hofMonth === m.value ? '#b45309' : '#64748b', outline: 'none' }}>
                            {m.isCurrent ? `${m.short} (Current)` : m.short}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <CrownIcon size={15} color="#d97706" />
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                      {hofLoading ? 'Loading...' : hofError ? 'Error loading data' : `${hofMonthLabel} Champions`}
                    </span>
                    {!hofLoading && !hofError && <span style={{ fontSize: '12px', color: '#94a3b8' }}> one winner per category</span>}
                  </div>
                  {hofError ? (
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #fee2e2', padding: '40px', textAlign: 'center', marginBottom: '32px' }}>
                      <p style={{ fontSize: '14px', color: '#dc2626', fontWeight: '600', marginBottom: '14px' }}>{hofError}</p>
                      <button onClick={() => fetchHofChampions(hofMonth)} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#d97706', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Try Again</button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '36px' }}>
                      {CAT_ORDER.map(cat => (
                        <ChampionCard key={cat} champion={hofChampions?.[cat]} category={cat} isCurrentUser={hofChampions?.[cat]?.id === currentUserId} isLoading={hofLoading} />
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                    </div>
                    <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Past Champions Archive</h2>
                  </div>
                  <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    {hofArchiveMonths.map((m, idx) => {
                      const isExpanded = hofExpandedArchive === m.value;
                      const archData = hofArchiveData[m.value];
                      const isLoadingA = hofArchiveLoading[m.value];
                      const isLast = idx === hofArchiveMonths.length - 1;
                      return (
                        <div key={m.value} style={{ borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>
                          <div className="hof-archive-row" onClick={() => toggleHofArchive(m.value)}
                            style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', background: isExpanded ? '#fafbfc' : '#fff', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '180px', flexShrink: 0 }}>
                              <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <CrownIcon size={12} color="#d97706" />
                              </div>
                              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{m.label}</span>
                            </div>
                            {!isExpanded && (
                              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0' }}>
                                {CAT_ORDER.map((cat, ci) => (
                                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', borderLeft: ci > 0 ? '1px solid #f1f5f9' : 'none' }}>
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: CATS[cat].color, flexShrink: 0 }} />
                                    <MiniChip champion={archData?.[cat]} category={cat} />
                                  </div>
                                ))}
                              </div>
                            )}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"
                              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 'auto' }}>
                              <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          {isExpanded && (
                            <div style={{ padding: '20px', background: '#fafbfc', borderTop: '1px solid #f1f5f9' }}>
                              {isLoadingA ? (
                                <div style={{ textAlign: 'center', padding: '28px' }}>
                                  <div style={{ width: '26px', height: '26px', border: '3px solid #fef3c7', borderTop: '3px solid #d97706', borderRadius: '50%', animation: 'hof-spin 0.8s linear infinite', margin: '0 auto' }} />
                                </div>
                              ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
                                  {CAT_ORDER.map(cat => (
                                    <ChampionCard key={cat} champion={archData?.[cat]} category={cat} isCurrentUser={archData?.[cat]?.id === currentUserId} isLoading={false} />
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
              )}

              {/* ── Filter & Sort Bar (hidden on HOF tab) ── */}
              {activeTab !== 'halloffame' && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', background: '#fff', borderRadius: '14px', padding: '12px 20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px' }}>Period</span>
                  {TIME_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setTimeFilter(opt.value)}
                      style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: timeFilter === opt.value ? `1.5px solid ${tab.color}` : '1.5px solid #e2e8f0', background: timeFilter === opt.value ? tab.bg : '#f8fafc', color: timeFilter === opt.value ? tab.color : '#64748b', transition: 'all 0.15s' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort</span>
                  <button onClick={() => setSortDir('desc')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: sortDir === 'desc' ? `1.5px solid ${tab.color}` : '1.5px solid #e2e8f0', background: sortDir === 'desc' ? tab.bg : '#f8fafc', color: sortDir === 'desc' ? tab.color : '#64748b' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 4h13M3 8h9M3 12h5M17 20V4M17 20l-4-4M17 20l4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Highest First
                  </button>
                  <button onClick={() => setSortDir('asc')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: sortDir === 'asc' ? `1.5px solid ${tab.color}` : '1.5px solid #e2e8f0', background: sortDir === 'asc' ? tab.bg : '#f8fafc', color: sortDir === 'asc' ? tab.color : '#64748b' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 20h13M3 16h9M3 12h5M17 4v16M17 4l-4 4M17 4l4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Lowest First
                  </button>
                </div>
              </div>}

              {/* ── Leaderboard content (hidden on HOF tab) ── */}
              {activeTab !== 'halloffame' && <>

              {/* ── Loading ── */}
              {loading && (
                <div style={{ background: '#fff', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '36px', height: '36px', border: `3px solid ${tab.bg}`, borderTop: `3px solid ${tab.color}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                  <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Loading {tab.label} leaderboard...</p>
                  <style>{``}</style>
                </div>
              )}

              {/* ── Error ── */}
              {!loading && error && (
                <div style={{ background: '#fff', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #fee2e2' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#dc2626', marginBottom: '6px' }}>Failed to load</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{error}</p>
                  <button onClick={fetchLeaderboard} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Try Again</button>
                </div>
              )}

              {/* ── Empty ── */}
              {!loading && !error && leaderboardData.length === 0 && (
                <div style={{ background: '#fff', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: tab.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: tab.color }}>
                    {tab.icon}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>No data yet</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8' }}>No {tab.label.toLowerCase()} rankings found for this period.</p>
                </div>
              )}

              {/* ── Main Table ── */}
              {!loading && !error && leaderboardData.length > 0 && (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

                  {/* Table column header */}
                  <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'points' ? '56px 1fr 120px 120px 120px 120px 120px 120px' : activeTab === 'sales' ? '56px 1fr 130px 130px 130px 130px' : '56px 1fr 130px 130px 130px', padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {(activeTab === 'points'
                      ? ['#', 'MEMBER', 'TIER', 'RANK', 'EARNED', 'BURNED', 'REDEEMED', 'NET POINTS']
                      : activeTab === 'sales' ? ['#', 'MEMBER', 'TIER', 'RANK', 'USD EARNED', 'USDT EARNED'] : ['#', 'MEMBER', 'TIER', 'RANK', tab.colLabel]
                    ).map((h, i) => (
                      <div key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: i === 0 ? 'center' : i >= 4 ? 'right' : 'left', paddingLeft: i === 1 ? '49px' : i === 2 ? '8px' : i === 3 ? '60px' : '0' }}>{h}</div>
                    ))}
                  </div>

                  {/* Rows */}
                  {leaderboardData.map((u, idx) => {
                    const isTop3 = u.rank <= 3;
                    const rColor = RANK_COLORS[u.current_rank] || '#94a3b8';
                    const isMe = u.isCurrentUser;
                    const isPoints = activeTab === 'points';
                    return (
                      <div key={u.id || idx}
                        style={{ display: 'grid', gridTemplateColumns: isPoints ? '56px 1fr 120px 120px 120px 120px 120px 120px' : activeTab === 'sales' ? '56px 1fr 130px 130px 130px 130px' : '56px 1fr 130px 130px 130px', padding: '13px 24px', alignItems: 'center', borderBottom: idx < leaderboardData.length - 1 ? '1px solid #f1f5f9' : 'none', background: isMe ? `${tab.color}08` : '#fff', transition: 'background 0.15s' }}
                        onMouseEnter={e => { if (!isMe) e.currentTarget.style.background = '#f8fafc'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = isMe ? `${tab.color}08` : '#fff'; }}
                      >
                        {/* Position */}
                        <div style={{ textAlign: 'center' }}>
                          {isTop3 ? (
                            <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: posGrad[u.rank - 1], display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: '13px', fontWeight: '800', color: posText[u.rank - 1] }}>{u.rank}</span>
                            </div>
                          ) : (
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8' }}>{u.rank}</span>
                          )}
                        </div>

                        {/* Member */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: 0 }}>
                          <img src={u.avatar} alt={u.name} style={{ width: '38px', height: '38px', borderRadius: '50%', border: `2px solid ${isTop3 ? tab.color + '50' : '#e2e8f0'}`, flexShrink: 0, objectFit: 'cover' }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
                              {isMe && <span style={{ fontSize: '10px', fontWeight: '700', color: tab.color, background: tab.bg, padding: '1px 7px', borderRadius: '100px', flexShrink: 0 }}>YOU</span>}
                            </div>
                          </div>
                        </div>

                        {/* Tier */}
                        <div>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px', background: u.tier === 'DAG_LIEUTENANT' ? '#dcfce7' : '#f1f5f9', color: u.tier === 'DAG_LIEUTENANT' ? '#10b981' : '#64748b', border: `1px solid ${u.tier === 'DAG_LIEUTENANT' ? '#bbf7d0' : '#e2e8f0'}` }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            {u.tier === 'DAG_LIEUTENANT' ? 'Lieutenant' : 'Soldier'}
                          </span>
                        </div>

                        {/* DAG Rank */}
                        <div style={{ textAlign: 'right' }}>
                          {(() => {
                            const rank = u.current_rank || 'STARTER';
                            const rc = RANK_COLORS[rank] || '#6b7280';
                            return (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.4px', background: rc + '15', color: rc, border: `1px solid ${rc}30` }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: rc, flexShrink: 0, display: 'inline-block' }} />
                                {rank}
                              </span>
                            );
                          })()}
                        </div>

                        {/* Value — for non-points tabs */}
                        {!isPoints && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: tab.color }}>{fmtValue(u.value)}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500', marginTop: '1px' }}>{activeTab === 'sales' ? 'USD EARNED' : tab.colLabel}</div>
                          </div>
                        )}

                        {/* USDT Earned — sales tab only */}
                        {activeTab === 'sales' && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0ea5e9' }}>{u.usdt_earned != null ? `$${Number(u.usdt_earned).toLocaleString()}` : '—'}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500', marginTop: '1px' }}>USDT</div>
                          </div>
                        )}

                        {/* Points tab: Earned, Burned, Redeemed, Net columns */}
                        {isPoints && (
                          <>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>{(u.points_earned || 0).toLocaleString()}</div>
                              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginTop: '1px' }}>pts earned</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: (u.points_burned || 0) > 0 ? '#ef4444' : '#cbd5e1' }}>{(u.points_burned || 0).toLocaleString()}</div>
                              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginTop: '1px' }}>rank burns</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: (u.points_redeemed || 0) > 0 ? '#f59e0b' : '#cbd5e1' }}>{(u.points_redeemed || 0).toLocaleString()}</div>
                              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginTop: '1px' }}>redeemed</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '14px', fontWeight: '800', color: tab.color }}>{fmtValue(u.value)}</div>
                              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginTop: '1px' }}>net pts</div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Your rank callout */}
              {currentUserRank && !loading && (
                <div style={{ marginTop: '16px', padding: '12px 20px', background: tab.bg, borderRadius: '12px', border: `1px solid ${tab.color}30`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tab.color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: tab.color }}>Your rank: <strong>#{currentUserRank}</strong> on the {tab.label} leaderboard</span>
                </div>
              )}
              </>}

            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
}
