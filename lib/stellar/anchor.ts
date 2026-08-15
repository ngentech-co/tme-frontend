'use client';

/**
 * Stellar — invisible cryptographic layer.
 *
 * Per product decisions, Stellar NEVER appears in the auth surface or any
 * user-facing wallet UI. It operates only in the background to provide:
 *
 *   1. Tamper-proof anchoring of capsule seals (content hash + drand round
 *      recorded to the Stellar ledger).
 *   2. Verifiable unlock receipts (a hash recorded at reveal time).
 *   3. A Soroban-style time-lock companion (see soroban.ts).
 *
 * When no Stellar secret key is configured (offline/static-export demo), we
 * record anchors locally in "simulation" mode with a clearly flagged status.
 * The same interface drives real mainnet submission once credentials exist.
 */

import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

export type AnchorStatus = 'simulated' | 'pending' | 'on-chain' | 'revealed';

export interface StellarAnchor {
  id: string;
  capsuleId: string;
  userId: string;
  contentHash: string;
  drandRound: number;
  unlockAt: string;
  status: AnchorStatus;
  network: 'public' | 'testnet' | 'simulated';
  txHash?: string;
  ledgerSeq?: number;
  createdAt: string;
  revealedAt?: string;
}

const ANCHOR_KEY = 'tm:stellar:anchors';
const STELLAR_SECRET_KEY = 'tm:stellar:secret';

/**
 * Compute the tamper-proof content hash for a sealed capsule.
 * Deterministic from the sealed payload (ciphertext + time-lock), so any
 * change to the capsule invalidates the anchor.
 */
export function capsuleContentHash(payload: {
  c: string;
  iv: string;
}): string {
  const input = `tm:v1:${payload.c}:${payload.iv}`;
  return bytesToHex(sha256(new TextEncoder().encode(input)));
}

export function hashCapsuleMeta(
  capsuleId: string,
  contentHash: string,
  drandRound: number
): string {
  const input = `tm:anchor:v1:${capsuleId}:${contentHash}:${drandRound}`;
  return bytesToHex(sha256(new TextEncoder().encode(input)));
}

export function getStellarSecret(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STELLAR_SECRET_KEY);
}

export function setStellarSecret(secret: string): void {
  localStorage.setItem(STELLAR_SECRET_KEY, secret);
}

export function clearStellarSecret(): void {
  localStorage.removeItem(STELLAR_SECRET_KEY);
}

export function isStellarConfigured(): boolean {
  return Boolean(getStellarSecret());
}

function listAnchors(): StellarAnchor[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(ANCHOR_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StellarAnchor[];
  } catch {
    return [];
  }
}

function saveAnchors(anchors: StellarAnchor[]): void {
  localStorage.setItem(ANCHOR_KEY, JSON.stringify(anchors));
}

export function listAnchorsForUser(userId: string): StellarAnchor[] {
  return listAnchors()
    .filter((a) => a.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listAnchorsForCapsule(userId: string, capsuleId: string): StellarAnchor[] {
  return listAnchorsForUser(userId).filter((a) => a.capsuleId === capsuleId);
}

export function getAnchor(userId: string, anchorId: string): StellarAnchor | null {
  return listAnchors().find((a) => a.id === anchorId && a.userId === userId) ?? null;
}

/**
 * Anchor a sealed capsule. If a Stellar secret is configured, this submits a
 * real memo transaction to the network; otherwise it records a simulated
 * anchor. Never throws for UI — failures degrade to 'simulated'.
 */
export async function anchorCapsule(opts: {
  userId: string;
  capsuleId: string;
  payload: { c: string; iv: string };
  drandRound: number;
  unlockAt: Date;
  reveal?: boolean;
}): Promise<StellarAnchor> {
  const contentHash = capsuleContentHash(opts.payload);
  const metaHash = hashCapsuleMeta(opts.capsuleId, contentHash, opts.drandRound);

  const existing = listAnchors().find(
    (a) =>
      a.userId === opts.userId &&
      a.capsuleId === opts.capsuleId &&
      a.status !== 'revealed'
  );

  let anchor: StellarAnchor;
  if (existing) {
    anchor = existing;
    if (opts.reveal) {
      anchor.revealedAt = new Date().toISOString();
      anchor.status = 'on-chain';
    }
  } else {
    anchor = {
      id: crypto.randomUUID(),
      capsuleId: opts.capsuleId,
      userId: opts.userId,
      contentHash,
      drandRound: opts.drandRound,
      unlockAt: opts.unlockAt.toISOString(),
      status: opts.reveal ? 'on-chain' : 'simulated',
      network: 'simulated',
      createdAt: new Date().toISOString(),
      revealedAt: opts.reveal ? new Date().toISOString() : undefined,
    };
  }

  // If a real secret is present, attempt mainnet submission (invisible).
  if (isStellarConfigured()) {
    try {
      const { submitAnchorMemo } = await import('./stellar-sdk');
      const res = await submitAnchorMemo(metaHash, Boolean(opts.reveal));
      if (res.ok) {
        anchor.status = 'on-chain';
        anchor.network = 'public';
        anchor.txHash = res.txHash;
        anchor.ledgerSeq = res.ledgerSeq;
      }
    } catch {
      // keep simulated
    }
  }

  const anchors = listAnchors().filter((a) => a.id !== anchor.id);
  anchors.push(anchor);
  saveAnchors(anchors);
  return anchor;
}

/**
 * Record an unlock (reveal) receipt for a capsule.
 */
export async function recordUnlockReceipt(opts: {
  userId: string;
  capsuleId: string;
  payload: { c: string; iv: string };
  drandRound: number;
  unlockAt: Date;
}): Promise<StellarAnchor> {
  return anchorCapsule({ ...opts, reveal: true });
}

/**
 * Verify an anchor: recompute the content hash and confirm it matches the
 * stored record. On-chain anchors additionally carry a txHash for external
 * verification on Stellar Expert.
 */
export function verifyAnchor(anchor: StellarAnchor, payload: {
  c: string;
  iv: string;
}): { valid: boolean; contentHash: string; expected: string } {
  const contentHash = capsuleContentHash(payload);
  return {
    valid: contentHash === anchor.contentHash,
    contentHash,
    expected: anchor.contentHash,
  };
}

/**
 * Public Stellar Expert URL for an anchor (invisible feature, surfaced only
 * in Settings → Legal as a read-only viewer).
 */
export function anchorExplorerUrl(anchor: StellarAnchor): string | null {
  if (anchor.network === 'simulated') return null;
  return `https://stellar.expert/explorer/${anchor.network}/tx/${anchor.txHash}`;
}

export function formatLedgerSeq(anchor: StellarAnchor): string {
  return anchor.ledgerSeq ? `#${anchor.ledgerSeq}` : '—';
}
