import { expect, type Page } from "@playwright/test";

export class TopicPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectPlaceholderFixture(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: "Графы: матрица смежности (заглушка для проверки рендера)",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        "Сколько вершин у графа, заданного матрицей смежности размера 4×4?",
      ),
    ).toBeVisible();
  }

  async submitAnswer(answer: string): Promise<void> {
    await this.page.getByRole("textbox", { name: "Ответ" }).fill(answer);
    await this.page.getByRole("button", { name: "Проверить" }).click();
  }

  async expectCorrectResult(): Promise<void> {
    await expect(this.page.getByRole("status")).toContainText("Верно!");
  }
}
