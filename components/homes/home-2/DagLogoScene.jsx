"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const BLOCK_DEFS = [
  { pos: [-1.1,  1.35, 0],    sz: [2.6, 0.48, 0.48], dx: -2.0, dy:  2.5, dz: -1.0, dr:  1.2 },
  { pos: [-1.1,  0.18, 0],    sz: [0.48, 0.85, 0.48], dx: -3.0, dy:  0.6, dz:  1.5, dr: -1.0 },
  { pos: [ 0.3,  0.18, 0],    sz: [1.25, 0.48, 0.48], dx:  2.2, dy:  1.0, dz:  0.8, dr:  0.8 },
  { pos: [ 1.2,  0.18, 0],    sz: [0.48, 1.75, 0.48], dx:  3.0, dy: -0.4, dz: -1.2, dr: -1.5 },
  { pos: [-1.1, -0.9,  0],    sz: [2.6, 0.48, 0.48],  dx: -1.5, dy: -2.8, dz:  0.8, dr:  1.1 },
  { pos: [-0.2,  0.7,  0.42], sz: [0.42, 0.42, 0.42], dx:  0.8, dy:  2.2, dz:  2.0, dr:  2.5 },
  { pos: [ 0.9, -0.25, 0.38], sz: [0.38, 0.55, 0.38], dx:  2.0, dy: -2.0, dz:  1.2, dr: -2.0 },
  { pos: [-0.65,-0.12, 0.38], sz: [0.55, 0.38, 0.38], dx: -1.5, dy: -1.2, dz:  2.0, dr:  2.2 },
  { pos: [ 0.1, -0.55, 0.32], sz: [0.48, 0.48, 0.32], dx:  1.2, dy: -2.5, dz:  1.5, dr: -2.8 },
];

export default function DagLogoScene({ progressRef }) {
  const groupRef  = useRef();
  const meshRefs  = useRef(BLOCK_DEFS.map(() => ({ current: null })));
  const timeRef   = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t        = timeRef.current;
    const progress = progressRef.current || 0;

    /* scatter: 0→0.5 spread out, 0.5→1.0 reassemble */
    const scatter = progress < 0.5
      ? progress * 2
      : 1 - (progress - 0.5) * 2;

    BLOCK_DEFS.forEach((def, i) => {
      const mesh = meshRefs.current[i]?.current;
      if (!mesh) return;

      /* idle breathing */
      mesh.rotation.x = Math.sin(t * 0.8 + i * 0.6) * 0.04;
      mesh.rotation.y = Math.cos(t * 0.6 + i * 0.4) * 0.05;

      /* scroll-driven scatter */
      mesh.position.x = def.pos[0] + def.dx * scatter;
      mesh.position.y = def.pos[1] + def.dy * scatter;
      mesh.position.z = def.pos[2] + def.dz * scatter;
      mesh.rotation.z = def.dr * scatter;

      /* emissive glow peaks at max scatter */
      if (mesh.material) {
        mesh.material.emissiveIntensity = 0.25 + Math.sin(scatter * Math.PI) * 0.72;
      }
    });

    /* gentle overall yaw */
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.55} color="#3a38b8" />
      <pointLight position={[-3, 4, 6]}  intensity={4.5} color="#7c67ff" />
      <pointLight position={[4, -3, 3]}  intensity={2}   color="#14104a" />
      <pointLight position={[0, 0, 8]}   intensity={1.5} color="#a78bfa" />

      {/* Blocks */}
      {BLOCK_DEFS.map((def, i) => (
        <mesh
          key={i}
          ref={el => { meshRefs.current[i] = { current: el }; }}
          position={def.pos}
        >
          <boxGeometry args={def.sz} />
          <meshPhysicalMaterial
            color="#1e1a6e"
            metalness={0.92}
            roughness={0.08}
            emissive="#3730a3"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
