import { expect, type Page } from "@playwright/test";

export class PracticeCatalogPage {
  constructor(private readonly page: Page) {}
  async open(path = "/practice") {
    await this.page.goto(path);
    const dismiss = this.page.getByRole("button", {
      name: "Не сейчас",
      exact: true,
    });
    if (await dismiss.isVisible()) await dismiss.click();
  }
  async expectFilterAndPage() {
    await this.open();
    await expect(
      this.page
        .getByRole("list", { name: "Задачи", exact: true })
        .getByRole("listitem"),
    ).toHaveCount(30);
    await this.page.getByLabel("Навык", { exact: true }).fill("python");
    await this.page.getByLabel("Номер ЕГЭ").fill("17");
    await this.page.getByLabel("Сложность: от 1 до 3").fill("1");
    await this.page.getByRole("button", { name: "Применить" }).press("Enter");
    await expect(this.page).toHaveURL(/skill=python/);
    const list = this.page.getByRole("list", { name: "Задачи", exact: true });
    await expect(list).toContainText("Сложность 1 из 3 · ЕГЭ 17");
    const first = await list.getByRole("link").first().textContent();
    await this.page.getByRole("link", { name: "Следующие задачи" }).click();
    await expect(this.page).toHaveURL(/cursor=/);
    await expect(list.getByRole("link").first()).not.toHaveText(first!);
    await this.page.getByRole("link", { name: "К началу списка" }).click();
    await expect(list.getByRole("link").first()).toHaveText(first!);
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,nofollow",
    );
  }
  async expectSolveAndRepeat() {
    await this.open("/practice/catalog-09999");
    const answer = this.page.getByRole("textbox", {
      name: "Ответ",
      exact: true,
    });
    await expect(answer).toBeEnabled();
    await answer.fill("42");
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(
      this.page.getByRole("button", { name: "Решить ещё раз" }),
    ).toBeVisible();
    await this.page.reload();
    await expect(answer).toHaveValue("42");
    await expect(answer).toBeDisabled();
    await this.page.getByRole("button", { name: "Решить ещё раз" }).click();
    await expect(answer).toBeEnabled();
    await expect(answer).toHaveValue("");
    await answer.fill("0");
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(answer).toBeFocused();
    await expect(
      this.page
        .getByRole("status")
        .filter({ hasText: "Прежний успех сохранён" }),
    ).toContainText("Прежний успех сохранён");
    await this.open();
    await expect(
      this.page
        .getByRole("listitem")
        .filter({ hasText: "Учебная задача 09999" }),
    ).toContainText("Решено");
    const lessonProgress = await this.page.evaluate(() =>
      localStorage.getItem("infraege:lesson-progress:v2"),
    );
    expect(lessonProgress ?? "").not.toContain("catalog-09999");
  }
  async expectStaleAndNetwork() {
    await this.open("/practice/catalog-09998");
    const input = this.page.getByRole("textbox", {
      name: "Ответ",
      exact: true,
    });
    await expect(input).toBeEnabled();
    await input.fill("42");
    await this.page.route("**/api/tasks/*/check", (route) =>
      route.fulfill({
        status: 409,
        contentType: "application/json",
        body: '{"detail":"refresh"}',
      }),
    );
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(this.page.getByRole("alert")).toContainText(
      "Задача изменилась",
    );
    await expect(input).toHaveValue("42");
    await this.page.route("**/_serverFn/**", (route) => route.abort());
    await this.page.getByRole("button", { name: "Обновить условие" }).click();
    await expect(this.page.getByRole("alert")).toContainText("Не удалось");
    await expect(input).toHaveValue("42");
    await expect(
      this.page.getByText("Вычислите 40 + 2.", { exact: true }),
    ).toBeVisible();
    await this.page.unroute("**/_serverFn/**");
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(this.page.getByRole("alert")).toContainText(
      "Задача изменилась",
    );
    await this.page.unroute("**/api/tasks/*/check");
    await this.page.getByRole("button", { name: "Обновить условие" }).click();
    await expect(input).toHaveValue("42");
    await this.page.route("**/api/tasks/*/check", (route) => route.abort());
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(input).toHaveValue("42");
    await expect(this.page.getByRole("alert")).toBeVisible();
    await this.page.unroute("**/api/tasks/*/check");
    let releaseCheck!: () => void;
    const pendingCheck = new Promise<void>((resolve) => {
      releaseCheck = resolve;
    });
    await this.page.route("**/api/tasks/*/check", async (route) => {
      await pendingCheck;
      await route.continue();
    });
    try {
      await this.page
        .getByRole("button", { name: "Проверить", exact: true })
        .click();
      await expect(input).toHaveValue("42");
      await expect(input).toBeDisabled();
    } finally {
      releaseCheck();
    }
    await expect(
      this.page.getByRole("button", { name: "Решить ещё раз" }),
    ).toBeVisible();
  }
  async expectNoJavaScriptAndDiscovery() {
    await this.open("/practice/catalog-09999");
    await expect(
      this.page.getByText("Вычислите 40 + 2.", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Сложите числа.", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("textbox", { name: "Ответ", exact: true }),
    ).toBeDisabled();
    const html = await this.page.content();
    expect(html).not.toContain("answer_variants");
    expect(html).not.toContain("numeric_tolerance");
    const geometry = await this.page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.width);
    await this.open("/practice?skill=absent");
    await expect(
      this.page.getByText("По этим фильтрам задач пока нет"),
    ).toBeVisible();
    await this.open("/practice?difficulty=8");
    await expect(
      this.page.getByRole("heading", { name: "Не удалось применить фильтры" }),
    ).toBeVisible();
    const index = await this.page.request.get("/sitemap.xml");
    expect(index.status()).toBe(200);
    expect(await index.text()).toContain("/sitemap-practice/10");
    const part = await this.page.request.get("/sitemap-practice/10");
    const xml = await part.text();
    expect(xml).toContain("/practice/catalog-09999");
    expect(xml).not.toContain("catalog-10000");
    expect((await this.page.request.get("/sitemap-practice/11")).status()).toBe(
      404,
    );
    await this.open("/practice/catalog-10000");
    await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,nofollow",
    );
    await this.open("/practice/catalog-10001");
    await expect(
      this.page.getByRole("heading", { name: "Задача недоступна" }),
    ).toBeVisible();
  }
}
