import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getSql } from '../_lib/db';
import { setSessionCookie } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        user_type VARCHAR(20) NOT NULL DEFAULT 'couple',
        profile_image TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE,
        password_hash VARCHAR(255) NOT NULL
      );
    `;

    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1;`;
    if (existing.length > 0) {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const inserted = await sql`
      INSERT INTO users (email, first_name, last_name, phone, user_type, password_hash)
      VALUES (${email}, ${firstName}, ${lastName}, ${phone || null}, ${userType}, ${passwordHash})
      RETURNING id, email, first_name, last_name, phone, user_type, created_at, email_verified, is_active;
    `;

    const user = inserted[0];
    setSessionCookie(res, { sub: user.id, email: user.email, userType: user.user_type });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        userType: user.user_type,
        createdAt: user.created_at,
        isActive: user.is_active,
        emailVerified: user.email_verified
      }
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Registration failed' });
  }
}
