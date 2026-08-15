import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, faqSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about tomorrowme — security, recovery, pricing, and more.',
};

const FAQ_ITEMS = [
  {
    question: 'Is tomorrowme really private?',
    answer:
      'Yes. Everything you seal is encrypted in your browser before it reaches our servers. We store only ciphertext — we literally cannot read your messages, even if we wanted to. For passkey-tier accounts, we additionally have no email or identifying information tied to the account.',
  },
  {
    question: 'What if tomorrowme shuts down?',
    answer:
      'Your sealed content survives. Because encryption happens client-side and the recovery key (or bookmark URL) works independently, you can decrypt your capsules from any device using only your recovery phrase — even if our servers no longer exist. The Drand network is decentralized across 16 organizations globally and continues operating independently.',
  },
  {
    question: 'What happens if I lose my recovery key?',
    answer:
      'For email-tier accounts, you can reset access by signing in via your email magic link. For anonymous and passkey accounts, losing the recovery key is unrecoverable — exactly like losing a hardware wallet. We recommend downloading the .txt backup and bookmarking the recovery URL on a second device.',
  },
  {
    question: 'How long can I seal a capsule for?',
    answer:
      'Up to 25 years in the free tier. Drand rounds are valid into the foreseeable future, so longer durations are technically possible but reserved for a future premium tier.',
  },
  {
    question: 'Can I edit a capsule after sealing?',
    answer:
      'No. Once sealed, the ciphertext is final. This is by design — the whole point is that nobody, including you, can change the past. You can delete and re-seal, but the original is preserved.',
  },
  {
    question: 'What is Drand?',
    answer:
      'Drand is a distributed randomness beacon run by the League of Entropy — a consortium of organizations including Cloudflare, EPFL, and the University of Chile. Every minute, they collaboratively produce a fresh cryptographic signature. We use those signatures as the time-lock primitive: your capsule can only be decrypted when the signature for a specific round exists.',
  },
  {
    question: 'Is my content scanned or moderated?',
    answer:
      'No. We have no way to read your content — it is encrypted before reaching our servers. We use abuse signals (IP region, account age, report volume) to flag potentially abusive accounts for review of public metadata only. We never decrypt sealed content to investigate.',
  },
  {
    question: 'Can I collaborate with others on a capsule?',
    answer:
      'Yes. Collaborative capsules use k-of-n secret sharing: the owner invites co-authors, and the capsule opens only when enough members contribute their key-shares after the unlock date. Invites carry per-member codes shared out of band.',
  },
  {
    question: 'Do you support audio and video?',
    answer:
      'Yes. The free tier supports text, images, audio (with waveform previews), video, and any file type — all encrypted client-side before upload.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'Go to Settings → Data → Delete Account. We retain a tombstone for 30 days in case you change your mind, then purge everything permanently.',
  },
];

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ_ITEMS)} />
      <main className="container-page py-24 sm:py-32">
        <div className="max-w-prose mx-auto">
          <p className="mono mb-6">faq</p>
          <h1 className="display-lg mb-10 text-balance">
            Questions, answered quietly.
          </h1>

          <div className="space-y-4 mb-16">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="card-paper p-7 group"
              >
                <summary className="cursor-pointer flex items-start justify-between gap-4 list-none">
                  <h2 className="heading-md">{item.question}</h2>
                  <span className="text-seal text-xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="body-lg text-ink-muted mt-5 pt-5 border-t border-border-subtle">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="card-paper p-10 text-center">
            <p className="mono mb-3">still curious?</p>
            <Link href="/contact" className="btn-primary">
              Ask us anything
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
