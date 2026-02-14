import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getSql } from '../_lib/db.js';

// Simple in-memory rate limiter (per serverless instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // max 5 requests per window per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Rate limit by IP
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || (req as any).socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  const { email } = (req.body || {}) as any;
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  try {
    const sql = getSql();

    // Check if user exists
    const rows = await sql`
      SELECT id, email, first_name FROM users
      WHERE email = ${email.trim().toLowerCase()} AND is_active = true
      LIMIT 1;
    `;

    // Always return success to prevent email enumeration
    if (rows.length === 0) {
      res.status(200).json({ ok: true, message: 'If that email exists, a reset link has been generated.' });
      return;
    }

    const user = rows[0];

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // Store the reset token — create table if needed, then upsert
    await sql`
      CREATE TABLE IF NOT EXISTS password_resets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Hash the token before storing (never store raw tokens)
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Delete any existing tokens for this user and clean up expired tokens globally
    await sql`DELETE FROM password_resets WHERE user_id = ${user.id} OR expires_at < NOW();`;

    // Insert new token
    await sql`
      INSERT INTO password_resets (user_id, token_hash, expires_at)
      VALUES (${user.id}, ${tokenHash}, ${expiresAt});
    `;

    // In production, send this via email (e.g. SendGrid, Resend, etc.)
    // The token is logged server-side ONLY during development — remove in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Password Reset] DEV ONLY — token for ${user.email}: ${resetToken}`);
    }

    // Build the reset URL for email delivery
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (req.headers.origin || req.headers.referer || 'http://localhost:5173');
    const resetUrl = `${baseUrl}/login?resetToken=${resetToken}`;

    // TODO: Send resetUrl via email service (SendGrid, Resend, etc.)
    // await sendResetEmail(user.email, user.first_name, resetUrl);

    // Return a consistent message regardless of whether the email exists.
    // In dev mode, include the token so the flow works without an email service.
    const isProd = process.env.NODE_ENV === 'production';
    res.status(200).json({
      ok: true,
      message: 'If that email exists, a password reset link has been sent.',
      ...(isProd ? {} : { resetToken })
    });
  } catch (e: any) {
    console.error('Forgot password error:', e?.message);
    res.status(500).json({ error: 'Failed to process request. Please try again.' });
  }
}
