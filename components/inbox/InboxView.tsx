'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  estimateStorageUsed,
  listCapsules,
  storageQuotaBytes,
  type CapsuleListItem,
} from '@/lib/storage/capsules';
import CountdownInline from '@/components/capsule/CountdownInline';
import { STORAGE, SITE } from '@/lib/constants';

export default function InboxView() {
  const { user, loading, signOut } = useAuth();
  const [capsules, setCapsules] = useState<CapsuleListItem[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    if (!user) return;
    setCapsules(listCapsules(user.id));
    estimateStorageUsed(user.id).then(setStorageUsed);
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="body text-ink-muted">Loading your inbox…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-reading text-center">
          <span className="seal-stamp mx-auto mb-8 inline-flex">inbox</span>
          <h1 className="display-md mb-6">Sign in to see your capsules.</h1>
          <p className="body-lg text-ink-muted mb-10">
            Your inbox holds every capsule you've sealed. Sign in to continue.
          </p>
          <Link href="/onboarding" className="btn-primary">
            Start onboarding
          </Link>
        </div>
      </main>
    );
  }

  const quota = storageQuotaBytes();
  const usedPct = Math.min(100, (storageUsed / quota) * 100);

  const sealed = capsules.filter(
    (c) => !c.openedAt && new Date(c.unlockAt) > new Date()
  );
  const unlockable = capsules.filter(
    (c) => !c.openedAt && new Date(c.unlockAt) <= new Date()
  );
  const opened = capsules.filter((c) => c.openedAt);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-wide mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="mono mb-3">your inbox</p>
            <h1 className="display-md">
              Hello{user.email ? `, ${user.email.split('@')[0]}` : ''}.
            </h1>
            <p className="body text-ink-muted mt-2">
              {user.tier === 'anonymous' && 'Anonymous account · self-custody.'}
              {user.tier === 'email' && 'Email account · public profile enabled.'}
              {user.tier === 'passkey' && 'Passkey account · maximum privacy.'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/seal" className="btn-primary">
              Seal a new capsule
            </Link>
            <Link href="/vault" className="btn-ghost">
              File vault
            </Link>
            <Link href="/inbox/settings" className="btn-link">
              Settings
            </Link>
          </div>
        </div>

        {/* Storage meter */}
        <div className="card-paper p-6 mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="mono">storage</span>
            <span className="mono text-ink-muted">
              {formatBytes(storageUsed)} / {formatBytes(quota)}
            </span>
          </div>
          <div className="h-2 bg-border-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-seal transition-all duration-500"
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </div>

        {capsules.length === 0 ? (
          <div className="card-paper p-16 text-center">
            <span className="seal-stamp mx-auto mb-8 inline-flex">empty</span>
            <h2 className="display-sm mb-4">No capsules yet.</h2>
            <p className="body text-ink-muted mb-10">
              Seal your first letter to the future. It only takes a few minutes.
            </p>
            <Link href="/seal" className="btn-primary">
              Seal your first capsule
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {unlockable.length > 0 && (
              <Section label="ready to open" highlight>
                {unlockable.map((c) => (
                  <CapsuleCard key={c.id} capsule={c} />
                ))}
              </Section>
            )}

            {sealed.length > 0 && (
              <Section label="sealed">
                {sealed.map((c) => (
                  <CapsuleCard key={c.id} capsule={c} />
                ))}
              </Section>
            )}

            {opened.length > 0 && (
              <Section label="opened">
                {opened.map((c) => (
                  <CapsuleCard key={c.id} capsule={c} />
                ))}
              </Section>
            )}
          </div>
        )}

        <div className="mt-20 pt-10 border-t border-border-subtle flex items-center justify-between flex-wrap gap-4">
          <p className="mono text-ink-soft">{SITE.name}</p>
          <button onClick={signOut} className="btn-link text-sm">
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}

function Section({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <section>
      <h2 className={`mono mb-6 ${highlight ? 'text-seal' : 'text-ink-muted'}`}>
        {label}
      </h2>
      <div className="grid md:grid-cols-2 gap-5">{children}</div>
    </section>
  );
}

function CapsuleCard({ capsule }: { capsule: CapsuleListItem }) {
  const isReady = !capsule.openedAt && new Date(capsule.unlockAt) <= new Date();
  const opened = !!capsule.openedAt;

  return (
    <Link
      href={`/capsule?id=${capsule.id}`}
      className="card-paper p-7 hover:shadow-paper-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="heading-md flex-1 mr-3">{capsule.title}</h3>
        {isReady && <span className="seal-stamp !w-9 !h-9 !text-xs">✓</span>}
      </div>
      <p className="mono text-ink-soft mb-5">
        {opened
          ? `opened ${new Date(capsule.openedAt!).toLocaleDateString()}`
          : isReady
          ? 'ready to open'
          : `unlocks ${new Date(capsule.unlockAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}`}
      </p>
      {!opened && !isReady && <CountdownInline to={new Date(capsule.unlockAt)} />}
      <div className="flex items-center justify-between mt-5 pt-5 border-t border-border-subtle">
        <span className="mono text-xs">{capsule.visibility}</span>
        <span className="mono text-xs">
          {Math.round(capsule.sizeBytes / 1024)} KB
        </span>
      </div>
    </Link>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
