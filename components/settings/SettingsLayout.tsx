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
  { id: 'account', href: '/settings/account', label: 'Account', desc: 'Tier, email, passkeys, recovery key.' },
  { id: 'profile', href: '/settings/profile', label: 'Profile', desc: 'Public profile and visibility defaults.' },
  { id: 'capsules', href: '/settings/capsules', label: 'Capsules', desc: 'Defaults for new capsules.' },
  { id: 'notifications', href: '/settings/notifications', label: 'Notifications', desc: 'Email + push, quiet hours, digests.' },
  { id: 'security', href: '/settings/security', label: 'Security', desc: '2FA, sessions, encryption, Stellar anchoring.' },
  { id: 'privacy', href: '/settings/privacy', label: 'Privacy', desc: 'Visibility, tracking, data sharing.' },
  { id: 'blocking', href: '/settings/blocking', label: 'Blocking', desc: 'Blocked users, muted tags, reports.' },
  { id: 'appearance', href: '/settings/appearance', label: 'Appearance', desc: 'Theme, motion, font, language.' },
  { id: 'billing', href: '/settings/billing', label: 'Billing', desc: 'Storage usage and quotas.' },
  { id: 'integrations', href: '/settings/integrations', label: 'Integrations', desc: 'Apps, webhooks, API tokens.' },
  { id: 'data', href: '/settings/data', label: 'Data', desc: 'Export and delete your data.' },
  { id: 'legal', href: '/settings/legal', label: 'Legal', desc: 'Agreements and proofs.' },
  { id: 'about', href: '/settings/about', label: 'About', desc: 'Version, credits, support.' },
];

interface Props {
  current: SettingsSection;
  children?: React.ReactNode;
}

export default function SettingsLayout({ current, children }: Props) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isHub = current === 'hub';

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

  // Mobile sub-page: compact back header + content (no sidebar).
  if (!isHub) {
    return (
      <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/settings" className="mono text-ink-muted hover:text-ink text-sm shrink-0">
              ← settings
            </Link>
          </div>
          {children}
        </div>
      </main>
    );
  }

  // Hub / desktop layout: sidebar (lg) + content.
  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-12">
      <div className="max-w-wide mx-auto">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
          {/* Desktop sidebar nav. Hidden on mobile (mobile uses the list below). */}
          <aside className="hidden lg:block">
            <Link href="/inbox" className="mono text-ink-muted hover:text-ink mb-10 inline-block">
              ← inbox
            </Link>
            <p className="mono mb-6">settings</p>
            <nav className="space-y-1">
              {SECTIONS.map((s) => {
                const active = pathname === s.href;
                return (
                  <Link
                    key={s.id}
                    href={s.href}
                    className={`block rounded-paper px-4 py-3 transition-colors ${
                      active
                        ? 'bg-seal/5 text-ink border-l-2 border-seal'
                        : 'text-ink-muted hover:bg-cream-deep hover:text-ink'
                    }`}
                  >
                    <div className="body font-medium">{s.label}</div>
                    <div className="body-sm text-ink-soft mt-0.5">{s.desc}</div>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section>
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <p className="mono">settings</p>
              <Link href="/inbox" className="mono text-ink-muted hover:text-ink text-sm">
                inbox →
              </Link>
            </div>
            <p className="hidden lg:block mono mb-4">settings</p>
            <h1 className="display-md mb-3 md:mb-6">Tune tomorrowme.</h1>
            <p className="body-lg text-ink-muted mb-6 md:mb-10">
              You're using a <strong>{user.tier}</strong> account. Pick a section to
              manage everything from tier switching to data export.
            </p>

            {/* Mobile: single-column stacked list. Desktop: 2-col grid. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {SECTIONS.map((s) => (
                <Link
                  key={s.id}
                  href={s.href}
                  className="card-paper p-4 md:p-6 flex items-center justify-between gap-3 hover:border-ink-muted transition-colors"
                >
                  <div>
                    <h3 className="heading-md mb-0.5 md:mb-1">{s.label}</h3>
                    <p className="body-sm text-ink-muted">{s.desc}</p>
                  </div>
                  <span className="text-ink-soft shrink-0">→</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
