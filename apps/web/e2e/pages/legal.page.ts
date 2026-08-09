import { expect, type Page } from "@playwright/test";

export class LegalPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectPrivacy(): Promise<void> {
    await this.page.goto("/privacy");
    await expect(
      this.page.getByRole("heading", {
        name: "Политика обработки персональных данных",
      }),
    ).toBeVisible();
    await expect(this.page.getByRole("main")).toBeVisible();
  }

  async expectTerms(): Promise<void> {
    await this.page.goto("/terms");
    await expect(
      this.page.getByRole("heading", { name: "Пользовательское соглашение" }),
    ).toBeVisible();
    await expect(this.page.getByRole("main")).toBeVisible();
  }
}
