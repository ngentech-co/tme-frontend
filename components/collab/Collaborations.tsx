'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  getCollabSeal,
  listCollabForMember,
  type CollaborativeSeal,
} from '@/lib/storage/collab';
import { readCapsule } from '@/lib/storage/capsules';

export default function Collaborations() {
  const { user, loading } = useAuth();
  const [seals, setSeals] = useState<CollaborativeSeal[]>([]);

  useEffect(() => {
    if (!user) return;
    setSeals(listCollabForMember(user.id));
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
          <h1 className="display-md mb-6">Sign in to see collaborations.</h1>
          <Link href="/onboarding" className="btn-primary">
            Start onboarding
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-wide mx-auto">
        <Link href="/inbox" className="mono text-ink-muted hover:text-ink mb-10 inline-block">
          ← inbox
        </Link>
        <div className="mb-10">
          <p className="mono mb-3">collaborations</p>
          <h1 className="display-md mb-4">Capsules you share.</h1>
          <p className="body-lg text-ink-muted">
            Collaborative capsules use k-of-n secret sharing: the capsule opens only
            when enough co-authors contribute their key-shares after the unlock date.
          </p>
        </div>

        {seals.length === 0 ? (
          <div className="card-paper p-16 text-center">
            <span className="seal-stamp mx-auto mb-8 inline-flex">🤝</span>
            <h2 className="display-sm mb-4">No collaborations yet.</h2>
            <p className="body text-ink-muted mb-8">
              Seal a capsule with co-authors to start one.
            </p>
            <Link href="/seal" className="btn-primary">
              Seal a collaborative capsule
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {seals.map((seal) => {
              const capsule = readCapsule(user.id, seal.capsuleId);
              const member = seal.members.find((m) => m.id === user.id);
              const accepted = seal.members.filter((m) => m.status === 'accepted').length;
              const pending = seal.members.filter((m) => m.status === 'pending').length;
              return (
                <div key={seal.capsuleId} className="card-paper p-7">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="heading-md flex-1">
                      {capsule?.title ?? 'Collaborative capsule'}
                    </h2>
                    <span className="mono text-xs px-3 py-1 rounded-full bg-seal/10 text-seal">
                      {seal.threshold}-of-{seal.shareCount}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {seal.members.map((m) => (
                        <span
                          key={m.id}
                          className={`mono text-xs px-2.5 py-1 rounded-full border ${
                            m.status === 'accepted'
                              ? 'border-border-subtle text-ink'
                              : 'border-dashed border-border-strong text-ink-soft'
                          }`}
                          title={m.status === 'accepted' ? 'Accepted' : 'Pending'}
                        >
                          {m.name} {m.status === 'accepted' ? '✓' : '…'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <p className="mono text-xs text-ink-soft">
                      {accepted} accepted · {pending} pending
                    </p>
                    <Link href={`/capsule?id=${seal.capsuleId}`} className="btn-link text-sm">
                      View →
                    </Link>
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
