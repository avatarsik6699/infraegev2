/**
 * Typed, versioned, SSR-safe localStorage adapter. This is the single owner of storage access and
 * storage-event subscriptions; feature code consumes semantic operations instead of `window`.
 *
 * A stored value is enveloped as `{ version, data }`; `get` validates both the version and the
 * `guard` and self-heals by removing the key on any mismatch, rather than returning bad data.
 */
import { safeJson, type TypeGuard } from "~/shared/lib/safe-json";

export type SafeLsKey<T> = {
  key: string;
  version: number;
  guard: TypeGuard<T>;
};

type Envelope<T> = {
  version: number;
  data: T;
};

function isEnvelope<T>(
  value: unknown,
  guard: TypeGuard<T>,
): value is Envelope<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "version" in value &&
    "data" in value &&
    typeof (value as Envelope<T>).version === "number" &&
    guard((value as Envelope<T>).data)
  );
}

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    // Private-mode Safari and similar can throw on access, not just on read/write.
    return null;
  }
}

function get<T>(def: SafeLsKey<T>): T | null {
  const storage = getLocalStorage();
  if (!storage) return null;

  let raw: string | null;
  try {
    raw = storage.getItem(def.key);
  } catch {
    return null;
  }
  if (raw === null) return null;

  const envelope = safeJson.parse<Envelope<T>>(raw, (v): v is Envelope<T> =>
    isEnvelope(v, def.guard),
  );
  if (envelope === null || envelope.version !== def.version) {
    try {
      storage.removeItem(def.key);
    } catch {
      // Storage can become unavailable between access and cleanup; a stale value is still ignored.
    }
    return null;
  }
  return envelope.data;
}

function set<T>(def: SafeLsKey<T>, data: T): void {
  const storage = getLocalStorage();
  if (!storage) return;
  const serialized = safeJson.stringify({ version: def.version, data });
  if (serialized === null) return;
  try {
    storage.setItem(def.key, serialized);
  } catch {
    // Quota/security failures must not break the learning flow; persistence is best-effort.
  }
}

function remove<T>(def: SafeLsKey<T>): void {
  try {
    getLocalStorage()?.removeItem(def.key);
  } catch {
    // Removing optional local progress is best-effort for the same reason as writes.
  }
}

function subscribe<T>(def: SafeLsKey<T>, listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === def.key) listener();
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

type SafeLsStore<T> = {
  getSnapshot: () => T | null;
  getServerSnapshot: () => null;
  set: (value: T) => void;
  remove: () => void;
  subscribe: (listener: () => void) => () => void;
};

function createStore<T>(def: SafeLsKey<T>): SafeLsStore<T> {
  const listeners = new Set<() => void>();
  let cached: T | null | undefined;
  const read = () => {
    if (cached === undefined) cached = get(def);
    return cached;
  };
  const emit = () => listeners.forEach((listener) => listener());

  return {
    getSnapshot: read,
    getServerSnapshot: () => null,
    set: (value) => {
      set(def, value);
      cached = value;
      emit();
    },
    remove: () => {
      remove(def);
      cached = null;
      emit();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      const unsubscribeStorage = subscribe(def, () => {
        cached = get(def);
        listener();
      });
      return () => {
        listeners.delete(listener);
        unsubscribeStorage();
      };
    },
  };
}

export const safeLs = { createStore, get, set, remove, subscribe };
