'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TOPICS, STARTER_CAPSULES } from '@/lib/topics';
import { useAuth } from '@/lib/auth-context';
import { listCapsules, type CapsuleListItem } from '@/lib/storage/capsules';

export default function ExploreView() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="body text-ink-muted">Loading…</p></div>}>
      <ExploreInner />
    </Suspense>
  );
}

function ExploreInner() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [topic, setTopic] = useState(searchParams.get('topic') ?? '');
  const [localPublic, setLocalPublic] = useState<CapsuleListItem[]>([]);

  useEffect(() => {
    if (!user) return;
    // The user's own public capsules (same-device demo).
    setLocalPublic(listCapsules(user.id).filter((c) => c.visibility === 'public'));
  }, [user]);

  const filteredStarter = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STARTER_CAPSULES.filter((c) => {
      const topicMatch = !topic || c.topic === topic;
      const queryMatch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q);
      return topicMatch && queryMatch;
    });
  }, [query, topic]);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-wide mx-auto">
        <div className="mb-10">
          <p className="mono mb-3">explore</p>
          <h1 className="display-md mb-4">Capsules sealed by others.</h1>
          <p className="body-lg text-ink-muted">
            Public time capsules — waiting to be opened. Yours can join them.
          </p>
        </div>

        <div className="card-paper p-6 mb-8">
          <label className="block mono mb-3">search</label>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="love letters, birthdays, songs…"
            className="w-full bg-cream border border-border-subtle rounded-paper px-5 py-4 body focus:border-seal focus:outline-none"
          />
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setTopic('')}
              className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                !topic ? 'border-seal bg-seal/10 text-seal' : 'border-border-subtle text-ink-muted hover:border-ink-muted'
              }`}
            >
              all
            </button>
            {TOPICS.map((t) => (
              <button
                key={t.slug}
                onClick={() => setTopic(t.slug === topic ? '' : t.slug)}
                className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  topic === t.slug
                    ? 'border-seal bg-seal/10 text-seal'
                    : 'border-border-subtle text-ink-muted hover:border-ink-muted'
                }`}
              >
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
        </div>

        {localPublic.length > 0 && (
          <div className="mb-10">
            <h2 className="mono mb-5 text-ink-muted">your public capsules</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {localPublic.map((c) => (
                <Link
                  key={c.id}
                  href={`/public/?slug=${c.shareSlug}`}
                  className="card-paper p-7 hover:shadow-paper-lg hover:-translate-y-0.5 transition-all"
                >
                  <h3 className="heading-md mb-3">{c.title}</h3>
                  <p className="mono text-ink-soft">
                    unlocks {new Date(c.unlockAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mono mb-5 text-ink-muted">curated capsules</h2>
          {filteredStarter.length === 0 ? (
            <div className="card-paper p-12 text-center">
              <p className="body text-ink-muted">
                No public capsules match that yet. Be the first to seal one.
              </p>
              <Link href="/seal" className="btn-primary mt-6">
                Seal a capsule
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStarter.map((c) => (
                <div key={c.id} className="card-paper p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="mono text-xs text-ink-soft">{c.author}</span>
                    <span className="mono text-xs text-seal">
                      {TOPICS.find((t) => t.slug === c.topic)?.emoji}
                    </span>
                  </div>
                  <h3 className="heading-md mb-3">{c.title}</h3>
                  <p className="body-sm text-ink-muted mb-5">{c.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="mono text-xs text-ink-soft">
                      opens {new Date(c.unlockDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </p>
                    <Link href={`/topics/${c.topic}`} className="btn-link text-sm">
                      {TOPICS.find((t) => t.slug === c.topic)?.name} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
