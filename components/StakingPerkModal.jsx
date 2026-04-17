"use client";
import { useState, useEffect } from "react";

/**
 * StakingPerkModal — Editorial, high-end financial aesthetic.
 *
 * type        — 'lt_upgrade' | 'dgcc_transfer'
 * dgccAmount  — number
 * userId      — string
 * paymentId   — string|null
 * transferId  — string|null
 * onClose     — () => void
 */

const STAKING_OPTIONS = [
  { duration: 1, apy: 12 },
  { duration: 2, apy: 18 },
  { duration: 3, apy: 24 },
];

// Design tokens — off-white paper + ink
const T = {
  paper:    '#FAF8F3',
  card:     '#FFFFFF',
  ink:      '#0A0A0A',
  ink2:     '#1F1F1F',
  muted:    '#6B6B6B',
  line:     '#E8E4DB',
  lineSoft: '#F0ECE2',
  accent:   '#D97757',   // warm terracotta — distinctive vs generic purple
  accentBg: '#FBF3EF',
  ok:       '#0F7D4C',
  shadow:   '0 1px 2px rgba(10,10,10,0.04), 0 20px 48px -24px rgba(10,10,10,0.18)',
};

// Monospace tabular numerics for amounts (authoritative financial feel)
const MONO = '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace';
const SERIF = '"Domine", "Libre Caslon Text", Georgia, serif';

