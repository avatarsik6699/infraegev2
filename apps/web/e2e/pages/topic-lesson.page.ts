import { expect, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { expectPublicReleaseIdentity } from "./public-header.assertions";
import {
  expectDesktopLessonRail,
  expectLessonInteractiveTargets,
  expectKeyboardLessonDisclosures,
  expectLessonVerticalRhythm,
  expectPublishedLessonDocument,
  expectRelatedLearningBlockRhythm,
  openLessonAtTop,
} from "./lesson-page.assertions";

type TopicLessonPageConfig = {
  route: string;
  title: string;
  taskNumber: number;
  taskCount?: number;
};

const recursionLessonConfig: TopicLessonPageConfig = {
  route: "/ege/16-rekursiya",
  title: "Рекурсивные алгоритмы",
  taskNumber: 16,
  taskCount: 14,
};

export class TopicLessonPage {
  constructor(
    private readonly page: Page,
    private readonly config: TopicLessonPageConfig = recursionLessonConfig,
  ) {}

  private async expectPublishedTopicIdentity(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
    await expect(this.page).toHaveTitle(this.config.title + " — infraege");
    await expect(
      this.page.getByRole("heading", {
        level: 1,
        name: this.config.title,
      }),
    ).toBeVisible();
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index,follow",
    );
    await expect(this.page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://infraege.ru" + this.config.route,
    );
  }

  private async expectTaskPractice(
    noJavaScript: boolean,
    count = 8,
  ): Promise<void> {
    await expect(this.page.locator("[data-practice-form]")).toHaveCount(1);
    if (noJavaScript) {
      await expect(this.page.locator("[data-practice-form] form")).toHaveCount(
        count,
      );
      await expect(
        this.page.locator("[data-practice-form] [data-unenhanced-accordion]"),
      ).toHaveCount(count);
    } else {
      await expect(this.page.locator("[data-practice-task]")).toHaveCount(
        count,
      );
      await expect(this.page.getByRole("tab")).toHaveCount(count);
    }
  }

  private async expectCodeContrast(block: Locator): Promise<void> {
    const colors = await block.evaluate((element) => {
      const normalise = (color: string) => {
        const probe = document.createElement("span");
        probe.style.color = color;
        document.body.append(probe);
        const value = getComputedStyle(probe).color;
        probe.remove();
        return value;
      };
      const channels = (color: string) =>
        color
          .match(/\d+(\.\d+)?/gu)!
          .slice(0, 3)
          .map(Number);
      const luminance = (color: string) => {
        const [r, g, b] = channels(color).map((value) => {
          const unit = value / 255;
          return unit <= 0.03928
            ? unit / 12.92
            : ((unit + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
      };
      const ratio = (a: string, b: string) => {
        const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
        return (hi! + 0.05) / (lo! + 0.05);
      };
      const root = getComputedStyle(document.documentElement);
      const code = element.querySelector("code")!;
      const background = getComputedStyle(element).backgroundColor;
      return {
        text: getComputedStyle(code).color,
        foregroundToken: normalise(root.getPropertyValue("--theme-code-ink")),
        background,
        backgroundToken: normalise(root.getPropertyValue("--theme-code")),
        plainRatio: ratio(getComputedStyle(code).color, background),
        tokenRatios: [...code.querySelectorAll("[data-token]")].map((token) =>
          ratio(getComputedStyle(token).color, background),
        ),
      };
    });
    expect(colors.text).toBe(colors.foregroundToken);
    expect(colors.background).toBe(colors.backgroundToken);
    expect(colors.plainRatio).toBeGreaterThanOrEqual(4.5);
    expect(colors.tokenRatios.length).toBeGreaterThan(0);
    for (const value of colors.tokenRatios) {
      expect(value).toBeGreaterThanOrEqual(4.5);
    }
  }

  async expectCodeKeyboardFocus(label: string): Promise<void> {
    const scrollArea = this.page
      .getByRole("group", { name: label })
      .locator("[data-code-scroll]");
    await scrollArea.press("Home");
    await expect(scrollArea).toHaveCSS("outline-style", "solid");
    await expect(scrollArea).toHaveCSS("outline-width", "2px");
  }

  async open(): Promise<void> {
    await openLessonAtTop(this.page, this.config.route);
  }

  async expectRecursionStylePilot(noJavaScript = false): Promise<void> {
    const frame = this.page.locator("[data-topic-lesson-page]");
    await expect(frame).not.toHaveAttribute("data-learning-profile");
    const headings = this.page.locator("#theory section[id] > h3");
    await expect(headings).toHaveCount(15);
    for (const heading of await headings.all()) {
      await expect(heading).toHaveCSS("border-bottom-width", "1px");
      await expect(heading).toHaveCSS(
        "border-bottom-color",
        "rgb(234, 236, 239)",
      );
    }
    await this.expectRecursionContentTypography(noJavaScript);
    await expect(this.page.locator("#theory em")).toHaveCount(0);
    await expect(
      this.page
        .locator("#theory strong")
        .filter({ hasText: "считать всю последовательность необязательно" }),
    ).toHaveCount(0);
    const link = this.page.locator("[data-topic-lesson-context] a").first();
    await expect(link).toHaveCSS("color", "rgb(0, 112, 210)");
    await expect(link.locator("span").first()).toHaveCSS(
      "text-decoration-line",
      "none",
    );
    if (!noJavaScript) {
      await link.hover();
      await expect(link.locator("span").first()).toHaveCSS(
        "text-decoration-line",
        "underline",
      );
      await this.page.mouse.move(0, 0);
    }
    const semanticColors = await frame.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        success: style.getPropertyValue("--color-success").trim(),
        danger: style.getPropertyValue("--color-danger").trim(),
      };
    });
    const correct = this.page
      .locator('#theory [data-status="correct"] svg')
      .first();
    const incorrect = this.page
      .locator('#theory [data-status="incorrect"] svg')
      .first();
    await expect(correct).toHaveCSS("color", semanticColors.success);
    await expect(incorrect).toHaveCSS("color", semanticColors.danger);
    await this.expectNoHorizontalOverflow();
    if (noJavaScript) {
      await expect(
        this.page.locator("[data-outline-link-id]").first(),
      ).toBeVisible();
      return;
    }

    await this.page.setViewportSize({ width: 1440, height: 900 });
    const destination = this.page.locator(
      '[data-outline-link-id="base-case-and-step"]',
    );
    await destination.click();
    await expect(destination).toHaveAttribute("aria-current", "location");
    await expect(destination).toHaveCSS("color", "rgb(0, 112, 210)");
    const marker = await destination.evaluate(
      (element) => getComputedStyle(element, "::before").backgroundColor,
    );
    expect(marker).toBe("rgb(0, 112, 210)");
    await expect(
      this.page.locator('[data-outline-link-id="theory"]'),
    ).toHaveCSS("color", "rgb(0, 112, 210)");
    await this.page.locator("#argument-steps").evaluate((element) => {
      element.scrollIntoView({ block: "start", behavior: "instant" });
    });
    await expect(
      this.page.locator('[data-outline-link-id="argument-steps"]'),
    ).toHaveAttribute("aria-current", "location");

    await this.page.setViewportSize({ width: 390, height: 844 });
    const outline = this.page.getByRole("button", {
      name: "Содержание урока",
      exact: true,
    });
    await outline.click();
    await destination.focus();
    await destination.press("Enter");
    await expect(outline).toHaveAttribute("aria-expanded", "false");
    await expect(this.page.locator("#base-case-and-step")).toBeFocused();
    await this.expectNoHorizontalOverflow();

    await this.page.getByRole("tab", { name: /Задача 1 из 14/ }).click();
    const task = this.page.locator(
      '[data-practice-task="rekursiya-base-sequence"]',
    );
    await expect(this.page.getByRole("tab", { selected: true })).toHaveCSS(
      "border-bottom-color",
      "rgb(96, 96, 96)",
    );
    const theoryLink = task.getByRole("link", {
      name: "Шаблон для одного предыдущего значения",
    });
    await expect(theoryLink).toHaveCSS("color", "rgb(0, 112, 210)");
    await expect(theoryLink).toHaveCSS("text-align", "left");
    const iconGap = await theoryLink.evaluate((element) => {
      const icon = element.querySelector("svg")!.getBoundingClientRect();
      const label = element.querySelector("span")!.getBoundingClientRect();
      return label.left - icon.right;
    });
    expect(iconGap).toBeLessThanOrEqual(8);
    expect(iconGap).toBeGreaterThanOrEqual(0);
    const answer = task.getByRole("textbox", { name: "Ответ", exact: true });
    const check = task.getByRole("button", { name: "Проверить", exact: true });
    await expect(check).toHaveCSS("background-color", "rgb(23, 23, 23)");
    await answer.fill("31");
    await check.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      window.scrollBy({
        top: bounds.top + bounds.height / 2 - (innerHeight - 14),
        behavior: "instant",
      });
    });
    await check.click();
    await expect(task.getByRole("status")).toHaveCSS(
      "color",
      semanticColors.danger,
    );
    await expect(task.getByRole("status")).toContainText(
      "Ответ пока не подходит",
    );
    await expect(answer).toBeFocused();
    await expect(answer).toHaveValue("31");
    await answer.fill("32");
    await check.click();
    await expect(task.getByRole("status")).toContainText("Верно");
    await expect(task.getByRole("status")).toHaveCSS(
      "color",
      semanticColors.success,
    );
    await expect(task.locator("[data-answer-accepted-icon]")).toHaveCSS(
      "color",
      semanticColors.success,
    );
    await this.page.setViewportSize({ width: 1440, height: 900 });
    await this.page.emulateMedia({ reducedMotion: "no-preference" });
    const forward = this.page.getByRole("link", {
      name: "Обработка данных",
      exact: true,
    });
    const external = this.page.getByRole("link", { name: /Telegram-канал/ });
    await this.page.mouse.move(0, 0);
    await expect(forward.locator("span").first()).toHaveCSS(
      "text-decoration-line",
      "none",
    );
    await forward.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await forward.hover();
    await expect(forward.locator("span").first()).toHaveCSS(
      "text-decoration-line",
      "underline",
    );
    await expect(forward.locator("svg")).toHaveCSS(
      "transform",
      "matrix(1, 0, 0, 1, 2, 0)",
    );
    await external.hover();
    await expect(external.locator("[data-external-link-icon]")).toHaveCSS(
      "transform",
      "matrix(1, 0, 0, 1, 2, -2)",
    );
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await expect(external.locator("[data-external-link-icon]")).toHaveCSS(
      "transform",
      "none",
    );
    await forward.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await forward.hover();
    await expect(forward.locator("svg")).toHaveCSS("transform", "none");
    await this.page.mouse.move(0, 0);
    await external.focus();
    await external.press("Shift+Tab");
    await expect(forward).toBeFocused();
    await expect(forward.locator("span").first()).toHaveCSS(
      "text-decoration-line",
      "underline",
    );
  }

  private async expectRecursionContentTypography(
    noJavaScript: boolean,
  ): Promise<void> {
    const examples = this.page.locator("#theory figure").filter({
      has: this.page.locator("figcaption", { hasText: "Разберём на примере" }),
    });
    await expect(examples).toHaveCount(11);
    for (const example of await examples.all()) {
      for (const text of await example
        .locator(":scope > div, ol li > div")
        .all()) {
        await expect(text).toHaveCSS("font-size", "16px");
        await expect(text).toHaveCSS("font-weight", "400");
        await expect(text).toHaveCSS("color", "rgb(23, 23, 23)");
      }
      for (const formula of await example
        .locator('[data-kind="formula"]')
        .all()) {
        await expect(formula).toHaveCSS("font-size", "14.4px");
      }
    }
    const outcome = this.page.getByRole("heading", {
      name: "Что получилось",
      exact: true,
    });
    for (const width of [320, 390, 1440]) {
      await this.page.setViewportSize({ width, height: 900 });
      await expect(outcome).toHaveCSS("border-bottom-width", "1px");
      await expect(outcome).toHaveCSS(
        "border-bottom-color",
        "rgb(234, 236, 239)",
      );
      const theorySize = await this.page
        .locator("#theory section[id] > h3")
        .first()
        .evaluate((element) => getComputedStyle(element).fontSize);
      await expect(outcome).toHaveCSS("font-size", theorySize);
      await expect(this.page.locator("#theory pre code").first()).toHaveCSS(
        "font-size",
        "14.4px",
      );
      const terms = await examples
        .locator("[data-formula-term]")
        .evaluateAll((elements) =>
          elements.map((element) => {
            const bounds = element.getBoundingClientRect();
            const container = element
              .closest("figure")!
              .getBoundingClientRect();
            return {
              singleLine:
                bounds.height <=
                parseFloat(getComputedStyle(element).lineHeight) + 1,
              contained:
                bounds.left >= container.left - 1 &&
                bounds.right <= container.right + 1,
            };
          }),
        );
      for (const term of terms) {
        expect(term.singleLine).toBe(true);
        expect(term.contained).toBe(true);
      }
      for (const example of await examples.all()) {
        const label = example.locator("figcaption");
        await expect(label).toHaveCSS("font-size", "14px");
        await expect(label).toHaveCSS("font-weight", "400");
        await expect(label).toHaveCSS(
          "color",
          await this.page.evaluate(() => {
            const probe = document.createElement("span");
            probe.style.color = "var(--color-text-soft)";
            document.body.append(probe);
            const color = getComputedStyle(probe).color;
            probe.remove();
            return color;
          }),
        );
        await expect(label.locator('svg[aria-hidden="true"]')).toHaveCount(1);
        for (const step of await example.locator("ol li").all()) {
          const geometry = await step.evaluate((element) => {
            const marker = element.firstElementChild!;
            const body = element.lastElementChild!;
            const markerBox = marker.getBoundingClientRect();
            const bodyBox = body.getBoundingClientRect();
            const firstLineCentre =
              bodyBox.top + parseFloat(getComputedStyle(body).lineHeight) / 2;
            return {
              aligned:
                Math.abs(
                  markerBox.top + markerBox.height / 2 - firstLineCentre,
                ) <= 1.5,
              sameFirstLineHeight:
                markerBox.height <=
                parseFloat(getComputedStyle(body).lineHeight) + 1,
            };
          });
          expect(geometry.aligned).toBe(true);
          expect(geometry.sameFirstLineHeight).toBe(true);
        }
      }
      for (const code of await this.page.locator("#theory code").all()) {
        await expect(code).toHaveCSS("font-size", "14.4px");
      }
      await this.expectNoHorizontalOverflow();
      if (width === 390 && !noJavaScript) {
        const code = this.page.locator("#theory pre").first();
        await code.focus();
        await code.press("ArrowRight");
        await expect
          .poll(() => code.evaluate((element) => element.scrollLeft))
          .toBeGreaterThan(0);
      }
    }
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    try {
      await expect(examples.first().locator("ol li > div").first()).toHaveCSS(
        "font-size",
        "32px",
      );
      await expect(
        examples.first().locator('ol [data-kind="formula"]').first(),
      ).toHaveCSS("font-size", "28.8px");
      await expect(this.page.locator("#theory pre code").first()).toHaveCSS(
        "font-size",
        "28.8px",
      );
      for (const width of [320, 390, 900]) {
        await this.page.setViewportSize({ width, height: 900 });
        await this.expectNoHorizontalOverflow();
        for (const group of await examples
          .locator("[data-formula-term]")
          .all()) {
          const fits = await group.evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            const container = element
              .closest("figure")!
              .getBoundingClientRect();
            return (
              bounds.left >= container.left - 1 &&
              bounds.right <= container.right + 1
            );
          });
          expect(fits).toBe(true);
        }
      }
    } finally {
      await this.page.evaluate(() => {
        document.documentElement.style.removeProperty("font-size");
      });
      await this.page.setViewportSize({ width: 1440, height: 900 });
    }
  }

  async expectLessonVideos(noJavaScript = false): Promise<void> {
    const videos = this.page.locator("#theory video");
    await expect(videos).toHaveCount(5);
    for (const figure of await this.page
      .locator("#theory figure[data-lesson-video-figure]")
      .all()) {
      await expect(figure.locator("figcaption")).toHaveCount(1);
      await expect(figure).not.toContainText("Текстовое описание");
    }
    for (const video of await videos.all()) {
      await expect(video).toHaveAttribute("poster", /-poster\.webp$/u);
      await expect(video.locator("source")).toHaveCount(2);
      await expect(video).not.toHaveAttribute("autoplay");
      await expect(video).toHaveJSProperty("muted", true);
      await expect(video).toHaveJSProperty("loop", true);
    }
    const toggle = this.page.locator("[data-lesson-video-toggle]").first();
    if (noJavaScript) {
      await expect(toggle).toBeHidden();
      return;
    }
    for (const width of [390, 1440]) {
      await this.page.setViewportSize({ width, height: 900 });
      const overflow = await this.page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    }
    const first = videos.first();
    await first.scrollIntoViewIfNeeded();
    const state = () =>
      first.evaluate((element: HTMLVideoElement) => ({
        paused: element.paused,
        time: element.currentTime,
        duration: element.duration,
      }));
    await expect.poll(async () => (await state()).paused).toBe(false);
    await expect(toggle).toHaveAccessibleName(/^Пауза: /u);
    await toggle.click();
    await expect.poll(async () => (await state()).paused).toBe(true);
    await expect(toggle).toHaveAccessibleName(/^Воспроизвести: /u);
    const timeline = this.page.locator("[data-lesson-video-timeline]").first();
    await timeline.fill("500");
    await expect
      .poll(async () => {
        const { time, duration } = await state();
        return Math.abs(time - duration / 2) < 0.6;
      })
      .toBe(true);
    await expect(timeline).toHaveAttribute("aria-valuetext", / из \d+ с$/u);
    const captionGap = await first.evaluate((element) => {
      const figure = element.closest("figure")!;
      const controls = figure.querySelector("[data-lesson-video-controls]")!;
      const caption = figure.querySelector("figcaption")!;
      return (
        caption.getBoundingClientRect().top -
        controls.getBoundingClientRect().bottom
      );
    });
    expect(captionGap).toBeLessThanOrEqual(8);
    await toggle.click();
    await expect.poll(async () => (await state()).paused).toBe(false);
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(async () => (await state()).paused).toBe(true);
    await first.scrollIntoViewIfNeeded();
    await expect.poll(async () => (await state()).paused).toBe(false);
  }

  async expectLessonFigures(noJavaScript = false): Promise<void> {
    const figures = this.page.locator("figure[data-lesson-figure]");
    await expect(figures).toHaveCount(5);
    for (const figure of await figures.all()) {
      await figure.scrollIntoViewIfNeeded();
      const image = figure.locator("img");
      await expect(image).toHaveAttribute("alt", /\S/u);
      await expect
        .poll(() =>
          image.evaluate(
            (element: HTMLImageElement) =>
              element.complete && element.naturalWidth > 0,
          ),
        )
        .toBe(true);
      await expect(figure.locator("figcaption")).toHaveCount(1);
      await expect(figure).not.toContainText("Текстовое описание");
    }
    if (noJavaScript) return;
    for (const width of [390, 1440]) {
      await this.page.setViewportSize({ width, height: 900 });
      const overflow = await this.page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    }
  }

  async expectLessonVideosRespectReducedMotion(): Promise<void> {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.page.reload();
    const first = this.page.locator("#theory video").first();
    await first.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        first.evaluate((element: HTMLVideoElement) => element.readyState),
      )
      .toBeGreaterThan(0);
    await expect(first).toHaveJSProperty("paused", true);
    await expect(first).toHaveJSProperty("currentTime", 0);
    const toggle = this.page.locator("[data-lesson-video-toggle]").first();
    await expect(toggle).toHaveAccessibleName(/^Воспроизвести: /u);
    await toggle.click();
    await expect(first).toHaveJSProperty("paused", false);
  }

  async expectRecursionLearningBlocks(noJavaScript = false): Promise<void> {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    const checkpoint = this.page.getByRole("region", {
      name: "Проверьте себя",
      exact: true,
    });
    const questions = checkpoint.locator(
      noJavaScript ? "summary" : "button[aria-expanded]",
    );
    await expect(questions).toHaveCount(12);
    const firstQuestion = questions.first();
    const firstAnswer = noJavaScript
      ? checkpoint.locator("details").first().locator(":scope > div")
      : checkpoint.locator(
          `[aria-labelledby="${await firstQuestion.getAttribute("id")}"] > div`,
        );
    await expect(firstAnswer).toBeHidden();
    await firstQuestion.focus();
    await firstQuestion.press("Enter");
    await expect(firstAnswer).toBeVisible();
    await expect(firstAnswer).toContainText("Нет. Формула работает только при");
    await expect(firstQuestion).toBeFocused();
    await expect(firstQuestion.locator("svg")).toHaveCSS(
      "transform",
      "matrix(-1, 0, 0, -1, 0, 0)",
    );
    await questions.nth(1).focus();
    await questions.nth(1).press("Enter");
    await expect(firstAnswer).toBeVisible();
    if (!noJavaScript) {
      await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "true");
      await expect(checkpoint.locator("h3").first()).toHaveCSS(
        "border-bottom-width",
        "0px",
      );
    } else {
      await expect(checkpoint.locator("details[open]")).toHaveCount(2);
    }
    for (const width of [320, 390, 768, 1440]) {
      await this.page.setViewportSize({ width, height: 900 });
      await expect(firstQuestion.locator("span").first()).toHaveCSS(
        "font-size",
        "16px",
      );
      await expect(firstQuestion.locator("span").first()).toHaveCSS(
        "font-weight",
        "500",
      );
      await expect(firstAnswer).toHaveCSS("font-size", "16px");
      await expect(firstAnswer).toHaveCSS("color", "rgb(23, 23, 23)");
      await expect(firstAnswer).toHaveCSS("border-inline-start-width", "0px");
      await expect(firstAnswer).toHaveCSS("padding-inline-start", "16px");
      await expect(checkpoint).toHaveCSS(
        "background-color",
        "rgba(0, 0, 0, 0)",
      );
      await expect(checkpoint.locator(":scope > div > div").first()).toHaveCSS(
        "color",
        "rgb(23, 23, 23)",
      );
      await expect(checkpoint.locator(":scope > div > svg")).toHaveCount(1);
      const readableWidth = await checkpoint.evaluate((element) => {
        const content = element.lastElementChild!;
        return (
          content.getBoundingClientRect().left -
          element.getBoundingClientRect().left
        );
      });
      expect(readableWidth).toBeLessThanOrEqual(17);
      const comparisons = this.page.locator(
        '#theory [role="note"] [data-status]',
      );
      await expect(comparisons).toHaveCount(10);
      for (const comparison of await comparisons.all()) {
        const copy = comparison.locator(":scope > div > div");
        await expect(copy).toHaveCSS("font-size", "16px");
        await expect(copy).toHaveCSS("font-weight", "400");
        const bodyUsesPanelWidth = await copy.evaluate((element) => {
          const panel = element.closest("[data-status]")!;
          const style = getComputedStyle(panel);
          return (
            panel.getBoundingClientRect().width -
            parseFloat(style.paddingLeft) -
            parseFloat(style.paddingRight) -
            element.getBoundingClientRect().width
          );
        });
        expect(Math.abs(bodyUsesPanelWidth)).toBeLessThanOrEqual(1);
      }
      const callout = this.page.getByRole("complementary", {
        name: "Когда применим этот приём",
        exact: true,
      });
      await expect(callout.locator(":scope > div > span")).toHaveCSS(
        "font-size",
        "14px",
      );
      await expect(callout.locator(":scope > div > span")).toHaveCSS(
        "font-weight",
        "500",
      );
      await expect(callout.locator(":scope > div > div")).toHaveCSS(
        "font-size",
        "16px",
      );
      await this.expectNoHorizontalOverflow();
    }
    await this.page.setViewportSize({ width: 390, height: 844 });
    const task = this.page.locator(
      '[data-practice-task="rekursiya-base-sequence"]',
    );
    const hintTrigger = noJavaScript
      ? task.locator("summary").filter({ hasText: /^Подсказка$/ })
      : task.getByRole("button", { name: "Подсказка", exact: true });
    const solutionTrigger = noJavaScript
      ? task.locator("summary").filter({ hasText: /^Решение$/ })
      : task.getByRole("button", { name: "Решение", exact: true });
    const hint = task.locator('[data-content-context="hint"]');
    const solution = task.locator('[data-content-context="solution"]');
    await expect(hint).toBeHidden();
    await expect(solution).toBeHidden();
    await hintTrigger.focus();
    await hintTrigger.press("Enter");
    await expect(hint).toBeVisible();
    await expect(solution).toBeHidden();
    await solutionTrigger.focus();
    await solutionTrigger.press("Enter");
    await expect(solution).toBeVisible();
    await expect(hint).toBeVisible();
    await expect(solutionTrigger).toBeFocused();
    for (const paragraph of await task
      .locator(
        '[data-content-context="hint"] p, [data-content-context="solution"] p',
      )
      .all()) {
      await expect(paragraph).toHaveCSS("font-size", "16px");
      await expect(paragraph).toHaveCSS("color", "rgb(23, 23, 23)");
    }
    for (const trigger of [hintTrigger, solutionTrigger]) {
      await expect(trigger.locator("span").first()).toHaveCSS(
        "font-weight",
        "500",
      );
    }
    for (const content of [hint, solution]) {
      await expect(content.locator("..")).toHaveCSS(
        "border-inline-start-width",
        "0px",
      );
    }
    await solutionTrigger.press("Enter");
    await expect(solution).toBeHidden();
    await expect(hint).toBeVisible();
    await this.page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    try {
      await expect(hint.locator("p").first()).toHaveCSS("font-size", "32px");
      await expect(firstQuestion.locator("span").first()).toHaveCSS(
        "font-size",
        "32px",
      );
      await expect(
        this.page
          .locator('#theory [role="note"] [data-status] > div > div')
          .first(),
      ).toHaveCSS("font-size", "32px");
      await this.page.setViewportSize({ width: 900, height: 900 });
      await this.expectNoHorizontalOverflow();
    } finally {
      await this.page.evaluate(() => {
        document.documentElement.style.removeProperty("font-size");
      });
    }
    await firstQuestion.focus();
    await firstQuestion.press("Enter");
    await expect(firstAnswer).toBeHidden();
  }

  async expectSharedLearningLinkStyle(): Promise<void> {
    await expect(this.page.locator("[data-learning-profile]")).toHaveCount(0);
    await expect(
      this.page.locator("#theory section[id] > h3").first(),
    ).toHaveCSS("border-bottom-width", "1px");
    const headingSize = await this.page
      .locator("#theory section[id] > h3")
      .first()
      .evaluate((element) => getComputedStyle(element).fontSize);
    await expect(this.page.locator("#result h3").first()).toHaveCSS(
      "font-size",
      headingSize,
    );
    await this.page.setViewportSize({ width: 390, height: 844 });
    await expect(this.page.locator("#theory pre code").first()).toHaveCSS(
      "font-size",
      "14.4px",
    );
    await this.page.setViewportSize({ width: 1440, height: 900 });
    await expect(
      this.page.locator("[data-topic-lesson-context] a").first(),
    ).toHaveCSS("color", "rgb(0, 112, 210)");
    await expect(
      this.page.locator("[data-outline-link-id][aria-current]").first(),
    ).toHaveCSS("color", "rgb(0, 112, 210)");
  }

  async expectCodeDisclosureAndReturnToTop(): Promise<void> {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    const top = this.page.getByRole("button", { name: "К началу урока" });
    await expect(top).toBeHidden();
    const expand = this.page
      .getByRole("button", { name: "Показать весь код", exact: true })
      .first();
    await expand.click();
    const collapse = this.page
      .getByRole("button", { name: "Свернуть код", exact: true })
      .first();
    await expect(collapse).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await collapse.hover();
    await expect(collapse).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await collapse.click();
    await expect(expand).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await top.click();
    await expect(this.page.getByRole("heading", { level: 1 })).toBeFocused();
    await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBe(0);
    await expect(top).toBeHidden();
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.page.locator("#practice").scrollIntoViewIfNeeded();
    await expect(top).toBeVisible();
    await expect(this.page.locator("[data-scroll-to-top]")).toHaveCSS(
      "height",
      "40px",
    );
    const answer = this.page
      .getByRole("textbox", { name: "Ответ", exact: true })
      .first();
    await answer.focus();
    await expect(top).toBeHidden();
    await answer.press("Tab");
    await expect(top).toBeVisible();
    await top.click();
    await expect(this.page.getByRole("heading", { level: 1 })).toBeFocused();
    await expect(top).toBeHidden();
  }

  async expectSquareScrollbars(): Promise<void> {
    const geometry = await this.page.evaluate(() => {
      const root = document.documentElement;
      const code = document.querySelector("pre");
      const tabs = document.querySelector('[role="tablist"]');
      return {
        width: getComputedStyle(root, "::-webkit-scrollbar").width,
        radius: getComputedStyle(root, "::-webkit-scrollbar-thumb")
          .borderRadius,
        button: getComputedStyle(root, "::-webkit-scrollbar-button").display,
        tabs: tabs ? getComputedStyle(tabs).scrollbarWidth : null,
        code: code
          ? getComputedStyle(code, "::-webkit-scrollbar-thumb").backgroundColor
          : null,
      };
    });
    expect(geometry).toEqual({
      width: "6px",
      radius: "0px",
      button: "none",
      tabs: "auto",
      code: "rgb(228, 228, 228)",
    });
    await this.page.emulateMedia({ forcedColors: "active" });
    await expect(this.page.locator("html")).toHaveCSS(
      "scrollbar-color",
      "auto",
    );
    const forcedWidth = await this.page
      .locator("html")
      .evaluate((root) => getComputedStyle(root, "::-webkit-scrollbar").width);
    expect(forcedWidth).not.toBe("6px");
    await this.page.emulateMedia({ forcedColors: "none" });
  }

  async expectStudyDensity(): Promise<void> {
    const measurements = await this.page
      .locator("[data-outline-link-id]")
      .evaluateAll((nodes) => ({
        expected: matchMedia("(any-pointer: coarse)").matches ? 40 : 32,
        rows: nodes.map((node) => ({
          minimum: parseFloat(getComputedStyle(node).minHeight),
          height: node.getBoundingClientRect().height,
        })),
      }));
    for (const row of measurements.rows) {
      expect(row.minimum).toBe(measurements.expected);
      expect(row.height).toBeGreaterThanOrEqual(measurements.expected - 0.1);
    }
    await expect(this.page.locator("[data-practice-form]")).toHaveCSS(
      "box-shadow",
      "none",
    );
    await expect(this.page.locator("[data-practice-form]")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
  }

  async expectStudyFrame(): Promise<void> {
    await expect(this.page.locator("[data-public-header]")).toHaveAttribute(
      "data-expanded",
      "true",
    );
    await expect(
      this.page.getByRole("navigation", { name: "Разделы сайта" }).first(),
    ).toBeVisible();
    const explanation = await this.page
      .locator("[data-concept-explanation]")
      .first()
      .boundingBox();
    const blocks = await this.page
      .locator(
        "figure[data-learning-block], [data-concept-mistake] > *, [data-concept-checkpoint] > *",
      )
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          width: node.getBoundingClientRect().width,
          background: getComputedStyle(node).backgroundColor,
          figure: node.tagName === "FIGURE",
          worked:
            node.querySelector(":scope > figcaption")?.textContent ===
            "Разберём на примере",
        })),
      );
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      expect(block.width).toBeLessThanOrEqual(explanation!.width + 1);
      if (block.worked) {
        expect(block.background).not.toBe("rgba(0, 0, 0, 0)");
      } else if (block.figure) {
        expect(block.background).toBe("rgba(0, 0, 0, 0)");
      }
    }
    const rail = await this.page.locator("[data-outline-rail]").boundingBox();
    const footer = await this.page
      .locator("[data-lesson-footer]")
      .boundingBox();
    expect(Math.abs(rail!.y + rail!.height - footer!.y)).toBeLessThan(1);
    const continuation = await this.page
      .locator("[data-lesson-footer]")
      .evaluate((node) => ({
        width: parseFloat(getComputedStyle(node, "::before").width),
        height: parseFloat(getComputedStyle(node, "::before").height),
        border: getComputedStyle(node, "::before").borderRightWidth,
      }));
    expect(continuation.border).toBe("1px");
    expect(Math.abs(continuation.width + 1 - rail!.width)).toBeLessThan(1);
    expect(Math.abs(continuation.height - footer!.height)).toBeLessThan(1);
  }

  async expectStudyNavigationAndAccessibility(): Promise<void> {
    await this.page.setViewportSize({ width: 1440, height: 1000 });
    await this.expectStudyFrame();
    await expect(this.page.locator("[data-outline-rail]")).toHaveCSS(
      "border-right-width",
      "1px",
    );
    await expect(this.page.locator("[data-topic-lesson-context]")).toHaveCSS(
      "border-bottom-width",
      "1px",
    );
    await expect(this.page.locator("[data-result-progress]")).toContainText(
      `0 / ${this.config.taskCount ?? 5}`,
    );
    await this.expectStudyDensity();
    await this.page.setViewportSize({ width: 390, height: 844 });
    const trigger = this.page.getByRole("button", {
      name: "Содержание урока",
      exact: true,
    });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    const title = await this.page
      .getByRole("heading", { level: 1 })
      .boundingBox();
    const contents = await trigger.boundingBox();
    expect(title!.y + title!.height).toBeLessThan(contents!.y);
    await trigger.focus();
    await trigger.press("Enter");
    const links = this.page
      .getByRole("navigation", { name: "Содержание урока" })
      .getByRole("link");
    await this.expectStudyDensity();
    const bounds = await links.evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return { top: box.top, bottom: box.bottom, height: box.height };
      }),
    );
    for (let index = 0; index < bounds.length; index++) {
      expect(bounds[index].height).toBeGreaterThanOrEqual(32);
      if (index > 0)
        expect(bounds[index].top).toBeGreaterThanOrEqual(
          bounds[index - 1].bottom,
        );
    }
    const destination = links.nth(1);
    const hash = await destination.getAttribute("href");
    await destination.focus();
    await destination.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(this.page.locator(hash!)).toBeFocused();
    expect(new URL(this.page.url()).hash).toBe(hash);
    await this.expectNoHorizontalOverflow();
    await this.page.setViewportSize({ width: 961, height: 844 });
    await expect(trigger).toHaveCount(0);
    await expect(destination).toBeVisible();
    await this.page.setViewportSize({ width: 960, height: 844 });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await this.page.setViewportSize({ width: 1440, height: 1000 });
    await this.page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await expect(this.page.locator("html")).toHaveCSS("font-size", "32px");
    await this.expectNoHorizontalOverflow();
    await this.page.evaluate(() => {
      document.documentElement.style.removeProperty("font-size");
    });
    const accessibility = await new AxeBuilder({ page: this.page }).analyze();
    expect(accessibility.violations).toEqual([]);
  }

  async expectPublishedNumberSequencesContent(
    noJavaScript = false,
  ): Promise<void> {
    await this.expectPublishedTopicIdentity();
    for (const anchor of [
      "sequence-from-file",
      "single-values",
      "neighbor-pairs",
      "neighbor-triples",
      "two-passes",
      "verify-boundaries",
    ]) {
      await expect(this.page.locator(`#${anchor}`)).toHaveCount(1);
    }
    for (const slug of [
      "schetchiki-i-nakopiteli",
      "spiski",
      "fayly",
      "otbor-rezultata",
    ]) {
      await expect(
        this.page.locator(`#theory a[href="/courses/python/${slug}"]`),
      ).not.toHaveCount(0);
    }
    const averageCallout = this.page.locator(
      'aside[aria-label="Среднее уже найдено"]',
    );
    const partialExample = averageCallout.getByRole("group", {
      name: "Дополнить условие второго прохода",
    });
    await this.expectCodeContrast(partialExample);
    await this.expectTaskPractice(noJavaScript);
    if (!noJavaScript) {
      await expect(this.page.locator("[data-result-progress]")).toContainText(
        "0 / 8",
      );
    }
    await this.expectNoHorizontalOverflow();
  }

  async expectPublishedStringProcessingContent(
    noJavaScript = false,
  ): Promise<void> {
    await this.expectPublishedTopicIdentity();
    for (const anchor of [
      "file-and-string",
      "positions-and-fragments",
      "adjacent-and-overlapping",
      "longest-valid-run",
      "occurrence-limit",
      "expression-grammar",
      "linear-expression-scan",
      "independent-verification",
    ]) {
      await expect(this.page.locator(`#${anchor}`)).toHaveCount(1);
    }
    await expect(
      this.page.locator('#theory a[href="/courses/python/stroki"]'),
    ).not.toHaveCount(0);
    await expect(
      this.page.locator('#theory a[href="/courses/python/fayly"]'),
    ).not.toHaveCount(0);
    await this.expectCodeContrast(
      this.page.getByRole("group", {
        name: "За один проход найти длину завершённого выражения",
      }),
    );
    await this.expectTaskPractice(noJavaScript);
    await expect(this.page.locator("#practice a[download]")).toHaveCount(8);
    if (!noJavaScript) {
      await this.expectStudyNavigationAndAccessibility();
      await this.expectCodeKeyboardFocus(
        "За один проход найти длину завершённого выражения",
      );
    }
  }

  async expectPublishedIntegerProcessingContent(
    noJavaScript = false,
  ): Promise<void> {
    await this.expectPublishedTopicIdentity();
    for (const anchor of [
      "integer-range",
      "divisibility-remainder",
      "decimal-digits",
      "divisors",
      "primes",
      "divisor-pairs",
      "decimal-mask",
      "bounded-search",
    ]) {
      await expect(this.page.locator("#" + anchor)).toHaveCount(1);
    }
    for (const slug of [
      "for-i-range",
      "while",
      "tsifry-chisla",
      "spiski",
      "chisla-i-vyrazheniya",
    ]) {
      await expect(
        this.page.locator('#theory a[href="/courses/python/' + slug + '"]'),
      ).not.toHaveCount(0);
    }
    await this.expectCodeContrast(
      this.page.getByRole("group", {
        name: "Найти первые пять чисел от 100 до 1000 с тремя делителями",
      }),
    );
    await expect(this.page.getByLabel("Проверьте себя")).toHaveCount(1);
    await this.expectTaskPractice(noJavaScript);
    await expect(this.page.locator("#practice a[download]")).toHaveCount(0);
    await this.expectNoHorizontalOverflow();
  }

  async expectPublishedArrayProcessingContent(
    noJavaScript = false,
  ): Promise<void> {
    await this.expectPublishedTopicIdentity();
    await this.expectTheorySectionsAndLinks(
      [
        "sorted-order",
        "file-records",
        "capacity-selection",
        "secondary-optimum",
        "event-stream",
        "independent-check",
      ],
      ["spiski", "sortirovka-i-poisk", "fayly", "slovari"],
    );
    await this.expectCodeContrast(
      this.page.getByRole("group", {
        name: "Сортировать целые записи по очкам",
      }),
    );
    await expect(this.page.getByLabel("Проверьте себя")).toHaveCount(1);
    await this.expectTaskPractice(noJavaScript, 7);
    if (noJavaScript) {
      await expect(this.page.locator("#practice a[download]")).toHaveCount(4);
    } else {
      await expect(this.page.locator("[data-result-progress]")).toContainText(
        "0 / 7",
      );
      await this.page
        .getByRole("tab", { name: /Найдите третью запись после сортировки/ })
        .click();
      await expect(this.page.locator("#practice a[download]")).toHaveCount(4);
      await expect(
        this.page.locator('[data-practice-task="task-26-04"] a[download]'),
      ).toBeVisible();
      await this.page
        .getByRole("tab", { name: /Найдите клиента с наибольшим объёмом/ })
        .click();
      await expect(
        this.page.locator('[data-practice-task="task-26-07"] a[download]'),
      ).toBeVisible();
    }
    await this.expectNoHorizontalOverflow();
  }

  async expectPublishedDataAnalysisContent(
    noJavaScript = false,
  ): Promise<void> {
    await this.expectPublishedTopicIdentity();
    await this.expectTheorySectionsAndLinks(
      [
        "points-and-records",
        "spatial-clusters",
        "energy-clusters",
        "cluster-centre",
        "distance-and-filter",
        "combined-result",
        "independent-check",
      ],
      ["fayly", "spiski", "sortirovka-i-poisk", "slovari"],
    );
    await this.expectCodeContrast(
      this.page.getByRole("group", {
        name: "Разделить отсортированные энергии по размаху",
      }),
    );
    await expect(this.page.getByLabel("Проверьте себя")).toHaveCount(1);
    await this.expectTaskPractice(noJavaScript, 7);
    if (noJavaScript) {
      await expect(this.page.locator("#practice a[download]")).toHaveCount(3);
    } else {
      await expect(this.page.locator("[data-result-progress]")).toContainText(
        "0 / 7",
      );
      await this.page.getByRole("tab").nth(4).click();
      await expect(
        this.page.locator('[data-practice-task="task-27-05"] a[download]'),
      ).toBeVisible();
    }
    await this.expectNoHorizontalOverflow();
  }

  private async expectTheorySectionsAndLinks(
    anchors: readonly string[],
    courseSlugs: readonly string[],
  ): Promise<void> {
    for (const anchor of anchors) {
      await expect(this.page.locator("#" + anchor)).toHaveCount(1);
    }
    for (const slug of courseSlugs) {
      await expect(
        this.page.locator('#theory a[href="/courses/python/' + slug + '"]'),
      ).not.toHaveCount(0);
    }
  }

  async expectPublishedNumberRecordLesson(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
    await expectPublishedLessonDocument(this.page, {
      canonicalPath: this.config.route,
      title: this.config.title,
    });
    await expect(
      this.page.getByText(
        "Задание " + String(this.config.taskNumber) + " · 5 задач",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(this.page.locator("[data-article-frame] img")).toHaveCount(0);
    await expect(this.page.getByLabel("Проверьте себя")).toHaveCount(1);
    await expect(
      this.page.getByRole("heading", { level: 2, name: "Прогресс" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", {
        name: "Предыдущий урок: Рекурсивные алгоритмы",
      }),
    ).toHaveAttribute("href", "/ege/16-rekursiya");
    await expect(this.page.getByRole("link", { name: "Все темы" })).toHaveCount(
      0,
    );
  }

  async expectKeyboardHelpDisclosures(): Promise<void> {
    await expectKeyboardLessonDisclosures(this.page);
    const firstTask = this.page.locator("[data-practice-task]").first();
    const solution = firstTask.getByRole("button", { name: "Решение" });
    await solution.focus();
    await solution.press("Enter");
    await expect(solution).toHaveAttribute("aria-expanded", "true");
    await expect(firstTask.getByText(/19₁₀ = 10011₂/)).toBeVisible();
  }

  async expectRichPracticeStatement(): Promise<void> {
    const taskTab = this.page.getByRole("tab", {
      name: /Проследите рекурсивные вызовы/,
    });
    await taskTab.click();
    const task = this.page.locator(
      '[data-practice-task="rekursiya-call-stack-trace"]',
    );
    await expect(
      task.getByRole("group", { name: "Рекурсивная функция" }),
    ).toBeVisible();
    await expect(task.getByRole("table")).toHaveCount(0);
    await expect(
      task.getByRole("group", { name: "Рекурсивная функция" }),
    ).toContainText("F(3) = ?");
    await expect(task.getByText("f(5)", { exact: true })).toBeVisible();
    await this.expectNoHorizontalOverflow();
  }

  async expectRichPracticeStatementWithoutJavaScript(): Promise<void> {
    const task = this.page.locator(
      '[data-practice-task="rekursiya-call-stack-trace"]',
    );
    await expect(
      task.getByRole("group", { name: "Рекурсивная функция" }),
    ).toBeVisible();
    await expect(task.getByRole("table")).toHaveCount(0);
    await expect(
      task.getByRole("group", { name: "Рекурсивная функция" }),
    ).toContainText("F(5) = ?");
  }

  async expectStableOutlineSelection(): Promise<void> {
    const outline = this.page.getByRole("navigation", {
      name: "Содержание урока",
    });
    const childLinks = outline.locator("ol ol [data-outline-link-id]");
    const readGeometry = () =>
      childLinks.evaluateAll((links) =>
        links.map((link) => ({
          fontWeight: getComputedStyle(link).fontWeight,
          height: link.getBoundingClientRect().height,
          whiteSpace: getComputedStyle(link).whiteSpace,
          width: link.getBoundingClientRect().width,
        })),
      );

    const before = await readGeometry();
    const target = outline.getByRole("link", {
      name: "Почему это вообще определяет функцию",
    });
    await target.click();
    await expect(target).toHaveAttribute("aria-current", "location");
    expect(await readGeometry()).toEqual(before);
    expect(new Set(before.map((item) => item.fontWeight))).toEqual(
      new Set(["400"]),
    );
    expect(new Set(before.map((item) => item.whiteSpace))).toEqual(
      new Set(["normal"]),
    );
    expect(Math.max(...before.map((item) => item.height))).toBeGreaterThan(32);
    await this.page.evaluate(() => {
      history.replaceState(null, "", location.pathname);
      document.scrollingElement?.scrollTo({ top: 0 });
    });
  }

  async expectPublishedNumberRecordLessonReadableWithoutJavaScript(): Promise<void> {
    await this.open();
    await this.expectPublishedNumberRecordLesson();
    await expect(this.page.locator("[data-practice-form] form")).toHaveCount(5);
    await expect(
      this.page.locator("[data-practice-form] [data-unenhanced-accordion]"),
    ).toHaveCount(5);
    await expect(this.page.getByText(/19₁₀ = 10011₂/)).toBeVisible();
    await expect(this.page.locator("[data-article-frame] img")).toHaveCount(0);
    await expect(
      this.page.getByText(
        "Прогресс хранится только в этом браузере и появится после загрузки страницы.",
      ),
    ).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Все темы" })).toHaveCount(
      0,
    );
    await this.expectNoHorizontalOverflow();
  }

  async expectPublishedLesson(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
    await expect(this.page).toHaveTitle("Рекурсивные алгоритмы — infraege");
    await expect(
      this.page.getByRole("link", {
        name: "infraege — ЕГЭ информатика, на главную",
      }),
    ).toHaveAttribute("href", "/");
    await expectPublishedLessonDocument(this.page, {
      canonicalPath: "/ege/16-rekursiya",
      title: "Рекурсивные алгоритмы",
    });
    await expectLessonVerticalRhythm(this.page);
    await expectRelatedLearningBlockRhythm(
      this.page,
      "Когда применим этот приём",
    );
    await expect(
      this.page.getByRole("link", { name: "Обработка данных" }),
    ).toHaveAttribute("href", "/privacy");
    await expect(
      this.page.getByRole("link", { name: "Назад", exact: true }),
    ).toHaveAttribute("href", "/");
    await expect(
      this.page
        .getByRole("navigation", { name: "Содержание урока" })
        .getByRole("link", {
          name: "Вычисляем F(5) по правилу",
          includeHidden: true,
        }),
    ).toHaveAttribute("href", "#concrete-computation");
    await expect(
      this.page.getByText("называют рекуррентным определением", {
        exact: false,
      }),
    ).toBeVisible();
    await expect(
      this.page.getByText("стеке вызовов — списке функций", { exact: false }),
    ).toBeVisible();
    await expect(
      this.page.getByText("называют кешированием", { exact: false }),
    ).toBeVisible();
    await expect(this.page.locator("[data-article-frame] img")).toHaveCount(0);
    await expect(this.page.locator("[data-outline-tree] svg")).toHaveCount(0);
    await expect(
      this.page.getByRole("heading", { name: "Что получилось" }),
    ).toBeVisible();
    const hierarchy = await this.page.evaluate(() => {
      const stage = document.querySelector<HTMLElement>("#theory > h2");
      const subsection = document.querySelector<HTMLElement>(
        "#theory section > h3",
      );
      if (!stage || !subsection) return null;
      return {
        stageColor: getComputedStyle(stage).color,
        stageSize: Number.parseFloat(getComputedStyle(stage).fontSize),
        stageTransform: getComputedStyle(stage).textTransform,
        subsectionColor: getComputedStyle(subsection).color,
        subsectionSize: Number.parseFloat(
          getComputedStyle(subsection).fontSize,
        ),
      };
    });
    expect(hierarchy?.stageTransform).toBe("uppercase");
    expect(hierarchy?.stageColor).not.toBe(hierarchy?.subsectionColor);
    expect(hierarchy?.subsectionSize ?? 0).toBeGreaterThan(
      (hierarchy?.stageSize ?? 0) + 10,
    );
    const mistake = this.page
      .getByLabel("Сравнение ошибочного и правильного рассуждения")
      .first();
    await expect(mistake.getByText("Неверно")).toBeVisible();
    await expect(mistake.getByText("Как правильно")).toBeVisible();
    await expect(mistake.locator("svg")).toHaveCount(2);
    await expect(mistake.getByText("Что здесь не так")).toHaveCount(0);
    const lessonNavigationGeometry = await this.page.evaluate(() => {
      const outline = document.querySelector<HTMLElement>(
        "[data-outline-tree]",
      );
      const comparison = document.querySelector<HTMLElement>(
        '[aria-label="Сравнение ошибочного и правильного рассуждения"]',
      );
      const checkpoint = document.querySelector<HTMLElement>(
        '[aria-label="Проверьте себя"]',
      );
      const mistakeLabel = comparison?.querySelector<HTMLElement>("span");
      const checkpointLabel =
        checkpoint?.querySelector<HTMLElement>(":scope > div > div");
      const mistakeIcon = comparison?.querySelector<SVGElement>("svg");
      const checkpointIcon = checkpoint?.querySelector<SVGElement>("svg");
      const mistakeCopy = comparison?.querySelector<HTMLElement>(
        ':scope > [data-status="incorrect"] > div',
      );
      const checkpointContent = checkpoint?.querySelector<HTMLElement>(
        ':scope > [data-enhanced="true"], :scope > [data-unenhanced-accordion]',
      );
      const correctComparison = comparison?.querySelector<HTMLElement>(
        ':scope > [data-status="correct"]',
      );
      if (
        !outline ||
        !comparison ||
        !checkpoint ||
        !mistakeLabel ||
        !checkpointLabel ||
        !mistakeIcon ||
        !checkpointIcon ||
        !mistakeCopy ||
        !checkpointContent ||
        !correctComparison
      ) {
        throw new Error("Missing lesson navigation or mistake comparison");
      }
      const outlineIsSingleColumn = Array.from(
        outline.querySelectorAll<HTMLOListElement>("ol"),
      ).every((list) => {
        const children = Array.from(list.children, (item) =>
          item.getBoundingClientRect(),
        );
        return children.every(
          (item, index) =>
            index === 0 || Math.abs(item.left - children[0]!.left) < 1,
        );
      });
      const comparisons = Array.from(comparison.children, (item) =>
        item.getBoundingClientRect(),
      );
      const checkpointStyle = getComputedStyle(checkpoint);
      const correctComparisonStyle = getComputedStyle(correctComparison);
      const mistakeLabelStyle = getComputedStyle(mistakeLabel);
      const checkpointLabelStyle = getComputedStyle(checkpointLabel);
      const mistakeIconRect = mistakeIcon.getBoundingClientRect();
      const checkpointIconRect = checkpointIcon.getBoundingClientRect();
      return {
        outlineIsSingleColumn,
        mistakeIsVertical:
          comparisons.length === 2 &&
          comparisons[1]!.top >= comparisons[0]!.bottom,
        mistakeHasTintedFill:
          correctComparisonStyle.backgroundColor !== "rgba(0, 0, 0, 0)" &&
          correctComparisonStyle.backgroundColor !== "transparent",
        checkpointHasTintedFill:
          checkpointStyle.backgroundColor !== "rgba(0, 0, 0, 0)" &&
          checkpointStyle.backgroundColor !== "transparent",
        learningBlockGeometryMatches:
          mistakeLabelStyle.fontSize === checkpointLabelStyle.fontSize &&
          mistakeLabelStyle.fontWeight === checkpointLabelStyle.fontWeight &&
          mistakeIconRect.width === checkpointIconRect.width &&
          mistakeIconRect.height === checkpointIconRect.height,
      };
    });
    expect(lessonNavigationGeometry.outlineIsSingleColumn).toBe(true);
    expect(lessonNavigationGeometry.mistakeIsVertical).toBe(true);
    expect(lessonNavigationGeometry.mistakeHasTintedFill).toBe(true);
    expect(lessonNavigationGeometry.checkpointHasTintedFill).toBe(false);
    expect(lessonNavigationGeometry.learningBlockGeometryMatches).toBe(true);
    await expect(
      this.page.getByRole("heading", { name: "Теперь вы умеете" }),
    ).toHaveCount(0);
    await expect(this.page.getByText("Доступные материалы")).toHaveCount(0);
    await expect(
      this.page.getByRole("heading", { level: 2, name: "Прогресс" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", {
        name: "Преобразование записей чисел",
      }),
    ).toHaveAttribute("href", "/ege/5-preobrazovanie-zapisey-chisel");
    await expect(
      this.page.getByText("Задание 16 · 5 задач", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Задание 16 · 5 задач", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Освоение темы" }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("navigation", { name: "Вернуться к теории" }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("heading", { name: "После урока вы сможете" }),
    ).toHaveCount(0);
    await expect(this.page.getByLabel("Проверьте себя")).toHaveCount(1);
    await expect(
      this.page
        .getByRole("group", {
          name: "Универсальный шаблон: одно предыдущее значение",
        })
        .getByText("Python", { exact: true }),
    ).toBeVisible();
  }

  async expectDesktopComposition(): Promise<void> {
    const context = this.page.locator("[data-topic-lesson-context]");
    await expect(context).toHaveCSS("border-bottom-width", "1px");
    await expect(
      context.getByRole("link", { name: "Назад", exact: true }),
    ).toBeVisible();
    await expect(
      context.getByText("Задание 16 · Рекурсивные алгоритмы", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("progressbar", { name: "Решённые задачи урока" }),
    ).toBeVisible();

    const layout = await this.page
      .locator("[data-lesson-frame]")
      .evaluate((lesson) => {
        const rail = lesson.querySelector<HTMLElement>("[data-outline-rail]");
        const railContents = rail?.firstElementChild;
        const article = lesson.querySelector<HTMLElement>(
          "[data-article-frame]",
        );
        const marginRail =
          lesson.querySelector<HTMLElement>("[data-margin-rail]");
        if (!rail || !railContents || !article || !marginRail) {
          throw new Error("Missing lesson composition");
        }
        return {
          columns: getComputedStyle(lesson).gridTemplateColumns,
          railPosition: getComputedStyle(railContents).position,
          articleDisplay: getComputedStyle(article).display,
          railHasProgress: Boolean(rail.querySelector('[role="progressbar"]')),
          articleHasProgress: Boolean(
            article.querySelector('[role="progressbar"]'),
          ),
          progressLabelSize: rail.querySelector<HTMLElement>(
            "[data-result-progress] h2",
          )
            ? getComputedStyle(
                rail.querySelector<HTMLElement>(
                  "[data-result-progress] h2",
                ) as HTMLElement,
              ).fontSize
            : null,
          marginRailChildren: marginRail.childElementCount,
          mistakeLeft: article
            .querySelector<HTMLElement>("[data-concept-mistake]")
            ?.getBoundingClientRect().left,
          explanationLeft: article
            .querySelector<HTMLElement>("[data-concept-explanation]")
            ?.getBoundingClientRect().left,
        };
      });
    expect(layout.columns.split(" ")).toHaveLength(3);
    expect(layout.railPosition).toBe("sticky");
    expect(layout.articleDisplay).toBe("block");
    expect(layout.railHasProgress).toBe(true);
    expect(layout.articleHasProgress).toBe(false);
    expect(layout.progressLabelSize).toBe("12px");
    expect(layout.marginRailChildren).toBe(0);
    expect(
      Math.abs((layout.mistakeLeft ?? 0) - (layout.explanationLeft ?? 0)),
    ).toBeLessThan(2);
    await expectDesktopLessonRail(this.page);
  }

  async expectMobileComposition(): Promise<void> {
    const contents = this.page.getByRole("button", {
      name: "Содержание урока",
      exact: true,
    });
    await contents.click();
    await expect(contents).toHaveAttribute("aria-expanded", "true");
    await expectLessonInteractiveTargets(this.page);
    await expect(
      this.page.getByText(
        `Задание ${String(this.config.taskNumber)} · ${this.config.title}`,
        {
          exact: true,
        },
      ),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Назад", exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("textbox", { name: "Ответ" }).first(),
    ).toBeVisible();
    await expect(this.page.getByText("Подсказка").first()).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Решение" }).first(),
    ).toBeVisible();
  }

  async expectDirectEntryBackFallback(): Promise<void> {
    await this.page.goto("about:blank");
    await this.open();
    await this.page.getByRole("link", { name: "Назад", exact: true }).click();
    await expect(this.page).toHaveURL(/\/$/);
    await expect(
      this.page.getByRole("heading", {
        name: "Информатика - это система",
      }),
    ).toBeVisible();
  }

  async expectInternalBackNavigation(): Promise<void> {
    await this.page.goto("/ege#exam-map-heading");
    await expect(
      this.page.getByRole("heading", { name: "Темы ЕГЭ по информатике" }),
    ).toBeVisible();
    await expect(this.page).toHaveURL(/\/ege\/?#exam-map-heading$/);
    await expect(
      this.page.locator("[data-topic-catalog-page] main"),
    ).toHaveAttribute("data-motion-active", "true");
    await this.page
      .getByRole("article")
      .filter({
        has: this.page.getByRole("heading", { name: "Рекурсивные алгоритмы" }),
      })
      .getByRole("link", { name: "Открыть тему" })
      .click();
    await expect(this.page).toHaveURL(/\/ege\/16-rekursiya$/);
    await expect(
      this.page.locator("[data-practice-form][data-enhanced]"),
    ).toBeVisible();
    const backLink = this.page.getByRole("link", {
      name: "Назад",
      exact: true,
    });
    await backLink.click();
    await expect(this.page).toHaveURL(/\/ege\/?#exam-map-heading$/);
  }

  async expectPracticeSolutions(): Promise<void> {
    await this.page
      .getByRole("tab", {
        name: /Задача 1 из 14/,
      })
      .click();
    const firstPanel = this.page.locator("[data-practice-task]").first();
    await firstPanel.getByRole("button", { name: "Решение" }).click();
    await expect(firstPanel.getByText(/F\(5\) = 32/)).toBeVisible();

    await this.page
      .getByRole("tab", {
        name: /Задача 2 из 14: Проследите рекурсивные вызовы/,
      })
      .click();
    const tracePanel = this.page.locator(
      '[data-practice-task="rekursiya-call-stack-trace"]',
    );
    await tracePanel.getByRole("button", { name: "Решение" }).click();
    await expect(
      tracePanel.getByRole("group", {
        name: "Та же рекуррентная формула в Python",
      }),
    ).toBeVisible();
  }

  async expectDistilledSolvedTask(): Promise<void> {
    const firstTab = this.page.getByRole("tab", {
      name: /Задача 1 из 14/,
    });
    await firstTab.click();
    const firstPanel = this.page.locator(
      '[data-practice-task="rekursiya-base-sequence"]',
    );
    const answer = firstPanel.getByRole("textbox", { name: "Ответ" });
    await answer.fill("32");
    await firstPanel.getByRole("button", { name: "Проверить" }).click();
    await expect(firstPanel.getByRole("status")).toContainText("Верно");
    await expect(answer).toBeDisabled();
    await expect(answer).toHaveAttribute("data-solved", "true");
    await expect(answer).toHaveValue("32");
    await expect(
      firstPanel.locator("[data-answer-accepted-icon]"),
    ).toBeVisible();
    await expect(
      firstPanel.getByRole("button", { name: "Проверить" }),
    ).toBeDisabled();
    await expect(firstPanel.getByText("решено", { exact: true })).toHaveCount(
      0,
    );
    await expect(
      this.page.getByRole("button", { name: /Следующая задача:/ }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("link", { name: "Перейти к результату" }),
    ).toHaveCount(0);

    await expect(firstTab).toHaveAttribute(
      "aria-label",
      /Задача 1 из 14:.*решена/,
    );
    await expect(firstTab).toHaveAttribute("data-solved", "true");
    const solvedColors = await answer.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        border: style.borderColor,
      };
    });

    const secondTab = this.page.getByRole("tab", { name: /Задача 2 из 14/ });
    await secondTab.click();
    await expect(secondTab).toHaveAttribute("aria-selected", "true");
    const unsolvedColors = await this.page
      .locator('[data-practice-task="rekursiya-call-stack-trace"]')
      .getByRole("textbox", { name: "Ответ" })
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          background: style.backgroundColor,
          border: style.borderColor,
        };
      });
    expect(solvedColors.border).toBe(unsolvedColors.border);
    expect(solvedColors.background).toBe(unsolvedColors.background);
    await firstTab.click();
    await expect(firstTab).toHaveAttribute("aria-selected", "true");

    await this.page.reload();
    const restoredAnswer = this.page
      .locator('[data-practice-task="rekursiya-base-sequence"]')
      .getByRole("textbox", { name: "Ответ" });
    await expect(restoredAnswer).toHaveValue("32");
    await expect(restoredAnswer).toBeDisabled();
    await expect(
      this.page
        .locator('[data-practice-task="rekursiya-base-sequence"]')
        .getByRole("button", { name: "Проверить" }),
    ).toBeDisabled();
  }

  async expectProgressClosureJourney(): Promise<void> {
    await this.page.goto("/ege/5-preobrazovanie-zapisey-chisel");
    await this.solveTask("preobrazovanie-zapisey-appending", 1, "77");
    await this.page.reload();
    const otherLessonAnswer = this.page
      .locator('[data-practice-task="preobrazovanie-zapisey-appending"]')
      .getByRole("textbox", { name: "Ответ" });
    await expect(otherLessonAnswer).toHaveValue("77");
    await expect(otherLessonAnswer).toBeDisabled();

    await this.open();
    await expect(
      this.page.locator("[data-practice-form][data-enhanced]"),
    ).toBeVisible();
    const firstPanel = this.page.locator(
      '[data-practice-task="rekursiya-base-sequence"]',
    );
    const firstAnswer = firstPanel.getByRole("textbox", { name: "Ответ" });
    const firstCheck = firstPanel.getByRole("button", { name: "Проверить" });

    await firstAnswer.fill("31");
    await firstCheck.click();
    await expect(
      firstPanel.getByText(
        "Ответ пока не подходит. Попробуйте ещё раз или откройте подсказку.",
      ),
    ).toBeVisible();
    await expect(firstAnswer).toBeEnabled();
    await expect(firstAnswer).toHaveValue("31");

    let failedChecks = 0;
    await this.page.route(
      "**/api/tasks/rekursiya-base-sequence/check",
      async (route) => {
        failedChecks += 1;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      },
      { times: 1 },
    );
    await firstAnswer.fill("32");
    await firstCheck.click();
    await expect(
      firstPanel.getByText("Не удалось проверить ответ. Попробуйте ещё раз."),
    ).toBeVisible();
    expect(failedChecks).toBe(1);
    await expect(firstAnswer).toBeEnabled();
    await expect(firstAnswer).toHaveValue("32");

    await firstCheck.click();
    await expect(firstPanel.getByRole("status")).toContainText("Верно");
    // Mastery is 80%: 12 of 14 lesson tasks are the first passing count.
    const solvedAnswers = [
      ["rekursiya-call-stack-trace", "16"],
      ["rekursiya-two-values", "29"],
      ["rekursiya-repeated-calls", "25"],
      ["rekursiya-digit-steps", "76"],
      ["rekursiya-true-division", "3.0"],
      ["rekursiya-branch-doubling", "51"],
      ["rekursiya-upward-chain", "2255"],
      ["rekursiya-two-functions-table", "25"],
      ["rekursiya-count-arguments", "8"],
      ["rekursiya-large-ratio", "9900"],
      ["rekursiya-difference-terms", "23978"],
    ] as const;
    for (const [index, [taskId, answer]] of solvedAnswers.entries()) {
      await this.solveTask(taskId, index + 2, answer, 14);
    }

    const resultProgress = this.page.locator("[data-result-progress]");
    await expect(
      resultProgress.getByText("12 / 14", { exact: true }),
    ).toBeVisible();
    await expect(resultProgress.getByText("Урок пройден")).toBeVisible();

    await this.page.reload();
    await expect(
      this.page
        .locator('[data-practice-task="rekursiya-base-sequence"]')
        .getByRole("textbox", { name: "Ответ" }),
    ).toHaveValue("32");
    await expect(resultProgress.getByText("Урок пройден")).toBeVisible();

    const reset = resultProgress.getByRole("button", {
      name: "Сбросить прогресс урока",
    });
    await reset.focus();
    await reset.press("Enter");
    const dialog = this.page.getByRole("alertdialog", {
      name: "Сбросить прогресс?",
    });
    await expect(dialog).toBeVisible();
    const cancel = dialog.getByRole("button", { name: "Отмена" });
    await expect(cancel).toBeFocused();
    await cancel.press("Enter");
    await expect(reset).toBeFocused();
    await expect(resultProgress.getByText("Урок пройден")).toBeVisible();

    await reset.press("Enter");
    const confirm = this.page.getByRole("alertdialog").getByRole("button", {
      name: "Сбросить",
      exact: true,
    });
    await confirm.focus();
    await confirm.press("Enter");
    await expect(reset).toBeFocused();
    await expect(
      resultProgress.getByText("0 / 14", { exact: true }),
    ).toBeVisible();
    await expect(
      resultProgress.getByText("Вы ещё не решали задания"),
    ).toHaveCount(0);
    await expect(firstAnswer).toBeEnabled();
    await expect(firstAnswer).toHaveValue("");

    await this.dismissAnalyticsPrompt();
    await this.page
      .getByRole("link", {
        name: "Преобразование записей чисел",
      })
      .click();
    await expect(this.page).toHaveURL(
      /\/ege\/5-preobrazovanie-zapisey-chisel$/,
    );
    const preservedOtherAnswer = this.page
      .locator('[data-practice-task="preobrazovanie-zapisey-appending"]')
      .getByRole("textbox", { name: "Ответ" });
    await expect(preservedOtherAnswer).toHaveValue("77");
    await expect(preservedOtherAnswer).toBeDisabled();

    await this.page
      .getByRole("link", {
        name: "infraege — ЕГЭ информатика, на главную",
      })
      .click();
    await expect(this.page).toHaveURL(/\/$/);
    await expect(
      this.page.getByRole("heading", {
        name: "Информатика - это система",
      }),
    ).toBeVisible();
    await this.open();
  }

  private async dismissAnalyticsPrompt(): Promise<void> {
    const prompt = this.page.getByRole("complementary", {
      name: "Настройки необязательной аналитики",
    });
    await expect(prompt).toBeVisible();
    await prompt.getByRole("button", { name: "Не сейчас" }).click();
    await expect(prompt).toBeHidden();
  }

  async expectReadingPosition(): Promise<void> {
    const value = this.page.locator("[data-reading-position-value]");
    await expect(this.page.locator("[data-reading-position]")).toBeVisible();
    await expect(
      this.page.locator("[data-practice-form][data-enhanced]"),
    ).toBeVisible();
    await this.page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    });
    await expect(value).toHaveAttribute("style", /scaleX\(0\)/);
    await this.page.evaluate(() => {
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop =
          document.scrollingElement.scrollHeight;
      }
    });
    await expect
      .poll(() =>
        value.evaluate((element) => {
          const match = element.getAttribute("style")?.match(/scaleX\((.+)\)/);
          return Number(match?.[1] ?? 0);
        }),
      )
      .toBeGreaterThan(0.99);
    await this.page.evaluate(() => {
      document.documentElement.style.removeProperty("scroll-behavior");
    });
  }

  async expectNoHorizontalOverflow(): Promise<void> {
    const overflow = await this.page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      offenders: Array.from(document.querySelectorAll<HTMLElement>("*"))
        .map((element) => {
          const bounds = element.getBoundingClientRect();
          return {
            tag: element.tagName,
            className: element.className,
            left: Math.round(bounds.left),
            right: Math.round(bounds.right),
            width: Math.round(bounds.width),
            scrollWidth: element.scrollWidth,
            overflowX: getComputedStyle(element).overflowX,
            text: element.textContent?.trim().slice(0, 80) ?? "",
          };
        })
        .filter(
          (element) =>
            element.left < -1 || element.right > window.innerWidth + 1,
        )
        .sort((left, right) => right.right - left.right)
        .slice(0, 12),
    }));
    expect(
      overflow.documentWidth,
      JSON.stringify(overflow, null, 2),
    ).toBeLessThanOrEqual(overflow.viewportWidth);
  }

  async expectReadableWithoutJavaScript(): Promise<void> {
    await this.open();
    await this.expectPublishedLesson();
    await expect(this.page.locator("[data-practice-form] form")).toHaveCount(
      14,
    );
    await expect(
      this.page.locator("[data-practice-form] [data-unenhanced-accordion]"),
    ).toHaveCount(14);
    await expect(
      this.page.getByText(/Раскрываем вызовы снизу вверх/),
    ).toBeVisible();
    await expect(
      this.page.getByRole("group", {
        name: "Та же рекуррентная формула в Python",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        "Прогресс хранится только в этом браузере и появится после загрузки страницы.",
      ),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", {
        name: "Преобразование записей чисел",
      }),
    ).toHaveAttribute("href", "/ege/5-preobrazovanie-zapisey-chisel");
    await expect(this.page.getByRole("link", { name: "Все темы" })).toHaveCount(
      0,
    );
    await this.expectNoHorizontalOverflow();
  }

  private async solveTask(
    taskId: string,
    index: number,
    answer: string,
    total = 5,
  ): Promise<void> {
    await expect(
      this.page.locator("[data-practice-form][data-enhanced]"),
    ).toBeVisible();
    await this.page
      .getByRole("tab", {
        name: `Задача ${String(index)} из ${String(total)}`,
      })
      .click();
    const panel = this.page.locator(`[data-practice-task="${taskId}"]`);
    await panel.getByRole("textbox", { name: "Ответ" }).fill(answer);
    await panel.getByRole("button", { name: "Проверить" }).click();
    await expect(panel.getByRole("status")).toContainText("Верно");
  }

  async expectUnknownLessonNotFound(): Promise<void> {
    const response = await this.page.goto("/ege/unknown-lesson");
    expect(response?.status()).toBe(404);
  }

  async expectStableReload(): Promise<void> {
    await this.page.reload();
    await this.expectPublishedLesson();
  }
}
