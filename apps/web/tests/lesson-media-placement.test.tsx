import { describe, expect, it, vi } from "vitest";
import { arrayProcessingLesson } from "~/entities/lesson/content/array-processing.lesson";
import { dataAnalysisLesson } from "~/entities/lesson/content/data-analysis.lesson";
import { divisorsAndMasksLesson } from "~/entities/lesson/content/divisors-and-masks.lesson";
import { numberSequencesLesson } from "~/entities/lesson/content/number-sequences.lesson";
import { preobrazovanieZapiseyChiselLesson } from "~/entities/lesson/content/preobrazovanie-zapisey-chisel.lesson";
import { rekursiyaLesson } from "~/entities/lesson/content/rekursiya.lesson";
import { spreadsheetsLesson } from "~/entities/lesson/content/spreadsheets.lesson";
import { stringProcessingLesson } from "~/entities/lesson/content/string-processing.lesson";
import { renderAuthoredLessonContent } from "./lesson-content-test-utils";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const lessons = [
  rekursiyaLesson,
  spreadsheetsLesson,
  preobrazovanieZapiseyChiselLesson,
  numberSequencesLesson,
  stringProcessingLesson,
  divisorsAndMasksLesson,
  arrayProcessingLesson,
  dataAnalysisLesson,
];

// Code-built SVG diagrams and step-through figures follow the figure rules (Change 171).
const FIGURE = "figure[data-lesson-diagram], figure[data-lesson-stepper]";

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
  it("puts every figure right after the text it illustrates (a paragraph or a list)", () => {
    for (const lesson of lessons) {
      for (const media of blocksOf(lesson).filter((block) =>
        block.matches(FIGURE),
      )) {
        expect(
          media.previousElementSibling?.tagName,
          `${lesson.id}: media must follow a paragraph or a list, not a code block or another block`,
        ).toMatch(/^(P|UL|OL)$/u);
      }
    }
  });

  it("gives every figure a description of the picture and one caption", () => {
    for (const lesson of lessons) {
      for (const figure of blocksOf(lesson).filter((b) => b.matches(FIGURE))) {
        const picture =
          figure.querySelector("img")?.getAttribute("alt") ??
          figure.querySelector('[role="img"]')?.getAttribute("aria-label");
        expect(
          picture,
          `${lesson.id}: a figure without a description`,
        ).toBeTruthy();
        expect(figure.querySelectorAll("figcaption")).toHaveLength(1);
        expect(figure.textContent).not.toContain("Текстовое описание");
      }
    }
  });
});
