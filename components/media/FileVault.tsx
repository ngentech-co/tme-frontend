'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  listCapsulesAsync,
  openCapsule,
  type CapsuleListItem,
} from '@/lib/storage/capsules';

export default function FileVault() {
  const { user, loading } = useAuth();
  const [capsules, setCapsules] = useState<CapsuleListItem[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listCapsulesAsync(user.id).then(setCapsules);
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="body text-ink-muted">Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-reading text-center">
          <h1 className="display-md mb-6">Sign in to open your vault.</h1>
          <Link href="/onboarding" className="btn-primary">
            Start onboarding
          </Link>
        </div>
      </main>
    );
  }

  const relevant = capsules.filter(
    (c) => c.openedAt || new Date(c.unlockAt) <= new Date()
  );

  const openForFiles = async (capsuleId: string) => {
    if (!user) return;
    setBusyId(capsuleId);
    setError(null);
    try {
      await openCapsule(user.id, capsuleId);
      listCapsulesAsync(user.id).then(setCapsules);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-wide mx-auto">
        <Link href="/inbox" className="mono text-ink-muted hover:text-ink mb-10 inline-block">
          ← inbox
        </Link>
        <div className="mb-10">
          <p className="mono mb-3">vault</p>
          <h1 className="display-md mb-4">Your file vault.</h1>
          <p className="body-lg text-ink-muted">
            Media sealed inside your capsules. Capsules must be unlocked before
            their files become available.
          </p>
        </div>

        {error && <p className="body text-seal mb-6">{error}</p>}

        {relevant.length === 0 ? (
          <div className="card-paper p-16 text-center">
            <span className="seal-stamp mx-auto mb-8 inline-flex">📁</span>
            <h2 className="display-sm mb-4">Nothing in the vault yet.</h2>
            <p className="body text-ink-muted mb-8">
              When a capsule you've opened has media, it appears here.
            </p>
            <Link href="/seal" className="btn-primary">
              Seal a capsule
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {relevant.map((c) => {
              const isReady = new Date(c.unlockAt) <= new Date();
              const opened = !!c.openedAt;
              return (
                <div key={c.id} className="card-paper p-7 flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <h2 className="heading-md truncate">{c.title}</h2>
                    <p className="mono text-ink-soft mt-1">
                      {opened
                        ? `opened ${new Date(c.openedAt!).toLocaleDateString()}`
                        : isReady
                        ? 'ready to open'
                        : `unlocks ${new Date(c.unlockAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    {opened ? (
                      <Link href={`/capsule?id=${c.id}`} className="btn-ghost text-sm py-2 px-5">
                        View media
                      </Link>
                    ) : (
                      <button
                        onClick={() => openForFiles(c.id)}
                        disabled={busyId === c.id}
                        className="btn-primary text-sm py-2 px-5"
                      >
                        {busyId === c.id ? 'Opening…' : 'Open to reveal files'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
