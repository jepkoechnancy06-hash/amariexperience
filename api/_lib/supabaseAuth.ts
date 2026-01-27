import { parse, serialize } from 'cookie';

const ACCESS_COOKIE = 'sb_access_token';
const REFRESH_COOKIE = 'sb_refresh_token';

function getSupabaseUrl() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.SUPABASE_ANON_URL ||
    process.env.supabase_anon_url ||
    process.env.supabase_url;

  if (!url) throw new Error('Missing SUPABASE_URL');
  return url;
}

function getSupabaseAnonKey() {
  const key =
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_TOKEN ||
    process.env.supabase_anon_key ||
    process.env.supabase_anon_token;

  if (!key) throw new Error('Missing SUPABASE_ANON_KEY');
  return key;
}

function isProd() {
  return process.env.NODE_ENV === 'production';
}

export function getSupabaseAuthHeaders(accessToken?: string) {
  const headers: Record<string, string> = {
    apikey: getSupabaseAnonKey(),
    'Content-Type': 'application/json'
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

export function getSupabaseAuthBaseUrl() {
  return `${getSupabaseUrl().replace(/\/$/, '')}/auth/v1`;
}

export function setSupabaseSessionCookies(res: any, accessToken: string, refreshToken: string) {
  const common = {
    httpOnly: true,
    secure: isProd(),
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  };

  res.setHeader('Set-Cookie', [
    serialize(ACCESS_COOKIE, accessToken, common),
    serialize(REFRESH_COOKIE, refreshToken, common)
  ]);
}

export function clearSupabaseSessionCookies(res: any) {
  const common = {
    httpOnly: true,
    secure: isProd(),
    sameSite: 'lax' as const,
    path: '/',
    expires: new Date(0)
  };

  res.setHeader('Set-Cookie', [
    serialize(ACCESS_COOKIE, '', common),
    serialize(REFRESH_COOKIE, '', common)
  ]);
}

export function getAccessTokenFromRequest(req: any): string | null {
  const cookies = parse(req.headers?.cookie || '');
  return cookies[ACCESS_COOKIE] || null;
}

export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  created_at?: string;
  last_sign_in_at?: string;
};

export function mapSupabaseUserToAppUser(user: SupabaseUser, profile?: any) {
  const meta = (user.user_metadata || {}) as any;

  return {
    id: user.id,
    email: user.email,
    firstName: profile?.first_name ?? meta.firstName ?? meta.first_name ?? null,
    lastName: profile?.last_name ?? meta.lastName ?? meta.last_name ?? null,
    phone: profile?.phone ?? meta.phone ?? null,
    userType: profile?.user_type ?? meta.userType ?? 'couple',
    profileImage: profile?.profile_image_url ?? null,
    createdAt: profile?.created_at ?? user.created_at,
    lastLogin: profile?.last_login ?? user.last_sign_in_at,
    isActive: profile?.is_active ?? true,
    emailVerified: profile?.email_verified ?? false
  };
}
