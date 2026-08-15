'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { acceptCollaborativeInvite } from '@/lib/storage/collab';

export default function AcceptInvite() {
  return (
    <Suspense fallback={<div className="max-w-reading mx-auto text-center"><p className="body text-ink-muted">Loading…</p></div>}>
      <AcceptInviteInner />
    </Suspense>
  );
}

function AcceptInviteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCapsule = searchParams.get('capsule');
  const initialCode = searchParams.get('code');
  const { user, loading } = useAuth();
  const [capsuleId, setCapsuleId] = useState(initialCapsule ?? '');
  const [code, setCode] = useState(initialCode ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (loading) {
    return (
      <div className="max-w-reading mx-auto text-center">
        <p className="body text-ink-muted">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-reading mx-auto text-center">
        <span className="seal-stamp mx-auto mb-8 inline-flex">🔗</span>
        <h1 className="display-md mb-6">Sign in to accept this invite.</h1>
        <p className="body text-ink-muted mb-8">
          You need an account to join a collaborative capsule.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => router.push('/onboarding')} className="btn-primary">
            Create an account
          </button>
          <button onClick={() => router.push('/auth')} className="btn-ghost">
            I already have one
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-reading mx-auto text-center">
        <span className="seal-stamp mx-auto mb-8 inline-flex">✓</span>
        <h1 className="display-md mb-6">You're in.</h1>
        <p className="body-lg text-ink-muted mb-8">
          Your share is stored on this device. Once the capsule's unlock date
          arrives, you'll be able to contribute your key.
        </p>
        <button onClick={() => router.push('/inbox')} className="btn-primary">
          Go to inbox
        </button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError(null);
    const r = await acceptCollaborativeInvite({
      capsuleId,
      inviteCode: code,
      inviteeId: user.id,
    });
    setBusy(false);
    if (!r.ok) {
      setError(r.error ?? 'Could not accept invite.');
      return;
    }
    setDone(true);
  };

  return (
    <div className="max-w-reading mx-auto">
      <div className="text-center mb-10">
        <span className="seal-stamp mx-auto mb-8 inline-flex">🔗</span>
        <p className="mono mb-3">collaborative capsule</p>
        <h1 className="display-md mb-4">Accept the invite.</h1>
        <p className="body text-ink-muted">
          Enter the invite code you received from the capsule owner. It holds the
          key-share that lets you co-open the capsule.
        </p>
      </div>

      <form onSubmit={submit} className="card-paper p-8 sm:p-10 space-y-5">
        <div>
          <label className="block mono mb-2">capsule id</label>
          <input
            value={capsuleId}
            onChange={(e) => setCapsuleId(e.target.value)}
            placeholder="Paste the capsule ID from your invite"
            className="w-full bg-cream border border-border-subtle rounded-paper px-4 py-3 font-mono text-sm focus:border-seal focus:outline-none"
          />
        </div>
        <div>
          <label className="block mono mb-2">invite code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="8-character code"
            className="w-full bg-cream border border-border-subtle rounded-paper px-4 py-3 font-mono text-sm tracking-widest text-center focus:border-seal focus:outline-none"
          />
        </div>
        {error && <p className="body-sm text-seal" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={busy || !capsuleId || !code}
          className="btn-primary w-full"
        >
          {busy ? 'Accepting…' : 'Accept invite'}
        </button>
      </form>
    </div>
  );
}
