"use client";
import React, { useState, useEffect, useCallback } from "react";
import LieutenantUpgradeModal from "@/components/dashboard/LieutenantUpgradeModal";
import { Award, DollarSign, ChevronRight, Trophy, Zap, Crown, ArrowUp, Flame, Shield, Lock, Star, Users } from "lucide-react";

const nm = {
  bg: '#f0f2f5',
  shadow:        '8px 8px 20px rgba(0,0,0,0.15), -6px -6px 16px rgba(255,255,255,0.95)',
  shadowSm:      '5px 5px 12px rgba(0,0,0,0.12), -4px -4px 10px rgba(255,255,255,0.9)',
  shadowXs:      '3px 3px 7px rgba(0,0,0,0.10), -2px -2px 6px rgba(255,255,255,0.85)',
  shadowInset:   'inset 5px 5px 12px rgba(0,0,0,0.12), inset -4px -4px 10px rgba(255,255,255,0.9)',
  shadowInsetSm: 'inset 3px 3px 8px rgba(0,0,0,0.10), inset -2px -2px 6px rgba(255,255,255,0.85)',
  accent:        '#4f46e5',
  accentLight:   'rgba(79,70,229,0.08)',
  textPrimary:   '#1e293b',
  textSecondary: '#64748b',
  textMuted:     '#94a3b8',
  border:        'rgba(0,0,0,0.06)',
};

