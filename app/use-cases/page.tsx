import Link from 'next/link';
import { USE_CASES } from '@/components/seo/UseCaseTemplate';

export const metadata = {
  title: 'Use cases',
  description: 'A digital time capsule for every kind of message.',
};

export default function UseCasesIndex() {
  return (
    <main className="container-page py-24 sm:py-32">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">use cases</p>
        <h1 className="display-lg mb-10 text-balance">
          A capsule for every kind of message.
        </h1>
        <p className="body-lg text-ink-muted mb-16">
          Different messages need different shapes. Pick the one that fits yours.
        </p>

        <div className="space-y-4">
          {USE_CASES.map((uc) => (
            <Link
              key={uc.slug}
              href={`/use-cases/${uc.slug}`}
              className="block card-paper p-7 hover:shadow-paper-lg hover:-translate-y-0.5 transition-all"
            >
              <h2 className="heading-md mb-2">{uc.title}</h2>
              <p className="body text-ink-muted">{uc.meta}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
