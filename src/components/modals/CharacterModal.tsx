/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { ProductContent } from '../../types';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  equippedItems: ProductContent[];
}

const CharacterModal = ({ isOpen, onClose, equippedItems }: CharacterModalProps) => {
  const totalAttack = equippedItems.reduce((acc, p) => acc + (Number(p.productDetails.stats.find(s => s.label === "Công Kích")?.value) || 0), 0);
  const totalSpirit = equippedItems.reduce((acc, p) => acc + (Number(p.hiddenStats.find(s => s.label === "Linh Lực")?.value) || 0), 0);
  const totalSpeed = equippedItems.reduce((acc, p) => acc + (Number(p.productDetails.stats.find(s => s.label === "Tốc Độ")?.value) || 0), 0);

  const statsData = [
    { name: 'Công Kích', value: totalAttack, color: '#ef4444' },
    { name: 'Linh Lực', value: totalSpirit, color: '#3b82f6' },
    { name: 'Tốc Độ', value: totalSpeed, color: '#10b981' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-[48px] p-12 shadow-2xl flex flex-col md:flex-row gap-12 overflow-y-auto"
          >
            <div className="flex-1">
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Tu Tiên Giả</h3>
              <p className="text-white/40 text-sm mb-8">Trạng thái sức mạnh hiện tại của bạn.</p>
              
              <div className="space-y-8">
                {statsData.map(stat => (
                  <div key={stat.name}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.name}</span>
                      <span className="text-2xl font-black text-white">{stat.value}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(stat.value / 3, 100)}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Pháp Bảo Đang Trang Bị ({equippedItems.length}/3)</p>
                <div className="flex gap-4">
                  {equippedItems.map(item => (
                    <div key={item.id} className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                      <img src={item.fallbackImg} className="w-full h-full object-cover" alt={item.title} referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  {Array.from({ length: 3 - equippedItems.length }).map((_, i) => (
                    <div key={i} className="w-16 h-16 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center text-white/10">
                      <Plus size={20} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 relative aspect-square rounded-[40px] overflow-hidden bg-black/40 border border-white/10">
              <img 
                src="https://picsum.photos/seed/cultivator/800/800" 
                className="w-full h-full object-cover opacity-80"
                alt="Cultivator"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-1">Cảnh Giới</p>
                <p className="text-white text-2xl font-black uppercase">Trúc Cơ Kỳ</p>
              </div>
            </div>

            <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CharacterModal;
