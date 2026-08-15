'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { SITE, TAGLINES } from '@/lib/constants';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

export default function LocalizedHome() {
  const { locale, t } = useI18n();

  return (
    <>
      <LocalizedHeader />
      <LocalizedHero />
      <LocalizedPromise />
      <LocalizedSteps />
      <LocalizedProof />
      <LocalizedFooter />
    </>
  );
}

function LocalizedHeader() {
  const { locale, t } = useI18n();
  return (
    <header className="border-b border-border-subtle">
      <div className="container-page flex items-center justify-between h-14 md:h-16">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="seal-stamp !w-8 !h-8 !text-sm">tm</span>
          <span className="font-display text-lg md:text-xl">{SITE.name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 body-sm">
          <Link href="/how-it-works" className="text-ink-muted hover:text-ink transition-colors">
            {t.nav.howItWorks}
          </Link>
          <Link href="/security" className="text-ink-muted hover:text-ink transition-colors">
            {t.nav.security}
          </Link>
          <Link href="/faq" className="text-ink-muted hover:text-ink transition-colors">
            {t.nav.faq}
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <Link href={`/${locale}/seal`} className="btn-primary !py-2 !px-4 md:!py-3 md:!px-6 !text-sm md:!text-base">
            {t.nav.seal}
          </Link>
        </div>
      </div>
    </header>
  );
}

function LocalizedHero() {
  const { locale, t } = useI18n();
  return (
    <section className="relative">
      <div className="container-page pt-14 pb-16 md:pt-32 md:pb-40">
        <div className="max-w-wide mx-auto text-center">
          <h1 className="display-xl text-balance mb-5 md:mb-8">{t.home.heroTitle}</h1>
          <p className="body-lg text-ink-muted max-w-reading mx-auto text-pretty mb-8 md:mb-12">
            {t.home.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link href={`/${locale}/seal`} className="btn-primary w-full sm:w-auto text-base">
              {t.home.sealCta}
            </Link>
            <Link href="/how-it-works" className="btn-link">
              {t.home.howLink}
            </Link>
          </div>
          <p className="mt-6 md:mt-8 body-sm text-ink-soft">{t.home.freeNote}</p>
        </div>
      </div>
      <div className="ink-rule mx-auto max-w-prose" />
    </section>
  );
}

function LocalizedPromise() {
  const { t } = useI18n();
  return (
    <section className="container-page py-32 sm:py-40">
      <div className="max-w-prose mx-auto text-center">
        <p className="mono mb-8">{t.home.promiseEyebrow}</p>
        <p className="display-sm text-balance mb-10">{t.home.promiseLine}</p>
        <p className="body-lg text-ink-muted">{t.home.promiseSub}</p>
      </div>
    </section>
  );
}

function LocalizedSteps() {
  const { t } = useI18n();
  const steps = [
    { n: '01', title: t.home.step1Title, body: t.home.step1Body },
    { n: '02', title: t.home.step2Title, body: t.home.step2Body },
    { n: '03', title: t.home.step3Title, body: t.home.step3Body },
  ];
  return (
    <section className="container-page py-32 sm:py-40">
      <div className="text-center mb-20">
        <p className="mono mb-6">{t.home.stepsEyebrow}</p>
        <h2 className="display-md text-balance max-w-prose mx-auto">{t.home.stepsTitle}</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((s) => (
          <div key={s.n} className="card-paper p-10">
            <span className="mono text-seal mb-6 block">{s.n}</span>
            <h3 className="heading-md mb-4">{s.title}</h3>
            <p className="body text-ink-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LocalizedProof() {
  const { t } = useI18n();
  return (
    <section className="container-page py-32 sm:py-40">
      <div className="max-w-prose mx-auto">
        <p className="mono mb-6">{t.home.proofEyebrow}</p>
        <h2 className="display-sm text-balance mb-8">{t.home.proofTitle}</h2>
        <p className="body-lg text-ink-muted mb-8">{t.home.proofBody1}</p>
        <p className="body-lg text-ink-muted mb-8">{t.home.proofBody2}</p>
      </div>
    </section>
  );
}

function LocalizedFooter() {
  const { locale, t } = useI18n();
  return (
    <footer className="border-t border-border-subtle mt-12">
      <div className="container-page py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <span className="seal-stamp w-9 h-9 text-base">tm</span>
            <span className="font-display text-xl">{SITE.name}</span>
          </Link>
          <p className="body-sm text-ink-muted">{t.home.footerTagline}</p>
          <LanguageSwitcher />
        </div>
        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="mono text-ink-soft">
            © {new Date().getFullYear()} {SITE.name} · {SITE.domain}
          </p>
          <p className="mono text-ink-soft">{TAGLINES.secondary}</p>
        </div>
      </div>
    </footer>
  );
}
