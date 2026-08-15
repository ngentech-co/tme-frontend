'use client';

import { useState } from 'react';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

/**
 * Phase 1 passkey setup is a placeholder that completes locally — Phase 2
 * wires the real WebAuthn flow with stored credentials.
 */
export default function PasskeySetup({ onComplete, onBack }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enroll = async () => {
    setBusy(true);
    setError(null);
    try {
      if (
        typeof window === 'undefined' ||
        !window.PublicKeyCredential ||
        typeof navigator.credentials?.create !== 'function'
      ) {
        throw new Error('This browser does not support passkeys.');
      }
      // Phase 2: real WebAuthn challenge. Phase 1: simulated.
      await new Promise((r) => setTimeout(r, 600));
      localStorage.setItem('tm:tier', 'passkey');
      localStorage.setItem(
        'tm:user-id',
        'passkey_' + Math.random().toString(36).slice(2, 10)
      );
      onComplete();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-reading mx-auto">
      <div className="text-center mb-12">
        <p className="mono mb-6">passkey account</p>
        <h2 className="display-md mb-6 text-balance">
          Use your device to seal.
        </h2>
        <p className="body text-ink-muted">
          A passkey lives on your device. No email, no password, nothing on our
          servers. You'll use biometrics or your screen lock to sign in.
        </p>
      </div>

      <div className="card-paper p-8 sm:p-10 text-center">
        <span className="seal-stamp mx-auto mb-8 inline-flex">🔐</span>
        <p className="body text-ink-muted mb-8">
          When you click below, your browser will prompt you to create a
          passkey. This is the only sign-in we'll ever ask for.
        </p>

        {error && (
          <p className="mb-6 body-sm text-seal" role="alert">{error}</p>
        )}

        <button onClick={enroll} disabled={busy} className="btn-primary w-full">
          {busy ? 'Setting up…' : 'Enroll passkey'}
        </button>
        <button onClick={onBack} className="btn-link w-full justify-center mt-4">
          ← Back
        </button>
      </div>
    </div>
  );
}
