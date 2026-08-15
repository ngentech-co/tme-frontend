import Link from 'next/link';
import { COMPARISONS } from '@/components/seo/ComparisonTemplate';

export const metadata = {
  title: 'Compare',
  description: 'How tomorrowme compares to other time-capsule and scheduled-message services.',
};

export default function CompareIndex() {
  return (
    <main className="container-page py-12 sm:py-24 md:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">compare</p>
        <h1 className="display-lg mb-10 text-balance">How we compare.</h1>
        <p className="body-lg text-ink-muted mb-16">
          Honest, point-by-point comparisons with the services people ask us about.
        </p>

        <div className="space-y-4">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="block card-paper p-4 sm:p-7 transition-colors"
            >
              <h2 className="heading-md mb-2">tomorrowme vs {c.competitor}</h2>
              <p className="body text-ink-muted">{c.positioning}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
