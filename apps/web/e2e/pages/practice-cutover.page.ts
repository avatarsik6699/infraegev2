import { expect, type Page } from "@playwright/test";

export class PracticeCutoverPage {
  constructor(private readonly page: Page) {}

  async openTopic(): Promise<void> {
    await this.page.goto("/ege/16-rekursiya/praktika");
    const dismiss = this.page.getByRole("button", {
      name: "Не сейчас",
      exact: true,
    });
    if (await dismiss.isVisible()) await dismiss.click();
    await expect(
      this.page.getByRole("heading", {
        name: "Значение по одному предыдущему",
        exact: true,
      }),
    ).toBeVisible();
  }

  async expectStaleRefreshPreservesInput(): Promise<void> {
    const input = this.page.locator("#answer-task-16-1-01");
    const panel = this.page.locator('[data-practice-task="task-16-1-01"]');
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.fill("31");
    await this.page.route("**/api/tasks/*/check", (route) =>
      route.fulfill({
        status: 409,
        contentType: "application/json",
        body: '{"detail":"refresh the task"}',
      }),
    );
    await panel.getByRole("button", { name: "Проверить", exact: true }).click();
    await expect(panel.getByRole("status")).toContainText("Задача изменилась");
    await expect(input).toHaveValue("31");
    await expect(
      panel.getByRole("button", { name: "Проверить", exact: true }),
    ).toBeDisabled();
    await this.page.unroute("**/api/tasks/*/check");
    await panel.getByRole("button", { name: "Обновить условие" }).click();
    await expect(panel.getByRole("status")).toHaveCount(0);
    await expect(input).toHaveValue("31");
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.press("Enter");
    await this.expectGuestCorrectness(panel);
  }

  async expectFailedCheckPreservesInput(): Promise<void> {
    const input = this.page.locator("#answer-task-16-1-01");
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.fill("31");
    await this.page.route("**/api/tasks/*/check", (route) =>
      route.abort("failed"),
    );
    await input.press("Enter");
    await expect(
      this.page
        .locator('[data-practice-task="task-16-1-01"]')
        .getByRole("status"),
    ).toContainText("Не удалось проверить ответ");
    await expect(input).toHaveValue("31");
    await this.page.unroute("**/api/tasks/*/check");
    await input.press("Enter");
    await expect(input).toBeDisabled();
    await this.expectGuestCorrectness(
      this.page.locator('[data-practice-task="task-16-1-01"]'),
    );
  }

  async expectNoJavaScriptPractice(): Promise<void> {
    await expect(
      this.page.getByText("Для проверки ответов нужен JavaScript.", {
        exact: false,
      }),
    ).toBeVisible();
    await expect(this.page.locator("[data-practice-task]")).toHaveCount(57);
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
    const panel = this.page.locator('[data-practice-task="task-16-1-01"]');
    const input = panel.getByRole("textbox");
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.fill("31");
    await input.press("Enter");
    await expect(input).toBeDisabled();
    await expect(
      panel.getByRole("button", { name: "Проверяем" }),
    ).toBeDisabled();
    release();
    await this.expectGuestCorrectness(panel);
    expect(requests).toBe(1);
  }

  async expectLegacyBrowserProgressIsIgnored(): Promise<void> {
    await this.page.goto("/courses/python/pervaya-programma");
    await expect(
      this.page.locator("#answer-python-first-program-t02"),
    ).toBeEnabled({ timeout: 15000 });
    await this.page.evaluate(() => {
      localStorage.setItem(
        "infraege:lesson:python-first-program:progress",
        JSON.stringify({
          version: 1,
          data: {
            solvedTaskIds: [
              "python-first-program-t02",
              "python-first-program-t03",
              "python-first-program-t08",
            ],
            acceptedAnswers: {},
          },
        }),
      );
    });
    await this.page.reload();
    await expect(
      this.page.locator("#answer-python-first-program-t02"),
    ).toBeEnabled({ timeout: 15000 });
    await this.page.goto("/courses/python");
    const size = this.page.getByRole("region", { name: "Объём курса" });
    await expect(size).toContainText("146");
    await expect(
      size.getByRole("link", { name: "Войдите, чтобы сохранять прогресс" }),
    ).toBeVisible();
    const moduleProgress = this.page.locator(
      '[data-course-overview-page] [role="progressbar"]',
    );
    await expect(moduleProgress).toHaveCount(8);
    expect(
      await moduleProgress.evaluateAll((bars) =>
        bars.every((bar) => bar.getAttribute("aria-valuenow") === "0"),
      ),
    ).toBe(true);
    await this.page.goto("/courses");
    await expect(
      this.page
        .locator("[data-course-progress]")
        .getByText("Освоено 0 из 27 уроков", { exact: true }),
    ).toBeVisible();
  }

  private async expectGuestCorrectness(panel: ReturnType<Page["locator"]>) {
    await expect(panel.getByRole("status")).toContainText("Верно.");
    await expect(panel).not.toHaveAttribute("data-solved");
  }
}
