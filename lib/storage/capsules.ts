'use client';

import { sealCapsule, unsealCapsule, deriveShareSlug, type SealedCapsule } from '@/lib/crypto/capsule';
import { STORAGE } from '@/lib/constants';

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

function writeCapsule(userId: string, capsule: StoredCapsule): void {
  // Update list
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
}

export interface SealCapsuleParams {
  userId: string;
  title: string;
  text: string;
  images?: Array<{ name: string; dataUrl: string }>;
  unlockAt: Date;
  visibility: 'private' | 'unlisted' | 'public';
  coverColor?: string;
}

export async function createCapsule(params: SealCapsuleParams): Promise<StoredCapsule> {
  const sealed = await sealCapsule({
    ownerId: params.userId,
    title: params.title,
    text: params.text,
    unlockAt: params.unlockAt,
    visibility: params.visibility,
    coverColor: params.coverColor,
    shareSlug: deriveShareSlug(crypto.randomUUID()),
  });

  // Compute total size (rough estimate for the demo)
  const size =
    new TextEncoder().encode(params.text).byteLength +
    (params.images?.reduce((sum, i) => sum + (i.dataUrl.length * 3) / 4, 0) ?? 0);

  const stored: StoredCapsule = {
    ...sealed,
    shareSlug: sealed.shareSlug ?? crypto.randomUUID().slice(0, 8),
    sizeBytes: Math.round(size),
  };
  writeCapsule(params.userId, stored);
  return stored;
}

export async function openCapsule(
  userId: string,
  capsuleId: string,
  options: { force?: boolean } = {}
): Promise<{ text: string; openedAt: string }> {
  const sealed = readCapsule(userId, capsuleId);
  if (!sealed) throw new Error('Capsule not found');

  const result = await unsealCapsule(sealed, options);

  // Mark as opened
  if (!sealed.openedAt) {
    sealed.openedAt = result.openedAt;
    writeCapsule(userId, sealed);
  }

  return result;
}

export function deleteCapsule(userId: string, capsuleId: string): void {
  if (typeof window === 'undefined') return;
  const list = listCapsules(userId).filter((c) => c.id !== capsuleId);
  localStorage.setItem(capsuleKey(userId), JSON.stringify(list));
  localStorage.removeItem(`${CAPSULES_KEY_PREFIX}${userId}:detail:${capsuleId}`);
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
}

/**
 * Storage usage estimate (bytes) for billing display.
 */
export function estimateStorageUsed(userId: string): number {
  if (typeof window === 'undefined') return 0;
  const list = listCapsules(userId);
  return list.reduce((sum, c) => sum + (c.sizeBytes ?? 0), 0);
}

export function storageQuotaBytes(): number {
  return 5 * 1024 * 1024 * 1024; // 5 GB free tier
}
