import { spawnSync } from "node:child_process";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { courseLessonPublications } from "~/entities/course";
import {
  findLessonByRouteSlug,
  lessonPublications,
  numberSequencesLesson,
} from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";

const courseLessonPaths = [
  "/courses/python/schetchiki-i-nakopiteli",
  "/courses/python/spiski",
  "/courses/python/fayly",
  "/courses/python/otbor-rezultata",
];

const authoredContent = [
  ...numberSequencesLesson.theory.map(({ explanation }) => explanation),
  numberSequencesLesson.examFocus,
  numberSequencesLesson.result,
];

function renderAuthoredContent() {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(
    <div>
      {authoredContent.map((content, index) => (
        <div key={index}>{content}</div>
      ))}
    </div>,
  );
  return container;
}

function codeFromBlock(container: HTMLElement, label: string) {
  const block = [...container.querySelectorAll('[role="group"]')].find(
    (element) => element.getAttribute("aria-label") === label,
  );
  expect(block, `Code block: ${label}`).toBeDefined();
  const lines = [...block!.querySelectorAll("pre > code > span")];
  expect(lines.length, `Code lines: ${label}`).toBeGreaterThan(0);
  return lines
    .map(
      (line) =>
        line.lastElementChild?.textContent?.replace(/\u00a0/gu, "") ?? "",
    )
    .join("\n");
}

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

describe("task 17 number sequences lesson", () => {
  it("keeps the six authored theory anchors in the agreed order", () => {
    expect(numberSequencesLesson.theory.map(({ id }) => id)).toEqual([
      "sequence-from-file",
      "single-values",
      "neighbor-pairs",
      "neighbor-triples",
      "two-passes",
      "verify-boundaries",
    ]);
    expect(numberSequencesLesson).toMatchObject({
      id: "number-sequences",
      routeSlug: "17-chislovye-posledovatelnosti",
      taskNumbers: [17],
      status: "published",
      accessTier: "free",
      masteryThreshold: 0.8,
    });
    expect(numberSequencesLesson.examFocus).toBeDefined();
    expect(numberSequencesLesson.checkpoint).toHaveLength(5);
    expect(numberSequencesLesson.result).toBeDefined();
  });

  it("publishes the lesson through its route, topic catalog and sitemap paths", () => {
    expect(findLessonByRouteSlug("17-chislovye-posledovatelnosti")).toBe(
      numberSequencesLesson,
    );
    expect(
      lessonPublications.find((lesson) => lesson.id === "number-sequences"),
    ).toMatchObject({
      routeSlug: "17-chislovye-posledovatelnosti",
      status: "published",
    });
    expect(
      topicCatalog.entries.find((entry) => entry.id === "number-sequences"),
    ).toMatchObject({
      taskNumbers: [17],
      status: "published",
    });
    expect(
      topicCatalog.entries.find((entry) => entry.id === "number-sequences"),
    ).toHaveProperty("routeSlug", "17-chislovye-posledovatelnosti");
    expect(publicPaths).toContain("/ege/17-chislovye-posledovatelnosti");
  });

  it("renders ordinary links only to the four published Python lessons", () => {
    const authoredContent = [
      ...numberSequencesLesson.theory.map((block) => block.explanation),
      numberSequencesLesson.examFocus,
      numberSequencesLesson.result,
    ];
    const html = renderToStaticMarkup(
      <div>
        {authoredContent.map((content, index) => (
          <div key={index}>{content}</div>
        ))}
      </div>,
    );
    const hrefs = [...html.matchAll(/data-link-href="([^"]+)"/g)].map(
      (match) => match[1],
    );
    const uniqueHrefs = [...new Set(hrefs)];

    expect(uniqueHrefs).toEqual(expect.arrayContaining(courseLessonPaths));
    expect(uniqueHrefs.every((href) => courseLessonPaths.includes(href))).toBe(
      true,
    );
    for (const path of courseLessonPaths) {
      const routeSlug = path.split("/").at(-1);
      expect(
        courseLessonPublications.find(
          (lesson) => lesson.routeSlug === routeSlug,
        ),
      ).toMatchObject({ status: "published" });
    }
    expect(html).toContain("Среднее арифметическое");
    expect(html.toLowerCase()).toContain("последняя тройка");
  });

  it("teaches strict middle-of-triple checks and traces both two-pass outcomes", () => {
    const html = renderToStaticMarkup(
      <div>
        {numberSequencesLesson.theory.map((block) => (
          <div key={block.id}>{block.explanation}</div>
        ))}
      </div>,
    );

    expect(html).toContain("numbers.txt");
    expect(html).toContain("левое число лежит под индексом");
    expect(html).toContain("Строгое сравнение не проходит");
    expect(html).toContain("сумма (4, 0) равна 4");
    expect(html).toContain("Программа напечатает");
  });

  it("preserves spaces between inline components and following Russian words", () => {
    const html = renderAuthoredContent().innerHTML.replace(
      /<pre\b[^>]*>[\s\S]*?<\/pre>/gu,
      "",
    );
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
    const resultText = renderToStaticMarkup(
      <div>{numberSequencesLesson.result}</div>,
    ).replace(/<[^>]*>/gu, "");

    expect(joinedAfterInline).toEqual([]);
    expect(joinedBeforeInline).toEqual([]);
    expect(resultText).toContain(
      "отбор результата объясняют нужные Python-приёмы",
    );
  });

  it("runs each complete Python example with its explained output", () => {
    const container = renderAuthoredContent();
    const examples = [
      ["Подсчёт отдельных чисел по условию", "2"],
      ["Перебрать все соседние пары", "3"],
      ["Перебрать соседние тройки", "3"],
      ["Сравнить середину тройки с обоими соседями", "2"],
      ["Сначала найти среднее, потом проверить пары", "2"],
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
  });

  it("runs the second-pass exercise after filling its stated condition", () => {
    const code = codeFromBlock(
      renderAuthoredContent(),
      "Дополнить условие второго прохода",
    );
    const result = spawnSync(
      "python3",
      ["-c", code.replace("if ...:", "if pair_sum > average:")],
      { encoding: "utf8" },
    );

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout.trim()).toBe("1");
  });
});
