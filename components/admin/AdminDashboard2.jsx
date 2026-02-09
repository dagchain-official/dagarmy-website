"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
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

/* ─── Animated Counter Hook ─── */
function useAnimatedCounter(end, duration = 1200, startOnMount = true) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!startOnMount || end === 0) { setCount(end); return; }
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration, startOnMount]);

  return count;
}

/* ─── SVG Sparkline Component ─── */
function Sparkline({ data, color = '#6366f1', width = 80, height = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color.replace('#','')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Circular Progress Ring ─── */
function ProgressRing({ value = 0, size = 64, strokeWidth = 5, color = '#6366f1' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (value / 100) * circumference);
    }, 200);
    return () => clearTimeout(timer);
  }, [value, circumference]);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </svg>
  );
}

/* ─── Mini Bar Chart (pure SVG) ─── */
function MiniBarChart({ data, color = '#6366f1', width = 100, height = 40 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data) || 1;
  const barW = (width / data.length) * 0.6;
  const gap = (width / data.length) * 0.4;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((v, i) => {
        const barH = (v / max) * (height - 4);
        const x = i * (barW + gap) + gap / 2;
        return (
          <rect key={i} x={x} y={height - barH - 2} width={barW} height={barH}
            rx={barW / 2} fill={color} opacity={0.5 + (i / data.length) * 0.5} />
        );
      })}
    </svg>
  );
}

