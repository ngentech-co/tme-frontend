'use client';

/**
 * Supabase persistence for social features (comments, follows, reactions).
 * Falls back to local modules when offline.
 */

import { getSupabase, backendOnline } from '@/lib/backend';

// ---------- comments ----------

export async function listCommentsOnline(capsuleId: string) {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from('comments')
    .select('id, author_id, body, created_at')
    .eq('capsule_id', capsuleId)
    .order('created_at', { ascending: true });
  if (!data) return [];
  return data.map((c) => ({
    id: c.id,
    capsuleId,
    authorId: c.author_id,
    authorName: c.author_id.slice(0, 6),
    body: c.body,
    createdAt: c.created_at,
  }));
}

export async function addCommentOnline(
  capsuleId: string,
  authorId: string,
  body: string
) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from('comments')
    .insert({ capsule_id: capsuleId, author_id: authorId, body })
    .select()
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    capsuleId,
    authorId: data.author_id,
    authorName: data.author_id.slice(0, 6),
    body: data.body,
    createdAt: data.created_at,
  };
}

export async function deleteCommentOnline(commentId: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from('comments').delete().eq('id', commentId);
}

// ---------- follows ----------

export async function listFollowingOnline(userId: string) {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from('follows')
    .select('target_id, created_at')
    .eq('follower_id', userId);
  if (!data) return [];
  return data.map((f) => ({
    followerId: userId,
    targetId: f.target_id,
    targetName: f.target_id.slice(0, 6),
    followedAt: f.created_at,
  }));
}

export async function followOnline(userId: string, targetId: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb
    .from('follows')
    .upsert({ follower_id: userId, target_id: targetId });
}

export async function unfollowOnline(userId: string, targetId: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb
    .from('follows')
    .delete()
    .eq('follower_id', userId)
    .eq('target_id', targetId);
}

export async function followerCountOnline(targetId: string): Promise<number> {
  const sb = getSupabase();
  if (!sb) return 0;
  const { count } = await sb
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('target_id', targetId);
  return count ?? 0;
}

export async function isFollowingOnline(userId: string, targetId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data } = await sb
    .from('follows')
    .select('*')
    .eq('follower_id', userId)
    .eq('target_id', targetId)
    .maybeSingle();
  return Boolean(data);
}

// ---------- reactions ----------

export async function listReactionsOnline(capsuleId: string): Promise<Record<string, number>> {
  const sb = getSupabase();
  if (!sb) return {};
  const { data } = await sb
    .from('reactions')
    .select('emoji')
    .eq('capsule_id', capsuleId);
  const counts: Record<string, number> = {};
  for (const r of data ?? []) counts[r.emoji] = (counts[r.emoji] ?? 0) + 1;
  return counts;
}

export async function addReactionOnline(
  capsuleId: string,
  userId: string,
  emoji: string
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from('reactions').upsert({ capsule_id: capsuleId, user_id: userId, emoji });
}

export async function removeReactionOnline(
  capsuleId: string,
  userId: string,
  emoji: string
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb
    .from('reactions')
    .delete()
    .eq('capsule_id', capsuleId)
    .eq('user_id', userId)
    .eq('emoji', emoji);
}

export { backendOnline };
