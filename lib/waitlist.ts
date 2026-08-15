'use client';

/**
 * Premium waitlist.
 * Online → Supabase `waitlist` table; offline → localStorage.
 */

import { backendOnline } from './backend';

const WAITLIST_KEY = 'tm:waitlist';

export interface WaitlistEntry {
  email: string;
  locale: string;
  signedUpAt: string;
}

export function isOnWaitlist(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(WAITLIST_KEY) !== null;
}

export function getWaitlistEntry(): WaitlistEntry | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(WAITLIST_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WaitlistEntry;
  } catch {
    return null;
  }
}

export function joinWaitlist(email: string, locale: string): WaitlistEntry {
  const entry: WaitlistEntry = {
    email,
    locale,
    signedUpAt: new Date().toISOString(),
  };
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(entry));
  if (backendOnline()) {
    import('@/lib/backend')
      .then(({ getSupabase }) => {
        const sb = getSupabase();
        return sb?.from('waitlist').upsert({ email, locale });
      })
      .catch(() => {});
  }
  return entry;
}
