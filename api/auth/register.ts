import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getSql } from '../_lib/db.js';
import { setSessionCookie } from '../_lib/auth.js';

// Rate limiting for registration
const regAttempts = new Map<string, { count: number; resetAt: number }>();
const REG_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const REG_MAX_ATTEMPTS = 5; // max 5 registrations per hour per IP

function isRegRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = regAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    regAttempts.set(ip, { count: 1, resetAt: now + REG_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > REG_MAX_ATTEMPTS;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
 try {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (isRegRateLimited(clientIp)) {
    res.status(429).json({ error: 'Too many registration attempts. Please try again later.' });
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

    const normalizedEmail = email.trim().toLowerCase();

    // Check for existing user
    const existing = await sql`SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1;`;
    if (existing.length > 0) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const rows = await sql`
      INSERT INTO users (email, first_name, last_name, phone, user_type, password_hash, email_verified, is_active)
      VALUES (${normalizedEmail}, ${firstName.trim()}, ${lastName.trim()}, ${phone || null}, ${userType}, ${passwordHash}, false, true)
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
    console.error('Register error:', e?.message);
    if (e?.message?.includes('duplicate key') || e?.message?.includes('users_email_key')) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
 } catch (fatal: any) {
    console.error('Register fatal:', fatal?.message);
    res.status(500).json({ error: 'Internal server error' });
 }
}
