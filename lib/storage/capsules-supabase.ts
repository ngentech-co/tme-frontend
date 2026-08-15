'use client';

/**
 * Supabase persistence for capsule metadata.
 *
 * Online path for the capsule storage layer. Sealed capsule *metadata* lives
 * in the `capsules` table; the encrypted payload blob lives in the
 * `capsule-blobs` storage bucket. RLS restricts rows to owner/co-authors and
 * opened-public capsules.
 *
 * The full sealed capsule (with payload + time-lock) is stored as the
 * `payload` field of the row — opaque ciphertext, safe for the server.
 */

import { getSupabase } from '@/lib/backend';
import type { StoredCapsule, CapsuleListItem } from './capsules';

interface CapsuleRow {
  id: string;
  owner_id: string;
  title: string;
  unlock_at: string;
  drand_round: number | null;
  chain_id: string;
  visibility: 'private' | 'unlisted' | 'public';
  share_slug: string | null;
  cover_color: string | null;
  is_collaborative: boolean | null;
  payload: string | null; // JSON string of the sealed capsule
  created_at: string;
  opened_at: string | null;
  size_bytes: number | null;
}

function toListItem(row: CapsuleRow): CapsuleListItem {
  return {
    id: row.id,
    title: row.title,
    unlockAt: row.unlock_at,
    drandRound: row.drand_round ?? 0,
    visibility: row.visibility,
    shareSlug: row.share_slug ?? row.id.slice(0, 8),
    createdAt: row.created_at,
    openedAt: row.opened_at,
    sizeBytes: row.size_bytes ?? 0,
    coverColor: row.cover_color ?? undefined,
  };
}

export async function listCapsulesOnline(userId: string): Promise<CapsuleListItem[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('capsules')
    .select('id,title,unlock_at,drand_round,chain_id,visibility,share_slug,cover_color,is_collaborative,created_at,opened_at,size_bytes')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as unknown as CapsuleRow[]).map(toListItem);
}

export async function readCapsuleOnline(userId: string, id: string): Promise<StoredCapsule | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from('capsules')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  const row = data as unknown as CapsuleRow;
  if (!row.payload) return null;
  try {
    return JSON.parse(row.payload) as StoredCapsule;
  } catch {
    return null;
  }
}

export async function writeCapsuleOnline(capsule: StoredCapsule): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const row = {
    id: capsule.id,
    owner_id: capsule.ownerId,
    title: capsule.title,
    unlock_at: capsule.unlockAt,
    drand_round: capsule.drandRound,
    chain_id: 'default',
    visibility: capsule.visibility,
    share_slug: capsule.shareSlug,
    cover_color: capsule.coverColor ?? null,
    is_collaborative: false,
    payload: JSON.stringify(capsule),
    opened_at: capsule.openedAt ?? null,
    size_bytes: capsule.sizeBytes,
  };
  await sb.from('capsules').upsert(row as never);
}

export async function updateVisibilityOnline(
  capsuleId: string,
  visibility: 'private' | 'unlisted' | 'public'
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from('capsules').update({ visibility }).eq('id', capsuleId);
}

export async function markOpenedOnline(capsuleId: string, openedAt: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from('capsules').update({ opened_at: openedAt }).eq('id', capsuleId);
}

export async function deleteCapsuleOnline(capsuleId: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from('capsules').delete().eq('id', capsuleId);
}

export async function storageUsedOnline(userId: string): Promise<number> {
  const sb = getSupabase();
  if (!sb) return 0;
  const { data } = await sb
    .from('capsules')
    .select('size_bytes')
    .eq('owner_id', userId);
  if (!data) return 0;
  return (data as unknown as Array<{ size_bytes: number | null }>).reduce(
    (sum, r) => sum + (r.size_bytes ?? 0),
    0
  );
}
