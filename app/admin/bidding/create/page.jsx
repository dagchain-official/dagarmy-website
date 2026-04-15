"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = ["Product Info", "Media & Images", "Auction Rules", "Preview & Publish"];

export default function AdminCreateAuctionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading…</div>}>
      <CreateAuctionContent />
    </Suspense>
  );
}

function CreateAuctionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = !!editId;

  const [step,      setStep]      = useState(0);
  const [saving,    setSaving]    = useState(false);
  const [feedback,  setFeedback]  = useState(null);
  const fileRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    title:        "",
    description:  "",
    features:     [""],
    images:       [],          // { url, is_primary, alt }
    starting_bid: "",
    min_increment:"",
    max_winners:  "1",
    starts_at:    "",
    ends_at:      "",
    status:       "upcoming",
  });

  // Load existing auction if editing
  useEffect(() => {
    if (!editId) return;
    fetch(`/api/bidding/items/${editId}`)
      .then(r => r.json())
      .then(data => {
        if (!data.success) return;
        const it = data.item;
        setForm(f => ({
          ...f,
          title:        it.title        || "",
          description:  it.description  || "",
          features:     it.features?.length ? it.features : [""],
          images:       it.images       || [],
          starting_bid: it.starting_bid || "",
          min_increment:it.min_increment|| "",
          max_winners:  it.max_winners  || "1",
          starts_at:    it.starts_at?.slice(0, 16) || "",
          ends_at:      it.ends_at?.slice(0, 16)   || "",
          status:       it.status       || "upcoming",
        }));
      })
      .catch(() => {});
  }, [editId]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Feature list helpers
  const addFeature    = () => setForm(f => ({ ...f, features: [...f.features, ""] }));
  const updateFeature = (i, v) => setForm(f => { const a = [...f.features]; a[i] = v; return { ...f, features: a }; });
  const removeFeature = (i)    => setForm(f => ({ ...f, features: f.features.filter((_, j) => j !== i) }));

  // Image upload
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "bid-items");
    fd.append("bucket", "bid-item-images");
    try {
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        const isPrimary = form.images.length === 0;
        setForm(f => ({ ...f, images: [...f.images, { url: data.url, is_primary: isPrimary, alt: file.name }] }));
      } else setFeedback({ ok: false, text: "Upload failed: " + (data.error || "unknown error") });
    } catch { setFeedback({ ok: false, text: "Upload error" }); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const setPrimary = (idx) => setForm(f => ({ ...f, images: f.images.map((img, i) => ({ ...img, is_primary: i === idx })) }));
  const removeImg  = (idx) => setForm(f => {
    const imgs = f.images.filter((_, i) => i !== idx);
    if (imgs.length > 0 && !imgs.some(i => i.is_primary)) imgs[0].is_primary = true;
    return { ...f, images: imgs };
  });

  // Validation per step
  const stepValid = [
    form.title.trim().length > 0 && form.description.trim().length > 0,  // step 0
    true,                                                                   // step 1 — images optional
    form.starting_bid > 0 && form.min_increment > 0 && form.ends_at,       // step 2
    true,                                                                   // step 3 — preview
  ];

  // Save / publish
  const handleSave = async (publish = false) => {
    setSaving(true); setFeedback(null);
    try {
      const body = {
        ...form,
        starting_bid:  Number(form.starting_bid),
        min_increment: Number(form.min_increment),
        max_winners:   Number(form.max_winners),
        features:      form.features.filter(f => f.trim()),
        status:        publish ? "active" : form.status,
      };
      const url    = isEdit ? `/api/bidding/admin/items/${editId}` : "/api/bidding/admin/items";
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data   = await res.json();
      if (data.success) {
        router.push(`/admin/bidding/${data.item?.id || editId}`);
      } else {
        setFeedback({ ok: false, text: data.error || "Save failed" });
      }
    } catch (e) { setFeedback({ ok: false, text: "Network error" }); }
    setSaving(false);
  };

  // ── styles
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: 13, color: "#1e293b",
    background: "#fff", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.2s",
  };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };
  const cardStyle  = { background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "28px 32px", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <a href="/admin/bidding" style={{ fontSize: 12, color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>← Auction Manager</a>
        <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 900, color: "#1e293b", letterSpacing: "-0.4px" }}>
          {isEdit ? "✏️ Edit Auction" : "🔨 Create New Auction"}
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
          {isEdit ? "Update auction details, rules, and images." : "Fill in the 4 steps to publish a live auction."}
        </p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <button onClick={() => i <= step && setStep(i)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
                borderRadius: 10, border: "none", cursor: i <= step ? "pointer" : "default",
                background: step === i ? "linear-gradient(135deg,#ede9fe,#e0e7ff)" : i < step ? "#f0fdf4" : "#f1f5f9",
                color: step === i ? "#4f46e5" : i < step ? "#15803d" : "#94a3b8",
                fontWeight: step === i ? 700 : 600, fontSize: 13,
                boxShadow: step === i ? "0 0 0 1.5px #6366f1" : "none",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800,
                background: step === i ? "#6366f1" : i < step ? "#22c55e" : "#e2e8f0",
                color: step >= i ? "#fff" : "#94a3b8",
              }}>
                {i < step ? "✓" : i + 1}
              </span>
              {label}
            </button>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? "#86efac" : "#e2e8f0", margin: "0 4px", borderRadius: 2 }} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 0: Product Info ── */}
      {step === 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 14, fontWeight: 800, color: "#1e293b" }}>Product Information</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Auction Title *</label>
                <input value={form.title} onChange={e => set("title", e.target.value)}
                  placeholder="e.g. Mega Tech Auction: Win Top-Tier Devices"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  rows={4} placeholder="Describe the product, condition, and auction details…"
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              <div>
                <label style={labelStyle}>Key Features / Highlights</label>
                {form.features.map((feat, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input value={feat} onChange={e => updateFeature(i, e.target.value)}
                      placeholder={`Feature ${i + 1}`}
                      style={{ ...inputStyle, marginBottom: 0 }}
                      onFocus={e => e.target.style.borderColor = "#6366f1"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                    <button onClick={() => removeFeature(i)}
                      style={{ padding: "0 12px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: 16, flexShrink: 0 }}>
                      ×
                    </button>
                  </div>
                ))}
                <button onClick={addFeature}
                  style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px dashed #cbd5e1", background: "transparent", color: "#64748b", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  + Add Feature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: Media ── */}
      {step === 1 && (
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 18px", fontSize: 14, fontWeight: 800, color: "#1e293b" }}>Product Images</h3>

          <div style={{
            border: "2px dashed #c7d2fe", borderRadius: 14, padding: "28px",
            textAlign: "center", marginBottom: 20, cursor: "pointer", background: "#fafbff",
          }} onClick={() => fileRef.current?.click()}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>📤</span>
            <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#4f46e5" }}>
              {uploading ? "Uploading…" : "Click or drop to upload image"}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>PNG, JPG, WEBP · Max 10MB per image</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload}
              disabled={uploading} style={{ display: "none" }} />
          </div>

          {form.images.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, padding: "10px 0" }}>
              No images uploaded yet. First image will be the primary product image.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <div style={{
                    borderRadius: 12, overflow: "hidden", aspectRatio: "1",
                    border: img.is_primary ? "2.5px solid #6366f1" : "2px solid #e2e8f0",
                    boxShadow: img.is_primary ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
                  }}>
                    <img src={img.url} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    {!img.is_primary && (
                      <button onClick={() => setPrimary(i)}
                        style={{ flex: 1, padding: "4px 0", borderRadius: 6, border: "1px solid #c7d2fe", background: "#ede9fe", color: "#4f46e5", fontSize: 9, fontWeight: 700, cursor: "pointer" }}>
                        Set Primary
                      </button>
                    )}
                    {img.is_primary && (
                      <span style={{ flex: 1, textAlign: "center", padding: "4px 0", borderRadius: 6, background: "#ede9fe", color: "#4f46e5", fontSize: 9, fontWeight: 800 }}>
                        ★ PRIMARY
                      </span>
                    )}
                    <button onClick={() => removeImg(i)}
                      style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", fontSize: 11, cursor: "pointer" }}>
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Rules ── */}
      {step === 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={cardStyle}>
            <h3 style={{ margin: "0 0 18px", fontSize: 14, fontWeight: 800, color: "#1e293b" }}>💰 Bid Configuration</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "starting_bid",  label: "Starting Bid (DAG Points) *", placeholder: "500" },
                { key: "min_increment", label: "Minimum Increment *",           placeholder: "50" },
                { key: "max_winners",   label: "Number of Winners",             placeholder: "1" },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#F59E0B", fontWeight: 900 }}>⬡</span>
                    <input type="number" value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder} min="1"
                      style={{ ...inputStyle, paddingLeft: 34 }}
                      onFocus={e => e.target.style.borderColor = "#6366f1"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: "0 0 18px", fontSize: 14, fontWeight: 800, color: "#1e293b" }}>📅 Schedule</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Start Date & Time</label>
                <input type="datetime-local" value={form.starts_at} onChange={e => set("starts_at", e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div>
                <label style={labelStyle}>End Date & Time *</label>
                <input type="datetime-local" value={form.ends_at} onChange={e => set("ends_at", e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div>
                <label style={labelStyle}>Initial Status</label>
                <select value={form.status} onChange={e => set("status", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="upcoming">Upcoming (Scheduled)</option>
                  <option value="active">Active (Start Immediately)</option>
                </select>
              </div>
            </div>

            {/* Duration hint */}
            {form.starts_at && form.ends_at && (
              <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #86efac" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#15803d", fontWeight: 600 }}>
                  ⏱ Duration: {Math.round((new Date(form.ends_at) - new Date(form.starts_at)) / 3600000)} hour(s)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 3: Preview ── */}
      {step === 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={cardStyle}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 800, color: "#1e293b" }}>📋 Auction Preview</h3>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              {form.images[0] && (
                <img src={form.images.find(i => i.is_primary)?.url || form.images[0].url} alt=""
                  style={{ width: 80, height: 80, borderRadius: 10, objectFit: "cover", border: "1px solid #e2e8f0", flexShrink: 0 }} />
              )}
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 900, color: "#1e293b" }}>{form.title || "—"}</h2>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{form.description || "—"}</p>
                {form.features.filter(f => f.trim()).map((f, i) => (
                  <span key={i} style={{ display: "inline-block", marginRight: 6, marginBottom: 4, padding: "2px 8px", borderRadius: 6, background: "#ede9fe", color: "#4f46e5", fontSize: 11, fontWeight: 600 }}>
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Starting Bid",  value: `⬡${Number(form.starting_bid).toLocaleString()}` },
                { label: "Min Step",      value: `+${Number(form.min_increment).toLocaleString()}` },
                { label: "Max Winners",   value: form.max_winners },
              ].map(s => (
                <div key={s.label} style={{ padding: "10px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9", textAlign: "center" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 18, fontWeight: 900, color: "#1e293b" }}>{s.value}</p>
                  <p style={{ margin: 0, fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "#fef9c3", border: "1px solid #fde68a" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#a16207" }}>
                📅 {form.starts_at ? new Date(form.starts_at).toLocaleString() : "Starts immediately"} →
                {form.ends_at ? new Date(form.ends_at).toLocaleString() : " No end date set"}
              </p>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 800, color: "#1e293b" }}>🚀 Publish</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
              Review everything above before publishing. Once active, bidders can immediately start placing bids.
            </p>

            {feedback && (
              <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: feedback.ok ? "#f0fdf4" : "#fef2f2", color: feedback.ok ? "#15803d" : "#dc2626",
                border: `1px solid ${feedback.ok ? "#86efac" : "#fca5a5"}` }}>
                {feedback.text}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => handleSave(false)} disabled={saving}
                style={{
                  padding: "13px", borderRadius: 12, border: "1.5px solid #e2e8f0",
                  background: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#475569",
                }}>
                {saving ? "Saving…" : isEdit ? "💾 Save Changes (Draft)" : "💾 Save as Upcoming"}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving}
                style={{
                  padding: "13px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff",
                  fontSize: 13, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(79,70,229,0.35)",
                }}>
                {saving ? "Publishing…" : "🔴 Activate Now (Go Live)"}
              </button>
            </div>

            <p style={{ margin: "14px 0 0", fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
              Tip: You can close an auction early at any time from the auction control panel.
              Winners are auto-selected, losers get an immediate full refund.
            </p>
          </div>
        </div>
      )}

      {/* ── Navigation buttons ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 28,
        paddingTop: 20, borderTop: "1px solid #e2e8f0",
      }}>
        <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
          style={{
            padding: "11px 22px", borderRadius: 10, border: "1px solid #e2e8f0",
            background: "#fff", color: "#64748b", fontWeight: 600, fontSize: 13, cursor: step === 0 ? "not-allowed" : "pointer",
            opacity: step === 0 ? 0.4 : 1,
          }}>
          ← Back
        </button>
        {step < STEPS.length - 1 && (
          <button onClick={() => setStep(s => s + 1)} disabled={!stepValid[step]}
            style={{
              padding: "11px 26px", borderRadius: 10, border: "none",
              background: stepValid[step] ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "#f1f5f9",
              color: stepValid[step] ? "#fff" : "#94a3b8",
              fontWeight: 700, fontSize: 13, cursor: stepValid[step] ? "pointer" : "not-allowed",
              boxShadow: stepValid[step] ? "0 5px 14px rgba(79,70,229,0.3)" : "none",
              transition: "all 0.2s",
            }}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
