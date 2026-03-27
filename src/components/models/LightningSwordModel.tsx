/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const LightningSwordModel = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* Blade */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.1, 3, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      {/* Glow */}
      <mesh scale={[1.2, 1.1, 1.2]}>
        <boxGeometry args={[0.1, 3, 0.02]} />
        <MeshWobbleMaterial color={color} factor={0.5} speed={2} transparent opacity={0.3} />
      </mesh>
      <Sparkles count={50} scale={3} size={2} speed={0.5} color={color} />
    </group>
  );
};

export default LightningSwordModel;
