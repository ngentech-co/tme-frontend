import type { Metadata } from 'next';
import SealWizard from '@/components/seal/SealWizard';

export const metadata: Metadata = {
  title: 'Seal a capsule',
  description: 'Compose a message to your future self. Set the date. Seal it with math.',
  robots: { index: false, follow: false },
};

export default function SealPage() {
  return <SealWizard />;
}
