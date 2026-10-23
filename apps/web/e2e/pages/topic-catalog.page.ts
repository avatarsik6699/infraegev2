import { expect, type Page } from "@playwright/test";
import { lessonPublications } from "../../src/shared/config/lesson-publication.mjs";
import { expectNoHorizontalOverflow } from "./layout.assertions";

const summary = {
  topics: [
    {
      id: "rekursiya",
      tasks: [
        { id: "r1", solution_revision: 1 },
        { id: "r2", solution_revision: 2 },
      ],
    },
    {
      id: "preobrazovanie-zapisey-chisel",
      tasks: [{ id: "n1", solution_revision: 1 }],
    },
    {
      id: "number-sequences",
      tasks: [
        { id: "task-17-01", solution_revision: 1 },
        { id: "task-17-02", solution_revision: 1 },
        { id: "task-17-03", solution_revision: 1 },
        { id: "task-17-04", solution_revision: 1 },
        { id: "task-17-05", solution_revision: 1 },
        { id: "task-17-06", solution_revision: 1 },
        { id: "task-17-07", solution_revision: 1 },
        { id: "task-17-08", solution_revision: 1 },
      ],
    },
    {
      id: "divisors-and-masks",
      tasks: Array.from({ length: 8 }, (_, index) => ({
        id: "task-25-1-" + String(index + 1).padStart(2, "0"),
        solution_revision: 1,
        counts_toward_mastery: true,
      })),
    },
    {
      id: "array-processing",
      tasks: Array.from({ length: 7 }, (_, index) => ({
        id: "task-26-" + String(index + 1).padStart(2, "0"),
        solution_revision: 1,
      })),
    },
    {
      id: "data-analysis",
      tasks: Array.from({ length: 7 }, (_, index) => ({
        id: "task-27-" + String(index + 1).padStart(2, "0"),
        solution_revision: 1,
      })),
    },
    {
      id: "graph-analysis",
      tasks: [{ id: "task-23-1-02", solution_revision: 1 }],
    },
    {
      id: "string-processing",
      tasks: Array.from({ length: 8 }, (_, index) => ({
        id: `task-24-${String(index + 1).padStart(2, "0")}`,
        solution_revision: 1,
      })),
    },
  ],
};
// Every other published topic: one unsolved task, so its card shows progress.
for (const { id } of lessonPublications) {
  if (!summary.topics.some((topic) => topic.id === id))
    summary.topics.push({
      id,
      tasks: [{ id: `${id}-1`, solution_revision: 1 }],
    });
}
const published = lessonPublications.length;

export class TopicCatalogPage {
  constructor(private readonly page: Page) {}

