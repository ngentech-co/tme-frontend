import type { Metadata } from 'next';
import SettingsLayout from '@/components/settings/SettingsLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';

export const metadata: Metadata = {
  title: 'Profile settings',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <SettingsLayout current="profile">
      <ProfileSettings />
    </SettingsLayout>
  );
}
