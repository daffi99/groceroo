import { neon } from '@neondatabase/serverless';
import { DEFAULT_CATEGORIES, DEFAULT_ITEMS } from '../../src/data/defaultData';

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }
  return neon(databaseUrl);
}

export function isPinValid(pin: string | null | undefined): boolean {
  const serverPin = process.env.PANTRY_PIN;
  // If no server PIN configured, allow access
  if (!serverPin) return true;
  return pin === serverPin;
}

export async function initDbAndSeed(sql: ReturnType<typeof neon>) {
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
        VALUES (${cat.id}, ${cat.name}, ${cat.iconName}, ${cat.accentColor}, ${cat.bgColor}, ${cat.borderColor}, ${cat.textColor}, ${cat.badgeColor})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  // 4. Seed initial items if empty
  const itemCount = await sql`SELECT COUNT(*)::int as count FROM inventory_items;`;
  if (itemCount[0].count === 0) {
    for (const item of DEFAULT_ITEMS) {
      await sql`
        INSERT INTO inventory_items (id, name, category_id, status, note, last_restocked)
        VALUES (${item.id}, ${item.name}, ${item.categoryId}, ${item.status}, ${item.note || null}, ${item.lastRestocked ? new Date(item.lastRestocked) : null})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }
}
