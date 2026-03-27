/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Video, Mic, Sparkles, Download, Play, Pause } from 'lucide-react';
import { KOLInfo } from '../../types';

interface KOLMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  kol: KOLInfo;
  onGenerateImage: (prompt: string, options?: { aspectRatio?: string; referenceImage?: string }) => Promise<string | null>;
  onGenerateVideo: (prompt: string, referenceImage?: string) => Promise<string | null>;
  onGenerateVoice: (text: string, style?: string) => Promise<string | null>;
}

const KOLMediaModal = ({ isOpen, onClose, kol, onGenerateImage, onGenerateVideo, onGenerateVoice }: KOLMediaModalProps) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'voice' | 'mimic'>('image');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isFullBody, setIsFullBody] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [mimicStyle, setMimicStyle] = useState('Huyền bí');
  const [mimicType, setMimicType] = useState<'style' | 'trend' | 'persona'>('style');
  const [selectedTrend, setSelectedTrend] = useState('Wes Anderson');
  const [selectedPersona, setSelectedPersona] = useState('Hacker Tương Lai');

  const trends = [
    { id: 'Wes Anderson', label: 'Wes Anderson Style', prompt: 'Symmetrical composition, pastel colors, whimsical atmosphere, Wes Anderson aesthetic.' },
    { id: 'Anime', label: 'Anime Transformation', prompt: 'High-quality anime style, vibrant colors, expressive features, Studio Ghibli inspired.' },
    { id: 'Cyberpunk', label: 'Cyberpunk Neon', prompt: 'Heavy neon lighting, rainy streets, high-tech low-life, futuristic cyberpunk aesthetic.' },
    { id: 'Old Film', label: 'Phim Cổ Điển', prompt: 'Black and white, grainy texture, 1940s film noir aesthetic, dramatic lighting.' }
  ];

  const personas = [
    { id: 'Hacker Tương Lai', label: 'Hacker Tương Lai', bio: 'Một chuyên gia bảo mật mạng sống trong thế giới ngầm kỹ thuật số.' },
    { id: 'Triết Gia Cổ Đại', label: 'Triết Gia Cổ Đại', bio: 'Một hiền triết với những lời khuyên sâu sắc về cuộc sống và vũ trụ.' },
    { id: 'Chiến Binh Rồng', label: 'Chiến Binh Rồng', bio: 'Một chiến binh dũng cảm với sức mạnh của rồng thiêng.' },
    { id: 'Thần Thần Bí', label: 'Thần Thần Bí', bio: 'Một thực thể bí ẩn nắm giữ những bí mật của thời gian.' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt && activeTab !== 'voice' && activeTab !== 'mimic') return;
    setIsGenerating(true);
    setResultUrl(null);
    try {
      let url = null;
      if (activeTab === 'image') {
        const fullBodyPrompt = isFullBody ? "full body shot, standing, from head to toe, " : "portrait avatar, ";
        url = await onGenerateImage(
          prompt || `A high-quality ${fullBodyPrompt} cyberpunk xianxia character for ${kol.name}, ${kol.bio}`,
          { aspectRatio: isFullBody ? "3:4" : "1:1", referenceImage: referenceImage || undefined }
        );
      } else if (activeTab === 'video') {
        url = await onGenerateVideo(
          prompt || `A cinematic 5-second clip of ${kol.name} performing a mystical technique in a neon-lit temple.`,
          referenceImage || undefined
        );
      } else if (activeTab === 'voice') {
        url = await onGenerateVoice(
          prompt || `Chào mọi người, tôi là ${kol.name}. Rất vui được đồng hành cùng các bạn trong thế giới Tiên Hiệp Cyberpunk này.`,
          mimicStyle
        );
      } else if (activeTab === 'mimic') {
        let mimicPrompt = "";
        if (mimicType === 'style') {
          mimicPrompt = `Mimic the style, pose, and lighting of the reference image but apply it to the character ${kol.name} (${kol.bio}). High quality, cinematic.`;
          url = await onGenerateImage(mimicPrompt, { referenceImage: referenceImage || undefined });
        } else if (mimicType === 'trend') {
          const trend = trends.find(t => t.id === selectedTrend);
          mimicPrompt = `A cinematic image of ${kol.name} in the ${trend?.label} trend. ${trend?.prompt}. High quality.`;
          url = await onGenerateImage(mimicPrompt);
        } else if (mimicType === 'persona') {
          const persona = personas.find(p => p.id === selectedPersona);
          mimicPrompt = `A cinematic image of ${kol.name} acting as a ${persona?.label}. ${persona?.bio}. High quality.`;
          url = await onGenerateImage(mimicPrompt);
        }
      }
      setResultUrl(url);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[80vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <Sparkles className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">KOL Media Lab</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Tạo hình ảnh, video và giọng nói AI cho {kol.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-8 pt-6 gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'image', icon: ImageIcon, label: 'Hình Ảnh' },
                { id: 'video', icon: Video, label: 'Video' },
                { id: 'voice', icon: Mic, label: 'Giọng Nói' },
                { id: 'mimic', icon: Sparkles, label: 'Bắt Chước' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setResultUrl(null);
                    setPrompt('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    activeTab === tab.id 
                      ? 'bg-white text-black border-white' 
                      : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto space-y-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40">
                  {activeTab === 'voice' ? 'Nội dung lời thoại' : 'Mô tả ý tưởng (Prompt)'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    activeTab === 'image' ? "Mô tả ngoại hình, trang phục, bối cảnh..." :
                    activeTab === 'video' ? "Mô tả hành động, hiệu ứng, góc quay..." :
                    "Nhập văn bản để AI chuyển thành giọng nói..."
                  }
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                />
                
                {activeTab === 'voice' && (
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/40">Sắc thái giọng nói</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Hài hước', 'Nghiêm túc', 'Huyền bí', 'Năng lượng', 'Dịu dàng'].map(s => (
                        <button
                          key={s}
                          onClick={() => setMimicStyle(s)}
                          className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                            mimicStyle === s ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(activeTab === 'mimic' || activeTab === 'image' || activeTab === 'video') && (
                  <div className="space-y-6">
                    {activeTab === 'mimic' && (
                      <div className="flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/5">
                        {[
                          { id: 'style', label: 'Style' },
                          { id: 'trend', label: 'Trend' },
                          { id: 'persona', label: 'Persona' }
                        ].map(type => (
                          <button
                            key={type.id}
                            onClick={() => setMimicType(type.id as any)}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                              mimicType === type.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {activeTab === 'mimic' && mimicType === 'trend' && (
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40">Chọn Xu Hướng</label>
                        <div className="grid grid-cols-2 gap-2">
                          {trends.map(t => (
                            <button
                              key={t.id}
                              onClick={() => setSelectedTrend(t.id)}
                              className={`p-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all text-left ${
                                selectedTrend === t.id ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'mimic' && mimicType === 'persona' && (
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40">Chọn Nhân Vật</label>
                        <div className="grid grid-cols-2 gap-2">
                          {personas.map(p => (
                            <button
                              key={p.id}
                              onClick={() => setSelectedPersona(p.id)}
                              className={`p-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all text-left ${
                                selectedPersona === p.id ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {(activeTab === 'image' || activeTab === 'video' || (activeTab === 'mimic' && mimicType === 'style')) && (
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40">
                          {activeTab === 'mimic' ? 'Hình ảnh tham chiếu (Style Reference)' : 'Hình ảnh tham chiếu (Tùy chọn)'}
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="relative w-24 h-24 rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center overflow-hidden group">
                            {referenceImage ? (
                              <>
                                <img src={referenceImage} className="w-full h-full object-cover" alt="Ref" />
                                <button 
                                  onClick={() => setReferenceImage(null)}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <div className="text-center">
                                <ImageIcon size={20} className="text-white/20 mx-auto mb-1" />
                                <span className="text-[8px] text-white/20 font-black uppercase">Upload</span>
                              </div>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleFileUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-white/40 leading-relaxed">
                              {activeTab === 'mimic' 
                                ? "Tải lên một hình ảnh để KOL bắt chước tư thế, phong cách nghệ thuật hoặc ánh sáng."
                                : "Tải lên hình ảnh để AI có thêm ngữ cảnh về bối cảnh hoặc trang phục."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                >
                  {isGenerating ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
                      />
                      Đang Khởi Tạo...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Bắt Đầu Tạo
                    </>
                  )}
                </button>
              </div>

              {/* Result Area */}
              <div className="space-y-4">
                <h4 className="text-white/40 text-[10px] font-black uppercase tracking-widest">Kết Quả</h4>
                <div className="min-h-[300px] rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden relative group">
                  {resultUrl ? (
                    <>
                      {activeTab === 'image' && (
                        <img src={resultUrl} className="max-w-full max-h-[500px] object-contain" alt="Generated" referrerPolicy="no-referrer" />
                      )}
                      {activeTab === 'video' && (
                        <video src={resultUrl} className="w-full h-full object-cover" controls autoPlay loop />
                      )}
                      {activeTab === 'voice' && (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 animate-pulse">
                            <Mic className="text-cyan-400" size={32} />
                          </div>
                          <button 
                            onClick={() => {
                              const audio = new Audio(resultUrl);
                              audio.play();
                            }}
                            className="px-6 py-2 rounded-xl bg-white text-black text-[10px] font-black uppercase flex items-center gap-2"
                          >
                            <Play size={14} /> Phát Lại
                          </button>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={resultUrl} 
                          download={`kol-${activeTab}-${Date.now()}`}
                          className="p-3 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all flex items-center gap-2"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-4">
                        {activeTab === 'image' ? <ImageIcon className="text-white/20" size={32} /> : 
                         activeTab === 'video' ? <Video className="text-white/20" size={32} /> : 
                         <Mic className="text-white/20" size={32} />}
                      </div>
                      <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Chưa có dữ liệu khởi tạo</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/20 border-t border-white/5 text-center">
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Powered by Gemini Multimodal Engine</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default KOLMediaModal;
