import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'What we are building next, in order.',
};

const PHASES = [
  {
    name: 'Phase 0 — Foundation',
    status: 'shipped',
    items: ['Client-side encryption', 'Drand time-lock', 'Recovery key + bookmark URL', 'SEO infrastructure'],
  },
  {
    name: 'Phase 1 — Core Ritual',
    status: 'shipped',
    items: ['Interactive onboarding', 'Capsule seal wizard', 'Reveal ceremony', 'Settings (full suite)'],
  },
  {
    name: 'Phase 2 — Auth Expansion',
    status: 'next',
    items: ['Real WebAuthn passkey flow', 'Tier switcher', 'Google Analytics 4', 'Two-factor authentication'],
  },
  {
    name: 'Phase 3 — Media Expansion',
    status: 'planned',
    items: ['Audio upload + waveforms', 'Video upload (chunked)', 'File vault', 'Storage quota UI'],
  },
  {
    name: 'Phase 4 — Collaborative + Stellar',
    status: 'planned',
    items: ['Stellar anchoring (invisible)', 'Soroban time-lock contract', 'Collaborative capsules', 'Reactions on unlocked capsules'],
  },
  {
    name: 'Phase 5 — Discovery & Polish',
    status: 'planned',
    items: ['/explore + /topics/*', 'Public capsule discovery', 'Email followers (basic)', 'Educational cluster'],
  },
  {
    name: 'Phase 6 — i18n + Premium',
    status: 'planned',
    items: ['/locale/* URL structure', 'EN + secondary language', 'Premium tier teaser', 'Domain cutover'],
  },
];

export default function RoadmapPage() {
  return (
    <main className="container-page py-24 sm:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">roadmap</p>
        <h1 className="display-lg mb-12 text-balance">Where we're going.</h1>

        <div className="space-y-10">
          {PHASES.map((p) => (
            <div
              key={p.name}
              className={`card-paper p-8 ${
                p.status === 'shipped' ? 'opacity-90' : ''
              }`}
            >
              <div className="flex items-baseline justify-between flex-wrap gap-3 mb-5">
                <h2 className="heading-md">{p.name}</h2>
                <span
                  className={`mono text-xs px-3 py-1 rounded-full ${
                    p.status === 'shipped'
                      ? 'bg-seal text-cream'
                      : p.status === 'next'
                      ? 'bg-wax-gold text-ink'
                      : 'bg-border-subtle text-ink-muted'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <ul className="space-y-2">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-3 body text-ink-muted">
                    <span className="text-seal">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
