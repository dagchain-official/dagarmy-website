"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

const IconBriefcase = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconGlobe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const DEPT_COLORS = {
  'Developer Relations': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Sales & Growth': { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
};

const TYPE_COLORS = {
  'Full-time': { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  'Internship': { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'Part-time': { bg: '#fdf2f8', color: '#9d174d', border: '#fbcfe8' },
};

function Tag({ label, type = 'dept' }) {
  const colorMap = type === 'dept' ? DEPT_COLORS : TYPE_COLORS;
  const style = colorMap[label] || { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: style.bg, color: style.color,
      border: `1px solid ${style.border}`,
      borderRadius: '6px', padding: '3px 10px',
      fontSize: '12px', fontWeight: '600', letterSpacing: '0.2px',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function parseStructuredLines(text) {
  if (!text) return [];
  return text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    if (/^\d+\.\s/.test(l)) return { type: 'heading', text: l.replace(/^\d+\.\s*/, '').trim() };
    return { type: 'bullet', text: l.replace(/^[-•*]\s*/, '').trim() };
  });
}

function renderMd(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  );
}

function JobCard({ job, isOpen, onToggle, onApply }) {
  if (job._isDbJob) {
    const responsibilities = parseStructuredLines(job._raw?.responsibilities);
    const requirements = parseStructuredLines(job._raw?.requirements);
    const niceToHave = parseStructuredLines(job._raw?.nice_to_have);
    return (
      <div style={{
        background: '#fff', borderRadius: '16px',
        border: isOpen ? '1.5px solid #3b82f6' : '1.5px solid #e2e8f0',
        overflow: 'hidden', transition: 'all 0.25s ease',
        boxShadow: isOpen ? '0 8px 32px rgba(59,130,246,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <button onClick={onToggle} style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '24px 28px', textAlign: 'left', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
              <Tag label={job.department} type="dept" />
              <Tag label={job.type} type="type" />
            </div>
            <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>{job.title}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}><IconGlobe />{job.region}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}><IconMapPin />{job.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}><IconClock />{job.type}</span>
            </div>
          </div>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
            background: isOpen ? '#3b82f6' : '#f1f5f9',
            color: isOpen ? '#fff' : '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            {isOpen ? <IconChevronUp /> : <IconChevronDown />}
          </div>
        </button>

        {isOpen && (
          <div style={{ padding: '0 28px 28px', borderTop: '1px solid #f1f5f9' }}>
            {job.summary && (
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', marginTop: '20px', marginBottom: '24px' }}>
                {renderMd(job.summary)}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              {responsibilities.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Responsibilities</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {responsibilities.map((r, i) => r.type === 'heading' ? (
                      <p key={i} style={{ margin: '10px 0 4px', fontSize: '12px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{renderMd(r.text)}</p>
                    ) : (
                      <div key={i} style={{ display: 'flex', gap: '10px', color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: '8px' }} /><span>{renderMd(r.text)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {requirements.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Requirements</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {requirements.map((r, i) => r.type === 'heading' ? (
                      <p key={i} style={{ margin: '10px 0 4px', fontSize: '12px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{renderMd(r.text)}</p>
                    ) : (
                      <div key={i} style={{ display: 'flex', gap: '10px', color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0, marginTop: '8px' }} /><span>{renderMd(r.text)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {niceToHave.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Nice to Have</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {niceToHave.map((n, i) => (
                    <span key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', color: '#64748b', fontSize: '13px' }}>{renderMd(n.text)}</span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => onApply(job)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#0f172a', color: '#fff', border: 'none',
              borderRadius: '10px', padding: '12px 24px',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Apply for this Role <IconArrowRight />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      border: isOpen ? '1.5px solid #3b82f6' : '1.5px solid #e2e8f0',
      overflow: 'hidden', transition: 'all 0.25s ease',
      boxShadow: isOpen ? '0 8px 32px rgba(59,130,246,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      {/* Card header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '24px 28px', textAlign: 'left', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
            <Tag label={job.department} type="dept" />
            <Tag label={job.type} type="type" />
          </div>
          <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>
            {job.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}>
              <IconGlobe />{job.region}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}>
              <IconMapPin />{job.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}>
              <IconClock />{job.type}
            </span>
          </div>
        </div>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
          background: isOpen ? '#3b82f6' : '#f1f5f9',
          color: isOpen ? '#fff' : '#64748b',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {isOpen ? <IconChevronUp /> : <IconChevronDown />}
        </div>
      </button>

      {/* Expanded detail */}
      {isOpen && (
        <div style={{ padding: '0 28px 28px', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', marginTop: '20px', marginBottom: '24px' }}>
            {job.summary}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
                Responsibilities
              </h4>
              <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {job.responsibilities.map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: '8px' }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
                Requirements
              </h4>
              <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {job.requirements.map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0, marginTop: '8px' }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {job.niceToHave?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
                Nice to Have
              </h4>
              <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {job.niceToHave.map((n, i) => (
                  <li key={i} style={{
                    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
                    padding: '6px 12px', color: '#64748b', fontSize: '13px',
                  }}>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => onApply(job)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#0f172a', color: '#fff', border: 'none',
              borderRadius: '10px', padding: '12px 24px',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Apply for this Role <IconArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}

function ApplicationModal({ job, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedin_url: '', cover_letter: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.linkedin_url.trim() && !resumeFile) e.resume = 'Please provide a LinkedIn URL or upload a resume';
    return e;
  };

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setErrors(p => ({ ...p, resume: 'PDF or DOCX only' })); return; }
    if (file.size > 5 * 1024 * 1024) { setErrors(p => ({ ...p, resume: 'Max file size is 5MB' })); return; }
    setResumeFile(file);
    setErrors(p => { const n = { ...p }; delete n.resume; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);

    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('email', form.email.trim());
    if (form.phone.trim()) fd.append('phone', form.phone.trim());
    if (form.linkedin_url.trim()) fd.append('linkedin_url', form.linkedin_url.trim());
    if (form.cover_letter.trim()) fd.append('cover_letter', form.cover_letter.trim());
    fd.append('role_slug', job.slug);
    fd.append('role_title', job.title);
    fd.append('department', job.department);
    fd.append('region', job.region);
    if (resumeFile) fd.append('resume', resumeFile);

    try {
      const res = await fetch('/api/careers/apply', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      onSuccess();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: hasError ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
    fontSize: '14px', color: '#0f172a', outline: 'none',
    background: '#fff', boxSizing: 'border-box', transition: 'border 0.2s',
    fontFamily: 'inherit',
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '560px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              {job.department} — {job.region}
            </p>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
              {job.title}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text" placeholder="John Doe"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                style={inputStyle(errors.name)}
                onFocus={e => { e.target.style.border = '1.5px solid #3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={e => { e.target.style.border = errors.name ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
              {errors.name && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>{errors.name}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={inputStyle(errors.email)}
                onFocus={e => { e.target.style.border = '1.5px solid #3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={e => { e.target.style.border = errors.email ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
              {errors.email && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>{errors.email}</p>}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Phone Number <span style={{ color: '#94a3b8', fontWeight: '400' }}>(optional)</span>
            </label>
            <input
              type="tel" placeholder="+1 234 567 8900"
              value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              style={inputStyle(false)}
              onFocus={e => { e.target.style.border = '1.5px solid #3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
              onBlur={e => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              LinkedIn Profile URL
            </label>
            <input
              type="url" placeholder="https://linkedin.com/in/yourprofile"
              value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))}
              style={inputStyle(errors.resume && !resumeFile && !form.linkedin_url)}
              onFocus={e => { e.target.style.border = '1.5px solid #3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
              onBlur={e => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Resume upload */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Resume / CV <span style={{ color: '#94a3b8', fontWeight: '400' }}>(PDF or DOCX, max 5MB)</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              style={{
                border: dragOver ? '2px dashed #3b82f6' : resumeFile ? '2px dashed #10b981' : '2px dashed #cbd5e1',
                borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer',
                background: dragOver ? '#eff6ff' : resumeFile ? '#f0fdf4' : '#f8fafc',
                transition: 'all 0.2s',
              }}
            >
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              {resumeFile ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <IconCheck />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#065f46' }}>{resumeFile.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6ee7b7' }}>{(resumeFile.size / 1024).toFixed(0)} KB — click to change</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ color: '#94a3b8', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}><IconUpload /></div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#475569' }}>Drop your resume here or <span style={{ color: '#3b82f6' }}>browse</span></p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>PDF or DOCX up to 5MB</p>
                </div>
              )}
            </div>
            {errors.resume && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>{errors.resume}</p>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Cover Letter <span style={{ color: '#94a3b8', fontWeight: '400' }}>(optional)</span>
            </label>
            <textarea
              placeholder="Tell us why you're a great fit for this role..."
              value={form.cover_letter} onChange={e => setForm(p => ({ ...p, cover_letter: e.target.value }))}
              rows={4}
              style={{ ...inputStyle(false), resize: 'vertical', minHeight: '100px' }}
              onFocus={e => { e.target.style.border = '1.5px solid #3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
              onBlur={e => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {errors.submit && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#dc2626' }}>{errors.submit}</p>
            </div>
          )}

          <button
            type="submit" disabled={submitting}
            style={{
              width: '100%', padding: '13px', borderRadius: '10px',
              background: submitting ? '#94a3b8' : '#0f172a', color: '#fff', border: 'none',
              fontSize: '15px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#1e293b'; }}
            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#0f172a'; }}
          >
            {submitting ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Submitting...
              </>
            ) : 'Submit Application'}
          </button>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </form>
      </div>
    </div>
  );
}

function SuccessModal({ job, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '440px',
        padding: '40px 36px', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
      }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#10b981' }}>
          <IconCheck />
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
          Application Submitted
        </h2>
        <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: '15px' }}>
          Thanks for applying for <strong>{job.title}</strong>.
        </p>
        <p style={{ margin: '0 0 28px', color: '#94a3b8', fontSize: '14px' }}>
          Our HR team will review your application and get back to you within 5–7 business days.
        </p>
        <button
          onClick={onClose}
          style={{
            background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px',
            padding: '12px 32px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          Back to Open Roles
        </button>
      </div>
    </div>
  );
}

export default function CareersPage() {
  const searchParams = useSearchParams();
  const rolesRef = useRef(null);
  const [openSlug, setOpenSlug] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successJob, setSuccessJob] = useState(null);
  const [filterDept, setFilterDept] = useState('All');
  const [filterRegion, setFilterRegion] = useState('All');
  const [dbJobs, setDbJobs] = useState([]);

  useEffect(() => {
    fetch('/api/careers/jobs')
      .then(r => r.json())
      .then(d => { if (d.jobs) setDbJobs(d.jobs); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const slug = searchParams.get('job');
    if (slug) {
      setOpenSlug(slug);
      setTimeout(() => rolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }, [searchParams]);

  const dbJobCards = dbJobs.map(j => ({
    slug: j.slug,
    title: j.title,
    department: j.department || 'General',
    type: j.employment_type,
    location: j.work_mode,
    region: j.location,
    summary: j.summary,
    responsibilities: [],
    requirements: [],
    niceToHave: [],
    _isDbJob: true,
    _raw: j,
  }));

  const allJobs = dbJobCards;
  const allDepts = ['All', ...new Set(allJobs.map(j => j.department))];
  const allRegions = ['All', ...new Set(allJobs.map(j => j.region))];

  const filtered = allJobs.filter(j => {
    if (filterDept !== 'All' && j.department !== filterDept) return false;
    if (filterRegion !== 'All' && j.region !== filterRegion) return false;
    return true;
  });

  const handleApply = (job) => setApplyJob(job);
  const handleSuccess = () => {
    setSuccessJob(applyJob);
    setApplyJob(null);
    setShowSuccess(true);
  };
  const handleSuccessClose = () => { setShowSuccess(false); setSuccessJob(null); };

  const filterBtnStyle = (active) => ({
    padding: '7px 16px', borderRadius: '8px', border: '1.5px solid',
    borderColor: active ? '#0f172a' : '#e2e8f0',
    background: active ? '#0f172a' : '#fff',
    color: active ? '#fff' : '#64748b',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #f0f6ff 0%, #f8fafc 50%, #eff4ff 100%)',
        borderBottom: '1px solid #e2e8f0',
        padding: '100px 24px 90px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.5,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 20px' }}>
            Build the Future of<br />
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              AI &amp; Web3 with Us
            </span>
          </h1>
          <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.7', margin: '0 0 36px', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
            DAGArmy is a fast-growing Web3 community platform. We&apos;re looking for driven, mission-aligned people to help us build the decentralized future — from anywhere in the world.
          </p>
          <button
            onClick={() => rolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#3b82f6', color: '#fff', border: 'none',
              borderRadius: '12px', padding: '14px 28px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            View Open Roles <IconArrowRight />
          </button>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>

      {/* Culture strip */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {[
            { icon: <IconGlobe />, title: 'Remote-First', desc: 'Work from anywhere. We hire for talent, not timezone.' },
            { icon: <IconBriefcase />, title: 'Web3 Native', desc: 'We live and breathe blockchain. Every role has real impact.' },
            { icon: <IconCheck />, title: 'Community Driven', desc: 'You\'re not just an employee — you\'re part of the DAGArmy.' },
            { icon: <IconArrowRight />, title: 'High Growth', desc: 'Early-stage startup with global scale. Grow fast with us.' },
          ].map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {v.icon}
              </div>
              <div>
                <p style={{ margin: '0 0 3px', fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{v.title}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open Roles */}
      <div ref={rolesRef} style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
            Open Positions
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 24px' }}>
            {filtered.length} role{filtered.length !== 1 ? 's' : ''} available
          </p>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', marginRight: '4px' }}>Department:</span>
            {allDepts.map(d => (
              <button key={d} style={filterBtnStyle(filterDept === d)} onClick={() => setFilterDept(d)}>{d}</button>
            ))}
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', marginLeft: '12px', marginRight: '4px' }}>Region:</span>
            {allRegions.map(r => (
              <button key={r} style={filterBtnStyle(filterRegion === r)} onClick={() => setFilterRegion(r)}>{r}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#94a3b8' }}>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No roles match your filters.</p>
            <p style={{ fontSize: '14px' }}>Try adjusting the department or region filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(job => (
              <JobCard
                key={job.slug}
                job={job}
                isOpen={openSlug === job.slug}
                onToggle={() => setOpenSlug(openSlug === job.slug ? null : job.slug)}
                onApply={handleApply}
              />
            ))}
          </div>
        )}

        {/* Generic apply CTA */}
        <div style={{ marginTop: '48px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '20px', padding: '40px 36px', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
            Don&apos;t see your role?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 24px' }}>
            We&apos;re always looking for exceptional talent. Send us your profile and we&apos;ll reach out when the right opportunity opens up.
          </p>
          <a
            href="mailto:hr@dagchain.network?subject=Open Application — DAGArmy"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#3b82f6', color: '#fff', textDecoration: 'none',
              borderRadius: '10px', padding: '12px 24px',
              fontSize: '14px', fontWeight: '600',
            }}
          >
            Send Open Application <IconArrowRight />
          </a>
        </div>
      </div>

      {applyJob && <ApplicationModal job={applyJob} onClose={() => setApplyJob(null)} onSuccess={handleSuccess} />}
      {showSuccess && successJob && <SuccessModal job={successJob} onClose={handleSuccessClose} />}
    </div>
  );
}
