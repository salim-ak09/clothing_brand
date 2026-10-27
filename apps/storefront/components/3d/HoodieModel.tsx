"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/src/lib/store';
import * as THREE from 'three';
import { useGLTF, MeshDistortMaterial } from '@react-three/drei';

function RealModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return <primitive ref={meshRef} object={scene} scale={3} />;
}

export function HoodieModel({ url }: { url?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const activeColorHex = useStore((state) => state.activeColorHex);

  useFrame((state, delta) => {
    if (!url && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  if (url && (url.endsWith('.glb') || url.endsWith('.gltf'))) {
    return <RealModel url={url} />;
  }

  return (
    <group>
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
