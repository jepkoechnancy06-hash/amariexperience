import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from '../_lib/db';
import { getSession } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const sql = getSql();

    const rows = await sql`
      SELECT id, email, first_name, last_name, phone, user_type, created_at,
             email_verified, is_active, last_login
      FROM users
      WHERE id = ${session.sub}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = rows[0];
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        userType: user.user_type,
        createdAt: user.created_at,
        lastLogin: user.last_login,
        isActive: user.is_active,
        emailVerified: user.email_verified
      }
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to load user' });
  }
}
