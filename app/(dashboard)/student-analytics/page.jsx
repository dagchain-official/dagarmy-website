"use client";
import React, { useState } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { BarChart3, TrendingUp, Clock, Target, Award, BookOpen, Calendar, Activity } from "lucide-react";

export default function StudentAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');

  const stats = {
    totalStudyHours: 142,
    coursesCompleted: 8,
    averageScore: 87,
    currentStreak: 12,
    weeklyGoal: 85,
    weeklyProgress: 72
  };

  const weeklyActivity = [
    { day: 'Mon', hours: 3.5, completed: 2 },
    { day: 'Tue', hours: 4.2, completed: 3 },
    { day: 'Wed', hours: 2.8, completed: 1 },
    { day: 'Thu', hours: 5.1, completed: 4 },
    { day: 'Fri', hours: 3.9, completed: 2 },
    { day: 'Sat', hours: 6.2, completed: 5 },
    { day: 'Sun', hours: 4.5, completed: 3 }
  ];

  const courseProgress = [
    { name: 'AI & ML', progress: 85, color: '#6366f1', hours: 45 },
    { name: 'Blockchain', progress: 65, color: '#10b981', hours: 32 },
    { name: 'Data Viz', progress: 92, color: '#f59e0b', hours: 38 },
    { name: 'Web3', progress: 45, color: '#ef4444', hours: 27 }
  ];

  const performanceData = [
    { month: 'Jan', score: 78 },
    { month: 'Feb', score: 82 },
    { month: 'Mar', score: 85 },
    { month: 'Apr', score: 87 },
    { month: 'May', score: 89 },
    { month: 'Jun', score: 91 }
  ];

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

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
                  <BarChart3 size={36} style={{ color: '#6366f1' }} />
                  Learning Analytics
                </h1>
                <p style={{ fontSize: '16px', color: '#6b7280' }}>
                  Track your progress and performance insights
                </p>
              </div>

              {/* Time Range Filter */}
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
                {['week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: timeRange === range ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                      color: timeRange === range ? '#fff' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textTransform: 'capitalize'
                    }}
                  >
                    This {range}
                  </button>
                ))}
              </div>

              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Clock size={24} />
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Study Hours</div>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '800' }}>{stats.totalStudyHours}h</div>
                  <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px' }}>+12% from last month</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <BookOpen size={24} />
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Completed</div>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '800' }}>{stats.coursesCompleted}</div>
                  <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px' }}>Courses finished</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Target size={24} />
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Avg Score</div>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '800' }}>{stats.averageScore}%</div>
                  <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px' }}>+5% improvement</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Activity size={24} />
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Streak</div>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '800' }}>{stats.currentStreak}</div>
                  <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px' }}>Days in a row</div>
                </div>
              </div>

              {/* Weekly Activity Chart */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                  Weekly Activity
                </h2>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px' }}>
                  {weeklyActivity.map((day, index) => (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        gap: '4px'
                      }}>
                        <div
                          style={{
                            width: '100%',
                            height: `${(day.hours / maxHours) * 100}%`,
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            borderRadius: '8px 8px 0 0',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            top: '-30px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#111827',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            opacity: 0,
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                          >
                            {day.hours}h
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                        {day.day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Progress */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                  Course Progress
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {courseProgress.map((course, index) => (
                    <div key={index}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                          {course.name}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: course.color }}>
                          {course.progress}%
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '12px',
                        background: '#f3f4f6',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${course.progress}%`,
                          height: '100%',
                          background: course.color,
                          borderRadius: '6px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                        {course.hours} hours completed
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Trend */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>
                    Performance Trend
                  </h2>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: '#dcfce7',
                    color: '#16a34a',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <TrendingUp size={18} />
                    +13% Overall
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px' }}>
                  {performanceData.map((data, index) => (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'flex-end'
                      }}>
                        <div
                          style={{
                            width: '100%',
                            height: `${data.score}%`,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '8px 8px 0 0',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingTop: '8px',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        >
                          {data.score}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                        {data.month}
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
