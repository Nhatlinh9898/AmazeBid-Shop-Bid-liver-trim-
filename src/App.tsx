/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, LayoutGrid, Plus, BarChart3, ShoppingBag, Zap, X } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

// Types & Constants
import { ProductContent, ProductType, RarityType } from './types';
import { generateProducts } from './constants';

// Components
import CategorySelector from './components/CategorySelector';
import XianxiaDisplay from './components/XianxiaDisplay';

// Modals
import CreateProductModal from './components/modals/CreateProductModal';
import StatsModal from './components/modals/StatsModal';
import MyCollectionModal from './components/modals/MyCollectionModal';
import CharacterModal from './components/modals/CharacterModal';
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
  const [equippedItems, setEquippedItems] = useState<ProductContent[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
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
    }
  };

  const generateAIContent = async (name: string, category: string) => {
    if (!name) return;
    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Hãy tạo một đoạn truyền thuyết (lore) ngắn (khoảng 3 câu), các chỉ số sức mạnh (Công kích, Linh lực, Tốc độ - từ 10 đến 100), và 1 kỹ năng đặc biệt (tên, mô tả, hồi chiêu, tiêu tốn mana) cho một pháp bảo tên là "${name}" thuộc danh mục "${category}" trong thế giới Tiên Hiệp Cyberpunk. Trả về định dạng JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lore: { type: Type.STRING },
              attack: { type: Type.NUMBER },
              spirit: { type: Type.NUMBER },
              speed: { type: Type.NUMBER },
              ability: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  cooldown: { type: Type.STRING },
                  manaCost: { type: Type.NUMBER }
                },
                required: ["name", "description", "cooldown", "manaCost"]
              }
            },
            required: ["lore", "attack", "spirit", "speed", "ability"]
          }
        }
      });
      
      const data = JSON.parse(response.text);
      return data;
    } catch (error) {
      console.error("AI Generation failed:", error);
      return null;
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateKOLAvatar = async (prompt: string, options?: { aspectRatio?: string }) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: (options?.aspectRatio as any) || "1:1" } },
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Avatar generation failed:", error);
      return null;
    }
  };

  const generateKOLVideo = async (prompt: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      });
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
      }
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY! },
        });
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
      return null;
    } catch (error) {
      console.error("Video generation failed:", error);
      return null;
    }
  };

  const generateKOLVoice = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say cheerfully: ${text}` }] }],
        config: {
          responseModalities: ["AUDIO" as any],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return `data:audio/wav;base64,${base64Audio}`;
      }
      return null;
    } catch (error) {
      console.error("Voice generation failed:", error);
      return null;
    }
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
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden">
      {/* Category Selector */}
      <CategorySelector 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      {/* Search & Grid Toggle */}
      <div className="absolute top-[88px] left-10 z-[60] flex items-center gap-3">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl px-5 py-2 text-[10px] text-white focus:outline-none focus:border-white/40 transition-all w-[180px] lg:w-[240px] h-10"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={12} />
        </div>
        <button 
          onClick={() => setShowGrid(!showGrid)}
          className="w-10 h-10 rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all shadow-2xl"
          title="Thư viện"
        >
          {showGrid ? <X size={18} /> : <LayoutGrid size={18} />}
        </button>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all shadow-2xl"
          title="Thêm mới"
        >
          <Plus size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button 
          onClick={() => setShowStatsModal(true)}
          className="w-10 h-10 rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all shadow-2xl"
          title="Thống kê"
        >
          <BarChart3 size={18} />
        </button>
        <button 
          onClick={() => setShowCollectionModal(true)}
          className="relative w-10 h-10 rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all shadow-2xl"
          title="Bộ sưu tập"
        >
          <ShoppingBag size={18} />
          {collection.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[8px] font-black flex items-center justify-center text-black">
              {collection.length}
            </span>
          )}
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button 
          onClick={connectWallet}
          className={`h-10 px-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl border ${
            walletAddress 
              ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20' 
              : 'bg-slate-900/80 text-white/60 border-white/10 hover:text-white'
          }`}
        >
          <Zap size={14} className={walletAddress ? 'fill-emerald-500' : ''} />
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Kết Nối Ví'}
        </button>

        {walletError && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-12 left-0 bg-red-500/90 backdrop-blur-md text-white text-[9px] font-bold px-4 py-2 rounded-xl border border-red-500/20 shadow-2xl flex items-center gap-2 z-[70]"
          >
            <X size={12} className="cursor-pointer" onClick={() => setWalletError(null)} />
            {walletError}
          </motion.div>
        )}
      </div>

      {/* Modals */}
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
    </div>
  );
}
