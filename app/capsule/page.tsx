import type { Metadata } from 'next';
import CapsuleDetail from '@/components/capsule/CapsuleDetail';

export const metadata: Metadata = {
  title: 'Capsule',
  robots: { index: false, follow: false },
};

export default function CapsulePage() {
  return <CapsuleDetail />;
}
