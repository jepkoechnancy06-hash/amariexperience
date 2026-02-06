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

  const { email, password, firstName, lastName, phone, userType } = (req.body || {}) as any;

  if (!email || !password || !firstName || !lastName || !userType) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  if (typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long' });
    return;
  }

  if (userType !== 'couple' && userType !== 'vendor') {
    res.status(400).json({ error: 'Invalid userType' });
    return;
  }

  try {
    const sql = getSql();

    // Check for existing user
    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1;`;
    if (existing.length > 0) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const rows = await sql`
      INSERT INTO users (email, first_name, last_name, phone, user_type, password_hash, email_verified, is_active)
      VALUES (${email}, ${firstName}, ${lastName}, ${phone || null}, ${userType}, ${passwordHash}, false, true)
      RETURNING id, email, first_name, last_name, phone, user_type, profile_image, email_verified, is_active, created_at;
    `;

    const user = rows[0];
    if (!user) {
      res.status(500).json({ error: 'Registration failed' });
      return;
    }

    setSessionCookie(res, { sub: user.id, email: user.email, userType: user.user_type });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        userType: user.user_type,
        profileImage: user.profile_image,
        createdAt: user.created_at,
        lastLogin: null,
        isActive: user.is_active,
        emailVerified: user.email_verified
      }
    });
  } catch (e: any) {
    console.error('Register error:', e);
    if (e?.message?.includes('duplicate key') || e?.message?.includes('users_email_key')) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }
    res.status(500).json({ error: e?.message || 'Registration failed' });
  }
 } catch (fatal: any) {
    console.error('Register fatal:', fatal);
    res.status(500).json({ error: fatal?.message || 'Internal server error' });
 }
}
