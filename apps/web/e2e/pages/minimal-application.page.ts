import { expect, type Page } from "@playwright/test";
import bank from "../../../../content/practice-bank/bank.json" with { type: "json" };
import { courseLessonPublications } from "../../src/entities/course/content/course-publication.mjs";
import { expectNoHorizontalOverflow } from "./layout.assertions";

const visibleTasks = bank.tasks
  .filter(({ task }) => task.catalog_visible && !task.archived)
  .sort((a, b) => a.task.id.localeCompare(b.task.id));

export class MinimalApplicationPage {
  constructor(private readonly page: Page) {}
  async expectPublicPages() {
    for (const path of [
      "/",
      "/ege",
      "/courses",
      "/courses/python",
      "/privacy",
      "/practice",
    ]) {
      const response = await this.page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(this.page.locator("[data-infraege-mark]")).toBeVisible();
      await expect(
        this.page.locator(
          'script[src*="/stats/"], [data-analytics-consent], [data-home-map], [data-svg-pattern]',
        ),
      ).toHaveCount(0);
      await expectNoHorizontalOverflow(this.page);
    }
    for (const path of ["/lab/design-system", "/lab/lesson"]) {
      expect((await this.page.goto(path))?.status()).toBe(404);
      await expect(
        this.page.getByRole("link", { name: "На главную", exact: true }),
      ).toBeVisible();
    }
  }
  async expectPublishedLesson(index: number) {
    const lesson = courseLessonPublications[index];
    const response = await this.page.goto(
      `/courses/python/${lesson.routeSlug}`,
    );
    expect(response?.status()).toBe(200);
    await expect(this.page.getByRole("heading", { level: 1 })).toHaveText(
      lesson.title,
    );
    await expect(
      this.page.getByRole("heading", { name: "Практика", exact: true }),
    ).toBeVisible();
    expect(await this.page.content()).not.toContain('"answer_variants"');
    await expectNoHorizontalOverflow(this.page);
  }
  async expectCatalog() {
    await this.page.goto("/practice");
    const list = this.page.getByRole("list", { name: "Задачи", exact: true });
    await expect(list.getByRole("listitem")).toHaveCount(30);
    const first = await list.getByRole("link").first().getAttribute("href");
    await this.page
      .getByRole("link", { name: "Следующие задачи" })
      .press("Enter");
    await expect(this.page).toHaveURL(/page=2/);
    await expect(list.getByRole("link").first()).not.toHaveAttribute(
      "href",
      first!,
    );
    await this.page.goto("/practice?exam_number=16&difficulty=1");
    await expect(list.getByRole("listitem").first()).toContainText("ЕГЭ 16");
    await this.page.goto("/practice?skill=nonexistent");
    await expect(
      this.page.getByRole("heading", { name: /задач пока нет/ }),
    ).toBeVisible();
    await this.page.goto("/practice?difficulty=9");
    await expect(
      this.page.getByRole("heading", { name: /фильтр/i }),
    ).toBeVisible();
  }
  async expectSolveAndProgress() {
    const { task } = visibleTasks[0];
    await this.page.goto(`/practice/${task.id}`);
    const input = this.page.getByRole("textbox", {
      name: "Ответ",
      exact: true,
    });
    await expect(input).toBeEnabled();
    await input.fill(task.checker.answer_variants[0]);
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(
      this.page.getByRole("button", { name: "Решить ещё раз" }),
    ).toBeVisible();
    await this.page.reload();
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue(task.checker.answer_variants[0]);
    await this.page.getByRole("button", { name: "Решить ещё раз" }).click();
    await expect(input).toBeEnabled();
    await input.fill("unsubmitted");
    await this.page.reload();
    await expect(input).not.toHaveValue("unsubmitted");
    await this.page.getByRole("link", { name: "Следующая задача" }).click();
    await expect(this.page).toHaveURL(new RegExp(visibleTasks[1].task.id));
    expect(
      (await this.page.evaluate(() =>
        localStorage.getItem("infraege:lesson-progress:v2"),
      )) ?? "",
    ).not.toContain(task.id);
  }
  async expectFailedCheck() {
    await this.page.goto(`/practice/${visibleTasks[1].task.id}`);
    const input = this.page.getByRole("textbox", {
      name: "Ответ",
      exact: true,
    });
    await expect(input).toBeEnabled();
    await input.fill("123");
    await this.page.route("**/api/tasks/*/check", (route) => route.abort());
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(this.page.getByRole("alert")).toBeVisible();
    await expect(input).toHaveValue("123");
    await this.page.unroute("**/api/tasks/*/check");
    await input.fill(visibleTasks[1].task.checker.answer_variants[0]);
    await this.page
      .getByRole("button", { name: "Проверить", exact: true })
      .click();
    await expect(
      this.page.getByRole("button", { name: "Решить ещё раз" }),
    ).toBeVisible();
  }
  async expectReadablePractice() {
    const response = await this.page.goto(
      `/practice/${visibleTasks[0].task.id}`,
    );
    expect(response?.status()).toBe(200);
    await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await this.page.content()).not.toContain('"answer_variants"');
    await expectNoHorizontalOverflow(this.page);
  }
  async expectStableDelivery() {
    for (const width of [1440, 390]) {
      await this.page.setViewportSize({ width, height: 900 });
      let release!: () => void;
      const hold = new Promise<void>((resolve) => {
        release = resolve;
      });
      await this.page.route("**/*.woff2", async (route) => {
        await hold;
        await route.abort();
      });
      await this.page.goto("/", { waitUntil: "domcontentloaded" });
      const heading = this.page.getByRole("heading", { level: 1 });
      await expect(heading).toBeVisible();
      const before = await heading.boundingBox();
      release();
      await this.page.evaluate(() => document.fonts.ready);
      const after = await heading.boundingBox();
      expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
      await expectNoHorizontalOverflow(this.page);
      await this.page.unroute("**/*.woff2");
    }
  }

  async expectStableLessonOutline() {
    await this.page.setViewportSize({ width: 390, height: 844 });
    let release!: () => void;
    const hold = new Promise<void>((resolve) => {
      release = resolve;
    });
    await this.page.route("**/*.js", async (route) => {
      await hold;
      await route.continue();
    });
    try {
      await this.page.goto("/ege/16-rekursiya", { waitUntil: "commit" });
      const outline = this.page.getByRole("navigation", {
        name: "Содержание урока",
      });
      const trigger = outline.getByRole("button", { name: "Содержание урока" });
      await expect(trigger).toBeVisible();
      await expect(trigger).toBeDisabled();
      const before = await outline.boundingBox();
      release();
      await expect(trigger).toBeEnabled();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      const after = await outline.boundingBox();
      expect(Math.abs(after!.height - before!.height)).toBeLessThan(2);
      await trigger.click();
      await expect(
        outline.getByRole("link", { name: "Теория", exact: true }),
      ).toBeVisible();
    } finally {
      release();
      await this.page.unroute("**/*.js");
    }
  }
}
