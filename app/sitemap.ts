import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

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
];

const USE_CASES = [
  'letter-to-future-self',
  'digital-time-capsule',
  'sealed-secrets-and-confessions',
  'unreleased-music',
  'family-time-capsule',
  'anniversary-surprises',
  'birthday-messages',
  'wedding-vows',
  'graduation-letters',
  'grief-and-memorial',
  'baby-letters',
  'business-announcements',
];

const COMPARISONS = [
  'tomorrowme-vs-futureme',
  'tomorrowme-vs-capsule',
  'tomorrowme-vs-letterstream',
  'tomorrowme-vs-dayone',
  'tomorrowme-vs-google-keeps-scheduled',
  'encrypted-vs-traditional-time-capsule',
  'free-vs-paid-time-capsule-apps',
];

const LEARN = [
  'time-lock-encryption',
  'drand-network',
  'digital-time-capsule-history',
  'threshold-cryptography',
  'self-custody-keys-explained',
  'why-encrypt-your-letters',
  'grief-letters-to-yourself',
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

  const useCaseEntries: MetadataRoute.Sitemap = USE_CASES.map((slug) => ({
    url: `${baseUrl}/use-cases/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const compareEntries: MetadataRoute.Sitemap = COMPARISONS.map((slug) => ({
    url: `${baseUrl}/compare/${slug}`,
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

  return [
    ...staticEntries,
    ...useCaseEntries,
    ...compareEntries,
    ...learnEntries,
    ...blogIndex,
  ];
}
