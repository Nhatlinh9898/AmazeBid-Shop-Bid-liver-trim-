/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LayoutGrid, Plus, BarChart3, ShoppingBag, Zap, X, Menu, ChevronUp, ChevronDown, Home, User, Users } from 'lucide-react';
import CategorySelector from './CategorySelector';
import { ProductType } from '../types';

interface NavigationDockProps {
  categories: { id: ProductType | 'all'; label: string }[];
  activeCategory: string;
  setActiveCategory: (id: ProductType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showGrid: boolean;
  setShowGrid: (s: boolean) => void;
  setShowCreateModal: (s: boolean) => void;
  setShowStatsModal: (s: boolean) => void;
  setShowCollectionModal: (s: boolean) => void;
  setShowCharacterModal: (s: boolean) => void;
  setShowKOLModal: (s: boolean) => void;
  collectionCount: number;
  connectWallet: () => void;
  walletAddress: string | null;
  walletError: string | null;
  setWalletError: (e: string | null) => void;
}

const NavigationDock = ({
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  showGrid,
  setShowGrid,
  setShowCreateModal,
  setShowStatsModal,
  setShowCollectionModal,
  setShowCharacterModal,
  setShowKOLModal,
  collectionCount,
  connectWallet,
  walletAddress,
  walletError,
  setWalletError
}: NavigationDockProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const handleHome = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setShowGrid(false);
  };

  return (
    <div className="fixed bottom-10 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none">
      <AnimatePresence>
        {isMenuVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex flex-col items-center gap-4 mb-4 pointer-events-auto"
          >
            {/* Categories Bar */}
            <div className="relative">
              <CategorySelector 
                categories={categories} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
              />
            </div>

            {/* Main Action Dock */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-[32px] bg-slate-950/60 backdrop-blur-3xl border border-white/10 shadow-2xl">
              {/* Home Button */}
              <button 
                onClick={handleHome}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all"
                title="Trang chủ"
              >
                <Home size={18} />
              </button>

              <div className="w-px h-6 bg-white/10 mx-1" />

              {/* Search */}
              <div className="relative hidden md:block">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-2 text-[10px] text-white focus:outline-none focus:border-white/40 transition-all w-[150px] lg:w-[200px] h-10"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={12} />
              </div>

              {/* Grid Toggle */}
              <button 
                onClick={() => setShowGrid(!showGrid)}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  showGrid ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                }`}
                title="Thư viện"
              >
                {showGrid ? <X size={18} /> : <LayoutGrid size={18} />}
              </button>

              {/* Create Button */}
              <button 
                onClick={() => setShowCreateModal(true)}
                className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all shadow-lg"
                title="Thêm mới"
              >
                <Plus size={24} />
              </button>

              <div className="w-px h-6 bg-white/10 mx-1" />

              {/* Stats Button */}
              <button 
                onClick={() => setShowStatsModal(true)}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all"
                title="Thống kê"
              >
                <BarChart3 size={18} />
              </button>

              {/* Collection Button */}
              <button 
                onClick={() => setShowCollectionModal(true)}
                className="relative w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all"
                title="Bộ sưu tập"
              >
                <ShoppingBag size={18} />
                {collectionCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[8px] font-black flex items-center justify-center text-black">
                    {collectionCount}
                  </span>
                )}
              </button>

              {/* Character Button */}
              <button 
                onClick={() => setShowCharacterModal(true)}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all"
                title="Nhân vật"
              >
                <User size={18} />
              </button>

              {/* KOL Creator Button */}
              <button 
                onClick={() => setShowKOLModal(true)}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all"
                title="Tạo KOL"
              >
                <Users size={18} />
              </button>

              <div className="w-px h-6 bg-white/10 mx-1" />

              {/* Wallet Connect */}
              <button 
                onClick={connectWallet}
                className={`h-10 px-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg border ${
                  walletAddress 
                    ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20' 
                    : 'bg-white/5 text-white/60 border-white/5 hover:text-white'
                }`}
              >
                <Zap size={14} className={walletAddress ? 'fill-emerald-500' : ''} />
                <span className="hidden lg:inline">{walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Kết Nối Ví'}</span>
                <span className="lg:hidden">{walletAddress ? 'Ví' : 'Ví'}</span>
              </button>

              {walletError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-20 right-0 bg-red-500/90 backdrop-blur-md text-white text-[9px] font-bold px-4 py-2 rounded-xl border border-red-500/20 shadow-2xl flex items-center gap-2 z-[110]"
                >
                  <X size={12} className="cursor-pointer" onClick={() => setWalletError(null)} />
                  {walletError}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div className="pointer-events-auto">
        <button
          onClick={() => setIsMenuVisible(!isMenuVisible)}
          className="w-14 h-8 rounded-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all shadow-2xl"
        >
          {isMenuVisible ? <ChevronDown size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </div>
  );
};

export default NavigationDock;
