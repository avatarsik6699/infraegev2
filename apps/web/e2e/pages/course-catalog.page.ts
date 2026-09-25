import { expect, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./layout.assertions";

export class CourseCatalogPage {
  constructor(private readonly page: Page) {}

  async expectCatalog(noScripts = false) {
    await this.page.goto("/courses");
    await expect(this.page.locator("[data-course-card]")).toHaveCount(4);
    await expect(
      this.page.locator(
        '[data-course-status="planned"] a, [data-course-status="planned"] button',
      ),
    ).toHaveCount(0);
    await expect(this.page.locator("[data-course-summary]")).toContainText(
      "Всего направлений: 4 · Доступно: 1 · Уроков: 28",
    );
    await expect(this.page.getByRole("searchbox")).toHaveCount(0);
    const planned = this.page.locator('[data-course-status="planned"]');
    await expect(planned.locator("[data-badge]")).toHaveText([
      "Скоро",
      "Скоро",
      "Скоро",
    ]);
    for (const card of await planned.all()) {
      await expect(card).toHaveAttribute("aria-disabled", "true");
      await expect(card.locator("[data-badge]")).toHaveCSS(
        "background-color",
        "rgb(245, 245, 245)",
      );
      await expect(card).toHaveCSS("background-color", "rgb(255, 255, 255)");
    }
    if (noScripts) {
      await expect(this.page.locator("[data-course-progress]")).toBeHidden();
    } else {
      await this.expectGuestProgress();
    }
    await this.expectUniformCards();
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
      return route.continue();
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
      await this.expectUniformCards();
      await expectNoHorizontalOverflow(this.page);
      expect(errors).toEqual([]);
    } finally {
      releaseScripts();
      releaseAssets();
    }
  }

  async expectKeyboardAndMotion() {
    await this.page.goto("/courses");
    await this.page.emulateMedia({ reducedMotion: "no-preference" });
    const link = this.page.getByRole("link", { name: "Открыть курс" });
    await link.focus();
    await expect(link).toBeFocused();
    const card = this.page.locator('[data-course-card="python"]');
    await expect(card).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -2)");
    const before = await card.boundingBox();
    await expect(link).toHaveAttribute("data-hierarchy", "primary");
    await expect(link).toHaveCSS("background-color", "rgb(23, 23, 23)");
    await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
    await this.expectGuestProgress(card);
    await expect(card).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await link.hover();
    await expect(card).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(link).toHaveCSS("background-color", "rgb(23, 23, 23)");
    await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(link).toHaveCSS("transform", "matrix(1.02, 0, 0, 1.02, 0, 0)");
    await expect(link.locator("span").last()).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
    expect(
      await link.evaluate((el) => getComputedStyle(el).backgroundColor),
    ).not.toBe(
      await card.evaluate((el) => getComputedStyle(el).backgroundColor),
    );
    const image = card.locator("img");
    expect((await image.boundingBox())!.width).toBeGreaterThanOrEqual(208);
    const arrow = link.locator("svg");
    await expect(arrow).toHaveCSS("transform", "matrix(1, 0, 0, 1, 4, 0)");
    expect(await card.boundingBox()).toEqual(before);
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await expect(arrow).toHaveCSS("transform", "none");
    await expect(card).toHaveCSS("transform", "none");
    await expect(link).toHaveCSS("transform", "none");
    await this.page.setViewportSize({ width: 650, height: 900 });
    await this.page.addStyleTag({ content: "html { font-size: 200%; }" });
    await this.expectUniformCards();
    await expectNoHorizontalOverflow(this.page);
    await this.page.setViewportSize({ width: 390, height: 900 });
    await this.expectUniformCards();
    await expectNoHorizontalOverflow(this.page);
    await this.expectGuestProgress(card);
    await link.press("Enter");
    await expect(this.page).toHaveURL(/\/courses\/python$/);
  }

  private async expectUniformCards() {
    const sizes = await this.page
      .locator("[data-course-card]")
      .evaluateAll((cards) =>
        cards.map((card) => {
          const box = card.getBoundingClientRect();
          return { width: box.width, height: box.height };
        }),
      );
    for (const size of sizes) {
      expect(Math.abs(size.width - sizes[0]!.width)).toBeLessThan(1);
      expect(Math.abs(size.height - sizes[0]!.height)).toBeLessThan(1);
    }
  }

  private async expectGuestProgress(scope = this.page.locator("body")) {
    const progress = scope.locator("[data-course-progress]");
    await expect(progress.locator('[role="status"]')).toHaveText(
      "Освоено 0 из 28 уроков",
    );
    await expect(progress.locator('[role="progressbar"]')).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    await expect(
      scope.locator("[data-guest-progress-lock]").getByRole("link"),
    ).toHaveAccessibleName(
      "Прогресс: 0 из 28. Войти, чтобы сохранять прогресс",
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
