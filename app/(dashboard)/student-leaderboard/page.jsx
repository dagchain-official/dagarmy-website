"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { Trophy, Award, Star } from "lucide-react";

export default function StudentLeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setCurrentUserId(null);
    }
  };

  const fetchLeaderboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(
        `/api/leaderboard?filter=${timeFilter}&userId=${currentUserId || ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Leaderboard data received:', data);
      setLeaderboardData(data.leaderboard || []);
      setError(null);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout - leaderboard took too long to load');
        setError('Request timeout. Please try again.');
      } else {
        console.error('Error fetching leaderboard:', error.message || error);
        setError(error.message || 'Failed to load leaderboard');
      }
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  }, [timeFilter, currentUserId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const maxPoints = leaderboardData.length > 0 
    ? Math.max(...leaderboardData.map(s => s.points))
    : 20000;
  const goalPoints = 10000;

  const getRankBadgeStyle = (rank) => {
    if (rank === 1) return { bg: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)', icon: '🏆' };
    if (rank === 2) return { bg: 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)', icon: '🥈' };
    if (rank === 3) return { bg: 'linear-gradient(135deg, #FDBA74 0%, #F97316 100%)', icon: '🥉' };
    return { bg: '#F3F4F6', icon: null };
  };

  // Get rank badge based on DAG Points burned
  const getRankBadge = (points) => {
    if (points >= 50000) return { name: 'MYTHIC', color: '#9333EA', icon: '👑' };
    if (points >= 40000) return { name: 'PARAGON', color: '#DC2626', icon: '🔥' };
    if (points >= 30000) return { name: 'CONQUEROR', color: '#EA580C', icon: '⚔️' };
    if (points >= 20000) return { name: 'CHAMPION', color: '#D97706', icon: '🏆' };
    if (points >= 15000) return { name: 'COMMANDER', color: '#CA8A04', icon: '⭐' };
    if (points >= 10000) return { name: 'INVOKER', color: '#65A30D', icon: '✨' };
    if (points >= 7000) return { name: 'STRIKER', color: '#16A34A', icon: '⚡' };
    if (points >= 3200) return { name: 'GUARDIAN', color: '#0891B2', icon: '🛡️' };
    if (points >= 1500) return { name: 'VANGUARD', color: '#0284C7', icon: '🎯' };
    if (points >= 700) return { name: 'INITIATOR', color: '#2563EB', icon: '🌟' };
    return { name: 'UNRANKED', color: '#6B7280', icon: '—' };
  };

  // Generate random badge counts for display (since we don't track this yet)
  const getRandomBadges = (rank) => {
    if (rank === 1) return { gold: 10, silver: 10, bronze: 5 };
    if (rank === 2) return { gold: 8, silver: 8, bronze: 5 };
    if (rank === 3) return { gold: 5, silver: 7, bronze: 7 };
    return { 
      gold: Math.max(0, 8 - rank), 
      silver: Math.max(0, 5 - Math.floor(rank / 2)), 
      bronze: Math.max(0, 3 - Math.floor(rank / 3)) 
    };
  };

  return (
    <div id="wrapper">
      <Header2 />
      <div className="main-content pt-0">
        <div className="page-inner" style={{ padding: "0" }}>
          <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
            <div style={{ 
              width: "240px", 
              flexShrink: 0,
              padding: "24px 16px",
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
                  fontWeight: '800', 
                  color: '#111827',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Trophy size={36} style={{ color: '#6366f1' }} />
                  Leaderboard
                </h1>
                <p style={{ fontSize: '16px', color: '#6b7280' }}>
                  Compete with fellow students and climb to the top
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '60px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: '1px solid #F3F4F6'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #F3F4F6',
                    borderTop: '4px solid #6366F1',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px'
                  }} />
                  <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading leaderboard...</p>
                  <style jsx>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '60px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: '1px solid #FEE2E2'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '32px'
                  }}>
                    ⚠️
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#DC2626', marginBottom: '8px' }}>
                    Failed to Load Leaderboard
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                    {error}
                  </p>
                  <button
                    onClick={fetchLeaderboard}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#6366F1',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && leaderboardData.length === 0 && (
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '60px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: '1px solid #F3F4F6'
                }}>
                  <Trophy size={64} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                    No Rankings Yet
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>
                    Be the first to earn DAG Points and climb the leaderboard!
                  </p>
                </div>
              )}

              {/* Main Leaderboard Container */}
              {!loading && leaderboardData.length > 0 && (
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: '1px solid #F3F4F6',
                  overflow: 'hidden'
                }}>
                {/* Header Section with Filters */}
                <div style={{
                  background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                  padding: '30px 40px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  {/* All Time Button */}
                  <button
                    onClick={() => setTimeFilter('all-time')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      background: timeFilter === 'all-time' ? '#fff' : 'transparent',
                      color: timeFilter === 'all-time' ? '#4F46E5' : '#6B7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: timeFilter === 'all-time' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    All Time
                  </button>

                  {/* Week Dropdown */}
                  <select
                    value={timeFilter.startsWith('week-') ? timeFilter : ''}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      background: timeFilter.startsWith('week-') ? '#fff' : 'transparent',
                      color: timeFilter.startsWith('week-') ? '#4F46E5' : '#6B7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: timeFilter.startsWith('week-') ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select Week</option>
                    <option value="week-1">This Week</option>
                    <option value="week-2">Last Week</option>
                    <option value="week-3">2 Weeks Ago</option>
                    <option value="week-4">3 Weeks Ago</option>
                  </select>

                  {/* Month Dropdown */}
                  <select
                    value={timeFilter.startsWith('month-') ? timeFilter : ''}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      background: timeFilter.startsWith('month-') ? '#fff' : 'transparent',
                      color: timeFilter.startsWith('month-') ? '#4F46E5' : '#6B7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: timeFilter.startsWith('month-') ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select Month</option>
                    <option value="month-1">This Month</option>
                    <option value="month-2">Last Month</option>
                    <option value="month-3">2 Months Ago</option>
                  </select>
                </div>


                {/* Modern Table Design with All Columns - Full Width */}
                <div style={{
                  padding: '0 40px 40px',
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'auto'
                }}>
                  {/* Table Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1.2fr 1.5fr 1.5fr 1.5fr 1.5fr',
                    gap: '24px',
                    padding: '24px 32px',
                    background: '#F9FAFB',
                    borderRadius: '12px 12px 0 0',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    <div style={{ textAlign: 'center' }}>S.NO</div>
                    <div>USER NAME</div>
                    <div>TIER</div>
                    <div>RANK</div>
                    <div style={{ textAlign: 'right' }}>TOTAL EARNED</div>
                    <div style={{ textAlign: 'right' }}>BURNED</div>
                    <div style={{ textAlign: 'right' }}>REDEEMED</div>
                  </div>

                  {/* Table Body */}
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden'
                  }}>
                    {leaderboardData.map((student, index) => {
                      const isTop3 = student.rank <= 3;
                      const rankBadge = getRankBadge(student.points);
                      // For now, using points as earned, and calculating burned/redeemed as 0
                      // You'll need to update the API to return these values from database
                      const totalEarned = student.points || 0;
                      const burned = 0; // TODO: Get from database
                      const redeemed = 0; // TODO: Get from database
                      
                      return (
                        <div
                          key={student.rank}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr 1.2fr 1.5fr 1.5fr 1.5fr 1.5fr',
                            gap: '24px',
                            alignItems: 'center',
                            padding: '20px 32px',
                            borderBottom: index < leaderboardData.length - 1 ? '1px solid #F3F4F6' : 'none',
                            background: student.isCurrentUser 
                              ? 'linear-gradient(90deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%)' 
                              : '#fff',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            if (!student.isCurrentUser) {
                              e.currentTarget.style.background = '#F9FAFB';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!student.isCurrentUser) {
                              e.currentTarget.style.background = '#fff';
                            }
                          }}
                        >
                          {/* S.No */}
                          <div style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: isTop3 ? '#4F46E5' : '#6B7280',
                            textAlign: 'center'
                          }}>
                            {student.rank}
                          </div>

                          {/* User Name with Avatar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                            <img
                              src={student.avatar}
                              alt={student.name}
                              style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '50%',
                                border: '2px solid #E5E7EB',
                                flexShrink: 0
                              }}
                            />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#111827',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {student.name}
                              </div>
                            </div>
                          </div>

                          {/* Tier */}
                          <div>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: student.tier === 'DAG_LIEUTENANT' ? '#10B98115' : '#6B728015',
                              border: `1.5px solid ${student.tier === 'DAG_LIEUTENANT' ? '#10B98130' : '#6B728030'}`,
                              fontSize: '12px',
                              fontWeight: '700',
                              color: student.tier === 'DAG_LIEUTENANT' ? '#10B981' : '#6B7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              <img 
                                src={student.tier === 'DAG_LIEUTENANT' ? '/images/badges/dag-lieutenant.svg' : '/images/badges/dag-soldier.svg'}
                                alt={student.tier === 'DAG_LIEUTENANT' ? 'Lieutenant Badge' : 'Soldier Badge'}
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  flexShrink: 0
                                }}
                              />
                              {student.tier === 'DAG_LIEUTENANT' ? 'LIEUTENANT' : 'SOLDIER'}
                            </div>
                          </div>

                          {/* Rank Badge */}
                          <div>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: `${rankBadge.color}15`,
                              border: `1.5px solid ${rankBadge.color}30`,
                              fontSize: '12px',
                              fontWeight: '700',
                              color: rankBadge.color,
                              letterSpacing: '0.5px'
                            }}>
                              <span style={{ fontSize: '15px' }}>{rankBadge.icon}</span>
                              {rankBadge.name}
                            </div>
                          </div>

                          {/* Total Earned */}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: '#111827'
                            }}>
                              {totalEarned.toLocaleString()}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#9CA3AF',
                              fontWeight: '600'
                            }}>
                              Points
                            </div>
                          </div>

                          {/* Burned */}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: '#DC2626'
                            }}>
                              {burned.toLocaleString()}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#9CA3AF',
                              fontWeight: '600'
                            }}>
                              Burned
                            </div>
                          </div>

                          {/* Redeemed */}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: '#10B981'
                            }}>
                              {redeemed.toLocaleString()}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#9CA3AF',
                              fontWeight: '600'
                            }}>
                              Redeemed
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
}
