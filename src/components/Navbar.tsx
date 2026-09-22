import React from 'react';
import { ShoppingBag, ClipboardList, SlidersHorizontal, Search, Lock } from 'lucide-react';
import { ViewMode } from '../types/inventory';

interface NavbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  outCount: number;
  lowCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isCloudSynced?: boolean;
  onLock?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onViewModeChange,
  outCount,
  lowCount,
  searchQuery,
  onSearchChange,
  isCloudSynced,
  onLock,
  onRefresh,
  isRefreshing,
}) => {
  const needsBuyingCount = outCount + lowCount;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      {/* Top Brand Bar */}
      <div className="max-w-md mx-auto px-4 pt-3 pb-2 flex items-center justify-between">
        {/* Clickable Logo Button for Force Cloud Sync */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2.5 text-left active:scale-95 transition group cursor-pointer"
          title="Klik logo untuk refresh data dari cloud Neon"
        >
          {/* Logo image with spinning indicator on refresh */}
          <div className="relative shrink-0">
            <img
              src="/logo_groceroo.png"
              alt="Groceroo"
              className={`w-10 h-10 rounded-2xl object-cover shadow-sm shadow-emerald-600/20 transition-all duration-300 ${
                isRefreshing ? 'animate-spin opacity-80 scale-95' : 'group-hover:scale-105'
              }`}
            />
            {isRefreshing && (
              <span className="absolute inset-0 rounded-2xl ring-2 ring-emerald-500 animate-ping" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                Grocer<span className="text-emerald-500">oo</span>
              </h1>
              {isCloudSynced && (
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isRefreshing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500 shadow-xs'
                  }`}
                  title={isRefreshing ? 'Menyinkronkan...' : 'Neon DB Terhubung'}
                />
              )}
            </div>
            <p className="text-[11px] font-medium text-slate-400 truncate">
              {isRefreshing ? (
                <span className="text-emerald-600 font-bold animate-pulse">Menyinkronkan stok...</span>
              ) : (
                <span>Pantry & Smart Grocery</span>
              )}
            </p>
          </div>
        </button>

        {/* Right Status Pill Badge & Lock */}
        <div className="flex items-center gap-1.5">
          {needsBuyingCount > 0 ? (
            <div className="px-3 py-1 rounded-full bg-rose-50 border border-rose-100/80 text-rose-600 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>{needsBuyingCount} perlu dibeli</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/80 text-emerald-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Stok aman</span>
            </div>
          )}
          {onLock && (
            <button
              onClick={onLock}
              title="Kunci Pantry PIN"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Segmented Tab Controls: Cek Stok | Belanja | Kelola */}
      <div className="max-w-md mx-auto px-4 pb-2.5">
        <div className="p-1 bg-slate-100/90 rounded-2xl flex items-center gap-1">
          {/* Tab 1: Cek Stok */}
          <button
            onClick={() => onViewModeChange('inventory')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'inventory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-slate-700" />
            <span>Cek Stok</span>
          </button>

          {/* Tab 2: Belanja */}
          <button
            onClick={() => onViewModeChange('shopping')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'shopping'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-slate-700" />
            <span>Belanja</span>
            {needsBuyingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-rose-500 text-white leading-tight">
                {needsBuyingCount}
              </span>
            )}
          </button>

          {/* Tab 3: Kelola */}
          <button
            onClick={() => onViewModeChange('manage')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'manage'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-700" />
            <span>Kelola</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      {viewMode === 'inventory' && (
        <div className="max-w-md mx-auto px-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari bumbu, sayur, sabun..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100/80 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
