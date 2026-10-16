import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  simpleAlgorithmsLesson,
  findLessonByRouteSlug,
  lessonPublications,
  lessonSubtopics,
} from "~/entities/lesson";
import { lessonMedia } from "~/entities/lesson/content/simple-algorithms.media";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";
import { CodeBlock } from "~/shared/components/code-block";
import { CodeRunner } from "~/shared/components/learning-content";
import { Typography } from "~/shared/components/typography";
import { renderAuthoredLessonContent } from "./lesson-content-test-utils";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const lesson = simpleAlgorithmsLesson;
const SOURCE = resolve(process.cwd(), "../..", "content/lesson-design/topic-6");
const authoredContent = [
  ...lesson.theory.map(({ explanation }) => explanation),
  lesson.examFocus,
  lesson.result,
];

type Piece =
  | { kind: "code"; language: string; code: string; output?: string }
  | { kind: "run"; code: string; output: string }
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
  if (node.type === CodeRunner) {
    // a runnable example: its program is the stand's `python run` fence
    const props = node.props as { code: string; output: string };
    out.push({ kind: "run", code: props.code, output: props.output });
    return out;
  }
  if (node.type === Typography.Text) {
    out.push({ kind: "text", text: textOf(node.props.children as never) });
    return out;
  }
  return pieces(node.props.children as React.ReactNode, out);
}

/** Python fences of the approved stand, without the task blocks. */
function sourcePythonBlocks(): string[] {
  const files = readdirSync(SOURCE)
    .filter((name) => /^0[1-8]-.*\.md$/u.test(name))
    .sort();
  return files.flatMap((name) => {
    const steps = readFileSync(resolve(SOURCE, name), "utf8").split(/\n---\n/u);
    return steps
      .filter(
        (step) =>
          !/^\s*\*\*(Чтобы проверить понимание|Задачи основных подтем)/u.test(
            step,
          ),
      )
      .flatMap((step) =>
        [...step.matchAll(/```python\n([\s\S]*?)```/gu)].map((match) =>
          (match[1] ?? "").replace(/\n$/u, ""),
        ),
      );
  });
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

describe("task 6 simple algorithms lesson (Change 190)", () => {
  it("has five core subtopics, two advanced and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "simple-algorithms",
      routeSlug: "6-prostejshie-algoritmy-dlya-ispolnitelej",
      title: "Простейшие алгоритмы для исполнителей",
      taskNumbers: [6],
      status: "published",
      masteryThreshold: 0.8,
    });
    const subtopics = lessonSubtopics(lesson);
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["sostoyanie-i-komandy", "core"],
      ["postroenie-i-reshetka", "core"],
      ["granica-i-velichiny", "core"],
      ["neskolko-figur", "core"],
      ["naklonnaya-geometriya", "core"],
      ["obratnyj-vopros-i-poseshcheniya", "advanced"],
      ["tochnyj-podschet-i-dugi", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      7, 4, 1, 0, 0, 0, 0,
    ]);
    expect(lesson.examFocus).toBeDefined();
    expect(lesson.result).toBeDefined();
  });

  it("is the lesson of the catalog topic of task 6", () => {
    expect(
      findLessonByRouteSlug("6-prostejshie-algoritmy-dlya-ispolnitelej"),
    ).toMatchObject({
      id: lesson.id,
    });
    expect(
      lessonPublications.filter(({ taskNumbers }) => taskNumbers.includes(6)),
    ).toEqual([expect.objectContaining({ id: "simple-algorithms" })]);
    expect(
      topicCatalog.entries.find((entry) => entry.taskNumbers.includes(6)),
    ).toMatchObject({
      id: "simple-algorithms",
      routeSlug: "6-prostejshie-algoritmy-dlya-ispolnitelej",
      status: "published",
    });
    expect(publicPaths).toContain(
      "/ege/6-prostejshie-algoritmy-dlya-ispolnitelej/sostoyanie-i-komandy",
    );
    expect(publicPaths).toContain(
      "/ege/6-prostejshie-algoritmy-dlya-ispolnitelej/praktika",
    );
  });

  it("shows the stand's Python code verbatim and in order", () => {
    const shown = pieces(authoredContent)
      .flatMap((piece) =>
        piece.kind === "code" && piece.language === "python"
          ? [piece.code]
          : [],
      )
      .map((code) => code.replace(/\n$/u, ""));
    expect(shown).toEqual(sourcePythonBlocks());
  });

  it("runs every program that shows its output and gets that output", () => {
    // The rule of scripts/lesson_design/verify_code.py: programs run next to
    // the lesson's folder (topic 6 has no data files; a turtle program draws and shows no output); a fragment that continues an earlier
    // program of the same page runs after it, with that output discarded.
    const files = SOURCE;
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
        if (piece.kind === "run") {
          // later programs of the page may call its function (verify_code.py)
          const result = run(prelude + piece.code);
          expect(result.stdout.trim(), piece.code).toBe(piece.output.trim());
          earlier += piece.code + "\n";
          ran += 1;
          // and so may every later page: its definitions join the prelude
          for (const part of piece.code.split("\n\n\n"))
            if (part.startsWith("def ")) prelude += part + "\n";
          continue;
        }
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
    expect(ran).toBe(8);
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
    expect(container.querySelectorAll("img, video")).toHaveLength(0);
    expect(container.querySelectorAll("[data-topic-cheat-sheet]")).toHaveLength(
      1,
    );
    expect(
      container.querySelectorAll("[data-python-term]").length,
    ).toBeGreaterThanOrEqual(8);
    expect(container.querySelectorAll("aside, [role='note']")).toHaveLength(0);
  });
});
