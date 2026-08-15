import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client. Used for auth + capsule metadata reads.
 * Static export: anon key is safe to ship; RLS protects writes.
 * (Untyped client — database.types.ts is maintained for reference / codegen.)
 */

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (typeof window !== 'undefined') {
      console.warn(
        '[tomorrowme] Supabase env vars missing — running in offline mode.'
      );
    }
    return null;
  }

  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'tm:auth',
    },
  });

  return cachedClient;
}

export const supabaseEnabled = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
