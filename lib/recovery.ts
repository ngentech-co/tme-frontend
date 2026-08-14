import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex } from '@noble/hashes/utils';

/**
 * Recovery key: BIP-39 24-word mnemonic + a bookmark-URL friendly encoding.
 * The mnemonic itself is the master key. The bookmark URL encodes it in the
 * fragment (after `#`), which is never sent to the server.
 */

export function generateRecoveryKey(): string {
  return generateMnemonic(wordlist, 256);
}

export function validateRecoveryKey(mnemonic: string): boolean {
  return validateMnemonic(mnemonic.trim(), wordlist);
}

export function hashRecoveryKey(mnemonic: string): string {
  return bytesToHex(sha256(new TextEncoder().encode(mnemonic.trim())));
}

/**
 * Derive a deterministic user-id from a recovery key.
 * Used when an anonymous user re-enters via bookmark URL — they get the same
 * "account" without ever registering.
 */
export function userIdFromRecoveryKey(mnemonic: string): string {
  const hash = sha256(new TextEncoder().encode(mnemonic.trim() + ':tm:user-id:v1'));
  return 'anon_' + bytesToHex(hash).slice(0, 24);
}

/**
 * Build the bookmark URL. The fragment is never sent to the server.
 * Format: https://ure.one/r#rk=<urlencoded-mnemonic>&v=1
 */
export function buildBookmarkUrl(
  mnemonic: string,
  baseUrl: string = 'https://ure.one'
): string {
  const encoded = encodeURIComponent(mnemonic.trim());
  return `${baseUrl}/r#rk=${encoded}&v=1`;
}

/**
 * Parse a bookmark URL or fragment string into a recovery key.
 * Accepts:
 *   - Full URL: https://ure.one/r#rk=word+word+...&v=1
 *   - Fragment: rk=word+word+...&v=1
 *   - Raw mnemonic: word word word ...
 */
export function parseRecoveryKey(input: string): string | null {
  if (!input) return null;

  const trimmed = input.trim();

  // Try as full URL first
  let fragment = '';
  try {
    if (trimmed.startsWith('http')) {
      const url = new URL(trimmed);
      fragment = url.hash.replace(/^#/, '');
    } else if (trimmed.startsWith('#')) {
      fragment = trimmed.slice(1);
    } else if (trimmed.includes('rk=')) {
      fragment = trimmed;
    } else {
      // Treat as raw mnemonic
      return validateRecoveryKey(trimmed) ? trimmed : null;
    }
  } catch {
    return validateRecoveryKey(trimmed) ? trimmed : null;
  }

  if (!fragment) return null;

  const params = new URLSearchParams(fragment);
  const rk = params.get('rk');

  if (!rk) return null;

  const decoded = decodeURIComponent(rk).trim();
  return validateRecoveryKey(decoded) ? decoded : null;
}

/**
 * Derive a deterministic AES key from the recovery mnemonic.
 * Uses PBKDF2 to stretch the mnemonic into a usable symmetric key.
 */
export async function deriveKeyFromRecovery(
  mnemonic: string,
  salt: string = 'tm:capsule:v1',
  iterations: number = 210_000
): Promise<CryptoKey> {
  const seed = mnemonicToSeedSync(mnemonic.trim(), salt);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    seed.slice(0, 32) as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(salt) as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Format the mnemonic as 24 words in a 6×4 grid for display.
 */
export function formatMnemonicGrid(mnemonic: string): string[][] {
  const words = mnemonic.trim().split(/\s+/);
  const grid: string[][] = [];
  for (let i = 0; i < words.length; i += 6) {
    grid.push(words.slice(i, i + 6));
  }
  return grid;
}

/**
 * Download the mnemonic as a .txt file (one of three backup options).
 */
export function downloadMnemonicFile(mnemonic: string): void {
  if (typeof window === 'undefined') return;
  const body = `tomorrowme recovery key\n\nKEEP THIS FILE PRIVATE. Anyone with these 24 words can access your capsules.\n\n${mnemonic}\n\nGenerated: ${new Date().toISOString()}\n`;
  const blob = new Blob([body], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tomorrowme-recovery-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Trigger the browser's "Add to Bookmarks" dialog with the recovery URL pre-filled.
 * Modern browsers don't allow programmatic bookmark adds, so we copy the URL and
 * prompt the user to bookmark it manually.
 */
export async function bookmarkRecoveryUrl(url: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
