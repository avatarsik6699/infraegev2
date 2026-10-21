import { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  codingAndFanoLesson,
  findLessonByRouteSlug,
  lessonPublications,
  lessonSubtopics,
} from "~/entities/lesson";
import { lessonMedia } from "~/entities/lesson/content/coding-and-fano.media";
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

const lesson = codingAndFanoLesson;
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

describe("task 4 Fano condition lesson (Change 184)", () => {
  it("has four core subtopics and their self-checks", () => {
    expect(lesson).toMatchObject({
      id: "coding-and-fano",
      routeSlug: "4-kodirovanie-i-uslovie-fano",
      title: "Кодирование и декодирование информации",
      taskNumbers: [4],
      status: "published",
      masteryThreshold: 0.8,
    });
    const subtopics = lessonSubtopics(lesson);
    expect(subtopics.map(({ slug, level }) => [slug, level])).toEqual([
      ["kod-i-uslovie-fano", "core"],
      ["kodovoe-derevo", "core"],
      ["mesto-dlya-vseh-bukv", "core"],
      ["dlina-slova", "core"],
    ]);
    expect(subtopics.map(({ checkpoint }) => checkpoint?.length ?? 0)).toEqual([
      5, 4, 5, 4,
    ]);
    expect(lesson.examFocus).toBeDefined();
    expect(lesson.result).toBeDefined();
  });

  it("is the lesson of the catalog topic of task 4", () => {
    expect(findLessonByRouteSlug("4-kodirovanie-i-uslovie-fano")).toMatchObject(
      { id: lesson.id },
    );
    expect(
      lessonPublications.filter(({ taskNumbers }) => taskNumbers.includes(4)),
    ).toEqual([expect.objectContaining({ id: "coding-and-fano" })]);
    expect(
      topicCatalog.entries.find((entry) => entry.taskNumbers.includes(4)),
    ).toMatchObject({
      id: "coding-and-fano",
      routeSlug: "4-kodirovanie-i-uslovie-fano",
      status: "published",
    });
    expect(publicPaths).toContain(
      "/ege/4-kodirovanie-i-uslovie-fano/kod-i-uslovie-fano",
    );
    expect(publicPaths).toContain("/ege/4-kodirovanie-i-uslovie-fano/praktika");
  });

  it("is solved with the code tree, without programs (Change 197)", () => {
    expect(
      pieces(authoredContent).filter(({ kind }) => kind !== "text"),
    ).toEqual([]);
  });

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
    expect(media.filter((item) => item.kind === "stepper")).toHaveLength(4);
    expect(container.querySelectorAll("img, video")).toHaveLength(0);
    expect(container.querySelectorAll("[data-topic-cheat-sheet]")).toHaveLength(
      1,
    );
    expect(container.querySelectorAll("aside, [role='note']")).toHaveLength(0);
  });
});
