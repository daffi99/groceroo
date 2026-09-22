import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-pantry-pin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const serverPin = process.env.PANTRY_PIN;
    const { pin } = req.body || {};

    // If server PIN is not configured on Vercel yet, allow any PIN
    const valid = !serverPin || pin === serverPin;

    if (!valid) {
      return res.status(401).json({ success: false, error: 'PIN 6-digit salah. Coba lagi.' });
    }

    return res.status(200).json({ success: true, message: 'PIN terverifikasi' });
  } catch (error: any) {
    console.error('Verify PIN error:', error);
    return res.status(500).json({ error: error?.message || 'Terjadi kesalahan pada server' });
  }
}
