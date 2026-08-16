import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import PrivacySettings from '@/components/settings/PrivacySettings';

export const metadata: Metadata = {
  title: 'Privacy settings',
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <SettingsLayout current="privacy">
      <PrivacySettings />
    </SettingsLayout>
  );
}
