/**
 * IndexedDB persistence layer for UnicornTools Session History.
 * Stores original Files and processed Blobs across browser refreshes
 * with zero server transmission.
 */

export interface StoredHistoryRecord {
  id: string;
  toolId: string;
  toolName: string;
  fileName: string;
  originalFile: Blob | File;
  originalSize: number;
  processedSize?: number;
  width?: number;
  height?: number;
  resultBlob?: Blob;
  resultFileName?: string;
  settingsSummary: string;
  timestamp: number;
}

const DB_NAME = 'unicorntools_db';
const STORE_NAME = 'session_history';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('toolId', 'toolId', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      dbPromise = null;
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });

  return dbPromise;
}

export async function saveHistoryItemToDb(item: StoredHistoryRecord): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(item);

    // Keep database size bounded (max 25 recent items)
    const index = store.index('timestamp');
    const countReq = index.count();

    countReq.onsuccess = () => {
      if (countReq.result > 25) {
        const openCursorReq = index.openCursor(null, 'next'); // oldest first
        let deletedCount = 0;
        const toDelete = countReq.result - 25;

        openCursorReq.onsuccess = () => {
          const cursor = openCursorReq.result;
          if (cursor && deletedCount < toDelete) {
            cursor.delete();
            deletedCount++;
            cursor.continue();
          }
        };
      }
    };

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save history item to IndexedDB:', err);
  }
}

export async function getAllHistoryItemsFromDb(): Promise<StoredHistoryRecord[]> {
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev'); // newest first
    const items: StoredHistoryRecord[] = [];

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && items.length < 20) {
          const val = cursor.value;
          // Validate record has required file data
          if (val && val.id && val.fileName && (val.originalFile || val.resultBlob)) {
            items.push(val);
          }
          cursor.continue();
        } else {
          resolve(items);
        }
      };

      request.onerror = () => {
        resolve([]);
      };
    });
  } catch (err) {
    console.warn('Failed to load history items from IndexedDB:', err);
    return [];
  }
}

export async function deleteHistoryItemFromDb(id: string): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Failed to delete history item from IndexedDB:', err);
  }
}

export async function clearAllHistoryItemsFromDb(): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Failed to clear IndexedDB history store:', err);
  }
}

export async function deleteToolHistoryFromDb(toolId: string): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('toolId');
    const request = index.openCursor(IDBKeyRange.only(toolId));

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Failed to delete tool history from IndexedDB:', err);
  }
}
