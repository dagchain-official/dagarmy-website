"use client";
import React, { useState, useEffect, useRef } from "react";

const COLOR_PRESETS = [
  { label: "Indigo", value: "#6366f1" },
  { label: "Blue", value: "#2563eb" },
  { label: "Green", value: "#16a34a" },
  { label: "Purple", value: "#9333ea" },
  { label: "Orange", value: "#ea580c" },
  { label: "Sky", value: "#0284c7" },
  { label: "Amber", value: "#d97706" },
  { label: "Rose", value: "#e11d48" },
];

function Spinner() {
  return (
    <div style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid #e2e8f0", borderTop: "2px solid #6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "error" ? "#fef2f2" : "#f0fdf4";
  const color = type === "error" ? "#dc2626" : "#16a34a";
  const border = type === "error" ? "#fecaca" : "#bbf7d0";
  return (
    <div style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 9999, background: bg, border: `1px solid ${border}`, borderRadius: "12px", padding: "14px 20px", fontSize: "14px", fontWeight: "600", color, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "10px", maxWidth: "380px" }}>
      {type === "error" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      )}
      {msg}
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color, display: "flex" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 8000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "24px 28px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: "28px" }}>{children}</div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px",
  fontSize: "14px", color: "#0f172a", background: "#fafafa", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s",
};
const labelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "6px", letterSpacing: "0.3px", textTransform: "uppercase" };
const btnPrimary = { padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" };
const btnDanger = { padding: "8px 14px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" };
const btnSecondary = { padding: "8px 14px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" };

export default function FAQManagement() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal states
  const [sectionModal, setSectionModal] = useState(null); // null | { mode: 'add'|'edit', data? }
  const [questionModal, setQuestionModal] = useState(null); // null | { mode: 'add'|'edit', sectionId, data? }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // null | { type: 'section'|'question', id, label }

  const [saving, setSaving] = useState(false);

  const notify = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => { fetchSections(); }, []);

  async function fetchSections() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faq/sections");
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      setSections(d.sections || []);
      if (d.sections?.length > 0 && !activeSectionId) setActiveSectionId(d.sections[0].id);
    } catch (e) {
      notify(e.message || "Failed to load FAQs", "error");
    } finally {
      setLoading(false);
    }
  }

  // ── Section CRUD ────────────────────────────────────────────
  async function saveSection(form) {
    setSaving(true);
    try {
      const isEdit = sectionModal?.mode === "edit";
      const url = isEdit ? `/api/admin/faq/sections/${sectionModal.data.id}` : "/api/admin/faq/sections";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      notify(isEdit ? "Section updated" : "Section created");
      setSectionModal(null);
      await fetchSections();
      if (!isEdit) setActiveSectionId(d.section.id);
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSection(id) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/faq/sections/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      notify("Section deleted");
      setDeleteConfirm(null);
      const remaining = sections.filter(s => s.id !== id);
      setSections(remaining);
      setActiveSectionId(remaining[0]?.id || null);
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setSaving(false);
    }
  }

  // ── Question CRUD ───────────────────────────────────────────
  async function saveQuestion(form) {
    setSaving(true);
    try {
      const isEdit = questionModal?.mode === "edit";
      const url = isEdit ? `/api/admin/faq/questions/${questionModal.data.id}` : "/api/admin/faq/questions";
      const method = isEdit ? "PATCH" : "POST";
      const payload = isEdit ? { question: form.question, answer: form.answer } : { ...form, section_id: questionModal.sectionId };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      notify(isEdit ? "Question updated" : "Question added");
      setQuestionModal(null);
      await fetchSections();
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuestion(id) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/faq/questions/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      notify("Question deleted");
      setDeleteConfirm(null);
      await fetchSections();
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setSaving(false);
    }
  }

  const activeSection = sections.find(s => s.id === activeSectionId);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "360px", gap: "12px", color: "#64748b" }}>
        <Spinner /> Loading FAQ data...
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Section Modal ──────────────────────────────────── */}
      {sectionModal && (
        <SectionModal
          mode={sectionModal.mode}
          data={sectionModal.data}
          saving={saving}
          onClose={() => setSectionModal(null)}
          onSave={saveSection}
        />
      )}

      {/* ── Question Modal ─────────────────────────────────── */}
      {questionModal && (
        <QuestionModal
          mode={questionModal.mode}
          data={questionModal.data}
          saving={saving}
          onClose={() => setQuestionModal(null)}
          onSave={saveQuestion}
        />
      )}

      {/* ── Delete Confirm Modal ───────────────────────────── */}
      {deleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <p style={{ margin: "0 0 24px", fontSize: "15px", color: "#374151", lineHeight: 1.6 }}>
            Are you sure you want to delete <strong>{deleteConfirm.label}</strong>?
            {deleteConfirm.type === "section" && " All questions inside this section will also be deleted."}
            {" "}This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button style={btnSecondary} onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button style={{ ...btnDanger, padding: "10px 20px" }} disabled={saving} onClick={() => {
              if (deleteConfirm.type === "section") deleteSection(deleteConfirm.id);
              else deleteQuestion(deleteConfirm.id);
            }}>
              {saving ? <Spinner /> : null}
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* ── Layout ────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px", alignItems: "start" }}>

        {/* LEFT: Sections sidebar */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Sections</h3>
            <button style={{ ...btnPrimary, padding: "7px 12px", fontSize: "12px" }} onClick={() => setSectionModal({ mode: "add" })}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add
            </button>
          </div>
          <div style={{ padding: "10px" }}>
            {sections.length === 0 && (
              <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", padding: "24px 0" }}>No sections yet</p>
            )}
            {sections.map((sec) => {
              const isActive = sec.id === activeSectionId;
              return (
                <button key={sec.id} onClick={() => setActiveSectionId(sec.id)} style={{
                  width: "100%", textAlign: "left", background: isActive ? "#ede9fe" : "transparent",
                  border: isActive ? "1px solid #c7d2fe" : "1px solid transparent",
                  borderRadius: "10px", padding: "12px 14px", cursor: "pointer",
                  marginBottom: "4px", display: "flex", alignItems: "center", gap: "10px",
                  transition: "all 0.15s",
                }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: sec.color_accent || "#6366f1", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: isActive ? "#6366f1" : "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sec.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                      {(sec.faq_questions || []).length} question{(sec.faq_questions || []).length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  {isActive && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Questions panel */}
        <div>
          {!activeSection ? (
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "64px 32px", textAlign: "center", color: "#94a3b8" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: "16px", opacity: 0.4 }}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p style={{ margin: 0, fontSize: "15px" }}>Select or create a section to manage its questions</p>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              {/* Section header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: activeSection.color_accent || "#6366f1", flexShrink: 0 }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>{activeSection.label}</h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>{(activeSection.faq_questions || []).length} questions</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={btnSecondary} onClick={() => setSectionModal({ mode: "edit", data: activeSection })}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit Section
                  </button>
                  <button style={btnDanger} onClick={() => setDeleteConfirm({ type: "section", id: activeSection.id, label: activeSection.label })}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                    Delete
                  </button>
                  <button style={btnPrimary} onClick={() => setQuestionModal({ mode: "add", sectionId: activeSection.id })}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Question
                  </button>
                </div>
              </div>

              {/* Questions list */}
              <div style={{ padding: "16px" }}>
                {(activeSection.faq_questions || []).length === 0 && (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: "12px", opacity: 0.4 }}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <p style={{ margin: 0, fontSize: "14px" }}>No questions in this section yet</p>
                  </div>
                )}
                {(activeSection.faq_questions || []).map((q, i) => (
                  <QuestionRow
                    key={q.id}
                    question={q}
                    index={i}
                    accentColor={activeSection.color_accent}
                    onEdit={() => setQuestionModal({ mode: "edit", sectionId: activeSection.id, data: q })}
                    onDelete={() => setDeleteConfirm({ type: "question", id: q.id, label: q.question })}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function QuestionRow({ question, index, accentColor, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "10px", overflow: "hidden", transition: "box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: "14px", cursor: "pointer", background: expanded ? "#fafafa" : "#fff" }}
        onClick={() => setExpanded(!expanded)}>
        <div style={{ flexShrink: 0, width: "24px", height: "24px", borderRadius: "8px", background: accentColor + "18", display: "flex", alignItems: "center", justifyContent: "center", color: accentColor, fontSize: "11px", fontWeight: "700", marginTop: "1px" }}>
          {index + 1}
        </div>
        <p style={{ margin: 0, flex: 1, fontSize: "14px", fontWeight: "600", color: "#1e293b", lineHeight: 1.5 }}>{question.question}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <button style={btnSecondary} onClick={e => { e.stopPropagation(); onEdit(); }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button style={btnDanger} onClick={e => { e.stopPropagation(); onDelete(); }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            Delete
          </button>
          <div style={{ color: "#94a3b8", transition: "transform 0.25s", transform: expanded ? "rotate(180deg)" : "none", display: "flex" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 20px 18px 58px", animation: "fadeIn 0.2s ease" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: 1.8, background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", borderLeft: `3px solid ${accentColor}` }}>
            {question.answer}
          </p>
        </div>
      )}
    </div>
  );
}

function SectionModal({ mode, data, saving, onClose, onSave }) {
  const [form, setForm] = useState({ label: data?.label || "", color_accent: data?.color_accent || "#6366f1" });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title={mode === "add" ? "Add Section" : "Edit Section"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={labelStyle}>Section Name *</label>
          <input style={inputStyle} value={form.label} onChange={set("label")} placeholder="e.g. About DAGARMY"
            onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>
        <div>
          <label style={labelStyle}>Accent Colour</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            {COLOR_PRESETS.map(p => (
              <button key={p.value} title={p.label} onClick={() => setForm(f => ({ ...f, color_accent: p.value }))}
                style={{ width: "28px", height: "28px", borderRadius: "50%", background: p.value, border: form.color_accent === p.value ? "3px solid #0f172a" : "3px solid transparent", cursor: "pointer", flexShrink: 0 }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="color" value={form.color_accent} onChange={set("color_accent")} style={{ width: "40px", height: "36px", border: "1.5px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", padding: "2px" }} />
            <input style={{ ...inputStyle, flex: 1 }} value={form.color_accent} onChange={set("color_accent")} placeholder="#6366f1"
              onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "8px" }}>
          <button style={btnSecondary} onClick={onClose}>Cancel</button>
          <button style={btnPrimary} disabled={saving || !form.label.trim()} onClick={() => onSave(form)}>
            {saving ? <Spinner /> : null}
            {mode === "add" ? "Create Section" : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function QuestionModal({ mode, data, saving, onClose, onSave }) {
  const [form, setForm] = useState({ question: data?.question || "", answer: data?.answer || "" });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title={mode === "add" ? "Add Question" : "Edit Question"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={labelStyle}>Question *</label>
          <input style={inputStyle} value={form.question} onChange={set("question")} placeholder="Enter the FAQ question"
            onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>
        <div>
          <label style={labelStyle}>Answer *</label>
          <textarea style={{ ...inputStyle, minHeight: "160px", resize: "vertical" }} value={form.answer} onChange={set("answer")} placeholder="Enter the detailed answer"
            onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "8px" }}>
          <button style={btnSecondary} onClick={onClose}>Cancel</button>
          <button style={btnPrimary} disabled={saving || !form.question.trim() || !form.answer.trim()} onClick={() => onSave(form)}>
            {saving ? <Spinner /> : null}
            {mode === "add" ? "Add Question" : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
