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
} from 'lucide-react';

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
    case 'flame':
      return <Flame className={className} />;
    case 'grid':
    case 'layoutgrid':
      return <LayoutGrid className={className} />;
    default:
      return <Package className={className} />;
  }
};
