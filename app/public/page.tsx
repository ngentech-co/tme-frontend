import type { Metadata } from 'next';
import PublicCapsule from '@/components/public/PublicCapsule';

export const metadata: Metadata = {
  title: 'A sealed capsule',
  description: 'A private message sealed with cryptography, waiting to be opened.',
  robots: { index: true, follow: true },
};

export default function PublicCapsulePage() {
  return <PublicCapsule />;
}
