import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryChips } from './components/CategoryChips';
import { StockCard } from './components/StockCard';
import { ShoppingView } from './components/ShoppingView';
import { ManageItemsView } from './components/ManageItemsView';
import { ItemModal } from './components/ItemModal';
import { IosInstallGuide } from './components/IosInstallGuide';
import { ViewMode, FilterStatus, StockStatus, InventoryItem } from './types/inventory';
import {
  getStoredCategories,
  getStoredItems,
  saveStoredItems,
  resetToDefaultData,
} from './services/storage';
import { Filter, ShoppingBag, ArrowRight } from 'lucide-react';
import { CategoryIcon } from './components/CategoryIcon';
import { PinScreen } from './components/PinScreen';
import { fetchRemoteData, syncLocalToRemote } from './services/apiSync';

export function App() {
  const [categories, setCategories] = useState(getStoredCategories);
  const [items, setItems] = useState<InventoryItem[]>(getStoredItems);
  const [viewMode, setViewMode] = useState<ViewMode>('inventory');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  
  // PIN & Cloud Sync State
  const [isPinUnlocked, setIsPinUnlocked] = useState(() => {
    return !!localStorage.getItem('groceroo_pantry_pin');
  });
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Modal state for Add/Edit
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [activeAddCategoryId, setActiveAddCategoryId] = useState<string | undefined>(undefined);

  // Auto-save items to localStorage whenever they change
  useEffect(() => {
    saveStoredItems(items);
  }, [items]);

  // Initial cloud fetch from Neon when unlocked
  useEffect(() => {
    if (!isPinUnlocked) return;

    fetchRemoteData().then((res) => {
      if (res.synced) {
        setIsCloudSynced(true);
        if (res.categories && res.categories.length > 0) {
          setCategories(res.categories);
        }
        if (res.items && res.items.length > 0) {
          setItems(res.items);
        }
      }
    });
  }, [isPinUnlocked]);

  // Sync to Neon when items change (debounced)
  const syncToCloud = (updatedItems: InventoryItem[], deletedIds?: string[]) => {
    if (!isPinUnlocked) return;
    syncLocalToRemote(updatedItems, deletedIds).then((res) => {
      if (res.synced) {
        setIsCloudSynced(true);
      }
    });
  };

  // Status counts
  const counts = useMemo(() => {
    let out = 0;
    let low = 0;
    let good = 0;
    items.forEach((item) => {
      if (item.status === 'out') out++;
      else if (item.status === 'low') low++;
      else if (item.status === 'good') good++;
    });
    return { out, low, good, total: items.length };
  }, [items]);

  const getCategoryCounts = (catId: string) => {
    const catItems = items.filter((i) => i.categoryId === catId);
    return {
      out: catItems.filter((i) => i.status === 'out').length,
      low: catItems.filter((i) => i.status === 'low').length,
      total: catItems.length,
    };
  };

  // Handlers
  const handleUpdateStatus = (id: string, newStatus: StockStatus) => {
    const updated = items.map((item) =>
      item.id === id
        ? {
            ...item,
            status: newStatus,
            lastRestocked: newStatus === 'good' ? new Date().toISOString() : item.lastRestocked,
          }
        : item
    );
    setItems(updated);
    syncToCloud(updated);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Hapus barang ini dari daftar?')) {
      const updated = items.filter((item) => item.id !== id);
      setItems(updated);
      syncToCloud(updated, [id]);
    }
  };

  const handleSaveItem = (
    name: string,
    categoryId: string,
    status: StockStatus,
    id?: string
  ) => {
    let updated: InventoryItem[];
    if (id) {
      // Edit existing item
      updated = items.map((item) =>
        item.id === id
          ? {
              ...item,
              name,
              categoryId,
              status,
            }
          : item
      );
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: `item-${Date.now()}`,
        name,
        categoryId,
        status,
        lastRestocked: status === 'good' ? new Date().toISOString() : undefined,
      };
      updated = [newItem, ...items];
    }
    setItems(updated);
    syncToCloud(updated);
  };

  const handleLockPantry = () => {
    localStorage.removeItem('groceroo_pantry_pin');
    setIsPinUnlocked(false);
  };

  const handleOpenAddModal = (catId?: string) => {
    setEditingItem(null);
    setActiveAddCategoryId(catId || selectedCategoryId || undefined);
    setIsItemModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Kembalikan semua daftar ke contoh bawaan awal?')) {
      const reset = resetToDefaultData();
      setCategories(reset.categories);
      setItems(reset.items);
      setSelectedCategoryId(null);
      setSearchQuery('');
      setStatusFilter('all');
    }
  };

  // Filtered Items for Inventory View
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategoryId && item.categoryId !== selectedCategoryId) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, selectedCategoryId, statusFilter, searchQuery]);

  // Active categories for rendering
  const activeCategories = useMemo(() => {
    if (selectedCategoryId) {
      return categories.filter((c) => c.id === selectedCategoryId);
    }
    return categories;
  }, [categories, selectedCategoryId]);

  if (!isPinUnlocked) {
    return (
      <PinScreen
        onSuccess={() => setIsPinUnlocked(true)}
        onSkipOffline={() => setIsPinUnlocked(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans pb-12">
      {/* Top iOS Header & Mode Switcher */}
      <Navbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        outCount={counts.out}
        lowCount={counts.low}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isCloudSynced={isCloudSynced}
        onLock={handleLockPantry}
      />

      {/* Main View Switcher with Smooth Transition Animation */}
      <div key={viewMode} className="tab-content-enter flex-1 flex flex-col">
        {viewMode === 'shopping' ? (
          /* 1. SHOPPING MODE (Mode Belanja) */
          <ShoppingView
            items={items}
            categories={categories}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : viewMode === 'manage' ? (
          /* 2. DEDICATED CRUD PAGE (Kelola Daftar Barang) */
          <ManageItemsView
            items={items}
            categories={categories}
            onOpenAddModal={() => handleOpenAddModal()}
            onOpenEditModal={handleOpenEditModal}
            onDeleteItem={handleDeleteItem}
            onResetData={handleResetData}
          />
        ) : (
          /* 3. PANTRY INVENTORY (Cek Stok Satu Baris per Barang) */
          <main className="flex-1 max-w-md mx-auto w-full px-4 pt-1 pb-24">
          {/* Quick Summary Status Bar (3 Columns matching screenshot) */}
          <div className="mb-3 grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setStatusFilter(statusFilter === 'out' ? 'all' : 'out')}
              className={`p-3 rounded-2xl border text-center transition-all bg-white shadow-xs ${
                statusFilter === 'out'
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-extrabold tracking-wider text-rose-500 flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>HABIS</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{counts.out}</div>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'low' ? 'all' : 'low')}
              className={`p-3 rounded-2xl border text-center transition-all bg-white shadow-xs ${
                statusFilter === 'low'
                  ? 'border-amber-400 ring-2 ring-amber-400/20'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-extrabold tracking-wider text-amber-500 flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>MENIPIS</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{counts.low}</div>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'good' ? 'all' : 'good')}
              className={`p-3 rounded-2xl border text-center transition-all bg-white shadow-xs ${
                statusFilter === 'good'
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-extrabold tracking-wider text-emerald-600 flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>AMAN</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{counts.good}</div>
            </button>
          </div>

          {/* Quick Filter Info */}
          {statusFilter !== 'all' && (
            <div className="mb-2.5 flex items-center justify-between px-3 py-1.5 bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 truncate">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Filter: {statusFilter === 'out' ? '🔴 Habis' : statusFilter === 'low' ? '🟡 Menipis' : '🟢 Aman'}</span>
              </span>
              <button
                onClick={() => setStatusFilter('all')}
                className="text-emerald-700 font-bold hover:underline shrink-0"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Category Chips Bar */}
          <div className="-mx-4 mb-3">
            <CategoryChips
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              getCategoryCounts={getCategoryCounts}
            />
          </div>

          {/* Category-Grouped Item Cards */}
          <div className="space-y-4">
            {activeCategories.map((category) => {
              const catItems = filteredItems.filter((i) => i.categoryId === category.id);
              if (catItems.length === 0 && (selectedCategoryId || searchQuery || statusFilter !== 'all')) {
                return null;
              }

              return (
                <section
                  key={category.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs"
                >
                  {/* Category Header with Lucide Icon */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={category.textColor}>
                        <CategoryIcon name={category.iconName} className="w-4 h-4" />
                      </span>
                      <h3 className="font-extrabold text-sm tracking-tight text-slate-900">
                        {category.name}
                      </h3>
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      {catItems.length} barang
                    </span>
                  </div>

                  {/* List of 1-Line Item Cards */}
                  {catItems.length === 0 ? (
                    <div className="py-4 text-center text-slate-400 text-xs">
                      Tidak ada barang di kategori ini.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {catItems.map((item) => (
                        <StockCard
                          key={item.id}
                          item={item}
                          onUpdateStatus={handleUpdateStatus}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-2xl text-slate-400 mb-2">
                  🔍
                </div>
                <h4 className="text-xs font-bold text-slate-700">
                  Tidak Ada Barang Ditemukan
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Coba sesuaikan pencarian atau reset filter.
                </p>
              </div>
            )}
          </div>
        </main>
      )}
      </div>

      {/* Floating Bottom Bar: Sleek Premium Action Pill */}
      {viewMode === 'inventory' && (counts.out > 0 || counts.low > 0) && (
        <div className="fixed bottom-5 left-4 right-4 max-w-md mx-auto z-20">
          <div className="relative group">
            {/* Ambient soft glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full blur-md opacity-40 group-hover:opacity-60 transition duration-300" />

            {/* Main Interactive Button */}
            <button
              onClick={() => setViewMode('shopping')}
              className="relative w-full py-2 px-3 sm:px-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:brightness-105 active:scale-[0.98] text-white rounded-full font-bold shadow-xl shadow-emerald-700/25 border border-white/25 flex items-center justify-between transition-all"
            >
              {/* Left: Lucide Icon + Title + Counter */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/20 shadow-xs">
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="text-left truncate">
                  <div className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-2">
                    <span>Buka Belanjaan Toko</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs border border-white/20 shadow-2xs">
                      {counts.out + counts.low} barang
                    </span>
                  </div>
                  <div className="text-[10px] font-medium text-emerald-100/90 leading-tight">
                    Siap dicek di supermarket
                  </div>
                </div>
              </div>

              {/* Right: Frosted Capsule Action Button */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-emerald-800 text-xs font-black shadow-sm shrink-0 active:bg-slate-100 transition">
                <span>Lihat List</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Modal for adding or editing items */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        categories={categories}
        initialItem={editingItem}
        defaultCategoryId={activeAddCategoryId}
        onSave={handleSaveItem}
      />

      {/* iOS Safari PWA Install Banner */}
      <IosInstallGuide />
    </div>
  );
}

export default App;
