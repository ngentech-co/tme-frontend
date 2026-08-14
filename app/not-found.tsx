import Link from 'next/link';
import { JsonLd, softwareApplicationSchema } from '@/lib/seo';
import { SITE } from '@/lib/constants';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <main className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-reading text-center">
          <span className="seal-stamp mx-auto mb-10">?</span>
          <h1 className="display-md mb-6">This page hasn't been sealed.</h1>
          <p className="body-lg text-ink-muted mb-10">
            Maybe it's somewhere else, or maybe it never existed. Either way,
            you can seal a message of your own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">
              Go home
            </Link>
            <Link href="/seal" className="btn-ghost">
              Seal a letter instead
            </Link>
          </div>
          <p className="mt-12 body-sm text-ink-soft mono">
            error · 404 · {SITE.name}
          </p>
        </div>
      </main>
    </>
  );
}
