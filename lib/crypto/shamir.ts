'use client';

/**
 * Shamir Secret Sharing wrapper over shamir-secret-sharing.
 *
 * Splits a capsule's AES key into n shares with threshold k; any k shares
 * reconstruct the key. The library operates in GF(256) — each share is
 * secretLen + 1 bytes where byte[0] is the x-coordinate (index).
 */

import { split as sssSplit, combine as sssCombine } from 'shamir-secret-sharing';

export interface ShamirSplitResult {
  shares: Uint8Array[];
  threshold: number;
  shareCount: number;
}

/**
 * Split a secret into `shareCount` shares, `threshold` required to rebuild.
 */
export async function splitSecret(
  secret: Uint8Array,
  shareCount: number,
  threshold: number
): Promise<ShamirSplitResult> {
  const shares = await sssSplit(secret, shareCount, threshold);
  return { shares, threshold, shareCount };
}

/**
 * Combine shares (any order; x-coordinate is embedded) back into the secret.
 */
export async function combineShares(shares: Uint8Array[]): Promise<Uint8Array> {
  return sssCombine(shares);
}

/**
 * Base64 helpers for share storage.
 */
export function shareToB64(share: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < share.byteLength; i++) binary += String.fromCharCode(share[i]);
  return btoa(binary);
}

export function b64ToShare(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
