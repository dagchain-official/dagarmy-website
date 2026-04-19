"use client";
import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

const STATUS_META = {
  pending:    { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Pending' },
  approved:   { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: 'Approved' },
  processing: { color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', label: 'Processing' },
  paid:       { color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0', label: 'Paid' },
  rejected:   { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: 'Rejected' },
};

const METHOD_META = {
  bank:   { label: 'Bank Transfer', color: '#6366f1' },
  crypto: { label: 'USDT (BEP20)', color: '#10b981' },
};

export default function AdminWithdrawalsPage() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionMsg, setActionMsg] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (filterMonth) params.set('month', filterMonth);
      const res = await fetch(`/api/admin/withdrawals?${params}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterMonth]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleAction = async (id, status) => {
    setActionLoading(id + status);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg({ type: 'success', text: `Request marked as ${status}.` });
        setSelectedRequest(null);
        setAdminNote('');
        fetchRequests();
        setTimeout(() => setActionMsg(null), 3000);
      } else {
        setActionMsg({ type: 'error', text: data.error || 'Action failed' });
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: 'Network error' });
    } finally {
      setActionLoading(null);
    }
  };

  const getUserName = (req) => {
    const u = req.users;
    if (!u) return req.user_id?.slice(0, 8) + '...';
    return u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || '-';
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

  return (
    <AdminLayout>
      <div style={{ padding: '32px 36px', background: '#f6f8fb', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              Withdrawal Requests
            </h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '6px 0 0 52px' }}>Manage user USD withdrawal requests</p>
          </div>
          <button onClick={fetchRequests} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Refresh
          </button>
        </div>

        {/* Stats Row */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Total', value: stats.total, color: '#6366f1' },
              { label: 'Pending', value: stats.pending, color: '#d97706' },
              { label: 'Approved', value: stats.approved, color: '#3b82f6' },
              { label: 'Processing', value: stats.processing, color: '#8b5cf6' },
              { label: 'Paid', value: stats.paid, color: '#10b981' },
              { label: 'Rejected', value: stats.rejected, color: '#ef4444' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '16px 18px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '16px 20px', border: '1px solid #f1f5f9', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#0f172a', outline: 'none', background: '#f8fafc', cursor: 'pointer' }}>
              <option value="all">All</option>
              {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Month</label>
            <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
              style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#0f172a', outline: 'none', background: '#f8fafc' }} />
          </div>
          {filterMonth && (
            <button onClick={() => setFilterMonth('')} style={{ fontSize: '12px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear month</button>
          )}
          {stats && <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: '700', color: '#10b981' }}>Total USD: ${stats.totalUsd.toFixed(2)}</span>}
        </div>

        {/* Action Message */}
        {actionMsg && (
          <div style={{ padding: '12px 18px', background: actionMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${actionMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`, borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: '600', color: actionMsg.type === 'success' ? '#065f46' : '#dc2626' }}>
            {actionMsg.text}
          </div>
        )}

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.8fr 0.9fr 1fr 1fr 1.4fr', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
            {['User', 'Month', 'Amount', 'Method', 'Status', 'Requested', 'Actions'].map((h, i) => (
              <span key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: i === 6 ? 'right' : 'left' }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#10b981', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Loading withdrawal requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8' }}>No withdrawal requests found</p>
            </div>
          ) : (
            requests.map((req, idx) => {
              const sm = STATUS_META[req.status] || STATUS_META.pending;
              const mm = METHOD_META[req.payout_method] || METHOD_META.bank;
              const isSelected = selectedRequest?.id === req.id;
              return (
                <React.Fragment key={req.id}>
                  <div
                    style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.8fr 0.9fr 1fr 1fr 1.4fr', padding: '14px 20px', alignItems: 'center', borderBottom: idx < requests.length - 1 ? '1px solid #f8fafc' : 'none', background: isSelected ? '#f8fafc' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#fafafa'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* User */}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{getUserName(req)}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{req.users?.email || '-'}</div>
                    </div>
                    {/* Month */}
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>{req.reward_month}</div>
                    {/* Amount */}
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#10b981' }}>${parseFloat(req.amount_usd).toFixed(2)}</div>
                    {/* Method */}
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: mm.color + '15', color: mm.color }}>{mm.label}</span>
                    </div>
                    {/* Status */}
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: sm.bg, color: sm.color, border: `1px solid ${sm.border}`, textTransform: 'uppercase' }}>{sm.label}</span>
                    </div>
                    {/* Requested */}
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(req.requested_at)}</div>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => { setSelectedRequest(isSelected ? null : req); setAdminNote(req.admin_note || ''); setActionMsg(null); }}
                        style={{ padding: '5px 10px', borderRadius: '7px', border: '1.5px solid #e2e8f0', background: isSelected ? '#f1f5f9' : '#fff', color: '#475569', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        {isSelected ? 'Close' : 'Details'}
                      </button>
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(req.id, 'approved')}
                            disabled={actionLoading === req.id + 'approved'}
                            style={{ padding: '5px 10px', borderRadius: '7px', border: 'none', background: '#3b82f6', color: '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(req.id, 'rejected')}
                            disabled={actionLoading === req.id + 'rejected'}
                            style={{ padding: '5px 10px', borderRadius: '7px', border: 'none', background: '#fef2f2', color: '#ef4444', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {req.status === 'approved' && (
                        <button
                          onClick={() => handleAction(req.id, 'processing')}
                          disabled={actionLoading === req.id + 'processing'}
                          style={{ padding: '5px 10px', borderRadius: '7px', border: 'none', background: '#8b5cf6', color: '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Processing
                        </button>
                      )}
                      {(req.status === 'approved' || req.status === 'processing') && (
                        <button
                          onClick={() => handleAction(req.id, 'paid')}
                          disabled={actionLoading === req.id + 'paid'}
                          style={{ padding: '5px 10px', borderRadius: '7px', border: 'none', background: '#10b981', color: '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isSelected && (
                    <div style={{ padding: '0 20px 20px', background: '#f8fafc', borderBottom: idx < requests.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px' }}>
                        {/* Payment details */}
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
                          <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Payment Details</p>
                          {req.payout_method === 'crypto' ? (
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', marginBottom: '6px' }}>USDT BEP20 Address</div>
                              <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace', wordBreak: 'break-all', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px' }}>{req.bep20_address || '-'}</div>
                            </div>
                          ) : req.bank_snapshot ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {[
                                ['Account Name', req.bank_snapshot.account_name],
                                ['Account Number', req.bank_snapshot.account_number],
                                ['Bank Name', req.bank_snapshot.bank_name],
                                ['Branch', req.bank_snapshot.branch],
                                ['SWIFT / IBAN', req.bank_snapshot.swift_iban],
                              ].filter(([, v]) => v).map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                  <span style={{ color: '#94a3b8', fontWeight: '600' }}>{label}</span>
                                  <span style={{ color: '#0f172a', fontWeight: '700', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                                </div>
                              ))}
                            </div>
                          ) : <p style={{ fontSize: '12px', color: '#94a3b8' }}>No payment snapshot available</p>}
                        </div>

                        {/* Admin note + actions */}
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
                          <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Admin Note</p>
                          <textarea
                            value={adminNote}
                            onChange={e => setAdminNote(e.target.value)}
                            placeholder="Optional note for this action..."
                            rows={3}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                            onFocus={e => e.target.style.borderColor = '#10b981'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                          />
                          <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {req.status === 'pending' && (
                              <>
                                <button onClick={() => handleAction(req.id, 'approved')} disabled={!!actionLoading} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Approve</button>
                                <button onClick={() => handleAction(req.id, 'rejected')} disabled={!!actionLoading} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#ef4444', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Reject</button>
                              </>
                            )}
                            {req.status === 'approved' && (
                              <button onClick={() => handleAction(req.id, 'processing')} disabled={!!actionLoading} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Mark Processing</button>
                            )}
                            {(req.status === 'approved' || req.status === 'processing') && (
                              <button onClick={() => handleAction(req.id, 'paid')} disabled={!!actionLoading} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Mark Paid</button>
                            )}
                          </div>
                          {req.paid_at && <p style={{ fontSize: '11px', color: '#10b981', fontWeight: '600', marginTop: '8px' }}>Paid on {formatDate(req.paid_at)}</p>}
                          {req.admin_note && req.admin_note !== adminNote && <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Previous note: {req.admin_note}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
