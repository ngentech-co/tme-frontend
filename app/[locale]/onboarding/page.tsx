import type { Metadata } from 'next';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export const metadata: Metadata = {
  title: 'Choose your account',
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-24">
      <OnboardingFlow />
    </main>
  );
}
