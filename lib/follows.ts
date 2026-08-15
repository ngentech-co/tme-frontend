'use client';

/**
 * Email-tier followers.
 * Online → Supabase `follows` table; offline → localStorage.
 */

import { backendOnline } from './backend';

const FOLLOW_KEY = 'tm:follows:';
const FOLLOWING_KEY_PREFIX = 'tm:following:';

export interface FollowRelation {
  followerId: string;
  targetId: string;
  targetName: string;
  followedAt: string;
}

/** Users the current user follows. */
export function listFollowing(userId: string): FollowRelation[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(FOLLOWING_KEY_PREFIX + userId);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as FollowRelation[];
  } catch {
    return [];
  }
}

/** Whether the current user follows a target. */
export function isFollowing(userId: string, targetId: string): boolean {
  return listFollowing(userId).some((f) => f.targetId === targetId);
}

/** Follow a user. */
export function followUser(
  userId: string,
  targetId: string,
  targetName: string
): FollowRelation {
  const following = listFollowing(userId);
  if (!following.some((f) => f.targetId === targetId)) {
    following.push({
      followerId: userId,
      targetId,
      targetName,
      followedAt: new Date().toISOString(),
    });
    localStorage.setItem(FOLLOWING_KEY_PREFIX + userId, JSON.stringify(following));
  }
  const rel = following.find((f) => f.targetId === targetId)!;
  bumpFollowerCount(userId, targetId, +1);
  return rel;
}

/** Unfollow a user. */
export function unfollowUser(userId: string, targetId: string): void {
  const following = listFollowing(userId).filter((f) => f.targetId !== targetId);
  localStorage.setItem(FOLLOWING_KEY_PREFIX + userId, JSON.stringify(following));
  bumpFollowerCount(userId, targetId, -1);
  if (backendOnline()) {
    import('@/lib/storage/social-supabase')
      .then(({ unfollowOnline }) => unfollowOnline(userId, targetId))
      .catch(() => {});
  }
}

// --- online-aware helpers (used by FollowButton) ---

export async function followAsync(
  userId: string,
  targetId: string,
  targetName: string
): Promise<FollowRelation> {
  const rel = followUser(userId, targetId, targetName);
  if (backendOnline()) {
    await import('@/lib/storage/social-supabase')
      .then(({ followOnline }) => followOnline(userId, targetId))
      .catch(() => {});
  }
  return rel;
}

export async function unfollowAsync(userId: string, targetId: string): Promise<void> {
  unfollowUser(userId, targetId);
  if (backendOnline()) {
    await import('@/lib/storage/social-supabase')
      .then(({ unfollowOnline }) => unfollowOnline(userId, targetId))
      .catch(() => {});
  }
}

export async function isFollowingAsync(userId: string, targetId: string): Promise<boolean> {
  if (backendOnline()) {
    const { isFollowingOnline } = await import('@/lib/storage/social-supabase');
    const on = await isFollowingOnline(userId, targetId);
    if (on) return true;
  }
  return isFollowing(userId, targetId);
}

export async function followerCountAsync(targetId: string): Promise<number> {
  if (backendOnline()) {
    const { followerCountOnline } = await import('@/lib/storage/social-supabase');
    return followerCountOnline(targetId);
  }
  return getFollowerCount(targetId);
}

// --- follower counts (per target) ---

function getFollowerCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(FOLLOW_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function getFollowerCount(targetId: string): number {
  return getFollowerCounts()[targetId] ?? 0;
}

function bumpFollowerCount(followerId: string, targetId: string, delta: number): void {
  const counts = getFollowerCounts();
  const cur = counts[targetId] ?? 0;
  counts[targetId] = Math.max(0, cur + delta);
  localStorage.setItem(FOLLOW_KEY, JSON.stringify(counts));
}

/** Named users available to follow in the demo (curated, email-tier). */
export const DEMO_USERS: Array<{ id: string; name: string; bio: string; topic: string }> = [
  { id: 'user-ada', name: 'Ada', bio: 'Sealing letters to my 40s.', topic: 'self-promises' },
  { id: 'user-linus', name: 'Linus', bio: 'Songs I will release in a decade.', topic: 'music-and-art' },
  { id: 'user-maya', name: 'Maya', bio: 'Grief letters, opened on memorial days.', topic: 'grief-and-memorial' },
  { id: 'user-jules', name: 'Jules', bio: 'Anniversary capsules for my wife.', topic: 'anniversaries' },
  { id: 'user-tom', name: 'Tom', bio: 'Predictions for the future. Mostly wrong.', topic: 'future-news' },
];
