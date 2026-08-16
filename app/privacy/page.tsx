import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How tomorrowme handles your data — and why we have very little of it.',
};

export default function PrivacyPage() {
  return (
    <main className="container-page py-12 sm:py-24 md:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">privacy</p>
        <h1 className="display-lg mb-10 text-balance">
          We have very little of your data. On purpose.
        </h1>

        <p className="body-lg text-ink-muted mb-12">
          Last updated: August 2026.
        </p>

        <div className="reading-prose">
          <h2 className="display-sm mb-4">What we collect</h2>
          <p>
            For email-tier accounts: your email address and account metadata
            (creation date, last login). For passkey-tier accounts: nothing
            identifying — passkeys use cryptographic challenges, no password
            or email is stored. For anonymous-tier accounts: nothing — we
            derive a user-id locally from your recovery key, which never leaves
            your device.
          </p>

          <h2 className="display-sm mb-4 mt-12">What we never collect</h2>
          <p>
            The plaintext content of any capsule. The AES keys used to encrypt
            capsules. Your recovery phrase (it's generated locally and never
            transmitted). Your IP address beyond an anonymized region-level hash
            for spam prevention.
          </p>

          <h2 className="display-sm mb-4 mt-12">What we store</h2>
          <p>
            Encrypted blobs (ciphertext), public-share metadata (titles, unlock
            dates, share slugs — only for capsules you've explicitly marked
            public), notification preferences, and audit logs of your account
            actions.
          </p>

          <h2 className="display-sm mb-4 mt-12">Where data lives</h2>
          <p>
            Database on Supabase (Postgres). Object storage on Cloudflare R2
            (zero-egress free tier). Email via Resend. Both Supabase and
            Cloudflare are GDPR-compliant and offer data-residency controls.
          </p>

          <h2 className="display-sm mb-4 mt-12">Cookies & tracking</h2>
          <p>
            We use a single first-party session cookie for authentication.
            No third-party trackers on passkey or anonymous accounts.
            Email-tier accounts may load Google Analytics with consent
            mode v2 (default: denied until you opt in). No Facebook
            pixel, no ad networks, no session replay tools.
          </p>

          <h2 className="display-sm mb-4 mt-12">Data export & deletion</h2>
          <p>
            Export everything (decrypted or encrypted bundles) from{' '}
            <a href="/settings/data" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">
              Settings → Data
            </a>. Delete your account any time; we retain a tombstone for 30
            days in case you change your mind, then purge everything.
          </p>

          <h2 className="display-sm mb-4 mt-12">Children's privacy</h2>
          <p>
            tomorrowme is not directed at children under 13 (or under 16 in
            the EU/UK). We don't knowingly collect data from children. If you
            believe we have, contact us and we'll purge immediately.
          </p>

          <h2 className="display-sm mb-4 mt-12">Changes to this policy</h2>
          <p>
            We'll email email-tier users about material changes. Passkey and
            anonymous users should subscribe to our changelog.
          </p>

          <h2 className="display-sm mb-4 mt-12">Contact</h2>
          <p>
            Privacy questions: <a href="mailto:privacy@tomorrowme.net" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">privacy@tomorrowme.net</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
