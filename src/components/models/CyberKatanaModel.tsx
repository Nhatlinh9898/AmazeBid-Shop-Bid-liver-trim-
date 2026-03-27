/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const CyberKatanaModel = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group rotation={[0, 0, -Math.PI / 6]}>
      {/* Blade */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.05, 3.5, 0.01]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={1} />
      </mesh>
      {/* Neon Edge */}
      <mesh position={[0.03, 0, 0]}>
        <boxGeometry args={[0.01, 3.5, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
      </mesh>
      <Environment preset="city" />
    </group>
  );
};

export default CyberKatanaModel;
