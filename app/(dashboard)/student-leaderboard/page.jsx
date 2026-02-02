"use client";
import React, { useState } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { Trophy, TrendingUp, Award, Crown, Zap, Star, Medal, ArrowUp, ArrowDown, Minus, LayoutGrid, List } from "lucide-react";

export default function StudentLeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  const leaderboardData = [
    { rank: 1, name: "Alex Chen", avatar: "AC", points: 15420, courses: 12, badges: 28, trend: "up", change: 2, color: '#FFD700' },
    { rank: 2, name: "Sarah Johnson", avatar: "SJ", points: 14890, courses: 11, badges: 25, trend: "up", change: 1, color: '#C0C0C0' },
    { rank: 3, name: "Michael Brown", avatar: "MB", points: 13750, courses: 10, badges: 22, trend: "down", change: -1, color: '#CD7F32' },
    { rank: 4, name: "Emma Wilson", avatar: "EW", points: 12980, courses: 9, badges: 20, trend: "same", change: 0 },
    { rank: 5, name: "David Lee", avatar: "DL", points: 12340, courses: 10, badges: 19, trend: "up", change: 3 },
    { rank: 6, name: "Vinod Kumar", avatar: "VK", points: 11850, courses: 8, badges: 18, trend: "same", change: 0, isCurrentUser: true },
    { rank: 7, name: "Lisa Anderson", avatar: "LA", points: 11200, courses: 8, badges: 16, trend: "down", change: -2 },
    { rank: 8, name: "James Taylor", avatar: "JT", points: 10890, courses: 7, badges: 15, trend: "up", change: 1 },
    { rank: 9, name: "Maria Garcia", avatar: "MG", points: 10450, courses: 7, badges: 14, trend: "same", change: 0 },
    { rank: 10, name: "Robert Martinez", avatar: "RM", points: 9980, courses: 6, badges: 13, trend: "up", change: 2 },
  ];

  const topThree = leaderboardData.slice(0, 3);
  const remainingData = leaderboardData.slice(3);

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp size={14} />;
    if (trend === 'down') return <ArrowDown size={14} />;
    return <Minus size={14} />;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-400" />;
    if (rank === 2) return <Medal size={20} className="text-slate-400" />;
    if (rank === 3) return <Award size={20} className="text-orange-400" />;
    return null;
  };

  return (
    <div id="wrapper" className="bg-[#fcfcfd]">
      <Header2 />
      <div className="main-content pt-0">
        <div className="page-inner" style={{ padding: "0" }}>
          <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
            {/* Sidebar */}
            <div style={{ 
              width: "240px", 
              flexShrink: 0,
              padding: "24px 16px",
              position: "sticky",
              top: "0",
              height: "100vh",
              overflowY: "auto",
              background: "#fff",
              borderRight: "1px solid #f0f0f2"
            }}>
              <DashboardNav2 />
            </div>
            
            {/* Main Content Area */}
            <div style={{ flex: 1, padding: "48px 60px", background: "#fcfcfd" }}>
              {/* Top Section: Title and Filters */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '48px'
              }}>
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px', 
                    marginBottom: '8px' 
                  }}>
                    <div style={{
                      padding: '10px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                      borderRadius: '14px',
                      color: '#fff',
                      boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                    }}>
                      <Trophy size={28} />
                    </div>
                    <h1 style={{ 
                      fontSize: '36px', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      letterSpacing: '-0.02em',
                      margin: 0
                    }}>
                      Leaderboard
                    </h1>
                  </div>
                  <p style={{ fontSize: '16px', color: '#64748b', fontWeight: '500' }}>
                    Tracking the top performers of the DAGARMY network.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    display: 'flex',
                    background: '#f1f5f9',
                    padding: '4px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {['all-time', 'this-month', 'this-week'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setTimeFilter(filter)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: timeFilter === filter ? '#fff' : 'transparent',
                          color: timeFilter === filter ? '#1e293b' : '#64748b',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: timeFilter === filter ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                          textTransform: 'capitalize'
                        }}
                      >
                        {filter.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Podium Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                marginBottom: '60px',
                alignItems: 'flex-end',
                maxWidth: '1000px',
                margin: '0 auto 60px'
              }}>
                {/* 2nd Place */}
                <PodiumCard 
                  student={topThree[1]} 
                  position={2} 
                  height="260px"
                  gradient="linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)"
                  accent="#94a3b8"
                />

                {/* 1st Place */}
                <PodiumCard 
                  student={topThree[0]} 
                  position={1} 
                  height="320px"
                  gradient="linear-gradient(180deg, #fff 0%, #faf5ff 100%)"
                  accent="#fbbf24"
                  isWinner={true}
                />

                {/* 3rd Place */}
                <PodiumCard 
                  student={topThree[2]} 
                  position={3} 
                  height="230px"
                  gradient="linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)"
                  accent="#d97706"
                />
              </div>

              {/* Main Rankings List */}
              <div style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 20px 40px -20px rgba(0,0,0,0.05)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                    Global Rankings
                  </h2>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                    Showing top 100 players
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Table Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 120px 120px 100px',
                    padding: '12px 24px',
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <div>Rank</div>
                    <div>Student</div>
                    <div style={{ textAlign: 'center' }}>Courses</div>
                    <div style={{ textAlign: 'center' }}>Points</div>
                    <div style={{ textAlign: 'right' }}>Trend</div>
                  </div>

                  {/* List Items */}
                  {leaderboardData.map((student, idx) => (
                    <RankingRow key={student.rank} student={student} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function PodiumCard({ student, position, height, gradient, accent, isWinner }) {
  const getRankIcon = (pos) => {
    if (pos === 1) return <Crown size={32} fill="#fbbf24" />;
    if (pos === 2) return <Medal size={28} fill="#94a3b8" />;
    if (pos === 3) return <Award size={28} fill="#d97706" />;
    return null;
  };

  return (
    <div style={{
      height: height,
      background: gradient,
      borderRadius: '24px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      position: 'relative',
      boxShadow: isWinner ? '0 20px 50px -12px rgba(251, 191, 36, 0.15)' : '0 10px 30px -12px rgba(0,0,0,0.05)',
      border: `1px solid ${isWinner ? '#fef3c7' : '#f1f5f9'}`,
      zIndex: isWinner ? 10 : 1,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {/* Rank Indicator */}
      <div style={{
        position: 'absolute',
        top: '-24px',
        width: isWinner ? '64px' : '52px',
        height: isWinner ? '64px' : '52px',
        background: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        border: `4px solid ${accent}`,
        zIndex: 2,
      }} className={isWinner ? "animate-float" : ""}>
        {getRankIcon(position)}
      </div>

      {/* Avatar */}
      <div style={{
        width: isWinner ? '90px' : '70px',
        height: isWinner ? '90px' : '70px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${accent} 0%, ${isWinner ? '#f59e0b' : '#64748b'} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isWinner ? '32px' : '24px',
        fontWeight: '800',
        color: '#fff',
        marginBottom: '16px',
        border: '4px solid #fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        {student.avatar}
      </div>

      <h3 style={{ 
        fontSize: isWinner ? '20px' : '16px', 
        fontWeight: '800', 
        color: '#1e293b', 
        margin: '0 0 4px 0',
        textAlign: 'center'
      }}>
        {student.name}
      </h3>
      
      <div style={{
        fontSize: isWinner ? '28px' : '20px',
        fontWeight: '900',
        color: '#6366f1',
        marginBottom: '8px'
      }}>
        {student.points.toLocaleString()}
      </div>

      <div style={{
        fontSize: '12px',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        DAG Points
      </div>

      {isWinner && (
        <div style={{
          marginTop: '16px',
          padding: '4px 12px',
          background: '#fef3c7',
          color: '#d97706',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '800',
          textTransform: 'uppercase'
        }}>
          Current Champion
        </div>
      )}
    </div>
  );
}

function RankingRow({ student }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '60px 1fr 120px 120px 100px',
        alignItems: 'center',
        padding: '16px 24px',
        borderRadius: '16px',
        background: student.isCurrentUser ? 'linear-gradient(90deg, #f5f3ff 0%, #fff 100%)' : (isHovered ? '#f8fafc' : 'transparent'),
        transition: 'all 0.2s ease',
        border: `1px solid ${student.isCurrentUser ? '#ddd6fe' : (isHovered ? '#f1f5f9' : 'transparent')}`,
        cursor: 'pointer',
        transform: isHovered ? 'scale(1.005)' : 'scale(1)'
      }}
    >
      <div style={{ 
        fontSize: '18px', 
        fontWeight: '900', 
        color: student.rank <= 3 ? (student.rank === 1 ? '#fbbf24' : student.rank === 2 ? '#94a3b8' : '#d97706') : '#cbd5e1',
        fontFamily: 'monospace'
      }}>
        {student.rank.toString().padStart(2, '0')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: student.rank <= 3 ? (student.rank === 1 ? '#fef3c7' : student.rank === 2 ? '#f1f5f9' : '#fff7ed') : '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '800',
          color: student.rank <= 3 ? (student.rank === 1 ? '#d97706' : student.rank === 2 ? '#64748b' : '#c2410c') : '#64748b',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          {student.avatar}
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>
            {student.name}
            {student.isCurrentUser && (
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                background: '#6366f1',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '800'
              }}>
                YOU
              </span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
            {student.badges} badges collected
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: '700', color: '#64748b' }}>
        {student.courses}
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: '900', color: '#6366f1' }}>
          {student.points.toLocaleString()}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: student.trend === 'up' ? '#dcfce7' : student.trend === 'down' ? '#fee2e2' : '#f1f5f9',
          color: student.trend === 'up' ? '#16a34a' : student.trend === 'down' ? '#dc2626' : '#94a3b8',
          fontSize: '12px',
          fontWeight: '800'
        }}>
          {student.trend === 'up' && <ArrowUp size={12} />}
          {student.trend === 'down' && <ArrowDown size={12} />}
          {student.trend === 'same' && <Minus size={12} />}
          {student.change !== 0 && Math.abs(student.change)}
        </div>
      </div>
    </div>
  );
}
