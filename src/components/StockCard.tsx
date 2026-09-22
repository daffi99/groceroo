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

      {/* Capsule Segmented Control (Compact & space-saving) */}
      <div className="flex items-center gap-1 p-0.5 bg-slate-100/90 rounded-full shrink-0">
        {/* 🔴 Habis */}
        <button
          onClick={() => handleStatusClick('out')}
          title="Habis"
          className={`transition-all duration-200 flex items-center justify-center active:scale-90 ${
            item.status === 'out'
              ? 'py-1 px-2.5 rounded-full text-[11px] font-black bg-rose-500 text-white shadow-xs gap-1.5 animate-pill-pop'
              : 'w-7 h-7 rounded-full hover:bg-slate-200/60'
          }`}
        >
          <span
            className={`rounded-full transition-all duration-200 ${
              item.status === 'out' ? 'w-1.5 h-1.5 bg-white scale-110' : 'w-2 h-2 bg-rose-400 hover:scale-125'
            }`}
          />
          {item.status === 'out' && <span>Habis</span>}
        </button>

        {/* 🟡 Menipis */}
        <button
          onClick={() => handleStatusClick('low')}
          title="Menipis"
          className={`transition-all duration-200 flex items-center justify-center active:scale-90 ${
            item.status === 'low'
              ? 'py-1 px-2.5 rounded-full text-[11px] font-black bg-amber-400 text-amber-950 shadow-xs gap-1.5 animate-pill-pop'
              : 'w-7 h-7 rounded-full hover:bg-slate-200/60'
          }`}
        >
          <span
            className={`rounded-full transition-all duration-200 ${
              item.status === 'low' ? 'w-1.5 h-1.5 bg-amber-950 scale-110' : 'w-2 h-2 bg-amber-400 hover:scale-125'
            }`}
          />
          {item.status === 'low' && <span>Menipis</span>}
        </button>

        {/* 🟢 Aman */}
        <button
          onClick={() => handleStatusClick('good')}
          title="Aman"
          className={`transition-all duration-200 flex items-center justify-center active:scale-90 ${
            item.status === 'good'
              ? 'py-1 px-2.5 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-xs gap-1.5 animate-pill-pop'
              : 'w-7 h-7 rounded-full hover:bg-slate-200/60'
          }`}
        >
          <span
            className={`rounded-full transition-all duration-200 ${
              item.status === 'good' ? 'w-1.5 h-1.5 bg-white scale-110' : 'w-2 h-2 bg-emerald-500 hover:scale-125'
            }`}
          />
          {item.status === 'good' && <span>Aman</span>}
        </button>
      </div>
    </div>
  );
};
