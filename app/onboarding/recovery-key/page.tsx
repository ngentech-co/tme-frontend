import type { Metadata } from 'next';
import OnboardingRecoveryClient from '@/components/onboarding/OnboardingRecoveryClient';

export const metadata: Metadata = {
  title: 'Recovery key',
  description: 'Save your recovery key before continuing.',
  robots: { index: false, follow: false },
};

export default function OnboardingRecoveryPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-24">
      <OnboardingRecoveryClient />
    </main>
  );
}
