import type { Metadata } from 'next';
import FileVault from '@/components/media/FileVault';

export const metadata: Metadata = {
  title: 'File vault',
  description: 'Files sealed inside your capsules.',
  robots: { index: false, follow: false },
};

export default function FileVaultPage() {
  return <FileVault />;
}
