'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  buildBookmarkUrl,
  downloadMnemonicFile,
  formatMnemonicGrid,
} from '@/lib/recovery';
import { STORAGE, TIERS } from '@/lib/constants';
import type { TierId } from '@/lib/constants';
import SettingsSection, { Field, Toggle } from './SettingsSection';

export default function AccountSettings() {
  const router = useRouter();
  const { user, switchTier, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmTier, setConfirmTier] = useState<TierId | null>(null);

  if (!user) return null;

  const recovery = typeof window !== 'undefined' ? localStorage.getItem(STORAGE.recoveryKeyLocal) : null;

  const handleSwitch = async (tier: TierId) => {
    setError(null);
    setBusy(true);
    const r = await switchTier(tier);
    setBusy(false);
    if (!r.ok) {
      setError(r.error ?? 'Could not switch tier.');
    }
    setConfirmTier(null);
    router.refresh();
  };

  const onDownloadRecovery = () => {
    if (recovery) downloadMnemonicFile(recovery);
  };

  const onCopyBookmark = async () => {
    if (!recovery) return;
    const url = buildBookmarkUrl(recovery);
    await navigator.clipboard?.writeText(url);
  };

  return (
    <SettingsSection
      title="Account & identity"
      description="Manage your tier, recovery key, and connected sign-in methods."
    >
      <Field label="Current tier" hint={`You're on a ${user.tier} account.`}>
        <span className="seal-stamp !w-9 !h-9 !text-xs">{user.tier[0]}</span>
      </Field>

      <Field
        label="Switch tier"
        hint="Each tier has different defaults. Switching is reversible."
      >
        <div className="flex gap-2 flex-wrap justify-end">
          {(['anonymous', 'email', 'passkey'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setConfirmTier(t)}
              disabled={user.tier === t || busy}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                user.tier === t
                  ? 'border-border-subtle text-ink-soft cursor-default'
                  : 'border-seal text-seal hover:bg-seal hover:text-cream'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      {confirmTier && (
        <div className="my-6 p-5 border border-seal rounded-paper bg-seal/5">
          <p className="body font-medium mb-2">Switch to {confirmTier}?</p>
          <p className="body-sm text-ink-muted mb-4">
            Your existing capsules will adjust visibility accordingly. You can
            switch back at any time.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleSwitch(confirmTier)}
              disabled={busy}
              className="btn-primary text-sm py-2 px-5"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmTier(null)}
              className="btn-link text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {user.email && (
        <Field label="Email" hint="Used for magic-link sign in and reminders.">
          <span className="font-mono text-sm">{user.email}</span>
        </Field>
      )}

      {recovery && (
        <Field
          label="Recovery key"
          hint="24-word phrase. The only way to recover if you lose access."
        >
          <div className="flex gap-2">
            <button onClick={onDownloadRecovery} className="btn-ghost text-sm py-2 px-5">
              Download
            </button>
            <button onClick={onCopyBookmark} className="btn-link text-sm">
              Copy bookmark URL
            </button>
          </div>
        </Field>
      )}

      {error && (
        <p className="mt-4 body text-seal" role="alert">{error}</p>
      )}

      <div className="mt-10 pt-8 border-t border-border-subtle">
        <button
          onClick={signOut}
          className="btn-link text-sm text-seal"
        >
          Sign out of this device
        </button>
      </div>
    </SettingsSection>
  );
}
