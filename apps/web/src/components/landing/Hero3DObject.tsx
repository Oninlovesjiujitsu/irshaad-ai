"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function AnimatedCore() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const outerMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate the inner object continuously
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;

      // Floating effect
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }

    if (outerMeshRef.current) {
      // Rotate the outer wireframe in the opposite direction
      outerMeshRef.current.rotation.x -= delta * 0.1;
      outerMeshRef.current.rotation.y -= delta * 0.15;
      outerMeshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }

    // Interactive pointer tracking and scaling
    if (groupRef.current) {
      // Tilt the entire group based on mouse/touch pointer
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.1);

      // Smooth scale on hover
      const targetScale = hovered ? 1.15 : 1.0;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Inner solid core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#14532d" // dark forest green
          emissive="#22c55e" // bright green glow
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Outer wireframe shell */}
      <mesh ref={outerMeshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#a3ff00" // primary accent green
          wireframe={true}
          emissive="#a3ff00"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

export default function Hero3DObject() {
  return (
    <div className="w-full h-full relative">
      {/* Subtle glow behind the 3D object to blend with the UI */}
      <div className="absolute inset-0 bg-primary/20 blur-[60px] z-0 rounded-full scale-75" />

      <div className="relative z-10 w-full h-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#a3ff00" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
          <AnimatedCore />
        </Canvas>
      </div>
    </div>
  );
}
