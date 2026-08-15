import type { Metadata } from 'next';
import HomeView from '@/components/home/HomeView';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Your tomorrowme home.',
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return <HomeView />;
}
