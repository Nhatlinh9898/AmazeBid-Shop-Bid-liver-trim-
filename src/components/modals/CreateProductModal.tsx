/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductContent, ProductType } from '../../types';
import { getRarityInfo, KOLS } from '../../constants';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: ProductContent) => void;
  onGenerateAI: (name: string, category: string) => Promise<any>;
  isGeneratingAI: boolean;
}

const CreateProductModal = ({ isOpen, onClose, onAdd, onGenerateAI, isGeneratingAI }: CreateProductModalProps) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ProductType>('xianxia');
  const [useAI, setUseAI] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    let aiData = null;
    if (useAI) {
      aiData = await onGenerateAI(title, type);
    }

    const rarityInfo = getRarityInfo(Date.now(), 1000);
    const basePrices: Record<ProductType, { val: number; unit: string }> = {
      xianxia: { val: 100, unit: 'Linh Thạch' },
      tech: { val: 500, unit: 'Credits' },
      luxury: { val: 2000, unit: 'USD' },
      fashion: { val: 150, unit: 'USD' },
      automotive: { val: 10000, unit: 'USD' },
      home: { val: 300, unit: 'USD' },
      electronics: { val: 200, unit: 'USD' },
      sports: { val: 50, unit: 'USD' },
      beauty: { val: 40, unit: 'USD' },
      food: { val: 20, unit: 'USD' }
    };

    const base = basePrices[type];
    const finalPrice = (base.val * rarityInfo.multiplier).toLocaleString() + ' ' + base.unit;
    
    // Pick a random KOL
    const randomKOL = KOLS[Math.floor(Math.random() * KOLS.length)];

    const newProduct: ProductContent = {
      id: Date.now(),
      type,
      rarity: rarityInfo.rarity,
      rarityColor: rarityInfo.color,
      title,
      subtitles: `Một vật phẩm ${rarityInfo.rarity} vừa được giám định.`,
      bgVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      characterVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      productVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      fallbackImg: `https://picsum.photos/seed/${type}${Date.now()}/1000/1000`,
      themeColor: rarityInfo.color,
      element: 'minimal',
      kolInfo: randomKOL,
      reviews: [],
      lore: aiData?.lore || `Vật phẩm này có độ hiếm ${rarityInfo.rarity}, được định giá tự động dựa trên thị trường.`,
      materials: ["Bí Ẩn"],
      hiddenStats: [
        { label: "Độ Hiếm", value: rarityInfo.rarity },
        { label: "Linh Lực", value: aiData?.spirit || "???" }
      ],
      abilities: aiData?.ability ? [aiData.ability] : [
        { name: "Kỹ Năng Cơ Bản", description: "Kỹ năng mặc định của vật phẩm.", cooldown: "10s", manaCost: 20 }
      ],
      productDetails: {
        price: finalPrice,
        description: aiData?.lore || "Thông tin chi tiết đang được cập nhật.",
        stats: [
          { label: "Công Kích", value: aiData?.attack || "???" },
          { label: "Tốc Độ", value: aiData?.speed || "???" },
          { label: "Nguồn Gốc", value: "Hệ Thống AI" }
        ]
      }
    };

    onAdd(newProduct);
    setTitle('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[32px] p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Giám Định Vật Phẩm</h3>
            <p className="text-white/40 text-xs mb-8">Hệ thống AI sẽ tự động viết truyền thuyết và cân bằng chỉ số.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Tên Vật Phẩm</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-all"
                  placeholder="Nhập tên vật phẩm..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Ngành Hàng</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as ProductType)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-all appearance-none"
                >
                  <option value="xianxia">Tiên Hiệp</option>
                  <option value="tech">Công Nghệ</option>
                  <option value="luxury">Xa Xỉ</option>
                  <option value="fashion">Thời Trang</option>
                  <option value="automotive">Ô Tô</option>
                  <option value="home">Nội Thất</option>
                  <option value="electronics">Điện Tử</option>
                  <option value="sports">Thể Thao</option>
                  <option value="beauty">Làm Đẹp</option>
                  <option value="food">Ẩm Thực</option>
                </select>
              </div>

              <div className="flex items-center gap-3 py-2">
                <button 
                  type="button"
                  onClick={() => setUseAI(!useAI)}
                  className={`w-10 h-6 rounded-full transition-all relative ${useAI ? 'bg-cyan-500' : 'bg-white/10'}`}
                >
                  <motion.div 
                    animate={{ x: useAI ? 18 : 4 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Sử dụng Gemini AI (Lore & Stats)</span>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-xl bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-all"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={isGeneratingAI}
                  className="flex-1 py-4 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  {isGeneratingAI ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full"
                      />
                      Đang Giám Định...
                    </>
                  ) : 'Giám Định & Thêm'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateProductModal;
