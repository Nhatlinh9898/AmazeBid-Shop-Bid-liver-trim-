/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const LuxuryWatchModel = ({ color }: { color: string }) => {
  const handRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (handRef.current) {
      handRef.current.rotation.z -= 0.05;
    }
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Watch Face */}
      <mesh>
        <cylinderGeometry args={[1, 1, 0.1, 64]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.2} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.02, 64]} />
        <meshStandardMaterial color="white" transparent opacity={0.3} metalness={1} />
      </mesh>
      {/* Hand */}
      <mesh ref={handRef} position={[0, 0.07, 0]}>
        <boxGeometry args={[0.02, 0.8, 0.01]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <Environment preset="apartment" />
    </group>
  );
};

export default LuxuryWatchModel;
