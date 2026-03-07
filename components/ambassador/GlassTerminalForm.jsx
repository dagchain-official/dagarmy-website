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
      setErr("IDENTIFIER, EMAIL and COUNTRY fields are required."); return;
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
    { id: "full_name",      label: "IDENTIFIER",       placeholder: "FULL_NAME...",           type: "text" },
    { id: "email",          label: "SECURE_CHANNEL",   placeholder: "EMAIL_ADDRESS...",       type: "email" },
    { id: "country",        label: "GEO_NODE",         placeholder: "COUNTRY_OF_ORIGIN...",   type: "text" },
    { id: "telegram",       label: "COMM_HANDLE",      placeholder: "TELEGRAM/@HANDLE...",    type: "text" },
    { id: "social_links",   label: "NETWORK_LINKS",    placeholder: "YT/IG/FB/X URLS...",     type: "text" },
    { id: "follower_count", label: "REACH_METRIC",     placeholder: "TOTAL_FOLLOWERS...",     type: "text" },
    { id: "content_niche",  label: "SIGNAL_TYPE",      placeholder: "AI / WEB3 / FINANCE...", type: "text" },
  ];

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px", padding: "12px 14px", fontFamily: "monospace", fontSize: "13px",
    color: "#e5e5e5", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
    letterSpacing: "0.03em",
  };
  const inputFocusStyle = { ...inputStyle, borderColor: "rgba(99,102,241,0.6)", background: "rgba(99,102,241,0.06)" };

  return (
    <div style={{
      position: "relative", padding: "1.5px",
      background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2), rgba(6,182,212,0.3))",
      borderRadius: "22px",
    }}>
      <div style={{
        background: "rgba(5,5,5,0.92)", borderRadius: "21px",
        backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
        padding: "32px",
      }}>
        {/* Terminal header */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "rgba(239,68,68,0.55)" }} />
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "rgba(234,179,8,0.55)" }} />
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "rgba(34,197,94,0.55)" }} />
          </div>
          <span style={{ marginLeft: "10px", fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "2.5px", textTransform: "uppercase" }}>
            SECURE_ENROLLMENT_PROTOCOL_V3.0
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.8)", animation: "blink 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(34,197,94,0.6)", letterSpacing: "1px" }}>SECURE</span>
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            {fields.slice(0, 4).map((f) => (
              <div key={f.id} style={{ position: "relative" }}>
                <label style={{ display: "block", fontFamily: "monospace", fontSize: "9px", color: focused === f.id ? "rgba(99,102,241,0.9)" : "rgba(99,102,241,0.5)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "7px", transition: "color 0.2s" }}>
                  {`> ${f.label}`}
                </label>
                <input
                  type={f.type}
                  value={form[f.id]}
                  onChange={set(f.id)}
                  placeholder={f.placeholder}
                  onFocus={() => setFocused(f.id)}
                  onBlur={() => setFocused(null)}
                  style={focused === f.id ? inputFocusStyle : inputStyle}
                />
                <AnimatePresence>
                  {focused === f.id && (
                    <motion.div
                      layoutId="inputGlow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ position: "absolute", inset: 0, borderRadius: "10px", border: "1px solid rgba(99,102,241,0.5)", boxShadow: "0 0 20px rgba(99,102,241,0.15)", pointerEvents: "none", top: "auto", bottom: 0, height: "calc(100% - 24px)" }}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            {fields.slice(4).map((f) => (
              <div key={f.id} style={{ position: "relative" }}>
                <label style={{ display: "block", fontFamily: "monospace", fontSize: "9px", color: focused === f.id ? "rgba(99,102,241,0.9)" : "rgba(99,102,241,0.5)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "7px", transition: "color 0.2s" }}>
                  {`> ${f.label}`}
                </label>
                <input
                  type={f.type}
                  value={form[f.id]}
                  onChange={set(f.id)}
                  placeholder={f.placeholder}
                  onFocus={() => setFocused(f.id)}
                  onBlur={() => setFocused(null)}
                  style={focused === f.id ? inputFocusStyle : inputStyle}
                />
              </div>
            ))}
          </div>

          {/* Mission statement */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontFamily: "monospace", fontSize: "9px", color: focused === "statement" ? "rgba(99,102,241,0.9)" : "rgba(99,102,241,0.5)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "7px", transition: "color 0.2s" }}>
              {`> MISSION_STATEMENT`}
            </label>
            <textarea
              value={form.statement}
              onChange={set("statement")}
              placeholder="WHY DAG ARMY? DESCRIBE YOUR AUDIENCE AND VISION..."
              rows={4}
              onFocus={() => setFocused("statement")}
              onBlur={() => setFocused(null)}
              style={{ ...focused === "statement" ? inputFocusStyle : inputStyle, resize: "vertical", lineHeight: "1.7" }}
            />
          </div>

          {err && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: "16px", padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", fontFamily: "monospace", fontSize: "12px", color: "rgba(239,68,68,0.8)" }}>
              ERROR: {err}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01, boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.99 }}
            style={{
              width: "100%", padding: "15px", background: loading ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.9)",
              border: "none", borderRadius: "12px", fontFamily: "monospace", fontSize: "13px",
              fontWeight: 700, color: "#fff", cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "2px", textTransform: "uppercase",
              boxShadow: "0 0 20px rgba(99,102,241,0.3)",
              transition: "background 0.2s",
            }}>
            {loading ? "INITIALIZING..." : "INITIALIZE_APPLICATION →"}
          </motion.button>

          <p style={{ margin: "12px 0 0", textAlign: "center", fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.18)", letterSpacing: "1px" }}>
            APPLICATIONS_REVIEWED_WITHIN: 5–10_BUSINESS_DAYS
          </p>
        </form>
      </div>
    </div>
  );
}
