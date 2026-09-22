import { Category, InventoryItem } from '../types/inventory';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'kitchen-spices',
    name: 'Bumbu & Dapur',
    iconName: 'Leaf',
    emoji: '',
    accentColor: '#10B981',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'fridge-protein',
    name: 'Kulkas & Protein',
    iconName: 'Apple',
    emoji: '',
    accentColor: '#EF4444',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    badgeColor: 'bg-rose-100 text-rose-800',
  },
  {
    id: 'fresh-produce',
    name: 'Sayur & Buah',
    iconName: 'Carrot',
    emoji: '',
    accentColor: '#F97316',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600',
    badgeColor: 'bg-orange-100 text-orange-800',
  },
  {
    id: 'staples-dry',
    name: 'Bahan Pokok',
    iconName: 'Wheat',
    emoji: '',
    accentColor: '#3B82F6',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'cleaning-toiletries',
    name: 'Kamar Mandi & Cuci',
    iconName: 'Sparkles',
    emoji: '',
    accentColor: '#06B6D4',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-600',
    badgeColor: 'bg-cyan-100 text-cyan-800',
  },
  {
    id: 'snacks-drinks',
    name: 'Camilan & Minum',
    iconName: 'Coffee',
    emoji: '',
    accentColor: '#8B5CF6',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
];

export const DEFAULT_ITEMS: InventoryItem[] = [
  // Bumbu & Dapur
  { id: 'item-1', name: 'Bawang Merah', categoryId: 'kitchen-spices', status: 'out', unit: '1/2 kg' },
  { id: 'item-2', name: 'Bawang Putih', categoryId: 'kitchen-spices', status: 'low', unit: '1/4 kg' },
  { id: 'item-3', name: 'Cabai Rawit Merah', categoryId: 'kitchen-spices', status: 'out', unit: '250 gr' },
  { id: 'item-4', name: 'Minyak Goreng', categoryId: 'kitchen-spices', status: 'low', unit: '2 Liter' },
  { id: 'item-5', name: 'Garam Dapur', categoryId: 'kitchen-spices', status: 'good', unit: '1 bks' },
  { id: 'item-6', name: 'Gula Pasir', categoryId: 'kitchen-spices', status: 'good', unit: '1 kg' },
  { id: 'item-7', name: 'Kecap Manis', categoryId: 'kitchen-spices', status: 'out', unit: '1 botol refill' },
  { id: 'item-8', name: 'Saus Tiram', categoryId: 'kitchen-spices', status: 'good', unit: '1 botol' },

  // Kulkas & Protein
  { id: 'item-9', name: 'Telur Ayam', categoryId: 'fridge-protein', status: 'out', unit: '1 kg (16 btr)' },
  { id: 'item-10', name: 'Daging Ayam Fillet', categoryId: 'fridge-protein', status: 'low', unit: '1/2 kg' },
  { id: 'item-11', name: 'Tahu & Tempe', categoryId: 'fridge-protein', status: 'out', unit: '2 papan' },
  { id: 'item-12', name: 'Susu UHT Full Cream', categoryId: 'fridge-protein', status: 'good', unit: '1 Liter' },
  { id: 'item-13', name: 'Mentega / Margarin', categoryId: 'fridge-protein', status: 'good', unit: '1 cup' },

  // Sayur & Buah
  { id: 'item-14', name: 'Sayur Kangkung / Bayam', categoryId: 'fresh-produce', status: 'out', unit: '2 ikat' },
  { id: 'item-15', name: 'Tomat Segar', categoryId: 'fresh-produce', status: 'low', unit: '1/2 kg' },
  { id: 'item-16', name: 'Wortel', categoryId: 'fresh-produce', status: 'good', unit: '1/2 kg' },
  { id: 'item-17', name: 'Pisang / Buah Segar', categoryId: 'fresh-produce', status: 'good', unit: '1 sisir' },

  // Bahan Pokok
  { id: 'item-18', name: 'Beras Premium', categoryId: 'staples-dry', status: 'good', unit: '5 kg' },
  { id: 'item-19', name: 'Mie Instan', categoryId: 'staples-dry', status: 'low', unit: '5 bks' },
  { id: 'item-20', name: 'Tepung Terigu', categoryId: 'staples-dry', status: 'good', unit: '1 kg' },
  { id: 'item-21', name: 'Kopi / Teh Celup', categoryId: 'staples-dry', status: 'out', unit: '1 kotak' },

  // Kamar Mandi & Cuci
  { id: 'item-22', name: 'Sabun Cuci Piring', categoryId: 'cleaning-toiletries', status: 'out', unit: '1 refill 750ml' },
  { id: 'item-23', name: 'Deterjen Pakaian', categoryId: 'cleaning-toiletries', status: 'good', unit: '1 pouch' },
  { id: 'item-24', name: 'Pasta Gigi', categoryId: 'cleaning-toiletries', status: 'low', unit: '1 tube besar' },
  { id: 'item-25', name: 'Sabun Mandi', categoryId: 'cleaning-toiletries', status: 'good', unit: '1 botol refill' },
  { id: 'item-26', name: 'Tissue Wajah / Toilet', categoryId: 'cleaning-toiletries', status: 'out', unit: '1 pack' },

  // Camilan & Minum
  { id: 'item-27', name: 'Air Galon / Mineral', categoryId: 'snacks-drinks', status: 'low', unit: '1 galon' },
  { id: 'item-28', name: 'Biskuit / Camilan', categoryId: 'snacks-drinks', status: 'good', unit: '2 pack' },
];
