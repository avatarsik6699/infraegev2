import {
  componentContracts,
  widgetContracts,
} from "../../src/pages/design-system-lab/catalog-contracts";
import { expect, type Locator, type Page } from "@playwright/test";

export class DesignSystemLabPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/lab/design-system");
    await expect(this.page).toHaveURL(/\/lab\/design-system$/);
  }

  async expectVisualLanguage(interactive = true): Promise<void> {
    await this.dismissConsentIfVisible();
    const section = this.page.locator("#system-visual-language");
    await section.scrollIntoViewIfNeeded();
    await expect(
      section.getByRole("heading", {
        name: "Визуальный язык: готовые композиции",
      }),
    ).toBeVisible();
    await expect(section.locator("[data-visual-example]")).toHaveCount(4);
    const available = section.locator('[data-visual-example="available"]');
    const planned = section.locator('[data-visual-example="planned"]');
    await expect(
      available.getByRole("link", { name: "Открыть курс" }),
    ).toHaveAttribute("href", "/courses/python");
    await expect(planned.getByRole("link")).toHaveCount(0);
    await expect(planned.locator("[data-surface-glint]")).toHaveCount(0);
    const gridIds = await section
      .locator("pattern")
      .evaluateAll((elements) => elements.map((element) => element.id));
    expect(new Set(gridIds).size).toBe(gridIds.length);
    await expect(
      section.getByText("count = 3", { exact: false }),
    ).toBeVisible();
    const form = section.locator('[data-visual-example="form"]');
    if (interactive) {
      const field = form.getByRole("textbox");
      await expect
        .poll(async () => {
          await field.fill("5");
          return form
            .getByRole("button", { name: "Проверить пример" })
            .isEnabled();
        })
        .toBe(true);
      await field.press("Tab");
      await expect(
        form.getByRole("button", { name: "Проверить пример" }),
      ).toBeFocused();
      await form
        .getByRole("button", { name: "Проверить пример" })
        .press("Enter");
      await expect(
        form.getByText("Прибавьте 1 к исходному значению 3."),
      ).toBeVisible();
      await expect(field).toHaveValue("5");
      await field.fill("4");
      await expect(form.locator("[data-surface-glint]")).toHaveCSS(
        "visibility",
        "hidden",
      );
      await field.press("Enter");
      await expect(form.getByRole("status")).toHaveText(
        "Верно: программа выведет 4.",
      );
    } else {
      await expect(
        form.getByRole("button", { name: "Проверить пример" }),
      ).toBeDisabled();
      await expect(
        form.getByText(/Проверка примера доступна с JavaScript/),
      ).toBeVisible();
    }
    expect(
      await section.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return (
          bounds.left >= 0 &&
          bounds.right <= innerWidth &&
          [...element.querySelectorAll("img")].every(
            (image) => image.getBoundingClientRect().right <= innerWidth,
          )
        );
      }),
    ).toBe(true);
  }

  async expectVisualLanguageReducedMotion(): Promise<void> {
    const glints = this.page.locator(
      "#system-visual-language [data-surface-glint]",
    );
    await expect(glints).toHaveCount(3);
    for (const glint of await glints.all()) {
      await expect(glint).toHaveCSS("animation-name", "none");
    }
  }

  async expectVisualLanguageMotion(): Promise<void> {
    const card = this.page.locator('[data-visual-example="available"]');
    const glint = card.locator("[data-surface-glint]");
    await card.scrollIntoViewIfNeeded();
    await expect(glint).toHaveCSS("animation-play-state", "running");
    await expect(glint).toHaveCSS("animation-iteration-count", "1");
    await glint.evaluate((element) => {
      for (const animation of element.getAnimations()) animation.finish();
    });
    await this.page
      .getByRole("heading", { name: "Дизайн-система", exact: true })
      .scrollIntoViewIfNeeded();
    await expect(glint).toHaveCSS("animation-play-state", "paused");
    await card.scrollIntoViewIfNeeded();
    await expect(glint).toHaveCSS("animation-play-state", "running");
    expect(
      await glint.evaluate((element) =>
        element
          .getAnimations()
          .every(
            (animation) =>
              animation.currentTime ===
              animation.effect?.getComputedTiming().endTime,
          ),
      ),
    ).toBe(true);
  }

  async expectCatalogStructure(options?: {
    widgetPersistence?: boolean;
  }): Promise<void> {
    await this.expectSystemCatalog();
    await this.expectComponentsCatalog();
    await this.expectWidgetsCatalog(options);
  }

  private async expectSystemCatalog(): Promise<void> {
    await this.dismissConsentIfVisible();
    await expect(
      this.page.getByRole("heading", {
        level: 1,
        name: "Дизайн-система",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Desktop-каталог визуальных контрактов приложения"),
    ).toHaveCount(0);
    const header = this.page.locator(
      "[data-design-system-root] > [data-public-header]",
    );
    const mark = header.locator("[data-infraege-mark]");
    const wordmark = header.locator("[data-infraege-wordmark]");
    const subtitle = header.locator("[data-infraege-subtitle]");
    await expect(wordmark).toBeVisible();
    await expect(subtitle).toHaveText("подготовка к ЕГЭ по информатике");
    await expect(mark).toBeVisible();
    const dashboardTabs = this.page.getByRole("tablist", {
      name: "Уровни дизайн-системы",
    });
    await expect(dashboardTabs).toBeVisible({ timeout: 15_000 });
    await expect(dashboardTabs.getByRole("tab")).toHaveCount(3);
    await expect(
      this.page.locator(
        "#system-identity, #system-typography, #system-color, #system-surfaces, #system-layout, #system-accessibility, #system-tokens, #system-rhythm, #system-icons, #system-content-language",
      ),
    ).toHaveCount(10);
    await this.expectPeerCatalogViews(dashboardTabs);
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
        "[data-catalog-reading]",
      );
      const service = document.querySelector<HTMLElement>(
        "[aria-label='Уровни дизайн-системы'] [role='tab']",
      );
      const palette = document.querySelector<HTMLElement>(
        "[data-system-palette]",
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
        pageBackground: getComputedStyle(document.body).backgroundColor,
        palette: {
          paper: swatchColor("--color-bg"),
          ink: swatchColor("--color-text"),
          secondary: swatchColor("--color-text-soft"),
          rule: swatchColor("--color-rule"),
        },
      };
    });
    expect(typography.display).toContain("Infraege Alegreya");
    expect(typography.reading).toContain("Infraege Golos Text");
    expect(typography.service).toContain("Infraege Golos Text");
    expect(typography.primaryColor).toBe("rgb(26, 26, 26)");
    expect(typography.secondaryColor).toBe("rgb(107, 107, 107)");
    expect(typography.pageBackground).toBe("rgb(245, 243, 239)");
    expect(typography.palette).toEqual({
      paper: "rgb(245, 243, 239)",
      ink: "rgb(26, 26, 26)",
      secondary: "rgb(107, 107, 107)",
      rule: "rgb(216, 212, 204)",
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
    await expect(semanticTokenPreviews).toHaveCount(29);
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
    expect(tokenSignals.background).toBe("rgb(245, 243, 239)");
    expect(tokenSignals.danger).not.toBe(tokenSignals.text);
    expect(tokenSignals.ruleStyle).toBe("solid");
    expect(tokenSignals.focusStyle).toBe("solid");
    expect(tokenSignals.controlRadius).not.toBe("0px");
    expect(tokenSignals.surfaceRadius).not.toBe("0px");
    expect(tokenSignals.duration).toBe("0.14s");
    expect(tokenSignals.easing).toBe("ease-out");
    await expect(this.page.locator("[data-layout-specimen]")).toHaveCount(2);
    await expect(this.page.locator("[data-browser-state]")).toHaveCount(6);
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
      "Download",
      "FileText",
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
        related: gapFor("related"),
        concept: gapFor("concept"),
        section: gapFor("section"),
      };
    });
    expect(rhythmGaps).toEqual({
      content: "12px",
      related: "24px",
      concept: this.page.viewportSize()!.width <= 832 ? "32px" : "48px",
      section: this.page.viewportSize()!.width <= 832 ? "48px" : "64px",
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
      background: "rgb(245, 243, 239)",
      border: "0px",
      shadow: "none",
    });
    expect(surfaceSignals.quiet?.background).not.toBe(
      surfaceSignals.base?.background,
    );
    expect(surfaceSignals.quiet?.border).toBe("0px");
    expect(surfaceSignals.quiet?.shadow).toBe("none");
    expect(surfaceSignals.bounded).toEqual({
      background: "rgb(245, 243, 239)",
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
    expect(catalogNavigationOverflow?.horizontal).toBe(false);
  }

  private async expectComponentsCatalog(): Promise<void> {
    const dashboardTabs = this.page.getByRole("tablist", {
      name: "Уровни дизайн-системы",
    });
    await dashboardTabs.getByRole("tab", { name: /^Компоненты/ }).click();
    const componentsPanel = this.page.locator(
      "[data-dashboard-panel]:not([hidden])",
    );
    await this.expectNamedContracts(
      componentsPanel,
      Object.values(componentContracts).flat(),
    );
    for (const contract of [
      "LearningVisualFrame",
      "LessonIntro",
      "LessonSectionHeading",
      "LessonTheory",
      "LessonPractice",
      "LessonProgress",
      "ConfirmationDialog",
    ]) {
      await expect(
        componentsPanel.locator(`[data-component-specimen="${contract}"]`),
      ).toBeVisible();
    }
    await expect(
      componentsPanel.locator('[data-contract-name="Tabs"]'),
    ).toHaveCount(0);
    for (const tabContract of [
      "TabsRoot",
      "TabsList",
      "TabsTab",
      "TabsPanel",
    ]) {
      await expect(
        componentsPanel.locator(`[data-contract-name="${tabContract}"]`),
      ).toHaveAttribute("data-contract-status", "live");
    }
    const progressStates = this.page.locator("[data-progress-state]");
    await expect(progressStates).toHaveCount(4);
    await expect(progressStates.locator("[data-mastery-status]")).toHaveText([
      "Вы ещё не решали задания",
      "Можно продолжить с оставшихся заданий",
      "Урок пройден",
      "Все задания решены",
    ]);

    const localPractice = this.page.locator('[data-practice-mode="local"]');
    await expect(
      localPractice.getByRole("table", {
        name: "Короткие данные остаются семантической таблицей",
      }),
    ).toBeVisible();
    await expect(
      localPractice.getByRole("img", {
        name: "Двоичное дерево с выделенными поддеревьями",
      }),
    ).toBeVisible();
    await localPractice.getByRole("button", { name: "Решение" }).click();
    await expect(
      localPractice.getByRole("img", {
        name: "Двоичное дерево с левым и правым поддеревьями",
      }),
    ).toBeVisible();
    await expect(
      localPractice.getByRole("link", { name: /numbers\.txt/ }),
    ).toHaveAttribute("download", "");
    const localAnswer = localPractice.getByRole("textbox", { name: "Ответ" });
    await localAnswer.fill("1");
    await localPractice.getByRole("button", { name: "Проверить" }).click();
    await expect(
      localPractice.getByText("Ответ пока не подходит."),
    ).toBeVisible();
    await localAnswer.fill("0");
    await localPractice.getByRole("button", { name: "Проверить" }).click();
    await expect(localPractice.getByRole("status")).toContainText("Верно.");
    await expect(localAnswer).toBeDisabled();
    await this.page
      .getByRole("button", { name: "Сбросить ответ примера" })
      .click();
    await expect(localAnswer).toBeEnabled();
    await expect(
      componentsPanel.getByRole("tab", { name: "Недоступная вкладка" }),
    ).toBeDisabled();
    await expect(
      componentsPanel.getByRole("button", { name: "Недоступное пояснение" }),
    ).toBeDisabled();

    const errorPractice = this.page.locator('[data-practice-mode="error"]');
    await errorPractice.getByRole("textbox", { name: "Ответ" }).fill("0");
    await errorPractice.getByRole("button", { name: "Проверить" }).click();
    await expect(errorPractice.getByRole("alert")).toHaveText(
      "Не удалось проверить ответ. Попробуйте ещё раз.",
    );

    const documentIntegrity = await this.page.evaluate(() => {
      const ids = Array.from(document.querySelectorAll<HTMLElement>("[id]"))
        .map((element) => element.id)
        .filter(Boolean);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      const missingFragmentTargets = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
      )
        .map((anchor) => anchor.hash.slice(1))
        .filter((id) => id && document.getElementById(id) === null);
      return {
        duplicateIds: [...new Set(duplicateIds)],
        missingFragmentTargets: [...new Set(missingFragmentTargets)],
      };
    });
    expect(documentIntegrity).toEqual({
      duplicateIds: [],
      missingFragmentTargets: [],
    });

    const catalogNavigationTargetHeight = await this.page
      .locator(
        "[data-dashboard-panel]:not([hidden]) [data-catalog-navigation] a",
      )
      .first()
      .evaluate((element) => element.getBoundingClientRect().height);
    expect(catalogNavigationTargetHeight).toBeGreaterThanOrEqual(40);
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
      primaryBackground: "rgb(26, 26, 26)",
      primaryColor: "rgb(255, 255, 255)",
      secondaryBackground: "rgb(251, 250, 247)",
      secondaryBorder: "rgb(129, 122, 112)",
    });
    expect(controlSignals.stateBackground).not.toBe(
      controlSignals.secondaryBackground,
    );
    expect(controlSignals.invalidBorder).not.toBe(
      controlSignals.secondaryBorder,
    );
    expect(controlSignals.successColor).not.toBe("rgb(26, 26, 26)");

    const candidateSignals = await this.page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>(
        "#components-input input",
      );
      const accordionItem = document.querySelector<HTMLElement>(
        "#components-input [data-enhanced='true'] > div",
      );
      const accordionTrigger = document.querySelector<HTMLElement>(
        "#components-input [data-enhanced='true'] button",
      );
      const badge = document.querySelector<HTMLElement>(
        "#components-feedback [data-tone='neutral']",
      );
      const progress = document.querySelector<HTMLElement>(
        "#components-feedback [role='progressbar'] > div",
      );
      const callout = document.querySelector<HTMLElement>(
        "#components-feedback aside",
      );
      const warningCallout = document.querySelector<HTMLElement>(
        "#components-feedback aside[data-tone='warning']",
      );
      const workedExample = document.querySelector<HTMLElement>(
        "#components-learning figure",
      );
      return {
        input: input
          ? {
              fontSize: getComputedStyle(input).fontSize,
              placeholderSize: getComputedStyle(input, "::placeholder")
                .fontSize,
              shadow: getComputedStyle(input).boxShadow,
            }
          : null,
        accordion: accordionItem
          ? {
              border: getComputedStyle(accordionItem).borderBottomWidth,
              radius: getComputedStyle(accordionItem).borderRadius,
              triggerHeight: accordionTrigger?.getBoundingClientRect().height,
            }
          : null,
        badgeRadius: badge ? getComputedStyle(badge).borderRadius : "",
        progressHeight: progress?.getBoundingClientRect().height,
        callout: callout
          ? {
              border: getComputedStyle(callout).borderTopWidth,
              background: getComputedStyle(callout).backgroundColor,
            }
          : null,
        warningCalloutBackground: warningCallout
          ? getComputedStyle(warningCallout).backgroundColor
          : "",
        learningBorder: workedExample
          ? getComputedStyle(workedExample).borderTopWidth
          : "",
      };
    });
    expect(candidateSignals).toMatchObject({
      input: { fontSize: "14px", placeholderSize: "13px", shadow: "none" },
      accordion: {
        border: "1px",
        radius: "0px",
        triggerHeight: 44,
      },
      callout: { border: "0px" },
      learningBorder: "0px",
    });
    expect(candidateSignals.callout?.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(candidateSignals.warningCalloutBackground).not.toBe(
      candidateSignals.callout?.background,
    );
    expect(candidateSignals.badgeRadius).not.toBe("9999px");
    expect(candidateSignals.progressHeight).toBe(6);

    const accordionTrigger = componentsPanel.getByRole("button", {
      name: "Что делает базовый случай?",
      exact: true,
    });
    await accordionTrigger.hover();
    await expect
      .poll(() =>
        accordionTrigger
          .locator("span")
          .first()
          .evaluate((element) => getComputedStyle(element).textDecorationLine),
      )
      .toBe("underline");
    await accordionTrigger.click();
    await expect(accordionTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(
      componentsPanel.getByText(
        "Аргумент приближается к базовому случаю, иначе вычисление не завершится.",
        { exact: true },
      ),
    ).not.toBeVisible();
    await expect(accordionTrigger).toHaveAttribute("aria-controls", /.+/);
    const accordionPanelTransition = await accordionTrigger.evaluate(
      (trigger) => {
        const panelId = trigger.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : null;
        return panel ? getComputedStyle(panel).transitionProperty : "";
      },
    );
    expect(accordionPanelTransition).toBe("grid-template-rows");
    await expect
      .poll(() =>
        accordionTrigger
          .locator("svg")
          .evaluate((element) => getComputedStyle(element).transform),
      )
      .not.toBe("none");

    const longCode = componentsPanel.getByRole("group", {
      name: "Пример: трассировка countdown",
    });
    const codeContent = longCode.locator("[data-code-scroll]");
    const expandCode = longCode.getByRole("button", {
      name: "Показать весь код",
    });
    await expect(codeContent).toHaveAttribute("data-collapsed", "true");
    await expect(expandCode).toHaveAttribute("aria-expanded", "false");
    await expect(expandCode.locator("svg")).toBeVisible();
    const disclosureStyle = await expandCode.evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      border: getComputedStyle(element).borderTopColor,
    }));
    expect(disclosureStyle).toEqual({
      background: "rgba(0, 0, 0, 0)",
      border: "rgba(0, 0, 0, 0)",
    });
    await expandCode.click();
    await expect(codeContent).not.toHaveAttribute("data-collapsed", "true");
    await expect(
      longCode.getByRole("button", { name: "Свернуть код" }),
    ).toHaveAttribute("aria-expanded", "true");
  }

  private async expectWidgetsCatalog(options?: {
    widgetPersistence?: boolean;
  }): Promise<void> {
    const dashboardTabs = this.page.getByRole("tablist", {
      name: "Уровни дизайн-системы",
    });
    const header = this.page.locator(
      "[data-design-system-root] > [data-public-header]",
    );
    await dashboardTabs.getByRole("tab", { name: /^Виджеты/ }).click();
    const widgetsPanel = this.page.locator(
      "[data-dashboard-panel]:not([hidden])",
    );
    await this.expectNamedContracts(
      widgetsPanel,
      Object.values(widgetContracts).flat(),
    );
    await expect(widgetsPanel.locator("[data-widget-assembly]")).toHaveCount(2);
    await expect(
      widgetsPanel.locator("[data-outline-link-id][aria-current='location']"),
    ).toHaveCount(1);

    if (options?.widgetPersistence) {
      const flowSpecimen = widgetsPanel.locator("[data-widget-flow-specimen]");
      const resetFlow = flowSpecimen.getByRole("button", {
        name: "Сбросить пример",
      });
      await resetFlow.focus();
      await resetFlow.press("Enter");
      await expect(
        flowSpecimen.locator("[data-widget-flow-progress]"),
      ).toHaveText("Решено 0 из 2");
      await flowSpecimen.getByRole("textbox", { name: "Ответ" }).fill("0");
      await flowSpecimen.getByRole("button", { name: "Проверить" }).click();
      await expect(
        flowSpecimen.locator("[data-widget-flow-progress]"),
      ).toHaveText("Решено 1 из 2");

      await this.page.reload();
      const reloadedTabs = this.page.getByRole("tablist", {
        name: "Уровни дизайн-системы",
      });
      await reloadedTabs.getByRole("tab", { name: /^Виджеты/ }).click();
      const reloadedFlow = this.page.locator(
        "[data-dashboard-panel]:not([hidden]) [data-widget-flow-specimen]",
      );
      await expect(
        reloadedFlow.locator("[data-widget-flow-progress]"),
      ).toHaveText("Решено 1 из 2");
      await expect(
        reloadedFlow.getByRole("textbox", { name: "Ответ" }),
      ).toHaveValue("0");
      await expect(
        reloadedFlow.getByRole("textbox", { name: "Ответ" }),
      ).toBeDisabled();
      const resetReloadedFlow = reloadedFlow.getByRole("button", {
        name: "Сбросить пример",
      });
      await resetReloadedFlow.focus();
      await resetReloadedFlow.press("Enter");
      await expect(
        reloadedFlow.locator("[data-widget-flow-progress]"),
      ).toHaveText("Решено 0 из 2");
      await expect(
        reloadedFlow.getByRole("textbox", { name: "Ответ" }),
      ).toBeEnabled();
    }

    const identityGeometry = await header.evaluate((element) => {
      const markElement = element.querySelector<HTMLElement>(
        "[data-infraege-mark]",
      );
      const nameElement = element.querySelector<HTMLElement>(
        "[data-infraege-name]",
      );
      if (!markElement || !nameElement) return null;
      const headerBox = element.getBoundingClientRect();
      const markBox = markElement.getBoundingClientRect();
      const nameBox = nameElement.getBoundingClientRect();
      return {
        contained:
          markBox.top >= headerBox.top &&
          markBox.bottom <= headerBox.bottom &&
          nameBox.top >= headerBox.top &&
          nameBox.bottom <= headerBox.bottom,
        ordered: markBox.right <= nameBox.left,
        centerDelta: Math.abs(
          markBox.top + markBox.height / 2 - (nameBox.top + nameBox.height / 2),
        ),
      };
    });
    expect(identityGeometry).not.toBeNull();
    await expect(header.getByText("просто", { exact: true })).toBeVisible();
    expect(identityGeometry?.contained).toBe(true);
    expect(identityGeometry?.ordered).toBe(true);
    expect(identityGeometry?.centerDelta).toBeLessThanOrEqual(2);
  }

  private async expectNamedContracts(
    root: Locator,
    contracts: readonly { name: string; status: string }[],
  ): Promise<void> {
    const entries = root.locator("[data-contract-name]");
    await expect(entries.locator("code")).toHaveText(
      contracts.map((contract) => contract.name),
    );
    for (const contract of contracts) {
      await expect(
        root.locator(`[data-contract-name="${contract.name}"]`),
      ).toHaveAttribute("data-contract-status", contract.status);
    }
  }

  async expectDialogAbovePendingConsent(): Promise<void> {
    await expect(
      this.page.locator("[data-analytics-consent-enhanced]"),
    ).toBeVisible();
    await this.page.getByRole("tab", { name: /^Компоненты/ }).click();
    const trigger = this.page.getByRole("button", {
      name: "Сбросить пример",
      exact: true,
    });
    await trigger.click();
    const dialog = this.page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    for (const button of await dialog.getByRole("button").all()) {
      await button.scrollIntoViewIfNeeded();
      expect(
        await button.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const top = document.elementFromPoint(
            box.x + box.width / 2,
            box.y + box.height / 2,
          );
          return top !== null && element.contains(top);
        }),
      ).toBe(true);
    }
    for (let index = 0; index < 4; index += 1) {
      await this.page.keyboard.press("Tab");
      expect(
        await dialog.evaluate((element) =>
          element.contains(document.activeElement),
        ),
      ).toBe(true);
    }
    await dialog.getByRole("button", { name: "Отмена" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog.getByRole("button", { name: "Сбросить", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(
      this.page.locator("[data-analytics-consent-enhanced]"),
    ).toBeVisible();
  }

  async expectThemeAndIsolatedStates(): Promise<void> {
    await this.dismissConsentIfVisible();
    const theme = await this.page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const lab = getComputedStyle(
        document.querySelector("[data-design-system-root]")!,
      );
      const names = [
        "--color-bg",
        "--color-text",
        "--font-ui",
        "--color-focus",
        "--control-primary-bg",
      ];
      return names.map((name) => ({
        name,
        root: root.getPropertyValue(name).trim(),
        lab: lab.getPropertyValue(name).trim(),
      }));
    });
    for (const token of theme) expect(token.lab, token.name).toBe(token.root);
    await this.page.getByRole("tab", { name: /^Компоненты/ }).click();
    const trigger = this.page
      .locator('[data-component-specimen="ConfirmationDialog"]')
      .getByRole("button");
    await trigger.click();
    const dialog = this.page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS("background-color", "rgb(251, 250, 247)");
    await this.page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    const consent = this.page.locator(
      '[data-component-specimen="AnalyticsConsentNotice"]',
    );
    const stored = await this.page.evaluate(() => JSON.stringify(localStorage));
    await consent.getByRole("button", { name: "Разрешить аналитику" }).click();
    await expect(
      consent.getByText("Пример: аналитика разрешена."),
    ).toBeVisible();
    await consent.getByRole("button", { name: "Не сейчас" }).click();
    await expect(
      consent.getByText("Пример: аналитика отклонена."),
    ).toBeVisible();
    expect(await this.page.evaluate(() => JSON.stringify(localStorage))).toBe(
      stored,
    );
  }

  private async dismissConsentIfVisible(): Promise<void> {
    const dismissConsent = this.page
      .locator("[data-analytics-consent-enhanced]")
      .getByRole("button", { name: "Не сейчас" });
    if (await dismissConsent.isVisible()) await dismissConsent.click();
  }

  private async expectPeerCatalogViews(dashboardTabs: Locator): Promise<void> {
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
  }

  async expectResponsiveCatalog(): Promise<void> {
    for (const label of ["Система", "Компоненты", "Виджеты"]) {
      await this.page
        .getByRole("tab", { name: new RegExp(`^${label}`) })
        .click();
      await expect(
        this.page.getByRole("heading", { name: label, exact: true, level: 2 }),
      ).toBeVisible();
      await this.expectNoHorizontalOverflow();
    }
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

  async expectReducedMotion(): Promise<void> {
    const dashboardTabs = this.page.getByRole("tablist", {
      name: "Уровни дизайн-системы",
    });
    await dashboardTabs.getByRole("tab", { name: /^Компоненты/ }).click();
    const trigger = this.page.getByRole("button", {
      name: "Что делает базовый случай?",
      exact: true,
    });
    await expect(trigger).toBeVisible();
    if ((await trigger.getAttribute("aria-expanded")) !== "true")
      await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const motion = await trigger.evaluate((element) => {
      const chevron = element.querySelector("svg");
      const panelId = element.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      return {
        chevron: chevron ? getComputedStyle(chevron).transitionDuration : "",
        panel: panel ? getComputedStyle(panel).transitionDuration : "",
        trigger: getComputedStyle(element).transitionDuration,
      };
    });
    expect(motion).toEqual({ chevron: "0s", panel: "0s", trigger: "0s" });
  }

  async expectLinearContentWithoutJavaScript(): Promise<void> {
    await this.open();
    await expect(
      this.page.getByRole("heading", { level: 1, name: "Дизайн-система" }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Desktop-каталог визуальных контрактов приложения"),
    ).toHaveCount(0);
    await expect(
      this.page.locator(
        "#system-identity, #system-typography, #system-color, #system-surfaces, #system-layout, #system-accessibility, #system-tokens, #system-rhythm, #system-icons, #system-content-language, #components-content, #components-actions, #components-input, #components-feedback, #components-media, #components-learning, #components-features, #widgets-chrome, #widgets-learning, #widgets-flow, #widgets-layout",
      ),
    ).toHaveCount(21);
    await expect(this.page.locator("[data-rhythm-role]")).toHaveCount(4);
    await expect(this.page.locator("[data-surface-role]")).toHaveCount(4);
    await expect(this.page.locator("[data-token-preview]")).toHaveCount(29);
    await expect(this.page.locator("[data-spacing-token-preview]")).toHaveCount(
      9,
    );
    await expect(this.page.locator("[data-icon-specimen]")).toHaveCount(14);
    await expect(this.page.locator("[data-layout-specimen]")).toHaveCount(2);
    await expect(this.page.locator("[data-browser-state]")).toHaveCount(6);
    await expect(this.page.locator("[data-copy-contract]")).toHaveCount(4);
    await expect(this.page.locator("[data-reference-pattern]")).toHaveCount(0);
    await expect(this.page.locator("[data-control-specimen]")).toHaveCount(7);
    await this.expectNamedContracts(
      this.page.locator("[data-design-system-root]"),
      [
        ...Object.values(componentContracts).flat(),
        ...Object.values(widgetContracts).flat(),
      ],
    );
    for (const name of [
      "LessonIntro",
      "LessonTheory",
      "LessonSectionHeading",
      "LearningVisualFrame",
      "LessonPractice",
      "LessonProgress",
      "AnalyticsConsentNotice",
      "DecorativePrimitives",
    ]) {
      await expect(
        this.page.locator(`[data-component-specimen="${name}"]`),
      ).toBeVisible();
    }
    await expect(this.page.locator("[data-widget-assembly]")).toHaveCount(2);
    await expect(this.page.locator("[data-widget-flow-progress]")).toHaveText(
      "Решено 0 из 2",
    );
    await expect(
      this.page.getByRole("button", { name: "Сбросить пример" }),
    ).toHaveCount(0);
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
    await expect(
      this.page.locator("[data-code-scroll][data-collapsed]"),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("button", { name: "Показать весь код" }),
    ).toHaveCount(0);
    await expect(this.page.locator("[data-practice-task]")).toHaveCount(4);
    await expect(
      this.page
        .locator("[data-practice-form]")
        .getByRole("textbox", { name: "Ответ" }),
    ).toHaveCount(5);

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
