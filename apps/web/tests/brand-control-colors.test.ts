import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sourcePath = (...parts: string[]) =>
  resolve(process.cwd(), "src", ...parts);

const themeSource = readFileSync(
  sourcePath("app", "styles", "theme.css"),
  "utf8",
);
const tokenSource = readFileSync(
  sourcePath("app", "styles", "tokens.css"),
  "utf8",
);

describe("restrained brand accents", () => {
  it("keeps public controls neutral and ALCHIMIA lab roles achromatic", () => {
    expect(themeSource).toContain("--theme-brand: #ff6b00");
    expect(themeSource).toContain("--theme-brand-ink: #f56300");
    expect(themeSource).toContain("--theme-primary: oklch(0.205 0 0)");
    expect(themeSource).toContain("--theme-primary-hover: oklch(0.145 0 0)");
    expect(themeSource).toContain("--theme-interactive-muted: oklch(0.97 0 0)");
    expect(themeSource.match(/#[\da-f]{6}/gi)).toEqual([
      "#ff6b00",
      "#f56300",
      "#ffffff",
      "#171717",
      "#606060",
      "#d4d4d4",
    ]);
    expect(tokenSource).toContain("--color-brand: var(--theme-brand)");
    expect(tokenSource).toContain("--control-primary-bg: var(--color-accent)");
    expect(tokenSource).toContain(
      "--control-primary-bg-hover: var(--color-accent-dark)",
    );
    expect(tokenSource).not.toContain("--control-primary-bg-active");
    expect(tokenSource).not.toContain("--control-quiet-bg-active");
  });

  it("restores regular geometry and neutral progress", () => {
    const badgeSource = readFileSync(
      sourcePath("shared", "components", "badge", "badge.module.css"),
      "utf8",
    );
    const progressSource = readFileSync(
      sourcePath("shared", "components", "progress", "progress.module.css"),
      "utf8",
    );

    expect(themeSource).toContain("--theme-radius-sm: 0.5rem");
    expect(badgeSource).toContain("border-radius: var(--radius-pill)");
    expect(progressSource).toContain("background: var(--color-text)");
  });

  it("keeps notation and code surfaces independent from the brand", () => {
    const notationSource = readFileSync(
      sourcePath("shared", "components", "notation", "notation.module.css"),
      "utf8",
    );
    const codeSource = readFileSync(
      sourcePath("shared", "components", "code-block", "code-block.module.css"),
      "utf8",
    );

    expect(`${notationSource}\n${codeSource}`).not.toContain(
      "--control-primary",
    );
    expect(notationSource).toContain("var(--color-surface-quiet)");
    expect(`${notationSource}\n${codeSource}`).not.toContain("--color-brand");
  });
});
