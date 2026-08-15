'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export type SettingsSection =
  | 'hub'
  | 'account'
  | 'profile'
  | 'capsules'
  | 'notifications'
  | 'security'
  | 'privacy'
  | 'blocking'
  | 'appearance'
  | 'billing'
  | 'integrations'
  | 'data'
  | 'legal'
  | 'about';

interface Section {
  id: SettingsSection;
  href: string;
  label: string;
  desc: string;
}

const SECTIONS: Section[] = [
  { id: 'account', href: '/inbox/settings/account', label: 'Account', desc: 'Tier, email, passkeys, recovery key.' },
  { id: 'profile', href: '/inbox/settings/profile', label: 'Profile', desc: 'Public profile and visibility defaults.' },
  { id: 'capsules', href: '/inbox/settings/capsules', label: 'Capsules', desc: 'Defaults for new capsules.' },
  { id: 'notifications', href: '/inbox/settings/notifications', label: 'Notifications', desc: 'Email + push, quiet hours, digests.' },
  { id: 'security', href: '/inbox/settings/security', label: 'Security', desc: '2FA, sessions, encryption, Stellar anchoring.' },
  { id: 'privacy', href: '/inbox/settings/privacy', label: 'Privacy', desc: 'Visibility, tracking, data sharing.' },
  { id: 'blocking', href: '/inbox/settings/blocking', label: 'Blocking', desc: 'Blocked users, muted tags, reports.' },
  { id: 'appearance', href: '/inbox/settings/appearance', label: 'Appearance', desc: 'Theme, motion, font, language.' },
  { id: 'billing', href: '/inbox/settings/billing', label: 'Billing', desc: 'Storage usage and quotas.' },
  { id: 'integrations', href: '/inbox/settings/integrations', label: 'Integrations', desc: 'Apps, webhooks, API tokens.' },
  { id: 'data', href: '/inbox/settings/data', label: 'Data', desc: 'Export and delete your data.' },
  { id: 'legal', href: '/inbox/settings/legal', label: 'Legal', desc: 'Agreements and proofs.' },
  { id: 'about', href: '/inbox/settings/about', label: 'About', desc: 'Version, credits, support.' },
];

interface Props {
  current: SettingsSection;
  children?: React.ReactNode;
}

export default function SettingsLayout({ current, children }: Props) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="body text-ink-muted">Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-reading text-center">
          <h1 className="display-md mb-6">Sign in to access settings.</h1>
          <Link href="/onboarding" className="btn-primary">
            Start onboarding
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-12">
      <div className="max-w-wide mx-auto">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
          {/* Desktop: sidebar nav. Mobile: compact horizontal scroll nav. */}
          <aside>
            <Link href="/inbox" className="mono text-ink-muted hover:text-ink mb-4 lg:mb-10 inline-block">
              ← inbox
            </Link>
            <p className="mono mb-4 lg:mb-6">settings</p>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 lg:space-y-1">
              {SECTIONS.map((s) => {
                const active = pathname === s.href || (s.id === 'hub' && pathname === '/inbox/settings');
                return (
                  <Link
                    key={s.id}
                    href={s.href}
                    className={`shrink-0 lg:shrink lg:block rounded-paper px-3 lg:px-4 py-2 lg:py-3 transition-colors ${
                      active
                        ? 'bg-seal/5 text-ink lg:border-l-2 border-seal'
                        : 'text-ink-muted hover:bg-cream-deep hover:text-ink'
                    }`}
                  >
                    <div className="body font-medium text-sm lg:text-base">{s.label}</div>
                    <div className="hidden lg:block body-sm text-ink-soft mt-0.5">{s.desc}</div>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section>
            {current === 'hub' ? (
              <div>
                <p className="mono mb-4">settings</p>
                <h1 className="display-md mb-6">Tune tomorrowme.</h1>
                <p className="body-lg text-ink-muted mb-10">
                  You're using a <strong>{user.tier}</strong> account. Pick a section
                  from the left to manage everything from tier switching to data export.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {SECTIONS.filter((s) => s.id !== 'hub').map((s) => (
                    <Link key={s.id} href={s.href} className="card-paper p-7 transition-colors">
                      <h3 className="heading-md mb-2">{s.label}</h3>
                      <p className="body-sm text-ink-muted">{s.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              children
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
