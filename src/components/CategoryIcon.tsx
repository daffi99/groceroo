import React from 'react';
import {
  Leaf,
  Apple,
  Carrot,
  Wheat,
  Sparkles,
  Cookie,
  Coffee,
  Egg,
  Beef,
  Flame,
  LayoutGrid,
  Package,
  Fish,
  Utensils,
  Milk,
  HeartPulse,
  Bath,
} from 'lucide-react';

export const AVAILABLE_CATEGORY_ICONS = [
  { name: 'Leaf', label: 'Bumbu' },
  { name: 'Apple', label: 'Kulkas' },
  { name: 'Carrot', label: 'Sayur' },
  { name: 'Wheat', label: 'Pokok' },
  { name: 'Sparkles', label: 'Cuci' },
  { name: 'Coffee', label: 'Minum' },
  { name: 'Egg', label: 'Telur' },
  { name: 'Beef', label: 'Daging' },
  { name: 'Fish', label: 'Ikan' },
  { name: 'Milk', label: 'Susu' },
  { name: 'Cookie', label: 'Snack' },
  { name: 'Utensils', label: 'Dapur' },
  { name: 'HeartPulse', label: 'Obat' },
  { name: 'Bath', label: 'Mandi' },
  { name: 'Flame', label: 'Pedas' },
  { name: 'Package', label: 'Paket' },
];

export const AVAILABLE_CATEGORY_COLORS = [
  {
    name: 'Emerald',
    accentColor: '#10B981',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    name: 'Rose',
    accentColor: '#EF4444',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    badgeColor: 'bg-rose-100 text-rose-800',
  },
  {
    name: 'Orange',
    accentColor: '#F97316',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600',
    badgeColor: 'bg-orange-100 text-orange-800',
  },
  {
    name: 'Blue',
    accentColor: '#3B82F6',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    name: 'Cyan',
    accentColor: '#06B6D4',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-600',
    badgeColor: 'bg-cyan-100 text-cyan-800',
  },
  {
    name: 'Purple',
    accentColor: '#8B5CF6',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    name: 'Amber',
    accentColor: '#F59E0B',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    name: 'Slate',
    accentColor: '#64748B',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-700',
    badgeColor: 'bg-slate-200 text-slate-800',
  },
];

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name.toLowerCase()) {
    case 'leaf':
    case 'kitchen-spices':
      return <Leaf className={className} />;
    case 'apple':
    case 'fridge-protein':
      return <Apple className={className} />;
    case 'carrot':
    case 'fresh-produce':
      return <Carrot className={className} />;
    case 'wheat':
    case 'staples-dry':
      return <Wheat className={className} />;
    case 'sparkles':
    case 'cleaning-toiletries':
      return <Sparkles className={className} />;
    case 'cookie':
      return <Cookie className={className} />;
    case 'coffee':
    case 'snacks-drinks':
      return <Coffee className={className} />;
    case 'egg':
      return <Egg className={className} />;
    case 'beef':
      return <Beef className={className} />;
    case 'fish':
      return <Fish className={className} />;
    case 'milk':
      return <Milk className={className} />;
    case 'utensils':
      return <Utensils className={className} />;
    case 'heartpulse':
      return <HeartPulse className={className} />;
    case 'bath':
      return <Bath className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'grid':
    case 'layoutgrid':
      return <LayoutGrid className={className} />;
    default:
      return <Package className={className} />;
  }
};