export default function RewardsContent({ mounted }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [withdrawMonth, setWithdrawMonth] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [withdrawPayoutMethod, setWithdrawPayoutMethod] = useState('bank');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState(1);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState(null);
  const [txTab, setTxTab] = useState('all');
  const [txTypeFilter, setTxTypeFilter] = useState('all');
  const [txTypeOpen, setTxTypeOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [rewardData, setRewardData] = useState({
    dagPoints: 0, tier: 'DAG_SOLDIER', isLieutenant: false,
    usdEarned: 0, usdtEarned: 0, referralCode: '', totalReferrals: 0,
    totalPointsEarned: 0, totalPointsBurned: 0, totalPointsRedeemed: 0,
    spendPtsRate: 25, l1CommissionPct: 15, l2CommissionPct: 3, l3CommissionPct: 2,
    taskMultiplier: 1, txHistory: [],
    ecosystemSpend: 0,
    incentivePools: {
      fortune500: { isEligible: false, enrolled: false, enrollmentOpen: true, poolPct: 10, activeMemberCount: 0, lastPayoutAmount: null },
      dag_lt_pool: { isEligible: false, enrolled: false, activeMemberCount: 0, lastPayoutAmount: null, directLtUpgrades: 0, daysLeft: null },
      elite: { isEligible: false, active: false, blockchainPct: 50, totalLtMembers: 0 },
    },
  });

  useEffect(() => {
    const userStr = localStorage.getItem('dagarmy_user');
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      fetchRewardData(u.email);
      fetchPaymentInfo(u.id);
      fetchWithdrawHistory(u.id);
    } else { setLoading(false); }
  }, []);

  const fetchRewardData = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/rewards/user?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.data) setRewardData(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchPaymentInfo = async (userId) => {
    try {
      const res = await fetch(`/api/user/payment-info?userId=${userId}`);
      const data = await res.json();
      if (data.success) { setPaymentInfo(data.paymentInfo); setWithdrawPayoutMethod(data.paymentInfo?.preferred_payout || 'bank'); }
    } catch (e) { console.error(e); }
  };

  const fetchWithdrawHistory = async (userId) => {
    try {
      const res = await fetch(`/api/rewards/withdraw?userId=${userId}`);
      const data = await res.json();
      if (data.success) setWithdrawHistory(data.requests || []);
    } catch (e) { console.error(e); }
  };

  const handleStripeUpgrade = async () => {
    if (!user?.id || !user?.email) return;
    setStripeLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, userEmail: user.email }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Could not start checkout.');
    } catch { alert('Network error.'); }
    finally { setStripeLoading(false); }
  };

  const handleWithdraw = async () => {
    if (!user?.id) return;
    setWithdrawing(true); setWithdrawMessage(null);
    try {
      const res = await fetch('/api/rewards/withdraw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, rewardMonth: withdrawMonth, amountUsd: rewardData.usdEarned, payoutMethod: withdrawPayoutMethod }) });
      const data = await res.json();
      if (data.success) { setWithdrawMessage({ type: 'success', text: data.message }); fetchWithdrawHistory(user.id); setTimeout(() => { setShowWithdrawModal(false); setWithdrawMessage(null); }, 3000); }
      else setWithdrawMessage({ type: 'error', text: data.error });
    } catch { setWithdrawMessage({ type: 'error', text: 'Network error.' }); }
    finally { setWithdrawing(false); }
  };

  const handleRedeem = async () => {
    if (!user?.email) return;
    const pointsCost = redeemAmount * 500;
    if (pointsCost > rewardData.dagPoints) return;
    try {
      setRedeeming(true); setRedeemMessage(null);
      const res = await fetch('/api/rewards/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_email: user.email, redemption_type: 'dagcoin', amount: redeemAmount }) });
      const data = await res.json();
      if (data.success) { setRedeemMessage({ type: 'success', text: data.message }); fetchRewardData(user.email); setTimeout(() => { setShowRedeemModal(false); setRedeemMessage(null); setRedeemAmount(1); }, 2500); }
      else setRedeemMessage({ type: 'error', text: data.error || 'Redemption failed' });
    } catch { setRedeemMessage({ type: 'error', text: 'Network error.' }); }
    finally { setRedeeming(false); }
  };

  const NmCard = useCallback(({ children, span = '1', style = {}, hover = true, inset = false, delay = 0 }) => (
    <div style={{ gridColumn: `span ${span}`, background: nm.bg, borderRadius: '20px', padding: '28px', boxShadow: inset ? nm.shadowInset : nm.shadowSm, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transitionDelay: `${delay}ms`, ...style }}
      onMouseEnter={hover && !inset ? (e) => { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'translateY(-3px)'; } : undefined}
      onMouseLeave={hover && !inset ? (e) => { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
    >{children}</div>
  ), [mounted]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(0,0,0,0.08)', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Loading rewards...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  );

  const { dagPoints, isLieutenant, usdEarned, usdtEarned, totalPointsEarned, totalPointsBurned, totalPointsRedeemed, spendPtsRate, l1CommissionPct, l2CommissionPct, l3CommissionPct, taskMultiplier, ecosystemSpend, incentivePools } = rewardData;
  const fortune500 = incentivePools?.fortune500 || { isEligible: false, enrolled: false, enrollmentOpen: true, poolPct: 10, activeMemberCount: 0, lastPayoutAmount: null };
  const ltPool = incentivePools?.dag_lt_pool || { isEligible: false, enrolled: false, activeMemberCount: 0, directLtUpgrades: 0, daysLeft: null };
  const elitePool = incentivePools?.elite || { isEligible: false, active: false, blockchainPct: 50, totalLtMembers: 0 };
  const tierLabel = isLieutenant ? 'DAG LIEUTENANT' : 'DAG SOLDIER';
  const tierColor = isLieutenant ? '#7c3aed' : '#4f46e5';

  return (
    <>
      <div>
        {/* Header */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: nm.textPrimary, margin: 0, letterSpacing: '-0.5px' }}>My Rewards</h1>
            <p style={{ fontSize: '13px', color: nm.textMuted, margin: '4px 0 0', fontWeight: '500' }}>Track your DAG Points, rewards, and pool earnings</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => setShowRedeemModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: nm.bg, boxShadow: nm.shadowSm, color: nm.accent, fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; }}
            ><ArrowUp size={15} />Redeem Points</button>
            {!isLieutenant && (
              <button onClick={() => setShowUpgradeModal(true)} disabled={!!stripeLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: nm.bg, boxShadow: stripeLoading ? nm.shadowInset : nm.shadowSm, color: nm.textSecondary, fontSize: '13px', fontWeight: '700', cursor: stripeLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { if (!stripeLoading) { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={e => { if (!stripeLoading) { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; } }}
              ><Crown size={15} color={nm.accent} />{stripeLoading ? 'Redirecting...' : 'Upgrade to Lieutenant'}
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '6px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: nm.accent }}>$149</span>
              </button>
            )}
          </div>
        </div>

        {/* Tier Badge */}
        <div style={{ marginBottom: '20px', background: nm.bg, borderRadius: '16px', padding: '16px 24px', boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `linear-gradient(135deg, ${tierColor}, ${tierColor}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isLieutenant ? <Crown size={22} color="#fff" /> : <Shield size={22} color="#fff" />}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Your Tier</p>
            <p style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: '900', color: tierColor, letterSpacing: '-0.3px' }}>{tierLabel}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>L1 Rewards</p>
              <p style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: '900', color: nm.textPrimary }}>{l1CommissionPct}%</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Spend Rate</p>
              <p style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: '900', color: nm.textPrimary }}>{spendPtsRate} pts/$</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Task Multiplier</p>
              <p style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: '900', color: nm.textPrimary }}>{taskMultiplier}×</p>
            </div>
          </div>
        </div>

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <NmCard delay={50} style={{ padding: '24px 28px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 14px' }}>DAG Points</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: nm.accent, letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>{dagPoints.toLocaleString()}</p>
            <p style={{ fontSize: '11px', color: nm.textMuted, margin: '8px 0 0' }}>Available balance</p>
          </NmCard>
          <NmCard delay={100} style={{ padding: '24px 28px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 14px' }}>Total Referrals</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: nm.textPrimary, letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>{rewardData.totalReferrals}</p>
            <p style={{ fontSize: '11px', color: nm.textMuted, margin: '8px 0 0' }}>Direct referrals</p>
          </NmCard>
          <NmCard delay={150} style={{ padding: '24px 28px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>USD Earned</p>
              {usdEarned >= 10 && (
                <button onClick={() => setShowWithdrawModal(true)}
                  style={{ fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowSm, color: nm.textSecondary, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = nm.shadow}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = nm.shadowSm}
                >Withdraw</button>
              )}
            </div>
            <p style={{ fontSize: '36px', fontWeight: '800', color: nm.textPrimary, letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>${usdEarned.toFixed(2)}</p>
            <p style={{ fontSize: '11px', color: nm.textMuted, margin: '8px 0 0' }}>Sales rewards</p>
          </NmCard>
          <NmCard delay={200} style={{ padding: '24px 28px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 14px' }}>USDT Earned</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: nm.textPrimary, letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>{(usdtEarned || 0).toFixed(2)}</p>
            <p style={{ fontSize: '11px', color: nm.textMuted, margin: '8px 0 0' }}>Crypto payouts</p>
          </NmCard>
        </div>

        {/* Points Summary Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Points Earned', value: totalPointsEarned },
            { label: 'Points Burned (legacy)', value: totalPointsBurned },
            { label: 'Points Redeemed', value: totalPointsRedeemed },
          ].map(s => (
            <div key={s.label} style={{ background: nm.bg, borderRadius: '14px', padding: '16px 20px', boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: nm.textPrimary, letterSpacing: '-1px' }}>{(s.value || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Rewards Rates Info Strip */}
        <div style={{ marginBottom: '20px', background: nm.bg, borderRadius: '16px', padding: '16px 24px', boxShadow: nm.shadowXs }}>
          <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: '800', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Sales Rewards Rates</p>
          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { label: 'Level 1 (Direct)', value: `${l1CommissionPct}%`, color: nm.accent },
              { label: 'Level 2', value: `${l2CommissionPct}%`, color: '#10b981' },
              { label: 'Level 3', value: `${l3CommissionPct}%`, color: '#f59e0b' },
              { label: 'Spend Pts Rate', value: `${spendPtsRate} pts per $1`, color: '#8b5cf6' },
            ].map(r => (
              <div key={r.label}>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{r.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: '900', color: r.color }}>{r.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Incentive Pools */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: nm.textPrimary, margin: '0 0 3px', letterSpacing: '-0.3px' }}>Incentive Pools</h2>
            <p style={{ fontSize: '12px', color: nm.textMuted, margin: 0 }}>Revenue-sharing pools — passive income on top of your rewards</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>

            {/* Fortune 500 Pool */}
            <div style={{ background: nm.bg, borderRadius: '20px', boxShadow: nm.shadowSm, overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: `1px solid ${nm.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: fortune500.isEligible ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Star size={17} color="#fff" fill="#fff" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: nm.textPrimary }}>Fortune 500 Pool</p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: nm.textMuted }}>10% monthly DAGGPT revenue</p>
                  </div>
                </div>
                <span style={{ flexShrink: 0, fontSize: '9px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: fortune500.isEligible ? '#f5f3ff' : nm.bg, boxShadow: fortune500.isEligible ? 'none' : nm.shadowInsetSm, color: fortune500.isEligible ? '#7c3aed' : nm.textMuted, border: fortune500.isEligible ? '1px solid #c4b5fd' : 'none', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {fortune500.isEligible ? 'Eligible' : fortune500.enrolled ? 'Need $500 spend' : 'Not Enrolled'}
                </span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: '11px', color: nm.textMuted, margin: '0 0 12px', lineHeight: 1.6 }}>
                  <strong style={{ color: nm.textPrimary }}>Eligibility: </strong>DAG Soldier or Lieutenant with $500+ ecosystem spend
                </p>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase' }}>Ecosystem Spend</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: (ecosystemSpend || 0) >= 500 ? '#7c3aed' : nm.textPrimary }}>${(ecosystemSpend || 0).toFixed(0)} / $500</span>
                  </div>
                  <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg,#7c3aed,#6d28d9)', width: `${Math.min(100, ((ecosystemSpend || 0) / 500) * 100)}%`, transition: 'width 1s ease' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: nm.bg, borderRadius: '10px', padding: '10px 12px', boxShadow: nm.shadowInsetSm }}>
                    <p style={{ margin: 0, fontSize: '9px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Members</p>
                    <p style={{ margin: '3px 0 0', fontSize: '18px', fontWeight: '900', color: nm.textPrimary }}>{(fortune500.activeMemberCount || 0).toLocaleString()}</p>
                  </div>
                  <div style={{ background: nm.bg, borderRadius: '10px', padding: '10px 12px', boxShadow: nm.shadowInsetSm }}>
                    <p style={{ margin: 0, fontSize: '9px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Last Payout</p>
                    <p style={{ margin: '3px 0 0', fontSize: '18px', fontWeight: '900', color: nm.accent }}>{fortune500.lastPayoutAmount ? `$${parseFloat(fortune500.lastPayoutAmount).toFixed(2)}` : '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DAG LT Pool */}
            <div style={{ background: nm.bg, borderRadius: '20px', boxShadow: nm.shadowSm, overflow: 'hidden', opacity: isLieutenant ? 1 : 0.75 }}>
              <div style={{ padding: '18px 20px', borderBottom: `1px solid ${nm.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: ltPool.isEligible ? 'linear-gradient(135deg,#059669,#047857)' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: nm.textPrimary }}>DAG LT Pool</p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: nm.textMuted }}>10% monthly DAGGPT revenue</p>
                  </div>
                </div>
                <span style={{ flexShrink: 0, fontSize: '9px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: ltPool.isEligible ? '#f0fdf4' : nm.bg, boxShadow: ltPool.isEligible ? 'none' : nm.shadowInsetSm, color: ltPool.isEligible ? '#059669' : (!isLieutenant ? nm.textMuted : '#d97706'), border: ltPool.isEligible ? '1px solid #6ee7b7' : 'none', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {ltPool.isEligible ? 'Eligible' : (!isLieutenant ? 'LT Only' : 'In Progress')}
                </span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {!isLieutenant ? (
                  <div style={{ textAlign: 'center', padding: '14px 0' }}>
                    <Lock size={24} color={nm.textMuted} />
                    <p style={{ fontSize: '12px', fontWeight: '700', color: nm.textSecondary, margin: '8px 0 12px' }}>DAG LIEUTENANT exclusive</p>
                    <button onClick={() => setShowUpgradeModal(true)}
                      style={{ padding: '9px 18px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg,#059669,#047857)', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >Upgrade to Join — $149</button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '11px', color: nm.textMuted, margin: '0 0 12px', lineHeight: 1.6 }}>
                      <strong style={{ color: nm.textPrimary }}>Eligibility: </strong>Self upgrade + 3 direct LT referrals within 30 days
                    </p>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase' }}>Direct LT Referrals</span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: (ltPool.directLtUpgrades || 0) >= 3 ? '#059669' : nm.textPrimary }}>{ltPool.directLtUpgrades || 0} / 3</span>
                      </div>
                      <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '3px', background: '#059669', width: `${Math.min(100, ((ltPool.directLtUpgrades || 0) / 3) * 100)}%`, transition: 'width 1s ease' }} />
                      </div>
                      {ltPool.daysLeft !== null && ltPool.daysLeft > 0 && (
                        <p style={{ fontSize: '10px', color: nm.textMuted, margin: '4px 0 0' }}>{ltPool.daysLeft} days left in qualification window</p>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ background: nm.bg, borderRadius: '10px', padding: '10px 12px', boxShadow: nm.shadowInsetSm }}>
                        <p style={{ margin: 0, fontSize: '9px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Members</p>
                        <p style={{ margin: '3px 0 0', fontSize: '18px', fontWeight: '900', color: nm.textPrimary }}>{(ltPool.activeMemberCount || 0).toLocaleString()}</p>
                      </div>
                      <div style={{ background: nm.bg, borderRadius: '10px', padding: '10px 12px', boxShadow: nm.shadowInsetSm }}>
                        <p style={{ margin: 0, fontSize: '9px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Last Payout</p>
                        <p style={{ margin: '3px 0 0', fontSize: '18px', fontWeight: '900', color: nm.accent }}>{ltPool.lastPayoutAmount ? `$${parseFloat(ltPool.lastPayoutAmount).toFixed(2)}` : '—'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* DAG Army Elite Pool */}
            <div style={{ background: nm.bg, borderRadius: '20px', boxShadow: nm.shadowSm, overflow: 'hidden', opacity: isLieutenant ? 1 : 0.75 }}>
              <div style={{ padding: '18px 20px', borderBottom: `1px solid ${nm.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: isLieutenant ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isLieutenant ? <Crown size={17} color="#fff" /> : <Lock size={17} color="#fff" />}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: nm.textPrimary }}>DAG Army Elite Pool</p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: nm.textMuted }}>50% of DAGCHAIN tx fees</p>
                  </div>
                </div>
                <span style={{ flexShrink: 0, fontSize: '9px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: elitePool.active ? '#10b981' : '#d97706', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {elitePool.active ? 'Active' : 'Coming Soon'}
                </span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {!isLieutenant ? (
                  <div style={{ textAlign: 'center', padding: '14px 0' }}>
                    <Lock size={24} color={nm.textMuted} />
                    <p style={{ fontSize: '12px', fontWeight: '700', color: nm.textSecondary, margin: '8px 0 12px' }}>DAG LIEUTENANT exclusive</p>
                    <button onClick={() => setShowUpgradeModal(true)}
                      style={{ padding: '9px 18px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >Upgrade to Join — $149</button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '11px', color: nm.textMuted, margin: '0 0 12px', lineHeight: 1.6 }}>
                      <strong style={{ color: nm.textPrimary }}>Eligibility: </strong>All DAG Lieutenants — permanently enrolled. Activates Sep–Oct 2026.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ background: nm.bg, borderRadius: '10px', padding: '10px 12px', boxShadow: nm.shadowInsetSm }}>
                        <p style={{ margin: 0, fontSize: '9px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Total LTs</p>
                        <p style={{ margin: '3px 0 0', fontSize: '18px', fontWeight: '900', color: nm.textPrimary }}>{(elitePool.totalLtMembers || 0).toLocaleString()}</p>
                      </div>
                      <div style={{ background: nm.bg, borderRadius: '10px', padding: '10px 12px', boxShadow: nm.shadowInsetSm }}>
                        <p style={{ margin: 0, fontSize: '9px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Pool Share</p>
                        <p style={{ margin: '3px 0 0', fontSize: '18px', fontWeight: '900', color: '#7c3aed' }}>{elitePool.blockchainPct || 50}%</p>
                        <p style={{ margin: 0, fontSize: '9px', color: nm.textMuted }}>of chain fees</p>
                      </div>
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '11px', color: '#7c3aed', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      You are enrolled — activates at MainNet launch
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <NmCard delay={400} hover={false} inset={true} style={{ padding: '28px 32px', overflow: 'visible' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>Transaction History</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: nm.textMuted }}>From</span>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowInsetSm, fontSize: '12px', color: nm.textPrimary, outline: 'none' }} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: nm.textMuted }}>To</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowInsetSm, fontSize: '12px', color: nm.textPrimary, outline: 'none' }} />
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(''); setDateTo(''); }} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowSm, fontSize: '11px', fontWeight: '700', color: nm.textMuted, cursor: 'pointer' }}>Clear</button>
              )}
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
            {[{ key: 'all', label: 'All' }, { key: 'points', label: 'Points' }, { key: 'usd', label: 'USD' }, { key: 'usdt', label: 'USDT' }].map(({ key, label }) => (
              <button key={key} onClick={() => setTxTab(key)}
                style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: txTab === key ? nm.shadowInset : nm.shadowSm, color: txTab === key ? nm.accent : '#1e293b', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
              >{label}</button>
            ))}
          </div>
          {/* Table */}
          {(() => {
            const fromTs = dateFrom ? new Date(dateFrom).getTime() : null;
            const toTs   = dateTo   ? new Date(dateTo + 'T23:59:59').getTime() : null;

            const TYPE_LABELS = {
              signup_bonus: 'Signup', referral_join: 'Referral Join', referral_upgrade: 'Referral Upgrade',
              spend_based: 'Spend Bonus', rank_refund: 'Rank Refund', rank_burn: 'Burned',
              redeem: 'Redeemed', fortune500_payout: 'Fortune 500', admin_grant: 'Admin Grant',
              usd_commission: 'Rewards',
            };

            const filtered = (rewardData.txHistory || []).filter(tx => {
              const t = new Date(tx.created_at).getTime();
              if (fromTs && t < fromTs) return false;
              if (toTs   && t > toTs)   return false;
              const isUsd = tx.transaction_type === 'usd_commission';
              const isUsdt = tx.transaction_type === 'usdt_payout';
              if (txTab === 'points') return tx.points != null;
              if (txTab === 'usd') return isUsd;
              if (txTab === 'usdt') return isUsdt;
              return true;
            });

            if (!filtered.length) return (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>No transactions found</p>
              </div>
            );

            return (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 130px 110px 140px', padding: '8px 14px', background: nm.bg, boxShadow: nm.shadowInsetSm, borderRadius: '8px', marginBottom: '4px' }}>
                  {['TXN ID', 'Description', 'Type', 'Amount', 'Date'].map(h => (
                    <span key={h} style={{ fontSize: '10px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: h === 'Amount' || h === 'Date' ? 'right' : 'left' }}>{h}</span>
                  ))}
                </div>
                {filtered.map((tx, idx) => {
                  const isUsd = tx.transaction_type === 'usd_commission';
                  const isPositive = tx.points > 0 || (isUsd && tx.payment_status === 'paid');
                  const typeLabel = TYPE_LABELS[tx.transaction_type] || tx.transaction_type;
                  const amount = isUsd
                    ? `$${(tx.amount || 0).toFixed(2)}`
                    : `${isPositive ? '+' : '−'}${Math.abs(tx.points || 0).toLocaleString()} pts`;
                  const txnId = tx.transaction_id || '—';
                  const dateStr = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const isRefund = tx.transaction_type === 'rank_refund';

                  return (
                    <div key={tx.id || idx}
                      style={{ display: 'grid', gridTemplateColumns: '200px 1fr 130px 110px 140px', padding: '11px 14px', alignItems: 'center', borderBottom: idx < filtered.length - 1 ? `1px solid ${nm.border}` : 'none', borderRadius: '6px' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', color: '#1e293b' }}>{txnId}</span>
                        {txnId !== '—' && <button onClick={() => navigator.clipboard.writeText(txnId)} title="Copy" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#64748b' }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>}
                      </div>
                      <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px' }}>{tx.description || tx.transaction_type}</span>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: isRefund ? '#fef3c7' : nm.bg, boxShadow: isRefund ? 'none' : nm.shadowInsetSm, color: isRefund ? '#d97706' : '#1e293b', textTransform: 'uppercase', letterSpacing: '0.4px', border: isRefund ? '1px solid #fde68a' : 'none' }}>{typeLabel}</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: isPositive ? nm.accent : '#ef4444', textAlign: 'right' }}>{amount}</span>
                      <span style={{ fontSize: '12px', color: '#1e293b', textAlign: 'right', fontWeight: '500' }}>{dateStr}</span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </NmCard>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => { setShowRedeemModal(false); setRedeemMessage(null); setRedeemAmount(1); }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowUp size={18} color="#fff" /></div>
                <div><h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Redeem DAG Points</h2><p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>500 pts = 1 DAGCHAIN Gas Coin</p></div>
              </div>
              <button onClick={() => { setShowRedeemModal(false); setRedeemMessage(null); setRedeemAmount(1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#3730a3' }}>Available DAG Points</span>
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#4f46e5' }}>{dagPoints.toLocaleString()}</span>
              </div>
              {(() => {
                const pointsCost = redeemAmount * 500;
                const canRedeem = redeemAmount > 0 && pointsCost <= dagPoints;
                const maxAmount = Math.floor(dagPoints / 500);
                return (
                  <>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>DAGCHAIN Gas Coins</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <button onClick={() => setRedeemAmount(a => Math.max(1, a - 1))} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>−</button>
                      <input type="number" min={1} max={maxAmount} value={redeemAmount} onChange={e => setRedeemAmount(Math.max(1, Math.min(maxAmount, parseInt(e.target.value) || 1)))} style={{ flex: 1, textAlign: 'center', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '18px', fontWeight: '800', color: '#0f172a', outline: 'none' }} />
                      <button onClick={() => setRedeemAmount(a => Math.min(maxAmount, a + 1))} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>+</button>
                    </div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: '#64748b' }}><strong style={{ color: '#0f172a' }}>{redeemAmount} Coin{redeemAmount !== 1 ? 's' : ''}</strong> costs</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: canRedeem ? '#f59e0b' : '#ef4444' }}>{pointsCost.toLocaleString()}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>pts</span>
                      </div>
                    </div>
                    {redeemMessage && <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: redeemMessage.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${redeemMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: redeemMessage.type === 'success' ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: '600' }}>{redeemMessage.text}</div>}
                    <button onClick={handleRedeem} disabled={!canRedeem || redeeming}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: canRedeem && !redeeming ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#e2e8f0', color: canRedeem && !redeeming ? '#fff' : '#94a3b8', fontSize: '14px', fontWeight: '700', cursor: canRedeem && !redeeming ? 'pointer' : 'not-allowed' }}
                    >{redeeming ? 'Processing…' : `Redeem ${redeemAmount} Coin${redeemAmount !== 1 ? 's' : ''} for ${pointsCost.toLocaleString()} pts`}</button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => { setShowWithdrawModal(false); setWithdrawMessage(null); }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={18} color="#fff" /></div>
                <div><h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Request Withdrawal</h2><p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Withdraw your USD rewards</p></div>
              </div>
              <button onClick={() => { setShowWithdrawModal(false); setWithdrawMessage(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#065f46' }}>Withdrawal Amount</span>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>${usdEarned.toFixed(2)}</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Reward Month</label>
                <input type="month" value={withdrawMonth} onChange={e => setWithdrawMonth(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Payout Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button type="button" onClick={() => setWithdrawPayoutMethod('bank')} style={{ padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', border: withdrawPayoutMethod === 'bank' ? '2px solid #6366f1' : '2px solid #e2e8f0', background: withdrawPayoutMethod === 'bank' ? '#f5f3ff' : '#fff' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: withdrawPayoutMethod === 'bank' ? '#3730a3' : '#475569', marginBottom: '4px' }}>Bank Transfer</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{paymentInfo?.bank_account_name || 'No bank details saved'}</div>
                  </button>
                  <button type="button" onClick={() => setWithdrawPayoutMethod('crypto')} style={{ padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', border: withdrawPayoutMethod === 'crypto' ? '2px solid #10b981' : '2px solid #e2e8f0', background: withdrawPayoutMethod === 'crypto' ? '#f0fdf4' : '#fff' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: withdrawPayoutMethod === 'crypto' ? '#065f46' : '#475569', marginBottom: '4px' }}>USDT (BEP20)</div>
                    <div style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{paymentInfo?.bep20_address || 'No wallet address saved'}</div>
                  </button>
                </div>
              </div>
              {withdrawMessage && <div style={{ padding: '12px 16px', background: withdrawMessage.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${withdrawMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`, borderRadius: '10px', marginBottom: '16px', fontSize: '13px', color: withdrawMessage.type === 'success' ? '#065f46' : '#dc2626', fontWeight: '600' }}>{withdrawMessage.text}</div>}
              <button onClick={handleWithdraw} disabled={withdrawing} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: withdrawing ? '#e2e8f0' : 'linear-gradient(135deg,#10b981,#059669)', color: withdrawing ? '#94a3b8' : '#fff', fontSize: '14px', fontWeight: '700', cursor: withdrawing ? 'not-allowed' : 'pointer' }}>
                {withdrawing ? 'Submitting...' : 'Submit Withdrawal Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && <LieutenantUpgradeModal onClose={() => setShowUpgradeModal(false)} onConfirm={() => { setShowUpgradeModal(false); handleStripeUpgrade(); }} loading={stripeLoading} />}
    </>
  );
}
