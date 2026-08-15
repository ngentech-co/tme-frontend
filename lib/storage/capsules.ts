'use client';

import { sealCapsule, unsealCapsule, deriveShareSlug, type SealedCapsule, type UnsealResult } from '@/lib/crypto/capsule';
import { unsealKey } from '@/lib/crypto/tlock';
import { importKey } from '@/lib/crypto/aes';
import {
  generateMediaKey,
  exportMediaKey,
  importMediaKey,
  encryptMedia,
  decryptMedia,
  type MediaAssetMeta,
} from '@/lib/crypto/media';
import { putEncryptedMedia, getEncryptedMedia, deleteCapsuleMedia } from '@/lib/storage/media';
import { anchorCapsule, recordUnlockReceipt } from '@/lib/stellar/anchor';
import { STORAGE } from '@/lib/constants';
import { backendOnline } from '@/lib/backend';

const CAPSULES_KEY_PREFIX = 'tm:capsules:';

export interface CapsuleListItem {
  id: string;
  title: string;
  unlockAt: string;
  drandRound: number;
  visibility: 'private' | 'unlisted' | 'public';
  shareSlug: string;
  createdAt: string;
  openedAt?: string | null;
  sizeBytes: number;
  coverColor?: string;
}

export interface StoredCapsule extends SealedCapsule {
  shareSlug: string;
  sizeBytes: number;
  openedAt?: string | null;
}

function capsuleKey(userId: string): string {
  return `${CAPSULES_KEY_PREFIX}${userId}`;
}

/**
 * Read from the local cache. When online, hydrate the cache from Supabase
 * first (call syncCapsules) so cross-device changes are reflected.
 */
