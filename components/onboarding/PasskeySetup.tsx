'use client';

import { useState } from 'react';
import { enrollPasskey, getPasskeySupportInfo } from '@/lib/passkeys';
import { useAuth } from '@/lib/auth-context';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function PasskeySetup({ onComplete, onBack }: Props) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<{ supported: boolean; message?: string }>(() =>
    getPasskeySupportInfo()
  );

  const enroll = async () => {
    setBusy(true);
    setError(null);
    try {
      if (!info.supported) {
        throw new Error(info.message ?? 'WebAuthn is not available in this browser.');
      }
      const userName =
        user?.email ?? user?.displayName ?? `tm-user-${user?.id?.slice(0, 6) ?? 'anon'}`;
      const userId = user?.id ?? 'passkey-user';
      const record = await enrollPasskey({
        userId,
        userName,
        name: 'Primary passkey',
      });
      if (!record) throw new Error('Passkey creation returned no credential.');
      localStorage.setItem('tm:tier', 'passkey');
      localStorage.setItem('tm:user-id', userId);
      localStorage.setItem('tm:passkey-just-enrolled', 'true');
      onComplete();
    } catch (e) {
      setError((e as Error).message ?? 'Could not create passkey.');
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
          When you click below, your browser or device will ask to create a
          passkey. Approve it to continue.
        </p>

        {!info.supported && (
          <p className="mb-6 body-sm text-seal" role="alert">
            {info.message ?? 'WebAuthn is not available in this browser. Try Chrome, Edge, or Safari.'}
          </p>
        )}

        {error && (
          <p className="mb-6 body-sm text-seal" role="alert">{error}</p>
        )}

        <button
          onClick={enroll}
          disabled={busy || !info.supported}
          className="btn-primary w-full"
        >
          {busy ? 'Contacting your device…' : 'Enroll passkey'}
        </button>
        <button onClick={onBack} className="btn-link w-full justify-center mt-4">
          ← Back
        </button>
      </div>
    </div>
  );
}
