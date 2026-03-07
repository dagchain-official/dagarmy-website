"use client";
import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   APPLY MODAL
───────────────────────────────────────────────────────── */
function ApplyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    full_name: "", email: "", country: "", telegram: "",
    social_links: "", follower_count: "", content_niche: "", statement: "",
  });
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

  const inp = {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e8e8e8",
    borderRadius: "10px", fontSize: "14px", color: "#111", background: "#fafafa",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s",
  };
  const lbl = {
    display: "block", fontSize: "10px", fontWeight: "800", color: "#888",
    marginBottom: "6px", letterSpacing: "0.8px", textTransform: "uppercase",
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", backdropFilter: "blur(12px)",
    }}>
      <div style={{
        background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "560px",
        maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 40px 100px rgba(0,0,0,0.25)",
      }}>
        <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: "10px", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase", color: "#ccc" }}>DAG Army</p>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "#111", letterSpacing: "-0.5px" }}>Ambassador Application</h2>
          </div>
          <button onClick={onClose} style={{ background: "#f5f5f5", border: "none", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer", fontSize: "18px", color: "#555", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <form onSubmit={submit} style={{ overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={lbl}>Full Name *</label><input value={form.full_name} onChange={set("full_name")} placeholder="Your name" style={inp} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} /></div>
            <div><label style={lbl}>Email *</label><input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" style={inp} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={lbl}>Country *</label><input value={form.country} onChange={set("country")} placeholder="India, UAE..." style={inp} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} /></div>
            <div><label style={lbl}>Telegram / WhatsApp</label><input value={form.telegram} onChange={set("telegram")} placeholder="@handle" style={inp} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} /></div>
          </div>
          <div><label style={lbl}>Social Media Links</label><input value={form.social_links} onChange={set("social_links")} placeholder="YouTube, Instagram, Twitter links" style={inp} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={lbl}>Total Followers</label><input value={form.follower_count} onChange={set("follower_count")} placeholder="e.g. 25,000" style={inp} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} /></div>
            <div><label style={lbl}>Content Niche</label><input value={form.content_niche} onChange={set("content_niche")} placeholder="AI, Web3, Finance..." style={inp} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} /></div>
          </div>
          <div><label style={lbl}>Why do you want to join?</label><textarea value={form.statement} onChange={set("statement")} rows={4} placeholder="Tell us about yourself and your audience..." style={{ ...inp, resize: "vertical", lineHeight: "1.7" }} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} /></div>
          {err && <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", color: "#dc2626", fontSize: "13px" }}>{err}</div>}
          <button type="submit" disabled={loading} style={{ background: loading ? "#ccc" : "#111", color: "#fff", border: "none", borderRadius: "12px", padding: "14px", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Submitting..." : "Submit Application →"}
          </button>
          <p style={{ margin: 0, textAlign: "center", fontSize: "11px", color: "#bbb" }}>Reviewed personally within 5–10 business days.</p>
        </form>
      </div>
    </div>
  );
}

function SuccessModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(12px)" }}>
      <div style={{ background: "#fff", borderRadius: "24px", padding: "52px 44px", textAlign: "center", maxWidth: "400px", width: "100%", boxShadow: "0 40px 100px rgba(0,0,0,0.25)" }}>
        <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "22px", color: "#fff" }}>✓</div>
        <h2 style={{ margin: "0 0 10px", fontSize: "22px", fontWeight: "900", color: "#111", letterSpacing: "-0.5px" }}>Application Received</h2>
        <p style={{ margin: "0 0 28px", color: "#777", fontSize: "14px", lineHeight: 1.7 }}>Our team will review your application and reach out to shortlisted candidates within 5–10 days.</p>
        <button onClick={onClose} style={{ background: "#111", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 28px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Back to Page</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NODE CANVAS — lightweight canvas-based network
───────────────────────────────────────────────────────── */
function NodeCanvas() {
  const canvasRef = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, nodes = [], mouse = { x: 0, y: 0 };
    const COUNT = 55;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2.5 + 1.2,
        opacity: Math.random() * 0.5 + 0.15,
      });
    }

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            const alpha = (1 - d / 130) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const glow = d < 80 ? 0.9 : n.opacity;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = d < 80
          ? `rgba(99,102,241,${glow})`
          : `rgba(139,92,246,${n.opacity})`;
        ctx.fill();
      });

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      opacity: 0.55, pointerEvents: "auto",
    }} />
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function AmbassadorPage() {
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const wrapRef = useRef(null);
  const gsapReady = useRef(false);

  useEffect(() => {
    if (gsapReady.current) return;
    gsapReady.current = true;

    (async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        /* ── Scene 1 hero entrance ── */
        const s1tl = gsap.timeline({ delay: 0.2 });
        s1tl
          .fromTo(".s1-badge", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
          .fromTo(".s1-h1 .word", { opacity: 0, y: 56, rotateX: -20 }, { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: "power4.out", stagger: 0.06 }, "-=0.3")
          .fromTo(".s1-sub", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
          .fromTo(".s1-btns", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
          .fromTo(".s1-scroll-cue", { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.2");

        /* ── Scenes 2-7: each panel slides UP over the previous ── */
        const scenes = [2, 3, 4, 5, 6, 7];
        scenes.forEach((n) => {
          const el = document.querySelector(`#scene${n}`);
          if (!el) return;

          /* Initial state: panel sits just below viewport */
          gsap.set(el, { yPercent: 100 });

          ScrollTrigger.create({
            trigger: `#scene${n - 1}`,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            onUpdate: (self) => {
              gsap.set(el, { yPercent: 100 - self.progress * 100 });
            },
          });
        });

        /* ── Scene 1 content pushes up as s2 slides over ── */
        gsap.to(".s1-content", {
          y: -80, opacity: 0.15,
          scrollTrigger: { trigger: "#scene1", start: "top top", end: "bottom top", scrub: 1 },
        });

        /* ── Scene 2 inner reveal ── */
        ScrollTrigger.create({
          trigger: "#scene2",
          start: "top 40%",
          once: true,
          onEnter: () => {
            gsap.fromTo(".s2-tag", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
            gsap.fromTo(".s2-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.15 });
            gsap.fromTo(".s2-panel", { opacity: 0, y: 50, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.14, delay: 0.35 });
            gsap.fromTo(".s2-connector", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.1, ease: "power2.out", stagger: 0.2, delay: 0.7 });
          },
        });

        /* ── Scene 3 ── */
        ScrollTrigger.create({
          trigger: "#scene3",
          start: "top 40%",
          once: true,
          onEnter: () => {
            gsap.fromTo(".s3-title-row", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            gsap.fromTo(".s3-tile", { opacity: 0, y: 40, scale: 0.93 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "power3.out", stagger: 0.06, delay: 0.25 });
            gsap.fromTo(".s3-req-item", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", stagger: 0.1, delay: 0.6 });
          },
        });

        /* ── Scene 4: timeline draw ── */
        ScrollTrigger.create({
          trigger: "#scene4",
          start: "top 40%",
          once: true,
          onEnter: () => {
            gsap.fromTo(".s4-title-row", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            gsap.fromTo(".s4-line-fill", { scaleY: 0 }, { scaleY: 1, duration: 2.2, ease: "power2.inOut", delay: 0.4 });
            document.querySelectorAll(".s4-left").forEach((el, i) => {
              gsap.fromTo(el, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.75, ease: "power3.out", delay: 0.5 + i * 0.18 });
            });
            document.querySelectorAll(".s4-right").forEach((el, i) => {
              gsap.fromTo(el, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.75, ease: "power3.out", delay: 0.6 + i * 0.18 });
            });
          },
        });

        /* ── Scene 5 ── */
        ScrollTrigger.create({
          trigger: "#scene5",
          start: "top 40%",
          once: true,
          onEnter: () => {
            gsap.fromTo(".s5-title-row", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            gsap.fromTo(".s5-card", { opacity: 0, y: 50, scale: 0.93 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.12, delay: 0.3 });
          },
        });

        /* ── Scene 6: tier rise ── */
        ScrollTrigger.create({
          trigger: "#scene6",
          start: "top 40%",
          once: true,
          onEnter: () => {
            gsap.fromTo(".s6-title-row", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            gsap.fromTo(".s6-tier", { opacity: 0, y: 70 }, {
              opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.18, delay: 0.35,
            });
          },
        });

        /* ── Scene 7: final CTA ── */
        ScrollTrigger.create({
          trigger: "#scene7",
          start: "top 40%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ delay: 0.2 });
            tl.fromTo(".s7-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
              .fromTo(".s7-h2", { opacity: 0, y: 50, letterSpacing: "6px" }, { opacity: 1, y: 0, letterSpacing: "-2.5px", duration: 1.1, ease: "power4.out" }, "-=0.2")
              .fromTo(".s7-sub", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
              .fromTo(".s7-btn", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.5)", stagger: 0.12 }, "-=0.3");
          },
        });

      } catch (_) { /* GSAP unavailable */ }
    })();
  }, []);

  /* ── DATA ─────────────────────────────────────────────── */
  const creators = [
    { t: "YouTubers", n: "01" }, { t: "Instagram Creators", n: "02" },
    { t: "AI Educators", n: "03" }, { t: "Blockchain Analysts", n: "04" },
    { t: "Web3 Influencers", n: "05" }, { t: "Tech Community Leaders", n: "06" },
    { t: "Regional Language Creators", n: "07" }, { t: "Facebook Creators", n: "08" },
  ];

  const journey = [
    { n: "01", t: "Create Content", d: "Produce educational videos, posts, and threads about DAGGPT and DAGChain for your audience." },
    { n: "02", t: "Share Your Link", d: "Distribute your unique referral link across all your platforms and community channels." },
    { n: "03", t: "Tag & Engage", d: "Tag official DAGArmy pages, engage with comments, and amplify the ecosystem story." },
    { n: "04", t: "Introduce Users", d: "Onboard new users into subscriptions, validator nodes, and the broader ecosystem." },
    { n: "05", t: "Build Regional Reach", d: "Lead awareness in your language and region — become the local voice of the ecosystem." },
  ];

  const benefits = [
    { t: "Free DAGGPT Access", d: "Full complimentary access to DAGGPT's multi-module AI system — replacing multiple AI subscriptions instantly.", accent: "#6366f1" },
    { t: "Referral Earnings", d: "Earn rewards tied to real ecosystem activity — subscriptions, nodes, and upgrades through your referral link.", accent: "#8b5cf6" },
    { t: "Reward Points", d: "Accumulate DAG points for every referral and ecosystem activity. Redeem for GasCoin, credits, or feature access.", accent: "#06b6d4" },
    { t: "Official Recognition", d: "Verified Ambassador Badge, featured profile on the website, early feature previews, and private group access.", accent: "#f59e0b" },
  ];

  const tiers = [
    { name: "Silver", req: "1,000+ followers", color: "#9ca3af", dark: false, perks: ["Standard referral rewards", "Free DAGGPT access", "Ambassador Badge", "Community access"] },
    { name: "Gold", req: "50,000+ followers", color: "#d97706", dark: false, featured: true, perks: ["Enhanced reward rate", "Performance bonuses", "Featured profile", "Priority support", "Early ecosystem access"] },
    { name: "Platinum", req: "100,000+ followers", color: "#e2e8f0", dark: true, perks: ["Custom partnership terms", "Regional leadership role", "Revenue-share model", "Executive direct access", "Co-branded campaigns"] },
  ];

  /* ── SHARED SCENE SHELL ─────────────────────────────── */
  const sceneBase = (bg = "#fff") => ({
    position: "fixed",
    top: 0, left: 0, width: "100%", height: "100vh",
    background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
    willChange: "transform",
  });

  /* ── BUTTON STYLES ─────────────────────────────────── */
  const btnPrimary = {
    background: "#111", color: "#fff", border: "none", borderRadius: "100px",
    padding: "15px 32px", fontSize: "14px", fontWeight: "700", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "8px",
    transition: "all 0.25s", letterSpacing: "-0.2px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
  };
  const btnOutline = {
    background: "transparent", color: "#111", border: "1.5px solid #ddd",
    borderRadius: "100px", padding: "14px 32px", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px",
    transition: "all 0.25s", letterSpacing: "-0.2px", textDecoration: "none",
  };

  return (
    <>
      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
        @keyframes pulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
        @keyframes wave   { 0%{background-position:0% 50%} 100%{background-position:100% 50%} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .s1-h1{perspective:800px}
        .s1-h1 .word{display:inline-block;margin-right:0.2em;transform-style:preserve-3d}
        html{scroll-behavior:auto}
      `}</style>

      {/* ═══════════════════════════════════════════════════
          SCROLL CONTAINER — 700vh total scroll distance
      ════════════════════════════════════════════════════ */}
      <div ref={wrapRef} style={{ height: "700vh", position: "relative" }}>

        {/* sticky viewport that holds all fixed scenes */}
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

          {/* ══ SCENE 1 — THE SIGNAL ═══════════════════════ */}
          <div id="scene1" style={{ ...sceneBase("#fff"), zIndex: 1 }}>
            <NodeCanvas />

            {/* Gradient orbs */}
            <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div className="s1-content" style={{ position: "relative", zIndex: 2, maxWidth: "900px", padding: "0 32px", textAlign: "center" }}>
              <div className="s1-badge" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(255,255,255,0.9)", border: "1px solid #ebebeb",
                borderRadius: "100px", padding: "7px 16px", marginBottom: "36px",
                backdropFilter: "blur(8px)", opacity: 0,
              }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#555", letterSpacing: "0.5px" }}>2026 Cohort — Applications Open</span>
              </div>

              <h1 className="s1-h1" style={{ fontSize: "clamp(52px, 7vw, 92px)", fontWeight: "900", color: "#111", letterSpacing: "-3.5px", lineHeight: 1.0, margin: "0 0 28px" }}>
                {["Become", "a"].map((w, i) => <span key={i} className="word" style={{ opacity: 0 }}>{w} </span>)}
                {["DAG", "Army"].map((w, i) => <span key={i} className="word" style={{ opacity: 0, color: "#111" }}>{w} </span>)}
                <span className="word" style={{ opacity: 0, background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Ambassador</span>
              </h1>

              <p className="s1-sub" style={{ fontSize: "clamp(16px, 2vw, 21px)", color: "#666", lineHeight: 1.75, maxWidth: "580px", margin: "0 auto 48px", opacity: 0 }}>
                Represent the future of AI-native blockchain. Build your brand, earn real rewards, and grow alongside a global technological ecosystem.
              </p>

              <div className="s1-btns" style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", opacity: 0 }}>
                <button onClick={() => setModal(true)} style={btnPrimary}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.22)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.18)"; }}>
                  Apply Now →
                </button>
                <button onClick={() => document.getElementById("scene7")?.scrollIntoView({ behavior: "smooth" })} style={btnOutline}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#f9f9f9"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "transparent"; }}>
                  Explore Program
                </button>
              </div>

              <div className="s1-scroll-cue" style={{ marginTop: "64px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0 }}>
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#ccc" }}>Scroll to explore</span>
                <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, #ccc, transparent)" }} />
              </div>
            </div>
          </div>

          {/* ══ SCENE 2 — THE ECOSYSTEM ════════════════════ */}
          <div id="scene2" style={{ ...sceneBase("#fafafa"), zIndex: 2, borderTop: "1px solid #eee" }}>
            <div style={{ maxWidth: "1100px", width: "100%", padding: "0 40px" }}>
              <div className="s2-tag" style={{ marginBottom: "10px", opacity: 0 }}>
                <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "2.5px", textTransform: "uppercase", color: "#aaa" }}>Scene 02 — The Ecosystem</span>
              </div>
              <h2 className="s2-title" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: "900", color: "#111", letterSpacing: "-2px", lineHeight: 1.05, margin: "0 0 60px", opacity: 0, maxWidth: "520px" }}>
                Three pillars.<br />One movement.
              </h2>

              <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", alignItems: "center" }}>
                {/* Connector lines */}
                <div className="s2-connector" style={{ position: "absolute", top: "50%", left: "calc(33.33% + 10px)", width: "calc(33.33% - 20px)", height: "1px", background: "linear-gradient(to right, #6366f1, #8b5cf6)", transformOrigin: "left", opacity: 0 }} />
                <div className="s2-connector" style={{ position: "absolute", top: "50%", left: "calc(66.66% + 10px)", width: "calc(33.33% - 20px)", height: "1px", background: "linear-gradient(to right, #8b5cf6, #06b6d4)", transformOrigin: "left", opacity: 0 }} />

                {[
                  { name: "DAG Army", sub: "Global community movement at the intersection of AI and blockchain.", color: "#6366f1", n: "01", tag: "Community" },
                  { name: "DAGGPT", sub: "Multi-module AI platform replacing multiple subscriptions with one.", color: "#8b5cf6", n: "02", tag: "AI Platform" },
                  { name: "DAGChain", sub: "AI-native Layer 1 blockchain powering the entire digital infrastructure.", color: "#06b6d4", n: "03", tag: "Blockchain" },
                ].map((p, i) => (
                  <div key={i} className="s2-panel" style={{
                    background: "#fff", border: "1px solid #ebebeb", borderRadius: "22px",
                    padding: "36px 30px", position: "relative", zIndex: 1, opacity: 0,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    animation: `float${i % 2 === 0 ? "A" : "B"} ${5 + i}s ease-in-out infinite`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.09), 0 0 0 1.5px ${p.color}30`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: `${p.color}12`, border: `1px solid ${p.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.color }} />
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "#ccc", letterSpacing: "1px", textTransform: "uppercase" }}>{p.tag}</span>
                    </div>
                    <p style={{ margin: "0 0 4px", fontSize: "10px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", color: "#ccc" }}>{p.n}</p>
                    <h3 style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: "900", color: "#111", letterSpacing: "-0.6px" }}>{p.name}</h3>
                    <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#888", lineHeight: 1.75 }}>{p.sub}</p>
                    <div style={{ height: "2px", borderRadius: "2px", background: `linear-gradient(to right, ${p.color}, transparent)` }} />
                  </div>
                ))}
              </div>

              <p style={{ marginTop: "44px", fontSize: "14px", color: "#bbb", letterSpacing: "0.2px" }}>Ambassadors represent all three pillars simultaneously — they are the human bridge between the ecosystem and the world.</p>
            </div>
          </div>

          {/* ══ SCENE 3 — THE CREATORS ═════════════════════ */}
          <div id="scene3" style={{ ...sceneBase("#fff"), zIndex: 3 }}>
            <div style={{ maxWidth: "1100px", width: "100%", padding: "0 40px" }}>
              <div className="s3-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px", opacity: 0 }}>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "2.5px", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: "10px" }}>Scene 03 — The Creators</span>
                  <h2 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: "900", color: "#111", letterSpacing: "-2px", lineHeight: 1.05, margin: 0 }}>
                    Built for creators<br />and builders.
                  </h2>
                </div>
                <p style={{ maxWidth: "300px", fontSize: "14px", color: "#999", lineHeight: 1.8, margin: 0 }}>We look for passionate creators who can bring the AI and Web3 story to life in their language and region.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "32px" }}>
                {creators.map((c, i) => (
                  <div key={i} className="s3-tile" style={{
                    background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: "14px",
                    padding: "20px 18px", opacity: 0, cursor: "default",
                    transition: "all 0.25s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.querySelector(".ct").style.color = "#fff"; e.currentTarget.querySelector(".cn").style.color = "rgba(255,255,255,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.transform = ""; e.currentTarget.querySelector(".ct").style.color = "#111"; e.currentTarget.querySelector(".cn").style.color = "#ccc"; }}
                  >
                    <p className="cn" style={{ margin: "0 0 5px", fontSize: "10px", fontWeight: "800", color: "#ccc", letterSpacing: "1px", transition: "color 0.2s" }}>{c.n}</p>
                    <p className="ct" style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111", letterSpacing: "-0.2px", lineHeight: 1.4, transition: "color 0.2s" }}>{c.t}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0", border: "1px solid #f0f0f0", borderRadius: "18px", overflow: "hidden" }}>
                {[
                  { n: "01", t: "Active Audience", d: "An engaged following on at least one platform. 1,000+ minimum across any channel." },
                  { n: "02", t: "Content Creator", d: "Consistent publishing history with an established community presence and voice." },
                  { n: "03", t: "Clear Communicator", d: "Ability to explain AI or blockchain concepts accessibly in your own language." },
                ].map((r, i) => (
                  <div key={i} className="s3-req-item" style={{ padding: "28px 24px", borderRight: i < 2 ? "1px solid #f0f0f0" : "none", opacity: 0, transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <p style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: "900", color: "#f0f0f0", letterSpacing: "-1px" }}>{r.n}</p>
                    <p style={{ margin: "0 0 6px", fontWeight: "700", fontSize: "14px", color: "#111" }}>{r.t}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#999", lineHeight: 1.7 }}>{r.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ SCENE 4 — THE JOURNEY TIMELINE ════════════ */}
          <div id="scene4" style={{ ...sceneBase("#fafafa"), zIndex: 4, borderTop: "1px solid #eee" }}>
            <div style={{ maxWidth: "820px", width: "100%", padding: "0 40px" }}>
              <div className="s4-title-row" style={{ textAlign: "center", marginBottom: "60px", opacity: 0 }}>
                <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "2.5px", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: "12px" }}>Scene 04 — The Journey</span>
                <h2 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: "900", color: "#111", letterSpacing: "-2px", lineHeight: 1.05, margin: 0 }}>The Ambassador<br />Journey</h2>
              </div>

              <div style={{ position: "relative" }}>
                {/* center vertical line track */}
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "#eee", transform: "translateX(-50%)" }} />
                {/* animated fill */}
                <div className="s4-line-fill" style={{ position: "absolute", left: "50%", top: 0, width: "1px", height: "100%", background: "linear-gradient(to bottom, #6366f1, #8b5cf6, #06b6d4)", transform: "translateX(-50%) scaleY(0)", transformOrigin: "top" }} />

                {journey.map((s, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-end", marginBottom: i < 4 ? "32px" : 0, position: "relative" }}>
                      {/* dot */}
                      <div style={{ position: "absolute", left: "50%", top: "24px", transform: "translate(-50%,-50%)", width: "10px", height: "10px", borderRadius: "50%", background: "#fff", border: "2px solid #ddd", zIndex: 2 }} />
                      <div className={isLeft ? "s4-left" : "s4-right"} style={{ width: "44%", background: "#fff", border: "1px solid #ebebeb", borderRadius: "14px", padding: "22px 22px", opacity: 0, transition: "box-shadow 0.25s, transform 0.25s" }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = isLeft ? "translateX(-4px)" : "translateX(4px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}
                      >
                        <p style={{ margin: "0 0 4px", fontSize: "9px", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase", color: "#ccc" }}>{s.n}</p>
                        <h3 style={{ margin: "0 0 7px", fontSize: "16px", fontWeight: "800", color: "#111", letterSpacing: "-0.3px" }}>{s.t}</h3>
                        <p style={{ margin: 0, fontSize: "13px", color: "#888", lineHeight: 1.7 }}>{s.d}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══ SCENE 5 — THE REWARDS ══════════════════════ */}
          <div id="scene5" style={{ ...sceneBase("#fff"), zIndex: 5 }}>
            <div style={{ maxWidth: "1100px", width: "100%", padding: "0 40px" }}>
              <div className="s5-title-row" style={{ marginBottom: "56px", opacity: 0 }}>
                <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "2.5px", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: "12px" }}>Scene 05 — The Rewards</span>
                <h2 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: "900", color: "#111", letterSpacing: "-2px", lineHeight: 1.05, margin: "0 0 8px" }}>Real rewards.<br />Real impact.</h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px" }}>
                {benefits.map((b, i) => (
                  <div key={i} className="s5-card" style={{
                    background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: "20px",
                    padding: "36px 32px", position: "relative", overflow: "hidden", opacity: 0,
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 56px rgba(0,0,0,0.07), inset 0 0 0 1.5px ${b.accent}25`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: b.accent, opacity: 0.7 }} />
                    <div style={{ position: "absolute", top: "24px", right: "24px", width: "36px", height: "36px", borderRadius: "10px", background: `${b.accent}10`, border: `1px solid ${b.accent}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: b.accent }} />
                    </div>
                    <h3 style={{ margin: "0 0 14px", fontSize: "20px", fontWeight: "900", color: "#111", letterSpacing: "-0.5px", lineHeight: 1.2 }}>{b.t}</h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "#888", lineHeight: 1.8 }}>{b.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ SCENE 6 — TIER ASCENSION ═══════════════════ */}
          <div id="scene6" style={{ ...sceneBase("#0d0d0d"), zIndex: 6 }}>
            <div style={{ maxWidth: "1100px", width: "100%", padding: "0 40px" }}>
              <div className="s6-title-row" style={{ textAlign: "center", marginBottom: "60px", opacity: 0 }}>
                <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "2.5px", textTransform: "uppercase", color: "#444", display: "block", marginBottom: "12px" }}>Scene 06 — Tier Ascension</span>
                <h2 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: "900", color: "#fff", letterSpacing: "-2px", lineHeight: 1.05, margin: 0 }}>Ambassador Tiers</h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", alignItems: "end" }}>
                {tiers.map((t, i) => (
                  <div key={i} className="s6-tier" style={{
                    background: t.dark ? "#111" : t.featured ? "#fff" : "#161616",
                    border: t.featured ? "none" : "1px solid #222",
                    borderRadius: "22px", padding: t.featured ? "44px 36px" : "36px 30px",
                    position: "relative", opacity: 0,
                    transform: t.featured ? "translateY(-16px)" : "",
                    boxShadow: t.featured ? "0 32px 80px rgba(0,0,0,0.4)" : "",
                    transition: "transform 0.3s",
                  }}>
                    {t.featured && (
                      <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", borderRadius: "100px", padding: "5px 16px", fontSize: "9px", fontWeight: "900", letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        Most Popular
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: t.color, boxShadow: `0 0 10px ${t.color}80` }} />
                      <span style={{ fontSize: "22px", fontWeight: "900", letterSpacing: "-0.6px", color: t.featured ? "#111" : "#fff" }}>{t.name}</span>
                    </div>
                    <p style={{ margin: "0 0 28px", fontSize: "12px", color: t.featured ? "#aaa" : "#444", letterSpacing: "0.2px" }}>{t.req}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                      {t.perks.map((p, j) => (
                        <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: t.featured ? "#f0f0f0" : "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: t.featured ? "#111" : "#444" }} />
                          </div>
                          <span style={{ fontSize: "13px", color: t.featured ? "#555" : "#444", lineHeight: 1.5 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setModal(true)} style={{
                      width: "100%", background: t.featured ? "#111" : "rgba(255,255,255,0.04)",
                      color: t.featured ? "#fff" : "#444", border: t.featured ? "none" : "1px solid #222",
                      borderRadius: "12px", padding: "13px", fontSize: "13px", fontWeight: "700",
                      cursor: "pointer", transition: "all 0.2s", letterSpacing: "-0.2px",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = t.featured ? "#333" : "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = t.featured ? "#111" : "rgba(255,255,255,0.04)"; e.currentTarget.style.color = t.featured ? "#fff" : "#444"; }}
                    >
                      Apply as {t.name}
                    </button>
                  </div>
                ))}
              </div>

              <p style={{ textAlign: "center", marginTop: "40px", fontSize: "12px", color: "#333" }}>Tiers are reviewed and upgraded periodically based on performance metrics.</p>
            </div>
          </div>

          {/* ══ SCENE 7 — THE INVITATION ═══════════════════ */}
          <div id="scene7" style={{ ...sceneBase("#fff"), zIndex: 7, borderTop: "1px solid #f0f0f0" }}>
            {/* Animated gradient background */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(99,102,241,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 30%, rgba(139,92,246,0.04) 0%, transparent 60%)",
              animation: "floatA 12s ease-in-out infinite",
            }} />
            {/* Dot grid */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none", opacity: 0.5 }} />

            <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", padding: "0 32px", textAlign: "center" }}>
              <p className="s7-eyebrow" style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "2.5px", textTransform: "uppercase", color: "#aaa", margin: "0 0 20px", opacity: 0 }}>Scene 07 — The Invitation</p>

              <h2 className="s7-h2" style={{ fontSize: "clamp(40px, 5.5vw, 76px)", fontWeight: "900", color: "#111", letterSpacing: "-2.5px", lineHeight: 1.0, margin: "0 0 26px", opacity: 0 }}>
                Join the DAG Army<br />Ambassador Program
              </h2>

              <p className="s7-sub" style={{ fontSize: "clamp(15px, 1.8vw, 19px)", color: "#888", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto 52px", opacity: 0 }}>
                Early contributors gain early positioning in the ecosystem. Be part of the infrastructure shift combining AI and blockchain at a global scale.
              </p>

              <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "52px" }}>
                <button className="s7-btn" onClick={() => setModal(true)} style={{ ...btnPrimary, padding: "17px 40px", fontSize: "15px", opacity: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 44px rgba(0,0,0,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.18)"; }}>
                  Apply Now — It&apos;s Free →
                </button>
                <a className="s7-btn" href="mailto:hr@dagchain.network?subject=Ambassador Program Inquiry" style={{ ...btnOutline, padding: "16px 40px", fontSize: "15px", opacity: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#f9f9f9"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "transparent"; }}>
                  Contact the Team
                </a>
              </div>

              {/* Compliance */}
              <p className="s7-btn" style={{ fontSize: "11px", color: "#ccc", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto", opacity: 0 }}>
                The DAG Army Ambassador Program is a referral-based marketing initiative. Not an investment scheme. All rewards depend on verified product usage. Full T&C apply.
              </p>
            </div>
          </div>

        </div>{/* end sticky viewport */}
      </div>{/* end scroll container */}

      {modal && <ApplyModal onClose={() => setModal(false)} onSuccess={() => { setModal(false); setSuccess(true); }} />}
      {success && <SuccessModal onClose={() => setSuccess(false)} />}
    </>
  );
}
