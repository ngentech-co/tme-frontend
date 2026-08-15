import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blog-posts';
import HowTimeLockWorks from '@/content/blog/how-time-lock-encryption-works';
import PromptsForLetters from '@/content/blog/50-prompts-for-letters-to-future-self';
import HistoryOfTimeCapsules from '@/content/blog/history-of-time-capsules';
import WhyEncryptYourLetters from '@/content/blog/why-encrypt-your-letters';

interface Props {
  params: { slug: string };
}

const POST_COMPONENTS: Record<string, React.ComponentType> = {
  'how-time-lock-encryption-works': HowTimeLockWorks,
  '50-prompts-for-letters-to-future-self': PromptsForLetters,
  'history-of-time-capsules': HistoryOfTimeCapsules,
  'why-encrypt-your-letters': WhyEncryptYourLetters,
};

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const Content = POST_COMPONENTS[post.slug];
  if (!Content) notFound();

  return (
    <article className="container-page py-24 sm:py-32">
      <div className="max-w-prose mx-auto">
        <div className="mb-10">
          <Link href="/blog" className="mono text-ink-muted hover:text-ink mb-6 inline-block">
            ← blog
          </Link>
          <p className="mono text-seal mb-3">{post.pillar}</p>
          <h1 className="display-lg mb-6 text-balance">{post.title}</h1>
          <div className="flex items-baseline gap-4 mono text-ink-soft text-sm">
            <span>{new Date(post.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
            <span>·</span>
            <span>{post.author}</span>
          </div>
        </div>

        <div className="reading-prose">
          <Content />
        </div>
      </div>
    </article>
  );
}
