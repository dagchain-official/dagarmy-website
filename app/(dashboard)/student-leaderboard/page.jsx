"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";

const TABS = [
  { id: 'points',         label: 'Points',        color: '#6366f1', bg: '#eef2ff', colLabel: 'DAG POINTS',    valuePrefix: '', valueSuffix: ' pts', description: 'Ranked by DAG Points', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'referral',       label: 'Referrals',     color: '#10b981', bg: '#dcfce7', colLabel: 'REFERRALS',     valuePrefix: '', valueSuffix: '', description: 'Ranked by total referrals', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'sales',          label: 'Sales',         color: '#f59e0b', bg: '#fef3c7', colLabel: 'USD EARNED',    valuePrefix: '$', valueSuffix: '', description: 'Ranked by commission earned', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: 'certifications', label: 'Certifications', color: '#8b5cf6', bg: '#ede9fe', colLabel: 'CERTIFICATIONS', valuePrefix: '', valueSuffix: '', description: 'Ranked by courses certified', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> },
];

const RANK_COLORS = { MYTHIC:'#fbbf24',PARAGON:'#7c3aed',CONQUEROR:'#dc2626',CHAMPION:'#ef4444',COMMANDER:'#f59e0b',INVOKER:'#ec4899',STRIKER:'#8b5cf6',GUARDIAN:'#3b82f6',VANGUARD:'#10b981',INITIATOR:'#6b7280' };

export default function StudentLeaderboardPage() {
  const [activeTab, setActiveTab] = useState('points');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [sortDir, setSortDir] = useState('desc');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [error, setError] = useState(null);

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

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

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

            <div style={{ flex: 1, padding: '36px 40px', background: '#f6f8fb', minWidth: 0 }}>

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
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Compete across 4 categories — certifications, referrals, sales, and points</p>
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

              {/* ── Filter & Sort Bar ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', background: '#fff', borderRadius: '14px', padding: '12px 20px', border: '1px solid #e2e8f0' }}>
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
              </div>

              {/* ── Loading ── */}
              {loading && (
                <div style={{ background: '#fff', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '36px', height: '36px', border: `3px solid ${tab.bg}`, borderTop: `3px solid ${tab.color}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                  <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Loading {tab.label} leaderboard...</p>
                  <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
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
                  <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'points' ? '56px 1fr 120px 120px 120px 120px 120px 120px' : '56px 1fr 130px 130px 130px', padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {(activeTab === 'points'
                      ? ['#', 'MEMBER', 'TIER', 'RANK', 'EARNED', 'BURNED', 'REDEEMED', 'NET POINTS']
                      : ['#', 'MEMBER', 'TIER', 'RANK', tab.colLabel]
                    ).map((h, i) => (
                      <div key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: i === 0 ? 'center' : i >= 3 ? 'right' : 'left' }}>{h}</div>
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
                        style={{ display: 'grid', gridTemplateColumns: isPoints ? '56px 1fr 120px 120px 120px 120px 120px 120px' : '56px 1fr 130px 130px 130px', padding: '13px 24px', alignItems: 'center', borderBottom: idx < leaderboardData.length - 1 ? '1px solid #f1f5f9' : 'none', background: isMe ? `${tab.color}08` : '#fff', transition: 'background 0.15s' }}
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
                            {u.tier === 'DAG_LIEUTENANT' ? 'LT' : 'SOLDIER'}
                          </span>
                        </div>

                        {/* DAG Rank */}
                        <div style={{ textAlign: 'right' }}>
                          {u.current_rank ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.4px', background: rColor + '15', color: rColor, border: `1px solid ${rColor}30` }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: rColor, flexShrink: 0, display: 'inline-block' }} />
                              {u.current_rank}
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '600' }}>—</span>
                          )}
                        </div>

                        {/* Value — for non-points tabs, single column */}
                        {!isPoints && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: tab.color }}>{fmtValue(u.value)}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500', marginTop: '1px' }}>{tab.colLabel}</div>
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

            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
}
