import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from '../_lib/db.js';
import { getSession } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getSql();

    // GET — public read (pages need these images)
    if (req.method === 'GET') {
      const { page } = req.query as { page?: string };
      const rows = page
        ? await sql`SELECT * FROM site_images WHERE page = ${page} ORDER BY slot;`
        : await sql`SELECT * FROM site_images ORDER BY page, slot;`;
      res.status(200).json({ images: rows });
      return;
    }

    // All mutations require admin auth
    const session = getSession(req);
    if (!session || session.userType !== 'admin') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    // POST / PUT — upsert a site image
    if (req.method === 'POST' || req.method === 'PUT') {
      const { page, slot, image_url, alt_text } = req.body as any;

      if (!page || !slot || !image_url) {
        res.status(400).json({ error: 'page, slot, and image_url are required' });
        return;
      }

      const allowed_pages = ['homepage', 'about', 'community'];
      if (!allowed_pages.includes(page)) {
        res.status(400).json({ error: `page must be one of: ${allowed_pages.join(', ')}` });
        return;
      }

      const rows = await sql`
        INSERT INTO site_images (page, slot, image_url, alt_text, updated_at)
        VALUES (${page}, ${slot}, ${image_url}, ${alt_text || ''}, NOW())
        ON CONFLICT (page, slot) DO UPDATE
        SET image_url = EXCLUDED.image_url,
            alt_text = EXCLUDED.alt_text,
            updated_at = NOW()
        RETURNING *;
      `;

      res.status(200).json({ image: rows[0] });
      return;
    }

    // DELETE — remove a site image (reverts page to default)
    if (req.method === 'DELETE') {
      const { id } = req.body as any;
      if (!id) {
        res.status(400).json({ error: 'id is required' });
        return;
      }
      await sql`DELETE FROM site_images WHERE id = ${id};`;
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e: any) {
    console.error('site-images error:', e?.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
