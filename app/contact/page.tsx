import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the tomorrowme team.',
};

export default function ContactPage() {
  return (
    <main className="container-page py-12 sm:py-24 md:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">contact</p>
        <h1 className="display-lg mb-10 text-balance">Say hello.</h1>

        <div className="reading-prose">
          <p>
            For general questions, partnerships, or just to say hi:
            <br />
            <a href="mailto:hello@tomorrowme.net" className="font-mono text-seal">
              hello@tomorrowme.net
            </a>
          </p>
          <p>
            For security disclosures:
            <br />
            <a href="mailto:security@tomorrowme.net" className="font-mono text-seal">
              security@tomorrowme.net
            </a>
          </p>
          <p>
            For privacy and data requests:
            <br />
            <a href="mailto:privacy@tomorrowme.net" className="font-mono text-seal">
              privacy@tomorrowme.net
            </a>
          </p>
          <p>
            For legal (DMCA, takedowns):
            <br />
            <a href="mailto:legal@tomorrowme.net" className="font-mono text-seal">
              legal@tomorrowme.net
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
