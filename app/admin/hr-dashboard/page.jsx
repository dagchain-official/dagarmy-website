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
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
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
            {trend >= 0
              ? <polyline points="18 15 12 9 6 15"/>
              : <polyline points="6 9 12 15 18 9"/>}
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
            transition: 'height 0.4s ease',
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

export default function HRDashboardPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');

    Promise.all([
      fetch('/api/admin/hr-stats').then(r => r.json()),
      fetch('/api/admin/auth/me').then(r => r.json()),
    ]).then(([hrData, meData]) => {
      setData(hrData);
      setAdminData(meData.admin);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <SubAdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#0d9488', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </SubAdminLayout>
  );

  const s = data?.stats || {};

  return (
    <SubAdminLayout>
      <div style={{ maxWidth: '1280px' }}>

        {/* Welcome Banner */}
        <div style={{
          background: '#fff', borderRadius: '20px', padding: '28px 32px', marginBottom: '28px',
          border: '1px solid #e8edf5', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
              background: 'linear-gradient(135deg, #0d9488, #0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(13,148,136,0.25)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#0d9488', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '3px' }}>{greeting}</div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.4px' }}>
                {adminData?.full_name || 'HR Admin'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 10px', borderRadius: '20px', background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0d9488', fontSize: '11px', fontWeight: '700' }}>
                  {adminData?.role_name || 'HR Admin'}
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {s.newToday > 0 ? `${s.newToday} new member${s.newToday > 1 ? 's' : ''} joined today` : 'No new members today'}
                </span>
              </div>
            </div>
          </div>
          {s.openTickets > 0 && (
            <div style={{ padding: '12px 20px', borderRadius: '14px', background: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#dc2626', lineHeight: 1 }}>{s.openTickets}</div>
              <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600', marginTop: '2px' }}>Open Ticket{s.openTickets > 1 ? 's' : ''}</div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[
            { label: 'Employee Directory', path: '/admin/hr-directory', color: '#6366f1', bg: '#eef2ff', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
            { label: 'Send Broadcast', path: '/admin/hr-broadcast', color: '#0d9488', bg: '#f0fdfa', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
            { label: 'Support Tickets', path: '/admin/support', color: '#f59e0b', bg: '#fffbeb', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
            { label: 'Activity Logs', path: '/admin/logs', color: '#64748b', bg: '#f8fafc', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
            { label: 'Analytics', path: '/admin/analytics', color: '#8b5cf6', bg: '#f5f3ff', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
          ].map(a => (
            <Link key={a.path} href={a.path} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 16px', background: '#fff',
                border: '1px solid #e8edf5', borderRadius: '12px',
                cursor: 'pointer', transition: 'all 0.15s',
                fontSize: '13px', fontWeight: '600', color: '#374151',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = a.bg; e.currentTarget.style.borderColor = a.color + '40'; e.currentTarget.style.color = a.color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span style={{ color: a.color }}>{a.icon}</span>
                {a.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
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

        {/* Bottom two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

          {/* Recent Members */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Recent Members</div>
              <Link href="/admin/hr-directory" style={{ fontSize: '12px', color: '#0d9488', fontWeight: '600', textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ padding: '8px 0' }}>
              {(data?.recentUsers || []).map(u => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    background: avatarColor(u.email || u.id),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '700', color: '#fff',
                  }}>
                    {getInitials(u.full_name, u.email)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.full_name || u.email}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', flexShrink: 0 }}>{timeAgo(u.created_at)}</div>
                </div>
              ))}
              {!data?.recentUsers?.length && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No members yet</div>
              )}
            </div>
          </div>

          {/* Right column: chart + tickets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Signup chart */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', padding: '18px 20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Member Growth</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>New signups - last 6 months</div>
              <MiniBar data={data?.monthlySignups} />
            </div>

            {/* Recent tickets */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', overflow: 'hidden', flex: 1 }}>
              <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Recent Tickets</div>
                <Link href="/admin/support" style={{ fontSize: '12px', color: '#0d9488', fontWeight: '600', textDecoration: 'none' }}>View all →</Link>
              </div>
              <div style={{ padding: '8px 0' }}>
                {(data?.recentTickets || []).map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.subject || 'No subject'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{timeAgo(t.created_at)}</div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
                {!data?.recentTickets?.length && (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No tickets</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubAdminLayout>
  );
}
