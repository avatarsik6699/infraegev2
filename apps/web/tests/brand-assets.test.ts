import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const publicPath = (...parts: string[]) =>
  resolve(process.cwd(), "public", ...parts);
const generatorSource = readFileSync(
  resolve(process.cwd(), "../..", "scripts/generate-brand-assets.mjs"),
  "utf8",
);
const approvedSource = readFileSync(
  resolve(process.cwd(), "../..", "docs/artifacts/references/logo.svg"),
  "utf8",
);

function readPngDimensions(path: string): { width: number; height: number } {
  const source = readFileSync(path);
  expect(source.subarray(0, 8)).toEqual(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  );
  return { width: source.readUInt32BE(16), height: source.readUInt32BE(20) };
}

function readPngColorType(path: string): number {
  return readFileSync(path).readUInt8(25);
}

describe("production brand assets", () => {
  it("publishes the approved ALCHIMIA mark and a source-faithful favicon", () => {
    const mark = readFileSync(publicPath("brand", "alchimia-mark.svg"), "utf8");
    const favicon = readFileSync(publicPath("favicon.svg"), "utf8");
    const approvedPathCount = approvedSource.match(/<path\b/g)?.length ?? 0;
    const approvedGradientCount =
      approvedSource.match(/<linearGradient\b/g)?.length ?? 0;

    expect(mark).toContain('viewBox="0 0 2048 1639"');
    expect(favicon).toContain('viewBox="0 -204.5 2048 2048"');
    expect(mark.match(/<path\b/g)).toHaveLength(approvedPathCount);
    expect(favicon.match(/<path\b/g)).toHaveLength(approvedPathCount);
    expect(mark.match(/<linearGradient\b/g)).toHaveLength(
      approvedGradientCount,
    );
    expect(favicon.match(/<linearGradient\b/g)).toHaveLength(
      approvedGradientCount,
    );

    for (const source of [mark, favicon]) {
      expect(source).toContain('preserveAspectRatio="xMidYMid meet"');
      expect(source).not.toMatch(
        /<image\b|<text\b|<script\b|<filter\b|(?:href|src)=["']https?:\/\//i,
      );
    }
    expect(favicon).toContain("prefers-color-scheme: dark");
    expect(favicon).toContain("fill: #fff !important");

    expect(generatorSource).toContain("docs/artifacts/references/logo.svg");
    expect(existsSync(publicPath("brand", "infraege-mark.svg"))).toBe(false);
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
    expect(readPngColorType(publicPath("apple-touch-icon.png"))).toBe(2);
    expect(
      readPngDimensions(publicPath("brand", "alchimia-icon-192.png")),
    ).toEqual({ width: 192, height: 192 });
    expect(readPngColorType(publicPath("brand", "alchimia-icon-192.png"))).toBe(
      2,
    );
    expect(
      readPngDimensions(publicPath("brand", "alchimia-icon-512.png")),
    ).toEqual({ width: 512, height: 512 });
    expect(readPngColorType(publicPath("brand", "alchimia-icon-512.png"))).toBe(
      2,
    );
    expect(readPngDimensions(publicPath("brand/alchimia-social.png"))).toEqual({
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
      name: string;
      short_name: string;
      display: string;
      background_color: string;
      theme_color: string;
      icons: Array<Record<string, string>>;
    };

    expect(manifest).toEqual(
      expect.objectContaining({
        name: "ALCHIMIA — подготовка к ЕГЭ по информатике",
        short_name: "ALCHIMIA",
        display: "browser",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          expect.objectContaining({
            src: "/brand/alchimia-icon-192.png",
            sizes: "192x192",
            purpose: "any",
          }),
          expect.objectContaining({
            src: "/brand/alchimia-icon-512.png",
            sizes: "512x512",
            purpose: "any",
          }),
        ],
      }),
    );
  });

  it("centers only the final mark in the social preview", () => {
    expect(generatorSource).toContain("overlay=(W-w)/2:(H-h)/2:format=auto");
    expect(generatorSource).not.toContain("drawtext");
    expect(generatorSource).not.toContain("drawbox");
  });
});
