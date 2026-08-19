import { expect, type Page } from "@playwright/test";

export class TopicLessonPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/ege/16-rekursiya");
    await expect(this.page).toHaveURL(/\/ege\/16-rekursiya$/);
    await this.page.evaluate(() => {
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    });
  }

  async expectReviewLesson(): Promise<void> {
    await expect(
      this.page.getByRole("link", { name: "infraege — на главную" }),
    ).toHaveAttribute("href", "/");
    await expect(
      this.page.getByRole("heading", {
        level: 1,
        name: "Рекурсивные алгоритмы",
      }),
    ).toBeVisible();
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,nofollow",
    );
    await expect(
      this.page
        .getByRole("navigation", { name: "Содержание урока" })
        .getByRole("link", { name: "Вычисляем F(5) по правилу" }),
    ).toHaveAttribute("href", "#concrete-computation");
    await expect(this.page.locator("[data-practice-task]")).toHaveCount(5);
    await expect(this.page.locator("[data-article-frame] img")).toHaveCount(0);
    await expect(this.page.locator("[data-outline-tree] svg")).toHaveCount(0);
    await expect(
      this.page.getByRole("heading", { name: "Что получилось" }),
    ).toBeVisible();
    await expect(
      this.page.getByLabel("Сведения об уроке").getByText("Задание 16"),
    ).toBeVisible();
    await expect(
      this.page.getByLabel("Сведения об уроке").getByText("5 задач"),
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
    await expect(this.page.getByLabel("Проверьте себя")).toHaveCount(4);
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
    await expect(
      context.getByText("ЕГЭ по информатике", { exact: true }),
    ).toBeVisible();
    await expect(
      context.getByText("Задание 16 · Рекурсивные алгоритмы", {
        exact: true,
      }),
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
    expect(layout.railHasProgress).toBe(false);
    expect(layout.articleHasProgress).toBe(false);
    expect(layout.marginRailChildren).toBe(0);
    expect(
      Math.abs((layout.mistakeLeft ?? 0) - (layout.explanationLeft ?? 0)),
    ).toBeLessThan(2);
  }

  async expectMobileComposition(): Promise<void> {
    await expect(
      this.page.getByText("Задание 16 · ЕГЭ по информатике", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      this.page.getByPlaceholder("Без единиц измерения").first(),
    ).toBeVisible();
    await expect(
      this.page.getByRole("textbox", { name: "Ответ" }).first(),
    ).toBeVisible();
    await expect(this.page.getByText("Подсказка").first()).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Решение" }).first(),
    ).toBeVisible();
  }

  async expectPracticeSolutions(): Promise<void> {
    const firstPanel = this.page.locator("[data-practice-task]").first();
    await firstPanel.getByRole("button", { name: "Решение" }).click();
    await expect(firstPanel.getByText(/F\(5\) = 32/)).toBeVisible();

    await this.page
      .getByRole("tab", {
        name: /Задача 2 из 5: Проследите рекурсивные вызовы/,
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
    await this.expectReviewLesson();
    await expect(this.page.locator("[data-practice-form] form")).toHaveCount(5);
    await expect(
      this.page.locator("[data-practice-form] [data-unenhanced-accordion]"),
    ).toHaveCount(5);
    await expect(
      this.page.getByText(/Раскрываем вызовы снизу вверх/),
    ).toBeVisible();
    await expect(
      this.page.getByRole("group", {
        name: "Та же рекуррентная формула в Python",
      }),
    ).toBeVisible();
    await this.expectNoHorizontalOverflow();
  }

  async expectUnknownLessonNotFound(): Promise<void> {
    const response = await this.page.goto("/ege/unknown-lesson");
    expect(response?.status()).toBe(404);
  }
}
