import { expect, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./layout.assertions";

export class CourseCatalogPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/courses");
    await expect(this.page).toHaveURL(/\/courses\/?$/);
  }

  async expectCatalog(): Promise<void> {
    const canvasMatches = await this.page
      .locator("[data-course-catalog-page]")
      .evaluate((page) => {
        const style = getComputedStyle(page);
        const canvas = style.getPropertyValue("--color-brand-canvas").trim();
        const probe = page.ownerDocument.createElement("span");
        probe.style.color = canvas;
        page.append(probe);
        const expected = getComputedStyle(probe).color;
        probe.remove();
        return style.backgroundColor === expected;
      });
    expect(canvasMatches).toBe(true);
    await expect(this.page).toHaveTitle("Мини-курсы — infraege");
    await expect(
      this.page.getByRole("heading", { level: 1, name: "Мини-курсы" }),
    ).toBeVisible();
    await expect(
      this.page.getByText("1 курс доступен · 3 в плане", { exact: true }),
    ).toBeVisible();
    await expect(this.page.locator("[data-course-card]")).toHaveCount(4);
    await expect(
      this.page.locator('[data-course-status="published"]'),
    ).toHaveCount(1);
    await expect(
      this.page.locator('[data-course-status="planned"]'),
    ).toHaveCount(3);
    await expect(this.page.getByText("Скоро", { exact: true })).toHaveCount(3);
    await expect(
      this.page.getByRole("link", { name: "Открыть курс" }),
    ).toHaveAttribute("href", "/courses/python");
    await expect(
      this.page.locator('[data-course-status="planned"] a'),
    ).toHaveCount(0);
    await expect(
      this.page.locator('[data-public-header] a[href^="/courses"]'),
    ).toHaveCount(2);
    await expect(
      this.page.locator('[data-public-header] a[href^="/courses"]').first(),
    ).toHaveAttribute("data-current", "true");
    await expect(this.page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://infraege.ru/courses",
    );
    await expectNoHorizontalOverflow(this.page);
  }

  async expectHydratedProgress(masteredCount = 0): Promise<void> {
    await expect(
      this.page.getByText(`Освоено ${String(masteredCount)} из 28 уроков`, {
        exact: true,
      }),
    ).toBeVisible();
  }

  async expectProgressHidden(): Promise<void> {
    await expect(this.page.locator("[data-course-progress]")).toHaveCount(0);
  }

  async dismissAnalyticsConsent(): Promise<void> {
    const dismiss = this.page.getByRole("button", { name: "Не сейчас" });
    if (await dismiss.isVisible()) await dismiss.click();
  }

  async seedFirstLessonMastery(): Promise<void> {
    await this.page.evaluate(() => {
      const lessons = {
        "python-first-program": {
          acceptedAnswers: {},
          solvedTaskIds: [
            "python-first-program-output-order",
            "python-first-program-variable-trace",
            "python-first-program-input-conversion",
            "python-first-program-expression",
          ],
        },
      };
      localStorage.setItem(
        "infraege:lesson-progress",
        JSON.stringify({ version: 1, data: { lessons } }),
      );
    });
    await this.page.reload();
  }

  async expectDesktopMosaic(): Promise<void> {
    const geometry = await this.page
      .locator("[data-course-card]")
      .evaluateAll((cards) =>
        cards.map((card) => {
          const bounds = card.getBoundingClientRect();
          return {
            id: card.getAttribute("data-course-card"),
            top: bounds.top,
            left: bounds.left,
            width: bounds.width,
            height: bounds.height,
          };
        }),
      );
    const byId = Object.fromEntries(geometry.map((item) => [item.id, item]));
    const python = byId.python;
    const excel = byId.excel;
    const algorithms = byId["algorithms-data-structures"];
    const advanced = byId["advanced-problems"];

    expect(python.width).toBeGreaterThan(excel.width);
    expect(python.height).toBeGreaterThan(excel.height);
    expect(excel.left).toBeGreaterThan(python.left);
    expect(algorithms.left).toBe(excel.left);
    expect(algorithms.top).toBeGreaterThan(excel.top);
    expect(advanced.width).toBeGreaterThan(python.width);
    expect(advanced.top).toBeGreaterThan(python.top);
  }

  async expectMobileOrder(): Promise<void> {
    const tops = await this.page
      .locator("[data-course-card]")
      .evaluateAll((cards) =>
        cards.map((card) => card.getBoundingClientRect().top),
      );
    expect(tops).toEqual([...tops].sort((left, right) => left - right));
    await expectNoHorizontalOverflow(this.page);
  }

  async expectReducedMotion(): Promise<void> {
    const animationNames = await this.page
      .locator("[data-course-catalog-page]")
      .evaluate((root) =>
        [
          "[class*='routeDraw']",
          "[class*='routeMarker']",
          "[class*='trailPulse']",
          "[class*='cardSheen']",
        ]
          .flatMap((selector) => [...root.querySelectorAll(selector)])
          .map((element) => getComputedStyle(element).animationName),
      );
    expect(
      animationNames.every((name) => name === "none"),
      JSON.stringify(animationNames),
    ).toBe(true);
  }

  async expectArtwork(): Promise<void> {
    const studies = this.page.locator("[data-course-study]");
    await expect(studies).toHaveCount(4);
    for (const study of await studies.all()) {
      await study.scrollIntoViewIfNeeded();
      await expect(study.locator("[data-status]")).toHaveAttribute(
        "data-status",
        "loaded",
      );
    }
    await expect(
      this.page.locator("[data-course-staircase] [data-status]"),
    ).toHaveAttribute("data-status", "loaded");
    const overlaps = await this.page
      .locator("[data-course-card]")
      .evaluateAll((cards) =>
        cards.some((card) => {
          const image = card
            .querySelector("[data-course-study]")!
            .getBoundingClientRect();
          const title = card.querySelector("h2")!.getBoundingClientRect();
          return (
            image.left < title.right &&
            image.right > title.left &&
            image.top < title.bottom &&
            image.bottom > title.top
          );
        }),
      );
    expect(overlaps).toBe(false);
    const alignedFrames = await this.page
      .locator("[data-course-card] article")
      .evaluateAll((surfaces) =>
        surfaces.every((surface) => {
          const contour = surface.getBoundingClientRect();
          return [
            ...surface.querySelectorAll(
              "[class*='cardMaterial'], [class*='cardSheen']",
            ),
          ]
            .filter((layer) => getComputedStyle(layer).display !== "none")
            .every((layer) => {
              const bounds = layer.getBoundingClientRect();
              return (
                Math.abs(bounds.x - contour.x) < 1 &&
                Math.abs(bounds.y - contour.y) < 1 &&
                Math.abs(bounds.width - contour.width) < 1 &&
                Math.abs(bounds.height - contour.height) < 1 &&
                getComputedStyle(layer).borderRadius ===
                  getComputedStyle(surface).borderRadius
              );
            });
        }),
      );
    expect(alignedFrames).toBe(true);
    const cleanFooter = await this.page
      .locator('[data-course-card="python"]')
      .evaluate((card) => {
        const texture = card.querySelector("[class*='cardTexture']")!;
        const footer = card.querySelector("[class*='cardFooter']")!;
        const action = card.querySelector("a")!;
        const style = getComputedStyle(action);
        return (
          texture.getBoundingClientRect().bottom <=
            footer.getBoundingClientRect().top &&
          style.backgroundColor === "rgba(0, 0, 0, 0)" &&
          style.boxShadow === "none"
        );
      });
    expect(cleanFooter).toBe(true);
    await this.page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
    await expectNoHorizontalOverflow(this.page);
  }

  async failArtwork(): Promise<void> {
    await this.page.route("**/images/course-catalog/*.webp", (route) =>
      route.abort(),
    );
    await this.page.reload();
    for (const study of await this.page.locator("[data-course-study]").all()) {
      await study.scrollIntoViewIfNeeded();
    }
    await expect(
      this.page.locator("[data-course-study] [data-status='error']"),
    ).toHaveCount(4);
  }

  async expectBoundedMotion(): Promise<void> {
    const toggle = this.page.getByRole("button", {
      name: "Анимация",
      exact: true,
    });
    await expect(toggle).toHaveCount(0);
    const bounded = await this.page
      .locator("[data-course-catalog-page]")
      .evaluate((root) =>
        [
          ...root.querySelectorAll(
            "[class*='routeDraw'], [class*='routeMarker'], [class*='trailPulse'], [class*='cardSheen']",
          ),
        ].every((element) => {
          const style = getComputedStyle(element);
          return (
            style.animationIterationCount === "1" &&
            parseFloat(style.animationDuration) +
              parseFloat(style.animationDelay) <=
              5
          );
        }),
      );
    expect(bounded).toBe(true);
  }
}
