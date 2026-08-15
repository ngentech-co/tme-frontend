'use client';

/**
 * Real Stellar submission for the invisible anchoring layer.
 *
 * Uses the low-level @stellar/stellar-base to build/sign a memo transaction,
 * then submits it directly to the Horizon REST API via fetch (no heavy SDK).
 *
 * Only executed when a Stellar secret key is configured (Settings → Legal).
 * In the default offline/static deployment this module is never invoked and
 * anchors stay in 'simulated' status.
 */

import * as StellarBase from '@stellar/stellar-base';

export interface SubmitResult {
  ok: boolean;
  txHash?: string;
  ledgerSeq?: number;
  network?: string;
}

/**
 * Submit a memo transaction carrying `memoText` to the Stellar network.
 */
export async function submitAnchorMemo(
  memoText: string,
  isReveal: boolean,
  options: {
    secret?: string;
    horizon?: string;
    network?: 'public' | 'testnet';
  } = {}
): Promise<SubmitResult> {
  const secret = options.secret ?? getSecretFromStorage();
  if (!secret) {
    return { ok: false };
  }

  const network = options.network ?? 'public';
  const horizonUrl =
    options.horizon ??
    (network === 'testnet' ? 'https://horizon-testnet.stellar.org' : 'https://horizon.stellar.org');
  const networkPassphrase =
    network === 'testnet' ? StellarBase.Networks.TESTNET : StellarBase.Networks.PUBLIC;

  try {
    const keypair = StellarBase.Keypair.fromSecret(secret);
    const account = await horizonGet(`${horizonUrl}/accounts/${keypair.publicKey()}`);
    const sequence = BigInt(account.sequence);

    const memo = isReveal
      ? StellarBase.Memo.text(memoText.slice(0, 27))
      : StellarBase.Memo.text(memoText.slice(0, 27));

    const tx = new StellarBase.TransactionBuilder(
      {
        accountId: keypair.publicKey(),
        sequenceNumber: sequence.toString(),
      } as unknown as StellarBase.Account,
      {
        fee: StellarBase.BASE_FEE,
        networkPassphrase,
      }
    )
      .addOperation(
        StellarBase.Operation.payment({
          destination: keypair.publicKey(),
          asset: StellarBase.Asset.native(),
          amount: '0.0000001',
        })
      )
      .addMemo(memo)
      .setTimeout(30)
      .build();

    tx.sign(keypair);
    const envelope = tx.toEnvelope().toXDR('base64');

    const res = await horizonPost(`${horizonUrl}/transactions`, envelope);
    if (!res.ok) return { ok: false };
    const json = await res.json();
    return {
      ok: true,
      txHash: json.hash,
      ledgerSeq: typeof json.ledger === 'number' ? json.ledger : undefined,
      network,
    };
  } catch (e) {
    console.warn('[tomorrowme] Stellar anchor submission failed:', e);
    return { ok: false };
  }
}

async function horizonGet(url: string): Promise<{ sequence: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Horizon GET failed: ${res.status}`);
  return res.json();
}

async function horizonPost(
  url: string,
  xdr: string
): Promise<Response> {
  const body = new URLSearchParams({ tx: xdr });
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}

function getSecretFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tm:stellar:secret');
}

/**
 * Derive a capsule-scoped Stellar keypair from a user secret + capsule id
 * (invisible, deterministic anchoring). Reserved for future use.
 */
export function deriveCapsuleKeypair(secret: string, capsuleId: string): StellarBase.Keypair {
  const fromSecret = StellarBase.Keypair.fromSecret(secret);
  let hash = 0;
  const seed = new TextEncoder().encode(capsuleId);
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed[i]) >>> 0;
  }
  return StellarBase.Keypair.fromRawEd25519Seed(
    deriveMix(fromSecret, hash) as unknown as Buffer
  );
}

function deriveMix(kp: StellarBase.Keypair, n: number): Uint8Array {
  const base = kp.secret();
  const seed = new TextEncoder().encode(`${base}:${n}`);
  const out = new Uint8Array(32);
  for (let i = 0; i < seed.length; i++) {
    out[i % 32] = (out[i % 32] + seed[i]) & 0xff;
  }
  return out;
}
