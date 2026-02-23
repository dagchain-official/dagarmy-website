"use client";
import React, { useState, useEffect } from "react";
import SubAdminLayout from "@/components/admin/SubAdminLayout";
import Link from "next/link";

const MODULE_CARDS = {
  users:          { title: "Users",          desc: "Manage platform users and profiles",         path: "/admin/users",         color: "#6366f1", bg: "#eef2ff", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  courses:        { title: "Courses",        desc: "Manage courses and learning content",        path: "/admin/courses",       color: "#8b5cf6", bg: "#f5f3ff", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  assignments:    { title: "Assignments",    desc: "Review and grade student assignments",       path: "/admin/assignments",   color: "#f59e0b", bg: "#fffbeb", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  certifications: { title: "Certifications", desc: "Issue and manage certificates",             path: "/admin/certifications",color: "#10b981", bg: "#f0fdf4", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> },
  notifications:  { title: "Notifications",  desc: "Send announcements and notifications",      path: "/admin/notifications", color: "#3b82f6", bg: "#eff6ff", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  rewards:        { title: "Rewards",        desc: "Manage points, badges and incentives",      path: "/admin/rewards",       color: "#f97316", bg: "#fff7ed", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> },
  support:        { title: "Support",        desc: "Handle tickets and user inquiries",         path: "/admin/support",       color: "#06b6d4", bg: "#ecfeff", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  payments:       { title: "Withdrawals",    desc: "Review and process withdrawal requests",    path: "/admin/withdrawals",   color: "#10b981", bg: "#f0fdf4", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
  analytics:      { title: "Analytics",      desc: "View reports and platform analytics",       path: "/admin/analytics",     color: "#6366f1", bg: "#eef2ff", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  logs:           { title: "Logs",           desc: "Access system and audit logs",              path: "/admin/logs",          color: "#64748b", bg: "#f8fafc", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
  marketing:      { title: "Marketing",      desc: "Manage campaigns and promotions",           path: "/admin/notifications", color: "#ec4899", bg: "#fdf2f8", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  roles:          { title: "Manage Admins",  desc: "View and manage admin accounts",            path: "/admin/manage-admins", color: "#7c3aed", bg: "#f5f3ff", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
};

const HR_CARDS = [
  { title: "HR Dashboard",       desc: "Stats, recent members, ticket overview",  path: "/admin/hr-dashboard",  color: "#0d9488", bg: "#f0fdfa", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { title: "Employee Directory", desc: "Search, filter, and export member list",   path: "/admin/hr-directory",  color: "#6366f1", bg: "#eef2ff", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { title: "Broadcast",          desc: "Send targeted announcements to members",   path: "/admin/hr-broadcast",  color: "#ec4899", bg: "#fdf2f8", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
];

export default function SubDashboardPage() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permModules, setPermModules] = useState([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    async function load() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (res.ok) {
          const { admin } = await res.json();
          setAdminData(admin);
          const modules = new Set((admin.permissions || []).map(p => p.split('.')[0]));
          setPermModules([...modules]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <SubAdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#0d9488', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </SubAdminLayout>
    );
  }

  const accessibleCards = permModules
    .filter(m => MODULE_CARDS[m])
    .map(m => MODULE_CARDS[m]);

  // Add email card if notifications or marketing
  const hasEmail = permModules.includes('notifications') || permModules.includes('marketing');
  // HR tools if user has users permission
  const hasHR = permModules.includes('users');

  return (
    <SubAdminLayout>
      <div style={{ maxWidth: '1200px' }}>
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0d9488 100%)',
          borderRadius: '20px',
          padding: '36px 40px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(13,148,136,0.15)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', right: '120px',
            width: '160px', height: '160px', borderRadius: '50%',
            background: 'rgba(13,148,136,0.08)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '13px', color: '#0d9488', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              {greeting}
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#f1f5f9', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              {adminData?.full_name || 'Admin'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 14px', borderRadius: '20px',
                background: 'rgba(13,148,136,0.2)', border: '1px solid rgba(13,148,136,0.4)',
                color: '#5eead4', fontSize: '12px', fontWeight: '700',
              }}>
                {adminData?.role_name || 'Sub Admin'}
              </span>
              {adminData?.department_email && (
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                  {adminData.department_email}
                </span>
              )}
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {accessibleCards.length} module{accessibleCards.length !== 1 ? 's' : ''} accessible
              </span>
            </div>
          </div>
        </div>

        {/* Module Cards */}
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px', letterSpacing: '-0.3px' }}>
            Your Modules
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {accessibleCards.map((card) => (
              <Link
                key={card.path + card.title}
                href={card.path}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#fff', borderRadius: '16px', padding: '24px',
                    border: '1px solid #e2e8f0', cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', alignItems: 'flex-start', gap: '16px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.1)`;
                    e.currentTarget.style.borderColor = card.color + '40';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: card.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0, color: card.color,
                  }}>
                    {card.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                      {card.desc}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '4px' }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </Link>
            ))}

            {/* Email card */}
            {hasEmail && (
              <Link href="/admin/email" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: '#fff', borderRadius: '16px', padding: '24px',
                    border: '1px solid #e2e8f0', cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', alignItems: 'flex-start', gap: '16px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#0d948840';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: '#f0fdfa', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0, color: '#0d9488',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      Email
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                      Inbox, compose, sent and more
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '4px' }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </Link>
            )}

            {/* HR cards */}
            {hasHR && HR_CARDS.map(card => (
              <Link key={card.path} href={card.path} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: '#fff', borderRadius: '16px', padding: '24px',
                    border: '1px solid #e2e8f0', cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', alignItems: 'flex-start', gap: '16px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.1)`;
                    e.currentTarget.style.borderColor = card.color + '40';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: card.color }}>
                    {card.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{card.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>{card.desc}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '4px' }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </Link>
            ))}

            {accessibleCards.length === 0 && !hasEmail && !hasHR && (
              <div style={{
                gridColumn: '1 / -1', textAlign: 'center', padding: '60px 40px',
                background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>No modules assigned</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>Contact your master admin to get permissions assigned.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SubAdminLayout>
  );
}
