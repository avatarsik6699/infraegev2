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
  it("promotes the approved monochrome ALCHIMIA palette without legacy color roles", () => {
    expect(themeSource).not.toContain("--theme-brand");
    expect(themeSource).not.toContain("#ff6b00");
    expect(themeSource).not.toContain("#f56300");
    expect(themeSource).toContain("--theme-page: #ffffff");
    expect(themeSource).toContain("--theme-ink: #171717");
    expect(themeSource).toContain("--theme-ink-secondary: #606060");
    expect(themeSource).toContain("--theme-rule: #d4d4d4");
    expect(themeSource).toContain("--theme-primary: #171717");
    expect(themeSource).toContain("--theme-primary-hover: #606060");
    expect(themeSource).toContain("--theme-interactive-muted: oklch(0.97 0 0)");
    expect(tokenSource).not.toContain("--color-brand");
    expect(tokenSource).toContain("--control-primary-bg: var(--color-accent)");
    expect(tokenSource).toContain(
      "--control-primary-bg-hover: var(--color-accent-dark)",
    );
    expect(tokenSource).not.toContain("--control-primary-bg-active");
    expect(tokenSource).not.toContain("--control-quiet-bg-active");
  });

  it("promotes the approved typography through semantic roles", () => {
    const titleSource = readFileSync(
      sourcePath(
        "shared",
        "components",
        "typography",
        "components",
        "typography-title.module.css",
      ),
      "utf8",
    );

    expect(themeSource).toContain(
      '"Alchimia Cormorant SC", "Cormorant SC", Georgia, serif',
    );
    expect(themeSource).toContain(
      '"Alchimia Literata", "Literata Fallback", Georgia, serif',
    );
    expect(themeSource).toContain(
      '"Alchimia IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
    );
    expect(tokenSource).toContain("--font-display: var(--theme-font-display)");
    expect(titleSource).toContain("font-family: var(--font-display)");
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
    expect(badgeSource).toContain(
      "border-radius: var(--badge-radius, var(--radius-pill))",
    );
    expect(progressSource).toContain(
      "background: var(--progress-indicator-background, var(--color-text))",
    );
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
