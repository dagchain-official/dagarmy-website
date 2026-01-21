"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { dagarmyCourses } from "@/data/dagarmy-courses";

export default function DashboardOverview() {
  // Calculate real statistics from DAGARMY data
  const realStats = useMemo(() => {
    const totalStudents = dagarmyCourses.reduce((sum, course) => sum + course.students, 0);
    const totalCourses = dagarmyCourses.length;
    
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
      color: "#8b5cf6"
    },
    {
      title: "Active Courses",
      value: realStats.totalCourses.toString(),
      change: "+3",
      trend: "up",
      icon: "📚",
      color: "#10b981"
    },
    {
      title: "Certifications Issued",
      value: Math.round(realStats.totalStudents * 0.65).toLocaleString(),
      change: "+156",
      trend: "up",
      icon: "🎓",
      color: "#f59e0b"
    },
    {
      title: "Avg Students/Course",
      value: realStats.avgStudentsPerCourse.toLocaleString(),
      change: "+45",
      trend: "up",
      icon: "💼",
      color: "#3b82f6"
    }
  ];

  const recentActivities = [
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
          Welcome back! Here's what's happening with DAGARMY today.
        </p>
      </div>

      {/* Stats Grid */}
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
                >
                  {stat.icon}
                </div>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: stat.trend === 'up' ? '#dcfce7' : '#fee2e2',
                    color: stat.trend === 'up' ? '#16a34a' : '#dc2626',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                {stat.value}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Quick Actions */}
        <div className="col-xl-4">
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              height: '100%'
            }}
          >
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
              Quick Actions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
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
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${action.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}
                  >
                    {action.icon}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {action.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-xl-8">
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e5e7eb'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                Recent Activity
              </h4>
              <Link
                href="/admin/activity"
                style={{
                  fontSize: '14px',
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                View All →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '12px',
                    paddingBottom: '16px',
                    borderBottom: index < recentActivities.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}
                >
                  <div
                    style={{
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
