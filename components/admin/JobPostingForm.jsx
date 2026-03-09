"use client";
import { useState, useEffect } from "react";

const WORK_MODES = ["Remote", "Hybrid", "On-site"];
const EMP_TYPES = ["Full-time", "Part-time", "Freelance", "Internship"];

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: "10px",
  border: "1.5px solid #e2e8f0", fontSize: "13px", color: "#0f172a",
  outline: "none", background: "#fff", fontFamily: "inherit",
  boxSizing: "border-box", transition: "border-color 0.15s",
};

const labelStyle = {
  display: "block", fontSize: "11px", fontWeight: "700",
  color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px",
};

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}{required && <span style={{ color: "#ef4444" }}> *</span>}</label>
      {children}
    </div>
  );
}

export default function JobPostingForm({ initial = null, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "", department: "", location: "Remote", work_mode: "Remote",
    employment_type: "Full-time", summary: "", responsibilities: "",
    requirements: "", nice_to_have: "", is_active: true,
    ...(initial || {}),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const focusStyle = (e) => {
    e.target.style.borderColor = "#6366f1";
    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.boxShadow = "none";
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.summary.trim() || !form.responsibilities.trim() || !form.requirements.trim()) {
      setError("Title, Summary, Responsibilities, and Requirements are required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1100,
      background: "rgba(15,23,42,0.55)", backdropFilter: "blur(3px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      overflowY: "auto", padding: "32px 16px",
    }} onClick={onCancel}>
      <div style={{
        background: "#fff", borderRadius: "18px", width: "100%", maxWidth: "680px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.18)", padding: "32px",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px" }}>
              {initial ? "Edit Job Posting" : "Create Job Posting"}
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
              {initial ? "Update the job details below" : "Fill in the details to publish a new role"}
            </p>
          </div>
          <button onClick={onCancel} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px", fontSize: "13px", color: "#dc2626" }}>
            {error}
          </div>
        )}

        {/* Row 1: Title + Department */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <Field label="Job Title" required>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. Developer Relations Manager"
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>
          <Field label="Department">
            <input value={form.department} onChange={e => set("department", e.target.value)}
              placeholder="e.g. Engineering, Sales"
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>
        </div>

        {/* Row 2: Location + Work Mode + Employment Type */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
          <Field label="Location">
            <input value={form.location} onChange={e => set("location", e.target.value)}
              placeholder="e.g. India, Global"
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>
          <Field label="Work Mode">
            <select value={form.work_mode} onChange={e => set("work_mode", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}>
              {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Employment Type">
            <select value={form.employment_type} onChange={e => set("employment_type", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}>
              {EMP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
        </div>

        {/* Summary */}
        <Field label="Sub Text / Summary" required>
          <textarea value={form.summary} onChange={e => set("summary", e.target.value)}
            rows={3} placeholder="Brief description shown on the careers listing page..."
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={focusStyle} onBlur={blurStyle} />
        </Field>

        {/* Responsibilities */}
        <Field label="Responsibilities" required>
          <textarea value={form.responsibilities} onChange={e => set("responsibilities", e.target.value)}
            rows={6} placeholder={"List each responsibility on a new line:\n- Build and nurture developer relationships\n- Create technical content..."}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={focusStyle} onBlur={blurStyle} />
        </Field>

        {/* Requirements */}
        <Field label="Requirements" required>
          <textarea value={form.requirements} onChange={e => set("requirements", e.target.value)}
            rows={5} placeholder={"List each requirement on a new line:\n- 2+ years of experience\n- Strong communication skills..."}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={focusStyle} onBlur={blurStyle} />
        </Field>

        {/* Nice to Have */}
        <Field label="Nice to Have Expertise (Optional)">
          <textarea value={form.nice_to_have} onChange={e => set("nice_to_have", e.target.value)}
            rows={3} placeholder={"Optional bonus skills:\n- Experience with Web3 protocols\n- Prior open source contributions..."}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={focusStyle} onBlur={blurStyle} />
        </Field>

        {/* Active toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <button
            onClick={() => set("is_active", !form.is_active)}
            style={{
              width: "44px", height: "24px", borderRadius: "12px", border: "none",
              background: form.is_active ? "#6366f1" : "#cbd5e1",
              cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
            }}
          >
            <span style={{
              position: "absolute", top: "3px",
              left: form.is_active ? "23px" : "3px",
              width: "18px", height: "18px", borderRadius: "50%", background: "#fff",
              transition: "left 0.2s", display: "block",
            }} />
          </button>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
            {form.is_active ? "Active — visible on /careers" : "Inactive — hidden from public"}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{
            padding: "11px 22px", borderRadius: "10px", border: "1.5px solid #e2e8f0",
            background: "#fff", color: "#64748b", fontSize: "13px", fontWeight: "600", cursor: "pointer",
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} style={{
            padding: "11px 28px", borderRadius: "10px", border: "none",
            background: saving ? "#94a3b8" : "#0f172a",
            color: "#fff", fontSize: "13px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}>
            {saving ? "Saving..." : initial ? "Save Changes" : "Create Job Posting"}
          </button>
        </div>
      </div>
    </div>
  );
}
