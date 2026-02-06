import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getSql } from '../_lib/db.js';
import { getSession } from '../_lib/auth.js';

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

  const { currentPassword, newPassword } = (req.body || {}) as any;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Missing current or new password' });
    return;
  }

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long' });
    return;
  }

  try {
    const sql = getSql();

    const rows = await sql`
      SELECT password_hash FROM users WHERE id = ${session.sub} LIMIT 1;
    `;

    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const ok = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!ok) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password_hash = ${newHash} WHERE id = ${session.sub};`;

    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to change password' });
  }
}
