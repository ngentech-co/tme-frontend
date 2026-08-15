'use client';

import { useEffect, useState } from 'react';
import {
  CONSENT_STORAGE_KEY,
  OPTED_OUT_KEY,
  acceptAnalytics,
  declineAnalytics,
  isAnalyticsConfigured,
  isPrivateTier,
} from '@/lib/analytics';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isAnalyticsConfigured()) return;
    // Don't show on private tiers, and don't show if a choice was made.
    const decided = localStorage.getItem(CONSENT_STORAGE_KEY) || localStorage.getItem(OPTED_OUT_KEY);
    if (decided || isPrivateTier()) return;
    // Show after a short delay.
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const onAccept = () => {
    acceptAnalytics();
    setVisible(false);
  };

  const onDecline = () => {
    declineAnalytics();
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="card-paper max-w-prose mx-auto p-6 shadow-paper-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="body-sm text-ink-muted flex-1">
          We use privacy-respecting analytics to understand how tomorrowme is used.
          Anonymous, aggregate only. You can change this anytime in Settings.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={onDecline} className="btn-ghost text-sm py-2 px-5">
            No thanks
          </button>
          <button onClick={onAccept} className="btn-primary text-sm py-2 px-5">
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
