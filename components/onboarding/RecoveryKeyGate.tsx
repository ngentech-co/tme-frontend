'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  buildBookmarkUrl,
  downloadMnemonicFile,
  formatMnemonicGrid,
  generateRecoveryKey,
} from '@/lib/recovery';
import { STORAGE } from '@/lib/constants';

interface Props {
  onConfirmed: () => void;
  onBack?: () => void;
}

export default function RecoveryKeyGate({ onConfirmed, onBack }: Props) {
  const { user, switchTier } = useAuth();
  const [mnemonic, setMnemonic] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);
  const [passwordLayer, setPasswordLayer] = useState('');
  const [bookmarkCopied, setBookmarkCopied] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(STORAGE.recoveryKeyLocal);
    if (existing) {
      setMnemonic(existing);
      return;
    }
    const fresh = generateRecoveryKey();
    setMnemonic(fresh);
    localStorage.setItem(STORAGE.recoveryKeyLocal, fresh);
  }, []);

  const handleDownload = () => {
    downloadMnemonicFile(mnemonic);
    setDownloadDone(true);
  };

  const handleBookmark = async () => {
    const url = buildBookmarkUrl(mnemonic);
    await navigator.clipboard?.writeText(url).catch(() => null);
    setBookmarkCopied(true);
  };

  const canContinue = confirmed && (downloadDone || bookmarkCopied);

  if (!mnemonic) {
    return (
      <div className="max-w-reading mx-auto text-center">
        <p className="body text-ink-muted">Generating your recovery key…</p>
      </div>
    );
  }

  const grid = formatMnemonicGrid(mnemonic);

  return (
    <div className="max-w-prose mx-auto">
      <div className="text-center mb-12">
        <span className="seal-stamp mx-auto mb-8 inline-flex">key</span>
        <p className="mono mb-6">recovery key</p>
        <h2 className="display-md mb-6 text-balance">
          Save these 24 words somewhere safe.
        </h2>
        <p className="body-lg text-ink-muted">
          This is the only way to recover your capsules if you lose access to
          this device. <strong>Anyone with these words can read your messages.</strong>
        </p>
      </div>

      <div className="card-paper p-8 sm:p-10 mb-8">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="heading-md">Your 24 words</h3>
          <span className="mono text-seal">keep private</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-3 mb-6">
          {grid.flat().map((word, i) => (
            <div
              key={i}
              className="flex items-baseline gap-2 border-b border-border-subtle pb-2"
            >
              <span className="mono text-ink-soft text-xs w-6 text-right">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <span className="font-mono text-body">{word}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border-subtle pt-6 space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="body-sm text-ink-muted">Extra password layer (optional)</span>
            <span className="mono text-xs">advanced</span>
          </div>
          <input
            type="password"
            value={passwordLayer}
            onChange={(e) => setPasswordLayer(e.target.value)}
            placeholder="Encrypt the saved file/bookmark with this password"
            className="w-full bg-cream border border-border-subtle rounded-paper px-4 py-3 body-sm focus:border-seal focus:outline-none"
          />
        </div>
      </div>

      <div className="card-paper p-8 mb-8">
        <h3 className="heading-md mb-2">Choose a backup method</h3>
        <p className="body-sm text-ink-muted mb-6">
          Pick at least one. Two is better.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className={`w-full text-left rounded-paper border p-5 transition-colors ${
              downloadDone
                ? 'border-seal bg-seal/5'
                : 'border-border-subtle hover:border-ink-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="body font-medium mb-1">Download as a file</div>
                <div className="body-sm text-ink-muted">
                  Saves as <span className="mono">tomorrowme-recovery-YYYY-MM-DD.txt</span>.
                  Store it somewhere encrypted (1Password, Bitwarden, encrypted USB).
                </div>
              </div>
              <span className="text-seal text-xl">{downloadDone ? '✓' : '↓'}</span>
            </div>
          </button>

          <button
            onClick={handleBookmark}
            className={`w-full text-left rounded-paper border p-5 transition-colors ${
              bookmarkCopied
                ? 'border-seal bg-seal/5'
                : 'border-border-subtle hover:border-ink-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="body font-medium mb-1">Save as a bookmark URL</div>
                <div className="body-sm text-ink-muted">
                  The recovery key lives in the URL fragment — never sent to a server.
                  Bookmark this page on any device to recover your account.
                </div>
              </div>
              <span className="text-seal text-xl">{bookmarkCopied ? '✓' : '☆'}</span>
            </div>
          </button>
        </div>
      </div>

      <label className="flex items-start gap-3 mb-8 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-1 w-5 h-5 accent-seal"
        />
        <span className="body">
          I have saved my recovery key somewhere safe. I understand that losing
          it means losing access to my capsules, and that tomorrowme cannot
          recover it for me.
        </span>
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onConfirmed}
          disabled={!canContinue}
          className="btn-primary flex-1"
        >
          Continue to {user?.tier === 'anonymous' ? 'inbox' : 'app'}
        </button>
        {onBack && (
          <button onClick={onBack} className="btn-ghost">
            ← Back
          </button>
        )}
      </div>

      {!canContinue && (
        <p className="text-center mt-6 body-sm text-ink-soft">
          Complete a backup method and confirm to continue.
        </p>
      )}
    </div>
  );
}
