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

it("keeps session drafts separate from persistent progress and revision keys", () => {
  const draft = {
    ...definition,
    key: "draft:task:1",
    storage: "session" as const,
  };
  const store = safeLs.createStore(draft);
  store.set("123");
  expect(localStorage.getItem(draft.key)).toBeNull();
  expect(safeLs.createStore(draft).getSnapshot()).toBe("123");
  expect(
    safeLs.createStore({ ...draft, key: "draft:task:2" }).getSnapshot(),
  ).toBeNull();
  store.remove();
  expect(sessionStorage.getItem(draft.key)).toBeNull();
});
