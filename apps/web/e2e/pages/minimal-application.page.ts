import { expect, type Page } from "@playwright/test";
import bankJson from "../../../../content/practice-bank/bank.json" with { type: "json" };
import {
  courseLessonPublications,
  coursePublications,
} from "../../src/entities/course/content/course-publication.mjs";
import { lessonPublications } from "../../src/shared/config/lesson-publication.mjs";
import { expectNoHorizontalOverflow } from "./layout.assertions";

const firstTopicSubtopicByRouteSlug: Readonly<Record<string, string>> = {
  "3-svyazannye-tablicy": "tablicy-i-klyuchi",
  "4-kodirovanie-i-uslovie-fano": "kod-i-uslovie-fano",
  "5-preobrazovanie-zapisey-chisel": "chislo-i-zapis",
  "7-izobrazheniya-zvuk-tekst": "bity-i-kody",
  "8-perebor-slov": "slova-i-umnozhenie",
  "9-obrabotka-tablicy-chisel": "stroka-i-uslovie",
  "10-ip-adresa-i-maski": "adres-i-maska",
  "11-paroli-i-zapisi": "parol-v-bajtah",
  "14-sistemy-schisleniya": "zapis-i-znachenie",
  "16-rekursiya": "funktsiya-cherez-sebya",
  "17-chislovye-posledovatelnosti": "chisla-i-proverki",
  "18-robot-sborshchik-monet": "luchshaya-summa-do-kletki",
  "19-21-vyigryshnaya-strategiya": "igra-i-strategiya",
  "23-analiz-grafov": "graf-i-put",
  "24-obrabotka-simvolnyh-strok": "stroka-i-fragment",
  "25-deliteli-i-maski": "perebor-i-proverki",
  "26-sortirovka-i-otbor": "zapisi-i-rejting",
  "27-analiz-dannyh-i-klasterizatsiya": "tochki-i-rasstoyaniya",
};

/** A course lesson lives under the course whose module plan lists it. */
function courseLessonRoute(lesson: { id: string; routeSlug: string }): string {
  const course = coursePublications.find(({ modules }) =>
    modules.some(({ lessonPlan }) =>
      lessonPlan.some((item) => item.id === lesson.id),
    ),
  );
  if (!course) throw new Error(`Course lesson ${lesson.id} has no course`);
  return `/courses/${course.routeSlug}/${lesson.routeSlug}`;
}

function topicSubtopicRoute(routeSlug: string): string {
  const firstSlug = firstTopicSubtopicByRouteSlug[routeSlug];
  if (!firstSlug)
    throw new Error(`Published topic ${routeSlug} has no subtopic`);
  return `/ege/${routeSlug}/${firstSlug}`;
}

/** The fields of the practice bank these checks read. The file has grown past the size
 * up to which TypeScript infers a JSON module's type, so the import is typed here. */
const bank = bankJson as unknown as {
  tasks: {
    task: {
      id: string;
      title: string;
      catalog_visible: boolean;
      archived: boolean;
      exam_numbers: number[];
      difficulty: number;
      sources: { kind: string; is_public: boolean }[];
      checker: { answer_variants: string[] };
    };
  }[];
};

// F46: the catalog's default order — exam number (none last), difficulty, id.
const catalogRank = ({ task }: (typeof bank.tasks)[number]) =>
  [task.exam_numbers[0] ?? 1000, task.difficulty] as const;
const visibleTasks = bank.tasks
  .filter(({ task }) => task.catalog_visible && !task.archived)
  .sort((a, b) => {
    const [examA, difficultyA] = catalogRank(a);
    const [examB, difficultyB] = catalogRank(b);
    return (
      examA - examB ||
      difficultyA - difficultyB ||
      a.task.id.localeCompare(b.task.id)
    );
  });

export class MinimalApplicationPage {
  constructor(private readonly page: Page) {}

