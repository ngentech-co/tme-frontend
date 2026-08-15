/**
 * Site-wide constants. Single source of truth for branding, URLs, copy.
 */

/**
 * Site-wide constants. Single source of truth for branding, URLs, copy.
 */

// Domain cutover: default to the final production domain. Override during
// staging by setting NEXT_PUBLIC_SITE_URL (e.g. https://ure.one).
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tomorrowme.net'
).replace(/\/$/, '');

export const SITE = {
  name: 'tomorrowme',
  shortName: 'tm',
  domain: 'tomorrowme.net',
  tempDomain: 'ure.one',
  url: SITE_URL,
  finalUrl: 'https://tomorrowme.net',
  email: 'hello@tomorrowme.net',
  supportEmail: 'support@tomorrowme.net',
  twitter: '@tomorrowme',
  founded: '2026',
} as const;

export const TAGLINES = {
  primary: 'Say it now. Reveal it then.',
  secondary: 'Sealed by math. Opened by time.',
  tertiary: 'A letter that waits.',
} as const;

export const NAV = {
  primary: [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How it works' },
    { href: '/features', label: 'Features' },
    { href: '/security', label: 'Security' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
  ],
  app: [
    { href: '/seal', label: 'Seal a capsule' },
    { href: '/inbox', label: 'Inbox' },
    { href: '/explore', label: 'Explore' },
  ],
  footer: [
    { href: '/about', label: 'About' },
    { href: '/security', label: 'Security' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/contact', label: 'Contact' },
    { href: '/changelog', label: 'Changelog' },
    { href: '/roadmap', label: 'Roadmap' },
  ],
} as const;

export const TIERS = {
  anonymous: {
    id: 'anonymous',
    label: 'Anonymous',
    tagline: 'Just me. No trace.',
    privacyMeter: 3,
  },
  email: {
    id: 'email',
    label: 'Email',
    tagline: 'Connect. Share. Discover.',
    privacyMeter: 2,
    recommended: true,
  },
  passkey: {
    id: 'passkey',
    label: 'Passkey',
    tagline: 'Maximum privacy.',
    privacyMeter: 5,
  },
} as const;

export const TIMELOCK = {
  drandChain: 'default',
  drandInterval: 60_000,
  drandGenesis: 1_692_803_367_000,
  pollIntervalMs: 30_000,
} as const;

export const STORAGE = {
  recoveryKeyLocal: 'tm:recovery-key',
  draftPrefix: 'tm:draft:',
  inboxDrafts: 'tm:drafts',
  themeKey: 'tm:theme',
  tierKey: 'tm:tier',
  userIdKey: 'tm:user-id',
  onboardingComplete: 'tm:onboarded',
} as const;

export const LIMITS = {
  freeStorageMb: 5120,
  maxMediaPerCapsuleMb: 100,
  maxUnlockYears: 25,
  minUnlockSeconds: 60,
} as const;

export type TierId = keyof typeof TIERS;
