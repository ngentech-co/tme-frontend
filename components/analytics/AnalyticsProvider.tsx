'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import {
  CONSENT_STORAGE_KEY,
  DENIED,
  getGAId,
  getStoredConsent,
  isAnalyticsConfigured,
  isPrivateTier,
  setConsent,
} from '@/lib/analytics';

export default function AnalyticsProvider() {
  const gaId = getGAId();
  const [consent, setConsentState] = useState<ReturnType<typeof getStoredConsent>>(
    DENIED
  );

  // Initialize consent defaults once on mount.
  useEffect(() => {
    const stored = getStoredConsent();
    setConsent(stored);
    // Push initial state to gtag before the tag loads.
    const w = window as unknown as { dataLayer?: unknown[] };
    if (!w.dataLayer) w.dataLayer = [];
    w.dataLayer.push({ consent: { ...stored } });
  }, []);

  // React to tier changes — private tiers force-denied.
  useEffect(() => {
    const apply = () => {
      if (isPrivateTier()) {
        setConsent(DENIED);
        setConsentState(DENIED);
      }
    };
    apply();
    window.addEventListener('storage', apply);
    return () => window.removeEventListener('storage', apply);
  }, []);

  if (!gaId || !isAnalyticsConfigured()) {
    return null;
  }

  return (
    <>
      <Script id="gtm-consent" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', ${JSON.stringify(consent)});
          gtag('set', 'ads_data_redaction', true);
          gtag('set', 'url_passthrough', false);
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
