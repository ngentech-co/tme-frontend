'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  deleteCapsule,
  openCapsule,
  readCapsule,
  type StoredCapsule,
} from '@/lib/storage/capsules';
import CountdownInline from '@/components/capsule/CountdownInline';
import RevealCeremony from '@/components/capsule/RevealCeremony';
import { trackEvent } from '@/lib/analytics';

export default function CapsuleDetail() {
  return (
    <Suspense fallback={<Loading />}>
      <CapsuleDetailInner />
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

function CapsuleDetailInner() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const capsuleId = searchParams.get('id');
  const [capsule, setCapsule] = useState<StoredCapsule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'detail' | 'revealing' | 'opened'>('detail');
  const [openedText, setOpenedText] = useState<string | null>(null);
  const [mediaKey, setMediaKey] = useState<Uint8Array | undefined>(undefined);
  const [openedMedia, setOpenedMedia] = useState<import('@/lib/crypto/media').MediaAssetMeta[] | undefined>(undefined);

  useEffect(() => {
    if (!user || !capsuleId) return;
    const c = readCapsule(user.id, capsuleId);
    if (!c) {
      setError('Capsule not found in your inbox.');
      return;
    }
    setCapsule(c);
  }, [user, capsuleId]);

  const onOpen = async () => {
    if (!user || !capsule) return;
    setPhase('revealing');
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const result = await openCapsule(user.id, capsule.id);
      trackEvent('capsule_unlocked', { tier: user.tier, visibility: capsule.visibility });
      setOpenedText(result.text);
      setMediaKey(result.mediaKey);
      setOpenedMedia(result.media);
      setPhase('opened');
    } catch (e) {
      setError((e as Error).message);
      setPhase('detail');
    }
  };

  const onDelete = async () => {
    if (!user || !capsule) return;
    if (!confirm('Permanently delete this capsule? This cannot be undone.')) return;
    await deleteCapsule(user.id, capsule.id);
    router.push('/inbox');
  };

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

  if (!capsule) return null;

  if (phase === 'revealing') {
    return <RevealCeremony title={capsule.title} onComplete={() => {}} />;
  }

  if (phase === 'opened' && openedText !== null) {
    return (
      <RevealCeremony
        title={capsule.title}
        text={openedText}
        openedAt={capsule.openedAt ?? new Date().toISOString()}
        onComplete={() => router.push('/inbox')}
        userId={user.id}
        capsuleId={capsule.id}
        media={openedMedia}
        mediaKey={mediaKey}
      />
    );
  }

  const unlockDate = new Date(capsule.unlockAt);
  const isReady = unlockDate <= new Date();
  const opened = !!capsule.openedAt;

  return (
    <main className="min-h-screen px-6 py-12 sm:py-16">
      <div className="max-w-prose mx-auto">
        <Link
          href="/inbox"
          className="mono text-ink-muted hover:text-ink transition-colors mb-10 inline-block"
        >
          ← inbox
        </Link>

        <div className="card-paper p-8 sm:p-12 mb-8">
          <div className="flex items-baseline justify-between mb-3">
            <span className="mono text-ink-soft">{capsule.visibility}</span>
            <span className="mono text-ink-soft">
              round {capsule.drandRound.toLocaleString()}
            </span>
          </div>
          <h1 className="display-md mb-6 text-balance">{capsule.title}</h1>
          <p className="mono text-ink-muted mb-10">
            {opened
              ? `opened ${new Date(capsule.openedAt!).toLocaleString()}`
              : isReady
              ? 'ready to open'
              : `unlocks ${unlockDate.toLocaleString('en-US', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}`}
          </p>

          {!opened && !isReady && (
            <div className="border-t border-border-subtle pt-10">
              <p className="mono mb-4">time remaining</p>
              <CountdownInline to={unlockDate} className="text-2xl" />
            </div>
          )}

          {(isReady || opened) && (
            <div className="border-t border-border-subtle pt-10 text-center">
              {opened ? (
                <Link href={`/capsule/unlock?id=${capsule.id}`} className="btn-primary">
                  Read it again
                </Link>
              ) : (
                <button onClick={onOpen} className="btn-primary text-base px-10">
                  Open the capsule
                </button>
              )}
            </div>
          )}
        </div>

        {capsule.visibility !== 'private' && (
          <div className="card-paper p-6 mb-8">
            <p className="mono mb-3">share</p>
            <div className="flex items-center gap-3 bg-cream border border-border-subtle rounded-paper px-4 py-3">
              <code className="flex-1 font-mono text-sm truncate">
                {`${typeof window !== 'undefined' ? window.location.origin : ''}/public/?slug=${capsule.shareSlug}`}
              </code>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard?.writeText(
                      `${window.location.origin}/public/?slug=${capsule.shareSlug}`
                    );
                  }
                }}
                className="btn-link text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="mono text-ink-soft">
            created {new Date(capsule.createdAt).toLocaleDateString()}
          </p>
          <button onClick={onDelete} className="btn-link text-sm text-seal">
            Delete capsule
          </button>
        </div>
      </div>
    </main>
  );
}
