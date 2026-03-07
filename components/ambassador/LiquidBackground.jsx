"use client";
import { useRef, useMemo, useEffect, useState } from "react";

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv.x *= uResolution.x / uResolution.y;

  vec2 mouse = uMouse / uResolution;
  mouse.x *= uResolution.x / uResolution.y;

  vec2 q;
  q.x = fbm(uv + 0.0 * uTime * 0.12);
  q.y = fbm(uv + vec2(1.0));

  vec2 r;
  r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime * 0.12);
  r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime * 0.12);

  float f = fbm(uv + r);

  float mouseDist = length(uv - mouse) * 0.4;
  float mouseInfluence = smoothstep(0.6, 0.0, mouseDist) * 0.08;

  vec3 color = mix(uColor1, uColor2, clamp((f * f) * 4.0 + mouseInfluence, 0.0, 1.0));
  color = mix(color, vec3(0.04, 0.04, 0.12), clamp(length(q), 0.0, 1.0));
  color = mix(color, uColor2, clamp(length(r.x), 0.0, 1.0));

  float grain = (hash(uv + fract(uTime * 0.01)) - 0.5) * 0.018;
  gl_FragColor = vec4(color + grain, 1.0);
}
`;

const VERT = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

export default function LiquidBackground() {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const progRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const startRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;
    glRef.current = gl;

    const compileShader = (src, type) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, compileShader(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    progRef.current = prog;

    const verts = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e) => { mouseRef.current = { x: e.clientX, y: window.innerHeight - e.clientY }; };
    window.addEventListener("mousemove", onMouse);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uC1 = gl.getUniformLocation(prog, "uColor1");
    const uC2 = gl.getUniformLocation(prog, "uColor2");

    gl.uniform3f(uC1, 0.0, 0.0, 0.0);
    gl.uniform3f(uC2, 0.04, 0.02, 0.12);

    const render = () => {
      const t = (Date.now() - startRef.current) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, width: "100%", height: "100%",
        zIndex: 0, display: "block",
      }}
    />
  );
}
