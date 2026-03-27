/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, Stage, Float, Environment } from '@react-three/drei';
import { Box } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import ExternalModel from './models/ExternalModel';
import LightningSwordModel from './models/LightningSwordModel';
import CyberKatanaModel from './models/CyberKatanaModel';
import LuxuryWatchModel from './models/LuxuryWatchModel';
import { ProductType } from '../types';

interface Product3DViewerProps {
  type: ProductType;
  color: string;
  modelUrl?: string;
}

const Product3DViewer = ({ type, color, modelUrl }: Product3DViewerProps) => {
  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden relative group">
      <ErrorBoundary>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <PresentationControls
            global
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Stage environment="city" intensity={0.6}>
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Suspense fallback={<mesh><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color="white" wireframe /></mesh>}>
                  {modelUrl ? (
                    <ExternalModel url={modelUrl} />
                  ) : (
                    <>
                      {type === 'xianxia' && <LightningSwordModel color={color} />}
                      {type === 'tech' && <CyberKatanaModel color={color} />}
                      {type === 'luxury' && <LuxuryWatchModel color={color} />}
                    </>
                  )}
                </Suspense>
              </Float>
            </Stage>
          </PresentationControls>
          
          <Environment preset="night" />
        </Canvas>
      </ErrorBoundary>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-tighter text-white/60">Tương tác 3D: Xoay, Phóng to</p>
      </div>
    </div>
  );
};

export default Product3DViewer;
