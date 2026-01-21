"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      title: "Dashboard",
      icon: "📊",
      path: "/admin/dashboard",
      description: "Overview & Analytics"
    },
    {
      title: "Courses",
      icon: "📚",
      path: "/admin/courses",
      description: "Manage Courses"
    },
    {
      title: "Users",
      icon: "👥",
      path: "/admin/users",
      description: "User Management"
    },
    {
      title: "Certifications",
      icon: "🎓",
      path: "/admin/certifications",
      description: "Issue & Track Certificates"
    },
    {
      title: "Jobs",
      icon: "💼",
      path: "/admin/jobs",
      description: "Job Postings"
    },
    {
      title: "Mentorship",
      icon: "🤝",
      path: "/admin/mentorship",
      description: "Mentor Programs"
    },
    {
      title: "Hackathons",
      icon: "🏆",
      path: "/admin/hackathons",
      description: "Events & Competitions"
    },
    {
      title: "Analytics",
      icon: "📈",
      path: "/admin/analytics",
      description: "Platform Insights"
    },
    {
      title: "Settings",
      icon: "⚙️",
      path: "/admin/settings",
      description: "Platform Configuration"
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '280px' : '80px',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="d-flex align-items-center justify-content-between">
            {sidebarOpen && (
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: '#fff' }}>
                  DAGARMY
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '16px' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  background: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                  color: isActive ? '#a78bfa' : '#cbd5e1',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
              Logged in as
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700'
                }}
              >
                A
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Admin</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>admin@dagarmy.com</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '280px' : '80px',
          transition: 'margin-left 0.3s ease',
          padding: '32px',
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
    </div>
  );
}
