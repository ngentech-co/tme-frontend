'use client';

/**
 * Memory-safe chunked AES-GCM encryption for large media blobs.
 *
 * Strategy:
 *   - Files are read/encrypted in 1 MiB chunks so we never hold the whole
 *     file in memory at once (important for audio/video).
 *   - Each chunk uses a fresh random 96-bit IV (AES-GCM supports random IVs).
 *   - The output is a Blob (BlobParts of encrypted chunk buffers) which we
 *     store in IndexedDB.
 *
 * A single per-capsule "media key" encrypts all assets; that key is carried
 * inside the time-locked text payload (see capsule.ts).
 */

import { generateAesKey, exportKey, importKey, type EncryptedBlob } from './aes';

const CHUNK_SIZE = 1024 * 1024; // 1 MiB
const ALGO = 'AES-GCM';

export const MEDIA_CHUNK_SIZE = CHUNK_SIZE;

export interface EncryptedMediaChunk {
  iv: Uint8Array;
  ciphertext: ArrayBuffer;
}

export interface EncryptedMediaResult {
  encryptedBlob: Blob;
  sizeBytes: number;
  encryptedSizeBytes: number;
  chunkCount: number;
}

export interface MediaEncryptOptions {
  onProgress?: (progress: number) => void;
}

/**
 * Generate a fresh random 256-bit media key.
 */
export async function generateMediaKey(): Promise<CryptoKey> {
  return generateAesKey();
}

export async function exportMediaKey(key: CryptoKey): Promise<Uint8Array> {
  return exportKey(key);
}

export async function importMediaKey(raw: Uint8Array): Promise<CryptoKey> {
  return importKey(raw);
}

/**
 * Encrypt a Blob in chunks. Returns the encrypted Blob.
 */
export async function encryptMedia(
  key: CryptoKey,
  blob: Blob,
  options: MediaEncryptOptions = {}
): Promise<EncryptedMediaResult> {
  const chunks: BlobPart[] = [];
  let sizeBytes = blob.size;
  let encryptedSizeBytes = 0;
  let chunkCount = 0;

  for (let offset = 0; offset < blob.size; offset += CHUNK_SIZE) {
    const slice = blob.slice(offset, offset + CHUNK_SIZE);
    const plain = new Uint8Array(await slice.arrayBuffer());
    const encrypted = await encryptChunk(key, plain);
    chunks.push(toArrayBuffer(encrypted.iv));
    chunks.push(toArrayBuffer(new Uint8Array(encrypted.ciphertext)));
    encryptedSizeBytes += encrypted.iv.byteLength + encrypted.ciphertext.byteLength;
    chunkCount++;
    options.onProgress?.(Math.min(1, (offset + CHUNK_SIZE) / blob.size));
  }

  return {
    encryptedBlob: new Blob(chunks, { type: 'application/octet-stream' }),
    sizeBytes,
    encryptedSizeBytes,
    chunkCount,
  };
}

/**
 * Decrypt an encrypted Blob back to its original type.
 */
export async function decryptMedia(
  key: CryptoKey,
  encryptedBlob: Blob,
  mime: string,
  options: MediaEncryptOptions = {}
): Promise<Blob> {
  const parts: BlobPart[] = [];
  const total = encryptedBlob.size;

  for (let offset = 0; offset < total; ) {
    // Read one chunk: 12-byte IV + ciphertext (up to CHUNK_SIZE + 16 auth tag)
    const ivPart = await encryptedBlob.slice(offset, offset + 12).arrayBuffer();
    offset += 12;
    const cipherLen = Math.min(CHUNK_SIZE + 16, total - offset);
    const cipherPart = await encryptedBlob.slice(offset, offset + cipherLen).arrayBuffer();
    offset += cipherLen;

    const plain = await decryptChunk(key, {
      iv: new Uint8Array(ivPart),
      ciphertext: cipherPart,
    });
    parts.push(toArrayBuffer(plain));
    options.onProgress?.(Math.min(1, offset / total));
  }

  return new Blob(parts, { type: mime });
}

async function encryptChunk(
  key: CryptoKey,
  plaintext: Uint8Array
): Promise<EncryptedMediaChunk> {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGO, iv: iv as BufferSource },
    key,
    plaintext as BufferSource
  );
  return { iv, ciphertext };
}

async function decryptChunk(
  key: CryptoKey,
  chunk: EncryptedMediaChunk
): Promise<Uint8Array> {
  const plain = await crypto.subtle.decrypt(
    { name: ALGO, iv: chunk.iv as BufferSource },
    key,
    chunk.ciphertext as BufferSource
  );
  return new Uint8Array(plain);
}

/**
 * Build a per-capsule media manifest entry.
 */
export interface MediaAssetMeta {
  id: string;
  kind: 'image' | 'audio' | 'video' | 'file';
  name: string;
  mime: string;
  sizeBytes: number;
  encryptedSizeBytes: number;
  chunkCount: number;
}

export function mediaKindForMime(mime: string): MediaAssetMeta['kind'] {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('video/')) return 'video';
  return 'file';
}

/**
 * Copy a typed array's contents into a fresh, mutable ArrayBuffer.
 * (Avoids ArrayBufferLike / SharedArrayBuffer typing issues in BlobPart.)
 */
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

/**
 * Small helper: full read of a media asset after unlock, returning an object URL.
 * Caller must revoke the URL when done.
 */
export async function mediaToObjectUrl(
  key: CryptoKey,
  encryptedBlob: Blob,
  mime: string
): Promise<string> {
  const plain = await decryptMedia(key, encryptedBlob, mime);
  return URL.createObjectURL(plain);
}

export function revokeObjectUrl(url: string): void {
  if (typeof window !== 'undefined') {
    URL.revokeObjectURL(url);
  }
}

// Re-export type for convenience.
export type { EncryptedBlob };
