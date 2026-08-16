import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import LegalSettings from '@/components/settings/LegalSettings';

export const metadata: Metadata = {
  title: 'Legal',
  robots: { index: false, follow: false },
};

export default function LegalPage() {
  return (
    <SettingsLayout current="legal">
      <LegalSettings />
    </SettingsLayout>
  );
}
