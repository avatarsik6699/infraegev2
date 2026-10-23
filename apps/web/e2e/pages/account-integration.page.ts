import { expect, type Page } from "@playwright/test";

export class AccountIntegrationPage {
  constructor(private readonly page: Page) {}

  async expectGuestCheckStaysTransient(): Promise<void> {
    await this.page.goto("/ege/16-rekursiya/funktsiya-cherez-sebya");
    const panel = this.page.locator('[data-practice-task="task-16-1-01"]');
    const answer = panel.getByRole("textbox", { name: "Ответ" });
    await expect(answer).toBeEnabled();
    await answer.fill("31");
    await panel.getByRole("button", { name: "Проверить", exact: true }).click();
    await expect(panel.getByRole("status")).toContainText("Верно");
    await expect(answer).not.toHaveAttribute("data-solved", "true");
  }

  async register(email: string, password: string): Promise<void> {
    await this.page.goto("/register");
    await this.page
      .getByRole("textbox", { name: "Электронная почта" })
      .fill(email);
    await this.page.getByRole("textbox", { name: "Пароль" }).fill(password);
    await this.page.getByRole("checkbox", { name: /Даю согласие/ }).check();
    await this.page.getByRole("button", { name: "Создать аккаунт" }).click();
    await expect(
      this.page.getByRole("heading", {
        name: "Проверьте письмо для подтверждения",
      }),
    ).toBeVisible();
  }

  async verify(url: string): Promise<void> {
    const target = new URL(url);
    await this.page.goto(target.pathname + target.search);
    await expect(this.page.getByRole("status")).toContainText(
      "Почта подтверждена",
    );
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.goto("/sign-in");
    await this.page
      .getByRole("textbox", { name: "Электронная почта" })
      .fill(email);
    await this.page.getByRole("textbox", { name: "Пароль" }).fill(password);
    await this.page.getByRole("button", { name: "Войти", exact: true }).click();
    await expect(
      this.page.getByRole("link", { name: "Мой прогресс" }),
    ).toBeVisible();
  }

  async expectTopicProgressSavedAndCourseContextSeparate(): Promise<void> {
    await this.page.goto("/ege/16-rekursiya/funktsiya-cherez-sebya");
    const panel = this.page.locator('[data-practice-task="task-16-1-01"]');
    const answer = panel.getByRole("textbox", { name: "Ответ" });
    await expect(answer).toBeEnabled();
    await answer.fill("31");
    await panel.getByRole("button", { name: "Проверить", exact: true }).click();
    await expect(answer).toHaveAttribute("data-solved", "true");

    await this.page.goto("/courses/python");
    const progress = this.page.getByRole("region", { name: "Ваш прогресс" });
    const practiceMetric = progress
      .getByRole("term")
      .filter({ hasText: /^задач решено$/u });
    await expect(practiceMetric).toBeVisible();
    await expect(
      progress
        .locator("dl > div")
        .filter({
          has: this.page
            .getByRole("term")
            .filter({ hasText: /^задач решено$/u }),
        })
        .getByRole("definition"),
    ).toHaveText("0 из 151");
  }

  async logout(): Promise<void> {
    await this.page.goto("/account");
    await this.page.getByRole("button", { name: "Выйти" }).click();
    await expect(this.page).toHaveURL("/");
    await this.page.goto("/account");
    await expect(
      this.page.getByRole("link", { name: "Войти, чтобы управлять аккаунтом" }),
    ).toBeVisible();
  }
}
