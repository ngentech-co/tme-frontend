import type { Metadata } from 'next';
import UnlockView from '@/components/capsule/UnlockView';

export const metadata: Metadata = {
  title: 'Unlock',
  robots: { index: false, follow: false },
};

export default function UnlockPage() {
  return <UnlockView />;
}
