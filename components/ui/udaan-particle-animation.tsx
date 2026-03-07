"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface UdaanParticleAnimationProps {
  width?: number;
  height?: number;
}

export const UdaanParticleAnimation: React.FC<UdaanParticleAnimationProps> = ({
  width = 500,
  height = 500,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const textEl = textOverlayRef.current;

    // Tween engine
    const Tweens: any[] = [];
    function easeInOut(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function tweenTo(obj: any, props: any, duration: number, delay: number, onComplete?: () => void) {
      const start: any = {};
      for (const k in props) start[k] = obj[k];
      Tweens.push({
        obj,
        start,
        end: { ...props },
        duration: duration * 1000,
        delay: (delay || 0) * 1000,
        elapsed: 0,
        onComplete,
      });
    }
    function killTweensFor(objs: any[]) {
      for (let i = Tweens.length - 1; i >= 0; i--) {
        if (objs.includes(Tweens[i].obj)) Tweens.splice(i, 1);
      }
    }
    function updateTweens(dt: number) {
      for (let i = Tweens.length - 1; i >= 0; i--) {
        const tw = Tweens[i];
        tw.elapsed += dt;
        if (tw.elapsed < tw.delay) continue;
        const t = Math.min((tw.elapsed - tw.delay) / tw.duration, 1);
        const e = easeInOut(t);
        for (const k in tw.end) tw.obj[k] = tw.start[k] + (tw.end[k] - tw.start[k]) * e;
        if (t >= 1) {
          if (tw.onComplete) tw.onComplete();
          Tweens.splice(i, 1);
        }
      }
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 0, 700);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights - using gradient palette colors
    const sl1 = new THREE.SpotLight(0x6366f1, 2.8); // Start gradient color
    sl1.position.set(300, -200, 600);
    scene.add(sl1);
    const sl2 = new THREE.SpotLight(0x8b5cf6, 2.2); // End gradient color
    sl2.position.set(-400, 300, -100);
    scene.add(sl2);
    const sl3 = new THREE.SpotLight(0x7a82f6, 1.5); // Mid gradient color
    sl3.position.set(0, 400, 200);
    scene.add(sl3);
    scene.add(new THREE.AmbientLight(0x6366f1, 0.6)); // Gradient start for ambient

    // Particles
    const N = 2000;
    const R = 200;
    // Professional gradient palette from #7f81f8ff to #a682faff
    const COLORS = [
      0x6366f1, // Start: Indigo
      0x6b70f3, // 
      0x7279f5, // 
      0x7a82f6, // 
      0x818bf8, // Mid-gradient
      0x8994f9, // 
      0x8b5cf6, // End: Violet
    ];

    const particleGroup = new THREE.Object3D();
    scene.add(particleGroup);
    const meshes: THREE.Mesh[] = [];
    const posProxies: any[] = [];

    const sphereTargets = Array.from({ length: N }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      return {
        x: R * Math.sin(phi) * Math.cos(theta),
        y: R * Math.sin(phi) * Math.sin(theta),
        z: R * Math.cos(phi),
      };
    });

    for (let i = 0; i < N; i++) {
      const size = 1.5 + Math.random() * 1.8;
      const geo = new THREE.IcosahedronGeometry(size, 0);
      const col = COLORS[i % COLORS.length];
      const mat = new THREE.MeshPhongMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.2, // Reduced for subtle glow
        side: THREE.DoubleSide,
        flatShading: true,
        transparent: true,
        opacity: 0.7, // More transparent for subtle background effect
      });
      const mesh = new THREE.Mesh(geo, mat);
      const px = {
        x: (Math.random() - 0.5) * 2200,
        y: (Math.random() - 0.5) * 2200,
        z: (Math.random() - 0.5) * 2200,
      };
      mesh.position.set(px.x, px.y, px.z);
      particleGroup.add(mesh);
      meshes.push(mesh);
      posProxies.push(px);
    }

    // Text rasterizer
    function rasterizeText(text: string, cw: number, ch: number, fs: number) {
      const c = document.createElement("canvas");
      c.width = cw;
      c.height = ch;
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${fs}px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, cw / 2, ch / 2);
      return ctx.getImageData(0, 0, cw, ch);
    }

    function samplePoints(imgData: ImageData, max: number) {
      const pts: any[] = [];
      const d = imgData.data;
      const w = imgData.width;
      const h = imgData.height;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 100) {
          pts.push({ x: (i / 4) % w - w / 2, y: -(Math.floor(i / 4 / w) - h / 2) });
        }
      }
      if (pts.length <= max) return pts;
      const step = Math.ceil(pts.length / max);
      return pts.filter((_, i) => i % step === 0);
    }

    const TEXTS = ["Welcome", "to DagArmy", "and", "Welcome", "to Udaan"];
    const allTextTargets = TEXTS.map((text) => {
      // Increase canvas width to 1400 and reduce font size to 95px to prevent cutoff
      const pts = samplePoints(rasterizeText(text, 1400, 300, 95), N);
      return Array.from({ length: N }, (_, i) => {
        const p = pts[i % pts.length];
        // Reduce scaling to 0.85 to fit better in viewport
        return { x: p.x * 0.85, y: p.y * 0.85, z: (Math.random() - 0.5) * 8 };
      });
    });

    // Morph
    function morphTo(targets: any[], duration: number, onComplete?: () => void) {
      killTweensFor(posProxies);
      let done = 0;
      posProxies.forEach((po, i) => {
        const t = targets[i % targets.length];
        tweenTo(
          po,
          { x: t.x, y: t.y, z: t.z },
          duration,
          i * 0.0002,
          () => {
            if (++done === N && onComplete) onComplete();
          }
        );
      });
    }

    // Overlay text
    function showText(text: string, cb: () => void) {
      if (textEl) {
        textEl.textContent = text;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => textEl.classList.add("visible"))
        );
        setTimeout(cb, 2600);
      }
    }

    function hideText(cb: () => void) {
      if (textEl) {
        textEl.classList.remove("visible");
        textEl.classList.add("fade-out");
        setTimeout(() => {
          textEl.textContent = "";
          textEl.classList.remove("fade-out");
          cb();
        }, 800);
      }
    }

    // Rotation state
    let rotY = 0;
    let isSpinning = true;
    const rotProxy = { y: 0 };

    // Sequence - slower transitions
    function phaseGlobe(onDone: () => void) {
      isSpinning = true;
      morphTo(sphereTargets, 4.0, () => setTimeout(onDone, 3000));
    }

    function phaseText(idx: number, onDone: () => void) {
      isSpinning = false;
      killTweensFor([rotProxy]);
      rotProxy.y = rotY % (Math.PI * 2);
      if (rotProxy.y > Math.PI) rotProxy.y -= Math.PI * 2;
      tweenTo(rotProxy, { y: 0 }, 0.8, 0, () => {
        rotY = 0;
        particleGroup.rotation.y = 0;
        morphTo(allTextTargets[idx], 2.2, () => {
          showText(TEXTS[idx], () => hideText(onDone));
        });
      });
    }

    function runSequence() {
      phaseGlobe(() => {
        let i = 0;
        (function nextText() {
          if (i >= TEXTS.length) {
            setTimeout(runSequence, 1500);
            return;
          }
          phaseText(i++, () => setTimeout(nextText, 800));
        })();
      });
    }

    // Render loop
    let lastTime = performance.now();
    let animationFrameId: number;

    (function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;
      updateTweens(dt);
      for (let i = 0; i < N; i++) {
        meshes[i].position.x = posProxies[i].x;
        meshes[i].position.y = posProxies[i].y;
        meshes[i].position.z = posProxies[i].z;
      }
      if (isSpinning) {
        rotY += 0.0006; // Slower rotation for subtle effect
        particleGroup.rotation.y = rotY;
      } else {
        particleGroup.rotation.y = rotProxy.y;
      }
      renderer.render(scene, camera);
    })();

    setTimeout(runSequence, 1000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
        container.removeChild(renderer.domElement);
      }
    };
  }, [width, height]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* SVG grain filter */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter
            id="grain-filter-udaan"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              seed="2"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="grayNoise"
            />
            <feBlend
              in="SourceGraphic"
              in2="grayNoise"
              mode="multiply"
              result="blended"
            />
            <feComponentTransfer in="blended">
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <div
        ref={textOverlayRef}
        style={{
          position: "absolute",
          bottom: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          pointerEvents: "none",
          fontFamily: "Georgia, serif",
          fontSize: "2.2rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          whiteSpace: "nowrap",
          lineHeight: 1.6,
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: 0,
          transition: "opacity 0.9s ease",
          filter: "url(#grain-filter-udaan)",
        }}
        className="text-overlay"
      />
      <style jsx>{`
        .text-overlay.visible {
          opacity: 1 !important;
        }
        .text-overlay.fade-out {
          opacity: 0 !important;
        }
      `}</style>
    </div>
  );
};
