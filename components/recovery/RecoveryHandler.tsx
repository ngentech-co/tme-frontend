'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  parseRecoveryKey,
  formatMnemonicGrid,
  hashRecoveryKey,
  userIdFromRecoveryKey,
} from '@/lib/recovery';
import { STORAGE } from '@/lib/constants';

type Status =
  | 'loading'
  | 'invalid'
  | 'no-fragment'
  | 'decrypting'
  | 'ready'
  | 'empty';

interface Props {
  siteName: string;
}

export default function RecoveryHandler({ siteName }: Props) {
  const [status, setStatus] = useState<Status>('loading');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [capsules, setCapsules] = useState<Array<{ id: string; title: string; unlockAt: string }>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (!hash || hash.length < 4) {
      setStatus('no-fragment');
      return;
    }

    const parsed = parseRecoveryKey(hash);
    if (!parsed) {
      setStatus('invalid');
      return;
    }

    setMnemonic(parsed);
    setStatus('decrypting');

    const userId = userIdFromRecoveryKey(parsed);
    const keyHash = hashRecoveryKey(parsed);

    try {
      // Persist recovery state for the session.
      localStorage.setItem(STORAGE.recoveryKeyLocal, parsed);
      localStorage.setItem(STORAGE.userIdKey, userId);

      // In a real build, this would query Supabase / R2 for capsules
      // associated with the user-id derived from the recovery key.
      // Phase 0: surface the key derivation as proof of concept.
      const stored = localStorage.getItem(`tm:capsules:${userId}`);
      const list = stored ? JSON.parse(stored) : [];
      setCapsules(list);
      setStatus(list.length > 0 ? 'ready' : 'empty');
    } catch (e) {
      console.error('Recovery handler error:', e);
      setStatus('invalid');
    }
  }, []);

  if (status === 'loading') {
    return <StatusShell label="Reading your bookmark…" />;
  }

  if (status === 'no-fragment') {
    return (
      <div className="max-w-reading text-center">
        <h1 className="display-md mb-6">No recovery key found</h1>
        <p className="body-lg text-ink-muted mb-8">
          This page is meant to be opened from a saved bookmark. The recovery key is stored
          in the part of the URL after the <span className="mono">#</span>, which your
          browser never sends to a server.
        </p>
        <p className="body-sm text-ink-soft">
          If you lost your bookmark, you can sign in with email or restore from a recovery file.
        </p>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="max-w-reading text-center">
        <h1 className="display-md mb-6 text-seal">Bookmark is invalid</h1>
        <p className="body-lg text-ink-muted mb-8">
          We couldn't read a valid 24-word recovery key from this URL's fragment. Either the
          bookmark was edited or it belongs to a different account.
        </p>
        <p className="body-sm text-ink-soft">
          To recover, paste your 24-word recovery phrase below.
        </p>
      </div>
    );
  }

  if (status === 'decrypting' || status === 'ready' || status === 'empty') {
    const grid = formatMnemonicGrid(mnemonic);
    return (
      <div className="w-full max-w-prose">
        <div className="text-center mb-12">
          <span className="seal-stamp mx-auto mb-6 animate-seal-pulse">tm</span>
          <h1 className="display-md mb-4">Welcome back.</h1>
          <p className="body-lg text-ink-muted">
            Your recovery key was read from the bookmark URL — nothing was sent to a server.
          </p>
        </div>

        <div className="card-paper p-8 mb-8">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="heading-md">Your 24 words</h2>
            <span className="mono">keep private</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-3 mb-5">
            {grid.flat().map((word, i) => (
              <div
                key={i}
                className="flex items-baseline gap-2 border-b border-border-subtle pb-2"
              >
                <span className="mono text-ink-soft text-xs w-6">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <span className="font-mono text-body">{word}</span>
              </div>
            ))}
          </div>
          <p className="body-sm text-ink-muted">
            Anyone with these words can read your capsules. Don't share them.
          </p>
        </div>

        <div className="card-paper p-8 mb-8">
          <h2 className="heading-md mb-4">Your capsules</h2>
          {status === 'empty' ? (
            <p className="body text-ink-muted">
              No capsules found for this recovery key. Once you seal a capsule on this device,
              it'll appear here.
            </p>
          ) : (
            <ul className="space-y-3">
              {capsules.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between border-b border-border-subtle pb-3"
                >
                  <span className="body">{c.title}</span>
                  <span className="mono text-xs">
                    unlocks {new Date(c.unlockAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-center body-sm text-ink-soft">
          You can close this page. Your recovery bookmark works on any device.
        </p>
      </div>
    );
  }

  return null;
}

function StatusShell({ label }: { label: string }) {
  return (
    <div className="text-center">
      <span className="seal-stamp mx-auto mb-6 animate-seal-pulse">tm</span>
      <p className="body-lg text-ink-muted">{label}</p>
    </div>
  );
}
