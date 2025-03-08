export enum StorageKeys {
  headerState = 'headerState',
}

abstract class BaseStorage {
  protected abstract prefix: string;

  protected getKey(key: StorageKeys): string {
    return `${this.prefix}:${key}`;
  }

  get<T>(key: StorageKeys): T | null {
    try {
      const value = localStorage.getItem(this.getKey(key));

      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: StorageKeys, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch {
      // Fail silently if localStorage is not available
    }
  }

  remove(key: StorageKeys): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch {
      // Fail silently if localStorage is not available
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      // Fail silently if localStorage is not available
    }
  }
}

class Storage extends BaseStorage {
  protected prefix = '$ibis';
}

export const storage = new Storage();
