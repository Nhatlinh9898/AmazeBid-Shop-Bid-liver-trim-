/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProductContent, ProductType, ElementType, RarityType, KOLInfo, Ability } from './types';

export const KOLS: KOLInfo[] = [
  {
    id: "kol-1",
    name: "Linh Kiếm Sư",
    avatar: "https://i.pravatar.cc/150?u=kol1",
    fullBodyImg: "https://picsum.photos/seed/kol1full/800/1200",
    status: "Đang Luyện Kiếm",
    followers: "1.2M",
    bio: "Chuyên gia về các loại kiếm pháp và pháp bảo tấn công.",
    specialty: ["xianxia", "tech"],
    reputation: 95,
    role: 'Expert',
    skills: [
      { name: "Kiếm Khí Tung Hoành", description: "Tăng 20% sát thương cho các loại kiếm.", effect: "+20% Damage", cooldown: "60s", level: 85 },
      { name: "Vạn Kiếm Quy Tông", description: "Triệu hồi hàng ngàn thanh kiếm tấn công kẻ địch.", effect: "AOE Damage", cooldown: "300s", level: 92 }
    ],
    generation: 1,
    level: 5,
    experience: 250,
    rankPoints: 100,
    resources: { spiritEssence: 500, cyberChips: 200, fameTokens: 50 },
    evolutionTasks: [
      { description: "Đạt cấp độ 10", isCompleted: false, type: 'level', target: 10 },
      { description: "Sở hữu 3 vật phẩm", isCompleted: false, type: 'items', target: 3 }
    ]
  },
  {
    id: "kol-2",
    name: "Cyber Alchemist",
    avatar: "https://i.pravatar.cc/150?u=kol2",
    fullBodyImg: "https://picsum.photos/seed/kol2full/800/1200",
    status: "Trong Phòng Thí Nghiệm",
    followers: "850K",
    bio: "Bậc thầy về luyện đan và chế tạo vật liệu nano.",
    specialty: ["tech", "electronics", "beauty"],
    reputation: 88,
    role: 'Legend',
    skills: [
      { name: "Nano Reconstruction", description: "Tự động sửa chữa các thiết bị bị hỏng.", effect: "Repair", cooldown: "120s", level: 78 },
      { name: "Quantum Synthesis", description: "Tạo ra các vật liệu hiếm từ hư không.", effect: "Resource Gen", cooldown: "600s", level: 95 }
    ],
    generation: 1,
    level: 8,
    experience: 600,
    rankPoints: 450,
    resources: { spiritEssence: 1200, cyberChips: 600, fameTokens: 150 },
    evolutionTasks: [
      { description: "Đạt cấp độ 15", isCompleted: false, type: 'level', target: 15 },
      { description: "Đạt 95% danh tiếng", isCompleted: false, type: 'reputation', target: 95 }
    ]
  },
  {
    id: "kol-3",
    name: "Tiểu Thư Xa Xỉ",
    avatar: "https://i.pravatar.cc/150?u=kol3",
    fullBodyImg: "https://picsum.photos/seed/kol3full/800/1200",
    status: "Đang Mua Sắm",
    followers: "2.5M",
    bio: "Người dẫn đầu xu hướng thời trang và phong cách sống thượng lưu.",
    specialty: ["luxury", "fashion", "beauty", "home"],
    reputation: 92,
    role: 'Influencer',
    skills: [
      { name: "Trendsetter", description: "Tăng 50% khả năng bán được hàng.", effect: "+50% Sales", cooldown: "180s", level: 98 },
      { name: "Golden Aura", description: "Giảm 10% giá mua các mặt hàng xa xỉ.", effect: "-10% Price", cooldown: "Passive", level: 88 }
    ],
    generation: 1,
    level: 12,
    experience: 1200,
    rankPoints: 800,
    resources: { spiritEssence: 3000, cyberChips: 1500, fameTokens: 500 },
    evolutionTasks: [
      { description: "Đạt cấp độ 20", isCompleted: false, type: 'level', target: 20 },
      { description: "Sở hữu 10 vật phẩm", isCompleted: false, type: 'items', target: 10 }
    ]
  },
  {
    id: "kol-4",
    name: "Tay Đua Tốc Độ",
    avatar: "https://i.pravatar.cc/150?u=kol4",
    fullBodyImg: "https://picsum.photos/seed/kol4full/800/1200",
    status: "Trên Đường Đua",
    followers: "1.8M",
    bio: "Chuyên gia đánh giá các dòng xe và thiết bị thể thao.",
    specialty: ["automotive", "sports"],
    reputation: 90,
    role: 'Ambassador',
    skills: [
      { name: "Nitro Boost", description: "Tăng tốc độ di chuyển lên 200%.", effect: "Speed x2", cooldown: "45s", level: 94 },
      { name: "Aerodynamic Review", description: "Tăng hiệu suất khí động học cho xe.", effect: "+15% Efficiency", cooldown: "Passive", level: 82 }
    ],
    generation: 1,
    level: 7,
    experience: 450,
    rankPoints: 300,
    resources: { spiritEssence: 800, cyberChips: 400, fameTokens: 80 },
    evolutionTasks: [
      { description: "Đạt cấp độ 12", isCompleted: false, type: 'level', target: 12 },
      { description: "Đạt 92% danh tiếng", isCompleted: false, type: 'reputation', target: 92 }
    ]
  }
];

