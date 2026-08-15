'use client';

import { useState } from 'react';
import SettingsSection, { Field } from './SettingsSection';

export default function CapsulesSettings() {
  const [visibility, setVisibility] = useState('private');
  const [unlockPreset, setUnlockPreset] = useState('6m');
  const [sizeCap, setSizeCap] = useState('100');
  const [chain, setChain] = useState('default');

  return (
    <SettingsSection
      title="Capsule defaults"
      description="These apply to every new capsule you seal. You can override per-capsule."
    >
      <Field label="Default visibility">
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="private">Private</option>
          <option value="unlisted">Unlisted</option>
          <option value="public">Public</option>
        </select>
      </Field>

      <Field label="Default unlock-date preset">
        <select
          value={unlockPreset}
          onChange={(e) => setUnlockPreset(e.target.value)}
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
          value={sizeCap}
          onChange={(e) => setSizeCap(e.target.value)}
          min={1}
          max={500}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm w-24 font-mono"
        />
      </Field>

      <Field label="Time-lock chain" hint="Drand chain used for the time-lock primitive.">
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm font-mono"
        >
          <option value="default">Drand default (1-minute rounds)</option>
          <option value="testnet">Drand testnet (testing only)</option>
        </select>
      </Field>

      <div className="mt-10 flex justify-end">
        <button className="btn-primary text-sm py-2.5 px-6">Save defaults</button>
      </div>
    </SettingsSection>
  );
}
