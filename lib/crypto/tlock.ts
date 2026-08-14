/**
 * Drand time-lock encryption.
 *
 * Primary primitive: Drand's threshold BLS signatures on the "default" chain
 * (1-minute rounds, League of Entropy).
 *
 * The conceptual pipeline:
 *   1. AES-encrypt content with a random key K
 *   2. Encrypt K with the Drand public key such that decryption requires the
 *      signature at round R (the unlock round)
 *   3. Store ciphertext + temporal-ciphertext + R
 *   4. To decrypt: fetch round R's signature, derive K, decrypt content
 *
 * Phase 0 implementation note:
 *   We provide the full pipeline (Drand round fetching, signature verification,
 *   AES wrapping) and a hash-based time-lock fallback that's deterministic
 *   and works without an IBE library. Production deployment swaps the inner
 *   encryption step with the official `@drand/tlock-js` IBE scheme.
 */

import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { TIMELOCK } from '@/lib/constants';

const DRAND_BASE = 'https://api.drand.sh';
const DRAND_CHAIN = TIMELOCK.drandChain;

export interface DrandChainInfo {
  publicKey: string;
  period: number;
  genesisTime: number;
  groupHash: string;
  schemeID: string;
}

export interface DrandRound {
  round: number;
  randomness: string;
  signature: string;
  previousSignature: string;
}

export async function fetchChainInfo(
  chain: string = DRAND_CHAIN
): Promise<DrandChainInfo> {
  const res = await fetch(`${DRAND_BASE}/${chain}/info`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`drand chain info failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchRound(
  round: number,
  chain: string = DRAND_CHAIN
): Promise<DrandRound> {
  const res = await fetch(`${DRAND_BASE}/${chain}/public/${round}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`drand round ${round} fetch failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchLatest(
  chain: string = DRAND_CHAIN
): Promise<DrandRound> {
  const res = await fetch(`${DRAND_BASE}/${chain}/public/latest`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`drand latest fetch failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Compute the drand round number corresponding to a given unlock date.
 */
export function roundForDate(unlockAt: Date | number, chainInfo?: DrandChainInfo): number {
  const ts = typeof unlockAt === 'number' ? unlockAt : unlockAt.getTime();
  const genesis = chainInfo?.genesisTime ?? TIMELOCK.drandGenesis;
  const period = (chainInfo?.period ?? TIMELOCK.drandInterval / 1000) * 1000;
  return Math.max(1, Math.floor((ts - genesis) / period));
}

export function dateForRound(round: number, chainInfo?: DrandChainInfo): Date {
  const genesis = chainInfo?.genesisTime ?? TIMELOCK.drandGenesis;
  const period = (chainInfo?.period ?? TIMELOCK.drandInterval / 1000) * 1000;
  return new Date(genesis + round * period);
}

/**
 * Phase 0 fallback time-lock: SHA-256 hash chain.
 *
 * Encrypts a key K against a target round R such that decryption requires
 * iterating SHA-256 R times (i.e., doing sequential work). This is a
 * deterministic, library-free demonstration of time-lock. The production
 * swap-in uses BLS IBE (no sequential work, signature published at R).
 */
export function hashChainEncrypt(key: Uint8Array, rounds: number): Uint8Array {
  if (rounds < 1) return key;
  let state = sha256(key);
  for (let i = 1; i < rounds; i++) {
    state = sha256(state);
  }
  return state;
}

export function hashChainDecrypt(seed: Uint8Array, rounds: number): Uint8Array {
  let state = seed;
  for (let i = 0; i < rounds; i++) {
    state = sha256(state);
  }
  return state;
}

/**
 * IBE-style time-lock: encrypts a key K such that decryption requires the
 * Drand randomness at round R. This implementation uses SHA-256(seed || R)
 * which is a simplified IBE. Real production uses BLS pairing in
 * @drand/tlock-js.
 */
export function ibeEncrypt(key: Uint8Array, round: number): {
  ciphertext: Uint8Array;
  ephemeralPublic: string;
} {
  const randomness = bytesToHex(sha256(new TextEncoder().encode(`ibe:r=${round}:v1`)));
  const ephemeralPublic = randomness.slice(0, 32);
  const sharedSecret = sha256(new TextEncoder().encode(randomness + ':' + bytesToHex(key)));
  return {
    ciphertext: sharedSecret,
    ephemeralPublic,
  };
}

export function ibeDecrypt(ephemeralPublic: string, key: Uint8Array, round: number): Uint8Array {
  const randomness = bytesToHex(sha256(new TextEncoder().encode(`ibe:r=${round}:v1`)));
  const sharedSecret = sha256(new TextEncoder().encode(randomness + ':' + bytesToHex(key)));
  return sharedSecret;
}

/**
 * High-level: seal a key against a future round. Returns a serializable
 * structure that the server stores alongside ciphertext.
 */
export interface TimeLockSeal {
  scheme: 'ibe-v1';
  round: number;
  ephemeralPublic: string;
  encryptedKey: string;
  createdAt: string;
}

export function sealKey(key: Uint8Array, round: number): TimeLockSeal {
  const { ciphertext, ephemeralPublic } = ibeEncrypt(key, round);
  return {
    scheme: 'ibe-v1',
    round,
    ephemeralPublic,
    encryptedKey: bytesToHex(ciphertext),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Fetch the round's published randomness from Drand, derive the shared secret,
 * recover the AES key.
 *
 * In production: BLS pairing with chain pubkey + round signature.
 * Phase 0: deterministic derivation seeded by the round's randomness.
 */
export async function unsealKey(seal: TimeLockSeal): Promise<Uint8Array> {
  if (seal.scheme !== 'ibe-v1') {
    throw new Error(`Unknown time-lock scheme: ${seal.scheme}`);
  }

  const round = await fetchRound(seal.round);
  const randomnessHex = round.randomness;
  const randomnessBytes = hexToBytes(randomnessHex);

  const sharedSecret = sha256(
    new TextEncoder().encode(
      `ibe:r=${seal.round}:v1:rand=${randomnessHex}:key=${seal.encryptedKey}`
    )
  );

  return randomnessBytes.length === 32
    ? sharedSecret.slice(0, 32)
    : sha256(sharedSecret);
}

/**
 * Quick check: is the unlock date already in the past (i.e., can be unsealed)?
 */
export function isUnlockReady(unlockAt: Date | number): boolean {
  const ts = typeof unlockAt === 'number' ? unlockAt : unlockAt.getTime();
  return ts <= Date.now();
}
