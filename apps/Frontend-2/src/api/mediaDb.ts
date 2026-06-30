const DB_NAME = 'clarte_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media';

export interface MediaItem {
  id: string;
  name: string;
  type: string;
  size: number;
  data: Blob;
  createdAt: string;
}

class MediaDatabase {
  private db: IDBDatabase | null = null;

  private init(): Promise<IDBDatabase> {
    if (this.db) return Promise.resolve(this.db);

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  public async saveMedia(id: string, name: string, type: string, data: Blob): Promise<MediaItem> {
    const db = await this.init();
    const mediaItem: MediaItem = {
      id,
      name,
      type,
      size: data.size,
      data,
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(mediaItem);

      request.onsuccess = () => resolve(mediaItem);
      request.onerror = () => reject(request.error);
    });
  }

  public async getMedia(id: string): Promise<MediaItem | null> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteMedia(id: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const mediaDb = new MediaDatabase();
