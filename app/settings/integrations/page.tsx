import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import IntegrationsSettings from '@/components/settings/IntegrationsSettings';

export const metadata: Metadata = {
  title: 'Integrations',
  robots: { index: false, follow: false },
};

export default function IntegrationsPage() {
  return (
    <SettingsLayout current="integrations">
      <IntegrationsSettings />
    </SettingsLayout>
  );
}
