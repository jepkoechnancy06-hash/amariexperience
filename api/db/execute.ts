import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runQuery } from '../_lib/db.js';
import { getSession } from '../_lib/auth.js';

function isQueryAllowed(query: string) {
  const q = query.trim().replace(/;+\s*$/, '').toLowerCase();

  const forbidden = ['drop ', 'truncate ', 'grant ', 'revoke ', 'alter role', 'create role', 'pg_', 'information_schema'];
  if (forbidden.some((k) => q.includes(k))) return false;

  return q.startsWith('select') || q.startsWith('insert') || q.startsWith('update') || q.startsWith('delete');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const { query, params } = (req.body || {}) as any;
  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'Missing query' });
    return;
  }

  if (!isQueryAllowed(query)) {
    res.status(400).json({ error: 'Query not allowed' });
    return;
  }

  try {
    const values = Array.isArray(params) ? params : [];

    const result = await runQuery(query, values);

    res.status(200).json({ rows: result });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Query failed' });
  }
}
