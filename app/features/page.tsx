import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Everything tomorrowme offers: encryption, recovery, sharing, and a ritual.',
};

const FEATURES = [
  {
    title: 'Client-side encryption',
    body: 'AES-256-GCM in your browser. We never see your plaintext.',
    icon: '🔒',
  },
  {
    title: 'Time-lock by math',
    body: 'Drand BLS threshold cryptography. Decryption requires a future round signature that only the public network can produce.',
    icon: '⏳',
  },
  {
    title: 'Three account tiers',
    body: 'Anonymous (self-custody), Email (default, social features), Passkey (maximum privacy). Switch any time.',
    icon: '🪪',
  },
  {
    title: 'Recovery key + bookmark URL',
    body: '24-word BIP-39 phrase. Save it as a file, copy to clipboard, or bookmark a URL that auto-loads your account.',
    icon: '🔑',
  },
  {
    title: 'Text + images',
    body: 'Rich text editor for letters, plus up to 10 images per capsule.',
    icon: '🖼️',
  },
  {
    title: 'Audio, video & files',
    body: 'Seal songs, voice memos, films, or any file. Chunked encryption with waveforms and playback after unlock.',
    icon: '🎬',
  },
  {
    title: 'Public capsules',
    body: 'Share your capsule with a link. Choose unlisted (link-only) or public (indexed).',
    icon: '🔗',
  },
  {
    title: 'Reminder emails',
    body: 'T-7 days, T-1 day, and T+0 unlock reminders. Opt out any time.',
    icon: '✉️',
  },
  {
    title: 'Reveal ceremony',
    body: 'When the time comes, a wax-seal break and slow unfold. Reading your capsule should feel like opening a gift.',
    icon: '🎁',
  },
];

export default function FeaturesPage() {
  return (
    <main className="container-page py-12 sm:py-24 md:py-32">
      <div className="max-w-prose mx-auto text-center mb-20">
        <p className="mono mb-6">features</p>
        <h1 className="display-lg mb-8 text-balance">
          A small set of features, done with care.
        </h1>
        <p className="body-lg text-ink-muted">
          Everything you need to seal a message to your future self.
          Nothing you don't.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-wide mx-auto">
        {FEATURES.map((f) => (
          <div key={f.title} className="card-paper p-10">
            <div className="text-3xl mb-5">{f.icon}</div>
            <h2 className="heading-md mb-4">{f.title}</h2>
            <p className="body text-ink-muted">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <Link href="/seal" className="btn-primary text-base">
          Try it now
        </Link>
      </div>
    </main>
  );
}
