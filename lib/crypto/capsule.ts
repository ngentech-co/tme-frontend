/**
 * High-level capsule seal / unseal pipeline.
 * Composes AES + Drand time-lock into a single API.
 */

import {
  generateAesKey,
  exportKey,
  importKey,
  encryptString,
  decryptString,
  packBlob,
  unpackBlob,
  type EncryptedBlob,
} from './aes';
import {
  roundForDate,
  sealKey,
  unsealKey,
  isUnlockReady,
  type TimeLockSeal,
} from './tlock';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

export interface CapsuleContent {
  text: string;
  images?: string[];
  audio?: string[];
  video?: string[];
  files?: string[];
}

export interface SealedCapsule {
  id: string;
  version: 1;
  title: string;
  ownerId: string;
  createdAt: string;
  unlockAt: string;
  drandRound: number;
  visibility: 'private' | 'unlisted' | 'public';
  shareSlug?: string;
  coverColor?: string;
  timeLock: TimeLockSeal;
  payload: {
    c: string;
    iv: string;
    meta: EncryptedBlob['meta'];
  };
  stellarAnchor?: {
    txHash: string;
    network: string;
    anchoredAt: string;
  };
}

export interface SealInput {
  title: string;
  text: string;
  ownerId: string;
  unlockAt: Date;
  visibility?: 'private' | 'unlisted' | 'public';
  shareSlug?: string;
  coverColor?: string;
  precomputedRound?: number;
}

export async function sealCapsule(input: SealInput): Promise<SealedCapsule> {
  const key = await generateAesKey();
  const round = input.precomputedRound ?? roundForDate(input.unlockAt);

  const blob = await encryptString(
    key,
    JSON.stringify({
      text: input.text,
      createdAt: new Date().toISOString(),
    })
  );

  const keyBytes = await exportKey(key);
  const timeLock = sealKey(keyBytes, round);

  const id = crypto.randomUUID();

  return {
    id,
    version: 1,
    title: input.title,
    ownerId: input.ownerId,
    createdAt: new Date().toISOString(),
    unlockAt: input.unlockAt.toISOString(),
    drandRound: round,
    visibility: input.visibility ?? 'private',
    shareSlug: input.shareSlug,
    coverColor: input.coverColor,
    timeLock,
    payload: packBlob(blob),
  };
}

export async function unsealCapsule(
  sealed: SealedCapsule,
  options: { force?: boolean } = {}
): Promise<{ text: string; openedAt: string }> {
  const unlockDate = new Date(sealed.unlockAt);
  if (!options.force && !isUnlockReady(unlockDate)) {
    throw new Error(
      `Capsule unlocks at ${unlockDate.toISOString()}. ` +
        `Time has not yet come.`
    );
  }

  const recoveredKeyBytes = await unsealKey(sealed.timeLock);
  const key = await importKey(recoveredKeyBytes);

  const blob = unpackBlob(sealed.payload);
  const plaintext = await decryptString(key, blob);

  const parsed = JSON.parse(plaintext) as CapsuleContent & {
    createdAt: string;
  };

  return {
    text: parsed.text,
    openedAt: new Date().toISOString(),
  };
}

/**
 * Compute a short, shareable slug from a capsule id.
 */
export function deriveShareSlug(capsuleId: string): string {
  const bytes = hexToBytes(
    bytesToHex(new TextEncoder().encode(capsuleId)).slice(0, 16)
  );
  return Array.from(bytes)
    .map((b) => b.toString(36))
    .join('')
    .slice(0, 12);
}
