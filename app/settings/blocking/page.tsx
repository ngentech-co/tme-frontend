import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import BlockingSettings from '@/components/settings/BlockingSettings';

export const metadata: Metadata = {
  title: 'Blocking',
  robots: { index: false, follow: false },
};

export default function BlockingPage() {
  return (
    <SettingsLayout current="blocking">
      <BlockingSettings />
    </SettingsLayout>
  );
}
