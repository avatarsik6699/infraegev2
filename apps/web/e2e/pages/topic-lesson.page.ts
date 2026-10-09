import {
  expect,
  type Locator,
  type Page,
  type Response,
} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { expectPublicReleaseIdentity } from "./public-header.assertions";
import { openLessonAtTop } from "./lesson-page.assertions";

type TopicLessonPageConfig = {
  route: string;
  title: string;
  taskNumber: number;
  taskCount?: number;
  /** Tasks counted by mastery when advanced subtopics add more (Change 171). */
  masteryTaskCount?: number;
};

const recursionLessonConfig: TopicLessonPageConfig = {
  route: "/ege/16-rekursiya/osnovy",
  title: "Рекурсивные алгоритмы",
  taskNumber: 16,
  taskCount: 14,
};

export class TopicLessonPage {
  constructor(
    private readonly page: Page,
    private readonly config: TopicLessonPageConfig = recursionLessonConfig,
    private readonly noJavaScript = false,
  ) {}

  private async openTopicDocument(route: string): Promise<Response | null> {
    let response: Response | null = null;
    const navigation = this.page.getByRole("navigation", {
      name: "Подтемы урока",
    });
    if (this.noJavaScript || this.page.url() === "about:blank") {
      response = await this.page.goto(route);
    } else if (this.page.url() !== new URL(route, this.page.url()).href) {
      const destination = navigation.locator(`a[href="${route}"]`);
      await expect(destination).toHaveCount(1);
      if (!(await destination.isVisible())) {
        await navigation.getByRole("button", { name: /^Подтемы ·/u }).click();
      }
      await destination.click();
    }
    if (!this.noJavaScript) {
      await expect(this.page).toHaveURL(new URL(route, this.page.url()).href);
      await expect(
        navigation.locator(`a[href="${route}"][aria-current="page"]`),
      ).toHaveCount(1);
      await expect(this.page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://infraege.ru" + route,
      );
      await expect(
        this.page.getByRole("link", { name: "Войти", exact: true }),
      ).toBeVisible({ timeout: 15_000 });
    }
    return response;
  }

  private async expectPublishedTopicIdentity(): Promise<void> {
    const currentLink = this.page
      .getByRole("navigation", { name: "Подтемы урока" })
      .locator(`ol a[aria-current="page"][href="${this.config.route}"]`);
    if ((await currentLink.getAttribute("href")) !== this.config.route)
      throw new Error(`Expected current EGE subtopic ${this.config.route}`);
    await expectPublicReleaseIdentity(this.page);
    await expect(this.page).toHaveTitle(
      new RegExp(`${this.config.title} — infraege$`, "u"),
    );
    await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(this.page.locator("[data-subtopic-head]")).toContainText(
      /Подтема \d+ из \d+/u,
    );
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
    count = this.config.taskCount ?? 5,
  ): Promise<void> {
    const tasks = this.page.locator("[data-practice-task]");
    const form = this.page.locator("[data-practice-form]");
    await expect(tasks).toHaveCount(count);
    await expect(form).toHaveCSS("box-shadow", "none");
    await expect(form).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    if (noJavaScript) {
      await expect(this.page.locator("[data-practice-form] form")).toHaveCount(
        count,
      );
      // Change 170 F30: without scripts the hint and solution panels show.
      await expect(
        this.page.locator("[data-practice-form] [data-practice-help]"),
      ).toHaveCount(count * 2);
    } else {
      await expect(this.page.getByRole("tab")).toHaveCount(count);
    }
  }

  private async expectSectionsAcrossSubtopics(
    sections: readonly string[],
  ): Promise<void> {
    const routes = await this.topicRoutes();
    const expected = new Set(sections);
    const occurrences = new Map(sections.map((section) => [section, 0]));
    for (const route of routes) {
      await this.openTopicDocument(route);
      const ids = await this.page
        .locator("#theory section[id]")
        .evaluateAll((nodes) => nodes.map((node) => node.id));
      for (const id of ids) {
        if (expected.has(id))
          occurrences.set(id, (occurrences.get(id) ?? 0) + 1);
      }
    }
    for (const section of sections)
      expect(
        occurrences.get(section),
        `section #${section} must belong to exactly one published subtopic`,
      ).toBe(1);
    await this.openTopicDocument(this.config.route);
  }

  private async expectCourseLinksAcrossSubtopics(
    slugs: readonly string[],
  ): Promise<void> {
    const routes = await this.topicRoutes();
    const occurrences = new Map(slugs.map((slug) => [slug, 0]));
    for (const route of routes) {
      await this.openTopicDocument(route);
      for (const slug of slugs) {
        const count = await this.page
          .locator(`#theory a[href="/courses/python/${slug}"]`)
          .count();
        occurrences.set(slug, (occurrences.get(slug) ?? 0) + count);
      }
    }
    for (const slug of slugs) {
      expect(
        occurrences.get(slug),
        `course link /courses/python/${slug} must appear in a published subtopic`,
      ).toBeGreaterThan(0);
    }
    await this.openTopicDocument(this.config.route);
  }

  private async openTopicPractice(noJavaScript = false): Promise<void> {
    const [topicSlug] = this.config.route.split("/").slice(-2);
    await this.openTopicDocument(`/ege/${topicSlug}/praktika`);
    if (!noJavaScript) {
      await expect(
        this.page.getByRole("link", { name: "Войти", exact: true }),
      ).toBeVisible({ timeout: 15_000 });
      await expect(
        this.page.locator('[data-practice-form][data-enhanced="true"]'),
      ).toBeVisible();
    }
  }

