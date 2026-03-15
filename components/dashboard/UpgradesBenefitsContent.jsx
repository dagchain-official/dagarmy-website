"use client";
import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight, TrendingUp, Users, Target, Crown, Sparkles, Info
} from 'lucide-react';

const nm = {
  bg:            '#f0f2f5',
  shadow:        '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)',
  shadowSm:      '4px 4px 10px rgba(0,0,0,0.11), -3px -3px 8px rgba(255,255,255,0.88)',
  shadowXs:      '3px 3px 7px rgba(0,0,0,0.09), -2px -2px 5px rgba(255,255,255,0.85)',
  shadowInsetSm: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.85)',
  border:        'rgba(0,0,0,0.06)',
  accent:        '#4f46e5',
  textPrimary:   '#1e293b',
  textDark:      '#334155',
  textMuted:     '#94a3b8',
};

function NmCard({ children, style = {}, delay = 0, hover = true }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      style={{
        background: nm.bg, borderRadius: '18px',
        boxShadow: nm.shadowSm,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s ease',
        ...style,
      }}
      onMouseEnter={hover ? e => { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
      onMouseLeave={hover ? e => { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
    >
      {children}
    </div>
  );
}

const RANKS = [
  { key: 'initiator',  label: 'INITIATOR',  num: 1  },
  { key: 'vanguard',   label: 'VANGUARD',   num: 2  },
  { key: 'guardian',   label: 'GUARDIAN',   num: 3  },
  { key: 'striker',    label: 'STRIKER',    num: 4  },
  { key: 'invoker',    label: 'INVOKER',    num: 5  },
  { key: 'commander',  label: 'COMMANDER',  num: 6  },
  { key: 'champion',   label: 'CHAMPION',   num: 7  },
  { key: 'conqueror',  label: 'CONQUEROR',  num: 8  },
  { key: 'paragon',    label: 'PARAGON',    num: 9  },
  { key: 'mythic',     label: 'MYTHIC',     num: 10 },
];

const BADGE = key => `/images/badges/dag-${key}.svg`;

export default function UpgradesBenefitsContent({ mounted: parentMounted }) {
  const [config, setConfig]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch('/api/rewards/benefits')
      .then(r => r.json())
      .then(d => {
        if (d.success) setConfig(d.config);
        else setError('Failed to load benefits data');
      })
      .catch(() => setError('Failed to load benefits data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: nm.bg, boxShadow: nm.shadowSm, border: '3px solid transparent', borderTopColor: nm.accent, animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: '13px', color: nm.textPrimary, fontWeight: '500' }}>Loading benefits...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <p style={{ fontSize: '14px', color: nm.textPrimary, fontWeight: '600' }}>{error}</p>
    </div>
  );

  const c = config;
  const ltTotal    = (c.soldier_signup_bonus || 500) + (c.lieutenant_upgrade_base || 2500) + Math.round(((c.lieutenant_upgrade_base || 2500) * (c.lieutenant_bonus_rate || 20)) / 100);
  const ltJoin     = Math.round(((c.soldier_refers_soldier_join || 500) * (1 + (c.lieutenant_bonus_rate || 20) / 100)));
  const ltUpgrade  = Math.round(((c.soldier_refers_soldier_upgrade || 2500) * (1 + (c.lieutenant_bonus_rate || 20) / 100)));

  // Cumulative burn totals
  let cumBurn = 0;
  const rankData = RANKS.map(r => {
    const burn    = c[`rank_burn_${r.key}`]            || 0;
    const ptBonus = c[`rank_upgrade_bonus_${r.key}`]   || 0;
    const commRate = c[`rank_commission_${r.key}`]     || 0;
    cumBurn += burn;
    return { ...r, burn, ptBonus, commRate, cumBurn };
  });

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SECTION 1 — Tier Comparison                           */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>Tier Comparison</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

        {/* DAG SOLDIER */}
        <NmCard delay={0} style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${nm.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={BADGE('soldier')} alt="DAG SOLDIER" style={{ width: '42px', height: '42px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>DAG SOLDIER</h3>
                <p style={{ fontSize: '11px', color: nm.textDark, margin: '2px 0 0', fontWeight: '500' }}>Free tier · automatic on registration</p>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.textPrimary }}>FREE</span>
            </div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {[
              { label: 'Signup Bonus',        value: `+${c.soldier_signup_bonus || 500} pts` },
              { label: 'Social Task Bonus',   value: 'Base only' },
              { label: 'L1 Sales Commission', value: `${c.soldier_direct_sales_commission || 7}%` },
              { label: 'L2 Sales Commission', value: `${c.soldier_level2_sales_commission || 3}%` },
              { label: 'L3 Sales Commission', value: `${c.soldier_level3_sales_commission || 2}%` },
              { label: 'Rank System',         value: 'All 10 ranks' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 24px', borderBottom: `1px solid ${nm.border}` }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textPrimary }}>{row.label}</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: nm.accent }}>{row.value}</span>
              </div>
            ))}
            {/* Referral Earnings row */}
            <div style={{ padding: '11px 24px', borderBottom: `1px solid ${nm.border}` }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textPrimary, display: 'block', marginBottom: '6px' }}>Referral Earnings</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500' }}>Referee joins</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: nm.accent }}>+{c.soldier_refers_soldier_join || 500} pts</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500' }}>Referee upgrades to LT</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: nm.accent }}>+{(c.soldier_refers_soldier_join || 500) + (c.soldier_refers_soldier_upgrade || 2500)} pts total</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '14px 24px', borderTop: `1px solid ${nm.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.5px' }}>On Signup</span>
            <span style={{ fontSize: '22px', fontWeight: '900', color: nm.accent, letterSpacing: '-1px' }}>+{c.soldier_signup_bonus || 500} <span style={{ fontSize: '12px', fontWeight: '700' }}>pts</span></span>
          </div>
        </NmCard>

        {/* DAG LIEUTENANT */}
        <NmCard delay={80} style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${nm.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={BADGE('lieutenant')} alt="DAG LIEUTENANT" style={{ width: '42px', height: '42px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.14))' }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>DAG LIEUTENANT</h3>
                <p style={{ fontSize: '11px', color: nm.textDark, margin: '2px 0 0', fontWeight: '500' }}>Paid upgrade from DAG SOLDIER</p>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.accent }}>${c.lieutenant_upgrade_price_usd || 149} USD</span>
            </div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {[
              { label: 'Total Signup + Upgrade', value: `+${ltTotal} pts`,                                           highlight: true },
              { label: 'Social Task Bonus',      value: `+${c.lieutenant_bonus_rate || 20}% on all tasks`,           highlight: true },
              { label: 'L1 Sales Commission',    value: `${c.soldier_direct_sales_commission || 7}%+`, note: 'rank upgrades' },
              { label: 'L2 Sales Commission',    value: `${c.soldier_level2_sales_commission || 3}%` },
              { label: 'L3 Sales Commission',    value: `${c.soldier_level3_sales_commission || 2}%` },
              { label: 'Rank System',            value: 'All 10 ranks',                                              highlight: true },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 24px', borderBottom: `1px solid ${nm.border}`, background: row.highlight ? 'rgba(79,70,229,0.03)' : 'transparent' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textPrimary }}>{row.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {row.note && <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.textDark }}>{row.note}</span>}
                  <span style={{ fontSize: '12px', fontWeight: '800', color: nm.accent }}>{row.value}</span>
                </div>
              </div>
            ))}
            {/* Referral Earnings row */}
            <div style={{ padding: '11px 24px', borderBottom: `1px solid ${nm.border}`, background: 'rgba(79,70,229,0.03)' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textPrimary, display: 'block', marginBottom: '6px' }}>Referral Earnings</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500' }}>Referee joins</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.textDark }}>+{c.lieutenant_bonus_rate || 20}%</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: nm.accent }}>+{ltJoin} pts</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500' }}>Referee upgrades to LT</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.textDark }}>+{c.lieutenant_bonus_rate || 20}%</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: nm.accent }}>+{ltJoin + ltUpgrade} pts total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '14px 24px', borderTop: `1px solid ${nm.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Upgrade Points</span>
            <span style={{ fontSize: '22px', fontWeight: '900', color: nm.accent, letterSpacing: '-1px' }}>+{ltTotal} <span style={{ fontSize: '12px', fontWeight: '700' }}>pts</span></span>
          </div>
        </NmCard>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SECTION 2 — Sales Commission Structure                 */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>Sales Commission Structure</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

        {/* Level breakdown */}
        <NmCard delay={100} style={{ padding: '22px 24px' }}>
          <p style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, margin: '0 0 16px' }}>Commission Levels</p>
          <p style={{ fontSize: '11px', color: nm.textPrimary, margin: '0 0 16px', fontWeight: '500', lineHeight: '1.6' }}>
            Earned on every DAGChain node sale — up to 3 levels deep in your referral chain.
          </p>
          {[
            { level: 'Level 1', label: 'Direct (your referee buys)', rate: c.soldier_direct_sales_commission || 7, note: 'rank upgrades this' },
            { level: 'Level 2', label: '2nd downline buys',          rate: c.soldier_level2_sales_commission || 3, note: 'fixed' },
            { level: 'Level 3', label: '3rd downline buys',          rate: c.soldier_level3_sales_commission || 2, note: 'fixed' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: i < 2 ? '10px' : 0 }}>
              <div style={{ minWidth: '54px', height: '36px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '0 8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '900', color: nm.accent, whiteSpace: 'nowrap' }}>{row.level}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: nm.textPrimary, margin: 0 }}>{row.label}</p>
                <p style={{ fontSize: '10px', color: nm.textDark, margin: '1px 0 0', fontWeight: '500' }}>{row.note}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: nm.accent, letterSpacing: '-0.5px' }}>{row.rate}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted }}>%</span>
              </div>
            </div>
          ))}

          {/* Example commissions */}
          <div style={{ marginTop: '18px', padding: '14px 16px', borderRadius: '12px', background: nm.bg, boxShadow: nm.shadowInsetSm }}>
            <p style={{ fontSize: '15px', fontWeight: '700', color: nm.textPrimary, margin: '0 0 10px', lineHeight: '1.6' }}>
              For Example: If your referral user makes a purchase of{' '}
              <strong style={{ fontWeight: '800', color: nm.textPrimary }}>$1,000 worth</strong> of DAGChain Validator Node / Storage Node / DAG GPT Subscription:
            </p>
            {(() => {
              const sale = 1000;
              const mythicL1 = rankData[9]?.commRate || 20;
              const l2 = c.soldier_level2_sales_commission || 3;
              const l3 = c.soldier_level3_sales_commission || 2;
              const examples = [
                {
                  title: 'STARTER',
                  badge: 'starter',
                  rows: [
                    { lv: 'Level 1', pct: c.soldier_direct_sales_commission || 7,  note: 'Direct — base rate' },
                    { lv: 'Level 2', pct: l2, note: '2nd Level — fixed' },
                    { lv: 'Level 3', pct: l3, note: '3rd Level — fixed' },
                  ],
                },
                {
                  title: 'MYTHIC Rank',
                  badge: 'mythic',
                  rows: [
                    { lv: 'Level 1', pct: mythicL1, note: 'Direct — MYTHIC rate' },
                    { lv: 'Level 2', pct: l2,        note: '2nd Level — fixed' },
                    { lv: 'Level 3', pct: l3,        note: '3rd Level — fixed' },
                  ],
                },
              ];
              return examples.map((ex, ei) => (
                <div key={ei} style={{ marginBottom: ei < 1 ? '12px' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                    <img src={BADGE(ex.badge)} alt={ex.title} style={{ width: '22px', height: '22px', objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.12))' }} />
                    <span style={{ fontSize: '11px', fontWeight: '800', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{ex.title}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {ex.rows.map((row, ri) => {
                      const earned = (row.pct / 100 * sale).toFixed(0);
                      return (
                        <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs }}>
                          <span style={{ fontSize: '11px', fontWeight: '900', color: nm.accent, width: '52px', flexShrink: 0 }}>{row.lv}</span>
                          <span style={{ fontSize: '15px', fontWeight: '500', color: nm.textDark, flex: 1 }}>{row.note}</span>
                          <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textDark }}>{row.pct}%</span>
                          <span style={{ fontSize: '14px', fontWeight: '900', color: nm.accent, letterSpacing: '-0.3px', minWidth: '52px', textAlign: 'right' }}>${earned} <span style={{ fontSize: '9px', fontWeight: '600', color: nm.textMuted }}>USDT</span></span>
                        </div>
                      );
                    })}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px 0' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Total earned</span>
                      <span style={{ fontSize: '15px', fontWeight: '900', color: nm.textPrimary, letterSpacing: '-0.5px' }}>
                        ${ex.rows.reduce((s, r) => s + Math.round(r.pct / 100 * sale), 0)} <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textMuted }}>USDT</span>
                      </span>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </NmCard>

        {/* Rank L1 override */}
        <NmCard delay={140} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, margin: '0 0 4px' }}>L1 Rate by Rank</p>
          <p style={{ fontSize: '11px', color: nm.textDark, margin: '0 0 16px', fontWeight: '500', lineHeight: '1.6' }}>
            Reaching a rank replaces your base {c.soldier_direct_sales_commission || 7}% L1 rate. Each rank has its own fixed rate — not cumulative.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '5px' }}>
            {/* STARTER — no rank achieved */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 14px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowInsetSm, flex: 1 }}>
              <img src={BADGE('starter')} alt="STARTER" style={{ width: '32px', height: '32px', objectFit: 'contain', opacity: 0.7 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.4px' }}>STARTER</span>
                <p style={{ fontSize: '10px', color: nm.textDark, margin: '1px 0 0', fontWeight: '500' }}>No rank achieved yet</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '20px', fontWeight: '900', color: nm.textPrimary, letterSpacing: '-0.5px' }}>{c.soldier_direct_sales_commission || 7}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted }}>%</span>
              </div>
            </div>
            {rankData.map(r => (
              <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 14px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, flex: 1 }}>
                <img src={BADGE(r.key)} alt={r.label} style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.1))' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{r.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: nm.accent, letterSpacing: '-0.5px' }}>{r.commRate}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted }}>%</span>
                </div>
              </div>
            ))}
          </div>
        </NmCard>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SECTION 3 — Rank Progression                          */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>Rank Progression</p>
      </div>

      {/* Info note */}
      <NmCard delay={160} hover={false} style={{ padding: '14px 20px', marginBottom: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <Info size={15} color={nm.textMuted} style={{ flexShrink: 0, marginTop: '1px' }} />
        <p style={{ fontSize: '12px', color: nm.textPrimary, margin: 0, lineHeight: '1.7', fontWeight: '500' }}>
          Ranks apply to <strong style={{ fontWeight: '800' }}>both</strong> DAG SOLDIER and DAG LIEUTENANT.
          Each rank requires burning points — sequential progression (must reach previous rank first).
          Point bonuses are <strong style={{ fontWeight: '800' }}>per-stage</strong>, not cumulative.
          L1 commission <strong style={{ fontWeight: '800' }}>replaces</strong> the base rate — it does not stack.
        </p>
      </NmCard>

      <NmCard delay={200} style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 110px 120px 110px 110px', gap: '8px', padding: '12px 20px', borderBottom: `1px solid ${nm.border}` }}>
          {['', 'Rank', 'Burn (pts)', 'Cumulative', 'Pt Bonus', 'L1 Commission'].map((h, i) => (
            <span key={i} style={{ fontSize: '10px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: i >= 2 ? 'right' : 'left' }}>{h}</span>
          ))}
        </div>
        {rankData.map((r, i) => (
          <div key={r.key}
            style={{ display: 'grid', gridTemplateColumns: '44px 1fr 110px 120px 110px 110px', gap: '8px', padding: '13px 20px', alignItems: 'center', borderBottom: i < 9 ? `1px solid ${nm.border}` : 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Badge */}
            <img src={BADGE(r.key)} alt={r.label} style={{ width: '36px', height: '36px', objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.12))' }} />
            {/* Name */}
            <div>
              <span style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary }}>{r.num}. {r.label}</span>
              {i === 0 && <span style={{ marginLeft: '8px', fontSize: '9px', fontWeight: '700', padding: '1px 7px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.accent }}>Entry</span>}
              {i === 9 && <span style={{ marginLeft: '8px', fontSize: '9px', fontWeight: '700', padding: '1px 7px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.textPrimary }}>Highest</span>}
            </div>
            {/* Burn */}
            <span style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, textAlign: 'right' }}>{r.burn.toLocaleString()}</span>
            {/* Cumulative burn */}
            <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textDark, textAlign: 'right' }}>{r.cumBurn.toLocaleString()}</span>
            {/* Point bonus */}
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: nm.accent }}>+{r.ptBonus}%</span>
              <span style={{ fontSize: '10px', color: nm.textDark, marginLeft: '3px' }}>on base</span>
            </div>
            {/* L1 commission */}
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: nm.accent }}>{r.commRate}%</span>
            </div>
          </div>
        ))}
        {/* Footer */}
        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 110px 120px 110px 110px', gap: '8px', padding: '12px 20px', borderTop: `1px solid ${nm.border}`, alignItems: 'center' }}>
          <div />
          <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total burn to reach MYTHIC</span>
          <span style={{ fontSize: '18px', fontWeight: '900', color: nm.textPrimary, letterSpacing: '-0.5px', textAlign: 'right' }}>
            {rankData[rankData.length - 1]?.cumBurn.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted }}>pts</span>
          </span>
          <div /><div /><div />
        </div>
      </NmCard>

      {/* SECTION 4 — How to Progress */}
      <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>How to Progress</p>
      </div>

      <NmCard delay={220} style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {[
            {
              step: '1',
              icon: <img src={BADGE('soldier')} alt="DAG SOLDIER" style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />,
              title: 'Register as DAG SOLDIER',
              body: `Instant +${c.soldier_signup_bonus || 500} pts on signup. Free to join.`,
            },
            {
              step: '2',
              icon: <img src={BADGE('lieutenant')} alt="LIEUTENANT" style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />,
              title: 'Upgrade to DAG LIEUTENANT',
              body: `Pay $${c.lieutenant_upgrade_price_usd || 149} USD. Get +${ltTotal} total pts. Unlock +${c.lieutenant_bonus_rate || 20}% bonus on all future referral & task earnings.`,
            },
            {
              step: '3',
              icon: <img src={BADGE('starter')} alt="STARTER" style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))' }} />,
              title: 'Earn Points',
              body: `Refer others (+${c.soldier_refers_soldier_join || 500} pts join, +${c.soldier_refers_soldier_upgrade || 2500} pts upgrade). Complete social tasks. Earn sales commissions.`,
            },
            {
              step: '4',
              icon: <img src={BADGE('initiator')} alt="INITIATOR" style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />,
              title: 'Burn to Rank Up',
              body: `Spend ${(c.rank_burn_initiator || 1000).toLocaleString()} pts to reach INITIATOR. Each rank unlocks higher L1 commission and point bonus rates.`,
            },
            {
              step: '5',
              icon: <img src={BADGE('mythic')} alt="MYTHIC" style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />,
              title: 'Reach MYTHIC',
              body: `Max L1 commission (${rankData[9]?.commRate || 20}%), +100% point bonus on base. Total burn: ${rankData[rankData.length - 1]?.cumBurn.toLocaleString()} pts.`,
            },
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    {s.icon}
                    <span style={{ fontSize: '10px', fontWeight: '800', color: nm.textDark }}>Step {s.step}</span>
                  </div>
                  {i < 4 && <div style={{ flex: 1, height: '2px', background: nm.bg, boxShadow: nm.shadowInsetSm, borderRadius: '2px' }} />}
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '800', color: nm.textPrimary, margin: '0 0 4px' }}>{s.title}</p>
                  <p style={{ fontSize: '11px', color: nm.textDark, margin: 0, lineHeight: '1.6', fontWeight: '500' }}>{s.body}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </NmCard>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SECTION 5 — How to Earn DAG Points                    */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>How to Earn DAG Points</p>
      </div>

      {/* Row 1 — Signup & Upgrade (full width) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Signup & Tier Upgrade */}
        <NmCard delay={240} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <img src={BADGE('soldier')} alt="Signup" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.12))' }} />
            <p style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>Signup & Tier Upgrade</p>
          </div>
          {/* Column headers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '6px', borderBottom: `1px solid ${nm.border}`, marginBottom: '2px' }}>
            <span style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textDark, width: '80px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>SOLDIER</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.accent,      width: '80px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>LIEUTENANT</span>
            </div>
          </div>
          {[
            { label: 'DAG SOLDIER signup',         soldier: `+${c.soldier_signup_bonus || 500} pts`,  lt: `+${c.soldier_signup_bonus || 500} pts` },
            { label: 'Upgrade to DAG LIEUTENANT',  soldier: '—',                                       lt: `+${(c.lieutenant_upgrade_base || 2500) + Math.round((c.lieutenant_upgrade_base || 2500) * (c.lieutenant_bonus_rate || 20) / 100)} pts` },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '9px 0', borderBottom: i < 1 ? `1px solid ${nm.border}` : 'none', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textDark, flex: 1 }}>{row.label}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 0', width: '80px', textAlign: 'center', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.textPrimary }}>{row.soldier}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 0', width: '80px', textAlign: 'center', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.accent }}>{row.lt}</span>
              </div>
            </div>
          ))}
        </NmCard>

        {/* Referral Points */}
        <NmCard delay={260} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <img src={BADGE('initiator')} alt="Referral" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.12))' }} />
            <p style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>Referral Points</p>
          </div>
          {/* Column headers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '6px', borderBottom: `1px solid ${nm.border}`, marginBottom: '2px' }}>
            <span style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textDark, width: '80px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>SOLDIER</span>
              <div style={{ width: '80px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: nm.accent, textTransform: 'uppercase', letterSpacing: '0.4px' }}>LIEUTENANT</span>
                <span style={{ fontSize: '9px', fontWeight: '700', color: nm.accent, marginLeft: '3px' }}>+{c.lieutenant_bonus_rate || 20}%</span>
              </div>
            </div>
          </div>
          {[
            {
              label: 'Referee joins',
              soldier: `+${c.soldier_refers_soldier_join || 500} pts`,
              lt: `+${Math.round((c.soldier_refers_soldier_join || 500) * (1 + (c.lieutenant_bonus_rate || 20) / 100))} pts`,
            },
            {
              label: 'Referee upgrades to LT',
              soldier: `+${(c.soldier_refers_soldier_join || 500) + (c.soldier_refers_soldier_upgrade || 2500)} pts`,
              lt: `+${Math.round(((c.soldier_refers_soldier_join || 500) + (c.soldier_refers_soldier_upgrade || 2500)) * (1 + (c.lieutenant_bonus_rate || 20) / 100))} pts`,
            },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '9px 0', borderBottom: i < 1 ? `1px solid ${nm.border}` : 'none', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textDark, flex: 1 }}>{row.label}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 0', width: '80px', textAlign: 'center', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.textPrimary }}>{row.soldier}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 0', width: '80px', textAlign: 'center', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.accent }}>{row.lt}</span>
              </div>
            </div>
          ))}
        </NmCard>
      </div>

      {/* Row 2 — Sales & Social Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

        {/* DAG Points from Sales */}
        <NmCard delay={280} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <img src={BADGE('vanguard')} alt="Sales" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.12))' }} />
            <p style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>DAG Points from Sales</p>
          </div>
          <p style={{ fontSize: '11px', color: nm.textDark, margin: '0 0 14px', lineHeight: '1.6', fontWeight: '500' }}>
            Earn DAG Points on every $ worth of sales — DAGChain node / subscription sales, whether from your own purchase or made by your direct referral.
          </p>
          {(() => {
            const selfRate   = c.self_sale_dag_points_per_dollar       || 25;
            const refRate    = c.referral_sale_dag_points_per_dollar    || 25;
            const ltBonus    = c.sale_dag_points_lieutenant_bonus       || 20;
            const ltSelfRate = Math.floor(selfRate * (1 + ltBonus / 100));
            const ltRefRate  = Math.floor(refRate  * (1 + ltBonus / 100));
            return (
              <>
                {[
                  { label: 'Self Sale',          soldierRate: selfRate, ltRate: ltSelfRate },
                  { label: 'Direct Referral Sale', soldierRate: refRate,  ltRate: ltRefRate  },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: nm.textPrimary, flex: 1 }}>{row.label}</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: nm.textPrimary, letterSpacing: '-0.5px' }}>{row.soldierRate}</span>
                        <span style={{ fontSize: '9px', fontWeight: '600', color: nm.textMuted, marginLeft: '2px' }}>pts/$</span>
                        <p style={{ fontSize: '9px', color: nm.textMuted, margin: '1px 0 0', fontWeight: '600' }}>SOLDIER</p>
                      </div>
                      <div style={{ width: '1px', height: '28px', background: nm.border }} />
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: nm.accent, letterSpacing: '-0.5px' }}>{row.ltRate}</span>
                        <span style={{ fontSize: '9px', fontWeight: '600', color: nm.textMuted, marginLeft: '2px' }}>pts/$</span>
                        <p style={{ fontSize: '9px', color: nm.accent, margin: '1px 0 0', fontWeight: '700' }}>LIEUTENANT</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '6px', padding: '8px 12px', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowInsetSm }}>
                  <p style={{ fontSize: '11px', color: nm.textDark, margin: 0, lineHeight: '1.6', fontWeight: '500' }}>
                    Example: $100 sale — SOLDIER earns <strong style={{ color: nm.textPrimary }}>{selfRate * 100} pts</strong>, LIEUTENANT earns <strong style={{ color: nm.accent }}>{ltSelfRate * 100} pts</strong> (+{ltBonus}% bonus)
                  </p>
                </div>
              </>
            );
          })()}
        </NmCard>

        {/* Social Tasks */}
        <NmCard delay={300} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <img src={BADGE('guardian')} alt="Tasks" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.12))' }} />
            <p style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>Daily & Community Mission</p>
          </div>
          <p style={{ fontSize: '11px', color: nm.textDark, margin: '0 0 4px', lineHeight: '1.6', fontWeight: '500' }}>
            Complete social missions to earn DAG Points. DAG LIEUTENANT earns a <strong style={{ color: nm.accent }}>+{c.social_task_lt_bonus_rate || 20}% bonus</strong> on every mission.
          </p>
          <p style={{ fontSize: '10px', color: nm.textDark, margin: '0 0 12px', fontWeight: '600', fontStyle: 'italic' }}>
            Missions & Point values below are for illustration only - actual Mission points may vary, and visible in Mission's Menu.
          </p>
          {[
            { label: 'Like & Share post',     base: c.social_task_like_share       || 10,  category: 'Daily' },
            { label: 'Comment / Watch video',  base: c.social_task_comments_watch   || 10,  category: 'Daily' },
            { label: 'Create Shorts',          base: c.social_task_create_shorts    || 50,  category: 'Community' },
            { label: 'Explainer Video',        base: c.social_task_explainer_video  || 100, category: 'Community' },
            { label: 'Subscribe & Follow',    base: c.social_task_subscribe        || 150, category: 'Community' },
          ].map((task, i) => {
            const ltBonus = Math.round(task.base * (c.social_task_lt_bonus_rate || 20) / 100);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: i < 4 ? `1px solid ${nm.border}` : 'none' }}>
                <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '6px', background: nm.bg, boxShadow: nm.shadowXs, color: task.category === 'Daily' ? nm.textDark : nm.accent, whiteSpace: 'nowrap' }}>{task.category}</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textDark, flex: 1 }}>{task.label}</span>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: nm.textPrimary }}>~{task.base} pts</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '6px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.accent }}>~{task.base + ltBonus} LT</span>
                </div>
              </div>
            );
          })}
        </NmCard>
      </div>

    </div>
  );
}
