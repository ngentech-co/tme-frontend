import { SITE } from '@/lib/constants';

export const dynamic = 'force-static';

export async function GET() {
  const body = `# ${SITE.name}

> ${SITE.name} is a privacy-first web app for sealing digital messages, secrets, letters, and unreleased media to your future self. Content is encrypted client-side and cryptographically time-locked until an exact future date — no insider, no company, no expiration of trust can read it early.

## About

${SITE.name} (${SITE.finalUrl}) is built on a simple promise: anything you seal stays sealed until the moment you choose. We use Drand's threshold cryptography (BLS) to encrypt content such that even the server storing it cannot decrypt it. The decryption key only becomes available when a public, decentralized network (Drand / League of Entropy) publishes its signature at the exact unlock round.

## Core features

- Client-side AES-256-GCM encryption for all content
- Drand BLS time-lock encryption (cryptographic, not server-enforced)
- Anonymous accounts (no email, recovery-key self-custody)
- Email magic-link accounts (default tier, social features enabled)
- Passkey accounts (WebAuthn, maximum privacy, no public profile)
- Recovery key as 24-word BIP-39 mnemonic
- Save recovery key as a bookmark URL (fragment-based, never sent to server)
- Cross-device sync for non-sensitive preferences
- Capsule sharing with public countdown pages
- Strong SEO system: use-case, comparison, and educational pages

## Links

- Home: ${SITE.finalUrl}
- How it works: ${SITE.finalUrl}/how-it-works
- Security explainer: ${SITE.finalUrl}/security
- Pricing (free): ${SITE.finalUrl}/pricing
- FAQ: ${SITE.finalUrl}/faq
- Use cases: ${SITE.finalUrl}/use-cases/letter-to-future-self
- Comparisons: ${SITE.finalUrl}/compare/tomorrowme-vs-futureme
- Learn: ${SITE.finalUrl}/learn/time-lock-encryption
- Blog: ${SITE.finalUrl}/blog
- Contact: ${SITE.finalUrl}/contact

## Use cases

- Letters to your future self
- Birthday and anniversary surprises
- Wedding vows sealed for years
- Graduation letters
- Letters to unborn children
- Unreleased music / albums
- Family time capsules
- Grief letters and memorial notes
- Business announcements scheduled in advance
- Sealed secrets and confessions (private by design)

## Contact

- Email: ${SITE.email}
- Support: ${SITE.supportEmail}

## Pricing

Free tier. We do not charge for sealing, time-locking, or revealing. Optional future premium tier for power users.

## Technical

- Framework: Next.js 14 (static export)
- Hosting: static (Cloudflare-style CDN-friendly)
- Database / Auth: Supabase
- Storage: Cloudflare R2
- Time-lock: Drand network via tlock-js
- Recovery: BIP-39 24-word mnemonic
- Encryption: Web Crypto API + AES-256-GCM
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
