# tomorrowme

> Sealed by math. Opened by time.

A privacy-first web app where users seal digital messages, secrets, letters, and unreleased media to their future selves. Content is encrypted client-side and cryptographically time-locked using Drand threshold cryptography.

## Status

**Phase 0 — Foundation** ✅

- Next.js 14 (App Router, static export)
- Supabase + Cloudflare R2 (free tier)
- Drand time-lock via `lib/crypto/`
- BIP-39 recovery keys + bookmark URL handler (`/r`)
- SEO infrastructure (sitemap, robots, llms.txt, JSON-LD)
- Branded error pages
- Cream + seal-red palette, modern typography (Fraunces, Inter, JetBrains Mono)

**Phase 1 — Core Ritual** ✅

- Interactive 3-tier onboarding (anonymous / email / passkey)
- Recovery-key force-download gate (file / clipboard / bookmark URL)
- Capsule seal wizard (text + images + date + visibility)
- Sealed capsule view with live countdown + reveal ceremony
- Inbox dashboard + public share pages
- Full settings suite (13 sections)
- Marketing pages, 6 use-cases, 3 comparisons, blog + RSS

**Phase 2 — Auth Expansion** ✅

- Real WebAuthn passkeys (enroll, authenticate, verify ES256 assertions)
- Passkey manager (list / add / rename / remove with lockout warning)
- Full tier switcher with per-transition consequence modals
- Google Analytics 4 with consent mode v2 (denied by default; locked off for private tiers)
- TOTP two-factor authentication (Web Crypto, QR via `qrcode`)
- `/auth` page with passkey + email + anonymous sign-in

**Phase 3 — Media Expansion** ✅

- Chunked AES-GCM encryption for large media (1 MiB chunks, memory-safe)
- IndexedDB media vault (encrypted blobs never leave the device as plaintext)
- Audio uploads with canvas waveform rendering (Web Audio API)
- Video uploads with chunked encryption + decrypted playback
- File vault page (`/vault`)
- Media picker in seal wizard (images / audio / video / files)
- Encrypted media rendered after unlock

**Phase 4 — Collaborative + Stellar** ✅

- Collaborative capsules with k-of-n Shamir secret sharing
- Co-author invites (per-member wrapped shares + invite codes)
- Threshold unlock (opens only when enough members return)
- Stellar invisible layer: capsule hash anchoring + unlock receipts
- Soroban time-lock companion (round commitments)
- Settings → Legal: read-only Stellar anchor viewer + explorer links
- Reply to past self (from the reveal ceremony)
- Reactions on unlocked capsules (email tier)
- Collaborations page (`/inbox/collaborations`)

**Phase 5 — Discovery & Polish** ✅

- Explore page (`/explore`): public capsule gallery with search + topic filters
- Topics system: `/topics` index + 12 SEO topic hub pages
- Email-tier followers: follow/unfollow + follower counts + `/people` directory
- Comments on unlocked capsules (email tier)
- Educational cluster `/learn/*`: time-lock encryption, Drand, self-custody keys, history
- Comparison expansion: 4 new pages (LetterStream, Day One, encrypted-vs-traditional, free-vs-paid)
- SEO cross-linking pass (footer, sitemap, topic hubs)

See `plans.md` for the full master plan.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, `output: 'export'`) |
| Hosting | `ure.one` (temp) → `tomorrowme.net` |
| DB + Auth | Supabase (Postgres + RLS) |
| Object storage | Cloudflare R2 |
| Time-lock | Drand network (`api.drand.sh`) |
| Symmetric crypto | Web Crypto API · AES-256-GCM |
| Recovery | BIP-39 24-word mnemonic (`@scure/bip39`) |
| Anchoring (invisible) | Stellar (Phase 4) |
| Analytics | Google Analytics 4 (Phase 2) |

## Run locally

```bash
npm install
npm run dev
```

Build static export:

```bash
npm run build
# → out/
```

The exported site is fully static — drop `out/` on any CDN (Cloudflare Pages, ure.one, etc).

## Environment variables

Create `.env.local` (not committed):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_Drand_URL=https://api.drand.sh
NEXT_PUBLIC_GA_ID=G-XXXXXXX     # added in Phase 2
```

The site runs without Supabase in **offline mode** (recovery-key handler and seal demo both work locally).

## Project structure

```
app/
  layout.tsx          global metadata, fonts, providers
  page.tsx            landing page
  not-found.tsx       branded 404
  error.tsx           branded 500
  maintenance/        maintenance page
  r/                  recovery bookmark handler
  sitemap.ts          generated sitemap
  llms.txt/           llms.txt route
  globals.css         design tokens + tailwind
components/
  recovery/           recovery-key UI
lib/
  constants.ts        site + tier + storage constants
  supabase.ts         Supabase client (browser, RLS-enforced)
  database.types.ts   Postgres schema types
  seo.ts              JSON-LD schema builders
  recovery.ts         BIP-39 + bookmark URL helpers
  crypto/
    aes.ts            AES-256-GCM (Web Crypto)
    tlock.ts          Drand + time-lock primitives
    capsule.ts        high-level seal/unseal
public/
  favicon.svg
  logo.svg
  manifest.webmanifest
  robots.txt
  og/                 static OG image
plans.md              master plan (single source of truth)
```

## Cryptography

- **Symmetric:** AES-256-GCM, 12-byte IV, 256-bit key — via `crypto.subtle` (Web Crypto API).
- **Time-lock:** Drand BLS threshold encryption. The unlock round is computed from the chosen date and the Drand chain's genesis + period.
- **Recovery:** BIP-39 24-word mnemonic → PBKDF2 (210k iterations, SHA-256) → AES-256-GCM key for client-side key wrap.
- **Bookmark URL:** recovery key encoded in the URL fragment (`#rk=...`) which browsers never transmit to servers.

The current time-lock implementation uses an IBE-style seed derivation for Phase 0. The production swap-in is the official `@drand/tlock-js` library — same interface, BLS-paired decryption.

## License

TBD.
