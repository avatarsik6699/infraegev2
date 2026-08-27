import { describe, expect, it } from "vitest";
import {
  courseLessonPublications,
  coursePublications,
} from "~/entities/course";
import { lessonPublications } from "~/entities/lesson";
import { siteConfig } from "~/shared/config/site";
import { pageHead } from "~/shared/lib/seo";

describe("public release metadata", () => {
  it("exposes one release identity for public headers", () => {
    expect(siteConfig).toEqual(
      expect.objectContaining({
        name: "infraege",
        releaseLabel: "beta",
        version: "1.0.0",
        themeColor: "#ffffff",
        socialImagePath: "/brand/infraege-social.png",
        socialImageAlt: "infraege — подготовка к ЕГЭ по информатике",
      }),
    );
  });

  it("publishes complete lesson discovery metadata from one registry", () => {
    expect(lessonPublications).toEqual([
      expect.objectContaining({
        id: "rekursiya",
        routeSlug: "16-rekursiya",
        taskNumber: 16,
        title: "Рекурсивные алгоритмы",
        status: "published",
      }),
      expect.objectContaining({
        id: "preobrazovanie-zapisey-chisel",
        routeSlug: "5-preobrazovanie-zapisey-chisel",
        taskNumber: 5,
        title: "Преобразование записей чисел",
        status: "published",
      }),
    ]);
    expect(
      lessonPublications
        .filter((lesson) => lesson.status === "published")
        .map((lesson) => lesson.routeSlug),
    ).toEqual(["16-rekursiya", "5-preobrazovanie-zapisey-chisel"]);
    expect(new Set(lessonPublications.map((lesson) => lesson.id)).size).toBe(
      lessonPublications.length,
    );
    expect(
      new Set(lessonPublications.map((lesson) => lesson.routeSlug)).size,
    ).toBe(lessonPublications.length);
    expect(new Set(lessonPublications.map((lesson) => lesson.title)).size).toBe(
      lessonPublications.length,
    );
    expect(
      new Set(lessonPublications.map((lesson) => lesson.summary)).size,
    ).toBe(lessonPublications.length);
  });

  it("publishes the Python course and lesson discovery metadata together", () => {
    expect(coursePublications).toEqual([
      expect.objectContaining({
        id: "python",
        routeSlug: "python",
        status: "published",
      }),
    ]);
    expect(courseLessonPublications).toEqual([
      expect.objectContaining({
        id: "python-first-program",
        routeSlug: "pervaya-programma",
        status: "published",
      }),
    ]);
  });

  it("creates absolute canonical and social metadata", () => {
    const head = pageHead.create({
      title: "Проверочная страница — infraege",
      description: "Описание проверочной страницы.",
      path: "/check",
    });

    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${siteConfig.origin}/check`,
    });
    expect(head.meta).toContainEqual({
      property: "og:url",
      content: `${siteConfig.origin}/check`,
    });
    expect(head.meta).toContainEqual({
      name: "robots",
      content: "index,follow",
    });
    expect(head.meta).toContainEqual({
      property: "og:image",
      content: `${siteConfig.origin}${siteConfig.socialImagePath}`,
    });
    expect(head.meta).toContainEqual({
      name: "twitter:card",
      content: "summary_large_image",
    });
  });

  it("describes the site without inventing an organization", () => {
    expect(pageHead.createWebsiteStructuredData()).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "infraege",
      alternateName: "infraege.ru",
      url: "https://infraege.ru/",
      description: siteConfig.description,
      inLanguage: "ru",
    });
  });
});
