import { use } from "react";

/** A dynamic import of a `*.paid.*` content module (Change 192, SPEC §6.1). */
type PaidLoader<Content> = () => Promise<{ default: Content }>;

/** React reads `status`/`value` of a settled thenable without suspending. */
type TrackedPromise<Content> = Promise<Content> & {
  status?: string;
  value?: Content;
};

// Paid modules are static content, the same for every viewer, so one promise per
// loader serves the whole process: the route loader warms it before rendering and
// the page reads it synchronously, so SSR never streams a suspended boundary.
const loads = new WeakMap<PaidLoader<unknown>, TrackedPromise<unknown>>();

function load<Content>(loader: PaidLoader<Content>): TrackedPromise<Content> {
  const cached = loads.get(loader);
  if (cached) return cached as TrackedPromise<Content>;
  const promise: TrackedPromise<Content> = loader().then(
    (module) => module.default,
  );
  promise.status = "pending";
  promise.then(
    (value) => {
      promise.status = "fulfilled";
      promise.value = value;
    },
    () => {
      // A failed chunk (offline, no access) is retried on the next request.
      loads.delete(loader);
    },
  );
  loads.set(loader, promise);
  return promise;
}

export const paidContent = {
  /** Starts loading in a route loader; resolves when the module is ready. */
  async preload<Content>(loader: PaidLoader<Content> | undefined) {
    if (loader) await load(loader);
  },
};

/** The content of a paid module; suspends only while its chunk is loading. */
export const usePaidContent = <Content>(
  loader: PaidLoader<Content> | undefined,
): Content | undefined =>
  loader ? use(load(loader) as Promise<Content>) : undefined;
