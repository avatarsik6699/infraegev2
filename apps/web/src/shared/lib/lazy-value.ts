/** Loads a value on demand, usually a content module's export. */
type Loader<Value> = () => Promise<Value>;

/** React reads `status`/`value` of a settled thenable without suspending. */
type TrackedPromise<Value> = Promise<Value> & {
  status?: string;
  value?: Value;
};

// Content modules are static, the same for every viewer, so one promise per loader
// serves the whole process: a route loader warms it before rendering and the page
// reads it synchronously, so SSR never streams a suspended boundary.
const loads = new WeakMap<Loader<unknown>, TrackedPromise<unknown>>();

function load<Value>(loader: Loader<Value>): TrackedPromise<Value> {
  const cached = loads.get(loader);
  if (cached) return cached as TrackedPromise<Value>;
  const promise: TrackedPromise<Value> = loader();
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

export const lazyValue = {
  /** Starts loading in a route loader; resolves with the value when it is ready. */
  async preload<Value>(loader: Loader<Value>): Promise<Value> {
    return load(loader);
  },
  /** The process-wide promise for React's `use()`: settled ones read without suspending. */
  promise<Value>(loader: Loader<Value>): Promise<Value> {
    return load(loader);
  },
};
