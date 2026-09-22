import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Category } from '../types/inventory';
import {
  CategoryIcon,
  AVAILABLE_CATEGORY_ICONS,
  AVAILABLE_CATEGORY_COLORS,
} from './CategoryIcon';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: {
    id?: string;
    name: string;
    iconName: string;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    badgeColor: string;
  }) => void;
  initialCategory?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCategory,
}) => {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('Leaf');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setIconName(initialCategory.iconName || 'Leaf');
      const foundIdx = AVAILABLE_CATEGORY_COLORS.findIndex(
        (c) => c.accentColor.toLowerCase() === initialCategory.accentColor?.toLowerCase()
      );
      setSelectedColorIndex(foundIdx !== -1 ? foundIdx : 0);
    } else {
      setName('');
      setIconName('Leaf');
      setSelectedColorIndex(0);
    }
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  const activeColor = AVAILABLE_CATEGORY_COLORS[selectedColorIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialCategory ? initialCategory.id : undefined,
      name: name.trim(),
      iconName,
      accentColor: activeColor.accentColor,
      bgColor: activeColor.bgColor,
      borderColor: activeColor.borderColor,
      textColor: activeColor.textColor,
      badgeColor: activeColor.badgeColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-base font-extrabold text-slate-900">
            {initialCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Live Preview */}
          <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400">Preview Tampilan:</span>
            <div
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${activeColor.bgColor} ${activeColor.borderColor} ${activeColor.textColor}`}
            >
              <CategoryIcon name={iconName} className="w-3.5 h-3.5" />
              <span>{name.trim() || 'Nama Kategori'}</span>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Kategori
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Makanan Beku, Obat P3K"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-100/90 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition"
            />
          </div>

          {/* Icon Selector Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Ikon
            </label>
            <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-100 no-scrollbar">
              {AVAILABLE_CATEGORY_ICONS.map((ico) => {
                const isSelected = iconName.toLowerCase() === ico.name.toLowerCase();
                return (
                  <button
                    type="button"
                    key={ico.name}
                    onClick={() => setIconName(ico.name)}
                    className={`p-2 rounded-xl text-xs flex flex-col items-center gap-1 transition active:scale-90 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    <CategoryIcon name={ico.name} className="w-4 h-4" />
                    <span className="text-[9.5px] font-semibold truncate w-full text-center">
                      {ico.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Warna Tema
            </label>
            <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
              {AVAILABLE_CATEGORY_COLORS.map((col, idx) => {
                const isSelected = selectedColorIndex === idx;
                return (
                  <button
                    type="button"
                    key={col.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    style={{ backgroundColor: col.accentColor }}
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition active:scale-90 shadow-2xs ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition active:scale-95"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition"
            >
              {initialCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
