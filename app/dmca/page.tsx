import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA',
  description: 'How to submit a DMCA takedown notice to tomorrowme.',
};

export default function DMCAPage() {
  return (
    <main className="container-page py-24 sm:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">dmca</p>
        <h1 className="display-lg mb-10 text-balance">Takedown process.</h1>

        <div className="reading-prose">
          <p>
            If you believe content on tomorrowme infringes your copyright, you
            may submit a DMCA takedown notice. Note that because we encrypt
            capsule contents client-side, takedowns apply only to public
            capsule titles, share slugs, and post-unlock content.
          </p>

          <h2 className="display-sm mb-4 mt-12">Send your notice to</h2>
          <p>
            <a href="mailto:legal@tomorrowme.net" className="font-mono text-seal">
              legal@tomorrowme.net
            </a>
          </p>

          <h2 className="display-sm mb-4 mt-12">Your notice must include</h2>
          <ol className="space-y-2 list-decimal pl-6 body-lg">
            <li>Identification of the copyrighted work.</li>
            <li>Identification of the infringing material (URL or capsule id).</li>
            <li>Your contact information.</li>
            <li>A statement of good-faith belief that use is unauthorized.</li>
            <li>A statement, under penalty of perjury, that the information is accurate and you are authorized to act for the owner.</li>
            <li>Your physical or electronic signature.</li>
          </ol>

          <h2 className="display-sm mb-4 mt-12">Counter-notice</h2>
          <p>
            If you believe your content was removed in error, you may submit a
            counter-notice with the same six elements (substituting the relevant
            statements).
          </p>
        </div>
      </div>
    </main>
  );
}
