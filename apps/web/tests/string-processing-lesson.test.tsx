import { spawnSync } from "node:child_process";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { courseLessonPublications } from "~/entities/course";
import {
  findLessonByRouteSlug,
  lessonPublications,
  stringProcessingLesson,
} from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";
import {
  codeFromBlock,
  renderAuthoredLessonContent,
} from "./lesson-content-test-utils";

const anchors = [
  "file-and-string",
  "positions-and-fragments",
  "adjacent-and-overlapping",
  "longest-valid-run",
  "occurrence-limit",
  "expression-grammar",
  "linear-expression-scan",
  "independent-verification",
];

const authoredContent = [
  ...stringProcessingLesson.theory.map(({ explanation }) => explanation),
  stringProcessingLesson.examFocus,
  stringProcessingLesson.result,
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

describe("task 24 string processing lesson", () => {
  it("keeps all concepts in the planned teaching order", () => {
    expect(stringProcessingLesson.theory.map(({ id }) => id)).toEqual(anchors);
    expect(stringProcessingLesson).toMatchObject({
      id: "string-processing",
      routeSlug: "24-obrabotka-simvolnyh-strok",
      taskNumbers: [24],
      status: "published",
      accessTier: "free",
      masteryThreshold: 0.8,
    });
    expect(stringProcessingLesson.examFocus).toBeDefined();
    expect(stringProcessingLesson.result).toBeDefined();
    expect(stringProcessingLesson.checkpoint?.length).toBeGreaterThan(0);
  });

  it("publishes the lesson through route, catalog and sitemap", () => {
    expect(findLessonByRouteSlug("24-obrabotka-simvolnyh-strok")).toBe(
      stringProcessingLesson,
    );
    expect(
      lessonPublications.find((lesson) => lesson.id === "string-processing"),
    ).toMatchObject({ status: "published" });
    expect(
      topicCatalog.entries.find((entry) => entry.id === "string-processing"),
    ).toMatchObject({
      status: "published",
      taskNumbers: [24],
      routeSlug: "24-obrabotka-simvolnyh-strok",
      illustration: {
        src: "/images/topics/string-processing.svg",
        width: 144,
        height: 88,
      },
    });
    expect(publicPaths).toContain("/ege/24-obrabotka-simvolnyh-strok");
  });

  it("links only to published Python lessons and keeps word boundaries", () => {
    const html = renderAuthoredLessonContent(authoredContent).innerHTML.replace(
      /<pre\b[^>]*>[\s\S]*?<\/pre>/gu,
      "",
    );
    const hrefs = [...html.matchAll(/data-link-href="([^"]+)"/g)].map(
      (match) => match[1],
    );
    expect(hrefs).toContain("/courses/python/stroki");
    expect(hrefs).toContain("/courses/python/fayly");
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
    ].map((match) =>
      html.slice(Math.max(0, match.index - 80), match.index + 80),
    );
    const joinedBeforeInline = [
      ...html.matchAll(/[А-Яа-яЁё:]<(?:code|var|span|a|strong|em)\b/gu),
    ].map((match) =>
      html.slice(Math.max(0, match.index - 80), match.index + 80),
    );
    expect(joinedAfterInline).toEqual([]);
    expect(joinedBeforeInline).toEqual([]);
    expect(
      renderToStaticMarkup(<div>{stringProcessingLesson.result}</div>),
    ).toContain("строк");
  });

  it("runs each complete Python example with its stated result", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const examples = [
      ["Прочитать текст и убрать перевод строки по краям", "АБА-В"],
      ["Взять три символа по индексам", "БВГ"],
      ["Посчитать соседние вхождения с перекрытием", "2"],
      ["Найти самый длинный участок из разрешённой буквы", "3"],
      ["Найти длинное окно с ограниченным числом пар", "5"],
      ["За один проход найти длину завершённого выражения", "6"],
      ["Отдельно проверить грамматику короткого выражения", "True\nFalse"],
    ] as const;

    for (const [label, expected] of examples) {
      const result = spawnSync(
        "python3",
        ["-c", codeFromBlock(container, label)],
        {
          encoding: "utf8",
        },
      );
      expect(result.status, `${label}: ${result.stderr}`).toBe(0);
      expect(result.stdout.trim(), label).toBe(expected);
    }

    const grammar = spawnSync(
      "python3",
      ["-c", codeFromBlock(container, "Сверить примеры с правилом")],
      { encoding: "utf8" },
    );
    expect(grammar.status, grammar.stderr).toBe(0);
    expect(grammar.stdout).toContain("7-0 True");
    expect(grammar.stdout).toContain("07 False");
  });

  it("keeps complete expression boundaries when scanning a short string", () => {
    const scanner = codeFromBlock(
      renderAuthoredLessonContent(authoredContent),
      "За один проход найти длину завершённого выражения",
    );
    for (const [input, expected] of [
      ["7-0", "3"],
      ["07-6", "3"],
      ["6--7", "1"],
      ["7*", "1"],
      ["00", "1"],
      ["-0*7", "3"],
      ["8-09", "3"],
    ] as const) {
      const code = scanner.replace(
        /^text = .*\n/u,
        `text = ${JSON.stringify(input)}\n`,
      );
      const result = spawnSync("python3", ["-c", code], { encoding: "utf8" });
      expect(result.status, `${input}: ${result.stderr}`).toBe(0);
      expect(result.stdout.trim(), input).toBe(expected);
    }
  });
});
