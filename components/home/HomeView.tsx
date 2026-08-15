'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  listCapsulesAsync,
  estimateStorageUsed,
  type CapsuleListItem,
} from '@/lib/storage/capsules';
import { useI18n } from '@/lib/i18n';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import CountdownInline from '@/components/capsule/CountdownInline';

/**
 * Authenticated home page (/home). Only reachable when signed in — the
 * landing page (/) redirects here for authenticated users.
 */
export default function HomeView() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { locale, t } = useI18n();
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const [capsules, setCapsules] = useState<CapsuleListItem[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/');
      return;
    }
    listCapsulesAsync(user.id).then(setCapsules);
    estimateStorageUsed(user.id).then(setStorageUsed);
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="body text-ink-muted">{t.common.loading}</p>
      </main>
    );
  }

  if (!user) return null;

  const sealed = capsules.filter((c) => !c.openedAt && new Date(c.unlockAt) > new Date());
  const unlockable = capsules.filter((c) => !c.openedAt && new Date(c.unlockAt) <= new Date());

  const quickActions = [
    { href: `${prefix}/seal`, label: t.nav.seal, icon: '✉', desc: 'Write a letter to the future' },
    { href: `${prefix}/inbox`, label: t.nav.inbox, icon: '▤', desc: `${capsules.length} capsule${capsules.length === 1 ? '' : 's'}` },
    { href: `${prefix}/vault`, label: t.nav.vault, icon: '▣', desc: 'Your sealed media & files' },
    { href: `${prefix}/explore`, label: t.nav.explore, icon: '◎', desc: 'See what others sealed' },
  ];

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-wide mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <p className="mono text-xs md:text-base mb-1">{t.nav.home}</p>
            <h1 className="display-sm md:display-md">
              {t.inbox.hello}{user.email ? `, ${user.email.split('@')[0]}` : ''}.
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <button onClick={() => signOut()} className="btn-link text-sm">
              Sign out
            </button>
          </div>
        </div>

        {/* Quick actions — 2x2 on mobile, 4 across on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-8 md:mb-12">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="card-paper p-4 md:p-6 flex flex-col gap-2 hover:border-ink-muted transition-colors"
            >
              <span className="text-xl md:text-2xl">{a.icon}</span>
              <div>
                <p className="font-medium text-sm md:text-base">{a.label}</p>
                <p className="text-xs md:text-sm text-ink-muted mt-0.5">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Ready to open (if any) */}
        {unlockable.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="mono text-seal mb-3 md:mb-5">{t.inbox.ready}</h2>
            <div className="space-y-3">
              {unlockable.map((c) => (
                <Link
                  key={c.id}
                  href={`/capsule?id=${c.id}`}
                  className="card-paper p-4 md:p-6 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h3 className="heading-md truncate">{c.title}</h3>
                    <p className="mono text-xs text-ink-soft mt-1">
                      ready to open now
                    </p>
                  </div>
                  <span className="seal-stamp !w-9 !h-9 !text-sm">✓</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recently sealed */}
        {sealed.length > 0 && (
          <section className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-3 md:mb-5">
              <h2 className="mono text-ink-muted">{t.inbox.sealedSection}</h2>
              <Link href={`${prefix}/inbox`} className="btn-link text-sm">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              {sealed.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/capsule?id=${c.id}`}
                  className="card-paper p-4 md:p-6"
                >
                  <h3 className="heading-md truncate mb-1">{c.title}</h3>
                  <p className="mono text-xs text-ink-soft mb-3">
                    unlocks {new Date(c.unlockAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </p>
                  <CountdownInline to={new Date(c.unlockAt)} className="text-sm" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {capsules.length === 0 && (
          <section className="card-paper p-8 md:p-12 text-center">
            <span className="seal-stamp mx-auto mb-6 inline-flex">✉</span>
            <h2 className="display-sm mb-3">{t.inbox.emptyTitle}</h2>
            <p className="body text-ink-muted mb-6">{t.inbox.emptyBody}</p>
            <Link href={`${prefix}/seal`} className="btn-primary text-base">
              {t.inbox.sealFirst}
            </Link>
          </section>
        )}

        {/* Footer bar */}
        <div className="mt-12 md:mt-20 pt-6 border-t border-border-subtle flex items-center justify-between">
          <p className="mono text-ink-soft text-xs">tomorrowme</p>
          <p className="mono text-ink-soft text-xs">
            {storageUsed > 0 ? `${(storageUsed / 1024).toFixed(1)} KB stored` : ''}
          </p>
        </div>
      </div>
    </main>
  );
}
