'use client';

/**
 * WebAuthn assertion verification against a stored COSE public key.
 *
 * Signs:
 *   authenticatorData || SHA-256(clientDataJSON)
 *
 * COSE key handling (minimal but real):
 *   - ES256 (alg -7, kty=2, crv=1): EC2 public key over P-256
 */

import { p256 } from '@noble/curves/p256';
import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex } from '@noble/hashes/utils';
import { parseCbor } from './webauthn-cbor';

export interface VerifyAssertionArgs {
  credentialIdBytes: Uint8Array;
  authenticatorData: Uint8Array;
  clientDataJSON: Uint8Array;
  signature: Uint8Array;
  cosePublicKey: Uint8Array;
  expectedChallenge: Uint8Array;
  expectedRpId: string;
}

export async function verifyAssertion(args: VerifyAssertionArgs): Promise<boolean> {
  try {
    // 1. Parse clientDataJSON and verify challenge + type + origin.
    const clientData = JSON.parse(
      new TextDecoder().decode(args.clientDataJSON)
    ) as { challenge: string; type: string; origin: string };

    if (clientData.type !== 'webauthn.get') {
      return false;
    }

    const sentChallenge = bytesToHex(args.expectedChallenge);
    const clientChallenge = clientData.challenge.replace(/=/g, '');
    if (clientChallenge !== sentChallenge) {
      return false;
    }

    // 2. Verify rpIdHash in authenticatorData.
    const rpIdHash = await sha256(new TextEncoder().encode(args.expectedRpId));
    for (let i = 0; i < 32; i++) {
      if (args.authenticatorData[i] !== rpIdHash[i]) {
        return false;
      }
    }

    // 3. Build signed payload: authenticatorData || sha256(clientDataJSON).
    const clientHash = sha256(args.clientDataJSON);
    const signedData = new Uint8Array(args.authenticatorData.length + clientHash.length);
    signedData.set(args.authenticatorData, 0);
    signedData.set(clientHash, args.authenticatorData.length);

    // 4. Decode COSE key and verify signature.
    const { coseAlg, publicKeyBytes } = parseCosePublicKey(args.cosePublicKey);

    if (coseAlg === -7) {
      return p256.verify(
        args.signature as Uint8Array<ArrayBuffer>,
        signedData as Uint8Array<ArrayBuffer>,
        publicKeyBytes as Uint8Array<ArrayBuffer>
      );
    }

    return false;
  } catch (e) {
    console.error('Passkey verification error:', e);
    return false;
  }
}

/**
 * Parse a COSE EC2 public key into an uncompressed point.
 */
function parseCosePublicKey(cose: Uint8Array): {
  coseAlg: number;
  publicKeyBytes: Uint8Array;
} {
  const root = parseCbor(cose, 0).value as Map<unknown, unknown>;
  const kty = root.get(1);
  const alg = Number(root.get(3) ?? -7);

  if (kty === 2 && alg === -7) {
    const x = root.get(-2) as Uint8Array;
    const y = root.get(-3) as Uint8Array;
    if (!x || !y) throw new Error('EC2 key missing coordinates');
    const point = new Uint8Array(1 + x.length + y.length);
    point[0] = 0x04;
    point.set(x, 1);
    point.set(y, 1 + x.length);
    return { coseAlg: alg, publicKeyBytes: point };
  }

  throw new Error(`Unsupported COSE key: kty=${kty} alg=${alg}`);
}
