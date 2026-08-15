export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readingMinutes: number;
  tags: string[];
  pillar: 'ritual' | 'tech' | 'story' | 'privacy' | 'product';
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-time-lock-encryption-works',
    title: 'How time-lock encryption actually works',
    description:
      'A plain-English explanation of how Drand and identity-based encryption let us seal a message to open only on a specific future date.',
    date: '2026-08-12',
    author: 'tomorrowme',
    readingMinutes: 8,
    tags: ['crypto', 'drand', 'time-lock', 'technical'],
    pillar: 'tech',
    featured: true,
  },
  {
    slug: '50-prompts-for-letters-to-future-self',
    title: '50 prompts for letters to your future self',
    description:
      'A curated set of writing prompts to help you put something real into a sealed capsule.',
    date: '2026-08-10',
    author: 'tomorrowme',
    readingMinutes: 6,
    tags: ['ritual', 'writing', 'prompts'],
    pillar: 'ritual',
    featured: true,
  },
  {
    slug: 'history-of-time-capsules',
    title: 'The history of time capsules, from Babylon to blockchain',
    description:
      'Time capsules are older than writing. A short tour of how humans have tried to speak across time.',
    date: '2026-08-08',
    author: 'tomorrowme',
    readingMinutes: 5,
    tags: ['culture', 'history'],
    pillar: 'story',
    featured: true,
  },
  {
    slug: 'why-encrypt-your-letters',
    title: 'Self-custody of your words: why encryption matters for personal letters',
    description:
      'Most "private" apps are private only until they aren\'t. Here\'s why your letters deserve the same protections as your money.',
    date: '2026-08-06',
    author: 'tomorrowme',
    readingMinutes: 7,
    tags: ['privacy', 'crypto', 'essays'],
    pillar: 'privacy',
    featured: true,
  },
];
