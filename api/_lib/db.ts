import { neon } from '@neondatabase/serverless';

export type SqlParams = unknown[];

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL');
  }

  return neon(databaseUrl);
}
