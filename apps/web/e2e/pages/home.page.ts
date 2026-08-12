import { expect, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto("/");
    await expect(
      this.page.getByRole("heading", {
        name: "Подготовка к ЕГЭ по информатике",
      }),
    ).toBeVisible();
  }

  async openGraphsAndTablesTopic(): Promise<void> {
    await this.page
      .getByRole("link", {
        name: /Как сопоставить граф и таблицу дорог — задание 1 ЕГЭ/,
      })
      .click();
  }

  async expectNotFound(): Promise<void> {
    await this.page.goto("/missing-client-foundation-page");
    await expect(
      this.page.getByRole("heading", { name: "Такой страницы нет" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "К списку тем" }),
    ).toBeVisible();
  }
}
