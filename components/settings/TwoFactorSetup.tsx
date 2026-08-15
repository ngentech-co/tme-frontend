'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '@/lib/auth-context';
import {
  clearStoredTotpSecret,
  generateBackupCodes,
  generateTotpSecret,
  getStoredBackupCodes,
  getStoredTotpSecret,
  isTwoFactorEnabled,
  setStoredBackupCodes,
  setStoredTotpSecret,
  totpNow,
  verifyTotp,
  type TotpSecret,
} from '@/lib/totp';

export default function TwoFactorSetup() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [secret, setSecret] = useState<TotpSecret | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEnabled(isTwoFactorEnabled(user.id));
    const existing = getStoredTotpSecret(user.id);
    if (existing) setSecret(existing);
  }, [user]);

  const beginSetup = async () => {
    if (!user) return;
    const newSecret = generateTotpSecret();
    setSecret(newSecret);
    setError(null);
    setSuccess(false);
    const url = await QRCode.toDataURL(newSecret.otpauthUrl, {
      margin: 1,
      width: 240,
      color: { dark: '#1A1814', light: '#FFFBF2' },
    });
    setQrDataUrl(url);
  };

  const confirmSetup = async () => {
    if (!user || !secret) return;
    const ok = await verifyTotp(secret.secret, code);
    if (!ok) {
      setError("That code didn't match. Check your authenticator app and try again.");
      return;
    }
    setStoredTotpSecret(user.id, secret);
    const codes = generateBackupCodes();
    setStoredBackupCodes(user.id, codes);
    setBackupCodes(codes);
    setEnabled(true);
    setSuccess(true);
    setError(null);
  };

  const disable2FA = async () => {
    if (!user) return;
    if (!confirm('Disable two-factor authentication? Your authenticator entry will no longer work.')) return;
    clearStoredTotpSecret(user.id);
    setEnabled(false);
    setSecret(null);
    setBackupCodes(null);
    setSuccess(false);
  };

  const copyBackup = async () => {
    if (!backupCodes) return;
    await navigator.clipboard?.writeText(backupCodes.join('\n'));
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  if (enabled) {
    const storedBackup = user ? getStoredBackupCodes(user.id) : null;
    return (
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="body font-medium mb-1">Two-factor authentication</p>
            <p className="body-sm text-ink-muted">
              Active. Codes from your authenticator app are required to sign in.
            </p>
          </div>
          <span className="mono text-xs px-3 py-1 rounded-full bg-seal text-cream">on</span>
        </div>

        {storedBackup && (
          <div className="mt-6 p-5 bg-cream rounded-paper border border-border-subtle">
            <p className="mono mb-3 text-ink-muted">backup codes</p>
            <div className="grid grid-cols-2 gap-2 font-mono text-sm mb-4">
              {storedBackup.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <button onClick={copyBackup} className="btn-link text-sm">
              Copy backup codes
            </button>
          </div>
        )}

        <button onClick={disable2FA} className="btn-link text-sm mt-6 text-seal">
          Disable two-factor authentication
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="body mb-4">
        Add an authenticator app (Google Authenticator, Authy, 1Password, etc.) for an
        extra layer of protection on email-tier accounts.
      </p>

      {!secret && (
        <button onClick={beginSetup} className="btn-primary text-sm py-2 px-6">
          Set up two-factor authentication
        </button>
      )}

      {secret && qrDataUrl && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <img
              src={qrDataUrl}
              alt="Scan this QR code with your authenticator app"
              className="w-56 h-56 rounded-paper border border-border-subtle"
            />
            <div className="flex-1">
              <p className="body-sm text-ink-muted mb-3">
                Scan with your authenticator app, or manually enter this secret:
              </p>
              <code className="block bg-cream border border-border-subtle rounded-paper px-4 py-3 font-mono text-sm mb-4 break-all">
                {secret.secret}
              </code>
              <label className="block mono mb-2">enter the 6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full max-w-[200px] bg-cream border border-border-subtle rounded-paper px-4 py-3 font-mono text-lg tracking-widest focus:border-seal focus:outline-none"
              />
              {error && (
                <p className="mt-3 body-sm text-seal" role="alert">{error}</p>
              )}
              <button
                onClick={confirmSetup}
                disabled={code.length !== 6}
                className="btn-primary text-sm py-2 px-6 mt-4"
              >
                Confirm & enable
              </button>
              <button
                onClick={() => setSecret(null)}
                className="btn-link text-sm ml-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {success && backupCodes && (
        <div className="mt-6 p-5 bg-seal/5 border border-seal/30 rounded-paper">
          <p className="body font-medium mb-2 text-seal">
            Two-factor enabled. Save these backup codes.
          </p>
          <p className="body-sm text-ink-muted mb-4">
            Each code can be used once if you lose access to your authenticator app.
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm mb-4">
            {backupCodes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={copyBackup} className="btn-ghost text-sm py-2 px-5">
              {copiedBackup ? 'Copied ✓' : 'Copy codes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
