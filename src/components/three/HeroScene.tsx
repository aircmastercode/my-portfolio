"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

type Colors = { accent: string; accent2: string };

function CoreObject({ colors }: { colors: Colors }) {
  const group = useRef<THREE.Group>(null);
  const { pointer, viewport } = useThree();
  const wide = viewport.width > 4.2;
  const baseX = wide ? 1.55 : 0;
  const baseY = wide ? 0.45 : 0.2;

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.14;
    group.current.rotation.x += delta * 0.05;
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, baseX + pointer.x * 0.3, 0.04);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY + pointer.y * 0.25, 0.04);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.0}>
      <group ref={group} position={[baseX, baseY, 0]}>
        <mesh scale={3.2} position={[0, 0, -0.5]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={colors.accent} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh scale={1.85}>
          <icosahedronGeometry args={[1, 12]} />
          <MeshDistortMaterial
            color={colors.accent}
            emissive={colors.accent}
            emissiveIntensity={1.0}
            roughness={0.14}
            metalness={0.6}
            distort={0.42}
            speed={1.6}
          />
        </mesh>
        <mesh scale={2.7}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color={colors.accent2} wireframe transparent opacity={0.16} />
        </mesh>
      </group>
    </Float>
  );
}

function Dust() {
  const points = useMemo(() => {
    const n = 900;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#8b8d94" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function readAccents(): Colors {
  if (typeof window === "undefined") return { accent: "#3b82f6", accent2: "#38bdf8" };
  const s = getComputedStyle(document.documentElement);
  return {
    accent: s.getPropertyValue("--accent").trim() || "#3b82f6",
    accent2: s.getPropertyValue("--accent-2").trim() || "#38bdf8",
  };
}

export default function HeroScene() {
  const [dpr, setDpr] = useState(1);
  const [colors, setColors] = useState<Colors>({ accent: "#3b82f6", accent2: "#38bdf8" });

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio, 2));
    setColors(readAccents());
    const onAccent = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d?.accent) setColors({ accent: d.accent, accent2: d.accent2 || d.accent });
    };
    window.addEventListener("theme:accent", onAccent);
    return () => window.removeEventListener("theme:accent", onAccent);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#0b0a09", 9, 18]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[5, 5, 5]} intensity={3} color={colors.accent2} />
      <pointLight position={[-5, -3, 2]} intensity={2.2} color={colors.accent} />
      <pointLight position={[0, 2, 4]} intensity={1.3} color="#ffffff" />
      <CoreObject colors={colors} />
      <Dust />
      <Sparkles count={60} scale={9} size={2} speed={0.3} color={colors.accent} opacity={0.5} />
      <Environment preset="city" />
    </Canvas>
  );
}
