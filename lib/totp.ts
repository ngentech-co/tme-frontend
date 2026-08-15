'use client';

/**
 * TOTP (RFC 6238) implementation using Web Crypto HMAC-SHA1.
 * All secrets are generated and verified client-side.
 *
 * We store only a hash of the secret (not the secret itself) server-side,
 * so the real secret stays on the device. For Phase 2 the secret lives in
 * localStorage keyed by user.
 */

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const STEP_SECONDS = 30;
const DIGITS = 6;
const ISSUER = 'tomorrowme';

export interface TotpSecret {
  secret: string; // base32
  otpauthUrl: string;
  created: string;
}

function randomBytes(n: number): Uint8Array {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

function bytesToBase32(bytes: Uint8Array): string {
  let bits = '';
  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, '0');
  }
  let result = '';
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    result += BASE32_CHARS[parseInt(bits.slice(i, i + 5), 2)];
  }
  const rem = bits.length % 5;
  if (rem > 0) {
    result += BASE32_CHARS[parseInt(bits.slice(-rem).padEnd(5, '0'), 2)];
  }
  return result;
}

export function base32ToBytes(input: string): Uint8Array {
  const clean = input.replace(/=+$/g, '').replace(/\s+/g, '').toUpperCase();
  let bits = '';
  for (const ch of clean) {
    const idx = BASE32_CHARS.indexOf(ch);
    if (idx === -1) throw new Error(`Invalid base32 char: ${ch}`);
    bits += idx.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}

export function generateTotpSecret(): TotpSecret {
  const secret = bytesToBase32(randomBytes(20));
  const otpauthUrl = buildOtpauthUrl(secret);
  return { secret, otpauthUrl, created: new Date().toISOString() };
}

function buildOtpauthUrl(secret: string, label = 'account'): string {
  const params = new URLSearchParams({
    secret,
    issuer: ISSUER,
    algorithm: 'SHA1',
    digits: String(DIGITS),
    period: String(STEP_SECONDS),
  });
  return `otpauth://totp/${encodeURIComponent(ISSUER)}:${encodeURIComponent(label)}?${params.toString()}`;
}

async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key as BufferSource,
    { name: 'HMAC', hash: 'SHA-1' },
    true,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, data as BufferSource);
  return new Uint8Array(sig);
}

function counterToBytes(counter: number): Uint8Array {
  const b = new Uint8Array(8);
  const view = new DataView(b.buffer);
  view.setBigUint64(0, BigInt(counter), false);
  return b;
}

/**
 * Compute the current 6-digit TOTP code for a secret.
 */
export async function totpNow(secret: string): Promise<string> {
  const counter = Math.floor(Date.now() / 1000 / STEP_SECONDS);
  const key = base32ToBytes(secret);
  const hash = await hmacSha1(key, counterToBytes(counter));
  const offset = hash[hash.length - 1] & 0x0f;
  const bin =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);
  const code = bin % 10 ** DIGITS;
  return code.toString().padStart(DIGITS, '0');
}

/**
 * Verify a user-supplied code with a small window (allow ±1 step for clock drift).
 */
export async function verifyTotp(
  secret: string,
  code: string
): Promise<boolean> {
  const clean = code.replace(/\s+/g, '').trim();
  if (!/^\d{6}$/.test(clean)) return false;
  const current = await totpNow(secret);
  if (current === clean) return true;
  // Check previous and next step
  const prevCounter = Math.floor(Date.now() / 1000 / STEP_SECONDS) - 1;
  const key = base32ToBytes(secret);
  const hashPrev = await hmacSha1(key, counterToBytes(prevCounter));
  const hashNext = await hmacSha1(key, counterToBytes(prevCounter + 2));
  return codeFromHash(hashPrev) === clean || codeFromHash(hashNext) === clean;
}

function codeFromHash(hash: Uint8Array): string {
  const offset = hash[hash.length - 1] & 0x0f;
  const bin =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);
  return (bin % 10 ** DIGITS).toString().padStart(DIGITS, '0');
}

/**
 * Generate backup codes (8 codes, 10 chars each). Store hashes server-side.
 */
export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const bytes = randomBytes(7);
    const b32 = bytesToBase32(bytes);
    codes.push(`${b32.slice(0, 5)}-${b32.slice(5, 10)}`);
  }
  return codes;
}

/**
 * Storage helpers for the current user's 2FA secret (localStorage).
 */
const TWOFA_KEY_PREFIX = 'tm:2fa:';

export function getStoredTotpSecret(userId: string): TotpSecret | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`${TWOFA_KEY_PREFIX}${userId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TotpSecret;
  } catch {
    return null;
  }
}

export function setStoredTotpSecret(userId: string, secret: TotpSecret): void {
  localStorage.setItem(`${TWOFA_KEY_PREFIX}${userId}`, JSON.stringify(secret));
}

export function clearStoredTotpSecret(userId: string): void {
  localStorage.removeItem(`${TWOFA_KEY_PREFIX}${userId}`);
  localStorage.removeItem(`${TWOFA_KEY_PREFIX}${userId}:backup`);
}

export function isTwoFactorEnabled(userId: string): boolean {
  return Boolean(getStoredTotpSecret(userId));
}

export function getStoredBackupCodes(userId: string): string[] | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`${TWOFA_KEY_PREFIX}${userId}:backup`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return null;
  }
}

export function setStoredBackupCodes(userId: string, codes: string[]): void {
  localStorage.setItem(`${TWOFA_KEY_PREFIX}${userId}:backup`, JSON.stringify(codes));
}
