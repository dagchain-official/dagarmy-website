"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { dagarmyCourses } from "@/data/dagarmy-courses";
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard2() {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user data and courses data in parallel
      const [userResponse, coursesResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/courses/all')
      ]);
      
      const userData = await userResponse.json();
      const coursesData = await coursesResponse.json();
      
      if (userResponse.ok) {
        setUserData(userData);
      } else {
        console.error('Failed to fetch user data:', userData.error);
      }
      
      if (coursesResponse.ok && coursesData.courses) {
        // Transform courses data to match the old program structure
        const transformedData = {
          program: coursesData.courses[0] || null,
          modules: coursesData.courses[0]?.modules || [],
          lessons: coursesData.courses[0]?.modules?.flatMap(m => m.lessons || []) || []
        };
        setProgramData(transformedData);
      } else {
        console.error('Failed to fetch courses data:', coursesData.error);
        // Set empty data to prevent errors
        setProgramData({ program: null, modules: [], lessons: [] });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setProgramData({ program: null, modules: [], lessons: [] });
    } finally {
      setLoading(false);
    }
  };

  const realStats = useMemo(() => {
    if (!userData || !programData) {
      return {
        totalStudents: 0,
        totalModules: 0,
        totalLessons: 0,
        totalRevenue: 0,
        activeUsers: 0,
        completionRate: 0,
        certificatesIssued: 0,
        totalEnrollments: 0
      };
    }

    const totalStudents = userData.stats.totalUsers;
    const totalModules = programData.stats?.totalModules || 0;
    const totalLessons = programData.stats?.totalLessons || 0;
    const totalEnrollments = programData.stats?.totalEnrollments || 0;
    const totalRevenue = totalEnrollments * 49;
    const activeUsers = userData.stats.activeUsers;

    return {
      totalStudents,
      totalModules,
      totalLessons,
      totalRevenue,
      activeUsers,
      totalEnrollments,
      completionRate: 78,
      certificatesIssued: Math.round(totalEnrollments * 0.65),
      newUsersThisWeek: userData.stats.newUsersThisWeek,
      growthRate: userData.stats.growthRate
    };
  }, [userData, programData]);

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [45000, 52000, 48000, 61000, 58000, 67000],
      borderColor: '#1f2937',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#1f2937',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  };

  const userGrowthData = useMemo(() => ({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'New Users',
      data: userData?.stats.weeklyGrowth || [0, 0, 0, 0],
      backgroundColor: 'rgba(139, 92, 246, 0.8)',
      borderRadius: 8,
      borderSkipped: false
    }]
  }), [userData]);

  const courseDistributionData = {
    labels: ['AI/ML', 'Blockchain', 'Data Viz', 'Web3', 'Other'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#1f2937',
        '#1f2937',
        '#111827',
        '#a78bfa',
        '#c4b5fd'
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        borderRadius: 8,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6', drawBorder: false },
        ticks: { color: '#6b7280', font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 11 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 },
          color: '#6b7280'
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        borderRadius: 8
      }
    },
    cutout: '70%'
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '24px', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            animation: 'spin 1s linear infinite'
          }}>⏳</div>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading dashboard data...</div>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          {greeting}, Admin 👋
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
          Here's what's happening with your platform today. Keep up the great work!
        </p>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* COLUMN 1 - Key Metrics (4 columns) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Total Revenue Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #1f2937 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              filter: 'blur(30px)'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Revenue</div>
              <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
                ${(realStats.totalRevenue / 1000).toFixed(1)}K
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.2)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  +12.5% ↑
                </span>
                <span style={{ fontSize: '13px', opacity: 0.9 }}>vs last month</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                {realStats.totalStudents.toLocaleString()}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Total Users</div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📚</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                {realStats.totalModules}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Total Modules</div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                {realStats.totalLessons}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Total Lessons</div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                {realStats.completionRate}%
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Completion Rate</div>
            </div>
          </div>

          {/* Active Users Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
              Active Users Now
            </h3>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
              {realStats.activeUsers}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              Users currently online
            </div>
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              Peak time: 2:00 PM - 5:00 PM
            </div>
          </div>
        </div>

        {/* COLUMN 2 - Analytics & Charts (5 columns) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Revenue Trend Chart */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>
                Revenue Trend
              </h3>
              <select style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
                color: '#6b7280',
                background: '#fff',
                cursor: 'pointer'
              }}>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div style={{ height: '250px' }}>
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>

          {/* User Growth & Course Distribution */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                User Growth
              </h3>
              <div style={{ height: '200px' }}>
                <Bar data={userGrowthData} options={chartOptions} />
              </div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Course Distribution
              </h3>
              <div style={{ height: '200px' }}>
                <Doughnut data={courseDistributionData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* Program Modules */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
              Program Modules
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {programData?.programs?.[0]?.modules?.slice(0, 8).map((module, index) => {
                const trackColors = {
                  'Yellow': { bg: '#fef3c7', text: '#92400e' },
                  'Green': { bg: '#d1fae5', text: '#065f46' },
                  'Blue': { bg: '#dbeafe', text: '#1e40af' }
                };
                const colors = trackColors[module.track] || { bg: '#f3f4f6', text: '#374151' };
                
                return (
                  <div key={module.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#fafafa',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fafafa'}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: `linear-gradient(135deg, #1f2937 0%, #1f2937 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>
                      M{module.module_number}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                        {module.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {module.lessons?.length || 0} lessons • {module.duration}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: colors.bg,
                      color: colors.text,
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {module.track}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 3 - Activity & Actions (3 columns) */}
        <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick Actions */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { title: 'Add Course', icon: '➕', path: '/admin/courses/add', color: '#1f2937' },
                { title: 'Manage Users', icon: '👥', path: '/admin/users', color: '#1f2937' },
                { title: 'Issue Certificate', icon: '🎓', path: '/admin/certifications', color: '#111827' },
                { title: 'View Reports', icon: '📊', path: '/admin/reports', color: '#a78bfa' }
              ].map((action, index) => (
                <Link key={index} href={action.path} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#fafafa',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${action.color}08`;
                  e.currentTarget.style.borderColor = `${action.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${action.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    {action.icon}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', flex: 1 }}>
                    {action.title}
                  </div>
                  <div style={{ fontSize: '16px', color: '#9ca3af' }}>→</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            flex: 1
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '👤', text: 'New user registered', time: '5 min ago', color: '#1f2937' },
                { icon: '📚', text: 'Course published', time: '12 min ago', color: '#1f2937' },
                { icon: '🎓', text: 'Certificate issued', time: '25 min ago', color: '#111827' },
                { icon: '💼', text: 'New job posting', time: '1 hour ago', color: '#a78bfa' },
                { icon: '✅', text: 'Course completed', time: '2 hours ago', color: '#1f2937' }
              ].map((activity, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '10px',
                  padding: '10px',
                  borderRadius: '8px',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: `${activity.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#111827', fontWeight: '500', marginBottom: '2px' }}>
                      {activity.text}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            padding: '20px',
            color: '#fff'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
              All Systems Operational
            </div>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>
              Uptime: 99.9% | Response: 120ms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
