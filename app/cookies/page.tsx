import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookies',
  description: 'Our cookie policy — short because we use very few.',
};

export default function CookiesPage() {
  return (
    <main className="container-page py-12 sm:py-24 md:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">cookies</p>
        <h1 className="display-lg mb-10 text-balance">A small cookie policy.</h1>

        <div className="reading-prose">
          <p>
            We use a single first-party session cookie to keep you signed in.
            That's it. No third-party advertising cookies, no analytics cookies
            on passkey or anonymous accounts.
          </p>

          <h2 className="display-sm mb-4 mt-12">What we use</h2>
          <ul className="space-y-3 body-lg">
            <li><strong>tm:auth</strong> — Supabase auth session (first-party). Required.</li>
            <li><strong>tm:theme</strong> — your chosen theme (light/dark/sepia). Optional.</li>
            <li><strong>tm:tier</strong> — your account tier (anonymous/email/passkey). Required.</li>
          </ul>

          <h2 className="display-sm mb-4 mt-12">Email accounts only</h2>
          <p>
            If you opt in, Google Analytics 4 sets cookies for measurement. Default
            is denied (consent mode v2). You can change this in{' '}
            <a href="/settings/privacy" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">
              Settings → Privacy
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
}
