'use client';

/**
 * Google Analytics 4 with consent mode v2.
 *
 * Consent defaults follow tier:
 *   - passkey:   analytics_storage=denied, ad_user_data=denied, ad_personalization=denied
 *   - anonymous: analytics_storage=denied (we only ever send anonymized events)
 *   - email:     analytics_storage=denied until the user opts in
 *
 * The tag is only loaded when NEXT_PUBLIC_GA_ID is set. Private-tier users
 * are never tracked regardless of consent.
 */

export type AnalyticsConsent = {
  analytics_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
};

export const CONSENT_STORAGE_KEY = 'tm:analytics-consent';
export const OPTED_OUT_KEY = 'tm:analytics-opted-out';

export const DENIED: AnalyticsConsent = {
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  ad_storage: 'denied',
};

export const GRANTED: AnalyticsConsent = {
  analytics_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  ad_storage: 'granted',
};

export function getGAId(): string | null {
  return process.env.NEXT_PUBLIC_GA_ID ?? null;
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(getGAId());
}

/**
 * Read stored consent. Defaults to fully denied.
 */
export function getStoredConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return DENIED;
  const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!raw) return DENIED;
  try {
    return JSON.parse(raw) as AnalyticsConsent;
  } catch {
    return DENIED;
  }
}

/**
 * Persist consent + update gtag consent state.
 */
export function setConsent(consent: AnalyticsConsent): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  pushConsentToGtag(consent);
}

function pushConsentToGtag(consent: AnalyticsConsent): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[] };
  if (!w.dataLayer) return;
  w.dataLayer.push({
    event: 'consent_update',
    consent: { ...consent },
  });
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('consent', 'update', { ...consent });
}

/**
 * Whether the current session is a private tier that should never be tracked.
 * Mirrors the tier stored by AuthProvider.
 */
export function isPrivateTier(): boolean {
  if (typeof window === 'undefined') return true;
  const tier = localStorage.getItem('tm:tier');
  return tier === 'passkey' || tier === 'anonymous';
}

/**
 * Track a custom event (no-op when not configured, consented, or on private tiers).
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;
  if (!isAnalyticsConfigured()) return;
  if (isPrivateTier()) return;
  const consent = getStoredConsent();
  if (consent.analytics_storage !== 'granted') return;
  gtag('event', eventName, params);
}

/**
 * Consent banner decision.
 */
export function acceptAnalytics(): void {
  localStorage.setItem(OPTED_OUT_KEY, 'false');
  setConsent(GRANTED);
}

export function declineAnalytics(): void {
  localStorage.setItem(OPTED_OUT_KEY, 'true');
  setConsent(DENIED);
}
