import { expect, type Page } from "@playwright/test";
import {
  expectKeyboardLessonDisclosures,
  openLessonAtTop,
} from "./lesson-page.assertions";
import { expectNoHorizontalOverflow } from "./layout.assertions";
import { expectPublicReleaseIdentity } from "./public-header.assertions";
import {
  expectNoJavaScriptPractice,
  expectPracticeAnswerJourney,
  expectPublishedLessonDocument,
} from "./lesson-page.assertions";

const publishedPythonCourseLessons = [
  ["pervaya-programma", "Первая программа: ввод, вычисление и вывод"],
  ["chisla-i-vyrazheniya", "Числа, типы и арифметические выражения"],
  ["oshibki", "Ошибки: читаем сообщение и находим причину"],
  ["usloviya", "Условия: сравнения и выбор из двух вариантов"],
  ["sostavnye-usloviya", "Несколько ветвей и составные условия"],
  ["for-i-range", "for и range: повторяем известное число раз"],
  ["while", "while: повторяем, пока условие верно"],
  ["schetchiki-i-nakopiteli", "Счётчики, накопители и границы цикла"],
  ["tsifry-chisla", "Цифры числа: деление нацело и остаток"],
  ["stroki", "Строки: символы, индексы и срезы"],
  ["spiski", "Списки: храним и изменяем последовательность"],
  ["mnozhestva", "Множества: оставляем уникальные значения"],
  ["slovari", "Словари: связываем ключи и значения"],
  ["sortirovka-i-poisk", "Сортировка и поиск в коллекции"],
  ["vklyucheniya", "Включения: собираем коллекции коротко"],
  ["funktsii", "Функции: параметры и возвращаемый результат"],
  ["chasti-programmy", "Разбиваем программу на понятные части"],
  ["iteratory-i-generatory", "Итераторы и генераторы: значения по одному"],
  ["rekursiya", "Рекурсия: базовый случай, шаг и трассировка"],
  ["obrabotka-isklyucheniy", "Ожидаемые ошибки: try и except"],
  ["fayly", "Читаем данные из файла"],
  ["tablitsy", "Обрабатываем строки и таблицы"],
  ["polnyy-perebor", "Полный перебор: строим и проверяем варианты"],
  ["otbor-rezultata", "Отбор результата: ограничения, минимум и максимум"],
  ["spisok-del", "Добавляем дела и выводим список"],
  ["deystviya-so-spiskom", "Отмечаем выполненное, редактируем и удаляем"],
  ["sohranenie-spiska-del", "Сохраняем дела между запусками"],
  ["gotovaya-programma", "Проверяем весь сценарий и наводим порядок в коде"],
] as const;

export class PythonCoursePage {
  constructor(private readonly page: Page) {}

  async openOverview(): Promise<void> {
    await this.page.goto("/courses/python");
    await expect(this.page).toHaveURL(/\/courses\/python$/);
  }

  async dismissAnalyticsPrompt(): Promise<void> {
    await expect(
      this.page.getByLabel("Настройки необязательной аналитики"),
    ).toHaveAttribute("data-analytics-consent-enhanced", "true");
    const reject = this.page.getByRole("button", { name: "Не сейчас" });
    await expect(reject).toBeVisible();
    await reject.click();
    await expect(
      this.page.getByRole("complementary", {
        name: "Настройки необязательной аналитики",
      }),
    ).toBeHidden();
    await expect(
      this.page.getByRole("button", { name: "Настройки" }),
    ).toHaveCount(0);
    await this.page.evaluate(() => {
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    });
  }

