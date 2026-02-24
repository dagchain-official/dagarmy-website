"use client";
import React, { useState, useEffect, useCallback } from "react";
import SubAdminLayout from "@/components/admin/SubAdminLayout";

const AVATAR_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#0d9488','#f97316'];
function avatarColor(str) {
  let h = 0;
  for (let i = 0; i < (str||'').length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function getInitials(name, email) {
  const n = (name || email || '?').trim();
  const parts = n.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return n.slice(0, 2).toUpperCase();
}
function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const ROLES = ['All', 'student', 'instructor', 'admin'];
const STATUS_OPTS = ['All', 'active', 'inactive'];

export default function HRDirectoryPage() {
  const [users, setUsers]           = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy]         = useState('newest');
  const [selected, setSelected]     = useState(new Set());
  const [viewUser, setViewUser]     = useState(null);
  const [page, setPage]             = useState(1);
  const [notification, setNotification] = useState('');
  const PER_PAGE = 20;

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const applyFilters = useCallback(() => {
    let list = [...users];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        (u.full_name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      );
    }
    if (roleFilter !== 'All') list = list.filter(u => (u.role || 'student') === roleFilter);
    if (statusFilter !== 'All') {
      const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      list = list.filter(u => {
        const active = new Date(u.last_sign_in_at || u.created_at) > thirtyDaysAgo;
        return statusFilter === 'active' ? active : !active;
      });
    }
    if (sortBy === 'newest')    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === 'oldest')    list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === 'name')      list.sort((a, b) => (a.full_name || a.email || '').localeCompare(b.full_name || b.email || ''));
    if (sortBy === 'lastActive') list.sort((a, b) => new Date(b.last_sign_in_at || b.created_at) - new Date(a.last_sign_in_at || a.created_at));
    setFiltered(list);
    setPage(1);
  }, [users, search, roleFilter, statusFilter, sortBy]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map(u => u.id)));
  };

  const exportCSV = () => {
    const rows = filtered.filter(u => selected.size === 0 || selected.has(u.id));
    const header = ['Name', 'Email', 'Role', 'Joined', 'Last Active'];
    const csv = [header, ...rows.map(u => [
      u.full_name || '', u.email || '', u.role || 'student',
      formatDate(u.created_at), formatDate(u.last_sign_in_at),
    ])].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `hr-directory-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    setNotification(`Exported ${rows.length} records`);
    setTimeout(() => setNotification(''), 3000);
  };

  const isActive = (u) => {
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(u.last_sign_in_at || u.created_at) > thirtyDaysAgo;
  };

  const inputStyle = {
    padding: '9px 14px', border: '1.5px solid #e8edf5', borderRadius: '10px',
    fontSize: '13px', color: '#0f172a', background: '#fff', outline: 'none',
    transition: 'border-color 0.15s', fontFamily: 'inherit',
  };

  return (
    <SubAdminLayout>
      <div style={{ maxWidth: '1280px' }}>

        {/* Header */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px 26px', marginBottom: '20px', border: '1px solid #e8edf5', boxShadow: '0 1px 8px rgba(99,102,241,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <h1 style={{ fontSize: '19px', fontWeight: '800', color: '#0f172a', margin: '0 0 3px', letterSpacing: '-0.4px' }}>Employee Directory</h1>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontWeight: '500' }}>
                {filtered.length} member{filtered.length !== 1 ? 's' : ''} {search || roleFilter !== 'All' || statusFilter !== 'All' ? '(filtered)' : 'total'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {selected.size > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', background: '#eef2ff', borderRadius: '10px', border: '1px solid #c7d2fe' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#6366f1' }}>{selected.size} selected</span>
                <button onClick={() => setSelected(new Set())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0 2px', fontSize: '16px', lineHeight: 1 }}>×</button>
              </div>
            )}
            <button onClick={exportCSV} style={{
              display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px',
              color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(99,102,241,0.3)', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(99,102,241,0.3)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV {selected.size > 0 ? `(${selected.size})` : ''}
            </button>
          </div>
        </div>

        {notification && (
          <div style={{ marginBottom: '16px', padding: '11px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '13px', color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {notification}
          </div>
        )}

        {/* Filters */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8edf5', padding: '14px 18px', marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              style={{ ...inputStyle, paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e8edf5'}
            />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e8edf5'}>
            {ROLES.map(r => <option key={r} value={r}>{r === 'All' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e8edf5'}>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e8edf5'}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A–Z</option>
            <option value="lastActive">Last Active</option>
          </select>
          {(search || roleFilter !== 'All' || statusFilter !== 'All') && (
            <button onClick={() => { setSearch(''); setRoleFilter('All'); setStatusFilter('All'); }}
              style={{ padding: '9px 14px', background: '#f8faff', border: '1.5px solid #c7d2fe', borderRadius: '10px', fontSize: '12px', fontWeight: '600', color: '#6366f1', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8faff'; }}>
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 200px 100px 110px 120px 140px 80px', gap: '0', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e8edf5' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll}
                style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: '#6366f1' }} />
            </div>
            {['Member', 'Email', 'Role', 'DAGChain', 'Status', 'Joined', 'Actions'].map(h => (
              <div key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center' }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '26px', height: '26px', border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Loading members...</span>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>No members found</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>Try adjusting your filters</div>
            </div>
          ) : paginated.map((u, idx) => {
            const active = isActive(u);
            const ac = avatarColor(u.email || u.id);
            return (
              <div key={u.id} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 200px 100px 110px 120px 140px 80px',
                gap: '0', padding: '13px 20px', borderBottom: idx < paginated.length - 1 ? '1px solid #f1f5f9' : 'none',
                background: selected.has(u.id) ? '#eef2ff' : 'transparent',
                transition: 'background 0.1s', alignItems: 'center',
              }}
                onMouseEnter={e => { if (!selected.has(u.id)) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (!selected.has(u.id)) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)}
                    style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: '#6366f1' }} />
                </div>
                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: 0 }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '700', color: '#fff',
                  }}>
                    {getInitials(u.full_name, u.email)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.full_name || '—'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Last active {timeAgo(u.last_sign_in_at)}</div>
                  </div>
                </div>
                {/* Email */}
                <div style={{ fontSize: '12.5px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                {/* Role */}
                <div>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600',
                    background: u.role === 'admin' ? '#eef2ff' : u.role === 'instructor' ? '#f0fdf4' : '#f8fafc',
                    color: u.role === 'admin' ? '#4f46e5' : u.role === 'instructor' ? '#16a34a' : '#64748b',
                  }}>
                    {(u.role || 'student').charAt(0).toUpperCase() + (u.role || 'student').slice(1)}
                  </span>
                </div>
                {/* DAGChain */}
                <div>
                  {u.dagchain_user_id ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      Linked
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#cbd5e1' }}>—</span>
                  )}
                </div>
                {/* Status */}
                <div>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '12px', fontWeight: '600',
                    color: active ? '#16a34a' : '#94a3b8',
                  }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: active ? '#22c55e' : '#cbd5e1', flexShrink: 0 }} />
                    {active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {/* Joined */}
                <div style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(u.created_at)}</div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setViewUser(u)} title="View profile"
                    style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid #e8edf5', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.color = '#6366f1'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#64748b'; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', padding: '0 4px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '7px 14px', border: '1.5px solid #e8edf5', borderRadius: '8px', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#cbd5e1' : '#475569', fontSize: '13px', fontWeight: '600' }}>
                ← Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width: '36px', height: '36px', border: '1.5px solid', borderColor: page === p ? '#6366f1' : '#e8edf5', borderRadius: '8px', background: page === p ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff', cursor: 'pointer', color: page === p ? '#fff' : '#475569', fontSize: '13px', fontWeight: '600', boxShadow: page === p ? '0 2px 8px rgba(99,102,241,0.3)' : 'none' }}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: '7px 14px', border: '1.5px solid #e8edf5', borderRadius: '8px', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#cbd5e1' : '#475569', fontSize: '13px', fontWeight: '600' }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {viewUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setViewUser(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ background: `linear-gradient(135deg, ${avatarColor(viewUser.email || viewUser.id)}, ${avatarColor(viewUser.email || viewUser.id)}cc)`, padding: '28px 28px 20px', position: 'relative' }}>
              <button onClick={() => setViewUser(null)} style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '12px', border: '2px solid rgba(255,255,255,0.4)' }}>
                {getInitials(viewUser.full_name, viewUser.email)}
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{viewUser.full_name || '—'}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{viewUser.email}</div>
            </div>
            {/* Modal body */}
            <div style={{ padding: '24px 28px' }}>
              {[
                { label: 'Role', value: (viewUser.role || 'student').charAt(0).toUpperCase() + (viewUser.role || 'student').slice(1) },
                { label: 'Status', value: isActive(viewUser) ? 'Active' : 'Inactive', isStatus: true, active: isActive(viewUser) },
                { label: 'Joined', value: formatDate(viewUser.created_at) },
                { label: 'Last Active', value: timeAgo(viewUser.last_sign_in_at) },
                { label: 'Referred By', value: viewUser.upline?.referrer_name || '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{row.label}</span>
                  {row.isStatus ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '600', color: row.active ? '#16a34a' : '#94a3b8' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: row.active ? '#22c55e' : '#cbd5e1', display: 'inline-block' }} />
                      {row.value}
                    </span>
                  ) : (
                    <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>{row.value}</span>
                  )}
                </div>
              ))}
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => setViewUser(null)} style={{ flex: 1, padding: '11px', border: '1.5px solid #e8edf5', borderRadius: '10px', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SubAdminLayout>
  );
}
