import { expect, type Page } from "@playwright/test";

export class FoundationPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/");
    await expect(this.page).toHaveURL(/\/$/);
  }

  async expectNeutralPlaceholder(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: "Учебные материалы готовятся" }),
    ).toBeVisible();
    await expect(this.page.getByRole("link", { name: /lab/i })).toHaveCount(0);
  }

  async expectRemovedRouteNotFound(): Promise<void> {
    await this.page.goto("/removed-route");
    await expect(
      this.page.getByRole("heading", { name: "Страница не найдена" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "На стартовую страницу" }),
    ).toHaveAttribute("href", "/");
  }
}
