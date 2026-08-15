import type { Metadata } from 'next';
import Link from 'next/link';
import { TOPICS } from '@/lib/topics';
import { breadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Topics',
  description:
    'Browse tomorrowme topics — love letters, birthday messages, graduations, grief letters, and more.',
};

export default function TopicsIndexPage() {
  const ld = breadcrumbSchema([
    { name: 'Home', url: `https://${SITE.domain}` },
    { name: 'Topics', url: `https://${SITE.domain}/topics` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main className="container-page py-24 sm:py-32">
        <div className="max-w-prose mx-auto">
          <p className="mono mb-6">topics</p>
          <h1 className="display-lg mb-10 text-balance">
            Every kind of message, given a home.
          </h1>
          <p className="body-lg text-ink-muted mb-16">
            Choose a topic to see what people seal, why, and how to write your own.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {TOPICS.map((t) => (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}`}
                className="card-paper p-7 hover:shadow-paper-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="text-2xl mb-3">{t.emoji}</div>
                <h2 className="heading-md mb-2">{t.name}</h2>
                <p className="body-sm text-ink-muted">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
