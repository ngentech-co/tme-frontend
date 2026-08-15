import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'Plain-English guides to time-lock encryption, Drand, self-custody keys, and the history of time capsules.',
};

const GUIDES = [
  {
    href: '/learn/time-lock-encryption',
    title: 'Time-lock encryption',
    body: 'How math can seal a message to open only on a specific future date — no servers, no trust required.',
    tag: 'crypto',
  },
  {
    href: '/learn/drand-network',
    title: 'The Drand network',
    body: 'The decentralized randomness beacon that powers tomorrowme time-locks — run by sixteen organizations.',
    tag: 'crypto',
  },
  {
    href: '/learn/self-custody-keys-explained',
    title: 'Self-custody keys',
    body: 'Why holding your own recovery key changes what an app can (and cannot) do to your data.',
    tag: 'privacy',
  },
  {
    href: '/learn/digital-time-capsule-history',
    title: 'History of time capsules',
    body: 'From Babylon to the blockchain: how humans have always tried to speak across time.',
    tag: 'culture',
  },
];

export default function LearnIndex() {
  return (
    <main className="container-page py-12 sm:py-24 md:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">learn</p>
        <h1 className="display-lg mb-10 text-balance">
          Understand the math behind sealed messages.
        </h1>
        <p className="body-lg text-ink-muted mb-16">
          Everything here is written for a curious human, not a cryptographer.
          No jargon left unexplained.
        </p>

        <div className="space-y-4">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="block card-paper p-4 sm:p-8 transition-colors"
            >
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <h2 className="heading-md">{g.title}</h2>
                <span className="mono text-xs px-2.5 py-1 rounded-full bg-seal/10 text-seal">{g.tag}</span>
              </div>
              <p className="body text-ink-muted">{g.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
