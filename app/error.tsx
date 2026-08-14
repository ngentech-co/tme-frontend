'use client';

import Link from 'next/link';
import { SITE } from '@/lib/constants';

export const metadata = {
  title: 'Something went wrong',
  robots: { index: false, follow: false },
};

export default function ErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-reading text-center">
        <span className="seal-stamp mx-auto mb-10">!</span>
        <h1 className="display-md mb-6">The seal broke.</h1>
        <p className="body-lg text-ink-muted mb-10">
          Something went wrong on our side. Your capsules are safe — they're
          sealed client-side and unaffected by our errors. Try again, or come
          back in a moment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Try again
          </Link>
          <Link href="/contact" className="btn-ghost">
            Report this
          </Link>
        </div>
        <p className="mt-12 body-sm text-ink-soft mono">
          error · 500 · {SITE.name}
        </p>
      </div>
    </main>
  );
}
