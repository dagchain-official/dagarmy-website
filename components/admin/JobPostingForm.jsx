"use client";
import { useState, useRef, useCallback } from "react";

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

/* ── Toolbar button ── */
function ToolBtn({ title, active, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      style={{
        padding: "4px 8px", borderRadius: "6px", border: "none", cursor: "pointer",
        fontSize: "12px", fontWeight: "700", lineHeight: 1,
        background: active ? "#e0e7ff" : "transparent",
        color: active ? "#4f46e5" : "#475569",
        transition: "background 0.12s",
        display: "flex", alignItems: "center", justifyContent: "center", minWidth: "28px", height: "26px",
      }}
    >
      {children}
    </button>
  );
}

/* ── Rich Text Editor (contenteditable div → converts to/from plain text) ── */
function RichEditor({ value, onChange, placeholder, rows = 5 }) {
  const editorRef = useRef(null);
  const [focused, setFocused] = useState(false);

  /* Init content from value prop (once on mount) */
  const initialised = useRef(false);
  const initEditor = useCallback((node) => {
    if (!node) return;
    editorRef.current = node;
    if (!initialised.current) {
      initialised.current = true;
      node.innerHTML = toHtml(value || "");
    }
  }, []);

  /* Convert plain text → HTML for the editor */
  function toHtml(text) {
    if (!text) return "";
    return text.split("\n").map(line => {
      const t = line.replace(/^[-•]\s*/, "• ").replace(/^\d+\.\s*/, m => m);
      return `<div>${escHtml(t) || "<br>"}</div>`;
    }).join("");
  }

  /* Convert editor HTML → plain text for storage */
  function toText(node) {
    const lines = [];
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const t = child.textContent;
        if (t) lines.push(t);
      } else {
        const t = child.innerText ?? child.textContent ?? "";
        lines.push(t);
      }
    });
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function handleInput() {
    onChange(toText(editorRef.current));
  }

  /* Insert text at cursor position */
  function insertAtCursor(text) {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    onChange(toText(editorRef.current));
  }

  /* Wrap selected text */
  function wrapSelection(before, after = before) {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const selected = sel.getRangeAt(0).toString();
    if (selected) {
      document.execCommand("insertText", false, before + selected + after);
    } else {
      insertAtCursor(before + after);
    }
    onChange(toText(editorRef.current));
  }

  /* Prefix each selected line */
  function prefixLines(prefix) {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    const selected = range.toString();
    if (selected) {
      const prefixed = selected.split("\n").map(l => prefix + l.replace(/^([-•]\s*|\d+\.\s*)/, "")).join("\n");
      document.execCommand("insertText", false, prefixed);
    } else {
      document.execCommand("insertText", false, "\n" + prefix);
    }
    onChange(toText(editorRef.current));
  }

  /* Bold: wrap with ** markers (stored, shown as-is in plain text) */
  function handleBold() { wrapSelection("**"); }
  function handleBullet() { prefixLines("- "); }
  function handleNumbered() {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const selected = sel.getRangeAt(0).toString();
    if (selected) {
      const lines = selected.split("\n");
      const numbered = lines.map((l, i) => `${i + 1}. ${l.replace(/^([-•]\s*|\d+\.\s*)/, "")}`).join("\n");
      document.execCommand("insertText", false, numbered);
    } else {
      document.execCommand("insertText", false, "\n1. ");
    }
    onChange(toText(editorRef.current));
  }

  const minH = `${rows * 24 + 20}px`;

  return (
    <div style={{
      border: focused ? "1.5px solid #6366f1" : "1.5px solid #e2e8f0",
      borderRadius: "10px", overflow: "hidden",
      boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
    }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "2px",
        padding: "6px 8px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc",
        flexWrap: "wrap",
      }}>
        <ToolBtn title="Bold (wrap with **)" onClick={handleBold}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </ToolBtn>
        <div style={{ width: "1px", height: "18px", background: "#e2e8f0", margin: "0 2px" }} />
        <ToolBtn title="Bullet list (- item)" onClick={handleBullet}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
        </ToolBtn>
        <ToolBtn title="Numbered list (1. item)" onClick={handleNumbered}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1.5"/></svg>
        </ToolBtn>
        <div style={{ width: "1px", height: "18px", background: "#e2e8f0", margin: "0 2px" }} />
        <ToolBtn title="Em dash -" onClick={() => insertAtCursor(" - ")}>-</ToolBtn>
        <ToolBtn title="Insert line break" onClick={() => { editorRef.current?.focus(); document.execCommand("insertText", false, "\n"); onChange(toText(editorRef.current)); }}>↵</ToolBtn>
      </div>

      {/* Editable area */}
      <div
        ref={initEditor}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        data-placeholder={placeholder}
        style={{
          minHeight: minH, padding: "10px 12px",
          fontSize: "13px", color: "#0f172a", lineHeight: "1.7",
          outline: "none", fontFamily: "inherit", whiteSpace: "pre-wrap",
          wordBreak: "break-word", background: "#fff",
        }}
      />
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
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
          <RichEditor
            value={form.summary}
            onChange={v => set("summary", v)}
            placeholder="Brief description shown on the careers listing page..."
            rows={3}
          />
        </Field>

        {/* Responsibilities */}
        <Field label="Responsibilities" required>
          <RichEditor
            value={form.responsibilities}
            onChange={v => set("responsibilities", v)}
            placeholder={"List each responsibility on a new line:\n- Build and nurture developer relationships\n- Create technical content..."}
            rows={6}
          />
        </Field>

        {/* Requirements */}
        <Field label="Requirements" required>
          <RichEditor
            value={form.requirements}
            onChange={v => set("requirements", v)}
            placeholder={"List each requirement on a new line:\n- 2+ years of experience\n- Strong communication skills..."}
            rows={5}
          />
        </Field>

        {/* Nice to Have */}
        <Field label="Nice to Have Expertise (Optional)">
          <RichEditor
            value={form.nice_to_have}
            onChange={v => set("nice_to_have", v)}
            placeholder={"Optional bonus skills:\n- Experience with Web3 protocols\n- Prior open source contributions..."}
            rows={3}
          />
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
            {form.is_active ? "Active - visible on /careers" : "Inactive - hidden from public"}
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
