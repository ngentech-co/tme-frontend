import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TOPICS, getTopic, STARTER_CAPSULES } from '@/lib/topics';
import { articleSchema, breadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/constants';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getTopic(params.slug);
  if (!topic) return { title: 'Topic not found' };
  return {
    title: topic.seoTitle,
    description: topic.description,
  };
}

const PROMPTS: Record<string, string[]> = {
  'love-letters': [
    'What did you feel the first time you saw them?',
    'What do you hope you still feel in ten years?',
    'Describe the ordinary Tuesday you are most grateful for.',
    'What do you want to say that you have never been brave enough to say?',
  ],
  'birthday-messages': [
    'What do you want them to know on their next birthday?',
    'Remember the party where everything went right?',
    'What are you wishing for them this year?',
  ],
  graduation: [
    'What advice would you give the graduate in five years?',
    'What do you wish someone had told you at that age?',
    'What is the first thing you want them to remember?',
  ],
  anniversaries: [
    'What has stayed the same since day one?',
    'What do you want to say on the milestone you set?',
    'What small promise are you keeping for them?',
  ],
  'grief-and-memorial': [
    'What is your favorite memory of them?',
    'What do you want them to know now?',
    'What will you carry forward from them?',
  ],
  'self-promises': [
    'What are you promising yourself today?',
    'What habit do you want to have built by then?',
    'What will you forgive yourself for in the future?',
  ],
  'music-and-art': [
    'What is this piece about, in one sentence?',
    'Where were you when you wrote it?',
    'Who are you releasing this to?',
  ],
  'family-memories': [
    'What does your home smell like right now?',
    'What was the last thing the whole family laughed at?',
    'What do you want your grandchildren to know about you?',
  ],
  confessions: [
    'What have you been carrying?',
    'What do you want to stop hiding from yourself?',
    'What truth are you almost ready to tell?',
  ],
  apologies: [
    'What are you sorry for?',
    'What would you say if you were not afraid?',
    'What do you hope time has healed by then?',
  ],
  'to-a-child': [
    'What do you want them to know the day they read this?',
    'What was the world like when they were born?',
    'What do you hope for them?',
  ],
  'future-news': [
    'What do you predict will have changed?',
    'What do you hope will not have changed?',
    'What should the future you remember?',
  ],
};

export default function TopicPage({ params }: Props) {
  const topic = getTopic(params.slug);
  if (!topic) notFound();

  const capsules = STARTER_CAPSULES.filter((c) => c.topic === topic.slug);
  const prompts = PROMPTS[topic.slug] ?? [];

  const ld = [
    articleSchema({
      title: topic.seoTitle,
      description: topic.description,
      url: `https://${SITE.domain}/topics/${topic.slug}`,
      datePublished: '2026-08-15',
    }),
    breadcrumbSchema([
      { name: 'Home', url: `https://${SITE.domain}` },
      { name: 'Topics', url: `https://${SITE.domain}/topics` },
      { name: topic.name, url: `https://${SITE.domain}/topics/${topic.slug}` },
    ]),
  ];

  return (
    <>
      {ld.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <main className="container-page py-12 sm:py-24 md:py-32">
        <div className="max-w-prose mx-auto">
          <Link href="/topics" className="mono text-ink-muted hover:text-ink mb-10 inline-block">
            ← topics
          </Link>
          <p className="mono mb-3">{topic.emoji} {topic.name}</p>
          <h1 className="display-lg mb-8 text-balance">{topic.seoTitle}</h1>
          <p className="body-lg text-ink-muted mb-16">{topic.description}</p>

          {prompts.length > 0 && (
            <>
              <h2 className="display-sm mb-6">Prompts to start</h2>
              <ul className="space-y-4 mb-16">
                {prompts.map((p) => (
                  <li key={p} className="flex gap-4 body-lg">
                    <span className="text-seal">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {capsules.length > 0 && (
            <>
              <h2 className="display-sm mb-6">Capsules in this topic</h2>
              <div className="space-y-4 mb-16">
                {capsules.map((c) => (
                  <div key={c.id} className="card-paper p-7">
                    <div className="flex items-center justify-between mb-2">
                      <p className="mono text-xs text-ink-soft">{c.author}</p>
                      <p className="mono text-xs text-ink-soft">
                        opens {new Date(c.unlockDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </p>
                    </div>
                    <h3 className="heading-md mb-2">{c.title}</h3>
                    <p className="body text-ink-muted">{c.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="card-paper p-10 text-center">
            <p className="display-sm mb-6 text-balance">Write your own.</p>
            <Link href="/seal" className="btn-primary text-base">
              Seal a capsule
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
