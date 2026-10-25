import { renderToStaticMarkup } from "react-dom/server";
import { expect } from "vitest";
import { findTopicOutline, topicOutlines } from "~/entities/lesson";
import type { LessonContent } from "~/entities/lesson";
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export function renderAuthoredLessonContent(
  content: readonly React.ReactNode[],
) {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(
    <div>
      {content.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>,
  );
  return container;
}

export function codeFromBlock(container: HTMLElement, label: string) {
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

type Manifest = { lessonMedia: Record<string, LessonMediaTypes.Generated> };

const manifests = import.meta.glob<Manifest>(
  "../src/entities/lesson/content/*.media.ts",
  { eager: true },
);

/** The whole topic as a reader with access sees it (Change 192): the paid
 * subtopics and the paid final page merged back into one definition. */
export async function wholeLesson(
  lesson: LessonContent.Definition,
): Promise<LessonContent.Definition> {
  const free = new Map(lesson.theory.map((concept) => [concept.id, concept]));
  const subtopics = await Promise.all(
    (lesson.subtopics ?? []).map(async (subtopic) => {
      const { paid, ...rest } = subtopic;
      if (!paid) {
        return {
          subtopic: rest,
          theory: subtopic.conceptIds.flatMap((id) => free.get(id) ?? []),
        };
      }
      const content = (await paid.load()).default;
      return {
        subtopic: {
          ...rest,
          access: "free" as const,
          checkpoint: content.checkpoint,
        },
        theory: content.theory,
      };
    }),
  );
  const practice = lesson.paidPractice
    ? (await lesson.paidPractice.load()).default
    : undefined;
  return {
    ...lesson,
    theory: subtopics.flatMap((item) => item.theory),
    subtopics: subtopics.map((item) => item.subtopic),
    ...(practice
      ? {
          finalSections: practice.sections,
          checkpoint: practice.checkpoint,
          result: practice.result,
        }
      : {}),
    paidPractice: undefined,
  };
}

/** Every figure of the topic, its public and its paid manifests together. */
export function topicMedia(
  id: string,
): Record<string, LessonMediaTypes.Generated> {
  return Object.assign(
    {},
    ...Object.entries(manifests)
      .filter(
        ([path]) =>
          path.endsWith(`/${id}.media.ts`) || path.includes(`/${id}.paid.`),
      )
      .map(([, manifest]) => manifest.lessonMedia),
  ) as Record<string, LessonMediaTypes.Generated>;
}

/** Change 222: a topic's full definition by its slug, loaded through its outline. */
export async function findLessonByRouteSlug(
  routeSlug: string,
): Promise<LessonContent.Definition | undefined> {
  return findTopicOutline(routeSlug)?.load();
}

/** Every topic's full definition, for checks across all lessons. */
export function loadTopicLessons(): Promise<LessonContent.Definition[]> {
  return Promise.all(topicOutlines.map((outline) => outline.load()));
}
