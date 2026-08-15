import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import AboutSettings from '@/components/settings/AboutSettings';

export const metadata: Metadata = {
  title: 'About',
  robots: { index: false, follow: false },
};

export default function AboutSettingsPage() {
  return (
    <SettingsLayout current="about">
      <AboutSettings />
    </SettingsLayout>
  );
}
