"use client";
import React, { useState, useEffect, useCallback } from "react";
import LieutenantUpgradeModal from "@/components/dashboard/LieutenantUpgradeModal";
import { Award, DollarSign, ChevronRight, Trophy, Zap, Crown, ArrowUp, Flame, Shield, Lock } from "lucide-react";

export default function RewardsContent({ mounted }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showBurnModal, setShowBurnModal] = useState(false);
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
  const [redeemType, setRedeemType] = useState('dagcoin');
  const [redeemAmount, setRedeemAmount] = useState(1);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState(null);
  const [rewardData, setRewardData] = useState({
    currentRank: 'None', dagPoints: 0, usdEarned: 0, usdtEarned: 0, tier: 'DAG SOLDIER',
    rankingEnabledForSoldier: false, totalPointsEarned: 0, totalPointsBurned: 0,
    totalPointsRedeemed: 0, txHistory: [], monthDirectSales: 0, quarterDirectSales: 0, incentivePools: null,
  });
  const [txTab, setTxTab] = useState('all');
  const [txTypeFilter, setTxTypeFilter] = useState('all');
  const [txTypeOpen, setTxTypeOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('dagarmy_user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchRewardData(userData.email);
      fetchPaymentInfo(userData.id);
      fetchWithdrawHistory(userData.id);
    } else { setLoading(false); }
  }, []);

  const fetchPaymentInfo = async (userId) => {
    try {
      const res = await fetch(`/api/user/payment-info?userId=${userId}`);
      const data = await res.json();
      if (data.success) { setPaymentInfo(data.paymentInfo); setWithdrawPayoutMethod(data.paymentInfo?.preferred_payout || 'bank'); }
    } catch (err) { console.error('Error fetching payment info:', err); }
  };

  const fetchWithdrawHistory = async (userId) => {
    try {
      const res = await fetch(`/api/rewards/withdraw?userId=${userId}`);
      const data = await res.json();
      if (data.success) setWithdrawHistory(data.requests || []);
    } catch (err) { console.error('Error fetching withdraw history:', err); }
  };

  const handleWithdraw = async () => {
    if (!user?.id) return;
    setWithdrawing(true); setWithdrawMessage(null);
    try {
      const res = await fetch('/api/rewards/withdraw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, rewardMonth: withdrawMonth, amountUsd: rewardData.usdEarned, payoutMethod: withdrawPayoutMethod }) });
      const data = await res.json();
      if (data.success) { setWithdrawMessage({ type: 'success', text: data.message }); fetchWithdrawHistory(user.id); setTimeout(() => { setShowWithdrawModal(false); setWithdrawMessage(null); }, 3000); }
      else setWithdrawMessage({ type: 'error', text: data.error });
    } catch (err) { setWithdrawMessage({ type: 'error', text: 'Network error. Please try again.' }); }
    finally { setWithdrawing(false); }
  };

  const fetchRewardData = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rewards/user?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.success && data.data) setRewardData(data.data);
    } catch (error) { console.error('Error fetching reward data:', error); }
    finally { setLoading(false); }
  };

  const handleStripeUpgrade = async (test = false) => {
    if (!user?.id || !user?.email) return;
    setStripeLoading(test ? 'test' : 'full');
    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, userEmail: user.email, test }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Could not start checkout. Please try again.');
    } catch (err) { alert('Network error. Please try again.'); }
    finally { setStripeLoading(false); }
  };

  const REDEEM_CONFIG = {
    dagcoin: { ratio: 500, label: 'DAGCHAIN Gas Coins', unit: 'Coin', color: '#f59e0b', light: '#fffbeb', border: '#fde68a', desc: 'Native gas coin on the DAGCHAIN blockchain' },
  };

  const handleRedeem = async () => {
    if (!user?.email) return;
    const cfg = REDEEM_CONFIG[redeemType];
    const pointsCost = redeemAmount * cfg.ratio;
    if (pointsCost > rewardData.dagPoints) return;
    try {
      setRedeeming(true); setRedeemMessage(null);
      const res = await fetch('/api/rewards/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_email: user.email, redemption_type: redeemType, amount: redeemAmount }) });
      const data = await res.json();
      if (data.success) { setRedeemMessage({ type: 'success', text: data.message }); fetchRewardData(user.email); setTimeout(() => { setShowRedeemModal(false); setRedeemMessage(null); setRedeemAmount(1); }, 2500); }
      else setRedeemMessage({ type: 'error', text: data.error || 'Redemption failed' });
    } catch (err) { setRedeemMessage({ type: 'error', text: 'Network error. Please try again.' }); }
    finally { setRedeeming(false); }
  };

  const ranksList = [
    { name: 'INITIATOR', points: 700, color: '#6b7280' }, { name: 'VANGUARD', points: 1500, color: '#10b981' },
    { name: 'GUARDIAN', points: 3200, color: '#3b82f6' }, { name: 'STRIKER', points: 7000, color: '#8b5cf6' },
    { name: 'INVOKER', points: 10000, color: '#ec4899' }, { name: 'COMMANDER', points: 15000, color: '#f59e0b' },
    { name: 'CHAMPION', points: 20000, color: '#ef4444' }, { name: 'CONQUEROR', points: 30000, color: '#dc2626' },
    { name: 'PARAGON', points: 40000, color: '#7c3aed' }, { name: 'MYTHIC', points: 50000, color: '#fbbf24' },
  ];

  const isLieutenant = rewardData.tier === 'DAG LIEUTENANT' || rewardData.tier === 'DAG_LIEUTENANT';
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

  const currentRankIndex = rewardData.currentRank === 'None' ? -1 : ranksList.findIndex(r => r.name === rewardData.currentRank);
  const nextRankIndex = currentRankIndex + 1;
  const nextRank = nextRankIndex < ranksList.length ? ranksList[nextRankIndex] : null;
  const currentRank = currentRankIndex >= 0 ? ranksList[currentRankIndex] : null;
  const burnCost = nextRank ? nextRank.points : 0;
  const canUpgrade = rewardData.dagPoints >= burnCost;
  const progressPercentage = nextRank
    ? (currentRank ? Math.min(100, Math.max(0, ((rewardData.dagPoints - currentRank.points) / (nextRank.points - currentRank.points)) * 100)) : Math.min(100, Math.max(0, (rewardData.dagPoints / nextRank.points) * 100)))
    : 100;

  return (
    <>
      <div>
        {/* Header */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: nm.textPrimary, margin: 0, letterSpacing: '-0.5px' }}>My Rewards</h1>
            <p style={{ fontSize: '13px', color: nm.textMuted, margin: '4px 0 0', fontWeight: '500' }}>Track your DAG Points, ranks, and earnings</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => setShowRedeemModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: nm.bg, boxShadow: nm.shadowSm, color: nm.accent, fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.2px' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <ArrowUp size={15} />Redeem Points
            </button>
            {!isLieutenant && (
              <button onClick={() => setShowUpgradeModal(true)} disabled={!!stripeLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: nm.bg, boxShadow: stripeLoading ? nm.shadowInset : nm.shadowSm, color: nm.textSecondary, fontSize: '13px', fontWeight: '700', cursor: stripeLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { if (!stripeLoading) { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={e => { if (!stripeLoading) { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; } }}
              >
                <Crown size={15} color={nm.accent} />{stripeLoading === 'full' ? 'Redirecting...' : 'Upgrade to Lieutenant'}
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '6px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: nm.accent }}>$149</span>
              </button>
            )}
          </div>
        </div>

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <NmCard delay={50} style={{ padding: '24px 28px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 14px' }}>DAG Points</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: nm.accent, letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>{rewardData.dagPoints.toLocaleString()}</p>
            <p style={{ fontSize: '11px', color: nm.textMuted, margin: '8px 0 0' }}>Available balance</p>
          </NmCard>
          <NmCard delay={100} style={{ padding: '24px 28px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 14px' }}>Current Rank</p>
            <p style={{ fontSize: '26px', fontWeight: '800', color: nm.textPrimary, letterSpacing: '-0.5px', lineHeight: 1, margin: 0 }}>{rewardData.currentRank === 'None' ? 'Starter' : rewardData.currentRank}</p>
            <p style={{ fontSize: '11px', color: nm.textMuted, margin: '8px 0 0' }}>{isLieutenant ? 'DAG LIEUTENANT' : 'DAG SOLDIER'}</p>
          </NmCard>
          <NmCard delay={150} style={{ padding: '24px 28px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>USD Earned</p>
              {rewardData.usdEarned >= 10 && (
                <button onClick={() => setShowWithdrawModal(true)}
                  style={{ fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowSm, color: nm.textSecondary, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadow; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadowSm; }}
                >Withdraw</button>
              )}
            </div>
            <p style={{ fontSize: '36px', fontWeight: '800', color: nm.textPrimary, letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>${rewardData.usdEarned.toFixed(2)}</p>
            <p style={{ fontSize: '11px', color: nm.textMuted, margin: '8px 0 0' }}>Commissions</p>
            {rewardData.usdEarned >= 10 && paymentInfo && !paymentInfo.bank_account_name && !paymentInfo.bep20_address && (
              <div style={{ marginTop: '10px', padding: '8px 12px', background: nm.bg, boxShadow: nm.shadowInsetSm, borderRadius: '8px', fontSize: '11px', color: nm.textSecondary }}>
                No payment info. <a href="/student-setting" style={{ color: nm.accent, fontWeight: '700', textDecoration: 'none' }}>Add in Settings</a>
              </div>
            )}
          </NmCard>
          <NmCard delay={200} style={{ padding: '24px 28px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 14px' }}>USDT Earned</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: nm.textPrimary, letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>{(rewardData.usdtEarned || 0).toFixed(2)}</p>
            <p style={{ fontSize: '11px', color: nm.textMuted, margin: '8px 0 0' }}>Crypto payouts</p>
          </NmCard>
        </div>

        {/* Points Summary Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Points Earned',  value: rewardData.totalPointsEarned   },
            { label: 'Points Burned (Ranks)', value: rewardData.totalPointsBurned   },
            { label: 'Points Redeemed',       value: rewardData.totalPointsRedeemed },
          ].map((s, i) => (
            <div key={s.label} style={{ background: nm.bg, borderRadius: '14px', padding: '16px 20px', boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: nm.textPrimary, letterSpacing: '-1px' }}>{(s.value || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Rank Progression */}
        <NmCard delay={300} hover={false} inset style={{ marginBottom: '20px', padding: '28px 24px' }}>
          {(() => {
            const badgeMap = { starter:'/images/badges/dag-starter.svg', initiator:'/images/badges/dag-initiator.svg', vanguard:'/images/badges/dag-vanguard.svg', guardian:'/images/badges/dag-guardian.svg', striker:'/images/badges/dag-striker.svg', invoker:'/images/badges/dag-invoker.svg', commander:'/images/badges/dag-commander.svg', champion:'/images/badges/dag-champion.svg', conqueror:'/images/badges/dag-conqueror.svg', paragon:'/images/badges/dag-paragon.svg', mythic:'/images/badges/dag-mythic.svg' };
            const crName = rewardData.currentRank === 'None' ? 'starter' : rewardData.currentRank.toLowerCase();
            const nrName = nextRank ? nextRank.name.toLowerCase() : null;
            const purpleWidth = canUpgrade ? 100 : Math.max(progressPercentage, rewardData.dagPoints > 0 ? 5 : 0);
            const whiteWidth = 100 - purpleWidth;
            return !nextRank ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img src={badgeMap[crName] || '/images/badges/dag-starter.svg'} alt={crName}
                  style={{ width: '96px', height: '96px', objectFit: 'contain', filter: `drop-shadow(0 4px 12px ${currentRank?.color || '#fbbf24'}60)`, flexShrink: 0 }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b', letterSpacing: '0.3px' }}>MYTHIC ACHIEVED</span>
                  </div>
                  <p style={{ fontSize: '13px', color: nm.textPrimary, margin: 0 }}>You have reached the highest rank in DAGArmy.</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ flexShrink: 0, minWidth: '100px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Rank</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentRank?.color || '#cbd5e1', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: '800', color: currentRank?.color || nm.textPrimary, letterSpacing: '0.3px' }}>
                      {rewardData.currentRank === 'None' ? 'STARTER' : rewardData.currentRank}
                    </span>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0' }}>
                  <div style={{ flexShrink: 0 }}>
                    <img src={badgeMap[crName] || '/images/badges/dag-starter.svg'} alt={crName}
                      style={{ width: '96px', height: '96px', objectFit: 'contain', filter: `drop-shadow(0 4px 12px ${currentRank?.color || '#94a3b8'}60)`, display: 'block' }} />
                  </div>
                  <div style={{ flex: 1, padding: '0 16px' }}>
                    <div style={{ width: '100%', height: '48px', borderRadius: '24px', overflow: 'hidden', display: 'flex', border: '2px solid #000' }}>
                      <div style={{ width: `${purpleWidth}%`, height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                        {purpleWidth > 12 && (
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', padding: '0 12px' }}>
                            {canUpgrade ? `${rewardData.dagPoints.toLocaleString()} pts — Ready to upgrade!` : `${rewardData.dagPoints.toLocaleString()} pts`}
                          </span>
                        )}
                      </div>
                      {whiteWidth > 0 && (
                        <div style={{ width: `${whiteWidth}%`, height: '100%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e1b4b', whiteSpace: 'nowrap', padding: '0 12px' }}>
                            {(burnCost - rewardData.dagPoints).toLocaleString()} pts needed
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <img src={badgeMap[nrName] || '/images/badges/dag-initiator.svg'} alt={nrName}
                      style={{ width: '96px', height: '96px', objectFit: 'contain', opacity: 0.5, display: 'block' }} />
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <button onClick={() => { setShowRankBurnModal(true); }}
                    style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', background: 'linear-gradient(145deg,#7c7ff5,#5a5de8)', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '4px 4px 10px rgba(99,102,241,0.4),-2px -2px 6px rgba(255,255,255,0.7),inset 1px 1px 2px rgba(255,255,255,0.3)' }}>
                    Upgrade
                  </button>
                </div>
              </div>
            );
          })()}
        </NmCard>

        {/* Incentive Pools */}
        {(() => {
          const pools = rewardData.incentivePools;
          if (!pools) return null;
          const POOL_META = [
            { key: 'discretionary', title: 'Discretionary Incentive', subtitle: 'Monthly pool — resets every month', color: '#10b981', iconPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', type: 'sales' },
            { key: 'lifestyle', title: 'Lifestyle Bonus', subtitle: 'Monthly pool — Car / Travel / Home', color: '#6366f1', iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', type: 'sales' },
            { key: 'elite', title: 'DAG Army Elite Pool', subtitle: 'Ongoing — 2% of global revenue', color: '#7c3aed', iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', type: 'elite' },
            { key: 'executive', title: 'Executive Performance Incentive', subtitle: 'Quarterly pool — resets every quarter', color: '#d97706', iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', type: 'sales' },
          ];
          return (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '800', color: nm.textPrimary, margin: '0 0 3px', letterSpacing: '-0.3px' }}>Incentive Pool Programs</h2>
                <p style={{ fontSize: '12px', color: nm.textMuted, margin: 0 }}>Revenue pools — qualify by hitting sales targets or building an active team</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
                {POOL_META.map(pm => {
                  const pool = pools[pm.key];
                  if (!pool) return null;
                  const isElite = pm.type === 'elite';
                  const qualified = isElite
                    ? pool.activeReferrals >= pool.minReferrals
                    : pool.currentSales >= pool.threshold;
                  const pct = isElite
                    ? Math.min(100, pool.minReferrals > 0 ? (pool.activeReferrals / pool.minReferrals) * 100 : 0)
                    : Math.min(100, pool.threshold > 0 ? (pool.currentSales / pool.threshold) * 100 : 0);
                  const remaining = isElite
                    ? Math.max(0, pool.minReferrals - pool.activeReferrals)
                    : Math.max(0, pool.threshold - pool.currentSales);
                  return (
                    <div key={pm.key} style={{ background: nm.bg, borderRadius: '18px', boxShadow: nm.shadowSm, overflow: 'hidden', opacity: pool.enabled ? 1 : 0.5, transition: 'all 0.3s' }}>
                      <div style={{ padding: '18px 20px', borderBottom: `1px solid ${nm.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: nm.bg, boxShadow: qualified ? nm.shadowXs : nm.shadowInsetSm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={qualified ? pm.color : nm.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={pm.iconPath}/></svg>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary, lineHeight: 1.2 }}>{pm.title}</div>
                            <div style={{ fontSize: '10px', color: nm.textMuted, marginTop: '2px' }}>{pm.subtitle}</div>
                          </div>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          {!pool.enabled
                            ? <span style={{ fontSize: '9px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: nm.textMuted, textTransform: 'uppercase' }}>Disabled</span>
                            : qualified
                              ? <span style={{ fontSize: '9px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: pm.color, textTransform: 'uppercase' }}>Qualified</span>
                              : <span style={{ fontSize: '9px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: nm.textSecondary, textTransform: 'uppercase' }}>In Progress</span>}
                        </div>
                      </div>
                      <div style={{ padding: '16px 20px' }}>
                        {isElite ? (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Active Referrals</span>
                              <span style={{ fontSize: '12px', fontWeight: '800', color: nm.textPrimary }}>{pool.activeReferrals} <span style={{ fontWeight: '500', color: nm.textMuted, fontSize: '11px' }}>/ {pool.minReferrals} required</span></span>
                            </div>
                            <div style={{ height: '5px', background: nm.bg, borderRadius: '3px', boxShadow: nm.shadowInsetSm, overflow: 'hidden', marginBottom: '10px' }}>
                              <div style={{ height: '100%', borderRadius: '3px', background: qualified ? pm.color : `rgba(124,58,237,0.4)`, width: `${pct}%`, transition: 'width 1s ease' }} />
                            </div>
                            {qualified
                              ? <div style={{ fontSize: '12px', color: pm.color, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Eligible for {pool.poolPct}% global revenue share</div>
                              : <div style={{ fontSize: '11px', color: nm.textMuted, lineHeight: 1.5 }}><strong style={{ color: nm.textPrimary }}>{remaining} more</strong> active referrals needed to qualify for the <strong style={{ color: pm.color }}>{pool.poolPct}%</strong> Elite Pool</div>}
                          </>
                        ) : (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{pool.period === 'quarterly' ? 'This Quarter' : 'This Month'}</span>
                              <span style={{ fontSize: '12px', fontWeight: '800', color: nm.textPrimary }}>${pool.currentSales.toFixed(0)} <span style={{ fontWeight: '500', color: nm.textMuted, fontSize: '11px' }}>/ ${pool.threshold.toLocaleString()}</span></span>
                            </div>
                            <div style={{ height: '5px', background: nm.bg, borderRadius: '3px', boxShadow: nm.shadowInsetSm, overflow: 'hidden', marginBottom: '10px' }}>
                              <div style={{ height: '100%', borderRadius: '3px', background: qualified ? pm.color : `rgba(79,70,229,0.4)`, width: `${pct}%`, transition: 'width 1s ease' }} />
                            </div>
                            {qualified
                              ? <div style={{ fontSize: '12px', color: pm.color, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Qualifies for {pool.poolPct}% pool this {pool.period === 'quarterly' ? 'quarter' : 'month'}</div>
                              : <div style={{ fontSize: '11px', color: nm.textMuted, lineHeight: 1.5 }}><strong style={{ color: nm.textPrimary }}>${remaining.toFixed(0)} more</strong> in sales to qualify for the <strong style={{ color: pm.color }}>{pool.poolPct}%</strong> pool</div>}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: '10px', padding: '12px 18px', background: nm.bg, borderRadius: '12px', boxShadow: nm.shadowInsetSm, fontSize: '12px', color: nm.textMuted, lineHeight: 1.6 }}>
                <strong style={{ color: nm.textPrimary }}>How it works:</strong> A percentage of company net revenue is pooled each period. Sales pools share equally among qualifiers. The Elite Pool requires 25+ active referrals (joined &amp; purchased) and shares 2% of total global revenue.
              </div>
            </div>
          );
        })()}

        {/* Transaction History */}
        <NmCard delay={400} hover={false} inset={true} style={{ padding: '28px 32px', overflow: 'visible' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>Transaction History</h3>
            {/* Date range filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: nm.textMuted }}>From</span>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowInsetSm, fontSize: '12px', color: nm.textPrimary, outline: 'none', cursor: 'pointer' }} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: nm.textMuted }}>To</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowInsetSm, fontSize: '12px', color: nm.textPrimary, outline: 'none', cursor: 'pointer' }} />
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(''); setDateTo(''); }}
                  style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowSm, fontSize: '11px', fontWeight: '700', color: nm.textMuted, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = nm.shadow}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = nm.shadowSm}
                >Clear</button>
              )}
            </div>
          </div>
          {/* Tabs row */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
            {[
              { key: 'all',    label: 'All'    },
              { key: 'points', label: 'Points' },
              { key: 'usd',    label: 'USD'    },
              { key: 'usdt',   label: 'USDT'   },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setTxTab(key)}
                style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: txTab === key ? nm.shadowInset : nm.shadowSm, color: txTab === key ? nm.accent : '#1e293b', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.3px' }}
                onMouseEnter={e => { if (txTab !== key) e.currentTarget.style.boxShadow = nm.shadow; }}
                onMouseLeave={e => { if (txTab !== key) e.currentTarget.style.boxShadow = nm.shadowSm; }}
              >{label}</button>
            ))}
          </div>
          {/* Table */}
          {(() => {
            const fromTs = dateFrom ? new Date(dateFrom).getTime() : null;
            const toTs   = dateTo   ? new Date(dateTo + 'T23:59:59').getTime() : null;

            const classify = tx => {
              const isUsd        = tx.transaction_type === 'usd_commission';
              const isUsdt       = tx.transaction_type === 'usdt_payout';
              const isWithdrawal = tx.transaction_type === 'withdrawal' || tx.transaction_type === 'usdt_withdrawal';
              const isBurned     = tx.points != null && tx.points < 0 && tx.transaction_type === 'rank_burn';
              const isRedeemed   = tx.points != null && tx.points < 0 && !isBurned;
              const isSale       = tx.transaction_type === 'sale_points';
              const isAdminGrant = tx.transaction_type === 'admin_grant' || (isUsd && tx.description?.startsWith('Admin grant'));
              const isEarned     = (tx.points != null && tx.points > 0 && !isSale && !isAdminGrant) || ((isUsd || isUsdt) && !isAdminGrant && !isWithdrawal);
              return { isUsd, isUsdt, isWithdrawal, isBurned, isRedeemed, isSale, isAdminGrant, isEarned };
            };

            const getTypeLabel = (tx, c) => {
              if (c.isWithdrawal) return 'Withdrawal';
              if (c.isAdminGrant) return 'Admin Grant';
              if (c.isUsd) return tx.payment_status === 'paid' ? 'Earned' : `Pending`;
              if (c.isUsdt) return 'Earned';
              if (c.isSale) return 'Sale';
              if (c.isBurned) return 'Burned';
              if (c.isRedeemed) return 'Redeemed';
              return 'Earned';
            };

            const filtered = rewardData.txHistory.filter(tx => {
              const t = new Date(tx.created_at).getTime();
              if (fromTs && t < fromTs) return false;
              if (toTs   && t > toTs)   return false;
              const c = classify(tx);
              // Tab filter
              if (txTab === 'points') { if (tx.points == null) return false; }
              else if (txTab === 'usd')   { if (!c.isUsd)  return false; }
              else if (txTab === 'usdt')  { if (!c.isUsdt) return false; }
              // Type filter
              if (txTypeFilter === 'admin_grant') return c.isAdminGrant;
              if (txTypeFilter === 'burned')      return c.isBurned;
              if (txTypeFilter === 'earned')      return c.isEarned;
              if (txTypeFilter === 'redeemed')    return c.isRedeemed;
              if (txTypeFilter === 'sale')        return c.isSale;
              if (txTypeFilter === 'withdrawal')  return c.isWithdrawal;
              return true;
            });

            if (filtered.length === 0) return (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: 0 }}>No transactions found</p>
              </div>
            );

            return (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 130px 110px 140px', padding: '8px 14px', background: nm.bg, boxShadow: nm.shadowInsetSm, borderRadius: '8px', marginBottom: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Txn ID</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Description</span>
                  {/* Type column header — pill filter popover */}
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => setTxTypeOpen(o => !o)}
                      style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '0', border: 'none', background: 'transparent', fontSize: '10px', fontWeight: '700', color: txTypeFilter !== 'all' ? nm.accent : '#1e293b', textTransform: 'uppercase', letterSpacing: '0.6px', cursor: 'pointer' }}>
                      {txTypeFilter === 'all' ? 'TYPE' : txTypeFilter === 'admin_grant' ? 'ADMIN GRANT' : txTypeFilter.toUpperCase()}
                      <svg width="8" height="8" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke={txTypeFilter !== 'all' ? nm.accent : '#1e293b'} strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                    {txTypeOpen && (() => {
                      const typesByTab = {
                        all:    [ { key: 'all', label: 'All Types' }, { key: 'admin_grant', label: 'Admin Grant' }, { key: 'burned', label: 'Burned' }, { key: 'earned', label: 'Earned' }, { key: 'redeemed', label: 'Redeemed' }, { key: 'sale', label: 'Sale' }, { key: 'withdrawal', label: 'Withdrawal' } ],
                        points: [ { key: 'all', label: 'All Types' }, { key: 'admin_grant', label: 'Admin Grant' }, { key: 'burned', label: 'Burned' }, { key: 'earned', label: 'Earned' }, { key: 'redeemed', label: 'Redeemed' }, { key: 'sale', label: 'Sale' } ],
                        usd:    [ { key: 'all', label: 'All Types' }, { key: 'admin_grant', label: 'Admin Grant' }, { key: 'earned', label: 'Earned' }, { key: 'withdrawal', label: 'Withdrawal' } ],
                        usdt:   [ { key: 'all', label: 'All Types' }, { key: 'admin_grant', label: 'Admin Grant' }, { key: 'earned', label: 'Earned' }, { key: 'withdrawal', label: 'Withdrawal' } ],
                      };
                      const options = typesByTab[txTab] || typesByTab.all;
                      return (
                      <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 50, background: nm.bg, borderRadius: '14px', boxShadow: nm.shadow, padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '130px' }}
                        onMouseLeave={() => setTxTypeOpen(false)}>
                        {options.map(({ key, label }) => (
                          <button key={key} onClick={() => { setTxTypeFilter(key); setTxTypeOpen(false); }}
                            style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: txTypeFilter === key ? nm.shadowInset : nm.shadowXs, color: txTypeFilter === key ? nm.accent : '#1e293b', fontSize: '11px', fontWeight: '700', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                            onMouseEnter={e => { if (txTypeFilter !== key) e.currentTarget.style.boxShadow = nm.shadowSm; }}
                            onMouseLeave={e => { if (txTypeFilter !== key) e.currentTarget.style.boxShadow = nm.shadowXs; }}
                          >{label}</button>
                        ))}
                      </div>
                      );
                    })()}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: 'right' }}>Amount</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: 'right' }}>Date</span>
                </div>
                {filtered.map((tx, idx) => {
                  const c = classify(tx);
                  const isPositive = c.isEarned || c.isSale || c.isAdminGrant || c.isUsd || c.isUsdt;
                  const typeLabel  = getTypeLabel(tx, c);
                  const amount = c.isUsd  ? `$${(tx.amount || 0).toFixed(2)}`
                               : c.isUsdt ? `${(tx.amount || 0).toFixed(2)} USDT`
                               : `${isPositive ? '+' : '−'}${Math.abs(tx.points).toLocaleString()} pts`;
                  const dateStr = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const txnId   = tx.transaction_id || '—';
                  return (
                    <div key={tx.id || idx} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 130px 110px 140px', padding: '11px 14px', alignItems: 'center', borderBottom: idx < filtered.length - 1 ? `1px solid ${nm.border}` : 'none', borderRadius: '6px' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', color: '#1e293b', letterSpacing: '0.3px' }}>{txnId}</span>
                        {txnId !== '—' && <button onClick={() => navigator.clipboard.writeText(txnId)} title="Copy" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#64748b', display: 'flex', alignItems: 'center' }} onMouseEnter={e => e.currentTarget.style.color = nm.accent} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>}
                      </div>
                      <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px' }}>{tx.description || tx.transaction_type}</span>
                      <div><span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{typeLabel}</span></div>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: isPositive ? nm.accent : '#1e293b', textAlign: 'right', letterSpacing: '-0.3px' }}>{amount}</span>
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
                <div><h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Redeem DAG Points</h2><p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Exchange points for platform rewards</p></div>
              </div>
              <button onClick={() => { setShowRedeemModal(false); setRedeemMessage(null); setRedeemAmount(1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#3730a3' }}>Available DAG Points</span>
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#4f46e5', letterSpacing: '-0.5px' }}>{rewardData.dagPoints.toLocaleString()}</span>
              </div>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div><div style={{ fontSize: '14px', fontWeight: '800', color: '#f59e0b', marginBottom: '3px' }}>DAGCHAIN Gas Coins</div><div style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>Native gas coin on the DAGCHAIN blockchain</div></div>
                <div style={{ padding: '4px 10px', borderRadius: '8px', background: '#f59e0b18', fontSize: '12px', fontWeight: '700', color: '#f59e0b', whiteSpace: 'nowrap' }}>500 pts = 1 Coin</div>
              </div>
              {(() => {
                const cfg = REDEEM_CONFIG[redeemType];
                const pointsCost = redeemAmount * cfg.ratio;
                const canRedeem = redeemAmount > 0 && pointsCost <= rewardData.dagPoints;
                const maxAmount = Math.floor(rewardData.dagPoints / cfg.ratio);
                return (
                  <>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Amount ({cfg.unit}s)</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <button onClick={() => setRedeemAmount(a => Math.max(1, a - 1))} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '18px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>−</button>
                      <input type="number" min={1} max={maxAmount} value={redeemAmount} onChange={e => setRedeemAmount(Math.max(1, Math.min(maxAmount, parseInt(e.target.value) || 1)))} style={{ flex: 1, textAlign: 'center', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '18px', fontWeight: '800', color: '#0f172a', outline: 'none' }} />
                      <button onClick={() => setRedeemAmount(a => Math.min(maxAmount, a + 1))} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '18px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>+</button>
                    </div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}><span style={{ fontWeight: '700', color: '#0f172a' }}>{redeemAmount} {cfg.unit}{redeemAmount !== 1 ? 's' : ''}</span> costs</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: canRedeem ? cfg.color : '#ef4444', letterSpacing: '-0.5px' }}>{pointsCost.toLocaleString()}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>pts</span>
                      </div>
                    </div>
                    {redeemMessage && <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: redeemMessage.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${redeemMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: redeemMessage.type === 'success' ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: '600' }}>{redeemMessage.text}</div>}
                    <button onClick={handleRedeem} disabled={!canRedeem || redeeming} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: canRedeem && !redeeming ? `linear-gradient(135deg,${cfg.color},${cfg.color}cc)` : '#e2e8f0', color: canRedeem && !redeeming ? '#fff' : '#94a3b8', fontSize: '14px', fontWeight: '700', cursor: canRedeem && !redeeming ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
                      {redeeming ? 'Processing…' : `Redeem ${redeemAmount} ${cfg.unit}${redeemAmount !== 1 ? 's' : ''} for ${pointsCost.toLocaleString()} pts`}
                    </button>
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
              <button onClick={() => { setShowWithdrawModal(false); setWithdrawMessage(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#065f46' }}>Withdrawal Amount</span>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#10b981', letterSpacing: '-0.5px' }}>${rewardData.usdEarned.toFixed(2)}</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Reward Month</label>
                <input type="month" value={withdrawMonth} onChange={e => setWithdrawMonth(e.target.value)} max={(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`; })()} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Payout Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button type="button" onClick={() => setWithdrawPayoutMethod('bank')} style={{ padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', border: withdrawPayoutMethod === 'bank' ? '2px solid #6366f1' : '2px solid #e2e8f0', background: withdrawPayoutMethod === 'bank' ? '#f5f3ff' : '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={withdrawPayoutMethod === 'bank' ? '#6366f1' : '#94a3b8'} strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg><span style={{ fontSize: '13px', fontWeight: '700', color: withdrawPayoutMethod === 'bank' ? '#3730a3' : '#475569' }}>Bank Transfer</span></div>
                    {paymentInfo?.bank_account_name ? <div style={{ fontSize: '11px', color: '#64748b' }}>{paymentInfo.bank_account_name}<br/>{paymentInfo.bank_name}</div> : <div style={{ fontSize: '11px', color: '#f59e0b' }}>No bank details saved</div>}
                  </button>
                  <button type="button" onClick={() => setWithdrawPayoutMethod('crypto')} style={{ padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', border: withdrawPayoutMethod === 'crypto' ? '2px solid #10b981' : '2px solid #e2e8f0', background: withdrawPayoutMethod === 'crypto' ? '#f0fdf4' : '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={withdrawPayoutMethod === 'crypto' ? '#10b981' : '#94a3b8'} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 8h5a2 2 0 0 1 0 4H9v4h5a2 2 0 0 0 0-4"/><line x1="9" y1="12" x2="14" y2="12"/></svg><span style={{ fontSize: '13px', fontWeight: '700', color: withdrawPayoutMethod === 'crypto' ? '#065f46' : '#475569' }}>USDT (BEP20)</span></div>
                    {paymentInfo?.bep20_address ? <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{paymentInfo.bep20_address}</div> : <div style={{ fontSize: '11px', color: '#f59e0b' }}>No wallet address saved</div>}
                  </button>
                </div>
              </div>
              {withdrawMessage && <div style={{ padding: '12px 16px', background: withdrawMessage.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${withdrawMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`, borderRadius: '10px', marginBottom: '16px', fontSize: '13px', color: withdrawMessage.type === 'success' ? '#065f46' : '#dc2626', fontWeight: '600' }}>{withdrawMessage.text}</div>}
              <button onClick={handleWithdraw} disabled={withdrawing} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: withdrawing ? '#e2e8f0' : 'linear-gradient(135deg,#10b981,#059669)', color: withdrawing ? '#94a3b8' : '#fff', fontSize: '14px', fontWeight: '700', cursor: withdrawing ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                {withdrawing ? 'Submitting...' : 'Submit Withdrawal Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && <LieutenantUpgradeModal onClose={() => setShowUpgradeModal(false)} onConfirm={() => { setShowUpgradeModal(false); handleStripeUpgrade(false); }} loading={stripeLoading === 'full'} />}
    </>
  );
}
