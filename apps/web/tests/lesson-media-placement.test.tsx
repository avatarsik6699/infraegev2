import { describe, expect, it, vi } from "vitest";
import {
  arrayProcessingLesson,
  dataAnalysisLesson,
  integerProcessingLesson,
  numberSequencesLesson,
  preobrazovanieZapiseyChiselLesson,
  rekursiyaLesson,
  stringProcessingLesson,
} from "~/entities/lesson";
import { renderAuthoredLessonContent } from "./lesson-content-test-utils";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const lessons = [
  rekursiyaLesson,
  preobrazovanieZapiseyChiselLesson,
  numberSequencesLesson,
  stringProcessingLesson,
  integerProcessingLesson,
  arrayProcessingLesson,
  dataAnalysisLesson,
];

const VIDEO = "figure[data-lesson-video-figure]";
const FIGURE = "figure[data-lesson-figure]";
const MIN_BLOCKS_BETWEEN = 2;

/** Блоки урока в порядке страницы: объяснение, пример, ошибка каждого понятия, затем итог. */
function blocksOf(lesson: (typeof lessons)[number]): Element[] {
  const container = renderAuthoredLessonContent([
    ...lesson.theory.map((concept) => (
      <>
        {concept.explanation}
        {concept.workedExample}
        {concept.mistake}
      </>
    )),
    lesson.result,
  ]);
  const wrappers = [...(container.firstElementChild?.children ?? [])];
  return wrappers.flatMap((wrapper) => [...wrapper.children]);
}

describe("lesson media placement", () => {
  it("puts every video and figure right after the paragraph it illustrates", () => {
    for (const lesson of lessons) {
      for (const media of blocksOf(lesson).filter(
        (block) => block.matches(VIDEO) || block.matches(FIGURE),
      )) {
        expect(
          media.previousElementSibling?.tagName,
          `${lesson.id}: media must follow a paragraph, not a code block or another block`,
        ).toBe("P");
      }
    }
  });

  it("keeps a figure at least two blocks away from any video", () => {
    for (const lesson of lessons) {
      const blocks = blocksOf(lesson);
      const videos = blocks.flatMap((b, i) => (b.matches(VIDEO) ? [i] : []));
      const figures = blocks.flatMap((b, i) => (b.matches(FIGURE) ? [i] : []));
      for (const figure of figures) {
        for (const video of videos) {
          expect(
            Math.abs(figure - video) - 1,
            `${lesson.id}: figure at block ${figure} is too close to the video at block ${video}`,
          ).toBeGreaterThanOrEqual(MIN_BLOCKS_BETWEEN);
        }
      }
    }
  });

  it("gives every figure a description of the picture and one caption", () => {
    for (const lesson of lessons) {
      for (const figure of blocksOf(lesson).filter((b) => b.matches(FIGURE))) {
        expect(figure.querySelector("img")?.getAttribute("alt")).toBeTruthy();
        expect(figure.querySelectorAll("figcaption")).toHaveLength(1);
        expect(figure.textContent).not.toContain("Текстовое описание");
      }
    }
  });

  it("keeps recursion code and its output or call tree in one block", () => {
    const codeBlock = '[role="group"][data-learning-block]';
    for (const block of blocksOf(rekursiyaLesson).filter((b) =>
      b.matches(codeBlock),
    )) {
      expect(
        block.nextElementSibling?.matches(codeBlock),
        "two code blocks must not follow each other",
      ).toBeFalsy();
    }
  });

  it("uses the recursion pilot figures and videos in a balanced way", () => {
    const blocks = blocksOf(rekursiyaLesson);
    const figures = blocks.filter((b) => b.matches(FIGURE)).length;
    const videos = blocks.filter((b) => b.matches(VIDEO)).length;
    expect(videos).toBe(5);
    expect(figures).toBe(5);
  });
});
