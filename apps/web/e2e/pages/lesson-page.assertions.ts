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

export async function expectKeyboardLessonDisclosures(
  page: Page,
): Promise<void> {
  await expectMigratedLearningControls(page);
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
  const theoryStage = page.getByRole("heading", {
    level: 2,
    name: "Теория",
  });
  await expect(theoryStage).toHaveAttribute("data-variant", "lesson");
  await expect(theoryStage).not.toHaveAttribute("data-title-role", /.+/);
  await expect(theoryStage).toHaveCSS("font-size", "12px");
  await expect(theoryStage).toHaveCSS("font-weight", "500");
  await expect(theoryStage).toHaveCSS("font-family", /Alchimia IBM Plex Mono/);
  await expect(theoryStage).toHaveCSS("text-transform", "uppercase");
}

async function expectMigratedLearningControls(page: Page): Promise<void> {
  const firstTask = page.locator("[data-practice-task]").first();
  const input = firstTask.getByRole("textbox", { name: "Ответ" });
  const hint = firstTask.getByRole("button", { name: "Подсказка" });
  const progress = page.getByRole("progressbar", {
    name: "Решённые задачи урока",
  });

  await expect(input).toHaveCSS("font-size", "14px");
  await expect(hint.locator("xpath=ancestor::div[@data-index][1]")).toHaveCSS(
    "border-bottom-width",
    "1px",
  );
  await expect(progress.locator("div").first()).toHaveCSS("height", "6px");
}

export async function expectDesktopLessonRail(page: Page): Promise<void> {
  const measurements = await page.evaluate(async () => {
    const scrollingElement = document.scrollingElement;
    const initialScrollTop = scrollingElement?.scrollTop ?? window.scrollY;
    const targetScrollTop = Math.min(
      1000,
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
    );
    window.scrollTo({ behavior: "instant", top: targetScrollTop });
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const rail = document.querySelector<HTMLElement>("[data-outline-rail]");
    const contents = rail?.firstElementChild as HTMLElement | null;
    const progress = rail?.querySelector<HTMLElement>(
      "[data-result-progress], [data-course-result-progress]",
    );
    const labels = Array.from(
      rail?.querySelectorAll<HTMLElement>("[data-outline-link-id] > span") ??
        [],
    );
    if (!rail || !contents || !progress || labels.length === 0) {
      throw new Error("Missing desktop lesson-rail landmarks");
    }

    const contentsStyle = getComputedStyle(contents);
    const contentsRect = contents.getBoundingClientRect();
    const progressRect = progress.getBoundingClientRect();
    const labelMetrics = labels.map((label) => {
      const style = getComputedStyle(label);
      return {
        height: label.getBoundingClientRect().height,
        lineClamp: style.getPropertyValue("-webkit-line-clamp"),
        lineHeight: Number.parseFloat(style.lineHeight),
        overflow: style.overflow,
        whiteSpace: style.whiteSpace,
      };
    });

    window.scrollTo({ behavior: "instant", top: initialScrollTop });
    return {
      contentBottomGap: window.innerHeight - contentsRect.bottom,
      contentHeight: contentsRect.height,
      expectedContentHeight: window.innerHeight - 32,
      position: contentsStyle.position,
      progressBottomGap: window.innerHeight - progressRect.bottom,
      labels: labelMetrics,
    };
  });

  expect(measurements.position).toBe("sticky");
  expect(measurements.contentHeight).toBeCloseTo(
    measurements.expectedContentHeight,
    0,
  );
  expect(measurements.contentBottomGap).toBeCloseTo(16, 0);
  expect(measurements.progressBottomGap).toBeCloseTo(32, 0);
  expect(
    measurements.labels.every(
      (label) =>
        label.lineClamp === "2" &&
        label.overflow === "hidden" &&
        label.whiteSpace === "normal" &&
        label.height <= label.lineHeight * 2 + 1,
    ),
  ).toBe(true);
}

export async function expectLessonInteractiveTargets(
  page: Page,
): Promise<void> {
  const targetGroups = await page.evaluate(() => {
    const selectors = {
      reset: '[aria-label="Сбросить прогресс урока"]',
      theory: "[data-practice-task] nav a",
    };

    return Object.entries(selectors).map(([name, selector]) => ({
      name,
      heights: Array.from(document.querySelectorAll<HTMLElement>(selector))
        .filter((target) => target.getClientRects().length > 0)
        .map((target) => target.getBoundingClientRect().height),
    }));
  });

  for (const group of targetGroups) {
    expect(
      group.heights.length,
      `${group.name} targets are present`,
    ).toBeGreaterThan(0);
    expect(
      group.heights.every((height) => height >= 40),
      `${group.name} targets are at least 40px tall`,
    ).toBe(true);
  }

  // LessonOutline links (Change 91) have a compact visible row but extend
  // their actual clickable area to the 40px floor via an absolutely
  // positioned ::after pseudo-element — measure that hit area, not the
  // shrunk visible box, per docs/FRONTEND.md §5.
  const outlineHitHeights = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll<HTMLElement>("[data-outline-link-id]"),
    )
      .filter((target) => target.getClientRects().length > 0)
      .map((target) => {
        const rect = target.getBoundingClientRect();
        const after = getComputedStyle(target, "::after");
        const expandTop = Math.max(0, -parseFloat(after.top) || 0);
        const expandBottom = Math.max(0, -parseFloat(after.bottom) || 0);
        return rect.height + expandTop + expandBottom;
      });
  });

  expect(
    outlineHitHeights.length,
    "outline targets are present",
  ).toBeGreaterThan(0);
  expect(
    outlineHitHeights.every((height) => height >= 40),
    "outline targets have at least a 40px accessible hit area",
  ).toBe(true);
}

