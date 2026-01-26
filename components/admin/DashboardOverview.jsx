"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { dagarmyCourses } from "@/data/dagarmy-courses";

export default function DashboardOverview() {
  const realStats = useMemo(() => {
    const totalStudents = dagarmyCourses.reduce((sum, course) => sum + course.students, 0);
    const totalCourses = dagarmyCourses.length;
    const certifications = Math.round(totalStudents * 0.65);
    const avgStudents = Math.round(totalStudents / totalCourses);

    return {
      totalStudents,
      totalCourses,
      certifications,
      avgStudents
    };
  }, []);

  const stats = [
    {
      label: "TOTAL USERS",
      value: realStats.totalStudents.toLocaleString(),
      change: "+12.5%",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: "#111827"
    },
    {
      label: "ACTIVE COURSES",
      value: realStats.totalCourses,
      change: "+3",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      color: "#10b981"
    },
    {
      label: "CERTIFICATIONS ISSUED",
      value: realStats.certifications.toLocaleString(),
      change: "+156",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
      color: "#f59e0b"
    },
    {
      label: "AVG STUDENTS/COURSE",
      value: realStats.avgStudents.toLocaleString(),
      change: "+45",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      color: "#ec4899"
    }
  ];

  const quickActions = [
    {
      title: "Add New Course",
      description: "Create course content",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
      path: "/admin/courses/add"
    },
    {
      title: "Issue Certificate",
      description: "Award completion",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
      path: "/admin/certifications"
    },
    {
      title: "Manage Users",
      description: "User administration",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
      ),
      path: "/admin/users"
    }
  ];

  const recentActivity = [
    {
      message: "New user registration: john.doe@gmail.com",
      time: "5 min ago",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      )
    },
    {
      message: "Course 'Advanced AI' published",
      time: "12 min ago",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    },
    {
      message: "Certificate issued to Sarah Johnson",
      time: "25 min ago",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      )
    },
    {
      message: "New job posting: ML Engineer at TechCorp",
      time: "1 hour ago",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#212529',
          marginBottom: '6px'
        }}>
          Dashboard Overview
        </h1>
        <p style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>
          Welcome back! Here's what's happening with DAGARMY today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-md-6">
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e9ecef',
                height: '100%'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                marginBottom: '16px'
              }}>
                {stat.icon}
              </div>

              <div style={{
                fontSize: '11px',
                color: '#6c757d',
                marginBottom: '8px',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}>
                {stat.label}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#212529',
                  lineHeight: 1
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#10b981'
                }}>
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Quick Actions */}
        <div className="col-lg-6">
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e9ecef',
              height: '100%'
            }}
          >
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#212529',
              marginBottom: '20px',
              margin: 0
            }}>
              Quick Actions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    textDecoration: 'none',
                    background: '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8f9fa';
                    e.currentTarget.style.borderColor = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e9ecef';
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#f8f5ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111827',
                    flexShrink: 0
                  }}>
                    {action.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#212529', marginBottom: '2px' }}>
                      {action.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                      {action.description}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-6">
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e9ecef',
              height: '100%'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#212529',
                margin: 0
              }}>
                Recent Activity
              </h3>
              <Link
                href="/admin/activity"
                style={{
                  fontSize: '13px',
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                View All →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentActivity.map((activity, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6c757d',
                    flexShrink: 0
                  }}>
                    {activity.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#212529', marginBottom: '4px', lineHeight: '1.4' }}>
                      {activity.message}
                    </div>
                    <div style={{ fontSize: '11px', color: '#adb5bd' }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
