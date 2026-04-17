"use client";
import { useState } from "react";

/**
 * StakingPerkModal
 *
 * Two-step modal:
 *   Step 1 — Congratulations + "Claim Reward" CTA
 *   Step 2 — Staking duration picker (1Y/2Y/3Y) + Submit
 *
 * Props:
 *   type        — 'lt_upgrade' | 'dgcc_transfer'
 *   dgccAmount  — number (149 for LT upgrade, dynamic for transfer)
 *   userId      — string
 *   paymentId   — string|null  (lt_upgrade only)
 *   transferId  — string|null  (dgcc_transfer only)
 *   onClose     — () => void  called after successful submit OR skip
 */

const STAKING_OPTIONS = [
  { duration: 1, apy: 12, label: '1 Year',  sublabel: '12% APY' },
  { duration: 2, apy: 18, label: '2 Years', sublabel: '18% APY' },
  { duration: 3, apy: 24, label: '3 Years', sublabel: '24% APY' },
];

// SVG icon helpers (no emojis per user preference)
const IconShield = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconPercent = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);

const IconCoin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v2m0 8v2M9.5 9.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5c0 3-5 3-5 5.5 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5"/>
  </svg>
);

export default function StakingPerkModal({ type, dgccAmount, userId, paymentId, transferId, onClose }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const amount = Number(dgccAmount) || (type === 'lt_upgrade' ? 149 : 0);

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError(null);

    const body = {
      type,
      userId,
      stakingDuration: selected.duration,
      stakingApy:      selected.apy,
    };

    if (type === 'lt_upgrade') {
      body.paymentId = paymentId || null;
    } else {
      body.transferId = transferId;
      body.dgccAmount = amount;
    }

    try {
      const res = await fetch('/api/rewards/staking-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
        setTimeout(() => onClose?.(), 2800);
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
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(15,10,40,0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f3ff 100%)',
        borderRadius: '24px',
        padding: '40px 36px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 24px 64px rgba(99,102,241,0.2), 0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid rgba(99,102,241,0.15)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
      }}>

        {/* ── SUCCESS STATE ── */}
        {done && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 10px' }}>
              Staking Activated!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
              Your {amount} DGCC Coins have been registered for staking on DAGChain at{' '}
              <strong style={{ color: '#6366f1' }}>{selected?.apy}% APY</strong> for {selected?.duration} {selected?.duration === 1 ? 'year' : 'years'}.
            </p>
          </div>
        )}

        {/* ── STEP 1 — CONGRATS ── */}
        {!done && step === 1 && (
          <div style={{ textAlign: 'center' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#fef3c7', border: '1px solid #fde68a',
              borderRadius: '20px', padding: '5px 14px', marginBottom: '20px',
            }}>
              <IconStar />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', letterSpacing: '0.05em' }}>
                {type === 'lt_upgrade' ? 'DAG LIEUTENANT PERK' : 'DAGGPT TRANSFER PERK'}
              </span>
            </div>

            {/* Icon */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%)',
              border: '2px solid rgba(99,102,241,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <IconShield />
            </div>

            {type === 'lt_upgrade' ? (
              <>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
                  Welcome, DAG Lieutenant!
                </h2>
                <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.6 }}>
                  You have upgraded to DAG Lieutenant — welcome to the world of awesome possibilities.
                </p>
                <p style={{ fontSize: '14px', color: '#6366f1', fontWeight: '600', margin: '0 0 28px' }}>
                  As an esteemed DAG Lieutenant member, here is your one-time perk:
                </p>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
                  Transfer Successful!
                </h2>
                <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.6 }}>
                  Your {amount} DGCC Coins are on their way to DAGGPT.
                </p>
                <p style={{ fontSize: '14px', color: '#6366f1', fontWeight: '600', margin: '0 0 28px' }}>
                  As a reward, your DGCC can be auto-staked on DAGChain — claim your staking perk below:
                </p>
              </>
            )}

            {/* Perk card */}
            <div style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '16px', padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '28px', textAlign: 'left',
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
            }}>
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '0 0 4px', fontWeight: '600', letterSpacing: '0.08em' }}>
                  AUTO-STAKED ON DAGCHAIN
                </p>
                <p style={{ fontSize: '28px', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '-1px' }}>
                  {amount} DGCC
                </p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 16px', textAlign: 'center',
              }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', margin: '0 0 2px', fontWeight: '600' }}>UP TO</p>
                <p style={{ fontSize: '22px', fontWeight: '900', color: '#fff', margin: 0 }}>24% APY</p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%', padding: '15px 24px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff', fontSize: '15px', fontWeight: '700',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                letterSpacing: '0.02em',
              }}
            >
              Claim Reward
            </button>

            <button
              onClick={() => onClose?.()}
              style={{
                marginTop: '10px', width: '100%', padding: '12px',
                background: 'transparent', border: 'none',
                color: '#94a3b8', fontSize: '13px', cursor: 'pointer',
              }}
            >
              Skip for now
            </button>
          </div>
        )}

        {/* ── STEP 2 — DURATION PICKER ── */}
        {!done && step === 2 && (
          <div>
            <button
              onClick={() => setStep(1)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#94a3b8', fontSize: '13px', padding: 0, marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 8px' }}>
                Choose Your Staking Duration
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Your <strong style={{ color: '#1e1b4b' }}>{amount} DGCC Coins</strong> will be auto-staked on DAGChain network.
              </p>
            </div>

            {/* Duration cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {STAKING_OPTIONS.map((opt) => {
                const isSelected = selected?.duration === opt.duration;
                return (
                  <button
                    key={opt.duration}
                    onClick={() => setSelected(opt)}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                        : '#fff',
                      border: isSelected ? '2px solid #6366f1' : '2px solid #e0e7ff',
                      borderRadius: '14px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'all 0.18s ease',
                      boxShadow: isSelected ? '0 6px 20px rgba(99,102,241,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Selection circle */}
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: isSelected ? 'rgba(255,255,255,0.25)' : '#eef2ff',
                        border: isSelected ? '2px solid rgba(255,255,255,0.6)' : '2px solid #c7d2fe',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {isSelected && <IconCheck />}
                      </div>
                      <div>
                        <p style={{
                          fontSize: '16px', fontWeight: '700',
                          color: isSelected ? '#fff' : '#1e1b4b',
                          margin: 0,
                        }}>
                          {opt.label} Staking
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '13px', color: isSelected ? 'rgba(255,255,255,0.8)' : '#64748b',
                          }}>
                            <IconCoin />
                            {amount} DGCC
                          </span>
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '13px', color: isSelected ? 'rgba(255,255,255,0.8)' : '#64748b',
                          }}>
                            <IconClock />
                            {opt.duration}Y lock
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* APY badge */}
                    <div style={{
                      background: isSelected ? 'rgba(255,255,255,0.2)' : '#eef2ff',
                      borderRadius: '10px', padding: '8px 14px', textAlign: 'center',
                    }}>
                      <p style={{
                        fontSize: '20px', fontWeight: '900',
                        color: isSelected ? '#fff' : '#6366f1',
                        margin: 0, lineHeight: 1,
                      }}>
                        {opt.apy}%
                      </p>
                      <p style={{
                        fontSize: '11px', fontWeight: '600',
                        color: isSelected ? 'rgba(255,255,255,0.7)' : '#818cf8',
                        margin: '2px 0 0', letterSpacing: '0.05em',
                      }}>
                        APY
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Error */}
            {error && (
              <p style={{
                fontSize: '13px', color: '#ef4444', background: '#fef2f2',
                border: '1px solid #fecaca', borderRadius: '8px',
                padding: '10px 14px', marginBottom: '12px', margin: '0 0 12px',
              }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!selected || submitting}
              style={{
                width: '100%', padding: '15px 24px', borderRadius: '12px',
                background: selected
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : '#e0e7ff',
                color: selected ? '#fff' : '#a5b4fc',
                fontSize: '15px', fontWeight: '700',
                border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
                boxShadow: selected ? '0 4px 16px rgba(99,102,241,0.35)' : 'none',
                opacity: submitting ? 0.7 : 1,
                transition: 'all 0.18s ease',
              }}
            >
              {submitting ? 'Confirming...' : `Stake ${amount} DGCC${selected ? ` at ${selected.apy}% APY` : ''}`}
            </button>

            <button
              onClick={() => onClose?.()}
              style={{
                marginTop: '10px', width: '100%', padding: '12px',
                background: 'transparent', border: 'none',
                color: '#94a3b8', fontSize: '13px', cursor: 'pointer',
              }}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
