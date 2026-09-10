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
      this.page.getByText(
        "Готовьтесь к ЕГЭ через понимание: от первой строки кода до самостоятельного решения задач.",
      ),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Начать готовиться" }),
    ).toHaveAttribute("href", "/ege");
    await expect(
      this.page
        .getByRole("link", { name: "Темы", includeHidden: true })
        .first(),
    ).toHaveAttribute("href", /^\/ege\/?$/);
    await expect(
      this.page
        .getByRole("link", { name: "Мини-курсы", includeHidden: true })
        .first(),
    ).toHaveAttribute("href", /^\/courses\/?$/);
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
    ).toHaveCount(6);
    await expect(this.page.locator("[data-home-map]")).toBeVisible();
    await expect(this.page.locator("[data-home-ambient]")).toBeVisible();
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

  async openTopics(): Promise<void> {
    await this.page.getByRole("link", { name: "Темы" }).first().click();
    await expect(this.page).toHaveURL(/\/ege\/?$/);
  }

  async openCourses(): Promise<void> {
    await this.page.getByRole("link", { name: "Мини-курсы" }).first().click();
    await expect(this.page).toHaveURL(/\/courses\/?$/);
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
      name: "Начать готовиться",
    });
    await primaryAction.focus();
    const composition = await this.page
      .locator("[data-foundation-layout]")
      .evaluate((layout) => {
        const intro = layout.querySelector("[data-foundation-intro]");
        const visual = layout.querySelector("[data-foundation-visual]");
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
          leadWeight: Number.parseFloat(getComputedStyle(lead).fontWeight),
          actionWeight: Number.parseFloat(getComputedStyle(action).fontWeight),
        };
      });

    expect(composition.columns.split(" ")).toHaveLength(2);
    expect(composition.visualLeft).toBeGreaterThanOrEqual(
      composition.introRight,
    );
    expect(composition.mapWidth).toBeGreaterThan(composition.introWidth);
    expect(composition.actionOutline).toBe("solid");
    expect(composition.actionUnderline).toBe(true);
    expect(composition.actionArrow).toBe(true);
    expect(composition.headingFamily).not.toBe(composition.leadFamily);
    expect(composition.headingSize).toBeGreaterThan(composition.leadSize * 2.5);
    expect(composition.leadWeight).toBeLessThanOrEqual(400);
    expect(composition.actionWeight).toBeLessThanOrEqual(400);
  }

  async expectHomeChromePolish(): Promise<void> {
    const result = await this.page.evaluate(() => {
      const requiredElement = <ElementType extends Element>(
        root: ParentNode,
        selector: string,
      ): ElementType => {
        const element = root.querySelector<ElementType>(selector);
        if (!element)
          throw new Error(`Missing home chrome element: ${selector}`);
        return element;
      };
      const header = requiredElement<HTMLElement>(
        document,
        "[data-public-header]",
      );
      const wordmark = requiredElement<HTMLElement>(
        header,
        "[data-infraege-wordmark]",
      );
      const subtitle = requiredElement<HTMLElement>(
        header,
        "[data-infraege-subtitle]",
      );
      const benefits = requiredElement<HTMLElement>(
        header,
        "[data-infraege-benefits]",
      );
      const navLink = requiredElement<HTMLElement>(
        header,
        "a[data-hierarchy='drawn']",
      );
      const action = requiredElement<HTMLElement>(
        document,
        "main a[data-hierarchy='drawn']",
      );
      const actionLabel = requiredElement<HTMLElement>(action, "span");
      const underline = requiredElement<SVGElement>(
        action,
        "[data-action-underline]",
      );
      const arrow = requiredElement<SVGElement>(action, "[data-action-arrow]");
      const footer = requiredElement<HTMLElement>(document, "footer");
      const telegramLink = requiredElement<HTMLElement>(
        footer,
        "a[data-hierarchy='drawn'][target='_blank']",
      );
      const telegramIcon = requiredElement<SVGElement>(
        telegramLink,
        "[data-external-link-icon]",
      );
      const dots = [...benefits.querySelectorAll<HTMLElement>("i")];
      const words = [...benefits.querySelectorAll<HTMLElement>("span")];

      if (dots.length !== 2 || words.length !== 3) {
        throw new Error("Missing polished home chrome");
      }

      const wordmarkRect = wordmark.getBoundingClientRect();
      const subtitleRect = subtitle.getBoundingClientRect();
      const labelRect = actionLabel.getBoundingClientRect();
      const underlineRect = underline.getBoundingClientRect();
      const arrowRect = arrow.getBoundingClientRect();
      const wordCenters = words.map((word) => {
        const bounds = word.getBoundingClientRect();
        return bounds.top + bounds.height / 2;
      });
      const averageWordCenter =
        wordCenters.reduce((sum, center) => sum + center, 0) /
        wordCenters.length;
      const accentProbe = document.createElement("span");
      accentProbe.style.color = "var(--color-brand-orange)";
      document.body.append(accentProbe);
      const brandOrange = getComputedStyle(accentProbe).color;
      accentProbe.remove();

      return {
        brandGap: subtitleRect.top - wordmarkRect.bottom,
        dotOffsets: dots.map((dot) => {
          const bounds = dot.getBoundingClientRect();
          return Math.abs(bounds.top + bounds.height / 2 - averageWordCenter);
        }),
        navWeight: Number.parseFloat(getComputedStyle(navLink).fontWeight),
        underlineGap: underlineRect.top - labelRect.bottom,
        arrowGap: arrowRect.left - labelRect.right,
        footerBrandCount: [...footer.querySelectorAll("span")].filter(
          (element) => element.textContent === "infraege",
        ).length,
        telegramHasDrawnUnderline: Boolean(
          telegramLink.querySelector("[data-link-underline]"),
        ),
        telegramIconColor: getComputedStyle(telegramIcon).color,
        brandOrange,
      };
    });

    expect(result.brandGap).toBeGreaterThanOrEqual(4);
    expect(Math.max(...result.dotOffsets)).toBeLessThanOrEqual(1.5);
    expect(result.navWeight).toBeLessThanOrEqual(400);
    expect(result.underlineGap).toBeGreaterThanOrEqual(0);
    expect(result.underlineGap).toBeLessThanOrEqual(3);
    expect(result.arrowGap).toBeGreaterThanOrEqual(0);
    expect(result.arrowGap).toBeLessThanOrEqual(10);
    expect(result.footerBrandCount).toBe(0);
    expect(result.telegramHasDrawnUnderline).toBe(true);
    expect(result.telegramIconColor).toBe(result.brandOrange);
  }

  async expectDesktopMapFitsViewport(): Promise<void> {
    const geometry = await this.page
      .locator("[data-home-map]")
      .evaluate((map) => {
        const bounds = map.getBoundingClientRect();
        return {
          bottom: bounds.bottom,
          top: bounds.top,
          contentBottom: document.querySelector("main")!.getBoundingClientRect()
            .bottom,
        };
      });

    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.contentBottom + 1);
    expect(
      await this.page.evaluate(
        () => document.documentElement.scrollHeight - innerHeight,
      ),
    ).toBeLessThanOrEqual(1);
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

    await expect(
      this.page.locator("[data-home-ambient] [data-svg-pattern='field']"),
    ).toHaveCount(6);
    await expect(
      this.page.locator("[data-pattern-name='home-perspective-grid']"),
    ).toHaveCount(1);
    await expect(this.page.locator("[data-home-ambient]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    const gridStroke = await this.page
      .locator("[data-pattern-name='home-perspective-grid'] pattern path")
      .evaluate((path) => getComputedStyle(path).stroke);
    expect(gridStroke).not.toBe("none");
    await expect(map.locator('[data-map-node="progress"] circle')).toHaveCount(
      4,
    );
    await expect(map.locator('[data-map-node="progress"]')).toHaveText("72%");

    await expect(map.locator('[data-svg-pattern="field"]')).toHaveCount(14);
    await expect(map.locator("[data-pattern-grid-relief] ellipse")).toHaveCount(
      7,
    );
    await expect(
      map.locator('[data-map-background-patterns] [data-svg-pattern="preset"]'),
    ).toHaveCount(7);
    await expect(
      map.locator(
        '[data-map-background-patterns] [data-svg-pattern="strokes"]',
      ),
    ).toHaveCount(5);
    await expect(
      map.locator("[data-map-layout=wide] [data-map-connection]"),
    ).toHaveCount(3);
    await expect(
      map.locator("[data-map-layout=wide] [data-map-peripheral-connection]"),
    ).toHaveCount(9);
    await expect(
      map.locator("[data-map-layout=wide] [data-target-kind='card']"),
    ).toHaveCount(4);
    await expect(
      map.locator("[data-map-layout=wide] [data-target-kind='cycle']"),
    ).toHaveCount(1);
    await expect(
      map.locator("[data-map-layout=wide] [data-target-kind='pattern']"),
    ).toHaveCount(4);
    await expect(
      map.locator("[data-map-peripheral-connection='traversal-pattern']"),
    ).toHaveCount(0);
    await expect(map.locator("[data-connection-endpoint]")).toHaveCount(0);
    await expect(
      map.locator('[data-map-layout=wide] [data-svg-drawing="arrow"]'),
    ).toHaveCount(9);
    await expect(
      map.locator('[data-map-layout=wide] [data-svg-drawing="arrow-head"]'),
    ).toHaveCount(9);
    await expect(
      map.locator(
        '[data-map-layout=wide] [data-svg-drawing="arrow"] > [data-svg-drawing="line"]',
      ),
    ).toHaveCount(4);
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
    await expect(map.locator("[data-icon-name='check']")).toHaveCount(2);
    expect(await map.locator("mask[id^='svg-pattern-mask-']").count()).toBe(14);
    await expect(map.locator("image, [mask*='dry-ink']")).toHaveCount(0);
    await expect(map.locator("[data-pattern-name='recursion']")).toHaveCount(0);
    await expect(map.locator("[data-pattern-name='graph']")).toHaveCount(0);
    await expect(map.locator("[data-pattern-name='truthTable']")).toHaveCount(
      1,
    );
    await expect(map.locator("[data-pattern-name='traversal']")).toHaveCount(1);

    const patternTransforms = await map
      .locator('[data-map-background-patterns] [data-svg-pattern="preset"]')
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
        "[data-map-node='progress'] circle",
      );
      const number = practice?.querySelector("[data-stage-number]");
      const title = practice?.querySelector("[data-stage-title]");
      const check = practice?.querySelector("[data-stage-check]");

      if (
        !(number instanceof SVGTextElement) ||
        !(title instanceof SVGTextElement) ||
        !(check instanceof SVGSVGElement) ||
        !(activeSurface instanceof SVGRectElement) ||
        !(progressSurface instanceof SVGCircleElement)
      ) {
        throw new Error("Missing learning-map stage structure");
      }

      const titleBounds = title.getBBox();
      const checkX = Number(check.getAttribute("x"));
      const checkWidth = Number(check.getAttribute("width"));
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
        titleCheckGap: checkX - (titleBounds.x + titleBounds.width),
        checkRightPadding:
          Number(stageSurface.getAttribute("width")) - (checkX + checkWidth),
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
    expect(visualHierarchy.progressFill).toContain("paper-surface");
    expect(visualHierarchy.activeFill).toContain("active-stage-surface");
    expect(Math.max(...visualHierarchy.traversalNodeRadii)).toBeLessThanOrEqual(
      3,
    );

    const connectionStyles = await map
      .locator(
        "[data-map-layout=wide] [data-map-connection] [data-connection-layer='base'] path",
      )
      .evaluateAll((connections) =>
        connections.map((connection) => ({
          d: connection.getAttribute("d"),
          linecap: getComputedStyle(connection).strokeLinecap,
          stroke: getComputedStyle(connection).stroke,
          strokeWidth: getComputedStyle(connection).strokeWidth,
          vectorEffect: getComputedStyle(connection).vectorEffect,
        })),
      );
    expect(
      new Set(connectionStyles.map(({ strokeWidth }) => strokeWidth)),
    ).toEqual(new Set(["2.9px"]));
    expect(connectionStyles.every(({ linecap }) => linecap === "round")).toBe(
      true,
    );
    expect(
      connectionStyles.every(({ stroke }) => stroke.includes("url(")),
    ).toBe(true);
    expect(connectionStyles.every(({ d }) => d?.includes(" C "))).toBe(true);
    expect(
      connectionStyles.every(({ vectorEffect }) => vectorEffect === "none"),
    ).toBe(true);

    const satelliteStyles = await map
      .locator("[data-map-layout=wide] [data-map-peripheral-connection]")
      .evaluateAll((connections) =>
        connections.map((connection) => {
          const shaft = connection.querySelector('[data-svg-drawing="line"]');
          const semanticShaft = connection.querySelector(
            '[data-svg-drawing-part="shaft"] [data-svg-drawing="line"]',
          );
          const head = connection.querySelector(
            '[data-map-layout=wide] [data-svg-drawing="arrow-head"]',
          );
          if (
            !(shaft instanceof SVGPathElement) ||
            !(semanticShaft instanceof SVGPathElement) ||
            !(head instanceof SVGPathElement)
          ) {
            throw new Error("Missing satellite connection geometry");
          }
          const arrow = connection.querySelector(
            '[data-map-layout=wide] [data-svg-drawing="arrow"]',
          );
          const shaftEnd = semanticShaft.getPointAtLength(
            semanticShaft.getTotalLength(),
          );
          const headTip = head.getPointAtLength(0);
          return {
            dashArray: getComputedStyle(semanticShaft).strokeDasharray,
            headFill: getComputedStyle(head).fill,
            headIsTopLayer: arrow?.lastElementChild === head,
            kind: connection.getAttribute("data-target-kind"),
            shaftInset: Math.hypot(
              headTip.x - shaftEnd.x,
              headTip.y - shaftEnd.y,
            ),
            shaftStroke: getComputedStyle(semanticShaft).stroke,
            shaftWidth: Number.parseFloat(
              getComputedStyle(semanticShaft).strokeWidth,
            ),
            vectorEffect: getComputedStyle(semanticShaft).vectorEffect,
          };
        }),
      );
    expect(satelliteStyles.every(({ dashArray }) => dashArray !== "none")).toBe(
      true,
    );
    expect(satelliteStyles.every(({ headFill }) => headFill !== "none")).toBe(
      true,
    );
    expect(satelliteStyles.every(({ headIsTopLayer }) => headIsTopLayer)).toBe(
      true,
    );
    expect(
      satelliteStyles.every(
        ({ shaftInset }) => shaftInset >= 6.5 && shaftInset <= 9,
      ),
    ).toBe(true);
    expect(
      satelliteStyles.every(({ shaftStroke }) => shaftStroke.includes("url(")),
    ).toBe(true);
    expect(
      satelliteStyles.every(({ vectorEffect }) => vectorEffect === "none"),
    ).toBe(true);
    expect(
      Math.max(
        ...satelliteStyles
          .filter(({ kind }) => kind === "pattern")
          .map(({ shaftWidth }) => shaftWidth),
      ),
    ).toBeLessThan(
      Math.min(
        ...satelliteStyles
          .filter(({ kind }) => kind === "card")
          .map(({ shaftWidth }) => shaftWidth),
      ),
    );

    await expect(
      map.locator(
        "[data-map-layout=wide] [data-home-motion='connection-flow']",
      ),
    ).toHaveCount(3);
    await expect(
      map.locator(
        "[data-map-layout=wide] [data-home-motion='peripheral-flow']",
      ),
    ).toHaveCount(9);
    await expect(map.locator("[data-home-motion='card-border']")).toHaveCount(
      4,
    );
    await expect(map.locator("[data-home-motion='stage-border']")).toHaveCount(
      3,
    );
    await expect(
      map.locator("[data-home-motion='progress-border']"),
    ).toHaveCount(1);

    const borderPaints = await map.evaluate((mapRoot) => {
      const active = getComputedStyle(
        mapRoot.querySelector<SVGElement>(
          "[data-map-node='tasks-stage'] [data-home-motion='stage-border']",
        )!,
      );
      const card = getComputedStyle(
        mapRoot.querySelector<SVGElement>(
          "[data-home-map-card='theory'] [data-home-motion='card-border']",
        )!,
      );

      return {
        active: active.stroke,
        card: card.stroke,
        completed: getComputedStyle(
          mapRoot.querySelector<SVGElement>(
            "[data-map-node='theory-stage'] [data-home-motion='stage-border']",
          )!,
        ).stroke,
        progress: getComputedStyle(
          mapRoot.querySelector<SVGElement>(
            "[data-home-motion='progress-border']",
          )!,
        ).stroke,
      };
    });
    expect(borderPaints.card).toContain("motion-border-neutral");
    expect(borderPaints.completed).toContain("motion-border-neutral");
    expect(borderPaints.active).toContain("motion-border-accent");
    expect(borderPaints.progress).toContain("motion-border-accent");
  }

  async expectDecorativeMotion(active: boolean): Promise<void> {
    const layout = this.page.locator("[data-foundation-layout]");
    const motionLayers = this.page.locator(
      "[data-home-motion='connection-flow'] path, [data-home-motion='card-border']",
    );

    if (active) {
      await expect(layout).toHaveAttribute("data-motion-active", "true");
    } else {
      await expect(layout).not.toHaveAttribute("data-motion-active", "true");
    }

    const states = await motionLayers.evaluateAll((layers) =>
      layers.map((layer) => ({
        animationName: getComputedStyle(layer).animationName,
        playState: getComputedStyle(layer).animationPlayState,
      })),
    );

    expect(states.length).toBeGreaterThan(0);
    if (active) {
      expect(
        states.every(({ animationName }) => animationName !== "none"),
      ).toBe(true);
      expect(
        states.every(({ playState }) =>
          playState.split(",").every((state) => state.trim() === "running"),
        ),
      ).toBe(true);
      return;
    }

    expect(
      states.every(
        ({ animationName, playState }) =>
          animationName === "none" || playState === "paused",
      ),
    ).toBe(true);
  }

  async expectReducedMotionFallback(): Promise<void> {
    const motionLayers = this.page.locator(
      "[data-home-motion='connection-flow'] path, [data-home-motion='card-border']",
    );
    const animationNames = await motionLayers.evaluateAll((layers) =>
      layers.map((layer) => getComputedStyle(layer).animationName),
    );

    expect(animationNames.length).toBeGreaterThan(0);
    expect(animationNames.every((name) => name === "none")).toBe(true);
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
    await expect(
      map.locator('[data-map-background-patterns] [data-svg-pattern="preset"]'),
    ).toHaveCount(7);

    const fit = await map.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const scene = element.querySelector("[data-home-map-scene]");
      const central = element.querySelector("[data-map-connection] path");
      const shaft = element.querySelector(
        "[data-target-kind='card'] [data-svg-drawing-part='shaft'] path",
      );
      const head = element.querySelector(
        "[data-target-kind='card'] [data-svg-drawing='arrow-head']",
      );
      if (
        !(scene instanceof SVGSVGElement) ||
        !(central instanceof SVGPathElement) ||
        !(shaft instanceof SVGPathElement) ||
        !(head instanceof SVGPathElement)
      ) {
        throw new Error("Missing mobile connector geometry");
      }
      const scale = scene.getScreenCTM()?.a ?? 0;
      const headBounds = head.getBBox();
      const headScreenSize =
        Math.max(headBounds.width, headBounds.height) * scale;
      const shaftScreenWidth =
        Number(shaft.getAttribute("stroke-width")) * scale;
      return {
        centralScreenWidth:
          Number(central.getAttribute("stroke-width")) * scale,
        connectorRatio: shaftScreenWidth / headScreenSize,
        connectorVectorEffect: getComputedStyle(shaft).vectorEffect,
        left: bounds.left,
        right: bounds.right,
        viewportWidth: window.innerWidth,
      };
    });

    expect(fit.left).toBeGreaterThanOrEqual(-1);
    expect(fit.right).toBeLessThanOrEqual(fit.viewportWidth + 1);
    expect(fit.centralScreenWidth).toBeLessThanOrEqual(1.2);
    expect(fit.connectorRatio).toBeGreaterThanOrEqual(0.22);
    expect(fit.connectorRatio).toBeLessThanOrEqual(0.28);
    expect(fit.connectorVectorEffect).toBe("none");
    const composition = await map.evaluate((element) => {
      const mapBounds = element.getBoundingClientRect();
      return [
        ...element.querySelectorAll<SVGGraphicsElement>(
          "[data-home-map-card], [data-map-node]",
        ),
      ].map((node) => {
        const bounds = node.getBoundingClientRect();
        return {
          circular: node.getAttribute("data-map-node") === "progress",
          width: bounds.width,
          contained:
            bounds.left >= mapBounds.left - 1 &&
            bounds.right <= mapBounds.right + 1 &&
            bounds.top >= mapBounds.top - 1 &&
            bounds.bottom <= mapBounds.bottom + 1,
        };
      });
    });
    expect(composition.every((node) => node.contained)).toBe(true);
    for (const node of composition) {
      expect(node.width).toBeGreaterThanOrEqual(node.circular ? 48 : 90);
    }
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
      this.page.getByRole("link", { name: "На главную", exact: true }),
    ).toHaveAttribute("href", "/");
  }
}
