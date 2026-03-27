/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { ProductContent } from '../../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductContent[];
}

const StatsModal = ({ isOpen, onClose, products }: StatsModalProps) => {
  const rarityCounts = products.reduce((acc, p) => {
    acc[p.rarity] = (acc[p.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: 'Thường', count: rarityCounts['Thường'] || 0, color: '#94a3b8' },
    { name: 'Hiếm', count: rarityCounts['Hiếm'] || 0, color: '#10b981' },
    { name: 'Cực Hiếm', count: rarityCounts['Cực Hiếm'] || 0, color: '#3b82f6' },
    { name: 'Sử Thi', count: rarityCounts['Sử Thi'] || 0, color: '#a855f7' },
    { name: 'Huyền Thoại', count: rarityCounts['Huyền Thoại'] || 0, color: '#f59e0b' },
    { name: 'Thần Thoại', count: rarityCounts['Thần Thoại'] || 0, color: '#ef4444' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-bold text-white">Thống Kê Thị Trường</h3>
                <p className="text-white/40 text-sm mt-1">Phân bổ độ hiếm của {products.length} vật phẩm</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Phân Bổ Độ Hiếm</p>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Lịch Sử Giao Dịch (Linh Thạch)</p>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { day: '01/03', volume: 120 },
                      { day: '05/03', volume: 450 },
                      { day: '10/03', volume: 300 },
                      { day: '15/03', volume: 800 },
                      { day: '20/03', volume: 600 },
                      { day: '25/03', volume: 1200 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                      />
                      <Line type="monotone" dataKey="volume" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10">
              {data.map((item) => (
                <div key={item.name} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: item.color }}>{item.name}</p>
                  <p className="text-2xl font-black text-white mt-1">{item.count}</p>
                  <p className="text-[10px] text-white/20 mt-1">{((item.count / products.length) * 100).toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StatsModal;
