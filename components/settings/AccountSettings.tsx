'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  buildBookmarkUrl,
  downloadMnemonicFile,
} from '@/lib/recovery';
import { STORAGE } from '@/lib/constants';
import type { TierId } from '@/lib/constants';
import SettingsSection, { Field } from './SettingsSection';
import PasskeysManager from './PasskeysManager';
import TierSwitcher from './TierSwitcher';

export default function AccountSettings() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const recovery = typeof window !== 'undefined' ? localStorage.getItem(STORAGE.recoveryKeyLocal) : null;

  const onDownloadRecovery = () => {
    if (recovery) downloadMnemonicFile(recovery);
  };

  const onCopyBookmark = async () => {
    if (!recovery) return;
    const url = buildBookmarkUrl(recovery);
    await navigator.clipboard?.writeText(url);
  };

  const onSignOut = async () => {
    setBusy(true);
    await signOut();
    setBusy(false);
    router.push('/');
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
        hint="Upgrade or downgrade. Each tier changes what's visible and shareable."
      >
        <TierSwitcher />
      </Field>

      {user.email && (
        <Field label="Email" hint="Used for magic-link sign in and reminders.">
          <span className="font-mono text-sm">{user.email}</span>
        </Field>
      )}

      <Field
        label="Passkeys"
        hint="Sign in with your device. Recommended for maximum privacy."
      >
        <div className="w-full max-w-2xl">
          <PasskeysManager />
        </div>
      </Field>

      {recovery && (
        <Field
          label="Recovery key"
          hint="24-word phrase. The only way to recover if you lose access."
        >
          <div className="flex gap-2 flex-wrap">
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
        <button onClick={onSignOut} disabled={busy} className="btn-link text-sm text-seal">
          Sign out of this device
        </button>
      </div>
    </SettingsSection>
  );
}
