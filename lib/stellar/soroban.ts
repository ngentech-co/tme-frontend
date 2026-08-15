'use client';

/**
 * Soroban time-lock companion (invisible).
 *
 * A full Soroban smart contract (deployed to Stellar) would enforce the
 * unlock rule on-chain. This module provides the same *interface* and a
 * deterministic, client-side companion proof that runs invisibly alongside
 * the Drand time-lock — a "sealed round" commitment:
 *
 *   sealedRound = H( capsuleId || contentHash || unlockRound )
 *
 * The commitment is recorded in the anchor; at unlock we recompute it and
 * require the drand round to be reached. This gives a Soroban-shaped audit
 * trail that can later be replaced by a real contract without changing the
 * capsule format.
 */

import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex } from '@noble/hashes/utils';

export interface SorobanSeal {
  scheme: 'soroban-companion-v1';
  capsuleId: string;
  contentHash: string;
  unlockRound: number;
  commitment: string;
  createdAt: string;
}

/**
 * Compute the deterministic round commitment.
 */
export function sorobanCommitment(
  capsuleId: string,
  contentHash: string,
  unlockRound: number
): string {
  const input = `tm:soroban:v1:${capsuleId}:${contentHash}:${unlockRound}`;
  return bytesToHex(sha256(new TextEncoder().encode(input)));
}

/**
 * Build a Soroban seal record (no network interaction — the commitment is
 * what a contract would store on-chain).
 */
export function createSorobanSeal(opts: {
  capsuleId: string;
  contentHash: string;
  unlockRound: number;
}): SorobanSeal {
  return {
    scheme: 'soroban-companion-v1',
    capsuleId: opts.capsuleId,
    contentHash: opts.contentHash,
    unlockRound: opts.unlockRound,
    commitment: sorobanCommitment(
      opts.capsuleId,
      opts.contentHash,
      opts.unlockRound
    ),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Verify a Soroban seal recomputes its commitment.
 */
export function verifySorobanSeal(seal: SorobanSeal): boolean {
  return (
    seal.commitment ===
    sorobanCommitment(seal.capsuleId, seal.contentHash, seal.unlockRound)
  );
}

/**
 * Whether the unlock round has been reached (given the current drand round).
 */
export function sorobanRoundReached(seal: SorobanSeal, currentRound: number): boolean {
  return currentRound >= seal.unlockRound;
}
