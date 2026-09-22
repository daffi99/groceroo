import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface SearchImageResult {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

// 1. Direct Bing Image Search (Rock solid, Indonesian marketplace & cooking index, no rate limit)
async function searchBing(query: string): Promise<SearchImageResult[]> {
  try {
    const res = await fetch(
      `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&FORM=HDRSC2`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8',
        },
      }
    );
    const html = await res.text();
    const matches = [...html.matchAll(/class="iusc"[^>]*m="([^"]+)"/g)];
    const results: SearchImageResult[] = [];

    for (let i = 0; i < Math.min(6, matches.length); i++) {
      try {
        const rawJson = matches[i][1].replace(/&quot;/g, '"');
        const parsed = JSON.parse(rawJson);
        if (parsed.murl) {
          results.push({
            id: `bing-${i}`,
            title: parsed.t ? parsed.t.replace(/&amp;/g, '&') : query,
            thumbnail: (parsed.turl || parsed.murl).replace(/&amp;/g, '&'),
            url: parsed.murl,
          });
        }
      } catch {}
    }
    return results;
  } catch (err) {
    console.error('Bing image search error:', err);
    return [];
  }
}

// 2. DuckDuckGo Image Search fallback
async function searchDuckDuckGo(query: string): Promise<SearchImageResult[]> {
  try {
    const initRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&kl=id-id`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });
    const text = await initRes.text();
    const vqdMatch = text.match(/vqd=([0-9-]+)/) || text.match(/vqd=["']([^"'&]+)["']/);
    if (!vqdMatch) return [];

    const vqd = vqdMatch[1];
    const imgRes = await fetch(
      `https://duckduckgo.com/i.js?l=id-id&kl=id-id&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://duckduckgo.com/',
          Accept: 'application/json, text/javascript, */*; q=0.01',
        },
      }
    );

    if (!imgRes.ok) return [];
    const data = await imgRes.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results
      .filter((r: any) => r.thumbnail && (r.image || r.thumbnail))
      .slice(0, 6)
      .map((r: any, index: number) => ({
        id: `ddg-${index}`,
        title: r.title || query,
        thumbnail: r.thumbnail,
        url: r.thumbnail || r.image,
      }));
  } catch (err) {
    console.error('DuckDuckGo search error:', err);
    return [];
  }
}

// 3. Pexels fallback (if API key configured in .env)
async function searchPexels(query: string, apiKey: string): Promise<SearchImageResult[]> {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.photos || !Array.isArray(data.photos)) return [];

    return data.photos.map((p: any) => ({
      id: `pexels-${p.id}`,
      title: p.alt || query,
      thumbnail: p.src.tiny || p.src.small,
      url: p.src.small || p.src.medium,
    }));
  } catch (err) {
    console.error('Pexels search error:', err);
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = (req.query.q as string)?.trim();
  if (!query) {
    return res.status(400).json({ error: 'Query parameter q is required', images: [] });
  }

  const pexelsKey = process.env.PEXELS_API_KEY || process.env.VITE_PEXELS_API_KEY;

  // 1. Primary: Direct Bing Search (Zero rate limits, real Indonesian marketplace photos)
  let results = await searchBing(query);

  // 2. Secondary: DuckDuckGo search if Bing had no results
  if (results.length === 0) {
    results = await searchDuckDuckGo(query);
  }

  // 3. Tertiary: Pexels fallback if configured
  if (results.length === 0 && pexelsKey) {
    results = await searchPexels(query, pexelsKey);
  }

  return res.status(200).json({
    query,
    images: results.slice(0, 6),
  });
}
