import { expect, type Page } from "@playwright/test";

type ProviderLabel = "VK ID" | "Яндекс ID";

/**
 * Change 227: the account lifecycle through the local stand-in for VK ID and Яндекс ID
 * (`AUTH_FAKE_PROVIDERS`): its page takes an identifier and returns to the real callback.
 */
export class AccountLifecyclePage {
  constructor(private readonly page: Page) {}

  private async approveOnProvider(subject: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /^Подставной/u }),
    ).toBeVisible();
    await this.page
      .getByRole("textbox", { name: "Идентификатор" })
      .fill(subject);
    await this.page.getByRole("button", { name: "Войти" }).click();
  }

  private method(label: ProviderLabel | "Почта и пароль") {
    return this.page
      .locator("#settings")
      .getByRole("listitem")
      .filter({ hasText: label });
  }

  async signInWithProvider(
    label: ProviderLabel,
    subject: string,
  ): Promise<void> {
    await this.page.goto("/sign-in");
    await this.page.getByRole("link", { name: label, exact: true }).click();
    await this.approveOnProvider(subject);
    const consent = this.page.getByRole("checkbox", { name: /Даю согласие/u });
    const member = this.page.getByRole("link", { name: "Мой прогресс" });
    await expect(consent.or(member)).toBeVisible();
    if (await consent.isVisible()) {
      await consent.check();
      await this.page.getByRole("button", { name: "Создать аккаунт" }).click();
    }
    await expect(member).toBeVisible();
  }

  async openSettings(): Promise<void> {
    await this.page.goto("/account?tab=settings");
    await expect(
      this.page.getByRole("heading", { name: "Способы входа" }),
    ).toBeVisible();
  }

  async link(label: ProviderLabel, subject: string): Promise<void> {
    await this.openSettings();
    await this.method(label).getByRole("button", { name: "Добавить" }).click();
    await this.approveOnProvider(subject);
    await expect(this.page).toHaveURL(/\/account/u);
  }

  async unlink(label: ProviderLabel): Promise<void> {
    await this.openSettings();
    await this.page.getByRole("button", { name: `Отвязать ${label}` }).click();
    await this.page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Отвязать способ входа" })
      .click();
    await expect(this.method(label)).toContainText("Не подключено");
  }

  async expectConnected(
    connected: readonly (ProviderLabel | "Почта и пароль")[],
  ): Promise<void> {
    await this.openSettings();
    for (const label of connected)
      await expect(this.method(label)).toContainText("Подключено");
  }

  async expectError(text: RegExp): Promise<void> {
    await expect(
      this.page.locator("#settings").getByRole("alert"),
    ).toContainText(text);
  }

  private access = "";

  private async accessHeading(): Promise<string> {
    await this.page.goto("/account?tab=access");
    const heading = this.page.getByRole("heading", {
      name: /^Доступ открыт до/u,
    });
    await expect(heading).toBeVisible();
    return (await heading.textContent()) ?? "";
  }

  /** Remembers the paid access the account has now. */
  async rememberAccess(): Promise<void> {
    this.access = await this.accessHeading();
  }

  async expectSameAccess(): Promise<void> {
    expect(await this.accessHeading()).toBe(this.access);
  }

  async deleteWithPassword(password: string): Promise<void> {
    await this.openSettings();
    await this.page
      .getByRole("button", { name: "Удалить аккаунт и прогресс" })
      .click();
    const dialog = this.page.getByRole("alertdialog");
    await expect(dialog).toContainText("Оплаченный доступ до");
    await expect(dialog).toContainText("вернутся на карту");
    await dialog.getByLabel("Текущий пароль").fill(password);
    await dialog.getByRole("button", { name: "Удалить аккаунт" }).click();
    await expect(this.page).toHaveURL("/");
  }

  async deleteProviderAccount(): Promise<void> {
    await this.openSettings();
    await this.page
      .getByRole("button", { name: "Удалить аккаунт и прогресс" })
      .click();
    await this.page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Удалить аккаунт" })
      .click();
    await expect(this.page).toHaveURL("/");
  }

  async expectSignedOut(): Promise<void> {
    await this.page.goto("/account");
    await expect(
      this.page.getByRole("link", { name: "Войти, чтобы управлять аккаунтом" }),
    ).toBeVisible();
  }
}
