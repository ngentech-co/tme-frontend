'use client';

import SettingsSection, { Field, Toggle } from './SettingsSection';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/use-settings';
import {
  acceptAnalytics,
  declineAnalytics,
  getStoredConsent,
  isAnalyticsConfigured,
} from '@/lib/analytics';
import { useEffect } from 'react';

export default function PrivacySettings() {
  const { user } = useAuth();
  const { settings: s, update } = useSettings();
  const configured = isAnalyticsConfigured();
  const isPrivate = user?.tier === 'passkey' || user?.tier === 'anonymous';

  // Sync the analytics toggle from stored consent.
  useEffect(() => {
    if (!configured) return;
    update({ analytics: getStoredConsent().analytics_storage === 'granted' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  const toggleAnalytics = (on: boolean) => {
    update({ analytics: on });
    if (on) acceptAnalytics();
    else declineAnalytics();
  };

  return (
    <SettingsSection
      title="Privacy"
      description="Visibility, tracking, and data sharing. Changes save automatically."
    >
      <Field
        label="Allow search engines to index your public capsules"
        hint="Adds a noindex flag when off."
      >
        <Toggle checked={s.searchIndex} onChange={(v) => update({ searchIndex: v })} />
      </Field>

      <Field
        label="Send anonymous usage data"
        hint={
          isPrivate
            ? 'Locked off for passkey and anonymous accounts by design.'
            : configured
            ? 'Opt-in. Aggregate, anonymous. Never content. Never identifiers.'
            : 'Analytics is not configured yet (GA ID not set).'
        }
      >
        <Toggle
          checked={s.analytics}
          onChange={toggleAnalytics}
          disabled={isPrivate || !configured}
        />
      </Field>

      <Field
        label="IP address logging"
        hint="Used only for spam prevention and region-based rate limits."
      >
        <select
          value={s.ipLog}
          onChange={(e) => update({ ipLog: e.target.value as 'hash' | 'none' | 'full' })}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="hash">Anonymized-hash</option>
          <option value="none">No IP logging</option>
          <option value="full">Full IP (debug only)</option>
        </select>
      </Field>

      <Field
        label="Allow product improvement studies"
        hint="Opt-in only. Never includes your content."
      >
        <Toggle checked={s.improvement} onChange={(v) => update({ improvement: v })} />
      </Field>

      <Field
        label="Allow research partnerships"
        hint="Anonymized aggregate stats shared with academic researchers."
      >
        <Toggle checked={s.research} onChange={(v) => update({ research: v })} />
      </Field>

      <p className="mono text-ink-soft mt-8">saved automatically</p>
    </SettingsSection>
  );
}
