'use client';

/**
 * Central backend adapter for tomorrowme (tme).
 *
 * The app runs in one of two modes:
 *   - ONLINE: Supabase env vars present → capsules/comments/follows/etc sync
 *     to Supabase (Postgres + Storage). RLS enforces access.
 *   - OFFLINE: no env vars → falls back to localStorage + IndexedDB (the
 *     historical behavior), so the app still works as a static demo.
 *
 * All storage modules import `backendOnline()` / `getSupabase()` from here so
 * the switch is centralized.
 */

import { getSupabase, supabaseEnabled } from './supabase';

export const backendOnline = (): boolean => {
  return supabaseEnabled();
};

export { getSupabase };

/**
 * Sign in via email magic link. Returns ok/error. In offline mode this just
 * records a local session (see auth-context) — real emails only when Supabase
 * is configured.
 */
export async function backendSendMagicLink(email: string): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: true }; // offline: local session is set by caller
  const { error } = await sb.auth.signInWithOtp({ email });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Register a user profile row (created lazily on first login).
 */
export async function ensureUserProfile(opts: {
  id: string;
  email?: string | null;
  tier: 'anonymous' | 'email' | 'passkey';
}): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { data } = await sb.from('users').select('id').eq('id', opts.id).maybeSingle();
  if (data) return;
  await sb.from('users').insert({
    id: opts.id,
    email: opts.email ?? null,
    tier: opts.tier,
  });
}

/**
 * Append an audit entry. Online → audit_log table; offline → local.
 */
export async function backendLogAudit(userId: string, action: string, detail?: string): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from('audit_log').insert({ user_id: userId, action, detail });
      return;
    } catch {
      // fall through to local
    }
  }
  const { logAudit } = await import('./audit');
  logAudit(userId, action, detail);
}

/**
 * Fetch the audit trail. Online → from Supabase; offline → local.
 */
export async function backendListAudit(userId: string, limit = 100) {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb
      .from('audit_log')
      .select('id, action, detail, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (data) {
      return data.map((e) => ({
        id: e.id,
        userId,
        action: e.action,
        detail: e.detail ?? undefined,
        createdAt: e.created_at,
      }));
    }
  }
  const { listAudit } = await import('./audit');
  return listAudit(userId, limit);
}
