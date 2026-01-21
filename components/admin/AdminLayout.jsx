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
      description: "Overview & Analytics",
      badge: null
    },
    {
      title: "Courses",
      icon: "📚",
      path: "/admin/courses",
      description: "Manage Courses",
      badge: "36"
    },
    {
      title: "Users",
      icon: "👥",
      path: "/admin/users",
      description: "User Management",
      badge: "1.2K"
    },
    {
      title: "Certifications",
      icon: "🎓",
      path: "/admin/certifications",
      description: "Issue & Track Certificates",
      badge: "23"
    },
    {
      title: "Jobs",
      icon: "💼",
      path: "/admin/jobs",
      description: "Job Postings",
      badge: null
    },
    {
      title: "Mentorship",
      icon: "🤝",
      path: "/admin/mentorship",
      description: "Mentor Programs",
      badge: null
    },
    {
      title: "Hackathons",
      icon: "🏆",
      path: "/admin/hackathons",
      description: "Events & Competitions",
      badge: null
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <style jsx>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '280px' : '72px',
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
          boxShadow: '2px 0 8px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {/* Gradient Accent */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          <div className="d-flex align-items-center justify-content-between" style={{ position: 'relative', zIndex: 1 }}>
            {sidebarOpen && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '2px',
                  color: '#ffffff',
                  letterSpacing: '-0.02em'
                }}>
                  DAGARMY
                </h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0, fontWeight: '500' }}>Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                color: '#ffffff',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav style={{
          padding: '16px 12px',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  marginBottom: '6px',
                  background: isActive ? 'linear-gradient(135deg, #f3f0ff 0%, #faf5ff 100%)' : 'transparent',
                  border: isActive ? '1px solid #e9d5ff' : '1px solid transparent',
                  color: isActive ? '#7c3aed' : '#6b7280',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `slideInLeft 0.4s ease-out ${index * 0.05}s backwards`
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#fafafa';
                    e.currentTarget.style.color = '#111827';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '60%',
                    background: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '0 3px 3px 0'
                  }} />
                )}

                <span style={{
                  fontSize: '22px',
                  flexShrink: 0,
                  transition: 'transform 0.3s ease'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {item.icon}
                </span>

                {sidebarOpen && (
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>
                        {item.description}
                      </div>
                    </div>
                    {item.badge && (
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: isActive ? '#8b5cf6' : '#f3f4f6',
                        color: isActive ? '#ffffff' : '#6b7280',
                        fontSize: '11px',
                        fontWeight: '600',
                        marginLeft: '8px'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            background: '#ffffff',
            animation: 'fadeIn 0.3s ease-out',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
              Logged in as
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '10px',
              background: '#fafafa',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f0ff';
                e.currentTarget.style.borderColor = '#e9d5ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fafafa';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#ffffff',
                  flexShrink: 0
                }}
              >
                A
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>Admin</div>
                <div style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@dagarmy.com</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '280px' : '72px',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '32px',
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
    </div>
  );
}
