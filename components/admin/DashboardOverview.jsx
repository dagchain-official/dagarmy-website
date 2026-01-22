"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { dagarmyCourses } from "@/data/dagarmy-courses";

export default function DashboardOverview() {
<<<<<<< HEAD
  const realStats = useMemo(() => {
    const totalStudents = dagarmyCourses.reduce((sum, course) => sum + course.students, 0);
    const totalCourses = dagarmyCourses.length;

=======
  // Calculate real statistics from DAGARMY data
  const realStats = useMemo(() => {
    const totalStudents = dagarmyCourses.reduce((sum, course) => sum + course.students, 0);
    const totalCourses = dagarmyCourses.length;
    
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    return {
      totalStudents,
      totalCourses,
      avgStudentsPerCourse: Math.round(totalStudents / totalCourses)
    };
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: realStats.totalStudents.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: "👥",
<<<<<<< HEAD
      color: "#8b5cf6",
      bgGradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
=======
      color: "#8b5cf6"
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    },
    {
      title: "Active Courses",
      value: realStats.totalCourses.toString(),
      change: "+3",
      trend: "up",
      icon: "📚",
<<<<<<< HEAD
      color: "#6d28d9",
      bgGradient: "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)"
=======
      color: "#10b981"
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    },
    {
      title: "Certifications Issued",
      value: Math.round(realStats.totalStudents * 0.65).toLocaleString(),
      change: "+156",
      trend: "up",
      icon: "🎓",
<<<<<<< HEAD
      color: "#7c3aed",
      bgGradient: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)"
=======
      color: "#f59e0b"
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    },
    {
      title: "Avg Students/Course",
      value: realStats.avgStudentsPerCourse.toLocaleString(),
      change: "+45",
      trend: "up",
      icon: "💼",
<<<<<<< HEAD
      color: "#8b5cf6",
      bgGradient: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)"
=======
      color: "#3b82f6"
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    }
  ];

  const recentActivities = [
<<<<<<< HEAD
    { type: "user", message: "New user registration: john.doe@email.com", time: "5 min ago", icon: "👤", color: "#8b5cf6" },
    { type: "course", message: "Course 'Advanced AI' published", time: "12 min ago", icon: "📚", color: "#6d28d9" },
    { type: "cert", message: "Certificate issued to Sarah Johnson", time: "25 min ago", icon: "🎓", color: "#7c3aed" },
    { type: "job", message: "New job posting: ML Engineer at TechCorp", time: "1 hour ago", icon: "💼", color: "#a78bfa" },
    { type: "user", message: "User completed 'Blockchain Basics'", time: "2 hours ago", icon: "✅", color: "#8b5cf6" }
  ];

  const quickActions = [
    { title: "Add New Course", icon: "➕", path: "/admin/courses/add", color: "#8b5cf6", description: "Create course content" },
    { title: "Issue Certificate", icon: "🎓", path: "/admin/certifications/issue", color: "#6d28d9", description: "Award completion" },
    { title: "Manage Users", icon: "👥", path: "/admin/users", color: "#7c3aed", description: "User administration" },
    { title: "View Analytics", icon: "📈", path: "/admin/analytics", color: "#a78bfa", description: "Platform insights" }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-in' }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px', animation: 'slideUp 0.5s ease-out' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          Dashboard Overview
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
=======
    { type: "user", message: "New user registration: john.doe@email.com", time: "5 min ago" },
    { type: "course", message: "Course 'Advanced AI' published", time: "12 min ago" },
    { type: "cert", message: "Certificate issued to Sarah Johnson", time: "25 min ago" },
    { type: "job", message: "New job posting: ML Engineer at TechCorp", time: "1 hour ago" },
    { type: "user", message: "User completed 'Blockchain Basics'", time: "2 hours ago" }
  ];

  const quickActions = [
    { title: "Add New Course", icon: "➕", path: "/admin/courses/add", color: "#8b5cf6" },
    { title: "Issue Certificate", icon: "🎓", path: "/admin/certifications/issue", color: "#10b981" },
    { title: "Manage Users", icon: "👥", path: "/admin/users", color: "#f59e0b" },
    { title: "View Analytics", icon: "📈", path: "/admin/analytics", color: "#3b82f6" }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Dashboard Overview
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
          Welcome back! Here's what's happening with DAGARMY today.
        </p>
      </div>

      {/* Stats Grid */}
<<<<<<< HEAD
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="col-xl-3 col-md-6"
            style={{
              animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards`
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(139, 92, 246, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {/* Gradient Background Accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: stat.bgGradient,
                opacity: 0.05,
                borderRadius: '50%',
                filter: 'blur(20px)',
                pointerEvents: 'none'
              }} />

              <div className="d-flex justify-content-between align-items-start mb-3" style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: `${stat.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
=======
      <div className="row g-4 mb-5">
        {stats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-md-6">
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px'
                  }}
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                >
                  {stat.icon}
                </div>
                <span
                  style={{
<<<<<<< HEAD
                    padding: '4px 10px',
                    borderRadius: '6px',
=======
                    padding: '4px 12px',
                    borderRadius: '20px',
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                    background: stat.trend === 'up' ? '#dcfce7' : '#fee2e2',
                    color: stat.trend === 'up' ? '#16a34a' : '#dc2626',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  {stat.change}
                </span>
              </div>
<<<<<<< HEAD
              <h3 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '4px',
                letterSpacing: '-0.02em',
                position: 'relative',
                zIndex: 1
              }}>
                {stat.value}
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, fontWeight: '500', position: 'relative', zIndex: 1 }}>
=======
              <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                {stat.value}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className="row g-3">
        {/* Quick Actions */}
        <div className="col-xl-4" style={{ animation: 'slideUp 0.6s ease-out 0.2s backwards' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
=======
      <div className="row g-4">
        {/* Quick Actions */}
        <div className="col-xl-4">
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
              border: '1px solid #e5e7eb',
              height: '100%'
            }}
          >
<<<<<<< HEAD
            <h4 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '16px',
              letterSpacing: '-0.01em'
            }}>
              Quick Actions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
