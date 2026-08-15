import Link from 'next/link';
import { SITE } from '@/lib/constants';
import { articleSchema, breadcrumbSchema } from '@/lib/seo';

interface Comparison {
  slug: string;
  competitor: string;
  competitorUrl?: string;
  positioning: string;
  intro: string;
  rows: Array<{ feature: string; us: string; them: string }>;
  verdict: string;
}

export const COMPARISONS: Comparison[] = [
  {
    slug: 'tomorrowme-vs-futureme',
    competitor: 'FutureMe',
    competitorUrl: 'https://www.futureme.org',
    positioning: 'FutureMe is the original "send email to future self" service. tomorrowme is what happens when you take that idea seriously about privacy.',
    intro:
      'FutureMe pioneered the "send email to your future self" concept in 2007. It is a beloved service with millions of users. But its model has a fundamental limitation: it can read every message you send. tomorrowme cannot.',
    rows: [
      { feature: 'End-to-end encryption', us: 'Yes (AES-256-GCM)', them: 'No — they read your messages' },
      { feature: 'Time-lock cryptography', us: 'Yes (Drand BLS)', them: 'No — server can release early' },
      { feature: 'Recovery if you lose access', us: 'Self-custody 24-word phrase', them: 'Email-based (limited)' },
      { feature: 'Anonymous accounts', us: 'Yes — no email required', them: 'No — email required' },
      { feature: 'Source-available client crypto', us: 'Yes', them: 'Closed' },
      { feature: 'Free tier', us: 'Yes', them: 'Yes (with ads)' },
      { feature: 'Rich media (images, audio)', us: 'Yes', them: 'Text only' },
      { feature: 'Public capsules with share links', us: 'Yes', them: 'Email only' },
    ],
    verdict:
      'Choose FutureMe if you want a simple, well-loved service for casual notes. Choose tomorrowme if you want cryptographic guarantees that nobody — not even the company — can read your messages before they open.',
  },
  {
    slug: 'tomorrowme-vs-capsule',
    competitor: 'Capsule',
    competitorUrl: 'https://capsule.app',
    positioning: 'Capsule is a beautifully designed iOS time-capsule app. tomorrowme is the privacy-first, cross-platform, cryptographically sealed alternative.',
    intro:
      'Capsule is a popular iOS app that lets you save memories for the future. It is polished and well-designed. But it stores your data on its servers, accessible to its team, and does not give you the cryptographic guarantees that tomorrowme does.',
    rows: [
      { feature: 'Platform', us: 'Web (any device)', them: 'iOS only' },
      { feature: 'Encryption model', us: 'Client-side, end-to-end', them: 'Server-side (in their words, "encrypted at rest")' },
      { feature: 'Time-lock cryptography', us: 'Yes (Drand)', them: 'No — server-enforced' },
      { feature: 'Cross-device sync', us: 'Yes (with recovery key)', them: 'iCloud only' },
      { feature: 'Anonymous accounts', us: 'Yes', them: 'No' },
      { feature: 'Open client crypto', us: 'Yes', them: 'No' },
      { feature: 'Public share links', us: 'Yes', them: 'Limited' },
      { feature: 'Free tier', us: 'Yes', them: 'Limited (paid for many features)' },
    ],
    verdict:
      'Choose Capsule if you want a polished iOS experience and trust their server-side encryption. Choose tomorrowme if you want true client-side cryptography, cross-platform access, and the option to be anonymous.',
  },
  {
    slug: 'tomorrowme-vs-google-keeps-scheduled',
    competitor: 'Google Keep',
    positioning: 'Google Keep has a "scheduled reminder" feature. tomorrowme has cryptographic time-lock. They are not the same thing.',
    intro:
      'Google Keep lets you set a reminder for a future date — like a note popping up at a specific time. That is not the same as a sealed time capsule. Your notes are stored in plaintext, readable by Google, and the "unlock" is just a notification.',
    rows: [
      { feature: 'Encryption', us: 'End-to-end (client-side)', them: 'At-rest only (Google can read)' },
      { feature: 'Time-lock cryptography', us: 'Yes', them: 'No' },
      { feature: 'True "sealed until date"', us: 'Yes', them: 'No (notification, not a lock)' },
      { feature: 'Privacy', us: 'Anonymous option available', them: 'Tied to Google account' },
      { feature: 'Recipient sharing', us: 'Yes (capsule to person)', them: 'No' },
      { feature: 'Recovery key', us: 'Yes (self-custody)', them: 'No (Google-managed)' },
    ],
    verdict:
      'If you want a reminder on a date, Google Keep works. If you want a message that genuinely cannot be opened until the date, tomorrowme is in a different category.',
  },
  {
    slug: 'tomorrowme-vs-letterstream',
    competitor: 'LetterStream',
    competitorUrl: 'https://www.letterstream.com',
    positioning: 'LetterStream sends physical letters on a future date. tomorrowme is the digital, cryptographically sealed alternative.',
    intro:
      'LetterStream is a paid service that prints and mails a physical letter on a date you choose. It is a lovely idea with a real cost: it can read your letter (it prints it), and it charges per letter. tomorrowme is digital, free, and cannot read your message.',
    rows: [
      { feature: 'Delivery format', us: 'Digital (web)', them: 'Physical mail' },
      { feature: 'End-to-end encryption', us: 'Yes (AES-256-GCM)', them: 'No — they print it' },
      { feature: 'Time-lock cryptography', us: 'Yes (Drand)', them: 'No — server-enforced' },
      { feature: 'Cost', us: 'Free', them: 'Paid per letter' },
      { feature: 'Anonymous accounts', us: 'Yes', them: 'No' },
      { feature: 'Media (images, audio, video)', us: 'Yes', them: 'Text only (printed)' },
    ],
    verdict:
      'Choose LetterStream if you specifically want a physical letter in the mail. Choose tomorrowme if you want something digital, free, private, and capable of holding media — without anyone being able to read it early.',
  },
  {
    slug: 'tomorrowme-vs-dayone',
    competitor: 'Day One',
    competitorUrl: 'https://dayoneapp.com',
    positioning: 'Day One is a beautiful journaling app with a "future prompts" feature. tomorrowme is not a journal — it is a sealed vault that only opens on a date.',
    intro:
      'Day One is the gold standard for journaling. It lets you backdate entries, set reminders, and reflect. But its future-focused features are reminders to write — not sealed time capsules. Day One can read your entries; tomorrowme cannot read your capsules.',
    rows: [
      { feature: 'Primary purpose', us: 'Sealed time capsules', them: 'Journaling' },
      { feature: 'Encryption', us: 'Client-side, end-to-end', them: 'Encrypted-at-rest (Day One can read)' },
      { feature: 'Sealed until a date', us: 'Yes (cryptographic)', them: 'No — reminders to write' },
      { feature: 'Time-lock cryptography', us: 'Yes (Drand)', them: 'No' },
      { feature: 'Media', us: 'Images, audio, video, files', them: 'Photos, audio (journal entries)' },
      { feature: 'Free tier', us: 'Yes', them: 'Freemium (paid for advanced)' },
    ],
    verdict:
      'Choose Day One if you want a full-featured journaling practice. Choose tomorrowme if the goal is to write something and lock it away until a specific future date — unreadable by anyone, including us.',
  },
  {
    slug: 'encrypted-vs-traditional-time-capsule',
    competitor: 'a traditional time capsule',
    positioning: 'A traditional time capsule is buried and forgotten. An encrypted one is sealed by math. They are different kinds of promises.',
    intro:
      'A traditional time capsule is a box buried in the ground, to be dug up later. It can be lost, stolen, decayed, or opened early by whoever finds it. An encrypted digital time capsule cannot be opened early — no matter who finds the ciphertext.',
    rows: [
      { feature: 'Opened early by discoverers', us: 'Impossible', them: 'Possible' },
      { feature: 'Damaged by weather / decay', us: 'No', them: 'Yes' },
      { feature: 'Lost physically', us: 'No', them: 'Yes' },
      { feature: 'Recoverable without the company', us: 'Yes (recovery key)', them: 'Only if still buried' },
      { feature: 'Media preservation', us: 'Encrypted digital', them: 'Physical decay' },
      { feature: 'Exact unlock date', us: 'Cryptographically enforced', them: 'Chosen by finder' },
    ],
    verdict:
      'Keep both if you love ritual. But for messages you truly want to survive to a date and be unreadable before it, encryption is the only technology that can promise that.',
  },
  {
    slug: 'free-vs-paid-time-capsule-apps',
    competitor: 'paid time-capsule apps',
    positioning: 'Many time-capsule apps charge monthly for storage, features, and privacy. tomorrowme is free — and free is also how we keep your data private.',
    intro:
      'The time-capsule market is full of subscription apps. Some are wonderful. But a subscription model has a hidden cost: the app must keep your data readable to justify ongoing payment — and your sealed messages remain accessible to the company.',
    rows: [
      { feature: 'Monthly cost', us: '$0', them: 'Often $3–$10/mo' },
      { feature: 'Unlimited capsules', us: 'Yes', them: 'Tier-limited' },
      { feature: 'Privacy', us: 'No tracking on private tiers', them: 'Varies' },
      { feature: 'Self-custody recovery', us: 'Yes', them: 'Often not' },
      { feature: 'Company survival risk', us: 'Recovery key outlives us', them: 'Data may vanish' },
    ],
    verdict:
      'Pay for a tool you love if it genuinely serves you. But do not pay to store secrets in a service that can read them — tomorrowme gives you the same (or better) features free, with self-custody privacy.',
  },
];

