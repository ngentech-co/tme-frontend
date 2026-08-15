'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { openCapsule, readCapsule, type StoredCapsule } from '@/lib/storage/capsules';
import RevealCeremony from '@/components/capsule/RevealCeremony';

export default function UnlockView() {
  return (
    <Suspense fallback={<Loading />}>
      <UnlockViewInner />
    </Suspense>
  );
}

function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="body text-ink-muted">Loading…</p>
    </main>
  );
}

function UnlockViewInner() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const capsuleId = searchParams.get('id');
  const [capsule, setCapsule] = useState<StoredCapsule | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !capsuleId) return;
    const c = readCapsule(user.id, capsuleId);
    if (!c) {
      setError('Capsule not found.');
      return;
    }
    setCapsule(c);
    if (c.openedAt) {
      openCapsule(user.id, capsuleId, { force: true })
        .then((r) => setText(r.text))
        .catch((e) => setError(e.message));
    }
  }, [user, capsuleId]);

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
          <h1 className="display-md mb-6">Sign in to view this capsule.</h1>
          <Link href="/onboarding" className="btn-primary">
            Start onboarding
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-reading text-center">
          <span className="seal-stamp mx-auto mb-8 inline-flex">!</span>
          <h1 className="display-md mb-6">{error}</h1>
          <Link href="/inbox" className="btn-primary">
            Back to inbox
          </Link>
        </div>
      </main>
    );
  }

  if (!capsule || !text) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="body text-ink-muted">Decrypting…</p>
      </main>
    );
  }

  return (
    <RevealCeremony
      title={capsule.title}
      text={text}
      openedAt={capsule.openedAt ?? new Date().toISOString()}
    />
  );
}
