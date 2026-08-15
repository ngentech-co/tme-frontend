'use client';

import { useState } from 'react';
import {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowerCount,
} from '@/lib/follows';

interface Props {
  userId: string; // current user (follower)
  targetId: string;
  targetName: string;
}

export default function FollowButton({ userId, targetId, targetName }: Props) {
  const [following, setFollowing] = useState(() =>
    typeof window === 'undefined' ? false : isFollowing(userId, targetId)
  );
  const [count, setCount] = useState(() => getFollowerCount(targetId));
  const [busy, setBusy] = useState(false);

  const toggle = () => {
    if (busy) return;
    setBusy(true);
    if (following) {
      unfollowUser(userId, targetId);
      setFollowing(false);
      setCount((c) => Math.max(0, c - 1));
    } else {
      followUser(userId, targetId, targetName);
      setFollowing(true);
      setCount((c) => c + 1);
    }
    setBusy(false);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggle}
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
