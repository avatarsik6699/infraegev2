import { expect, type Page } from "@playwright/test";

/** Change 192: a paid subtopic, the plans, checkout on the fake provider and the return. */
export class BillingIntegrationPage {
  private readonly lesson = "/ege/25-deliteli-i-maski/chisla-po-delitelyam";

  constructor(private readonly page: Page) {}

  async expectGuestPaywall(): Promise<void> {
    await this.page.goto(this.lesson);
    const gate = this.page.getByRole("region", {
      name: "Создайте аккаунт, чтобы продолжить",
    });
    await expect(gate).toBeVisible();
    await expect(this.page.locator("[data-paid-preview]")).toBeVisible();
    await expect(gate).not.toContainText("₽");
  }

  async expectMemberPaywallAndOpenPlans(): Promise<void> {
    await this.page.goto(this.lesson);
    const gate = this.page.getByRole("region", {
      name: "Откройте доступ к сложным задачам",
    });
    await expect(gate).toContainText("при оплате за год");
    await gate.getByRole("link", { name: "Получить полный доступ" }).click();
    await expect(
      this.page.getByRole("heading", { level: 1, name: /одним доступом/u }),
    ).toBeVisible();
  }

  async payForMonthOnFakeProvider(): Promise<void> {
    await this.page
      .locator('[data-plan="month"]')
      .getByRole("link", { name: "Выбрать месяц" })
      .click();
    await expect(
      this.page.getByRole("heading", { name: "Оформление доступа" }),
    ).toBeVisible();
    await this.page.getByRole("button", { name: /^Оплатить/u }).click();
    await expect(
      this.page.getByRole("heading", { name: /Тестовая оплата/u }),
    ).toBeVisible();
    await this.page.getByRole("button", { name: "Оплатить" }).click();
    await expect(
      this.page.getByRole("heading", { name: "Доступ открыт" }),
    ).toBeVisible();
  }

  async expectLessonOpen(): Promise<void> {
    await this.page.getByRole("link", { name: "Вернуться к уроку" }).click();
    await expect(this.page).toHaveURL(new RegExp(`${this.lesson}$`, "u"));
    await expect(this.page.locator("[data-paywall]")).toHaveCount(0);
    await expect(this.page.locator("[data-paid-preview]")).toHaveCount(0);
    await this.page.goto("/account?tab=access");
    await expect(
      this.page.getByRole("heading", { name: /^Доступ открыт до/u }),
    ).toBeVisible();
  }
}
