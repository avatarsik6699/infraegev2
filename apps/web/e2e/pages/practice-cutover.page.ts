import { expect, type Page } from "@playwright/test";

export class PracticeCutoverPage {
  constructor(private readonly page: Page) {}

  async openTopic(): Promise<void> {
    await this.page.goto("/ege/16-rekursiya#practice");
    const dismiss = this.page.getByRole("button", {
      name: "Не сейчас",
      exact: true,
    });
    if (await dismiss.isVisible()) await dismiss.click();
    await expect(
      this.page.getByRole("heading", {
        name: "Вычислите последовательность",
        exact: true,
      }),
    ).toBeVisible();
  }

  async expectStaleRefreshPreservesInput(): Promise<void> {
    const input = this.page.locator("#answer-rekursiya-base-sequence");
    const panel = this.page.locator(
      '[data-practice-task="rekursiya-base-sequence"]',
    );
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.fill("32");
    await this.page.route("**/api/tasks/*/check", (route) =>
      route.fulfill({
        status: 409,
        contentType: "application/json",
        body: '{"detail":"refresh the task"}',
      }),
    );
    await panel.getByRole("button", { name: "Проверить", exact: true }).click();
    await expect(panel.getByRole("alert")).toContainText("Задача изменилась");
    await expect(input).toHaveValue("32");
    await expect(
      panel.getByRole("button", { name: "Проверить", exact: true }),
    ).toBeDisabled();
    await this.page.unroute("**/api/tasks/*/check");
    await panel.getByRole("button", { name: "Обновить условие" }).click();
    await expect(panel.getByRole("alert")).toHaveCount(0);
    await expect(input).toHaveValue("32");
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.press("Enter");
    await expect(panel).toHaveAttribute("data-solved", "true");
  }

  async expectFailedCheckPreservesInput(): Promise<void> {
    const input = this.page.locator("#answer-rekursiya-base-sequence");
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.fill("32");
    await this.page.route("**/api/tasks/*/check", (route) =>
      route.abort("failed"),
    );
    await input.press("Enter");
    await expect(this.page.getByRole("alert")).toContainText(
      "Не удалось проверить ответ",
    );
    await expect(input).toHaveValue("32");
    await this.page.unroute("**/api/tasks/*/check");
    await input.press("Enter");
    await expect(input).toBeDisabled();
  }

  async expectNoJavaScriptPractice(): Promise<void> {
    await expect(
      this.page.getByText("Для проверки ответов нужен JavaScript.", {
        exact: false,
      }),
    ).toBeVisible();
    await expect(this.page.locator("[data-practice-task]")).toHaveCount(5);
    await expect(
      this.page.getByRole("textbox", { name: "Ответ" }).first(),
    ).toBeDisabled();
    expect(await this.page.content()).not.toContain("answer_variants");
  }

  async expectSlowCheckPreventsDuplicateSubmission(): Promise<void> {
    let release = () => {};
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    let requests = 0;
    await this.page.route("**/api/tasks/*/check", async (route) => {
      requests += 1;
      await pending;
      await route.continue();
    });
    const panel = this.page.locator(
      '[data-practice-task="rekursiya-base-sequence"]',
    );
    const input = panel.getByRole("textbox");
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.fill("32");
    await input.press("Enter");
    await expect(input).toBeDisabled();
    await expect(
      panel.getByRole("button", { name: "Проверяем" }),
    ).toBeDisabled();
    release();
    await expect(panel).toHaveAttribute("data-solved", "true");
    expect(requests).toBe(1);
  }

  async expectPythonAndCourseProgress(): Promise<void> {
    await this.page.goto("/courses/python/pervaya-programma");
    await expect(
      this.page.locator("#answer-python-first-program-output-order"),
    ).toBeEnabled();
    await this.page.evaluate(() => {
      localStorage.removeItem("infraege:lesson-progress:v2");
      localStorage.removeItem("infraege:lesson-progress");
      localStorage.setItem(
        "infraege:lesson:python-first-program:progress",
        JSON.stringify({
          version: 1,
          data: {
            solvedTaskIds: [
              "python-first-program-output-order",
              "python-first-program-variable-trace",
              "python-first-program-input-conversion",
              "python-first-program-expression",
            ],
            acceptedAnswers: {},
          },
        }),
      );
    });
    await this.page.reload();
    await expect(
      this.page.locator("#answer-python-first-program-output-order"),
    ).toBeDisabled();
    await this.page.goto("/courses/python");
    await expect(
      this.page.getByText("Освоено 1 из 28 доступных уроков.", { exact: true }),
    ).toBeVisible();
    await this.page.goto("/courses");
    await expect(
      this.page.getByText("Освоено 1 из 28 уроков", { exact: true }),
    ).toBeVisible();
  }
}
