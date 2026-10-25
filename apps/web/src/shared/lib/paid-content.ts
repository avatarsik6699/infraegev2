import { use } from "react";
import { lazyValue } from "./lazy-value";

/** A dynamic import of a `*.paid.*` content module (Change 192, SPEC §6.1). */
type PaidLoader<Content> = () => Promise<{ default: Content }>;

// One stable value loader per module loader, so `lazy-value` caches each module once.
const values = new WeakMap<PaidLoader<unknown>, () => Promise<unknown>>();

function value<Content>(loader: PaidLoader<Content>): () => Promise<Content> {
  let cached = values.get(loader);
  if (!cached) {
    cached = () => loader().then((module) => module.default);
    values.set(loader, cached);
  }
  return cached as () => Promise<Content>;
}

export const paidContent = {
  /** Starts loading in a route loader; resolves when the module is ready. */
  async preload<Content>(loader: PaidLoader<Content> | undefined) {
    if (loader) await lazyValue.preload(value(loader));
  },
};

/** The content of a paid module; suspends only while its chunk is loading. */
export const usePaidContent = <Content>(
  loader: PaidLoader<Content> | undefined,
): Content | undefined =>
  loader ? use(lazyValue.promise(value(loader))) : undefined;
