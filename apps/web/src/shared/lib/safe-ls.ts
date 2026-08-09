/**
 * Typed, versioned, SSR-safe localStorage wrapper. Replaces raw `window.localStorage` access,
 * which throws under SSR, silently returns malformed data, and has no schema-evolution story.
 *
 * A stored value is enveloped as `{ version, data }`; `get` validates both the version and the
 * `guard` and self-heals by removing the key on any mismatch, rather than returning bad data.
 */
import { runtime } from "~/shared/config/runtime";
import { safeJson, type TypeGuard } from "~/shared/lib/safe-json";

export interface SafeLsKey<T> {
  key: string;
  version: number;
  guard: TypeGuard<T>;
}

interface Envelope<T> {
  version: number;
  data: T;
}

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
  if (runtime.isServer || !runtime.hasWindow) return null;
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

  const raw = storage.getItem(def.key);
  if (raw === null) return null;

  const envelope = safeJson.parse<Envelope<T>>(raw, (v): v is Envelope<T> =>
    isEnvelope(v, def.guard),
  );
  if (envelope === null || envelope.version !== def.version) {
    storage.removeItem(def.key);
    return null;
  }
  return envelope.data;
}

function set<T>(def: SafeLsKey<T>, data: T): void {
  const storage = getLocalStorage();
  if (!storage) return;
  const serialized = safeJson.stringify({ version: def.version, data });
  if (serialized !== null) storage.setItem(def.key, serialized);
}

function remove<T>(def: SafeLsKey<T>): void {
  getLocalStorage()?.removeItem(def.key);
}

export const safeLs = { get, set, remove };
