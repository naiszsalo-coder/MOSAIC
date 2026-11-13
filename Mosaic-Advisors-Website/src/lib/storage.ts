/**
 * localStorage wrapper. Every call is wrapped in try/catch because storage can be
 * missing or throw (private mode, disabled cookies, sandboxed frames). The site keeps
 * working without it; data just isn't remembered.
 */
const PREFIX = "mosaic_";

export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown): void {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* storage unavailable — ignore */
    }
  }
};
