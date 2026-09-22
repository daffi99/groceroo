import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryChips } from './components/CategoryChips';
import { StockCard } from './components/StockCard';
import { ShoppingView } from './components/ShoppingView';
import { ManageItemsView } from './components/ManageItemsView';
import { SettingsView } from './components/SettingsView';
import { ItemModal } from './components/ItemModal';
import { IosInstallGuide } from './components/IosInstallGuide';
import { ViewMode, FilterStatus, StockStatus, InventoryItem, Category } from './types/inventory';
import {
  clearLegacyStorage,
  clearStoredPin,
  getStoredPin,
  saveStoredPin,
} from './services/storage';
import { DEFAULT_CATEGORIES, DEFAULT_ITEMS, sortCategories } from './data/defaultData';
import { Filter, ShoppingBag, ArrowRight } from 'lucide-react';
import { CategoryIcon } from './components/CategoryIcon';
import { PinScreen } from './components/PinScreen';
import { SkeletonView } from './components/SkeletonView';
import { fetchRemoteData, syncLocalToRemote } from './services/apiSync';

export function App() {
  const [categories, setCategories] = useState<Category[]>(() => sortCategories(DEFAULT_CATEGORIES));
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('inventory');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  
  // PIN & Cloud Sync State
  const [isPinUnlocked, setIsPinUnlocked] = useState(() => {
    return !!getStoredPin();
  });
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal state for Add/Edit
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [activeAddCategoryId, setActiveAddCategoryId] = useState<string | undefined>(undefined);

  // Clear any legacy localStorage items/categories on startup
  useEffect(() => {
    clearLegacyStorage();
  }, []);

  // Initial cloud fetch from Neon when PIN unlocked
  useEffect(() => {
    if (!isPinUnlocked) return;

    setIsLoading(true);
    fetchRemoteData()
      .then((res) => {
        if (res.synced) {
          setIsCloudSynced(true);
          if (res.categories && res.categories.length > 0) {
            setCategories(sortCategories(res.categories));
          }
          if (res.items) {
            setItems(res.items);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isPinUnlocked]);

  // Manual Force Refresh triggered when clicking Groceroo Logo
  const handleForceRefresh = () => {
    if (isRefreshing || isLoading) return;
    setIsRefreshing(true);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
    fetchRemoteData()
      .then((res) => {
        if (res.synced) {
          setIsCloudSynced(true);
          if (res.categories && res.categories.length > 0) {
            setCategories(sortCategories(res.categories));
          }
          if (res.items) {
            setItems(res.items);
          }
        }
      })
      .finally(() => {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 400);
      });
  };

  // Sync to Neon when items change (optimistic + remote)
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
    clearStoredPin();
    setIsPinUnlocked(false);
    setItems([]);
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
      setCategories(DEFAULT_CATEGORIES);
      setItems(DEFAULT_ITEMS);
      setSelectedCategoryId(null);
      setSearchQuery('');
      setStatusFilter('all');
      syncToCloud(DEFAULT_ITEMS);
    }
  };

  const handleSaveCategory = (categoryData: {
    id?: string;
    name: string;
    iconName: string;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    badgeColor: string;
  }) => {
    let savedCat: Category;
    let updatedCategories: Category[];

    if (categoryData.id) {
      savedCat = {
        id: categoryData.id,
        name: categoryData.name,
        iconName: categoryData.iconName,
        emoji: '',
        accentColor: categoryData.accentColor,
        bgColor: categoryData.bgColor,
        borderColor: categoryData.borderColor,
        textColor: categoryData.textColor,
        badgeColor: categoryData.badgeColor,
      };
      updatedCategories = categories.map((c) => (c.id === categoryData.id ? savedCat : c));
    } else {
      const newId = `cat-${Date.now()}`;
      savedCat = {
        id: newId,
        name: categoryData.name,
        iconName: categoryData.iconName,
        emoji: '',
        accentColor: categoryData.accentColor,
        bgColor: categoryData.bgColor,
        borderColor: categoryData.borderColor,
        textColor: categoryData.textColor,
        badgeColor: categoryData.badgeColor,
      };
      updatedCategories = [...categories, savedCat];
    }

    const sorted = sortCategories(updatedCategories);
    setCategories(sorted);

    // Sync to Neon DB
    syncLocalToRemote({ categories: [savedCat] }).then((res) => {
      if (res.synced) setIsCloudSynced(true);
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter((c) => c.id !== categoryId);
    const updatedItems = items.filter((i) => i.categoryId !== categoryId);

    setCategories(sortCategories(updatedCategories));
    setItems(updatedItems);

    // Sync to Neon DB (both category delete and cascade)
    syncLocalToRemote({
      categories: updatedCategories,
      deletedCategoryIds: [categoryId],
      items: updatedItems,
    }).then((res) => {
      if (res.synced) setIsCloudSynced(true);
    });
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
        onSuccess={(pin) => {
          saveStoredPin(pin);
          setIsPinUnlocked(true);
        }}
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
        onOpenSettings={() => setViewMode(viewMode === 'settings' ? 'inventory' : 'settings')}
        onRefresh={handleForceRefresh}
        isRefreshing={isRefreshing || isLoading}
      />

      {/* Main View Switcher with Smooth Transition Animation */}
      <div key={viewMode + (isLoading || isRefreshing ? '-loading' : '')} className="tab-content-enter flex-1 flex flex-col">
        {isLoading || isRefreshing ? (
          /* Loading Skeleton when loading or refreshing from Neon Cloud */
          <SkeletonView />
        ) : viewMode === 'settings' ? (
          /* 1. DEDICATED SETTINGS PAGE (Pengaturan & Kelola Kategori) */
          <SettingsView
            categories={categories}
            items={items}
            onBack={() => setViewMode('inventory')}
            onLock={handleLockPantry}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
            onResetData={handleResetData}
            isCloudSynced={isCloudSynced}
          />
        ) : viewMode === 'shopping' ? (
          /* 2. SHOPPING MODE (Mode Belanja) */
          <ShoppingView
            items={items}
            categories={categories}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : viewMode === 'manage' ? (
          /* 3. DEDICATED CRUD PAGE (Kelola Daftar Barang) */
          <ManageItemsView
            items={items}
            categories={categories}
            onOpenAddModal={() => handleOpenAddModal()}
            onOpenEditModal={handleOpenEditModal}
            onDeleteItem={handleDeleteItem}
            onResetData={handleResetData}
          />
        ) : (
          /* 4. PANTRY INVENTORY (Cek Stok Satu Baris per Barang) */
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

      {/* Floating Bottom Bar: Clean & Minimal iOS Action Pill */}
      {viewMode === 'inventory' && (counts.out > 0 || counts.low > 0) && (
        <div className="fixed bottom-5 left-4 right-4 max-w-sm mx-auto z-20">
          <button
            onClick={() => setViewMode('shopping')}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-2xl font-bold shadow-xl shadow-slate-900/25 border border-slate-800 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Mode Belanja
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black">
              <span>{counts.out + counts.low} Barang</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </button>
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
