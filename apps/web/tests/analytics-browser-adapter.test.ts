import { afterEach, describe, expect, it } from "vitest";
import { analyticsBrowser } from "~/shared/lib/analytics";

describe("analyticsBrowser", () => {
  afterEach(() =>
    document.getElementById("infraege-optional-analytics")?.remove(),
  );
  it("does not create a script without configuration", () => {
    analyticsBrowser.enable("");
    expect(document.getElementById("infraege-optional-analytics")).toBeNull();
  });
  it("creates the privacy-constrained script only when explicitly enabled", () => {
    analyticsBrowser.enable("website-test");
    const script = document.getElementById(
      "infraege-optional-analytics",
    ) as HTMLScriptElement | null;
    expect(script?.dataset.websiteId).toBe("website-test");
    expect(script?.dataset.excludeSearch).toBe("true");
    expect(script?.dataset.excludeHash).toBe("true");
  });
});
