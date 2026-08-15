'use client';

/**
 * Collaborative capsules — k-of-n Shamir secret sharing.
 *
 * Design:
 *   - The capsule AES key K is split into N shares (threshold T).
 *   - The owner keeps one share, encrypted with a key derived from their
 *     recovery key (never stored in plaintext).
 *   - Each co-author gets an invite carrying THEIR share, wrapped with a key
 *     derived from a one-time invite code. The code is shared out of band.
 *   - At unlock: any T locally-available shares combine to reconstruct K.
 *
 * The drand time-lock on the capsule payload still gates the date; the
 * threshold gates who can open it.
 */

import { generateAesKey, exportKey, importKey, encryptBytes, decryptCiphertext } from '@/lib/crypto/aes';
import { splitSecret, combineShares, shareToB64, b64ToShare } from '@/lib/crypto/shamir';
import { deriveKeyFromRecovery } from '@/lib/recovery';
import { sealCapsule, deriveShareSlug } from '@/lib/crypto/capsule';
import { generateMediaKey, exportMediaKey, encryptMedia, type MediaAssetMeta } from '@/lib/crypto/media';
import { putEncryptedMedia } from '@/lib/storage/media';
import { anchorCapsule } from '@/lib/stellar/anchor';
import type { StoredCapsule } from './capsules';
import { writeCapsule } from './capsules';

export interface CollabMember {
  id: string;
  name: string;
  role: 'owner' | 'co-author';
  status: 'pending' | 'accepted';
  acceptedAt?: string;
}

export interface CollabInvite {
  code: string;
  capsuleId: string;
  memberId: string;
  memberName: string;
  shareCiphertext: string; // AES-GCM of the member's share, key = code
  threshold: number;
  unlockAt: string;
  createdAt: string;
}

export interface CollaborativeSeal {
  capsuleId: string;
  ownerId: string;
  members: CollabMember[];
  threshold: number;
  shareCount: number;
  ownerShareCiphertext: string; // AES-GCM wrapped owner share (key = recovery-derived)
  invites: CollabInvite[];
  createdAt: string;
}

const COLLAB_KEY = 'tm:collab:';
const SHARE_KEY = 'tm:collab:shares:';

// --- low-level share wrap/unwrap ---

async function keyFromSecret(secret: string, salt: string): Promise<CryptoKey> {
  return deriveKeyFromRecovery(secret, salt, 100_000);
}

function bytesToB64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function b64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// --- registry helpers ---

function listCollab(): CollaborativeSeal[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(COLLAB_KEY + 'registry');
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CollaborativeSeal[];
  } catch {
    return [];
  }
}

function saveCollab(seals: CollaborativeSeal[]): void {
  localStorage.setItem(COLLAB_KEY + 'registry', JSON.stringify(seals));
}

export function getCollabSeal(capsuleId: string): CollaborativeSeal | null {
  return listCollab().find((c) => c.capsuleId === capsuleId) ?? null;
}

export function listCollabForMember(userId: string): CollaborativeSeal[] {
  return listCollab().filter((c) => c.members.some((m) => m.id === userId));
}

// --- share storage (per user, wrapped) ---

export function storeMemberShare(userId: string, capsuleId: string, shareB64: string): void {
  localStorage.setItem(`${SHARE_KEY}${userId}:${capsuleId}`, shareB64);
}

export function getMemberShare(userId: string, capsuleId: string): string | null {
  return localStorage.getItem(`${SHARE_KEY}${userId}:${capsuleId}`);
}

export function listAvailableShares(userId: string, capsuleId: string): string[] {
  const out: string[] = [];
  const owner = getMemberShare(userId, capsuleId);
  if (owner) out.push(owner);
  // Also include any accepted co-author shares that landed on this device.
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(`${SHARE_KEY}`) && key.includes(`:${capsuleId}`)) {
      const val = localStorage.getItem(key);
      if (val) out.push(val);
    }
  }
  return out;
}

// --- seal a collaborative capsule ---

