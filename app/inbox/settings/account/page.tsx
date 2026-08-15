import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import AccountSettings from '@/components/settings/AccountSettings';

export const metadata: Metadata = {
  title: 'Account settings',
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <SettingsLayout current="account">
      <AccountSettings />
    </SettingsLayout>
  );
}
