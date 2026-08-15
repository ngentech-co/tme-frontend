'use client';

import RecoveryKeyGate from '@/components/onboarding/RecoveryKeyGate';

export default function OnboardingRecoveryClient() {
  return (
    <RecoveryKeyGate
      onConfirmed={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/inbox';
        }
      }}
    />
  );
}
