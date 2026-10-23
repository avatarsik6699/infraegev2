import { spawnSync } from "node:child_process";
import { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  networksLesson,
  findLessonByRouteSlug,
  lessonPublications,
  lessonSubtopics,
} from "~/entities/lesson";
import { lessonMedia } from "~/entities/lesson/content/networks.media";
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

const lesson = networksLesson;
const authoredContent = [
  ...lesson.theory.map(({ explanation }) => explanation),
  ...(lesson.finalSections ?? []).map(({ explanation }) => explanation),
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
  // the panels of LessonTabs are props, not children
  const tabs = node.props.tabs as { content: React.ReactNode }[] | undefined;
  if (Array.isArray(tabs)) {
    for (const tab of tabs) pieces(tab.content, out);
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

describe("task 10 IP addresses lesson (Change 197)", () => {
  it("has five core subtopics, one advanced and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "networks",
      routeSlug: "10-ip-adresa-i-maski",
      title: "Маска подсети",
      taskNumbers: [10],
      status: "published",
      masteryThreshold: 0.8,
    });
    const subtopics = lessonSubtopics(lesson);
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["adres-i-maska", "core"],
      ["adres-seti", "core"],
      ["kolichestvo-i-nomer-uzla", "core"],
      ["maska-po-adresu-seti", "core"],
      ["dvoichnaya-zapis-adresov", "core"],
      ["maska-po-usloviyu", "advanced"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      5, 5, 4, 5, 5, 4,
    ]);
    expect(lesson.finalLead).toBeTruthy();
    expect(lesson.result).toBeDefined();
  });

  it("is the lesson of the catalog topic of task 10", () => {
    expect(findLessonByRouteSlug("10-ip-adresa-i-maski")).toBe(lesson);
    expect(
      lessonPublications.filter(({ taskNumbers }) => taskNumbers.includes(10)),
    ).toEqual([expect.objectContaining({ id: "networks" })]);
    expect(
      topicCatalog.entries.find((entry) => entry.taskNumbers.includes(10)),
    ).toMatchObject({
      id: "networks",
      routeSlug: "10-ip-adresa-i-maski",
      status: "published",
    });
    expect(publicPaths).toContain("/ege/10-ip-adresa-i-maski/adres-i-maska");
    expect(publicPaths).toContain("/ege/10-ip-adresa-i-maski/praktika");
  });

  it("runs every program that shows its output and gets that output", () => {
    // The rule of scripts/lesson_design/verify_code.py: programs run next to
    // the lesson's folder (topic 10 has no data files); a fragment that continues an earlier
    // program of the same page runs after it, with that output discarded.
    const files = process.cwd(); // the topic has no data files
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
    expect(ran).toBe(23);
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
    expect(media.filter((item) => item.kind === "run")).toHaveLength(5);
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
