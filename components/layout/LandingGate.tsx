'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

/**
 * Landing gate: the marketing landing page (/) is for unauthenticated users
 * only. If a user is signed in, redirect them to their home page (/home).
 */
export default function LandingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/home');
    }
  }, [user, loading, router]);

  // While resolving auth, render nothing (prevents a flash of the landing).
  if (loading) return null;
  if (user) return null;

  return <>{children}</>;
}
