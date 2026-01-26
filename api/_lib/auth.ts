import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';

const COOKIE_NAME = 'amari_session';

export type SessionPayload = {
  sub: string;
  email: string;
  userType: 'couple' | 'vendor' | 'admin';
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_SECRET');
  }
  return secret;
}

export function getSession(req: any): SessionPayload | null {
  const cookies = parse(req.headers?.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (!payload || typeof payload !== 'object') return null;
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export function setSessionCookie(res: any, payload: SessionPayload) {
  const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });

  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
  );
}

export function clearSessionCookie(res: any) {
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, '', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      expires: new Date(0)
    })
  );
}
