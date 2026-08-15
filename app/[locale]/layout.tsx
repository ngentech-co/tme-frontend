import { notFound } from 'next/navigation';
import { I18nProvider } from '@/lib/i18n';
import { locales, type Locale } from '@/lib/i18n/dictionaries';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateStaticParamsForLocale() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();
  return <I18nProvider locale={locale}>{children}</I18nProvider>;
}
