import { expect, type Page } from "@playwright/test";

export async function openLessonAtTop(
  page: Page,
  route: string,
): Promise<void> {
  await page.goto(route);
  // `route` is always a hardcoded literal path from Playwright test fixtures, never external or
  // user-controlled input, so there is no ReDoS surface here.
  await expect(page).toHaveURL(new RegExp(route + "$")); // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
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
