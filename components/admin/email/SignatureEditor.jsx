"use client";
import React, { useState, useEffect } from "react";

const MAIL_ICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/%3E%3Cpolyline points='22,6 12,13 2,6'/%3E%3C/svg%3E`;
const PHONE_ICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.56 2 2 0 0 1 3.6 1.37h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'/%3E%3C/svg%3E`;
const WEB_ICON  = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E`;

// Single icon row — NO wrapper table, just a <tr> to be placed inside one shared contacts table
const iRow = (src, content) =>
  `<tr>
    <td style="border:none;padding:4px 12px 4px 0;vertical-align:middle;white-space:nowrap;">
      <img src="${src}" width="14" height="14" alt="" style="display:inline-block;vertical-align:middle;margin-right:6px;"><span style="font-size:12.5px;color:#475569;vertical-align:middle;">${content}</span>
    </td>
  </tr>`;

// Wraps icon rows into ONE table — no gaps between rows
const contacts = (email, phone) =>
  `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:none;margin-top:10px;">
    ${iRow(MAIL_ICON, `<a href="mailto:${email||''}" style="color:#475569;text-decoration:none;">${email||'email@dagchain.network'}</a>`)}
    ${phone ? iRow(PHONE_ICON, `<span style="color:#475569;">${phone}</span>`) : ''}
    ${iRow(WEB_ICON, `<a href="https://dagchain.network" style="color:#6366f1;font-weight:700;text-decoration:none;">dagchain.network</a>`)}
  </table>`;

const DEFAULT_TEMPLATES = [
  {
    label: "Executive",
    html: (name, role, email, phone, dept) =>
      `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;border-collapse:collapse;border:none;max-width:420px;">
  <tbody>
    <tr><td style="border:none;padding:0;height:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6);font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td style="border:none;padding:14px 0 0;">
      <div style="font-size:17px;font-weight:800;color:#0f172a;margin:0;line-height:1.2;">${name||'Your Name'}</div>
      <div style="font-size:11px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:1px;margin-top:3px;">${role||'Admin'}${dept?' &bull; '+dept:''}</div>
      ${contacts(email, phone)}
      <div style="margin-top:10px;font-size:10px;font-weight:600;color:#cbd5e1;letter-spacing:1.5px;text-transform:uppercase;">DAGCHAIN NETWORK</div>
    </td></tr>
  </tbody>
</table>`,
  },
  {
    label: "Bold Accent",
    html: (name, role, email, phone, dept) =>
      `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;border-collapse:collapse;border:none;max-width:420px;">
  <tbody>
    <tr>
      <td style="border:none;padding:0;width:3px;background:linear-gradient(180deg,#6366f1,#8b5cf6);border-radius:2px;" rowspan="1">&nbsp;</td>
      <td style="border:none;padding:12px 0 14px 14px;">
        <div style="font-size:10px;font-weight:800;color:#6366f1;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">DAGCHAIN NETWORK</div>
        <div style="font-size:18px;font-weight:800;color:#0f172a;line-height:1.15;">${name||'Your Name'}</div>
        <div style="font-size:12px;color:#64748b;margin-top:2px;">${role||'Admin'}${dept?' &mdash; '+dept:''}</div>
        ${contacts(email, phone)}
      </td>
    </tr>
  </tbody>
</table>`,
  },
  {
    label: "Dark Banner",
    html: (name, role, email, phone, dept) =>
      `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;border-collapse:collapse;border:none;max-width:420px;">
  <tbody>
    <tr><td style="border:none;background:linear-gradient(135deg,#0f172a,#1e1b4b);padding:14px 18px;border-radius:8px 8px 0 0;">
      <div style="font-size:17px;font-weight:800;color:#fff;line-height:1.2;">${name||'Your Name'}</div>
      <div style="font-size:10px;font-weight:700;color:#a5b4fc;letter-spacing:1.2px;text-transform:uppercase;margin-top:4px;">${role||'Admin'}${dept?' &bull; '+dept:''}</div>
    </td></tr>
    <tr><td style="border:none;background:#f8faff;padding:12px 18px 14px;border-radius:0 0 8px 8px;">
      ${contacts(email, phone)}
    </td></tr>
  </tbody>
