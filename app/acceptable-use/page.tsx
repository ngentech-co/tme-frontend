import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceptable use',
  description: 'What you can and cannot seal in tomorrowme.',
};

export default function AcceptableUsePage() {
  return (
    <main className="container-page py-24 sm:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">acceptable use</p>
        <h1 className="display-lg mb-10 text-balance">
          What you can (and shouldn't) seal.
        </h1>

        <div className="reading-prose">
          <p>
            tomorrowme is built for personal, lawful use. You're free to seal
            personal letters, family memories, secrets you keep to yourself,
            confessions that heal — anything that doesn't hurt others.
          </p>

          <h2 className="display-sm mb-4 mt-12">Don't use tomorrowme for</h2>
          <ul className="space-y-3 body-lg">
            <li>Content that is illegal in your jurisdiction.</li>
            <li>Targeted harassment, threats, or doxxing of others.</li>
            <li>Child sexual abuse material (CSAM) — zero tolerance.</li>
            <li>Content that infringes intellectual property rights.</li>
            <li>Spam, scams, or coordinated inauthentic behavior.</li>
            <li>Market manipulation (e.g., "time-locked" insider trading instructions).</li>
          </ul>

          <h2 className="display-sm mb-4 mt-12">A note on encryption</h2>
          <p>
            Because content is encrypted client-side and we have no decryption
            key, our ability to moderate is limited to public metadata
            (titles, share slugs, public-capsule content after unlock). We
            respond to legal process for public content. We do not decrypt
            sealed content in response to any request.
          </p>

          <h2 className="display-sm mb-4 mt-12">Reporting</h2>
          <p>
            Found something that violates this policy?{' '}
            <a href="mailto:legal@tomorrowme.net" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">
              Report it
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
}
