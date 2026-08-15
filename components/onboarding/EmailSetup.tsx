'use client';

import { useState } from 'react';

interface Props {
  onComplete: () => void;
  onBack: () => void;
  signInEmail: (email: string) => Promise<{ ok: boolean; error?: string }>;
}

export default function EmailSetup({ onComplete, onBack, signInEmail }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await signInEmail(email);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? 'Could not send link.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-reading mx-auto text-center">
        <span className="seal-stamp mx-auto mb-10">✉</span>
        <h2 className="display-md mb-6">Check your inbox.</h2>
        <p className="body-lg text-ink-muted mb-6">
          We sent a sign-in link to <span className="font-medium">{email}</span>.
        </p>
        <p className="body text-ink-muted mb-10">
          Click the link to confirm. You can close this tab — we'll be ready
          when you come back.
        </p>
        <button onClick={onComplete} className="btn-primary">
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-reading mx-auto">
      <div className="text-center mb-12">
        <p className="mono mb-6">email account</p>
        <h2 className="display-md mb-6 text-balance">
          Enter your email to continue.
        </h2>
        <p className="body text-ink-muted">
          We'll send a magic-link sign-in. No password needed.
        </p>
      </div>

      <form onSubmit={submit} className="card-paper p-8 sm:p-10">
        <label htmlFor="email" className="block mono mb-3">
          email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full bg-cream border border-border-subtle rounded-paper px-5 py-4 body focus:border-seal focus:outline-none transition-colors"
        />
        {error && (
          <p className="mt-4 body-sm text-seal" role="alert">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy || !email}
          className="btn-primary w-full mt-6"
        >
          {busy ? 'Sending…' : 'Send sign-in link'}
        </button>
        <button type="button" onClick={onBack} className="btn-link w-full justify-center mt-4">
          ← Back
        </button>
      </form>
    </div>
  );
}
