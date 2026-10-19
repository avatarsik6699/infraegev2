import { spawnSync } from "node:child_process";
import { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  divisorsAndMasksLesson,
  findLessonByRouteSlug,
  lessonPublications,
  lessonSubtopics,
} from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import {
  renderAuthoredLessonContent,
  topicMedia,
  wholeLesson,
} from "./lesson-content-test-utils";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

// Change 192: the paid subtopics live in their own modules.
const lesson = await wholeLesson(divisorsAndMasksLesson);
const lessonMedia = topicMedia("divisors-and-masks");
const authoredContent = [
  ...lesson.theory.map(({ explanation }) => explanation),
  lesson.examFocus,
  lesson.result,
];

type Piece =
  | { kind: "code"; language: string; code: string; output?: string }
  | { kind: "text"; text: string };

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: React.ReactNode }>(node))
    return textOf(node.props.children);
  return "";
}

/** Code blocks and paragraphs of authored content, in page order. */
function pieces(node: React.ReactNode, out: Piece[] = []): Piece[] {
  if (Array.isArray(node)) {
    for (const child of node) pieces(child, out);
    return out;
  }
  if (!isValidElement<Record<string, unknown>>(node)) return out;
  if (node.type === CodeBlock) {
    const props = node.props as {
      code: string;
      language: string;
      output?: string;
    };
    out.push({
      kind: "code",
      language: props.language,
      code: props.code,
      output: props.output,
    });
    return out;
  }
  if (node.type === Typography.Text) {
    out.push({ kind: "text", text: textOf(node.props.children as never) });
    return out;
  }
  return pieces(node.props.children as React.ReactNode, out);
}

/** A complete definition, not a one-line fragment shown for explanation. */
function compiles(code: string): boolean {
  const check = spawnSync(
    "python3",
    ["-I", "-c", "import sys; compile(sys.stdin.read(), 'block', 'exec')"],
    { input: code, encoding: "utf8" },
  );
  return check.status === 0;
}

describe("task 25 divisors and masks lesson", () => {
  it("has five core subtopics, one advanced and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "divisors-and-masks",
      routeSlug: "25-deliteli-i-maski",
      title: "Обработка целочисленной информации",
      taskNumbers: [25],
      status: "published",
      masteryThreshold: 0.8,
    });
    const subtopics = lessonSubtopics(lesson);
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["perebor-i-proverki", "core"],
      ["deliteli-parami", "core"],
      ["chisla-po-delitelyam", "core"],
      ["prostye-i-razlozhenie", "core"],
      ["maski", "core"],
      ["vid-chisla", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      1, 4, 1, 1, 1, 0,
    ]);
    expect(lesson.examFocus).toBeDefined();
    expect(lesson.result).toBeDefined();
  });

  it("replaces the retired topic 25 lesson without a redirect", () => {
    expect(findLessonByRouteSlug("25-deliteli-i-maski")).toBe(
      divisorsAndMasksLesson,
    );
    expect(findLessonByRouteSlug("25-obrabotka-celyh-chisel")).toBeUndefined();
    expect(
      lessonPublications.filter(({ taskNumbers }) => taskNumbers.includes(25)),
    ).toEqual([expect.objectContaining({ id: "divisors-and-masks" })]);
    expect(
      topicCatalog.entries.find((entry) => entry.taskNumbers.includes(25)),
    ).toMatchObject({
      id: "divisors-and-masks",
      routeSlug: "25-deliteli-i-maski",
      status: "published",
    });
    expect(publicPaths).toContain("/ege/25-deliteli-i-maski/vid-chisla");
    expect(publicPaths).toContain("/ege/25-deliteli-i-maski/praktika");
    expect(
      publicPaths.filter((path) => path.includes("obrabotka-celyh-chisel")),
    ).toEqual([]);
  });

  it("runs every program that shows its output and gets that output", () => {
    // The same rule as scripts/lesson_design/verify_code.py: a Python block
    // with its output under the code; earlier complete functions are kept.
    let prelude = "from math import isqrt\nfrom fnmatch import fnmatch\n";
    let ran = 0;
    for (const piece of pieces(authoredContent)) {
      if (piece.kind !== "code" || piece.language !== "python") continue;
      if (piece.output !== undefined && piece.code.includes("print")) {
        const result = spawnSync(
          "python3",
          ["-I", "-c", prelude + piece.code],
          { encoding: "utf8" },
        );
        expect(result.status, result.stderr).toBe(0);
        expect(result.stdout.trim(), piece.code).toBe(piece.output.trim());
        ran += 1;
      }
      if (
        /^def /mu.test(piece.code) &&
        !piece.code.includes("print") &&
        compiles(piece.code)
      )
        prelude += piece.code + "\n";
    }
    expect(ran).toBeGreaterThanOrEqual(35);
    // About forty Python processes, one of them a 10⁷ search over multiples.
  }, 60_000);

  it("keeps spaces around inline code, links and emphasis", () => {
    const html = renderAuthoredLessonContent(authoredContent).innerHTML.replace(
      /<pre\b[^>]*>[\s\S]*?<\/pre>/gu,
      "",
    );
    expect([...html.matchAll(/<\/(?:code|var|a|strong)>[А-Яа-яЁё]/gu)]).toEqual(
      [],
    );
    expect([...html.matchAll(/[А-Яа-яЁё]<(?:code|var|a|strong)\b/gu)]).toEqual(
      [],
    );
  });

  it("uses every generated figure once, with the compact-form blocks", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const media = Object.values(lessonMedia);
    const diagrams = media.filter((item) => item.kind === "diagram");
    const steppers = media.filter((item) => item.kind === "stepper");
    expect(
      [
        ...container.querySelectorAll(
          'figure[data-lesson-diagram] > div > [role="img"]',
        ),
      ].map((picture) => picture.getAttribute("aria-label")),
    ).toEqual(expect.arrayContaining(diagrams.map(({ alt }) => alt)));
    expect(
      container.querySelectorAll("figure[data-lesson-diagram]"),
    ).toHaveLength(diagrams.length);
    expect(
      container.querySelectorAll("figure[data-lesson-stepper]"),
    ).toHaveLength(steppers.length);
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("[data-mask-sandbox]")).toHaveLength(1);
    expect(
      container.querySelectorAll("[data-remainder-explorer]"),
    ).toHaveLength(1);
    expect(container.querySelectorAll("[data-topic-cheat-sheet]")).toHaveLength(
      1,
    );
    expect(
      container.querySelectorAll("[data-variant-picker]").length,
    ).toBeGreaterThanOrEqual(12);
    expect(
      container.querySelectorAll("[data-python-term]").length,
    ).toBeGreaterThanOrEqual(15);
    expect(
      container.querySelectorAll("details[data-proof-disclosure]").length,
    ).toBeGreaterThan(0);
    // One reading flow: no boxed callouts or right/wrong comparisons.
    expect(container.querySelectorAll("aside, [role='note']")).toHaveLength(0);
  });
});
