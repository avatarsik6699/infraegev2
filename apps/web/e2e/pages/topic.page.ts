import { expect, type Page } from "@playwright/test";

const TOPIC_TITLE = "Как сопоставить граф и таблицу дорог — задание 1 ЕГЭ";
const TOPIC_DESCRIPTION =
  "Разбираем, как по степеням вершин и длинам дорог восстановить соответствие между схемой и таблицей, а затем без ошибок найти нужное расстояние.";

export class TopicPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto("/theory/zadanie-1-graphs-and-tables");
  }

  async expectPublishedLesson(): Promise<void> {
    await expect(this.page).toHaveURL(/\/theory\/zadanie-1-graphs-and-tables$/);
    await expect(this.page).toHaveTitle(TOPIC_TITLE);
    await expect(this.page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      TOPIC_DESCRIPTION,
    );
    await expect(
      this.page.getByText("Задание №1 · теория и практика", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: TOPIC_TITLE, level: 1 }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Разобранный пример" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Закончи решение" }),
    ).toBeVisible();
    await expect(this.page.getByRole("link", { name: /Идея/ })).toHaveAttribute(
      "href",
      "#idea",
    );
    await expect(
      this.page.getByRole("link", { name: /Подводные камни/ }),
    ).toHaveAttribute("href", "#pitfalls");
    await expect(
      this.page.getByRole("link", { name: /К практике/ }),
    ).toHaveAttribute("href", "#practice");
    await expect(
      this.page.getByRole("img", {
        name: /Вершина 2 имеет три ребра и соответствует строке Б/,
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("table", { name: /Таблица длин дорог/ }),
    ).toBeVisible();
    await expect(this.page.getByRole("note")).toContainText(
      "Типичная ошибка —",
    );
    await expect(this.page.getByRole("textbox", { name: "Ответ" })).toHaveCount(
      5,
    );
    await expect(
      this.page.getByRole("progressbar", {
        name: "Прогресс по теме: 0 из 5 задач",
      }),
    ).toHaveAttribute("aria-valuenow", "0");
  }

  async submitCorrectTask(taskIndex: number, answer: string): Promise<void> {
    await this.page
      .getByRole("textbox", { name: "Ответ" })
      .nth(taskIndex)
      .fill(answer);
    await this.page
      .getByRole("button", { name: "Проверить" })
      .nth(taskIndex)
      .click();
    await expect(
      this.page.getByText("Верно!", { exact: true }).nth(taskIndex),
    ).toBeVisible();
    await expect(
      this.page.getByText("Типичная ошибка", { exact: false }).nth(taskIndex),
    ).toBeVisible();
  }

  async expectProgress(percent: number, solved: number): Promise<void> {
    await expect(
      this.page.getByRole("progressbar", {
        name: `Прогресс по теме: ${solved} из 5 задач`,
      }),
    ).toHaveAttribute("aria-valuenow", String(percent));
  }

  async expectNotMastered(): Promise<void> {
    await expect(
      this.page.getByText("3 из 5 задач решено верно"),
    ).toBeVisible();
    await expect(this.page.getByText("Тема освоена")).toHaveCount(0);
  }

  async expectMastered(): Promise<void> {
    await expect(this.page.getByText("Тема освоена")).toBeVisible();
  }

  async expectKeyboardVisibleSubmit(): Promise<void> {
    const input = this.page.getByRole("textbox", { name: "Ответ" }).first();
    const button = this.page.getByRole("button", { name: "Проверить" }).first();
    // TanStack Start streams usable SSR markup before the controlled input hydrates. Retry the
    // user action against its observable enabled state instead of waiting for global network idle.
    await expect
      .poll(async () => {
        await input.fill("Б");
        return button.isEnabled();
      })
      .toBe(true);
    await input.press("Tab");
    await expect(button).toBeFocused();
    expect(
      await button.evaluate((element) => {
        const style = getComputedStyle(element);
        return (
          element.matches(":focus-visible") && style.outlineStyle !== "none"
        );
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

  async expectReadableWithoutJavaScript(): Promise<void> {
    await expect(this.page).toHaveTitle(TOPIC_TITLE);
    await expect(
      this.page.getByText("поиску признаков", { exact: false }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: /К практике/ }),
    ).toHaveAttribute("href", "#practice");
    await expect(this.page.getByRole("textbox", { name: "Ответ" })).toHaveCount(
      5,
    );
  }
}

export { TOPIC_DESCRIPTION, TOPIC_TITLE };
