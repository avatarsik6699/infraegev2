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
    await expect(
      this.page.getByText(/размещённый на нашем сервере Umami/),
    ).toBeVisible();
    await expect(
      this.page.getByText(/принятые ответы хранятся только в браузере/),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Оператор и контакты" }),
    ).toHaveCount(0);
    await expect(
      this.page.getByRole("link", { name: "avatarsik6699@gmail.com" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", {
        name: "ссылка-приглашение (откроется в новой вкладке)",
      }),
    ).toBeVisible();
    const telegramLink = this.page.getByRole("link", {
      name: "Telegram-канал (откроется в новой вкладке)",
    });
    await expect(telegramLink).toHaveAttribute(
      "href",
      "https://t.me/+dElnKYPKGd81OGYy",
    );
    await expect(telegramLink).toHaveAttribute("target", "_blank");
    await expect(telegramLink).toHaveAttribute("rel", "noopener noreferrer");
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

    await this.expectPendingAnalyticsChoice();
    expect(analyticsRequests).toHaveLength(0);
    await this.page
      .getByRole("button", { name: "Разрешить аналитику" })
      .click();
    await expect.poll(() => analyticsRequests.length).toBeGreaterThan(0);
    expect(
      await this.page.evaluate(() =>
        localStorage.getItem("infraege.analytics-consent"),
      ),
    ).toContain("granted");
    await expect(
      this.page.getByRole("button", { name: "Настройки" }),
    ).toHaveCount(0);
    await this.page
      .getByRole("button", { name: "Отключить аналитику" })
      .click();
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
    await expect(
      this.page.getByRole("button", { name: "Разрешить аналитику" }),
    ).toBeVisible();
  }

  async resetAnalyticsChoice(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  async expectPendingAnalyticsChoice(): Promise<void> {
    await expect(
      this.page.locator('[data-analytics-consent-enhanced="true"]'),
    ).toBeVisible();
    await expect(
      this.page.getByText("Помогите сделать уроки понятнее"),
    ).toBeVisible();
    await expect(
      this.page.getByText(/Обезличенная статистика помогает понять/),
    ).toBeVisible();
    await expect(
      this.page.getByText(/Ответы, введённый текст и контактные данные/),
    ).toBeVisible();
    await expect(this.page.locator("#infraege-optional-analytics")).toHaveCount(
      0,
    );
  }

  async scrollToFooter(): Promise<void> {
    await this.page.getByRole("contentinfo").scrollIntoViewIfNeeded();
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
