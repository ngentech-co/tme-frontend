'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { listCapsules, type CapsuleListItem } from '@/lib/storage/capsules';
import CountdownInline from '@/components/capsule/CountdownInline';

export default function PublicCapsule() {
  return (
    <Suspense fallback={<Loading />}>
      <PublicCapsuleInner />
    </Suspense>
  );
}

function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <p className="body text-ink-muted">Loading…</p>
    </main>
  );
}

function PublicCapsuleInner() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [capsule, setCapsule] = useState<CapsuleListItem | null>(null);

  useEffect(() => {
    if (!user || !slug) return;
    const found = listCapsules(user.id).find((c) => c.shareSlug === slug);
    setCapsule(found ?? null);
  }, [user, slug]);

  if (!capsule) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-reading text-center">
          <span className="seal-stamp mx-auto mb-8 inline-flex">seal</span>
          <p className="mono mb-3 text-seal">a sealed capsule</p>
          <h1 className="display-md mb-6 text-balance">
            Someone, somewhere, is waiting for this.
          </h1>
          <p className="body-lg text-ink-muted mb-10">
            This capsule is sealed until its author chooses to reveal it.
            When that moment arrives, the math will let go.
          </p>
          <Link href="/" className="btn-primary">
            Seal your own
          </Link>
        </div>
      </main>
    );
  }

  const unlockDate = new Date(capsule.unlockAt);
  const isReady = unlockDate <= new Date();
  const opened = !!capsule.openedAt;

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-20">
      <div className="max-w-prose mx-auto text-center">
        <span className="seal-stamp mx-auto mb-10 inline-flex">tm</span>
        <p className="mono text-seal mb-6">a sealed capsule</p>
        <h1 className="display-md mb-6 text-balance">{capsule.title}</h1>
        <p className="body-lg text-ink-muted mb-12">
          {opened
            ? 'This capsule has been opened.'
            : isReady
            ? 'This capsule is ready to be opened.'
            : `It opens on ${unlockDate.toLocaleDateString('en-US', {
                dateStyle: 'long',
              })}.`}
        </p>

        {!opened && !isReady && (
          <div className="card-paper p-10 mb-10">
            <p className="mono mb-4">time remaining</p>
            <CountdownInline to={unlockDate} className="text-3xl justify-center" />
          </div>
        )}

        {opened && (
          <Link href={`/capsule/unlock?id=${capsule.id}`} className="btn-primary">
            Read it (sign in to decrypt)
          </Link>
        )}

        <p className="mt-12 body-sm text-ink-soft">
          Sealed by cryptography. Opened by time.
        </p>
      </div>
    </main>
  );
}
