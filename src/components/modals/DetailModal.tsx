/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ShoppingBag } from 'lucide-react';
import { ProductContent } from '../../types';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ProductContent;
  onBuy: (p: ProductContent) => void;
  isOwned: boolean;
}

const DetailModal = ({ isOpen, onClose, content, onBuy, isOwned }: DetailModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
          >
            {/* Modal Header/Image */}
            <div className="w-full lg:w-1/3 relative aspect-video lg:aspect-auto shrink-0">
              <img src={content.fallbackImg} className="w-full h-full object-cover" alt={content.title} referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-white">{content.title}</h3>
                <div className="flex items-center gap-4">
                  <span 
                    className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                    style={{ borderColor: content.rarityColor, color: content.rarityColor, backgroundColor: `${content.rarityColor}10` }}
                  >
                    {content.rarity}
                  </span>
                  <p className="text-cyan-400 font-black text-xs tracking-widest uppercase mt-1">{content.element} Element</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
              <div className="space-y-8 pb-12">
                <section>
                  <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Truyền Thuyết</h4>
                  <p className="text-slate-300 leading-relaxed italic">"{content.lore}"</p>
                </section>

                <section>
                  <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Thử Nghiệm Mô Hình 3D</h4>
                  <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-white/60 mb-2 italic">Dán link file .glb hoặc .vrm vào đây để xem thử:</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="https://example.com/model.glb"
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
                        onChange={(e) => {
                          const url = e.target.value;
                          if (url.startsWith('http')) {
                            content.modelUrl = url;
                          }
                        }}
                      />
                      <button className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase">Áp dụng</button>
                    </div>
                    <p className="text-[9px] text-white/30 mt-2">Gợi ý: Thử link này: https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb</p>
                  </div>
                </section>

                <section>
                  <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Kỹ Năng Kích Hoạt</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {content.abilities.map((ability, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-white/20 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-white font-bold text-sm tracking-wide">{ability.name}</h5>
                          <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">{ability.cooldown}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{ability.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500" style={{ width: `${(ability.manaCost / 200) * 100}%` }} />
                          </div>
                          <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">{ability.manaCost} MP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Đánh Giá Từ KOL</h4>
                  <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <img 
                      src={content.kolInfo.avatar} 
                      className="w-20 h-20 rounded-2xl border-2 object-cover shadow-2xl" 
                      style={{ borderColor: `${content.themeColor}80` }}
                      alt={content.kolInfo.name}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h5 className="text-white font-bold text-lg">{content.kolInfo.name}</h5>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Uy Tín:</span>
                          <span className="text-sm font-black" style={{ color: content.themeColor }}>{content.kolInfo.reputation}%</span>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm italic leading-relaxed mb-4">"{content.kolInfo.bio}"</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {content.kolInfo.specialty.map(s => (
                          <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-white/60 uppercase font-black">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Nguyên Liệu Rèn Đúc</h4>
                  <div className="flex flex-wrap gap-3">
                    {content.materials.map((m, i) => (
                      <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Thuộc Tính Ẩn</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {content.hiddenStats.map((s, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-white text-xl font-black">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Giá Niêm Yết</p>
                    <p className="text-3xl font-black text-white">{content.productDetails.price}</p>
                  </div>
                  <button 
                    disabled={isOwned}
                    onClick={() => onBuy(content)}
                    className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                      isOwned 
                        ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20' 
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {isOwned ? (
                      <>
                        <CheckCircle2 size={16} />
                        Đã Sở Hữu
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        Mua Ngay
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors">
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