  private async topicRoutes(): Promise<string[]> {
    await this.openTopicDocument(this.config.route);
    const [topicSlug] = this.config.route.split("/").slice(-2);
    const routes = await this.page
      .getByRole("navigation", { name: "Подтемы урока" })
      .locator(`a[href^="/ege/${topicSlug}/"]`)
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    const subtopics = routes.filter((route): route is string =>
      Boolean(route && !route.endsWith("/praktika")),
    );
    expect(subtopics.length).toBeGreaterThan(0);
    return subtopics;
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
    for (const route of await this.topicRoutes()) {
      await this.openTopicDocument(route);
      const group = this.page.getByRole("group", { name: label, exact: true });
      if ((await group.count()) === 0) continue;
      await expect(group).toHaveCount(1);
      const scrollArea = group.locator("[data-code-scroll]");
      await scrollArea.press("Home");
      await expect(scrollArea).toHaveCSS("outline-style", "solid");
      await expect(scrollArea).toHaveCSS("outline-width", "2px");
      return;
    }
    throw new Error(`Published topic code block not found: ${label}`);
  }

  async open(): Promise<void> {
    if (this.noJavaScript) {
      await openLessonAtTop(this.page, this.config.route);
      return;
    }
    await this.openTopicDocument(this.config.route);
    await expect
      .poll(() =>
        this.page.evaluate(() => {
          document.scrollingElement?.scrollTo({ behavior: "instant", top: 0 });
          return document.scrollingElement?.scrollTop ?? window.scrollY;
        }),
      )
      .toBe(0);
  }

  async expectNoJavaScriptSubtopic(): Promise<void> {
    expect((await this.openTopicDocument(this.config.route))?.status()).toBe(
      200,
    );
    await this.expectPublishedTopicIdentity();
    await this.expectSectionsAcrossSubtopics([
      "concrete-computation",
      "base-case-and-step",
      "code-and-call-stack",
      "loop-instead-of-recursion",
      "several-previous-values",
      "repeated-work-motivates-storage",
      "argument-steps",
      "branching-conditions",
      "upward-recursion-cache-warmup",
      "two-functions",
      "count-arguments",
      "large-arguments-algebraic-shortcut",
      "large-arguments-differences",
      "exam-program-template",
      "general-method",
    ]);
    // Change 170 F37: the open topic folder lists 6 subtopics and «Практика и итог».
    await expect(
      this.page
        .getByRole("navigation", { name: "Подтемы урока" })
        .locator('[data-tree-folder="rekursiya"] ol > li'),
    ).toHaveCount(7);
    await expect(
      this.page
        .getByRole("navigation", { name: "Подтемы урока" })
        .getByRole("link", { name: "Практика и итог" }),
    ).toBeVisible();
    // The right-hand outline is intentionally hidden on phone widths. Verify its
    // server-rendered links at desktop while keeping the route itself JS-free.
    await this.page.setViewportSize({ width: 1440, height: 900 });
    await this.page.setViewportSize({ width: 1440, height: 900 });
    await expect(
      this.page
        .getByRole("navigation", { name: "На этой странице" })
        .getByRole("link"),
    ).toHaveCount(2);
    await expect(this.page.locator("#theory")).toContainText(
      "рекуррентным определением",
    );
    await this.expectNoHorizontalOverflow();
  }

  async expectLegacySectionRedirect(): Promise<void> {
    await this.page.goto("/ege/16-rekursiya#two-functions");
    await expect(this.page).toHaveURL(
      /\/ege\/16-rekursiya\/slozhnye-pravila#two-functions$/u,
    );
    await expect(this.page.locator("#two-functions")).toBeVisible();
    await expect(
      this.page.getByRole("heading", {
        level: 1,
        name: "Сложные правила перехода",
      }),
    ).toBeVisible();
  }

