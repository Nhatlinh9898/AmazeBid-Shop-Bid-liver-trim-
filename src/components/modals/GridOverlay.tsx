/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search } from 'lucide-react';
import { ProductContent, RarityType } from '../../types';

interface GridOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductContent[];
  onSelect: (index: number) => void;
  filterRarity: RarityType | 'All';
  setFilterRarity: (r: RarityType | 'All') => void;
  sortBy: 'price-asc' | 'price-desc' | 'rarity-desc' | 'none';
  setSortBy: (s: 'price-asc' | 'price-desc' | 'rarity-desc' | 'none') => void;
}

const GridOverlay = ({ 
  isOpen, 
  onClose, 
  products, 
  onSelect,
  filterRarity,
  setFilterRarity,
  sortBy,
  setSortBy
}: GridOverlayProps) => {
  const [search, setSearch] = useState('');

  const filtered = products
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(p => filterRarity === 'All' || p.rarity === filterRarity)
    .sort((a, b) => {
      const getPrice = (p: string) => parseFloat(p.replace(/[^0-9.]/g, '')) || 0;
      if (sortBy === 'price-asc') return getPrice(a.productDetails.price) - getPrice(b.productDetails.price);
      if (sortBy === 'price-desc') return getPrice(b.productDetails.price) - getPrice(a.productDetails.price);
      if (sortBy === 'rarity-desc') {
        const rarityOrder: Record<string, number> = { 'Thần Thoại': 6, 'Huyền Thoại': 5, 'Sử Thi': 4, 'Cực Hiếm': 3, 'Hiếm': 2, 'Thường': 1 };
        return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
      }
      return 0;
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-3xl overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto px-8 py-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Thư Viện Pháp Bảo</h2>
                <p className="text-white/40 text-sm mt-2">Khám phá hàng ngàn vật phẩm trong đa vũ trụ.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm pháp bảo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-white/40 transition-all"
                />
              </div>
              
              <div className="flex gap-4">
                <select 
                  value={filterRarity} 
                  onChange={(e) => setFilterRarity(e.target.value as any)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none appearance-none"
                >
                  <option value="All">Tất Cả Độ Hiếm</option>
                  <option value="Thường">Thường</option>
                  <option value="Hiếm">Hiếm</option>
                  <option value="Cực Hiếm">Cực Hiếm</option>
                  <option value="Sử Thi">Sử Thi</option>
                  <option value="Huyền Thoại">Huyền Thoại</option>
                  <option value="Thần Thoại">Thần Thoại</option>
                </select>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none appearance-none"
                >
                  <option value="none">Sắp Xếp</option>
                  <option value="price-asc">Giá: Thấp - Cao</option>
                  <option value="price-desc">Giá: Cao - Thấp</option>
                  <option value="rarity-desc">Độ Hiếm Giảm Dần</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filtered.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  onClick={() => {
                    const originalIndex = products.findIndex(p => p.id === product.id);
                    onSelect(originalIndex);
                    onClose();
                  }}
                  className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/5 hover:border-white/20 transition-all"
                >
                  <img 
                    src={product.fallbackImg} 
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest bg-white/10 text-white/60">
                        {product.type}
                      </span>
                      <span style={{ color: product.rarityColor }} className="text-[7px] font-black uppercase tracking-widest">
                        {product.rarity}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-sm leading-tight group-hover:text-cyan-400 transition-colors">{product.title}</h4>
                    <p className="text-white/40 text-[10px] mt-1">{product.productDetails.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GridOverlay;
