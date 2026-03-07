"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const MODULE_NAV = {
  users:          { title: "Users",          path: "/admin/users",         icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  courses:        { title: "Courses",        path: "/admin/courses",       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  assignments:    { title: "Assignments",    path: "/admin/assignments",   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  certifications: { title: "Certifications", path: "/admin/certifications",icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> },
  notifications:  { title: "Notifications",  path: "/admin/notifications", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  rewards:        { title: "Rewards",        path: "/admin/rewards",       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> },
  analytics:      { title: "Analytics",      path: "/admin/analytics",     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  support:        { title: "Support",        path: "/admin/support",       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  payments:       { title: "Withdrawals",    path: "/admin/withdrawals",   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
  logs:           { title: "Logs",           path: "/admin/logs",          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg> },
  marketing:      { title: "Marketing",      path: "/admin/notifications", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  roles:          { title: "Manage Admins",  path: "/admin/manage-admins", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg> },
};

export default function SubAdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) {
          router.push('/admin/auth-login');
          return;
        }
        const { admin } = await res.json();
        setAdminData(admin);

        // Build menu from permissions
        const permModules = new Set(
          (admin.permissions || []).map(p => p.split('.')[0])
        );

        const items = [{ title: "Dashboard", path: "/admin/sub-dashboard", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> }];

        Object.entries(MODULE_NAV).forEach(([moduleKey, nav]) => {
          if (permModules.has(moduleKey)) {
            items.push(nav);
          }
        });

        // Always add email if notifications permission exists
        if (permModules.has('notifications') || permModules.has('marketing')) {
          items.push({
            title: "Email",
            path: "/admin/email",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          });
        }

        // HR tools for users with users.read
        if (permModules.has('users')) {
          items.push({
            title: "Employee Directory",
            path: "/admin/hr-directory",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          });
        }
        if (permModules.has('notifications') || permModules.has('users')) {
          items.push({
            title: "Broadcast",
            path: "/admin/hr-broadcast",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          });
        }

        if (permModules.has('users')) {
          items.push({
            title: "Careers",
            path: "/admin/careers",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
          });
        }

        setMenuItems(items);
      } catch (err) {
        console.error('SubAdminLayout session error:', err);
        router.push('/admin/auth-login');
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dagarmy_role');
    localStorage.removeItem('dagarmy_authenticated');
    localStorage.removeItem('dagarmy_user');
    localStorage.removeItem('admin_user');
    document.cookie = 'dagarmy_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'dagarmy_authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/auth-login');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(180deg,#f8faff 0%,#f1f5fd 100%)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.7s linear infinite' }} />
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.3px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f8' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '256px' : '68px',
        background: 'linear-gradient(180deg,#f8faff 0%,#f1f5fd 100%)',
        transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
        position: 'fixed', height: '100vh', zIndex: 1000,
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid #e8edf5',
        boxShadow: '4px 0 20px rgba(99,102,241,0.06)',
      }}>

        {/* Header */}
        <div style={{
          padding: sidebarOpen ? '22px 18px 18px' : '22px 12px 18px',
          borderBottom: '1px solid #e8edf5',
          display: 'flex', alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>DAGARMY</div>
                <div style={{ fontSize: '10px', color: '#6366f1', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  {adminData?.role_name || 'Admin Panel'}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{
              width: '30px', height: '30px', background: 'rgba(255,255,255,0.8)',
              border: '1px solid #e8edf5', borderRadius: '8px', cursor: 'pointer',
              color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#e8edf5'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: sidebarOpen ? '12px 10px' : '12px 8px' }}>

          {/* Group: Main */}
          {sidebarOpen && (
            <div style={{ padding: '4px 10px 6px', fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Main
            </div>
          )}

          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/admin/sub-dashboard' && pathname.startsWith(item.path + '/'));
            return (
              <Link
                key={item.path + item.title}
                href={item.path}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: sidebarOpen ? '10px' : '0',
                  padding: sidebarOpen ? '9px 12px' : '10px',
                  borderRadius: '10px', marginBottom: '2px',
                  background: isActive ? '#fff' : 'transparent',
                  color: isActive ? '#6366f1' : '#64748b',
                  textDecoration: 'none', transition: 'all 0.15s',
                  border: 'none',
                  boxShadow: isActive ? '0 1px 8px rgba(99,102,241,0.12)' : 'none',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = '#334155'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: '3px', height: '55%', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)',
                    borderRadius: '0 3px 3px 0',
                  }} />
                )}
                <span style={{
                  width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? '#eef2ff' : 'transparent',
                  color: isActive ? '#6366f1' : 'inherit',
                  transition: 'all 0.15s',
                }}>
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span style={{ fontSize: '13px', fontWeight: isActive ? '600' : '500', letterSpacing: '-0.1px', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 10px 16px', borderTop: '1px solid #e8edf5' }}>
          {sidebarOpen && adminData && (
            <div style={{
              background: '#fff', borderRadius: '12px', padding: '11px 12px',
              border: '1px solid #e8edf5', marginBottom: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700', color: '#fff',
                }}>
                  {(adminData.full_name || 'A').charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {adminData.full_name || 'Admin'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#6366f1', fontWeight: '600', letterSpacing: '0.2px' }}>
                    {adminData.role_name}
                  </div>
                </div>
              </div>
              {adminData.department_email && (
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {adminData.department_email}
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: sidebarOpen ? '9px' : '10px',
              borderRadius: '9px', border: '1px solid #fecaca',
              background: '#fef2f2', color: '#ef4444',
              fontSize: '12.5px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {sidebarOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? '256px' : '68px',
        transition: 'margin-left 0.35s cubic-bezier(0.4,0,0.2,1)',
        padding: '32px 36px',
        minHeight: '100vh',
        background: '#f0f2f8',
      }}>
        {children}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
