import { expect, type Page } from "@playwright/test";

export class DesignSystemLabPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/lab/design-system");
    await expect(this.page).toHaveURL(/\/lab\/design-system$/);
  }

  async expectCatalogStructure(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        level: 1,
        name: "Дизайн-система",
      }),
    ).toHaveCount(0);
    await expect(
      this.page.getByText("Desktop-каталог визуальных контрактов приложения"),
    ).toHaveCount(0);
    const header = this.page.locator(
      "[data-alchimia-lab-root] > [data-alchimia-header]",
    );
    const mark = header.locator("[data-alchimia-mark]");
    const wordmark = header.locator("[data-alchimia-wordmark]");
    await expect(wordmark).toBeVisible();
    await expect(mark).toBeVisible();
    const dashboardTabs = this.page.getByRole("tablist", {
      name: "Уровни дизайн-системы",
    });
    await expect(dashboardTabs).toBeVisible();
    await expect(dashboardTabs.getByRole("tab")).toHaveCount(3);
    await expect(
      this.page.locator(
        "#system-identity, #system-typography, #system-color, #system-surfaces, #system-layout, #system-accessibility, #system-tokens, #system-rhythm, #system-icons, #system-content-language",
      ),
    ).toHaveCount(10);
    const views = [
      { tab: /^Компоненты/, heading: "Компоненты", sectionCount: 7 },
      { tab: /^Виджеты/, heading: "Виджеты", sectionCount: 4 },
    ] as const;
    for (const view of views) {
      await dashboardTabs.getByRole("tab", { name: view.tab }).click();
      await expect(
        this.page.getByRole("heading", { level: 2, name: view.heading }),
      ).toBeVisible();
      await expect(
        this.page.locator(
          `[data-dashboard-panel]:not([hidden]) [data-catalog-canvas] > section`,
        ),
      ).toHaveCount(view.sectionCount);
    }
    const systemTab = dashboardTabs.getByRole("tab", { name: /^Система/ });
    await systemTab.click();
    await systemTab.focus();
    await systemTab.press("ArrowRight");
    await expect(
      dashboardTabs.getByRole("tab", { name: /^Компоненты/ }),
    ).toHaveAttribute("aria-selected", "true");
    await systemTab.click();

    await this.page.evaluate(async () => {
      await document.fonts.ready;
    });
    const typography = await this.page.evaluate(() => {
      const display = document.querySelector<HTMLElement>(
        "#system-identity-heading",
      );
      const reading = document.querySelector<HTMLElement>(
        "[data-alchimia-reading]",
      );
      const service = document.querySelector<HTMLElement>(
        "[aria-label='Уровни дизайн-системы'] [role='tab']",
      );
      const palette = document.querySelector<HTMLElement>(
        "[data-alchimia-palette]",
      );
      const swatchColor = (role: string) => {
        const swatch = palette?.querySelector<HTMLElement>(
          `[data-color-role='${role}'] > span`,
        );
        return swatch ? getComputedStyle(swatch).backgroundColor : "";
      };
      return {
        display: display ? getComputedStyle(display).fontFamily : "",
        reading: reading ? getComputedStyle(reading).fontFamily : "",
        service: service ? getComputedStyle(service).fontFamily : "",
        primaryColor: display ? getComputedStyle(display).color : "",
        secondaryColor: reading ? getComputedStyle(reading).color : "",
        pageBackground: palette
          ? getComputedStyle(palette.closest("[data-alchimia-lab-root]")!)
              .backgroundColor
          : "",
        palette: {
          paper: swatchColor("--color-alchimia-paper"),
          ink: swatchColor("--color-alchimia-ink"),
          secondary: swatchColor("--color-alchimia-ink-secondary"),
          rule: swatchColor("--color-alchimia-rule"),
        },
      };
    });
    expect(typography.display).toContain("Alchimia Cormorant SC");
    expect(typography.reading).toContain("Alchimia Literata");
    expect(typography.service).toContain("Alchimia IBM Plex Mono");
    expect(typography.primaryColor).toBe("rgb(23, 23, 23)");
    expect(typography.secondaryColor).toBe("rgb(96, 96, 96)");
    expect(typography.pageBackground).toBe("rgb(255, 255, 255)");
    expect(typography.palette).toEqual({
      paper: "rgb(255, 255, 255)",
      ink: "rgb(23, 23, 23)",
      secondary: "rgb(96, 96, 96)",
      rule: "rgb(212, 212, 212)",
    });

    const paletteComposition = await this.page.evaluate(() => {
      const groups = Array.from(
        document.querySelectorAll<HTMLElement>("[data-palette-group]"),
      );
      const container = document.querySelector<HTMLElement>(
        "[data-palette-groups]",
      );
      if (!container || groups.length !== 2) {
        return null;
      }
      const [core, tonal] = groups.map((group) =>
        group.getBoundingClientRect(),
      );
      const columnCount =
        getComputedStyle(container).gridTemplateColumns.split(" ").length;
      return {
        columnCount,
        aligned: Math.abs(core!.top - tonal!.top) <= 1,
        groupGap: tonal!.left - core!.right,
        overflow: container.scrollWidth > container.clientWidth,
      };
    });
    expect(paletteComposition).not.toBeNull();
    expect(paletteComposition?.overflow).toBe(false);
    if (paletteComposition?.columnCount === 2) {
      expect(paletteComposition.aligned).toBe(true);
      expect(paletteComposition.groupGap).toBeGreaterThanOrEqual(24);
    }

    const semanticTokenPreviews = this.page.locator("[data-token-preview]");
    await expect(semanticTokenPreviews).toHaveCount(27);
    await expect(this.page.locator("[data-spacing-token-preview]")).toHaveCount(
      9,
    );
    const tokenSignals = await this.page.evaluate(() => {
      const styleValue = (
        name: string,
        property: keyof CSSStyleDeclaration,
      ) => {
        const specimen = document.querySelector<HTMLElement>(
          `[data-token-preview='${name}']`,
        );
        return specimen ? String(getComputedStyle(specimen)[property]) : "";
      };
      return {
        background: styleValue("--color-bg", "backgroundColor"),
        text: styleValue("--color-text", "color"),
        danger: styleValue("--color-danger", "color"),
        ruleStyle: styleValue("--color-rule", "borderTopStyle"),
        focusStyle: styleValue("--color-focus", "outlineStyle"),
        controlRadius: styleValue("--radius-control", "borderRadius"),
        surfaceRadius: styleValue("--radius-surface", "borderRadius"),
        duration: styleValue("--motion-duration", "transitionDuration"),
        easing: styleValue("--motion-easing", "transitionTimingFunction"),
      };
    });
    expect(tokenSignals.background).toBe("rgb(255, 255, 255)");
    expect(tokenSignals.danger).not.toBe(tokenSignals.text);
    expect(tokenSignals.ruleStyle).toBe("solid");
    expect(tokenSignals.focusStyle).toBe("solid");
    expect(tokenSignals.controlRadius).not.toBe("0px");
    expect(tokenSignals.surfaceRadius).not.toBe("0px");
    expect(tokenSignals.duration).toBe("0.14s");
    expect(tokenSignals.easing).toBe("ease-out");
    await expect(this.page.locator("[data-layout-specimen]")).toHaveCount(2);
    await expect(this.page.locator("[data-browser-state]")).toHaveCount(5);
    await expect(this.page.locator("[data-copy-contract]")).toHaveCount(4);
    await expect(
      this.page
        .getByRole("list", { name: "Архитектура токенов" })
        .getByRole("listitem"),
    ).toHaveCount(3);

    const motionPreview = this.page.locator(
      "[data-token-motion='--motion-duration']",
    );
    await motionPreview.focus();
    await expect(motionPreview).toBeFocused();
    await expect
      .poll(() =>
        motionPreview
          .locator("[data-token-preview='--motion-duration']")
          .evaluate((element) => getComputedStyle(element).transform),
      )
      .not.toBe("none");

    const expectedIcons = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUpRight",
      "Check",
      "ChevronDown",
      "CircleCheck",
      "CircleHelp",
      "Copy",
      "ImageOff",
      "Lightbulb",
      "Link",
      "TriangleAlert",
    ];
    const iconSpecimens = this.page.locator("[data-icon-specimen]");
    await expect(iconSpecimens).toHaveCount(expectedIcons.length);
    await expect(iconSpecimens.locator("svg[aria-hidden='true']")).toHaveCount(
      expectedIcons.length,
    );
    expect(
      await iconSpecimens.evaluateAll((items) =>
        items.map((item) => item.getAttribute("data-icon-specimen")),
      ),
    ).toEqual(expectedIcons);

    const rhythmGaps = await this.page.evaluate(() => {
      const gapFor = (role: string) => {
        const element = document.querySelector<HTMLElement>(
          `[data-rhythm-role='${role}']`,
        );
        return element ? getComputedStyle(element).rowGap : "";
      };
      return {
        content: gapFor("content"),
        concept: gapFor("concept"),
        section: gapFor("section"),
      };
    });
    expect(rhythmGaps).toEqual({
      content: "12px",
      concept: "32px",
      section: "64px",
    });

    const surfaceSignals = await this.page.evaluate(() => {
      const styleFor = (role: string) => {
        const element = document.querySelector<HTMLElement>(
          `[data-surface-role='${role}']`,
        );
        if (!element) {
          return null;
        }
        const style = getComputedStyle(element);
        return {
          background: style.backgroundColor,
          border: style.borderTopWidth,
          shadow: style.boxShadow,
        };
      };
      const separatorLine = document.querySelector<HTMLElement>(
        "[data-surface-separator-line]",
      );
      return {
        base: styleFor("base"),
        quiet: styleFor("quiet"),
        bounded: styleFor("bounded"),
        separatorBorder: separatorLine
          ? getComputedStyle(separatorLine).borderTopWidth
          : "",
      };
    });
    expect(surfaceSignals.base).toEqual({
      background: "rgb(255, 255, 255)",
      border: "0px",
      shadow: "none",
    });
    expect(surfaceSignals.quiet?.background).not.toBe(
      surfaceSignals.base?.background,
    );
    expect(surfaceSignals.quiet?.border).toBe("0px");
    expect(surfaceSignals.quiet?.shadow).toBe("none");
    expect(surfaceSignals.bounded).toEqual({
      background: "rgb(255, 255, 255)",
      border: "1px",
      shadow: "none",
    });
    expect(surfaceSignals.separatorBorder).toBe("1px");
    await expect(this.page.locator("[data-reference-pattern]")).toHaveCount(0);

    const catalogNavigationOverflow = await this.page.evaluate(() => {
      const navigation = document.querySelector<HTMLElement>(
        "[data-catalog-navigation]",
      );
      return navigation
        ? {
            horizontal: navigation.scrollWidth > navigation.clientWidth,
            vertical: navigation.scrollHeight > navigation.clientHeight,
          }
        : null;
    });
    expect(catalogNavigationOverflow).toEqual({
      horizontal: false,
      vertical: false,
    });

    await dashboardTabs.getByRole("tab", { name: /^Компоненты/ }).click();
    const controlSpecimens = this.page.locator("[data-control-specimen]");
    await expect(controlSpecimens).toHaveCount(7);
    await expect(
      controlSpecimens.first().locator("[data-control-specimen-marker]"),
    ).toHaveCount(0);
    const controlSignals = await this.page.evaluate(() => {
      const primary = document.querySelector<HTMLElement>(
        "#components-actions button[data-hierarchy='primary']",
      );
      const secondary = document.querySelector<HTMLElement>(
        "#components-actions button[data-hierarchy='secondary']",
      );
      const stateSurface = document.querySelector<HTMLElement>(
        "[data-control-specimen='states'] > div:last-child",
      );
      const invalidField = document.querySelector<HTMLElement>(
        "#components-input [aria-invalid='true']",
      );
      const successBadge = document.querySelector<HTMLElement>(
        "#components-feedback [data-tone='success']",
      );
      return {
        primaryBackground: primary
          ? getComputedStyle(primary).backgroundColor
          : "",
        primaryColor: primary ? getComputedStyle(primary).color : "",
        secondaryBackground: secondary
          ? getComputedStyle(secondary).backgroundColor
          : "",
        secondaryBorder: secondary
          ? getComputedStyle(secondary).borderColor
          : "",
        stateBackground: stateSurface
          ? getComputedStyle(stateSurface).backgroundColor
          : "",
        invalidBorder: invalidField
          ? getComputedStyle(invalidField).borderColor
          : "",
        successColor: successBadge ? getComputedStyle(successBadge).color : "",
      };
    });
    expect(controlSignals).toMatchObject({
      primaryBackground: "rgb(23, 23, 23)",
      primaryColor: "rgb(255, 255, 255)",
      secondaryBackground: "rgb(255, 255, 255)",
      secondaryBorder: "rgb(212, 212, 212)",
    });
    expect(controlSignals.stateBackground).not.toBe(
      controlSignals.secondaryBackground,
    );
    expect(controlSignals.invalidBorder).not.toBe(
      controlSignals.secondaryBorder,
    );
    expect(controlSignals.successColor).not.toBe("rgb(23, 23, 23)");

    const identityGeometry = await header.evaluate((element) => {
      const markElement = element.querySelector<HTMLElement>(
        "[data-alchimia-mark]",
      );
      const wordmarkElement = element.querySelector<HTMLElement>(
        "[data-alchimia-wordmark]",
      );
      if (!markElement || !wordmarkElement) return null;
      const headerBox = element.getBoundingClientRect();
      const markBox = markElement.getBoundingClientRect();
      const wordmarkBox = wordmarkElement.getBoundingClientRect();
      return {
        headerHeight: headerBox.height,
        ordered: markBox.right <= wordmarkBox.left,
        centerDelta: Math.abs(
          markBox.top +
            markBox.height / 2 -
            (wordmarkBox.top + wordmarkBox.height / 2),
        ),
      };
    });
    expect(identityGeometry).not.toBeNull();
    expect(identityGeometry?.headerHeight).toBeLessThanOrEqual(80);
    expect(identityGeometry?.ordered).toBe(true);
    expect(identityGeometry?.centerDelta).toBeLessThanOrEqual(2);
  }

  async expectUnlistedMetadata(): Promise<void> {
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,nofollow",
    );
  }

  async expectNoHorizontalOverflow(): Promise<void> {
    const overflow = await this.page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  }

  async expectLinearContentWithoutJavaScript(): Promise<void> {
    await this.open();
    await expect(
      this.page.getByRole("heading", { level: 1, name: "Дизайн-система" }),
    ).toHaveCount(0);
    await expect(
      this.page.getByText("Desktop-каталог визуальных контрактов приложения"),
    ).toHaveCount(0);
    await expect(
      this.page.locator(
        "#system-identity, #system-typography, #system-color, #system-surfaces, #system-layout, #system-accessibility, #system-tokens, #system-rhythm, #system-icons, #system-content-language, #components-content, #components-actions, #components-input, #components-feedback, #components-media, #components-learning, #components-features, #widgets-chrome, #widgets-learning, #widgets-flow, #widgets-layout",
      ),
    ).toHaveCount(21);
    await expect(this.page.locator("[data-rhythm-role]")).toHaveCount(3);
    await expect(this.page.locator("[data-surface-role]")).toHaveCount(4);
    await expect(this.page.locator("[data-token-preview]")).toHaveCount(27);
    await expect(this.page.locator("[data-spacing-token-preview]")).toHaveCount(
      9,
    );
    await expect(this.page.locator("[data-icon-specimen]")).toHaveCount(12);
    await expect(this.page.locator("[data-layout-specimen]")).toHaveCount(2);
    await expect(this.page.locator("[data-browser-state]")).toHaveCount(5);
    await expect(this.page.locator("[data-copy-contract]")).toHaveCount(4);
    await expect(this.page.locator("[data-reference-pattern]")).toHaveCount(0);
    await expect(this.page.locator("[data-control-specimen]")).toHaveCount(7);
    await expect(
      this.page.locator("[data-control-specimen-marker]"),
    ).toHaveCount(0);
    await expect(this.page.getByRole("tablist")).toHaveCount(0);
    await expect(
      this.page.locator("[data-dashboard-panel][data-unenhanced-tab-panel]"),
    ).toHaveCount(3);
    await expect(
      this.page.locator("[data-unenhanced-accordion]"),
    ).not.toHaveCount(0);
    await expect(this.page.locator("[data-practice-task]")).toHaveCount(2);
    await expect(
      this.page
        .locator("[data-practice-form]")
        .getByRole("textbox", { name: "Ответ" }),
    ).toHaveCount(2);

    const inaccessiblePanels = await this.page
      .locator("[data-unenhanced-tab-panel]")
      .evaluateAll(
        (panels) =>
          panels.filter(
            (panel) =>
              panel.hasAttribute("hidden") || panel.hasAttribute("inert"),
          ).length,
      );
    expect(inaccessiblePanels).toBe(0);
  }
}
