import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'tomorrowme is free. Forever. For everyone.',
};

export default function PricingPage() {
  return (
    <main className="container-page py-24 sm:py-32">
      <div className="max-w-prose mx-auto text-center mb-16">
        <p className="mono mb-6">pricing</p>
        <h1 className="display-lg mb-8 text-balance">
          It's free. Forever.
        </h1>
        <p className="body-lg text-ink-muted">
          Sealing a message to your future self shouldn't cost anything. We
          charge nothing for the basic tier and we don't sell your data because
          we don't have it.
        </p>
      </div>

      <div className="max-w-prose mx-auto">
        <div className="card-paper p-10 sm:p-14 mb-10">
          <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
            <div>
              <p className="mono text-seal mb-2">free tier</p>
              <h2 className="display-sm">Everything you need to seal.</h2>
            </div>
            <p className="display-md">$0</p>
          </div>

          <ul className="space-y-4 mb-10">
            <Include>Unlimited text capsules</Include>
            <Include>Up to 5 GB of media storage</Include>
            <Include>All three account tiers (anonymous, email, passkey)</Include>
            <Include>Up to 25-year unlock durations</Include>
            <Include>Public capsules + share links</Include>
            <Include>Cross-device sync (non-sensitive prefs)</Include>
            <Include>Recovery key as 24-word mnemonic + bookmark URL</Include>
            <Include>Reminder emails (T-7, T-1, T+0)</Include>
          </ul>

          <Link href="/seal" className="btn-primary w-full justify-center text-base">
            Seal your first capsule
          </Link>
        </div>

        <div className="card-paper p-10 mb-10">
          <p className="mono text-ink-muted mb-3">future tier (planned)</p>
          <h3 className="heading-lg mb-4">Premium — for serious time-capsulers</h3>
          <p className="body text-ink-muted mb-6">
            When (and if) we add a paid tier, it'll unlock longer durations,
            larger media files, collaboration at scale, and on-chain proof of
            unlock. The free tier already includes collaboration and media —
            Premium is for pushing further.
          </p>
          <Link href="/premium" className="btn-ghost text-sm py-2 px-5">
            Join the waitlist →
          </Link>
        </div>

        <div className="text-center mt-16">
          <p className="body text-ink-muted mb-6">
            Want to support the project?
          </p>
          <a href="mailto:hello@tomorrowme.net" className="btn-ghost">
            Get in touch
          </a>
        </div>
      </div>
    </main>
  );
}

function Include({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 body">
      <span className="text-seal mt-0.5">✓</span>
      <span>{children}</span>
    </li>
  );
}
