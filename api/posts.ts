import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM posts;`;
    res.status(200).json({ rows });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Query failed' });
  }
}
