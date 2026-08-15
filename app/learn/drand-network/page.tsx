import type { Metadata } from 'next';
import LearnLayout from '@/components/learn/LearnLayout';
import { techArticleSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'The Drand network',
  description:
    'What Drand is, who runs it, and why a decentralized randomness beacon is the foundation of cryptographic time-locks.',
};

export default function DrandNetworkPage() {
  const ld = techArticleSchema({
    title: 'The Drand network',
    description:
      'An explainer on Drand, the League of Entropy, and the distributed randomness beacon behind tomorrowme time-locks.',
    url: 'https://ure.one/learn/drand-network',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LearnLayout
        eyebrow="learn · cryptography"
        title="The Drand network"
        intro="Drand is the public randomness beacon that powers tomorrowme's time-locks. Here's who runs it and why that matters."
        related={[
          { href: '/learn/time-lock-encryption', label: 'Time-lock encryption' },
          { href: '/security', label: 'Full security explainer' },
        ]}
      >
        <p>
          A time-lock needs a source of randomness that is <strong>predictable in
          schedule</strong> but <strong>unpredictable in value</strong>. It must emit a
          fresh, verifiable signature every interval, on schedule, forever. Drand is
          built for exactly this.
        </p>

        <h2>A beacon, not a server</h2>
        <p>
          Drand is a <em>distributed</em> randomness beacon. No single organization runs
          it. Instead, a group called the <strong>League of Entropy</strong> — currently
          about sixteen organizations including Cloudflare, EPFL, and university research
          groups — jointly operate it using threshold cryptography.
        </p>

        <h2>Threshold cryptography</h2>
        <p>
          The network uses <strong>BLS signatures</strong> with a threshold scheme. A
          random round's signature is only produced when enough independent nodes agree.
          This means:
        </p>
        <ul>
          <li>No single party can predict a future signature.</li>
          <li>No single party can withhold one.</li>
          <li>No single party can be coerced into releasing one early.</li>
        </ul>

        <h2>Why this matters for time capsules</h2>
        <p>
          In tomorrowme, your capsule's AES key is sealed against a future Drand round.
          The decryption "private key" is that round's collective signature. Because no
          one controls Drand, no one — including us — can open your capsule before its
          time.
        </p>

        <h2>The schedule</h2>
        <p>
          The main "default" chain produces a signature every 30 seconds. The unlock
          round for a chosen date is computed from the chain's genesis time and period.
          If you seal for a date ten years from now, the network will still be emitting
          fresh signatures at that round — that's the whole design.
        </p>
      </LearnLayout>
    </>
  );
}
