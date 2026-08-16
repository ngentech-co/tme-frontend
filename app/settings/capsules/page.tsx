import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import CapsulesSettings from '@/components/settings/CapsulesSettings';

export const metadata: Metadata = {
  title: 'Capsule defaults',
  robots: { index: false, follow: false },
};

export default function CapsulesPage() {
  return (
    <SettingsLayout current="capsules">
      <CapsulesSettings />
    </SettingsLayout>
  );
}