export default function StakingPerkModal({ type, dgccAmount, userId, paymentId, transferId, onClose }) {
  const [step, setStep]             = useState(1);
  const [selected, setSelected]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [done, setDone]             = useState(false);

  const amount = Number(dgccAmount) || (type === 'lt_upgrade' ? 149 : 0);
  const eyebrow = type === 'lt_upgrade' ? 'DAG LIEUTENANT · ONE-TIME PERK' : 'DAGGPT TRANSFER · STAKING PERK';

  // Compute projected return for hero number
  const projectedDisplay = (amt, apy, years) =>
    (amt + amt * (apy / 100) * years).toFixed(0);

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError(null);

    const body = {
      type, userId,
      stakingDuration: selected.duration,
      stakingApy:      selected.apy,
    };
    if (type === 'lt_upgrade') body.paymentId = paymentId || null;
    else { body.transferId = transferId; body.dgccAmount = amount; }

    try {
      const res = await fetch('/api/rewards/staking-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
        setTimeout(() => onClose?.(), 3000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Import display fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Domine:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes spmFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spmPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,10,10,0.45)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      }}>
        <div style={{
          background: T.card,
          borderRadius: '4px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: T.shadow,
          border: `1px solid ${T.line}`,
          overflow: 'hidden',
          animation: 'spmFadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}>

          {/* ═════════ SUCCESS STATE ═════════ */}
          {done && (
            <div style={{ padding: '56px 48px', textAlign: 'center' }}>
              <div style={{
                fontFamily: MONO, fontSize: '10px', letterSpacing: '0.2em',
                color: T.ok, marginBottom: '28px', fontWeight: 600,
              }}>
                ◼ CONFIRMED · ON-CHAIN
              </div>
              <div style={{
                fontFamily: SERIF, fontSize: '38px', lineHeight: 1.05,
                color: T.ink, fontWeight: 500, letterSpacing: '-0.02em',
                margin: '0 0 18px',
              }}>
                Your stake is<br/>registered.
              </div>
              <div style={{ width: '40px', height: '1px', background: T.ink, margin: '0 auto 24px' }} />
              <p style={{ fontSize: '14px', color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: '340px', marginInline: 'auto' }}>
                <span style={{ fontFamily: MONO, color: T.ink, fontWeight: 600 }}>{amount} DGCC</span> locked for{' '}
                <span style={{ fontFamily: MONO, color: T.ink, fontWeight: 600 }}>{selected?.duration}Y</span> at{' '}
                <span style={{ fontFamily: MONO, color: T.accent, fontWeight: 700 }}>{selected?.apy}% APY</span>.
                Rewards accrue daily on the DAGChain network.
              </p>
            </div>
          )}

          {/* ═════════ STEP 1 — OFFER ═════════ */}
          {!done && step === 1 && (
            <div>
              {/* Top ribbon — editorial */}
              <div style={{
                padding: '14px 40px',
                background: T.paper,
                borderBottom: `1px solid ${T.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{
                  fontFamily: MONO, fontSize: '10px', letterSpacing: '0.22em',
                  color: T.ink, fontWeight: 600,
                }}>
                  {eyebrow}
                </span>
                <span style={{
                  fontFamily: MONO, fontSize: '10px', color: T.muted,
                }}>
                  REF-{(transferId || paymentId || 'NEW').slice(-6).toUpperCase()}
                </span>
              </div>

              {/* Hero content */}
              <div style={{ padding: '44px 48px 36px' }}>
                <div style={{
                  fontFamily: MONO, fontSize: '11px', letterSpacing: '0.18em',
                  color: T.muted, marginBottom: '20px', fontWeight: 500,
                }}>
                  {type === 'lt_upgrade' ? '01 · UPGRADE CONFIRMED' : '01 · TRANSFER CONFIRMED'}
                </div>

                <h1 style={{
                  fontFamily: SERIF, fontSize: '42px', lineHeight: 1.02,
                  color: T.ink, fontWeight: 500, letterSpacing: '-0.025em',
                  margin: '0 0 20px',
                }}>
                  {type === 'lt_upgrade' ? (
                    <>Earn up to <span style={{ color: T.accent, fontStyle: 'italic' }}>24%</span> on your Lieutenant perk.</>
                  ) : (
                    <>Turn <span style={{ color: T.accent, fontStyle: 'italic' }}>{amount}</span> DGCC into a yield-bearing stake.</>
                  )}
                </h1>

                <p style={{
                  fontSize: '14px', lineHeight: 1.65, color: T.muted,
                  margin: '0 0 32px', maxWidth: '440px',
                }}>
                  {type === 'lt_upgrade'
                    ? `As a welcome gift, 149 DGCC Coins can be auto-staked on the DAGChain network. Choose your lock duration on the next step.`
                    : `Before these coins move to DAGGPT, lock them into DAGChain's native staking program for additional rewards.`}
                </p>

                {/* Data grid — no cards, just typography + lines */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  borderTop: `1px solid ${T.line}`,
                  borderBottom: `1px solid ${T.line}`,
                  marginBottom: '32px',
                }}>
                  <div style={{ padding: '16px 0', borderRight: `1px solid ${T.line}`, paddingRight: '20px' }}>
                    <div style={{ fontFamily: MONO, fontSize: '10px', color: T.muted, letterSpacing: '0.15em', marginBottom: '6px' }}>
                      STAKEABLE AMOUNT
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: '22px', color: T.ink, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {amount.toLocaleString()} <span style={{ fontSize: '12px', color: T.muted, fontWeight: 400 }}>DGCC</span>
                    </div>
                  </div>
                  <div style={{ padding: '16px 0', paddingLeft: '20px' }}>
                    <div style={{ fontFamily: MONO, fontSize: '10px', color: T.muted, letterSpacing: '0.15em', marginBottom: '6px' }}>
                      MAX PROJECTED YIELD
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: '22px', color: T.accent, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      +{Math.round(amount * 0.24 * 3).toLocaleString()} <span style={{ fontSize: '12px', color: T.muted, fontWeight: 400 }}>DGCC · 3Y · 24% APY</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      flex: 1,
                      padding: '16px 24px',
                      background: T.ink,
                      color: T.card,
                      border: 'none',
                      borderRadius: '2px',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.ink; }}
                  >
                    Choose Duration →
                  </button>
                  <button
                    onClick={() => onClose?.()}
                    style={{
                      padding: '16px 20px',
                      background: 'transparent',
                      color: T.muted,
                      border: `1px solid ${T.line}`,
                      borderRadius: '2px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Later
                  </button>
                </div>
              </div>

              {/* Footer microcopy */}
              <div style={{
                padding: '12px 48px',
                borderTop: `1px solid ${T.line}`,
                background: T.paper,
                fontFamily: MONO, fontSize: '10px', color: T.muted, letterSpacing: '0.1em',
              }}>
                ONE-TIME OFFER · EXPIRES ON DISMISS
              </div>
            </div>
          )}

          {/* ═════════ STEP 2 — DURATION SELECT ═════════ */}
          {!done && step === 2 && (
            <div>
              {/* Top ribbon */}
              <div style={{
                padding: '14px 40px',
                background: T.paper,
                borderBottom: `1px solid ${T.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    fontFamily: MONO, fontSize: '10px', letterSpacing: '0.18em',
                    color: T.ink, fontWeight: 600,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  ← BACK
                </button>
                <span style={{
                  fontFamily: MONO, fontSize: '10px', letterSpacing: '0.18em',
                  color: T.muted, fontWeight: 500,
                }}>
                  02 · SELECT TERM
                </span>
              </div>

              <div style={{ padding: '36px 48px 24px' }}>
                <h2 style={{
                  fontFamily: SERIF, fontSize: '28px', lineHeight: 1.15,
                  color: T.ink, fontWeight: 500, letterSpacing: '-0.02em',
                  margin: '0 0 10px',
                }}>
                  Choose your lock duration.
                </h2>
                <p style={{ fontSize: '13px', color: T.muted, margin: '0 0 28px', lineHeight: 1.6 }}>
                  Longer terms earn higher APY. Your <span style={{ fontFamily: MONO, color: T.ink, fontWeight: 600 }}>{amount} DGCC</span> will be locked on DAGChain until maturity.
                </p>

                {/* Option rows — editorial list style */}
                <div style={{ borderTop: `1px solid ${T.line}` }}>
                  {STAKING_OPTIONS.map((opt) => {
                    const isSelected = selected?.duration === opt.duration;
                    const projected = projectedDisplay(amount, opt.apy, opt.duration);
                    const gained    = Math.round(amount * (opt.apy / 100) * opt.duration);
                    return (
                      <button
                        key={opt.duration}
                        onClick={() => setSelected(opt)}
                        style={{
                          width: '100%',
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr auto',
                          alignItems: 'center',
                          gap: '20px',
                          padding: '20px 0',
                          borderBottom: `1px solid ${T.line}`,
                          background: isSelected ? T.accentBg : 'transparent',
                          border: 'none',
                          borderBottomColor: T.line,
                          borderBottomStyle: 'solid',
                          borderBottomWidth: '1px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          transition: 'background 0.15s ease',
                          paddingLeft: isSelected ? '16px' : '0',
                          paddingRight: isSelected ? '16px' : '0',
                          marginLeft: isSelected ? '-16px' : '0',
                          marginRight: isSelected ? '-16px' : '0',
                          width: isSelected ? 'calc(100% + 32px)' : '100%',
                          position: 'relative',
                        }}
                      >
                        {/* Selection indicator — thin vertical bar instead of radio */}
                        <div style={{
                          width: '3px',
                          height: '40px',
                          background: isSelected ? T.accent : 'transparent',
                          marginLeft: isSelected ? '0' : '3px',
                        }} />

                        {/* Term + stats */}
                        <div>
                          <div style={{
                            fontFamily: SERIF, fontSize: '22px', color: T.ink,
                            fontWeight: 500, letterSpacing: '-0.015em', marginBottom: '4px',
                          }}>
                            {opt.duration} {opt.duration === 1 ? 'Year' : 'Years'}
                          </div>
                          <div style={{
                            fontFamily: MONO, fontSize: '11px', color: T.muted,
                            letterSpacing: '0.06em',
                          }}>
                            +{gained.toLocaleString()} DGCC · MATURES {opt.duration}Y FROM TODAY
                          </div>
                        </div>

                        {/* APY — hero right */}
                        <div style={{ textAlign: 'right', minWidth: '80px' }}>
                          <div style={{
                            fontFamily: MONO,
                            fontSize: '28px',
                            color: isSelected ? T.accent : T.ink,
                            fontWeight: 600,
                            lineHeight: 1,
                            fontVariantNumeric: 'tabular-nums',
                            letterSpacing: '-0.02em',
                          }}>
                            {opt.apy}%
                          </div>
                          <div style={{
                            fontFamily: MONO, fontSize: '9px',
                            color: T.muted, letterSpacing: '0.18em', marginTop: '4px',
                          }}>
                            APY
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Summary line — only shows when selected */}
                {selected && (
                  <div style={{
                    marginTop: '20px', padding: '14px 16px',
                    background: T.paper, borderLeft: `2px solid ${T.accent}`,
                    fontFamily: MONO, fontSize: '11px', color: T.ink, letterSpacing: '0.03em',
                    lineHeight: 1.5,
                  }}>
                    <span style={{ color: T.muted }}>ESTIMATED AT MATURITY ·&nbsp;</span>
                    <span style={{ fontWeight: 600 }}>{projectedDisplay(amount, selected.apy, selected.duration)} DGCC</span>
                    <span style={{ color: T.muted }}> (principal + yield)</span>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div style={{
                    marginTop: '16px', padding: '12px 14px',
                    background: '#FEF2F2', borderLeft: `2px solid #DC2626`,
                    fontSize: '12px', color: '#991B1B', fontFamily: MONO, letterSpacing: '0.02em',
                  }}>
                    {error}
                  </div>
                )}
              </div>

              {/* Submit section */}
              <div style={{
                padding: '20px 48px 24px',
                borderTop: `1px solid ${T.line}`,
                background: T.paper,
                display: 'flex', gap: '12px', alignItems: 'center',
              }}>
                <button
                  onClick={handleSubmit}
                  disabled={!selected || submitting}
                  style={{
                    flex: 1,
                    padding: '15px 24px',
                    background: selected ? T.ink : T.lineSoft,
                    color: selected ? T.card : T.muted,
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: selected ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                    transition: 'all 0.18s ease',
                    opacity: submitting ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (selected && !submitting) e.currentTarget.style.background = T.accent; }}
                  onMouseLeave={e => { if (selected && !submitting) e.currentTarget.style.background = T.ink; }}
                >
                  {submitting
                    ? '• Submitting to DAGChain...'
                    : selected
                      ? `Lock ${amount} DGCC · ${selected.duration}Y · ${selected.apy}% APY`
                      : 'Select a duration'}
                </button>
                <button
                  onClick={() => onClose?.()}
                  style={{
                    padding: '15px 18px', background: 'transparent',
                    color: T.muted, border: `1px solid ${T.line}`,
                    borderRadius: '2px', fontSize: '11px', fontWeight: 500,
                    cursor: 'pointer', fontFamily: MONO, letterSpacing: '0.1em',
                  }}
                >
                  SKIP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
