import type { Metadata } from 'next';
import PremiumPage from '@/components/premium/PremiumPage';

export const metadata: Metadata = {
  title: 'Premium',
  robots: { index: false, follow: false },
};

export default function PremiumRoute() {
  return <PremiumPage />;
}
