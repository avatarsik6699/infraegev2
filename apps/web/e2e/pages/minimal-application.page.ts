import { expect, type Page } from "@playwright/test";
import bank from "../../../../content/practice-bank/bank.json" with { type: "json" };
import { courseLessonPublications } from "../../src/entities/course/content/course-publication.mjs";
import { expectNoHorizontalOverflow } from "./layout.assertions";

const visibleTasks = bank.tasks
  .filter(({ task }) => task.catalog_visible && !task.archived)
  .sort((a, b) => a.task.id.localeCompare(b.task.id));

export class MinimalApplicationPage {
  constructor(private readonly page: Page) {}
  async expectPublicPages() {
    for (const path of [
      "/",
      "/ege",
      "/courses",
      "/courses/python",
      "/privacy",
      "/practice",
    ]) {
      const response = await this.page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(this.page.locator("[data-infraege-mark]")).toBeVisible();
      await expect(
        this.page.locator(
          'script[src*="/stats/"], [data-analytics-consent], [data-home-map], [data-svg-pattern]',
        ),
      ).toHaveCount(0);
      await expectNoHorizontalOverflow(this.page);
    }
    for (const path of ["/lab/design-system", "/lab/lesson"]) {
      expect((await this.page.goto(path))?.status()).toBe(404);
      await expect(
        this.page.getByRole("link", { name: "На главную", exact: true }),
      ).toBeVisible();
    }
  }
  async expectPublishedLesson(index: number) {
    const lesson = courseLessonPublications[index];
    const response = await this.page.goto(
      `/courses/python/${lesson.routeSlug}`,
    );
    expect(response?.status()).toBe(200);
    await expect(this.page.getByRole("heading", { level: 1 })).toHaveText(
      lesson.title,
    );
    await expect(
      this.page.getByRole("heading", { name: "Практика", exact: true }),
    ).toBeVisible();
    expect(await this.page.content()).not.toContain('"answer_variants"');
    await expectNoHorizontalOverflow(this.page);
  }
  async expectCatalog() {
    await this.page.goto("/practice");
    const list = this.page.getByRole("list", { name: "Задачи", exact: true });
    await expect(list.getByRole("listitem")).toHaveCount(30);
    const first = await list.getByRole("link").first().getAttribute("href");
    await this.page
      .getByRole("link", { name: "Следующая страница" })
      .press("Enter");
    await expect(this.page).toHaveURL(/page=2/);
    await expect(list.getByRole("link").first()).not.toHaveAttribute(
      "href",
      first!,
    );
    await this.page.goto("/practice?exam_number=16&difficulty=1");
    await expect(list.getByRole("listitem").first()).toContainText("ЕГЭ 16");
    await this.page.goto("/practice?skill=nonexistent");
    await expect(
      this.page.getByRole("heading", { name: "Пока ничего не нашлось" }),
    ).toBeVisible();
    await this.page.goto("/practice?difficulty=9");
    await expect(
      this.page.getByRole("heading", { name: /фильтр/i }),
    ).toBeVisible();
  }
  async expectCombinedPracticeFilters(noJavaScript = false) {
    await this.page.goto("/practice?page=2");
    const filters = this.page.getByRole("form", { name: "Фильтры задач" });
    await filters.getByLabel("Поиск задач", { exact: true }).fill("рекурс");
    await expect(this.page).toHaveURL(/page=2/);
    if (noJavaScript) {
      await filters
        .getByRole("listbox", { name: "Тема", exact: true })
        .selectOption(["ege-16", "ege-5"]);
      await filters.getByRole("button", { name: "Применить" }).click();
    } else {
      await filters
        .getByRole("combobox", { name: "Тема", exact: true })
        .click();
      await this.page.getByRole("option", { name: /16 номер/ }).click();
      await this.page.getByRole("option", { name: /5 номер/ }).click();
      await expect(this.page).toHaveURL(/page=2/);
      await this.page
        .getByRole("button", { name: "Применить", exact: true })
        .click();
    }
    await expect(this.page).toHaveURL(
      (url) =>
        url.searchParams.get("q") === "рекурс" &&
        url.searchParams.getAll("topics").length === 2 &&
        !url.searchParams.has("page"),
    );
    await this.page.getByRole("link", { name: /Убрать тему: 5 номер/ }).click();
    await expect(this.page).toHaveURL(
      (url) =>
        url.searchParams.getAll("topics").join() === "ege-16" &&
        url.searchParams.get("q") === "рекурс",
    );
    if (!noJavaScript)
      await expect(
        filters.getByRole("combobox", { name: "Тема", exact: true }),
      ).toContainText("16 номер");
    if (noJavaScript) {
      await this.page
        .getByRole("combobox", { name: "Сортировка:", exact: true })
        .selectOption("difficulty_desc");
    } else {
      await this.page.getByRole("combobox", { name: "Сортировка:" }).click();
      await this.page.getByRole("option", { name: "Сначала сложные" }).click();
    }
    if (noJavaScript)
      await filters.getByRole("button", { name: "Найти задачи" }).click();
    await expect(this.page).toHaveURL(/sort=difficulty_desc/);
    if (!noJavaScript)
      await expect(
        filters.getByRole("combobox", { name: "Тема", exact: true }),
      ).toBeVisible();
    if (noJavaScript) {
      await this.page
        .getByRole("combobox", { name: "На странице:", exact: true })
        .selectOption("10");
    } else {
      await this.page
        .getByRole("combobox", { name: "На странице:", exact: true })
        .click();
      await this.page.getByRole("option", { name: "10", exact: true }).click();
    }
    if (noJavaScript)
      await this.page
        .getByRole("button", { name: "Применить", exact: true })
        .last()
        .click();
    await expect(this.page).toHaveURL(/limit=10/);
    await expect(
      this.page
        .getByRole("list", { name: "Задачи", exact: true })
        .locator(":scope > li"),
    ).toHaveCount(10);
    await this.page.getByRole("link", { name: "Следующая страница" }).click();
    await expect(this.page).toHaveURL(/page=2/);
  }

