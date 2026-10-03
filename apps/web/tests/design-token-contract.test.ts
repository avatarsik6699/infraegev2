import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoPath = (...parts: string[]) =>
  resolve(process.cwd(), "../..", ...parts);
const stylePath = (name: string) =>
  resolve(process.cwd(), "src", "app", "styles", name);

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const themeSource = stripComments(readFileSync(stylePath("theme.css"), "utf8"));
const tokenSource = stripComments(
  readFileSync(stylePath("tokens.css"), "utf8"),
);
const fontSource = stripComments(readFileSync(stylePath("fonts.css"), "utf8"));
const rootSource = readFileSync(
  resolve(process.cwd(), "src", "routes", "__root.tsx"),
  "utf8",
);
const designSource = readFileSync(repoPath("DESIGN.md"), "utf8");
const productionNginxSource = readFileSync(
  repoPath("infra/nginx/conf.d/infraege.prod.conf"),
  "utf8",
);

const declaredNames = (css: string) =>
  [...css.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]);
const themeReferences = (css: string) =>
  [...css.matchAll(/var\(\s*(--theme-[\w-]+)/g)].map((match) => match[1]);

describe("design token layering", () => {
  it("keeps raw values in theme.css and only theme tokens there", () => {
    const names = declaredNames(themeSource);
    expect(names.length).toBeGreaterThan(0);
    expect(names.filter((name) => !name.startsWith("--theme-"))).toEqual([]);
  });

  it("resolves every theme reference in tokens.css", () => {
    const defined = new Set(declaredNames(themeSource));
    const missing = themeReferences(tokenSource).filter(
      (name) => !defined.has(name),
    );
    expect(missing).toEqual([]);
  });

  it("keeps every DESIGN.md colour token in the theme", () => {
    const frontmatter = designSource.split("---")[1] ?? "";
    const colorsBlock = frontmatter.split(/\n(?:typography|rounded):/)[0];
    const colors = [...colorsBlock.matchAll(/:\s*"(#[0-9a-f]{6})"/gi)].map(
      (match) => match[1].toLowerCase(),
    );
    const themeColors = themeSource.toLowerCase();
    expect(colors.length).toBeGreaterThan(10);
    expect(colors.filter((color) => !themeColors.includes(color))).toEqual([]);
  });
});

describe("self-hosted font delivery", () => {
  const faces = [...fontSource.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(
    (match) => match[1],
  );
  const family = (face: string) => /font-family:\s*"([^"]+)"/.exec(face)?.[1];
  const webFaces = faces.filter((face) => face.includes("url("));
  const fallbackFaces = faces.filter((face) => face.includes("local("));

  it("serves existing files with optional display", () => {
    expect(webFaces.length).toBeGreaterThan(0);
    for (const face of webFaces) {
      expect(face).toContain("font-display: optional");
      const url = /url\("([^"]+)"\)/.exec(face)?.[1] ?? "";
      expect(existsSync(resolve(process.cwd(), "public", `.${url}`))).toBe(
        true,
      );
    }
  });

  it("pairs every web family with a metric-matched fallback in the stack", () => {
    const fallbacks = new Set(fallbackFaces.map(family));
    for (const face of fallbackFaces) {
      expect(face).toMatch(/size-adjust:\s*[\d.]+%/);
      expect(face).toMatch(/ascent-override:\s*[\d.]+%/);
    }
    for (const webFamily of new Set(webFaces.map(family))) {
      const stack = new RegExp(`"${webFamily}",\\s*"([^"]+ Fallback)"`).exec(
        themeSource,
      );
      expect(
        stack,
        `${webFamily} is used by a theme font stack`,
      ).not.toBeNull();
      expect(fallbacks.has(stack?.[1])).toBe(true);
    }
  });

  it("preloads only files that exist and keeps the /fonts/ cache rule", () => {
    const preloads = [
      ...rootSource.matchAll(/href:\s*"(\/fonts\/[^"]+\.woff2)"/g),
    ].map((match) => match[1]);
    expect(preloads.length).toBeGreaterThan(0);
    for (const href of preloads)
      expect(existsSync(resolve(process.cwd(), "public", `.${href}`))).toBe(
        true,
      );
    expect(productionNginxSource).toContain("location ^~ /fonts/");
    expect(productionNginxSource).toContain(
      'add_header Cache-Control "public, max-age=604800" always',
    );
  });
});