export default function ComparisonTemplate({ c }: { c: Comparison }) {
  const ldArticle = articleSchema({
    title: `tomorrowme vs ${c.competitor}`,
    description: c.positioning,
    url: `https://${SITE.domain}/compare/${c.slug}`,
    datePublished: '2026-08-01',
  });
  const ldBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://${SITE.domain}` },
    { name: 'Compare', url: `https://${SITE.domain}/compare` },
    { name: `tomorrowme vs ${c.competitor}`, url: `https://${SITE.domain}/compare/${c.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
      />
      <main className="container-page py-24 sm:py-32">
        <div className="max-w-prose mx-auto">
          <p className="mono mb-6">comparison</p>
          <h1 className="display-lg mb-8 text-balance">tomorrowme vs {c.competitor}</h1>
          <p className="body-lg text-ink-muted mb-16">{c.positioning}</p>

          <p className="body-lg mb-16">{c.intro}</p>

          <div className="card-paper p-0 overflow-hidden mb-12">
            <table className="w-full body">
              <thead>
                <tr className="border-b border-border-subtle bg-cream-deep">
                  <th className="text-left p-5 font-medium">Feature</th>
                  <th className="text-left p-5 font-medium text-seal">tomorrowme</th>
                  <th className="text-left p-5 font-medium">{c.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-border-subtle last:border-b-0">
                    <td className="p-5 font-medium">{row.feature}</td>
                    <td className="p-5 text-seal">{row.us}</td>
                    <td className="p-5 text-ink-muted">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="display-sm mb-6">The verdict</h2>
          <p className="body-lg mb-16">{c.verdict}</p>

          <div className="text-center">
            <Link href="/seal" className="btn-primary text-base">
              Try tomorrowme
            </Link>
            <p className="mt-6 body-sm text-ink-soft">
              Free · private · cryptographic
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
