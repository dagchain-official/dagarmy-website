"use client";
import React, { useState, useEffect } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { 
  Award, TrendingUp, Users, DollarSign, Gift, Copy, Check, 
  ChevronRight, Trophy, Zap, Crown, Star, ArrowUp
} from "lucide-react";

export default function StudentRewardsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [rewardData, setRewardData] = useState({
    currentRank: 'None',
    dagPoints: 0,
    totalReferrals: 0,
    usdEarned: 0,
    referralCode: '',
    tier: 'DAG SOLDIER'
  });

  useEffect(() => {
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

  if (loading) {
    return (
      <div id="wrapper">
        <Header2 />
        <div className="main-content pt-0">
          <div className="page-inner" style={{ padding: "0" }}>
            <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
              <div style={{ 
                width: "240px", 
                flexShrink: 0,
                background: "#1a1f36",
                padding: "32px 16px",
                position: "sticky",
                top: "0",
                height: "100vh",
                overflowY: "auto"
              }}>
                <DashboardNav2 />
              </div>
              <div style={{ flex: 1, padding: "40px", background: "#f9fafb", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <Award size={48} style={{ color: '#6b7280', margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '16px', color: '#6b7280' }}>Loading your rewards...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer1 />
      </div>
    );
  }

  return (
    <div id="wrapper">
      <Header2 />
      <div className="main-content pt-0">
        <div className="page-inner" style={{ padding: "0" }}>
          <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
            <div style={{ 
              width: "240px", 
              flexShrink: 0,
              background: "#1a1f36",
              padding: "32px 16px",
              position: "sticky",
              top: "0",
              height: "100vh",
              overflowY: "auto"
            }}>
              <DashboardNav2 />
            </div>
            <div style={{ flex: 1, padding: "40px", background: "#f9fafb" }}>
              {/* Header */}
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#111827',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Award size={36} style={{ color: '#6366f1' }} />
                  My Rewards
                </h1>
                <p style={{ fontSize: '16px', color: '#6b7280' }}>
                  Track your DAG Points, referrals, and earnings
                </p>
              </div>

              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                {/* DAG Points Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Zap size={24} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>DAG Points</p>
                      <p style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>{rewardData.dagPoints.toLocaleString()}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', opacity: 0.8 }}>Available for rank upgrades</p>
                </div>

                {/* Current Rank Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Crown size={24} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Current Rank</p>
                      <p style={{ fontSize: '28px', fontWeight: '700', lineHeight: '1' }}>{rewardData.currentRank}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', opacity: 0.8 }}>{rewardData.tier}</p>
                </div>

                {/* Total Referrals Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Users size={24} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Total Referrals</p>
                      <p style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>{rewardData.totalReferrals}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', opacity: 0.8 }}>Active team members</p>
                </div>

                {/* USD Earned Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 6px rgba(236, 72, 153, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>USD Earned</p>
                      <p style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>${rewardData.usdEarned.toFixed(2)}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', opacity: 0.8 }}>From sales commissions</p>
                </div>
              </div>

              {/* Referral Code Section */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <Gift size={24} style={{ color: '#6366f1' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                    Your Referral Code
                  </h2>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                  Share your unique referral link and earn rewards when your friends join DAGARMY
                </p>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Referral Link</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', wordBreak: 'break-all' }}>
                      https://dagarmy.network/signup?ref={rewardData.referralCode}
                    </p>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: copied ? '#10b981' : '#6366f1',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Rank Progression */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <Trophy size={24} style={{ color: '#f59e0b' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                    Rank Progression
                  </h2>
                </div>
                {(() => {
                  // Find current rank index
                  const currentRankIndex = rewardData.currentRank === 'None' 
                    ? -1 
                    : ranksList.findIndex(r => r.name === rewardData.currentRank);
                  
                  const nextRankIndex = currentRankIndex + 1;
                  const nextRank = nextRankIndex < ranksList.length ? ranksList[nextRankIndex] : null;
                  const currentRank = currentRankIndex >= 0 ? ranksList[currentRankIndex] : null;
                  
                  if (!nextRank) {
                    return (
                      <div style={{
                        padding: '24px',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        color: '#fff'
                      }}>
                        <Crown size={48} style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>🎉 MYTHIC RANK ACHIEVED!</h3>
                        <p style={{ fontSize: '14px', opacity: 0.9 }}>You've reached the highest rank. Congratulations!</p>
                      </div>
                    );
                  }
                  
                  const pointsNeeded = nextRank.points - rewardData.dagPoints;
                  const progressPercentage = currentRank 
                    ? Math.min(100, ((rewardData.dagPoints - currentRank.points) / (nextRank.points - currentRank.points)) * 100)
                    : Math.min(100, (rewardData.dagPoints / nextRank.points) * 100);
                  
                  return (
                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Current Rank</p>
                          <p style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                            {currentRank ? currentRank.name : 'No Rank'}
                          </p>
                        </div>
                        <ChevronRight size={24} style={{ color: '#6b7280' }} />
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Next Rank</p>
                          <p style={{ fontSize: '20px', fontWeight: '700', color: nextRank.color }}>
                            {nextRank.name}
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div style={{
                        width: '100%',
                        height: '32px',
                        background: '#f3f4f6',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          width: `${progressPercentage}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${currentRank?.color || '#6b7280'} 0%, ${nextRank.color} 100%)`,
                          transition: 'width 0.5s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '12px'
                        }}>
                          {progressPercentage > 10 && (
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>
                              {progressPercentage.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '12px'
                      }}>
                        <div>
                          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Your DAG Points</p>
                          <p style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                            {rewardData.dagPoints.toLocaleString()}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Points Needed</p>
                          <p style={{ fontSize: '18px', fontWeight: '700', color: pointsNeeded > 0 ? '#ef4444' : '#10b981' }}>
                            {pointsNeeded > 0 ? pointsNeeded.toLocaleString() : '0'}
                          </p>
                        </div>
                        <div>
                          {pointsNeeded <= 0 ? (
                            <button style={{
                              padding: '10px 20px',
                              borderRadius: '8px',
                              background: nextRank.color,
                              color: '#fff',
                              border: 'none',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <ArrowUp size={16} />
                              Upgrade to {nextRank.name}
                            </button>
                          ) : (
                            <div style={{
                              padding: '10px 20px',
                              borderRadius: '8px',
                              background: '#e5e7eb',
                              color: '#6b7280',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}>
                              Keep Earning
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* How to Earn Section */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <TrendingUp size={24} style={{ color: '#10b981' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                    How to Earn Rewards
                  </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div style={{
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: '#dbeafe',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      <Users size={24} style={{ color: '#3b82f6' }} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                      Refer Friends
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                      Earn 500-600 DAG Points when your referrals join, plus bonus points when they upgrade to DAG LIEUTENANT
                    </p>
                  </div>

                  <div style={{
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: '#fef3c7',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      <DollarSign size={24} style={{ color: '#f59e0b' }} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                      Sales Commissions
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                      Earn 3-20% USD commission on product sales from your referral network (Validator Nodes, Storage Nodes, DAGGPT)
                    </p>
                  </div>

                  <div style={{
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: '#fce7f3',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      <Trophy size={24} style={{ color: '#ec4899' }} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                      Achieve Ranks
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                      Burn DAG Points to unlock higher ranks and increase your commission rates from 10% up to 20%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
}
