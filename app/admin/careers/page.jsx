"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SubAdminLayout from "@/components/admin/SubAdminLayout";
import JobPostingsManager from "@/components/admin/JobPostingsManager";

function ResumeDownload({ filename, label }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/career-resume?file=${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        alert('Could not generate download link. Please try again.');
      }
    } catch (err) {
      alert('Failed to fetch resume link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{ background: 'none', border: 'none', padding: 0, color: '#3b82f6', fontSize: '13px', fontWeight: '500', cursor: loading ? 'wait' : 'pointer', textDecoration: 'underline' }}
    >
      {loading ? 'Generating link...' : `Download ${label}`}
    </button>
  );
}

const STATUS_CONFIG = {
  new:         { label: 'New',         bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  reviewed:    { label: 'Reviewed',    bg: '#fefce8', color: '#a16207', border: '#fde68a' },
  shortlisted: { label: 'Shortlisted', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  rejected:    { label: 'Rejected',    bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
      borderRadius: '6px', fontSize: '12px', fontWeight: '600',
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, color, bg, icon }) {
  return (
    <div style={{ background: '#fff', borderRadius: '14px', padding: '20px 22px', border: '1px solid #e8edf5', display: 'flex', alignItems: 'flex-start', gap: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '3px' }}>{label}</div>
        <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
}

function DetailPanel({ app, onClose, onStatusChange, onNotesSave }) {
  const router = useRouter();
  const [status, setStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.notes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const emailUrl = `/admin/email?composeTo=${encodeURIComponent(app.email)}&composeSubject=${encodeURIComponent('Re: Your application for ' + app.role_title)}`;

  const handleSave = async () => {
    setSaving(true);
    await onStatusChange(app.id, status, notes);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(3px)',
      display: 'flex', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '520px', background: '#fff', height: '100vh',
        overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              {app.department} — {app.region}
            </p>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>{app.role_title}</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Applied {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', flex: 1 }}>
          {/* Email button */}
          <button onClick={() => router.push(emailUrl)} style={{ width: '100%', padding: '10px', borderRadius: '10px', marginBottom: '16px', border: '1.5px solid #6366f1', background: '#eff0ff', color: '#6366f1', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
            <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/><polyline points='22,6 12,13 2,6'/></svg>
            Email Applicant
          </button>

          {/* Applicant info */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px 18px', marginBottom: '20px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Applicant</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Row label="Name" value={app.name} />
              <Row label="Email" value={<a href={`mailto:${app.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{app.email}</a>} />
              {app.phone && <Row label="Phone" value={app.phone} />}
              {app.linkedin_url && (
                <Row label="LinkedIn" value={<a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', wordBreak: 'break-all' }}>View Profile</a>} />
              )}
              {app.resume_url && (
                <Row label="Resume" value={<ResumeDownload filename={app.resume_url} label={app.resume_filename || 'Resume'} />} />
              )}
            </div>
          </div>

          {/* Cover letter */}
          {app.cover_letter && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Cover Letter</p>
              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#374151', lineHeight: '1.7', borderLeft: '3px solid #6366f1', whiteSpace: 'pre-wrap' }}>
                {app.cover_letter}
              </div>
            </div>
          )}

          {/* Status */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>Status</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  style={{
                    padding: '6px 14px', borderRadius: '8px', border: `1.5px solid`,
                    borderColor: status === key ? cfg.color : '#e2e8f0',
                    background: status === key ? cfg.bg : '#fff',
                    color: status === key ? cfg.color : '#64748b',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>Internal Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="Add notes about this applicant..."
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                fontSize: '13px', color: '#0f172a', outline: 'none', resize: 'vertical',
                fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff',
              }}
              onFocus={e => { e.target.style.border = '1.5px solid #6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
              onBlur={e => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              background: saved ? '#10b981' : saving ? '#94a3b8' : '#0f172a',
              color: '#fff', border: 'none', fontSize: '14px', fontWeight: '700',
              cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {saved ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Saved
              </>
            ) : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', minWidth: '70px', paddingTop: '1px' }}>{label}</span>
      <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', flex: 1, wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

export default function AdminCareersPage() {
  const [tab, setTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [search, setSearch] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/careers');
      const data = await res.json();
      if (res.ok) setApplications(data.applications || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleStatusChange = async (id, status, notes) => {
    try {
      const res = await fetch(`/api/admin/careers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status, notes } : a));
        if (selected?.id === id) setSelected(prev => ({ ...prev, status, notes }));
      }
    } catch (err) {
      console.error('Failed to update application:', err);
    }
  };

  const roles = ['all', ...new Set(applications.map(a => a.role_slug))];

  const filtered = applications.filter(a => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (filterRole !== 'all' && a.role_slug !== filterRole) return false;
    if (search && !`${a.name} ${a.email} ${a.role_title}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: applications.length,
    new: applications.filter(a => a.status === 'new').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const filterBtnStyle = (active) => ({
    padding: '6px 14px', borderRadius: '8px', border: '1.5px solid',
    borderColor: active ? '#6366f1' : '#e2e8f0',
    background: active ? '#eff0ff' : '#fff',
    color: active ? '#6366f1' : '#64748b',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
  });

  const tabStyle = (active) => ({
    padding: '10px 22px', borderRadius: '10px', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: '700', transition: 'all 0.15s',
    background: active ? '#0f172a' : 'transparent',
    color: active ? '#fff' : '#64748b',
  });

  return (
    <SubAdminLayout>
      <div style={{ padding: '32px', maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Careers</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Manage job postings and review applicants</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '28px', gap: '2px' }}>
          <button style={tabStyle(tab === 'applications')} onClick={() => setTab('applications')}>Applications</button>
          <button style={tabStyle(tab === 'postings')} onClick={() => setTab('postings')}>Job Postings</button>
        </div>

        {tab === 'postings' && <JobPostingsManager />}

        {tab === 'applications' && <>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard label="Total Applications" value={stats.total} color="#6366f1" bg="#eff0ff"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>}
          />
          <StatCard label="New" value={stats.new} color="#2563eb" bg="#eff6ff"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>}
          />
          <StatCard label="Shortlisted" value={stats.shortlisted} color="#16a34a" bg="#f0fdf4"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
          />
          <StatCard label="Rejected" value={stats.rejected} color="#dc2626" bg="#fef2f2"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
          />
        </div>

        {/* Filters + Search */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8edf5', padding: '16px 20px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '34px', paddingRight: '12px', paddingTop: '9px', paddingBottom: '9px', borderRadius: '9px', border: '1.5px solid #e2e8f0', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              onFocus={e => { e.target.style.border = '1.5px solid #6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; }}
              onBlur={e => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Status:</span>
            <button style={filterBtnStyle(filterStatus === 'all')} onClick={() => setFilterStatus('all')}>All</button>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} style={filterBtnStyle(filterStatus === key)} onClick={() => setFilterStatus(key)}>{cfg.label}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Role:</span>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              style={{ padding: '7px 28px 7px 10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '13px', color: '#374151', background: '#fff', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <option value="all">All Roles</option>
              {roles.filter(r => r !== 'all').map(r => (
                <option key={r} value={r}>{applications.find(a => a.role_slug === r)?.role_title || r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8edf5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.7s linear infinite' }} />
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Loading applications...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}>
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: '600', margin: '0 0 4px' }}>No applications found</p>
              <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0 }}>Try adjusting your filters</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['Applicant', 'Role', 'Region', 'Applied', 'Status', ''].map((h, i) => (
                    <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', background: '#f8fafc', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, idx) => (
                  <tr
                    key={app.id}
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f8fafc' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setSelected(app)}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{app.name}</div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '1px' }}>{app.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '600', color: '#374151', fontSize: '13px' }}>{app.role_title}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '1px' }}>{app.department}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>{app.region || '—'}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={e => { e.stopPropagation(); setSelected(app); }}
                        style={{ background: '#f1f5f9', border: 'none', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#94a3b8', textAlign: 'right' }}>
          Showing {filtered.length} of {applications.length} applications
        </p>

        {selected && (
          <DetailPanel
            app={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        )}
        </>}
      </div>
    </SubAdminLayout>
  );
}
