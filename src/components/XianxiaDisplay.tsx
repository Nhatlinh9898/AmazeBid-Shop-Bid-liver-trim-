/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, Star, Zap, Flame, Snowflake, Box, CheckCircle2, Sparkles } from 'lucide-react';
import ElementalEffects from './ElementalEffects';
import Product3DViewer from './Product3DViewer';
import DetailModal from './modals/DetailModal';
import KOLMediaModal from './modals/KOLMediaModal';
import { ProductContent } from '../types';

interface XianxiaDisplayProps {
  content: ProductContent;
  isActive: boolean;
  onBuy: (p: ProductContent) => void;
  isOwned: boolean;
  onGenerateKOLAvatar: (prompt: string) => Promise<string | null>;
  onGenerateKOLVideo: (prompt: string) => Promise<string | null>;
  onGenerateKOLVoice: (text: string) => Promise<string | null>;
}

const XianxiaDisplay = ({ content, isActive, onBuy, isOwned, onGenerateKOLAvatar, onGenerateKOLVideo, onGenerateKOLVoice }: XianxiaDisplayProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [show3D, setShow3D] = useState(false);
  const [prodVideoLoaded, setProdVideoLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const prodVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      const playVideos = async () => {
        try {
          if (bgVideoRef.current) await bgVideoRef.current.play();
          if (prodVideoRef.current) await prodVideoRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("Autoplay failed:", err);
          setIsPlaying(false);
        }
      };
      playVideos();
    } else {
      bgVideoRef.current?.pause();
      prodVideoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const ElementIcon = {
    lightning: Zap,
    fire: Flame,
    ice: Snowflake,
    neon: Zap,
    gold: Star,
    minimal: Snowflake
  }[content.element];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#010409]">
      {/* Background Video (Ambient Layer) */}
      <video
        ref={bgVideoRef}
        src={content.bgVideoUrl}
        className="absolute inset-0 w-full h-full object-cover opacity-[0.15] blur-[15px] scale-110"
        loop
        muted
        playsInline
      />
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `linear-gradient(${content.themeColor} 1px, transparent 1px), linear-gradient(90deg, ${content.themeColor} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%]" 
             style={{ background: `radial-gradient(circle at center, ${content.themeColor}15 0%, transparent 60%)` }} />
        
        {/* Large Ambient Glows */}
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] blur-[180px] rounded-full opacity-30" style={{ backgroundColor: content.themeColor }} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] blur-[180px] rounded-full opacity-20" style={{ backgroundColor: content.themeColor }} />
      </div>

      <ElementalEffects element={content.element} color={content.themeColor} />

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 px-4 lg:px-12 py-8 lg:py-0 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT: Character Display (Complete Character) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -80 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[350px] lg:max-w-[450px] shrink-0 flex flex-col gap-6"
        >
          {/* KOL Info Header - Simplified */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group relative flex items-center gap-4 px-6 py-4 rounded-[32px] bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden"
            style={{ borderColor: `${content.themeColor}33` }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50" style={{ color: content.themeColor }}>KOL Partner</span>
                {content.kolInfo.status === "Đang Livestream" && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <h4 className="text-white font-black text-xl tracking-tight uppercase">{content.kolInfo.name}</h4>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest mt-1 italic">"{content.kolInfo.bio}"</p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="text-[8px] text-white/40 font-black uppercase tracking-widest">Reputation</span>
              <span className="text-lg font-black" style={{ color: content.themeColor }}>{content.kolInfo.reputation}%</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Pod Aura */}
            <div className="absolute -inset-16 blur-[150px] rounded-full animate-pulse opacity-25" style={{ backgroundColor: content.themeColor }} />
            
            {/* Character Frame - Now as a complete character image */}
            <div className="relative aspect-[3/4.5] rounded-[64px] overflow-hidden border bg-slate-900/40 backdrop-blur-2xl group"
                 style={{ borderColor: `${content.themeColor}66`, boxShadow: `0 0 80px ${content.themeColor}22` }}>
              
              {/* Element Icon Badge */}
              <div className="absolute top-10 right-10 z-20 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10"
                   style={{ backgroundColor: `${content.themeColor}22` }}>
                <ElementIcon size={28} style={{ color: content.themeColor }} />
              </div>

              {/* Character Image (Complete Character) */}
              <img 
                src={content.kolInfo.fullBodyImg || content.kolInfo.avatar} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={content.kolInfo.name}
                referrerPolicy="no-referrer"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent" />
              
              {/* Character Info Overlay */}
              <div className="absolute bottom-12 left-0 right-0 text-center px-10">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {content.kolInfo.specialty.map(s => (
                      <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-white/60 uppercase font-black tracking-widest">{s}</span>
                    ))}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMediaModalOpen(true);
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto hover:bg-white/20 transition-all"
                  >
                    <Sparkles size={14} className="text-cyan-400" />
                    Media Lab
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: Skill & Product Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 80 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl lg:max-w-[800px]"
        >
          <div className="relative flex flex-col bg-slate-900/50 backdrop-blur-2xl border p-6 lg:p-10 rounded-[56px] overflow-hidden"
               style={{ borderColor: `${content.themeColor}66`, boxShadow: `0 0 120px ${content.themeColor}22` }}>
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[scan_5s_linear_infinite]" />
            
            {/* Skill Video Showcase (Now primary on the right) */}
            <div className="relative aspect-video rounded-[40px] overflow-hidden bg-black/80 border border-white/10 mb-10 group shadow-2xl">
              {show3D ? (
                <Product3DViewer type={content.type} color={content.themeColor} modelUrl={content.modelUrl} />
              ) : (
                <>
                  <video
                    ref={prodVideoRef}
                    src={content.characterVideoUrl} // Defaulting to character skills video
                    className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${prodVideoLoaded ? 'opacity-90' : 'opacity-0'}`}
                    loop
                    muted
                    playsInline
                    onLoadedData={() => setProdVideoLoaded(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  <div className="absolute top-8 left-10 flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    <span className="text-[11px] font-black tracking-[0.2em] text-white/90 uppercase">KOL Skill Preview</span>
                  </div>

                  <div className="absolute bottom-10 left-12 right-12">
                    <p className="text-white/90 text-lg lg:text-2xl font-medium italic tracking-wide drop-shadow-2xl leading-relaxed">
                      "{content.subtitles}"
                    </p>
                  </div>
                </>
              )}

              {/* View Toggle */}
              <div className="absolute top-8 right-10 flex gap-2 z-30">
                <button 
                  onClick={() => setShow3D(false)}
                  className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    !show3D ? 'bg-white text-black border-white' : 'bg-black/60 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  Skill Video
                </button>
                <button 
                  onClick={() => setShow3D(true)}
                  className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                    show3D ? 'bg-white text-black border-white' : 'bg-black/60 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  <Box size={14} />
                  3D Product
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-px" style={{ backgroundColor: content.themeColor }} />
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase" style={{ color: content.themeColor }}>Legendary Item</span>
                  </div>
                  <h2 className="text-white text-3xl lg:text-4xl font-bold tracking-tight drop-shadow-xl">{content.title}</h2>
                </div>
                <div className="border px-6 py-3 rounded-2xl backdrop-blur-md" style={{ backgroundColor: `${content.themeColor}22`, borderColor: `${content.themeColor}44` }}>
                  <span className="text-2xl font-black tracking-tighter drop-shadow-2xl" style={{ color: content.themeColor }}>{content.productDetails.price}</span>
                </div>
              </div>

              <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-2xl opacity-90">
                {content.productDetails.description}
              </p>

              {/* Stats & Abilities Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {content.productDetails.stats.map((stat, idx) => (
                    <div key={idx} className="relative p-3 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/[0.08] transition-all">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <p className="text-white font-bold text-base tracking-tight">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Abilities */}
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Kỹ Năng Kích Hoạt</p>
                  <div className="space-y-2">
                    {content.abilities.map((ability, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 group hover:border-white/20 transition-all">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10" style={{ color: content.themeColor }}>
                          <Zap size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white/90">{ability.name}</span>
                            <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">{ability.cooldown}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{ability.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex gap-4 pt-2">
                <button 
                  disabled={isOwned}
                  onClick={() => onBuy(content)}
                  className={`flex-[2.5] py-4 rounded-2xl font-black text-xs lg:text-sm tracking-[0.2em] uppercase transition-all active:scale-95 hover:-translate-y-1 shadow-2xl flex items-center justify-center gap-2 ${
                    isOwned 
                      ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                  style={!isOwned ? { backgroundColor: content.themeColor, color: '#000' } : {}}
                >
                  {isOwned ? (
                    <>
                      <CheckCircle2 size={18} />
                      Đã Sở Hữu
                    </>
                  ) : (
                    'Sở Hữu Ngay'
                  )}
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs lg:text-sm tracking-[0.2em] uppercase transition-all active:scale-95 hover:-translate-y-1"
                >
                  Chi Tiết
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <DetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        content={content} 
        onBuy={onBuy}
        isOwned={isOwned}
      />

      {/* KOL Media Modal */}
      <KOLMediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        kol={content.kolInfo}
        onGenerateImage={onGenerateKOLAvatar}
        onGenerateVideo={onGenerateKOLVideo}
        onGenerateVoice={onGenerateKOLVoice}
      />

      {/* Global Controls */}
      <div className="absolute bottom-10 left-10 flex gap-5 z-50">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="w-16 h-16 rounded-3xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-2xl border border-white/15 text-white flex items-center justify-center transition-all active:scale-90 shadow-2xl"
        >
          {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </button>
        <button 
          onClick={() => {
            if (isPlaying) {
              bgVideoRef.current?.pause();
              prodVideoRef.current?.pause();
            } else {
              bgVideoRef.current?.play();
              prodVideoRef.current?.play();
            }
            setIsPlaying(!isPlaying);
          }}
          className="w-16 h-16 rounded-3xl flex items-center justify-center transition-all active:scale-90 hover:-translate-y-1 shadow-2xl"
          style={{ backgroundColor: content.themeColor, color: '#000' }}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(800px); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default XianxiaDisplay;
