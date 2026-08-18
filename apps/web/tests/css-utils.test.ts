import { describe, expect, it } from "vitest";
import { cssUtils } from "~/shared/lib/css-utils";

describe("cssUtils.cx", () => {
  it("joins truthy string arguments with a single space", () => {
    expect(cssUtils.cx("root", "accent")).toBe("root accent");
  });

  it("drops falsy arguments without leaving stray whitespace", () => {
    expect(cssUtils.cx("root", undefined, null, false, "")).toBe("root");
  });

  it("flattens nested arrays", () => {
    expect(cssUtils.cx("root", ["a", ["b", undefined]])).toBe("root a b");
  });

  it("applies each map key whose condition is truthy", () => {
    expect(cssUtils.cx("root", { dashed: true, paired: false })).toBe(
      "root dashed",
    );
  });

  it("returns an empty string when nothing resolves", () => {
    expect(cssUtils.cx(undefined, false, {})).toBe("");
  });
});
