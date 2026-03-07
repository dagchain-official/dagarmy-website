"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlassTerminalForm({ onSuccess }) {
  const [form, setForm] = useState({
    full_name: "", email: "", country: "", telegram: "",
    social_links: "", follower_count: "", content_niche: "", statement: "",
  });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.country) {
      setErr("Full name, email and country are required."); return;
    }
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/ambassador/apply", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Submission failed");
      onSuccess();
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const fields = [
    { id: "full_name",      label: "Full Name",         placeholder: "Your full name",          type: "text" },
    { id: "email",          label: "Email Address",     placeholder: "you@example.com",         type: "email" },
    { id: "country",        label: "Country",           placeholder: "Country of origin",       type: "text" },
    { id: "telegram",       label: "Telegram Handle",  placeholder: "@yourhandle (optional)",  type: "text" },
    { id: "social_links",   label: "Social Links",      placeholder: "YT / IG / FB / X URLs",   type: "text" },
    { id: "follower_count", label: "Follower Count",    placeholder: "e.g. 15,000",             type: "text" },
    { id: "content_niche",  label: "Content Niche",     placeholder: "AI / Web3 / Finance...",  type: "text" },
  ];

  const inp = (id) => ({
    width: "100%", background: focused === id ? "#fafaff" : "#f8f9fb",
    border: focused === id ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb",
    borderRadius: "12px", padding: "11px 14px", fontSize: "14px",
    color: "#111", outline: "none", boxSizing: "border-box",
    transition: "all 0.2s", fontFamily: "inherit",
    boxShadow: focused === id ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
  });

  const lbl = {
    display: "block", fontSize: "11px", fontWeight: 700, color: "#6b7280",
    marginBottom: "6px", letterSpacing: "0.04em", textTransform: "uppercase",
  };

  return (
    <div style={{ background: "#ffffff", borderRadius: "24px", padding: "40px", boxShadow: "0 24px 64px rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.08)", borderRadius: "100px", padding: "6px 14px", marginBottom: "16px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1", letterSpacing: "0.06em", textTransform: "uppercase" }}>Ambassador Application</span>
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: 900, color: "#0f0f0f", letterSpacing: "-0.8px" }}>Apply to the Program</h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#9ca3af", lineHeight: 1.7 }}>All applications are reviewed personally. We reply to shortlisted candidates within 5–10 business days.</p>
      </div>

      <form onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          {fields.slice(0, 4).map((f) => (
            <div key={f.id}>
              <label style={lbl}>{f.label}</label>
              <input
                type={f.type}
                value={form[f.id]}
                onChange={set(f.id)}
                placeholder={f.placeholder}
                onFocus={() => setFocused(f.id)}
                onBlur={() => setFocused(null)}
                style={inp(f.id)}
              />
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          {fields.slice(4).map((f) => (
            <div key={f.id}>
              <label style={lbl}>{f.label}</label>
              <input
                type={f.type}
                value={form[f.id]}
                onChange={set(f.id)}
                placeholder={f.placeholder}
                onFocus={() => setFocused(f.id)}
                onBlur={() => setFocused(null)}
                style={inp(f.id)}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={lbl}>Why DAG Army?</label>
          <textarea
            value={form.statement}
            onChange={set("statement")}
            placeholder="Tell us about your audience, your vision, and why you want to represent the ecosystem..."
            rows={4}
            onFocus={() => setFocused("statement")}
            onBlur={() => setFocused(null)}
            style={{ ...inp("statement"), resize: "vertical", lineHeight: 1.75 }}
          />
        </div>

        {err && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "16px", padding: "12px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px", fontSize: "13px", color: "#dc2626" }}>
            {err}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01, boxShadow: "0 8px 32px rgba(99,102,241,0.35)" }}
          whileTap={{ scale: 0.99 }}
          style={{
            width: "100%", padding: "15px", background: loading ? "#a5b4fc" : "#6366f1",
            border: "none", borderRadius: "14px", fontSize: "15px",
            fontWeight: 700, color: "#fff", cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
            transition: "background 0.2s", letterSpacing: "-0.01em",
          }}>
          {loading ? "Submitting..." : "Submit Application →"}
        </motion.button>

        <p style={{ margin: "12px 0 0", textAlign: "center", fontSize: "12px", color: "#9ca3af" }}>
          Applications reviewed within 5–10 business days. No fee required.
        </p>
      </form>
    </div>
  );
}
