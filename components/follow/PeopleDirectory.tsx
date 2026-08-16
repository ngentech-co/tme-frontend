'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { DEMO_USERS } from '@/lib/follows';
import FollowButton from './FollowButton';

export default function PeopleDirectory() {
  const { user, loading } = useAuth();

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
          <h1 className="display-md mb-6">Sign in to follow people.</h1>
          <Link href="/onboarding" className="btn-primary">
            Start onboarding
          </Link>
        </div>
      </main>
    );
  }

  const isEmail = user.tier === 'email';

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-12">
      <div className="max-w-wide mx-auto">
        <Link href="/inbox" className="mono text-ink-muted hover:text-ink mb-10 inline-block">
          ← inbox
        </Link>
        <div className="mb-10">
          <p className="mono mb-3">people</p>
          <h1 className="display-md mb-4">Who to follow.</h1>
          <p className="body-lg text-ink-muted">
            Follow people who seal capsules you care about.
          </p>
        </div>

        {!isEmail ? (
          <div className="card-paper p-12 text-center">
            <p className="body text-ink-muted mb-6">
              Following is an email-tier feature. Switch tiers in Settings to
              follow people.
            </p>
            <Link href="/settings/account" className="btn-primary">
              Manage account
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_USERS.map((p) => (
              <div key={p.id} className="card-paper p-7">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <h2 className="heading-md mb-1">{p.name}</h2>
                    <p className="body-sm text-ink-muted line-clamp-2">{p.bio}</p>
                  </div>
                  <span className="mono text-xs px-2.5 py-1 rounded-full bg-seal/10 text-seal flex-shrink-0">
                    {p.topic}
                  </span>
                </div>
                <FollowButton userId={user.id} targetId={p.id} targetName={p.name} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
