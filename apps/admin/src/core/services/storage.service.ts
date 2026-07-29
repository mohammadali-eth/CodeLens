/**
 * StorageService
 * Purpose: Provides a type-safe, resilient wrapper around localStorage and sessionStorage with JSON serialization.
 * Responsibilities: getItem, setItem, removeItem, clear for local/session storage with try-catch fallbacks.
 * Dependencies: Browser Storage APIs.
 */

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public getItem<T>(key: string, storage: Storage = localStorage): T | null {
    try {
      const item = storage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageService]: Error reading key "${key}" from storage`, error);
      return null;
    }
  }

  public setItem<T>(key: string, value: T, storage: Storage = localStorage): boolean {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[StorageService]: Error writing key "${key}" to storage`, error);
      return false;
    }
  }

  public removeItem(key: string, storage: Storage = localStorage): void {
    try {
      storage.removeItem(key);
    } catch (error) {
      console.warn(`[StorageService]: Error removing key "${key}" from storage`, error);
    }
  }

  public clear(storage: Storage = localStorage): void {
    try {
      storage.clear();
    } catch (error) {
      console.warn(`[StorageService]: Error clearing storage`, error);
    }
  }
}

export const storageService = StorageService.getInstance();
