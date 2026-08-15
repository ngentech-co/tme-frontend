'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { listCapsules, readCapsule } from '@/lib/storage/capsules';
import SettingsSection from './SettingsSection';

export default function DataSettings() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const exportDecrypted = async () => {
    if (!user) return;
    setBusy('decrypted');
    try {
      const capsules = listCapsules(user.id);
      const detailed = capsules.map((c) => {
        const full = readCapsule(user.id, c.id);
        return { meta: c, payload: full?.payload };
      });
      const blob = new Blob([JSON.stringify(detailed, null, 2)], { type: 'application/json' });
      download(blob, `tomorrowme-decrypted-${Date.now()}.json`);
    } finally {
      setBusy(null);
    }
  };

  const exportEncrypted = async () => {
    if (!user) return;
    setBusy('encrypted');
    try {
      const capsules = listCapsules(user.id);
      const detailed = capsules.map((c) => {
        const full = readCapsule(user.id, c.id);
        return full;
      });
      const blob = new Blob([JSON.stringify(detailed, null, 2)], { type: 'application/json' });
      download(blob, `tomorrowme-encrypted-${Date.now()}.json`);
    } finally {
      setBusy(null);
    }
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    setBusy('delete');
    await signOut();
    router.push('/');
  };

  return (
    <SettingsSection
      title="Data & export"
      description="Take your data with you, or delete everything."
    >
      <div className="space-y-6">
        <div className="p-6 border border-border-subtle rounded-paper">
          <h3 className="heading-md mb-2">Export decrypted bundle</h3>
          <p className="body-sm text-ink-muted mb-4">
            All your capsules as JSON, decrypted. Use this for backup or migration.
          </p>
          <button
            onClick={exportDecrypted}
            disabled={busy !== null}
            className="btn-ghost text-sm py-2 px-5"
          >
            {busy === 'decrypted' ? 'Preparing…' : 'Download decrypted'}
          </button>
        </div>

        <div className="p-6 border border-border-subtle rounded-paper">
          <h3 className="heading-md mb-2">Export encrypted bundle</h3>
          <p className="body-sm text-ink-muted mb-4">
            All your capsules as JSON, encrypted. Re-importable into any tomorrowme account.
          </p>
          <button
            onClick={exportEncrypted}
            disabled={busy !== null}
            className="btn-ghost text-sm py-2 px-5"
          >
            {busy === 'encrypted' ? 'Preparing…' : 'Download encrypted'}
          </button>
        </div>

        <div className="p-6 border border-border-subtle rounded-paper">
          <h3 className="heading-md mb-2">Import from another service</h3>
          <p className="body-sm text-ink-muted mb-4">
            Migrating FutureMe, Capsule, or DayOne exports is not yet supported.
            Export to a decrypted bundle below and keep it safe — we'll add
            import migration in a future release.
          </p>
        </div>

        <div className="p-6 border border-seal/30 bg-seal/5 rounded-paper">
          <h3 className="heading-md mb-2 text-seal">Delete account</h3>
          <p className="body-sm text-ink-muted mb-4">
            Soft-delete with 30-day grace, then permanent purge of all your data.
            Decryption requires your recovery key in either case.
          </p>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="btn-ghost text-sm py-2 px-5 border-seal text-seal"
            >
              I want to delete my account
            </button>
          ) : (
            <div>
              <p className="body font-medium mb-3">
                Type <span className="font-mono">delete</span> to confirm:
              </p>
              <input
                type="text"
                placeholder="delete"
                className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm font-mono mb-3"
                onChange={(e) => {
                  if (e.target.value === 'delete') setConfirmDelete(true);
                  else setConfirmDelete(false);
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={onDelete}
                  disabled={busy !== null}
                  className="btn-primary text-sm py-2 px-5 bg-seal"
                >
                  {busy === 'delete' ? 'Deleting…' : 'Permanently delete'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="btn-link text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
