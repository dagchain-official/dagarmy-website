"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ShapeMorpherProps {
  width?: number;
  height?: number;
  particleColor?: string;
}

export const ShapeMorpher: React.FC<ShapeMorpherProps> = ({
  width = 500,
  height = 500,
  particleColor = "#6366f1",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer,
      controls: OrbitControls,
      particleSystem: THREE.Points,
      animationFrameId: number;

    const numParticles = 15000;
    const clock = new THREE.Clock();
    let targetPositions: Float32Array;
    let animationProgress = 1;
    const animationDuration = 1.5;
    let currentShapeIndex = 0;

    const params = {
      particleSize: 0.025,
      particleColor: new THREE.Color(particleColor),
      rotationSpeed: 0.08,
    };

    const shapes = ["sphere", "cube", "torus", "icosahedron"];

    function init() {
      // Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      scene.fog = new THREE.Fog(0x000000, 10, 50);

      // Camera
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 4;

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 3, 2);
      scene.add(directionalLight);

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.5;
      controls.minDistance = 2;
      controls.maxDistance = 8;
      controls.enableZoom = false;

      createParticleSystem();
      morphToShape(shapes[0]);

      // Auto-morph every 4 seconds
      setInterval(() => {
        currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
        morphToShape(shapes[currentShapeIndex]);
      }, 4000);

      animate();
    }

    function createParticleSystem() {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(numParticles * 3);
      const colors = new Float32Array(numParticles * 3);
      const sizes = new Float32Array(numParticles);

      targetPositions = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const phi = Math.acos(-1 + (2 * i) / numParticles);
        const theta = Math.sqrt(numParticles * Math.PI) * phi;
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);

        positions[i * 3] = x * 1.5;
        positions[i * 3 + 1] = y * 1.5;
        positions[i * 3 + 2] = z * 1.5;

        targetPositions[i * 3] = positions[i * 3];
        targetPositions[i * 3 + 1] = positions[i * 3 + 1];
        targetPositions[i * 3 + 2] = positions[i * 3 + 2];

        const color = params.particleColor.clone();
        color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.3);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = params.particleSize * (0.8 + Math.random() * 0.4);
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: params.particleSize,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      });

      particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);
    }

    function morphToShape(shapeType: string) {
      let targetGeometry: THREE.BufferGeometry;
      const targetVertices: THREE.Vector3[] = [];

      switch (shapeType) {
        case "sphere":
          targetGeometry = new THREE.SphereGeometry(1.5, 64, 64);
          break;
        case "cube":
          targetGeometry = new THREE.BoxGeometry(2.2, 2.2, 2.2, 20, 20, 20);
          break;
        case "torus":
          targetGeometry = new THREE.TorusGeometry(1.2, 0.4, 32, 100);
          break;
        case "icosahedron":
          targetGeometry = new THREE.IcosahedronGeometry(1.7, 3);
          break;
        default:
          return;
      }

      targetGeometry.computeVertexNormals();
      const targetPositionAttribute = targetGeometry.getAttribute("position");
      for (let i = 0; i < targetPositionAttribute.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(targetPositionAttribute, i);
        targetVertices.push(vertex);
      }

      for (let i = 0; i < numParticles; i++) {
        const vertexIndex = i % targetVertices.length;
        const targetVertex = targetVertices[vertexIndex];
        targetPositions[i * 3] = targetVertex.x;
        targetPositions[i * 3 + 1] = targetVertex.y;
        targetPositions[i * 3 + 2] = targetVertex.z;
      }

      animationProgress = 0;
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (particleSystem) {
        particleSystem.rotation.y += delta * params.rotationSpeed;

        if (animationProgress < 1) {
          animationProgress += delta / animationDuration;
          animationProgress = Math.min(animationProgress, 1);

          const positions = particleSystem.geometry.attributes.position
            .array as Float32Array;
          for (let i = 0; i < numParticles * 3; i++) {
            positions[i] +=
              (targetPositions[i] - positions[i]) * (delta / animationDuration);
          }
          particleSystem.geometry.attributes.position.needsUpdate = true;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    }

    init();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, [width, height, particleColor]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
};
