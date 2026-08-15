import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import NotificationsSettings from '@/components/settings/NotificationsSettings';

export const metadata: Metadata = {
  title: 'Notification settings',
  robots: { index: false, follow: false },
};

export default function NotificationsPage() {
  return (
    <SettingsLayout current="notifications">
      <NotificationsSettings />
    </SettingsLayout>
  );
}
