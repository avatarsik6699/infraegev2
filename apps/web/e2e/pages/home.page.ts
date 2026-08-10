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
    // TanStack Start streams usable SSR markup before all client modules have hydrated. Wait for
    // those module requests to settle before interacting with controlled React inputs.
    await this.page.waitForLoadState("networkidle");
  }
}
