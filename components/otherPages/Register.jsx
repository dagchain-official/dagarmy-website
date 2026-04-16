"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield, Mail, Lock, Eye, EyeOff, Loader2,
  Check, AlertCircle, User, ChevronRight, ArrowLeft,
} from "lucide-react";

// ── Fingerprint (non-blocking, best-effort) ───────────────────────────────────
async function getFingerprint() {
  try {
    const FpJS = await import("@fingerprintjs/fingerprintjs");
    const fp = await FpJS.default.load();
    const { visitorId } = await fp.get();
    return visitorId;
  } catch { return null; }
}

// ── Google Icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// ── Shared input style ────────────────────────────────────────────────────────
const inputBase = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "12px",
  border: "1.5px solid #e5e7eb",
  background: "#fff",
  color: "#111827",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};

function Input({ icon: Icon, type = "text", placeholder, value, onChange, autoFocus, extra = {}, right }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon size={16} style={{
          position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
          color: focused ? "#6366f1" : "#9ca3af", transition: "color 0.15s", pointerEvents: "none",
        }} />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        style={{
          ...inputBase,
          paddingLeft: Icon ? "40px" : "14px",
          paddingRight: right ? "40px" : "14px",
          borderColor: focused ? "#6366f1" : "#e5e7eb",
          boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
          ...extra,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
      />
      {right}
    </div>
  );
}

function GradientBtn({ children, type = "button", onClick, disabled, loading }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: "100%",
        padding: "13px 16px",
        borderRadius: "14px",
        border: "none",
        background: disabled || loading
          ? "#d1d5db"
          : "linear-gradient(90deg, #22d3ee 0%, #818cf8 50%, #a855f7 100%)",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "opacity 0.15s",
        boxShadow: disabled || loading ? "none" : "0 4px 20px rgba(99,102,241,0.3)",
      }}
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "13px 16px",
        borderRadius: "14px",
        border: "1.5px solid #e5e7eb",
        background: hov ? "#f9fafb" : "#fff",
        color: "#111827",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 0.15s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
      <ChevronRight size={16} style={{ color: "#9ca3af", marginLeft: "auto" }} />
    </button>
  );
}

function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "8px",
      background: "#fef2f2", border: "1px solid #fecaca",
      borderRadius: "10px", padding: "10px 12px",
      marginBottom: "14px", fontSize: "13px", color: "#dc2626",
    }}>
      <AlertCircle size={15} style={{ marginTop: "1px", flexShrink: 0 }} />
      {msg}
    </div>
  );
}

