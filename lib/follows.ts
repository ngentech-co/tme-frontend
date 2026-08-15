'use client';

/**
 * Email-tier followers. Local for the demo (structured for Supabase sync).
 *
 * Follow is user↔user. In a real deployment follows are records in a
 * `follows` table; here they persist to localStorage keyed by follower id.
 */

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
