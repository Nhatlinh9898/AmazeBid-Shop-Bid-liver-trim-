/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductType } from '../types';

interface CategorySelectorProps {
  categories: { id: ProductType | 'all'; label: string }[];
  activeCategory: string;
  setActiveCategory: (id: ProductType | 'all') => void;
}

const CategorySelector = ({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}: CategorySelectorProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
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

export default CategorySelector;
