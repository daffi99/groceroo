import { Category, InventoryItem } from '../types/inventory';
import { DEFAULT_CATEGORIES, DEFAULT_ITEMS } from '../data/defaultData';

const STORAGE_KEYS = {
  CATEGORIES: 'groceroo_categories_v2',
  ITEMS: 'groceroo_items_v2',
};

export const getStoredCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return DEFAULT_CATEGORIES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CATEGORIES;
  }
};

export const saveStoredCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
};

export const getStoredItems = (): InventoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) return DEFAULT_ITEMS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ITEMS;
  }
};

export const saveStoredItems = (items: InventoryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items', e);
  }
};

export const resetToDefaultData = (): { categories: Category[]; items: InventoryItem[] } => {
  localStorage.removeItem('groceroo_categories_v1');
  localStorage.removeItem('groceroo_items_v1');
  localStorage.removeItem('groceroo_categories_v2');
  localStorage.removeItem('groceroo_items_v2');
  return {
    categories: DEFAULT_CATEGORIES,
    items: DEFAULT_ITEMS,
  };
};
