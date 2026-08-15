'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  enrollPasskey,
  getPasskeySupportInfo,
  listPasskeys,
  removePasskey,
  renamePasskey,
  type PasskeyRecord,
} from '@/lib/passkeys';
import { useAuth } from '@/lib/auth-context';

export default function PasskeysManager() {
  const { user } = useAuth();
  const [passkeys, setPasskeys] = useState<PasskeyRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [support] = useState(() => getPasskeySupportInfo());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (user) setPasskeys(listPasskeys(user.id));
  }, [user]);

  useEffect(reload, [reload]);

  if (!user) return null;

  const addPasskey = async () => {
    setBusy(true);
    setError(null);
    try {
      if (!support.supported) throw new Error(support.message);
      const userName = user.email ?? `tm-user-${user.id.slice(0, 6)}`;
      await enrollPasskey({ userId: user.id, userName, name: 'New passkey' });
      reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onRemove = (id: string) => {
    if (!user) return;
    const remaining = removePasskey(user.id, id);
    setConfirmRemoveId(null);
    if (remaining.length === 0 && user.tier === 'passkey') {
      setError(
        'Warning: you removed your last passkey. If you lose your recovery key, this account becomes unrecoverable.'
      );
    }
    reload();
  };

  const onRename = (id: string) => {
    if (!user || !renameValue.trim()) return;
    renamePasskey(user.id, id, renameValue.trim());
    setRenamingId(null);
    setRenameValue('');
    reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className="body-sm text-ink-muted">
          Passkeys let you sign in with your device. Stored securely on your
          device — we never see your private key.
        </p>
        <button
          onClick={addPasskey}
          disabled={busy || !support.supported}
          className="btn-ghost text-sm py-2 px-5"
        >
          {busy ? 'Adding…' : 'Add passkey'}
        </button>
      </div>

      {!support.supported && (
        <p className="body-sm text-seal mb-4">
          {support.message ?? 'Passkeys not supported in this browser.'}
        </p>
      )}

      {error && (
        <p className="body-sm text-seal mb-4" role="alert">{error}</p>
      )}

      {passkeys.length === 0 ? (
        <div className="bg-cream border border-border-subtle rounded-paper p-6 text-center">
          <p className="body text-ink-soft">No passkeys enrolled yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {passkeys.map((p) => (
            <li key={p.id} className="py-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {renamingId === p.id ? (
                  <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && onRename(p.id)}
                      autoFocus
                      className="flex-1 bg-cream border border-border-subtle rounded-paper px-3 py-1.5 body-sm focus:border-seal focus:outline-none"
                    />
                    <button onClick={() => onRename(p.id)} className="btn-link text-sm">
                      Save
                    </button>
                    <button onClick={() => setRenamingId(null)} className="btn-link text-sm">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 min-w-[200px]">
                    <p className="body font-medium">{p.name}</p>
                    <p className="mono text-xs text-ink-soft">
                      created {new Date(p.createdAt).toLocaleDateString()}
                      {p.lastUsedAt && ` · used ${new Date(p.lastUsedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 flex-shrink-0">
                  {confirmRemoveId === p.id ? (
                    <>
                      <button
                        onClick={() => onRemove(p.id)}
                        className="btn-primary text-sm py-1.5 px-4"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmRemoveId(null)}
                        className="btn-link text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setRenamingId(p.id);
                          setRenameValue(p.name);
                        }}
                        className="btn-link text-sm"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => setConfirmRemoveId(p.id)}
                        className="btn-link text-sm text-seal"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
