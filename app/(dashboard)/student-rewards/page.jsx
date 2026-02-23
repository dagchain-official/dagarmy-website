"use client";
import React, { useState, useEffect, useCallback } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { 
  Award, DollarSign, 
  ChevronRight, Trophy, Zap, Crown, ArrowUp, Flame, Shield, Lock
} from "lucide-react";

export default function StudentRewardsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState(null);

  // Burn modal
  const [showBurnModal, setShowBurnModal] = useState(false);

  // Withdrawal modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [withdrawMonth, setWithdrawMonth] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [withdrawPayoutMethod, setWithdrawPayoutMethod] = useState('bank');

  // Redeem modal
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemType, setRedeemType] = useState('daggpt'); // 'daggpt' | 'dagcoin'
  const [redeemAmount, setRedeemAmount] = useState(1);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState(null);
  const [rewardData, setRewardData] = useState({
    currentRank: 'None',
    dagPoints: 0,
    usdEarned: 0,
    tier: 'DAG SOLDIER',
    rankingEnabledForSoldier: false,
    totalPointsEarned: 0,
    totalPointsBurned: 0,
    totalPointsRedeemed: 0,
    txHistory: [],
    monthDirectSales: 0,
    quarterDirectSales: 0,
    incentivePools: null,
  });

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    const userStr = localStorage.getItem('dagarmy_user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchRewardData(userData.email);
      fetchPaymentInfo(userData.id);
      fetchWithdrawHistory(userData.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPaymentInfo = async (userId) => {
    try {
      const res = await fetch(`/api/user/payment-info?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setPaymentInfo(data.paymentInfo);
        setWithdrawPayoutMethod(data.paymentInfo?.preferred_payout || 'bank');
      }
    } catch (err) {
      console.error('Error fetching payment info:', err);
    }
  };

  const fetchWithdrawHistory = async (userId) => {
    try {
      const res = await fetch(`/api/rewards/withdraw?userId=${userId}`);
      const data = await res.json();
      if (data.success) setWithdrawHistory(data.requests || []);
    } catch (err) {
      console.error('Error fetching withdraw history:', err);
    }
  };

  const handleWithdraw = async () => {
    if (!user?.id) return;
    setWithdrawing(true);
    setWithdrawMessage(null);
    try {
      const res = await fetch('/api/rewards/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, rewardMonth: withdrawMonth, amountUsd: rewardData.usdEarned, payoutMethod: withdrawPayoutMethod }),
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawMessage({ type: 'success', text: data.message });
        fetchWithdrawHistory(user.id);
        setTimeout(() => { setShowWithdrawModal(false); setWithdrawMessage(null); }, 3000);
      } else {
        setWithdrawMessage({ type: 'error', text: data.error });
      }
    } catch (err) {
      setWithdrawMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setWithdrawing(false);
    }
  };

  const fetchRewardData = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rewards/user?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.success && data.data) {
        setRewardData(data.data);
      } else {
        console.error('Failed to fetch reward data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching reward data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRankUpgrade = async (nextRankName, burnCost) => {
    if (!user?.email) return;
    const confirmed = window.confirm(
      `Burn ${burnCost.toLocaleString()} DAG Points to upgrade to ${nextRankName}?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;
    try {
      setUpgrading(true);
      setUpgradeMessage(null);
      const res = await fetch('/api/rewards/rank-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: user.email })
      });
      const data = await res.json();
      if (data.success) {
        setUpgradeMessage({ type: 'success', text: `Upgraded to ${data.newRank}! Burned ${data.pointsBurned.toLocaleString()} DAG Points.` });
        fetchRewardData(user.email);
      } else {
        setUpgradeMessage({ type: 'error', text: data.error || 'Upgrade failed' });
      }
    } catch (err) {
      console.error('Rank upgrade error:', err);
      setUpgradeMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setUpgrading(false);
      setTimeout(() => setUpgradeMessage(null), 5000);
    }
  };

  const REDEEM_CONFIG = {
    daggpt:  { ratio: 5,   label: 'DAGGPT Credits',    unit: 'Credit',  color: '#6366f1', light: '#eef2ff', border: '#c7d2fe', desc: 'Use credits on the DAGGPT AI platform' },
    dagcoin: { ratio: 500, label: 'DAGCHAIN Gas Coins', unit: 'Coin',    color: '#f59e0b', light: '#fffbeb', border: '#fde68a', desc: 'Native gas coin on the DAGCHAIN blockchain' },
  };

  const handleRedeem = async () => {
    if (!user?.email) return;
    const cfg = REDEEM_CONFIG[redeemType];
    const pointsCost = redeemAmount * cfg.ratio;
    if (pointsCost > rewardData.dagPoints) return;
    try {
      setRedeeming(true);
      setRedeemMessage(null);
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: user.email, redemption_type: redeemType, amount: redeemAmount }),
      });
      const data = await res.json();
      if (data.success) {
        setRedeemMessage({ type: 'success', text: data.message });
        fetchRewardData(user.email);
        setTimeout(() => { setShowRedeemModal(false); setRedeemMessage(null); setRedeemAmount(1); }, 2500);
      } else {
        setRedeemMessage({ type: 'error', text: data.error || 'Redemption failed' });
      }
    } catch (err) {
      setRedeemMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setRedeeming(false);
    }
  };

  const ranksList = [
    { name: 'INITIATOR', points: 700, color: '#6b7280' },
    { name: 'VANGUARD', points: 1500, color: '#10b981' },
    { name: 'GUARDIAN', points: 3200, color: '#3b82f6' },
    { name: 'STRIKER', points: 7000, color: '#8b5cf6' },
    { name: 'INVOKER', points: 10000, color: '#ec4899' },
    { name: 'COMMANDER', points: 15000, color: '#f59e0b' },
    { name: 'CHAMPION', points: 20000, color: '#ef4444' },
    { name: 'CONQUEROR', points: 30000, color: '#dc2626' },
    { name: 'PARAGON', points: 40000, color: '#7c3aed' },
    { name: 'MYTHIC', points: 50000, color: '#fbbf24' }
  ];

  const isLieutenant = rewardData.tier === 'DAG LIEUTENANT' || rewardData.tier === 'DAG_LIEUTENANT';

  const BentoCard = useCallback(({ children, span = '1', style = {}, hover = true, delay = 0 }) => (
    <div
      style={{
        gridColumn: `span ${span}`,
        background: '#fff',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.02)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transitionDelay: `${delay}ms`,
        ...style
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.02)';
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
    >{children}</div>
  ), [mounted]);

  const StatPill = ({ label, value, color = '#0f172a', sub }) => (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <p style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <p style={{ fontSize: '22px', fontWeight: '800', color, letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{sub}</p>}
    </div>
  );

  if (loading) {
    return (
      <div id="wrapper">
        <Header2 />
        <div className="main-content pt-0">
          <div className="page-inner" style={{ padding: "0" }}>
            <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
              <div style={{ width: "240px", flexShrink: 0, padding: "24px 16px", position: "sticky", top: "0", height: "100vh", overflowY: "auto", background: "#fff" }}>
                <DashboardNav2 />
              </div>
              <div style={{ flex: 1, padding: '32px 36px', background: '#f6f8fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Loading rewards...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer1 />
      </div>
    );
  }

  // Rank progression calculations
  const currentRankIndex = rewardData.currentRank === 'None' ? -1 : ranksList.findIndex(r => r.name === rewardData.currentRank);
  const nextRankIndex = currentRankIndex + 1;
  const nextRank = nextRankIndex < ranksList.length ? ranksList[nextRankIndex] : null;
  const currentRank = currentRankIndex >= 0 ? ranksList[currentRankIndex] : null;
  const burnCost = nextRank ? nextRank.points : 0;
  const canUpgrade = rewardData.dagPoints >= burnCost;
  const progressPercentage = nextRank
    ? (currentRank
        ? Math.min(100, Math.max(0, ((rewardData.dagPoints - currentRank.points) / (nextRank.points - currentRank.points)) * 100))
        : Math.min(100, Math.max(0, (rewardData.dagPoints / nextRank.points) * 100)))
    : 100;

  return (
    <div id="wrapper">
      <Header2 />
      <div className="main-content pt-0">
        <div className="page-inner" style={{ padding: "0" }}>
          <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
            <div style={{ width: "240px", flexShrink: 0, background: "#fff", padding: "32px 16px", position: "sticky", top: "0", height: "100vh", overflowY: "auto" }}>
              <DashboardNav2 />
            </div>
            <div style={{ flex: 1, padding: '32px 36px', background: '#f6f8fb', minHeight: '100vh' }}>

              {/* Header */}
              <div style={{ marginBottom: '28px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-8px)', transition: 'all 0.5s ease', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={22} color="#fff" />
                    </div>
                    My Rewards
                  </h1>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '8px 0 0 52px', fontWeight: '450' }}>
                    Track your DAG Points, ranks, and earnings
                  </p>
                </div>
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                  <button
                    onClick={() => setShowRedeemModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 10px rgba(99,102,241,0.3)', letterSpacing: '0.2px' }}
                  >
                    <ArrowUp size={15} />
                    Redeem DAG Points
                  </button>
                  {rewardData.tier !== 'DAG_LIEUTENANT' && rewardData.tier !== 'DAG LIEUTENANT' && (
                    <a
                      href="https://wa.me/message/DAGARMY"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #e0e7ff', background: '#fff', color: '#4f46e5', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textDecoration: 'none', letterSpacing: '0.2px', whiteSpace: 'nowrap', boxShadow: '0 1px 4px rgba(99,102,241,0.08)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#a5b4fc'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e0e7ff'; }}
                    >
                      <Crown size={15} />
                      Upgrade to DAG Lieutenant
                      <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '6px', background: '#eef2ff', color: '#6366f1' }}>$149</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Top Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>

                {/* DAG Points */}
                <BentoCard delay={50} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DAG Points</span>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>
                      {rewardData.dagPoints.toLocaleString()}
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Available balance</p>
                  </div>
                </BentoCard>

                {/* Current Rank */}
                <BentoCard delay={100} style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: 'none' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Rank</span>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: '800', color: currentRank?.color || '#fff', letterSpacing: '-0.5px', lineHeight: 1, margin: 0 }}>
                      {rewardData.currentRank === 'None' ? 'Starter' : rewardData.currentRank}
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
                      {rewardData.tier === 'DAG_LIEUTENANT' || rewardData.tier === 'DAG LIEUTENANT' ? 'DAG LIEUTENANT' : 'DAG SOLDIER'}
                    </p>
                  </div>
                </BentoCard>

                {/* USD Earned */}
                <BentoCard delay={150}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>USD Earned</span>
                    {rewardData.usdEarned >= 10 && (
                      <button
                        onClick={() => setShowWithdrawModal(true)}
                        style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', cursor: 'pointer', letterSpacing: '0.2px' }}
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>
                    ${rewardData.usdEarned.toFixed(2)}
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Commissions</p>
                  {/* Missing payment info nudge */}
                  {rewardData.usdEarned >= 10 && paymentInfo && !paymentInfo.bank_account_name && !paymentInfo.bep20_address && (
                    <div style={{ marginTop: '10px', padding: '8px 10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round"/></svg>
                      <span style={{ fontSize: '11px', color: '#92400e', fontWeight: '600' }}>No payment info saved. </span>
                      <a href="/student-setting" style={{ fontSize: '11px', color: '#d97706', fontWeight: '700', textDecoration: 'underline' }}>Add in Settings</a>
                    </div>
                  )}
                </BentoCard>
              </div>

              {/* ══ POINTS SUMMARY STRIP ══ */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Total DAG Points Earned',          value: rewardData.totalPointsEarned,   color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
                  { label: 'Total DAG Points Burned (Ranks)',  value: rewardData.totalPointsBurned,   color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
                  { label: 'Total DAG Points Redeemed',        value: rewardData.totalPointsRedeemed, color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '14px', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: s.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
                    <span style={{ fontSize: '22px', fontWeight: '900', color: s.color, letterSpacing: '-1px' }}>{(s.value || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* ══ INCENTIVE POOLS SECTION ══ */}
              {(() => {
                const pools = rewardData.incentivePools;
                if (!pools) return null;
                const POOL_META = [
                  {
                    key: 'discretionary',
                    title: 'Discretionary Incentive',
                    subtitle: 'Monthly pool — resets every month',
                    desc: 'Earn a share of the company revenue pool by hitting your monthly direct sales target.',
                    color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0', light: '#ecfdf5',
                    iconPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
                  },
                  {
                    key: 'lifestyle',
                    title: 'Lifestyle Bonus',
                    subtitle: 'Monthly pool — Car / Travel / Home',
                    desc: 'Qualify for the lifestyle allowance pool covering car, travel, and home expenses.',
                    color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', light: '#f5f3ff',
                    iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
                  },
                  {
                    key: 'executive',
                    title: 'Executive Performance Incentive',
                    subtitle: 'Quarterly pool — resets every quarter',
                    desc: 'Top performers who hit the quarterly sales target share the executive incentive pool.',
                    color: '#d97706', bg: '#fefce8', border: '#fde68a', light: '#fffbeb',
                    iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
                  },
                ];
                return (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#d97706,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                      </div>
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Incentive Pool Programs</h2>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Monthly &amp; quarterly revenue pools — qualify by hitting direct sales targets</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
                      {POOL_META.map(pm => {
                        const pool = pools[pm.key];
                        if (!pool) return null;
                        const pct = Math.min(100, pool.threshold > 0 ? (pool.currentSales / pool.threshold) * 100 : 0);
                        const qualified = pool.currentSales >= pool.threshold;
                        const remaining = Math.max(0, pool.threshold - pool.currentSales);
                        return (
                          <div key={pm.key} style={{ background: '#fff', borderRadius: '18px', border: `1.5px solid ${qualified ? pm.border : '#e2e8f0'}`, overflow: 'hidden', opacity: pool.enabled ? 1 : 0.55, transition: 'all 0.3s' }}>
                            {/* Card header */}
                            <div style={{ background: qualified ? pm.bg : '#f8fafc', padding: '18px 20px', borderBottom: `1px solid ${qualified ? pm.border : '#f1f5f9'}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: qualified ? pm.color : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={pm.iconPath}/></svg>
                                </div>
                                <div>
                                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>{pm.title}</div>
                                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{pm.subtitle}</div>
                                </div>
                              </div>
                              <div style={{ flexShrink: 0 }}>
                                {!pool.enabled ? (
                                  <span style={{ fontSize: '9px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: '#f1f5f9', color: '#94a3b8', textTransform: 'uppercase' }}>Disabled</span>
                                ) : qualified ? (
                                  <span style={{ fontSize: '9px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: pm.bg, color: pm.color, border: `1px solid ${pm.border}`, textTransform: 'uppercase' }}>Qualified</span>
                                ) : (
                                  <span style={{ fontSize: '9px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', textTransform: 'uppercase' }}>In Progress</span>
                                )}
                              </div>
                            </div>
                            {/* Progress */}
                            <div style={{ padding: '16px 20px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                  {pool.period === 'quarterly' ? 'This Quarter' : 'This Month'}
                                </span>
                                <span style={{ fontSize: '12px', fontWeight: '800', color: qualified ? pm.color : '#0f172a' }}>
                                  ${pool.currentSales.toFixed(0)} <span style={{ fontWeight: '500', color: '#94a3b8', fontSize: '11px' }}>/ ${pool.threshold.toLocaleString()}</span>
                                </span>
                              </div>
                              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                                <div style={{ height: '100%', borderRadius: '3px', background: qualified ? pm.color : `linear-gradient(90deg,${pm.color}80,${pm.color})`, width: `${pct}%`, transition: 'width 1s ease' }} />
                              </div>
                              {qualified ? (
                                <div style={{ fontSize: '12px', color: pm.color, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                  You qualify for the {pool.poolPct}% revenue pool this {pool.period === 'quarterly' ? 'quarter' : 'month'}!
                                </div>
                              ) : (
                                <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                                  <strong style={{ color: '#0f172a' }}>${remaining.toFixed(0)} more</strong> in direct sales to qualify for the <strong style={{ color: pm.color }}>{pool.poolPct}%</strong> revenue pool
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Info strip */}
                    <div style={{ marginTop: '10px', padding: '12px 18px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                      <strong style={{ color: '#0f172a' }}>How it works:</strong> A percentage of company net revenue is pooled each period. Everyone who meets the direct sales threshold shares the pool equally. Sales targets reset fresh each month (or quarter for Executive).
                    </div>
                  </div>
                );
              })()}

              {/* Rank Progression Section */}
              <BentoCard delay={300} hover={false} style={{ marginBottom: '20px', padding: '28px 32px' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Rank Progression</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0', fontWeight: '450' }}>Burn DAG Points to climb the ranks</p>
                </div>

                {!nextRank ? (
                  /* MYTHIC achieved */
                  <div style={{
                    padding: '32px', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%)',
                    borderRadius: '16px', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'relative' }}>
                      <Crown size={48} style={{ margin: '0 auto 12px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }} />
                      <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.5px' }}>MYTHIC RANK ACHIEVED</h3>
                      <p style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500', margin: 0 }}>You've reached the highest rank. Legendary status unlocked.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* ── Rank journey: current → next → mystery ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>

                      {/* Left: current rank label */}
                      <div style={{ flexShrink: 0, minWidth: '110px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Current Rank</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentRank?.color || '#cbd5e1', flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', fontWeight: '800', color: currentRank?.color || '#94a3b8', letterSpacing: '0.3px' }}>
                            {currentRank ? currentRank.name : 'STARTER'}
                          </span>
                        </div>
                      </div>

                      {/* Middle: current node → progress → next node → dots → mystery */}
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>

                        {/* Current node */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: currentRank ? currentRank.color : '#cbd5e1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: currentRank ? `0 0 0 4px ${currentRank.color}20, 0 2px 10px ${currentRank.color}40` : 'none',
                            border: `3px solid ${currentRank?.color || '#e2e8f0'}`,
                          }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                          <span style={{ fontSize: '9px', fontWeight: '700', color: currentRank?.color || '#94a3b8', whiteSpace: 'nowrap' }}>
                            {currentRank ? currentRank.name : 'STARTER'}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div style={{ flex: 1, padding: '0 12px', marginBottom: '16px' }}>
                          <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', borderRadius: '2px',
                              background: `linear-gradient(90deg, ${currentRank?.color || '#6366f1'}, ${nextRank.color})`,
                              width: `${progressPercentage}%`,
                              transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)'
                            }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>{rewardData.dagPoints.toLocaleString()} pts</span>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: nextRank.color }}>{burnCost.toLocaleString()} needed</span>
                          </div>
                        </div>

                        {/* Next rank node */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <div style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            background: canUpgrade ? nextRank.color : '#fff',
                            border: canUpgrade ? `3px solid ${nextRank.color}` : `2px dashed ${nextRank.color}70`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: canUpgrade ? `0 0 0 3px ${nextRank.color}20` : 'none',
                            transition: 'all 0.3s'
                          }}>
                            {canUpgrade
                              ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: nextRank.color }} />
                            }
                          </div>
                          <span style={{ fontSize: '9px', fontWeight: '700', color: nextRank.color, whiteSpace: 'nowrap' }}>{nextRank.name}</span>
                        </div>

                        {/* Fading dots */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', marginBottom: '16px' }}>
                          {[1, 0.6, 0.3].map((op, d) => (
                            <div key={d} style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d1d5db', opacity: op }} />
                          ))}
                        </div>

                        {/* Mystery node */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <div style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            background: '#f8fafc', border: '2px solid #e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                          </div>
                          <span style={{ fontSize: '9px', fontWeight: '700', color: '#cbd5e1', whiteSpace: 'nowrap', letterSpacing: '1px' }}>???</span>
                        </div>

                      </div>

                      {/* Right: upgrade button or pts needed */}
                      <div style={{ flexShrink: 0 }}>
                        {canUpgrade ? (
                          <button
                            onClick={() => handleRankUpgrade(nextRank.name, burnCost)}
                            disabled={upgrading}
                            style={{
                              padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '700',
                              background: upgrading ? '#94a3b8' : nextRank.color, color: '#fff', border: 'none',
                              cursor: upgrading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                              boxShadow: upgrading ? 'none' : `0 4px 14px ${nextRank.color}40`,
                              display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s'
                            }}
                          >
                            <Flame size={14} />
                            {upgrading ? 'Burning...' : 'Upgrade Now'}
                          </button>
                        ) : (
                          <div style={{
                            padding: '10px 16px', borderRadius: '10px', fontSize: '11px', fontWeight: '600',
                            background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
                            whiteSpace: 'nowrap', textAlign: 'center', lineHeight: '1.4'
                          }}>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: '#ef4444' }}>{(burnCost - rewardData.dagPoints).toLocaleString()}</div>
                            <div>pts needed</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upgrade message */}
                    {upgradeMessage && (
                      <div style={{
                        padding: '12px 18px', borderRadius: '10px',
                        background: upgradeMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${upgradeMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                        color: upgradeMessage.type === 'success' ? '#166534' : '#991b1b',
                        fontSize: '13px', fontWeight: '600', textAlign: 'center'
                      }}>
                        {upgradeMessage.text}
                      </div>
                    )}
                  </>
                )}
              </BentoCard>


              {/* ══ TRANSACTION HISTORY ══ */}
              <BentoCard delay={400} hover={false} style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Points Transaction History</h3>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>Last 30 transactions</span>
                </div>

                {rewardData.txHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1.5" style={{ margin: '0 auto 10px', display: 'block' }}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                    <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>No transactions yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {/* Table header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 120px 100px 140px', padding: '8px 14px', background: '#f8fafc', borderRadius: '8px', marginBottom: '4px' }}>
                      {['Txn ID', 'Description', 'Type', 'Points', 'Date'].map((h, i) => (
                        <span key={h} style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: i >= 3 ? 'right' : 'left' }}>{h}</span>
                      ))}
                    </div>
                    {rewardData.txHistory.map((tx, idx) => {
                      const isSale     = tx.transaction_type === 'sale_points';
                      const isBurned   = tx.points < 0 && tx.transaction_type === 'rank_burn';
                      const isEarned   = tx.points > 0 && !isSale;
                      const typeColor  = isSale ? '#0d9488' : isEarned ? '#10b981' : isBurned ? '#ef4444' : '#6366f1';
                      const typeBg     = isSale ? '#f0fdfa' : isEarned ? '#ecfdf5' : isBurned ? '#fef2f2' : '#eef2ff';
                      const typeBorder = isSale ? '#99f6e4' : isEarned ? '#a7f3d0' : isBurned ? '#fecaca' : '#c7d2fe';
                      const typeLabel  = isSale ? 'Sale' : isEarned ? 'Earned' : isBurned ? 'Burned' : 'Redeemed';
                      const dateStr    = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      const txnId      = tx.transaction_id || '—';
                      return (
                        <div
                          key={tx.id || idx}
                          style={{ display: 'grid', gridTemplateColumns: '200px 1fr 120px 100px 140px', padding: '11px 14px', alignItems: 'center', borderBottom: idx < rewardData.txHistory.length - 1 ? '1px solid #f1f5f9' : 'none', borderRadius: '6px' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {/* Transaction ID with copy */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', color: '#475569', letterSpacing: '0.3px' }}>{txnId}</span>
                            {txnId !== '—' && (
                              <button
                                onClick={() => navigator.clipboard.writeText(txnId)}
                                title="Copy Transaction ID"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94a3b8', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                                onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                              >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                              </button>
                            )}
                          </div>
                          <span style={{ fontSize: '13px', color: '#334155', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px' }}>{tx.description || tx.transaction_type}</span>
                          <div>
                            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: typeBg, color: typeColor, border: `1px solid ${typeBorder}`, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{typeLabel}</span>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: typeColor, textAlign: 'right', letterSpacing: '-0.3px' }}>
                            {(isEarned || isSale) ? '+' : '−'}{Math.abs(tx.points).toLocaleString()}
                          </span>
                          <span style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'right', fontWeight: '500' }}>{dateStr}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </BentoCard>

            </div>
          </div>
        </div>
      </div>
      {/* ══ BURN DAG POINTS MODAL ══ */}
      {showBurnModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowBurnModal(false)}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={18} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Burn DAG Points</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Upgrade your rank by burning points</p>
                </div>
              </div>
              <button onClick={() => setShowBurnModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {/* Available points */}
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#991b1b' }}>Available DAG Points</span>
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#dc2626', letterSpacing: '-0.5px' }}>{rewardData.dagPoints.toLocaleString()}</span>
              </div>

              {/* Rank progression list */}
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>Rank Burn Requirements</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {ranksList.map((rank, i) => {
                  const isAchieved = currentRankIndex >= i;
                  const isNext = nextRankIndex === i;
                  const canBurn = rewardData.dagPoints >= rank.points && !isAchieved;
                  return (
                    <div key={rank.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: isAchieved ? `${rank.color}10` : isNext ? `${rank.color}08` : '#f8fafc', border: isNext ? `1.5px solid ${rank.color}` : isAchieved ? `1px solid ${rank.color}30` : '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isAchieved
                          ? <Check size={14} color={rank.color} strokeWidth={3} />
                          : <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: rank.color, opacity: isNext ? 1 : 0.3 }} />
                        }
                        <span style={{ fontSize: '13px', fontWeight: '700', color: isAchieved ? rank.color : isNext ? rank.color : '#94a3b8' }}>{rank.name}</span>
                        {isNext && <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 7px', borderRadius: '100px', background: rank.color, color: '#fff' }}>NEXT</span>}
                        {isAchieved && <span style={{ fontSize: '9px', fontWeight: '700', color: rank.color, opacity: 0.7 }}>Achieved</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: isAchieved ? rank.color : '#64748b' }}>{rank.points.toLocaleString()} pts</span>
                        {isNext && (
                          <button
                            onClick={() => { handleRankUpgrade(rank.name, rank.points); setShowBurnModal(false); }}
                            disabled={!canBurn || upgrading}
                            style={{ padding: '5px 12px', borderRadius: '7px', border: 'none', background: canBurn ? `linear-gradient(135deg,${rank.color},${rank.color}cc)` : '#e2e8f0', color: canBurn ? '#fff' : '#94a3b8', fontSize: '11px', fontWeight: '700', cursor: canBurn ? 'pointer' : 'not-allowed' }}
                          >
                            {canBurn ? 'Burn & Upgrade' : `Need ${(rank.points - rewardData.dagPoints).toLocaleString()} more`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ REDEEM DAG POINTS MODAL ══ */}
      {showRedeemModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => { setShowRedeemModal(false); setRedeemMessage(null); setRedeemAmount(1); }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUp size={18} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Redeem DAG Points</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Exchange points for platform rewards</p>
                </div>
              </div>
              <button onClick={() => { setShowRedeemModal(false); setRedeemMessage(null); setRedeemAmount(1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {/* Available points */}
              <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#3730a3' }}>Available DAG Points</span>
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#4f46e5', letterSpacing: '-0.5px' }}>{rewardData.dagPoints.toLocaleString()}</span>
              </div>

              {/* Redemption type selector */}
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Select Redemption Type</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {Object.entries(REDEEM_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => { setRedeemType(key); setRedeemAmount(1); }}
                    style={{ padding: '14px 16px', borderRadius: '12px', border: redeemType === key ? `2px solid ${cfg.color}` : '2px solid #e2e8f0', background: redeemType === key ? cfg.light : '#f8fafc', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '800', color: redeemType === key ? cfg.color : '#0f172a', marginBottom: '4px' }}>{cfg.label}</div>
                    <div style={{ fontSize: '11px', color: redeemType === key ? cfg.color : '#94a3b8', fontWeight: '500' }}>{cfg.desc}</div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: redeemType === key ? cfg.color : '#64748b', marginTop: '8px', padding: '3px 8px', borderRadius: '6px', background: redeemType === key ? `${cfg.color}18` : '#f1f5f9', display: 'inline-block' }}>
                      {cfg.ratio} pts = 1 {cfg.unit}
                    </div>
                  </button>
                ))}
              </div>

              {/* Amount input */}
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
                      <input
                        type="number"
                        min={1}
                        max={maxAmount}
                        value={redeemAmount}
                        onChange={e => setRedeemAmount(Math.max(1, Math.min(maxAmount, parseInt(e.target.value) || 1)))}
                        style={{ flex: 1, textAlign: 'center', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '18px', fontWeight: '800', color: '#0f172a', outline: 'none' }}
                      />
                      <button onClick={() => setRedeemAmount(a => Math.min(maxAmount, a + 1))} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '18px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>+</button>
                    </div>

                    {/* Cost summary */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{redeemAmount} {cfg.unit}{redeemAmount !== 1 ? 's' : ''}</span> costs
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: canRedeem ? cfg.color : '#ef4444', letterSpacing: '-0.5px' }}>{pointsCost.toLocaleString()}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>pts</span>
                        {!canRedeem && redeemAmount > 0 && <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700' }}>(Need {(pointsCost - rewardData.dagPoints).toLocaleString()} more)</span>}
                      </div>
                    </div>

                    {/* Feedback message */}
                    {redeemMessage && (
                      <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: redeemMessage.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${redeemMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: redeemMessage.type === 'success' ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: '600' }}>
                        {redeemMessage.text}
                      </div>
                    )}

                    {/* Confirm button */}
                    <button
                      onClick={handleRedeem}
                      disabled={!canRedeem || redeeming}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: canRedeem && !redeeming ? `linear-gradient(135deg,${cfg.color},${cfg.color}cc)` : '#e2e8f0', color: canRedeem && !redeeming ? '#fff' : '#94a3b8', fontSize: '14px', fontWeight: '700', cursor: canRedeem && !redeeming ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: canRedeem && !redeeming ? `0 4px 14px ${cfg.color}35` : 'none' }}
                    >
                      {redeeming ? 'Processing…' : `Redeem ${redeemAmount} ${cfg.unit}${redeemAmount !== 1 ? 's' : ''} for ${pointsCost.toLocaleString()} pts`}
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ══ WITHDRAWAL MODAL ══ */}
      {showWithdrawModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => { setShowWithdrawModal(false); setWithdrawMessage(null); }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={18} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Request Withdrawal</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Withdraw your USD rewards</p>
                </div>
              </div>
              <button onClick={() => { setShowWithdrawModal(false); setWithdrawMessage(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {/* Amount */}
              <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#065f46' }}>Withdrawal Amount</span>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#10b981', letterSpacing: '-0.5px' }}>${rewardData.usdEarned.toFixed(2)}</span>
              </div>

              {/* Reward Month */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Reward Month</label>
                <input
                  type="month"
                  value={withdrawMonth}
                  onChange={e => setWithdrawMonth(e.target.value)}
                  max={(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`; })()}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#10b981'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Payout method selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Payout Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {/* Bank option */}
                  <button
                    type="button"
                    onClick={() => setWithdrawPayoutMethod('bank')}
                    style={{
                      padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                      border: withdrawPayoutMethod === 'bank' ? '2px solid #6366f1' : '2px solid #e2e8f0',
                      background: withdrawPayoutMethod === 'bank' ? '#f5f3ff' : '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={withdrawPayoutMethod === 'bank' ? '#6366f1' : '#94a3b8'} strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: withdrawPayoutMethod === 'bank' ? '#3730a3' : '#475569' }}>Bank Transfer</span>
                    </div>
                    {paymentInfo?.bank_account_name ? (
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{paymentInfo.bank_account_name}<br/>{paymentInfo.bank_name}</div>
                    ) : (
                      <div style={{ fontSize: '11px', color: '#f59e0b' }}>No bank details saved</div>
                    )}
                    {withdrawPayoutMethod === 'bank' && (() => {
                      const [y, m] = withdrawMonth.split('-').map(Number);
                      const pd = new Date(y, m, 10);
                      return <div style={{ fontSize: '10px', color: '#6366f1', fontWeight: '600', marginTop: '4px' }}>Credit on {pd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>;
                    })()}
                  </button>

                  {/* Crypto option */}
                  <button
                    type="button"
                    onClick={() => setWithdrawPayoutMethod('crypto')}
                    style={{
                      padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                      border: withdrawPayoutMethod === 'crypto' ? '2px solid #10b981' : '2px solid #e2e8f0',
                      background: withdrawPayoutMethod === 'crypto' ? '#f0fdf4' : '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={withdrawPayoutMethod === 'crypto' ? '#10b981' : '#94a3b8'} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 8h5a2 2 0 0 1 0 4H9v4h5a2 2 0 0 0 0-4"/><line x1="9" y1="12" x2="14" y2="12"/></svg>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: withdrawPayoutMethod === 'crypto' ? '#065f46' : '#475569' }}>USDT (BEP20)</span>
                    </div>
                    {paymentInfo?.bep20_address ? (
                      <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{paymentInfo.bep20_address}</div>
                    ) : (
                      <div style={{ fontSize: '11px', color: '#f59e0b' }}>No wallet address saved</div>
                    )}
                    {withdrawPayoutMethod === 'crypto' && <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '600', marginTop: '4px' }}>Within 24hrs of approval</div>}
                  </button>
                </div>

                {/* Warning if selected method has no details */}
                {withdrawPayoutMethod === 'bank' && !paymentInfo?.bank_account_name && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#d97706', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Add bank details in <a href="/student-setting" style={{ color: '#d97706' }}>Settings</a> first
                  </div>
                )}
                {withdrawPayoutMethod === 'crypto' && !paymentInfo?.bep20_address && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#d97706', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Add BEP20 wallet in <a href="/student-setting" style={{ color: '#d97706' }}>Settings</a> first
                  </div>
                )}
              </div>

              {/* No payment info warning — only show if BOTH methods are missing */}
              {(!paymentInfo || (!paymentInfo.bank_account_name && !paymentInfo.bep20_address)) && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '1px' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round"/></svg>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#92400e', margin: '0 0 4px' }}>No payment info saved</p>
                    <p style={{ fontSize: '12px', color: '#92400e', margin: '0 0 8px' }}>You need to add your bank or BEP20 wallet details before requesting a withdrawal.</p>
                    <a href="/student-setting" style={{ fontSize: '12px', fontWeight: '700', color: '#d97706', textDecoration: 'underline' }}>Go to Settings to add payment info</a>
                  </div>
                </div>
              )}

              {/* Existing requests for this month */}
              {withdrawHistory.filter(r => r.reward_month === withdrawMonth).length > 0 && (
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#0369a1', margin: '0 0 4px' }}>Request already submitted for {withdrawMonth}</p>
                  <p style={{ fontSize: '12px', color: '#0369a1', margin: 0 }}>Status: <strong>{withdrawHistory.find(r => r.reward_month === withdrawMonth)?.status}</strong></p>
                </div>
              )}

              {/* Message */}
              {withdrawMessage && (
                <div style={{ padding: '12px 16px', background: withdrawMessage.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${withdrawMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`, borderRadius: '10px', marginBottom: '16px', fontSize: '13px', color: withdrawMessage.type === 'success' ? '#065f46' : '#dc2626', fontWeight: '600' }}>
                  {withdrawMessage.text}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleWithdraw}
                disabled={(() => {
                  const noDetails = withdrawPayoutMethod === 'bank' ? !paymentInfo?.bank_account_name : !paymentInfo?.bep20_address;
                  return withdrawing || noDetails || withdrawHistory.some(r => r.reward_month === withdrawMonth);
                })()}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: (() => {
                    const noDetails = withdrawPayoutMethod === 'bank' ? !paymentInfo?.bank_account_name : !paymentInfo?.bep20_address;
                    return (withdrawing || noDetails || withdrawHistory.some(r => r.reward_month === withdrawMonth)) ? '#e2e8f0' : 'linear-gradient(135deg,#10b981,#059669)';
                  })(),
                  color: (() => {
                    const noDetails = withdrawPayoutMethod === 'bank' ? !paymentInfo?.bank_account_name : !paymentInfo?.bep20_address;
                    return (withdrawing || noDetails || withdrawHistory.some(r => r.reward_month === withdrawMonth)) ? '#94a3b8' : '#fff';
                  })(),
                  fontSize: '14px', fontWeight: '700',
                  cursor: (() => {
                    const noDetails = withdrawPayoutMethod === 'bank' ? !paymentInfo?.bank_account_name : !paymentInfo?.bep20_address;
                    return (withdrawing || noDetails || withdrawHistory.some(r => r.reward_month === withdrawMonth)) ? 'not-allowed' : 'pointer';
                  })(),
                  transition: 'all 0.2s',
                }}
              >
                {withdrawing ? 'Submitting...' : 'Submit Withdrawal Request'}
              </button>

              {/* Withdrawal history */}
              {withdrawHistory.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Past Requests</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                    {withdrawHistory.map(r => {
                      const statusColor = { pending: '#f59e0b', approved: '#3b82f6', processing: '#8b5cf6', paid: '#10b981', rejected: '#ef4444' }[r.status] || '#94a3b8';
                      return (
                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{r.reward_month}</span>
                            <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>{r.payout_method === 'crypto' ? 'USDT' : 'Bank'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981' }}>${parseFloat(r.amount_usd).toFixed(2)}</span>
                            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: statusColor + '18', color: statusColor, textTransform: 'uppercase' }}>{r.status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer1 />
    </div>
  );
}
