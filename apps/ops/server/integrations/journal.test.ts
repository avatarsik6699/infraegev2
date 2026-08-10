import { afterEach, describe, expect, it, vi } from "vitest";
import type { ProjectConfig } from "../core/config.js";
import { readJournal } from "./journal.js";

const project = {
  journal: { baseUrl: "http://journal.test" },
} as ProjectConfig;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("readJournal", () => {
  it("requests the latest bounded journal range without follow mode", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(""));
    vi.stubGlobal("fetch", fetchMock);

    await expect(readJournal(project)).resolves.toEqual([]);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe("http://journal.test/entries");
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      headers: {
        Accept: "application/json",
        Range: "entries=:-200:200",
      },
    });
  });
});
