'use client';

import { useEffect } from 'react';
import SettingsSection, { Field } from './SettingsSection';
import { useSettings } from '@/lib/use-settings';
import { useI18n } from '@/lib/i18n';

export default function AppearanceSettings() {
  const { settings: s, update } = useSettings();
  const { t } = useI18n();

  // Apply theme, reduced motion, and font size to the document.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const resolved =
      s.theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : s.theme;
    root.setAttribute('data-theme', resolved);
    root.style.colorScheme = resolved;
    root.style.fontSize =
      s.fontSize === 'large' ? '112.5%' : s.fontSize === 'small' ? '93.75%' : '100%';
  }, [s.theme, s.fontSize]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('reduce-motion', s.motion === 'always');
  }, [s.motion]);

  return (
    <SettingsSection
      title="Appearance"
      description="How tomorrowme looks on your device. Changes save automatically."
    >
      <Field label="Theme">
        <select
          value={s.theme}
          onChange={(e) => update({ theme: e.target.value as 'light' | 'dark' | 'sepia' | 'system' })}
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
          value={s.motion}
          onChange={(e) => update({ motion: e.target.value as 'auto' | 'always' | 'never' })}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="auto">Auto (respect system)</option>
          <option value="always">Always reduce</option>
          <option value="never">Never reduce</option>
        </select>
      </Field>

      <Field label="Font size">
        <select
          value={s.fontSize}
          onChange={(e) => update({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </Field>

      <Field label="Language">
        <select
          value={s.lang}
          onChange={(e) => update({ lang: e.target.value })}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </Field>

      <Field label="Density">
        <select
          value={s.density}
          onChange={(e) => update({ density: e.target.value as 'comfortable' | 'compact' })}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="comfortable">Comfortable</option>
          <option value="compact">Compact</option>
        </select>
      </Field>

      <p className="mono text-ink-soft mt-8">{t.common.save === 'Save' ? 'saved automatically' : 'guardado automáticamente'}</p>
    </SettingsSection>
  );
}
