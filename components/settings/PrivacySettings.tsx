'use client';

import { useState } from 'react';
import SettingsSection, { Field, Toggle } from './SettingsSection';

export default function PrivacySettings() {
  const [searchIndex, setSearchIndex] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [ipLog, setIpLog] = useState('hash');
  const [improvement, setImprovement] = useState(false);
  const [research, setResearch] = useState(false);

  return (
    <SettingsSection
      title="Privacy"
      description="Visibility, tracking, and data sharing."
    >
      <Field
        label="Allow search engines to index your public capsules"
        hint="Adds a noindex flag when off."
      >
        <Toggle checked={searchIndex} onChange={setSearchIndex} />
      </Field>

      <Field
        label="Send anonymous usage data"
        hint="Aggregate, anonymous. Never content. Never identifiers."
      >
        <Toggle checked={analytics} onChange={setAnalytics} />
      </Field>

      <Field
        label="IP address logging"
        hint="Used only for spam prevention and region-based rate limits."
      >
        <select
          value={ipLog}
          onChange={(e) => setIpLog(e.target.value)}
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
        <Toggle checked={improvement} onChange={setImprovement} />
      </Field>

      <Field
        label="Allow research partnerships"
        hint="Anonymized aggregate stats shared with academic researchers."
      >
        <Toggle checked={research} onChange={setResearch} />
      </Field>

      <div className="mt-10 flex justify-end">
        <button className="btn-primary text-sm py-2.5 px-6">Save</button>
      </div>
    </SettingsSection>
  );
}
