'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';

/**
 * Mobile-only bottom navigation bar (app-like tab bar).
 * Hidden on sm+ (md). Completely separate structure from the desktop header.
 */
export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user } = useAuth();

  const tabs = [
    { href: '/', label: 'Home', icon: '⌂', match: (p: string) => p === '/' || p === '/en' || p === '/es' },
    { href: '/seal', label: 'Seal', icon: '✉', match: (p: string) => p.includes('/seal') },
    { href: '/explore', label: 'Explore', icon: '◎', match: (p: string) => p.includes('/explore') || p.includes('/topics') },
    { href: user ? '/inbox' : '/auth', label: user ? 'Inbox' : 'Sign in', icon: user ? '▤' : '→', match: (p: string) => p.includes('/inbox') || p.includes('/auth') },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-border-subtle bg-paper"
      aria-label="Mobile navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const active = tab.match(pathname ?? '');
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? 'text-seal' : 'text-ink-muted'
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="text-[11px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
