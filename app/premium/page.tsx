import type { Metadata } from 'next';
import PremiumPage from '@/components/premium/PremiumPage';

export const metadata: Metadata = {
  title: 'Premium',
  description:
    'tomorrowme Premium — longer unlocks, bigger media, collaborative capsules at scale, and on-chain proof of unlock. Join the waitlist.',
};

export default function PremiumRoute() {
  return <PremiumPage />;
}
