import { expect, type Page } from "@playwright/test";
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
      id: "integer-processing",
      tasks: Array.from({ length: 8 }, (_, index) => ({
        id: "task-25-" + String(index + 1).padStart(2, "0"),
        solution_revision: 1,
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
      id: "string-processing",
      tasks: Array.from({ length: 8 }, (_, index) => ({
        id: `task-24-${String(index + 1).padStart(2, "0")}`,
        solution_revision: 1,
      })),
    },
  ],
};

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
    await expect(
      this.page.getByRole("link", {
        name: "Числовые последовательности",
        exact: true,
      }),
    ).toHaveAttribute("href", "/ege/17-chislovye-posledovatelnosti");
    await expect(
      this.page.getByRole("link", {
        name: "Обработка символьных строк",
        exact: true,
      }),
    ).toHaveAttribute("href", "/ege/24-obrabotka-simvolnyh-strok");
    await expect(
      this.page.getByRole("link", {
        name: "Обработка целых чисел",
        exact: true,
      }),
    ).toHaveAttribute("href", "/ege/25-obrabotka-celyh-chisel");
    await expect(
      this.page.getByRole("link", {
        name: "Обработка данных: сортировка и отбор",
        exact: true,
      }),
    ).toHaveAttribute("href", "/ege/26-sortirovka-i-otbor");
    await expect(
      this.page.getByRole("link", {
        name: "Анализ данных: кластеризация",
        exact: true,
      }),
    ).toHaveAttribute("href", "/ege/27-analiz-dannyh-i-klasterizatsiya");
    await expect(
      this.page
        .locator('[data-topic-id="number-sequences"]')
        .getByText("Решено 0 из 8"),
    ).toBeVisible();
    await this.expectIllustrations();
    await expect(
      this.page.locator('[data-topic-status="planned"] a'),
    ).toHaveCount(0);
    await this.page.getByRole("button", { name: "В процессе" }).click();
    await expect(this.page.locator("[data-topic-card]")).toHaveCount(1);
    await expect(
      this.page.getByText("Продолжить", { exact: true }),
    ).toBeVisible();
    await this.page
      .getByRole("button", { name: "Все темы", exact: true })
      .click();
    await this.page.getByRole("searchbox").fill("20");
    await expect(
      this.page.getByRole("heading", { name: "Выигрышная стратегия" }),
    ).toBeVisible();
    await this.page.getByRole("button", { name: "Очистить поиск" }).click();
    await expect(this.page.getByRole("searchbox")).toBeFocused();
    await this.page.getByRole("searchbox").fill("неизвестная тема");
    await expect(this.page.getByText("Темы не найдены")).toBeVisible();
    await this.page.getByRole("button", { name: "Сбросить фильтры" }).click();
    await expect(this.page.getByRole("searchbox")).toHaveValue("");
    await expect(this.page.locator("[data-topic-card]")).toHaveCount(25);
    await this.page.getByRole("button", { name: "Не начаты" }).click();
    await expect(this.page.locator("[data-topic-card]")).toHaveCount(6);
    await expect(
      this.page.getByRole("link", {
        name: "Преобразование записей чисел",
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
      expect(shifts.reduce((sum, value) => sum + value, 0)).toBe(0);
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
      this.page.getByText("Прогресс временно недоступен"),
    ).toBeVisible();
    const before = await this.geometry();
    await expect(
      this.page.getByRole("button", { name: "Не начаты" }),
    ).toBeDisabled();
    failed = false;
    await this.page.getByRole("button", { name: "Повторить" }).click();
    await expect(this.page.getByText("Решено 0 из 2")).toBeVisible();
    expect(await this.geometry()).toEqual(before);
    await this.page.getByRole("searchbox").fill("16");
    await expect(
      this.page.getByRole("link", {
        name: "Рекурсивные алгоритмы",
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
    ).toHaveCount(7);
    await expect(
      this.page.locator('[data-topic-status="planned"] a'),
    ).toHaveCount(0);
    await expect(this.page.getByRole("searchbox")).toBeHidden();
    await expect(
      this.page.getByRole("button", { name: "В процессе" }),
    ).toBeHidden();
    await expectNoHorizontalOverflow(this.page);
  }

  private async expectIllustrations() {
    for (const [topicId, asset] of [
      ["information-models", "information-models"],
      ["preobrazovanie-zapisey-chisel", "number-record"],
      ["branching-and-enumeration", "branching-and-enumeration"],
      ["rekursiya", "recursion"],
      ["number-sequences", "number-sequences"],
      ["winning-strategy", "winning-strategy"],
      ["parallel-computing", "parallel-computing"],
      ["graph-analysis", "graph-analysis"],
      ["string-processing", "string-processing"],
      ["integer-processing", "integer-processing"],
      ["array-processing", "array-processing"],
      ["data-analysis", "data-analysis"],
    ]) {
      const row = this.page.locator(`[data-topic-id="${topicId}"]`);
      const illustration = row.locator(
        `img[src="/images/topics/${asset}.webp"]`,
      );
      await expect(illustration).toBeVisible();
      await expect(illustration).toHaveAttribute("width", "192");
      await expect(illustration).toHaveAttribute("height", "104");
      await expect
        .poll(() =>
          illustration.evaluate(
            (image: HTMLImageElement) =>
              image.complete &&
              image.naturalWidth === 576 &&
              image.naturalHeight === 312,
          ),
        )
        .toBe(true);
      const imageBox = await illustration.boundingBox();
      const slotBox = await illustration.locator("../..").boundingBox();
      const titleBox = await row.locator("h2").boundingBox();
      expect(imageBox!.x).toBeGreaterThanOrEqual(slotBox!.x);
      expect(imageBox!.y).toBeGreaterThanOrEqual(slotBox!.y);
      expect(imageBox!.x + imageBox!.width).toBeLessThanOrEqual(
        slotBox!.x + slotBox!.width,
      );
      expect(imageBox!.y + imageBox!.height).toBeLessThanOrEqual(
        slotBox!.y + slotBox!.height,
      );
      expect(
        imageBox!.x + imageBox!.width <= titleBox!.x ||
          imageBox!.y + imageBox!.height <= titleBox!.y,
      ).toBe(true);
    }
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
    await this.page.getByRole("searchbox").fill("16");
    await expect(
      this.page.getByRole("link", {
        name: "Рекурсивные алгоритмы",
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
    const plannedTitle = this.page
      .locator('[data-topic-status="planned"] h2')
      .first();
    const title = row.locator("h2");
    expect(
      await plannedTitle.evaluate((el) => getComputedStyle(el).color),
    ).not.toBe(await title.evaluate((el) => getComputedStyle(el).color));
    expect(
      await plannedTitle.evaluate((el) => getComputedStyle(el).opacity),
    ).toBe("1");
    const metadata = await row
      .locator("[data-topic-progress] > span")
      .boundingBox();
    const heading = await title.boundingBox();
    const content = await row.locator("h2").locator("..").boundingBox();
    const progress = await row.getByRole("progressbar").boundingBox();
    expect(metadata?.y).toBe(heading?.y);
    expect(progress?.height).toBe(8);
    expect(progress!.y + progress!.height).toBe(content!.y + content!.height);
    const before = await row.boundingBox();
    await row.getByRole("link").hover();
    const arrow = row.locator("svg.lucide-arrow-right");
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
