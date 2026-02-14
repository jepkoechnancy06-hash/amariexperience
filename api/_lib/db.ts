import { neon } from '@neondatabase/serverless';

export type SqlParams = unknown[];

// ── Dual-database failover ─────────────────────────────────────────
// Primary:   Neon   (DATABASE_URL)
// Secondary: Supabase (SUPABASE_DB_URL)
// Every query attempts Neon first. If Neon is unreachable or errors,
// the same query is transparently retried against Supabase so the
// platform stays online even if one provider has an outage.
// ────────────────────────────────────────────────────────────────────

function getNeonSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    return neon(url);
  } catch {
    return null;
  }
}

function getSupabaseSql() {
  const url = process.env.SUPABASE_DB_URL;
  if (!url) return null;
  try {
    return neon(url);
  } catch {
    return null;
  }
}

/** Returns the primary (Neon) sql tagged-template function. Falls back to Supabase. */
export function getSql() {
  const primary = getNeonSql();
  if (primary) return primary;

  const secondary = getSupabaseSql();
  if (secondary) {
    console.warn('[DB] Neon unavailable – using Supabase as fallback');
    return secondary;
  }

  throw new Error('Missing DATABASE_URL and SUPABASE_DB_URL – no database configured');
}

/**
 * Run a parameterized query string (not a tagged template).
 * Tries Neon first; on failure automatically retries on Supabase.
 */
export async function runQuery(query: string, params: unknown[] = []): Promise<any[]> {
  // neon() returns a callable function: sql(queryString, paramsArray)
  // 1. Try primary (Neon)
  const primary = getNeonSql();
  if (primary) {
    try {
      const result = await (primary as any)(query, params);
      return Array.isArray(result) ? result : result?.rows ?? [];
    } catch (neonErr: any) {
      console.error('[DB] Neon query failed, attempting Supabase failover:', neonErr?.message);
    }
  }

  // 2. Failover to secondary (Supabase)
  const secondary = getSupabaseSql();
  if (secondary) {
    try {
      console.warn('[DB] Executing query on Supabase (failover)');
      const result = await (secondary as any)(query, params);
      return Array.isArray(result) ? result : result?.rows ?? [];
    } catch (supaErr: any) {
      console.error('[DB] Supabase failover also failed:', supaErr?.message);
      throw supaErr;
    }
  }

  throw new Error('No database connection available');
}
