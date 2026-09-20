// @vitest-environment node
import { describe, expect, it } from "vitest";
import { httpCompression } from "~/shared/lib/http-compression";

const html = "<h1>Рекурсивные алгоритмы</h1>".repeat(100);
const response = (headers: HeadersInit = {}) =>
  new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", ...headers },
  });
const request = (encoding: string) =>
  new Request("http://localhost/lesson", {
    headers: { "accept-encoding": encoding },
  });

describe("HTML response compression", () => {
  it("streams a lossless gzip response with representation-safe headers", async () => {
    const result = httpCompression.html(
      request("br, gzip"),
      response({
        "content-length": "1234",
        vary: "Origin",
        etag: '"lesson"',
      }),
    );
    expect(result.headers.get("content-encoding")).toBe("gzip");
    expect(result.headers.has("content-length")).toBe(false);
    expect(result.headers.get("vary")).toBe("Origin, Accept-Encoding");
    expect(result.headers.get("etag")).toBe('W/"lesson"');
    const decoded = new Response(
      result.body!.pipeThrough(new DecompressionStream("gzip")),
    );
    expect(await decoded.text()).toBe(html);
  });

  it.each(["", "br", "gzip;q=0", "gzip;q=0, *;q=1"])(
    "preserves identity for %s",
    async (encoding) => {
      const result = httpCompression.html(request(encoding), response());
      expect(result.headers.has("content-encoding")).toBe(false);
      expect(result.headers.get("vary")).toBe("Accept-Encoding");
      expect(await result.text()).toBe(html);
    },
  );

  it.each<Record<string, string>>([
    { "content-type": "text/event-stream" },
    { "content-encoding": "br" },
    { "set-cookie": "session=opaque" },
    { "cache-control": "public, no-transform" },
  ])("leaves excluded responses untouched: %j", (headers) => {
    const original = response(headers);
    expect(httpCompression.html(request("gzip"), original)).toBe(original);
  });

  it.each(["cookie", "authorization"])(
    "does not compress personalized %s requests",
    (header) => {
      const personalized = request("gzip");
      personalized.headers.set(header, "opaque");
      const original = response();
      expect(httpCompression.html(personalized, original)).toBe(original);
    },
  );
});
