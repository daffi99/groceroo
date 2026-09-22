export type StockStatus = 'out' | 'low' | 'good';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  emoji: string;
  accentColor: string;      // vibrant accent e.g. green, blue, amber
  bgColor: string;          // background color class
  borderColor: string;      // border class
  textColor: string;        // text class
  badgeColor: string;       // badge chip background
}

export interface InventoryItem {
  id: string;
  name: string;
  categoryId: string;
  status: StockStatus;
  unit?: string;            // e.g. '1 pouch', '1 kg', '1 botol'
  note?: string;            // e.g. 'merek biasa', 'beli 2 gratis 1'
  lastRestocked?: string;   // ISO date string
}

export type ViewMode = 'inventory' | 'shopping' | 'manage' | 'settings';
export type FilterStatus = 'all' | 'out' | 'low' | 'good';
