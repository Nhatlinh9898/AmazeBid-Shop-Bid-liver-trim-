/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, User, Shield, Zap, Video, Mic, Image as ImageIcon, Loader2 } from 'lucide-react';
import { KOLInfo, ProductType } from '../../types';
import { aiService } from '../../services/aiService';

interface CreateKOLModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (kol: KOLInfo) => void;
}

const CreateKOLModal = ({ isOpen, onClose, onAdd }: CreateKOLModalProps) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState<ProductType[]>(['xianxia']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKOL, setGeneratedKOL] = useState<Partial<KOLInfo> | null>(null);
  const [step, setStep] = useState<'info' | 'media' | 'preview'>('info');

  const categories: { id: ProductType; label: string }[] = [
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

  const handleGenerateProfile = async () => {
    if (!name) return;
    setIsGenerating(true);
    try {
      const profile = await aiService.generateKOLProfile(name, specialty);
      setGeneratedKOL({
        id: `kol-${Date.now()}`,
        name,
        specialty,
        reputation: 50 + Math.floor(Math.random() * 50),
        ...profile
      });
      setStep('media');
    } catch (error) {
      console.error("Failed to generate profile:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMedia = async () => {
    if (!generatedKOL) return;
    setIsGenerating(true);
    try {
      const avatar = await aiService.generateImage(`A professional portrait of a ${generatedKOL.role} named ${name} who is an expert in ${specialty.join(", ")}. Cyberpunk Xianxia style, high quality, 8k.`, "1:1");
      const fullBody = await aiService.generateImage(`A full body shot of a ${generatedKOL.role} named ${name} who is an expert in ${specialty.join(", ")}. Wearing futuristic traditional robes, glowing elements, Cyberpunk Xianxia style, high quality, 8k.`, "9:16");
      
      setGeneratedKOL(prev => ({
        ...prev,
        avatar: avatar || `https://i.pravatar.cc/150?u=${name}`,
        fullBodyImg: fullBody || `https://picsum.photos/seed/${name}/800/1200`
      }));
      setStep('preview');
    } catch (error) {
      console.error("Failed to generate media:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (generatedKOL && generatedKOL.avatar && generatedKOL.name) {
      onAdd(generatedKOL as KOLInfo);
      onClose();
      // Reset state
      setName('');
      setGeneratedKOL(null);
      setStep('info');
    }
  };

  const toggleSpecialty = (id: ProductType) => {
    if (specialty.includes(id)) {
      setSpecialty(specialty.filter(s => s !== id));
    } else {
      setSpecialty([...specialty, id]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-bottom border-white/5 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <Sparkles className="text-cyan-400" />
                Tạo KOL Chuyên Nghiệp
              </h2>
              <p className="text-white/40 text-xs mt-1">Sử dụng AI để kiến tạo một đại diện thương hiệu hoàn hảo</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
            {step === 'info' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Tên KOL</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Kiếm Thánh Cypher, Nữ Vương Neon..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Lĩnh Vực Chuyên Môn</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => toggleSpecialty(cat.id)}
                        className={`px-4 py-3 rounded-xl text-[10px] font-bold transition-all border ${
                          specialty.includes(cat.id) 
                            ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateProfile}
                  disabled={!name || isGenerating}
                  className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                  {isGenerating ? 'Đang Khởi Tạo...' : 'Khởi Tạo Hồ Sơ AI'}
                </button>
              </div>
            )}

            {step === 'media' && generatedKOL && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-cyan-400">{generatedKOL.name}</h3>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                      {generatedKOL.role}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 italic leading-relaxed">"{generatedKOL.bio}"</p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-white/30 uppercase">Trạng Thái</span>
                      <p className="text-xs font-bold">{generatedKOL.status}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-white/30 uppercase">Followers</span>
                      <p className="text-xs font-bold">{generatedKOL.followers}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <span className="text-[9px] font-black text-white/30 uppercase">Kỹ Năng Đặc Trưng</span>
                    <div className="grid grid-cols-1 gap-3">
                      {generatedKOL.skills?.map((skill, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                            <Zap size={14} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{skill.name}</h4>
                            <p className="text-[10px] text-white/40">{skill.description}</p>
                            <div className="flex gap-3 mt-1">
                              <span className="text-[9px] text-cyan-400/60 font-bold uppercase">Hiệu ứng: {skill.effect}</span>
                              <span className="text-[9px] text-purple-400/60 font-bold uppercase">Hồi: {skill.cooldown}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateMedia}
                  disabled={isGenerating}
                  className="w-full py-5 rounded-2xl bg-cyan-500 text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <ImageIcon size={20} />}
                  {isGenerating ? 'Đang Vẽ Chân Dung...' : 'Tạo Hình Ảnh AI'}
                </button>
              </div>
            )}

            {step === 'preview' && generatedKOL && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase ml-1">Ảnh Chân Dung</label>
                    <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                      <img src={generatedKOL.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase ml-1">Ảnh Toàn Thân</label>
                    <div className="aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                      <img src={generatedKOL.fullBodyImg} alt="Full Body" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('media')}
                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Quay Lại
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-[2] py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg"
                  >
                    Lưu KOL & Kết Thúc
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateKOLModal;
