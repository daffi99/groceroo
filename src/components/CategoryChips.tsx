import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { Category } from '../types/inventory';
import { CategoryIcon } from './CategoryIcon';

interface CategoryChipsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  getCategoryCounts: (catId: string) => { out: number; low: number; total: number };
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  getCategoryCounts,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1 px-4 flex items-center gap-2 max-w-md mx-auto">
      {/* "Semua Kategori" Pill */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-2xs ${
          selectedCategoryId === null
            ? 'bg-slate-950 text-white border border-slate-950'
            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>Semua Kategori</span>
      </button>

      {/* Category Pills with Lucide Icons */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        const counts = getCategoryCounts(cat.id);
        const urgentCount = counts.out + counts.low;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(isSelected ? null : cat.id)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-2xs ${
              isSelected
                ? 'bg-slate-900 text-white border border-slate-900 ring-2 ring-emerald-500/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={isSelected ? 'text-white' : cat.textColor}>
              <CategoryIcon name={cat.iconName || cat.id} className="w-3.5 h-3.5" />
            </span>
            <span>{cat.name}</span>

            {/* Red Circle Counter Badge (like "3" in screenshot) */}
            {urgentCount > 0 && (
              <span
                className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                  isSelected ? 'bg-white text-slate-900' : 'bg-rose-500 text-white'
                }`}
              >
                {urgentCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
