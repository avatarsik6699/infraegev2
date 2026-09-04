import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readWorkspaceFile = (...parts: string[]) =>
  readFileSync(resolve(process.cwd(), "../..", ...parts), "utf8");

const runtimeExportsFrom = (barrels: readonly string[]) =>
  barrels.flatMap((barrel) =>
    Array.from(
      readFileSync(barrel, "utf8").matchAll(/export\s*{([^}]+)}/gs),
      (match) => match[1]!,
    ).flatMap((declaration) =>
      declaration
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name && !name.startsWith("type "))
        .map((name) => name.split(/\s+as\s+/u)[1] ?? name),
    ),
  );

const catalogContractsFrom = (catalog: string) =>
  [...catalog.matchAll(/(?:live|candidate|context)\(\s*"([A-Za-z0-9]+)"/g)].map(
    (match) => match[1]!,
  );

describe("ALCHIMIA design-system lab identity", () => {
  it("keeps the page-local mark source-faithful", () => {
    const suppliedMark = readWorkspaceFile(
      "docs",
      "artifacts",
      "references",
      "logo.svg",
    );
    const labMark = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "widgets",
      "public-header",
      "assets",
      "alchimia-mark.svg",
    );

    expect(labMark).toContain('viewBox="0 0 2048 1639"');
    expect(labMark.match(/<path\b/g)).toHaveLength(
      suppliedMark.match(/<path\b/g)?.length ?? 0,
    );
    expect(labMark).not.toMatch(/<(?:script|image|text)\b/i);
    expect(labMark).not.toMatch(/(?:href|src)=["']https?:\/\//i);
    expect(
      existsSync(
        resolve(
          process.cwd(),
          "../..",
          "docs/artifacts/references/logo_with_transperant_bg.svg",
        ),
      ),
    ).toBe(false);
  });

  it("self-hosts the selected Athanor typography roles", () => {
    const fontsCss = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "app",
      "styles",
      "fonts.css",
    );
    const fontFiles = [
      ["alegreya", "alegreya-cyrillic-wght-normal.woff2"],
      ["alegreya", "alegreya-latin-wght-normal.woff2"],
      ["golos-text", "golos-text-cyrillic-wght-normal.woff2"],
      ["golos-text", "golos-text-latin-wght-normal.woff2"],
      ["jetbrains-mono", "jetbrains-mono-cyrillic-wght-normal.woff2"],
      ["jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2"],
    ];

    expect(fontsCss).toContain('font-family: "Alchimia Alegreya"');
    expect(fontsCss).toContain('font-family: "Alchimia Golos Text"');
    expect(fontsCss).toContain('font-family: "Alchimia JetBrains Mono"');
    for (const [family, fontFile] of fontFiles) {
      expect(
        existsSync(resolve(process.cwd(), "public", "fonts", family, fontFile)),
      ).toBe(true);
    }

    const titleComponent = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "shared",
      "components",
      "typography",
      "components",
      "typography-title.tsx",
    );
    const systemCatalog = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "system-catalog.tsx",
    );

    expect(titleComponent).not.toContain("data-title-role");
    expect(titleComponent).not.toContain("variant =");
    expect(systemCatalog).toContain("Все стандартные заголовки");
    expect(systemCatalog).not.toContain('variant="content"');
    expect(systemCatalog).toContain("Уровень h1–h6 задаёт структуру документа");
  });

  it("keeps the ALCHIMIA lab palette achromatic above its accepted paper", () => {
    const themeCss = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "app",
      "styles",
      "theme.css",
    );
    const labConstants = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "design-system-lab.constants.ts",
    );
    const roles = ["paper", "ink", "ink-secondary", "rule"];

    for (const role of roles) {
      expect(themeCss).toContain(`--theme-alchimia-${role}:`);
      expect(labConstants).toContain(`--color-alchimia-${role}`);
    }
    expect(themeCss).not.toContain("--theme-alchimia-copper");
    expect(labConstants).not.toContain("--color-alchimia-copper");
    expect(labConstants).not.toContain("--color-accent");
  });

  it("defines five global semantic rhythm levels without introducing new surfaces", () => {
    const tokensCss = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "app",
      "styles",
      "tokens.css",
    );
    const labCss = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "design-system-lab.module.css",
    );
    const labConstants = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "design-system-lab.constants.ts",
    );
    const rhythmSpecimen = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "rhythm-specimen.tsx",
    );

    expect(labConstants).toContain('id: "system-rhythm"');
    expect(tokensCss).toContain("--rhythm-content-flow: var(--space-1-5)");
    expect(tokensCss).toContain("--rhythm-section-entry: var(--space-2)");
    expect(tokensCss).toContain("--rhythm-related-block: var(--space-3)");
    expect(tokensCss).toContain("--rhythm-concept-separation: var(--space-5)");
    expect(tokensCss).toContain("--rhythm-section-separation: var(--space-6)");
    expect(labCss).not.toMatch(/--rhythm-[\w-]+\s*:/u);
    expect(rhythmSpecimen).toContain('data-rhythm-role="content"');
    expect(rhythmSpecimen).toContain('data-rhythm-role="related"');
    expect(rhythmSpecimen).toContain('data-rhythm-role="concept"');
    expect(rhythmSpecimen).toContain('data-rhythm-role="section"');
  });

  it("defines one surface signal for each lab boundary role", () => {
    const labCss = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "design-system-lab.module.css",
    );
    const labConstants = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "design-system-lab.constants.ts",
    );
    const surfaceSpecimen = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "surface-specimen.tsx",
    );

    expect(labConstants).toContain('id: "system-surfaces"');
    expect(labCss).toContain("--lab-surface-base:");
    expect(labCss).toContain("--lab-surface-quiet:");
    expect(labCss).toContain("--lab-rule:");
    for (const role of ["base", "quiet", "bounded", "separator"]) {
      expect(surfaceSpecimen).toContain(`data-surface-role="${role}"`);
    }
    expect(labCss).not.toContain(".surfaceQuiet {\n  border:");
    expect(labCss).not.toContain(".surfaceBounded {\n  box-shadow:");
  });

  it("uses standard structural lines without runtime atlas decoration", () => {
    const labCss = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "design-system-lab.module.css",
    );
    const labSources = [
      "design-system-lab.tsx",
      "catalog-layout.tsx",
      "control-specimen.tsx",
      "surface-specimen.tsx",
      "system-catalog.tsx",
    ]
      .map((file) =>
        readWorkspaceFile(
          "apps",
          "web",
          "src",
          "pages",
          "design-system-lab",
          file,
        ),
      )
      .join("\n");
    const labRoot = resolve(process.cwd(), "src", "pages", "design-system-lab");

    expect(labSources).not.toContain("ReferencePattern");
    expect(labSources).not.toContain("data-reference-pattern");
    expect(labSources).not.toContain("patterns-lines.png");
    expect(existsSync(resolve(labRoot, "reference-pattern.tsx"))).toBe(false);
    expect(existsSync(resolve(labRoot, "assets", "patterns-lines.png"))).toBe(
      false,
    );
    expect(labCss).toContain("border: 1px solid var(--lab-rule)");
    expect(labCss).toContain("border-left: 1px solid var(--color-rule)");
    expect(labCss).toContain("border-right: 1px solid var(--color-rule)");
    expect(labCss).toContain("border-block: 1px solid var(--color-rule)");
    expect(labCss).toContain("border-top: 1px solid var(--lab-rule)");
    expect(labCss).toContain("border-bottom: 1px solid var(--color-rule)");
    expect(labCss).not.toContain("mask-image:");
    expect(labCss).not.toContain(".dashboardRule");
    expect(labCss).not.toContain(".orbitOrnament");
    expect(labCss).not.toContain(".controlSpecimenMarker");
    expect(labCss).not.toContain(".catalogNavigationRule");
    expect(labCss).not.toContain(".patternDivider");
  });

  it("applies the accepted system to control and state specimens locally", () => {
    const labCss = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "design-system-lab.module.css",
    );
    const specimenSource = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "control-specimen.tsx",
    );

    expect(labCss).toContain("--control-primary-bg: var(--color-alchimia-ink)");
    expect(labCss).toContain("--control-secondary-border: var(--lab-rule)");
    expect(labCss).toContain(
      "--control-quiet-bg-hover: var(--lab-surface-quiet)",
    );
    expect(specimenSource).toContain("data-control-specimen={kind}");
    expect(specimenSource).not.toContain("marker");
  });

  it("publishes accepted component defaults instead of keeping lab-only aliases", () => {
    const tokens = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "app",
      "styles",
      "tokens.css",
    );
    const labCss = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "design-system-lab.module.css",
    );
    const componentTokens = [
      "--input-min-height",
      "--input-placeholder-color",
      "--accordion-item-border",
      "--accordion-chevron-open-transform",
      "--badge-height",
      "--progress-height",
      "--progress-indicator-background",
    ];

    for (const token of componentTokens) {
      expect(tokens).toContain(`${token}:`);
      expect(labCss).not.toContain(`${token}:`);
    }
    expect(labCss).not.toContain(".page [data-badge]");
    expect(labCss).not.toContain(".page input");
  });

  it("maps every accepted catalog contract to the public migration record", () => {
    const componentCatalog = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "components-catalog.tsx",
    );
    const widgetCatalog = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "widgets-catalog.tsx",
    );
    const matrix = readWorkspaceFile(
      "docs",
      "artifacts",
      "alchimia-public-migration-matrix.md",
    );

    for (const contract of [
      ...catalogContractsFrom(componentCatalog),
      ...catalogContractsFrom(widgetCatalog),
    ]) {
      expect(matrix).toContain(`\`${contract}\``);
    }
    for (const route of [
      "/",
      "/courses/python",
      "/courses/python/pervaya-programma",
      "/ege/16-rekursiya",
      "/privacy",
      "/removed-route",
      "/lab/design-system",
      "/lab/lesson",
    ]) {
      expect(matrix).toContain(`\`${route}\``);
    }
  });

  it("renders the refined catalog as visual specimens instead of prose inventories", () => {
    const dashboardSource = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "design-system-lab.tsx",
    );
    const systemSource = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "system-catalog.tsx",
    );
    const tokenSource = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "system-token-specimen.tsx",
    );
    const tokenPreviewSource = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "semantic-token-preview.tsx",
    );
    const labCss = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "design-system-lab.module.css",
    );
    const semanticTokens = [
      "--color-bg",
      "--color-surface",
      "--color-surface-quiet",
      "--color-text",
      "--color-text-soft",
      "--color-rule",
      "--color-focus",
      "--color-success",
      "--color-info",
      "--color-warning",
      "--color-danger",
      "--text-xs",
      "--text-base",
      "--text-lg",
      "--text-xl",
      "--measure-reading",
      "--measure-lesson",
      "--measure-wide",
      "--max-content-width",
      "--radius-control",
      "--radius-surface",
      "--radius-pill",
      "--shadow-overlay",
      "--focus-ring",
      "--motion-duration",
      "--motion-easing",
    ];
    const iconNames = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUpRight",
      "Check",
      "ChevronDown",
      "CircleCheck",
      "CircleHelp",
      "Copy",
      "Download",
      "FileText",
      "ImageOff",
      "Lightbulb",
      "Link",
      "TriangleAlert",
    ];

    expect(dashboardSource).not.toContain("styles.intro");
    expect(dashboardSource).not.toContain("Дизайн-система");
    expect(dashboardSource).not.toContain(
      "Desktop-каталог визуальных контрактов приложения",
    );
    expect(labCss).not.toContain(".intro");
    expect(labCss).not.toContain(".pageTitle");
    expect(labCss).not.toContain(".lede");
    expect(systemSource).toContain("data-palette-groups");
    expect(systemSource).toContain('data-palette-group="core"');
    expect(systemSource).toContain('data-palette-group="tonal"');
    for (const token of semanticTokens) {
      expect(tokenSource).toContain(`name: "${token}"`);
    }
    expect(tokenPreviewSource).toContain("`var(${token.name})`");
    expect(tokenSource).toContain("data-spacing-token-preview");
    expect(tokenPreviewSource).toContain("data-token-preview");
    for (const icon of iconNames) {
      expect(systemSource).toContain(`name: "${icon}"`);
      expect(systemSource).toContain(`Icon: ${icon}`);
    }
    expect(systemSource).toContain("data-icon-specimen={name}");
    expect(systemSource).not.toContain("Интерфейс использует один stroke-язык");
  });

  it("documents layout, accessibility, token architecture and content language as system contracts", () => {
    const labRoot = [
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
    ] as const;
    const constants = readWorkspaceFile(
      ...labRoot,
      "design-system-lab.constants.ts",
    );
    const layout = readWorkspaceFile(...labRoot, "system-layout-specimen.tsx");
    const accessibility = readWorkspaceFile(
      ...labRoot,
      "system-accessibility-specimen.tsx",
    );
    const tokens = readWorkspaceFile(...labRoot, "system-token-specimen.tsx");
    const contentLanguage = readWorkspaceFile(
      ...labRoot,
      "system-content-language-specimen.tsx",
    );

    for (const section of [
      "system-layout",
      "system-accessibility",
      "system-tokens",
      "system-content-language",
    ]) {
      expect(constants).toContain(`id: "${section}"`);
    }
    expect(constants).not.toContain('id: "system-patterns"');
    expect(layout).toContain('data-layout-specimen="wide"');
    expect(layout).toContain('data-layout-specimen="narrow"');
    for (const state of [
      "focus",
      "target",
      "selection",
      "scrollbar",
      "motion",
    ]) {
      expect(accessibility).toContain(`data-browser-state="${state}"`);
    }
    expect(tokens).toContain('aria-label="Архитектура токенов"');
    expect(tokens).toContain("--theme-*");
    expect(tokens).toContain("component.module.css");
    expect(contentLanguage).toContain('aria-label="Порядок введения идеи"');
    expect(contentLanguage).toContain("data-copy-contract={pair.title}");
    expect(contentLanguage).not.toContain("LessonPracticeFlow");
  });

  it("reconciles the component catalog with live and context-bound public UI contracts", () => {
    const catalog = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "components-catalog.tsx",
    );
    const contractMap = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "catalog-contract-map.tsx",
    );
    const componentsRoot = resolve(
      process.cwd(),
      "src",
      "shared",
      "components",
    );
    const publicVisualBarrels = [
      ...readdirSync(componentsRoot, { withFileTypes: true })
        .filter(
          (entry) =>
            entry.isDirectory() &&
            existsSync(resolve(componentsRoot, entry.name, "index.ts")),
        )
        .map((entry) => resolve(componentsRoot, entry.name, "index.ts")),
      resolve(process.cwd(), "src/entities/learning-visual/index.ts"),
      resolve(process.cwd(), "src/features/analytics/index.ts"),
      resolve(process.cwd(), "src/features/lesson-practice/index.ts"),
      resolve(process.cwd(), "src/features/lesson-progress/index.ts"),
      resolve(process.cwd(), "src/features/reading-position/index.ts"),
    ];
    const nonVisualRuntimeExports = new Set([
      "analyticsConsentStore",
      "checkPracticeAnswer",
      "createLocalPracticeChecker",
      "LessonProgressProvider",
      "reportProductEvent",
      "useLessonProgress",
      "useLessonsProgress",
      "useLessonTelemetry",
    ]);
    const runtimeExports = runtimeExportsFrom(publicVisualBarrels);
    const visualExports = [...new Set(runtimeExports)]
      .filter((name) => !nonVisualRuntimeExports.has(name))
      .sort();
    const catalogContracts = catalogContractsFrom(catalog).sort();
    const newlyVisibleContracts = [
      "LearningVisualFrame",
      "LessonIntro",
      "LessonSectionHeading",
      "LessonTheory",
      "LessonPractice",
      "LessonProgress",
      "ConfirmationDialog",
    ];
    const contextBoundContracts = [
      "AnalyticsConsentControl",
      "AnalyticsConsentPrompt",
      "ReadingPositionIndicator",
    ];

    expect(catalogContracts).toEqual(visualExports);
    expect(new Set(catalogContracts).size).toBe(catalogContracts.length);
    expect(existsSync(resolve(componentsRoot, "divider", "index.ts"))).toBe(
      false,
    );
    expect(catalog).not.toContain("Divider");
    expect(catalog).not.toContain('live("Tabs"');
    for (const name of newlyVisibleContracts) {
      expect(catalog).toContain(`data-component-specimen="${name}"`);
    }
    for (const name of contextBoundContracts) {
      expect(catalog).toContain(`"${name}"`);
    }
    expect(contractMap).toContain("data-contract-status={contract.status}");
    expect(catalog).toContain("createLocalPracticeChecker");
    expect(catalog).not.toContain("<LessonPracticeFlow");
    expect(catalog).not.toContain("AnalyticsConsentControl />");
    expect(catalog).not.toContain("AnalyticsConsentPrompt />");
    expect(catalog).not.toContain("<ReadingPositionIndicator");
    expect(catalog).toContain("data-progress-state={state.id}");
    expect(catalog).toContain('data-practice-mode="error"');
  });

  it("reconciles the widget catalog with every public widget barrel", () => {
    const catalog = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "widgets-catalog.tsx",
    );
    const flowSpecimen = readWorkspaceFile(
      "apps",
      "web",
      "src",
      "pages",
      "design-system-lab",
      "widget-practice-flow-specimen.tsx",
    );
    const widgetsRoot = resolve(process.cwd(), "src", "widgets");
    const widgetBarrels = readdirSync(widgetsRoot, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() &&
          existsSync(resolve(widgetsRoot, entry.name, "index.ts")),
      )
      .map((entry) => resolve(widgetsRoot, entry.name, "index.ts"));
    const widgetExports = [
      ...new Set(runtimeExportsFrom(widgetBarrels)),
    ].sort();
    const catalogContracts = catalogContractsFrom(catalog).sort();

    expect(catalogContracts).toEqual(widgetExports);
    expect(widgetExports).toHaveLength(4);
    expect(catalog).toContain(
      'live("PublicHeader", "Компактная ALCHIMIA-айдентика публичных страниц")',
    );
    expect(catalog).toContain('data-widget-assembly="public-page"');
    expect(catalog).toContain('data-widget-assembly="lesson-page"');
    expect(flowSpecimen).toContain(
      'const specimenLessonId = "design-system-widget-practice"',
    );
    expect(flowSpecimen).toContain("progress.clear()");
    expect(flowSpecimen).toContain("data-widget-flow-progress");
  });
});
