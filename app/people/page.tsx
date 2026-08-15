import type { Metadata } from 'next';
import PeopleDirectory from '@/components/follow/PeopleDirectory';

export const metadata: Metadata = {
  title: 'People',
  description: 'Follow people who seal capsules on tomorrowme.',
  robots: { index: false, follow: false },
};

export default function PeoplePage() {
  return <PeopleDirectory />;
}
