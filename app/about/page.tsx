import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, organizationSchema } from '@/lib/seo';
import { SITE, TAGLINES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About',
  description:
    'tomorrowme is a small, deliberate project for the moment you want to send a message to who you are becoming.',
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <main className="container-page py-12 sm:py-24 md:py-32">
        <div className="max-w-prose mx-auto">
          <p className="mono mb-6">about</p>
          <h1 className="display-lg mb-10 text-balance">
            A small project for the messages you can't send today.
          </h1>

          <div className="reading-prose">
            <p>
              We built tomorrowme because there's a kind of message we kept wanting to send,
              but had no good way to send. A message to ourselves a year from now. A
              confession we want to keep. A song we want to release in a decade. A letter
              to a child who doesn't exist yet.
            </p>
            <p>
              Existing email schedulers, journal apps, and "send-it-to-future-you" services
              were either too fragile, too public, or too dependent on the company staying
              alive forever. We wanted the opposite: cryptographic guarantee that nobody —
              not us, not a server admin, not a government — could read the message
              before its time.
            </p>
            <p>
              So we built tomorrowme. The math is simple enough that we can explain it on a
              single page (see <Link href="/how-it-works" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">how it works</Link>).
              The interface is calm because we wanted it to feel like sitting down to write
              a letter, not opening a productivity app.
            </p>
            <p>
              {SITE.name} is run by a small team. We charge nothing for the basic tier and
              we don't sell your data because we don't have it. The only thing we hold is
              ciphertext — and even if you gave us your passphrase, we couldn't read it
              before the unlock date. That's the whole point.
            </p>
          </div>

          <div className="mt-20 grid sm:grid-cols-3 gap-8">
            <Value label="Privacy" body="Not a feature — the foundation." />
            <Value label="Permanence" body="Even if we vanish, your message is safe until its date." />
            <Value label="Ritual" body="Sealing is a moment, not a transaction." />
          </div>

          <div className="mt-20 text-center">
            <Link href="/seal" className="btn-primary text-base">
              Seal your first capsule
            </Link>
            <p className="mt-6 mono text-ink-soft">{TAGLINES.secondary}</p>
          </div>
        </div>
      </main>
    </>
  );
}

function Value({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="mono text-seal mb-3">{label}</p>
      <p className="body text-ink-muted">{body}</p>
    </div>
  );
}
