'use client';

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { getDictionary, type Dict, type Locale } from './i18n/dictionaries';

const I18nContext = createContext<{ locale: Locale; t: Dict } | undefined>(undefined);

interface Props {
  locale: Locale;
  children: ReactNode;
}

export function I18nProvider({ locale, children }: Props) {
  const value = useMemo(() => ({ locale, t: getDictionary(locale) }), [locale]);

  // Reflect the active locale on <html lang> (root layout sets a static default).
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): { locale: Locale; t: Dict } {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback outside a provider (root EN pages).
    return { locale: 'en', t: getDictionary('en') };
  }
  return ctx;
}

export { type Locale };
