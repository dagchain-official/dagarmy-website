"use client";
import React, { useState, useEffect } from "react";
import SubAdminLayout from "@/components/admin/SubAdminLayout";
import Link from "next/link";

function StatCard({ label, value, sub, color, bg, icon, trend }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '16px', padding: '22px 24px',
      border: '1px solid #e8edf5', display: 'flex', alignItems: 'flex-start',
      gap: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{sub}</div>}
      </div>
      {trend !== undefined && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '3px',
          padding: '4px 8px', borderRadius: '20px',
          background: trend >= 0 ? '#f0fdf4' : '#fef2f2',
          color: trend >= 0 ? '#16a34a' : '#dc2626',
          fontSize: '12px', fontWeight: '700', flexShrink: 0,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            {trend >= 0 ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
          </svg>
          {Math.abs(trend)}
        </div>
      )}
    </div>
  );
}

function MiniBar({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: '100%', borderRadius: '4px 4px 0 0',
            background: i === data.length - 1 ? '#0d9488' : '#e2e8f0',
            height: `${Math.max(4, (d.count / max) * 52)}px`,
          }} title={`${d.month}: ${d.count}`} />
          <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '600' }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    open:        { bg: '#fef2f2', color: '#dc2626', label: 'Open' },
    in_progress: { bg: '#fffbeb', color: '#d97706', label: 'In Progress' },
    resolved:    { bg: '#f0fdf4', color: '#16a34a', label: 'Resolved' },
    closed:      { bg: '#f8fafc', color: '#64748b', label: 'Closed' },
  };
  const s = map[status] || map.open;
  return (
    <span style={{ padding: '2px 8px', borderRadius: '20px', background: s.bg, color: s.color, fontSize: '11px', fontWeight: '700' }}>
      {s.label}
    </span>
  );
}

