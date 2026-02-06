import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getSql();
    const rows = await sql`SELECT 1 AS ok;`;
    res.status(200).json({ ok: true, db: rows?.[0]?.ok === 1 });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message || 'DB connection failed' });
  }
}