  async expectUnifiedLesson(index: number, noJavaScript = false) {
    // These are reading/disclosure checks; isolate the guest session so traversing
    // the full publication registry does not exercise auth rate limits.
    if (!noJavaScript) {
      await this.page.route("**/api/auth/session", (route) =>
        route.fulfill({ json: { account: null, csrf_token: null } }),
      );
    }
    const lessons = [
      ...lessonPublications
        .filter((lesson) => lesson.status === "published")
        .map((lesson) => ({
          ...lesson,
          route: topicSubtopicRoute(lesson.routeSlug),
        })),
      ...courseLessonPublications
        .filter((lesson) => lesson.status === "published")
        .map((lesson) => ({
          ...lesson,
          route: courseLessonRoute(lesson),
        })),
    ];
    const lesson = lessons[index];
    await this.page.setViewportSize({ width: 390, height: 844 });
    expect((await this.page.goto(lesson.route))?.status()).toBe(200);
    if (!noJavaScript) {
      // The root font override below must happen after client hydration so the
      // test does not create an SSR/client attribute mismatch on <html>.
      // Cold unbundled startup has a separate budget from interaction assertions.
      await expect(
        this.page.getByRole("link", { name: "Войти", exact: true }),
      ).toBeVisible({ timeout: 15_000 });
    }
    if (lesson.route.startsWith("/ege/")) {
      await expect(
        this.page.locator("[data-subtopic-head] h1, [data-subtopic-head] h2"),
      ).toBeVisible();
      await expect(
        this.page.locator("[data-subtopic-navigation]"),
      ).toContainText(lesson.title);
      await expect(
        this.page.locator(
          "[data-subtopic-navigation] ol a[aria-current='page']",
        ),
      ).toHaveAttribute("href", lesson.route);
      await expect(this.page.locator("[data-subtopic-head]")).toContainText(
        /Подтема 1 из/,
      );
    } else {
      await expect(this.page.getByRole("heading", { level: 1 })).toHaveText(
        lesson.title,
      );
      await expect(
        this.page.getByRole("navigation", { name: "Уроки курса", exact: true }),
      ).toBeVisible();
      await expect(
        this.page.locator("[data-course-lesson-pager]"),
      ).toBeVisible();
      await expect(
        this.page.getByRole("navigation", {
          name: "На этой странице",
          exact: true,
        }),
      ).toBeHidden();
      await this.page.setViewportSize({ width: 1440, height: 900 });
      await expect(
        this.page.getByRole("navigation", { name: "На этой странице" }),
      ).toBeVisible();
      await this.page.setViewportSize({ width: 390, height: 844 });
      await expect(
        this.page.locator("[data-course-lesson-head]"),
      ).not.toContainText(/^§\s*\d+/u);
      await expect(
        this.page.getByRole("navigation", {
          name: "В этом уроке",
          exact: true,
        }),
      ).toHaveCount(0);
    }
    await expect(this.page.locator("[data-learning-profile]")).toHaveCount(0);
    for (const heading of await this.page
      .locator("#theory section[id] > h3")
      .all()) {
      await expect(heading).toHaveCSS("border-bottom-width", "0px");
    }
    const verifyType = async (scale: number) => {
      const sizes = await this.page
        .locator("#theory pre code, #theory :is(code, var)[data-kind]")
        .evaluateAll((elements) =>
          elements.map((element) => ({
            actual: parseFloat(getComputedStyle(element).fontSize),
            expected: element.closest("pre")
              ? parseFloat(
                  getComputedStyle(document.documentElement).fontSize,
                ) * 0.9375
              : parseFloat(getComputedStyle(element.parentElement!).fontSize) *
                0.9,
          })),
        );
      // A topic subtopic exported from its stand may open without code (Change 184).
      if (!lesson.route.startsWith("/ege/"))
        expect(sizes.length).toBeGreaterThan(0);
      for (const size of sizes)
        expect(Math.abs(size.actual - size.expected)).toBeLessThan(0.05);
      for (const block of await this.page.locator("#theory pre code").all())
        await expect(block).toHaveCSS("font-size", `${15 * scale}px`);
      await expectNoHorizontalOverflow(this.page);
    };
    await verifyType(1);
    if (noJavaScript) {
      await this.page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });
      try {
        await verifyType(2);
      } finally {
        await this.page.evaluate(() => {
          document.documentElement.style.removeProperty("font-size");
        });
      }
    } else {
      const scaledRootFont = await this.page.addStyleTag({
        content: "html { font-size: 200%; }",
      });
      try {
        await verifyType(2);
      } finally {
        await scaledRootFont.evaluate((style) =>
          style.parentNode?.removeChild(style),
        );
      }
    }
    if (lesson.route.startsWith("/ege/")) {
      const [, , topicSlug] = lesson.route.split("/");
      await this.page.goto(`/ege/${topicSlug}/praktika`);
      if (!noJavaScript) {
        await expect(
          this.page.getByRole("link", { name: "Войти", exact: true }),
        ).toBeVisible({ timeout: 15_000 });
        await expect(
          this.page
            .locator('[data-practice-form][data-enhanced="true"]')
            .first(),
        ).toBeVisible();
      }
    }
    const checkpoint = this.page.getByRole("region", {
      name: "Проверьте себя",
    });
    // A lesson exported from its stand has self-checks only where the stand has
    // them (Change 184): a topic's «Практика и итог» or a course lesson may have none.
    if (!(await checkpoint.count())) return;
    const disclosure = noJavaScript
      ? checkpoint.locator("summary").first()
      : checkpoint.getByRole("button").first();
    await expect(disclosure).toBeVisible();
    if (noJavaScript) {
      await expect(checkpoint.locator("details[open]")).toHaveCount(0);
      await disclosure.click();
      await expect(checkpoint.locator("details[open]")).toHaveCount(1);
    } else {
      await disclosure.focus();
      await disclosure.press("Enter");
      await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    }
  }
  async expectPublicPages() {
    for (const path of [
      "/",
      "/ege",
      topicSubtopicRoute("16-rekursiya"),
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
      if (path === "/courses/python") {
        const summary = this.page.locator("[data-course-summary]");
        await expect(
          summary.getByText("уроков освоено", { exact: true }),
        ).toBeVisible();
        await expect(
          summary.getByText("практика", { exact: true }),
        ).toBeVisible();
        await expect(this.page.locator("[data-course-module]")).toHaveCount(8);
        await expect(
          this.page.locator("[data-course-lesson-plan-item]"),
        ).toHaveCount(30);
        await expect(this.page.locator("[data-course-program]")).toBeVisible();
      }
    }
    // The retired topic 25 route has no redirect (Change 171).
    for (const path of [
      "/lab/design-system",
      "/lab/lesson",
      "/ege/25-obrabotka-celyh-chisel",
    ]) {
      expect((await this.page.goto(path))?.status()).toBe(404);
      await expect(
        this.page.getByRole("link", { name: "На главную", exact: true }),
      ).toBeVisible();
      await expect(this.page.locator("[data-status-scene]")).toBeVisible();
      await expect(
        this.page.locator('[data-mascot-scene="not-found"]'),
      ).toBeVisible();
    }
  }

  async expectProductionRenderingSmoke() {
    for (const path of ["/", "/ege", "/courses", "/privacy"]) {
      const response = await this.page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(this.page.locator("[data-infraege-mark]")).toBeVisible();
      await expectNoHorizontalOverflow(this.page);
    }
  }
  async expectPublishedLesson(index: number) {
    const lesson = courseLessonPublications[index];
    const response = await this.page.goto(courseLessonRoute(lesson));
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

  async expectPracticeTaskDetail(): Promise<void> {
    const entry = visibleTasks.find(({ task }) =>
      task.sources.some(
        (source) => source.kind !== "unknown" && source.is_public,
      ),
    );
    if (!entry)
      throw new Error("The practice bank has no task with a public source");
    const task = entry.task;
    const response = await this.page.goto(`/practice/${task.id}`);
    expect(response?.status()).toBe(200);
    const heading = this.page.getByRole("heading", {
      level: 1,
      name: task.title,
    });
    await expect(heading).toBeVisible();
    await expect(this.page.getByText(/^ЕГЭ \d+ · /u)).toBeVisible();
    const taskCard = this.page.getByRole("region", { name: "Решение задачи" });
    await expect(taskCard).toHaveAttribute("data-presentation", "detail");
    await expect(
      taskCard.getByRole("textbox", { name: "Ваш ответ" }),
    ).toBeVisible();
    // The hint and solution toggles work once the page is interactive.
    await expect(
      taskCard.getByRole("textbox", { name: "Ваш ответ" }),
    ).toBeEnabled({ timeout: 15_000 });
    await expect(
      taskCard.getByRole("button", { name: "Проверить", exact: true }),
    ).toBeVisible();
    const hint = taskCard.getByRole("button", {
      name: "Подсказка",
      exact: true,
    });
    const solution = taskCard.getByRole("button", {
      name: /^(?:Решение|Идея решения)$/u,
    });
    await expect(hint).toHaveAttribute("aria-expanded", "false");
    await expect(solution).toHaveAttribute("aria-expanded", "false");
    await hint.click();
    await expect(
      taskCard.getByRole("heading", { name: "Подсказка", exact: true }),
    ).toBeVisible();
    await solution.click();
    await expect(
      taskCard.getByRole("heading", { name: /^(?:Решение|Идея решения)$/u }),
    ).toBeVisible();
    // Change 170 F47: the source is an item of the metadata line.
    await expect(this.page.locator("[data-practice-source]")).toBeVisible();
    await expectNoHorizontalOverflow(this.page);
  }
  async expectCatalog() {
    await this.page.goto("/practice");
    const list = this.page.getByRole("list", { name: "Задачи", exact: true });
    await expect(list.getByRole("listitem")).toHaveCount(30);
    // F46: rows carry no id link any more; the row's own id tells pages apart.
    const first = await list.getByRole("listitem").first().getAttribute("id");
    await this.page
      .getByRole("link", { name: "Следующая страница" })
      .press("Enter");
    await expect(this.page).toHaveURL(/page=2/);
    await expect(list.getByRole("listitem").first()).not.toHaveAttribute(
      "id",
      first!,
    );
    await this.page.goto("/practice?exam_number=16&difficulty=1");
    await expect(list.getByRole("listitem").first()).toContainText("№ 16");
    await this.page.goto("/practice?skill=nonexistent");
    await expect(
      this.page.getByRole("heading", { name: "Ничего не нашлось" }),
    ).toBeVisible();
    await this.page.goto("/practice?difficulty=9");
    await expect(
      this.page.getByRole("heading", { name: /фильтр/i }),
    ).toBeVisible();
  }
  async expectCombinedPracticeFilters(noJavaScript = false) {
    await this.page.goto("/practice?page=2");
    if (!noJavaScript) {
      await this.openTopicChooser();
      await this.page.keyboard.press("Escape");
    }
    const filters = this.page.getByRole("form", { name: "Фильтры задач" });
    await filters.getByLabel("Поиск задач", { exact: true }).fill("рекурс");
    await expect(this.page).toHaveURL(/page=2/);
    if (noJavaScript) {
      await filters
        .getByRole("listbox", { name: "Тема", exact: true })
        .selectOption(["ege-16", "ege-5"]);
      await filters.getByRole("button", { name: "Применить" }).click();
    } else {
      await this.openTopicChooser();
      await this.page
        .getByRole("option", { name: /^ЕГЭ 16 · Рекурсия/u })
        .click();
      await this.page
        .getByRole("option", { name: /^ЕГЭ 5 · Преобразование записей чисел/u })
        .click();
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
    await this.page
      .getByRole("link", {
        name: "Убрать тему: ЕГЭ 5 · Преобразование записей чисел",
      })
      .click();
    await expect(this.page).toHaveURL(
      (url) =>
        url.searchParams.getAll("topics").join() === "ege-16" &&
        url.searchParams.get("q") === "рекурс",
    );
    if (!noJavaScript)
      await expect(
        filters.getByRole("combobox", { name: "Тема", exact: true }),
      ).toContainText("ЕГЭ 16 · Рекурсия");
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
        .locator('select[name="limit"][form="practice-pagination-limit"]')
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
        .getByRole("listitem"),
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
    await this.openTopicChooser();
    await this.page
      .getByRole("combobox", { name: "Найти тему", exact: true })
      .fill("Циклы");
    // F48 (П8): topics without tasks stay out of the list; one muted line
    // says how many are coming.
    await expect(
      this.page.getByRole("option", { name: /Python · Циклы/ }),
    ).toHaveCount(0);
    await expect(
      this.page.getByText(/^Ещё \d+ тем.* — задачи скоро$/u),
    ).toBeVisible();
    const searchBox = this.page.getByRole("combobox", {
      name: "Найти тему",
      exact: true,
    });
    await searchBox.fill("Рекурс");
    const option = this.page.getByRole("option", { name: /^ЕГЭ 16 · / });
    await option.click();
    await this.page.keyboard.press("Escape");
    await expect(trigger).toContainText("Все темы");
    await this.page.goto("/practice?topics=python-loops");
    await expect(
      this.page.getByRole("heading", { name: "Ничего не нашлось" }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Найдено 0 заданий", { exact: true }),
    ).toBeVisible();
    // Change 170 F31: the «Как работает практика» popover is gone.
    await expect(
      this.page.getByRole("button", { name: "Как работает практика" }),
    ).toHaveCount(0);
    await this.page.getByRole("link", { name: /Убрать тему: Python/ }).click();
    await expect(
      this.page
        .getByRole("list", { name: "Задачи", exact: true })
        .getByRole("listitem"),
    ).toHaveCount(30);
  }

  private async openTopicChooser(): Promise<void> {
    const trigger = this.page.getByRole("combobox", {
      name: "Тема",
      exact: true,
    });
    // The SSR trigger can paint before its event handlers are attached.
    await expect(async () => {
      if ((await trigger.getAttribute("aria-expanded")) !== "true") {
        await trigger.click();
      }
      await expect(this.page.getByPlaceholder("Найти тему")).toBeVisible();
    }).toPass();
  }

  async expectPracticeToolbarStability() {
    for (const width of [1440, 390]) {
      await this.page.setViewportSize({ width, height: 900 });
      await this.page.goto("/practice?limit=10&page=10");
      await expect(
        this.page.getByRole("link", { name: "Войти", exact: true }),
      ).toBeVisible();
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
      await expect(
        row.locator('[data-standalone][data-enhanced="true"]'),
      ).toBeVisible();
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
        // Hover scales primary buttons; measure the layout without that pointer effect.
        await this.page.mouse.move(0, 0);
        const buttonBefore = (await checkButton.boundingBox())!;
        const buttonTopBefore = await checkButton.evaluate(
          (el) => el.getBoundingClientRect().top + scrollY,
        );
        await checkButton.click();
        await this.page.mouse.move(0, 0);
        const busyButton = row.getByRole("button", {
          name: "Проверяем",
          exact: true,
        });
        try {
          await expect(busyButton).toHaveAttribute("aria-busy", "true");
          // Keep the intrinsic label footprint while the accessible name reports progress.
          await expect(busyButton).toHaveText("Проверить");
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
          await expect(row.getByRole("status")).toContainText(
            "Не удалось проверить ответ",
          );
        if (state === "correct") await expect(input).toBeDisabled();
        const after = await hint.evaluate(
          (el) => el.getBoundingClientRect().top + scrollY,
        );
        // Desktop help shares the control row. On mobile it is below the field's
        // normal-flow error message and must move down rather than overlap that message.
        if (width === 1440) expect(Math.abs(after - before)).toBeLessThan(1);
        const buttonTopAfter = await checkButton.evaluate(
          (el) => el.getBoundingClientRect().top + scrollY,
        );
        if (width === 1440)
          expect(Math.abs(buttonTopAfter - buttonTopBefore)).toBeLessThan(1);
        else {
          const controls = await row.evaluate((element) => {
            const field = element.querySelector('input[name="answer"]')!;
            const button = element.querySelector('button[type="submit"]')!;
            const help = element.querySelector(
              'button[aria-controls^="hint-"]',
            )!;
            return {
              fieldBottom: field.getBoundingClientRect().bottom,
              buttonTop: button.getBoundingClientRect().top,
              buttonBottom: button.getBoundingClientRect().bottom,
              helpTop: help.getBoundingClientRect().top,
            };
          });
          expect(controls.buttonTop).toBeGreaterThanOrEqual(
            controls.fieldBottom,
          );
          expect(controls.helpTop).toBeGreaterThanOrEqual(
            controls.buttonBottom,
          );
        }
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
          if (width === 390) {
            const buttonBox = (await checkButton.boundingBox())!;
            const hintBox = (await hint.boundingBox())!;
            expect(buttonBox.y).toBeGreaterThanOrEqual(
              errorBox.y + errorBox.height,
            );
            expect(hintBox.y).toBeGreaterThanOrEqual(
              buttonBox.y + buttonBox.height,
            );
          }
        }
        await this.page.unroute("**/api/tasks/*/check");
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
      // The panel title follows the explanation kind («Идея решения», «Решение», «Разбор»).
      await expect(
        row.locator('[data-practice-help="solution"]'),
      ).toBeVisible();
      await expectNoHorizontalOverflow(this.page);
      await expect(
        row.getByRole("button", { name: "Решить ещё раз", exact: true }),
      ).toHaveCount(0);
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
    // F47: the topic row puts the task lower, so feedback may scroll the
    // page; the check must not move within the document.
    const documentTop = () =>
      check.evaluate((node) => node.getBoundingClientRect().top + scrollY);
    const before = await documentTop();
    await input.fill("wrong-answer");
    await check.click();
    await expect(first.getByText(/Ответ пока не подходит/)).toBeVisible();
    const after = await documentTop();
    expect(Math.abs(after - before)).toBeLessThan(1);
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
    await expect(first.getByRole("status")).toContainText("Верно.");
    await expect(first).not.toHaveAttribute("data-solved");
    await expect(this.page).toHaveURL(/\/practice$/);
    await expect(second.getByRole("textbox")).toHaveValue("draft-two");
    await expectNoHorizontalOverflow(this.page);
    await this.page.reload();
    await first
      .getByRole("button", { name: visibleTasks[0].task.title, exact: true })
      .click();
    await expect(first.getByRole("textbox")).toBeEnabled();
    await expect(first.getByRole("textbox")).toHaveValue("");
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
    await first.getByRole("heading").getByRole("link").click();
    await expect(
      this.page.getByRole("region", { name: "Решение задачи" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "К списку задач" }),
    ).toHaveAttribute("href", "/practice?exam_number=16");
    await expectNoHorizontalOverflow(this.page);
  }
  async expectGuestSolveHasTransientFeedback() {
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
    await expect(this.page.getByRole("main").getByRole("status")).toContainText(
      "Верно.",
    );
    await this.page.reload();
    await expect(input).toBeEnabled();
    await expect(input).toHaveValue("");
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
    await expect(this.page.getByRole("main").getByRole("status")).toContainText(
      "Не удалось проверить ответ",
    );
    await expect(input).toHaveValue("123");
    await this.page.unroute("**/api/tasks/*/check");
    await input.fill(visibleTasks[1].task.checker.answer_variants[0]);
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(this.page.getByRole("main").getByRole("status")).toContainText(
      "Верно.",
    );
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
        await this.openTopicChooser();
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
        await this.page.unroute("**/*.js");
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
      await this.page.goto(topicSubtopicRoute("16-rekursiya"), {
        waitUntil: "commit",
      });
      const outline = this.page.getByRole("navigation", {
        name: "Подтемы урока",
      });
      const trigger = outline.getByRole("button", { name: "Подтемы · 1 из 7" });
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
        outline.getByRole("link", {
          name: "Функция, заданная через себя",
          exact: true,
        }),
      ).toBeVisible();
    } finally {
      release();
      await this.page.unroute("**/*.js");
    }
  }
}
