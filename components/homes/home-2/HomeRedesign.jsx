"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   PARTICLE NETWORK GLOBE — Three.js, client-only
   Purple nodes + lines on white background = stunning contrast
   ═══════════════════════════════════════════════════════════════ */
function ParticleGlobe({ progressRef, darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = canvasRef.current;
    if (!el) return;
    let destroyed = false, animId, clock = 0;

    import("three").then((THREE) => {
      if (destroyed) return;

      const renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(el.clientWidth, el.clientHeight, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 8.5);

      /* Fibonacci sphere — 140 nodes */
      const N = 140;
      const R = 2.8;
      const phi = Math.PI * (3 - Math.sqrt(5));
      const nodes = Array.from({ length: N }, (_, i) => {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const t = phi * i;
        return new THREE.Vector3(Math.cos(t) * r * R, y * R, Math.sin(t) * r * R);
      });

      /* Points */
      const ptPos = new Float32Array(N * 3);
      nodes.forEach((p, i) => { ptPos[i * 3] = p.x; ptPos[i * 3 + 1] = p.y; ptPos[i * 3 + 2] = p.z; });
      const ptGeo = new THREE.BufferGeometry();
      ptGeo.setAttribute("position", new THREE.BufferAttribute(ptPos, 3));
      const ptMat = new THREE.PointsMaterial({
        color: 0x7c3aed, size: 0.075, sizeAttenuation: true, transparent: true, opacity: 0.85,
      });
      const pts = new THREE.Points(ptGeo, ptMat);

      /* Connections */
      const THRESH = 1.52;
      const lineArr = [];
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++)
          if (nodes[i].distanceTo(nodes[j]) < THRESH)
            lineArr.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lineArr), 3));
      const lineMat = new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.18 });
      const lines = new THREE.LineSegments(lineGeo, lineMat);

      /* Equator ring */
      const ringGeo = new THREE.RingGeometry(R + 0.25, R + 0.27, 128);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x9d6ef8, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;

      const group = new THREE.Group();
      group.add(pts, lines, ring);
      scene.add(group);

      const origPos = new Float32Array(ptPos);
      const scatterDirs = Array.from({ length: N }, () =>
        new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2).normalize()
      );

      const ro = new ResizeObserver(() => {
        renderer.setSize(el.clientWidth, el.clientHeight, false);
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
      });
      ro.observe(el);

      const loop = () => {
        if (destroyed) return;
        animId = requestAnimationFrame(loop);
        clock += 0.004;

        const p = progressRef?.current ?? 0;
        const scatter = Math.max(0, (p - 0.62) * 3.5);

        const posAttr = ptGeo.attributes.position;
        for (let i = 0; i < N; i++) {
          posAttr.setXYZ(i,
            origPos[i * 3] + scatterDirs[i].x * scatter * 4,
            origPos[i * 3 + 1] + scatterDirs[i].y * scatter * 4,
            origPos[i * 3 + 2] + scatterDirs[i].z * scatter * 4,
          );
        }
        posAttr.needsUpdate = true;

        /* Color transitions based on scroll: purple on white → lavender on dark */
        const t = Math.min(1, Math.max(0, (p - 0.52) * 3));
        const r = Math.round(124 + (196 - 124) * t);
        const g = Math.round(58 + (181 - 58) * t);
        const b = Math.round(237 + (253 - 237) * t);
        ptMat.color.setRGB(r / 255, g / 255, b / 255);
        lineMat.color.setRGB(r / 255, g / 255, b / 255);
        ptMat.opacity = Math.max(0.15, 0.85 - scatter * 0.55);
        lineMat.opacity = Math.max(0, 0.18 + t * 0.22 - scatter * 0.18);
        ringMat.opacity = Math.max(0, 0.3 + t * 0.2 - scatter * 0.3);

        group.rotation.y = clock * 0.16;
        group.rotation.x = Math.sin(clock * 0.07) * 0.1;
        renderer.render(scene, camera);
      };
      loop();

      canvasRef.current._cleanup = () => { ro.disconnect(); renderer.dispose(); };
    });

    return () => {
      destroyed = true;
      if (animId) cancelAnimationFrame(animId);
      if (canvasRef.current && canvasRef.current._cleanup) canvasRef.current._cleanup();
    };
  }, []); // eslint-disable-line

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

/* ── Label badge ── */
function Label({ num, text, dark = false }) {
  const purple = dark ? "#c4b5fd" : "#7c3aed";
  const border = dark ? "rgba(196,181,253,0.35)" : "rgba(124,58,237,0.35)";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
      <span style={{
        fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "1px",
        color: purple, border: `1px solid ${border}`, padding: "3px 10px", fontWeight: "600"
      }}>{num}</span>
      <span style={{
        fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "2.5px",
        color: purple, textTransform: "uppercase", fontWeight: "600"
      }}>{text}</span>
      <span style={{ color: border, fontSize: "12px" }}>//</span>
    </div>
  );
}

