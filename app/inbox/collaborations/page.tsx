import type { Metadata } from 'next';
import Collaborations from '@/components/collab/Collaborations';

export const metadata: Metadata = {
  title: 'Collaborations',
  description: 'Capsules shared with co-authors.',
  robots: { index: false, follow: false },
};

export default function CollaborationsPage() {
  return <Collaborations />;
}
