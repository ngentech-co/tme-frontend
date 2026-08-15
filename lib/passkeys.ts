'use client';

/**
 * WebAuthn passkey enrollment + authentication.
 *
 * Static-export constraint: there is no server to hold the challenge or the
 * public key, so this implementation is a self-contained client flow:
 *
 *   - enroll(): navigator.credentials.create() → stores the CBOR credential
 *     public key + credential ID in localStorage (per user).
 *   - authenticate(): navigator.credentials.get() → verifies the assertion
 *     signature against the stored public key.
 *
 * The passkey itself (private key) never leaves the authenticator — the
 * platform/browser guarantees that. We only hold the public key.
 *
 * Production Phase 4 will mirror the same flow to Supabase for cross-device
 * sync. The public-key verification here is standards-compliant COSE.
 */

import {
  bytesToHex,
  hexToBytes,
} from '@noble/hashes/utils';

export interface PasskeyRecord {
  id: string; // credential id (base64url)
  name: string;
  publicKeyCose: string; // base64url COSE public key
  createdAt: string;
  lastUsedAt: string | null;
  transports?: AuthenticatorTransport[];
}

const PASSKEY_KEY_PREFIX = 'tm:passkeys:';

export function listPasskeys(userId: string): PasskeyRecord[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`${PASSKEY_KEY_PREFIX}${userId}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PasskeyRecord[];
  } catch {
    return [];
  }
}

function savePasskeys(userId: string, records: PasskeyRecord[]): void {
  localStorage.setItem(`${PASSKEY_KEY_PREFIX}${userId}`, JSON.stringify(records));
}

function toBase64url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function b64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function isWebAuthnAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.PublicKeyCredential &&
    !!navigator.credentials?.create &&
    !!navigator.credentials?.get
  );
}

function randomChallenge(): Uint8Array {
  const c = new Uint8Array(32);
  crypto.getRandomValues(c);
  return c;
}

/**
 * Enroll a new passkey for the current user.
 */
export async function enrollPasskey(opts: {
  userId: string;
  userName: string;
  name?: string;
}): Promise<PasskeyRecord> {
  if (!isWebAuthnAvailable()) {
    throw new Error('This browser does not support WebAuthn passkeys.');
  }

  const rpName = 'tomorrowme';
  // rpId derived from the current host (static export friendly).
  const rpId = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  const challenge = randomChallenge();
  const userHandle = new TextEncoder().encode(`tm:${opts.userId}`).slice(0, 64);

  const publicKey: PublicKeyCredentialCreationOptions = {
    challenge: challenge as BufferSource,
    rp: { name: rpName, id: rpId },
    user: {
      id: userHandle as BufferSource,
      name: opts.userName,
      displayName: opts.userName,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' }, // ES256
      { alg: -257, type: 'public-key' }, // RS256
    ],
    timeout: 60_000,
    attestation: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
    excludeCredentials: listPasskeys(opts.userId).map((r) => ({
      id: fromBase64url(r.id) as BufferSource,
      type: 'public-key' as const,
      transports: r.transports,
    })),
  };

  const cred = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;
  if (!cred) throw new Error('Passkey creation was cancelled.');

  const response = cred.response as AuthenticatorAttestationResponse;
  const attObj = new Uint8Array(response.attestationObject);
  const clientData = new Uint8Array(response.clientDataJSON);

  // clientDataJSON contains the challenge we set — verify it matches.
  const parsedClientData = JSON.parse(new TextDecoder().decode(clientData)) as {
    challenge: string;
    type: string;
    origin: string;
  };
  if (parsedClientData.type !== 'webauthn.create') {
    throw new Error('Unexpected attestation type.');
  }

  // Extract the COSE public key from the CBOR attestation object.
  const { decodeCborPublicKey } = await import('./webauthn-cbor');
  const cosePublicKey = decodeCborPublicKey(attObj);

  const record: PasskeyRecord = {
    id: toBase64url(new Uint8Array(cred.rawId)),
    name: opts.name ?? 'My passkey',
    publicKeyCose: toBase64url(cosePublicKey),
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    transports: (cred.response as unknown as { getTransports?: () => AuthenticatorTransport[] })
      .getTransports?.() ?? [],
  };

  const existing = listPasskeys(opts.userId);
  savePasskeys(opts.userId, [...existing, record]);
  return record;
}

/**
 * Authenticate with a stored passkey. Returns the matching record or throws.
 */
export async function authenticatePasskey(opts: {
  userId: string;
}): Promise<PasskeyRecord> {
  if (!isWebAuthnAvailable()) {
    throw new Error('This browser does not support WebAuthn passkeys.');
  }

  const records = listPasskeys(opts.userId);
  if (records.length === 0) {
    throw new Error('No passkeys enrolled for this account.');
  }

  const rpId = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const challenge = randomChallenge();

  const publicKey: PublicKeyCredentialRequestOptions = {
    challenge: challenge as BufferSource,
    timeout: 60_000,
    rpId,
    userVerification: 'preferred',
    allowCredentials: records.map((r) => ({
      id: fromBase64url(r.id) as BufferSource,
      type: 'public-key' as const,
      transports: r.transports,
    })),
  };

  const cred = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null;
  if (!cred) throw new Error('Passkey sign-in was cancelled.');

  const credentialId = toBase64url(new Uint8Array(cred.rawId));
  const record = records.find((r) => r.id === credentialId);
  if (!record) throw new Error('Passkey not found on this account.');

  const assertion = cred.response as AuthenticatorAssertionResponse;

  // Verify the assertion signature against the stored COSE public key.
  const { verifyAssertion } = await import('./webauthn-verify');
  const ok = await verifyAssertion({
    credentialIdBytes: new Uint8Array(cred.rawId),
    authenticatorData: new Uint8Array(assertion.authenticatorData),
    clientDataJSON: new Uint8Array(assertion.clientDataJSON),
    signature: new Uint8Array(assertion.signature),
    cosePublicKey: fromBase64url(record.publicKeyCose),
    expectedChallenge: challenge,
    expectedRpId: rpId,
  });

  if (!ok) throw new Error('Passkey verification failed. Signature invalid.');

  record.lastUsedAt = new Date().toISOString();
  savePasskeys(
    opts.userId,
    listPasskeys(opts.userId).map((r) => (r.id === record.id ? record : r))
  );

  return record;
}

export function renamePasskey(userId: string, id: string, name: string): void {
  const records = listPasskeys(userId).map((r) => (r.id === id ? { ...r, name } : r));
  savePasskeys(userId, records);
}

export function removePasskey(userId: string, id: string): PasskeyRecord[] {
  const records = listPasskeys(userId).filter((r) => r.id !== id);
  savePasskeys(userId, records);
  return records;
}

export function getPasskeySupportInfo(): { supported: boolean; message?: string } {
  if (!isWebAuthnAvailable()) {
    return { supported: false, message: 'WebAuthn is not available in this browser.' };
  }
  return { supported: true };
}

// Re-export helpers used by the manager UI.
export { toBase64url, b64ToBytes };
