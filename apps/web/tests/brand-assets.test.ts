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
  resolve(
    process.cwd(),
    "../..",
    "docs/artifacts/references/infraege-mark.svg",
  ),
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
  it("publishes the approved infraege mark and a source-faithful favicon", () => {
    const mark = readFileSync(publicPath("brand", "infraege-mark.svg"), "utf8");
    const favicon = readFileSync(publicPath("favicon.svg"), "utf8");
    const approvedPathCount = approvedSource.match(/<path\b/g)?.length ?? 0;

    expect(mark).toContain('viewBox="0 0 120 156"');
    expect(favicon).toContain('viewBox="-18 0 156 156"');
    expect(mark.match(/<path\b/g)).toHaveLength(approvedPathCount);
    expect(favicon.match(/<path\b/g)).toHaveLength(approvedPathCount);
    expect(mark.match(/class="stone-accent"/g)).toHaveLength(1);
    expect(mark.match(/class="stone-ink"/g)).toHaveLength(2);

    for (const source of [mark, favicon]) {
      expect(source).toContain('preserveAspectRatio="xMidYMid meet"');
      expect(source).not.toMatch(
        /<image\b|<text\b|<script\b|<filter\b|(?:href|src)=["']https?:\/\//i,
      );
    }
    expect(favicon).toContain("prefers-color-scheme: dark");
    expect(favicon).toContain(".stone-ink { fill: #fff; }");

    expect(generatorSource).toContain(
      "docs/artifacts/references/infraege-mark.svg",
    );
    expect(existsSync(publicPath("brand", "alchimia-mark.svg"))).toBe(false);
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
      readPngDimensions(publicPath("brand", "infraege-icon-192.png")),
    ).toEqual({ width: 192, height: 192 });
    expect(readPngColorType(publicPath("brand", "infraege-icon-192.png"))).toBe(
      2,
    );
    expect(
      readPngDimensions(publicPath("brand", "infraege-icon-512.png")),
    ).toEqual({ width: 512, height: 512 });
    expect(readPngColorType(publicPath("brand", "infraege-icon-512.png"))).toBe(
      2,
    );
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
      name: string;
      short_name: string;
      display: string;
      background_color: string;
      theme_color: string;
      icons: Array<Record<string, string>>;
    };

    expect(manifest).toEqual(
      expect.objectContaining({
        name: "infraege — подготовка к ЕГЭ по информатике",
        short_name: "infraege",
        display: "browser",
        background_color: "#f5f3ef",
        theme_color: "#f5f3ef",
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

  it("renders the infraege social lockup from local mark and fonts", () => {
    expect(generatorSource).toContain("color=c=0xF5F3EF:s=1200x630");
    expect(generatorSource).toContain("text='infraege'");
    expect(generatorSource).toContain("text='подготовка к ЕГЭ по информатике'");
    expect(generatorSource).not.toContain("drawbox");
  });
});
