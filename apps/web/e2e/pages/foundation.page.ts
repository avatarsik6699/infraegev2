import { expect, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./layout.assertions";
import { expectPublicReleaseIdentity } from "./public-header.assertions";

export class FoundationPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/");
    await expect(this.page).toHaveURL(/\/$/);
  }

  async expectPublishedMaterial(): Promise<void> {
    await expectPublicReleaseIdentity(this.page);
    await expect(this.page).toHaveTitle(
      "infraege — подготовка к ЕГЭ по информатике",
    );
    await expect(
      this.page.getByRole("heading", {
        name: "Информатика - это система",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Подготовка к ЕГЭ без зубрёжки"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Начать подготовку" }),
    ).toHaveAttribute("href", "/courses/python");
    await expect(this.page.getByText("10 234 ученика")).toHaveCount(0);
    await expect(this.page.getByText("скоро", { exact: true })).toHaveCount(0);
    await expect(this.page.getByText("Войти", { exact: true })).toHaveCount(0);
    await expect(
      this.page.getByText("Регистрация", { exact: true }),
    ).toHaveCount(0);
    await expect(
      this.page.locator("[data-infraege-benefits]").getByText("просто"),
    ).toBeVisible();
    await expect(
      this.page.locator("[data-public-header] [aria-disabled='true']"),
    ).toHaveCount(8);
    await expect(this.page.locator("[data-home-map]")).toBeVisible();
    await expect(this.page.locator("[data-course-list]")).toHaveCount(0);
    await expect(this.page.locator("[data-topic-list]")).toHaveCount(0);
    await expect(
      this.page.getByRole("link", { name: "Обработка данных" }),
    ).toHaveAttribute("href", "/privacy");
    await expect(this.page.getByRole("link", { name: /lab/i })).toHaveCount(0);
    await expect(this.page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://infraege.ru/",
    );
  }

  async expectBrandMetadata(): Promise<void> {
    await expect(this.page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#f5f3ef",
    );
    await expect(
      this.page.locator('link[rel="icon"][type="image/svg+xml"]'),
    ).toHaveAttribute("href", "/favicon.svg");
    await expect(
      this.page.locator('link[rel="apple-touch-icon"]'),
    ).toHaveAttribute("href", "/apple-touch-icon.png");
    await expect(this.page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      "/site.webmanifest",
    );
    await expect(
      this.page.locator('meta[property="og:image"]'),
    ).toHaveAttribute(
      "content",
      "https://infraege.ru/brand/infraege-social.png",
    );
    await expect(
      this.page.locator('meta[name="twitter:card"]'),
    ).toHaveAttribute("content", "summary_large_image");

    const structuredData = await this.page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(structuredData).not.toBeNull();
    expect(JSON.parse(structuredData ?? "{}")).toEqual(
      expect.objectContaining({
        "@type": "WebSite",
        name: "infraege",
        url: "https://infraege.ru/",
      }),
    );
  }

  async expectDesktopComposition(): Promise<void> {
    const primaryAction = this.page.getByRole("link", {
      name: "Начать подготовку",
    });
    await primaryAction.focus();
    const composition = await this.page
      .locator("[data-foundation-layout]")
      .evaluate((layout) => {
        const intro = layout.children[0];
        const visual = layout.children[1];
        const action = layout.querySelector<HTMLElement>("a");
        const heading = intro.querySelector<HTMLElement>("h1");
        const lead = intro.querySelector<HTMLElement>("p");
        if (
          !(intro instanceof HTMLElement) ||
          !(visual instanceof HTMLElement) ||
          !action ||
          !heading ||
          !lead
        ) {
          throw new Error("Missing home composition");
        }

        return {
          columns: getComputedStyle(layout).gridTemplateColumns,
          visualLeft: visual.getBoundingClientRect().left,
          introRight: intro.getBoundingClientRect().right,
          introWidth: intro.getBoundingClientRect().width,
          mapWidth:
            visual.querySelector("[data-home-map]")?.getBoundingClientRect()
              .width ?? 0,
          actionOutline: getComputedStyle(action).outlineStyle,
          actionUnderline: Boolean(
            action.querySelector("[data-action-underline]"),
          ),
          actionArrow: Boolean(action.querySelector("[data-action-arrow]")),
          headingFamily: getComputedStyle(heading).fontFamily,
          leadFamily: getComputedStyle(lead).fontFamily,
          headingSize: Number.parseFloat(getComputedStyle(heading).fontSize),
          leadSize: Number.parseFloat(getComputedStyle(lead).fontSize),
        };
      });

    expect(composition.columns.split(" ")).toHaveLength(2);
    expect(composition.visualLeft).toBeLessThanOrEqual(composition.introRight);
    expect(composition.mapWidth).toBeGreaterThan(composition.introWidth * 1.25);
    expect(composition.actionOutline).toBe("solid");
    expect(composition.actionUnderline).toBe(true);
    expect(composition.actionArrow).toBe(true);
    expect(composition.headingFamily).not.toBe(composition.leadFamily);
    expect(composition.headingSize).toBeGreaterThan(composition.leadSize * 3);
  }

  async expectDesktopMapFitsViewport(): Promise<void> {
    const geometry = await this.page
      .locator("[data-home-map]")
      .evaluate((map) => {
        const bounds = map.getBoundingClientRect();
        return {
          bottom: bounds.bottom,
          top: bounds.top,
          viewportHeight: window.innerHeight,
        };
      });

    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight + 1);
  }

  async expectStackedMapUsesAvailableWidth(): Promise<void> {
    const geometry = await this.page
      .locator("[data-home-map]")
      .evaluate((map) => {
        const visual = map.parentElement;
        if (!visual) throw new Error("Missing learning-map visual container");

        return {
          mapWidth: map.getBoundingClientRect().width,
          visualWidth: visual.getBoundingClientRect().width,
        };
      });

    expect(geometry.mapWidth / geometry.visualWidth).toBeGreaterThanOrEqual(
      0.95,
    );
  }

  async expectDeclarativeDrawing(): Promise<void> {
    const map = this.page.locator("[data-home-map]");

    await expect(map.locator('[data-svg-pattern="field"]')).toHaveCount(7);
    await expect(map.locator('[data-svg-pattern="preset"]')).toHaveCount(7);
    await expect(map.locator('[data-svg-pattern="strokes"]')).toHaveCount(5);
    await expect(map.locator("[data-map-connection]")).toHaveCount(0);
    await expect(map.locator('[data-svg-drawing="arrow"]')).toHaveCount(0);
    await expect(map.locator('[data-svg-drawing="tapered-line"]')).toHaveCount(
      0,
    );
    await expect(map.locator("[data-map-node]")).toHaveCount(4);
    await expect(map.locator("[data-home-map-card]")).toHaveCount(4);
    await expect(
      map.locator("[data-home-map-card] [data-custom-icon='root']"),
    ).toHaveCount(4);
    await expect(
      map.locator("[data-home-map-card] [data-icon-name='book']"),
    ).toHaveCount(1);
    await expect(
      map.locator("[data-home-map-card] [data-icon-name='checklist']"),
    ).toHaveCount(1);
    await expect(
      map.locator("[data-home-map-card] [data-icon-name='braces']"),
    ).toHaveCount(1);
    await expect(
      map.locator("[data-home-map-card] [data-icon-name='bar-chart']"),
    ).toHaveCount(1);
    expect(await map.locator("mask[id^='svg-pattern-mask-']").count()).toBe(7);
    await expect(map.locator("image, [mask*='dry-ink']")).toHaveCount(0);
    await expect(map.locator("[data-pattern-name='recursion']")).toHaveCount(0);
    await expect(map.locator("[data-pattern-name='graph']")).toHaveCount(0);
    await expect(map.locator("[data-pattern-name='truthTable']")).toHaveCount(
      1,
    );
    await expect(map.locator("[data-pattern-name='traversal']")).toHaveCount(1);

    const patternTransforms = await map
      .locator('[data-svg-pattern="preset"]')
      .evaluateAll((presets) =>
        presets.map((preset) => preset.getAttribute("transform")),
      );
    expect(
      patternTransforms.every((transform) => transform?.includes("rotate(")),
    ).toBe(true);

    const visualHierarchy = await map.evaluate((root) => {
      const practice = root.querySelector("[data-map-node='practice-stage']");
      const activeSurface = root.querySelector(
        "[data-map-node='tasks-stage'] [data-active='true']",
      );
      const progressSurface = root.querySelector(
        "[data-map-node='progress'] rect",
      );
      const number = practice?.querySelector("[data-stage-number]");
      const title = practice?.querySelector("[data-stage-title]");
      const check = practice?.querySelector("[data-stage-check]");

      if (
        !(number instanceof SVGTextElement) ||
        !(title instanceof SVGTextElement) ||
        !(check instanceof SVGCircleElement) ||
        !(activeSurface instanceof SVGRectElement) ||
        !(progressSurface instanceof SVGRectElement)
      ) {
        throw new Error("Missing learning-map stage structure");
      }

      const titleBounds = title.getBBox();
      const checkBounds = check.getBBox();
      const stageSurface = practice.querySelector("[data-active], rect");
      const cardRightPadding = [
        ...root.querySelectorAll("[data-home-map-card]"),
      ].map((card) => {
        const surface = card.querySelector("[data-card-surface]");
        const caption = card.querySelector("[data-card-caption]");
        if (
          !(surface instanceof SVGRectElement) ||
          !(caption instanceof SVGTextElement)
        ) {
          throw new Error("Missing learning-map card geometry");
        }

        const captionBounds = caption.getBBox();
        return (
          Number(surface.getAttribute("width")) -
          (captionBounds.x + captionBounds.width)
        );
      });

      if (!(stageSurface instanceof SVGRectElement)) {
        throw new Error("Missing learning-map stage surface");
      }
      return {
        activeFill: getComputedStyle(activeSurface).fill,
        progressFill: getComputedStyle(progressSurface).fill,
        numberSize: Number.parseFloat(getComputedStyle(number).fontSize),
        titleSize: Number.parseFloat(getComputedStyle(title).fontSize),
        titleCheckGap: checkBounds.x - (titleBounds.x + titleBounds.width),
        checkRightPadding:
          Number(stageSurface.getAttribute("width")) -
          (checkBounds.x + checkBounds.width),
        cardRightPadding,
        traversalNodeRadii: [
          ...root.querySelectorAll("[data-pattern-name='traversal'] circle"),
        ].map((node) => Number(node.getAttribute("r"))),
      };
    });

    expect(
      visualHierarchy.numberSize - visualHierarchy.titleSize,
    ).toBeGreaterThanOrEqual(3.5);
    expect(visualHierarchy.titleCheckGap).toBeGreaterThan(10);
    expect(visualHierarchy.checkRightPadding).toBeGreaterThanOrEqual(20);
    expect(
      Math.min(...visualHierarchy.cardRightPadding),
    ).toBeGreaterThanOrEqual(18);
    expect(visualHierarchy.activeFill).toBe(visualHierarchy.progressFill);
    expect(visualHierarchy.activeFill).not.toContain("url(");
    expect(Math.max(...visualHierarchy.traversalNodeRadii)).toBeLessThanOrEqual(
      3,
    );
  }

  async expectMobileComposition(): Promise<void> {
    const layout = this.page.locator("[data-foundation-layout]");
    const map = layout.locator("[data-home-map]");
    const columns = await layout.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns,
    );
    expect(columns.split(" ")).toHaveLength(1);
    await expect(map.locator("[data-home-map-scene]")).toBeVisible();
    await expect(map.locator("[data-home-map-card]")).toHaveCount(4);
    await expect(map.locator("[data-map-node]")).toHaveCount(4);
    await expect(map.locator('[data-svg-pattern="preset"]')).toHaveCount(7);

    const fit = await map.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        left: bounds.left,
        right: bounds.right,
        viewportWidth: window.innerWidth,
      };
    });

    expect(fit.left).toBeGreaterThanOrEqual(-1);
    expect(fit.right).toBeLessThanOrEqual(fit.viewportWidth + 1);
  }

  async expectNoHorizontalOverflow(): Promise<void> {
    await expectNoHorizontalOverflow(this.page);
  }

  async expectStableReload(): Promise<void> {
    await this.page.reload();
    await this.expectPublishedMaterial();
  }

  async expectRemovedRouteNotFound(): Promise<void> {
    await this.page.goto("/removed-route");
    await expectPublicReleaseIdentity(this.page);
    await expect(this.page.locator("[data-route-state-frame]")).toBeVisible();
    await expect(this.page.getByRole("contentinfo")).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Страница не найдена" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "На стартовую страницу" }),
    ).toHaveAttribute("href", "/");
  }
}
