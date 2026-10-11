import { expect, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./layout.assertions";

export class CourseCatalogPage {
  constructor(private readonly page: Page) {}

  async expectCatalog(noScripts = false) {
    await this.page.goto("/courses");
    await expect(this.page.locator("[data-course-card]")).toHaveCount(4);
    const published = this.page.locator('[data-course-card="python"]');
    await expect(
      published.locator('[data-object-illustration="course-python-wide"]'),
    ).toHaveCount(1);
    await expect(published.locator("p").first()).toBeVisible();
    await expect(published).toContainText("30 уроков");
    await expect(
      published.getByRole("link", { name: "Открыть курс" }),
    ).toBeVisible();
    if (noScripts) {
      await expect(published.locator("[data-course-progress]")).toBeHidden();
    } else {
      await expect(published.locator("[data-course-progress]")).toBeVisible();
    }
    // Change 170 F34: a planned course offers no link, only a disabled «Скоро».
    await expect(
      this.page.locator('[data-course-status="planned"] a'),
    ).toHaveCount(0);
    const soon = this.page.locator('[data-course-status="planned"] button');
    await expect(soon).toHaveCount(3);
    for (const button of await soon.all()) {
      await expect(button).toHaveText("Скоро");
      await expect(button).toBeDisabled();
    }
    await expect(this.page.locator("[data-course-summary]")).toContainText(
      "Всего направлений: 4 · Доступно: 1 · Уроков: 27",
    );
    await expect(this.page.getByRole("searchbox")).toHaveCount(0);
    const planned = this.page.locator('[data-course-status="planned"]');
    await expect(
      planned.locator("[data-illustration-placeholder]"),
    ).toHaveCount(3);
    for (const card of await planned.all()) {
      await expect(card).toHaveAttribute("aria-disabled", "true");
      await expect(card).toHaveCSS("background-color", "rgb(255, 255, 255)");
    }
    if (!noScripts) {
      await this.expectGuestProgress();
    }
    await this.expectCardGrid();
    await expectNoHorizontalOverflow(this.page);
    await this.page.getByRole("link", { name: "Открыть курс" }).click();
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
      ).toHaveText("Прогресс загружается");
      releaseScripts();
      await this.expectGuestProgress();
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
    const link = this.page.getByRole("link", { name: "Открыть курс" });
    await link.focus();
    await expect(link).toBeFocused();
    const card = this.page.locator('[data-course-card="python"]');
    await expect(card).toHaveCSS("transform", "none");
    await expect(link).toHaveAttribute("data-hierarchy", "primary");
    await expect(link).toHaveCSS("background-color", "rgb(23, 25, 30)");
    await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
    await this.expectGuestProgress(card);
    // Measure after progress settles; hydration stability has its own delivery check.
    const cardDocumentGeometry = async () => {
      return card.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return {
          x: box.x + window.scrollX,
          y: box.y + window.scrollY,
          width: box.width,
          height: box.height,
        };
      });
    };
    const before = await cardDocumentGeometry();
    // Change 170 F49: the published card has a monochrome gradient border.
    await expect(card).toHaveCSS("background-image", /conic-gradient/);
    await link.hover();
    await expect(card).toHaveCSS("background-image", /conic-gradient/);
    await expect(link).toHaveCSS("background-color", "rgb(42, 45, 52)");
    await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(link).toHaveCSS("transform", "none");
    await expect(link.locator("span").last()).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
    expect(
      await link.evaluate((el) => getComputedStyle(el).backgroundColor),
    ).not.toBe(
      await card.evaluate((el) => getComputedStyle(el).backgroundColor),
    );
    const illustration = card.locator("[data-object-illustration]");
    expect((await illustration.boundingBox())!.width).toBeGreaterThanOrEqual(
      208,
    );
    const arrow = link.locator("svg");
    await expect(arrow).toHaveCSS("transform", "matrix(1, 0, 0, 1, 4, 0)");
    expect(await cardDocumentGeometry()).toEqual(before);
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await expect(arrow).toHaveCSS("transform", "none");
    await expect(card).toHaveCSS("transform", "none");
    await expect(link).toHaveCSS("transform", "none");
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

  /** Change 170 F49: an asymmetric grid — cards never overlap, each keeps
   * its picture slot, and cards sharing a row of the same layout match. */
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
            layout: card.getAttribute("data-layout"),
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
        if (a.layout === b.layout && Math.abs(a.y - b.y) < 1)
          expect(Math.abs(a.height - b.height)).toBeLessThan(1);
      }
    }
  }

  private async expectGuestProgress(scope = this.page.locator("body")) {
    const progress = scope.locator("[data-course-progress]");
    await expect(progress.locator('[role="status"]')).toHaveText(
      "Освоено 0 из 27 уроков",
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
