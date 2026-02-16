"use client";
import React, { useState, useEffect, useCallback } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { 
  Award, Users, DollarSign, Copy, Check, 
  ChevronRight, Trophy, Zap, Crown, ArrowUp, Flame, Shield, Lock
} from "lucide-react";

export default function StudentRewardsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState(null);
  const [rewardData, setRewardData] = useState({
    currentRank: 'None',
    dagPoints: 0,
    totalReferrals: 0,
    usdEarned: 0,
    referralCode: '',
    tier: 'DAG SOLDIER',
    rankingEnabledForSoldier: false
  });

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    const userStr = localStorage.getItem('dagarmy_user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchRewardData(userData.email);
    } else {
      setLoading(false);
    }
  }, []);

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

  const copyReferralCode = () => {
    const referralLink = `https://dagarmy.network/signup?ref=${rewardData.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <div style={{ marginBottom: '28px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-8px)', transition: 'all 0.5s ease' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={22} color="#fff" />
                  </div>
                  My Rewards
                </h1>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: '8px 0 0 52px', fontWeight: '450' }}>
                  Track your DAG Points, referrals, and earnings
                </p>
              </div>

              {/* Top Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>

                {/* DAG Points */}
                <BentoCard delay={50} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={18} color="#fff" />
                      </div>
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
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: currentRank ? `${currentRank.color}25` : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Crown size={18} color={currentRank?.color || '#94a3b8'} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Rank</span>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: '800', color: currentRank?.color || '#fff', letterSpacing: '-0.5px', lineHeight: 1, margin: 0 }}>
                      {rewardData.currentRank === 'None' ? 'Unranked' : rewardData.currentRank}
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
                      {rewardData.tier === 'DAG_LIEUTENANT' || rewardData.tier === 'DAG LIEUTENANT' ? 'DAG LIEUTENANT' : 'DAG SOLDIER'}
                    </p>
                  </div>
                </BentoCard>

                {/* Referrals */}
                <BentoCard delay={150}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={18} color="#10b981" />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Referrals</span>
                  </div>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>
                    {rewardData.totalReferrals}
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Team members</p>
                </BentoCard>

                {/* USD Earned */}
                <BentoCard delay={200}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <DollarSign size={18} color="#ec4899" />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>USD Earned</span>
                  </div>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>
                    ${rewardData.usdEarned.toFixed(2)}
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Commissions</p>
                </BentoCard>
              </div>

              {/* Referral Code Bar */}
              <BentoCard delay={250} style={{ marginBottom: '20px', padding: '20px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={20} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Your Referral Code</p>
                    <p style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace', letterSpacing: '3px', margin: 0 }}>
                      {rewardData.referralCode}
                    </p>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    style={{
                      background: copied ? '#10b981' : '#6366f1',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 24px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      letterSpacing: '0.3px'
                    }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </BentoCard>

              {/* Rank Progression Section */}
              <BentoCard delay={300} hover={false} style={{ marginBottom: '20px', padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trophy size={20} color="#fff" />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Rank Progression</h2>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0', fontWeight: '450' }}>Burn DAG Points to climb the ranks</p>
                    </div>
                  </div>
                  {!isLieutenant && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: '#fef3c7', border: '1px solid #fde68a' }}>
                      <Lock size={12} color="#d97706" />
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#d97706' }}>LIEUTENANT ONLY</span>
                    </div>
                  )}
                </div>

                {!nextRank ? (
                  /* MYTHIC achieved */
                  <div style={{
                    padding: '40px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'relative' }}>
                      <Crown size={56} style={{ margin: '0 auto 16px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }} />
                      <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>MYTHIC RANK ACHIEVED</h3>
                      <p style={{ fontSize: '15px', opacity: 0.9, fontWeight: '500' }}>You've reached the highest rank. Legendary status unlocked.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Rank journey visual */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '24px', padding: '0 4px' }}>
                      {/* Current rank node */}
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{
                          width: '52px', height: '52px', borderRadius: '16px',
                          background: currentRank ? `linear-gradient(135deg, ${currentRank.color}, ${currentRank.color}cc)` : 'linear-gradient(135deg, #cbd5e1, #94a3b8)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: currentRank ? `0 4px 14px ${currentRank.color}40` : 'none',
                          margin: '0 auto 8px'
                        }}>
                          <Shield size={22} color="#fff" />
                        </div>
                        <p style={{ fontSize: '11px', fontWeight: '700', color: currentRank?.color || '#94a3b8', margin: 0 }}>
                          {currentRank ? currentRank.name : 'UNRANKED'}
                        </p>
                      </div>

                      {/* Progress connector */}
                      <div style={{ flex: 1, padding: '0 16px', marginBottom: '20px' }}>
                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                          <div style={{
                            width: `${progressPercentage}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${currentRank?.color || '#94a3b8'}, ${nextRank.color})`,
                            borderRadius: '3px',
                            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative'
                          }}>
                            {progressPercentage > 5 && (
                              <div style={{
                                position: 'absolute', right: '-4px', top: '-5px',
                                width: '16px', height: '16px', borderRadius: '50%',
                                background: '#fff', border: `3px solid ${nextRank.color}`,
                                boxShadow: `0 0 0 3px ${nextRank.color}20`
                              }} />
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>0%</span>
                          <span style={{ fontSize: '10px', color: nextRank.color, fontWeight: '700' }}>{progressPercentage.toFixed(0)}%</span>
                          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>100%</span>
                        </div>
                      </div>

                      {/* Next rank node */}
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{
                          width: '52px', height: '52px', borderRadius: '16px',
                          background: canUpgrade ? `linear-gradient(135deg, ${nextRank.color}, ${nextRank.color}cc)` : '#f1f5f9',
                          border: canUpgrade ? 'none' : `2px dashed ${nextRank.color}60`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: canUpgrade ? `0 4px 14px ${nextRank.color}40` : 'none',
                          margin: '0 auto 8px',
                          transition: 'all 0.3s ease'
                        }}>
                          <Crown size={22} color={canUpgrade ? '#fff' : nextRank.color} />
                        </div>
                        <p style={{ fontSize: '11px', fontWeight: '700', color: nextRank.color, margin: 0 }}>
                          {nextRank.name}
                        </p>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '1px',
                      background: '#f8fafc', borderRadius: '14px', overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.05)', marginBottom: '20px'
                    }}>
                      <div style={{ flex: 1, padding: '18px 16px', textAlign: 'center', background: '#fff' }}>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Your Points</p>
                        <p style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>{rewardData.dagPoints.toLocaleString()}</p>
                      </div>
                      <div style={{ flex: 1, padding: '18px 16px', textAlign: 'center', background: '#fff' }}>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Burn Cost</p>
                        <p style={{ fontSize: '20px', fontWeight: '800', color: '#f59e0b', letterSpacing: '-0.5px', margin: 0 }}>{burnCost.toLocaleString()}</p>
                      </div>
                      <div style={{ flex: 1, padding: '18px 16px', textAlign: 'center', background: '#fff' }}>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                          {canUpgrade ? 'Status' : 'Deficit'}
                        </p>
                        <p style={{ fontSize: '20px', fontWeight: '800', color: canUpgrade ? '#10b981' : '#ef4444', letterSpacing: '-0.5px', margin: 0 }}>
                          {canUpgrade ? 'Ready' : (burnCost - rewardData.dagPoints).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Action area */}
                    {isLieutenant ? (
                      canUpgrade ? (
                        <button
                          onClick={() => handleRankUpgrade(nextRank.name, burnCost)}
                          disabled={upgrading}
                          style={{
                            width: '100%',
                            padding: '16px 24px',
                            borderRadius: '14px',
                            background: upgrading ? '#94a3b8' : `linear-gradient(135deg, ${nextRank.color}, ${nextRank.color}dd)`,
                            color: '#fff',
                            border: 'none',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: upgrading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease',
                            boxShadow: upgrading ? 'none' : `0 4px 14px ${nextRank.color}40`,
                            letterSpacing: '0.3px'
                          }}
                        >
                          <Flame size={18} />
                          {upgrading ? 'Burning Points...' : `Burn ${burnCost.toLocaleString()} Points & Upgrade to ${nextRank.name}`}
                        </button>
                      ) : (
                        <div style={{
                          width: '100%',
                          padding: '16px 24px',
                          borderRadius: '14px',
                          background: '#f8fafc',
                          border: '1px solid rgba(0,0,0,0.06)',
                          textAlign: 'center'
                        }}>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', margin: 0 }}>
                            Earn {(burnCost - rewardData.dagPoints).toLocaleString()} more points to unlock {nextRank.name}
                          </p>
                        </div>
                      )
                    ) : (
                      <div style={{
                        width: '100%',
                        padding: '20px 24px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                        border: '1px solid #fde68a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Lock size={18} color="#d97706" />
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: '#92400e', margin: '0 0 2px' }}>Upgrade to DAG LIEUTENANT</p>
                            <p style={{ fontSize: '12px', color: '#a16207', margin: 0 }}>Unlock rank burns and higher commission rates</p>
                          </div>
                        </div>
                        <a href="/register?upgrade=lieutenant" style={{
                          padding: '10px 22px',
                          borderRadius: '10px',
                          background: '#f59e0b',
                          color: '#fff',
                          fontSize: '13px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(245,158,11,0.3)'
                        }}>
                          <ArrowUp size={14} />
                          Upgrade
                        </a>
                      </div>
                    )}

                    {/* Upgrade message */}
                    {upgradeMessage && (
                      <div style={{
                        marginTop: '16px',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        background: upgradeMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${upgradeMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                        color: upgradeMessage.type === 'success' ? '#166534' : '#991b1b',
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        {upgradeMessage.text}
                      </div>
                    )}
                  </>
                )}
              </BentoCard>

              {/* All Ranks Overview */}
              <BentoCard delay={350} hover={false} style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={18} color="#475569" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>All Ranks</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ranksList.map((rank, i) => {
                    const isAchieved = currentRankIndex >= i;
                    const isCurrent = currentRankIndex === i;
                    const isNext = nextRankIndex === i;
                    return (
                      <div key={rank.name} style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        background: isAchieved ? `${rank.color}15` : isNext ? `${rank.color}08` : '#f8fafc',
                        border: isCurrent ? `2px solid ${rank.color}` : isNext ? `1px dashed ${rank.color}60` : '1px solid rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}>
                        {isAchieved && <Check size={12} color={rank.color} strokeWidth={3} />}
                        <span style={{
                          fontSize: '11px',
                          fontWeight: isAchieved || isNext ? '700' : '500',
                          color: isAchieved ? rank.color : isNext ? rank.color : '#94a3b8',
                          letterSpacing: '0.3px'
                        }}>
                          {rank.name}
                        </span>
                        <span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '500' }}>
                          {rank.points.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </BentoCard>

            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
}
