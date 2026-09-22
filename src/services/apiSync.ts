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
    const res = await fetch(`/api/sync?t=${Date.now()}`, {
      method: 'GET',
      headers: {
        'x-pantry-pin': activePin,
      },
      cache: 'no-store',
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

export interface SyncPayload {
  items?: InventoryItem[];
  deletedIds?: string[];
  categories?: Category[];
  deletedCategoryIds?: string[];
}

export async function syncLocalToRemote(
  payloadOrItems: InventoryItem[] | SyncPayload,
  deletedIds?: string[],
  pin?: string
): Promise<SyncResponse> {
  const activePin = pin || localStorage.getItem('groceroo_pantry_pin') || '';

  const bodyData = Array.isArray(payloadOrItems)
    ? { items: payloadOrItems, deletedIds }
    : payloadOrItems;

  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pantry-pin': activePin,
      },
      body: JSON.stringify(bodyData),
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