  async expectRecursionStylePilot(noJavaScript = false): Promise<void> {
    await this.expectPublishedTopicIdentity();
    const topicNavigation = this.page.getByRole("navigation", {
      name: "Подтемы урока",
    });
    await expect(
      topicNavigation.locator(
        `ol a[aria-current="page"][href="${this.config.route}"]`,
      ),
    ).toHaveAttribute("href", this.config.route);
    await expect(
      topicNavigation.getByRole("link", { name: "Практика и итог" }),
    ).toBeVisible();
    const concepts = this.page.locator("#theory section[id]");
    await expect(concepts).toHaveCount(2);
    await this.expectRecursionContentTypography(noJavaScript);
    await this.expectSectionsAcrossSubtopics([
      "concrete-computation",
      "base-case-and-step",
      "code-and-call-stack",
      "loop-instead-of-recursion",
      "several-previous-values",
      "repeated-work-motivates-storage",
      "argument-steps",
      "branching-conditions",
      "upward-recursion-cache-warmup",
      "two-functions",
      "count-arguments",
      "large-arguments-algebraic-shortcut",
      "large-arguments-differences",
      "exam-program-template",
      "general-method",
    ]);
    await this.expectRecursionStatusFeedback();
    await this.page.setViewportSize({ width: 1440, height: 900 });
    const pageOutline = this.page.getByRole("navigation", {
      name: "На этой странице",
    });
    await expect(pageOutline.getByRole("link")).toHaveCount(2);
    await this.expectNoHorizontalOverflow();

    if (noJavaScript) {
      await expect(
        topicNavigation.getByRole("link", {
          name: "Функция, стек вызовов и цикл",
        }),
      ).toBeVisible();
      await this.openTopicPractice(true);
      await this.expectTaskPractice(true, this.config.taskCount ?? 14);
      // F30: without scripts the help toggles hide and both panels show.
      await expect(
        this.page.locator("[data-practice-help]").first(),
      ).toBeVisible();
      await expect(
        this.page
          .locator("[data-practice-task]")
          .first()
          .getByRole("textbox", { name: "Ответ" }),
      ).toBeVisible();
      await expect(
        this.page
          .locator("[data-practice-task]")
          .first()
          .getByRole("heading", { name: "Подсказка", exact: true }),
      ).toBeVisible();
      await this.openTopicDocument(this.config.route);
      return;
    }

    const sectionLink = pageOutline.getByRole("link", {
      name: "Вычисляем F(5) по правилу",
    });
    await sectionLink.click();
    await expect(sectionLink).toHaveAttribute("aria-current", "location");
    await expect(this.page).toHaveURL(/#concrete-computation$/u);
    await this.page.setViewportSize({ width: 390, height: 844 });
    const disclosure = topicNavigation.getByRole("button", {
      name: "Подтемы · 1 из 6",
    });
    await disclosure.click();
    await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    await expect(
      topicNavigation.getByRole("link", {
        name: "Функция, стек вызовов и цикл",
      }),
    ).toBeVisible();
    await this.expectNoHorizontalOverflow();
  }

  private async expectRecursionStatusFeedback(): Promise<void> {
    let total = 0;
    for (const route of await this.topicRoutes()) {
      await this.openTopicDocument(route);
      const correct = this.page
        .locator('#theory [data-status="correct"] svg')
        .first();
      const incorrect = this.page
        .locator('#theory [data-status="incorrect"] svg')
        .first();
      const correctCount = await correct.count();
      const incorrectCount = await incorrect.count();
      total += correctCount + incorrectCount;
      if (!correctCount || !incorrectCount) continue;
      const colors = await this.page
        .locator("[data-topic-lesson-page]")
        .evaluate((element) => {
          const resolve = (token: string) => {
            const probe = document.createElement("span");
            probe.style.color = `var(${token})`;
            element.append(probe);
            const value = getComputedStyle(probe).color;
            probe.remove();
            return value;
          };
          return {
            success: resolve("--color-success"),
            danger: resolve("--color-danger"),
          };
        });
      await expect(correct).toHaveCSS("color", colors.success);
      await expect(incorrect).toHaveCSS("color", colors.danger);
    }
    expect(total).toBeGreaterThan(0);
    await this.openTopicDocument(this.config.route);
  }

  private async expectRecursionContentTypography(
    noJavaScript: boolean,
  ): Promise<void> {
    const examples = this.page.locator("#theory figure").filter({
      has: this.page.locator("figcaption", {
        hasText: "Разберём на примере",
      }),
    });
    await expect(examples).not.toHaveCount(0);
    await expect(this.page.locator("#theory section[id]")).toHaveCount(2);
    const typography = await examples.first().evaluate((figure) => {
      const step = figure.querySelector<HTMLElement>(
        "ol > li > [data-variant]",
      );
      const caption = figure.querySelector<HTMLElement>("figcaption");
      if (!step || !caption)
        throw new Error("Worked example typography is missing");
      const resolve = (property: string) => {
        const probe = document.createElement("span");
        probe.style.font = `var(${property})`;
        if (property.startsWith("--font"))
          probe.style.fontFamily = `var(${property})`;
        if (property.startsWith("--text"))
          probe.style.fontSize = `var(${property})`;
        document.body.append(probe);
        const value = property.startsWith("--font")
          ? getComputedStyle(probe).fontFamily
          : getComputedStyle(probe).fontSize;
        probe.remove();
        return value;
      };
      return {
        stepFont: getComputedStyle(step).fontFamily,
        stepFontToken: resolve("--font-reading"),
        stepSize: getComputedStyle(step).fontSize,
        stepSizeToken: resolve("--text-learning-example-step"),
        stepWeight: getComputedStyle(step).fontWeight,
        captionFont: getComputedStyle(caption).fontFamily,
        captionFontToken: resolve("--font-ui"),
        captionSize: getComputedStyle(caption).fontSize,
        captionSizeToken: resolve("--text-learning-label"),
      };
    });
    expect(typography.stepFont).toBe(typography.stepFontToken);
    expect(typography.stepSize).toBe(typography.stepSizeToken);
    expect(typography.stepWeight).toBe("400");
    expect(typography.captionFont).toBe(typography.captionFontToken);
    expect(typography.captionSize).toBe(typography.captionSizeToken);
    for (const width of [320, 390, 1440]) {
      await this.page.setViewportSize({ width, height: 900 });
      await this.expectNoHorizontalOverflow();
    }
    if (!noJavaScript) {
      const code = this.page.locator("#theory pre").first();
      if (await code.count()) {
        await code.focus();
        await code.press("ArrowRight");
      }
    }
    await this.page.setViewportSize({ width: 390, height: 844 });
  }

  async expectLessonVideos(noJavaScript = false): Promise<void> {
    let total = 0;
    let videoRoute: string | undefined;
    for (const route of await this.topicRoutes()) {
      await this.openTopicDocument(route);
      const videos = this.page.locator("#theory video");
      const count = await videos.count();
      total += count;
      if (count && !videoRoute) videoRoute = route;
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
    }
    expect(total).toBe(5);
    if (!videoRoute) throw new Error("The topic lesson has no video route");
    await this.openTopicDocument(videoRoute);
    const videos = this.page.locator("#theory video");
    const toggle = this.page.locator("[data-lesson-video-toggle]").first();
    if (noJavaScript) {
      await expect(toggle).toBeHidden();
      return;
    }
    await expect(
      this.page
        .locator('[data-lesson-video-controls][data-enhanced="true"]')
        .first(),
    ).toBeVisible();
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
    await first.evaluate((video: HTMLVideoElement) =>
      video.scrollIntoView({ block: "center", inline: "nearest" }),
    );
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
    let total = 0;
    for (const route of await this.topicRoutes()) {
      await this.openTopicDocument(route);
      const figures = this.page.locator("figure[data-lesson-figure]");
      total += await figures.count();
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
    }
    expect(total).toBe(4);
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
    let videoRoute: string | undefined;
    for (const route of await this.topicRoutes()) {
      await this.openTopicDocument(route);
      if (await this.page.locator("#theory video").count()) {
        videoRoute = route;
        break;
      }
    }
    if (!videoRoute) throw new Error("The topic lesson has no video route");
    await this.page.reload();
    await expect(
      this.page
        .locator('[data-lesson-video-controls][data-enhanced="true"]')
        .first(),
    ).toBeVisible();
    const first = this.page.locator("#theory video").first();
    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveAttribute("poster", /-poster\.webp$/u);
    await expect(first).toHaveJSProperty("preload", "none");
    await expect(first).toHaveJSProperty("paused", true);
    await expect(first).toHaveJSProperty("currentTime", 0);
    const toggle = this.page.locator("[data-lesson-video-toggle]").first();
    await expect(toggle).toHaveAccessibleName(/^Воспроизвести: /u);
    await toggle.click();
    await expect
      .poll(() =>
        first.evaluate((element: HTMLVideoElement) => element.readyState),
      )
      .toBeGreaterThan(0);
    await expect(first).toHaveJSProperty("paused", false);
  }

  async expectRecursionLearningBlocks(noJavaScript = false): Promise<void> {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.openTopicPractice(noJavaScript);
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
      await expect(firstAnswer).toHaveCSS("font-size", "17px");
      await expect(firstAnswer).toHaveCSS("color", "rgb(23, 25, 30)");
      await expect(firstAnswer).toHaveCSS("border-inline-start-width", "0px");
      await expect(firstAnswer).toHaveCSS("padding-inline-start", "16px");
      await expect(checkpoint).toHaveCSS(
        "background-color",
        "rgba(0, 0, 0, 0)",
      );
      await expect(checkpoint.locator(":scope > div > div").first()).toHaveCSS(
        "color",
        "rgb(23, 25, 30)",
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
      await this.expectNoHorizontalOverflow();
    }
    await firstQuestion.focus();
    await firstQuestion.press("Enter");
    await expect(firstAnswer).toBeHidden();

    await this.openTopicDocument("/ege/16-rekursiya/slozhnye-pravila");
    const comparisons = this.page.locator(
      '#theory [role="note"] [data-status]',
    );
    await expect(comparisons).not.toHaveCount(0);
    for (const width of [320, 390, 768, 1440]) {
      await this.page.setViewportSize({ width, height: 900 });
      for (const comparison of await comparisons.all()) {
        const copy = comparison.locator(":scope > div > div");
        await expect(copy).toHaveCSS("font-size", "17px");
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
    }
    await this.openTopicDocument("/ege/16-rekursiya/bolshie-argumenty");
    const callout = this.page.getByRole("complementary", {
      name: "Когда применим этот приём",
      exact: true,
    });
    for (const width of [320, 390, 768, 1440]) {
      await this.page.setViewportSize({ width, height: 900 });
      await expect(callout.locator(":scope > div > span")).toHaveCSS(
        "font-size",
        "14px",
      );
      await expect(callout.locator(":scope > div > span")).toHaveCSS(
        "font-weight",
        "600",
      );
      await expect(callout.locator(":scope > div > div")).toHaveCSS(
        "font-size",
        "17px",
      );
      await this.expectNoHorizontalOverflow();
    }
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.openTopicPractice(noJavaScript);
    const task = this.page.locator(
      '[data-practice-task="rekursiya-base-sequence"]',
    );
    // F30: toggle labels change («Скрыть решение»), so find them by panel.
    const hintTrigger = task.locator('button[aria-controls^="hint-"]');
    const solutionTrigger = task.locator('button[aria-controls^="solution-"]');
    const hint = task.locator('[data-content-context="hint"]');
    const solution = task.locator('[data-content-context="solution"]');
    if (noJavaScript) {
      await expect(hintTrigger).toBeHidden();
      await expect(hint).toBeVisible();
      await expect(solution).toBeVisible();
      return;
    }
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
      await expect(paragraph).toHaveCSS("font-size", "17px");
      await expect(paragraph).toHaveCSS("color", "rgb(23, 25, 30)");
    }
    for (const trigger of [hintTrigger, solutionTrigger]) {
      // F30: the toggles are ordinary soft buttons.
      await expect(trigger).toHaveCSS("font-weight", "600");
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
      await expect(hint.locator("p").first()).toHaveCSS("font-size", "34px");
      await expect(firstQuestion.locator("span").first()).toHaveCSS(
        "font-size",
        "32px",
      );
      await this.page.setViewportSize({ width: 900, height: 900 });
      await this.expectNoHorizontalOverflow();
    } finally {
      await this.page.evaluate(() => {
        document.documentElement.style.removeProperty("font-size");
      });
    }
  }

  async expectSharedLearningLinkStyle(): Promise<void> {
    await expect(this.page.locator("[data-learning-profile]")).toHaveCount(0);
    await expect(
      this.page.locator("#theory section[id] > h3").first(),
    ).toHaveCSS("border-bottom-width", "0px");
    await expect(this.page.locator("#theory section[id]")).not.toHaveCount(0);
    await this.page.setViewportSize({ width: 390, height: 844 });
    await expect(this.page.locator("#theory pre code").first()).toBeVisible();
    await this.page.setViewportSize({ width: 1440, height: 900 });
    await expect(
      this.page.locator("[data-topic-lesson-context] a").first(),
    ).toHaveCSS("color", "rgb(31, 79, 208)");
    await expect(
      this.page.locator('[data-subtopic-navigation] ol a[aria-current="page"]'),
    ).toBeVisible();
  }

  async expectCodeDisclosureAndReturnToTop(): Promise<void> {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    const codeRoute = await this.page
      .getByRole("navigation", { name: "Подтемы урока" })
      .getByRole("link", {
        name: "Шаблон программы и общий алгоритм",
        exact: true,
      })
      .getAttribute("href");
    if (!codeRoute)
      throw new Error("The recursion template subtopic is not published");
    await this.page.goto(codeRoute);
    await expect(
      this.page.getByRole("link", { name: "Войти", exact: true }),
    ).toBeVisible();
    const top = this.page.getByRole("button", { name: "К началу урока" });
    await expect(top).toBeHidden();
    const code = this.page.getByRole("group", {
      name: "Шаблон: кеш, лимит, база, ветви, прогрев",
    });
    await expect(code).toBeVisible();
    const expand = code.getByRole("button", {
      name: "Показать весь код",
      exact: true,
    });
    await expect(expand).toBeVisible();
    await expand.click();
    const collapse = code.getByRole("button", {
      name: "Свернуть код",
      exact: true,
    });
    await expect(collapse).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await collapse.hover();
    await expect(collapse).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await collapse.click();
    await expect(expand).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await this.page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(top).toBeVisible();
    await top.click();
    await expect(this.page.getByRole("heading", { level: 1 })).toBeFocused();
    await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBe(0);
    await expect(top).toBeHidden();
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.openTopicPractice();
    const scrollBeyondViewport = async () => {
      await this.page.evaluate(() =>
        window.scrollTo({ top: window.innerHeight + 100, behavior: "instant" }),
      );
      await expect
        .poll(() =>
          this.page.evaluate(() => window.scrollY >= window.innerHeight),
        )
        .toBe(true);
    };
    await scrollBeyondViewport();
    await expect(top).toBeVisible();
    await expect(this.page.locator("[data-scroll-to-top]")).toHaveCSS(
      "height",
      "44px",
    );
    const answer = this.page
      .getByRole("textbox", { name: "Ваш ответ", exact: true })
      .first();
    await answer.evaluate((element: HTMLInputElement) =>
      element.focus({ preventScroll: true }),
    );
    await expect(answer).toBeFocused();
    expect(
      await this.page.evaluate(() => window.scrollY >= window.innerHeight),
    ).toBe(true);
    await expect(top).toBeHidden();
    await answer.press("Tab");
    // Tab may scroll the next control into view; retain the visibility precondition.
    await scrollBeyondViewport();
    await expect(top).toBeVisible();
    await top.click();
    await expect(this.page.getByRole("heading", { level: 1 })).toBeFocused();
    await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBe(0);
    await expect(top).toBeHidden();
  }

  async expectSquareScrollbars(): Promise<void> {
    await expect(this.page.getByRole("tablist")).toHaveCount(0);
    const geometry = await this.page.evaluate(() => {
      const root = document.documentElement;
      const code = document.querySelector("pre");
      return {
        width: getComputedStyle(root, "::-webkit-scrollbar").width,
        radius: getComputedStyle(root, "::-webkit-scrollbar-thumb")
          .borderRadius,
        button: getComputedStyle(root, "::-webkit-scrollbar-button").display,
        hasCodeOverflow: Boolean(
          code?.scrollWidth && code.scrollWidth > code.clientWidth,
        ),
      };
    });
    expect(geometry).toEqual({
      width: "6px",
      radius: "0px",
      button: "none",
      hasCodeOverflow: false,
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
    // Change 170 F37: the tree has no «Все темы ЕГЭ» link; files keep 40px targets.
    const navigation = this.page.locator("[data-subtopic-navigation]");
    const measurements = await navigation
      .locator("details[open] ol a")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          minimum: parseFloat(getComputedStyle(node).minHeight),
          height: node.getBoundingClientRect().height,
        })),
      );
    for (const row of measurements) {
      expect(row.minimum).toBe(40);
      expect(row.height).toBeGreaterThanOrEqual(39.9);
    }
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
        "figure[data-learning-block], figure[data-lesson-diagram], figure[data-lesson-stepper], [data-concept-mistake] > *, [data-concept-checkpoint] > *",
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
    // Cold Vite startup loads hundreds of modules before the guest session is ready.
    // Wait for enhancement before testing interactive navigation and progress.
    await expect(
      this.page.getByRole("link", { name: "Войти", exact: true }),
    ).toBeVisible({ timeout: 15_000 });
    await this.page.setViewportSize({ width: 1440, height: 1000 });
    await this.expectStudyFrame();
    await expect(this.page.locator("[data-outline-rail]")).toHaveCSS(
      "border-right-width",
      "1px",
    );
    await expect(this.page.locator("[data-topic-lesson-context]")).toHaveCSS(
      "border-bottom-width",
      "0px",
    );
    await expect(this.page.locator("[data-result-progress]")).toContainText(
      `0 / ${this.config.masteryTaskCount ?? this.config.taskCount ?? 5}`,
    );
    await this.expectStudyDensity();
    const pageOutline = this.page.getByRole("navigation", {
      name: "На этой странице",
    });
    const destination = pageOutline.getByRole("link").first();
    const hash = await destination.getAttribute("href");
    await destination.click();
    await expect(destination).toHaveAttribute("aria-current", "location");
    await expect(this.page.locator(hash!)).toBeFocused();
    expect(new URL(this.page.url()).hash).toBe(hash);
    await this.page.evaluate(() => {
      history.replaceState(null, "", location.pathname);
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBe(0);
    await this.page.setViewportSize({ width: 390, height: 844 });
    const topicNavigation = this.page.getByRole("navigation", {
      name: "Подтемы урока",
    });
    const trigger = topicNavigation.getByRole("button", {
      name: /Подтемы · /,
    });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    const mobileOrder = await this.page.evaluate(() => {
      const navigation = document.querySelector<HTMLElement>(
        "[data-subtopic-navigation]",
      );
      const heading = document.querySelector<HTMLElement>(
        "[data-article-frame] h1, [data-article-frame] h2",
      );
      if (!navigation || !heading)
        throw new Error("Missing mobile lesson navigation or article heading");
      return {
        navigationBottom: navigation.getBoundingClientRect().bottom,
        headingTop: heading.getBoundingClientRect().top,
        scrollY: window.scrollY,
      };
    });
    expect(mobileOrder.scrollY).toBe(0);
    expect(mobileOrder.navigationBottom).toBeLessThanOrEqual(
      mobileOrder.headingTop,
    );
    await trigger.focus();
    await trigger.press("Enter");
    const links = topicNavigation.locator("details[open] ol a");
    await this.expectStudyDensity();
    const bounds = await links.evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return { top: box.top, bottom: box.bottom, height: box.height };
      }),
    );
    for (let index = 0; index < bounds.length; index++) {
      expect(bounds[index].height).toBeGreaterThanOrEqual(40);
      if (index > 0)
        expect(bounds[index].top).toBeGreaterThanOrEqual(
          bounds[index - 1].bottom,
        );
    }
    const subtopicLinks = topicNavigation.locator("details[open] ol a");
    const hrefs = await subtopicLinks.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href")),
    );
    const currentIndex = hrefs.indexOf(this.config.route);
    expect(currentIndex).toBeGreaterThanOrEqual(0);
    const adjacentIndex =
      currentIndex + 1 < hrefs.length ? currentIndex + 1 : currentIndex - 1;
    expect(adjacentIndex).toBeGreaterThanOrEqual(0);
    const adjacentHref = hrefs[adjacentIndex];
    expect(adjacentHref).toBeTruthy();
    const adjacentSubtopic = subtopicLinks.nth(adjacentIndex);
    await adjacentSubtopic.focus();
    await adjacentSubtopic.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(this.page).toHaveURL(
      new URL(adjacentHref!, this.page.url()).href,
    );
    await expect(this.page.getByRole("heading", { level: 1 })).toBeFocused();
    await this.expectNoHorizontalOverflow();
    await this.page.setViewportSize({ width: 1153, height: 844 });
    await expect(trigger).toHaveCount(0);
    await expect(pageOutline).toBeVisible();
    await this.page.setViewportSize({ width: 961, height: 844 });
    await expect(trigger).toHaveCount(0);
    await expect(pageOutline).toBeHidden();
    await this.page.setViewportSize({ width: 960, height: 844 });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await this.page.setViewportSize({ width: 1440, height: 1000 });
    const scaledRootFont = await this.page.addStyleTag({
      content: "html { font-size: 200%; }",
    });
    try {
      await expect(this.page.locator("html")).toHaveCSS("font-size", "32px");
      await this.expectNoHorizontalOverflow();
    } finally {
      await scaledRootFont.evaluate((style) =>
        style.parentNode?.removeChild(style),
      );
    }
    const accessibility = await new AxeBuilder({ page: this.page }).analyze();
    expect(accessibility.violations).toEqual([]);
  }

  async expectPublishedNumberSequencesContent(
    noJavaScript = false,
  ): Promise<void> {
    await this.expectPublishedTopicIdentity();
    await this.expectSectionsAcrossSubtopics([
      "sequence-from-file",
      "single-values",
      "neighbor-pairs",
      "neighbor-triples",
      "two-passes",
      "verify-boundaries",
    ]);
    await this.expectCourseLinksAcrossSubtopics([
      "schetchiki-i-nakopiteli",
      "spiski",
      "fayly",
      "otbor-rezultata",
    ]);
    const averageCallout = this.page.locator(
      'aside[aria-label="Среднее уже найдено"]',
    );
    const partialExample = averageCallout.getByRole("group", {
      name: "Дополнить условие второго прохода",
    });
    await this.expectCodeContrast(partialExample);
    await this.openTopicPractice(noJavaScript);
    await this.expectTaskPractice(noJavaScript);
    if (!noJavaScript) {
      await expect(this.page.locator("[data-result-progress]")).toContainText(
        "0 / 8",
      );
      await this.open();
    }
    await this.expectNoHorizontalOverflow();
    if (!noJavaScript) await this.open();
  }

  async expectPublishedStringProcessingContent(
    noJavaScript = false,
  ): Promise<void> {
    await this.expectPublishedTopicIdentity();
    await this.expectSectionsAcrossSubtopics([
      "file-and-string",
      "positions-and-fragments",
      "adjacent-and-overlapping",
      "longest-valid-run",
      "occurrence-limit",
      "expression-grammar",
      "linear-expression-scan",
      "independent-verification",
    ]);
    await this.expectCourseLinksAcrossSubtopics(["stroki", "fayly"]);
    await this.expectCodeContrast(
      this.page.getByRole("group", {
        name: "За один проход найти длину завершённого выражения",
      }),
    );
    await this.openTopicPractice(noJavaScript);
    await this.expectTaskPractice(noJavaScript);
    await expect(this.page.locator("#practice a[download]")).toHaveCount(8);
    if (!noJavaScript) {
      await this.open();
      await this.expectStudyNavigationAndAccessibility();
      await this.expectCodeKeyboardFocus(
        "За один проход найти длину завершённого выражения",
      );
    }
  }

  async expectPublishedDivisorsAndMasksContent(
    noJavaScript = false,
  ): Promise<void> {
    const topic = "/ege/25-deliteli-i-maski";
    await this.expectPublishedTopicIdentity();
    await this.expectSectionsAcrossSubtopics([
      "delenie-s-ostatkom",
      "pary-delitelej",
      "poisk-po-shagam",
      "rovno-k-delitelej",
      "razlozhenie",
      "znaki-maski",
      "generaciya-po-maske",
      "forma-chisla",
    ]);
    // Compact form (Change 171): live remainder figure, variant pickers and
    // Python terms with a course link; without scripting all stays readable.
    await this.openTopicDocument(`${topic}/perebor-i-proverki`);
    const remainder = this.page.locator("[data-remainder-explorer]");
    const picker = this.page.locator("[data-variant-picker]").first();
    const term = this.page.locator('[data-python-term="andor"]');
    if (noJavaScript) {
      await expect(remainder.getByRole("button")).toHaveCount(0);
      await expect(picker.locator("dt")).toHaveCount(9);
      await expect(term.locator("details")).toHaveCount(0);
      await term.getByRole("button").click();
      await expect(
        this.page.getByRole("dialog", {
          name: "Что это: Составные условия and и or",
        }),
      ).toBeVisible();
    } else {
      await remainder.getByRole("button", { name: "20 и 5" }).click();
      await expect(remainder.getByRole("img")).toHaveAttribute(
        "aria-label",
        "20 клеток порциями по 5: 4 полные порции и 0 в остатке",
      );
      await picker.getByRole("button", { name: "не меньше 100" }).click();
      await expect(picker.locator("[data-variant-result]")).toContainText(
        "n >= 100",
      );
      await term.getByRole("button").click();
      const popup = this.page.getByRole("dialog", {
        name: "Что это: Составные условия and и or",
      });
      await expect(
        popup.getByRole("link", { name: "Читать урок →" }),
      ).toHaveAttribute("href", "/courses/python/sostavnye-usloviya");
      await popup.getByRole("button", { name: "Закрыть" }).click();
      await expect(popup).toHaveCount(0);
    }
    await this.openTopicDocument(this.config.route);

    // The advanced subtopic follows the core ones and is named as such.
    const navigation = this.page.getByRole("navigation", {
      name: "Подтемы урока",
    });
    await expect(
      navigation.getByRole("link", {
        name: /Вид числа по количеству делителей\s*, дополнительный урок/u,
      }),
    ).toHaveCount(1);

    // Subtopic 2: the closed proof, the step-through figure, the self-check.
    const proof = this.page.locator("details[data-proof-disclosure]").first();
    await expect(proof).not.toHaveAttribute("open");
    await expect(proof).toContainText("противоречие");
    await proof.locator("summary").click();
    await expect(proof).toHaveAttribute("open");
    const stepper = this.page.getByRole("figure", {
      name: "Поиск делителей 36 до корня по шагам",
    });
    if (noJavaScript) {
      await expect(stepper.locator("[data-stepper-steps] li")).toHaveCount(7);
      await expect(stepper.getByRole("button")).toHaveCount(0);
    } else {
      const caption = stepper.locator("[data-stepper-caption]");
      await expect(caption).toHaveText(/^d = 1:/u);
      await stepper.getByRole("button", { name: "Следующий шаг" }).click();
      await expect(caption).toHaveText(/^d = 2:/u);
      await expect(stepper.locator("[data-stepper-count]")).toHaveText("2 / 7");
    }
    await expect(
      this.page.getByRole("region", { name: "Проверьте себя" }),
    ).toHaveCount(1);

    // Subtopic 5: the mask sandbox is an enhancement only.
    await this.openTopicDocument(`${topic}/maski`);
    const sandbox = this.page.locator("[data-mask-sandbox]");
    if (noJavaScript) {
      await expect(sandbox.locator("input")).toHaveCount(0);
      await expect(sandbox).toContainText("Звёздочка заменяет «00».");
    } else {
      await sandbox.getByLabel("Число").fill("12304");
      await expect(sandbox).toContainText("Не подходит");
    }

    // Subtopic 6 is the advanced level.
    await this.openTopicDocument(`${topic}/vid-chisla`);
    await expect(this.page.locator("[data-subtopic-head]")).toContainText(
      "Подтема 6 из 6 · дополнительный урок",
    );
    await expect(this.page.locator("figure[data-lesson-diagram]")).toHaveCount(
      2,
    );
    await this.expectNoHorizontalOverflow();

    await this.openTopicPractice(noJavaScript);
    const sheet = this.page.locator("[data-topic-cheat-sheet]");
    await expect(sheet.locator("section")).toHaveCount(8);
    await expect(
      sheet.getByRole("link", { name: "Делители парами" }),
    ).toHaveAttribute("href", `${topic}/deliteli-parami`);
    await this.expectTaskPractice(noJavaScript);
    if (!noJavaScript)
      await expect(this.page.locator("[data-result-progress]")).toContainText(
        `0 / ${String(this.config.masteryTaskCount)}`,
      );
    await this.expectNoHorizontalOverflow();
    if (!noJavaScript) await this.open();
  }

  async expectStepperRespectsReducedMotion(
    name = "Поиск делителей 36 до корня по шагам",
  ): Promise<void> {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.open();
    const stepper = this.page.getByRole("figure", { name });
    await expect(
      stepper.getByRole("button", { name: "Следующий шаг" }),
    ).toBeVisible();
    await expect(
      stepper.getByRole("button", { name: "Воспроизвести" }),
    ).toHaveCount(0);
  }

  async expectPublishedGraphAnalysisContent(
    noJavaScript = false,
  ): Promise<void> {
    const topic = "/ege/23-analiz-grafov";
    await this.expectPublishedTopicIdentity();
    await this.expectSectionsAcrossSubtopics([
      "kratchajshij",
      "funkciya-f",
      "spisok-smezhnosti",
      "programma",
      "obyazatelnaya",
      "relaksaciya",
      "topologicheskij",
    ]);

    // Subtopic 1: the path sandbox is an enhancement of a static graph.
    await this.openTopicDocument(`${topic}/graf-i-put`);
    const sandbox = this.page.locator("[data-path-builder]");
    if (noJavaScript) {
      await expect(sandbox.getByRole("button")).toHaveCount(0);
      await expect(sandbox.getByRole("img")).toHaveCount(1);
    } else {
      const status = sandbox.locator("p[aria-live]");
      await sandbox.getByRole("button", { name: "Вершина 7" }).click();
      await sandbox.getByRole("button", { name: "Вершина 40" }).click();
      await expect(status).toContainText("стрелка идёт только 40 → 7");
      await sandbox.getByRole("button", { name: "Сначала" }).click();
      for (const vertex of ["40", "7", "100"])
        await sandbox
          .getByRole("button", { name: `Вершина ${vertex}` })
          .click();
      await expect(status).toHaveText(
        "Путь: 1 → 40 → 7 → 100 · длина 2 + 1 + 3 = 6. Дошли до цели. Это кратчайший путь",
      );
    }
    await this.expectNoHorizontalOverflow();

    // Subtopic 2: f from the target backwards, step by step, and the self-check.
    await this.openTopicDocument(this.config.route);
    const stepper = this.page.getByRole("figure", {
      name: "Значения f от цели назад по шагам",
    });
    if (noJavaScript) {
      await expect(stepper.locator("[data-stepper-steps] li")).toHaveCount(6);
      await expect(stepper.getByRole("button")).toHaveCount(0);
    } else {
      const caption = stepper.locator("[data-stepper-caption]");
      await stepper.getByRole("button", { name: "Следующий шаг" }).click();
      await expect(caption).toHaveText(/^f\(100\) = 0/u);
      await expect(stepper.locator("[data-stepper-count]")).toHaveText("2 / 6");
    }
    await expect(
      this.page.getByRole("region", { name: "Проверьте себя" }),
    ).toHaveCount(1);

    // The advanced subtopics follow the core ones; one keeps a closed proof.
    const navigation = this.page.getByRole("navigation", {
      name: "Подтемы урока",
    });
    await expect(
      navigation.getByRole("link", {
        name: /Повторные проходы по рёбрам\s*, дополнительный урок/u,
      }),
    ).toHaveCount(1);
    await this.openTopicDocument(`${topic}/povtornye-prohody`);
    await expect(this.page.locator("[data-subtopic-head]")).toContainText(
      "Подтема 6 из 7 · дополнительный урок",
    );
    const proof = this.page.locator("details[data-proof-disclosure]").first();
    await expect(proof).not.toHaveAttribute("open");
    await proof.locator("summary").click();
    await expect(proof).toHaveAttribute("open");
    await this.expectNoHorizontalOverflow();

    // Practice: mixed exam tasks with their graph files attached.
    await this.openTopicPractice(noJavaScript);
    const sheet = this.page.locator("[data-topic-cheat-sheet]");
    await expect(
      sheet.getByRole("link", { name: "Рекурсия с запоминанием" }),
    ).toHaveAttribute("href", `${topic}/rekursiya-s-zapominaniem`);
    await this.expectTaskPractice(noJavaScript);
    if (noJavaScript) {
      await expect(this.page.locator("#practice a[download]")).toHaveCount(14);
    } else {
      await expect(this.page.locator("[data-result-progress]")).toContainText(
        `0 / ${String(this.config.masteryTaskCount)}`,
      );
    }
    await this.expectNoHorizontalOverflow();
    if (!noJavaScript) await this.open();
  }

  async expectPublishedArrayProcessingContent(
    noJavaScript = false,
  ): Promise<void> {
    await this.expectPublishedTopicIdentity();
    await this.expectSectionsAcrossSubtopics([
      "sorted-order",
      "file-records",
      "capacity-selection",
      "secondary-optimum",
      "event-stream",
      "independent-check",
    ]);
    await this.expectCourseLinksAcrossSubtopics([
      "spiski",
      "sortirovka-i-poisk",
      "fayly",
      "slovari",
    ]);
    await this.expectCodeContrast(
      this.page.getByRole("group", {
        name: "Сортировать целые записи по очкам",
      }),
    );
    await this.openTopicPractice(noJavaScript);
    await expect(this.page.getByLabel("Проверьте себя")).toHaveCount(1);
    await this.expectTaskPractice(noJavaScript);
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
    if (!noJavaScript) await this.open();
  }

  async expectPublishedDataAnalysisContent(
    noJavaScript = false,
  ): Promise<void> {
    await this.expectPublishedTopicIdentity();
    await this.expectSectionsAcrossSubtopics([
      "points-and-records",
      "spatial-clusters",
      "energy-clusters",
      "cluster-centre",
      "distance-and-filter",
      "combined-result",
      "independent-check",
    ]);
    await this.expectCourseLinksAcrossSubtopics([
      "fayly",
      "spiski",
      "sortirovka-i-poisk",
      "slovari",
    ]);
    await this.expectCodeContrast(
      this.page.getByRole("group", {
        name: "Разделить отсортированные энергии по размаху",
      }),
    );
    await this.openTopicPractice(noJavaScript);
    await expect(this.page.getByLabel("Проверьте себя")).toHaveCount(1);
    await this.expectTaskPractice(noJavaScript);
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
    if (!noJavaScript) await this.open();
  }

  /** F23: selecting an outline item changes neither weight nor geometry. */
  async expectStableOutlineSelection(): Promise<void> {
    await this.page.setViewportSize({ width: 1440, height: 900 });
    await this.openTopicDocument("/ege/16-rekursiya/osnovy");
    const outline = this.page.locator("[data-page-outline]");
    const links = outline.getByRole("link");
    const readGeometry = () =>
      links.evaluateAll((nodes) =>
        nodes.map((node) => ({
          fontWeight: getComputedStyle(node).fontWeight,
          fontSize: getComputedStyle(node).fontSize,
          height: node.getBoundingClientRect().height,
          width: node.getBoundingClientRect().width,
        })),
      );
    const before = await readGeometry();
    const target = outline.getByRole("link", {
      name: "Вычисляем F(5) по правилу",
    });
    await target.click();
    await expect(target).toHaveAttribute("aria-current", "location");
    expect(await readGeometry()).toEqual(before);
  }

  async expectPublishedLesson(): Promise<void> {
    await this.expectPublishedTopicIdentity();
    await expect(
      this.page.getByRole("link", {
        name: "infraege — ЕГЭ информатика, на главную",
      }),
    ).toHaveAttribute("href", "/");
    const theory = this.page.locator("#theory");
    await expect(theory.locator("section[id]")).toHaveCount(2);
    await expect(
      theory.getByText("рекуррентным определением", { exact: false }),
    ).toBeVisible();
    await expect(
      theory.locator("figure[data-learning-block]").first(),
    ).toBeVisible();
    await expect(
      this.page
        .getByRole("navigation", { name: "На этой странице" })
        .getByRole("link"),
    ).toHaveCount(2);
    await expect(
      this.page
        .getByRole("navigation", { name: "Подтемы урока" })
        .getByRole("link", { name: "Практика и итог" }),
    ).toBeVisible();
    await this.expectNoHorizontalOverflow();
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
}
