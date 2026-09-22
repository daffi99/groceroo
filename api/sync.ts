import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Default categories seed data
const DEFAULT_CATEGORIES = [
  {
    id: 'kitchen-spices',
    name: 'Bumbu & Dapur',
    icon_name: 'Leaf',
    accent_color: '#10B981',
    bg_color: 'bg-emerald-50',
    border_color: 'border-emerald-200',
    text_color: 'text-emerald-700',
    badge_color: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'fridge-protein',
    name: 'Kulkas & Protein',
    icon_name: 'Apple',
    accent_color: '#EF4444',
    bg_color: 'bg-rose-50',
    border_color: 'border-rose-200',
    text_color: 'text-rose-600',
    badge_color: 'bg-rose-100 text-rose-800',
  },
  {
    id: 'fresh-produce',
    name: 'Sayur & Buah',
    icon_name: 'Carrot',
    accent_color: '#F97316',
    bg_color: 'bg-orange-50',
    border_color: 'border-orange-200',
    text_color: 'text-orange-600',
    badge_color: 'bg-orange-100 text-orange-800',
  },
  {
    id: 'staples-dry',
    name: 'Bahan Pokok',
    icon_name: 'Wheat',
    accent_color: '#3B82F6',
    bg_color: 'bg-blue-50',
    border_color: 'border-blue-200',
    text_color: 'text-blue-600',
    badge_color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'cleaning-toiletries',
    name: 'Kamar Mandi & Cuci',
    icon_name: 'Sparkles',
    accent_color: '#06B6D4',
    bg_color: 'bg-cyan-50',
    border_color: 'border-cyan-200',
    text_color: 'text-cyan-600',
    badge_color: 'bg-cyan-100 text-cyan-800',
  },
  {
    id: 'snacks-drinks',
    name: 'Camilan & Minum',
    icon_name: 'Coffee',
    accent_color: '#8B5CF6',
    bg_color: 'bg-purple-50',
    border_color: 'border-purple-200',
    text_color: 'text-purple-600',
    badge_color: 'bg-purple-100 text-purple-800',
  },
];

// Default inventory items seed data
const DEFAULT_ITEMS = [
  { id: 'item-1', name: 'Bawang Merah', category_id: 'kitchen-spices', status: 'out', unit: '1/2 kg' },
  { id: 'item-2', name: 'Bawang Putih', category_id: 'kitchen-spices', status: 'low', unit: '1/4 kg' },
  { id: 'item-3', name: 'Cabai Rawit Merah', category_id: 'kitchen-spices', status: 'out', unit: '250 gr' },
  { id: 'item-4', name: 'Minyak Goreng', category_id: 'kitchen-spices', status: 'low', unit: '2 Liter' },
  { id: 'item-5', name: 'Garam Dapur', category_id: 'kitchen-spices', status: 'good', unit: '1 bks' },
  { id: 'item-6', name: 'Gula Pasir', category_id: 'kitchen-spices', status: 'good', unit: '1 kg' },
  { id: 'item-7', name: 'Kecap Manis', category_id: 'kitchen-spices', status: 'out', unit: '1 botol refill' },
  { id: 'item-8', name: 'Saus Tiram', category_id: 'kitchen-spices', status: 'good', unit: '1 botol' },

  { id: 'item-9', name: 'Telur Ayam', category_id: 'fridge-protein', status: 'out', unit: '1 kg (16 btr)' },
  { id: 'item-10', name: 'Daging Ayam Fillet', category_id: 'fridge-protein', status: 'low', unit: '1/2 kg' },
  { id: 'item-11', name: 'Tahu & Tempe', category_id: 'fridge-protein', status: 'out', unit: '2 papan' },
  { id: 'item-12', name: 'Susu UHT Full Cream', category_id: 'fridge-protein', status: 'good', unit: '1 Liter' },
  { id: 'item-13', name: 'Mentega / Margarin', category_id: 'fridge-protein', status: 'good', unit: '1 cup' },

  { id: 'item-14', name: 'Sayur Kangkung / Bayam', category_id: 'fresh-produce', status: 'out', unit: '2 ikat' },
  { id: 'item-15', name: 'Tomat Segar', category_id: 'fresh-produce', status: 'low', unit: '1/2 kg' },
  { id: 'item-16', name: 'Wortel', category_id: 'fresh-produce', status: 'good', unit: '1/2 kg' },
  { id: 'item-17', name: 'Pisang / Buah Segar', category_id: 'fresh-produce', status: 'good', unit: '1 sisir' },

  { id: 'item-18', name: 'Beras Premium', category_id: 'staples-dry', status: 'good', unit: '5 kg' },
  { id: 'item-19', name: 'Mie Instan', category_id: 'staples-dry', status: 'low', unit: '5 bks' },
  { id: 'item-20', name: 'Tepung Terigu', category_id: 'staples-dry', status: 'good', unit: '1 kg' },
  { id: 'item-21', name: 'Kopi / Teh Celup', category_id: 'staples-dry', status: 'out', unit: '1 kotak' },

  { id: 'item-22', name: 'Sabun Cuci Piring', category_id: 'cleaning-toiletries', status: 'out', unit: '1 refill 750ml' },
  { id: 'item-23', name: 'Deterjen Pakaian', category_id: 'cleaning-toiletries', status: 'good', unit: '1 pouch' },
  { id: 'item-24', name: 'Pasta Gigi', category_id: 'cleaning-toiletries', status: 'low', unit: '1 tube besar' },
  { id: 'item-25', name: 'Sabun Mandi', category_id: 'cleaning-toiletries', status: 'good', unit: '1 botol refill' },
  { id: 'item-26', name: 'Tissue Wajah / Toilet', category_id: 'cleaning-toiletries', status: 'out', unit: '1 pack' },

  { id: 'item-27', name: 'Air Galon / Mineral', category_id: 'snacks-drinks', status: 'low', unit: '1 galon' },
  { id: 'item-28', name: 'Biskuit / Camilan', category_id: 'snacks-drinks', status: 'good', unit: '2 pack' },
];

