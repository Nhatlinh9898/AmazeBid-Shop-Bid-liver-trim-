/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { ProductContent } from '../../types';

interface MyCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: ProductContent[];
}

const MyCollectionModal = ({ isOpen, onClose, collection }: MyCollectionModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl h-[80vh] bg-slate-900 border border-white/10 rounded-[48px] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-10 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-white">Bộ Sưu Tập Của Tôi</h3>
                <p className="text-white/40 text-sm mt-1">Bạn đang sở hữu {collection.length} vật phẩm quý giá</p>
              </div>
              <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10">
              {collection.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={64} className="mb-4" />
                  <p className="text-xl font-bold">Chưa có vật phẩm nào</p>
                  <p className="text-sm mt-2">Hãy khám phá thị trường và sở hữu những vật phẩm đầu tiên!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {collection.map((item) => (
                    <div key={item.id} className="group">
                      <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-black/40 mb-3">
                        <img src={item.fallbackImg} className="w-full h-full object-cover" alt={item.title} referrerPolicy="no-referrer" />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border" style={{ borderColor: item.rarityColor, color: item.rarityColor, backgroundColor: `${item.rarityColor}20` }}>
                            {item.rarity}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-white font-bold text-sm truncate">{item.title}</h4>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{item.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MyCollectionModal;
