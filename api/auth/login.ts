import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getSql } from '../_lib/db.js';
import { setSessionCookie } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
 try {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, password } = (req.body || {}) as any;
  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password' });
    return;
  }

  try {
    const sql = getSql();

    const rows = await sql`
      SELECT id, email, first_name, last_name, phone, user_type, password_hash,
             created_at, email_verified, is_active, profile_image, last_login
      FROM users
      WHERE email = ${email} AND is_active = true
      LIMIT 1;
    `;

    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id};`;

    setSessionCookie(res, { sub: user.id, email: user.email, userType: user.user_type });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        userType: user.user_type,
        profileImage: user.profile_image,
        createdAt: user.created_at,
        lastLogin: user.last_login,
        isActive: user.is_active,
        emailVerified: user.email_verified
      }
    });
  } catch (e: any) {
    console.error('Login error:', e);
    res.status(500).json({ error: e?.message || 'Login failed' });
  }
 } catch (fatal: any) {
    console.error('Login fatal:', fatal);
    res.status(500).json({ error: fatal?.message || 'Internal server error' });
 }
}
