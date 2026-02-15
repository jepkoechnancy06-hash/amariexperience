import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
 try {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM posts;`;
    res.status(200).json({ rows });
  } catch (error: any) {
    console.error('Posts fetch error:', error?.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
 } catch (fatal: any) {
    console.error('Posts fatal:', fatal?.message);
    res.status(500).json({ error: 'Internal server error' });
 }
}