  async expectTopicSearchAndCancellation() {
    await this.page.goto("/practice");
    const trigger = this.page.getByRole("combobox", {
      name: "Тема",
      exact: true,
    });
    await trigger.click();
    await this.page
      .getByRole("combobox", { name: "Найти тему", exact: true })
      .fill("Циклы");
    const option = this.page.getByRole("option", { name: /Python · Циклы/ });
    await expect(option).toContainText("0 заданий");
    await option.click();
    await this.page.keyboard.press("Escape");
    await expect(trigger).toContainText("Все темы");
    await trigger.click();
    await this.page
      .getByRole("combobox", { name: "Найти тему", exact: true })
      .fill("Циклы");
    await option.click();
    await this.page
      .getByRole("button", { name: "Применить", exact: true })
      .click();
    await expect(
      this.page.getByRole("heading", { name: "Пока ничего не нашлось" }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Найдено 0 заданий", { exact: true }),
    ).toBeVisible();
    await this.page
      .getByRole("button", { name: "Как работает практика", exact: true })
      .click();
    await expect(this.page.getByRole("dialog")).toContainText(
      "Черновики сохраняются",
    );
    await this.page.keyboard.press("Escape");
    await expect(this.page.getByRole("dialog")).toBeHidden();
    await this.page.getByRole("link", { name: /Убрать тему: Python/ }).click();
    await expect(
      this.page
        .getByRole("list", { name: "Задачи", exact: true })
        .locator(":scope > li"),
    ).toHaveCount(30);
  }

  async expectPracticeToolbarStability() {
    for (const width of [1440, 390]) {
      await this.page.setViewportSize({ width, height: 900 });
      await this.page.goto("/practice?limit=10&page=10");
      const navigation = this.page.getByRole("navigation", {
        name: "Страницы задач",
      });
      await expect(
        navigation.getByRole("link", { name: "Страница 9", exact: true }),
      ).toBeVisible();
      await expect(
        navigation.getByRole("link", { name: "Страница 11", exact: true }),
      ).toBeVisible();
      await navigation
        .getByRole("link", { name: "Перейти на страницу 5", exact: true })
        .click();
      await expect(
        navigation.getByRole("link", { name: "Страница 5", exact: true }),
      ).toHaveAttribute("aria-current", "page");
      const row = this.page.locator('li[id^="task-"]').first();
      await row.getByRole("button", { name: /Раскрыть задание:/ }).click();
      const input = row.getByRole("textbox", { name: "Ваш ответ" });
      await expect(input).toBeEnabled();
      const hint = row.getByRole("button", { name: "Подсказка", exact: true });
      const collapse = row.getByRole("button", { name: /Свернуть задание:/ });
      const before = await hint.evaluate(
        (el) => el.getBoundingClientRect().top + scrollY,
      );
      for (const state of ["incorrect", "error", "correct"]) {
        let finishCheck!: () => void;
        const checking = new Promise<void>((resolve) => {
          finishCheck = resolve;
        });
        await this.page.route("**/api/tasks/*/check", async (route) => {
          const body = route.request().postDataJSON() as {
            solution_revision: number;
          };
          await checking;
          await route.fulfill({
            status: state === "error" ? 503 : 200,
            json: {
              correct: state === "correct",
              explanation: [],
              solution_revision: body.solution_revision,
            },
          });
        });
        await input.fill("0");
        const checkButton = row.getByRole("button", {
          name: "Проверить",
          exact: true,
        });
        const buttonBefore = (await checkButton.boundingBox())!;
        await checkButton.click();
        const busyButton = row.getByRole("button", {
          name: "Проверяем",
          exact: true,
        });
        try {
          await expect(busyButton).toHaveAttribute("aria-busy", "true");
          const buttonBox = (await busyButton.boundingBox())!;
          const spinnerBox = (await busyButton
            .locator("[data-button-spinner]")
            .boundingBox())!;
          expect(Math.abs(buttonBox.width - buttonBefore.width)).toBeLessThan(
            1,
          );
          expect(Math.abs(buttonBox.height - buttonBefore.height)).toBeLessThan(
            1,
          );
          expect(
            Math.abs(
              spinnerBox.x +
                spinnerBox.width / 2 -
                buttonBox.x -
                buttonBox.width / 2,
            ),
          ).toBeLessThan(1);
          expect(
            Math.abs(
              spinnerBox.y +
                spinnerBox.height / 2 -
                buttonBox.y -
                buttonBox.height / 2,
            ),
          ).toBeLessThan(1);
        } finally {
          finishCheck();
        }
        if (state === "incorrect")
          await expect(input).toHaveAttribute("aria-invalid", "true");
        if (state === "error")
          await expect(row.getByRole("alert")).toContainText(
            "Не удалось проверить ответ",
          );
        if (state === "correct") await expect(input).toBeDisabled();
        const after = await hint.evaluate(
          (el) => el.getBoundingClientRect().top + scrollY,
        );
        expect(Math.abs(after - before)).toBeLessThan(1);
        const inputTop = await input.evaluate(
          (el) => el.getBoundingClientRect().top + scrollY,
        );
        if (width === 1440) expect(Math.abs(after - inputTop)).toBeLessThan(1);
        if (state === "correct") {
          await expect(
            row.locator("[data-answer-accepted-icon]"),
          ).toBeVisible();
          await expect(row.getByText("Эта версия задачи решена.")).toHaveCount(
            0,
          );
        }
        if (state !== "correct") {
          const message = row.getByText(
            state === "error"
              ? /Не удалось проверить ответ/
              : /Ответ пока не подходит/,
          );
          const inputBox = (await input.boundingBox())!;
          const errorBox = (await message.boundingBox())!;
          expect(errorBox.y).toBeGreaterThanOrEqual(
            inputBox.y + inputBox.height,
          );
          expect(Math.abs(errorBox.x - inputBox.x)).toBeLessThan(1);
        }
        await this.page.unrouteAll({ behavior: "wait" });
      }
      const theory = row.getByRole("navigation", { name: "Теория к задаче" });
      if (width === 1440) {
        const theoryTop = await theory.evaluate(
          (el) => el.getBoundingClientRect().top + scrollY,
        );
        expect(theoryTop).toBeLessThan(before);
      }
      const helpBox = (await hint.boundingBox())!;
      await hint.click();
      const expandedHint = row.getByRole("button", {
        name: "Скрыть подсказку",
        exact: true,
      });
      expect((await expandedHint.boundingBox())!.width).toBeCloseTo(
        helpBox.width,
        0,
      );
      await expect(expandedHint).toHaveCSS("text-decoration-line", "none");
      await expect(
        row.getByRole("heading", { name: "Подсказка", exact: true }),
      ).toBeVisible();
      await row.getByRole("button", { name: "Решение", exact: true }).click();
      await expect(
        row.getByRole("heading", { name: "Решение", exact: true }),
      ).toBeVisible();
      await expectNoHorizontalOverflow(this.page);
      await row.getByRole("button", { name: "Решить ещё раз" }).click();
      await expect(input).toBeEnabled();
      await expect(input).toBeFocused();
      await collapse.click();
      await this.page.evaluate(() =>
        localStorage.removeItem("infraege:practice-progress"),
      );
    }
  }

  async expectPracticeAnswerLayout() {
    await this.page.setViewportSize({ width: 1440, height: 1000 });
    await this.page.goto("/practice");
    const first = this.page
      .getByRole("list", { name: "Задачи", exact: true })
      .getByRole("listitem")
      .first();
    await first
      .getByRole("button", { name: visibleTasks[0].task.title, exact: true })
      .click();
    const input = first.getByRole("textbox", { name: "Ваш ответ" });
    const statement = first.locator('[data-content-context="statement"]');
    await expect(input).toBeVisible();
    const contentBox = (await statement.boundingBox())!;
    const inputBox = (await input.boundingBox())!;
    expect(inputBox.y).toBeGreaterThan(contentBox.y + contentBox.height);
    const check = first.getByRole("button", { name: "Проверить", exact: true });
    const before = (await check.boundingBox())!;
    await input.fill("wrong-answer");
    await check.click();
    await expect(first.getByText(/Ответ пока не подходит/)).toBeVisible();
    const after = (await check.boundingBox())!;
    expect(Math.abs(after.y - before.y)).toBeLessThan(1);
    await expect(input).toHaveAttribute("aria-invalid", "true");
    for (const width of [1024, 768, 390]) {
      await this.page.setViewportSize({ width, height: 1000 });
      await expectNoHorizontalOverflow(this.page);
      if (width < 1024) {
        const statementBox = (await statement.boundingBox())!;
        expect((await input.boundingBox())!.y).toBeGreaterThan(
          statementBox.y + statementBox.height,
        );
      }
    }
  }

  async expectInlineSolving() {
    await this.page.goto("/practice");
    const list = this.page.getByRole("list", { name: "Задачи", exact: true });
    const first = list.getByRole("listitem").nth(0);
    const second = list.getByRole("listitem").nth(1);
    await expect(first.getByRole("textbox")).toHaveCount(0);
    await first
      .getByRole("button", { name: visibleTasks[0].task.title, exact: true })
      .click();
    await second
      .getByRole("button", { name: visibleTasks[1].task.title, exact: true })
      .click();
    await first.getByRole("textbox").fill("draft-one");
    await second.getByRole("textbox").fill("draft-two");
    await first.getByRole("button", { name: "Подсказка", exact: true }).click();
    await first
      .getByRole("button", { name: visibleTasks[0].task.title, exact: true })
      .click();
    await expect(first.getByRole("textbox")).toBeHidden();
    await expect(
      first.getByRole("button", {
        name: visibleTasks[0].task.title,
        exact: true,
      }),
    ).toBeFocused();
    await first
      .getByRole("button", { name: visibleTasks[0].task.title, exact: true })
      .press("Enter");
    await expect(first.getByRole("textbox")).toHaveValue("draft-one");
    await expect(second.getByRole("textbox")).toHaveValue("draft-two");
    await expect(
      first.getByRole("button", { name: "Скрыть подсказку", exact: true }),
    ).toHaveAttribute("aria-expanded", "true");
    await first
      .getByRole("textbox")
      .fill(visibleTasks[0].task.checker.answer_variants[0]);
    await first.getByRole("button", { name: "Проверить", exact: true }).click();
    await expect(
      first.getByRole("button", { name: "Решить ещё раз" }),
    ).toBeVisible();
    await expect(this.page).toHaveURL(/\/practice$/);
    await expect(second.getByRole("textbox")).toHaveValue("draft-two");
    await expectNoHorizontalOverflow(this.page);
    await this.page.reload();
    await first
      .getByRole("button", { name: visibleTasks[0].task.title, exact: true })
      .click();
    await expect(first.getByRole("textbox")).toBeDisabled();
    await second
      .getByRole("button", { name: visibleTasks[1].task.title, exact: true })
      .click();
    await expect(second.getByRole("textbox")).toHaveValue("");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await expectNoHorizontalOverflow(this.page);
  }
  async expectCatalogWithoutJavaScript() {
    await this.page.goto("/practice?exam_number=16");
    const first = this.page
      .getByRole("list", { name: "Задачи", exact: true })
      .getByRole("listitem")
      .first();
    await first.getByRole("link", { name: /^ID:/ }).click();
    await expect(
      this.page.getByRole("region", { name: "Решение задачи" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "К списку задач" }),
    ).toHaveAttribute("href", "/practice?exam_number=16");
    await expectNoHorizontalOverflow(this.page);
  }
  async expectSolveAndProgress() {
    const { task } = visibleTasks[0];
    await this.page.goto(`/practice/${task.id}`);
    const input = this.page.getByRole("textbox", {
      name: "Ваш ответ",
      exact: true,
    });
    await expect(input).toBeEnabled();
    await input.fill(task.checker.answer_variants[0]);
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(
      this.page.getByRole("button", { name: "Решить ещё раз" }),
    ).toBeVisible();
    await this.page.reload();
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue(task.checker.answer_variants[0]);
    await this.page.getByRole("button", { name: "Решить ещё раз" }).click();
    await expect(input).toBeEnabled();
    await input.fill("unsubmitted");
    await this.page.reload();
    await expect(input).not.toHaveValue("unsubmitted");
    await expect(
      this.page.getByRole("link", { name: "Следующая задача" }),
    ).toHaveCount(0);
    await this.page.getByRole("link", { name: "К списку задач" }).click();
    await expect(this.page).toHaveURL(/\/practice$/);
    expect(
      (await this.page.evaluate(() =>
        localStorage.getItem("infraege:lesson-progress:v2"),
      )) ?? "",
    ).not.toContain(task.id);
  }
  async expectFailedCheck() {
    await this.page.goto(`/practice/${visibleTasks[1].task.id}`);
    const input = this.page.getByRole("textbox", {
      name: "Ваш ответ",
      exact: true,
    });
    await expect(input).toBeEnabled();
    await input.fill("123");
    await this.page.route("**/api/tasks/*/check", (route) => route.abort());
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(this.page.getByRole("alert")).toBeVisible();
    await expect(input).toHaveValue("123");
    await this.page.unroute("**/api/tasks/*/check");
    await input.fill(visibleTasks[1].task.checker.answer_variants[0]);
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(
      this.page.getByRole("button", { name: "Решить ещё раз" }),
    ).toBeVisible();
  }
  async expectReadablePractice() {
    const response = await this.page.goto(
      `/practice/${visibleTasks[0].task.id}`,
    );
    expect(response?.status()).toBe(200);
    await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await this.page.content()).not.toContain('"answer_variants"');
    await expectNoHorizontalOverflow(this.page);
  }
  async expectStableDelivery() {
    for (const width of [1440, 390]) {
      await this.page.setViewportSize({ width, height: 900 });
      let release!: () => void;
      const hold = new Promise<void>((resolve) => {
        release = resolve;
      });
      await this.page.route("**/*.woff2", async (route) => {
        await hold;
        await route.abort();
      });
      await this.page.goto("/", { waitUntil: "domcontentloaded" });
      const heading = this.page.getByRole("heading", { level: 1 });
      await expect(heading).toBeVisible();
      const before = await heading.boundingBox();
      release();
      await this.page.evaluate(() => document.fonts.ready);
      const after = await heading.boundingBox();
      expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
      await expectNoHorizontalOverflow(this.page);
      await this.page.unroute("**/*.woff2");
    }
  }

