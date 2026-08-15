import type { Metadata } from 'next';
import AcceptInvite from '@/components/collab/AcceptInvite';

export const metadata: Metadata = {
  title: 'Accept collaboration invite',
  description: 'Join a collaborative time capsule.',
  robots: { index: false, follow: false },
};

export default function AcceptInvitePage() {
  return (
    <main className="min-h-screen px-6 py-16 sm:py-24">
      <AcceptInvite />
    </main>
  );
}
