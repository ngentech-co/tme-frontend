import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press',
  description: 'Press kit, brand assets, and contact for media inquiries.',
};

export default function PressPage() {
  return (
    <main className="container-page py-24 sm:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">press</p>
        <h1 className="display-lg mb-10 text-balance">For media inquiries.</h1>

        <div className="reading-prose">
          <p>
            For interview requests, quotes, or product reviews, reach out at{' '}
            <a href="mailto:press@tomorrowme.net" className="font-mono text-seal">
              press@tomorrowme.net
            </a>.
          </p>

          <h2 className="display-sm mb-4 mt-12">Brand assets</h2>
          <ul className="space-y-3 body-lg">
            <li>
              Logo (SVG):{' '}
              <a href="/logo.svg" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">
                /logo.svg
              </a>
            </li>
            <li>
              Favicon (SVG):{' '}
              <a href="/favicon.svg" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">
                /favicon.svg
              </a>
            </li>
            <li>
              OG image:{' '}
              <a href="/og/default.svg" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">
                /og/default.svg
              </a>
            </li>
          </ul>

          <h2 className="display-sm mb-4 mt-12">Quick facts</h2>
          <ul className="space-y-3 body-lg">
            <li><strong>Founded:</strong> 2026</li>
            <li><strong>Headquarters:</strong> Internet (no office)</li>
            <li><strong>Funding:</strong> Self-funded</li>
            <li><strong>Users:</strong> Pre-launch</li>
            <li><strong>Mission:</strong> Make private, future-dated communication as easy as sending a message.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
