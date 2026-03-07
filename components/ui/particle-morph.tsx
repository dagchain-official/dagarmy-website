"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleMorphProps {
  width?: number;
  height?: number;
  color?: string;
}

export const ParticleMorph: React.FC<ParticleMorphProps> = ({
  width = 500,
  height = 500,
  color = "#6366f1",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let animationFrameId: number;
    let morphProgress = 0;
    let isSphere = false;

    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Initialize particles in a logo-like formation (grid)
    const gridSize = Math.ceil(Math.sqrt(particleCount));
    const spacing = 200 / gridSize;

    for (let i = 0; i < particleCount; i++) {
      const x = (i % gridSize) * spacing - 100;
      const y = Math.floor(i / gridSize) * spacing - 100;
      const z = (Math.random() - 0.5) * 20;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      targetPositions[i * 3] = x;
      targetPositions[i * 3 + 1] = y;
      targetPositions[i * 3 + 2] = z;

      const colorObj = new THREE.Color(color);
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }

    const init = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
      camera.position.set(0, 0, 400);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Lighting
      const light1 = new THREE.PointLight(0xffffff, 1);
      light1.position.set(100, 100, 100);
      scene.add(light1);

      const light2 = new THREE.PointLight(0xffffff, 0.5);
      light2.position.set(-100, -100, -100);
      scene.add(light2);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      animate();
    };

    const morphToSphere = () => {
      const radius = 100;
      for (let i = 0; i < particleCount; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);

        targetPositions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
        targetPositions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
        targetPositions[i * 3 + 2] = radius * Math.cos(theta);
      }
      isSphere = true;
      morphProgress = 0;
    };

    const morphToGrid = () => {
      const gridSize = Math.ceil(Math.sqrt(particleCount));
      const spacing = 200 / gridSize;

      for (let i = 0; i < particleCount; i++) {
        const x = (i % gridSize) * spacing - 100;
        const y = Math.floor(i / gridSize) * spacing - 100;
        const z = (Math.random() - 0.5) * 20;

        targetPositions[i * 3] = x;
        targetPositions[i * 3 + 1] = y;
        targetPositions[i * 3 + 2] = z;
      }
      isSphere = false;
      morphProgress = 0;
    };

    // Auto-morph every 4 seconds
    const morphInterval = setInterval(() => {
      if (isSphere) {
        morphToGrid();
      } else {
        morphToSphere();
      }
    }, 4000);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth morphing
      if (morphProgress < 1) {
        morphProgress += 0.02;
        const positionAttribute = particles.geometry.attributes.position;

        for (let i = 0; i < particleCount; i++) {
          const currentX = positionAttribute.getX(i);
          const currentY = positionAttribute.getY(i);
          const currentZ = positionAttribute.getZ(i);

          const targetX = targetPositions[i * 3];
          const targetY = targetPositions[i * 3 + 1];
          const targetZ = targetPositions[i * 3 + 2];

          positionAttribute.setX(i, currentX + (targetX - currentX) * 0.05);
          positionAttribute.setY(i, currentY + (targetY - currentY) * 0.05);
          positionAttribute.setZ(i, currentZ + (targetZ - currentZ) * 0.05);
        }

        positionAttribute.needsUpdate = true;
      }

      // Rotate particles
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;

      renderer.render(scene, camera);
    };

    init();
    // Start with sphere
    setTimeout(() => morphToSphere(), 1000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(morphInterval);
      if (renderer) {
        renderer.dispose();
        container.removeChild(renderer.domElement);
      }
    };
  }, [width, height, color]);

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
