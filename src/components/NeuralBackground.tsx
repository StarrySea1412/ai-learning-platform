"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 全局粒子神经网络背景：
 * - 一层漂浮粒子（星尘）
 * - 距离近的粒子之间动态生成连线，形成「神经网络」效果
 * - 缓慢旋转 + 鼠标视差
 */

const PARTICLE_COUNT = 240;
const CONNECT_DIST = 2.2;

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities.push((Math.random() - 0.5) * 0.004);
    }
    return { positions, velocities };
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  // 连线：用动态更新的 LineSegments
  const lineRef = useRef<THREE.LineSegments>(null);
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 0.5), 3));
    return g;
  }, []);

  useFrame((state) => {
    if (!ref.current || !lineRef.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    // 缓慢漂移
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i];
      pos[i * 3 + 1] += velocities[(i + 7) % PARTICLE_COUNT] * 0.6;
      // wrap 边界
      if (pos[i * 3] > 9) pos[i * 3] = -9;
      if (pos[i * 3] < -9) pos[i * 3] = 9;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
      if (pos[i * 3 + 1] < -5) pos[i * 3 + 1] = 5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    // 重建连线
    const lineArr = lineRef.current.geometry.attributes.position.array as Float32Array;
    let ptr = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < CONNECT_DIST * CONNECT_DIST && ptr + 6 <= lineArr.length) {
          lineArr[ptr++] = pos[i * 3];
          lineArr[ptr++] = pos[i * 3 + 1];
          lineArr[ptr++] = pos[i * 3 + 2];
          lineArr[ptr++] = pos[j * 3];
          lineArr[ptr++] = pos[j * 3 + 1];
          lineArr[ptr++] = pos[j * 3 + 2];
        }
      }
    }
    for (let k = ptr; k < lineArr.length; k++) lineArr[k] = 0;
    lineRef.current.geometry.attributes.position.needsUpdate = true;
    lineRef.current.geometry.setDrawRange(0, ptr / 3);

    // 鼠标视差
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0004;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        state.pointer.y * 0.06,
        0.03
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        state.pointer.x * 0.04,
        0.03
      );
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={ref} geometry={geometry}>
        <pointsMaterial
          size={0.055}
          color="#0891b2"
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments ref={lineRef} geometry={lineGeo}>
        <lineBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function NeuralBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Particles />
    </Canvas>
  );
}
