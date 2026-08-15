import type { Metadata } from 'next';
import LearnLayout from '@/components/learn/LearnLayout';
import { techArticleSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Time-lock encryption',
  description:
    'A plain-English explanation of how time-lock encryption seals a message to open only on a specific future date.',
};

export default function TimeLockEncryptionPage() {
  const ld = techArticleSchema({
    title: 'How time-lock encryption works',
    description:
      'A plain-English explanation of identity-based encryption and Drand that powers tomorrowme time capsules.',
    url: 'https://ure.one/learn/time-lock-encryption',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LearnLayout
        eyebrow="learn · cryptography"
        title="Time-lock encryption"
        intro="A message sealed by math, opened by time — not by permission, not by a key-holder, not by anyone. Here's how it works."
        related={[
          { href: '/learn/drand-network', label: 'The Drand network' },
          { href: '/learn/self-custody-keys-explained', label: 'Self-custody keys' },
          { href: '/blog/how-time-lock-encryption-works', label: 'Blog: how time-lock encryption works' },
        ]}
      >
        <p>
          Time-lock encryption answers one question: <em>how do you guarantee that a
          message stays unread until a specific date, without trusting anyone?</em>
        </p>

        <h2>An ordinary lock is not enough</h2>
        <p>
          If you encrypt a message and give the key to a friend, you trust the friend.
          If you store the key on a server, you trust the server. If you bury the key,
          someone might dig it up. None of these "wait until the date" reliably —
          someone always has the ability to open it early.
        </p>

        <h2>The trick: a key that does not exist yet</h2>
        <p>
          What if the decryption key simply <em>does not exist</em> before the date?
          Then there is nothing to steal, nothing to reveal, and no one to ask. This is
          the core idea of <strong>identity-based encryption</strong> (IBE).
        </p>
        <p>
          In IBE, a public string — like the number of a future round of a public
          randomness beacon — acts as the "public key." Anyone can encrypt to that
          string. But decryption requires a matching private key, which is only
          produced when a threshold of distributed parties sign that round.
        </p>

        <h2>What that means in practice</h2>
        <p>
          When you seal a capsule on tomorrowme:
        </p>
        <ol>
          <li>Your browser generates a fresh AES-256 key.</li>
          <li>Your message is encrypted with that key.</li>
          <li>The key itself is sealed against a future round of Drand (a public network).</li>
          <li>The ciphertext is stored. No one holds the AES key.</li>
        </ol>
        <p>
          On the unlock date, Drand publishes the round's signature. Your browser uses
          it to derive the key and decrypt. There is no backdoor, no admin tool, no
          "emergency override."
        </p>

        <h2>Why the date is trustworthy</h2>
        <p>
          The date isn't enforced by our servers — it's enforced by a public network
          that produces signatures on a fixed schedule and cannot be rushed. Even if
          tomorrowme disappeared tomorrow, the sealed message would still only open at
          its appointed round.
        </p>
      </LearnLayout>
    </>
  );
}