// ── Referral validator hook ───────────────────────────────────────────────────
function useReferralValidation(code) {
  const [valid, setValid] = useState(null);
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!code || code.trim().length < 3) { setValid(null); return; }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/referral/validate?code=${code.trim()}`);
        const d = await res.json();
        setValid(d?.valid ?? false);
      } catch { setValid(null); }
    }, 600);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [code]);
  return valid;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Register() {
  const router = useRouter();
  const fpRef = useRef(null);

  // view: 'main' | 'register' | 'success'
  const [view, setView] = useState("main");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Register form state
  const [fullName, setFullName]     = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [role, setRole]             = useState("student");
  const [showPwd, setShowPwd]       = useState(false);
  const [referral, setReferral]     = useState("");
  const refValid = useReferralValidation(referral);

  useEffect(() => {
    getFingerprint().then(fp => { fpRef.current = fp; });
    // Grab ?ref= from URL and persist to localStorage so it survives OAuth redirects
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferral(ref.toUpperCase());
      localStorage.setItem('pending_referral_code', ref.toUpperCase());
    }
  }, []);

  useEffect(() => { setError(""); }, [view]);

  // ── Google sign-in ──────────────────────────────────────────────────────────
  const handleGoogle = () => {
    const ref = referral.trim() ? `&ref=${encodeURIComponent(referral.trim())}` : '';
    window.location.href = `/api/auth/google?redirect=/dashboard${ref}`;
  };

  // ── Email registration ──────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          role,
          fingerprint_id: fpRef.current || undefined,
          referral_code: referral.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
      } else {
        // Store token + user
        localStorage.setItem("dagarmy_token", data.token);
        localStorage.setItem("dagarmy_user", JSON.stringify(data.user));
        setView("success");
        setTimeout(() => router.push("/dashboard"), 1200);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5eeff 0%, #eef2ff 50%, #f0f9ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
    }}>
      {/* Background decoration */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)" }} />
      </div>

      <motion.div
        key={view}
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: "440px",
          borderRadius: "20px",
          background: "#f1f5f9",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
          overflow: "hidden",
          padding: "32px 28px 28px",
        }}
      >
        {/* ══ MAIN VIEW ══ */}
        {view === "main" && (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(99,102,241,0.35)", flexShrink: 0,
              }}>
                <Shield size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                  Join DAGARMY
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
                  Create your account or sign in
                </div>
              </div>
            </div>

            {/* Referral code input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                Referral Code <span style={{ color: "#f59e0b", fontWeight: 400 }}>(optional)</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={referral}
                  onChange={e => setReferral(e.target.value.toUpperCase())}
                  placeholder="e.g. DAG1234ABCD"
                  maxLength={12}
                  style={{
                    ...inputBase,
                    fontFamily: "monospace",
                    letterSpacing: "0.05em",
                    paddingRight: referral ? "36px" : "14px",
                    borderColor: refValid === true ? "#22c55e" : refValid === false ? "#ef4444" : "#e5e7eb",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = refValid === true ? "#22c55e" : refValid === false ? "#ef4444" : "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
                {refValid === true && <Check size={15} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#22c55e" }} />}
                {refValid === false && <AlertCircle size={15} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#ef4444" }} />}
              </div>
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <OutlineBtn onClick={handleGoogle} disabled={loading}>
                <GoogleIcon />
                <span style={{ flex: 1, textAlign: "left" }}>Continue with Google</span>
              </OutlineBtn>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
              </div>

              <GradientBtn onClick={() => setView("register")} disabled={loading}>
                <Mail size={18} />
                Create Account with Email
              </GradientBtn>
            </div>

            <p style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#6b7280" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
            <p style={{ marginTop: "8px", fontSize: "11px", color: "#9ca3af", textAlign: "center", lineHeight: 1.5 }}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </>
        )}

        {/* ══ REGISTER FORM ══ */}
        {view === "register" && (
          <>
            <button
              onClick={() => setView("main")}
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280", background: "none", border: "none", cursor: "pointer", marginBottom: "18px", padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = "#111827"}
              onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
            >
              <ArrowLeft size={15} /> Back
            </button>

            <div style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Create Account</div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>Fill in the details to join DAGARMY.</div>

            <ErrorBox msg={error} />

            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Full Name */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Full Name</label>
                <Input icon={User} type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} autoFocus />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Email Address</label>
                <Input icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              {/* Password + Confirm (side by side) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <Input
                      icon={Lock}
                      type={showPwd ? "text" : "password"}
                      placeholder="Min 8 chars"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      right={
                        <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                          {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      }
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Confirm</label>
                  <Input
                    icon={Lock}
                    type="password"
                    placeholder="Repeat"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    extra={{ borderColor: confirm && confirm !== password ? "#ef4444" : "#e5e7eb" }}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>I am a</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {["student", "trainer"].map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)} style={{
                      padding: "9px", borderRadius: "10px",
                      border: `2px solid ${role === r ? "#6366f1" : "#e5e7eb"}`,
                      background: role === r ? "#eef2ff" : "#fff",
                      color: role === r ? "#4f46e5" : "#374151",
                      fontSize: "13px", fontWeight: 600, textTransform: "capitalize",
                      cursor: "pointer", transition: "all 0.15s",
                    }}>{r}</button>
                  ))}
                </div>
              </div>

              {/* Referral code */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                  Referral Code <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={referral}
                    onChange={e => setReferral(e.target.value.toUpperCase())}
                    maxLength={12}
                    placeholder="e.g. DAG1234ABCD"
                    style={{
                      ...inputBase,
                      fontFamily: "monospace",
                      letterSpacing: "0.05em",
                      paddingRight: referral ? "36px" : "14px",
                      borderColor: refValid === true ? "#22c55e" : refValid === false ? "#ef4444" : "#e5e7eb",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = refValid === true ? "#22c55e" : refValid === false ? "#ef4444" : "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                  />
                  {refValid === true && <Check size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#22c55e" }} />}
                  {refValid === false && <AlertCircle size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#ef4444" }} />}
                </div>
              </div>

              <GradientBtn type="submit" loading={loading} disabled={loading}>
                {loading ? <><Loader2 size={15} className="animate-spin" /> Creating account…</> : "Create Account"}
              </GradientBtn>
            </form>

            <p style={{ marginTop: "14px", fontSize: "13px", textAlign: "center", color: "#6b7280" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
            </p>
          </>
        )}

        {/* ══ SUCCESS ══ */}
        {view === "success" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{
                width: "68px", height: "68px", borderRadius: "20px",
                background: "#dcfce7", margin: "0 auto 18px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Check size={32} color="#16a34a" />
            </motion.div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
              Account Created! 🎉
            </div>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Redirecting you to your dashboard…
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
