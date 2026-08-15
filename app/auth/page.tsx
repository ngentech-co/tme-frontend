import type { Metadata } from 'next';
import AuthFlow from '@/components/auth/AuthFlow';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to tomorrowme with a passkey, email, or anonymously.',
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-24">
      <AuthFlow />
    </main>
  );
}
