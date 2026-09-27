import { spawnSync } from "node:child_process";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { courseLessonPublications } from "~/entities/course";
import {
  findLessonByRouteSlug,
  integerProcessingLesson,
  lessonPublications,
} from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";
import {
  codeFromBlock,
  renderAuthoredLessonContent,
} from "./lesson-content-test-utils";

const anchors = [
  "integer-range",
  "divisibility-remainder",
  "decimal-digits",
  "divisors",
  "primes",
  "divisor-pairs",
  "decimal-mask",
  "bounded-search",
];

const authoredContent = [
  ...integerProcessingLesson.theory.map(({ explanation }) => explanation),
  integerProcessingLesson.examFocus,
  integerProcessingLesson.result,
];

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
  }: {
    children: React.ReactNode;
    to: string;
    params: Record<string, string>;
  }) => (
    <span
      data-link-href={to
        .replace("$courseSlug", params.courseSlug)
        .replace("$lessonSlug", params.lessonSlug)}
    >
      {children}
    </span>
  ),
}));

describe("task 25 integer processing lesson", () => {
  it("keeps the eight concepts in the authored teaching order", () => {
    expect(integerProcessingLesson.theory.map(({ id }) => id)).toEqual(anchors);
    expect(integerProcessingLesson).toMatchObject({
      id: "integer-processing",
      routeSlug: "25-obrabotka-celyh-chisel",
      taskNumbers: [25],
      status: "published",
      accessTier: "free",
      masteryThreshold: 0.8,
    });
    expect(integerProcessingLesson.examFocus).toBeDefined();
    expect(integerProcessingLesson.result).toBeDefined();
    expect(integerProcessingLesson.checkpoint).toHaveLength(10);
  });

  it("publishes the lesson through route, catalog, illustration and sitemap", () => {
    expect(findLessonByRouteSlug("25-obrabotka-celyh-chisel")).toBe(
      integerProcessingLesson,
    );
    expect(
      lessonPublications.find((lesson) => lesson.id === "integer-processing"),
    ).toMatchObject({
      routeSlug: "25-obrabotka-celyh-chisel",
      taskNumbers: [25],
      status: "published",
    });
    expect(
      topicCatalog.entries.find((entry) => entry.id === "integer-processing"),
    ).toMatchObject({
      taskNumbers: [25],
      title: "Обработка целых чисел",
      status: "published",
      routeSlug: "25-obrabotka-celyh-chisel",
      illustration: {
        src: "/images/topics/integer-processing.svg",
        width: 144,
        height: 88,
      },
    });
    expect(publicPaths).toContain("/ege/25-obrabotka-celyh-chisel");
  });

  it("links to published Python lessons and keeps word boundaries", () => {
    const html = renderAuthoredLessonContent(authoredContent).innerHTML.replace(
      /<pre\b[^>]*>[\s\S]*?<\/pre>/gu,
      "",
    );
    const hrefs = [...html.matchAll(/data-link-href="([^"]+)"/g)].map(
      (match) => match[1],
    );
    expect(hrefs).toContain("/courses/python/for-i-range");
    expect(hrefs).toContain("/courses/python/while");
    expect(hrefs).toContain("/courses/python/tsifry-chisla");
    expect(hrefs).toContain("/courses/python/spiski");
    expect(hrefs).toContain("/courses/python/chisla-i-vyrazheniya");
    for (const href of hrefs) {
      const routeSlug = href.split("/").at(-1);
      expect(
        courseLessonPublications.find(
          (lesson) => lesson.routeSlug === routeSlug,
        ),
      ).toMatchObject({ status: "published" });
    }

    const joinedAfterInline = [
      ...html.matchAll(/<\/(?:code|var|span|a|strong|em)>[А-Яа-яЁё]/gu),
    ];
    const joinedBeforeInline = [
      ...html.matchAll(/[А-Яа-яЁё:]<(?:code|var|span|a|strong|em)\b/gu),
    ].map((match) =>
      html.slice(Math.max(0, match.index - 80), match.index + 80),
    );
    expect(joinedAfterInline).toEqual([]);
    expect(joinedBeforeInline).toEqual([]);
    expect(
      renderToStaticMarkup(<div>{integerProcessingLesson.result}</div>),
    ).toContain("делители парами");
  });

  it("runs every complete Python example and matches its stated output", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const examples = [
      ["Вывести включительный отрезок от 4 до 8", "4\n5\n6\n7\n8"],
      ["Вывести числа от 10 до 20, делящиеся на 6", "12\n18"],
      ["Сложить цифры целого числа", "15"],
      ["Найти собственные делители числа", "[1, 2, 3, 6, 9]\n21"],
      ["Выбрать простые числа от 1 до 10", "[2, 3, 5, 7]"],
      [
        "Найти делители числа парами до квадратной границы",
        "[1, 36, 2, 18, 3, 12, 4, 9, 6]",
      ],
      [
        "Проверить обе части каждой пары и отобрать собственные делители",
        "[12, 8, 6]",
      ],
      [
        "Подставить две цифры в маску 2?? и проверить делимость на 25",
        "[200, 225, 250, 275]",
      ],
      ["Проверить маску 7*2 при верхней границе 800", "[72, 702, 792]"],
      [
        "Найти первые пять чисел от 100 до 1000 с тремя делителями",
        "[121, 169, 289, 361, 529]\n1469",
      ],
    ] as const;

    for (const [label, expected] of examples) {
      const result = spawnSync(
        "python3",
        ["-c", codeFromBlock(container, label)],
        { encoding: "utf8" },
      );
      expect(
        result.status,
        "Python example: " + label + ": " + result.stderr,
      ).toBe(0);
      expect(result.stdout.trim(), label).toBe(expected);
    }
  });

  it("keeps the authored pair search equivalent to full divisor enumeration", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const source = codeFromBlock(
      container,
      "Найти делители числа парами до квадратной границы",
    );
    expect(source).toContain("number = 36");

    for (const number of [1, 2, 36, 49, 50, 500_000, 1_000_000]) {
      const code = source.replace("number = 36", "number = " + number);
      const result = spawnSync("python3", ["-c", code], { encoding: "utf8" });
      expect(result.status, result.stderr).toBe(0);
      const actual = JSON.parse(result.stdout.trim()) as number[];
      const expected: number[] = [];
      for (let divisor = 1; divisor <= number; divisor += 1) {
        if (number % divisor === 0) expected.push(divisor);
      }
      expect(actual.length, String(number)).toBe(expected.length);
      expect(
        actual.sort((left, right) => left - right),
        String(number),
      ).toEqual(expected);
    }
  });

  it("checks the new filtered divisor and star-mask examples against direct enumeration", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const examples = [
      [
        "Проверить обе части каждой пары и отобрать собственные делители",
        Array.from({ length: 23 }, (_, index) => index + 1).filter(
          (divisor) => 24 % divisor === 0 && divisor > 5,
        ),
      ],
      [
        "Проверить маску 7*2 при верхней границе 800",
        Array.from({ length: 800 }, (_, index) => index + 1).filter(
          (number) => /^7\d*2$/u.test(String(number)) && number % 9 === 0,
        ),
      ],
    ] as const;

    for (const [label, expected] of examples) {
      const result = spawnSync(
        "python3",
        ["-c", codeFromBlock(container, label)],
        {
          encoding: "utf8",
        },
      );
      expect(result.status, result.stderr).toBe(0);
      const actual = JSON.parse(result.stdout.trim()) as number[];
      expect(actual.sort((left, right) => left - right)).toEqual(expected);
    }
  });
});
