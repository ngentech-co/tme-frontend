import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import AppearanceSettings from '@/components/settings/AppearanceSettings';

export const metadata: Metadata = {
  title: 'Appearance',
  robots: { index: false, follow: false },
};

export default function AppearancePage() {
  return (
    <SettingsLayout current="appearance">
      <AppearanceSettings />
    </SettingsLayout>
  );
}
