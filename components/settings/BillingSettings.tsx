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
import SettingsSection from './SettingsSection';

export default function BillingSettings() {
  const { user } = useAuth();
  const [used, setUsed] = useState(0);
  const [capsules, setCapsules] = useState<CapsuleListItem[]>([]);

  useEffect(() => {
    if (!user) return;
    estimateStorageUsed(user.id).then(setUsed);
    setCapsules(listCapsules(user.id));
  }, [user]);

  const quota = storageQuotaBytes();
  const usedPct = Math.min(100, (used / quota) * 100);

  const sorted = [...capsules].sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 5);

  return (
    <SettingsSection
      title="Storage & quota"
      description="Free tier is generous. A premium tier is planned for future."
    >
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="mono">storage used</span>
          <span className="mono text-ink-muted">
            {formatBytes(used)} / {formatBytes(quota)}
          </span>
        </div>
        <div className="h-3 bg-border-subtle rounded-full overflow-hidden">
          <div
            className="h-full bg-seal transition-all duration-500"
            style={{ width: `${usedPct}%` }}
          />
        </div>
        <p className="body-sm text-ink-muted mt-3">
          {usedPct.toFixed(2)}% of free tier used.
        </p>
      </div>

      <div>
        <h3 className="heading-md mb-4">Largest capsules</h3>
        {sorted.length === 0 ? (
          <div className="bg-cream border border-border-subtle rounded-paper p-6 text-center">
            <p className="body text-ink-soft">No capsules yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {sorted.map((c) => (
              <li key={c.id} className="py-4 flex items-center justify-between gap-4">
                <span className="body truncate flex-1">{c.title}</span>
                <span className="mono text-sm text-ink-muted flex-shrink-0">
                  {formatBytes(c.sizeBytes)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10 p-6 bg-cream rounded-paper border border-border-subtle">
        <p className="mono mb-2 text-ink-muted">future premium</p>
        <p className="body text-ink-muted mb-4">
          Longer unlocks, bigger media, collaboration at scale, and on-chain
          proof of unlock. Join the waitlist to be first.
        </p>
        <Link href="/premium" className="btn-ghost text-sm py-2 px-5">
          Join the waitlist →
        </Link>
      </div>
    </SettingsSection>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