export function listCapsules(userId: string): CapsuleListItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(capsuleKey(userId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CapsuleListItem[];
    return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

/**
 * Online-aware list: hydrates the local cache from Supabase, returns merged.
 * Falls back to the local cache when offline.
 */
export async function listCapsulesAsync(userId: string): Promise<CapsuleListItem[]> {
  if (backendOnline()) {
    const { listCapsulesOnline } = await import('@/lib/storage/capsules-supabase');
    const remote = await listCapsulesOnline(userId);
    // Seed the local cache (union by id) for fast reads + offline.
    const local = listCapsules(userId);
    const byId = new Map<string, CapsuleListItem>();
    for (const c of remote) byId.set(c.id, c);
    for (const c of local) if (!byId.has(c.id)) byId.set(c.id, c);
    const merged = Array.from(byId.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    localStorage.setItem(capsuleKey(userId), JSON.stringify(merged));
    return merged;
  }
  return listCapsules(userId);
}

export function readCapsule(userId: string, id: string): StoredCapsule | null {
  if (typeof window === 'undefined') return null;
  const detail = localStorage.getItem(`${CAPSULES_KEY_PREFIX}${userId}:detail:${id}`);
  if (!detail) return null;
  try {
    return JSON.parse(detail) as StoredCapsule;
  } catch {
    return null;
  }
}

export async function readCapsuleAsync(userId: string, id: string): Promise<StoredCapsule | null> {
  if (backendOnline()) {
    const { readCapsuleOnline } = await import('@/lib/storage/capsules-supabase');
    const remote = await readCapsuleOnline(userId, id);
    if (remote) {
      // Cache the remote detail locally for offline reads.
      localStorage.setItem(`${CAPSULES_KEY_PREFIX}${userId}:detail:${id}`, JSON.stringify(remote));
      return remote;
    }
  }
  return readCapsule(userId, id);
}

/**
 * Write to local cache AND (when online) upsert to Supabase.
 */
export function writeCapsule(userId: string, capsule: StoredCapsule): void {
  // Update local cache first (sync, so UI never blocks).
  const list = listCapsules(userId);
  const item: CapsuleListItem = {
    id: capsule.id,
    title: capsule.title,
    unlockAt: capsule.unlockAt,
    drandRound: capsule.drandRound,
    visibility: capsule.visibility,
    shareSlug: capsule.shareSlug,
    createdAt: capsule.createdAt,
    openedAt: capsule.openedAt ?? null,
    sizeBytes: capsule.sizeBytes,
    coverColor: capsule.coverColor,
  };
  const next = list.filter((c) => c.id !== capsule.id).concat(item);
  localStorage.setItem(capsuleKey(userId), JSON.stringify(next));
  localStorage.setItem(
    `${CAPSULES_KEY_PREFIX}${userId}:detail:${capsule.id}`,
    JSON.stringify(capsule)
  );

  // Fire-and-forget Supabase sync.
  if (backendOnline()) {
    import('@/lib/storage/capsules-supabase').then(({ writeCapsuleOnline }) =>
      writeCapsuleOnline(capsule).catch(() => {})
    );
  }
}

export interface SealMediaInput {
  id: string;
  kind: MediaAssetMeta['kind'];
  name: string;
  mime: string;
  file: Blob;
}

export interface SealCapsuleParams {
  userId: string;
  title: string;
  text: string;
  images?: Array<{ name: string; dataUrl: string }>;
  media?: SealMediaInput[];
  unlockAt: Date;
  visibility: 'private' | 'unlisted' | 'public';
  coverColor?: string;
  onMediaProgress?: (assetId: string, progress: number) => void;
}

export async function createCapsule(params: SealCapsuleParams): Promise<StoredCapsule> {
  const capsuleId = crypto.randomUUID();
  const shareSlug = deriveShareSlug(capsuleId);

  // Generate a per-capsule media key.
  const mediaKey = await generateMediaKey();
  const mediaKeyB64 = b64FromBytes(await exportMediaKey(mediaKey));

  // Encrypt each media asset into the vault FIRST so the manifest is accurate.
  const mediaMeta: MediaAssetMeta[] = [];
  let mediaBytes = 0;

  if (params.media && params.media.length > 0) {
    for (const asset of params.media) {
      const encrypted = await encryptMedia(mediaKey, asset.file, {
        onProgress: (p) => params.onMediaProgress?.(asset.id, p),
      });
      await putMediaBlob(params.userId, capsuleId, asset.id, encrypted.encryptedBlob);
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

  // Legacy images (data URLs) — keep in the text payload for backward compat.
  const imageBytes =
    params.images?.reduce((sum, i) => sum + (i.dataUrl.length * 3) / 4, 0) ?? 0;

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
  });

  const size =
    new TextEncoder().encode(params.text).byteLength + Math.round(imageBytes + mediaBytes);

  const stored: StoredCapsule = {
    ...sealed,
    shareSlug,
    sizeBytes: Math.round(size),
  };
  writeCapsule(params.userId, stored);

  // Invisible Stellar anchoring (never blocks sealing).
  try {
    await anchorCapsule({
      userId: params.userId,
      capsuleId,
      payload: sealed.payload,
      drandRound: sealed.drandRound,
      unlockAt: params.unlockAt,
    });
  } catch {
    // anchoring is best-effort
  }

  try {
    const { backendLogAudit } = await import('@/lib/backend');
    await backendLogAudit(
      params.userId,
      'capsule.sealed',
      `${stored.title} (${capsuleId.slice(0, 8)})`
    );
  } catch {
    // best-effort
  }

  return stored;
}

export async function openCapsule(
  userId: string,
  capsuleId: string,
  options: { force?: boolean } = {}
): Promise<UnsealResult> {
  const sealed = readCapsule(userId, capsuleId);
  if (!sealed) throw new Error('Capsule not found');

  // Collaborative capsules require threshold shares before the payload opens.
  const { getCollabSeal, unsealCollaborative } = await import('@/lib/storage/collab');
  const collab = getCollabSeal(capsuleId);
  if (collab && !options.force) {
    // Recover the raw key to compare against reconstructed shares.
    const recoveredKeyBytes = await unsealKey(sealed.timeLock);
    const res = await unsealCollaborative({
      capsuleId,
      userId,
      aesKey: await importKey(recoveredKeyBytes),
      unlockAt: new Date(sealed.unlockAt),
    });
    if (!res.unlocked) {
      throw new Error(res.reason ?? 'Collaborative capsule could not be opened.');
    }
  }

  const result = await unsealCapsule(sealed, options);

  // Mark as opened
  if (!sealed.openedAt) {
    sealed.openedAt = result.openedAt;
    writeCapsule(userId, sealed);
    if (backendOnline()) {
      import('@/lib/storage/capsules-supabase').then(({ markOpenedOnline }) =>
        markOpenedOnline(capsuleId, result.openedAt).catch(() => {})
      );
    }
  }

  // Invisible Stellar unlock receipt (best-effort).
  try {
    await recordUnlockReceipt({
      userId,
      capsuleId,
      payload: sealed.payload,
      drandRound: sealed.drandRound,
      unlockAt: new Date(sealed.unlockAt),
    });
  } catch {
    // best-effort
  }

  try {
    const { backendLogAudit } = await import('@/lib/backend');
    await backendLogAudit(userId, 'capsule.opened', sealed.title);
  } catch {
    // best-effort
  }

  return result;
}

/**
 * Load a decrypted media asset as a Blob after unlock.
 * Requires the media key recovered by openCapsule.
 */
export async function loadMediaAsset(
  userId: string,
  capsuleId: string,
  asset: MediaAssetMeta,
  mediaKeyBytes: Uint8Array
): Promise<Blob> {
  const encrypted = await getMediaBlob(userId, capsuleId, asset.id);
  if (!encrypted) throw new Error('Media asset not found in vault');
  const key = await importMediaKey(mediaKeyBytes);
  return decryptMedia(key, encrypted, asset.mime);
}

export async function deleteCapsule(userId: string, capsuleId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const list = listCapsules(userId).filter((c) => c.id !== capsuleId);
  localStorage.setItem(capsuleKey(userId), JSON.stringify(list));
  localStorage.removeItem(`${CAPSULES_KEY_PREFIX}${userId}:detail:${capsuleId}`);
  // Remove media from the vault (fire-and-forget; never throws for UI).
  try {
    await deleteCapsuleMedia(userId, capsuleId);
  } catch {
    // ignore
  }
  // Online: delete the capsule row too.
  if (backendOnline()) {
    const { deleteCapsuleOnline } = await import('@/lib/storage/capsules-supabase');
    await deleteCapsuleOnline(capsuleId).catch(() => {});
  }
}

export function updateCapsuleVisibility(
  userId: string,
  capsuleId: string,
  visibility: 'private' | 'unlisted' | 'public'
): void {
  const sealed = readCapsule(userId, capsuleId);
  if (!sealed) return;
  sealed.visibility = visibility;
  writeCapsule(userId, sealed);
  // Online: sync visibility change.
  if (backendOnline()) {
    import('@/lib/storage/capsules-supabase').then(({ updateVisibilityOnline }) =>
      updateVisibilityOnline(capsuleId, visibility).catch(() => {})
    );
  }
}

/**
 * Storage usage estimate (bytes) for billing display.
 * Online: sums capsule size_bytes from Supabase + bucket usage.
 * Offline: local capsule sizes + IndexedDB media.
 */
export async function estimateStorageUsed(userId: string): Promise<number> {
  if (typeof window === 'undefined') return 0;
  if (backendOnline()) {
    const { storageUsedOnline } = await import('@/lib/storage/capsules-supabase');
    let total = await storageUsedOnline(userId);
    try {
      const { estimateMediaStorageUsed } = await import('@/lib/storage/media');
      total += await estimateMediaStorageUsed(userId);
    } catch {
      // ignore
    }
    return total;
  }
  const list = listCapsules(userId);
  let total = list.reduce((sum, c) => sum + (c.sizeBytes ?? 0), 0);
  try {
    const { estimateMediaStorageUsed } = await import('@/lib/storage/media');
    total += await estimateMediaStorageUsed(userId);
  } catch {
    // vault unavailable
  }
  return total;
}

export function storageQuotaBytes(): number {
  return 5 * 1024 * 1024 * 1024; // 5 GB free tier
}

// --- media vault helpers ---

async function putMediaBlob(
  userId: string,
  capsuleId: string,
  assetId: string,
  blob: Blob
): Promise<void> {
  await putEncryptedMedia(userId, capsuleId, assetId, blob);
}

async function getMediaBlob(
  userId: string,
  capsuleId: string,
  assetId: string
): Promise<Blob | null> {
  return getEncryptedMedia(userId, capsuleId, assetId);
}

function b64FromBytes(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
