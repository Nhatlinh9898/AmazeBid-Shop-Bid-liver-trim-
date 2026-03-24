/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight, X, Star, Zap, Flame, Snowflake, Ghost, Box, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshWobbleMaterial, Sparkles, Environment, useGLTF, Stage, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm';

// --- Components ---

const ElementalEffects = ({ element, color }: { element: ElementType; color: string }) => {
  const particles = Array.from({ length: 20 });
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            y: [null, "-20%"],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0.5]
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute w-1 h-1 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        />
      ))}
      
      {element === 'lightning' && (
        <motion.div 
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 bg-white/5"
        />
      )}

      {element === 'neon' && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,171,252,0.1)_0%,transparent_70%)]" />
      )}
    </div>
  );
};

const DetailModal = ({ isOpen, onClose, content }: { isOpen: boolean; onClose: () => void; content: ProductContent }) => {
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
            className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
          >
            {/* Modal Header/Image */}
            <div className="w-full lg:w-1/3 relative aspect-square lg:aspect-auto">
              <img src={content.fallbackImg} className="w-full h-full object-cover" alt={content.title} referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-white">{content.title}</h3>
                <p className="text-cyan-400 font-black text-xs tracking-widest uppercase mt-1">{content.element} Element</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto max-h-[70vh] lg:max-h-none">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                <X size={24} />
              </button>

              <div className="space-y-8">
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
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

type ProductType = 'xianxia' | 'tech' | 'luxury';
type ElementType = 'lightning' | 'fire' | 'ice' | 'neon' | 'gold' | 'minimal';

interface ProductContent {
  id: number;
  type: ProductType;
  title: string;
  subtitles: string;
  bgVideoUrl: string;
  characterVideoUrl: string;
  productVideoUrl: string;
  fallbackImg: string;
  themeColor: string;
  element: ElementType;
  modelUrl?: string;
  kolInfo: {
    name: string;
    avatar: string;
    status: string;
    followers: string;
  };
  reviews: { user: string; comment: string; rating: number }[];
  lore: string;
  materials: string[];
  hiddenStats: { label: string; value: string }[];
  productDetails: {
    price: string;
    description: string;
    stats: { label: string; value: string }[];
  };
}

const CONTENT_DATA: ProductContent[] = [
  {
    id: 1,
    type: 'xianxia',
    title: "Lôi Đình Vạn Quân Đao",
    subtitles: "Cửu thiên lôi đình, nghe ta hiệu lệnh!",
    bgVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    characterVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    productVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    fallbackImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000",
    themeColor: "#22d3ee",
    element: 'lightning',
    kolInfo: {
      name: "Linh Nhi Tiên Tử",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      status: "Đang Livestream",
      followers: "1.2M Đạo Hữu"
    },
    reviews: [
      { user: "Thanh Vân Đạo Nhân", comment: "Đao khí bức người, lôi quang lấp lánh!", rating: 5 },
      { user: "Kiếm Ma", comment: "Tốc độ xuất đao cực nhanh.", rating: 4 }
    ],
    lore: "Được rèn từ mảnh vỡ của Thiên Lôi Thạch rơi xuống từ Cửu Trọng Thiên. Trải qua vạn năm hấp thụ tinh hoa sấm sét.",
    materials: ["Thiên Lôi Thạch", "Vạn Năm Hàn Thiết", "Long Huyết"],
    hiddenStats: [
      { label: "Tỉ lệ bạo kích", value: "+25%" },
      { label: "Sát thương lôi", value: "+500" }
    ],
    productDetails: {
      price: "8,888 Linh Thạch",
      description: "Thần khí thượng cổ, chứa đựng sức mạnh của cửu thiên lôi đình. Người sở hữu có thể hô phong hoán vũ.",
      stats: [
        { label: "Công Kích", value: "999+" },
        { label: "Tốc Độ", value: "S" },
        { label: "Phẩm Cấp", value: "Thần Giai" }
      ]
    }
  },
  {
    id: 2,
    type: 'tech',
    title: "Cyber Katana X-2077",
    subtitles: "Neon pulse, cutting through the digital void.",
    bgVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    characterVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    productVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    fallbackImg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000",
    themeColor: "#f0abfc",
    element: 'neon',
    kolInfo: {
      name: "Cyber Ghost",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
      status: "Đang Livestream",
      followers: "2.4M Hackers"
    },
    reviews: [
      { user: "NetRunner", comment: "The latency is zero. Perfect for deep dives.", rating: 5 },
      { user: "StreetSam", comment: "Cuts through chrome like butter.", rating: 5 }
    ],
    lore: "Forged in the underground labs of Neo-Tokyo. This blade uses high-frequency vibrations to split atoms.",
    materials: ["Carbon Fiber", "Plasma Core", "Nanobots"],
    hiddenStats: [
      { label: "Hacking Speed", value: "+40%" },
      { label: "Stealth Mode", value: "Active" }
    ],
    productDetails: {
      price: "$15,000 Credits",
      description: "The ultimate weapon for the urban mercenary. Lightweight, deadly, and fully integrated with your neural link.",
      stats: [
        { label: "Frequency", value: "500GHz" },
        { label: "Weight", value: "0.8kg" },
        { label: "Battery", value: "48h" }
      ]
    }
  },
  {
    id: 3,
    type: 'luxury',
    title: "Royal Chrono Gold",
    subtitles: "Time is the ultimate luxury.",
    bgVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    characterVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    productVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    fallbackImg: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000",
    themeColor: "#fbbf24",
    element: 'gold',
    kolInfo: {
      name: "Lord Hamilton",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
      status: "Ngoại Tuyến",
      followers: "500K Collectors"
    },
    reviews: [
      { user: "WatchEnthusiast", comment: "The craftsmanship is unparalleled.", rating: 5 },
      { user: "CEO_Vibe", comment: "A statement piece for every meeting.", rating: 5 }
    ],
    lore: "Handcrafted by master watchmakers in the Swiss Alps. Only 10 pieces exist in the world.",
    materials: ["18K Gold", "Sapphire Crystal", "Diamond Studs"],
    hiddenStats: [
      { label: "Resale Value", value: "High" },
      { label: "Precision", value: "0.001s" }
    ],
    productDetails: {
      price: "$250,000 USD",
      description: "A masterpiece of engineering and art. This timepiece represents the pinnacle of human achievement in horology.",
      stats: [
        { label: "Movement", value: "Auto" },
        { label: "Waterproof", value: "100m" },
        { label: "Jewels", value: "32" }
      ]
    }
  }
];

// --- 3D Models ---

const LightningSwordModel = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* Blade */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.1, 3, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      {/* Glow */}
      <mesh scale={[1.2, 1.1, 1.2]}>
        <boxGeometry args={[0.1, 3, 0.02]} />
        <MeshWobbleMaterial color={color} factor={0.5} speed={2} transparent opacity={0.3} />
      </mesh>
      <Sparkles count={50} scale={3} size={2} speed={0.5} color={color} />
    </group>
  );
};

