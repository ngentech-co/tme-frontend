import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, howToSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'A plain-English and cryptographic walk-through of how tomorrowme seals and reveals capsules.',
};

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={howToSchema([
          {
            name: 'Generate a key',
            text: 'When you seal a capsule, your browser generates a fresh AES-256 key.',
          },
          {
            name: 'Encrypt your content',
            text: 'Your message and any media are encrypted with that key using AES-GCM.',
          },
          {
            name: 'Lock against a Drand round',
            text: 'The AES key is sealed against a specific future round of the Drand network.',
          },
          {
            name: 'Wait',
            text: 'Nobody can decrypt until Drand publishes the signature for that round.',
          },
          {
            name: 'Unlock',
            text: 'On the unlock date, the signature becomes available and your browser decrypts the content.',
          },
        ])}
      />

      <main className="container-page py-24 sm:py-32">
        <div className="max-w-prose mx-auto">
          <p className="mono mb-6">how it works</p>
          <h1 className="display-lg mb-10 text-balance">
            Sealed by cryptography. Opened by time.
          </h1>

          <div className="reading-prose">
            <p>
              Most "send-to-future-self" tools work by trusting a server to keep your
              message hidden. If that server gets breached, or subpoenaed, or shut down,
              your secrets are exposed or gone.
            </p>
            <p>
              {`tomorrowme is different. We don't have your message. We have a blob of math
              that nobody — not us, not an attacker, not a court order — can read before a
              specific moment. That moment is decided by a public network, not by us.`}
            </p>
          </div>

          <hr className="ink-rule my-16" />

          <h2 className="display-sm mb-10">In five quiet steps</h2>

          <ol className="space-y-12 mb-16">
            <Step
              n="01"
              title="You write (or upload)"
              body="Anything — a letter, a song, a video. It never leaves your device unencrypted."
            />
            <Step
              n="02"
              title="Your browser makes a key"
              body="A fresh AES-256 key is generated client-side. It's used once, for this capsule, and then thrown away after unlock."
            />
            <Step
              n="03"
              title="The content is encrypted"
              body="Your text and media are encrypted with that key using AES-256-GCM. The server now holds only ciphertext."
            />
            <Step
              n="04"
              title="The key is locked to a future round"
              body="The AES key is encrypted using Drand's threshold cryptography such that decryption requires the signature at a specific round — the round that corresponds to the unlock date you chose."
            />
            <Step
              n="05"
              title="Time passes. The signature arrives. The capsule opens."
              body="On (or after) the unlock date, Drand publishes the round's signature. Your browser fetches it, derives the key, decrypts the content, and shows it to you."
            />
          </ol>

          <hr className="ink-rule my-16" />

          <h2 className="display-sm mb-8">Why this works</h2>
          <div className="reading-prose">
            <p>
              The trick is called <em>identity-based encryption</em> (IBE). In a normal
              encryption scheme, anyone with the public key can encrypt, but only someone
              with the private key can decrypt. In IBE, the "identity" (here, a future
              round number) becomes the public key — and the matching private key is
              produced when Drand's distributed nodes collaboratively sign that round.
            </p>
            <p>
              Drand is run by the League of Entropy: sixteen organizations including
              Cloudflare, EPFL, and the University of Chile. They collectively produce a
              fresh random signature every minute. No single party can predict it or
              withhold it.
            </p>
            <p>
              So the only way to decrypt your capsule is to wait for the public Drand
              network to publish the signature at the exact round you chose. There's no
              shortcut. There's no backdoor. There's no "emergency decrypt" button. The
              math is the contract.
            </p>
          </div>

          <div className="mt-20 card-paper p-10 text-center">
            <p className="mono mb-4">want the long version?</p>
            <Link href="/security" className="btn-link">
              Read the full security explainer →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-6">
      <span className="mono text-seal flex-shrink-0 mt-1">{n}</span>
      <div>
        <h3 className="heading-md mb-3">{title}</h3>
        <p className="body-lg text-ink-muted">{body}</p>
      </div>
    </li>
  );
}
