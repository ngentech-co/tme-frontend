'use client';

import { useEffect, useState } from 'react';
import { backendOnline } from '@/lib/backend';
import { useAuth } from '@/lib/auth-context';

/**
 * Reactions on unlocked capsules.
 * Online → Supabase `reactions` table; offline → localStorage.
 */

const REACTIONS = ['✨', '❤️', '😭', '🤯', '🙌', '🕯️'];

interface Props {
  capsuleId: string;
  allowReact: boolean;
}

const KEY = 'tm:reactions:';

export default function Reactions({ capsuleId, allowReact }: Props) {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      if (backendOnline()) {
        const { listReactionsOnline } = await import('@/lib/storage/social-supabase');
        const remote = await listReactionsOnline(capsuleId);
        setCounts(remote);
        localStorage.setItem(KEY + capsuleId, JSON.stringify(remote));
        return;
      }
      const raw = localStorage.getItem(KEY + capsuleId);
      if (raw) {
        try {
          setCounts(JSON.parse(raw));
        } catch {
          /* ignore */
        }
      }
    })();
  }, [capsuleId]);

  const react = (emoji: string) => {
    if (!allowReact || !user) return;
    const nextCounts = { ...counts, [emoji]: (counts[emoji] ?? 0) + 1 };
    const nextMine = { ...mine, [emoji]: !mine[emoji] };
    // Toggle off if already reacted
    if (mine[emoji]) {
      nextCounts[emoji] = Math.max(0, (counts[emoji] ?? 1) - 1);
    }
    setCounts(nextCounts);
    setMine(nextMine);
    localStorage.setItem(KEY + capsuleId, JSON.stringify(nextCounts));
    if (backendOnline()) {
      import('@/lib/storage/social-supabase').then((m) => {
        if (mine[emoji]) m.removeReactionOnline(capsuleId, user.id, emoji);
        else m.addReactionOnline(capsuleId, user.id, emoji);
      }).catch(() => {});
    }
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0 && !allowReact) return null;

  return (
    <div className="card-paper p-6 mb-10">
      <div className="flex items-center justify-between mb-4">
        <p className="mono">reactions</p>
        {allowReact ? (
          <span className="mono text-xs text-ink-soft">tap to add yours</span>
        ) : (
          <span className="mono text-xs text-ink-soft">
            {total} {total === 1 ? 'reaction' : 'reactions'}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((e) => {
          const count = counts[e] ?? 0;
          if (count === 0 && !allowReact) return null;
          return (
            <button
              key={e}
              onClick={() => react(e)}
              disabled={!allowReact}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                mine[e]
                  ? 'border-seal bg-seal/10'
                  : 'border-border-subtle hover:border-ink-muted'
              } ${!allowReact ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span>{e}</span>
              {count > 0 && <span className="mono text-xs">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
