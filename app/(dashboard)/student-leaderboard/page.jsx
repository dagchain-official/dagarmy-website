"use client";
import React, { useState } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { Trophy, TrendingUp, Award, Crown, Zap, Star, Medal } from "lucide-react";

export default function StudentLeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('all-time');

  const leaderboardData = [
    { rank: 1, name: "Alex Chen", avatar: "AC", points: 15420, courses: 12, badges: 28, trend: "up", change: 2 },
    { rank: 2, name: "Sarah Johnson", avatar: "SJ", points: 14890, courses: 11, badges: 25, trend: "up", change: 1 },
    { rank: 3, name: "Michael Brown", avatar: "MB", points: 13750, courses: 10, badges: 22, trend: "down", change: -1 },
    { rank: 4, name: "Emma Wilson", avatar: "EW", points: 12980, courses: 9, badges: 20, trend: "same", change: 0 },
    { rank: 5, name: "David Lee", avatar: "DL", points: 12340, courses: 10, badges: 19, trend: "up", change: 3 },
    { rank: 6, name: "Vinod Kumar", avatar: "VK", points: 11850, courses: 8, badges: 18, trend: "same", change: 0, isCurrentUser: true },
    { rank: 7, name: "Lisa Anderson", avatar: "LA", points: 11200, courses: 8, badges: 16, trend: "down", change: -2 },
    { rank: 8, name: "James Taylor", avatar: "JT", points: 10890, courses: 7, badges: 15, trend: "up", change: 1 },
    { rank: 9, name: "Maria Garcia", avatar: "MG", points: 10450, courses: 7, badges: 14, trend: "same", change: 0 },
    { rank: 10, name: "Robert Martinez", avatar: "RM", points: 9980, courses: 6, badges: 13, trend: "up", change: 2 },
  ];

  const getRankColor = (rank) => {
    if (rank === 1) return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
    if (rank === 2) return 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)';
    if (rank === 3) return 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
    return '#6b7280';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={24} style={{ color: '#fbbf24' }} />;
    if (rank === 2) return <Medal size={24} style={{ color: '#9ca3af' }} />;
    if (rank === 3) return <Award size={24} style={{ color: '#f97316' }} />;
    return null;
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

              {/* Time Filter */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '32px',
                background: '#fff',
                padding: '8px',
                borderRadius: '12px',
                width: 'fit-content',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                {['all-time', 'this-month', 'this-week'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: timeFilter === filter ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                      color: timeFilter === filter ? '#fff' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textTransform: 'capitalize'
                    }}
                  >
                    {filter.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Top 3 Podium */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '20px',
                marginBottom: '32px',
                alignItems: 'end'
              }}>
                {/* 2nd Place */}
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '2px solid #d1d5db',
                  position: 'relative',
                  paddingTop: '40px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '800',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    2
                  </div>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#fff',
                    margin: '0 auto 16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }}>
                    {leaderboardData[1].avatar}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                    {leaderboardData[1].name}
                  </h3>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#6366f1', marginBottom: '8px' }}>
                    {leaderboardData[1].points.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>DAG Points</div>
                </div>

                {/* 1st Place */}
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '3px solid #fbbf24',
                  position: 'relative',
                  paddingTop: '48px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    fontWeight: '800',
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(251, 191, 36, 0.4)'
                  }}>
                    <Crown size={32} />
                  </div>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    fontWeight: '800',
                    color: '#fff',
                    margin: '0 auto 20px',
                    boxShadow: '0 12px 32px rgba(251, 191, 36, 0.3)'
                  }}>
                    {leaderboardData[0].avatar}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
                    {leaderboardData[0].name}
                  </h3>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#6366f1', marginBottom: '8px' }}>
                    {leaderboardData[0].points.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>DAG Points</div>
                </div>

                {/* 3rd Place */}
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '2px solid #f97316',
                  position: 'relative',
                  paddingTop: '40px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '800',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    3
                  </div>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#fff',
                    margin: '0 auto 16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }}>
                    {leaderboardData[2].avatar}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                    {leaderboardData[2].name}
                  </h3>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#6366f1', marginBottom: '8px' }}>
                    {leaderboardData[2].points.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>DAG Points</div>
                </div>
              </div>

              {/* Full Leaderboard Table */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                  Full Rankings
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {leaderboardData.map((student) => (
                    <div
                      key={student.rank}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        borderRadius: '12px',
                        background: student.isCurrentUser ? 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' : '#f9fafb',
                        border: student.isCurrentUser ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!student.isCurrentUser) {
                          e.currentTarget.style.background = '#f3f4f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!student.isCurrentUser) {
                          e.currentTarget.style.background = '#f9fafb';
                        }
                      }}
                    >
                      <div style={{ 
                        width: '48px',
                        fontSize: '20px',
                        fontWeight: '800',
                        color: student.rank <= 3 ? getRankColor(student.rank) : '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {student.rank <= 3 ? getRankIcon(student.rank) : `#${student.rank}`}
                      </div>
                      
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: student.rank <= 3 ? getRankColor(student.rank) : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#fff',
                        marginRight: '16px'
                      }}>
                        {student.avatar}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                          {student.name}
                          {student.isCurrentUser && (
                            <span style={{
                              marginLeft: '8px',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: '#8b5cf6',
                              color: '#fff',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              YOU
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          {student.courses} courses • {student.badges} badges
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right', marginRight: '24px' }}>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#6366f1' }}>
                          {student.points.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>points</div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: student.trend === 'up' ? '#dcfce7' : student.trend === 'down' ? '#fee2e2' : '#f3f4f6',
                        color: student.trend === 'up' ? '#16a34a' : student.trend === 'down' ? '#dc2626' : '#6b7280',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {student.trend === 'up' && <TrendingUp size={16} />}
                        {student.trend === 'down' && <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />}
                        {student.change !== 0 && Math.abs(student.change)}
                        {student.change === 0 && '—'}
                      </div>
                    </div>
                  ))}
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
