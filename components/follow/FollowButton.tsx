'use client';

import { useEffect, useState } from 'react';
import {
  followAsync,
  unfollowAsync,
  isFollowingAsync,
  followerCountAsync,
} from '@/lib/follows';

interface Props {
  userId: string; // current user (follower)
  targetId: string;
  targetName: string;
}

export default function FollowButton({ userId, targetId, targetName }: Props) {
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    isFollowingAsync(userId, targetId).then(setFollowing);
    followerCountAsync(targetId).then(setCount);
  }, [userId, targetId]);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    if (following) {
      await unfollowAsync(userId, targetId);
      setFollowing(false);
      setCount((c) => Math.max(0, c - 1));
    } else {
      await followAsync(userId, targetId, targetName);
      setFollowing(true);
      setCount((c) => c + 1);
    }
    setBusy(false);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggle}
        disabled={busy}
        className={`text-sm py-2 px-5 rounded-full border transition-colors ${
          following
            ? 'border-border-subtle text-ink-muted'
            : 'border-seal text-seal hover:bg-seal hover:text-cream'
        }`}
      >
        {following ? 'Following ✓' : 'Follow'}
      </button>
      <span className="mono text-xs text-ink-soft">
        {count} {count === 1 ? 'follower' : 'followers'}
      </span>
    </div>
  );
}
