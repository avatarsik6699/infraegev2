import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  componentContracts,
  widgetContracts,
} from "../src/pages/design-system-lab/catalog-contracts";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");
const contracts = [
  ...Object.values(componentContracts).flat(),
  ...Object.values(widgetContracts).flat(),
];

describe("live infraege design-system catalog", () => {
  it("gives every catalog entry a unique name and a useful context note", () => {
    const names = contracts.map((entry) => entry.name);
    expect(new Set(names).size).toBe(names.length);
    for (const entry of contracts)
      expect(entry.note.trim().length).toBeGreaterThan(0);
  });

  it("inherits the production theme instead of overriding controls inside the lab", () => {
    const css = read(
      "src/pages/design-system-lab/design-system-lab.module.css",
    );
    expect(css).not.toMatch(/--(?:color|font|control|input)-[\w-]+\s*:/);
    expect(css).not.toContain("alchimia");
    expect(css).not.toMatch(/\.page\s+(?:h[1-6]|input|button)\b/);
    const theme = read("src/app/styles/theme.css");
    const tokens = read("src/app/styles/tokens.css");
    expect(theme + tokens).not.toMatch(/--[\w-]*alchimia/);
    expect(tokens).toContain("--color-brand-canvas: var(--color-bg)");
    expect(tokens).toContain("--color-brand-ink: var(--color-text)");
    expect(tokens).toContain("--color-brand-muted: var(--color-text-soft)");
  });

  it("preserves the self-hosted typefaces and delivery files when retiring historical aliases", () => {
    const fonts = read("src/app/styles/fonts.css");
    expect(fonts).not.toContain("Alchimia");
    for (const face of ["Alegreya", "Golos Text", "JetBrains Mono"]) {
      expect(fonts).toContain(`font-family: "Infraege ${face}"`);
    }
    for (const match of fonts.matchAll(/url\("([^"]+)"\)/g)) {
      expect(
        existsSync(resolve(process.cwd(), "public", match[1]!.slice(1))),
      ).toBe(true);
    }
  });

  it("records real consumer and state evidence for every contract", () => {
    const matrix = read("../../docs/artifacts/infraege-ui-migration.md");
    for (const entry of contracts)
      expect(matrix).toContain(`\`${entry.name}\``);
    for (const route of [
      "/",
      "/ege",
      "/courses",
      "/courses/python",
      "/ege/16-rekursiya",
      "/privacy",
      "/removed-route",
      "/lab/design-system",
    ]) {
      expect(matrix).toContain(`\`${route}\``);
    }
  });
});
