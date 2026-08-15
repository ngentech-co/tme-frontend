import Link from 'next/link';
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
  howToSchema,
} from '@/lib/seo';
import { SITE, TAGLINES } from '@/lib/constants';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import LandingGate from '@/components/layout/LandingGate';

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd
        data={howToSchema([
          {
            name: 'Write or upload',
            text: 'Compose a letter, drop a song, attach a photo. Anything you want future-you to find.',
          },
          {
            name: 'Pick the date',
            text: 'Choose when it opens. Tomorrow, next year, in a decade.',
          },
          {
            name: 'Seal it',
            text: 'We encrypt it in your browser with math. Not even we can read it. The exact unlock moment releases the key.',
          },
        ])}
      />

      {/* Landing is for unauthenticated users only; signed-in users go to /home. */}
      <LandingGate>
        <Header />
        <Hero />
        {/* Desktop-only: manifesto + proof (more structure on desktop) */}
        <Manifesto />
        <How />
        <Proof />
        <Footer />
      </LandingGate>
    </>
  );
}

function Footer() {
  const links = {
    Product: [
      { href: '/seal', label: 'Seal a capsule' },
      { href: '/explore', label: 'Explore' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/premium', label: 'Premium' },
    ],
    Trust: [
      { href: '/security', label: 'Security' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
    Learn: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/learn/time-lock-encryption', label: 'Time-lock encryption' },
      { href: '/topics', label: 'Topics' },
      { href: '/blog', label: 'Blog' },
    ],
  };

  return (
    <footer className="border-t border-border-subtle mt-8 md:mt-12">
      <div className="container-page py-10 md:py-16">
        {/* Mobile: brand + tagline only (less structure). Desktop: link columns. */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-1/3">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="seal-stamp !w-8 !h-8 !text-sm">tm</span>
              <span className="font-display text-xl">{SITE.name}</span>
            </Link>
            <p className="body-sm text-ink-muted">{TAGLINES.secondary}</p>
          </div>
          <div className="hidden md:grid md:grid-cols-3 md:flex-1 gap-8">
            {Object.entries(links).map(([col, items]) => (
              <div key={col}>
                <h4 className="mono mb-4">{col}</h4>
                <ul className="space-y-3 body-sm">
                  {items.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-ink-muted hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border-subtle mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="mono text-ink-soft text-xs">
            © {new Date().getFullYear()} {SITE.name} · {SITE.domain}
          </p>
          <p className="mono text-ink-soft text-xs">
            Built with care · sealed with math
          </p>
        </div>
      </div>
    </footer>
  );
}

function Header() {
  return (
    <header className="border-b border-border-subtle">
      <div className="container-page flex items-center justify-between h-14 md:h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="seal-stamp !w-8 !h-8 !text-sm">tm</span>
          <span className="font-display text-lg md:text-xl">{SITE.name}</span>
        </Link>

        {/* Desktop nav (hidden on mobile — mobile uses bottom tab bar) */}
        <nav className="hidden md:flex items-center gap-7 body-sm">
          <Link href="/how-it-works" className="text-ink-muted hover:text-ink transition-colors">
            How it works
          </Link>
          <Link href="/topics" className="text-ink-muted hover:text-ink transition-colors">
            Topics
          </Link>
          <Link href="/security" className="text-ink-muted hover:text-ink transition-colors">
            Security
          </Link>
          <Link href="/faq" className="text-ink-muted hover:text-ink transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <Link href="/auth" className="hidden md:inline-flex btn-link body-sm">
            Sign in
          </Link>
          <Link href="/seal" className="btn-primary !py-2 !px-4 md:!py-3 md:!px-6 !text-sm md:!text-base">
            Seal a capsule
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="container-page pt-14 pb-16 md:pt-32 md:pb-40">
        <div className="max-w-wide mx-auto text-center">
          <h1 className="display-xl text-balance mb-5 md:mb-8">{TAGLINES.primary}</h1>

          <p className="body-lg text-ink-muted max-w-reading mx-auto text-pretty mb-8 md:mb-12">
            Seal messages, secrets, letters, and unreleased media to your future
            self — hidden until the exact date you choose. Encrypted in your
            browser by math, opened by time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link href="/seal" className="btn-primary w-full sm:w-auto text-base">
              Seal your first capsule
            </Link>
            <Link href="/how-it-works" className="btn-link">
              See how the math works →
            </Link>
          </div>

          <p className="mt-6 md:mt-8 body-sm text-ink-soft">
            Free. No tracking on private accounts. No one — not even us — can read
            your capsule early.
          </p>

          {/* Mobile-only: compact 3-step strip (less content than desktop) */}
          <div className="md:hidden mt-10 grid grid-cols-3 gap-2">
            {['Write', 'Pick a date', 'Seal'].map((s, i) => (
              <div key={s} className="card-paper px-2 py-3">
                <p className="mono !text-xs text-seal">{`0${i + 1}`}</p>
                <p className="text-sm font-medium mt-1">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ink-rule mx-auto max-w-prose" />
    </section>
  );
}

function Manifesto() {
  return (
    <section className="hidden md:block container-page py-32 sm:py-40">
      <div className="max-w-prose mx-auto text-center">
        <p className="mono mb-8">a quiet promise</p>
        <p className="display-sm text-balance mb-10">
          Most messages die the moment they're sent. A letter sealed for the
          future is different. It waits. It remembers. It returns.
        </p>
        <p className="body-lg text-ink-muted">
          tomorrowme exists for those moments — a confession you'll thank
          yourself for; a song you'll release on its tenth birthday; a promise to
          the person you're becoming.
        </p>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    {
      n: '01',
      title: 'Write or upload',
      body: 'Compose a letter, drop a song, attach a photo. Anything you want future-you to find.',
    },
    {
      n: '02',
      title: 'Pick the date',
      body: 'Choose when it opens. Tomorrow, next year, in a decade. The exact moment is the moment.',
    },
    {
      n: '03',
      title: 'Seal it',
      body: 'We encrypt it in your browser with math. Not even we can read it. The unlock moment releases the key.',
    },
  ];

  return (
    <section className="container-page py-16 md:py-32">
      <div className="text-center mb-8 md:mb-20">
        <p className="mono mb-4 md:mb-6">how it works</p>
        <h2 className="display-sm md:display-md text-balance max-w-prose mx-auto">
          Three quiet steps between you and a sealed future.
        </h2>
      </div>

      {/* Mobile: stacked. Desktop: 3-column grid. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 lg:gap-12">
        {steps.map((step) => (
          <div key={step.n} className="card-paper p-5 md:p-10 flex md:block items-start gap-4">
            <span className="mono text-seal md:mb-6 md:block shrink-0">{step.n}</span>
            <div>
              <h3 className="heading-md mb-1 md:mb-4">{step.title}</h3>
              <p className="body text-ink-muted">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="hidden md:block container-page py-32 sm:py-40">
      <div className="max-w-wide mx-auto">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <p className="mono mb-6">the math</p>
            <h2 className="display-sm text-balance mb-8">
              Sealed by cryptography. Opened by time.
            </h2>
            <p className="body-lg text-ink-muted mb-8">
              When you seal a capsule, your browser generates a fresh AES-256 key
              and encrypts your content. That key is then sealed against a future
              round of the Drand network — a decentralized public randomness
              beacon run by sixteen organizations including Cloudflare and EPFL.
            </p>
            <p className="body-lg text-ink-muted mb-8">
              Nobody — not tomorrowme, not a server admin, not a subpoena — can
              decrypt your capsule before its unlock round.
            </p>
            <Link href="/security" className="btn-link">
              Read the full security explainer →
            </Link>
          </div>
          <div className="card-paper p-8 lg:p-12">
            <p className="mono mb-6">at a glance</p>
            <dl className="space-y-5">
              <Row label="Encryption" value="AES-256-GCM (Web Crypto)" />
              <Row label="Time-lock primitive" value="Drand BLS threshold" />
              <Row label="Server-side access" value="None. Stores ciphertext only." />
              <Row label="Recovery" value="BIP-39 24 words · bookmark URL" />
              <Row label="Cost" value="Free. Forever (for the basic tier)." />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border-subtle pt-5">
      <dt className="body-sm text-ink-muted mb-1">{label}</dt>
      <dd className="font-mono text-body">{value}</dd>
    </div>
  );
}
