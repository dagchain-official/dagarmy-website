"use client";
import { useState, useEffect, useCallback } from "react";
import JobPostingForm from "@/components/admin/JobPostingForm";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://dagarmy.network";

function Badge({ label, active }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 10px",
      borderRadius: "6px", fontSize: "12px", fontWeight: "600",
      background: active ? "#f0fdf4" : "#f8fafc",
      color: active ? "#16a34a" : "#94a3b8",
      border: `1px solid ${active ? "#bbf7d0" : "#e2e8f0"}`,
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function TypeBadge({ label }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 8px",
      borderRadius: "5px", fontSize: "11px", fontWeight: "600",
      background: "#eff0ff", color: "#6366f1", border: "1px solid #c7d2fe",
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function CopyableUrl({ slug }) {
  const [copied, setCopied] = useState(false);
  const url = `${BASE_URL}/careers/${slug}`;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", maxWidth: "260px" }}>
      <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
        /careers/{slug}
      </span>
      <button onClick={handleCopy} title="Copy redirect URL" style={{
        background: copied ? "#f0fdf4" : "#f8fafc", border: `1px solid ${copied ? "#bbf7d0" : "#e2e8f0"}`,
        borderRadius: "6px", padding: "3px 8px", cursor: "pointer", fontSize: "11px",
        fontWeight: "600", color: copied ? "#16a34a" : "#64748b", flexShrink: 0, transition: "all 0.15s",
      }}>
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default function JobPostingsManager() {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPostings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/job-postings");
      const data = await res.json();
      if (res.ok) setPostings(data.postings || []);
    } catch (err) {
      console.error("Fetch postings error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPostings(); }, [fetchPostings]);

  const handleCreate = async (form) => {
    const res = await fetch("/api/admin/job-postings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create");
    setPostings(prev => [data.posting, ...prev]);
    setShowForm(false);
    showToast("Job posting created successfully!");
  };

  const handleEdit = async (form) => {
    const res = await fetch(`/api/admin/job-postings/${editTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update");
    setPostings(prev => prev.map(p => p.id === editTarget.id ? data.posting : p));
    setEditTarget(null);
    showToast("Job posting updated!");
  };

  const handleToggle = async (posting) => {
    const res = await fetch(`/api/admin/job-postings/${posting.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !posting.is_active }),
    });
    const data = await res.json();
    if (res.ok) {
      setPostings(prev => prev.map(p => p.id === posting.id ? data.posting : p));
      showToast(`Job ${data.posting.is_active ? "activated" : "deactivated"}`);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/job-postings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPostings(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
      showToast("Job posting deleted.", "error");
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "24px", right: "24px", zIndex: 9999,
          background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`,
          color: toast.type === "error" ? "#dc2626" : "#16a34a",
          padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "600",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ margin: "0 0 3px", fontSize: "18px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px" }}>Job Postings</h2>
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            {postings.filter(p => p.is_active).length} active · {postings.length} total
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={fetchPostings} style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "10px",
            padding: "9px 14px", fontSize: "13px", fontWeight: "600", color: "#475569", cursor: "pointer",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
          <button onClick={() => setShowForm(true)} style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: "#0f172a", border: "none", borderRadius: "10px",
            padding: "9px 18px", fontSize: "13px", fontWeight: "700", color: "#fff", cursor: "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Job Posting
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ padding: "48px", textAlign: "center" }}>
          <div style={{ width: "28px", height: "28px", border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", margin: "0 auto 10px", animation: "spin 0.7s linear infinite" }} />
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>Loading job postings...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : postings.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8edf5", padding: "60px", textAlign: "center" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
          <p style={{ color: "#94a3b8", fontSize: "15px", fontWeight: "600", margin: "0 0 4px" }}>No job postings yet</p>
          <p style={{ color: "#cbd5e1", fontSize: "13px", margin: "0 0 20px" }}>Create your first job posting to get started</p>
          <button onClick={() => setShowForm(true)} style={{
            background: "#0f172a", border: "none", borderRadius: "10px",
            padding: "10px 22px", fontSize: "13px", fontWeight: "700", color: "#fff", cursor: "pointer",
          }}>
            Create Job Posting
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {postings.map(p => (
            <div key={p.id} style={{
              background: "#fff", borderRadius: "14px", border: "1px solid #e8edf5",
              padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              opacity: p.is_active ? 1 : 0.6,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                {/* Left */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.2px" }}>{p.title}</h3>
                    <Badge label={p.is_active ? "Active" : "Inactive"} active={p.is_active} />
                    <TypeBadge label={p.employment_type} />
                  </div>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "10px" }}>
                    {p.department && (
                      <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                        {p.department}
                      </span>
                    )}
                    <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {p.location}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      {p.work_mode}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <CopyableUrl slug={p.slug} />
                </div>

                {/* Right actions */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0, alignItems: "center" }}>
                  <button
                    onClick={() => handleToggle(p)}
                    title={p.is_active ? "Deactivate" : "Activate"}
                    style={{
                      padding: "7px 14px", borderRadius: "8px", border: "1.5px solid #e2e8f0",
                      background: "#fff", color: "#64748b", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                    }}
                  >
                    {p.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => setEditTarget(p)}
                    style={{
                      padding: "7px 14px", borderRadius: "8px", border: "1.5px solid #e2e8f0",
                      background: "#fff", color: "#374151", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(p)}
                    style={{
                      padding: "7px 10px", borderRadius: "8px", border: "1.5px solid #fecaca",
                      background: "#fef2f2", color: "#dc2626", fontSize: "12px", cursor: "pointer",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
              {p.summary && (
                <p style={{ margin: "12px 0 0", fontSize: "13px", color: "#64748b", lineHeight: 1.6, borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                  {p.summary.length > 180 ? p.summary.slice(0, 180) + "…" : p.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <JobPostingForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {/* Edit Form */}
      {editTarget && (
        <JobPostingForm initial={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1200,
          background: "rgba(15,23,42,0.5)", backdropFilter: "blur(3px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setDeleteConfirm(null)}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "28px 32px", maxWidth: "400px", width: "100%", margin: "0 16px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: "800", color: "#0f172a" }}>Delete Job Posting?</h3>
            <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
              Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                padding: "9px 20px", borderRadius: "9px", border: "1.5px solid #e2e8f0",
                background: "#fff", color: "#64748b", fontSize: "13px", fontWeight: "600", cursor: "pointer",
              }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{
                padding: "9px 20px", borderRadius: "9px", border: "none",
                background: "#dc2626", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer",
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
