import { describe, expect, it } from "vitest";
import { backNavigation } from "~/shared/lib/back-navigation";

const primaryClick = {
  altKey: false,
  button: 0,
  canGoBack: true,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
};

describe("back navigation", () => {
  it("uses router history for an ordinary click with an in-app entry", () => {
    expect(backNavigation.shouldUseHistory(primaryClick)).toBe(true);
  });

  it("keeps the fallback link for direct entry and modified clicks", () => {
    expect(
      backNavigation.shouldUseHistory({
        ...primaryClick,
        canGoBack: false,
      }),
    ).toBe(false);
    expect(
      backNavigation.shouldUseHistory({ ...primaryClick, ctrlKey: true }),
    ).toBe(false);
    expect(
      backNavigation.shouldUseHistory({ ...primaryClick, button: 1 }),
    ).toBe(false);
  });
});
