import React, { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, RotateCcw, Package } from 'lucide-react';
import { Category, InventoryItem } from '../types/inventory';
import { CategoryIcon } from './CategoryIcon';

interface ManageItemsViewProps {
  items: InventoryItem[];
  categories: Category[];
  onOpenAddModal: () => void;
  onOpenEditModal: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onResetData: () => void;
}

export const ManageItemsView: React.FC<ManageItemsViewProps> = ({
  items,
  categories,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteItem,
  onResetData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCatId && item.categoryId !== selectedCatId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, selectedCatId, searchQuery]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-24">
      {/* Top Title & Add Button */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs mb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                Kelola Daftar Barang
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Total {items.length} barang terdaftar
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari barang untuk diedit / dihapus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-100/90 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
          <button
            onClick={() => setSelectedCatId(null)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition ${
              selectedCatId === null
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id).length;
            const isSelected = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(isSelected ? null : cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition flex items-center gap-1 ${
                  isSelected
                    ? `${cat.bgColor} ${cat.textColor} ring-1 ring-emerald-500`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CategoryIcon name={cat.iconName} className="w-3 h-3" />
                <span>{cat.name}</span>
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Item List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredItems.map((item) => {
          const cat = categoryMap.get(item.categoryId);
          return (
            <div
              key={item.id}
              className="px-4 py-3 flex items-center justify-between gap-2.5 hover:bg-slate-50/70 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                  {item.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {cat && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${cat.bgColor} ${cat.textColor}`}
                    >
                      <CategoryIcon name={cat.iconName} className="w-3 h-3" />
                      <span>{cat.name}</span>
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.status === 'out'
                        ? 'bg-rose-100 text-rose-700'
                        : item.status === 'low'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status === 'out' ? 'Habis' : item.status === 'low' ? 'Menipis' : 'Aman'}
                  </span>
                </div>
              </div>

              {/* CRUD Actions: Edit and Delete */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onOpenEditModal(item)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 flex items-center justify-center transition"
                  title="Edit Barang"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 flex items-center justify-center transition"
                  title="Hapus Barang"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="py-10 text-center text-slate-400 text-xs">
            Tidak ada barang yang cocok dengan pencarian atau kategori ini.
          </div>
        )}
      </div>

      {/* Reset Data Danger Zone button */}
      <div className="mt-6 text-center">
        <button
          onClick={onResetData}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-600 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kembalikan Contoh Barang Bawaan Pabrik</span>
        </button>
      </div>
    </div>
  );
};
