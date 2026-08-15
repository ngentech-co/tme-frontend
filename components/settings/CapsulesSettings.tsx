'use client';

import SettingsSection, { Field } from './SettingsSection';
import { useSettings } from '@/lib/use-settings';

export default function CapsulesSettings() {
  const { settings, update } = useSettings();

  return (
    <SettingsSection
      title="Capsule defaults"
      description="These apply to every new capsule you seal. You can override per-capsule. Changes save automatically."
    >
      <Field label="Default visibility">
        <select
          value={settings.defaultVisibility}
          onChange={(e) =>
            update({ defaultVisibility: e.target.value as 'private' | 'unlisted' | 'public' })
          }
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="private">Private</option>
          <option value="unlisted">Unlisted</option>
          <option value="public">Public</option>
        </select>
      </Field>

      <Field label="Default unlock-date preset">
        <select
          value={settings.unlockPreset}
          onChange={(e) => update({ unlockPreset: e.target.value })}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="1m">1 month</option>
          <option value="3m">3 months</option>
          <option value="6m">6 months</option>
          <option value="1y">1 year</option>
          <option value="5y">5 years</option>
          <option value="custom">Custom</option>
        </select>
      </Field>

      <Field label="Max media size per capsule" hint="In MB. Hard cap for new uploads.">
        <input
          type="number"
          value={settings.sizeCapMb}
          onChange={(e) => update({ sizeCapMb: e.target.value })}
          min={1}
          max={500}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm w-24 font-mono"
        />
      </Field>

      <Field label="Time-lock chain" hint="Drand chain used for the time-lock primitive.">
        <select
          value={settings.timeLockChain}
          onChange={(e) => update({ timeLockChain: e.target.value })}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm font-mono"
        >
          <option value="default">Drand default (1-minute rounds)</option>
          <option value="testnet">Drand testnet (testing only)</option>
        </select>
      </Field>

      <p className="mono text-ink-soft mt-8">saved automatically</p>
    </SettingsSection>
  );
}
