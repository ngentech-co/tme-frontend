/**
 * Topic registry for /explore, /topics, and /topics/[slug].
 *
 * A topic is a search-intent cluster (e.g. "birthday messages"). Public
 * capsules can be tagged with a topic; each topic maps to a hub page that
 * surfaces curated content + editorial intro for SEO.
 */

export interface Topic {
  slug: string;
  name: string;
  description: string;
  seoTitle: string;
  emoji: string;
}

export const TOPICS: Topic[] = [
  {
    slug: 'love-letters',
    name: 'Love letters',
    description:
      'Messages sealed for someone you love — a partner, a child, a future self you want to fall in love with again.',
    seoTitle: 'Love letters to the future: seal a message for the one you love',
    emoji: '💌',
  },
  {
    slug: 'birthday-messages',
    name: 'Birthday messages',
    description:
      'Seal a birthday wish today, have it arrive exactly on the day. The gift that keeps the date.',
    seoTitle: 'Birthday messages that wait: schedule a letter for the big day',
    emoji: '🎂',
  },
  {
    slug: 'graduation',
    name: 'Graduation',
    description:
      'Letters from the threshold of adulthood — to the graduate, from their past self.',
    seoTitle: 'Graduation letters: seal advice for the person you are becoming',
    emoji: '🎓',
  },
  {
    slug: 'anniversaries',
    name: 'Anniversaries',
    description:
      'Sealed notes that open on a wedding anniversary, a first-date, or a milestone of survival.',
    seoTitle: 'Anniversary capsules: messages that open on the exact day',
    emoji: '💍',
  },
  {
    slug: 'grief-and-memorial',
    name: 'Grief & memorial',
    description:
      'A place for the letters we write to people we miss — opened on a day of remembrance.',
    seoTitle: 'Grief letters and memorial capsules: write to the people you miss',
    emoji: '🕯️',
  },
  {
    slug: 'self-promises',
    name: 'Self-promises',
    description:
      'The promises you make to yourself, sealed so you cannot take them back.',
    seoTitle: 'Self-promise capsules: hold yourself accountable to future you',
    emoji: '🤞',
  },
  {
    slug: 'music-and-art',
    name: 'Music & art',
    description:
      'Unreleased songs, manuscripts, sketches — locked until the day they are ready.',
    seoTitle: 'Unreleased music and art: time-lock your next release',
    emoji: '🎵',
  },
  {
    slug: 'family-memories',
    name: 'Family memories',
    description:
      'Photos, voices, and stories sealed for the next generation.',
    seoTitle: 'Family time capsules: preserve memories for your children and grandchildren',
    emoji: '👨‍👩‍👧',
  },
  {
    slug: 'confessions',
    name: 'Confessions',
    description:
      'The things we can only tell ourselves, later, when we are ready.',
    seoTitle: 'Sealed confessions: write it down, read it when you are ready',
    emoji: '🤐',
  },
  {
    slug: 'apologies',
    name: 'Apologies',
    description:
      'Letters of apology that need time before they can be sent — or opened.',
    seoTitle: 'Letters of apology: seal the words until you mean them',
    emoji: '🤝',
  },
  {
    slug: 'to-a-child',
    name: 'Letters to a child',
    description:
      'For a child who is not yet born, or a child who will not read it for years.',
    seoTitle: 'Letters to a child: seal messages for the day they turn 18',
    emoji: '👶',
  },
  {
    slug: 'future-news',
    name: 'Future news',
    description:
      'Predictions, hopes, and warnings — sealed and revisited when the future arrives.',
    seoTitle: 'Messages to the future: predictions sealed until the date arrives',
    emoji: '📰',
  },
];

export function getTopic(slug: string): Topic | null {
  return TOPICS.find((t) => t.slug === slug) ?? null;
}

/**
 * In a real deployment these come from a Supabase query of public capsules.
 * For the static/offline build we surface a curated starter set per topic.
 */
export interface ExploreCapsule {
  id: string;
  title: string;
  slug: string;
  topic: string;
  unlockDate: string;
  description: string;
  author: string;
}

export const STARTER_CAPSULES: ExploreCapsule[] = [
  {
    id: 'demo-1',
    title: 'To my daughter on her 18th birthday',
    slug: 'starter-1',
    topic: 'to-a-child',
    unlockDate: '2043-04-12',
    description: 'What I want you to know the day you read this.',
    author: 'a parent',
  },
  {
    id: 'demo-2',
    title: 'The song I wrote the winter I was broke',
    slug: 'starter-2',
    topic: 'music-and-art',
    unlockDate: '2036-01-01',
    description: 'First release, sealed on its 10th birthday.',
    author: 'an artist',
  },
  {
    id: 'demo-3',
    title: 'Reasons I am proud of us',
    slug: 'starter-3',
    topic: 'anniversaries',
    unlockDate: '2031-06-14',
    description: 'For our 15th anniversary.',
    author: 'a partner',
  },
  {
    id: 'demo-4',
    title: 'Advice for college-me',
    slug: 'starter-4',
    topic: 'graduation',
    unlockDate: '2027-08-20',
    description: 'Open the morning of my first class.',
    author: 'a senior',
  },
  {
    id: 'demo-5',
    title: 'The apology I could not send',
    slug: 'starter-5',
    topic: 'apologies',
    unlockDate: '2030-01-01',
    description: 'I hope time makes this kinder.',
    author: 'anonymous',
  },
  {
    id: 'demo-6',
    title: 'What I believe at 27',
    slug: 'starter-6',
    topic: 'self-promises',
    unlockDate: '2035-12-31',
    description: 'Check back when I am 36.',
    author: 'a thinker',
  },
];
