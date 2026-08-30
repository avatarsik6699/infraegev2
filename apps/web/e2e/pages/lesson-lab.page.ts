import { expect, type Page } from "@playwright/test";

const sectionHeadings = [
  "Теория",
  "Практика",
  "Что важно для ЕГЭ",
  "Результат",
];
const subsectionHeadings = [
  "Середина превращает неизвестность в выбор",
  "Попробуйте сами",
  "Типичная ошибка с границами",
  "Что получилось",
  "Следующий шаг",
  "Почему это быстро",
];

async function expectHeadings(
  page: Page,
  level: 2 | 3,
  names: readonly string[],
): Promise<void> {
  await Promise.all(
    names.map((name) =>
      expect(page.getByRole("heading", { level, name })).toBeVisible(),
    ),
  );
}

async function readSectionRhythm(page: Page) {
  return page.locator("[data-lesson-section]").evaluateAll((elements) =>
    elements.map((element) => {
      const styles = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        id: element.id,
        marginTop: Number.parseFloat(styles.marginTop),
        paddingTop: Number.parseFloat(styles.paddingTop),
        x: rect.x,
        width: rect.width,
      };
    }),
  );
}

function expectSectionGeometry(
  section: Awaited<ReturnType<typeof readSectionRhythm>>[number],
  first: Awaited<ReturnType<typeof readSectionRhythm>>[number],
): void {
  expect(section.marginTop).toBeGreaterThanOrEqual(32);
  expect(section.paddingTop).toBeGreaterThanOrEqual(20);
  expect(section.x).toBeCloseTo(first.x, 0);
  const expectedWidth = section.id === "practice" ? "minimum" : "equal";
  if (expectedWidth === "minimum") {
    expect(section.width).toBeGreaterThanOrEqual(first.width);
    return;
  }
  expect(section.width).toBeCloseTo(first.width, 0);
}

