import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runQuery } from '../_lib/db.js';
import { getSession } from '../_lib/auth.js';

const USER_FIELDS = `
  id, email, first_name, last_name, phone, user_type, created_at,
  email_verified, is_active, last_login, profile_image
`;

function mapUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    userType: user.user_type,
    createdAt: user.created_at,
    lastLogin: user.last_login,
    isActive: user.is_active,
    emailVerified: user.email_verified,
    profileImage: user.profile_image
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
 try {
  if (req.method !== 'GET' && req.method !== 'PATCH') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    if (req.method === 'PATCH') {
      const updates = (req.body || {}).updates || {};
      if (!updates || typeof updates !== 'object') {
        res.status(400).json({ error: 'Missing updates' });
        return;
      }

      const allowed: Record<string, string> = {
        firstName: 'first_name',
        lastName: 'last_name',
        phone: 'phone',
        profileImage: 'profile_image'
      };

      const entries = Object.entries(updates).filter(([key, value]) => {
        return key in allowed && value !== undefined;
      });

      if (entries.length === 0) {
        res.status(400).json({ error: 'No valid updates provided' });
        return;
      }

      const setClause = entries
        .map(([key], index) => `${allowed[key]} = $${index + 1}`)
        .join(', ');
      const values = entries.map(([, value]) => value);

      const updated = await runQuery(
        `UPDATE users SET ${setClause} WHERE id = $${values.length + 1} RETURNING ${USER_FIELDS};`,
        [...values, session.sub]
      );

      const user = updated?.[0];
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ user: mapUser(user) });
      return;
    }

    const rows = await runQuery(
      `SELECT ${USER_FIELDS} FROM users WHERE id = $1 LIMIT 1;`,
      [session.sub]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    res.status(200).json({ user: mapUser(rows[0]) });
  } catch (e: any) {
    console.error('Me error:', e);
    res.status(500).json({ error: e?.message || 'Failed to load user' });
  }
 } catch (fatal: any) {
    console.error('Me fatal:', fatal);
    res.status(500).json({ error: fatal?.message || 'Internal server error' });
 }
}