</table>`,
  },
];

export default function SignatureEditor() {
  const [name, setName]               = useState('');
  const [role, setRole]               = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [dept, setDept]               = useState('');
  const [saving, setSaving]           = useState(false);
  const [savedSig, setSavedSig]       = useState('');
  const [toast, setToast]             = useState(null);
  const [activeTab, setActiveTab]     = useState('builder');
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [customHtml, setCustomHtml]   = useState('');

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.admin) {
          setName(d.admin.full_name || '');
          setRole(d.admin.role_name || d.admin.role || '');
          setEmail(d.admin.department_email || d.admin.email || '');
          setDept(d.admin.department || '');
        }
      });
    fetch('/api/admin/email/signature')
      .then(r => r.json())
      .then(d => {
        if (d.signature) {
          setSavedSig(d.signature);
          setCustomHtml(d.signature);
        }
      });
  }, []);

  const currentHtml = activeTab === 'builder'
    ? DEFAULT_TEMPLATES[selectedTemplate].html(name, role, email, phone, dept)
    : customHtml;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/email/signature', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: currentHtml }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSavedSig(currentHtml);
      showToast('Signature saved successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to save.', false);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Remove your email signature?')) return;
    setSaving(true);
    try {
      await fetch('/api/admin/email/signature', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: '' }),
      });
      setSavedSig('');
      setCustomHtml('');
      showToast('Signature removed.');
    } catch {
      showToast('Failed to remove.', false);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '8px 12px', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', fontSize: '13px', color: '#0f172a',
    outline: 'none', background: '#fff',
  };

  const tabBtn = (tab, label) => (
    <button onClick={() => setActiveTab(tab)} style={{
      padding: '6px 16px', borderRadius: '8px', border: 'none',
      background: activeTab === tab ? '#6366f1' : 'transparent',
      color: activeTab === tab ? '#fff' : '#64748b',
      fontSize: '12px', fontWeight: '700', cursor: 'pointer',
    }}>{label}</button>
  );

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 99999,
          background: toast.ok ? '#f0fdf4' : '#fef2f2',
          border: `1.5px solid ${toast.ok ? '#86efac' : '#fca5a5'}`,
          color: toast.ok ? '#16a34a' : '#dc2626',
          padding: '10px 18px', borderRadius: '10px',
          fontSize: '13px', fontWeight: '700',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>{toast.msg}</div>
      )}

      {/* Left: Builder */}
      <div style={{ width: '380px', flexShrink: 0, borderRight: '1px solid #e8edf5', overflowY: 'auto', padding: '24px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Email Signature</div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Auto-appended to every email you compose</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '18px', width: 'fit-content' }}>
          {tabBtn('builder', 'Template Builder')}
          {tabBtn('custom', 'Custom HTML')}
        </div>

        {activeTab === 'builder' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Template Style</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {DEFAULT_TEMPLATES.map((t, i) => (
                  <button key={i} onClick={() => setSelectedTemplate(i)} style={{
                    padding: '5px 12px', borderRadius: '8px', cursor: 'pointer',
                    border: `1.5px solid ${selectedTemplate === i ? '#6366f1' : '#e2e8f0'}`,
                    background: selectedTemplate === i ? '#eef2ff' : '#f8faff',
                    color: selectedTemplate === i ? '#6366f1' : '#64748b',
                    fontSize: '11.5px', fontWeight: '700',
                  }}>{t.label}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {[
                { label: 'Full Name', value: name, setter: setName, placeholder: 'e.g. Alex Johnson' },
                { label: 'Role / Title', value: role, setter: setRole, placeholder: 'e.g. HR Manager' },
                { label: 'Department', value: dept, setter: setDept, placeholder: 'e.g. Human Resources' },
                { label: 'Email Address', value: email, setter: setEmail, placeholder: 'e.g. hr@dagchain.network' },
                { label: 'Phone (optional)', value: phone, setter: setPhone, placeholder: 'e.g. +1 234 567 8900' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>{f.label}</label>
                  <input value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'custom' && (
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Paste or write your HTML signature</div>
            <textarea value={customHtml} onChange={e => setCustomHtml(e.target.value)}
              placeholder="<table>...</table>" rows={14}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '11.5px', lineHeight: '1.6' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '5px' }}>Use inline styles only — email clients strip CSS classes.</div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
            background: saving ? '#94a3b8' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff', fontSize: '13px', fontWeight: '700',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saving ? 'none' : '0 4px 14px rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          }}>
            {saving
              ? <div style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            }
            {saving ? 'Saving...' : 'Save Signature'}
          </button>
          {savedSig && (
            <button onClick={handleClear} style={{
              padding: '10px 14px', borderRadius: '10px',
              border: '1.5px solid #fca5a5', background: '#fff',
              color: '#ef4444', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
            }}>Remove</button>
          )}
        </div>
      </div>

      {/* Right: Live Preview */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: '#f8faff' }}>
        <div style={{ fontSize: '10.5px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px' }}>Live Preview</div>

        {/* Mock email */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', maxWidth: '640px' }}>
          {/* Mock header */}
          <div style={{ background: '#f8faff', borderBottom: '1px solid #e8edf5', padding: '14px 20px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}><strong style={{ color: '#0f172a' }}>To:</strong> team@dagchain.network</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}><strong style={{ color: '#0f172a' }}>Subject:</strong> Weekly Update</div>
          </div>
          {/* Body */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', marginBottom: '20px' }}>
              <p style={{ margin: '0 0 10px' }}>Hi Team,</p>
              <p style={{ margin: '0 0 10px' }}>Please find the weekly update attached. Let me know if you have any questions.</p>
              <p style={{ margin: '0' }}>Best regards,</p>
            </div>
            <div style={{ borderTop: '1px solid #e8edf5', paddingTop: '16px', marginTop: '4px' }}>
              <style>{`
                .sig-preview table { border-collapse: collapse !important; border: none !important; margin: 0 !important; }
                .sig-preview td, .sig-preview th { border: none !important; }
                .sig-preview tr { line-height: 1 !important; }
              `}</style>
              <div className="sig-preview" dangerouslySetInnerHTML={{ __html: currentHtml || '<span style="color:#94a3b8;font-size:12px;font-style:italic;">Your signature will appear here once you fill in your details above...</span>' }} />
            </div>
          </div>
        </div>

        {/* HTML source */}
        {currentHtml && (
          <details style={{ marginTop: '16px', maxWidth: '640px' }}>
            <summary style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', cursor: 'pointer', userSelect: 'none', padding: '6px 0' }}>View HTML Source</summary>
            <div style={{ marginTop: '8px', background: '#0f172a', borderRadius: '10px', padding: '16px', overflowX: 'auto' }}>
              <pre style={{ margin: 0, fontSize: '11px', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: '1.6' }}>{currentHtml}</pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
