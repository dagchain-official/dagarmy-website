"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';

const nm = {
  bg: '#f0f2f5',
  shadow: '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)',
  shadowSm: '4px 4px 10px rgba(0,0,0,0.11), -3px -3px 8px rgba(255,255,255,0.88)',
  shadowXs: '3px 3px 7px rgba(0,0,0,0.09), -2px -2px 5px rgba(255,255,255,0.85)',
  shadowInsetSm: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.85)',
  border: 'rgba(0,0,0,0.06)',
  accent: '#4f46e5',
  textPrimary: '#1e293b',
  textDark: '#334155',
  textMuted: '#94a3b8',
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

const BADGE = key => `/images/badges/dag-${key}.svg`;

export default function UpgradesBenefitsContent({ mounted: parentMounted }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const soldierSignup = c.soldier_signup_bonus || 500;
  const ltPrice = c.lieutenant_upgrade_price_usd || 149;
  const soldierL1 = Math.max(c.soldier_direct_sales_commission || 15, 15);
  const ltL1 = 20;
  const l2 = c.soldier_level2_sales_commission || 3;
  const l3 = c.soldier_level3_sales_commission || 2;
  const soldierSpend = c.referral_sale_dag_points_per_dollar || 25;
  const ltSpend = 50;

  // Referral join bonus per referrer tier (from new rules)
  const soldierRefJoin = 500;   // Soldier referrer earns 500 when directs join
  const ltRefJoin = 1000;  // LT referrer earns 1000 when directs join
  const soldierRefUpgrade = 500;   // Soldier referrer earns 500 when direct upgrades to LT
  const ltRefUpgrade = 1000;  // LT referrer earns 1000 when direct upgrades to LT

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
              { label: 'Signup Bonus', value: `+${soldierSignup} pts` },
              { label: 'Spend-Based Earning', value: `${soldierSpend} pts / $1 spent` },
              { label: 'L1 Sales Commission', value: `${soldierL1}%` },
              { label: 'L2 Sales Commission', value: `${l2}%` },
              { label: 'L3 Sales Commission', value: `${l3}%` },
              { label: 'Fortune 500 Pool', value: 'Auto-enrolled ✓' },
              { label: 'Elite Pool', value: 'Not eligible' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 24px', borderBottom: `1px solid ${nm.border}` }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textPrimary }}>{row.label}</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: nm.accent }}>{row.value}</span>
              </div>
            ))}
            {/* Referral Earnings */}
            <div style={{ padding: '11px 24px', borderBottom: `1px solid ${nm.border}` }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textPrimary, display: 'block', marginBottom: '6px' }}>Referral Earnings (you as referrer)</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500' }}>When direct joins</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: nm.accent }}>+{soldierRefJoin} pts</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500' }}>When direct upgrades to LT</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: nm.accent }}>+{soldierRefUpgrade} pts</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '14px 24px', borderTop: `1px solid ${nm.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.5px' }}>On Signup</span>
            <span style={{ fontSize: '22px', fontWeight: '900', color: nm.accent, letterSpacing: '-1px' }}>+{soldierSignup} <span style={{ fontSize: '12px', fontWeight: '700' }}>pts</span></span>
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
              <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.accent }}>${ltPrice} USD</span>
            </div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {[
              { label: 'Signup Bonus', value: `+${soldierSignup} pts`, highlight: false },
              { label: 'Spend-Based Earning', value: `${ltSpend} pts / $1 spent`, highlight: true },
              { label: 'L1 Sales Commission', value: `${ltL1}%`, highlight: true },
              { label: 'L2 Sales Commission', value: `${l2}%`, highlight: false },
              { label: 'L3 Sales Commission', value: `${l3}%`, highlight: false },
              { label: 'Fortune 500 Pool', value: 'Auto-enrolled ✓', highlight: true },
              { label: 'Elite Pool', value: 'Eligible · Launches at MainNet', highlight: true },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 24px', borderBottom: `1px solid ${nm.border}`, background: row.highlight ? 'rgba(79,70,229,0.03)' : 'transparent' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textPrimary }}>{row.label}</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: nm.accent }}>{row.value}</span>
              </div>
            ))}
            {/* Referral Earnings */}
            <div style={{ padding: '11px 24px', borderBottom: `1px solid ${nm.border}`, background: 'rgba(79,70,229,0.03)' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textPrimary, display: 'block', marginBottom: '6px' }}>Referral Earnings (you as referrer)</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500' }}>When direct joins</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: nm.accent }}>+{ltRefJoin} pts</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500' }}>When direct upgrades to LT</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: nm.accent }}>+{ltRefUpgrade} pts</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '14px 24px', borderTop: `1px solid ${nm.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upgrade Price</span>
            <span style={{ fontSize: '22px', fontWeight: '900', color: nm.accent, letterSpacing: '-1px' }}>${ltPrice} <span style={{ fontSize: '12px', fontWeight: '700' }}>USD</span></span>
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
            Earned on every DAGChain or DAGGPT purchase — up to 3 levels deep in your referral chain.
          </p>
          {[
            { level: 'Level 1', label: 'Direct (your referee buys)', soldierRate: soldierL1, ltRate: ltL1, note: 'varies by tier' },
            { level: 'Level 2', label: '2nd downline buys', soldierRate: l2, ltRate: l2, note: 'fixed' },
            { level: 'Level 3', label: '3rd downline buys', soldierRate: l3, ltRate: l3, note: 'fixed' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: i < 2 ? '10px' : 0 }}>
              <div style={{ minWidth: '54px', height: '36px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '0 8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '900', color: nm.accent, whiteSpace: 'nowrap' }}>{row.level}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: nm.textPrimary, margin: 0 }}>{row.label}</p>
                <p style={{ fontSize: '10px', color: nm.textDark, margin: '1px 0 0', fontWeight: '500' }}>{row.note}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: nm.textPrimary, letterSpacing: '-0.5px' }}>{row.soldierRate}</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textMuted }}>%</span>
                  <p style={{ fontSize: '9px', color: nm.textMuted, margin: '1px 0 0', fontWeight: '600' }}>SOLDIER</p>
                </div>
                {row.soldierRate !== row.ltRate && (
                  <>
                    <div style={{ width: '1px', height: '28px', background: nm.border }} />
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '18px', fontWeight: '900', color: nm.accent, letterSpacing: '-0.5px' }}>{row.ltRate}</span>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textMuted }}>%</span>
                      <p style={{ fontSize: '9px', color: nm.accent, margin: '1px 0 0', fontWeight: '700' }}>LIEUTENANT</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Commission example */}
          <div style={{ marginTop: '18px', padding: '14px 16px', borderRadius: '12px', background: nm.bg, boxShadow: nm.shadowInsetSm }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: nm.textPrimary, margin: '0 0 10px', lineHeight: '1.6' }}>
              Example: $1,000 sale made by your direct referral
            </p>
            {[
              { title: 'DAG SOLDIER', badge: 'soldier', l1: soldierL1 },
              { title: 'DAG LIEUTENANT', badge: 'lieutenant', l1: ltL1 },
            ].map((ex, ei) => (
              <div key={ei} style={{ marginBottom: ei < 1 ? '12px' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                  <img src={BADGE(ex.badge)} alt={ex.title} style={{ width: '22px', height: '22px', objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.12))' }} />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{ex.title}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { lv: 'Level 1', pct: ex.l1, note: 'Direct' },
                    { lv: 'Level 2', pct: l2, note: '2nd Level' },
                    { lv: 'Level 3', pct: l3, note: '3rd Level' },
                  ].map((row, ri) => {
                    const earned = (row.pct / 100 * 1000).toFixed(0);
                    return (
                      <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs }}>
                        <span style={{ fontSize: '11px', fontWeight: '900', color: nm.accent, width: '52px', flexShrink: 0 }}>{row.lv}</span>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: nm.textDark, flex: 1 }}>{row.note}</span>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textDark }}>{row.pct}%</span>
                        <span style={{ fontSize: '14px', fontWeight: '900', color: nm.accent, letterSpacing: '-0.3px', minWidth: '52px', textAlign: 'right' }}>${earned} <span style={{ fontSize: '9px', fontWeight: '600', color: nm.textMuted }}>USD</span></span>
                      </div>
                    );
                  })}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px 0' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textDark, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Total earned</span>
                    <span style={{ fontSize: '15px', fontWeight: '900', color: nm.textPrimary, letterSpacing: '-0.5px' }}>
                      ${(ex.l1 + l2 + l3) * 10} <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textMuted }}>USD</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </NmCard>

        {/* Spend-Based DAG Points */}
        <NmCard delay={140} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, margin: '0 0 4px' }}>Spend-Based DAG Points</p>
          <p style={{ fontSize: '11px', color: nm.textDark, margin: '0 0 16px', fontWeight: '500', lineHeight: '1.6' }}>
            Earn DAG Points for every $1 spent by your <strong>direct (Level 1) referrals</strong> on any purchase — nodes, DAGGPT credits, validator nodes, LT upgrades.
          </p>

          {[
            { tier: 'DAG SOLDIER', badge: 'soldier', rate: soldierSpend, color: nm.textPrimary },
            { tier: 'DAG LIEUTENANT', badge: 'lieutenant', rate: ltSpend, color: nm.accent },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 18px', borderRadius: '14px', background: nm.bg, boxShadow: nm.shadowXs, marginBottom: '10px' }}>
              <img src={BADGE(t.badge)} alt={t.tier} style={{ width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{t.tier}</div>
                <div style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500', marginTop: '2px' }}>per $1 spent by direct referrals</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '28px', fontWeight: '900', color: t.color, letterSpacing: '-1px' }}>{t.rate}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: nm.textMuted, marginLeft: '3px' }}>pts</span>
              </div>
            </div>
          ))}

          {/* Example */}
          <div style={{ padding: '14px 16px', borderRadius: '12px', background: nm.bg, boxShadow: nm.shadowInsetSm, marginTop: '6px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: nm.textPrimary, margin: '0 0 8px' }}>Example: your direct referral pays $149 for LT upgrade</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, padding: '10px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', marginBottom: '4px' }}>You as SOLDIER</div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: nm.textPrimary }}>{149 * soldierSpend}</div>
                <div style={{ fontSize: '10px', color: nm.textMuted, fontWeight: '600' }}>pts earned</div>
              </div>
              <div style={{ flex: 1, padding: '10px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: nm.accent, textTransform: 'uppercase', marginBottom: '4px' }}>You as LIEUTENANT</div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: nm.accent }}>{149 * ltSpend}</div>
                <div style={{ fontSize: '10px', color: nm.textMuted, fontWeight: '600' }}>pts earned</div>
              </div>
            </div>
          </div>

          {/* Note about LT upgrade stacking */}
          <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '12px', background: nm.bg, boxShadow: nm.shadowInsetSm, display: 'flex', gap: '10px' }}>
            <Info size={14} color={nm.textMuted} style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '11px', color: nm.textDark, margin: 0, lineHeight: '1.7', fontWeight: '500' }}>
              All three rewards <strong>stack simultaneously</strong> on LT upgrade: upgrade referral bonus + spend-based DAG points + USD commission.
            </p>
          </div>
        </NmCard>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SECTION 3 — Incentive Pools                           */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>Incentive Pools</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Fortune 500 Pool */}
        <NmCard delay={160} style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: nm.textPrimary }}>Fortune 500 Pool</div>
              <div style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500', marginTop: '2px' }}>Monthly DAGGPT Revenue Share</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowXs, color: '#10b981' }}>Active</span>
          </div>
          {[
            { label: 'Source', value: '10% of monthly DAGGPT revenue' },
            { label: 'Eligible Tiers', value: 'DAG SOLDIER + DAG LIEUTENANT' },
            { label: 'Distribution', value: 'Equal split among enrolled members' },
            { label: 'Enrollment', value: 'Automatic on membership' },
            { label: 'Frequency', value: 'Monthly distribution' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < 4 ? `1px solid ${nm.border}` : 'none', gap: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: nm.textMuted }}>{row.label}</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textPrimary, textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}
        </NmCard>

        {/* DAG Army Elite Pool */}
        <NmCard delay={180} style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: nm.textPrimary }}>DAG Army Elite Pool</div>
              <div style={{ fontSize: '11px', color: nm.textDark, fontWeight: '500', marginTop: '2px' }}>Lieutenant-Exclusive MainNet Pool</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowXs, color: '#f59e0b' }}>Launches at MainNet</span>
          </div>
          {[
            { label: 'Source', value: '50% of DAGCHAIN transaction fees' },
            { label: 'Eligible Tiers', value: 'DAG LIEUTENANT only' },
            { label: 'Distribution', value: 'Proportional share among LTs' },
            { label: 'Trigger', value: 'Activates at MainNet launch' },
            { label: 'Enrollment', value: 'Automatic for all Lieutenants' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < 4 ? `1px solid ${nm.border}` : 'none', gap: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: nm.textMuted }}>{row.label}</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textPrimary, textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}
        </NmCard>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SECTION 4 — How to Earn DAG Points                    */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>How to Earn DAG Points</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Signup & Tier Upgrade */}
        <NmCard delay={200} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <img src={BADGE('soldier')} alt="Signup" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.12))' }} />
            <p style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>Signup</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '6px', borderBottom: `1px solid ${nm.border}`, marginBottom: '2px' }}>
            <span style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textDark, width: '80px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>SOLDIER</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.accent, width: '80px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>LIEUTENANT</span>
            </div>
          </div>
          {[
            { label: 'DAG SOLDIER signup', soldier: `+${soldierSignup} pts`, lt: `+${soldierSignup} pts` },
            { label: 'Upgrade to DAG LIEUTENANT', soldier: '0 pts (no bonus)', lt: '0 pts (no bonus)' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '9px 0', borderBottom: i < 1 ? `1px solid ${nm.border}` : 'none', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textDark, flex: 1 }}>{row.label}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 0', width: '80px', textAlign: 'center', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.textPrimary }}>{row.soldier}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 0', width: '80px', textAlign: 'center', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.accent }}>{row.lt}</span>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowInsetSm }}>
            <p style={{ fontSize: '11px', color: nm.textDark, margin: 0, fontWeight: '500', lineHeight: '1.6' }}>
              The upgrader does <strong>not</strong> receive any points for paying the $149 LT upgrade. Only the referrer earns points on that transaction.
            </p>
          </div>
        </NmCard>

        {/* Referral Points */}
        <NmCard delay={220} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <img src={BADGE('lieutenant')} alt="Referral" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.12))' }} />
            <p style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>Referral Points (you = referrer)</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '6px', borderBottom: `1px solid ${nm.border}`, marginBottom: '2px' }}>
            <span style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textDark, width: '80px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>SOLDIER</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.accent, width: '80px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>LIEUTENANT</span>
            </div>
          </div>
          {[
            { label: 'Direct joins as Soldier', soldier: `+${soldierRefJoin} pts`, lt: `+${ltRefJoin} pts` },
            { label: 'Direct upgrades to LT', soldier: `+${soldierRefUpgrade} pts`, lt: `+${ltRefUpgrade} pts` },
            { label: 'Each $1 direct spends', soldier: `+${soldierSpend} pts`, lt: `+${ltSpend} pts` },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '9px 0', borderBottom: i < 2 ? `1px solid ${nm.border}` : 'none', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: nm.textDark, flex: 1 }}>{row.label}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 0', width: '80px', textAlign: 'center', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.textPrimary }}>{row.soldier}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 0', width: '80px', textAlign: 'center', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowXs, color: nm.accent }}>{row.lt}</span>
              </div>
            </div>
          ))}
          <p style={{ fontSize: '11px', color: nm.textMuted, margin: '10px 0 0', fontWeight: '500' }}>Spend-based earnings are Level 1 (direct referrals) only.</p>
        </NmCard>
      </div>

      {/* Social Tasks */}
      <NmCard delay={240} style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <p style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>Daily &amp; Community Missions</p>
        </div>
        <p style={{ fontSize: '11px', color: nm.textDark, margin: '0 0 12px', lineHeight: '1.6', fontWeight: '500' }}>
          Complete social missions to earn DAG Points. DAG LIEUTENANT earns a <strong style={{ color: nm.accent }}>+100% bonus</strong> on every mission (2× base pts).
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          {[
            { label: 'Like & Share post', base: c.social_task_like_share || 10, category: 'Daily' },
            { label: 'Comment / Watch', base: c.social_task_comments_watch || 10, category: 'Daily' },
            { label: 'Create Shorts', base: c.social_task_create_shorts || 50, category: 'Community' },
            { label: 'Explainer Video', base: c.social_task_explainer_video || 100, category: 'Community' },
            { label: 'Subscribe & Follow', base: c.social_task_subscribe || 150, category: 'Community' },
          ].map((task, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: '14px', background: nm.bg, boxShadow: nm.shadowXs, textAlign: 'center' }}>
              <div style={{ fontSize: '9px', fontWeight: '700', color: task.category === 'Daily' ? nm.textDark : nm.accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{task.category}</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: nm.textDark, marginBottom: '8px', lineHeight: '1.4' }}>{task.label}</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: nm.textPrimary }}>~{task.base}</div>
              <div style={{ fontSize: '9px', fontWeight: '600', color: nm.textMuted, marginBottom: '4px' }}>pts · Soldier</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: nm.accent }}>~{task.base * 2}</div>
              <div style={{ fontSize: '9px', fontWeight: '600', color: nm.accent }}>pts · LT</div>
            </div>
          ))}
        </div>
      </NmCard>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SECTION 5 — How it Works (Steps)                      */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>How to Get Started</p>
      </div>

      <NmCard delay={260} style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {[
            {
              step: '1',
              icon: <img src={BADGE('soldier')} alt="DAG SOLDIER" style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />,
              title: 'Register as DAG SOLDIER',
              body: `Instant +${soldierSignup} pts on signup. Free to join. Earn 15% L1 commission and ${soldierSpend} pts per $1 spent by directs.`,
            },
            {
              step: '2',
              icon: <img src={BADGE('lieutenant')} alt="LIEUTENANT" style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />,
              title: 'Upgrade to DAG LIEUTENANT',
              body: `Pay $${ltPrice} USD. Unlock 20% L1 commission, ${ltSpend} pts per $1 spent by directs, and Elite Pool eligibility when MainNet launches.`,
            },
            {
              step: '3',
              icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
              title: 'Refer & Earn',
              body: `Earn ${soldierRefJoin} pts (Soldier) or ${ltRefJoin} pts (LT) when directs join, plus ${soldierRefUpgrade}/${ltRefUpgrade} pts if they upgrade to LT.`,
            },
            {
              step: '4',
              icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
              title: 'Redeem Points & Collect Pools',
              body: `Redeem DAG Points for DGCC Coins. Receive monthly Fortune 500 pool distributions. LTs also earn from the Elite Pool at MainNet.`,
            },
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    {s.icon}
                    <span style={{ fontSize: '10px', fontWeight: '800', color: nm.textDark }}>Step {s.step}</span>
                  </div>
                  {i < 3 && <div style={{ flex: 1, height: '2px', background: nm.bg, boxShadow: nm.shadowInsetSm, borderRadius: '2px' }} />}
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

    </div>
  );
}