/* ── Cursor glow ── */
function CursorGlow() {
  const glowRef = useRef(null);
  useEffect(() => {
    const mv = (e) => {
      if (!glowRef.current) return;
      glowRef.current.style.left = e.clientX + "px";
      glowRef.current.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", mv, { passive: true });
    return () => window.removeEventListener("mousemove", mv);
  }, []);
  return (
    <div ref={glowRef} aria-hidden="true" style={{
      position: "fixed", pointerEvents: "none", zIndex: 0,
      width: "500px", height: "500px", transform: "translate(-50%,-50%)",
      background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)",
      transition: "left 0.1s linear, top 0.1s linear",
    }} />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT — v4: White + Purple (light-first)
   ═══════════════════════════════════════════════════════════════ */
export default function HomeRedesign() {
  const pinWrapRef = useRef(null);
  const pinnedRef = useRef(null);
  const progressRef = useRef(0);
  const bgRef = useRef(null);
  const phase0Ref = useRef(null);
  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);

  useEffect(() => {
    let ctx;
    (async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          /* Entrance */
          gsap.fromTo(".h-ey", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.25, ease: "power3.out" });
          gsap.fromTo(".h-w1", { opacity: 0, y: 60, skewY: 3 }, { opacity: 1, y: 0, skewY: 0, duration: 1.1, delay: 0.45, ease: "power4.out" });
          gsap.fromTo(".h-w2", { opacity: 0, y: 60, skewY: 3 }, { opacity: 1, y: 0, skewY: 0, duration: 1.1, delay: 0.60, ease: "power4.out" });
          gsap.fromTo(".h-sub", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.9, ease: "power3.out" });
          gsap.fromTo(".h-ctas", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, delay: 1.1, ease: "power3.out" });
          gsap.fromTo(".h-stat", { opacity: 0 }, { opacity: 1, duration: 1.0, delay: 1.35, stagger: 0.08 });
          gsap.fromTo(".h-dec", { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 1.6 });
          gsap.fromTo(".h-line", { scaleX: 0 }, { scaleX: 1, duration: 1.6, delay: 0.15, ease: "power2.inOut", transformOrigin: "left center" });

          /* Pinned scroll */
          if (pinnedRef.current && pinWrapRef.current) {
            ScrollTrigger.create({
              trigger: pinWrapRef.current,
              start: "top top",
              end: "bottom bottom",
              pin: pinnedRef.current,
              pinSpacing: false,
              scrub: 0.5,
              onUpdate(self) {
                progressRef.current = self.progress;
                const p = self.progress;

                /* Phase opacity */
                if (phase0Ref.current)
                  phase0Ref.current.style.opacity = p < 0.28 ? 1 : Math.max(0, 1 - (p - 0.28) * 8);
                if (phase1Ref.current) {
                  const v = p < 0.32 ? 0 : p > 0.65 ? Math.max(0, 1 - (p - 0.65) * 7) : Math.min(1, (p - 0.32) * 6);
                  phase1Ref.current.style.opacity = v;
                }
                if (phase2Ref.current)
                  phase2Ref.current.style.opacity = p > 0.72 ? Math.min(1, (p - 0.72) * 6) : 0;

                /* Bg: white → dark purple */
                if (bgRef.current) {
                  const t = Math.min(1, Math.max(0, (p - 0.50) * 3.5));
                  const lo = [255, 255, 255], hi = [6, 3, 15];
                  const m = (a, b) => Math.round(a + (b - a) * t);
                  bgRef.current.style.background = `rgb(${m(lo[0], hi[0])},${m(lo[1], hi[1])},${m(lo[2], hi[2])})`;

                  /* Text color: near-black → off-white */
                  const tc = t > 0.5
                    ? `rgba(240,235,255,${Math.min(1, (t - 0.5) * 2.5)})`
                    : `rgba(8,3,14,${1 - t * 0.4})`;
                  bgRef.current.querySelectorAll(".pt").forEach(el => { el.style.color = tc; });
                  bgRef.current.querySelectorAll(".pt-sub").forEach(el => {
                    el.style.color = t > 0.5
                      ? `rgba(200,185,255,${Math.min(0.55, (t - 0.5) * 1.2)})`
                      : `rgba(8,3,14,${0.42 - t * 0.1})`;
                  });
                }
              },
            });
          }

          /* Section reveals */
          gsap.utils.toArray(".dag-sr").forEach(el => {
            gsap.fromTo(el, { opacity: 0, y: 64 },
              {
                opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true }
              });
          });
          gsap.utils.toArray(".dag-ssr").forEach(wrap => {
            gsap.fromTo(wrap.querySelectorAll(".sc-item"),
              { opacity: 0, y: 48, scale: 0.97 },
              {
                opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: wrap, start: "top 84%", once: true }
              });
          });
          gsap.utils.toArray(".mani-line").forEach((el, i) => {
            gsap.fromTo(el, { opacity: 0, x: -50 },
              {
                opacity: 1, x: 0, duration: 1, delay: i * 0.07, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 90%", once: true }
              });
          });
          gsap.utils.toArray(".rank-item").forEach((el, i) => {
            gsap.fromTo(el, { opacity: 0, x: -20 },
              {
                opacity: 1, x: 0, duration: 0.65, delay: i * 0.09, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 90%", once: true }
              });
          });
        });
      } catch (_) { }
    })();
    return () => ctx?.revert();
  }, []);

  /* Data */
  const marqueeItems = ["DAG Army", "DAGGPT", "DAGChain", "Web3", "AI Systems", "Blockchain", "Data Analytics",
    "Ambassador Program", "Missions", "DeFi", "Automation", "ML Engineering", "Smart Contracts"];

  const ranks = [
    { sym: "○", title: "Private", sub: "Just joined. Learning the ropes.", color: "#94a3b8" },
    { sym: "◈", title: "Corporal", sub: "Consistent. Starting to contribute.", color: "#7c3aed" },
    { sym: "◆", title: "Sergeant", sub: "Proven track record. Helping others grow.", color: "#9d4edd" },
    { sym: "★", title: "Lieutenant", sub: "Leader in the making. Recognized by peers.", color: "#d97706" },
    { sym: "⬟", title: "General", sub: "Elite. The top 1% of the entire Army.", color: "#ef4444" },
  ];

  const ecosystem = [
    { num: "01", dot: "#7c3aed", name: "DAG ARMY", tag: "COMMUNITY & MISSIONS", desc: "Community platform, missions engine, live leaderboard, Udaan program, and Ambassador network — all in one home base.", href: "/", ext: false },
    { num: "02", dot: "#6d28d9", name: "DAGGPT", tag: "MULTI-MODAL AI PLATFORM", desc: "Text, image, video, music & website generation. Every frontier AI model — Gemini, Claude, Llama — one subscription, one login.", href: "https://daggpt.network", ext: true },
    { num: "03", dot: "#0f766e", name: "DAGCHAIN", tag: "LAYER 1 BLOCKCHAIN", desc: "AI-native Layer 1 infrastructure. Validator nodes, GasCoin, and on-chain intelligence — built for the next decade of the internet.", href: "https://dagchain.network", ext: true },
  ];

  const tiers = [
    { code: "T·01", name: "SILVER", req: "1,000+ Followers", accent: "#64748b", perks: ["Ambassador Badge", "DAGGPT Access", "Private Community", "Branded Content Kit"] },
    { code: "T·02", name: "GOLD", req: "50,000+ Followers", accent: "#d97706", perks: ["Everything in Silver", "Featured Profile", "Priority Support", "Early Access"], hot: true },
    { code: "T·03", name: "PLATINUM", req: "100K+ Followers", accent: "#7c3aed", perks: ["Everything in Gold", "Regional Leadership Role", "Co-Branded Campaigns", "Executive Access"] },
  ];

  return (
    <div style={{
      background: "#ffffff", overflowX: "hidden", fontFamily: "'Space Grotesk',sans-serif",
      /* Pull up enough that the component's top sits at/above viewport top (y=0).
         GSAP "top top" pin then fires at page load, not on first scroll.
         Breakdown: navbar(~64px) + layout paddingTop(50px) + buffer(16px) = 130px */
      marginTop: "-130px",
    }}>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Michroma&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        /* Film grain — subtle on light */
        .v4-grain {
          position:fixed; inset:0; pointer-events:none; z-index:9998; opacity:0.025;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:160px 160px;
          animation:v4grain 0.5s steps(1) infinite;
          mix-blend-mode:multiply;
        }
        @keyframes v4grain {
          0%{background-position:0 0} 20%{background-position:-28px -42px}
          40%{background-position:54px 28px} 60%{background-position:-54px 14px}
          80%{background-position:28px -54px}
        }

        /* Initial hero states */
        .h-ey,.h-w1,.h-w2,.h-sub,.h-ctas,.h-stat,.h-dec { opacity:0; }
        .h-line { transform-origin:left center; transform:scaleX(0); }

        /* Marquee */
        @keyframes marq { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .v4-marq { display:flex; width:max-content; animation:marq 40s linear infinite; }
        .v4-marq:hover { animation-play-state:paused; }

        /* Floats */
        @keyframes fl1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes fl2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        /* Hover states */
        .v4-btn-p { transition:all 0.26s ease; cursor:pointer; }
        .v4-btn-p:hover { transform:translateY(-3px); box-shadow:0 20px 56px rgba(124,58,237,0.55)!important; }
        .v4-btn-g { transition:all 0.26s ease; }
        .v4-btn-g:hover { background:rgba(124,58,237,0.08)!important; border-color:rgba(124,58,237,0.5)!important; color:#7c3aed!important; }
        .v4-card  { transition:transform 0.38s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.38s ease; }
        .v4-card:hover  { transform:translateY(-12px) scale(1.01)!important; box-shadow:0 36px 80px rgba(0,0,0,0.18)!important; }
        .v4-dark-card { transition:transform 0.38s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.38s ease; }
        .v4-dark-card:hover { transform:translateY(-12px) scale(1.01)!important; box-shadow:0 36px 80px rgba(0,0,0,0.5)!important; }
        .v4-eco { transition:background 0.2s,border-color 0.2s; }
        .v4-eco:hover { background:rgba(124,58,237,0.04)!important; border-color:rgba(124,58,237,0.3)!important; }
        .v4-tier { transition:background 0.2s,transform 0.2s; }
        .v4-tier:hover { background:#f5f2ff!important; transform:translateX(4px); }
        .v4-rank { transition:transform 0.2s; cursor:default; }
        .v4-rank:hover { transform:translateX(8px); }

        /* Thin horizontal accent line animation */
        @keyframes scrollB { 0%,100%{transform:translateY(0)} 60%{transform:translateY(8px)} }

        /* Responsive */
        @media(max-width:1100px){
          .v4-hero-h  { font-size:clamp(56px,10vw,130px)!important; }
          .v4-2col    { grid-template-columns:1fr!important; }
          .v4-3col    { grid-template-columns:1fr!important; }
        }
        @media(max-width:680px){
          .v4-hero-h  { font-size:clamp(44px,13vw,88px)!important; letter-spacing:-3px!important; }
          .v4-cta-row { flex-direction:column!important; align-items:stretch!important; }
          .v4-stat-grid { display:none!important; }
        }
      `}</style>

      <div className="v4-grain" aria-hidden="true" />
      <CursorGlow />

      {/* ══════════════════════════════════════════════════════════
          PIN WRAPPER — 420vh
         ══════════════════════════════════════════════════════════ */}
      <div ref={pinWrapRef} style={{ height: "420vh", position: "relative" }}>

        <section ref={pinnedRef} style={{ height: "100vh", position: "relative", background: "#ffffff" }}>

          {/* Mutable background layer — extended 160px ABOVE section so it fills any gap */}
          <div ref={bgRef} style={{
            position: "absolute",
            top: "-160px", bottom: 0, left: 0, right: 0,
            background: "#ffffff", transition: "background 0s",
          }} />

          {/* Grid — also extended 160px above so grid lines fill any gap zone */}
          <div aria-hidden="true" style={{
            position: "absolute",
            top: "-160px", bottom: 0, left: 0, right: 0,
            pointerEvents: "none", zIndex: 1,
            backgroundImage: "linear-gradient(rgba(124,58,237,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.05) 1px,transparent 1px)",
            backgroundSize: "88px 88px",
          }} />


          {/* Radial purple glow — centre */}
          <div aria-hidden="true" style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: "900px", height: "700px", borderRadius: "50%", pointerEvents: "none", zIndex: 1,
            background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 65%)",
            filter: "blur(1px)",
          }} />

          {/* Globe — centered, full canvas behind text */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: "min(860px,88vw)", height: "min(860px,88vw)" }}>
              <ParticleGlobe progressRef={progressRef} />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="h-dec" style={{
            position: "absolute", bottom: "28px", right: "44px", zIndex: 5,
            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
          }}>
            <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom,transparent,rgba(124,58,237,0.4))", animation: "scrollB 2.2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'Michroma',monospace", fontSize: "7px", letterSpacing: "3px", color: "rgba(124,58,237,0.35)", writingMode: "vertical-rl" }}>SCROLL</span>
          </div>


          {/* Floating stat chips */}
          <div className="h-dec v4-stat-grid" style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
            {[
              { val: "2,500+", lbl: "Members", pos: { left: "4%", top: "28%" } },
              { val: "40+", lbl: "Countries", pos: { left: "4%", top: "62%" } },
              { val: "150+", lbl: "Ambassadors", pos: { right: "4%", top: "28%" } },
              { val: "3", lbl: "Products", pos: { right: "4%", top: "62%" } },
            ].map((s, i) => (
              <div key={i} style={{
                position: "absolute", ...s.pos,
                padding: "14px 20px",
                background: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(124,58,237,0.22)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 4px 28px rgba(124,58,237,0.12)",
                display: "flex", flexDirection: "column", gap: "5px",
                minWidth: "80px",
              }}>
                <span style={{ fontFamily: "'Michroma',monospace", fontSize: "clamp(18px,1.6vw,24px)", color: "#2d0057", letterSpacing: "-0.5px", lineHeight: 1, fontWeight: "600" }}>{s.val}</span>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "#7c3aed", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: "600" }}>{s.lbl}</span>
              </div>
            ))}
          </div>

          {/* ── Text layer — 3 absolute phases, each space-between so globe is uncluttered ── */}
          <div style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" }}>

            {/* ── PHASE 0 — ONE ARMY. ──
                 Layout: titles centered over globe; subtext+CTAs pinned to bottom */}
            <div ref={phase0Ref} style={{
              opacity: 1, position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              justifyContent: "space-between", alignItems: "center",
              padding: "clamp(60px,8vh,100px) 5% clamp(48px,7vh,80px)",
              textAlign: "center", pointerEvents: "none",
            }}>
              {/* Top spacer — keeps titles visually centered over globe */}
              <div />

              {/* CENTER — only the big display titles */}
              <div>
                <h1 className="h-w1 v4-hero-h pt" style={{
                  fontFamily: "'Michroma',monospace",
                  fontSize: "clamp(72px,13vw,210px)",
                  fontWeight: "400", lineHeight: "0.88", letterSpacing: "-6px",
                  color: "#08030e", textTransform: "uppercase", margin: 0,
                }}>ONE</h1>
                <h1 className="h-w2 v4-hero-h" style={{
                  fontFamily: "'Michroma',monospace",
                  fontSize: "clamp(72px,13vw,210px)",
                  fontWeight: "400", lineHeight: "0.88", letterSpacing: "-6px",
                  color: "transparent",
                  WebkitTextStroke: "2px #7c3aed",
                  textTransform: "uppercase", margin: 0,
                }}>ARMY.</h1>
              </div>

              {/* BOTTOM — subtext + CTAs, safely below the globe sphere */}
              <div style={{ pointerEvents: "auto" }}>
                <p className="h-sub" style={{
                  fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(13px,1.1vw,16px)",
                  color: "rgba(8,3,14,0.65)", lineHeight: "1.9",
                  maxWidth: "440px", margin: "0 auto 28px",
                }}>
                  A global movement of builders, creators &amp; educators.<br />
                  AI-native. Decentralised. Forty countries. One home.
                </p>
                <div className="h-ctas v4-cta-row" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="v4-btn-p"
                    onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))}
                    style={{
                      padding: "16px 40px",
                      background: "#7c3aed", color: "#fff", border: "none",
                      fontFamily: "'Michroma',monospace", fontSize: "12px",
                      letterSpacing: "2px", textTransform: "uppercase",
                      cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,0.38)",
                      pointerEvents: "auto"
                    }}>
                    JOIN THE ARMY →
                  </button>
                  <Link href="/udaan" className="v4-btn-g" style={{
                    padding: "16px 32px", background: "transparent",
                    color: "rgba(8,3,14,0.78)", border: "1px solid rgba(124,58,237,0.45)",
                    fontFamily: "'Michroma',monospace", fontSize: "12px",
                    letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none",
                    pointerEvents: "auto", display: "inline-block",
                  }}>
                    EXPLORE PATHS →
                  </Link>
                </div>
              </div>
            </div>

            {/* ── PHASE 1 — THREE PATHS. ──
                 Label sits above globe; UDAAN/AMBASSADOR/MISSIONS below */}
            <div ref={phase1Ref} style={{
              opacity: 0, position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              justifyContent: "space-between", alignItems: "center",
              padding: "clamp(56px,7vh,88px) 5% clamp(44px,6vh,72px)",
              textAlign: "center", pointerEvents: "none",
            }}>
              {/* TOP — label above sphere */}
              <div>
                <Label num="01" text="Choose Your Path" style={{ fontSize: "18px", letterSpacing: "3px" }} />
              </div>

              {/* CENTER — display titles only */}
              <div>
                <h2 className="pt" style={{
                  fontFamily: "'Michroma',monospace",
                  fontSize: "clamp(64px,12vw,200px)",
                  fontWeight: "400", lineHeight: "0.88", letterSpacing: "-6px",
                  color: "#08030e", textTransform: "uppercase", margin: 0,
                }}>THREE</h2>
                <h2 style={{
                  fontFamily: "'Michroma',monospace",
                  fontSize: "clamp(64px,12vw,200px)",
                  fontWeight: "400", lineHeight: "0.88", letterSpacing: "-6px",
                  color: "transparent", WebkitTextStroke: "2px #7c3aed",
                  textTransform: "uppercase", margin: 0,
                }}>PATHS.</h2>
              </div>

              {/* BOTTOM — path names below sphere */}
              <div style={{ display: "flex", gap: "48px", flexWrap: "wrap", justifyContent: "center" }}>
                {[["UDAAN", "4-week AI startup sprint."], ["AMBASSADOR", "Lead your region."], ["MISSIONS", "Show up. Earn your tier."]].map(([t, d], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "1.5px", color: "rgba(124,58,237,0.7)", marginBottom: "8px" }}>0{i + 1}</div>
                    <div className="pt" style={{ fontFamily: "'Michroma',monospace", fontSize: "22px", color: "#08030e", letterSpacing: "0.5px", marginBottom: "5px" }}>{t}</div>
                    <div className="pt-sub" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "15px", color: "rgba(8,3,14,0.65)" }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── PHASE 2 — ONE FUTURE. ──
                 Label above sphere; paragraph below */}
            <div ref={phase2Ref} style={{
              opacity: 0, position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              justifyContent: "space-between", alignItems: "center",
              padding: "clamp(56px,7vh,88px) 5% clamp(44px,6vh,72px)",
              textAlign: "center", pointerEvents: "none",
            }}>
              {/* TOP — label */}
              <div>
                <Label num="02" text="The Vision" dark />
              </div>

              {/* CENTER — display titles */}
              <div>
                <h2 style={{
                  fontFamily: "'Michroma',monospace",
                  fontSize: "clamp(64px,12vw,200px)",
                  fontWeight: "400", lineHeight: "0.88", letterSpacing: "-6px",
                  color: "#f0ebff", textTransform: "uppercase", margin: 0,
                }}>ONE</h2>
                <h2 style={{
                  fontFamily: "'Michroma',monospace",
                  fontSize: "clamp(64px,12vw,200px)",
                  fontWeight: "400", lineHeight: "0.88", letterSpacing: "-6px",
                  color: "transparent", WebkitTextStroke: "1.5px rgba(220,210,255,0.55)",
                  textTransform: "uppercase", margin: 0,
                }}>FUTURE.</h2>
              </div>

              {/* BOTTOM — paragraph */}
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "15px", color: "rgba(220,210,255,0.72)", lineHeight: "1.95", maxWidth: "400px", margin: 0 }}>
                One army. Three products. Forty countries.<br />An AI-native, decentralised future — built together.
              </p>
            </div>

          </div>
        </section>
      </div>{/* end pin wrapper */}

      {/* ══════════════════════════════════════════════════════════
          DARK TICKER BAND
         ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#06030f", overflow: "hidden", padding: "14px 0", borderTop: "1px solid rgba(124,58,237,0.2)" }}>
        <div className="v4-marq">
          {[...Array(3)].flatMap((_, p) => marqueeItems.map((item, i) => (
            <span key={`${p}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: "22px", padding: "0 26px" }}>
              <span style={{ fontFamily: "'Michroma',monospace", fontSize: "8px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(196,181,253,0.55)", whiteSpace: "nowrap" }}>{item}</span>
              <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(167,139,250,0.7)", flexShrink: 0 }} />
            </span>
          )))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MANIFESTO — dark cinematic moment
         ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#06030f", padding: "160px 60px 140px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          fontFamily: "'Michroma',monospace", fontSize: "clamp(80px,16vw,260px)",
          color: "rgba(124,58,237,0.03)", letterSpacing: "-10px", textTransform: "uppercase",
          userSelect: "none", pointerEvents: "none",
        }}>MOVEMENT</div>
        <div aria-hidden="true" style={{
          position: "absolute", bottom: "0", left: "-5%",
          width: "700px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="dag-sr" style={{ marginBottom: "64px" }}>
            <Label num="03" text="The Belief" dark />
          </div>
          <div>
            {[
              { text: "THIS IS NOT", op: "0.28", sz: "clamp(36px,5vw,78px)" },
              { text: "A COURSE PLATFORM.", op: "0.28", sz: "clamp(36px,5vw,78px)" },
              { text: "THIS IS A", op: "0.95", sz: "clamp(36px,5vw,78px)" },
              { text: "MOVEMENT.", op: "1", sz: "clamp(58px,9vw,148px)", stroke: true },
            ].map((line, i) => (
              <div key={i} className="mani-line" style={{
                fontFamily: "'Michroma',monospace",
                fontSize: line.sz, fontWeight: "400", lineHeight: "1.08", letterSpacing: "-2px",
                margin: "0 0 4px", textTransform: "uppercase",
                color: line.stroke ? "transparent" : `rgba(240,235,255,${line.op})`,
                ...(line.stroke ? { WebkitTextStroke: "2px rgba(240,235,255,0.9)" } : {}),
              }}>{line.text}</div>
            ))}
          </div>

          <div className="dag-ssr v4-2col" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "0 80px", marginTop: "96px", borderTop: "1px solid rgba(124,58,237,0.12)", paddingTop: "56px"
          }}>
            {[
              { n: "01", title: "No Background Filters", body: "Skills define your place here — not your city, degree, or starting point." },
              { n: "02", title: "No Shortcuts Promised", body: "Consistent effort over time. That's the only formula that actually works." },
              { n: "03", title: "No Location Limits", body: "40+ countries. One community. Local in language, global in ambition." },
              { n: "04", title: "Practical Over Theoretical", body: "Every mission, module, and program leads to real-world outcomes." },
            ].map((b, i) => (
              <div key={i} className="sc-item" style={{ padding: "32px 0", borderBottom: "1px solid rgba(124,58,237,0.08)" }}>
                <div style={{ fontFamily: "'Michroma',monospace", fontSize: "9px", color: "rgba(124,58,237,0.4)", marginBottom: "14px" }}>{b.n}</div>
                <p style={{ fontFamily: "'Michroma',monospace", fontSize: "11px", letterSpacing: "0.5px", color: "rgba(240,235,255,0.7)", margin: "0 0 10px", textTransform: "uppercase" }}>{b.title}</p>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "13px", color: "rgba(196,181,253,0.3)", lineHeight: "1.9", margin: 0 }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          UDAAN — white/light purple
         ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "140px 60px 120px", position: "relative", overflow: "hidden" }}>
        {/* Light purple top bar */}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg,transparent,#7c3aed,#a78bfa,transparent)" }} />
        {/* Ghost text */}
        <div aria-hidden="true" style={{
          position: "absolute", bottom: "-6%", right: "-2%",
          fontFamily: "'Michroma',monospace", fontSize: "clamp(100px,18vw,280px)",
          color: "rgba(124,58,237,0.04)", letterSpacing: "-8px", textTransform: "uppercase",
          userSelect: "none", pointerEvents: "none",
        }}>UDAAN</div>

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="v4-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px 120px", alignItems: "center" }}>

            <div className="dag-sr">
              <Label num="04" text="Structured Program" />
              <h2 style={{
                fontFamily: "'Michroma',monospace",
                fontSize: "clamp(44px,5.5vw,88px)",
                fontWeight: "400", lineHeight: "1.0", letterSpacing: "-3px",
                color: "#08030e", textTransform: "uppercase", margin: "0 0 24px",
              }}>UDAAN<span style={{ color: "rgba(124,58,237,0.4)" }}>.</span></h2>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "15px", color: "rgba(8,3,14,0.65)", lineHeight: "1.9", maxWidth: "420px", margin: "0 0 44px" }}>
                A 4-week high-intensity AI startup sprint. Go from idea to a live,
                validated prototype. Four phases. Four deliverables. Zero fluff.
              </p>
              {/* Stat row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(124,58,237,0.12)", marginBottom: "48px" }}>
                {[["4", "Weeks"], ["4", "Phases"], ["4", "Deliverables"], ["1", "Founder Track"]].map(([n, l], i) => (
                  <div key={i} style={{ padding: "20px 14px", background: "#fff", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Michroma',monospace", fontSize: "clamp(18px,2vw,26px)", color: "#3b0764", letterSpacing: "-1px", lineHeight: 1, marginBottom: "5px", fontWeight: "600" }}>{n}</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "11px", color: "rgba(124,58,237,0.85)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "600" }}>{l}</div>
                  </div>
                ))}
              </div>
              <Link href="/udaan" style={{
                display: "inline-flex", alignItems: "center", gap: "12px",
                fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "2px",
                textTransform: "uppercase", color: "#7c3aed", textDecoration: "none",
                padding: "14px 30px", border: "1px solid rgba(124,58,237,0.35)",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7c3aed"; }}>
                EXPLORE UDAAN →
              </Link>
            </div>

            <div className="dag-sr">
              <p style={{ fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "2.5px", color: "rgba(124,58,237,0.85)", marginBottom: "28px", textTransform: "uppercase", fontWeight: "600" }}>4-WEEK SPRINT</p>

              {/* Week timeline */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {[
                  { wk: "01", phase: "Problem Discovery", sub: "Structured Idea Validation", body: "Define the right problem before building. Understand users. Validate direction.", accent: "#7c3aed" },
                  { wk: "02", phase: "AI MVP Development", sub: "Functional Build", body: "Convert your concept into a working AI prototype using structured development tools.", accent: "#6d28d9" },
                  { wk: "03", phase: "Validation & Testing", sub: "Evidence Before Scale", body: "Test with real users. Refine before expansion.", accent: "#5b21b6" },
                  { wk: "04", phase: "Pitch & Positioning", sub: "Structured Evaluation", body: "Prepare your narrative. Define traction. Enter the Founder Track.", accent: "#4c1d95" },
                ].map((w, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "20px", padding: "20px 24px",
                    background: i % 2 === 0 ? "#fbf9ff" : "#ffffff",
                    borderLeft: `3px solid ${w.accent}`,
                    transition: "background 0.2s",
                  }}>
                    {/* Week number */}
                    <div style={{
                      fontFamily: "'Michroma',monospace", fontSize: "11px",
                      color: w.accent, letterSpacing: "1px", flexShrink: 0,
                      paddingTop: "3px", minWidth: "32px", fontWeight: "700",
                    }}>W{w.wk}</div>
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "'Michroma',monospace", fontSize: "13px",
                        color: "#08030e", letterSpacing: "0.3px", textTransform: "uppercase",
                        marginBottom: "4px", fontWeight: "700",
                      }}>{w.phase}</div>
                      <div style={{
                        fontFamily: "'Michroma',monospace", fontSize: "10px",
                        color: w.accent, letterSpacing: "1.5px", textTransform: "uppercase",
                        marginBottom: "8px", fontWeight: "600",
                      }}>{w.sub}</div>
                      <div style={{
                        fontFamily: "'Space Grotesk',sans-serif", fontSize: "13px",
                        color: "rgba(8,3,14,0.60)", lineHeight: "1.7",
                      }}>{w.body}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Program Architecture stat strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(124,58,237,0.12)", margin: "24px 0 0" }}>
                {[
                  ["4", "Defined Phases", "Weekly progression"],
                  ["4", "Deliverables", "Measurable output"],
                  ["Live", "Validation", "Real user feedback"],
                  ["Path", "Founder Track", "Pitch & evaluation"],
                ].map(([n, l, s], i) => (
                  <div key={i} style={{ padding: "16px 10px", background: "#ffffff", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Michroma',monospace", fontSize: "clamp(14px,1.3vw,18px)", color: "#3b0764", letterSpacing: "-0.5px", lineHeight: 1, marginBottom: "5px", fontWeight: "700" }}>{n}</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "#7c3aed", letterSpacing: "0.8px", textTransform: "uppercase", fontWeight: "700", marginBottom: "3px" }}>{l}</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "rgba(8,3,14,0.58)", letterSpacing: "0.5px" }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MISSIONS + RANKS — light purple tint
         ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#f8f5ff", padding: "140px 60px 120px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          fontFamily: "'Michroma',monospace", fontSize: "clamp(80px,16vw,260px)",
          color: "rgba(124,58,237,0.04)", letterSpacing: "-8px", textTransform: "uppercase",
          userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
        }}>TIERS</div>
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "rgba(124,58,237,0.12)" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div className="dag-sr" style={{ marginBottom: "80px" }}>
            <Label num="05" text="Daily Engagement" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
              <div>
                <h2 style={{
                  fontFamily: "'Michroma',monospace",
                  fontSize: "clamp(44px,7vw,110px)",
                  fontWeight: "400", lineHeight: "0.92", letterSpacing: "-4px",
                  color: "#08030e", textTransform: "uppercase", margin: 0,
                }}>SHOW UP.</h2>
                <h2 style={{
                  fontFamily: "'Michroma',monospace",
                  fontSize: "clamp(44px,7vw,110px)",
                  fontWeight: "400", lineHeight: "0.92", letterSpacing: "-4px",
                  color: "transparent", WebkitTextStroke: "2px #7c3aed",
                  textTransform: "uppercase", margin: 0,
                }}>LEVEL UP.</h2>
              </div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "14px", color: "rgba(8,3,14,0.55)", lineHeight: "1.9", maxWidth: "260px" }}>
                Missions run daily. The leaderboard is live. Your tier is the direct output of your consistency.
              </p>
            </div>
          </div>

          <div className="v4-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
            {/* Left: feature grid */}
            <div className="dag-sr">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(124,58,237,0.12)", marginBottom: "40px" }}>
                {[["Daily", "Missions"], ["Live", "Leaderboard"], ["2", "Tiers"], ["Real-Time", "Global"]].map(([n, l], i) => (
                  <div key={i} style={{ padding: "28px", background: "#f8f5ff" }}>
                    <div style={{ fontFamily: "'Michroma',monospace", fontSize: "clamp(15px,1.5vw,20px)", color: "#3b0764", marginBottom: "6px" }}>{n}</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "11px", color: "rgba(124,58,237,0.85)", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "600" }}>{l}</div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/missions" style={{
                display: "inline-flex", alignItems: "center", gap: "12px",
                fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "2px",
                textTransform: "uppercase", color: "#7c3aed", textDecoration: "none",
                border: "1px solid rgba(124,58,237,0.3)", padding: "14px 28px",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7c3aed"; }}>
                VIEW MISSIONS →
              </Link>
            </div>
            {/* Right: tiers (replaces old 5-rank list) */}
            <div className="dag-sr">
              <p style={{ fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "2.5px", color: "rgba(124,58,237,0.85)", marginBottom: "28px", textTransform: "uppercase", fontWeight: "600" }}>THE 2 TIERS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { sym: "◆", title: "DAG SOLDIER", sub: "The entry tier. Complete missions, stay consistent, and contribute to the community.", color: "#7c3aed" },
                  { sym: "★", title: "DAG LIEUTENANT", sub: "The elevated tier. Demonstrated leadership, higher rewards, and ecosystem recognition.", color: "#d97706" },
                ].map((tier, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: "20px", padding: "28px 0",
                    borderBottom: i === 0 ? "1px solid rgba(124,58,237,0.1)" : "none",
                  }}>
                    <div style={{
                      width: "52px", height: "52px", flexShrink: 0, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      background: `${tier.color}15`, border: `1px solid ${tier.color}35`,
                      fontFamily: "monospace", fontSize: "22px", color: tier.color,
                    }}>{tier.sym}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Michroma',monospace", fontSize: "13px", letterSpacing: "0.5px", color: "#08030e", textTransform: "uppercase", marginBottom: "8px", fontWeight: "600" }}>{tier.title}</div>
                      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "13px", color: "rgba(8,3,14,0.58)", lineHeight: "1.6" }}>{tier.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          THREE PATHWAYS — dark section for contrast drama
         ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#06030f", padding: "140px 60px 120px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="dag-sr" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "28px", marginBottom: "60px" }}>
            <div>
              <Label num="06" text="Your Path" dark />
              <h2 style={{
                fontFamily: "'Michroma',monospace", fontSize: "clamp(30px,4.5vw,64px)",
                fontWeight: "400", color: "#f0ebff", letterSpacing: "-2px", lineHeight: "1.05", margin: 0, textTransform: "uppercase",
              }}>
                DIFFERENT PATHS.<br />
                <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(196,181,253,0.25)" }}>SAME DESTINATION.</span>
              </h2>
            </div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "14px", color: "rgba(196,181,253,0.65)", maxWidth: "260px", lineHeight: "1.9" }}>
              Three distinct ways to grow inside the DAG Army ecosystem.
            </p>
          </div>

          <div className="dag-ssr v4-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px" }}>
            {[
              {
                num: "01", tag: "4-WEEK SPRINT", name: "UDAAN",
                bg: "linear-gradient(155deg,#1e1750 0%,#2d2490 100%)", accent: "#a78bfa", href: "/udaan",
                desc: "From idea to validated AI startup in 4 weeks. 4 phases. 4 deliverables. You leave with a functional prototype and a monetisation pathway.", cta: "EXPLORE →"
              },
              {
                num: "02", tag: "COMMUNITY PROGRAM", name: "AMBASSADOR",
                bg: "linear-gradient(155deg,#0d0b25 0%,#1e1b4b 100%)", accent: "#c4b5fd", href: "/ambassador",
                desc: "Represent DAG Army in your region. Build your personal brand. Grow your audience. Free and open to all.", cta: "APPLY FREE →"
              },
              {
                num: "03", tag: "DAILY ENGAGEMENT", name: "MISSIONS",
                bg: "linear-gradient(155deg,#031810 0%,#064e3b 100%)", accent: "#34d399", href: "/dashboard/missions",
                desc: "Daily missions. Live leaderboard. 2 tiers: DAG Soldier and DAG Lieutenant. Your consistency is the only input. Your tier is the only output.", cta: "VIEW →"
              },
            ].map((p, i) => (
              <Link key={i} href={p.href} className="sc-item v4-dark-card" style={{
                display: "flex", flexDirection: "column", background: p.bg,
                padding: "52px 40px", minHeight: "440px", textDecoration: "none",
                position: "relative", overflow: "hidden",
              }}>
                <div aria-hidden="true" style={{
                  position: "absolute", top: "-80px", right: "-80px",
                  width: "320px", height: "320px", borderRadius: "50%", pointerEvents: "none",
                  background: `radial-gradient(circle,${p.accent}18 0%,transparent 65%)`,
                }} />
                <p style={{ fontFamily: "'Michroma',monospace", fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.50)", margin: "0 0 28px", textTransform: "uppercase" }}>{p.num} / {p.tag}</p>
                <h3 style={{ fontFamily: "'Michroma',monospace", fontSize: "clamp(18px,1.8vw,28px)", fontWeight: "400", color: "#fff", letterSpacing: "0px", lineHeight: "1.1", margin: "0 0 20px", textTransform: "uppercase", whiteSpace: "normal", overflow: "visible" }}>{p.name}</h3>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "1.9", margin: "auto 0 0", flex: 1 }}>{p.desc}</p>
                <div style={{ marginTop: "36px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.15)", fontFamily: "'Michroma',monospace", fontSize: "11px", letterSpacing: "2px", color: p.accent }}>{p.cta}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ECOSYSTEM — white
         ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "140px 60px 120px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "rgba(124,58,237,0.1)" }} />
        <div aria-hidden="true" style={{
          position: "absolute", top: "-5%", right: "-4%",
          fontFamily: "'Michroma',monospace", fontSize: "clamp(80px,14vw,240px)",
          color: "rgba(124,58,237,0.03)", letterSpacing: "-8px", textTransform: "uppercase",
          userSelect: "none", pointerEvents: "none",
        }}>ECO</div>

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="dag-sr" style={{ marginBottom: "72px" }}>
            <Label num="07" text="The Ecosystem" />
            <h2 style={{ fontFamily: "'Michroma',monospace", fontSize: "clamp(34px,5vw,80px)", fontWeight: "400", letterSpacing: "-2px", lineHeight: "1.0", margin: 0, color: "#08030e", textTransform: "uppercase" }}>
              THREE PRODUCTS.<br />
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(124,58,237,0.3)" }}>ONE VISION.</span>
            </h2>
          </div>

          <div className="dag-ssr" style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(8,3,14,0.07)" }}>
            {ecosystem.map((e, i) => (
              <div key={i} className="sc-item v4-eco"
                onClick={() => e.ext && window.open(e.href, "_blank")}
                style={{ display: "grid", gridTemplateColumns: "56px 220px 1fr 44px", gap: "28px", alignItems: "center", padding: "36px 0", borderBottom: "1px solid rgba(8,3,14,0.07)", cursor: e.ext ? "pointer" : "default" }}>
                <span style={{ fontFamily: "'Michroma',monospace", fontSize: "12px", color: "rgba(124,58,237,0.65)", letterSpacing: "1px", fontWeight: "600" }}>{e.num}</span>
                <div>
                  <p style={{ fontFamily: "'Michroma',monospace", fontSize: "11px", color: e.dot, letterSpacing: "2px", margin: "0 0 7px", textTransform: "uppercase", fontWeight: "600" }}>{e.tag}</p>
                  <p style={{ fontFamily: "'Michroma',monospace", fontSize: "20px", color: "#08030e", margin: 0, letterSpacing: "-0.5px" }}>{e.name}</p>
                </div>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "14px", color: "rgba(8,3,14,0.62)", lineHeight: "1.85", margin: 0 }}>{e.desc}</p>
                <div style={{ width: "36px", height: "36px", border: `1px solid ${e.dot}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Michroma',monospace", fontSize: "12px", color: e.dot }}>→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          AMBASSADOR — light purple tint
         ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#f8f5ff", padding: "140px 60px 120px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "rgba(124,58,237,0.12)" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="v4-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px 120px" }}>

            <div className="dag-sr">
              <Label num="08" text="Ambassador Program" />
              <h2 style={{ fontFamily: "'Michroma',monospace", fontSize: "clamp(34px,5vw,80px)", fontWeight: "400", color: "#08030e", letterSpacing: "-2px", lineHeight: "1.0", margin: "0 0 24px", textTransform: "uppercase" }}>
                REPRESENT<br />YOUR<br />REGION.
              </h2>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "15px", color: "rgba(8,3,14,0.68)", lineHeight: "1.9", margin: "0 0 16px", maxWidth: "380px" }}>
                Build your personal brand. Lead the AI and Blockchain narrative in your city. Grow your regional audience.
              </p>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "14px", color: "rgba(124,58,237,0.8)", margin: "0 0 44px" }}>
                150+ Ambassadors · 40+ Countries · Free to Apply
              </p>
              <Link href="/ambassador" style={{
                display: "inline-flex", alignItems: "center", gap: "12px",
                fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "2px",
                textTransform: "uppercase", color: "#7c3aed", textDecoration: "none",
                border: "1px solid rgba(124,58,237,0.35)", padding: "14px 30px",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7c3aed"; }}>
                APPLY NOW — FREE →
              </Link>
            </div>

            <div className="dag-sr dag-ssr">
              <p style={{ fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "2.5px", color: "rgba(124,58,237,0.8)", marginBottom: "24px", textTransform: "uppercase", fontWeight: "600" }}>PROGRAM TIERS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(124,58,237,0.1)" }}>
                {tiers.map((tier, i) => (
                  <div key={i} className="sc-item v4-tier" style={{
                    padding: "26px 28px", background: "#f8f5ff",
                    borderLeft: `3px solid ${tier.hot ? tier.accent : "transparent"}`,
                    position: "relative",
                  }}>
                    {tier.hot && (
                      <span style={{ position: "absolute", top: "16px", right: "20px", fontFamily: "'Michroma',monospace", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: tier.accent, border: `1px solid ${tier.accent}50`, padding: "3px 10px", fontWeight: "600" }}>POPULAR</span>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                      <span style={{ fontFamily: "'Michroma',monospace", fontSize: "11px", letterSpacing: "1px", color: tier.accent, fontWeight: "600" }}>{tier.code}</span>
                      <span style={{ fontFamily: "'Michroma',monospace", fontSize: "15px", color: "#3b0764", letterSpacing: "1.5px" }}>{tier.name}</span>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "12px", color: "rgba(8,3,14,0.60)", marginLeft: "auto" }}>{tier.req}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {tier.perks.map((perk, j) => (
                        <span key={j} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "12px", color: "rgba(8,3,14,0.70)", padding: "5px 12px", border: "1px solid rgba(124,58,237,0.20)", background: "rgba(255,255,255,0.7)" }}>{perk}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA — full purple
         ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#6d28d9 100%)", padding: "160px 60px 180px", position: "relative", overflow: "hidden" }}>
        {/* Ghost DAGARMY bg */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          fontFamily: "'Michroma',monospace", fontSize: "clamp(80px,18vw,280px)",
          color: "rgba(255,255,255,0.05)", letterSpacing: "-10px", textTransform: "uppercase",
          userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
        }}>DAGARMY</div>
        {/* Grid on purple */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
          backgroundSize: "88px 88px",
        }} />
        {/* Top glow */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
          width: "1000px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div className="dag-sr">
            <div style={{ marginBottom: "28px" }}>
              <span style={{ fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "3px", color: "rgba(255,255,255,0.70)", textTransform: "uppercase", fontWeight: "600" }}>09 // JOIN THE MOVEMENT</span>
            </div>
            <h2 style={{ fontFamily: "'Michroma',monospace", fontSize: "clamp(44px,8vw,130px)", fontWeight: "400", lineHeight: "0.9", letterSpacing: "-5px", color: "#fff", textTransform: "uppercase", margin: "0 0 8px" }}>READY TO JOIN</h2>
            <h2 style={{ fontFamily: "'Michroma',monospace", fontSize: "clamp(44px,8vw,130px)", fontWeight: "400", lineHeight: "0.9", letterSpacing: "-5px", color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.3)", textTransform: "uppercase", margin: "0 0 56px" }}>THE ARMY?</h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: "1.95", maxWidth: "460px", margin: "0 auto 56px" }}>
              No background filters. No location limits. No shortcuts promised.<br />Just the Army — and a place for you in it.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "32px" }}>
              <button className="v4-btn-p"
                onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))}
                style={{
                  padding: "18px 48px", background: "#fff", color: "#7c3aed", border: "none",
                  fontFamily: "'Michroma',monospace", fontSize: "12px", letterSpacing: "2px",
                  textTransform: "uppercase", cursor: "pointer",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.2)"
                }}>
                JOIN THE ARMY FREE →
              </button>
              <Link href="/ambassador" style={{
                padding: "18px 36px", background: "transparent",
                color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.25)",
                fontFamily: "'Michroma',monospace", fontSize: "11px",
                letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}>
                BECOME AN AMBASSADOR →
              </Link>
            </div>
            <p style={{ fontFamily: "'Michroma',monospace", fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.60)", textTransform: "uppercase" }}>
              FREE TO JOIN - NO COMMITMENTS
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
