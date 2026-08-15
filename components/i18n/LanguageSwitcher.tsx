'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/dictionaries';

const LABELS: Record<Locale, string> = { en: 'EN', es: 'ES' };

/**
 * Language switcher. Rewrites the current path's locale segment (or prepends
 * it) so the user stays on the same page in the new language.
 */
export default function LanguageSwitcher() {
  const pathname = usePathname();

  const switchTo = (target: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    // If the first segment is a locale, replace it.
    if (segments.length > 0 && (locales as readonly string[]).includes(segments[0])) {
      segments[0] = target;
    } else {
      segments.unshift(target);
    }
    return `/${segments.join('/')}`;
  };

  return (
    <nav className="flex items-center gap-1 rounded-full border border-border-subtle p-1" aria-label="Language">
      {locales.map((l) => {
        const active =
          pathname === `/${l}` ||
          pathname.startsWith(`/${l}/`) ||
          (l === 'en' && !(locales as readonly string[]).some((x) => pathname.startsWith(`/${x}/`)));
        return (
          <Link
            key={l}
            href={switchTo(l)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              active ? 'bg-seal text-cream' : 'text-ink-muted hover:text-ink'
            }`}
            aria-current={active ? 'true' : undefined}
          >
            {LABELS[l]}
          </Link>
        );
      })}
    </nav>
  );
}
