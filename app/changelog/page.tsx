import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Every release of tomorrowme, in order.',
};

const ENTRIES = [
  {
    version: '0.1.0',
    date: 'August 2026',
    label: 'Phase 0 — Foundation',
    items: [
      'Client-side AES-256 encryption pipeline',
      'Drand time-lock primitive',
      'BIP-39 recovery key + bookmark URL',
      'Landing page, branded error pages, sitemap',
    ],
  },
  {
    version: '0.2.0',
    date: 'August 2026',
    label: 'Phase 1 — Core Ritual',
    items: [
      'Interactive tier-chooser onboarding',
      'Three account tiers (anonymous, email, passkey)',
      'Capsule seal wizard (text + images)',
      'Sealed capsule view with live countdown',
      'Reveal ceremony',
      'Public share pages with countdowns',
      'Inbox dashboard with storage meter',
      'Full settings suite (13 sections)',
      'Marketing pages: about, how-it-works, security, privacy, terms, pricing, faq',
      'Programmatic SEO: 6 use-cases + 3 comparisons',
      'Blog system with MDX + RSS',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="container-page py-24 sm:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">changelog</p>
        <h1 className="display-lg mb-12 text-balance">What we've built.</h1>

        <div className="space-y-16">
          {ENTRIES.map((entry) => (
            <article key={entry.version}>
              <header className="mb-6 pb-6 border-b border-border-subtle">
                <div className="flex items-baseline justify-between flex-wrap gap-3">
                  <h2 className="display-sm">{entry.label}</h2>
                  <span className="mono text-ink-muted">
                    v{entry.version} · {entry.date}
                  </span>
                </div>
              </header>
              <ul className="space-y-3">
                {entry.items.map((item) => (
                  <li key={item} className="flex gap-3 body">
                    <span className="text-seal">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