=======
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
              Quick Actions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
<<<<<<< HEAD
                    padding: '14px',
                    borderRadius: '10px',
                    background: '#fafafa',
                    border: '1px solid #e5e7eb',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${action.color}08`;
                    e.currentTarget.style.borderColor = `${action.color}40`;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateX(0)';
=======
                    padding: '16px',
                    borderRadius: '12px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${action.color}10`;
                    e.currentTarget.style.borderColor = action.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.borderColor = '#e5e7eb';
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
<<<<<<< HEAD
                      background: `${action.color}10`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0
=======
                      background: `${action.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                    }}
                  >
                    {action.icon}
                  </div>
<<<<<<< HEAD
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                      {action.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {action.description}
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', color: '#9ca3af', transition: 'transform 0.3s ease' }}>→</div>
=======
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {action.title}
                  </span>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
<<<<<<< HEAD
        <div className="col-xl-8" style={{ animation: 'slideUp 0.6s ease-out 0.3s backwards' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
=======
        <div className="col-xl-8">
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
              border: '1px solid #e5e7eb'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
<<<<<<< HEAD
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
=======
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                Recent Activity
              </h4>
              <Link
                href="/admin/activity"
                style={{
<<<<<<< HEAD
                  fontSize: '13px',
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8b5cf6'}
=======
                  fontSize: '14px',
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
              >
                View All →
              </Link>
            </div>
<<<<<<< HEAD
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
=======
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '12px',
<<<<<<< HEAD
                    paddingBottom: '12px',
                    borderBottom: index < recentActivities.length - 1 ? '1px solid #f3f4f6' : 'none',
                    transition: 'all 0.2s ease',
                    padding: '8px',
                    borderRadius: '8px',
                    marginLeft: '-8px',
                    marginRight: '-8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
=======
                    paddingBottom: '16px',
                    borderBottom: index < recentActivities.length - 1 ? '1px solid #f3f4f6' : 'none'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                  }}
                >
                  <div
                    style={{
<<<<<<< HEAD
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: `${activity.color}10`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0
                    }}
                  >
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', color: '#111827', marginBottom: '2px', fontWeight: '500' }}>
=======
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#8b5cf6',
                      marginTop: '6px',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', color: '#111827', marginBottom: '4px', fontWeight: '500' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                      {activity.message}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Platform Performance */}
      <div className="row g-3 mt-3" style={{ animation: 'scaleIn 0.6s ease-out 0.4s backwards' }}>
        <div className="col-12">
          <div
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              borderRadius: '12px',
              padding: '28px',
              color: '#ffffff',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated Background Pattern */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            <div className="row align-items-center" style={{ position: 'relative', zIndex: 1 }}>
              <div className="col-md-8">
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                  Platform Performance
                </h3>
                <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '20px' }}>
                  All systems operational. Server uptime: 99.9% | Response time: 120ms
                </p>
                <div className="d-flex gap-4 flex-wrap">
                  <div>
                    <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Users</div>
                    <div style={{ fontSize: '28px', fontWeight: '700' }}>1,234</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>API Calls Today</div>
                    <div style={{ fontSize: '28px', fontWeight: '700' }}>45.2K</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Storage Used</div>
                    <div style={{ fontSize: '28px', fontWeight: '700' }}>67%</div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end d-none d-md-block">
                <div style={{ fontSize: '64px', opacity: 0.9 }}>🚀</div>
=======
      {/* Platform Health */}
      <div className="row g-4 mt-4">
        <div className="col-12">
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '32px',
              color: '#fff'
            }}
          >
            <div className="row align-items-center">
              <div className="col-md-8">
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                  Platform Performance
                </h3>
                <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '20px' }}>
                  All systems operational. Server uptime: 99.9% | Response time: 120ms
                </p>
                <div className="d-flex gap-4">
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Active Users</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>1,234</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>API Calls Today</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>45.2K</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Storage Used</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>67%</div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <div style={{ fontSize: '64px' }}>🚀</div>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
