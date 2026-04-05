import { User } from "@/types/user";

export class StorageService<T> {
  private readonly KEY_STORAGE: string;

  constructor(key: string) {
    this.KEY_STORAGE = key;
  }

  getValue(): T {
    const value = localStorage.getItem(this.KEY_STORAGE);

    if (
      value === null ||
      value === undefined ||
      value === "undefined" ||
      value === "null"
    ) {
      throw Error(`${this.KEY_STORAGE} does not exist`);
    }

    try {
      return JSON.parse(value) as T;
    } catch (e) {
      // If stored value is corrupted (not valid JSON) — remove it and surface a clear error.
      try {
        localStorage.removeItem(this.KEY_STORAGE);
      } catch (ignore) {}
      throw Error(`${this.KEY_STORAGE} contains invalid JSON`);
    }
  }

  setValue(value: T) {
    localStorage.setItem(this.KEY_STORAGE, JSON.stringify(value));
  }

  hasValue() {
    const value = localStorage.getItem(this.KEY_STORAGE);
    if (value === null || value === undefined) return false;
    if (value === "undefined" || value === "null") return false;
    return true;
  }
  deleteValue() {
    localStorage.removeItem(this.KEY_STORAGE);
  }
}

export const tokenStorage = new StorageService<string>("TOKEN")
export const userStorage = new StorageService<User>("USER")