'use client';

/**
 * IndexedDB media vault for encrypted media blobs.
 *
 * Large media cannot live in localStorage (5 MB limit), so encrypted blobs
 * are stored here. Keys are namespaced per user + capsule:
 *   `${userId}:${capsuleId}:${assetId}`
 *
 * All blobs stored are already encrypted (AES-GCM) — the vault never holds
 * plaintext.
 */

const DB_NAME = 'tomorrowme-media';
const DB_VERSION = 1;
const STORE = 'blobs';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Failed to open media DB'));
  });
  return dbPromise;
}

function tx(
  mode: IDBTransactionMode
): Promise<{ store: IDBObjectStore; done: Promise<void> }> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const store = t.objectStore(STORE);
        t.oncomplete = () => resolve({ store, done: Promise.resolve() });
        t.onerror = () => reject(t.error ?? new Error('tx failed'));
        t.onabort = () => reject(t.error ?? new Error('tx aborted'));
        resolve({ store, done: Promise.resolve() });
      })
  );
}

function key(userId: string, capsuleId: string, assetId: string): string {
  return `${userId}:${capsuleId}:${assetId}`;
}

function userPrefix(userId: string): string {
  return `${userId}:`;
}

function capsulePrefix(userId: string, capsuleId: string): string {
  return `${userId}:${capsuleId}:`;
}

export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

/**
 * Store an encrypted media blob for an asset.
 */
export async function putEncryptedMedia(
  userId: string,
  capsuleId: string,
  assetId: string,
  blob: Blob
): Promise<void> {
  const t = await tx('readwrite');
  await new Promise<void>((resolve, reject) => {
    const req = t.store.put(blob, key(userId, capsuleId, assetId));
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error ?? new Error('put failed'));
  });
  await t.done;
}

/**
 * Retrieve an encrypted media blob.
 */
export async function getEncryptedMedia(
  userId: string,
  capsuleId: string,
  assetId: string
): Promise<Blob | null> {
  const t = await tx('readonly');
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const req = t.store.get(key(userId, capsuleId, assetId));
    req.onsuccess = () => resolve((req.result as Blob) ?? null);
    req.onerror = () => reject(req.error ?? new Error('get failed'));
  });
  return blob;
}

/**
 * Delete all media for a capsule.
 */
export async function deleteCapsuleMedia(
  userId: string,
  capsuleId: string
): Promise<void> {
  const t = await tx('readwrite');
  await new Promise<void>((resolve, reject) => {
    const range = IDBKeyRange.bound(
      capsulePrefix(userId, capsuleId),
      capsulePrefix(userId, capsuleId) + '\uffff'
    );
    const req = t.store.delete(range);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error ?? new Error('delete failed'));
  });
  await t.done;
}

/**
 * Delete all media for a user (on account deletion).
 */
export async function deleteUserMedia(userId: string): Promise<void> {
  const t = await tx('readwrite');
  await new Promise<void>((resolve, reject) => {
    const range = IDBKeyRange.bound(
      userPrefix(userId),
      userPrefix(userId) + '\uffff'
    );
    const req = t.store.delete(range);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error ?? new Error('delete failed'));
  });
  await t.done;
}

/**
 * Count of media records for a capsule (for diagnostics).
 */
export async function countCapsuleMedia(
  userId: string,
  capsuleId: string
): Promise<number> {
  const t = await tx('readonly');
  return new Promise<number>((resolve, reject) => {
    const range = IDBKeyRange.bound(
      capsulePrefix(userId, capsuleId),
      capsulePrefix(userId, capsuleId) + '\uffff'
    );
    const req = t.store.count(range);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('count failed'));
  });
}

/**
 * Total encrypted bytes stored for a user (approximation via iterating).
 * Used by the quota UI alongside localStorage estimate.
 */
export async function estimateMediaStorageUsed(userId: string): Promise<number> {
  const t = await tx('readonly');
  return new Promise<number>((resolve, reject) => {
    let total = 0;
    const range = IDBKeyRange.bound(
      userPrefix(userId),
      userPrefix(userId) + '\uffff'
    );
    const req = t.store.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const blob = cursor.value as Blob;
        total += blob.size;
        cursor.continue();
      } else {
        resolve(total);
      }
    };
    req.onerror = () => reject(req.error ?? new Error('cursor failed'));
  });
}
