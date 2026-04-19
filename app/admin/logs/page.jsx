"use client";
import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

const CATEGORIES = [
  { id: 'all',      label: 'All',       color: '#6366f1', bg: '#eef2ff' },
  { id: 'auth',     label: 'Auth',      color: '#0ea5e9', bg: '#f0f9ff' },
  { id: 'rewards',  label: 'Rewards',   color: '#10b981', bg: '#ecfdf5' },
  { id: 'sales',    label: 'Sales',     color: '#f59e0b', bg: '#fffbeb' },
  { id: 'referral', label: 'Referral',  color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'admin',    label: 'Admin',     color: '#ef4444', bg: '#fef2f2' },
  { id: 'system',   label: 'System',    color: '#64748b', bg: '#f8fafc' },
];

const SEVERITIES = [
  { id: 'all',      label: 'All',      color: '#64748b' },
  { id: 'info',     label: 'Info',     color: '#0ea5e9' },
  { id: 'warning',  label: 'Warning',  color: '#f59e0b' },
  { id: 'error',    label: 'Error',    color: '#ef4444' },
  { id: 'critical', label: 'Critical', color: '#7c3aed' },
];

const EVENT_ICONS = {
  user_signup:          { icon: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', color: '#0ea5e9' },
  points_earned:        { icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', color: '#10b981' },
  points_burned:        { icon: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z', color: '#ef4444' },
  points_redeemed:      { icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', color: '#6366f1' },
  admin_points_grant:   { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', color: '#f59e0b' },
  sale_points_granted:  { icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', color: '#0d9488' },
  sale_paid:            { icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', color: '#f59e0b' },
  rank_upgrade:         { icon: 'M6 9l6-6 6 6M6 15l6-6 6 6', color: '#8b5cf6' },
  default:              { icon: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z', color: '#94a3b8' },
};

function EventIcon({ eventType, size = 16 }) {
  const def = EVENT_ICONS[eventType] || EVENT_ICONS.default;
  return (
    <div style={{ width: size + 8, height: size + 8, borderRadius: '8px', background: def.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={def.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={def.icon} />
      </svg>
    </div>
  );
}

function CatBadge({ category }) {
  const cat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  return (
    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: cat.bg, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>
      {cat.label}
    </span>
  );
}

function SevBadge({ severity }) {
  const sev = SEVERITIES.find(s => s.id === severity) || SEVERITIES[1];
  const bg = severity === 'critical' ? '#f5f3ff' : severity === 'error' ? '#fef2f2' : severity === 'warning' ? '#fffbeb' : '#f0f9ff';
  return (
    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: bg, color: sev.color, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>
      {sev.label}
    </span>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)   return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60)   return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)   return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)    return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminLogsPage() {
  const [logs, setLogs]           = useState([]);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory]   = useState('all');
  const [severity, setSeverity]   = useState('all');
  const [from, setFrom]           = useState('');
  const [to, setTo]               = useState('');
  const [expanded, setExpanded]   = useState(null);
  const [autoRefresh, setAutoRefresh]   = useState(false);
  const [showLogForm, setShowLogForm]   = useState(false);
  const [logForm, setLogForm]           = useState({ event_type: '', category: 'admin', description: '', severity: 'info', metadata: '' });
  const [submittingLog, setSubmittingLog] = useState(false);
  const [logFormMsg, setLogFormMsg]     = useState(null);

  const handleManualLog = async (e) => {
    e.preventDefault();
    if (!logForm.event_type.trim() || !logForm.description.trim()) return;
    setSubmittingLog(true);
    setLogFormMsg(null);
    try {
      let metadata = {};
      if (logForm.metadata.trim()) {
        try { metadata = JSON.parse(logForm.metadata); }
        catch { setLogFormMsg({ type: 'error', text: 'Metadata must be valid JSON' }); setSubmittingLog(false); return; }
      }
      const u = JSON.parse(localStorage.getItem('dagarmy_user') || '{}');
      const res = await fetch('/api/admin/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type:   logForm.event_type.trim().toLowerCase().replace(/\s+/g, '_'),
          category:     logForm.category,
          description:  logForm.description.trim(),
          severity:     logForm.severity,
          metadata,
          actor_email:  u.email || null,
          actor_name:   u.full_name || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setLogFormMsg({ type: 'success', text: 'Log entry created successfully' });
      setLogForm({ event_type: '', category: 'admin', description: '', severity: 'info', metadata: '' });
      fetchLogs();
      setTimeout(() => { setShowLogForm(false); setLogFormMsg(null); }, 1500);
    } catch (err) {
      setLogFormMsg({ type: 'error', text: err.message });
    } finally {
      setSubmittingLog(false);
    }
  };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50, category, severity });
      if (search) params.set('search', search);
      if (from)   params.set('from', from);
      if (to)     params.set('to', to);
      const res  = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, category, severity, search, from, to]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchLogs, 10000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchLogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch(''); setSearchInput(''); setCategory('all');
    setSeverity('all'); setFrom(''); setTo(''); setPage(1);
  };

  return (
    <AdminLayout>
      <div style={{ width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #1e293b, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(30,41,59,0.25)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Activity Logs</h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: '450' }}>
                {total.toLocaleString()} total events - every platform action captured
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setShowLogForm(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '10px', border: `1.5px solid ${showLogForm ? '#6366f1' : '#e2e8f0'}`, background: showLogForm ? '#eef2ff' : '#fff', color: showLogForm ? '#6366f1' : '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Log Entry
            </button>
            <button
              onClick={() => setAutoRefresh(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '10px', border: `1.5px solid ${autoRefresh ? '#10b981' : '#e2e8f0'}`, background: autoRefresh ? '#ecfdf5' : '#fff', color: autoRefresh ? '#059669' : '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: autoRefresh ? '#10b981' : '#cbd5e1', boxShadow: autoRefresh ? '0 0 6px #10b981' : 'none', animation: autoRefresh ? 'pulse 1.5s infinite' : 'none' }} />
              {autoRefresh ? 'Live' : 'Auto-refresh'}
            </button>
            <button
              onClick={fetchLogs}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Manual Log Entry Form */}
        {showLogForm && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '1.5px solid #c7d2fe', boxShadow: '0 4px 20px rgba(99,102,241,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Add Manual Log Entry</h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Create a custom activity log entry saved to the activity_logs table</p>
                </div>
              </div>
              <button onClick={() => { setShowLogForm(false); setLogFormMsg(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form onSubmit={handleManualLog}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                {/* Event Type */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '6px' }}>Event Type *</label>
                  <input
                    type="text"
                    placeholder="e.g. manual_audit"
                    value={logForm.event_type}
                    onChange={e => setLogForm(p => ({ ...p, event_type: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                {/* Category */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '6px' }}>Category *</label>
                  <select
                    value={logForm.category}
                    onChange={e => setLogForm(p => ({ ...p, category: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                {/* Severity */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '6px' }}>Severity *</label>
                  <select
                    value={logForm.severity}
                    onChange={e => setLogForm(p => ({ ...p, severity: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  >
                    {SEVERITIES.filter(s => s.id !== 'all').map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                {/* Metadata */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '6px' }}>Metadata <span style={{ fontWeight: '400', textTransform: 'none' }}>(JSON, optional)</span></label>
                  <input
                    type="text"
                    placeholder='{"key": "value"}'
                    value={logForm.metadata}
                    onChange={e => setLogForm(p => ({ ...p, metadata: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '13px', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* Description - full width */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '6px' }}>Description *</label>
                <textarea
                  placeholder="Describe what happened or why this log entry is being created..."
                  value={logForm.description}
                  onChange={e => setLogForm(p => ({ ...p, description: e.target.value }))}
                  required
                  rows={2}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={submittingLog}
                  style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: submittingLog ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: submittingLog ? 'not-allowed' : 'pointer' }}
                >
                  {submittingLog ? 'Saving...' : 'Save Log Entry'}
                </button>
                <button type="button" onClick={() => { setShowLogForm(false); setLogFormMsg(null); }}
                  style={{ padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  Cancel
                </button>
                {logFormMsg && (
                  <span style={{ fontSize: '13px', fontWeight: '600', color: logFormMsg.type === 'success' ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {logFormMsg.type === 'success'
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    }
                    {logFormMsg.text}
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Filters bar */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <form onSubmit={handleSearch}>
            {/* Row 1: search input full width */}
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search by description, user, email, event type..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            {/* Row 2: dates + buttons */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', whiteSpace: 'nowrap' }}>Date range:</span>
              <input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }}
                style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', color: '#475569', flex: '1', minWidth: '140px' }} />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>to</span>
              <input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }}
                style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', color: '#475569', flex: '1', minWidth: '140px' }} />
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ padding: '9px 22px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>Search</button>
                <button type="button" onClick={resetFilters} style={{ padding: '9px 18px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>Reset</button>
              </div>
            </div>
          </form>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Category:</span>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => { setCategory(c.id); setPage(1); }}
                style={{ padding: '5px 14px', borderRadius: '8px', border: `1.5px solid ${category === c.id ? c.color : '#e2e8f0'}`, background: category === c.id ? c.bg : '#fff', color: category === c.id ? c.color : '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                {c.label}
              </button>
            ))}
          </div>
          {/* Severity pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Severity:</span>
            {SEVERITIES.map(s => (
              <button key={s.id} onClick={() => { setSeverity(s.id); setPage(1); }}
                style={{ padding: '5px 14px', borderRadius: '8px', border: `1.5px solid ${severity === s.id ? s.color : '#e2e8f0'}`, background: severity === s.id ? s.color + '18' : '#fff', color: severity === s.id ? s.color : '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logs table */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 180px 110px 100px 150px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['', 'Event / Description', 'Actor', 'Category', 'Severity', 'Time'].map((h, i) => (
              <span key={i} style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: i >= 4 ? 'right' : 'left' }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid #f1f5f9', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Loading logs...</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
            </div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>No logs found</p>
              <p style={{ fontSize: '12px', margin: '4px 0 0' }}>Try adjusting your filters or run the migration to start capturing events</p>
            </div>
          ) : (
            logs.map((log, idx) => {
              const isExp = expanded === log.id;
              const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0;
              return (
                <div key={log.id}>
                  <div
                    style={{ display: 'grid', gridTemplateColumns: '44px 1fr 180px 110px 100px 150px', padding: '13px 20px', alignItems: 'center', borderBottom: '1px solid #f8fafc', cursor: hasMetadata ? 'pointer' : 'default', transition: 'background 0.15s' }}
                    onClick={() => hasMetadata && setExpanded(isExp ? null : log.id)}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    {/* Icon */}
                    <EventIcon eventType={log.event_type} size={15} />

                    {/* Description */}
                    <div style={{ minWidth: 0, paddingRight: '12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.description}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace', letterSpacing: '0.2px' }}>{log.event_type}</div>
                    </div>

                    {/* Actor */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.actor_name || '-'}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.actor_email || ''}</div>
                    </div>

                    {/* Category */}
                    <CatBadge category={log.category} />

                    {/* Severity */}
                    <div style={{ textAlign: 'right' }}>
                      <SevBadge severity={log.severity} />
                    </div>

                    {/* Time */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>{timeAgo(log.created_at)}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(log.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>

                  {/* Expanded metadata */}
                  {isExp && hasMetadata && (
                    <div style={{ padding: '12px 20px 16px 64px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Metadata</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {Object.entries(log.metadata).map(([k, v]) => (
                          <div key={k} style={{ padding: '6px 12px', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                            <span style={{ color: '#94a3b8', fontWeight: '600' }}>{k}: </span>
                            <span style={{ color: '#0f172a', fontWeight: '700' }}>{String(v)}</span>
                          </div>
                        ))}
                        {log.ip_address && (
                          <div style={{ padding: '6px 12px', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                            <span style={{ color: '#94a3b8', fontWeight: '600' }}>ip: </span>
                            <span style={{ color: '#0f172a', fontWeight: '700' }}>{log.ip_address}</span>
                          </div>
                        )}
                        <div style={{ padding: '6px 12px', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                          <span style={{ color: '#94a3b8', fontWeight: '600' }}>log_id: </span>
                          <span style={{ color: '#0f172a', fontWeight: '700', fontFamily: 'monospace' }}>{log.id}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '0 4px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
              Showing {((page - 1) * 50) + 1}–{Math.min(page * 50, total)} of {total.toLocaleString()} events
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setPage(1)} disabled={page === 1}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: page === 1 ? '#f8fafc' : '#fff', color: page === 1 ? '#cbd5e1' : '#475569', fontSize: '12px', fontWeight: '700', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>«</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: page === 1 ? '#f8fafc' : '#fff', color: page === 1 ? '#cbd5e1' : '#475569', fontSize: '12px', fontWeight: '700', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const p = Math.max(1, Math.min(pages - 4, page - 2)) + i;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ padding: '7px 12px', borderRadius: '8px', border: `1.5px solid ${p === page ? '#6366f1' : '#e2e8f0'}`, background: p === page ? '#eef2ff' : '#fff', color: p === page ? '#6366f1' : '#475569', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>{p}</button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: page === pages ? '#f8fafc' : '#fff', color: page === pages ? '#cbd5e1' : '#475569', fontSize: '12px', fontWeight: '700', cursor: page === pages ? 'not-allowed' : 'pointer' }}>Next</button>
              <button onClick={() => setPage(pages)} disabled={page === pages}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: page === pages ? '#f8fafc' : '#fff', color: page === pages ? '#cbd5e1' : '#475569', fontSize: '12px', fontWeight: '700', cursor: page === pages ? 'not-allowed' : 'pointer' }}>»</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