export class LessonLabPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/lab/lesson");
    await expect(this.page).toHaveURL(/\/lab\/lesson$/);
  }

  async expectLessonStructure(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        level: 1,
        name: "Почему двоичный поиск отбрасывает половину вариантов",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("navigation", { name: "Содержание урока" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Теория" }),
    ).toHaveAttribute("aria-current", "location");
    await expect(this.page.getByText(/Текстовое описание схемы/)).toBeVisible();
  }

  async expectUnlistedMetadata(): Promise<void> {
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,nofollow",
    );
  }

  async expectCodeExampleSurface(): Promise<void> {
    const example = this.page.getByLabel("Пример двоичного поиска на Python");
    await expect(example).toBeVisible();
    await expect(
      example.getByRole("button", { name: /Копировать код/ }),
    ).toBeVisible();
    await expect(example.locator('[data-language="python"]')).toHaveCount(1);
    await expect(example.locator('[data-token="kwd"]')).not.toHaveCount(0);

    const overflow = await example
      .locator("[data-code-scroll]")
      .evaluate((element) => element.scrollWidth > element.clientWidth);
    expect(overflow).toBe(false);
  }

  async expectPracticeFeedback(): Promise<void> {
    const tabs = this.page.getByRole("tablist", {
      name: "Задачи урока",
    });
    await expect(tabs).toBeVisible();
    await expect(tabs.getByRole("tab")).toHaveCount(5);
    const firstTab = tabs.getByRole("tab", {
      name: /^01 · Разминка\. Задача 1 из 5/,
    });
    await expect(firstTab).toHaveAttribute("aria-selected", "true");
    await expect(firstTab).toHaveAttribute("tabindex", "0");
    await expect(this.page.locator("[data-practice-task]:visible")).toHaveCount(
      1,
    );
    await expect(this.page.getByRole("tabpanel")).toHaveCount(1);

    const firstTaskTheory = this.page.getByRole("navigation", {
      name: "Теория к задаче «Выберите половину»",
    });
    await expect(
      firstTaskTheory.getByRole("link", { name: "Схема сравнения" }),
    ).toHaveAttribute("href", "#range");

    await firstTab.focus();
    await firstTab.press("ArrowRight");
    const secondTab = tabs.getByRole("tab", { name: /Задача 2 из 5/ });
    await expect(secondTab).toBeFocused();
    await expect(secondTab).toHaveAttribute("aria-selected", "true");
    await secondTab.press("Home");
    await expect(firstTab).toBeFocused();
    await expect(firstTab).toHaveAttribute("aria-selected", "true");
    await expect(
      this.page.getByRole("progressbar", { name: "Решённые задачи урока" }),
    ).toHaveAttribute("aria-valuetext", "Решено 0 из 5 задач");
    await this.answerTask("keep-half", "правая");
    await expect(
      this.page.getByRole("progressbar", { name: "Решённые задачи урока" }),
    ).toHaveAttribute("aria-valuetext", "Решено 0 из 5 задач");

    await this.answerTask("keep-half", "левая");
    const solvedTask = this.page.locator('[data-practice-task="keep-half"]');
    await expect(solvedTask).toBeVisible();
    await expect(solvedTask.getByRole("textbox")).toBeDisabled();
    await expect(solvedTask.getByRole("textbox")).toHaveAttribute(
      "data-solved",
      "true",
    );
    await expect(solvedTask.getByRole("textbox")).toHaveValue("левая");
    await expect(
      solvedTask.getByRole("button", { name: "Проверить" }),
    ).toBeDisabled();
    await expect(
      this.page.getByRole("button", { name: /Следующая задача:/ }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("link", { name: "Перейти к результату" }),
    ).toHaveCount(0);
    await secondTab.click();
    await expect(secondTab).toHaveAttribute("aria-selected", "true");
    await this.answerTask("left-boundary", "9");
    await this.answerTask("right-boundary", "7");
    await this.answerTask("loop-condition", "L <= R");
    await expect(
      this.page.getByRole("progressbar", { name: "Решённые задачи урока" }),
    ).toHaveAttribute("aria-valuetext", "Решено 4 из 5 задач");
    await expect(this.page.locator("[data-mastery-status]")).toHaveText(
      "Урок пройден",
    );

    await this.answerTask("trace-count", "3");
    await expect(
      this.page.getByRole("progressbar", { name: "Решённые задачи урока" }),
    ).toHaveAttribute("aria-valuetext", "Решено 5 из 5 задач");
    await expect(
      this.page.getByRole("link", { name: "Перейти к результату" }),
    ).toHaveCount(0);
    await expect(this.page.locator("[data-mastery-status]")).toHaveText(
      "Все задания решены",
    );

    await this.page.reload();
    await expect(
      this.page.getByRole("progressbar", { name: "Решённые задачи урока" }),
    ).toHaveAttribute("aria-valuetext", "Решено 5 из 5 задач");
    await expect(
      this.page
        .getByRole("tablist", { name: "Задачи урока" })
        .getByRole("tab", { name: /Задача 1 из 5/ }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      this.page
        .locator('[data-practice-task="keep-half"]')
        .getByRole("textbox"),
    ).toHaveValue("левая");
    await expect(
      this.page
        .locator('[data-practice-task="keep-half"]')
        .getByRole("button", { name: "Проверить" }),
    ).toBeDisabled();
  }

  async expectLessonNavigation(): Promise<void> {
    await expect(
      this.page.getByRole("link", { name: "Назад к темам" }),
    ).toHaveAttribute("href", "/");
    await expect(this.page.getByText("Алгоритмы поиска")).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "В избранное", exact: true }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("link", { name: "К практике", exact: true }),
    ).toHaveCount(0);

    await expect(this.page.locator("[data-section-position]")).toContainText(
      "Раздел 1 из 4",
    );
    await this.page
      .getByRole("heading", { level: 3, name: "Почему это быстро" })
      .evaluate((element) => element.scrollIntoView({ block: "start" }));
    await expect(this.page.locator("[data-section-position]")).toContainText(
      "Раздел 1 из 4",
    );
    await this.page
      .getByRole("heading", { level: 3, name: "Попробуйте сами" })
      .evaluate((element) => element.scrollIntoView({ block: "start" }));
    await expect(this.page.locator("[data-section-position]")).toContainText(
      "Раздел 2 из 4",
    );
  }

  async expectReadingPosition(): Promise<void> {
    await this.page.evaluate(() => scrollTo(0, 0));
    await expect(
      this.page.locator("[data-reading-position-value]"),
    ).toHaveAttribute("style", /scaleX\(0\)/);
    await this.page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await expect
      .poll(() =>
        this.page
          .locator("[data-reading-position-value]")
          .evaluate((element) => {
            const match = element
              .getAttribute("style")
              ?.match(/scaleX\((.+)\)/);
            return Number(match?.[1] ?? 0);
          }),
      )
      .toBeGreaterThan(0.99);
  }

  async expectMobilePracticeTabs(): Promise<void> {
    const tabs = this.page.getByRole("tablist", {
      name: "Задачи урока",
    });
    await tabs.scrollIntoViewIfNeeded();
    await expect(tabs).toBeVisible();
    await expect(
      this.page.getByRole("navigation", {
        name: "Теория к задаче «Выберите половину»",
      }),
    ).toBeVisible();
    await tabs.getByRole("tab", { name: /Задача 4 из 5/ }).click();
    await expect(
      this.page
        .getByRole("navigation", {
          name: "Теория к задаче «Сохраните последний кандидат»",
        })
        .getByRole("link"),
    ).toHaveCount(2);
  }

  async expectBackNavigation(): Promise<void> {
    await this.page.getByRole("link", { name: "Назад к темам" }).click();
    await expect(this.page).toHaveURL(/\/$/);
  }

  async expectNoHorizontalOverflow(): Promise<void> {
    const overflow = await this.page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  }

  async expectContinuousFrame(): Promise<void> {
    const viewport = this.page.viewportSize();
    if (!viewport) throw new Error("Lesson viewport is unavailable");

    const siteHeader = await this.page
      .locator("[data-lesson-site-header]")
      .boundingBox();
    const subheader = await this.page
      .locator("[data-lesson-subheader]")
      .boundingBox();
    const outlineRail = await this.page
      .locator("[data-outline-rail]")
      .boundingBox();
    const article = await this.page
      .locator("[data-article-frame]")
      .boundingBox();

    expect(siteHeader).not.toBeNull();
    expect(subheader).not.toBeNull();
    expect(outlineRail).not.toBeNull();
    expect(article).not.toBeNull();

    if (!siteHeader || !subheader || !outlineRail || !article) return;

    expect(siteHeader.x).toBeCloseTo(0, 0);
    expect(siteHeader.width).toBeCloseTo(viewport.width, 0);
    expect(subheader.x).toBeCloseTo(0, 0);
    expect(subheader.width).toBeCloseTo(viewport.width, 0);

    if (viewport.width > 1152) {
      expect(outlineRail.y).toBeCloseTo(article.y, 0);
      expect(outlineRail.x + outlineRail.width).toBeCloseTo(article.x, 0);
      expect(outlineRail.height).toBeCloseTo(article.height, 0);

      await expect(this.page.locator("[data-margin-heading]")).toHaveCount(0);

      const centralDivider = await this.page
        .locator("[data-article-frame]")
        .evaluate((element) => getComputedStyle(element, "::before").content);
      expect(centralDivider).toBe("none");
    } else {
      expect(outlineRail.x).toBeCloseTo(0, 0);
      expect(outlineRail.width).toBeCloseTo(viewport.width, 0);
      const edgeGap = await this.page.evaluate(() => {
        const rail = document.querySelector<HTMLElement>("[data-outline-rail]");
        const content = document.querySelector<HTMLElement>(
          "[data-article-frame]",
        );
        if (!rail || !content) throw new Error("Missing lesson frame");
        const railRect = rail.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        return contentRect.top - railRect.bottom;
      });
      expect(Math.abs(edgeGap)).toBeLessThanOrEqual(2);
      expect(article.width).toBeCloseTo(viewport.width, 0);
    }
  }

  async expectStableFontContract(): Promise<void> {
    const preloads = this.page.locator('link[rel="preload"][as="font"]');
    await expect(preloads).toHaveCount(0);

    await this.page.evaluate(() => document.fonts.ready);
    const fontState = await this.page.evaluate(() => ({
      requestedFonts: performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((name) => name.includes("/fonts/")),
      bodyFamily: getComputedStyle(document.body).fontFamily,
      headingFamily: getComputedStyle(
        document.querySelector("h1") ?? document.body,
      ).fontFamily,
    }));

    expect(fontState.requestedFonts).toEqual([]);
    expect(fontState.bodyFamily).toContain("Onest Fallback");
    expect(fontState.headingFamily).toContain("Literata Fallback");
  }

  async expectBoundedMarginalia(): Promise<void> {
    const viewport = this.page.viewportSize();
    if (!viewport) throw new Error("Lesson viewport is unavailable");

    const stage = await this.page
      .locator("[data-proof-stage]")
      .first()
      .boundingBox();
    const note = await this.page
      .locator("[data-proof-note]")
      .first()
      .boundingBox();
    expect(stage).not.toBeNull();
    expect(note).not.toBeNull();
    if (!stage || !note) return;

    if (viewport.width >= 1440) {
      expect(note.width).toBeLessThanOrEqual(256);
      expect(note.x - (stage.x + stage.width)).toBeLessThanOrEqual(32);
      expect(stage.width).toBeGreaterThanOrEqual(
        viewport.width >= 1920 ? 1000 : 760,
      );
      expect(stage.width).toBeLessThanOrEqual(1088);
    }

    const visualTreatment = await this.page
      .locator("[data-proof-note]")
      .first()
      .evaluate((element) => ({
        background: getComputedStyle(element).backgroundColor,
        borderLeft: getComputedStyle(element).borderLeftWidth,
      }));
    expect(visualTreatment.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(visualTreatment.borderLeft).toBe("0px");
  }

  async expectSectionRhythm(): Promise<void> {
    const sections = this.page.locator("[data-lesson-section]");
    await expect(sections).toHaveCount(4);
    await expectHeadings(this.page, 2, sectionHeadings);
    await expectHeadings(this.page, 3, subsectionHeadings);
    const rhythm = await readSectionRhythm(this.page);
    const [first, ...rest] = rhythm;
    expect(first).toBeDefined();
    if (!first) return;
    rest.forEach((section) => expectSectionGeometry(section, first));
  }

  async expectWhitespaceGrouping(): Promise<void> {
    const separators = await this.page.evaluate(() => {
      const readBorder = (
        selector: string,
        side: "borderTopWidth" | "borderBottomWidth",
      ) => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Missing spacing target: ${selector}`);
        return getComputedStyle(element)[side];
      };

      const intro = document.querySelector<HTMLElement>("[data-lesson-intro]");
      if (!intro) throw new Error("Missing lesson intro");

      return {
        introAfter: getComputedStyle(intro, "::after").content,
        visualCaption: readBorder("[data-visual-caption]", "borderTopWidth"),
        visualAlternative: readBorder(
          "[data-visual-alternative]",
          "borderBottomWidth",
        ),
        practiceForm: readBorder("[data-practice-form]", "borderTopWidth"),
        proofRows: Array.from(
          document.querySelectorAll("[data-proof-row]"),
          (element) => getComputedStyle(element).borderBottomWidth,
        ),
      };
    });

    expect(separators.introAfter).toBe("none");
    expect(separators.visualCaption).toBe("0px");
    expect(separators.visualAlternative).toBe("0px");
    expect(separators.practiceForm).toBe("0px");
    expect(separators.proofRows).toEqual(["0px", "0px", "0px"]);
  }

  async expectOutlineTracksReadingPosition(): Promise<void> {
    const target = this.page.getByRole("heading", {
      level: 3,
      name: "Почему это быстро",
    });
    await target.evaluate((element) =>
      element.scrollIntoView({ block: "start" }),
    );
    await expect(
      this.page.getByRole("link", { name: "Почему это быстро" }),
    ).toHaveAttribute("aria-current", "location");
    await expect(
      this.page.getByRole("link", { name: "Теория" }),
    ).toHaveAttribute("data-active-branch", "true");
    const activeTreatment = await this.page
      .getByRole("link", { name: "Почему это быстро" })
      .evaluate((element) => ({
        background: getComputedStyle(element).backgroundColor,
        color: getComputedStyle(element).color,
        weight: Number.parseFloat(getComputedStyle(element).fontWeight),
      }));
    expect(activeTreatment.background).toBe("rgba(0, 0, 0, 0)");
    expect(activeTreatment.weight).toBeGreaterThanOrEqual(600);
  }

  async expectSimpleDesktopOutline(): Promise<void> {
    const tree = this.page.locator("[data-outline-tree]");
    await expect(tree.locator("svg")).toHaveCount(0);
    await expect(tree.getByRole("list").first()).toBeVisible();
    await expect(tree.getByRole("link")).toHaveCount(10);
  }

  async expectCompactOutlineList(): Promise<void> {
    await expect(this.page.locator("[data-outline-tree] svg")).toHaveCount(0);
    for (const name of [
      "Теория",
      "Середина превращает неизвестность в выбор",
      "Практика",
      "Попробуйте сами",
      "Что важно для ЕГЭ",
      "Результат",
      "Следующий шаг",
    ]) {
      await expect(this.page.getByRole("link", { name })).toBeVisible();
    }
  }

  async expectReadableWithoutJavaScript(): Promise<void> {
    await this.open();
    await expect(
      this.page.getByRole("heading", {
        name: "Почему двоичный поиск отбрасывает половину вариантов",
      }),
    ).toBeVisible();
    await expect(this.page.getByText(/Текстовое описание схемы/)).toBeVisible();
    await expect(this.page.locator("[data-practice-tabs]")).toBeHidden();
    await expect(this.page.locator("[data-practice-task]")).toHaveCount(5);
    for (const task of await this.page.locator("[data-practice-task]").all()) {
      await expect(task).toBeVisible();
    }
    await expect(this.page.getByText("Подсказка").first()).toBeVisible();
    await expect(
      this.page.getByRole("navigation", { name: /Теория к задаче/ }),
    ).toHaveCount(5);
    await expect(
      this.page.getByRole("heading", { name: "Результат" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Следующий шаг" }),
    ).toBeVisible();
  }

  private async answerTask(taskId: string, answer: string): Promise<void> {
    const task = this.page.locator(`[data-practice-task="${taskId}"]`);
    if (!(await task.isVisible())) {
      await this.page.locator(`[data-practice-task-tab="${taskId}"]`).click();
    }
    await task.getByRole("textbox").fill(answer);
    await task.getByRole("button", { name: "Проверить" }).click();
    await expect(task.getByRole("status")).toContainText(
      answer === "правая" ? "Ответ пока не подходит" : "Верно",
    );
  }
}
