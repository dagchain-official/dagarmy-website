"use client";
import "../../app/careers/careers.css";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CAREERS, DEPARTMENTS, REGIONS } from "@/data/careers";
import styles from "./CareersPage.module.css";

const NEU_BG = '#ffffff';
const NEU_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  * { box-sizing: border-box; }
  .neu-btn:active { box-shadow: inset 3px 3px 7px rgba(166,180,200,0.8), inset -2px -2px 5px rgba(255,255,255,0.9) !important; transform: scale(0.98) !important; }
  .neu-card { transition: box-shadow 0.2s ease; }
  .neu-filter:hover { background: linear-gradient(135deg,#6366f1,#8b5cf6) !important; color:#fff !important; box-shadow: 0 4px 14px rgba(99,102,241,0.35) !important; }
`;

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

const DEPT_NEU = {
  'Developer Relations': { color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
  'Sales & Growth':      { color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  'Web3 / AI Ecosystem': { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
};
const TYPE_NEU = {
  'Full-time':  { color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' },
  'Internship': { color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  'Part-time':  { color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
};

function Tag({ label, type = 'dept' }) {
  const map = type === 'dept' ? DEPT_NEU : TYPE_NEU;
  const s = map[label] || { color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: '20px', padding: '3px 11px',
      fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
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

const NEU_SHADOW = '6px 6px 14px rgba(0,0,0,0.09), -4px -4px 10px rgba(255,255,255,0.95)';
const NEU_SHADOW_INSET = 'inset 3px 3px 8px rgba(0,0,0,0.07), inset -2px -2px 6px rgba(255,255,255,0.9)';
const NEU_SHADOW_OPEN = '8px 8px 20px rgba(0,0,0,0.10), -4px -4px 12px rgba(255,255,255,0.95), 0 0 0 2px rgba(99,102,241,0.2)';

function NeuSectionPanel({ title, accentColor, children }) {
  return (
    <div style={{
      background: NEU_BG,
      borderRadius: '16px',
      padding: '18px 20px',
      boxShadow: NEU_SHADOW_INSET,
    }}>
      <h4 style={{
        margin: '0 0 14px',
        fontSize: '10px', fontWeight: '800', letterSpacing: '1.6px',
        textTransform: 'uppercase', color: accentColor,
        borderBottom: `1px solid ${accentColor}33`,
        paddingBottom: '8px',
      }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function JobCard({ job, isOpen, onToggle, onApply }) {
  const responsibilities = parseStructuredLines((job._isDbJob ? job._raw?.responsibilities : null) || (job.responsibilities || []).join('\n'));
  const requirements = parseStructuredLines((job._isDbJob ? job._raw?.requirements : null) || (job.requirements || []).join('\n'));
  const niceToHave = parseStructuredLines((job._isDbJob ? job._raw?.nice_to_have : null) || (job.niceToHave || []).join('\n'));
  const summaryText = job._isDbJob ? job._raw?.summary : job.summary;

  return (
    <div className="neu-card" style={{
      background: NEU_BG,
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: isOpen ? NEU_SHADOW_OPEN : NEU_SHADOW,
      transition: 'box-shadow 0.25s ease',
    }}>
      {/* Accent top strip */}
      <div style={{
        height: '3px',
        background: isOpen
          ? 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)'
          : 'linear-gradient(90deg, #a5b4fc, #c4b5fd)',
        transition: 'background 0.3s',
      }} />

      <button onClick={onToggle} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        padding: '24px 28px', textAlign: 'left', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', gap: '16px',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            <Tag label={job.department} type="dept" />
            <Tag label={job.type} type="type" />
          </div>
          <h3 style={{
            margin: 0, fontSize: '19px', fontWeight: '700', color: '#1e1b4b',
            letterSpacing: '-0.3px', fontFamily: "'Inter', sans-serif",
          }}>
            {job.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
            {[
              { icon: <IconGlobe />, text: job.region },
              { icon: <IconMapPin />, text: job.location },
              { icon: <IconClock />, text: job.type },
            ].map((item, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6366f1', fontSize: '13px', fontWeight: '500' }}>
                {item.icon}{item.text}
              </span>
            ))}
          </div>
        </div>

        {/* Neumorphic toggle knob */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
          background: NEU_BG,
          color: isOpen ? '#6366f1' : '#94a3b8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isOpen ? NEU_SHADOW_INSET : NEU_SHADOW,
          transition: 'all 0.2s',
        }}>
          {isOpen ? <IconChevronUp /> : <IconChevronDown />}
        </div>
      </button>

      {isOpen && (
        <div style={{ padding: '0 28px 28px', animation: 'fadeIn 0.2s ease' }}>
          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,#c7d2fe,transparent)', marginBottom: '20px' }} />

          {summaryText && (
            <div style={{
              background: NEU_BG,
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '22px',
              boxShadow: NEU_SHADOW_INSET,
            }}>
              <p style={{ color: '#4338ca', fontSize: '15px', lineHeight: '1.75', margin: 0 }}>
                {renderMd(summaryText)}
              </p>
            </div>
          )}

          <div className="careers-panels-grid">
            {responsibilities.length > 0 && (
              <NeuSectionPanel title="Responsibilities" accentColor="#6366f1">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {responsibilities.map((r, i) => r.type === 'heading' ? (
                    <p key={i} style={{ margin: '10px 0 4px', fontSize: '10px', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px' }}>{renderMd(r.text)}</p>
                  ) : (
                    <div key={i} style={{ display: 'flex', gap: '10px', color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 1px 4px rgba(99,102,241,0.4)' }} />
                      <span>{renderMd(r.text)}</span>
                    </div>
                  ))}
                </div>
              </NeuSectionPanel>
            )}
            {requirements.length > 0 && (
              <NeuSectionPanel title="Requirements" accentColor="#0891b2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {requirements.map((r, i) => r.type === 'heading' ? (
                    <p key={i} style={{ margin: '10px 0 4px', fontSize: '10px', fontWeight: '800', color: '#0891b2', textTransform: 'uppercase', letterSpacing: '1px' }}>{renderMd(r.text)}</p>
                  ) : (
                    <div key={i} style={{ display: 'flex', gap: '10px', color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '8px', background: 'linear-gradient(135deg,#06b6d4,#0891b2)', boxShadow: '0 1px 4px rgba(6,182,212,0.4)' }} />
                      <span>{renderMd(r.text)}</span>
                    </div>
                  ))}
                </div>
              </NeuSectionPanel>
            )}
          </div>

          {niceToHave.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ margin: '0 0 10px', fontSize: '10px', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1.4px' }}>Nice to Have</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {niceToHave.map((n, i) => (
                  <span key={i} style={{
                    background: NEU_BG, borderRadius: '20px', padding: '5px 14px',
                    color: '#7c3aed', fontSize: '12px', fontWeight: '600',
                    boxShadow: NEU_SHADOW,
                  }}>{renderMd(n.text)}</span>
                ))}
              </div>
            </div>
          )}

          <button
            className="neu-btn"
            onClick={() => onApply(job)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none',
              borderRadius: '12px', padding: '13px 28px',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(99,102,241,0.4), 0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.15s',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
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

  const neuInput = (hasError) => ({
    width: '100%', padding: '12px 16px',
    borderRadius: '12px', border: 'none', outline: 'none',
    fontSize: '14px', color: '#1e1b4b',
    background: NEU_BG,
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
    boxShadow: hasError
      ? 'inset 3px 3px 7px rgba(166,180,200,0.7), inset -2px -2px 5px rgba(255,255,255,0.9), 0 0 0 2px #ef4444'
      : NEU_SHADOW_INSET,
    transition: 'box-shadow 0.2s',
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(99,102,241,0.12)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }} onClick={onClose}>
      <div style={{
        background: NEU_BG, borderRadius: '24px', width: '100%', maxWidth: '580px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '12px 12px 30px rgba(140,160,190,0.7), -8px -8px 20px rgba(255,255,255,0.95)',
      }} onClick={e => e.stopPropagation()}>
        {/* Accent bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)', borderRadius: '24px 24px 0 0' }} />

        {/* Header */}
        <div style={{ padding: '24px 28px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {job.department} - {job.region}
            </p>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e1b4b', fontFamily: "'Inter', sans-serif" }}>
              {job.title}
            </h2>
          </div>
          <button onClick={onClose} className="neu-btn" style={{
            background: NEU_BG, border: 'none', borderRadius: '50%',
            width: '38px', height: '38px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6366f1', flexShrink: 0,
            boxShadow: NEU_SHADOW,
          }}>
            <IconX />
          </button>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,#c7d2fe,transparent)', margin: '0 28px' }} />

        <form onSubmit={handleSubmit} style={{ padding: '20px 28px' }}>
          <div className="careers-form-row">
            {[
              { key: 'name', label: 'Full Name', required: true, type: 'text', ph: 'John Doe' },
              { key: 'email', label: 'Email Address', required: true, type: 'email', ph: 'you@example.com' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6366f1', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  {f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input type={f.type} placeholder={f.ph}
                  value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={neuInput(errors[f.key])}
                  onFocus={e => { e.target.style.boxShadow = `${NEU_SHADOW_INSET}, 0 0 0 2px #6366f1`; }}
                  onBlur={e => { e.target.style.boxShadow = errors[f.key] ? `${NEU_SHADOW_INSET}, 0 0 0 2px #ef4444` : NEU_SHADOW_INSET; }}
                />
                {errors[f.key] && <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#ef4444' }}>{errors[f.key]}</p>}
              </div>
            ))}
          </div>

          {[
            { key: 'phone', label: 'Phone Number', type: 'tel', ph: '+1 234 567 8900', opt: true },
            { key: 'linkedin_url', label: 'LinkedIn Profile URL', type: 'url', ph: 'https://linkedin.com/in/yourprofile', opt: false },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6366f1', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                {f.label} {f.opt && <span style={{ color: '#94a3b8', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>}
              </label>
              <input type={f.type} placeholder={f.ph}
                value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={neuInput(f.key === 'linkedin_url' && errors.resume && !resumeFile && !form.linkedin_url)}
                onFocus={e => { e.target.style.boxShadow = `${NEU_SHADOW_INSET}, 0 0 0 2px #6366f1`; }}
                onBlur={e => { e.target.style.boxShadow = NEU_SHADOW_INSET; }}
              />
            </div>
          ))}

          {/* Resume drop zone */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6366f1', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Resume / CV <span style={{ color: '#94a3b8', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>(PDF or DOCX, max 5MB)</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              style={{
                borderRadius: '14px', padding: '20px', textAlign: 'center', cursor: 'pointer',
                background: NEU_BG, transition: 'all 0.2s',
                boxShadow: dragOver
                  ? `${NEU_SHADOW_INSET}, 0 0 0 2px #6366f1`
                  : resumeFile ? `${NEU_SHADOW_INSET}, 0 0 0 2px #06b6d4` : NEU_SHADOW_INSET,
              }}
            >
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              {resumeFile ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 3px 10px rgba(6,182,212,0.4)' }}>
                    <IconCheck />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#0891b2' }}>{resumeFile.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{(resumeFile.size / 1024).toFixed(0)} KB - click to change</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ color: '#8b5cf6', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}><IconUpload /></div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#475569' }}>Drop your resume here or <span style={{ color: '#6366f1' }}>browse</span></p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>PDF or DOCX up to 5MB</p>
                </div>
              )}
            </div>
            {errors.resume && <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#ef4444' }}>{errors.resume}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6366f1', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Cover Letter <span style={{ color: '#94a3b8', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              placeholder="Tell us why you're a great fit for this role..."
              value={form.cover_letter} onChange={e => setForm(p => ({ ...p, cover_letter: e.target.value }))}
              rows={4}
              style={{ ...neuInput(false), resize: 'vertical', minHeight: '100px' }}
              onFocus={e => { e.target.style.boxShadow = `${NEU_SHADOW_INSET}, 0 0 0 2px #6366f1`; }}
              onBlur={e => { e.target.style.boxShadow = NEU_SHADOW_INSET; }}
            />
          </div>

          {errors.submit && (
            <div style={{ background: '#fef2f2', borderRadius: '10px', padding: '12px 16px', marginBottom: '14px', boxShadow: 'inset 2px 2px 5px rgba(200,0,0,0.08)' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#ef4444' }}>{errors.submit}</p>
            </div>
          )}

          <button type="submit" disabled={submitting} className="neu-btn" style={{
            width: '100%', padding: '14px',
            background: submitting ? 'linear-gradient(135deg,#a5b4fc,#c4b5fd)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff', border: 'none', borderRadius: '14px',
            fontSize: '15px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
            transition: 'all 0.15s', fontFamily: "'Inter', sans-serif",
          }}>
            {submitting ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Submitting...
              </>
            ) : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

function SuccessModal({ job, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(99,102,241,0.12)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div style={{
        background: NEU_BG, borderRadius: '24px', width: '100%', maxWidth: '440px',
        padding: '0', textAlign: 'center', overflow: 'hidden',
        boxShadow: '12px 12px 30px rgba(140,160,190,0.7), -8px -8px 20px rgba(255,255,255,0.95)',
      }}>
        <div style={{ height: '4px', background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)' }} />
        <div style={{ padding: '40px 36px 36px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: NEU_BG, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: '#6366f1',
            boxShadow: NEU_SHADOW,
          }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
              <IconCheck />
            </div>
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '700', color: '#1e1b4b', fontFamily: "'Inter', sans-serif" }}>
            Application Received
          </h2>
          <p style={{ margin: '0 0 6px', color: '#4338ca', fontSize: '15px' }}>
            Thank you for applying for <strong>{job.title}</strong>.
          </p>
          <p style={{ margin: '0 0 28px', color: '#94a3b8', fontSize: '14px' }}>
            Our team will review your application and get back to you within 5–7 business days.
          </p>
          <button className="neu-btn" onClick={onClose} style={{
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff', border: 'none', borderRadius: '12px',
            padding: '12px 32px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99,102,241,0.4)', fontFamily: "'Inter', sans-serif",
          }}>
            Back to Open Roles
          </button>
        </div>
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
  const [currentCultureCycle, setCurrentCultureCycle] = useState(0);
  const [visibleJobsCount, setVisibleJobsCount] = useState(3);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCultureCycle((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    setVisibleJobsCount(3);
  }, [filterDept, filterRegion]);

  const handleApply = (job) => setApplyJob(job);
  const handleSuccess = () => { setSuccessJob(applyJob); setApplyJob(null); setShowSuccess(true); };
  const handleSuccessClose = () => { setShowSuccess(false); setSuccessJob(null); };
  const handleLoadMore = () => {
    setVisibleJobsCount(prev => prev + 3);
  };

  const neuFilterBtn = (active) => ({
    padding: '8px 18px', borderRadius: '10px', border: 'none',
    background: NEU_BG,
    color: active ? '#6366f1' : '#94a3b8',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer',
    whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif",
    boxShadow: active ? NEU_SHADOW_INSET : NEU_SHADOW,
    transition: 'all 0.15s',
  });

  const CULTURE = [
    { icon: <IconGlobe />, title: 'Remote-First', desc: 'Work from anywhere. We hire for talent, not timezone.', color: '#6366f1' },
    { icon: <IconBriefcase />, title: 'Web3 Native', desc: 'We live and breathe blockchain. Every role has real impact.', color: '#8b5cf6' },
    { icon: <IconCheck />, title: 'Community Driven', desc: "You're not just an employee - you're part of the DAGArmy.", color: '#06b6d4' },
    { icon: <IconArrowRight />, title: 'High Growth', desc: 'Early-stage startup with global scale. Grow fast with us.', color: '#0891b2' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: NEU_BG, fontFamily: "'Inter', sans-serif" }}>
      <style>{NEU_STYLES}</style>

      {/* ── HERO ── */}
      <div style={{
        background: NEU_BG,
        padding: '100px 24px 90px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Soft radial glow */}
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '600px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Pill label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: NEU_BG, borderRadius: '20px', padding: '6px 18px',
            boxShadow: NEU_SHADOW, marginBottom: '28px',
            fontSize: '11px', fontWeight: '700', color: '#6366f1',
            letterSpacing: '1.2px', textTransform: 'uppercase',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }} />
            DAGArmy Careers
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: '800', lineHeight: 1.08,
            margin: '0 0 22px', letterSpacing: '-1.5px', color: '#1e1b4b',
          }}>
            Build the Future of<br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              AI &amp; Web3 with Us
            </span>
          </h1>

          <p style={{
            fontSize: '17px', lineHeight: '1.75', margin: '0 0 40px',
            maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto',
            color: '#64748b',
          }}>
            DAGArmy is a fast-growing Web3 community platform. We&apos;re looking for driven, mission-aligned people to help us build the decentralized future - from anywhere in the world.
          </p>

          <button
            className="neu-btn"
            onClick={() => rolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: '14px',
              padding: '15px 34px', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(99,102,241,0.4), 0 2px 8px rgba(99,102,241,0.2)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            View Open Roles <IconArrowRight />
          </button>
        </div>
      </div>

      {/* ── CULTURE STRIP ── */}
      <div style={{ padding: '0 24px 48px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px',
          }}>
            {CULTURE.map((v, i) => (
              <div key={i} style={{
                background: NEU_BG, borderRadius: '18px', padding: '24px',
                boxShadow: NEU_SHADOW,
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                transition: 'box-shadow 0.2s',
              }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '14px', flexShrink: 0,
                  background: NEU_BG, color: v.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: NEU_SHADOW_INSET,
                }}>
                  {v.icon}
                </div>
                <div>
                  <p style={{ margin: '0 0 5px', fontWeight: '700', fontSize: '14px', color: '#1e1b4b' }}>{v.title}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.55' }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── OPEN ROLES ── */}
      <div style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Section header */}
          <div style={{
            background: NEU_BG, borderRadius: '20px', padding: '28px 32px',
            boxShadow: NEU_SHADOW, marginBottom: '28px',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#1e1b4b', letterSpacing: '-0.5px' }}>
                  Open Positions
                </h2>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>
                  {filtered.length} role{filtered.length !== 1 ? 's' : ''} currently available
                </p>
              </div>
              {/* Neumorphic badge */}
              <div style={{
                background: NEU_BG, borderRadius: '50%', width: '52px', height: '52px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: NEU_SHADOW, flexShrink: 0,
                fontSize: '18px', fontWeight: '800', color: '#6366f1',
              }}>
                {filtered.length}
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginRight: '4px' }}>Dept:</span>
              {allDepts.map(d => (
                <button key={d} className="neu-filter" style={neuFilterBtn(filterDept === d)} onClick={() => setFilterDept(d)}>{d}</button>
              ))}
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginLeft: '12px', marginRight: '4px' }}>Region:</span>
              {allRegions.map(r => (
                <button key={r} className="neu-filter" style={neuFilterBtn(filterRegion === r)} onClick={() => setFilterRegion(r)}>{r}</button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div ref={rolesRef}>
            {filtered.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '64px 24px',
                background: NEU_BG, borderRadius: '20px',
                boxShadow: NEU_SHADOW_INSET,
              }}>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#6366f1', margin: '0 0 6px' }}>No roles match your filters.</p>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>Try adjusting the department or region filter.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
          </div>

        {/* Open Application CTA */}
        <div style={{
            marginTop: '40px',
            background: NEU_BG, borderRadius: '24px', padding: '48px 40px', textAlign: 'center',
            boxShadow: NEU_SHADOW, position: 'relative', overflow: 'hidden',
          }}>
            {/* Soft accent orbs */}
            <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: NEU_BG, borderRadius: '20px', padding: '5px 16px',
                boxShadow: NEU_SHADOW_INSET, marginBottom: '18px',
                fontSize: '11px', fontWeight: '700', color: '#8b5cf6',
                letterSpacing: '1px', textTransform: 'uppercase',
              }}>
                Open Invitation
              </div>
              <h3 style={{ color: '#1e1b4b', fontSize: '24px', fontWeight: '800', margin: '0 0 10px', letterSpacing: '-0.4px' }}>
                Don&apos;t see your role?
              </h3>
              <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 28px', lineHeight: '1.7', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
                We&apos;re always looking for exceptional talent. Send us your profile and we&apos;ll reach out when the right opportunity opens up.
              </p>
              <a
                className="neu-btn"
                href="mailto:hr@dagchain.network?subject=Open Application - DAGArmy"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  color: '#fff', textDecoration: 'none',
                  borderRadius: '14px', padding: '13px 30px',
                  fontSize: '14px', fontWeight: '700',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                }}
              >
                Send Open Application <IconArrowRight />
              </a>
            </div>
          </div>
        </div>
      </div>

      {applyJob && <ApplicationModal job={applyJob} onClose={() => setApplyJob(null)} onSuccess={handleSuccess} />}
      {showSuccess && successJob && <SuccessModal job={successJob} onClose={handleSuccessClose} />}
    </div>
  );
}
