/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, LayoutGrid, Plus, BarChart3, ShoppingBag, Zap, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

// Types & Constants
import { ProductContent, ProductType, RarityType, KOLInfo } from './types';
import { generateProducts, KOLS } from './constants';
import { aiService } from './services/aiService';
import { integrationService, EcommerceEvent } from './services/integrationService';

// Components
import NavigationDock from './components/NavigationDock';
import XianxiaDisplay from './components/XianxiaDisplay';

// Modals
import CreateProductModal from './components/modals/CreateProductModal';
import StatsModal from './components/modals/StatsModal';
import MyCollectionModal from './components/modals/MyCollectionModal';
import CharacterModal from './components/modals/CharacterModal';
import CreateKOLModal from './components/modals/CreateKOLModal';
import GridOverlay from './components/modals/GridOverlay';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function App() {
  const [products, setProducts] = useState<ProductContent[]>([]);
  const [collection, setCollection] = useState<ProductContent[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<ProductType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGrid, setShowGrid] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showKOLModal, setShowKOLModal] = useState(false);
  const [customKOLs, setCustomKOLs] = useState<KOLInfo[]>([]);
  const [equippedItems, setEquippedItems] = useState<ProductContent[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [isWidgetOpen, setIsWidgetOpen] = useState(true); // Default to open for demo, but can be closed

  // Notify parent window of widget state
  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'WIDGET_STATE', isOpen: isWidgetOpen }, '*');
    }
  }, [isWidgetOpen]);

  // E-commerce Integration Listener
  useEffect(() => {
    integrationService.setupExternalListener((action: EcommerceEvent, payload: any) => {
      setSyncStatus('syncing');
      
      // Find the KOL to reward
      const currentAllKOLs = [...KOLS, ...customKOLs];
      const targetKOLId = payload.kolId || (currentAllKOLs.length > 0 ? currentAllKOLs[0].id : null);
      
      if (targetKOLId) {
        const rewards = integrationService.processEcommerceEvent(action, payload.amount);
        
        setCustomKOLs(prev => prev.map(kol => {
          if (kol.id === targetKOLId) {
            return applyRewards(kol, rewards);
          }
          return kol;
        }));
        
        // Notification for the user
        console.log(`E-commerce Action: ${action} - Rewards:`, rewards);
      }
      
      setTimeout(() => setSyncStatus('synced'), 1000);
      setTimeout(() => setSyncStatus('idle'), 3000);
    });
  }, [customKOLs]);

  const applyRewards = (kol: KOLInfo, rewards: { xp: number, spirit: number, chips: number, tokens: number }): KOLInfo => {
    let newExp = (kol.experience || 0) + rewards.xp;
    let newLevel = kol.level || 1;
    const xpReq = 1000 * Math.pow(1.2, newLevel - 1);
    
    if (newExp >= xpReq) {
      newLevel += 1;
      newExp -= xpReq;
    }

    return {
      ...kol,
      level: newLevel,
      experience: newExp,
      resources: {
        spiritEssence: kol.resources.spiritEssence + rewards.spirit,
        cyberChips: kol.resources.cyberChips + rewards.chips,
        fameTokens: kol.resources.fameTokens + rewards.tokens
      }
    };
  };
  
  // Filtering & Sorting State
  const [filterRarity, setFilterRarity] = useState<RarityType | 'All'>('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rarity-desc' | 'none'>('none');

  const containerRef = useRef<HTMLDivElement>(null);

  const connectWallet = async () => {
    setWalletError(null);
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err: any) {
        console.error("Failed to connect to MetaMask:", err);
        setWalletError("Failed to connect to MetaMask. Please try again.");
      }
    } else {
      setWalletError("MetaMask is not installed. Please install it to continue.");
    }
  };

  useEffect(() => {
    setProducts(generateProducts(1000));
  }, []);

  const filteredData = products.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddProduct = (newProduct: ProductContent) => {
    setProducts([newProduct, ...products]);
    setActiveIndex(0);
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuy = (product: ProductContent) => {
    if (!walletAddress) {
      setWalletError("Vui lòng kết nối ví MetaMask để thực hiện giao dịch.");
      return;
    }
    
    if (!collection.find(p => p.id === product.id)) {
      setCollection([product, ...collection]);
      
      // Passive XP gain and Resource gain for the KOL who promoted the product
      handleCultivate(product.kolInfo.id, true);
    }
  };

  const handleCultivate = (kolId: string, isPassive: boolean = false) => {
    const mythicalCount = allKOLs.filter(k => k.role === 'Mythical').length;
    const celestialUnlocked = mythicalCount >= 100;

    const updateKOL = (kol: KOLInfo): KOLInfo => {
      // Resource costs for manual cultivation
      if (!isPassive) {
        if (kol.resources.spiritEssence < 10) {
          alert("Không đủ Linh Khí (Spirit Essence) để tu luyện!");
          return kol;
        }
      }

      const xpGain = Math.floor(Math.random() * 150) + 50;
      const rpGain = Math.floor(Math.random() * 30) + 10;
      
      // Resource gain from activities
      const essenceGain = isPassive ? 50 : -10;
      const chipsGain = isPassive ? 20 : 5;
      const tokensGain = isPassive ? 10 : 2;

      let newExp = (kol.experience || 0) + xpGain;
      let newLevel = kol.level || 1;
      let newRankPoints = (kol.rankPoints || 0) + rpGain;
      let newRole = kol.role;
      
      const newResources = {
        spiritEssence: Math.max(0, kol.resources.spiritEssence + essenceGain),
        cyberChips: Math.max(0, kol.resources.cyberChips + chipsGain),
        fameTokens: Math.max(0, kol.resources.fameTokens + tokensGain)
      };

      // Scaling XP requirement
      const xpReq = 1000 * Math.pow(1.2, newLevel - 1);
      if (newExp >= xpReq) {
        newLevel += 1;
        newExp -= xpReq;
      }

      // Update Evolution Tasks
      const newTasks = kol.evolutionTasks.map(task => {
        if (task.isCompleted) return task;
        if (task.type === 'level' && newLevel >= task.target) return { ...task, isCompleted: true };
        if (task.type === 'reputation' && kol.reputation >= task.target) return { ...task, isCompleted: true };
        if (task.type === 'items' && collection.filter(p => p.kolInfo.id === kol.id).length >= task.target) return { ...task, isCompleted: true };
        return task;
      });

      // Rank up logic
      const roles: KOLInfo['role'][] = [
        'Influencer', 'Expert', 'Reviewer', 'Ambassador', 'Legend', 'Mythical', 
        'Celestial', 'Godlike', 'Eternal', 'Universal'
      ];
      
      const rpReq = 1000 * Math.pow(1.5, roles.indexOf(newRole));
      const resourceReq = 500 * Math.pow(2, roles.indexOf(newRole));

      if (newRankPoints >= rpReq) {
        const currentIndex = roles.indexOf(newRole);
        let canRankUp = true;
        
        // Check tasks
        const allTasksDone = newTasks.every(t => t.isCompleted);
        if (!allTasksDone) canRankUp = false;

        // Check resources for ranking up
        if (newResources.fameTokens < resourceReq) canRankUp = false;

        // Lock progression at Mythical if not enough Mythicals in the world
        if (newRole === 'Mythical' && !celestialUnlocked) {
          canRankUp = false;
        }

        if (canRankUp && currentIndex < roles.length - 1) {
          newRole = roles[currentIndex + 1];
          newRankPoints -= rpReq;
          newResources.fameTokens -= resourceReq;
          
          // Add new tasks for next rank
          newTasks.push({
            description: `Đạt cấp độ ${newLevel + 10}`,
            isCompleted: false,
            type: 'level',
            target: newLevel + 10
          });
        }
      }

      return {
        ...kol,
        level: newLevel,
        experience: newExp,
        rankPoints: newRankPoints,
        role: newRole,
        resources: newResources,
        evolutionTasks: newTasks,
        reputation: Math.min(100, (kol.reputation || 0) + (isPassive ? 5 : 1))
      };
    };

    // Update customKOLs
    setCustomKOLs(prev => prev.map(k => k.id === kolId ? updateKOL(k) : k));
    
    // Update products list to reflect KOL changes in UI
    setProducts(prev => prev.map(p => {
      if (p.kolInfo.id === kolId) {
        return { ...p, kolInfo: updateKOL(p.kolInfo) };
      }
      return p;
    }));

    // Update collection to reflect KOL changes
    setCollection(prev => prev.map(p => {
      if (p.kolInfo.id === kolId) {
        return { ...p, kolInfo: updateKOL(p.kolInfo) };
      }
      return p;
    }));
  };

  const handleAddKOL = (newKOL: KOLInfo) => {
    const mythicalCountBefore = allKOLs.filter(k => k.role === 'Mythical').length;
    setCustomKOLs([newKOL, ...customKOLs]);
    
    const mythicalCountAfter = [...allKOLs, newKOL].filter(k => k.role === 'Mythical').length;
    if (mythicalCountBefore < 100 && mythicalCountAfter >= 100) {
      alert("THẾ GIỚI ĐÃ THĂNG HOA! Tầng thứ Celestial đã được mở khóa cho toàn bộ KOL!");
    }
  };

  const allKOLs = [...KOLS, ...customKOLs];

  const generateAIContent = async (name: string, category: string) => {
    if (!name) return;
    setIsGeneratingAI(true);
    try {
      const data = await aiService.generateProductContent(name, category);
      console.log("AI Response:", data);
      return data;
    } catch (error) {
      console.error("AI Generation failed:", error);
      return null;
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateKOLAvatar = async (prompt: string, options?: { aspectRatio?: string; referenceImage?: string }) => {
    return aiService.generateImage(prompt, options?.aspectRatio as any, options?.referenceImage);
  };

  const generateKOLVideo = async (prompt: string, referenceImage?: string) => {
    return aiService.generateVideo(prompt, referenceImage);
  };

  const generateKOLVoice = async (text: string, style?: string) => {
    return aiService.generateVoice(text, style);
  };

  const scrollToProduct = (index: number) => {
    const elements = containerRef.current?.querySelectorAll('.snap-start');
    if (elements && elements[index]) {
      elements[index].scrollIntoView({ behavior: 'smooth' });
      setShowGrid(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = containerRef.current?.querySelectorAll('.snap-start');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredData]);

  const categories: { id: ProductType | 'all'; label: string }[] = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'xianxia', label: 'Tiên Hiệp' },
    { id: 'tech', label: 'Công Nghệ' },
    { id: 'luxury', label: 'Xa Xỉ' },
    { id: 'fashion', label: 'Thời Trang' },
    { id: 'automotive', label: 'Ô Tô' },
    { id: 'home', label: 'Nội Thất' },
    { id: 'electronics', label: 'Điện Tử' },
    { id: 'sports', label: 'Thể Thao' },
    { id: 'beauty', label: 'Làm Đẹp' },
    { id: 'food', label: 'Ẩm Thực' },
  ];

  return (
    <>
      {/* Vertical Side Tab Toggle */}
      <motion.button
        initial={{ x: 100 }}
        animate={{ x: isWidgetOpen ? 450 : 0 }} // Slide with the panel if open, or stay at edge
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={() => setIsWidgetOpen(!isWidgetOpen)}
        className="fixed top-1/2 -translate-y-1/2 right-0 z-[2000] flex items-center group"
      >
        <div className="bg-cyan-500 hover:bg-cyan-400 transition-colors px-2 py-6 rounded-l-2xl shadow-[-10px_0_20px_rgba(34,211,238,0.3)] flex flex-col items-center gap-4 border-y border-l border-white/20">
          <div className="relative">
            {isWidgetOpen ? <X className="w-5 h-5 text-black" /> : <Users className="w-5 h-5 text-black" />}
            {!isWidgetOpen && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-cyan-500" 
              />
            )}
          </div>
          <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.3em] text-black whitespace-nowrap">
            {isWidgetOpen ? 'Đóng Hệ Thống' : 'Hệ Thống KOL'}
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 sm:left-auto sm:w-[450px] bg-black text-white font-sans overflow-hidden z-[1500] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-white/10"
          >
            {/* Sync Status Indicator */}
      {syncStatus !== 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-10 z-[1000] flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <div className={`w-2 h-2 rounded-full ${syncStatus === 'syncing' ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
            {syncStatus === 'syncing' ? 'Đang đồng bộ E-commerce...' : 'Đã đồng bộ thành công'}
          </span>
        </motion.div>
      )}

      {/* Complete Navigation Menu */}
      <NavigationDock
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        setShowCreateModal={setShowCreateModal}
        setShowStatsModal={setShowStatsModal}
        setShowCollectionModal={setShowCollectionModal}
        setShowCharacterModal={setShowCharacterModal}
        setShowKOLModal={setShowKOLModal}
        collectionCount={collection.length}
        worldMythicalCount={allKOLs.filter(k => k.role === 'Mythical').length}
        connectWallet={connectWallet}
        walletAddress={walletAddress}
        walletError={walletError}
        setWalletError={setWalletError}
      />

      {/* Modals */}
      <CreateKOLModal 
        isOpen={showKOLModal}
        onClose={() => setShowKOLModal(false)}
        onAdd={handleAddKOL}
        existingKOLs={allKOLs}
        totalKOLCount={allKOLs.length}
      />
      <CreateProductModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onAdd={handleAddProduct} 
        onGenerateAI={generateAIContent}
        isGeneratingAI={isGeneratingAI}
      />
      <StatsModal 
        isOpen={showStatsModal} 
        onClose={() => setShowStatsModal(false)} 
        products={products} 
      />
      <MyCollectionModal 
        isOpen={showCollectionModal} 
        onClose={() => setShowCollectionModal(false)} 
        collection={collection} 
      />
      <CharacterModal
        isOpen={showCharacterModal}
        onClose={() => setShowCharacterModal(false)}
        equippedItems={equippedItems}
      />

      {/* Grid View Overlay */}
      <GridOverlay
        isOpen={showGrid}
        onClose={() => setShowGrid(false)}
        products={filteredData}
        onSelect={scrollToProduct}
        filterRarity={filterRarity}
        setFilterRarity={setFilterRarity}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      {/* Content Slider */}
      <div 
        ref={containerRef}
        className="w-full h-full flex flex-col snap-y snap-mandatory overflow-y-scroll hide-scrollbar"
      >
        {filteredData.map((content, index) => (
          <div key={content.id} data-index={index} className="w-full h-full snap-start flex-shrink-0">
            <XianxiaDisplay 
              content={content} 
              isActive={index === activeIndex} 
              onBuy={handleBuy}
              isOwned={!!collection.find(p => p.id === content.id)}
              onGenerateKOLAvatar={generateKOLAvatar}
              onGenerateKOLVideo={generateKOLVideo}
              onGenerateKOLVoice={generateKOLVoice}
              onCultivate={handleCultivate}
            />
          </div>
        ))}
        
        {filteredData.length === 0 && (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-white/40 font-black uppercase tracking-widest">Không có sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Navigation Indicators */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {filteredData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const el = containerRef.current?.querySelector(`[data-index="${index}"]`);
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-1 h-8 rounded-full transition-all duration-500 ${
              index === activeIndex ? 'bg-cyan-400 scale-y-150 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
