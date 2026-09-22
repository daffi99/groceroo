import { Category, InventoryItem } from '../types/inventory';

export interface SyncResponse {
  synced: boolean;
  categories?: Category[];
  items?: InventoryItem[];
  message?: string;
  error?: string;
}

export async function fetchRemoteData(pin?: string): Promise<SyncResponse> {
  const activePin = pin || localStorage.getItem('groceroo_pantry_pin') || '';
  try {
    const res = await fetch('/api/sync', {
      method: 'GET',
      headers: {
        'x-pantry-pin': activePin,
      },
    });

    if (!res.ok) {
      return { synced: false, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return { synced: false, error: (err as Error).message };
  }
}

export async function syncLocalToRemote(
  items: InventoryItem[],
  deletedIds?: string[],
  pin?: string
): Promise<SyncResponse> {
  const activePin = pin || localStorage.getItem('groceroo_pantry_pin') || '';
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pantry-pin': activePin,
      },
      body: JSON.stringify({ items, deletedIds }),
    });

    if (!res.ok) {
      return { synced: false, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return { synced: false, error: (err as Error).message };
  }
}
