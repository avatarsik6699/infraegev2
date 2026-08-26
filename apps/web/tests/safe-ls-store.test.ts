import { afterEach, describe, expect, it, vi } from "vitest";
import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";

const definition: SafeLsKey<string> = {
  key: "test.safe-ls-store",
  version: 1,
  guard: (value): value is string => typeof value === "string",
};

describe("safeLs.createStore", () => {
  afterEach(() => localStorage.removeItem(definition.key));

  it("notifies same-tab subscribers and keeps a stable snapshot", () => {
    const store = safeLs.createStore(definition);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.set("granted");

    expect(store.getSnapshot()).toBe("granted");
    expect(store.getSnapshot()).toBe("granted");
    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
  });
});
