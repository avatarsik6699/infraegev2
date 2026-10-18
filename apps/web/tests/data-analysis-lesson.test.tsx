import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  dataAnalysisLesson,
  findLessonByRouteSlug,
  lessonPublications,
  lessonSubtopics,
} from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import { publicPaths } from "~/pages/site-discovery/public-paths";
import { CodeBlock } from "~/shared/components/code-block";
import { CodeRunner } from "~/shared/components/learning-content";
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
const lesson = await wholeLesson(dataAnalysisLesson);
const lessonMedia = topicMedia("data-analysis");
const SOURCE = resolve(
  process.cwd(),
  "../..",
  "content/lesson-design/topic-27",
);
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
    .filter((name) => /^0[1-9]-.*\.md$/u.test(name))
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

describe("task 27 clustering lesson (Change 184)", () => {
  it("has six core subtopics, two advanced and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "data-analysis",
      routeSlug: "27-analiz-dannyh-i-klasterizatsiya",
      title: "Анализ данных",
      taskNumbers: [27],
      status: "published",
      masteryThreshold: 0.8,
    });
    const subtopics = lessonSubtopics(lesson);
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["tochki-i-rasstoyaniya", "core"],
      ["fajl-s-tochkami", "core"],
      ["razdelenie-na-klastery", "core"],
      ["centr-klastera", "core"],
      ["otvet-po-centram", "core"],
      ["rasstoyaniya-i-pary", "core"],
      ["cepochki-sosedej", "advanced"],
      ["drugie-centry-i-uskoreniya", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      4, 4, 5, 7, 2, 4, 6, 5,
    ]);
    expect(lesson.examFocus).toBeDefined();
    expect(lesson.result).toBeDefined();
  });

  it("is the lesson of the catalog topic of task 27", () => {
    expect(findLessonByRouteSlug("27-analiz-dannyh-i-klasterizatsiya")).toBe(
      dataAnalysisLesson,
    );
    expect(
      lessonPublications.filter(({ taskNumbers }) => taskNumbers.includes(27)),
    ).toEqual([expect.objectContaining({ id: "data-analysis" })]);
    expect(
      topicCatalog.entries.find((entry) => entry.taskNumbers.includes(27)),
    ).toMatchObject({
      id: "data-analysis",
      routeSlug: "27-analiz-dannyh-i-klasterizatsiya",
      status: "published",
    });
    expect(publicPaths).toContain(
      "/ege/27-analiz-dannyh-i-klasterizatsiya/tochki-i-rasstoyaniya",
    );
    expect(publicPaths).toContain(
      "/ege/27-analiz-dannyh-i-klasterizatsiya/praktika",
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
    // the lesson's data files; a fragment that continues an earlier program of the same
    // page runs after it, with that output discarded.
    const files = resolve(SOURCE, "files");
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
    expect(ran).toBe(44);
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
    expect(media.filter((item) => item.kind === "stepper")).toHaveLength(3);
    expect(media.filter((item) => item.kind === "run")).toHaveLength(4);
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