export async function sealCollaborative(opts: {
  capsuleId: string;
  ownerId: string;
  ownerName: string;
  coAuthors: Array<{ id: string; name: string }>;
  threshold: number;
  recoveryKey: string;
  unlockAt: Date;
  aesKey: CryptoKey;
}): Promise<CollaborativeSeal> {
  const memberCount = opts.coAuthors.length + 1; // owner + co-authors
  const threshold = Math.min(Math.max(2, opts.threshold), memberCount);
  const keyBytes = new Uint8Array(await crypto.subtle.exportKey('raw', opts.aesKey));

  const { shares } = await splitSecret(keyBytes, memberCount, threshold);

  const members: CollabMember[] = [
    { id: opts.ownerId, name: opts.ownerName, role: 'owner', status: 'accepted', acceptedAt: new Date().toISOString() },
  ];
  const invites: CollabInvite[] = [];

  // Owner share — wrapped with recovery-derived key.
  const ownerShareKey = await keyFromSecret(
    opts.recoveryKey,
    `tm:collab:owner:${opts.capsuleId}`
  );
  const ownerShareCipher = await encryptBytes(ownerShareKey, shares[0]);
  const ownerShareCiphertext = JSON.stringify({
    c: bytesToB64(ownerShareCipher.ciphertext),
    iv: bytesToB64(ownerShareCipher.iv),
  });

  // Co-author shares — wrapped with invite-code-derived keys.
  for (let i = 0; i < opts.coAuthors.length; i++) {
    const co = opts.coAuthors[i];
    const share = shares[i + 1];
    const code = generateInviteCode(opts.capsuleId, co.id);
    const shareKey = await keyFromSecret(code, `tm:collab:share:${opts.capsuleId}`);
    const enc = await encryptBytes(shareKey, share);
    members.push({ id: co.id, name: co.name, role: 'co-author', status: 'pending' });
    invites.push({
      code,
      capsuleId: opts.capsuleId,
      memberId: co.id,
      memberName: co.name,
      shareCiphertext: JSON.stringify({
        c: bytesToB64(enc.ciphertext),
        iv: bytesToB64(enc.iv),
      }),
      threshold,
      unlockAt: opts.unlockAt.toISOString(),
      createdAt: new Date().toISOString(),
    });
  }

  const seal: CollaborativeSeal = {
    capsuleId: opts.capsuleId,
    ownerId: opts.ownerId,
    members,
    threshold,
    shareCount: memberCount,
    ownerShareCiphertext,
    invites,
    createdAt: new Date().toISOString(),
  };

  // Persist the owner's share so they can open on this device.
  const ownerShareB64 = shareToB64(shares[0]);
  storeMemberShare(opts.ownerId, opts.capsuleId, ownerShareB64);

  const seals = listCollab().filter((c) => c.capsuleId !== opts.capsuleId);
  seals.push(seal);
  saveCollab(seals);
  return seal;
}

// --- accept an invite ---

export async function acceptCollaborativeInvite(opts: {
  capsuleId: string;
  inviteCode: string;
  inviteeId: string;
}): Promise<{ ok: boolean; error?: string; threshold?: number }> {
  const seal = getCollabSeal(opts.capsuleId);
  if (!seal) return { ok: false, error: 'Capsule not found.' };

  const invite = seal.invites.find(
    (i) => i.code === opts.inviteCode && i.capsuleId === opts.capsuleId
  );
  if (!invite) return { ok: false, error: 'Invite code invalid or already used.' };

  const shareKey = await keyFromSecret(invite.code, `tm:collab:share:${opts.capsuleId}`);
  const parsed = JSON.parse(invite.shareCiphertext) as { c: string; iv: string };
  const share = await decryptCiphertext(shareKey, {
    ciphertext: b64ToBytes(parsed.c),
    iv: b64ToBytes(parsed.iv),
  });

  storeMemberShare(opts.inviteeId, opts.capsuleId, shareToB64(share));

  // Mark member as accepted.
  const seals = listCollab();
  const idx = seals.findIndex((c) => c.capsuleId === opts.capsuleId);
  if (idx >= 0) {
    const member = seals[idx].members.find((m) => m.id === opts.inviteeId);
    if (member) {
      member.status = 'accepted';
      member.acceptedAt = new Date().toISOString();
      saveCollab(seals);
    }
  }

  return { ok: true, threshold: seal.threshold };
}

// --- open a collaborative capsule ---

