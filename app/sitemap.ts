import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { USE_CASES } from '@/components/seo/UseCaseTemplate';
import { COMPARISONS } from '@/components/seo/ComparisonTemplate';
import { TOPICS } from '@/lib/topics';

const STATIC_PATHS = [
  '',
  '/about',
  '/how-it-works',
  '/features',
  '/pricing',
  '/faq',
  '/security',
  '/privacy',
  '/terms',
  '/cookies',
  '/acceptable-use',
  '/dmca',
  '/contact',
  '/changelog',
  '/roadmap',
  '/press',
  '/use-cases',
  '/compare',
  '/learn',
  '/topics',
  '/explore',
];

const LEARN = [
  'time-lock-encryption',
  'drand-network',
  'self-custody-keys-explained',
  'digital-time-capsule-history',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = SITE.url;

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1.0 : path === '/security' || path === '/how-it-works' ? 0.9 : 0.7,
  }));

  const useCaseEntries: MetadataRoute.Sitemap = USE_CASES.map((uc) => ({
    url: `${baseUrl}/use-cases/${uc.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const compareEntries: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const learnEntries: MetadataRoute.Sitemap = LEARN.map((slug) => ({
    url: `${baseUrl}/learn/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const topicEntries: MetadataRoute.Sitemap = TOPICS.map((t) => ({
    url: `${baseUrl}/topics/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...useCaseEntries,
    ...compareEntries,
    ...learnEntries,
    ...blogIndex,
    ...blogEntries,
    ...topicEntries,
  ];
}
