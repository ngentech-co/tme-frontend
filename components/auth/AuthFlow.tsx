'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

type Mode = 'pick' | 'email' | 'passkey' | 'anonymous';

export default function AuthFlow() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const { user, signInEmail, signInPasskey, signInAnonymous } = useAuth();
  const [mode, setMode] = useState<Mode>('pick');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) {
    return (
      <div className="max-w-reading mx-auto text-center">
        <h1 className="display-md mb-6">You're signed in.</h1>
        <p className="body-lg text-ink-muted mb-8">
          Using a <strong>{user.tier}</strong> account.
        </p>
        <Link href="/inbox" className="btn-primary">
          Go to inbox
        </Link>
      </div>
    );
  }

  const doEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await signInEmail(email);
    setBusy(false);
    if (!r.ok) {
      setError(r.error ?? 'Could not send link.');
      return;
    }
    setSent(true);
  };

  const doPasskey = async () => {
    setBusy(true);
    setError(null);
    const r = await signInPasskey();
    setBusy(false);
    if (!r.ok) {
      setError(r.error ?? 'Passkey sign-in failed.');
      return;
    }
    router.push(`${prefix}/inbox`);
  };

  const doAnonymous = async () => {
    setBusy(true);
    setError(null);
    const r = await signInAnonymous();
    setBusy(false);
    if (!r.ok) {
      setError(r.error ?? 'Could not start anonymous session.');
      return;
    }
    router.push('/onboarding/recovery-key');
  };

  return (
    <div className="max-w-reading mx-auto">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      <div className="text-center mb-12">
        <span className="seal-stamp mx-auto mb-8 inline-flex">tm</span>
        <p className="mono mb-4">sign in</p>
        <h1 className="display-md mb-4 text-balance">
          {mode === 'pick' && t.auth.welcome}
          {mode === 'email' && 'Sign in with email.'}
          {mode === 'passkey' && 'Use your passkey.'}
          {mode === 'anonymous' && 'Continue anonymously.'}
        </h1>
        <p className="body text-ink-muted">
          {mode === 'pick' && 'Pick how you want to sign in.'}
          {mode === 'email' && 'We\'ll send a magic link to your inbox.'}
          {mode === 'passkey' && 'Your device will verify your identity.'}
          {mode === 'anonymous' && 'Enter your 24-word recovery key or use the bookmark URL.'}
        </p>
      </div>

      {mode === 'pick' && (
        <div className="space-y-4">
          <button onClick={() => setMode('email')} className="card-paper w-full p-6 text-left transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="body font-medium mb-1">✉️ {t.auth.email}</p>
                <p className="body-sm text-ink-muted">{t.auth.emailDesc}</p>
              </div>
              <span className="mono">→</span>
            </div>
          </button>

          <button onClick={doPasskey} disabled={busy} className="card-paper w-full p-6 text-left transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="body font-medium mb-1">🔐 {t.auth.passkey}</p>
                <p className="body-sm text-ink-muted">{t.auth.passkeyDesc}</p>
              </div>
              <span className="mono">{busy ? '…' : '→'}</span>
            </div>
          </button>

          <button onClick={doAnonymous} disabled={busy} className="card-paper w-full p-6 text-left transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="body font-medium mb-1">👻 {t.auth.anonymous}</p>
                <p className="body-sm text-ink-muted">{t.auth.anonymousDesc}</p>
              </div>
              <span className="mono">{busy ? '…' : '→'}</span>
            </div>
          </button>

          {error && <p className="text-center body-sm text-seal">{error}</p>}
        </div>
      )}

      {mode === 'email' && (
        <div className="card-paper p-8 sm:p-10">
          {sent ? (
            <div className="text-center">
              <p className="body font-medium mb-2">{t.auth.checkInbox}</p>
              <p className="body-sm text-ink-muted mb-6">
                We sent a sign-in link to <strong>{email}</strong>.
              </p>
              <Link href={`${prefix}/inbox`} className="btn-primary">
                Continue
              </Link>
            </div>
          ) : (
            <form onSubmit={doEmail}>
              <label className="block mono mb-3">email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-cream border border-border-subtle rounded-paper px-5 py-4 body focus:border-seal focus:outline-none"
              />
              {error && <p className="mt-4 body-sm text-seal">{error}</p>}
              <button type="submit" disabled={busy} className="btn-primary w-full mt-6">
                {busy ? 'Sending…' : 'Send sign-in link'}
              </button>
            </form>
          )}
          <button onClick={() => setMode('pick')} className="btn-link w-full justify-center mt-4">
            ← Back
          </button>
        </div>
      )}

      {mode === 'anonymous' && (
        <div className="card-paper p-8 sm:p-10 text-center">
          <p className="body text-ink-muted mb-6">
            Anonymous accounts are recovered with your 24-word phrase. If you
            saved it as a bookmark, use that link instead — it's faster and safer.
          </p>
          <Link href="/r" className="btn-ghost w-full justify-center mb-3">
            Use recovery bookmark URL
          </Link>
          <button onClick={() => setMode('pick')} className="btn-link w-full justify-center">
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
