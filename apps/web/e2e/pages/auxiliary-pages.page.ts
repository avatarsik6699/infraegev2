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

  async expectErrorPreviewMotion(): Promise<void> {
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
    const pattern = scene.locator("svg").first();
    await expect(pattern).toHaveCSS("animation-play-state", "running");
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await expect(pattern).toHaveCSS("animation-name", "none");
    for (const width of [1440, 768, 390, 320]) {
      await this.page.setViewportSize({ width, height: 900 });
      expect(
        await this.page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await this.page.emulateMedia({ reducedMotion: "no-preference" });
    await this.page.evaluate(() => scrollTo(0, 0));
    await expect(scene).toHaveAttribute("data-motion-active", "false");
    await expect(pattern).toHaveCSS("animation-play-state", "paused");
  }

  async expectLoaderRecovery(failFirst = true): Promise<void> {
    let release = () => {};
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    let requests = 0;
    await this.page.route("**/_serverFn/**", async (route) => {
      requests += 1;
      if (requests === 1) {
        await blocked;
        if (failFirst)
          await route.fulfill({
            status: 503,
            contentType: "text/plain",
            body: "Temporarily unavailable",
          });
        else await route.continue();
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
      const progress = this.page.getByRole("progressbar", {
        name: "Загрузка страницы",
      });
      await expect(progress).toBeVisible();
      await this.page.emulateMedia({ reducedMotion: "reduce" });
      await expect(progress.locator("span")).toHaveCSS(
        "animation-name",
        "none",
      );
      // Keep the request blocked beyond the former pending threshold.
      const started = Date.now();
      await expect.poll(() => Date.now() - started).toBeGreaterThan(600);
      await expect(
        this.page.getByRole("region", { name: "Прогресс курса" }),
      ).toBeVisible();
      await expect(this.page.locator('[data-kind="pending"]')).toHaveCount(0);
    } finally {
      release();
    }
    if (failFirst) {
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
    }
    await expect(this.page.getByRole("heading", { level: 1 })).toHaveText(
      "Первая программа: ввод, вычисление и вывод",
    );
    await expect(this.page).not.toHaveTitle(/Не удалось/);
    await expect(
      this.page.getByRole("progressbar", { name: "Загрузка страницы" }),
    ).toHaveCount(0);
    expect(requests).toBe(failFirst ? 2 : 1);
  }
}
