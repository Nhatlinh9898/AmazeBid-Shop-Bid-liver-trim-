/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ElementType } from '../types';

interface ElementalEffectsProps {
  element: ElementType;
  color: string;
}

const ElementalEffects = ({ element, color }: ElementalEffectsProps) => {
  const particles = Array.from({ length: 20 });
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            y: [null, "-20%"],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0.5]
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute w-1 h-1 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        />
      ))}
      
      {element === 'lightning' && (
        <motion.div 
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 bg-white/5"
        />
      )}

      {element === 'neon' && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,171,252,0.1)_0%,transparent_70%)]" />
      )}
    </div>
  );
};

export default ElementalEffects;
