import Link from 'next/link';
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
  howToSchema,
} from '@/lib/seo';
import { SITE, TAGLINES } from '@/lib/constants';

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

      <Header />
      <Hero />
      <Manifesto />
      <How />
      <Proof />
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="border-b border-border-subtle">
      <div className="container-page flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="seal-stamp w-9 h-9 text-base">tm</span>
          <span className="font-display text-xl">{SITE.name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 body-sm">
          <Link href="/how-it-works" className="text-ink-muted hover:text-ink transition-colors">
            How it works
          </Link>
          <Link href="/security" className="text-ink-muted hover:text-ink transition-colors">
            Security
          </Link>
          <Link href="/faq" className="text-ink-muted hover:text-ink transition-colors">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/explore" className="hidden sm:inline-block btn-link body-sm">
            Explore
          </Link>
          <Link href="/auth" className="hidden sm:inline-block btn-link body-sm">
            Sign in
          </Link>
          <Link href="/seal" className="btn-primary text-sm py-2.5 px-5">
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
      <div className="container-page pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="max-w-wide mx-auto text-center">
          <div className="flex justify-center mb-10">
            <span className="seal-stamp animate-seal-pulse">tm</span>
          </div>
          <h1 className="display-xl text-balance mb-8">
            {TAGLINES.primary}
          </h1>
          <p className="body-lg text-ink-muted max-w-reading mx-auto text-pretty mb-12">
            A private web app where you seal messages, secrets, letters, and
            unreleased media to your future self — guaranteed hidden until
            the exact date you choose. Encrypted in your browser by math,
            opened by time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/seal" className="btn-primary text-base">
              Seal your first capsule
            </Link>
            <Link href="/how-it-works" className="btn-link">
              See how the math works →
            </Link>
          </div>
          <p className="mt-8 body-sm text-ink-soft">
            Free. No tracking on private accounts. No one — not even us — can
            read your capsule early.
          </p>
        </div>
      </div>
      <div className="ink-rule mx-auto max-w-prose" />
    </section>
  );
}

