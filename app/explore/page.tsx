import type { Metadata } from 'next';
import ExploreView from '@/components/explore/ExploreView';

export const metadata: Metadata = {
  title: 'Explore public capsules',
  description:
    'Discover public time capsules — love letters, birthday messages, secrets, and songs sealed for the future.',
};

export default function ExplorePage() {
  return <ExploreView />;
}
