import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClientErrorReport } from "~/shared/lib/client-errors/browser-adapter";
import {
  reportClientError,
  resetClientErrorReporterForTests,
} from "~/shared/lib/client-errors/reporter";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("~/shared/api/client", () => ({
  apiClient: { POST: post },
}));

beforeEach(() => {
  resetClientErrorReporterForTests();
  post.mockResolvedValue({ data: undefined, error: undefined });
  Object.defineProperty(window, "crypto", {
    configurable: true,
    value: {
      subtle: {
        digest: vi.fn(async () => new Uint8Array(32).fill(10).buffer),
      },
    },
  });
});

describe("privacy-safe client error reporting", () => {
  it("keeps only an owned asset frame and an irreversible fingerprint", async () => {
    const error = new Error("secret answer and page URL");
    error.stack = [
      "Error: secret answer and page URL",
      "at external (https://tracker.example/private.js:1:2)",
      `at render (${window.location.origin}/_build/app.js:12:34)`,
    ].join("\n");

    const report = await createClientErrorReport(
      "render",
      "/theory/$topicSlug",
      error,
    );

    expect(report).toEqual({
      kind: "render",
      route_id: "/theory/$topicSlug",
      fingerprint: "0a".repeat(32),
      asset_path: "/_build/app.js",
      line: 12,
      column: 34,
    });
    expect(JSON.stringify(report)).not.toContain("secret answer");
    expect(JSON.stringify(report)).not.toContain("tracker.example");
  });

  it("deduplicates reports and replaces unsafe route identifiers", async () => {
    const error = new Error("private value");

    await reportClientError("unhandled_error", "/search?q=private", error);
    await reportClientError("unhandled_error", "/search?q=private", error);

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/api/client-errors", {
      body: {
        kind: "unhandled_error",
        route_id: "/",
        fingerprint: "0a".repeat(32),
      },
    });
  });
});