function Manifesto() {
  return (
    <section className="container-page py-32 sm:py-40">
      <div className="max-w-prose mx-auto text-center">
        <p className="mono mb-8">a quiet promise</p>
        <p className="display-sm text-balance mb-10">
          Most messages die the moment they're sent. A letter sealed for
          the future is different. It waits. It remembers. It returns.
        </p>
        <p className="body-lg text-ink-muted">
          tomorrowme exists for those moments — a confession you'll thank
          yourself for; a song you'll release on its tenth birthday; a
          promise to the person you're becoming.
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
    <section className="container-page py-32 sm:py-40">
      <div className="text-center mb-20">
        <p className="mono mb-6">how it works</p>
        <h2 className="display-md text-balance max-w-prose mx-auto">
          Three quiet steps between you and a sealed future.
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((step) => (
          <div key={step.n} className="card-paper p-10">
            <span className="mono text-seal mb-6 block">{step.n}</span>
            <h3 className="heading-md mb-4">{step.title}</h3>
            <p className="body text-ink-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="container-page py-32 sm:py-40">
      <div className="max-w-wide mx-auto">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <p className="mono mb-6">the math</p>
            <h2 className="display-sm text-balance mb-8">
              Sealed by cryptography. Opened by time.
            </h2>
            <p className="body-lg text-ink-muted mb-8">
              When you seal a capsule, your browser generates a fresh
              AES-256 key and encrypts your content. That key is then
              sealed against a future round of the Drand network — a
              decentralized public randomness beacon run by sixteen
              organizations including Cloudflare and EPFL.
            </p>
            <p className="body-lg text-ink-muted mb-8">
              Nobody — not tomorrowme, not a server admin, not a subpoena —
              can decrypt your capsule before its unlock round. Even if our
              entire company disappears tonight, the sealed content is
              useless to anyone without the signature that will be
              published on the exact date you chose.
            </p>
            <Link href="/security" className="btn-link">
              Read the full security explainer →
            </Link>
          </div>
          <div className="card-paper p-10 lg:p-12">
            <p className="mono mb-6">at a glance</p>
            <dl className="space-y-6">
              <div>
                <dt className="body-sm text-ink-muted mb-1">Encryption</dt>
                <dd className="font-mono text-body">AES-256-GCM (Web Crypto)</dd>
              </div>
              <div className="border-t border-border-subtle pt-6">
                <dt className="body-sm text-ink-muted mb-1">Time-lock primitive</dt>
                <dd className="font-mono text-body">Drand BLS threshold</dd>
              </div>
              <div className="border-t border-border-subtle pt-6">
                <dt className="body-sm text-ink-muted mb-1">Server-side access</dt>
                <dd className="font-mono text-body">None. Stores ciphertext only.</dd>
              </div>
              <div className="border-t border-border-subtle pt-6">
                <dt className="body-sm text-ink-muted mb-1">Recovery</dt>
                <dd className="font-mono text-body">BIP-39 24 words · bookmark URL</dd>
              </div>
              <div className="border-t border-border-subtle pt-6">
                <dt className="body-sm text-ink-muted mb-1">Cost</dt>
                <dd className="font-mono text-body">Free. Forever (for the basic tier).</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-12">
      <div className="container-page py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <span className="seal-stamp w-9 h-9 text-base">tm</span>
              <span className="font-display text-xl">{SITE.name}</span>
            </Link>
            <p className="body-sm text-ink-muted">
              {TAGLINES.secondary}
            </p>
          </div>
          <div>
            <h4 className="mono mb-4">Product</h4>
            <ul className="space-y-3 body-sm">
              <li><Link href="/seal" className="text-ink-muted hover:text-ink">Seal a capsule</Link></li>
              <li><Link href="/explore" className="text-ink-muted hover:text-ink">Explore public capsules</Link></li>
              <li><Link href="/pricing" className="text-ink-muted hover:text-ink">Pricing</Link></li>
              <li><Link href="/changelog" className="text-ink-muted hover:text-ink">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mono mb-4">Trust</h4>
            <ul className="space-y-3 body-sm">
              <li><Link href="/security" className="text-ink-muted hover:text-ink">Security</Link></li>
              <li><Link href="/privacy" className="text-ink-muted hover:text-ink">Privacy</Link></li>
              <li><Link href="/terms" className="text-ink-muted hover:text-ink">Terms</Link></li>
              <li><Link href="/acceptable-use" className="text-ink-muted hover:text-ink">Acceptable use</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mono mb-4">Discover</h4>
            <ul className="space-y-3 body-sm">
              <li><Link href="/explore" className="text-ink-muted hover:text-ink">Explore</Link></li>
              <li><Link href="/topics" className="text-ink-muted hover:text-ink">Topics</Link></li>
              <li><Link href="/use-cases" className="text-ink-muted hover:text-ink">Use cases</Link></li>
              <li><Link href="/compare" className="text-ink-muted hover:text-ink">Compare</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mono mb-4">Learn</h4>
            <ul className="space-y-3 body-sm">
              <li><Link href="/how-it-works" className="text-ink-muted hover:text-ink">How it works</Link></li>
              <li><Link href="/learn/time-lock-encryption" className="text-ink-muted hover:text-ink">Time-lock encryption</Link></li>
              <li><Link href="/learn/drand-network" className="text-ink-muted hover:text-ink">The Drand network</Link></li>
              <li><Link href="/blog" className="text-ink-muted hover:text-ink">Blog</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="mono text-ink-soft">
            © {new Date().getFullYear()} {SITE.name} · {SITE.domain}
          </p>
          <p className="mono text-ink-soft">
            Built with care · sealed with math
          </p>
        </div>
      </div>
    </footer>
  );
}
