import RecoveryHandler from '@/components/recovery/RecoveryHandler';
import { SITE } from '@/lib/constants';

export const metadata = {
  title: 'Recovery',
  robots: { index: false, follow: false },
};

export default function RecoveryPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <RecoveryHandler siteName={SITE.name} />
    </main>
  );
}