function getInitials(name, email) {
  const n = name || email || '?';
  const parts = n.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return n.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#0d9488','#f97316'];
function avatarColor(str) {
  let h = 0;
  for (let i = 0; i < (str||'').length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

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
  { title: "Employee Directory", desc: "Search, filter, and export member list",   path: "/admin/hr-directory",  color: "#6366f1", bg: "#eef2ff", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { title: "Broadcast",          desc: "Send targeted announcements to members",   path: "/admin/hr-broadcast",  color: "#ec4899", bg: "#fdf2f8", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
];

export default function SubDashboardPage() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permModules, setPermModules] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [hrData, setHrData] = useState(null);

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
          if (modules.has('users')) {
            fetch('/api/admin/hr-stats').then(r => r.json()).then(setHrData).catch(() => {});
          }
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
          <div style={{ width: '34px', height: '34px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
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
      <div style={{ maxWidth: '1280px' }}>

        {/* Welcome Banner */}
        <div style={{
          background: '#fff', borderRadius: '18px', padding: '24px 28px',
          marginBottom: '28px', border: '1px solid #e8edf5',
          boxShadow: '0 1px 8px rgba(99,102,241,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '3px' }}>{greeting}</div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 5px', letterSpacing: '-0.4px' }}>
                {adminData?.full_name || 'Admin'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 10px', borderRadius: '20px', background: '#eef2ff', border: '1px solid #c7d2fe', color: '#6366f1', fontSize: '11px', fontWeight: '700' }}>
                  {adminData?.role_name || 'Sub Admin'}
                </span>
                {adminData?.department_email && (
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{adminData.department_email}</span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'Modules', value: accessibleCards.length, color: '#6366f1', bg: '#eef2ff' },
              ...(hasHR && hrData?.stats ? [{ label: 'Members', value: hrData.stats.totalUsers ?? '-', color: '#0d9488', bg: '#f0fdfa' }] : []),
              ...(hasHR && hrData?.stats?.openTickets ? [{ label: 'Open Tickets', value: hrData.stats.openTickets, color: '#f59e0b', bg: '#fffbeb' }] : []),
            ].map(s => (
              <div key={s.label} style={{ padding: '10px 18px', borderRadius: '12px', background: s.bg, border: `1px solid ${s.color}20`, textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '10.5px', color: s.color, fontWeight: '600', marginTop: '2px', opacity: 0.8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HR Stats Section - shown inline when user has HR/users permission */}
        {hasHR && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '3px', height: '18px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', borderRadius: '2px' }} />
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>HR Overview</h2>
            </div>

            {/* Stat Cards */}
            {(() => {
              const s = hrData?.stats || {};
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <StatCard label="Total Members" value={s.totalUsers ?? '-'} sub={`${s.activeThisMonth ?? 0} active this month`} color="#6366f1" bg="#eef2ff" trend={s.newThisWeek}
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                  />
                  <StatCard label="New This Week" value={s.newThisWeek ?? '-'} sub={`${s.newThisMonth ?? 0} this month`} color="#0d9488" bg="#f0fdfa" trend={s.newToday}
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
                  />
                  <StatCard label="Open Tickets" value={s.openTickets ?? '-'} sub={`${s.resolvedThisWeek ?? 0} resolved this week`} color="#f59e0b" bg="#fffbeb"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
                  />
                  <StatCard label="Certs Issued" value={s.certsThisMonth ?? '-'} sub="this month" color="#10b981" bg="#f0fdf4"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>}
                  />
                </div>
              );
            })()}

            {/* Recent Members + Chart + Tickets */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Recent Members */}
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Recent Members</div>
                  <Link href="/admin/hr-directory" style={{ fontSize: '12px', color: '#0d9488', fontWeight: '600', textDecoration: 'none' }}>View all →</Link>
                </div>
                <div style={{ padding: '6px 0' }}>
                  {(hrData?.recentUsers || []).map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 20px', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0, background: avatarColor(u.email || u.id), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff' }}>
                        {getInitials(u.full_name, u.email)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name || u.email}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                      </div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', flexShrink: 0 }}>{timeAgo(u.created_at)}</div>
                    </div>
                  ))}
                  {!hrData?.recentUsers?.length && (
                    <div style={{ padding: '28px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No members yet</div>
                  )}
                </div>
              </div>

              {/* Right: Chart + Tickets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', padding: '16px 20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Member Growth</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>New signups - last 6 months</div>
                  <MiniBar data={hrData?.monthlySignups} />
                </div>
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', overflow: 'hidden', flex: 1 }}>
                  <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Recent Tickets</div>
                    <Link href="/admin/support" style={{ fontSize: '12px', color: '#0d9488', fontWeight: '600', textDecoration: 'none' }}>View all →</Link>
                  </div>
                  <div style={{ padding: '6px 0' }}>
                    {(hrData?.recentTickets || []).map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 20px', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject || 'No subject'}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{timeAgo(t.created_at)}</div>
                        </div>
                        <StatusBadge status={t.status} />
                      </div>
                    ))}
                    {!hrData?.recentTickets?.length && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No tickets</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module Cards */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '3px', height: '18px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Your Modules</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {accessibleCards.map((card) => (
              <Link key={card.path + card.title} href={card.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', borderRadius: '14px', padding: '20px 22px',
                  border: '1px solid #e8edf5', cursor: 'pointer',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: '14px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.08)`; e.currentTarget.style.borderColor = card.color + '50'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = '#e8edf5'; }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: card.color }}>
                    {card.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '3px' }}>{card.title}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>{card.desc}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '3px' }}><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </Link>
            ))}

            {/* Email card */}
            {hasEmail && (
              <Link href="/admin/email" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', borderRadius: '14px', padding: '20px 22px',
                  border: '1px solid #e8edf5', cursor: 'pointer',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: '14px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#6366f150'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = '#e8edf5'; }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#6366f1' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '3px' }}>Email</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>Inbox, compose, sent and more</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '3px' }}><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </Link>
            )}

            {/* HR cards */}
            {hasHR && HR_CARDS.map(card => (
              <Link key={card.path} href={card.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', borderRadius: '14px', padding: '20px 22px',
                  border: '1px solid #e8edf5', cursor: 'pointer',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: '14px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.08)`; e.currentTarget.style.borderColor = card.color + '50'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = '#e8edf5'; }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: card.color }}>
                    {card.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '3px' }}>{card.title}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>{card.desc}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '3px' }}><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </Link>
            ))}

            {accessibleCards.length === 0 && !hasEmail && !hasHR && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '56px 40px', background: '#fff', borderRadius: '14px', border: '1px solid #e8edf5', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>No modules assigned</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>Contact your master admin to get permissions assigned.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SubAdminLayout>
  );
}
