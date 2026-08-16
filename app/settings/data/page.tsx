import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import DataSettings from '@/components/settings/DataSettings';

export const metadata: Metadata = {
  title: 'Data & export',
  robots: { index: false, follow: false },
};

export default function DataPage() {
  return (
    <SettingsLayout current="data">
      <DataSettings />
    </SettingsLayout>
  );
}
