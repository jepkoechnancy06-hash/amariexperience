import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getSupabaseAuthBaseUrl,
  getSupabaseAuthHeaders,
  mapSupabaseUserToAppUser,
  setSupabaseSessionCookies
} from '../_lib/supabaseAuth';

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
    const emailRedirectTo = process.env.SUPABASE_EMAIL_REDIRECT_TO;

    const response = await fetch(`${getSupabaseAuthBaseUrl()}/signup`, {
      method: 'POST',
      headers: getSupabaseAuthHeaders(),
      body: JSON.stringify({
        email,
        password,
        data: {
          firstName,
          lastName,
          phone: phone || null,
          userType
        },
        ...(emailRedirectTo ? { emailRedirectTo } : {})
      })
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      res.status(response.status).json({ error: payload?.msg || payload?.error_description || payload?.error || 'Registration failed' });
      return;
    }

    const sbUser = payload?.user;
    const session = payload?.session;

    if (session?.access_token && session?.refresh_token) {
      setSupabaseSessionCookies(res, session.access_token, session.refresh_token);
    }

    const appUser = sbUser ? mapSupabaseUserToAppUser(sbUser) : null;

    // If email confirmation is enabled in Supabase, session will likely be null.
    // Supabase will send the confirmation email automatically.
    res.status(201).json({
      user: appUser,
      needsEmailVerification: !session
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Registration failed' });
  }
}
