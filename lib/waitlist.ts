'use client';

/**
 * Premium waitlist. Local for the demo (structured for a real form backend
 * in production). Stores the email locally and flags the user as on the list.
 */

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
  return entry;
}