  async expectSearchAndProgress() {
    await this.page.route("**/api/topics/practice-summary", (route) =>
      route.fulfill({ json: summary }),
    );
    await this.page.route("**/api/progress", (route) =>
      route.fulfill({
        json: {
          results: [
            {
              context_kind: "topic_lesson",
              context_id: "rekursiya",
              task_id: "r1",
              solution_revision: 1,
            },
          ],
        },
      }),
    );
    await this.page.goto("/ege");
    await expect(this.page.getByText("Решено 1 из 2")).toBeVisible();
    await expect(this.page.getByText("Решено задач в темах: 1")).toBeVisible();
    await expect(this.page.locator("[data-topic-card]")).toHaveCount(25);
    // Change 170 F25: «Все темы» lists topics in exam order 1–27.
    const firstNumbers = await this.page
      .locator("[data-topic-card]")
      .evaluateAll((cards) =>
        cards.map((card) =>
          Number.parseInt(
            card.querySelector("[data-topic-numeral]")?.textContent ?? "",
            10,
          ),
        ),
      );
    expect(firstNumbers).toEqual([...firstNumbers].sort((a, b) => a - b));
    await expect(
      this.page.getByRole("link", {
        name: "Обработка числовой последовательности",
        exact: true,
      }),
    ).toHaveAttribute(
      "href",
      "/ege/17-chislovye-posledovatelnosti/chisla-i-proverki",
    );
    await expect(
      this.page.getByRole("link", {
        name: "Обработка символьной информации",
        exact: true,
      }),
    ).toHaveAttribute(
      "href",
      "/ege/24-obrabotka-simvolnyh-strok/stroka-i-cepochka",
    );
    await expect(
      this.page.getByRole("link", {
        name: "Обработка целочисленной информации",
        exact: true,
      }),
    ).toHaveAttribute("href", "/ege/25-deliteli-i-maski/perebor-i-proverki");
    await expect(
      this.page.getByRole("link", {
        name: "Обработка данных с сортировкой",
        exact: true,
      }),
    ).toHaveAttribute("href", "/ege/26-sortirovka-i-otbor/zapisi-i-rejting");
    await expect(
      this.page.getByRole("link", {
        name: "Анализ данных",
        exact: true,
      }),
    ).toHaveAttribute(
      "href",
      "/ege/27-analiz-dannyh-i-klasterizatsiya/tochki-i-rasstoyaniya",
    );
    await this.page
      .getByRole("link", {
        name: "Обработка числовой последовательности",
        exact: true,
      })
      .click();
    await expect(this.page).toHaveURL(
      "/ege/17-chislovye-posledovatelnosti/chisla-i-proverki",
    );
    await expect(this.page.locator("[data-subtopic-head]")).toContainText(
      "Файл и условие",
    );
    await this.page.goto("/ege");
    await expect(
      this.page
        .locator('[data-topic-id="number-sequences"]')
        .getByText("Решено 0 из 8"),
    ).toBeVisible();
    await this.expectIllustrations();
    await expect(
      this.page.locator('[data-topic-status="planned"] a'),
    ).toHaveCount(0);
    await this.chooseProgress("В процессе");
    await expect(this.page.locator("[data-topic-card]")).toHaveCount(1);
    const inProgress = this.page.locator(
      '[data-topic-card][data-topic-id="rekursiya"]',
    );
    await expect(inProgress.getByRole("link")).toHaveCount(1);
    await expect(inProgress.getByRole("link")).toHaveAttribute(
      "href",
      "/ege/16-rekursiya/funktsiya-cherez-sebya",
    );
    await expect(inProgress).toContainText("Решено 1 из 2");
    // F40: the topic search is gone; the progress dropdown is the filter.
    await expect(this.page.getByRole("searchbox")).toHaveCount(0);
    await this.chooseProgress("Все темы");
    await expect(this.page.locator("[data-topic-card]")).toHaveCount(25);
    await this.chooseProgress("Не начаты");
    // every published topic but the one in progress
    await expect(this.page.locator("[data-topic-card]")).toHaveCount(
      published - 1,
    );
    await expect(
      this.page.getByRole("link", {
        name: "Формальное исполнение алгоритма",
        exact: true,
      }),
    ).toBeVisible();
  }

