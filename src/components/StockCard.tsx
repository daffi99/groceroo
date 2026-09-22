import React from 'react';
import { InventoryItem, StockStatus } from '../types/inventory';

interface StockCardProps {
  item: InventoryItem;
  onUpdateStatus: (id: string, status: StockStatus) => void;
}

export const StockCard: React.FC<StockCardProps> = ({
  item,
  onUpdateStatus,
}) => {
  const handleStatusClick = (newStatus: StockStatus) => {
    if (item.status === newStatus) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onUpdateStatus(item.id, newStatus);
  };

  return (
    <div
      className={`py-2 px-3 sm:px-3.5 rounded-2xl border transition-all duration-300 ease-out flex items-center justify-between gap-2.5 bg-white ${
        item.status === 'out'
          ? 'border-rose-300/90 bg-rose-50/20 shadow-xs ring-1 ring-rose-500/10'
          : item.status === 'low'
          ? 'border-amber-300/90 bg-amber-50/20 shadow-xs ring-1 ring-amber-500/10'
          : 'border-slate-200/90 bg-white hover:border-slate-300'
      }`}
    >
      {/* Item Name (Smooth color transition) */}
      <span
        className={`font-bold text-xs sm:text-sm tracking-tight truncate flex-1 min-w-0 transition-colors duration-200 ${
          item.status === 'out'
            ? 'text-rose-950'
            : item.status === 'low'
            ? 'text-amber-950'
            : 'text-slate-900'
        }`}
      >
        {item.name}
      </span>

      {/* Capsule Segmented Control (Smooth switch animation) */}
      <div className="flex items-center gap-0.5 p-0.5 bg-slate-100/90 rounded-full shrink-0">
        {/* 🔴 Habis */}
        <button
          onClick={() => handleStatusClick('out')}
          className={`py-1 px-2.5 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-90 ${
            item.status === 'out'
              ? 'bg-rose-500 text-white shadow-xs font-black animate-pill-pop'
              : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50/50'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-transform duration-200 ${
              item.status === 'out' ? 'bg-white scale-110' : 'bg-rose-500'
            }`}
          />
          <span>Habis</span>
        </button>

        {/* 🟡 Menipis */}
        <button
          onClick={() => handleStatusClick('low')}
          className={`py-1 px-2.5 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-90 ${
            item.status === 'low'
              ? 'bg-amber-400 text-amber-950 shadow-xs font-black animate-pill-pop'
              : 'text-slate-500 hover:text-amber-700 hover:bg-amber-50/50'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-transform duration-200 ${
              item.status === 'low' ? 'bg-amber-950 scale-110' : 'bg-amber-500'
            }`}
          />
          <span>Menipis</span>
        </button>

        {/* 🟢 Aman */}
        <button
          onClick={() => handleStatusClick('good')}
          className={`py-1 px-2.5 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-90 ${
            item.status === 'good'
              ? 'bg-emerald-600 text-white shadow-xs font-black animate-pill-pop'
              : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/50'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-transform duration-200 ${
              item.status === 'good' ? 'bg-white scale-110' : 'bg-emerald-500'
            }`}
          />
          <span>Aman</span>
        </button>
      </div>
    </div>
  );
};
