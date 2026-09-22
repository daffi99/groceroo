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
      className={`py-1.5 px-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-2 bg-white ${
        item.status === 'out'
          ? 'border-rose-300/80 bg-rose-50/20 shadow-2xs'
          : item.status === 'low'
          ? 'border-amber-300/80 bg-amber-50/20 shadow-2xs'
          : 'border-slate-200/80 bg-white hover:border-slate-300'
      }`}
    >
      {/* Item Thumbnail & Name (Compact & clear) */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-6 h-6 rounded-md object-cover shrink-0 border border-slate-200/80 bg-slate-50"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        )}
        <span
          className={`font-bold text-xs tracking-tight truncate transition-colors duration-200 ${
            item.status === 'out'
              ? 'text-rose-950'
              : item.status === 'low'
              ? 'text-amber-950'
              : 'text-slate-800'
          }`}
        >
          {item.name}
        </span>
      </div>

      {/* Capsule Segmented Control (Mini height & compact) */}
      <div className="flex items-center gap-0.5 p-0.5 bg-slate-100/90 rounded-full shrink-0">
        {/* 🔴 Habis */}
        <button
          onClick={() => handleStatusClick('out')}
          title="Habis"
          className={`transition-all duration-150 flex items-center justify-center active:scale-90 ${
            item.status === 'out'
              ? 'py-0.5 px-2 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs gap-1 animate-pill-pop'
              : 'w-6 h-6 rounded-full hover:bg-slate-200/60'
          }`}
        >
          <span
            className={`rounded-full transition-all duration-150 ${
              item.status === 'out' ? 'w-1.5 h-1.5 bg-white scale-110' : 'w-1.5 h-1.5 bg-rose-400'
            }`}
          />
          {item.status === 'out' && <span>Habis</span>}
        </button>

        {/* 🟡 Menipis */}
        <button
          onClick={() => handleStatusClick('low')}
          title="Menipis"
          className={`transition-all duration-150 flex items-center justify-center active:scale-90 ${
            item.status === 'low'
              ? 'py-0.5 px-2 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 shadow-xs gap-1 animate-pill-pop'
              : 'w-6 h-6 rounded-full hover:bg-slate-200/60'
          }`}
        >
          <span
            className={`rounded-full transition-all duration-150 ${
              item.status === 'low' ? 'w-1.5 h-1.5 bg-amber-950 scale-110' : 'w-1.5 h-1.5 bg-amber-400'
            }`}
          />
          {item.status === 'low' && <span>Menipis</span>}
        </button>

        {/* 🟢 Aman */}
        <button
          onClick={() => handleStatusClick('good')}
          title="Aman"
          className={`transition-all duration-150 flex items-center justify-center active:scale-90 ${
            item.status === 'good'
              ? 'py-0.5 px-2 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs gap-1 animate-pill-pop'
              : 'w-6 h-6 rounded-full hover:bg-slate-200/60'
          }`}
        >
          <span
            className={`rounded-full transition-all duration-150 ${
              item.status === 'good' ? 'w-1.5 h-1.5 bg-white scale-110' : 'w-1.5 h-1.5 bg-emerald-500'
            }`}
          />
          {item.status === 'good' && <span>Aman</span>}
        </button>
      </div>
    </div>
  );
};