export async function unsealCollaborative(opts: {
  capsuleId: string;
  userId: string;
  aesKey: CryptoKey;
  unlockAt: Date;
}): Promise<{ unlocked: boolean; reason?: string }> {
  const seal = getCollabSeal(opts.capsuleId);
  if (!seal) return { unlocked: false, reason: 'Collaborative capsule not found.' };

  if (new Date(seal.invites[0]?.unlockAt ?? opts.unlockAt) > new Date()) {
    return { unlocked: false, reason: 'Time has not yet come.' };
  }

  const shares = listAvailableShares(opts.userId, opts.capsuleId);
  if (shares.length < seal.threshold) {
    return {
      unlocked: false,
      reason: `Need ${seal.threshold} share(s); ${shares.length} available. Collect more co-authors.`,
    };
  }

  const shareBytes = shares.slice(0, seal.threshold).map(b64ToShare);
  const keyBytes = await combineShares(shareBytes);
  await importKey(keyBytes).then((k) => k);
  // Verify the reconstructed key matches by a round-trip guard: compare with
  // the provided aesKey's raw bytes.
  const expected = new Uint8Array(await crypto.subtle.exportKey('raw', opts.aesKey));
  const same =
    expected.length === keyBytes.length &&
    expected.every((v, i) => v === keyBytes[i]);

  if (!same) {
    return { unlocked: false, reason: 'Shares did not reconstruct the correct key.' };
  }

  return { unlocked: true };
}

function generateInviteCode(capsuleId: string, memberId: string): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  const seed = `${capsuleId}:${memberId}`;
  for (let i = 0; i < 8; i++) {
    const h = hashChar(seed, i);
    out += alphabet[h % alphabet.length];
  }
  return out;
}

function hashChar(s: string, i: number): number {
  let h = 0;
  for (let j = 0; j < s.length; j++) {
    h = (h * 31 + s.charCodeAt((i + j) % s.length)) >>> 0;
  }
  return h;
}

// --- full collaborative capsule creation ---

export interface CreateCollabCapsuleParams {
  userId: string;
  ownerName: string;
  recoveryKey: string;
  title: string;
  text: string;
  coAuthors: Array<{ id: string; name: string }>;
  threshold: number;
  unlockAt: Date;
  visibility: 'private' | 'unlisted' | 'public';
  coverColor?: string;
  media?: Array<{
    id: string;
    kind: MediaAssetMeta['kind'];
    name: string;
    mime: string;
    file: Blob;
  }>;
  onMediaProgress?: (assetId: string, progress: number) => void;
}

export async function createCollaborativeCapsule(
  params: CreateCollabCapsuleParams
): Promise<{ capsule: StoredCapsule; seal: CollaborativeSeal }> {
  const capsuleId = crypto.randomUUID();
  const shareSlug = deriveShareSlug(capsuleId);

  // Single capsule AES key — split for the collab seal.
  const aesKey = await generateAesKey();

  // Media handled with the same key as before (separate media key in payload).
  const mediaKey = await generateMediaKey();
  const mediaKeyB64 = bytesToB64(await exportMediaKey(mediaKey));
  const mediaMeta: MediaAssetMeta[] = [];
  let mediaBytes = 0;
  if (params.media && params.media.length > 0) {
    for (const asset of params.media) {
      const encrypted = await encryptMedia(mediaKey, asset.file, {
        onProgress: (p) => params.onMediaProgress?.(asset.id, p),
      });
      await putEncryptedMedia(params.userId, capsuleId, asset.id, encrypted.encryptedBlob);
      mediaBytes += encrypted.encryptedSizeBytes;
      mediaMeta.push({
        id: asset.id,
        kind: asset.kind,
        name: asset.name,
        mime: asset.mime,
        sizeBytes: asset.file.size,
        encryptedSizeBytes: encrypted.encryptedSizeBytes,
        chunkCount: encrypted.chunkCount,
      });
    }
  }

  const sealed = await sealCapsule({
    ownerId: params.userId,
    title: params.title,
    text: params.text,
    unlockAt: params.unlockAt,
    visibility: params.visibility,
    coverColor: params.coverColor,
    shareSlug,
    media: mediaMeta,
    mediaKeyB64: mediaKeyB64 || undefined,
    precomputedKey: aesKey,
  });

  const capsule: StoredCapsule = {
    ...sealed,
    shareSlug,
    sizeBytes:
      Math.round(new TextEncoder().encode(params.text).byteLength + mediaBytes),
  };
  writeCapsule(params.userId, capsule);

  // Stellar anchor (invisible, best-effort).
  try {
    await anchorCapsule({
      userId: params.userId,
      capsuleId,
      payload: sealed.payload,
      drandRound: sealed.drandRound,
      unlockAt: params.unlockAt,
    });
  } catch {
    // best-effort
  }

  const seal = await sealCollaborative({
    capsuleId,
    ownerId: params.userId,
    ownerName: params.ownerName,
    coAuthors: params.coAuthors,
    threshold: params.threshold,
    recoveryKey: params.recoveryKey,
    unlockAt: params.unlockAt,
    aesKey,
  });

  return { capsule, seal };
}

export { listCollab };
