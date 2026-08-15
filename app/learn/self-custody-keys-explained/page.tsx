import type { Metadata } from 'next';
import LearnLayout from '@/components/learn/LearnLayout';
import { techArticleSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Self-custody keys explained',
  description:
    'Why holding your own recovery key changes what an app can — and cannot — do to your data.',
};

export default function SelfCustodyPage() {
  const ld = techArticleSchema({
    title: 'Self-custody keys explained',
    description:
      'A plain-English guide to self-custody recovery keys and what they mean for your privacy.',
    url: 'https://ure.one/learn/self-custody-keys-explained',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LearnLayout
        eyebrow="learn · privacy"
        title="Self-custody keys"
        intro="When you hold the keys to your data, an app becomes a vault instead of a landlord. Here's what changes."
        related={[
          { href: '/learn/time-lock-encryption', label: 'Time-lock encryption' },
          { href: '/blog/why-encrypt-your-letters', label: 'Blog: why encrypt your letters' },
        ]}
      >
        <p>
          Almost every app you use holds the keys to your data. Your notes app can read
          your notes. Your "private" journal can read your journal. Your email provider
          can read your email. When you want to recover an account, you ask the company
          to reset it — because they hold the keys.
        </p>

        <h2>Custody, explained simply</h2>
        <p>
          <strong>Company custody:</strong> the company holds the decryption keys. You
          trust them not to look, not to be breached, not to be subpoenaed. This is how
          most cloud services work.
        </p>
        <p>
          <strong>Self-custody:</strong> you hold the decryption keys. The company stores
          ciphertext it cannot read. Recovery doesn't require their permission — it
          requires your key.
        </p>

        <h2>What self-custody means for tomorrowme</h2>
        <p>
          When you create an account, you get a 24-word recovery phrase generated in your
          browser. We never see it. It's the only way to recover your capsules.
        </p>
        <ul>
          <li>We cannot reset your account for you.</li>
          <li>We cannot read your sealed messages — even under legal process.</li>
          <li>If we shut down, your recovery key still unlocks your capsules.</li>
        </ul>

        <h2>The trade-off</h2>
        <p>
          Self-custody means responsibility. Lose the phrase and the capsules are gone —
          no support ticket can bring them back. That's why we make you confirm you've
          saved it before proceeding, and why we recommend the bookmark-URL backup in
          addition to the file.
        </p>

        <p>
          This trade-off is the same one you make with a hardware wallet for money. Your
          words are worth at least as much as your money. Hold the keys.
        </p>
      </LearnLayout>
    </>
  );
}
