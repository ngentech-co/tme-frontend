import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false, follow: false },
};

export default function SettingsHubPage() {
  return <SettingsLayout current="hub" />;
}
