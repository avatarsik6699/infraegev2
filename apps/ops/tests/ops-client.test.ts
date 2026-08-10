// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchDashboard, fetchProjects } from "~/pages/dashboard/api/ops-client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ops API client", () => {
  it("rejects non-success responses before decoding JSON", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad", { status: 503 })));
    await expect(fetchProjects(new AbortController().signal)).rejects.toThrow(
      "ops API HTTP 503",
    );
  });

  it("encodes the project and range query", async () => {
    const request = vi.fn<typeof fetch>();
    request.mockResolvedValue(Response.json({}));
    vi.stubGlobal("fetch", request);
    await fetchDashboard("project / one", "7d", new AbortController().signal);
    expect(request.mock.calls[0]?.[0]).toBe(
      "/api/dashboard?project=project+%2F+one&range=7d",
    );
  });
});
