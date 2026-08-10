import { expect, type Page } from "@playwright/test";

const TOPIC_TITLE = "Как сопоставить граф и таблицу дорог — задание 1 ЕГЭ";
const TOPIC_DESCRIPTION =
  "Разбираем, как по степеням вершин и длинам дорог восстановить соответствие между схемой и таблицей, а затем без ошибок найти нужное расстояние.";

export class TopicPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectPublishedLesson(): Promise<void> {
    await expect(this.page).toHaveURL(
      /\/theory\/zadanie-1-graphs-and-tables$/,
    );
    await expect(this.page).toHaveTitle(TOPIC_TITLE);
    await expect(
      this.page.locator('meta[name="description"]'),
    ).toHaveAttribute("content", TOPIC_DESCRIPTION);
    await expect(this.page.getByText("№1", { exact: true })).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: TOPIC_TITLE, level: 1 }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Разобранный пример" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Закончи решение" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("img", { name: /Схема четырёх пунктов/ }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("table", { name: /Таблица длин дорог/ }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Типичная ошибка:", { exact: false }).first(),
    ).toBeVisible();
    await expect(this.page.locator("main form")).toHaveCount(5);
    await expect(
      this.page.getByRole("progressbar", {
        name: "Прогресс по теме: 0 из 5 задач",
      }),
    ).toHaveAttribute("aria-valuenow", "0");
  }

  async submitTask(taskIndex: number, answer: string): Promise<void> {
    const task = this.page.locator("main form").nth(taskIndex);
    await task.getByRole("textbox", { name: "Ответ" }).fill(answer);
    await task.getByRole("button", { name: "Проверить" }).click();
    await expect(task.getByRole("status")).toContainText("Верно!");
    await expect(task.getByRole("status")).toContainText("Типичная ошибка");
  }

  async expectProgress(percent: number, solved: number): Promise<void> {
    await expect(
      this.page.getByRole("progressbar", {
        name: `Прогресс по теме: ${solved} из 5 задач`,
      }),
    ).toHaveAttribute("aria-valuenow", String(percent));
  }

  async expectNotMastered(): Promise<void> {
    await expect(this.page.getByText("3 из 5 задач решено верно")).toBeVisible();
    await expect(this.page.getByText("Тема освоена")).toHaveCount(0);
  }

  async expectMastered(): Promise<void> {
    await expect(this.page.getByText("Тема освоена")).toBeVisible();
  }

  async expectKeyboardVisibleSubmit(): Promise<void> {
    const input = this.page.getByRole("textbox", { name: "Ответ" }).first();
    await input.fill("Б");
    await this.page.keyboard.press("Tab");
    const button = this.page.getByRole("button", { name: "Проверить" }).first();
    await expect(button).toBeFocused();
    expect(
      await button.evaluate((element) => {
        const style = getComputedStyle(element);
        return element.matches(":focus-visible") && style.outlineStyle !== "none";
      }),
    ).toBe(true);
  }

  async expectNoHorizontalOverflow(): Promise<void> {
    expect(
      await this.page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
}

export { TOPIC_DESCRIPTION, TOPIC_TITLE };