export default function AdminDashboard2() {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setTimeout(() => setMounted(true), 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userResponse, coursesResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/courses/all')
      ]);
      const userData = await userResponse.json();
      const coursesData = await coursesResponse.json();
      if (userResponse.ok) setUserData(userData);
      if (coursesResponse.ok && coursesData.courses) {
        const transformedData = {
          program: coursesData.courses[0] || null,
          modules: coursesData.courses[0]?.modules || [],
          lessons: coursesData.courses[0]?.modules?.flatMap(m => m.lessons || []) || []
        };
        setProgramData(transformedData);
      } else {
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
      return { totalStudents: 0, totalModules: 0, totalLessons: 0, totalRevenue: 0, activeUsers: 0, completionRate: 0, certificatesIssued: 0, totalEnrollments: 0, newUsersThisWeek: 0, growthRate: 0 };
    }
    const totalStudents = userData.stats.totalUsers;
    const totalModules = programData.stats?.totalModules || 0;
    const totalLessons = programData.stats?.totalLessons || 0;
    const totalEnrollments = programData.stats?.totalEnrollments || 0;
    const totalRevenue = totalEnrollments * 49;
    const activeUsers = userData.stats.activeUsers;
    return {
      totalStudents, totalModules, totalLessons, totalRevenue, activeUsers, totalEnrollments,
      completionRate: 78,
      certificatesIssued: Math.round(totalEnrollments * 0.65),
      newUsersThisWeek: userData.stats.newUsersThisWeek,
      growthRate: userData.stats.growthRate
    };
  }, [userData, programData]);

  const animatedRevenue = useAnimatedCounter(realStats.totalRevenue, 1400, !loading);
  const animatedUsers = useAnimatedCounter(realStats.totalStudents, 1200, !loading);
  const animatedActive = useAnimatedCounter(realStats.activeUsers, 1000, !loading);
  const animatedCompletion = useAnimatedCounter(realStats.completionRate, 1400, !loading);

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [45000, 52000, 48000, 61000, 58000, 67000],
      borderColor: '#6366f1',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
        return gradient;
      },
      fill: true, tension: 0.45, borderWidth: 2.5,
      pointRadius: 0, pointHoverRadius: 6,
      pointBackgroundColor: '#6366f1', pointBorderColor: '#fff',
      pointBorderWidth: 3, pointHoverBorderWidth: 3
    }]
  };

  const userGrowthData = useMemo(() => ({
    labels: ['W1', 'W2', 'W3', 'W4'],
    datasets: [{
      label: 'New Users',
      data: userData?.stats.weeklyGrowth || [0, 0, 0, 0],
      backgroundColor: (ctx) => {
        const chart = ctx.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return 'rgba(99,102,241,0.8)';
        const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(99,102,241,0.4)');
        gradient.addColorStop(1, 'rgba(139,92,246,0.9)');
        return gradient;
      },
      borderRadius: 8, borderSkipped: false, barThickness: 28
    }]
  }), [userData]);

  const courseDistributionData = {
    labels: ['AI/ML', 'Blockchain', 'Data Viz', 'Web3', 'Other'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#e2e8f0'],
      borderWidth: 0, hoverOffset: 8, spacing: 3
    }]
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a', titleColor: '#fff', bodyColor: '#cbd5e1',
        padding: 14, cornerRadius: 10,
        titleFont: { weight: '700', size: 13 }, bodyFont: { size: 12 },
        displayColors: false, caretSize: 6
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false }, ticks: { color: '#94a3b8', font: { size: 11 }, padding: 10 }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 }, padding: 10 }, border: { display: false } }
    }
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 11, weight: '600' }, color: '#64748b', usePointStyle: true, pointStyle: 'circle', boxWidth: 8 } },
      tooltip: { backgroundColor: '#0f172a', titleColor: '#fff', bodyColor: '#cbd5e1', padding: 14, cornerRadius: 10, displayColors: true }
    },
    cutout: '75%'
  };

  /* ─── Bento Card wrapper ─── */
  const BentoCard = useCallback(({ children, span = '1', rowSpan = '1', style = {}, hover = true, ...props }) => (
    <div
      style={{
        gridColumn: `span ${span}`,
        gridRow: `span ${rowSpan}`,
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
      {...props}
    >
      {children}
    </div>
  ), [mounted]);

  if (loading) {
    return (
      <div style={{ padding: '40px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f6f8fb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '56px', height: '56px', margin: '0 auto 24px' }}>
            <div style={{ position: 'absolute', inset: 0, border: '3px solid #f1f5f9', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
          <div style={{ fontSize: '15px', color: '#94a3b8', fontWeight: '500', letterSpacing: '0.3px' }}>Loading dashboard...</div>
        </div>
        <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const weeklyGrowth = userData?.stats?.weeklyGrowth || [0, 0, 0, 0];
  const revenueSparkData = [45, 52, 48, 61, 58, 67, 72];
  const usersSparkData = [12, 18, 14, 22, 28, 24, realStats.totalStudents || 30];

  return (
    <div style={{ padding: '32px 36px', width: '100%', background: '#f6f8fb', minHeight: '100vh' }}>

      {/* ─── Header ─── */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.6px' }}>
              {greeting}, Admin
            </h1>
            <span style={{ fontSize: '26px', lineHeight: 1 }}>👋</span>
          </div>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, fontWeight: '450' }}>
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '10px 18px', background: '#fff', borderRadius: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.15)' }} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569', fontVariantNumeric: 'tabular-nums' }}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Bento Grid ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridAutoRows: 'minmax(0, auto)',
        gap: '18px'
      }}>

        {/* ━━━ ROW 1: Hero Revenue Card (5 cols) ━━━ */}
        <BentoCard span="5" style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          border: 'none',
          padding: '32px',
          color: '#fff',
          minHeight: '200px'
        }}>
          {/* Decorative orbs */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '20%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💰</div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</span>
              </div>
              <span style={{ padding: '5px 12px', borderRadius: '100px', background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(16,185,129,0.2)' }}>
                +12.5% ↑
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px', fontVariantNumeric: 'tabular-nums' }}>
                  ${(animatedRevenue / 1000).toFixed(1)}K
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>
                  vs $58.2K last month
                </div>
              </div>
              <Sparkline data={revenueSparkData} color="#818cf8" width={120} height={48} />
            </div>
          </div>
        </BentoCard>

        {/* ━━━ ROW 1: Stat Cards (7 cols = 3 cards) ━━━ */}
        <BentoCard span="3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👥</div>
            <Sparkline data={usersSparkData} color="#10b981" width={72} height={28} />
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '6px', fontVariantNumeric: 'tabular-nums' }}>
              {animatedUsers.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Total Users</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', padding: '2px 8px', background: '#f0fdf4', borderRadius: '100px' }}>
                +{realStats.newUsersThisWeek || 0}
              </span>
            </div>
          </div>
        </BentoCard>

        <BentoCard span="2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1.5px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {animatedActive}
              </span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)', marginLeft: '4px', marginBottom: '4px' }} />
            </div>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', marginTop: '6px', display: 'block' }}>Active Now</span>
          </div>
        </BentoCard>

        <BentoCard span="2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <ProgressRing value={animatedCompletion} size={80} strokeWidth={6} color="#6366f1" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>{animatedCompletion}%</span>
            </div>
          </div>
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Completion Rate</span>
        </BentoCard>

        {/* ━━━ ROW 2: Revenue Chart (8 cols) + Quick Actions (4 cols) ━━━ */}
        <BentoCard span="8">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Revenue Overview</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0', fontWeight: '500' }}>Monthly performance tracking</p>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '3px' }}>
              {['6M', '1Y', 'All'].map((label, i) => (
                <button key={label} style={{
                  padding: '6px 14px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                  background: i === 0 ? '#fff' : 'transparent',
                  color: i === 0 ? '#0f172a' : '#94a3b8',
                  boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s'
                }}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ height: '260px' }}>
            <Line data={revenueData} options={chartOptions} />
          </div>
        </BentoCard>

        <BentoCard span="4" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 18px 0' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { title: 'Add Course', icon: '➕', path: '/admin/courses/add', bg: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)', iconBg: '#8b5cf6' },
              { title: 'Manage Users', icon: '👥', path: '/admin/users', bg: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)', iconBg: '#3b82f6' },
              { title: 'Certificates', icon: '🎓', path: '/admin/certifications', bg: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)', iconBg: '#10b981' },
              { title: 'View Reports', icon: '📊', path: '/admin/reports', bg: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)', iconBg: '#f59e0b' },
              { title: 'Manage Admins', icon: '🛡️', path: '/admin/manage-admins', bg: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)', iconBg: '#ec4899' }
            ].map((action, index) => (
              <Link key={index} href={action.path} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '12px',
                background: '#f8fafc', border: '1px solid transparent',
                textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = action.bg;
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', flexShrink: 0
                }}>
                  {action.icon}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', flex: 1 }}>{action.title}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#cbd5e1' }}>
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}
          </div>
        </BentoCard>

        {/* ━━━ ROW 3: User Growth (4 cols) + Course Dist (4 cols) + Activity (4 cols) ━━━ */}
        <BentoCard span="4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>User Growth</h3>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', padding: '4px 10px', background: '#ede9fe', borderRadius: '100px' }}>Weekly</span>
          </div>
          <div style={{ height: '180px' }}>
            <Bar data={userGrowthData} options={chartOptions} />
          </div>
        </BentoCard>

        <BentoCard span="4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Course Distribution</h3>
          </div>
          <div style={{ height: '200px' }}>
            <Doughnut data={courseDistributionData} options={doughnutOptions} />
          </div>
        </BentoCard>

        <BentoCard span="4" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Recent Activity</h3>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.15)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { icon: '👤', text: 'New user registered', time: '5m ago', color: '#6366f1' },
              { icon: '📚', text: 'Course published', time: '12m ago', color: '#8b5cf6' },
              { icon: '🎓', text: 'Certificate issued', time: '25m ago', color: '#10b981' },
              { icon: '💼', text: 'New job posting', time: '1h ago', color: '#f59e0b' },
              { icon: '✅', text: 'Course completed', time: '2h ago', color: '#3b82f6' }
            ].map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '10px',
                transition: 'background 0.2s', cursor: 'default'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9px',
                  background: `${a.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', flexShrink: 0
                }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{a.text}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>{a.time}</div>
                </div>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: a.color, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </BentoCard>

        {/* ━━━ ROW 4: Mini Stats (3 x 2 cols) + Modules (6 cols) ━━━ */}
        <BentoCard span="2" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📦</div>
            <MiniBarChart data={[3, 5, 2, 7, 4, 6]} color="#8b5cf6" width={60} height={28} />
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>{realStats.totalModules}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginTop: '4px' }}>Modules</div>
          </div>
        </BentoCard>

        <BentoCard span="2" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📄</div>
            <MiniBarChart data={[4, 6, 3, 8, 5, 7]} color="#3b82f6" width={60} height={28} />
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>{realStats.totalLessons}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginTop: '4px' }}>Lessons</div>
          </div>
        </BentoCard>

        <BentoCard span="2" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎓</div>
            <MiniBarChart data={[2, 4, 6, 3, 5, 8]} color="#10b981" width={60} height={28} />
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>{realStats.totalEnrollments}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginTop: '4px' }}>Enrollments</div>
          </div>
        </BentoCard>

        <BentoCard span="6" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Program Modules</h3>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', padding: '4px 10px', background: '#f1f5f9', borderRadius: '100px' }}>
              {programData?.programs?.[0]?.modules?.length || 0} total
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {programData?.programs?.[0]?.modules?.slice(0, 5).map((module, index) => {
              const trackColors = {
                'Yellow': { bg: '#fef3c7', text: '#92400e' },
                'Green': { bg: '#dcfce7', text: '#166534' },
                'Blue': { bg: '#dbeafe', text: '#1e40af' }
              };
              const colors = trackColors[module.track] || { bg: '#f1f5f9', text: '#475569' };
              const gradients = ['#6366f1', '#8b5cf6', '#a78bfa', '#6366f1', '#8b5cf6'];
              return (
                <div key={module.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '12px', background: '#f8fafc',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', border: '1px solid transparent'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: `linear-gradient(135deg, ${gradients[index % 5]}, ${gradients[(index + 1) % 5]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: '700', fontSize: '12px', flexShrink: 0
                  }}>M{module.module_number}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{module.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500', marginTop: '2px' }}>{module.lessons?.length || 0} lessons • {module.duration}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: '100px', background: colors.bg, color: colors.text, fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{module.track}</span>
                </div>
              );
            })}
          </div>
        </BentoCard>

        {/* ━━━ ROW 5: System Status (full width) ━━━ */}
        <BentoCard span="12" hover={false} style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: 'none', padding: '20px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4 4 8-8" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>All Systems Operational</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: '500', marginTop: '2px' }}>Last checked: just now</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: 'Uptime', value: '99.9%', color: '#34d399' },
              { label: 'Response', value: '120ms', color: '#818cf8' },
              { label: 'Errors', value: '0', color: '#fbbf24' }
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: '500', marginTop: '2px' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </BentoCard>

      </div>
    </div>
  );
}