export const getRarityInfo = (index: number, total: number): { rarity: RarityType; color: string; multiplier: number } => {
  const rand = (index * 1337) % 1000;
  if (rand < 1) return { rarity: 'Thần Thoại', color: '#ef4444', multiplier: 5000 };
  if (rand < 10) return { rarity: 'Huyền Thoại', color: '#f59e0b', multiplier: 500 };
  if (rand < 50) return { rarity: 'Sử Thi', color: '#a855f7', multiplier: 50 };
  if (rand < 150) return { rarity: 'Cực Hiếm', color: '#3b82f6', multiplier: 10 };
  if (rand < 400) return { rarity: 'Hiếm', color: '#10b981', multiplier: 2.5 };
  return { rarity: 'Thường', color: '#94a3b8', multiplier: 1 };
};

export const generateProducts = (count: number): ProductContent[] => {
  const products: ProductContent[] = [];
  const types: ProductType[] = ['xianxia', 'tech', 'luxury', 'fashion', 'automotive', 'home', 'electronics', 'sports', 'beauty', 'food'];
  const elements: ElementType[] = ['lightning', 'fire', 'ice', 'neon', 'gold', 'minimal'];
  
  for (let i = 1; i <= count; i++) {
    const type = types[i % types.length];
    const element = elements[i % elements.length];
    const rarityInfo = getRarityInfo(i, count);
    const kol = KOLS[i % KOLS.length];
    
    const baseProduct = {
      id: i,
      type,
      rarity: rarityInfo.rarity,
      rarityColor: rarityInfo.color,
      element,
      bgVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      characterVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      productVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      fallbackImg: `https://picsum.photos/seed/${type}${i}/1000/1000`,
      reviews: [
        { user: `Khách hàng ${i}`, comment: "Sản phẩm tuyệt vời, rất đáng tiền!", rating: 5, kolId: kol.id },
        { user: `Người dùng ${i+1}`, comment: "Chất lượng tốt, giao hàng nhanh.", rating: 4 }
      ],
      kolInfo: kol,
      abilities: [
        { name: "Kỹ Năng Đặc Biệt", description: "Kích hoạt sức mạnh tiềm ẩn của vật phẩm.", cooldown: "30s", manaCost: 100 }
      ]
    };

    const formatPrice = (base: number, unit: string) => {
      const finalPrice = base * rarityInfo.multiplier;
      return `${finalPrice.toLocaleString()} ${unit}`;
    };

    if (type === 'xianxia') {
      products.push({
        ...baseProduct,
        title: `Pháp Bảo ${i}: ${['Thanh Long', 'Bạch Hổ', 'Chu Tước', 'Huyền Vũ', 'Thiên Ma'][i % 5]} Kiếm`,
        subtitles: `Sức mạnh của ${['Cửu Thiên', 'U Minh', 'Thái Cổ', 'Hỗn Độn'][i % 4]} đang chờ đợi bạn!`,
        themeColor: rarityInfo.color,
        lore: `Pháp bảo được rèn từ ${i * 100} năm trước tại đỉnh núi ${['Trường Sinh', 'Thiên Sơn', 'Côn Lôn'][i % 3]}.`,
        materials: ["Linh Thạch", "Huyền Thiết", "Long Huyết"],
        hiddenStats: [{ label: "Linh Lực", value: `+${i * 10}` }, { label: "Tốc Độ", value: `+${i * 5}` }],
        productDetails: { price: formatPrice(100, 'Linh Thạch'), description: `Vũ khí bậc nhất dành cho các đạo hữu đang tìm kiếm sự đột phá trong tu hành.`, stats: [{ label: "Công Kích", value: `${500 + i * 5}` }, { label: "Phòng Thủ", value: `${200 + i * 2}` }, { label: "Phẩm Cấp", value: rarityInfo.rarity }] }
      });
    } else if (type === 'tech') {
      products.push({
        ...baseProduct,
        title: `Cyber Device ${i}: ${['Neural', 'Plasma', 'Quantum', 'Void'][i % 4]} Blade`,
        subtitles: `Upgrade your reality with version ${i}.0.`,
        themeColor: rarityInfo.color,
        lore: `Developed in the labs of ${['Sector 7', 'Neo-Silicon', 'The Grid'][i % 3]}.`,
        materials: ["Graphene", "Liquid Metal", "AI Core"],
        hiddenStats: [{ label: "Processing", value: `${i * 10} TFLOPS` }, { label: "Latency", value: "0.1ms" }],
        productDetails: { price: formatPrice(500, 'Credits'), description: `The next generation of tactical gear for the digital age.`, stats: [{ label: "Speed", value: "Mach 2" }, { label: "Durability", value: "99%" }, { label: "Battery", value: "100h" }] }
      });
    } else if (type === 'luxury') {
      products.push({
        ...baseProduct,
        title: `Luxury Item ${i}: ${['Diamond', 'Emerald', 'Ruby', 'Sapphire'][i % 4]} Edition`,
        subtitles: `Exclusivity redefined for the elite.`,
        themeColor: rarityInfo.color,
        lore: `A timeless piece passed down through generations of the ${['Royal', 'Imperial', 'Noble'][i % 3]} family.`,
        materials: ["18K Gold", "Rare Gems", "Silk"],
        hiddenStats: [{ label: "Rarity", value: rarityInfo.rarity }, { label: "Craftsmanship", value: "Master" }],
        productDetails: { price: formatPrice(2000, 'USD'), description: `A symbol of status and elegance that transcends time.`, stats: [{ label: "Weight", value: "150g" }, { label: "Purity", value: "24K" }, { label: "Warranty", value: "Lifetime" }] }
      });
    } else if (type === 'fashion') {
      products.push({
        ...baseProduct,
        title: `Fashion ${i}: ${['Vogue', 'Urban', 'Classic', 'Avant'][i % 4]} Collection`,
        subtitles: `Wear your identity.`,
        themeColor: rarityInfo.color,
        lore: `Designed by the world's leading fashion icons.`,
        materials: ["Organic Cotton", "Recycled Polyester", "Silk"],
        hiddenStats: [{ label: "Style Score", value: "99/100" }, { label: "Comfort", value: "Max" }],
        productDetails: { price: formatPrice(150, 'USD'), description: `A perfect blend of comfort and high-end fashion.`, stats: [{ label: "Size", value: "All" }, { label: "Color", value: "Multi" }, { label: "Season", value: "SS26" }] }
      });
    } else if (type === 'automotive') {
      products.push({
        ...baseProduct,
        title: `Vehicle ${i}: ${['Speedster', 'SUV', 'Electric', 'Hyper'][i % 4]} X`,
        subtitles: `The future of mobility.`,
        themeColor: rarityInfo.color,
        lore: `Engineered for performance and sustainability.`,
        materials: ["Aluminum", "Carbon Fiber", "Lithium"],
        hiddenStats: [{ label: "0-100km/h", value: `${(2 + Math.random() * 3).toFixed(1)}s` }, { label: "Range", value: "600km" }],
        productDetails: { price: formatPrice(10000, 'USD'), description: `Experience the thrill of the open road with cutting-edge technology.`, stats: [{ label: "Horsepower", value: "800hp" }, { label: "Top Speed", value: "320km/h" }, { label: "Autopilot", value: "v5.0" }] }
      });
    } else if (type === 'home') {
      products.push({
        ...baseProduct,
        title: `Home ${i}: ${['Minimalist', 'Modern', 'Vintage', 'Smart'][i % 4]} Sofa`,
        subtitles: `Transform your living space.`,
        themeColor: rarityInfo.color,
        lore: `Crafted for comfort and aesthetic appeal.`,
        materials: ["Oak Wood", "Velvet", "Memory Foam"],
        hiddenStats: [{ label: "Durability", value: "20 Years" }, { label: "Eco-friendly", value: "Yes" }],
        productDetails: { price: formatPrice(300, 'USD'), description: `High-quality furniture that brings elegance to any room.`, stats: [{ label: "Material", value: "Premium" }, { label: "Warranty", value: "5 Years" }, { label: "Assembly", value: "Easy" }] }
      });
    } else if (type === 'electronics') {
      products.push({
        ...baseProduct,
        title: `Gadget ${i}: ${['Smartphone', 'Laptop', 'Tablet', 'Watch'][i % 4]} Pro`,
        subtitles: `Power in your hands.`,
        themeColor: rarityInfo.color,
        lore: `The latest in consumer electronics technology.`,
        materials: ["Glass", "Aluminum", "Silicon"],
        hiddenStats: [{ label: "Display", value: "OLED 120Hz" }, { label: "CPU", value: "M4 Chip" }],
        productDetails: { price: formatPrice(200, 'USD'), description: `Stay connected and productive with our latest electronic devices.`, stats: [{ label: "Storage", value: "1TB" }, { label: "RAM", value: "16GB" }, { label: "Battery", value: "24h" }] }
      });
    } else if (type === 'sports') {
      products.push({
        ...baseProduct,
        title: `Sports ${i}: ${['Running', 'Basketball', 'Tennis', 'Gym'][i % 4]} Gear`,
        subtitles: `Push your limits.`,
        themeColor: rarityInfo.color,
        lore: `Designed for peak performance and injury prevention.`,
        materials: ["Breathable Mesh", "Rubber", "Synthetic"],
        hiddenStats: [{ label: "Performance Boost", value: "+15%" }, { label: "Weight", value: "Light" }],
        productDetails: { price: formatPrice(50, 'USD'), description: `Professional-grade sports equipment for every athlete.`, stats: [{ label: "Grip", value: "High" }, { label: "Breathability", value: "Max" }, { label: "Flexibility", value: "High" }] }
      });
    } else if (type === 'beauty') {
      products.push({
        ...baseProduct,
        title: `Beauty ${i}: ${['Skincare', 'Makeup', 'Fragrance', 'Haircare'][i % 4]} Set`,
        subtitles: `Radiate confidence.`,
        themeColor: rarityInfo.color,
        lore: `Formulated with natural ingredients for all skin types.`,
        materials: ["Aloe Vera", "Vitamin C", "Essential Oils"],
        hiddenStats: [{ label: "Natural", value: "100%" }, { label: "Cruelty-free", value: "Yes" }],
        productDetails: { price: formatPrice(40, 'USD'), description: `Enhance your natural beauty with our premium skincare and makeup products.`, stats: [{ label: "Volume", value: "100ml" }, { label: "Type", value: "Organic" }, { label: "SPF", value: "50+" }] }
      });
    } else {
      products.push({
        ...baseProduct,
        title: `Food ${i}: ${['Gourmet', 'Organic', 'Snack', 'Beverage'][i % 4]} Box`,
        subtitles: `A taste of perfection.`,
        themeColor: rarityInfo.color,
        lore: `Sourced from the finest organic farms around the world.`,
        materials: ["Organic Grains", "Fresh Fruits", "Natural Spices"],
        hiddenStats: [{ label: "Calories", value: "Low" }, { label: "Nutrients", value: "High" }],
        productDetails: { price: formatPrice(20, 'USD'), description: `Delicious and healthy food options for every meal.`, stats: [{ label: "Weight", value: "500g" }, { label: "Shelf Life", value: "6 Months" }, { label: "Vegan", value: "Yes" }] }
      });
    }
  }
  return products;
};

export const CONTENT_DATA: ProductContent[] = generateProducts(1000);
