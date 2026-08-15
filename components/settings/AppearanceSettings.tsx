'use client';

import { useState } from 'react';
import SettingsSection, { Field } from './SettingsSection';

export default function AppearanceSettings() {
  const [theme, setTheme] = useState('system');
  const [motion, setMotion] = useState('auto');
  const [fontSize, setFontSize] = useState('medium');
  const [lang, setLang] = useState('en');
  const [density, setDensity] = useState('comfortable');

  return (
    <SettingsSection
      title="Appearance"
      description="How tomorrowme looks on your device."
    >
      <Field label="Theme">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="light">Light (cream)</option>
          <option value="dark">Dark</option>
          <option value="sepia">Sepia</option>
          <option value="system">Match system</option>
        </select>
      </Field>

      <Field label="Reduced motion">
        <select
          value={motion}
          onChange={(e) => setMotion(e.target.value)}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="auto">Auto (respect system)</option>
          <option value="always">Always reduce</option>
          <option value="never">Never reduce</option>
        </select>
      </Field>

      <Field label="Font size">
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </Field>

      <Field label="Language">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="en">English</option>
        </select>
      </Field>

      <Field label="Density">
        <select
          value={density}
          onChange={(e) => setDensity(e.target.value)}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="comfortable">Comfortable</option>
          <option value="compact">Compact</option>
        </select>
      </Field>

      <div className="mt-10 flex justify-end">
        <button className="btn-primary text-sm py-2.5 px-6">Save</button>
      </div>
    </SettingsSection>
  );
}
