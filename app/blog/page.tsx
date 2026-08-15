import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { articleSchema, breadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/constants';

export const metadata = {
  title: 'Blog',
  description: 'On time, ritual, cryptography, and the messages we send forward.',
};

export default function BlogIndex() {
  const ldBlog = articleSchema({
    title: 'tomorrowme blog',
    description: 'On time, ritual, cryptography, and the messages we send forward.',
    url: `https://${SITE.domain}/blog`,
    datePublished: '2026-08-01',
  });

  const ldBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://${SITE.domain}` },
    { name: 'Blog', url: `https://${SITE.domain}/blog` },
  ]);

  const featured = BLOG_POSTS.filter((p) => p.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBlog) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
      />
      <main className="container-page py-12 sm:py-24 md:py-32">
        <div className="max-w-prose mx-auto">
          <p className="mono mb-6">blog</p>
          <h1 className="display-lg mb-10 text-balance">
            On time, ritual, and the messages we send forward.
          </h1>

          <div className="space-y-6 mb-16">
            {featured.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="block card-paper p-4 sm:p-8 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
                  <span className="mono text-xs text-seal">{p.pillar}</span>
                  <span className="mono text-xs text-ink-soft">
                    {new Date(p.date).toLocaleDateString('en-US', { dateStyle: 'medium' })} · {p.readingMinutes} min
                  </span>
                </div>
                <h2 className="display-sm mb-3">{p.title}</h2>
                <p className="body-lg text-ink-muted">{p.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/blog/rss.xml" className="btn-link text-sm">
              Subscribe via RSS →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
