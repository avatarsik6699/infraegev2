import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const publicPath = (...parts: string[]) =>
  resolve(process.cwd(), "public", ...parts);

function readPngDimensions(path: string): { width: number; height: number } {
  const source = readFileSync(path);
  expect(source.subarray(0, 8)).toEqual(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  );
  return { width: source.readUInt32BE(16), height: source.readUInt32BE(20) };
}

describe("production brand assets", () => {
  it("publishes the normalized SVG marks without an opaque canvas", () => {
    for (const name of ["infraege-mark.svg", "infraege-mark-baseline.svg"]) {
      const source = readFileSync(publicPath("brand", name), "utf8");
      expect(source).toContain('preserveAspectRatio="xMidYMid meet"');
      expect(source).not.toContain('d="M 0 0 L 2048 0 L 2048 1597');
      expect(source).not.toMatch(
        /<text\b|<script\b|(?:href|src)=["']https?:\/\//i,
      );
    }
  });

  it("publishes every required raster size", () => {
    expect(readPngDimensions(publicPath("favicon-16x16.png"))).toEqual({
      width: 16,
      height: 16,
    });
    expect(readPngDimensions(publicPath("favicon-32x32.png"))).toEqual({
      width: 32,
      height: 32,
    });
    expect(readPngDimensions(publicPath("apple-touch-icon.png"))).toEqual({
      width: 180,
      height: 180,
    });
    expect(
      readPngDimensions(publicPath("brand", "infraege-icon-192.png")),
    ).toEqual({ width: 192, height: 192 });
    expect(
      readPngDimensions(publicPath("brand", "infraege-icon-512.png")),
    ).toEqual({ width: 512, height: 512 });
    expect(readPngDimensions(publicPath("brand/infraege-social.png"))).toEqual({
      width: 1200,
      height: 630,
    });

    const ico = readFileSync(publicPath("favicon.ico"));
    expect(ico.readUInt16LE(4)).toBe(2);
  });

  it("keeps the browser-only manifest neutral and declares production icons", () => {
    const manifest = JSON.parse(
      readFileSync(publicPath("site.webmanifest"), "utf8"),
    ) as {
      display: string;
      background_color: string;
      theme_color: string;
      icons: Array<Record<string, string>>;
    };

    expect(manifest).toEqual(
      expect.objectContaining({
        display: "browser",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          expect.objectContaining({
            src: "/brand/infraege-icon-192.png",
            sizes: "192x192",
            purpose: "any",
          }),
          expect.objectContaining({
            src: "/brand/infraege-icon-512.png",
            sizes: "512x512",
            purpose: "any",
          }),
        ],
      }),
    );
  });
});
