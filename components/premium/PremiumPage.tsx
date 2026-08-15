'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { joinWaitlist, isOnWaitlist } from '@/lib/waitlist';

export default function PremiumPage() {
  const { locale, t } = useI18n();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(() => isOnWaitlist());
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setError(null);
    joinWaitlist(email, locale);
    setJoined(true);
  };

  const benefits = [
    { title: 'Longer unlocks', body: 'Beyond 25 years — decades-long capsules for generational messages.' },
    { title: 'Bigger media', body: 'Higher per-capsule storage for lossless audio and film.' },
    { title: 'Collaboration at scale', body: 'More co-authors, higher thresholds, and priority invites.' },
    { title: 'On-chain proof', body: 'Verifiable unlock receipts anchored on Stellar, viewable by anyone.' },
  ];

  return (
    <main className="container-page py-24 sm:py-32">
      <div className="max-w-prose mx-auto">
        <div className="text-center mb-16">
          <span className="seal-stamp mx-auto mb-8 inline-flex">✦</span>
          <p className="mono mb-4 text-ink-muted">{t.premium.eyebrow}</p>
          <h1 className="display-lg mb-6 text-balance">{t.premium.title}</h1>
          <p className="body-lg text-ink-muted">{t.premium.sub}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {benefits.map((b) => (
            <div key={b.title} className="card-paper p-7">
              <h2 className="heading-md mb-2">{b.title}</h2>
              <p className="body-sm text-ink-muted">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="card-paper p-10">
          {joined ? (
            <div className="text-center">
              <span className="seal-stamp mx-auto mb-6 inline-flex">✓</span>
              <p className="display-sm mb-3">{t.premium.joined}</p>
              <p className="body text-ink-muted mb-8">
                We'll email you when Premium opens. In the meantime, the free
                tier covers everything you need to seal.
              </p>
              <Link href="/seal" className="btn-primary text-base">
                Seal a capsule
              </Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              <p className="mono mb-3">{t.premium.emailLabel}</p>
              <div className="flex gap-3 flex-col sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.premium.emailPlaceholder}
                  className="flex-1 bg-cream border border-border-subtle rounded-paper px-5 py-4 body focus:border-seal focus:outline-none"
                />
                <button type="submit" className="btn-primary">
                  {t.premium.cta}
                </button>
              </div>
              {error && <p className="mt-3 body-sm text-seal">{error}</p>}
              <p className="body-sm text-ink-soft mt-4">
                No spam. Only a note when Premium is ready.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