function isPinValid(pin: string | null | undefined): boolean {
  const serverPin = process.env.PANTRY_PIN;
  if (!serverPin) return true;
  return pin === serverPin;
}

async function initDbAndSeed(sql: ReturnType<typeof neon>) {
  // 1. Create categories table
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      accent_color TEXT,
      bg_color TEXT,
      border_color TEXT,
      text_color TEXT,
      badge_color TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 2. Create inventory_items table
  await sql`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'good',
      note TEXT,
      unit TEXT,
      last_restocked TIMESTAMP WITH TIME ZONE,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 3. Seed initial categories if empty
  const catCount = await sql`SELECT COUNT(*)::int as count FROM categories;`;
  if (catCount[0].count === 0) {
    for (const cat of DEFAULT_CATEGORIES) {
      await sql`
        INSERT INTO categories (id, name, icon_name, accent_color, bg_color, border_color, text_color, badge_color)
        VALUES (${cat.id}, ${cat.name}, ${cat.icon_name}, ${cat.accent_color}, ${cat.bg_color}, ${cat.border_color}, ${cat.text_color}, ${cat.badge_color})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  // 4. Seed initial items if empty
  const itemCount = await sql`SELECT COUNT(*)::int as count FROM inventory_items;`;
  if (itemCount[0].count === 0) {
    for (const item of DEFAULT_ITEMS) {
      await sql`
        INSERT INTO inventory_items (id, name, category_id, status, note, unit, last_restocked)
        VALUES (${item.id}, ${item.name}, ${item.category_id}, ${item.status}, null, ${item.unit || null}, null)
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-pantry-pin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. PIN verification
  const pin = (req.headers['x-pantry-pin'] as string) || (req.query.pin as string);
  if (!isPinValid(pin)) {
    return res.status(401).json({ error: 'PIN tidak valid atau belum diisi', requiresPin: true });
  }

  // 2. Database connection
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(200).json({
      synced: false,
      message: 'DATABASE_URL belum dikonfigurasi di Vercel. Menggunakan mode lokal.',
    });
  }

  try {
    const sql = neon(databaseUrl);

    // Ensure tables & seed data exist
    await initDbAndSeed(sql);

    // GET: Retrieve latest categories & items
    if (req.method === 'GET') {
      const categories = await sql`
        SELECT * FROM categories 
        ORDER BY CASE id
          WHEN 'kitchen-spices' THEN 1
          WHEN 'fridge-protein' THEN 2
          WHEN 'fresh-produce' THEN 3
          WHEN 'staples-dry' THEN 4
          WHEN 'cleaning-toiletries' THEN 5
          WHEN 'snacks-drinks' THEN 6
          ELSE 99
        END ASC;
      `;
      const items = await sql`SELECT * FROM inventory_items ORDER BY id ASC;`;

      return res.status(200).json({
        synced: true,
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          iconName: c.icon_name,
          emoji: '',
          accentColor: c.accent_color,
          bgColor: c.bg_color,
          borderColor: c.border_color,
          textColor: c.text_color,
          badgeColor: c.badge_color,
        })),
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          categoryId: i.category_id,
          status: i.status,
          note: i.note,
          unit: i.unit,
          lastRestocked: i.last_restocked,
        })),
      });
    }

    // POST: Sync updates from client to Neon DB
    if (req.method === 'POST') {
      const {
        items: clientItems,
        deletedIds,
        categories: clientCategories,
        deletedCategoryIds,
      } = req.body || {};

      // Handle category deletions if any (foreign key cascade deletes associated items)
      if (Array.isArray(deletedCategoryIds) && deletedCategoryIds.length > 0) {
        for (const catId of deletedCategoryIds) {
          await sql`DELETE FROM categories WHERE id = ${catId};`;
        }
      }

      // Upsert client categories
      if (Array.isArray(clientCategories) && clientCategories.length > 0) {
        for (const cat of clientCategories) {
          await sql`
            INSERT INTO categories (id, name, icon_name, accent_color, bg_color, border_color, text_color, badge_color)
            VALUES (
              ${cat.id},
              ${cat.name},
              ${cat.iconName || 'Package'},
              ${cat.accentColor || '#10B981'},
              ${cat.bgColor || 'bg-emerald-50'},
              ${cat.borderColor || 'border-emerald-200'},
              ${cat.textColor || 'text-emerald-700'},
              ${cat.badgeColor || 'bg-emerald-100 text-emerald-800'}
            )
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              icon_name = EXCLUDED.icon_name,
              accent_color = EXCLUDED.accent_color,
              bg_color = EXCLUDED.bg_color,
              border_color = EXCLUDED.border_color,
              text_color = EXCLUDED.text_color,
              badge_color = EXCLUDED.badge_color;
          `;
        }
      }

      // Handle item deletions if any
      if (Array.isArray(deletedIds) && deletedIds.length > 0) {
        for (const id of deletedIds) {
          await sql`DELETE FROM inventory_items WHERE id = ${id};`;
        }
      }

      // Upsert client items
      if (Array.isArray(clientItems) && clientItems.length > 0) {
        for (const item of clientItems) {
          await sql`
            INSERT INTO inventory_items (id, name, category_id, status, note, unit, last_restocked, updated_at)
            VALUES (
              ${item.id},
              ${item.name},
              ${item.categoryId},
              ${item.status},
              ${item.note || null},
              ${item.unit || null},
              ${item.lastRestocked ? new Date(item.lastRestocked) : null},
              NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              category_id = EXCLUDED.category_id,
              status = EXCLUDED.status,
              note = EXCLUDED.note,
              unit = EXCLUDED.unit,
              last_restocked = EXCLUDED.last_restocked,
              updated_at = NOW();
          `;
        }
      }

      // Return refreshed state
      const categories = await sql`
        SELECT * FROM categories 
        ORDER BY CASE id
          WHEN 'kitchen-spices' THEN 1
          WHEN 'fridge-protein' THEN 2
          WHEN 'fresh-produce' THEN 3
          WHEN 'staples-dry' THEN 4
          WHEN 'cleaning-toiletries' THEN 5
          WHEN 'snacks-drinks' THEN 6
          ELSE 99
        END ASC;
      `;
      const items = await sql`SELECT * FROM inventory_items ORDER BY id ASC;`;

      return res.status(200).json({
        synced: true,
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          iconName: c.icon_name,
          emoji: '',
          accentColor: c.accent_color,
          bgColor: c.bg_color,
          borderColor: c.border_color,
          textColor: c.text_color,
          badgeColor: c.badge_color,
        })),
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          categoryId: i.category_id,
          status: i.status,
          note: i.note,
          unit: i.unit,
          lastRestocked: i.last_restocked,
        })),
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Database sync error:', error);
    return res.status(500).json({
      error: 'Gagal sinkronisasi dengan database Neon',
      detail: error?.message || String(error),
      stack: error?.stack,
    });
  }
}
