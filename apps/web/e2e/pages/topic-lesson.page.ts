import { expect, type Page } from "@playwright/test";
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
};

const recursionLessonConfig: TopicLessonPageConfig = {
  route: "/ege/16-rekursiya",
  title: "Рекурсивные алгоритмы",
  taskNumber: 16,
};

export class TopicLessonPage {
  constructor(
    private readonly page: Page,
    private readonly config: TopicLessonPageConfig = recursionLessonConfig,
  ) {}

  async open(): Promise<void> {
    await openLessonAtTop(this.page, this.config.route);
  }

  async expectPublishedNumberRecordLesson(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
    await expectPublishedLessonDocument(this.page, {
      canonicalPath: this.config.route,
      title: this.config.title,
    });
    await expect(
      this.page
        .getByLabel("Сведения об уроке")
        .getByText("Задание " + String(this.config.taskNumber)),
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
      new Set(["500"]),
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
    await expect(this.page).toHaveTitle("Рекурсивные алгоритмы — ALCHIMIA");
    await expect(
      this.page.getByRole("link", {
        name: "ALCHIMIA — ЕГЭ информатика, на главную",
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
        .getByRole("link", { name: "Вычисляем F(5) по правилу" }),
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
    expect(lessonNavigationGeometry.checkpointHasTintedFill).toBe(true);
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
      .getByRole("link", {
        name: "ALCHIMIA — ЕГЭ информатика, на главную",
      })
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
    await this.page
      .getByRole("tab", {
        name: /Задача 1 из 5/,
      })
      .click();
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
      firstPanel.getByText(
        "Не получилось проверить ответ. Проверьте соединение и попробуйте ещё раз.",
      ),
    ).toBeVisible();
    expect(failedChecks).toBe(1);
    await expect(firstAnswer).toBeEnabled();
    await expect(firstAnswer).toHaveValue("32");

    await firstCheck.click();
    await expect(firstPanel.getByRole("status")).toContainText("Верно");
    await this.solveTask("rekursiya-call-stack-trace", 2, "16");
    await this.solveTask("rekursiya-two-values", 3, "29");
    await this.solveTask("rekursiya-repeated-calls", 4, "25");

    const resultProgress = this.page.locator("[data-result-progress]");
    await expect(
      resultProgress.getByText("4 / 5", { exact: true }),
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
      resultProgress.getByText("0 / 5", { exact: true }),
    ).toBeVisible();
    await expect(
      resultProgress.getByText("Вы ещё не решали задания"),
    ).toBeVisible();
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
        name: "ALCHIMIA — ЕГЭ информатика, на главную",
      })
      .click();
    await expect(this.page).toHaveURL(/\/$/);
    await expect(
      this.page.getByRole("heading", {
        name: "Подготовка к ЕГЭ по информатике",
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
  ): Promise<void> {
    await expect(
      this.page.locator("[data-practice-form][data-enhanced]"),
    ).toBeVisible();
    await this.page
      .getByRole("tab", {
        name: `Задача ${String(index)} из 5`,
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
