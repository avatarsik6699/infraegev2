import { expect, type Page } from "@playwright/test";
import { expectPublicReleaseIdentity } from "./public-header.assertions";

export class TopicLessonPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/ege/16-rekursiya");
    await expect(this.page).toHaveURL(/\/ege\/16-rekursiya$/);
    await expect
      .poll(async () => {
        await this.page.evaluate(() => {
          if (document.scrollingElement)
            document.scrollingElement.scrollTop = 0;
        });
        return this.page.evaluate(
          () => document.scrollingElement?.scrollTop ?? window.scrollY,
        );
      })
      .toBe(0);
  }

  async expectPublishedLesson(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
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
      "index,follow",
    );
    await expect(this.page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://infraege.ru/ege/16-rekursiya",
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
      context.getByRole("link", { name: "Назад", exact: true }),
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
      this.page.getByText("Задание 16 · Рекурсивные алгоритмы", {
        exact: true,
      }),
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
        name: "Подготовка к ЕГЭ по информатике",
      }),
    ).toBeVisible();
  }

  async expectInternalBackNavigation(): Promise<void> {
    await this.open();
    await expect(
      this.page.locator("[data-practice-form][data-enhanced]"),
    ).toBeVisible();
    await this.page
      .getByRole("link", { name: "infraege — на главную" })
      .click();
    await expect(this.page).toHaveURL(/\/$/);
    await this.page.evaluate(() => {
      window.location.hash = "materials-title";
    });
    await expect(this.page).toHaveURL(/\/#materials-title$/);
    await this.page
      .getByRole("link", { name: /Рекурсивные алгоритмы/ })
      .click();
    await expect(this.page).toHaveURL(/\/ege\/16-rekursiya$/);
    const backLink = this.page.getByRole("link", {
      name: "Назад",
      exact: true,
    });
    await backLink.click();
    await expect(this.page).toHaveURL(/\/#materials-title$/);
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

  async expectDistilledSolvedTask(): Promise<void> {
    const firstTab = this.page.getByRole("tab", {
      name: /Задача 1 из 5/,
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
      /Задача 1 из 5:.*решена/,
    );
    await expect(firstTab).toHaveAttribute("data-solved", "true");
    const solvedColors = await answer.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        border: style.borderColor,
      };
    });

    const secondTab = this.page.getByRole("tab", { name: /Задача 2 из 5/ });
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
    expect(solvedColors.border).not.toBe(unsolvedColors.border);
    expect(solvedColors.background).not.toBe(unsolvedColors.background);
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

  async expectStableReload(): Promise<void> {
    await this.page.reload();
    await this.expectPublishedLesson();
  }
}
