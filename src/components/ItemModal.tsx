import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
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
    id?: string,
    imageUrl?: string
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
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  // Image search states
  const [isSearchingImage, setIsSearchingImage] = useState(false);
  const [imageResults, setImageResults] = useState<{ id: string; title: string; thumbnail: string; url: string }[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  const isEditMode = !!initialItem;

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setCategoryId(initialItem.categoryId);
      setStatus(initialItem.status);
      setImageUrl(initialItem.imageUrl);
    } else {
      setName('');
      setCategoryId(defaultCategoryId || categories[0]?.id || 'kitchen-spices');
      setStatus('out');
      setImageUrl(undefined);
    }
    setImageResults([]);
    setShowImagePicker(false);
    setSearchError('');
    setCustomSearchQuery('');
  }, [initialItem, defaultCategoryId, categories, isOpen]);

  if (!isOpen) return null;

  const handleSearchImage = async (queryOverride?: string) => {
    const effectiveQuery = typeof queryOverride === 'string' && queryOverride.trim() !== ''
      ? queryOverride.trim()
      : customSearchQuery.trim() || name.trim();

    if (!effectiveQuery) {
      setSearchError('Ketik nama barang terlebih dahulu untuk mencari gambar.');
      return;
    }

    setIsSearchingImage(true);
    setSearchError('');
    setShowImagePicker(true);
    try {
      const res = await fetch(`/api/search-image?q=${encodeURIComponent(effectiveQuery)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.images && data.images.length > 0) {
        setImageResults(data.images);
      } else {
        setSearchError('Tidak ditemukan gambar untuk kata kunci ini.');
      }
    } catch {
      setSearchError('Gagal mencari gambar. Coba lagi atau masukkan kata kunci lain.');
    } finally {
      setIsSearchingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(name.trim(), categoryId, status, initialItem?.id, imageUrl);
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

          {/* Product Image Section */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Foto Produk</span>
                <span className="text-[10px] font-normal text-slate-400">(Opsional)</span>
              </label>

              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl(undefined)}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition"
                >
                  Hapus Foto
                </button>
              )}
            </div>

            {/* Current Selected Image or Search Trigger */}
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <div className="relative group shrink-0">
                  <img
                    src={imageUrl}
                    alt={name || 'Produk'}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs bg-white"
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-5 h-5 opacity-60" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleSearchImage()}
                  disabled={isSearchingImage}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition disabled:opacity-50"
                >
                  {isSearchingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Mencari Gambar...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{imageUrl ? 'Ganti / Cari Gambar Lain' : 'Cari Gambar Otomatis'}</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 mt-1 truncate">
                  {name ? `Pencarian untuk: "${customSearchQuery || name}"` : 'Ketik nama barang lalu klik cari'}
                </p>
              </div>
            </div>

            {/* Image Options Selection Grid */}
            {showImagePicker && (
              <div className="mt-3 pt-3 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    type="text"
                    placeholder="Kata kunci lain (cth: Jeruk nipis, Indomie goreng)..."
                    value={customSearchQuery}
                    onChange={(e) => setCustomSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchImage(customSearchQuery);
                      }
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSearchImage(customSearchQuery)}
                    className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition shrink-0"
                  >
                    Cari
                  </button>
                </div>

                {searchError && (
                  <p className="text-[11px] text-rose-500 font-medium py-1">{searchError}</p>
                )}

                {imageResults.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                      Pilih salah satu gambar di bawah:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {imageResults.map((img) => {
                        const isSelected = imageUrl === img.url || imageUrl === img.thumbnail;
                        return (
                          <button
                            type="button"
                            key={img.id}
                            onClick={() => {
                              setImageUrl(img.thumbnail || img.url);
                              setShowImagePicker(false);
                            }}
                            className={`relative group rounded-xl overflow-hidden border-2 aspect-square bg-white transition-all active:scale-95 ${
                              isSelected
                                ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <img
                              src={img.thumbnail}
                              alt={img.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
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
