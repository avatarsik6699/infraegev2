import { expect, type Page } from "@playwright/test";

export class AuxiliaryPagesPage {
  constructor(private readonly page: Page) {}

  async expectMissingPageRecovery(): Promise<void> {
    const response = await this.page.goto("/missing-auxiliary-page");
    expect(response?.status()).toBe(404);
    await expect(this.page.getByRole("heading", { level: 1 })).toHaveText(
      "Такой страницы нет",
    );
    await expect(this.page.locator("head title")).toHaveCount(1);
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,nofollow",
    );
    await expect(this.page.getByRole("contentinfo")).toBeVisible();
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await this.page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await this.page.evaluate(() => {
      document.documentElement.style.fontSize = "";
    });
    expect(
      await this.page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await this.page
      .getByRole("link", { name: "На главную", exact: true })
      .click();
    await expect(this.page.getByRole("heading", { level: 1 })).toContainText(
      "Информатика",
    );
    await expect(this.page).not.toHaveTitle(/Страница не найдена/);
    await expect(this.page.locator("head title")).toHaveCount(1);
    await expect(
      this.page.locator('meta[name="robots"][content="noindex,nofollow"]'),
    ).toHaveCount(0);
  }

  async expectLoadingPreviewMotion(): Promise<void> {
    await this.page.goto("/lab/design-system#system-auxiliary-states");
    const scene = this.page.locator("[data-status-scene]");
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute("data-motion-active", "true");
    for (const code of ["404", "502", "503", "504"]) {
      await this.page.getByRole("button", { name: code, exact: true }).click();
      await expect(scene).toHaveAttribute("data-scene", code);
      await expect(scene.locator("[data-card]")).toHaveCount(0);
      await expect(scene.locator("[data-code]")).toHaveAttribute(
        "data-code",
        code,
      );
    }
    await this.page
      .getByRole("button", { name: "Загружаем страницу…", exact: true })
      .click();
    await expect(scene).toHaveAttribute("data-kind", "pending");
    await expect(scene.getByRole("status")).toHaveCount(1);
    await expect(scene.getByText("Подготавливаем материалы")).toBeVisible();
    await this.page.setViewportSize({ width: 1440, height: 900 });
    const outline = scene.locator('[class*="skeletonOutline"]');
    const groups = outline.locator(":scope > div");
    const firstGroup = await groups.first().boundingBox();
    const lastGroup = await groups.last().boundingBox();
    const outlineBounds = await outline.boundingBox();
    expect(
      firstGroup &&
        outlineBounds &&
        Math.abs(firstGroup.y - outlineBounds.y) < 2,
    ).toBeTruthy();
    expect(
      firstGroup &&
        lastGroup &&
        lastGroup.y + lastGroup.height - firstGroup.y < 360,
    ).toBeTruthy();
    const dot = scene.locator("i").first();
    await expect(dot).toHaveCSS("animation-play-state", "running");
    expect(
      await dot.evaluate((element) => getComputedStyle(element).animationName),
    ).not.toBe("none");
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await expect(dot).toHaveCSS("animation-name", "none");
    for (const width of [1440, 768, 390, 320]) {
      await this.page.setViewportSize({ width, height: 900 });
      await scene.scrollIntoViewIfNeeded();
      expect(
        await this.page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const code = scene.locator("b").last();
      const row = await code.boundingBox();
      const bounds = await scene.boundingBox();
      expect(
        row && bounds && row.y + row.height <= bounds.y + bounds.height,
      ).toBeTruthy();
    }
    await this.page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await scene.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return (
          bounds.left >= 0 &&
          bounds.right <= innerWidth &&
          element.scrollWidth <= element.clientWidth
        );
      }),
    ).toBe(true);
    await this.page.evaluate(() => {
      document.documentElement.style.fontSize = "";
    });
    await this.page.emulateMedia({ reducedMotion: "no-preference" });
    await this.page.evaluate(() => scrollTo(0, 0));
    await expect(scene).toHaveAttribute("data-motion-active", "false");
    await expect(dot).toHaveCSS("animation-play-state", "paused");
  }

  async expectLoaderRecovery(): Promise<void> {
    let release = () => {};
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    let requests = 0;
    await this.page.route("**/_serverFn/**", async (route) => {
      requests += 1;
      if (requests === 1) {
        await blocked;
        await route.abort("connectionfailed");
      } else await route.continue();
    });
    await this.page.goto("/courses/python");
    await expect(
      this.page.getByRole("region", { name: "Прогресс курса" }),
    ).toBeVisible();
    await this.page
      .getByRole("link", {
        name: "Первая программа: ввод, вычисление и вывод",
        exact: true,
      })
      .click();
    try {
      await expect(this.page.getByRole("status")).toContainText(
        "Загружаем страницу",
      );
    } finally {
      release();
    }
    await expect(
      this.page.getByRole("heading", {
        name: "Не удалось загрузить страницу",
        exact: true,
      }),
    ).toBeVisible();
    await expect(this.page).toHaveTitle(
      "Не удалось загрузить страницу — infraege",
    );
    await this.page
      .getByRole("button", { name: "Повторить", exact: true })
      .click();
    await expect(this.page.getByRole("heading", { level: 1 })).toHaveText(
      "Первая программа: ввод, вычисление и вывод",
    );
    await expect(this.page).not.toHaveTitle(/Не удалось/);
    expect(requests).toBe(2);
  }
}
