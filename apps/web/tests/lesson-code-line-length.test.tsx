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

/** Строка кода длиннее этого не помещается в колонку чтения без полосы прокрутки (в том числе внутри «Разберём на примере»). */
const MAX_CODE_LINE = 64;

const lessons = [
  arrayProcessingLesson,
  dataAnalysisLesson,
  integerProcessingLesson,
  numberSequencesLesson,
  preobrazovanieZapiseyChiselLesson,
  rekursiyaLesson,
  stringProcessingLesson,
];

describe("code block line length", () => {
  it.each(lessons.map((lesson) => [lesson.routeSlug, lesson] as const))(
    "keeps every code line in %s within the line limit",
    (_slug, lesson) => {
      const nodes = lesson.theory.flatMap((concept) =>
        Object.values(concept).filter(
          (value): value is React.ReactNode => typeof value === "object",
        ),
      );
      const container = renderAuthoredLessonContent(nodes);
      const tooLong = [...container.querySelectorAll("pre > code > span")]
        .map(
          (line) =>
            line.lastElementChild?.textContent?.replaceAll(
              String.fromCharCode(160),
              "",
            ) ?? "",
        )
        .filter((text) => text.length > MAX_CODE_LINE);
      expect(tooLong).toEqual([]);
    },
  );
});
