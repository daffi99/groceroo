const PIN_KEY = 'groceroo_pantry_pin';

export const getStoredPin = (): string => {
  try {
    return localStorage.getItem(PIN_KEY) || '';
  } catch {
    return '';
  }
};

export const saveStoredPin = (pin: string): void => {
  try {
    localStorage.setItem(PIN_KEY, pin);
  } catch (e) {
    console.error('Failed to save PIN', e);
  }
};

export const clearStoredPin = (): void => {
  try {
    localStorage.removeItem(PIN_KEY);
  } catch (e) {
    console.error('Failed to clear PIN', e);
  }
};

/**
 * Purges legacy localStorage items and categories so that Neon DB
 * is the single source of truth across all devices.
 */
export const clearLegacyStorage = (): void => {
  try {
    const keysToRemove = [
      'groceroo_categories_v1',
      'groceroo_items_v1',
      'groceroo_categories_v2',
      'groceroo_items_v2',
      'groceroo_categories',
      'groceroo_items',
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.error('Failed to clear legacy storage', e);
  }
};
