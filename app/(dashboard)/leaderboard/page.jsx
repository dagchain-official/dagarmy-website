"use client";
import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { ChampionCard, MiniChip, CrownIcon, CATS, HOF_CSS } from "@/components/hall-of-fame/HofComponents";

/* ── Neumorphic palette (matches Dashboard / UpgradesBenefits) ── */
const nm = {
  bg:            '#f0f2f5',
  shadow:        '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)',
  shadowSm:      '4px 4px 10px rgba(0,0,0,0.11), -3px -3px 8px rgba(255,255,255,0.88)',
  shadowXs:      '3px 3px 7px rgba(0,0,0,0.09), -2px -2px 5px rgba(255,255,255,0.85)',
  shadowInset:   'inset 3px 3px 7px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.85)',
  border:        'rgba(0,0,0,0.06)',
  accent:        '#4f46e5',
  textPrimary:   '#1e293b',
  textDark:      '#334155',
  textMuted:     '#94a3b8',
};

const TABS = [
  { id: 'points',     label: 'DAG Points',       color: '#6366f1', bg: '#eef2ff', colLabel: 'DAG POINTS',  valuePrefix: '', valueSuffix: ' pts', description: 'Ranked by DAG Points',        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'referral',   label: 'Referrals',         color: '#10b981', bg: '#dcfce7', colLabel: 'REFERRALS',   valuePrefix: '', valueSuffix: '',      description: 'Ranked by total referrals',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'sales',      label: 'Sales',             color: '#f59e0b', bg: '#fef3c7', colLabel: 'USD EARNED',  valuePrefix: '$', valueSuffix: '',      description: 'Ranked by commission earned', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: 'halloffame', label: 'Hall of Fame',      color: '#d97706', bg: '#fffbeb', colLabel: 'HALL OF FAME',valuePrefix: '', valueSuffix: '',      description: 'Monthly top performers',      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M2 19h20v2H2zM2 17l4-10 6 6 4-8 4 12H2z"/></svg> },
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
  const [mob, setMob] = useState(true);
  useLayoutEffect(() => {
    const check = () => setMob(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [activeTab, setActiveTab] = useState('points');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [sortDir, setSortDir] = useState('desc');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

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
      setPage(1);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const response = await fetch(
        `/api/leaderboard?type=${activeTab}&filter=${timeFilter}&sort=${sortDir}&userId=${currentUserId || ''}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', signal: controller.signal }
      );
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      setLeaderboardData(data.leaderboard || []);
      setCurrentUserRank(data.currentUserRank || null);
    } catch (err) {
      if (err.name === 'AbortError') setError('Request timed out. Please try again.');
      else setError(err.message || 'Failed to load leaderboard');
      setLeaderboardData([]);
    } finally { setLoading(false); }
  }, [activeTab, timeFilter, sortDir, currentUserId]);

  useEffect(() => { setPage(1); }, [activeTab, timeFilter, sortDir]);
  useEffect(() => { if (activeTab !== 'halloffame') fetchLeaderboard(); }, [fetchLeaderboard, activeTab]);

  const fetchHofChampions = useCallback(async (month) => {
    try {
      setHofLoading(true); setHofError(null);
      const res = await fetch(`/api/hall-of-fame?month=${month}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setHofChampions(data.champions);
      setHofMonthLabel(data.monthLabel);
    } catch (err) { setHofError(err.message || 'Failed to load'); setHofChampions(null); }
    finally { setHofLoading(false); }
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
    { value: 'all-time', label: 'All Time',    shortLabel: 'All' },
    { value: 'month-1',  label: 'This Month',  shortLabel: 'Month' },
    { value: 'month-2',  label: 'Last Month',  shortLabel: 'L.Mo' },
    { value: 'week-1',   label: 'This Week',   shortLabel: 'Week' },
    { value: 'week-2',   label: 'Last Week',   shortLabel: 'L.Wk' },
  ];

  /* ─── Mobile rank card ─── */
  const MobileRankCard = ({ u, idx }) => {
    const isTop3 = u.rank <= 3;
    const isMe   = u.isCurrentUser;
    const posGrad = ['linear-gradient(135deg,#fcd34d,#f59e0b)', 'linear-gradient(135deg,#e2e8f0,#94a3b8)', 'linear-gradient(135deg,#fed7aa,#f97316)'];
    const posText = ['#92400e', '#334155', '#7c2d12'];
    const isPoints = activeTab === 'points';
    const isSales  = activeTab === 'sales';

    return (
      <div style={{
        background: isMe ? `${tab.color}08` : nm.bg,
        borderRadius: '14px',
        boxShadow: isMe ? `0 0 0 2px ${tab.color}30, ${nm.shadowSm}` : nm.shadowXs,
        padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        {/* Rank badge */}
        <div style={{ flexShrink: 0 }}>
          {isTop3 ? (
            <div style={{ width: '34px', height: '34px', borderRadius: '11px', background: posGrad[u.rank - 1], display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 6px rgba(0,0,0,0.15)' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: posText[u.rank - 1] }}>{u.rank}</span>
            </div>
          ) : (
            <div style={{ width: '34px', height: '34px', borderRadius: '11px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: nm.textPrimary }}>{u.rank}</span>
            </div>
          )}
        </div>

        {/* Avatar */}
        <img src={u.avatar} alt={u.name}
          style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover',
            boxShadow: isTop3 ? `0 0 0 2px ${tab.color}60` : nm.shadowXs }} />

        {/* Name + tier */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: nm.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
            {isMe && <span style={{ fontSize: '8px', fontWeight: '800', color: tab.color, background: nm.bg, boxShadow: nm.shadowXs, padding: '2px 6px', borderRadius: '100px', flexShrink: 0, letterSpacing: '0.5px' }}>YOU</span>}
          </div>
          <span style={{ fontSize: '10px', fontWeight: '600', color: nm.textMuted }}>
            {u.tier === 'DAG_LIEUTENANT' ? 'Lieutenant' : 'Soldier'}
          </span>
        </div>

        {/* Value */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {isPoints ? (
            <>
              <div style={{ fontSize: '15px', fontWeight: '800', color: nm.accent }}>{fmtValue(u.value)}</div>
              <div style={{ fontSize: '9px', color: nm.textMuted, fontWeight: '600' }}>net pts</div>
            </>
          ) : isSales ? (
            <>
              <div style={{ fontSize: '15px', fontWeight: '800', color: nm.accent }}>{fmtValue(u.value)}</div>
              <div style={{ fontSize: '9px', color: nm.textMuted, fontWeight: '600' }}>DGCC</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '15px', fontWeight: '800', color: nm.accent }}>{fmtValue(u.value)}</div>
              <div style={{ fontSize: '9px', color: nm.textMuted, fontWeight: '600' }}>referrals</div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ flex: 1, minWidth: 0, padding: mob ? '20px 14px 80px' : '32px 24px 48px', overflowY: 'auto', background: nm.bg }}>
      <style>{HOF_CSS}{`
        @keyframes nmSpin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes nmFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .nm-tab-btn:hover { box-shadow: 5px 5px 12px rgba(0,0,0,0.12), -4px -4px 9px rgba(255,255,255,0.88) !important; }
        .nm-row:hover { background: rgba(255,255,255,0.6) !important; }
        .nm-filter-btn:hover { box-shadow: 3px 3px 7px rgba(0,0,0,0.1), -2px -2px 5px rgba(255,255,255,0.85) !important; }
        .nm-archive-row:hover { background: rgba(255,255,255,0.55) !important; cursor:pointer; }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: mob ? '18px' : '28px', animation: 'nmFadeUp 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: mob ? '10px' : '14px', marginBottom: '6px' }}>
          <div style={{ width: mob ? '38px' : '46px', height: mob ? '38px' : '46px', borderRadius: '14px', background: nm.bg, boxShadow: nm.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width={mob ? '18' : '22'} height={mob ? '18' : '22'} viewBox="0 0 24 24" fill="none" stroke={nm.accent} strokeWidth="1.8">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 22h16" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: mob ? '20px' : '24px', fontWeight: '800', color: nm.textPrimary, margin: 0, letterSpacing: '-0.4px' }}>Leaderboard</h1>
            {!mob && <p style={{ fontSize: '13px', color: nm.textDark, margin: 0, fontWeight: '500' }}>Compete across 4 categories — Points, Referrals, Sales &amp; Hall of Fame</p>}
          </div>
        </div>
      </div>

      {/* ── Category Tab Cards ── */}
      {mob ? (
        /* Mobile: text-only tab pills, no icons — fits all 4 without scrolling */
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} className="nm-tab-btn"
                onClick={() => { setActiveTab(t.id); setLeaderboardData([]); }}
                style={{
                  flex: 1,
                  padding: '9px 4px', borderRadius: '12px', cursor: 'pointer', border: 'none',
                  background: nm.bg, outline: 'none',
                  boxShadow: active ? nm.shadowInset : nm.shadowSm,
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: active ? t.color : nm.textDark, whiteSpace: 'nowrap', display: 'block' }}>
                  {t.id === 'halloffame' ? 'Hall of Fame' : t.label}
                </span>
                {active && <div style={{ width: '20px', height: '2.5px', borderRadius: '2px', background: t.color, margin: '5px auto 0' }} />}
              </button>
            );
          })}
        </div>
      ) : (
        /* Desktop: 4-column cards */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '22px' }}>
          {TABS.map((t, i) => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} className="nm-tab-btn"
                onClick={() => { setActiveTab(t.id); setLeaderboardData([]); }}
                style={{
                  padding: '18px 20px', borderRadius: '18px', cursor: 'pointer', textAlign: 'left', border: 'none',
                  background: nm.bg, outline: 'none',
                  boxShadow: active ? nm.shadowInset : nm.shadowSm,
                  transition: 'all 0.2s ease',
                  animation: `nmFadeUp 0.4s ease ${i * 60}ms both`,
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    background: nm.bg,
                    boxShadow: active ? `inset 2px 2px 5px rgba(0,0,0,0.12), inset -2px -2px 4px rgba(255,255,255,0.8)` : nm.shadowXs,
                    color: active ? t.color : nm.textDark,
                  }}>{t.icon}</div>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: active ? t.color : nm.textDark }}>{t.label}</span>
                </div>
                <p style={{ fontSize: '11px', color: active ? t.color : nm.textDark, margin: 0, lineHeight: 1.5, fontWeight: '500' }}>{t.description}</p>
                {active && <div style={{ marginTop: '10px', height: '3px', borderRadius: '2px', background: t.color, boxShadow: `0 0 8px ${t.color}60`, width: '40px' }} />}
              </button>
            );
          })}
        </div>
      )}

      {/* ══ HALL OF FAME PANEL ══ */}
      {activeTab === 'halloffame' && (
        <div style={{ animation: 'nmFadeUp 0.4s ease' }}>
          {/* Month selector */}
          <div style={{ background: nm.bg, borderRadius: '16px', boxShadow: nm.shadowSm, padding: mob ? '12px 14px' : '16px 20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: mob ? 'flex-start' : 'center', gap: '10px', flexDirection: mob ? 'column' : 'row', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.8px', flexShrink: 0 }}>Month</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', overflowX: mob ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', width: mob ? '100%' : 'auto' }}>
                {MONTHS.map(m => (
                  <button key={m.value} onClick={() => setHofMonth(m.value)}
                    style={{
                      padding: '5px 11px', borderRadius: '9px', fontSize: '11px', fontWeight: hofMonth === m.value ? '700' : '500',
                      cursor: 'pointer', border: 'none', outline: 'none', flexShrink: 0,
                      background: nm.bg,
                      boxShadow: hofMonth === m.value ? nm.shadowInset : nm.shadowXs,
                      color: hofMonth === m.value ? '#b45309' : nm.textDark,
                      transition: 'all 0.15s',
                    }}>
                    {m.isCurrent ? `${m.short} ★` : m.short}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Champions heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CrownIcon size={14} color="#d97706" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '700', color: nm.textPrimary }}>
              {hofLoading ? 'Loading...' : hofError ? 'Error' : `${hofMonthLabel} Champions`}
            </span>
            {!hofLoading && !hofError && !mob && <span style={{ fontSize: '12px', color: nm.textDark, fontWeight: '500' }}>— one winner per category</span>}
          </div>

          {hofError ? (
            <div style={{ background: nm.bg, borderRadius: '16px', boxShadow: nm.shadowSm, padding: '40px', textAlign: 'center', marginBottom: '28px' }}>
              <p style={{ fontSize: '14px', color: '#dc2626', fontWeight: '600', marginBottom: '14px' }}>{hofError}</p>
              <button onClick={() => fetchHofChampions(hofMonth)} style={{ padding: '8px 22px', borderRadius: '10px', border: 'none', background: nm.bg, boxShadow: nm.shadowSm, color: '#d97706', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Try Again</button>
            </div>
          ) : (
            /* Mobile: stack champion cards, Desktop: 3-col grid */
            <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)', gap: mob ? '10px' : '16px', marginBottom: '28px' }}>
              {CAT_ORDER.map(cat => (
                <ChampionCard key={cat} champion={hofChampions?.[cat]} category={cat} isCurrentUser={hofChampions?.[cat]?.id === currentUserId} isLoading={hofLoading} />
              ))}
            </div>
          )}

          {/* Archive */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={nm.textDark} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            </div>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: nm.textPrimary, margin: 0 }}>Past Champions Archive</h2>
          </div>
          <div style={{ background: nm.bg, borderRadius: '16px', boxShadow: nm.shadowSm, overflow: 'hidden' }}>
            {hofArchiveMonths.map((m, idx) => {
              const isExpanded = hofExpandedArchive === m.value;
              const archData = hofArchiveData[m.value];
              const isLoadingA = hofArchiveLoading[m.value];
              const isLast = idx === hofArchiveMonths.length - 1;
              return (
                <div key={m.value} style={{ borderBottom: isLast ? 'none' : `1px solid ${nm.border}` }}>
                  <div className="nm-archive-row" onClick={() => toggleHofArchive(m.value)}
                    style={{ display: 'flex', alignItems: 'center', padding: mob ? '11px 14px' : '13px 20px', gap: '12px', transition: 'background 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, minWidth: mob ? '100px' : '160px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CrownIcon size={11} color="#d97706" />
                      </div>
                      <span style={{ fontSize: mob ? '12px' : '13px', fontWeight: '700', color: nm.textPrimary, whiteSpace: 'nowrap' }}>{m.short}</span>
                    </div>
                    {!isExpanded && !mob && (
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0' }}>
                        {CAT_ORDER.map((cat, ci) => (
                          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 14px', borderLeft: ci > 0 ? `1px solid ${nm.border}` : 'none' }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: CATS[cat].color, flexShrink: 0 }} />
                            <MiniChip champion={archData?.[cat]} category={cat} />
                          </div>
                        ))}
                      </div>
                    )}
                    {!isExpanded && mob && (
                      <span style={{ fontSize: '10px', color: nm.textMuted, flex: 1 }}>
                        {archData ? CAT_ORDER.map(c => archData[c]?.name || '—').join(' · ') : 'Tap to expand'}
                      </span>
                    )}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={nm.textDark} strokeWidth="2.5"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 'auto' }}>
                      <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: mob ? '14px' : '20px', borderTop: `1px solid ${nm.border}` }}>
                      {isLoadingA ? (
                        <div style={{ textAlign: 'center', padding: '28px' }}>
                          <div style={{ width: '26px', height: '26px', border: '3px solid rgba(0,0,0,0.06)', borderTop: '3px solid #d97706', borderRadius: '50%', animation: 'nmSpin 0.8s linear infinite', margin: '0 auto' }} />
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)', gap: mob ? '10px' : '14px' }}>
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

      {/* ══ LEADERBOARD TABLE (Points / Referrals / Sales) ══ */}
      {activeTab !== 'halloffame' && (
        <div style={{ animation: 'nmFadeUp 0.4s ease' }}>

          {/* ── Filter & Sort Bar ── */}
          {mob ? (
            /* Mobile: two rows */
            <div style={{ background: nm.bg, borderRadius: '14px', boxShadow: nm.shadowSm, padding: '12px 14px', marginBottom: '14px' }}>
              {/* Period chips */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', paddingBottom: '2px' }}>
                {TIME_OPTIONS.map(opt => (
                  <button key={opt.value} className="nm-filter-btn"
                    onClick={() => setTimeFilter(opt.value)}
                    style={{
                      padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', flexShrink: 0,
                      cursor: 'pointer', border: 'none', outline: 'none', transition: 'all 0.15s',
                      background: nm.bg,
                      boxShadow: timeFilter === opt.value ? nm.shadowInset : nm.shadowXs,
                      color: timeFilter === opt.value ? tab.color : nm.textDark,
                    }}>
                    {opt.shortLabel}
                  </button>
                ))}
                <div style={{ width: '1px', background: nm.border, margin: '0 4px', flexShrink: 0 }} />
                {[
                  { val: 'desc', label: '↓ High' },
                  { val: 'asc',  label: '↑ Low' },
                ].map(s => (
                  <button key={s.val} className="nm-filter-btn"
                    onClick={() => setSortDir(s.val)}
                    style={{
                      padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', flexShrink: 0,
                      cursor: 'pointer', border: 'none', outline: 'none', transition: 'all 0.15s',
                      background: nm.bg,
                      boxShadow: sortDir === s.val ? nm.shadowInset : nm.shadowXs,
                      color: sortDir === s.val ? tab.color : nm.textDark,
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
              {/* Count */}
              {!loading && !error && leaderboardData.length > 0 && (
                <p style={{ margin: 0, fontSize: '11px', color: nm.textMuted, fontWeight: '500' }}>
                  {leaderboardData.length} members · showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, leaderboardData.length)}
                </p>
              )}
            </div>
          ) : (
            /* Desktop: original single-row filter bar */
            <div style={{ background: nm.bg, borderRadius: '16px', boxShadow: nm.shadowSm, padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.6px', marginRight: '2px' }}>Period</span>
                {TIME_OPTIONS.map(opt => (
                  <button key={opt.value} className="nm-filter-btn"
                    onClick={() => setTimeFilter(opt.value)}
                    style={{
                      padding: '6px 14px', borderRadius: '9px', fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer', border: 'none', outline: 'none', transition: 'all 0.15s',
                      background: nm.bg,
                      boxShadow: timeFilter === opt.value ? nm.shadowInset : nm.shadowXs,
                      color: timeFilter === opt.value ? tab.color : nm.textDark,
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Sort</span>
                  {[
                    { val: 'desc', label: 'Highest', icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 4h13M3 8h9M3 12h5M17 20V4M17 20l-4-4M17 20l4-4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                    { val: 'asc',  label: 'Lowest',  icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 20h13M3 16h9M3 12h5M17 4v16M17 4l-4 4M17 4l4 4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                  ].map(s => (
                    <button key={s.val} className="nm-filter-btn"
                      onClick={() => setSortDir(s.val)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '6px 14px', borderRadius: '9px', fontSize: '12px', fontWeight: '600',
                        cursor: 'pointer', border: 'none', outline: 'none', transition: 'all 0.15s',
                        background: nm.bg,
                        boxShadow: sortDir === s.val ? nm.shadowInset : nm.shadowXs,
                        color: sortDir === s.val ? tab.color : nm.textDark,
                      }}>
                      {s.icon}{s.label}
                    </button>
                  ))}
                </div>
                {/* Top Pagination Desktop */}
                {!loading && !error && leaderboardData.length > PAGE_SIZE && (() => {
                  const totalPages = Math.ceil(leaderboardData.length / PAGE_SIZE);
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', borderLeft: `1px solid ${nm.border}`, paddingLeft: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textDark, marginRight: '2px' }}>{page}/{totalPages}</span>
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', outline: 'none', cursor: page === 1 ? 'default' : 'pointer', background: nm.bg, boxShadow: page === 1 ? nm.shadowInset : nm.shadowXs, color: page === 1 ? nm.textMuted : nm.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                          style={{ minWidth: '28px', height: '28px', padding: '0 6px', borderRadius: '8px', border: 'none', outline: 'none', cursor: 'pointer', background: nm.bg, boxShadow: page === p ? nm.shadowInset : nm.shadowXs, color: page === p ? tab.color : nm.textPrimary, fontSize: '12px', fontWeight: page === p ? '800' : '600', transition: 'all 0.15s' }}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', outline: 'none', cursor: page === totalPages ? 'default' : 'pointer', background: nm.bg, boxShadow: page === totalPages ? nm.shadowInset : nm.shadowXs, color: page === totalPages ? nm.textMuted : nm.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div style={{ background: nm.bg, borderRadius: '18px', boxShadow: nm.shadowSm, padding: mob ? '40px 20px' : '64px', textAlign: 'center' }}>
              <div style={{ width: '38px', height: '38px', border: `3px solid ${nm.border}`, borderTop: `3px solid ${tab.color}`, borderRadius: '50%', animation: 'nmSpin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '14px', color: nm.textDark, fontWeight: '600', margin: 0 }}>Loading {tab.label} leaderboard...</p>
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div style={{ background: nm.bg, borderRadius: '18px', boxShadow: nm.shadowSm, padding: mob ? '40px 20px' : '52px', textAlign: 'center' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#dc2626', marginBottom: '6px' }}>Failed to load</h3>
              <p style={{ fontSize: '13px', color: nm.textDark, marginBottom: '18px' }}>{error}</p>
              <button onClick={fetchLeaderboard} style={{ padding: '9px 24px', borderRadius: '10px', border: 'none', background: nm.bg, boxShadow: nm.shadowSm, color: nm.accent, fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Try Again</button>
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && !error && leaderboardData.length === 0 && (
            <div style={{ background: nm.bg, borderRadius: '18px', boxShadow: nm.shadowSm, padding: mob ? '40px 20px' : '64px', textAlign: 'center' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: tab.color }}>{tab.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: nm.textPrimary, marginBottom: '6px' }}>No data yet</h3>
              <p style={{ fontSize: '13px', color: nm.textDark, margin: 0 }}>No {tab.label.toLowerCase()} rankings found for this period.</p>
            </div>
          )}

          {/* ── Main content ── */}
          {!loading && !error && leaderboardData.length > 0 && (
            mob ? (
              /* ── MOBILE: card list ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {leaderboardData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((u, idx) => (
                  <MobileRankCard key={u.id || idx} u={u} idx={idx} />
                ))}
              </div>
            ) : (
              /* ── DESKTOP: table layout (unchanged) ── */
              <div style={{ background: nm.bg, borderRadius: '18px', boxShadow: nm.shadowSm, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {/* Column headers */}
                {(() => {
                  const isPoints = activeTab === 'points';
                  const isSales = activeTab === 'sales';
                  const cols = isPoints
                    ? '48px 7fr 1.5fr 1fr 1fr 1fr'
                    : isSales ? '48px 7fr 1.5fr 1.5fr 1.5fr' : '48px 7fr 2fr 2fr';
                  const headers = isPoints
                    ? ['#', 'MEMBER', 'TIER', 'EARNED', 'REDEEMED', 'NET POINTS']
                    : isSales ? ['#', 'MEMBER', 'TIER', 'USD EARNED', 'USDT EARNED']
                    : ['#', 'MEMBER', 'TIER', tab.colLabel];
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '11px 16px', borderBottom: `1px solid ${nm.border}` }}>
                      {headers.map((h, i) => (
                        <div key={h} style={{ fontSize: '10px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.7px', textAlign: i === 0 ? 'center' : i >= 3 ? 'right' : 'left', paddingLeft: i === 1 ? '16px' : i === 2 ? '44px' : '0' }}>{h}</div>
                      ))}
                    </div>
                  );
                })()}
                {/* Rows */}
                {leaderboardData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((u, idx) => {
                  const isPoints = activeTab === 'points';
                  const isSales = activeTab === 'sales';
                  const cols = isPoints ? '48px 7fr 1.5fr 1fr 1fr 1fr' : isSales ? '48px 7fr 1.5fr 1.5fr 1.5fr' : '48px 7fr 2fr 2fr';
                  const isTop3 = u.rank <= 3;
                  const isMe = u.isCurrentUser;
                  const posGrad = ['linear-gradient(135deg,#fcd34d,#f59e0b)', 'linear-gradient(135deg,#e2e8f0,#94a3b8)', 'linear-gradient(135deg,#fed7aa,#f97316)'];
                  const posText = ['#92400e', '#334155', '#7c2d12'];
                  const pageSlice = leaderboardData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
                  return (
                    <div key={u.id || idx} className="nm-row"
                      style={{
                        display: 'grid', gridTemplateColumns: cols,
                        padding: '8px 16px', alignItems: 'center',
                        borderBottom: idx < pageSlice.length - 1 ? `1px solid ${nm.border}` : 'none',
                        background: isMe ? `${tab.color}08` : 'transparent',
                        transition: 'background 0.15s',
                      }}>
                      <div style={{ textAlign: 'center' }}>
                        {isTop3 ? (
                          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: posGrad[u.rank - 1], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 6px rgba(0,0,0,0.15)' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: posText[u.rank - 1] }}>{u.rank}</span>
                          </div>
                        ) : (
                          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: nm.textPrimary }}>{u.rank}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, paddingLeft: '16px' }}>
                        <img src={u.avatar} alt={u.name}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover',
                            boxShadow: isTop3 ? `0 0 0 2px ${tab.color}60, ${nm.shadowXs}` : nm.shadowXs }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: nm.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
                            {isMe && <span style={{ fontSize: '9px', fontWeight: '800', color: tab.color, background: nm.bg, boxShadow: nm.shadowXs, padding: '2px 7px', borderRadius: '100px', flexShrink: 0, letterSpacing: '0.5px' }}>YOU</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <img src={u.tier === 'DAG_LIEUTENANT' ? '/images/badges/dag-lieutenant.svg' : '/images/badges/dag-soldier.svg'} alt={u.tier === 'DAG_LIEUTENANT' ? 'Lieutenant' : 'Soldier'} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.textPrimary, whiteSpace: 'nowrap' }}>
                          {u.tier === 'DAG_LIEUTENANT' ? 'Lieutenant' : 'Soldier'}
                        </span>
                      </div>
                      {!isPoints && !isSales && (
                        <div style={{ textAlign: 'right' }}><div style={{ fontSize: '15px', fontWeight: '800', color: nm.textPrimary }}>{fmtValue(u.value)}</div><div style={{ fontSize: '11px', color: nm.textDark, fontWeight: '600', marginTop: '2px' }}>{tab.colLabel}</div></div>
                      )}
                      {isSales && (
                        <div style={{ textAlign: 'right' }}><div style={{ fontSize: '15px', fontWeight: '800', color: nm.textPrimary }}>{fmtValue(u.value)}</div><div style={{ fontSize: '11px', color: nm.textDark, fontWeight: '600', marginTop: '2px' }}>USD</div></div>
                      )}
                      {isSales && (
                        <div style={{ textAlign: 'right' }}><div style={{ fontSize: '15px', fontWeight: '800', color: nm.textPrimary }}>{u.usdt_earned != null ? `$${Number(u.usdt_earned).toLocaleString()}` : '-'}</div><div style={{ fontSize: '11px', color: nm.textDark, fontWeight: '600', marginTop: '2px' }}>USDT</div></div>
                      )}
                      {isPoints && (
                        <>
                          <div style={{ textAlign: 'right' }}><div style={{ fontSize: '15px', fontWeight: '700', color: nm.textPrimary }}>{(u.points_earned || 0).toLocaleString()}</div><div style={{ fontSize: '11px', color: nm.textDark, fontWeight: '600', marginTop: '2px' }}>earned</div></div>
                          <div style={{ textAlign: 'right' }}><div style={{ fontSize: '15px', fontWeight: '700', color: nm.textPrimary }}>{(u.points_redeemed || 0).toLocaleString()}</div><div style={{ fontSize: '11px', color: nm.textDark, fontWeight: '600', marginTop: '2px' }}>redeemed</div></div>
                          <div style={{ textAlign: 'right' }}><div style={{ fontSize: '16px', fontWeight: '800', color: nm.textPrimary }}>{fmtValue(u.value)}</div><div style={{ fontSize: '11px', color: nm.textDark, fontWeight: '600', marginTop: '2px' }}>net pts</div></div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* ── Mobile Pagination ── */}
          {mob && !loading && !error && leaderboardData.length > PAGE_SIZE && (() => {
            const totalPages = Math.ceil(leaderboardData.length / PAGE_SIZE);
            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '14px' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', outline: 'none', cursor: page === 1 ? 'default' : 'pointer', background: nm.bg, boxShadow: page === 1 ? nm.shadowInset : nm.shadowXs, color: page === 1 ? nm.textMuted : nm.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <span style={{ fontSize: '13px', fontWeight: '700', color: nm.textPrimary }}>{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', outline: 'none', cursor: page === totalPages ? 'default' : 'pointer', background: nm.bg, boxShadow: page === totalPages ? nm.shadowInset : nm.shadowXs, color: page === totalPages ? nm.textMuted : nm.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            );
          })()}

          {/* ── Desktop Pagination ── */}
          {!mob && !loading && !error && leaderboardData.length > PAGE_SIZE && (() => {
            const totalPages = Math.ceil(leaderboardData.length / PAGE_SIZE);
            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', padding: '12px 20px', background: nm.bg, borderRadius: '14px', boxShadow: nm.shadowSm }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textDark }}>
                  Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, leaderboardData.length)} of {leaderboardData.length}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ width: '32px', height: '32px', borderRadius: '9px', border: 'none', outline: 'none', cursor: page === 1 ? 'default' : 'pointer', background: nm.bg, boxShadow: page === 1 ? nm.shadowInset : nm.shadowXs, color: page === 1 ? nm.textMuted : nm.textDark, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ minWidth: '32px', height: '32px', padding: '0 8px', borderRadius: '9px', border: 'none', outline: 'none', cursor: 'pointer', background: nm.bg, boxShadow: page === p ? nm.shadowInset : nm.shadowXs, color: page === p ? tab.color : nm.textPrimary, fontSize: '13px', fontWeight: page === p ? '800' : '600', transition: 'all 0.15s' }}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ width: '32px', height: '32px', borderRadius: '9px', border: 'none', outline: 'none', cursor: page === totalPages ? 'default' : 'pointer', background: nm.bg, boxShadow: page === totalPages ? nm.shadowInset : nm.shadowXs, color: page === totalPages ? nm.textMuted : nm.textDark, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ── Your rank callout ── */}
          {currentUserRank && !loading && (
            <div style={{ marginTop: '14px', padding: mob ? '11px 14px' : '13px 20px', background: nm.bg, borderRadius: '14px', boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: nm.bg, boxShadow: `inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={tab.color} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <span style={{ fontSize: mob ? '12px' : '13px', fontWeight: '600', color: nm.textPrimary }}>Your rank: <strong style={{ color: tab.color }}>#{currentUserRank}</strong> on the {tab.label} leaderboard</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
