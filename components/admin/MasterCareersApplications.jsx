"use client";
import React, { useState, useEffect, useCallback } from "react";

function ResumeDownload({ filename, label }) {
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/career-resume?file=${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
      else alert("Could not generate download link.");
    } catch { alert("Failed to fetch resume link."); }
    finally { setLoading(false); }
  };
  return (
    <button onClick={handleDownload} disabled={loading} style={{
      background: "none", border: "none", padding: 0, color: "#3b82f6",
      fontSize: "13px", fontWeight: "500", cursor: loading ? "wait" : "pointer", textDecoration: "underline",
    }}>
      {loading ? "Generating link..." : `Download ${label}`}
    </button>
  );
}

const STATUS_CONFIG = {
  new:         { label: "New",         bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  reviewed:    { label: "Reviewed",    bg: "#fefce8", color: "#a16207", border: "#fde68a" },
  shortlisted: { label: "Shortlisted", bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  rejected:    { label: "Rejected",    bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 10px",
      borderRadius: "6px", fontSize: "12px", fontWeight: "600",
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, whiteSpace: "nowrap",
    }}>{cfg.label}</span>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", minWidth: "70px", paddingTop: "1px" }}>{label}</span>
      <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: "500", flex: 1, wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

function EmailModal({ app, onClose }) {
  const [subject, setSubject] = useState(`Re: Your application for ${app.role_title}`);
  const [message, setMessage] = useState(
    `Hi ${app.name.split(" ")[0]},\n\nThank you for your interest in the ${app.role_title} role at DAGARMY.\n\n`
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) { setError("Subject and message are required."); return; }
    setSending(true); setError("");
    try {
      const res = await fetch("/api/admin/careers/email-applicant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: app.email, subject: subject.trim(), message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSent(true);
      setTimeout(onClose, 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "13px", color: "#0f172a",
    outline: "none", background: "#fff", fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1300,
      background: "rgba(15,23,42,0.6)", backdropFilter: "blur(3px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: "18px", width: "100%", maxWidth: "540px",
        padding: "28px 32px", margin: "0 16px", boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ margin: "0 0 3px", fontSize: "17px", fontWeight: "800", color: "#0f172a" }}>Email Applicant</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>To: <strong>{app.email}</strong></p>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 12px", marginBottom: "14px", fontSize: "13px", color: "#dc2626" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px" }}>Subject</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle}
            onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px" }}>Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={8}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }} />
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: "9px", border: "1.5px solid #e2e8f0",
            background: "#fff", color: "#64748b", fontSize: "13px", fontWeight: "600", cursor: "pointer",
          }}>Cancel</button>
          <button onClick={handleSend} disabled={sending || sent} style={{
            padding: "10px 24px", borderRadius: "9px", border: "none",
            background: sent ? "#10b981" : sending ? "#94a3b8" : "#6366f1",
            color: "#fff", fontSize: "13px", fontWeight: "700",
            cursor: sending || sent ? "not-allowed" : "pointer", transition: "background 0.2s",
            display: "flex", alignItems: "center", gap: "7px",
          }}>
            {sent ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Sent!</>
            ) : sending ? "Sending..." : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Email</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ app, onClose, onStatusChange }) {
  const [status, setStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onStatusChange(app.id, status, notes);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.5)", backdropFilter: "blur(3px)",
        display: "flex", justifyContent: "flex-end",
      }} onClick={onClose}>
        <div style={{
          width: "100%", maxWidth: "520px", background: "#fff", height: "100vh",
          overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
          display: "flex", flexDirection: "column",
        }} onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
            <div>
              <p style={{ margin: "0 0 3px", fontSize: "11px", fontWeight: "700", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                {app.department} — {app.region}
              </p>
              <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px" }}>{app.role_title}</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Applied {new Date(app.applied_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "24px 28px", flex: 1 }}>
            {/* Applicant info */}
            <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px 18px", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" }}>Applicant</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Row label="Name" value={app.name} />
                <Row label="Email" value={<a href={`mailto:${app.email}`} style={{ color: "#3b82f6", textDecoration: "none" }}>{app.email}</a>} />
                {app.phone && <Row label="Phone" value={app.phone} />}
                {app.linkedin_url && (
                  <Row label="LinkedIn" value={<a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none", wordBreak: "break-all" }}>View Profile</a>} />
                )}
                {app.resume_url && (
                  <Row label="Resume" value={<ResumeDownload filename={app.resume_url} label={app.resume_filename || "Resume"} />} />
                )}
              </div>
            </div>

            {/* Email button */}
            <button onClick={() => setShowEmail(true)} style={{
              width: "100%", padding: "10px", borderRadius: "10px", marginBottom: "16px",
              border: "1.5px solid #6366f1", background: "#eff0ff",
              color: "#6366f1", fontSize: "13px", fontWeight: "700", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
              transition: "all 0.15s",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Email Applicant
            </button>

            {/* Cover letter */}
            {app.cover_letter && (
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" }}>Cover Letter</p>
                <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", fontSize: "13px", color: "#374151", lineHeight: "1.7", borderLeft: "3px solid #6366f1", whiteSpace: "pre-wrap" }}>
                  {app.cover_letter}
                </div>
              </div>
            )}

            {/* Status */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>Status</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button key={key} onClick={() => setStatus(key)} style={{
                    padding: "6px 14px", borderRadius: "8px", border: "1.5px solid",
                    borderColor: status === key ? cfg.color : "#e2e8f0",
                    background: status === key ? cfg.bg : "#fff",
                    color: status === key ? cfg.color : "#64748b",
                    fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s",
                  }}>{cfg.label}</button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>Internal Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                placeholder="Add notes about this applicant..."
                style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", color: "#0f172a", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", background: "#fff" }}
                onFocus={e => { e.target.style.border = "1.5px solid #6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                onBlur={e => { e.target.style.border = "1.5px solid #e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <button onClick={handleSave} disabled={saving} style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              background: saved ? "#10b981" : saving ? "#94a3b8" : "#0f172a",
              color: "#fff", border: "none", fontSize: "14px", fontWeight: "700",
              cursor: saving ? "not-allowed" : "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}>
              {saved ? (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Saved</>) : saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {showEmail && <EmailModal app={app} onClose={() => setShowEmail(false)} />}
    </>
  );
}

const filterBtnStyle = (active) => ({
  padding: "6px 14px", borderRadius: "8px", border: "1.5px solid",
  borderColor: active ? "#6366f1" : "#e2e8f0",
  background: active ? "#eff0ff" : "#fff",
  color: active ? "#6366f1" : "#64748b",
  fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s",
});

export default function MasterCareersApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [search, setSearch] = useState("");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/careers");
      const data = await res.json();
      if (res.ok) setApplications(data.applications || []);
    } catch (err) { console.error("Fetch applications error:", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleStatusChange = async (id, status, notes) => {
    try {
      const res = await fetch(`/api/admin/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status, notes } : a));
        if (selected?.id === id) setSelected(prev => ({ ...prev, status, notes }));
      }
    } catch (err) { console.error("Update error:", err); }
  };

  const roles = ["all", ...new Set(applications.map(a => a.role_slug))];
  const filtered = applications.filter(a => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterRole !== "all" && a.role_slug !== filterRole) return false;
    if (search && !`${a.name} ${a.email} ${a.role_title}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: applications.length,
    new: applications.filter(a => a.status === "new").length,
    shortlisted: applications.filter(a => a.status === "shortlisted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Total", value: stats.total, color: "#6366f1", bg: "#eff0ff" },
          { label: "New", value: stats.new, color: "#2563eb", bg: "#eff6ff" },
          { label: "Shortlisted", value: stats.shortlisted, color: "#16a34a", bg: "#f0fdf4" },
          { label: "Rejected", value: stats.rejected, color: "#dc2626", bg: "#fef2f2" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "12px", padding: "16px 18px", border: "1px solid #e8edf5", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: "800", fontSize: "15px" }}>{s.value}</div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e8edf5", padding: "14px 18px", marginBottom: "18px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search by name, email or role..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", paddingLeft: "32px", paddingRight: "10px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            onFocus={e => { e.target.style.borderColor = "#6366f1"; }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button style={filterBtnStyle(filterStatus === "all")} onClick={() => setFilterStatus("all")}>All</button>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button key={key} style={filterBtnStyle(filterStatus === key)} onClick={() => setFilterStatus(key)}>{cfg.label}</button>
          ))}
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          style={{ padding: "7px 24px 7px 10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13px", background: "#fff", outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
          <option value="all">All Roles</option>
          {roles.filter(r => r !== "all").map(r => (
            <option key={r} value={r}>{applications.find(a => a.role_slug === r)?.role_title || r}</option>
          ))}
        </select>
        <button onClick={fetchApplications} style={{ display: "flex", alignItems: "center", gap: "5px", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: "600", color: "#475569", cursor: "pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8edf5", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ width: "28px", height: "28px", border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", margin: "0 auto 10px", animation: "spin 0.7s linear infinite" }} />
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>Loading applications...</p>
            <style>{`@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <p style={{ color: "#94a3b8", fontSize: "15px", fontWeight: "600", margin: "0 0 4px" }}>No applications found</p>
            <p style={{ color: "#cbd5e1", fontSize: "13px", margin: 0 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Applicant", "Role", "Region", "Applied", "Status", ""].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", background: "#f8fafc", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, idx) => (
                <tr key={app.id}
                  style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f8fafc" : "none", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onClick={() => setSelected(app)}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>{app.name}</div>
                    <div style={{ color: "#64748b", fontSize: "12px", marginTop: "1px" }}>{app.email}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: "600", color: "#374151", fontSize: "13px" }}>{app.role_title}</div>
                    <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "1px" }}>{app.department}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}><span style={{ fontSize: "13px", color: "#64748b" }}>{app.region || "—"}</span></td>
                  <td style={{ padding: "14px 16px" }}><span style={{ fontSize: "13px", color: "#64748b", whiteSpace: "nowrap" }}>{new Date(app.applied_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span></td>
                  <td style={{ padding: "14px 16px" }}><StatusBadge status={app.status} /></td>
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={e => { e.stopPropagation(); setSelected(app); }} style={{ background: "#f1f5f9", border: "none", borderRadius: "7px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", color: "#475569", cursor: "pointer" }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#94a3b8", textAlign: "right" }}>
        Showing {filtered.length} of {applications.length} applications
      </p>

      {selected && <DetailPanel app={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}
    </div>
  );
}