const CyberKatanaModel = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group rotation={[0, 0, -Math.PI / 6]}>
      {/* Blade */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.05, 3.5, 0.01]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={1} />
      </mesh>
      {/* Neon Edge */}
      <mesh position={[0.03, 0, 0]}>
        <boxGeometry args={[0.01, 3.5, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
      </mesh>
      <Environment preset="city" />
    </group>
  );
};

const LuxuryWatchModel = ({ color }: { color: string }) => {
  const handRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (handRef.current) {
      handRef.current.rotation.z -= 0.05;
    }
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Watch Face */}
      <mesh>
        <cylinderGeometry args={[1, 1, 0.1, 64]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.2} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.02, 64]} />
        <meshStandardMaterial color="white" transparent opacity={0.3} metalness={1} />
      </mesh>
      {/* Hand */}
      <mesh ref={handRef} position={[0, 0.07, 0]}>
        <boxGeometry args={[0.02, 0.8, 0.01]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <Environment preset="apartment" />
    </group>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("3D Viewer Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white/40 p-6 text-center">
          <Box className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-xs font-medium uppercase tracking-widest">Lỗi kết nối mô hình 3D</p>
          <p className="text-[10px] mt-2 opacity-60">Không thể tải mô hình từ nguồn này (có thể do lỗi CORS hoặc link hỏng)</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase transition-colors"
          >
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ExternalModel = ({ url }: { url: string }) => {
  const isVrm = url.toLowerCase().endsWith('.vrm');
  
  const { scene } = useGLTF(url, undefined, undefined, (loader: any) => {
    if (isVrm) {
      loader.register((parser: any) => new VRMLoaderPlugin(parser));
    }
  });

  // If it's a VRM, we might want to do some specific setup (like fixing the rotation)
  useEffect(() => {
    if (isVrm && scene) {
      // VRM models are usually Y-up and facing -Z, but sometimes need adjustment
      scene.rotation.y = Math.PI;
    }
  }, [isVrm, scene]);

  return <primitive object={scene} scale={1.5} />;
};

const Product3DViewer = ({ type, color, modelUrl }: { type: ProductType; color: string; modelUrl?: string }) => {
  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden relative group">
      <ErrorBoundary>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <PresentationControls
            global
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Stage environment="city" intensity={0.6}>
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Suspense fallback={<mesh><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color="white" wireframe /></mesh>}>
                  {modelUrl ? (
                    <ExternalModel url={modelUrl} />
                  ) : (
                    <>
                      {type === 'xianxia' && <LightningSwordModel color={color} />}
                      {type === 'tech' && <CyberKatanaModel color={color} />}
                      {type === 'luxury' && <LuxuryWatchModel color={color} />}
                    </>
                  )}
                </Suspense>
              </Float>
            </Stage>
          </PresentationControls>
          
          <Environment preset="night" />
        </Canvas>
      </ErrorBoundary>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-tighter text-white/60">Tương tác 3D: Xoay, Phóng to</p>
      </div>
    </div>
  );
};

const XianxiaDisplay = ({ content, isActive }: { content: ProductContent; isActive: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [show3D, setShow3D] = useState(false);
  const [charVideoLoaded, setCharVideoLoaded] = useState(false);
  const [prodVideoLoaded, setProdVideoLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const charVideoRef = useRef<HTMLVideoElement>(null);
  const prodVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      const playVideos = async () => {
        try {
          if (bgVideoRef.current) await bgVideoRef.current.play();
          if (charVideoRef.current) await charVideoRef.current.play();
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
      charVideoRef.current?.pause();
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
        
        {/* LEFT: Character Pod */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -80 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[320px] lg:max-w-[400px] shrink-0 flex flex-col gap-6"
        >
          {/* KOL Info Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 px-4 py-3 rounded-[32px] bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg"
            style={{ borderColor: `${content.themeColor}33` }}
          >
            <div className="relative">
              <img 
                src={content.kolInfo.avatar} 
                className="w-12 h-12 rounded-full border-2 object-cover" 
                style={{ borderColor: `${content.themeColor}80` }}
                alt={content.kolInfo.name}
                referrerPolicy="no-referrer"
              />
              {content.kolInfo.status === "Đang Livestream" && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm tracking-wide">{content.kolInfo.name}</h4>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${content.kolInfo.status === "Đang Livestream" ? 'text-red-400' : 'text-slate-400'}`}>
                  {content.kolInfo.status}
                </span>
                <span className="text-[10px] text-slate-500">•</span>
                <span className="text-[10px] font-medium opacity-80" style={{ color: content.themeColor }}>{content.kolInfo.followers}</span>
              </div>
            </div>
            <button className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Theo Dõi
            </button>
          </motion.div>

          {/* Connecting Energy Line */}
          <div className="hidden lg:block absolute top-[45%] -right-12 w-12 h-px z-0 opacity-50" 
               style={{ background: `linear-gradient(to right, ${content.themeColor}80, transparent)` }} />
          
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Pod Aura */}
            <div className="absolute -inset-12 blur-[120px] rounded-full animate-pulse opacity-20" style={{ backgroundColor: content.themeColor }} />
            
            {/* Character Frame */}
            <div className="relative aspect-[2.8/4] rounded-[56px] overflow-hidden border bg-slate-900/50 backdrop-blur-xl group"
                 style={{ borderColor: `${content.themeColor}66`, boxShadow: `0 0 60px ${content.themeColor}33` }}>
              
              {/* Element Icon Badge */}
              <div className="absolute top-8 right-8 z-20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10"
                   style={{ backgroundColor: `${content.themeColor}22` }}>
                <ElementIcon size={24} style={{ color: content.themeColor }} />
              </div>

              {/* Corner Accents */}
              <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 rounded-tl-3xl opacity-60" style={{ borderColor: content.themeColor }} />
              <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 rounded-br-3xl opacity-60" style={{ borderColor: content.themeColor }} />
              
              {!charVideoLoaded && (
                <img 
                  src={content.fallbackImg} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" 
                  alt="Character Fallback" 
                  referrerPolicy="no-referrer"
                />
              )}
              <video
                ref={charVideoRef}
                src={content.characterVideoUrl}
                className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${charVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                loop
                muted
                playsInline
                onLoadedData={() => setCharVideoLoaded(true)}
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
              
              {/* Character Info Overlay */}
              <div className="absolute bottom-12 left-0 right-0 text-center px-8">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="inline-block px-4 py-1.5 rounded-full border text-[11px] font-black tracking-[0.4em] uppercase mb-4 backdrop-blur-md"
                        style={{ backgroundColor: `${content.themeColor}33`, borderColor: `${content.themeColor}66`, color: content.themeColor }}>
                    Active Hero
                  </span>
                  <h3 className="text-white text-3xl lg:text-4xl font-bold tracking-tight drop-shadow-2xl">{content.title}</h3>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: Product Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 80 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl lg:max-w-[750px]"
        >
          <div className="relative flex flex-col bg-slate-900/50 backdrop-blur-2xl border p-5 lg:p-8 rounded-[48px] overflow-hidden"
               style={{ borderColor: `${content.themeColor}66`, boxShadow: `0 0 100px ${content.themeColor}22` }}>
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[scan_5s_linear_infinite]" />
            
            {/* Video/3D Showcase */}
            <div className="relative aspect-video rounded-[32px] overflow-hidden bg-black/80 border border-white/10 mb-8 group shadow-2xl">
              {show3D ? (
                <Product3DViewer type={content.type} color={content.themeColor} modelUrl={content.modelUrl} />
              ) : (
                <>
                  <video
                    ref={prodVideoRef}
                    src={content.productVideoUrl}
                    className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${prodVideoLoaded ? 'opacity-90' : 'opacity-0'}`}
                    loop
                    muted
                    playsInline
                    onLoadedData={() => setProdVideoLoaded(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  <div className="absolute top-6 left-8 flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                    <span className="text-[11px] font-black tracking-widest text-white/80 uppercase">Live Preview</span>
                  </div>

                  <div className="absolute bottom-8 left-10 right-10">
                    <p className="text-white/90 text-base lg:text-xl font-medium italic tracking-wide drop-shadow-2xl leading-relaxed">
                      "{content.subtitles}"
                    </p>
                  </div>
                </>
              )}

              {/* View Toggle */}
              <div className="absolute top-6 right-8 flex gap-2 z-30">
                <button 
                  onClick={() => setShow3D(false)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    !show3D ? 'bg-white text-black border-white' : 'bg-black/40 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  Video
                </button>
                <button 
                  onClick={() => setShow3D(true)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                    show3D ? 'bg-white text-black border-white' : 'bg-black/40 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  <Box size={14} />
                  3D View
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

              {/* Stats & Reviews Split */}
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

                {/* Reviews */}
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Đạo Hữu Đánh Giá</p>
                  <div className="space-y-2">
                    {content.reviews.map((review, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white/80">{review.user}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }).map((_, j) => (
                              <Star key={j} size={8} className="fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 italic">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex gap-4 pt-2">
                <button className="flex-[2.5] py-4 rounded-2xl font-black text-xs lg:text-sm tracking-[0.2em] uppercase transition-all active:scale-95 hover:-translate-y-1 shadow-2xl"
                        style={{ backgroundColor: content.themeColor, color: '#000' }}>
                  Sở Hữu Ngay
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
      <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={content} />

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
              charVideoRef.current?.pause();
              prodVideoRef.current?.pause();
            } else {
              bgVideoRef.current?.play();
              charVideoRef.current?.play();
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

const CategorySelector = ({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}: { 
  categories: { id: ProductType | 'all'; label: string }[]; 
  activeCategory: string; 
  setActiveCategory: (id: ProductType | 'all') => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute top-8 left-10 z-[60] flex items-center gap-2">
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
        <button 
          onClick={() => scroll('left')}
          className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto hide-scrollbar max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] scroll-smooth px-1"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<ProductType | 'all'>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredData = activeCategory === 'all' 
    ? CONTENT_DATA 
    : CONTENT_DATA.filter(item => item.type === activeCategory);

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
  ];

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden">
      {/* Category Selector */}
      <CategorySelector 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
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
            <XianxiaDisplay content={content} isActive={index === activeIndex} />
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
        .mask-fade-bottom {
          mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
        }
      `}} />
    </div>
  );
}
