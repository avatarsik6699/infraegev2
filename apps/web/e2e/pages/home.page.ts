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

  async openPlaceholderTopic(): Promise<void> {
    // The only checked-in fixture intentionally remains `draft`, so it is not linked from the
    // published-topic list. The smoke journey starts at home, then navigates to its real route.
    await this.page.goto("/theory/zadanie-1-placeholder-topic");
    // TanStack Start streams usable SSR markup before all client modules have hydrated. Wait for
    // those module requests to settle before interacting with controlled React inputs.
    await this.page.waitForLoadState("networkidle");
  }
}
