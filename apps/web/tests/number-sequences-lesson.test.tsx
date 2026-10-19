import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  numberSequencesLesson,
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
const lesson = await wholeLesson(numberSequencesLesson);
const lessonMedia = topicMedia("number-sequences");
const FILES = resolve(process.cwd(), "../..", "content/lesson-files/topic-17");
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

describe("task 17 number sequences lesson (Change 184)", () => {
  it("has six core subtopics, two advanced and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "number-sequences",
      routeSlug: "17-chislovye-posledovatelnosti",
      title: "Обработка числовой последовательности",
      taskNumbers: [17],
      status: "published",
      masteryThreshold: 0.8,
    });
    const subtopics = lessonSubtopics(lesson);
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["chisla-i-proverki", "core"],
      ["skolko-podhodit", "core"],
      ["cifry-i-znak", "core"],
      ["sosednie-gruppy", "core"],
      ["vsya-posledovatelnost", "core"],
      ["chto-proveryat-i-vyvodit", "core"],
      ["treugolniki", "advanced"],
      ["lyubye-pary", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      4, 7, 6, 1, 3, 0, 4, 1,
    ]);
    expect(lesson.examFocus).toBeDefined();
    expect(lesson.result).toBeDefined();
  });

  it("is the lesson of the catalog topic of task 17", () => {
    expect(findLessonByRouteSlug("17-chislovye-posledovatelnosti")).toBe(
      numberSequencesLesson,
    );
    expect(
      lessonPublications.filter(({ taskNumbers }) => taskNumbers.includes(17)),
    ).toEqual([expect.objectContaining({ id: "number-sequences" })]);
    expect(
      topicCatalog.entries.find((entry) => entry.taskNumbers.includes(17)),
    ).toMatchObject({
      id: "number-sequences",
      routeSlug: "17-chislovye-posledovatelnosti",
      status: "published",
    });
    expect(publicPaths).toContain(
      "/ege/17-chislovye-posledovatelnosti/chisla-i-proverki",
    );
    expect(publicPaths).toContain(
      "/ege/17-chislovye-posledovatelnosti/praktika",
    );
  });

  it("runs every program that shows its output and gets that output", () => {
    // The rule of scripts/lesson_design/verify_code.py: programs run next to
    // the lesson's data files; a fragment that continues an earlier program
    // of the same page runs after it, with that output discarded.
    const files = FILES;
    let prelude = "";
    let earlier = "";
    let ran = 0;
    const run = (code: string) =>
      spawnSync("python3", ["-I", "-c", code], {
        encoding: "utf8",
        cwd: files,
      });
    const byId = new Map(lesson.theory.map((block) => [block.id, block]));
    for (const subtopic of lessonSubtopics(lesson)) {
      earlier = ""; // continuations stay within one subtopic page
      const page = subtopic.conceptIds.map((id) => byId.get(id)?.explanation);
      for (const piece of pieces(page)) {
        if (piece.kind !== "code" || piece.language !== "python") continue;
        if (piece.output !== undefined && piece.code.includes("print")) {
          let result = run(prelude + piece.code);
          if (result.status !== 0 && earlier) {
            result = run(
              prelude +
                "import contextlib, io\n" +
                "with contextlib.redirect_stdout(io.StringIO()):\n" +
                `    exec(compile(${JSON.stringify(earlier)}, 'earlier', 'exec'))\n` +
                piece.code,
            );
          }
          expect(result.status, result.stderr).toBe(0);
          expect(result.stdout.trim(), piece.code).toBe(piece.output.trim());
          earlier += piece.code + "\n";
          ran += 1;
        }
        if (
          /^def /mu.test(piece.code) &&
          !piece.code.includes("print") &&
          compiles(piece.code)
        )
          prelude += piece.code + "\n";
      }
    }
    expect(ran).toBe(37);
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

  it("uses every generated figure once, with the stepper and run blocks", () => {
    const container = renderAuthoredLessonContent(authoredContent);
    const media = Object.values(lessonMedia);
    const diagrams = media.filter((item) => item.kind === "diagram");
    expect(
      container.querySelectorAll("figure[data-lesson-diagram]"),
    ).toHaveLength(diagrams.length);
    expect(media.filter((item) => item.kind === "stepper")).toHaveLength(1);
    expect(media.filter((item) => item.kind === "run")).toHaveLength(2);
    expect(container.querySelectorAll("img, video")).toHaveLength(0);
    expect(container.querySelectorAll("[data-topic-cheat-sheet]")).toHaveLength(
      1,
    );
    expect(
      container.querySelectorAll("[data-python-term]").length,
    ).toBeGreaterThanOrEqual(10);
    expect(container.querySelectorAll("aside, [role='note']")).toHaveLength(0);
  });
});
