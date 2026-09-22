import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Plus,
  Pencil,
  Trash2,
  Database,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Category, InventoryItem } from '../types/inventory';
import { CategoryIcon } from './CategoryIcon';
import { CategoryModal } from './CategoryModal';

interface SettingsViewProps {
  categories: Category[];
  items: InventoryItem[];
  onBack: () => void;
  onLock: () => void;
  onSaveCategory: (categoryData: {
    id?: string;
    name: string;
    iconName: string;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    badgeColor: string;
  }) => void;
  onDeleteCategory: (categoryId: string) => void;
  onResetData: () => void;
  isCloudSynced?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  categories,
  items,
  onBack,
  onLock,
  onSaveCategory,
  onDeleteCategory,
  onResetData,
  isCloudSynced,
}) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteClick = (cat: Category) => {
    const itemCount = items.filter((i) => i.categoryId === cat.id).length;
    const confirmMsg =
      itemCount > 0
        ? `Hapus kategori "${cat.name}"? PERINGATAN: ${itemCount} barang di dalamnya juga akan terhapus dari database Neon.`
        : `Hapus kategori "${cat.name}"?`;

    if (window.confirm(confirmMsg)) {
      onDeleteCategory(cat.id);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 pb-24 overflow-x-hidden space-y-4 animate-in fade-in duration-200">
      {/* Top Header Bar with Back Button */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
          Pengaturan Pantry
        </h2>

        <div className="w-16" /> {/* spacer */}
      </div>

      {/* Card 1: Security & Lock PIN */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                Kunci Akses Pantry
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Kunci aplikasi agar memerlukan PIN 6-digit kembali
              </p>
            </div>
          </div>

          <button
            onClick={onLock}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 text-xs font-bold transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kunci</span>
          </button>
        </div>

        {/* Cloud DB Status Pill */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Database Neon Cloud</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isCloudSynced ? 'Terhubung & Sinkron' : 'Aktif'}</span>
          </span>
        </div>
      </div>

      {/* Card 2: Kelola Kategori (CRUD Kategori) */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
              <span>Kelola Kategori</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Total {categories.length} kategori aktif
            </p>
          </div>

          <button
            onClick={handleOpenAddCategory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Kategori Baru</span>
          </button>
        </div>

        {/* Category List */}
        <div className="divide-y divide-slate-100">
          {categories.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-1.5 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cat.bgColor} ${cat.textColor}`}
                  >
                    <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {count} barang
                    </div>
                  </div>
                </div>

                {/* Category Action buttons: Edit & Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditCategory(cat)}
                    className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 flex items-center justify-center transition active:scale-95 cursor-pointer"
                    title="Edit Kategori"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cat)}
                    className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 flex items-center justify-center transition active:scale-95 cursor-pointer"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card 3: Danger Zone / Reset */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs text-center space-y-2">
        <p className="text-[11px] text-slate-400">
          Groceroo PWA • Data disimpan langsung di database Neon Cloud.
        </p>
        <button
          onClick={onResetData}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 py-1.5 px-3 rounded-xl hover:bg-rose-50 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kembalikan Contoh Kategori & Barang Bawaan</span>
        </button>
      </div>

      {/* Category Add/Edit Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        initialCategory={editingCategory}
        onSave={onSaveCategory}
      />
    </div>
  );
};
