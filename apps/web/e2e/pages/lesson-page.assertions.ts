import { expect, type Page } from "@playwright/test";

type PublishedLessonDocument = {
  canonicalPath: string;
  title: string;
};

export async function openLessonAtTop(
  page: Page,
  route: string,
): Promise<void> {
  await page.goto(route);
  await expect(page).toHaveURL(new RegExp(route + "$"));
  await expect
    .poll(async () => {
      await page.evaluate(() => {
        document.scrollingElement?.scrollTo({
          behavior: "instant",
          top: 0,
        });
      });
      return page.evaluate(
        () => document.scrollingElement?.scrollTop ?? window.scrollY,
      );
    })
    .toBe(0);
}

export async function expectKeyboardLessonDisclosures(
  page: Page,
): Promise<void> {
  const checkpoint = page
    .getByLabel("Проверьте себя")
    .first()
    .getByRole("button")
    .first();
  await checkpoint.focus();
  await checkpoint.press("Enter");
  await expect(checkpoint).toHaveAttribute("aria-expanded", "true");

  const hint = page
    .locator("[data-practice-task]")
    .first()
    .getByRole("button", { name: "Подсказка" });
  await hint.focus();
  await hint.press("Enter");
  await expect(hint).toHaveAttribute("aria-expanded", "true");
}

export async function expectPublishedLessonDocument(
  page: Page,
  document: PublishedLessonDocument,
): Promise<void> {
  await expect(
    page.getByRole("heading", { level: 1, name: document.title }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index,follow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `https://infraege.ru${document.canonicalPath}`,
  );
  await expect(page.locator("[data-practice-task]")).toHaveCount(5);
}

export async function expectPracticeAnswerJourney(
  page: Page,
  incorrectAnswer: string,
  correctAnswer: string,
): Promise<void> {
  await expect(
    page.locator("[data-practice-form][data-enhanced]"),
  ).toBeVisible();
  const firstTask = page.locator("[data-practice-task]").first();
  const answer = firstTask.getByRole("textbox", { name: "Ответ" });
  const check = firstTask.getByRole("button", { name: "Проверить" });
  await answer.fill(incorrectAnswer);
  await check.click();
  await expect(
    firstTask.getByText(
      "Ответ пока не подходит. Попробуйте ещё раз или откройте подсказку.",
    ),
  ).toBeVisible();
  await answer.fill(correctAnswer);
  await check.click();
  await expect(firstTask.getByRole("status")).toContainText("Верно");
}

export async function expectNoJavaScriptPractice(page: Page): Promise<void> {
  await expect(page.locator("[data-practice-form] form")).toHaveCount(5);
  await expect(
    page
      .locator("[data-course-result-progress]")
      .getByText("0 / 5", { exact: true }),
  ).toBeVisible();
}
