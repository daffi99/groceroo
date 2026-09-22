import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, isPinValid, initDbAndSeed } from './lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
  const sql = getDb();
  if (!sql) {
    return res.status(200).json({
      synced: false,
      message: 'DATABASE_URL belum dikonfigurasi di Vercel. Menggunakan mode lokal.',
    });
  }

  try {
    // Ensure tables & seed exist
    await initDbAndSeed(sql);

    // GET: Retrieve latest categories & items
    if (req.method === 'GET') {
      const categories = await sql`SELECT * FROM categories ORDER BY id ASC;`;
      const items = await sql`SELECT * FROM inventory_items ORDER BY updated_at DESC;`;

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
          lastRestocked: i.last_restocked,
        })),
      });
    }

    // POST: Sync updates from client to Neon DB
    if (req.method === 'POST') {
      const { items: clientItems, deletedIds } = req.body || {};

      // Handle deletions if any
      if (Array.isArray(deletedIds) && deletedIds.length > 0) {
        for (const id of deletedIds) {
          await sql`DELETE FROM inventory_items WHERE id = ${id};`;
        }
      }

      // Upsert client items
      if (Array.isArray(clientItems) && clientItems.length > 0) {
        for (const item of clientItems) {
          await sql`
            INSERT INTO inventory_items (id, name, category_id, status, note, last_restocked, updated_at)
            VALUES (${item.id}, ${item.name}, ${item.categoryId}, ${item.status}, ${item.note || null}, ${item.lastRestocked ? new Date(item.lastRestocked) : null}, NOW())
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              category_id = EXCLUDED.category_id,
              status = EXCLUDED.status,
              note = EXCLUDED.note,
              last_restocked = EXCLUDED.last_restocked,
              updated_at = NOW();
          `;
        }
      }

      // Return refreshed state
      const categories = await sql`SELECT * FROM categories ORDER BY id ASC;`;
      const items = await sql`SELECT * FROM inventory_items ORDER BY updated_at DESC;`;

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
          lastRestocked: i.last_restocked,
        })),
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database sync error:', error);
    return res.status(500).json({ error: 'Gagal sinkronisasi dengan database Neon' });
  }
}
