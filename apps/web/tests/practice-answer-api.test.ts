import { describe, expect, it, vi } from "vitest";
import { checkPracticeAnswer } from "~/features/lesson-practice/api/check-practice-answer";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("practice answer API", () => {
  it("returns the typed public checker result", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        correct: true,
        explanation: [{ type: "text", data: { markdown: "Разбор" } }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(checkPracticeAnswer("task-1", "42")).resolves.toEqual({
      correct: true,
      explanation: "Разбор",
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0]?.[0] as Request;
    expect(request.signal).toBeInstanceOf(AbortSignal);
  });

  it("classifies an HTTP failure and preserves its status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ detail: "failed" }, 503)),
    );

    await expect(checkPracticeAnswer("task-1", "42")).rejects.toMatchObject({
      name: "ApiError",
      kind: "http",
      status: 503,
    });
  });

  it("classifies a successful response without data as a protocol failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );

    await expect(checkPracticeAnswer("task-1", "42")).rejects.toMatchObject({
      name: "ApiError",
      kind: "protocol",
    });
  });

  it.each([
    ["timeout", new DOMException("timed out", "TimeoutError")],
    ["aborted", new DOMException("aborted", "AbortError")],
    ["transport", new TypeError("network failed")],
  ] as const)(
    "classifies a %s failure",
    async (
      kind: "timeout" | "aborted" | "transport",
      failure: DOMException | TypeError,
    ) => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(failure));

      await expect(checkPracticeAnswer("task-1", "42")).rejects.toMatchObject({
        name: "ApiError",
        kind,
      });
    },
  );
});
