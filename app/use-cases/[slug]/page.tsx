import type { Metadata } from 'next';
import UseCaseTemplate, { USE_CASES } from '@/components/seo/UseCaseTemplate';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return USE_CASES.map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const uc = USE_CASES.find((u) => u.slug === params.slug);
  if (!uc) return { title: 'Use case not found' };
  return {
    title: uc.title,
    description: uc.meta,
  };
}

export default function UseCasePage({ params }: Props) {
  const uc = USE_CASES.find((u) => u.slug === params.slug);
  if (!uc) notFound();
  return <UseCaseTemplate uc={uc} />;
}
