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
    await expect(this.page.locator("[data-topic-card]")).toHaveCount(1);
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
    await expect(
      this.page.locator('[data-topic-status="published"] h2 a'),
    ).toHaveCount(2);
    await expect(
      this.page.locator('[data-topic-status="planned"] a'),
    ).toHaveCount(0);
    await expect(this.page.getByRole("searchbox")).toBeHidden();
    await expect(
      this.page.getByRole("button", { name: "В процессе" }),
    ).toBeHidden();
    await expectNoHorizontalOverflow(this.page);
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
