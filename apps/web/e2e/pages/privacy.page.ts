import { expect, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./layout.assertions";
import { expectPublicReleaseIdentity } from "./public-header.assertions";

export class PrivacyPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/privacy");
    await expect(this.page).toHaveURL(/\/privacy$/);
  }

  async expectCurrentDisclosure(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
    await expect(
      this.page.getByRole("heading", { name: "Обработка данных", level: 1 }),
    ).toBeVisible();
    await expect(this.page.getByText(/Umami/)).toBeVisible();
    await expect(
      this.page.getByText(/отправленные правильные ответы/),
    ).toBeVisible();
    await expect(this.page.getByText(/будут добавлены позднее/)).toBeVisible();
    await expect(this.page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://infraege.ru/privacy",
    );
  }

  async expectNoHorizontalOverflow(): Promise<void> {
    await expectNoHorizontalOverflow(this.page);
  }

  async expectReadableWithoutJavaScript(): Promise<void> {
    await this.open();
    await this.expectCurrentDisclosure();
    await this.expectNoHorizontalOverflow();
  }
}
