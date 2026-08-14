/**
 * AES-256-GCM encryption using the Web Crypto API.
 * All operations happen client-side.
 */

const ALGO = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

export interface EncryptedBlob {
  ciphertext: Uint8Array;
  iv: Uint8Array;
  meta: {
    algo: 'AES-256-GCM';
    createdAt: string;
    bytes: number;
  };
}

export async function generateAesKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: ALGO, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function exportKey(key: CryptoKey): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.exportKey('raw', key));
}

export async function importKey(raw: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', raw as BufferSource, { name: ALGO }, true, [
    'encrypt',
    'decrypt',
  ]);
}

function randomIV(): Uint8Array {
  const iv = new Uint8Array(IV_LENGTH);
  crypto.getRandomValues(iv);
  return iv;
}

export async function encryptBytes(
  key: CryptoKey,
  plaintext: Uint8Array,
  additionalData?: Uint8Array
): Promise<EncryptedBlob> {
  const iv = randomIV();
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: ALGO,
        iv: iv as BufferSource,
        additionalData: additionalData as BufferSource | undefined,
      },
      key,
      plaintext as BufferSource
    )
  );
  return {
    ciphertext,
    iv,
    meta: {
      algo: 'AES-256-GCM',
      createdAt: new Date().toISOString(),
      bytes: plaintext.byteLength,
    },
  };
}

export async function decryptBytes(
  key: CryptoKey,
  blob: EncryptedBlob,
  additionalData?: Uint8Array
): Promise<Uint8Array> {
  return new Uint8Array(
    await crypto.subtle.decrypt(
      {
        name: ALGO,
        iv: blob.iv as BufferSource,
        additionalData: additionalData as BufferSource | undefined,
      },
      key,
      blob.ciphertext as BufferSource
    )
  );
}

export async function encryptString(
  key: CryptoKey,
  text: string,
  additionalData?: Uint8Array
): Promise<EncryptedBlob> {
  const data = new TextEncoder().encode(text);
  return encryptBytes(key, data, additionalData);
}

export async function decryptString(
  key: CryptoKey,
  blob: EncryptedBlob,
  additionalData?: Uint8Array
): Promise<string> {
  const bytes = await decryptBytes(key, blob, additionalData);
  return new TextDecoder().decode(bytes);
}

/**
 * Pack an EncryptedBlob into a single transferable structure (base64-friendly).
 */
export function packBlob(blob: EncryptedBlob): {
  c: string;
  iv: string;
  meta: EncryptedBlob['meta'];
} {
  return {
    c: uint8ToBase64(blob.ciphertext),
    iv: uint8ToBase64(blob.iv),
    meta: blob.meta,
  };
}

export function unpackBlob(packed: {
  c: string;
  iv: string;
  meta: EncryptedBlob['meta'];
}): EncryptedBlob {
  return {
    ciphertext: base64ToUint8(packed.c),
    iv: base64ToUint8(packed.iv),
    meta: packed.meta,
  };
}

function uint8ToBase64(bytes: Uint8Array): string {
  if (typeof window === 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8(b64: string): Uint8Array {
  if (typeof window === 'undefined') {
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
