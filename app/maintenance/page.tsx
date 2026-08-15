import Link from 'next/link';
import { SITE } from '@/lib/constants';

export const metadata = {
  title: 'Be right back',
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-reading text-center">
        <div className="flex justify-center mb-10">
          <span className="seal-stamp">tm</span>
        </div>
        <h1 className="display-md mb-6">Be right back.</h1>
        <p className="body-lg text-ink-muted mb-10">
          We're sealing some updates. Existing capsules are unaffected — your
          secrets are still safe. Check back in a few minutes.
        </p>
        <Link href="/contact" className="btn-ghost">
          Get notified when we're back
        </Link>
        <p className="mt-12 body-sm text-ink-soft mono">
          {SITE.name} · maintenance
        </p>
      </div>
    </main>
  );
}
