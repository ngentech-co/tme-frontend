import type { Metadata } from 'next';
import SealWizard from '@/components/seal/SealWizard';

export const metadata: Metadata = {
  title: 'Seal a capsule',
  robots: { index: false, follow: false },
};

export default function SealPage() {
  return <SealWizard />;
}
