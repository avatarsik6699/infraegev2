import { expect, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./layout.assertions";

export class CourseCatalogPage {
  constructor(private readonly page: Page) {}

  async expectCatalog(noScripts = false) {
    await this.page.goto("/courses");
    await expect(this.page.locator("[data-course-card]")).toHaveCount(4);
    const published = this.page.locator('[data-course-card="python"]');
    await expect(
      published.locator('[data-object-illustration="course-python-scene"]'),
    ).toHaveCount(1);
    await expect(published.locator("p").first()).toBeVisible();
    // Change 185 F8: core lessons first, additional ones named apart
    await expect(published).toContainText("27 уроков + 3 дополнительных");
    // Change 177: the Excel course is the second published card
    const excel = this.page.locator('[data-course-card="excel"]');
    await expect(excel).toHaveAttribute("data-course-status", "published");
    await expect(excel).toContainText("14 уроков + 1 дополнительный");
    await expect(
      excel.getByRole("link", { name: "Открыть курс" }),
    ).toHaveAttribute("href", "/courses/excel");
    await expect(
      published.getByRole("link", { name: "Открыть курс" }),
    ).toBeVisible();
    if (noScripts) {
      await expect(published.locator("[data-course-progress]")).toBeHidden();
    } else {
      await expect(published.locator("[data-course-progress]")).toBeVisible();
    }
    // Change 185: a planned course offers no link or button, only a quiet «Скоро».
    await expect(
      this.page.locator('[data-course-status="planned"] :is(a, button)'),
    ).toHaveCount(0);
    await expect(this.page.locator("[data-course-summary]")).toContainText(
      "Всего направлений: 4 · Доступно: 2 · Уроков: 41",
    );
    await expect(this.page.getByRole("searchbox")).toHaveCount(0);
    const planned = this.page.locator('[data-course-status="planned"]');
    // Change 185: planned courses keep their scenes in colour on a neutral card
    await expect(planned.locator("[data-object-illustration]")).toHaveCount(2);
    for (const card of await planned.all()) {
      await expect(card).toHaveAttribute("aria-disabled", "true");
      await expect(card).toContainText("Скоро");
      await expect(card).toHaveCSS("box-shadow", "none");
    }
    if (!noScripts) {
      await this.expectGuestProgress(published);
    }
    await this.expectCardGrid();
    await expectNoHorizontalOverflow(this.page);
    await published.getByRole("link", { name: "Открыть курс" }).click();
    await expect(this.page).toHaveURL(/\/courses\/python$/);
  }

  async expectStableDelivery(width: number, failedAssets: boolean) {
    const errors: string[] = [];
    this.page.on("pageerror", (error) => errors.push(error.message));
    await this.page.setViewportSize({ width, height: 900 });
    let releaseScripts!: () => void;
    let releaseAssets!: () => void;
    const scripts = new Promise<void>((resolve) => {
      releaseScripts = resolve;
    });
    const assets = new Promise<void>((resolve) => {
      releaseAssets = resolve;
    });
    await this.page.route("**/*", async (route) => {
      const request = route.request();
      if (request.resourceType() === "script") await scripts;
      if (
        request.resourceType() === "font" ||
        request.url().includes("/images/courses/")
      ) {
        await assets;
        if (failedAssets) return route.abort();
      }
      return route.fallback();
    });
    try {
      await this.page.goto("/courses", { waitUntil: "commit" });
      await expect(this.page.locator("[data-course-card]")).toHaveCount(4);
      await expect(
        this.page.getByRole("heading", { name: "Мини-курсы", exact: true }),
      ).toBeVisible();
      // DOM visibility can precede stylesheet loading; scripts and fonts stay held here.
      await expect
        .poll(() =>
          this.page
            .locator('link[rel="stylesheet"]')
            .evaluateAll((links) =>
              links.every((link) => (link as HTMLLinkElement).sheet !== null),
            ),
        )
        .toBe(true);
      await expect(this.page.locator("[data-course-list]")).toHaveCSS(
        "display",
        "grid",
      );
      const before = await this.geometry();
      await expect(
        this.page.locator("[data-course-summary]").getByRole("status"),
      ).toHaveText("Проверяем вход");
      await expect(
        this.page.locator("[data-course-progress]").getByRole("status"),
      ).toHaveText(["Прогресс загружается", "Прогресс загружается"]);
      releaseScripts();
      // The dev server sends every held module at once on release: hydration may
      // take longer than the default assertion window on a loaded runner.
      await this.expectGuestProgress(
        this.page.locator('[data-course-card="python"]'),
        15_000,
      );
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
      await this.expectCardGrid();
      await expectNoHorizontalOverflow(this.page);
      expect(errors).toEqual([]);
    } finally {
      releaseScripts();
      releaseAssets();
    }
  }

  async expectKeyboardAndMotion() {
    await this.page.goto("/courses");
    await expect(
      this.page.getByRole("link", { name: "Войти", exact: true }),
    ).toBeVisible();
    await this.page.evaluate(() => document.fonts.ready);
    await this.page.emulateMedia({ reducedMotion: "no-preference" });
    const card = this.page.locator('[data-course-card="python"]');
    const link = card.getByRole("link", { name: "Открыть курс" });
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toHaveAttribute("data-hierarchy", "text");
    await expect(link).toHaveCSS("color", "rgb(31, 79, 208)");
    await this.expectGuestProgress(card);
    // Change 185: the whole card is the link; it lifts, the picture stays put.
    const illustration = card.locator("[data-object-illustration]");
    expect((await illustration.boundingBox())!.width).toBeGreaterThanOrEqual(
      208,
    );
    await card.hover();
    await expect(card).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -2)");
    await expect(illustration).toHaveCSS("transform", "none");
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await expect(card).toHaveCSS("transform", "none");
    await this.page.setViewportSize({ width: 650, height: 900 });
    await this.page.addStyleTag({ content: "html { font-size: 200%; }" });
    await this.expectCardGrid();
    await expectNoHorizontalOverflow(this.page);
    await this.page.setViewportSize({ width: 390, height: 900 });
    await this.expectCardGrid();
    await expectNoHorizontalOverflow(this.page);
    await this.expectGuestProgress(card);
    await link.press("Enter");
    await expect(this.page).toHaveURL(/\/courses\/python$/);
  }

  /** Change 185: a grid of equal cards — cards never overlap, each keeps its
   * picture slot, and cards sharing a row have the same height. */
  private async expectCardGrid() {
    const cards = await this.page
      .locator("[data-course-card]")
      .evaluateAll((nodes) =>
        nodes.map((card) => {
          const box = card.getBoundingClientRect();
          const illustration = card.querySelector<HTMLElement>(
            "[data-object-illustration], [data-illustration-placeholder]",
          );
          if (!illustration)
            throw new Error("Course card has no illustration slot");
          const slot = illustration.getBoundingClientRect();
          return {
            x: box.x,
            y: box.y,
            right: box.right,
            bottom: box.bottom,
            height: box.height,
            slot: slot.width * slot.height,
          };
        }),
      );
    for (const card of cards) expect(card.slot).toBeGreaterThan(0);
    for (let left = 0; left < cards.length; left++) {
      for (let right = left + 1; right < cards.length; right++) {
        const a = cards[left]!;
        const b = cards[right]!;
        const overlapX = Math.min(a.right, b.right) - Math.max(a.x, b.x);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y);
        expect(overlapX < 1 || overlapY < 1).toBe(true);
        if (Math.abs(a.y - b.y) < 1)
          expect(Math.abs(a.height - b.height)).toBeLessThan(1);
      }
    }
  }

  private async expectGuestProgress(
    scope = this.page.locator("body"),
    timeout?: number,
  ) {
    const progress = scope.locator("[data-course-progress]");
    await expect(progress.locator('[role="status"]')).toHaveText(
      "Освоено 0 из 27 уроков",
      { timeout },
    );
    await expect(progress.locator('[role="progressbar"]')).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    await expect(
      scope.locator("[data-guest-progress-lock]").getByRole("link"),
    ).toHaveAccessibleName(
      "Прогресс: 0 из 27. Войти, чтобы сохранять прогресс",
    );
  }

  private async geometry() {
    return this.page
      .locator("[data-course-card], [data-course-summary]")
      .evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return [box.x, box.y, box.width, box.height];
        }),
      );
  }
}
