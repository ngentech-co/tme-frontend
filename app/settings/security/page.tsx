import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import SecuritySettings from '@/components/settings/SecuritySettings';

export const metadata: Metadata = {
  title: 'Security settings',
  robots: { index: false, follow: false },
};

export default function SecurityPage() {
  return (
    <SettingsLayout current="security">
      <SecuritySettings />
    </SettingsLayout>
  );
}