  async expectStableDelivery(width: number, failAssets: boolean) {
    const errors: string[] = [];
    this.page.on("pageerror", (error) => errors.push(error.message));
    await this.page.setViewportSize({ width, height: 907 });
    await this.page.addInitScript(() => {
      const shifts: number[] = [];
      Object.assign(window, { topicLayoutShifts: shifts });
      new PerformanceObserver((list) => {
        for (const item of list.getEntries()) {
          const shift = item as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput) {
            shifts.push(shift.value);
            console.info("topic layout shift", JSON.stringify(item.toJSON()));
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    let releaseScripts!: () => void;
    let releaseAssets!: () => void;
    let releaseSummary!: () => void;
    const scripts = new Promise<void>((resolve) => {
      releaseScripts = resolve;
    });
    const assets = new Promise<void>((resolve) => {
      releaseAssets = resolve;
    });
    const data = new Promise<void>((resolve) => {
      releaseSummary = resolve;
    });
    await this.page.route("**/*", async (route) => {
      const request = route.request();
      if (request.resourceType() === "script") await scripts;
      if (
        request.resourceType() === "font" ||
        request.url().includes("/images/topics/")
      ) {
        await assets;
        if (failAssets) return route.abort();
      }
      if (request.url().includes("/api/topics/practice-summary")) {
        await data;
        return route.fulfill({ json: summary });
      }
      return route.fallback();
    });
    try {
      await this.page.goto("/ege", { waitUntil: "commit" });
      await expect(
        this.page.getByRole("heading", { name: "Темы ЕГЭ", exact: true }),
      ).toBeVisible();
      await expect(this.page.locator("[data-topic-card]")).toHaveCount(25);
      await expect(this.page.locator("[data-topic-card]").first()).toHaveCSS(
        "display",
        "grid",
      );
      const before = await this.geometry();
      releaseScripts();
      await this.page.waitForRequest("**/api/topics/practice-summary");
      expect(await this.geometry()).toEqual(before);
      releaseSummary();
      await expect(this.page.getByText("Решено 0 из 2")).toBeVisible();
      expect(await this.geometry()).toEqual(before);
      releaseAssets();
      await this.page.waitForLoadState("load");
      await this.page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      expect(await this.geometry()).toEqual(before);
      if (!failAssets) await this.expectIllustrations();
      await expectNoHorizontalOverflow(this.page);
      const shifts = await this.page.evaluate(
        () =>
          (window as unknown as { topicLayoutShifts: number[] })
            .topicLayoutShifts,
      );
      expect(shifts.reduce((sum, value) => sum + value, 0)).toBeLessThanOrEqual(
        0.1,
      );
      expect(errors).toEqual([]);
    } finally {
      releaseScripts();
      releaseSummary();
      releaseAssets();
    }
  }

  async expectErrorRecovery() {
    let failed = true;
    await this.page.route("**/api/topics/practice-summary", (route) =>
      route.fulfill(
        failed
          ? { status: 503, json: { detail: "unavailable" } }
          : { json: summary },
      ),
    );
    await this.page.goto("/ege");
    await expect(
      this.page.locator("[data-topic-summary]").getByRole("status"),
    ).toHaveText("Прогресс временно недоступен");
    const before = await this.geometry();
    await this.page.getByRole("combobox", { name: /Прогресс/ }).click();
    await expect(
      this.page.getByRole("option", { name: "Не начаты" }),
    ).toHaveAttribute("aria-disabled", "true");
    await this.page.keyboard.press("Escape");
    failed = false;
    await this.page.getByRole("button", { name: "Повторить" }).click();
    await expect(this.page.getByText("Решено 0 из 2")).toBeVisible();
    expect(await this.geometry()).toEqual(before);
    await expect(
      this.page.getByRole("link", {
        name: "Рекуррентные выражения",
        exact: true,
      }),
    ).toBeVisible();
  }

  async expectReadableWithoutScripts() {
    await this.page.goto("/ege");
    await expect(this.page.locator("[data-topic-card]")).toHaveCount(25);
    await this.expectIllustrations();
    await expect(
      this.page.locator('[data-topic-status="published"] h2 a'),
    ).toHaveCount(published);
    await expect(
      this.page.locator('[data-topic-status="planned"] a'),
    ).toHaveCount(0);
    await expect(this.page.locator("[data-catalog-toolbar]")).toBeHidden();
    await expectNoHorizontalOverflow(this.page);
  }

  private async expectIllustrations() {
    // Change 170: every row, published or planned, has its topic illustration.
    const rows = this.page.locator("[data-topic-card]");
    await expect(rows.locator("img[data-object-illustration]")).toHaveCount(
      await rows.count(),
    );
    await expect(rows.locator("[data-illustration-placeholder]")).toHaveCount(
      0,
    );
  }

  async expectTextZoom() {
    await this.page.route("**/api/topics/practice-summary", (route) =>
      route.fulfill({ json: summary }),
    );
    await this.page.setViewportSize({ width: 650, height: 907 });
    await this.page.goto("/ege");
    await this.page.addStyleTag({ content: "html { font-size: 200%; }" });
    await expect(this.page.getByText("Решено 0 из 2")).toBeVisible();
    await expectNoHorizontalOverflow(this.page);
    await this.chooseProgress("Не начаты");
    await expect(
      this.page.getByRole("link", {
        name: "Рекуррентные выражения",
        exact: true,
      }),
    ).toBeVisible();
  }

  async expectRefinedRows() {
    await this.page.setViewportSize({ width: 1305, height: 907 });
    await this.page.emulateMedia({ reducedMotion: "no-preference" });
    await this.page.route("**/api/topics/practice-summary", (route) =>
      route.fulfill({ json: summary }),
    );
    await this.page.goto("/ege");
    const row = this.page.locator(
      '[data-topic-id="preobrazovanie-zapisey-chisel"]',
    );
    await expect(row.getByRole("progressbar")).toBeVisible();
    await row.scrollIntoViewIfNeeded();
    // Change 190: every topic 1–27 is published, no planned row is left
    await expect(
      this.page.locator('[data-topic-status="planned"]'),
    ).toHaveCount(0);
    const progressSlot = await row
      .locator("[data-topic-progress]")
      .boundingBox();
    const content = await row
      .locator("[data-topic-progress]")
      .locator("..")
      .boundingBox();
    const progress = await row.getByRole("progressbar").boundingBox();
    expect(
      Math.abs(
        progressSlot!.y +
          progressSlot!.height / 2 -
          (content!.y + content!.height / 2),
      ),
    ).toBeLessThanOrEqual(1);
    expect(progress?.height).toBe(6);
    const before = await row.boundingBox();
    await row.getByRole("link").hover();
    const arrow = row.locator('[aria-hidden="true"] svg').last();
    await expect
      .poll(() => arrow.evaluate((el) => getComputedStyle(el).transform))
      .toBe("matrix(1, 0, 0, 1, 4, 0)");
    const track = await row
      .getByRole("progressbar")
      .evaluate(
        (el) => getComputedStyle(el.firstElementChild!).backgroundColor,
      );
    expect(track).not.toBe(
      await row.evaluate((el) => getComputedStyle(el).backgroundColor),
    );
    expect(await row.boundingBox()).toEqual(before);
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => arrow.evaluate((el) => getComputedStyle(el).transform))
      .toBe("none");
    await this.page.mouse.move(0, 0);
    await row.getByRole("link").focus();
    await expect(row.getByRole("link")).toBeFocused();
    expect(await row.boundingBox()).toEqual(before);
    await this.expectGoalAndMap();
  }

  /** F40: «Прогресс: Все темы ▾» — a Base UI select. */
  private async chooseProgress(label: string) {
    await this.page.getByRole("combobox", { name: /Прогресс/ }).click();
    await this.page.getByRole("option", { name: label, exact: true }).click();
    await expect(
      this.page.getByRole("combobox", { name: /Прогресс/ }),
    ).toContainText(label);
  }

  /** Change 185 (F33–F37): the goal dims rows and map cells, never hides them;
   * a map cell leads to its row. */
  private async expectGoalAndMap() {
    const rows = this.page.locator("[data-topic-card]");
    const strings = this.page.locator('[data-topic-id="string-processing"]');
    await expect(strings).toHaveAttribute("data-in-goal", "true");
    await this.page.getByRole("radio", { name: /База/ }).check();
    await expect(rows).toHaveCount(25);
    await expect(strings).toHaveAttribute("data-in-goal", "false");
    await expect(this.page.getByRole("radio", { name: /База/ })).toBeChecked();
    // F44: the step's own tooltip on hover
    await this.page.locator("[data-topic-goal] label").first().hover();
    // the popup renders in a portal after the hidden description
    await expect(
      this.page.getByText(/^Без программирования/).last(),
    ).toBeVisible();
    await this.page.mouse.move(0, 0);
    await expect(
      this.page.locator('[data-exam-map] a[data-in-goal="false"]'),
    ).toHaveCount(14);
    await this.page.reload();
    await expect(this.page.getByRole("radio", { name: /База/ })).toBeChecked();
    await this.page.getByRole("radio", { name: /Хард/ }).check();
    await this.page
      .locator("[data-exam-map]")
      .getByRole("link", { name: /^Задание 23\./ })
      .click();
    await expect(this.page).toHaveURL(/\/ege#topic-graph-analysis$/);
    await expect(
      this.page.locator('[data-topic-id="graph-analysis"]'),
    ).toBeInViewport();
  }

  private async geometry() {
    return this.page
      .locator(
        "[data-topic-card], [data-topic-summary], [data-catalog-toolbar]",
      )
      .evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return [box.x, box.y, box.width, box.height];
        }),
      );
  }
}
