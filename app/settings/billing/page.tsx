import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import BillingSettings from '@/components/settings/BillingSettings';

export const metadata: Metadata = {
  title: 'Billing & storage',
  robots: { index: false, follow: false },
};

export default function BillingPage() {
  return (
    <SettingsLayout current="billing">
      <BillingSettings />
    </SettingsLayout>
  );
}
