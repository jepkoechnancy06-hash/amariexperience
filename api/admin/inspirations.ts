import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from '../_lib/db.js';
import { getSession } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getSql();

    // GET — public read (gallery needs these)
    if (req.method === 'GET') {
      const { active_only } = req.query as { active_only?: string };
      const rows = active_only === 'true'
        ? await sql`SELECT * FROM inspiration_posts WHERE is_active = true ORDER BY sort_order ASC, created_at DESC;`
        : await sql`SELECT * FROM inspiration_posts ORDER BY sort_order ASC, created_at DESC;`;
      res.status(200).json({ posts: rows });
      return;
    }

    // All mutations require admin auth
    const session = getSession(req);
    if (!session || session.userType !== 'admin') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    // POST — create a new inspiration post
    if (req.method === 'POST') {
      const { image_url, title, story, author, tag, sort_order, is_active } = req.body as any;

      if (!image_url) {
        res.status(400).json({ error: 'image_url is required' });
        return;
      }

      const rows = await sql`
        INSERT INTO inspiration_posts (image_url, title, story, author, tag, sort_order, is_active)
        VALUES (
          ${image_url},
          ${title || ''},
          ${story || ''},
          ${author || ''},
          ${tag || ''},
          ${sort_order ?? 0},
          ${is_active !== false}
        )
        RETURNING *;
      `;

      res.status(201).json({ post: rows[0] });
      return;
    }

    // PUT — update an existing inspiration post
    if (req.method === 'PUT') {
      const { id, image_url, title, story, author, tag, sort_order, is_active } = req.body as any;

      if (!id) {
        res.status(400).json({ error: 'id is required' });
        return;
      }

      const rows = await sql`
        UPDATE inspiration_posts
        SET image_url = COALESCE(${image_url ?? null}, image_url),
            title = COALESCE(${title ?? null}, title),
            story = COALESCE(${story ?? null}, story),
            author = COALESCE(${author ?? null}, author),
            tag = COALESCE(${tag ?? null}, tag),
            sort_order = COALESCE(${sort_order ?? null}, sort_order),
            is_active = COALESCE(${is_active ?? null}, is_active)
        WHERE id = ${id}
        RETURNING *;
      `;

      if (!rows.length) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.status(200).json({ post: rows[0] });
      return;
    }

    // DELETE — remove an inspiration post
    if (req.method === 'DELETE') {
      const { id } = req.body as any;
      if (!id) {
        res.status(400).json({ error: 'id is required' });
        return;
      }
      await sql`DELETE FROM inspiration_posts WHERE id = ${id};`;
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e: any) {
    console.error('inspirations error:', e?.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