  async expectStablePracticeControls() {
    for (const width of [1440, 390]) {
      await this.page.setViewportSize({ width, height: 900 });
      let release!: () => void;
      const hold = new Promise<void>((resolve) => {
        release = resolve;
      });
      await this.page.route("**/*.js", async (route) => {
        await hold;
        await route.continue();
      });
      try {
        await this.page.goto("/practice?topics=ege-16&topics=ege-5", {
          waitUntil: "commit",
        });
        const filters = this.page.getByRole("form", { name: "Фильтры задач" });
        const topic = this.page.getByRole("combobox", {
          name: "Тема",
          exact: true,
        });
        await expect(topic).toBeVisible();
        await expect(topic).toHaveText("Выбрано тем: 2");
        const list = this.page.getByRole("list", {
          name: "Задачи",
          exact: true,
        });
        await expect(list).toBeVisible();
        const filtersBefore = await filters.boundingBox();
        const listBefore = await list.boundingBox();
        const rowBefore = await list
          .locator(":scope > li")
          .first()
          .boundingBox();
        release();
        await expect(
          list.getByRole("button", { name: /Раскрыть задание:/ }).first(),
        ).toBeVisible();
        // A visible trigger is SSR content; opening its popup proves hydration has completed.
        await expect(async () => {
          await topic.click();
          await expect(this.page.getByPlaceholder("Найти тему")).toBeVisible();
        }).toPass();
        await this.page.keyboard.press("Escape");
        const filtersAfter = await filters.boundingBox();
        const listAfter = await list.boundingBox();
        const rowAfter = await list
          .locator(":scope > li")
          .first()
          .boundingBox();
        expect(
          Math.abs(filtersAfter!.height - filtersBefore!.height),
        ).toBeLessThan(1);
        expect(Math.abs(listAfter!.y - listBefore!.y)).toBeLessThan(1);
        expect(Math.abs(rowAfter!.height - rowBefore!.height)).toBeLessThan(1);
        const origin = await this.page.evaluate(() => performance.timeOrigin);
        await filters.getByRole("searchbox").fill("рекурс");
        await filters.getByRole("button", { name: "Найти задачи" }).click();
        await expect(this.page).toHaveURL(
          (url) => url.searchParams.get("q") === "рекурс",
        );
        expect(await this.page.evaluate(() => performance.timeOrigin)).toBe(
          origin,
        );
        await expectNoHorizontalOverflow(this.page);
      } finally {
        release();
        await this.page.unrouteAll({ behavior: "wait" });
      }
    }
  }

  async expectStableLessonOutline() {
    await this.page.setViewportSize({ width: 390, height: 844 });
    let release!: () => void;
    const hold = new Promise<void>((resolve) => {
      release = resolve;
    });
    await this.page.route("**/*.js", async (route) => {
      await hold;
      await route.continue();
    });
    try {
      await this.page.goto("/ege/16-rekursiya", { waitUntil: "commit" });
      const outline = this.page.getByRole("navigation", {
        name: "Содержание урока",
      });
      const trigger = outline.getByRole("button", { name: "Содержание урока" });
      await expect(trigger).toBeVisible();
      await expect(trigger).toBeDisabled();
      const before = await outline.boundingBox();
      release();
      await expect(trigger).toBeEnabled();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      const after = await outline.boundingBox();
      expect(Math.abs(after!.height - before!.height)).toBeLessThan(2);
      await trigger.click();
      await expect(
        outline.getByRole("link", { name: "Теория", exact: true }),
      ).toBeVisible();
    } finally {
      release();
      await this.page.unroute("**/*.js");
    }
  }
}
