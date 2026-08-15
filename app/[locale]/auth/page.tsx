import type { Metadata } from 'next';
import AuthFlow from '@/components/auth/AuthFlow';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return <AuthFlow />;
}
