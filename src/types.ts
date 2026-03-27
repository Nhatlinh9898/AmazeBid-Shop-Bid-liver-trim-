/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductType = 'xianxia' | 'tech' | 'luxury' | 'fashion' | 'automotive' | 'home' | 'electronics' | 'sports' | 'beauty' | 'food';
export type ElementType = 'lightning' | 'fire' | 'ice' | 'neon' | 'gold' | 'minimal';
export type RarityType = 'Thường' | 'Hiếm' | 'Cực Hiếm' | 'Sử Thi' | 'Huyền Thoại' | 'Thần Thoại';

export interface KOLInfo {
  id: string;
  name: string;
  avatar: string;
  fullBodyImg?: string;
  status: string;
  followers: string;
  bio: string;
  specialty: ProductType[];
  reputation: number; // 0-100
  videoUrl?: string;
  voiceUrl?: string;
}

export interface Ability {
  name: string;
  description: string;
  cooldown: string;
  manaCost: number;
}

export interface ProductContent {
  id: number;
  type: ProductType;
  rarity: RarityType;
  rarityColor: string;
  title: string;
  subtitles: string;
  bgVideoUrl: string;
  characterVideoUrl: string;
  productVideoUrl: string;
  fallbackImg: string;
  themeColor: string;
  element: ElementType;
  modelUrl?: string;
  kolInfo: KOLInfo;
  reviews: { user: string; comment: string; rating: number; kolId?: string }[];
  lore: string;
  materials: string[];
  hiddenStats: { label: string; value: string }[];
  abilities: Ability[];
  productDetails: {
    price: string;
    description: string;
    stats: { label: string; value: string }[];
  };
}
