import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Category, InventoryItem, StockStatus } from '../types/inventory';
import { CategoryIcon } from './CategoryIcon';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialItem?: InventoryItem | null;
  defaultCategoryId?: string;
  onSave: (
    name: string,
    categoryId: string,
    status: StockStatus,
    id?: string
  ) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialItem,
  defaultCategoryId,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<StockStatus>('out');

  const isEditMode = !!initialItem;

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setCategoryId(initialItem.categoryId);
      setStatus(initialItem.status);
    } else {
      setName('');
      setCategoryId(defaultCategoryId || categories[0]?.id || 'kitchen-spices');
      setStatus('out');
    }
  }, [initialItem, defaultCategoryId, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(name.trim(), categoryId, status, initialItem?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {isEditMode ? 'Edit Barang' : 'Tambah Barang Baru'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEditMode ? 'Perbarui nama atau kategori barang' : 'Masukkan ke daftar stok dapur'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Barang <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Contoh: Bawang Putih, Minyak Goreng, Sabun Mandi..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
            />
          </div>

          {/* Category Picker (Chips Grid) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Kategori
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-2 rounded-xl text-xs font-bold border text-left flex items-center gap-2 transition-all ${
                    categoryId === cat.id
                      ? `${cat.bgColor} ${cat.borderColor} ${cat.textColor} ring-2 ring-emerald-500/30`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Status Stok
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/90 rounded-full">
              {/* 🔴 Habis */}
              <button
                type="button"
                onClick={() => setStatus('out')}
                className={`py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  status === 'out'
                    ? 'bg-rose-500 text-white shadow-xs font-black'
                    : 'text-slate-500 hover:text-rose-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    status === 'out' ? 'bg-white' : 'bg-rose-500'
                  }`}
                />
                <span>Habis</span>
              </button>

              {/* 🟡 Menipis */}
              <button
                type="button"
                onClick={() => setStatus('low')}
                className={`py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  status === 'low'
                    ? 'bg-amber-400 text-amber-950 shadow-xs font-black'
                    : 'text-slate-500 hover:text-amber-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    status === 'low' ? 'bg-amber-950' : 'bg-amber-500'
                  }`}
                />
                <span>Menipis</span>
              </button>

              {/* 🟢 Aman */}
              <button
                type="button"
                onClick={() => setStatus('good')}
                className={`py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  status === 'good'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-500 hover:text-emerald-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    status === 'good' ? 'bg-white' : 'bg-emerald-500'
                  }`}
                />
                <span>Aman</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition"
            >
              {isEditMode ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tambah Barang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
