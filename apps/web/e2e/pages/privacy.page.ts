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
      this.page.getByRole("heading", {
        name: "Обработка персональных данных",
        level: 1,
      }),
    ).toBeVisible();
    await expect(this.page.getByText(/self-hosted Umami/)).toBeVisible();
    await expect(
      this.page.getByText(/правильное значение после проверки/),
    ).toBeVisible();
    await expect(
      this.page.getByText(/Годлевский Владислав Александрович/),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        /Продолжение использования сайта.*согласием не считаются/,
      ),
    ).toBeVisible();
    await expect(this.page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://infraege.ru/privacy",
    );
  }

  async expectOptionalAnalyticsRequiresOptIn(): Promise<void> {
    const analyticsRequests: string[] = [];
    this.page.on("request", (request) => {
      if (request.url().includes("/stats/"))
        analyticsRequests.push(request.url());
    });
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
    await expect(
      this.page.locator('[data-analytics-consent-enhanced="true"]'),
    ).toBeVisible();
    await expect(this.page.locator("#infraege-optional-analytics")).toHaveCount(
      0,
    );
    expect(analyticsRequests).toHaveLength(0);
    await this.page.getByRole("button", { name: "Разрешить" }).click();
    await expect.poll(() => analyticsRequests.length).toBeGreaterThan(0);
    expect(
      await this.page.evaluate(() =>
        localStorage.getItem("infraege.analytics-consent"),
      ),
    ).toContain("granted");
    await expect(
      this.page.getByRole("button", { name: "Настройки аналитики" }),
    ).toBeVisible();
    await this.page
      .getByRole("button", { name: "Настройки аналитики" })
      .click();
    await this.page.getByRole("button", { name: "Отозвать согласие" }).click();
    await expect(this.page.locator("#infraege-optional-analytics")).toHaveCount(
      0,
    );
    expect(
      await this.page.evaluate(() =>
        localStorage.getItem("infraege.analytics-consent"),
      ),
    ).toContain("denied");
    const requestCountAfterWithdrawal = analyticsRequests.length;
    await this.page.reload();
    expect(analyticsRequests).toHaveLength(requestCountAfterWithdrawal);
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
