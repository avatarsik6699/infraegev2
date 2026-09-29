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

function theoryOf(lesson: (typeof lessons)[number]) {
  return renderAuthoredLessonContent(
    lesson.theory.map((concept) => concept.explanation),
  );
}

describe("lesson video placement", () => {
  it("puts every video right after the paragraph it illustrates", () => {
    for (const lesson of lessons) {
      for (const figure of theoryOf(lesson).querySelectorAll(
        "figure[data-lesson-video-figure]",
      )) {
        expect(
          figure.previousElementSibling?.tagName,
          `${lesson.id}: a video must follow a paragraph, not a code block or another block`,
        ).toBe("P");
      }
    }
  });

  it("keeps recursion code and its output or call tree in one block", () => {
    const blocks = [
      ...theoryOf(rekursiyaLesson).querySelectorAll("[data-learning-block]"),
    ];
    for (const block of blocks) {
      expect(
        block.nextElementSibling?.hasAttribute("data-learning-block"),
        "two code blocks must not follow each other",
      ).toBeFalsy();
    }
  });
});
