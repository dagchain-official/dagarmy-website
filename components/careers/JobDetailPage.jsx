"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function parseLines(text) {
  if (!text) return [];
  return text.split("\n").map(l => l.trim()).filter(l => l.replace(/^[-•*]\s*/, "").trim());
}

function cleanLine(line) {
  return line.replace(/^[-•*]\s*/, "").trim();
}

export default function JobDetailPage({ slug }) {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    fetch(`/api/careers/jobs/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.job) setJob(d.job);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.7s linear infinite" }} />
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading job details...</p>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </section>
  );

  if (notFound) return (
    <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Job Not Found</h2>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>This job posting may have been removed or is no longer active.</p>
        <button onClick={() => router.push("/careers")} style={{
          background: "#0f172a", color: "#fff", border: "none", borderRadius: "10px",
          padding: "12px 24px", fontSize: "14px", fontWeight: "700", cursor: "pointer",
        }}>View All Open Roles</button>
      </div>
    </section>
  );

  const responsibilities = parseLines(job.responsibilities);
  const requirements = parseLines(job.requirements);
  const niceToHave = parseLines(job.nice_to_have);

  return (
    <>
      <section style={{ background: "#ffffff", paddingTop: "80px", paddingBottom: "0" }}>
        {/* Hero */}
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 24px 40px" }}>
          <button onClick={() => router.push("/careers")} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "none", border: "none", color: "#6366f1", fontSize: "13px",
            fontWeight: "600", cursor: "pointer", marginBottom: "28px", padding: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to all jobs
          </button>

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {job.department && (
              <span style={{ padding: "4px 12px", borderRadius: "6px", background: "#eff0ff", color: "#6366f1", border: "1px solid #c7d2fe", fontSize: "12px", fontWeight: "700" }}>
                {job.department}
              </span>
            )}
            <span style={{ padding: "4px 12px", borderRadius: "6px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", fontSize: "12px", fontWeight: "700" }}>
              {job.employment_type}
            </span>
            <span style={{ padding: "4px 12px", borderRadius: "6px", background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {job.location} · {job.work_mode}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: "16px" }}>
            {job.title}
          </h1>
          <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.8, marginBottom: "32px", maxWidth: "680px" }}>
            {job.summary}
          </p>

          <button onClick={() => setShowApply(true)} style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "#fff", border: "none", borderRadius: "12px",
            padding: "14px 32px", fontSize: "15px", fontWeight: "700", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            display: "inline-flex", alignItems: "center", gap: "8px",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(99,102,241,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.35)"; }}
          >
            Apply for this Role
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #f1f5f9" }} />

        {/* Content */}
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px 80px", display: "grid", gridTemplateColumns: "1fr minmax(220px, 260px)", gap: "60px", alignItems: "start" }}>
          {/* Main content */}
          <div>
            {responsibilities.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", letterSpacing: "-0.3px" }}>Responsibilities</h2>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {responsibilities.map((r, i) => (
                    <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", flexShrink: 0, marginTop: "7px" }} />
                      <span style={{ fontSize: "15px", color: "#374151", lineHeight: 1.7 }}>{cleanLine(r)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {requirements.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", letterSpacing: "-0.3px" }}>Requirements</h2>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {requirements.map((r, i) => (
                    <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", flexShrink: 0, marginTop: "7px" }} />
                      <span style={{ fontSize: "15px", color: "#374151", lineHeight: 1.7 }}>{cleanLine(r)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {niceToHave.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", letterSpacing: "-0.3px" }}>Nice to Have</h2>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {niceToHave.map((r, i) => (
                    <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f59e0b", flexShrink: 0, marginTop: "7px" }} />
                      <span style={{ fontSize: "15px", color: "#374151", lineHeight: 1.7 }}>{cleanLine(r)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={() => setShowApply(true)} style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#fff", border: "none", borderRadius: "12px",
              padding: "14px 32px", fontSize: "15px", fontWeight: "700", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            }}>
              Apply for this Role
            </button>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div style={{ background: "#f8fafc", borderRadius: "16px", border: "1px solid #e8edf5", padding: "24px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Job Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { label: "Location", value: job.location },
                  { label: "Work Mode", value: job.work_mode },
                  { label: "Type", value: job.employment_type },
                  { label: "Department", value: job.department || "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>{label}</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>{value}</div>
                  </div>
                ))}
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "20px 0" }} />
              <button onClick={() => setShowApply(true)} style={{
                width: "100%", background: "#0f172a", color: "#fff", border: "none",
                borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer",
              }}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} />}
    </>
  );
}

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", linkedin_url: "", cover_letter: "" });
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError("Name and email are required."); return; }
    setError(""); setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("phone", form.phone.trim());
      fd.append("linkedin_url", form.linkedin_url.trim());
      fd.append("cover_letter", form.cover_letter.trim());
      fd.append("role_slug", job.slug);
      fd.append("role_title", job.title);
      fd.append("department", job.department || "");
      fd.append("region", job.location || "");
      if (resume) fd.append("resume", resume);

      const res = await fetch("/api/careers/apply", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inp = {
    width: "100%", padding: "10px 12px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "14px", color: "#0f172a",
    outline: "none", background: "#fff", fontFamily: "inherit", boxSizing: "border-box",
  };
  const focus = e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; };
  const blur = e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; };
  const lbl = { display: "block", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "32px 16px" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "580px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Apply for</p>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#fff", letterSpacing: "-0.3px" }}>{job.title}</h2>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>{job.location} · {job.work_mode}</p>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Application Submitted!</h3>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>
                Thank you for applying. Our team will review your application and get back to you soon.
              </p>
              <button onClick={onClose} style={{ background: "#0f172a", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 28px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                Close
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 14px", marginBottom: "18px", fontSize: "13px", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={lbl}>Full Name <span style={{ color: "#ef4444" }}>*</span></label>
                  <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" style={inp} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={lbl}>Email <span style={{ color: "#ef4444" }}>*</span></label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" style={inp} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={lbl}>Phone (Optional)</label>
                  <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210" style={inp} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={lbl}>LinkedIn URL (Optional)</label>
                  <input value={form.linkedin_url} onChange={e => set("linkedin_url", e.target.value)} placeholder="linkedin.com/in/..." style={inp} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={lbl}>Resume / CV (PDF or DOCX, max 5MB)</label>
                <div style={{ border: "2px dashed #e2e8f0", borderRadius: "10px", padding: "20px", textAlign: "center", cursor: "pointer", transition: "border-color 0.15s" }}
                  onClick={() => document.getElementById("resumeInput").click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#6366f1"; }}
                  onDragLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#e2e8f0"; const f = e.dataTransfer.files[0]; if (f) setResume(f); }}>
                  <input id="resumeInput" type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => setResume(e.target.files[0])} />
                  {resume ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span style={{ fontSize: "13px", color: "#374151", fontWeight: "600" }}>{resume.name}</span>
                      <button onClick={e => { e.stopPropagation(); setResume(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>×</button>
                    </div>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ display: "block", margin: "0 auto 6px" }}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                      <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Click to upload or drag & drop</p>
                    </>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={lbl}>Cover Letter (Optional)</label>
                <textarea value={form.cover_letter} onChange={e => set("cover_letter", e.target.value)} rows={4}
                  placeholder="Tell us why you're a great fit for this role..."
                  style={{ ...inp, resize: "vertical" }} onFocus={focus} onBlur={blur} />
              </div>

              <button onClick={handleSubmit} disabled={submitting} style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: submitting ? "#94a3b8" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "#fff", fontSize: "15px", fontWeight: "700", cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}>
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
              <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>
                By submitting, you agree to our use of your data to process this application.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
