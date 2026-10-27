"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/src/lib/store';
import * as THREE from 'three';
import { MeshDistortMaterial } from '@react-three/drei';

export function HoodieModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const activeColorHex = useStore((state) => state.activeColorHex);

  // Slowly rotate the placeholder model
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      {/* 
        This is a placeholder for the actual loaded .glb hoodie model.
        In a real scenario you would use:
        const { nodes, materials } = useGLTF('/models/hoodie_draco.glb');
      */}
      <mesh ref={meshRef} scale={2.5}>
        <torusKnotGeometry args={[1, 0.3, 128, 64]} />
        <MeshDistortMaterial 
          color={activeColorHex} 
          distort={0.2}
          speed={1.5}
          roughness={0.8} 
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.25}
        />
      </mesh>
    </group>
  );
}
