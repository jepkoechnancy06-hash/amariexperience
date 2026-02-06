import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from '../_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
 try {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const sql = getSql();

    const vendorId = req.query.id as string | undefined;

    if (vendorId) {
      const rows = await sql`
        SELECT * FROM vendors
        WHERE id = ${vendorId} AND approved_at IS NOT NULL
        LIMIT 1;
      `;

      const row = rows.length > 0 ? rows[0] : null;
      if (!row) {
        res.status(404).json({ error: 'Vendor not found' });
        return;
      }

      res.status(200).json({
        vendor: {
          id: row.id,
          name: row.name,
          category: row.category,
          rating: parseFloat(row.rating),
          priceRange: row.price_range || '$$$',
          description: row.description || '',
          imageUrl: row.image_url || '/beach.jpeg',
          location: row.location
        }
      });
      return;
    }

    const rows = await sql`
      SELECT * FROM vendors
      WHERE approved_at IS NOT NULL
      ORDER BY approved_at DESC;
    `;

    const vendors = (rows || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      rating: parseFloat(row.rating),
      priceRange: row.price_range || '$$$',
      description: row.description || '',
      imageUrl: row.image_url || '/beach.jpeg',
      location: row.location
    }));

    res.status(200).json({ vendors });
  } catch (e: any) {
    console.error('Failed to fetch approved vendors:', e);
    res.status(500).json({ error: e?.message || 'Failed to fetch vendors' });
  }
 } catch (fatal: any) {
    console.error('Approved fatal:', fatal);
    res.status(500).json({ error: fatal?.message || 'Internal server error' });
 }
}
