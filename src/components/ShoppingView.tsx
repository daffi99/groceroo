import React, { useState } from 'react';
import { Check, CheckCircle2, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { Category, InventoryItem, StockStatus } from '../types/inventory';
import { CategoryIcon } from './CategoryIcon';

interface ShoppingViewProps {
  items: InventoryItem[];
  categories: Category[];
  onUpdateStatus: (id: string, status: StockStatus) => void;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({
  items,
  categories,
  onUpdateStatus,
}) => {
  // Track recently checked item IDs in this session to show them completed with undo option
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [showShareToast, setShowShareToast] = useState(false);

  // Items that need to be bought: status is 'out' or 'low', OR items that were checked during this session
  const activeShoppingItems = items.filter(
    (item) => item.status === 'out' || item.status === 'low' || checkedIds.has(item.id)
  );

  const totalItemsCount = activeShoppingItems.length;
  const boughtCount = activeShoppingItems.filter((i) => checkedIds.has(i.id) || i.status === 'good').length;
  const progressPercent = totalItemsCount > 0 ? Math.round((boughtCount / totalItemsCount) * 100) : 100;

  const handleToggleBought = (item: InventoryItem) => {
    const isCurrentlyChecked = checkedIds.has(item.id) || item.status === 'good';
    if (isCurrentlyChecked) {
      // Undo: revert back to 'out'
      const next = new Set(checkedIds);
      next.delete(item.id);
      setCheckedIds(next);
      onUpdateStatus(item.id, 'out');
    } else {
      // Mark as bought: status becomes 'good'
      const next = new Set(checkedIds);
      next.add(item.id);
      setCheckedIds(next);
      onUpdateStatus(item.id, 'good');
    }
  };

  const handleShareWhatsApp = () => {
    // Generate clean text
    const unbought = items.filter((i) => i.status === 'out' || i.status === 'low');
    if (unbought.length === 0) return;

    let text = `🛒 *Daftar Belanja Groceroo*\n`;
    categories.forEach((cat) => {
      const catItems = unbought.filter((i) => i.categoryId === cat.id);
      if (catItems.length > 0) {
        text += `\n*${cat.emoji} ${cat.name}*\n`;
        catItems.forEach((it) => {
          const badge = it.status === 'out' ? '🔴' : '🟡';
          text += `  • ${badge} ${it.name}\n`;
        });
      }
    });
    text += `\n_Dibuat via Groceroo App_`;

    if (navigator.share) {
      navigator.share({
        title: 'Daftar Belanjaan Groceroo',
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  // Group items by category
  const categoriesWithItems = categories
    .map((cat) => {
      const catItems = activeShoppingItems.filter((i) => i.categoryId === cat.id);
      return {
        ...cat,
        items: catItems,
      };
    })
    .filter((group) => group.items.length > 0);

  if (activeShoppingItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 flex items-center justify-center text-3xl shadow-sm mb-4">
          🎉
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-1">
          Dapur Kamu Lengkap!
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          Tidak ada barang berstatus <span className="text-rose-500 font-bold">Habis</span> atau <span className="text-amber-500 font-bold">Menipis</span>. Semua stok aman terkendali!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-24">
      {/* Toast Notification */}
      {showShareToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg z-50 animate-bounce flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Daftar belanja disalin ke clipboard!</span>
        </div>
      )}

      {/* Progress & Shopping Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Progres Belanja
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              {boughtCount} dari {totalItemsCount} Barang Terbeli
            </h3>
          </div>
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold active:scale-95 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bagikan</span>
          </button>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {progressPercent === 100 && (
          <div className="mt-3 p-2.5 bg-emerald-50 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Mantap! Semua barang di daftar sudah masuk troli.</span>
          </div>
        )}
      </div>

      {/* Aisle-by-Aisle / Category-by-Category Items */}
      <div className="space-y-4">
        {categoriesWithItems.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs"
          >
            {/* Category Banner Header */}
            <div
              className={`px-4 py-2.5 flex items-center justify-between border-b ${category.bgColor} ${category.borderColor}`}
            >
              <div className="flex items-center gap-2">
                <span className={category.textColor}>
                  <CategoryIcon name={category.iconName} className="w-4 h-4" />
                </span>
                <h4 className={`font-extrabold text-xs tracking-tight ${category.textColor}`}>
                  {category.name}
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-700 shadow-2xs">
                {category.items.filter((i) => !checkedIds.has(i.id) && i.status !== 'good').length} belum
              </span>
            </div>

            {/* Item Checklist Rows */}
            <div className="divide-y divide-slate-100">
              {category.items.map((item) => {
                const isBought = checkedIds.has(item.id) || item.status === 'good';
                const isOut = item.status === 'out';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleBought(item)}
                    className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer select-none transition-all duration-200 active:scale-[0.99] ${
                      isBought ? 'bg-slate-50/70' : 'bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox button with pop transition */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isBought
                            ? 'bg-emerald-500 text-white shadow-xs scale-105 animate-pill-pop'
                            : 'border-2 border-slate-300 hover:border-emerald-500'
                        }`}
                      >
                        {isBought && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* Name & details */}
                      <div className="min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-bold transition-all block truncate ${
                            isBought
                              ? 'line-through text-slate-400'
                              : 'text-slate-800'
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.note && (
                          <p className="text-[10px] text-slate-400 italic truncate mt-0.5">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isBought ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Terbeli</span>
                        </span>
                      ) : isOut ? (
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>Habis</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>Menipis</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick advice note */}
      <div className="mt-6 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-2.5 text-slate-600 text-xs">
        <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          Barang yang dicentang di sini otomatis diperbarui statusnya menjadi <strong className="text-emerald-700">Aman</strong> di inventaris dapur Anda.
        </p>
      </div>
    </div>
  );
};