export async function expectLessonVerticalRhythm(page: Page): Promise<void> {
  const rhythm = await page.evaluate(() => {
    const pixelsForVariable = (name: string) => {
      const probe = document.createElement("span");
      probe.style.cssText = `position:absolute;width:var(${name});`;
      document.body.append(probe);
      const pixels = Number.parseFloat(getComputedStyle(probe).width);
      probe.remove();
      return pixels;
    };
    const gapBetween = (first: Element, second: Element) =>
      second.getBoundingClientRect().top - first.getBoundingClientRect().bottom;
    const concepts = Array.from(
      document.querySelectorAll<HTMLElement>("#theory > div > section"),
    );
    const firstConcept = concepts[0];
    const secondConcept = concepts[1];
    const title = firstConcept?.querySelector(":scope > h3");
    const explanation = firstConcept?.querySelector(
      ":scope > [data-learning-flow]",
    );
    const theory = document.querySelector<HTMLElement>(
      "[data-article-frame] > #theory",
    );
    const nextSection = theory?.nextElementSibling;
    const theoryHeading = theory?.querySelector(":scope > h2");
    const theoryContent = theory?.querySelector(":scope > div");
    const practice = document.querySelector<HTMLElement>("#practice");
    const practiceHeading = practice?.querySelector(":scope > h2");
    const practiceContent = practice?.querySelector(":scope > div");
    const result = document.querySelector<HTMLElement>("#result");
    const resultHeading = result?.querySelector(":scope > h2");
    const resultContent = result?.querySelector(":scope > div");

    if (
      !firstConcept ||
      !secondConcept ||
      !title ||
      !explanation ||
      !theory ||
      !nextSection ||
      !theoryHeading ||
      !theoryContent ||
      !practiceHeading ||
      !practiceContent ||
      !resultHeading ||
      !resultContent
    ) {
      throw new Error("Missing lesson rhythm landmarks");
    }

    return {
      contentToken: pixelsForVariable("--rhythm-content-flow"),
      entryToken: pixelsForVariable("--rhythm-section-entry"),
      relatedToken: pixelsForVariable("--rhythm-related-block"),
      conceptToken: pixelsForVariable("--rhythm-concept-separation"),
      sectionToken: pixelsForVariable("--rhythm-section-separation"),
      titleToExplanation: gapBetween(title, explanation),
      conceptGap: gapBetween(firstConcept, secondConcept),
      sectionGap: gapBetween(theory, nextSection),
      theoryEntryGap: gapBetween(theoryHeading, theoryContent),
      practiceEntryGap: gapBetween(practiceHeading, practiceContent),
      resultEntryGap: gapBetween(resultHeading, resultContent),
    };
  });

  const viewportWidth = page.viewportSize()?.width;
  const narrow = viewportWidth ? viewportWidth <= 52 * 16 : false;
  expect(rhythm.contentToken).toBeCloseTo(12, 1);
  expect(rhythm.entryToken).toBeCloseTo(16, 1);
  expect(rhythm.relatedToken).toBeCloseTo(24, 1);
  expect(rhythm.conceptToken).toBeCloseTo(narrow ? 32 : 48, 1);
  expect(rhythm.sectionToken).toBeCloseTo(narrow ? 48 : 64, 1);
  expect(rhythm.titleToExplanation).toBeCloseTo(12, 1);
  expect(rhythm.conceptGap).toBeCloseTo(narrow ? 32 : 48, 1);
  expect(rhythm.sectionGap).toBeCloseTo(narrow ? 48 : 64, 1);
  expect(rhythm.theoryEntryGap).toBeCloseTo(16, 1);
  expect(rhythm.practiceEntryGap).toBeCloseTo(16, 1);
  expect(rhythm.resultEntryGap).toBeCloseTo(16, 1);
}

export async function expectRelatedLearningBlockRhythm(
  page: Page,
  calloutTitle: string,
): Promise<void> {
  const callout = page.getByLabel(calloutTitle);
  const concept = callout.locator("xpath=ancestor::section[@id][1]");
  const example = concept
    .locator(":scope > [data-learning-block]")
    .filter({ hasText: "Разберём на примере" })
    .locator("figure[data-learning-block]");
  const measurements = await callout.evaluate(
    (element, exampleElement) => {
      const previous = element.previousElementSibling;
      const body = element.querySelector<HTMLElement>(":scope > div > div");
      if (!previous || !body || !(exampleElement instanceof Element)) {
        throw new Error("Missing related learning-block landmarks");
      }
      const gapBetween = (first: Element, second: Element) =>
        second.getBoundingClientRect().top -
        first.getBoundingClientRect().bottom;
      return {
        beforeCallout: gapBetween(previous, element),
        insideCallout: Number.parseFloat(getComputedStyle(body).marginTop),
        afterCallout: gapBetween(element, exampleElement),
      };
    },
    await example.elementHandle(),
  );

  expect(measurements.beforeCallout).toBeCloseTo(24, 1);
  expect(measurements.insideCallout).toBeCloseTo(8, 1);
  expect(measurements.afterCallout).toBeCloseTo(24, 1);
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
