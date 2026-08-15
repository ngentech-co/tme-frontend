import type { Metadata } from 'next';
import ComparisonTemplate, { COMPARISONS } from '@/components/seo/ComparisonTemplate';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = COMPARISONS.find((x) => x.slug === params.slug);
  if (!c) return { title: 'Comparison not found' };
  return {
    title: `tomorrowme vs ${c.competitor}`,
    description: c.positioning,
  };
}

export default function ComparisonPage({ params }: Props) {
  const c = COMPARISONS.find((x) => x.slug === params.slug);
  if (!c) notFound();
  return <ComparisonTemplate c={c} />;
}
