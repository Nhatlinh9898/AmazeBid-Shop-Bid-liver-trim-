/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';

const ExternalModel = ({ url }: { url: string }) => {
  const isVrm = url.toLowerCase().endsWith('.vrm');
  
  const { scene } = useGLTF(url, undefined, undefined, (loader: any) => {
    if (isVrm) {
      loader.register((parser: any) => new VRMLoaderPlugin(parser));
    }
  });

  useEffect(() => {
    if (isVrm && scene) {
      scene.rotation.y = Math.PI;
    }
  }, [isVrm, scene]);

  return <primitive object={scene} scale={1.5} />;
};

export default ExternalModel;
