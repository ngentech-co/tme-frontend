import type { Metadata } from 'next';
import LearnLayout from '@/components/learn/LearnLayout';
import { articleSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'History of time capsules',
  description:
    'From Babylon to the blockchain: how humans have always tried to speak across time.',
};

export default function HistoryPage() {
  const ld = articleSchema({
    title: 'The history of time capsules, from Babylon to the blockchain',
    description:
      'A short tour of how humans have tried to send messages to the future, and where we are now.',
    url: 'https://ure.one/learn/digital-time-capsule-history',
    datePublished: '2026-08-15',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LearnLayout
        eyebrow="learn · culture"
        title="History of time capsules"
        intro="The urge to speak across time is ancient. Time capsules are the original internet — messages to an unknown future."
        related={[
          { href: '/blog/history-of-time-capsules', label: 'Blog: the long read' },
          { href: '/use-cases/digital-time-capsule', label: 'Use case: digital time capsule' },
        ]}
      >
        <h2>Before writing</h2>
        <p>
          Humans buried objects long before they buried letters. Offerings, tools,
          seeds — deposits meant to be found later, by a future that was trusted to
          understand them.
        </p>

        <h2>Babylon to the World's Fair</h2>
        <p>
          The most famous early time capsule was buried under the Western Wall of the
          temple in Babylon around 537 BCE. Millennia later, the modern era's most
          celebrated capsules were buried at the 1939 and 1965 World's Fairs, scheduled
          to open in 6939 and 2065.
        </p>

        <h2>The internet era</h2>
        <p>
          The first internet-era "time capsule" was FutureMe (2007) — a service that
          delivered an email to your future self. It proved millions of people wanted
          to write to their future selves. But its model was trust-based: the company
          could read every message.
        </p>

        <h2>The cryptographic era</h2>
        <p>
          With Drand's launch in 2019, the time capsule became a mathematical fact
          rather than a social agreement. A message can now be sealed such that no one
          — not the company, not a government, not a future intruder — can open it
          before the appointed round.
        </p>

        <p>
          The ritual is ancient. The math is new. Together, they let you bury a letter
          that will stay buried, no matter who digs.
        </p>
      </LearnLayout>
    </>
  );
}
