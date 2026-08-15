import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'The terms of service for using tomorrowme.',
};

export default function TermsPage() {
  return (
    <main className="container-page py-12 sm:py-24 md:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">terms of service</p>
        <h1 className="display-lg mb-10 text-balance">A few quiet rules.</h1>
        <p className="body text-ink-soft mb-12">Last updated: August 2026.</p>

        <div className="reading-prose">
          <h2 className="display-sm mb-4">1. The service</h2>
          <p>
            tomorrowme is a privacy-first time-capsule web app. By using it, you agree
            to these terms. If you don't agree, please don't use it.
          </p>

          <h2 className="display-sm mb-4 mt-12">2. Your content</h2>
          <p>
            You own everything you seal. We hold only encrypted ciphertext and the
            metadata needed to deliver your capsule. You grant us a limited license
            to store and serve that ciphertext until the unlock date or your deletion.
          </p>

          <h2 className="display-sm mb-4 mt-12">3. Acceptable use</h2>
          <p>
            Don't use tomorrowme for content that violates the law in your
            jurisdiction or that targets, harasses, or threatens others. See our{' '}
            <a href="/acceptable-use" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">
              acceptable use policy
            </a>{' '}
            for details.
          </p>

          <h2 className="display-sm mb-4 mt-12">4. Recovery keys</h2>
          <p>
            Your recovery key is the only way to recover your capsules if you lose
            access to your account. tomorrowme cannot recover it for you. If you lose
            your recovery key, your sealed capsules become permanently inaccessible
            once their unlock date passes without you opening them.
          </p>

          <h2 className="display-sm mb-4 mt-12">5. Service availability</h2>
          <p>
            We aim for high availability but provide no warranty of uninterrupted
            service. Because capsules are encrypted client-side and the recovery
            bookmark works independently, your sealed content survives even a complete
            shutdown of tomorrowme.
          </p>

          <h2 className="display-sm mb-4 mt-12">6. Termination</h2>
          <p>
            You may delete your account at any time from Settings → Data. We may
            suspend or terminate accounts that violate these terms or our acceptable
            use policy, with notice where feasible.
          </p>

          <h2 className="display-sm mb-4 mt-12">7. Disclaimers</h2>
          <p>
            The service is provided "as is" without warranty of any kind. To the
            maximum extent permitted by law, tomorrowme disclaims all warranties,
            express or implied.
          </p>

          <h2 className="display-sm mb-4 mt-12">8. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, tomorrowme is not liable for any
            indirect, incidental, special, or consequential damages arising from your
            use of the service.
          </p>

          <h2 className="display-sm mb-4 mt-12">9. Changes</h2>
          <p>
            We may update these terms. Material changes will be announced via the
            changelog and (for email accounts) by email.
          </p>

          <h2 className="display-sm mb-4 mt-12">10. Contact</h2>
          <p>
            Questions: <a href="mailto:hello@tomorrowme.net" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">hello@tomorrowme.net</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