  async expectCompleteOverview(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
    await expect(
      this.page.getByRole("heading", {
        level: 1,
        name: "Python с нуля для ЕГЭ",
      }),
    ).toBeVisible();
    await expect(this.page.getByText("Полный курс")).toBeVisible();
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index,follow",
    );
    await expect(
      this.page.getByRole("heading", { level: 2, name: "Чему вы научитесь" }),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        "От первой программы — к задачам и алгоритмам, которые пригодятся на ЕГЭ.",
      ),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { level: 2, name: "Программа" }),
    ).toHaveCount(0);
    const curriculum = this.page.getByRole("region", {
      name: "Содержание курса",
    });
    await expect(curriculum).toBeVisible();
    await expect(this.page.getByRole("heading", { level: 3 })).toHaveCount(9);
    await expect(curriculum.locator("[data-course-module]")).toHaveCount(9);
    await expect(
      curriculum.locator('[data-availability="planned"]'),
    ).toHaveCount(0);
    await expect(
      curriculum.locator("[data-course-lesson-plan-item]"),
    ).toHaveCount(28);
    await expect(
      curriculum.locator('[data-lesson-status="published"]'),
    ).toHaveCount(28);
    await expect(
      curriculum.locator('[data-lesson-status="planned"]'),
    ).toHaveCount(0);
    await expect(curriculum.getByText("В плане", { exact: true })).toHaveCount(
      0,
    );
    await expect(
      this.page.getByText(
        "Курс развивается. Порядок и формулировки будущих уроков могут уточняться.",
      ),
    ).toHaveCount(0);
    await expect(curriculum.getByText("Доступен", { exact: true })).toHaveCount(
      0,
    );
    const publishedPlanItem = curriculum
      .locator('[data-lesson-status="published"]')
      .first();
    const publishedLink = publishedPlanItem.getByRole("link", {
      name: /Первая программа/,
    });
    await expect(publishedLink).not.toContainText("Доступен");
    await expect(publishedLink).toHaveCSS("text-decoration-line", "none");
    await expect(
      publishedPlanItem.locator("[data-course-lesson-title]"),
    ).toHaveCSS("text-decoration-line", "underline");
    await expect(
      publishedPlanItem.locator("[data-course-lesson-outcome]"),
    ).toHaveCSS("text-decoration-line", "none");
    await expect(
      publishedPlanItem.locator("[data-course-lesson-title]"),
    ).toHaveCSS("font-size", "16px");
    await expect(
      publishedPlanItem.locator("[data-course-lesson-title]"),
    ).toHaveCSS("font-weight", "600");
    await expect(
      publishedPlanItem.locator("[data-course-lesson-outcome]"),
    ).toHaveCSS("font-size", "14px");
    await expect(
      publishedPlanItem.locator("[data-course-lesson-outcome]"),
    ).toHaveCSS("font-weight", "500");
    const publishedFamilies = await publishedPlanItem.evaluate((planItem) => {
      const title = planItem.querySelector<HTMLElement>(
        "[data-course-lesson-title]",
      );
      const outcome = planItem.querySelector<HTMLElement>(
        "[data-course-lesson-outcome]",
      );
      if (!title || !outcome) {
        throw new Error("Missing published lesson hierarchy");
      }
      return [title, outcome].map(
        (element) => getComputedStyle(element).fontFamily,
      );
    });
    expect(new Set(publishedFamilies)).toHaveProperty("size", 1);
    const planNumberIsOutsideLink = await publishedLink.evaluate((link) => {
      const planItem = link.closest("[data-course-lesson-plan-item]");
      return Boolean(
        planItem &&
        link.parentElement === planItem &&
        getComputedStyle(planItem, "::before").content ===
          "counter(lesson-plan)",
      );
    });
    expect(planNumberIsOutsideLink).toBe(true);
    await expect(
      curriculum.locator("[data-course-module]").first(),
    ).toContainText("01");
    await expect(
      curriculum.locator("[data-course-module]").last(),
    ).toContainText("09");
    await expect(curriculum.locator("[data-course-module]").first()).toHaveCSS(
      "border-top-width",
      "0px",
    );
    await expect(curriculum.locator("[data-course-module]").nth(1)).toHaveCSS(
      "border-top-width",
      "1px",
    );
    await expect(curriculum.locator("[data-course-module]").last()).toHaveCSS(
      "border-bottom-width",
      "0px",
    );
    await expect(
      this.page.getByRole("link", { name: /Первая программа/ }),
    ).toHaveAttribute("href", "/courses/python/pervaya-programma");
    await expect(
      this.page.getByRole("link", {
        name: /Ошибки: читаем сообщение и находим причину/,
      }),
    ).toHaveAttribute("href", "/courses/python/oshibki");
    await expect(
      this.page.getByRole("link", {
        name: /Условия: сравнения и выбор из двух вариантов/,
      }),
    ).toHaveAttribute("href", "/courses/python/usloviya");
    await expect(
      curriculum.getByText("Написать программу с if/else."),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Начать курс" }),
    ).toHaveCount(0);
    const progress = this.page.getByRole("region", {
      name: "Прогресс курса",
    });
    await expect(progress).toContainText("Освоено 0 из 28 доступных уроков.");
    await expect(
      progress.getByRole("progressbar", {
        name: "Освоенные доступные уроки",
      }),
    ).toHaveAttribute("aria-valuetext", "Освоено 0 из 28 доступных уроков.");
    const progressComesBeforeCurriculum = await progress.evaluate((section) => {
      const curriculum = section.nextElementSibling;
      return Boolean(
        curriculum &&
        section.compareDocumentPosition(curriculum) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
    expect(progressComesBeforeCurriculum).toBe(true);
    await expectNoHorizontalOverflow(this.page);
  }

  async openFirstLesson(): Promise<void> {
    await openLessonAtTop(this.page, "/courses/python/pervaya-programma");
  }

  async openConditionsLesson(): Promise<void> {
    await this.page.goto("/courses/python/usloviya");
    await expect(this.page).toHaveURL(/\/courses\/python\/usloviya$/);
  }

  async openErrorsLesson(): Promise<void> {
    await this.page.goto("/courses/python/oshibki");
    await expect(this.page).toHaveURL(/\/courses\/python\/oshibki$/);
  }

  async expectPublishedCurriculumLesson(
    lessonIndex: number,
    options?: { keyboard?: boolean },
  ): Promise<void> {
    const lesson = publishedPythonCourseLessons[lessonIndex];
    expect(lesson).toBeDefined();
    if (!lesson) return;
    const [routeSlug, title] = lesson;
    await this.page.goto(`/courses/python/${routeSlug}`);
    await expectPublishedLessonDocument(this.page, {
      canonicalPath: `/courses/python/${routeSlug}`,
      title,
    });
    await expect(this.page.locator("[data-practice-form] form")).toHaveCount(5);
    await expectNoHorizontalOverflow(this.page);
    if (options?.keyboard) await this.expectKeyboardDisclosures();
  }

  async openFinalProjectLesson(
    routeSlug: string,
    title: string,
  ): Promise<void> {
    await this.page.goto(`/courses/python/${routeSlug}`);
    await expectPublishedLessonDocument(this.page, {
      canonicalPath: `/courses/python/${routeSlug}`,
      title,
    });
    await expectNoHorizontalOverflow(this.page);
  }

  async expectPublishedErrorsLesson(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
    await expectPublishedLessonDocument(this.page, {
      canonicalPath: "/courses/python/oshibki",
      title: "Ошибки: читаем сообщение и находим причину",
    });
    await expect(
      this.page.getByText(
        "Разберём, как читать сообщение Python снизу вверх, находить строку остановки и отличать несколько частых причин ошибки.",
      ),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", {
        level: 3,
        name: "Как читать traceback снизу вверх",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", {
        level: 3,
        name: "Чем TypeError отличается от ValueError",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", {
        level: 3,
        name: "Как исправлять без догадки",
      }),
    ).toBeVisible();
    await expect(
      this.page.locator('[data-practice-statement] code[data-kind="code"]', {
        hasText: "if score >= 10",
      }),
    ).toHaveCount(1);
    await expect(
      this.page.locator('[data-practice-statement] code[data-kind="code"]', {
        hasText: "SyntaxError",
      }),
    ).toHaveCount(1);
    await expect(
      this.page.getByRole("heading", { name: "Что теперь понятно" }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("heading", { name: "Что вы уже умеете" }),
    ).toHaveCount(0);
    await expectNoHorizontalOverflow(this.page);
  }

  async expectErrorsPractice(): Promise<void> {
    await expectPracticeAnswerJourney(this.page, "ошибка", " nameerror ");
  }

  async expectSimplifiedErrorsResult(): Promise<void> {
    const result = this.page.locator("#result");
    await result.scrollIntoViewIfNeeded();
    await expect(
      result.getByText(
        "Теперь вы можете разобрать базовое сообщение Python на место, тип и пояснение причины.",
        { exact: false },
      ),
    ).toBeVisible();
    await expect(
      result.getByRole("heading", { name: "Что теперь понятно" }),
    ).toHaveCount(0);
    await expect(
      result.getByRole("heading", { name: "Что вы уже умеете" }),
    ).toHaveCount(0);
  }

  async expectPublishedConditionsLesson(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
    await expect(this.page.locator("[data-course-lesson-context]")).toHaveCSS(
      "border-bottom-width",
      "1px",
    );
    await expectPublishedLessonDocument(this.page, {
      canonicalPath: "/courses/python/usloviya",
      title: "Условия: сравнения и выбор из двух вариантов",
    });
    await expect(
      this.page.getByRole("heading", {
        level: 3,
        name: "Что получается при сравнении",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", {
        level: 3,
        name: "Как проверить обе ветви",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        "Разберём, как сравнения помогают программе выбрать одну из двух ветвей и почему граничные значения нужно проверять отдельно.",
      ),
    ).toBeVisible();
    await expectNoHorizontalOverflow(this.page);
  }

  async expectConditionsPractice(): Promise<void> {
    await expectPracticeAnswerJourney(this.page, "False", " true ");
  }

  async expectLongCodeDisclosure(): Promise<void> {
    const block = this.page.locator("[data-code-block-long]").first();
    const content = block.locator("[data-code-scroll]");
    const toggle = block.getByRole("button", { name: "Показать весь код" });
    await expect(content).toHaveAttribute("data-collapsed", "true");
    await toggle.click();
    await expect(content).not.toHaveAttribute("data-collapsed", "true");
    await expect(
      block.getByRole("button", { name: "Свернуть код" }),
    ).toHaveAttribute("aria-expanded", "true");
  }

  async expectLongCodeReadableWithoutJavaScript(): Promise<void> {
    await expect(this.page.locator("[data-code-block-long]")).not.toHaveCount(
      0,
    );
    await expect(
      this.page.locator("[data-code-scroll][data-collapsed]"),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("button", { name: "Показать весь код" }),
    ).toHaveCount(0);
  }

  async expectPublishedLesson(): Promise<void> {
    await expectPublishedLessonDocument(this.page, {
      canonicalPath: "/courses/python/pervaya-programma",
      title: "Первая программа: ввод, вычисление и вывод",
    });
    await expect(
      this.page.getByText(
        "Разберём, как Python выполняет команды, где хранит значения, как получает ввод и выводит результат.",
      ),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", {
        level: 3,
        name: "Как Python выполняет команды",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Лучше запускать Python на компьютере"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Programiz Online Compiler" }),
    ).toHaveAttribute("href", /programiz\.com/);
    await expect(
      this.page.getByRole("link", { name: "К курсу" }),
    ).toHaveAttribute("href", "/courses/python");
    await expect(
      this.page.getByRole("heading", { name: "Что теперь понятно" }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("heading", { name: "Что вы уже умеете" }),
    ).toHaveCount(0);
    await expect(
      this.page.getByText(
        "Следующий доступный шаг курса — урок про условия: с их помощью программа выбирает разные действия.",
      ),
    ).toBeVisible();
    await expect(this.page.getByText("Пока урок готовится")).toHaveCount(0);
    await expect(
      this.page.getByRole("heading", {
        level: 2,
        name: "§ 2 · Проверьте себя",
      }),
    ).toHaveCount(0);
    const practiceHeading = this.page.getByRole("heading", {
      level: 2,
      name: "Практика",
    });
    const resultHeading = this.page.getByRole("heading", {
      level: 2,
      name: "Итог",
    });
    await expect(practiceHeading).toContainText("§ 2 ·");
    await expect(resultHeading).toContainText("§ 3 ·");
    await expect(this.page.getByLabel("Проверьте себя")).not.toHaveCount(0);
    await expectNoHorizontalOverflow(this.page);
  }

  async expectPracticeAndReset(): Promise<void> {
    await expect(
      this.page.locator("[data-practice-form][data-enhanced]"),
    ).toBeVisible();
    const firstTask = this.page.locator("[data-practice-task]").first();
    await firstTask.getByRole("textbox", { name: "Ответ" }).fill("7");
    await firstTask.getByRole("button", { name: "Проверить" }).click();
    await expect(
      firstTask.getByText(
        "Ответ пока не подходит. Попробуйте ещё раз или откройте подсказку.",
      ),
    ).toBeVisible();
    await firstTask.getByRole("textbox", { name: "Ответ" }).fill("8");
    await firstTask.getByRole("button", { name: "Проверить" }).click();
    await expect(firstTask.getByRole("status")).toContainText("Верно");

    await this.page.reload();
    const restoredFirstTask = this.page.locator("[data-practice-task]").first();
    await expect(
      restoredFirstTask.getByRole("textbox", { name: "Ответ" }),
    ).toHaveValue("8");
    await expect(
      restoredFirstTask.getByRole("textbox", { name: "Ответ" }),
    ).toBeDisabled();

    const progress = this.page.locator("[data-course-result-progress]");
    await expect(progress.getByText("1 / 5", { exact: true })).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Python с нуля для ЕГЭ" }),
    ).toHaveAttribute("href", "/courses/python");
    const reset = progress.getByRole("button", {
      name: "Сбросить прогресс урока",
    });
    await reset.focus();
    await reset.press("Enter");
    await expect(
      progress.getByText("Удалить все принятые ответы в этом уроке?"),
    ).toBeVisible();
    const cancel = progress.getByRole("button", { name: "Отмена" });
    const confirm = progress.getByRole("button", {
      name: "Удалить ответы",
      exact: true,
    });
    await expect(confirm).toBeFocused();
    await cancel.focus();
    await cancel.press("Enter");
    await expect(reset).toBeFocused();
    await reset.press("Enter");
    await expect(confirm).toBeFocused();
    await confirm.press("Enter");
    await expect(reset).toBeFocused();
    await expect(progress.getByText("0 / 5", { exact: true })).toBeVisible();
  }

  async expectKeyboardDisclosures(): Promise<void> {
    await expectKeyboardLessonDisclosures(this.page);
  }

  async expectMobileReadingOrder(): Promise<void> {
    const introComesBeforeOutline = await this.page
      .locator("main")
      .evaluate((main) => {
        const intro = main.querySelector("header");
        const outline = main.querySelector("aside");
        if (!intro || !outline)
          throw new Error("Missing course lesson composition");
        return Boolean(
          intro.compareDocumentPosition(outline) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        );
      });
    expect(introComesBeforeOutline).toBe(true);
    await expectNoHorizontalOverflow(this.page);
  }

  async expectReadableWithoutJavaScript(): Promise<void> {
    await this.openFirstLesson();
    await this.expectPublishedLesson();
    await expectNoJavaScriptPractice(this.page);
  }

  async expectOverviewReadableWithoutJavaScript(): Promise<void> {
    await this.openOverview();
    await this.expectCompleteOverview();
    await expect(
      this.page.getByLabel("Настройки необязательной аналитики"),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("button", { name: "Настройки" }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("link", { name: "Начать курс" }),
    ).toHaveCount(0);
  }

  async expectConditionsReadableWithoutJavaScript(): Promise<void> {
    await this.openConditionsLesson();
    await this.expectPublishedConditionsLesson();
    await expectNoJavaScriptPractice(this.page);
  }

  async expectErrorsReadableWithoutJavaScript(): Promise<void> {
    await this.openErrorsLesson();
    await this.expectPublishedErrorsLesson();
    await expectNoJavaScriptPractice(this.page);
  }

  async expectPublishedLessonsInPublicSitemap(): Promise<void> {
    const response = await this.page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const sitemap = this.page.locator("body");
    for (const [routeSlug] of publishedPythonCourseLessons) {
      await expect(sitemap).toContainText(
        `https://infraege.ru/courses/python/${routeSlug}`,
      );
    }
  }
}
