import { lessonPublications } from "~/entities/lesson";
import { coursePublications } from "~/entities/course";
import type { PracticeTaskWidgetTypes } from "~/widgets/practice-task";

export const practiceTopic = {
  label(detail: NonNullable<PracticeTaskWidgetTypes.Result["detail"]>) {
    // Change 191: a multi-part 19–21 task names its one topic once.
    const numbers = detail.examNumbers;
    const exams = numbers.length
      ? [
          (() => {
            const publication = lessonPublications.find(
              (item) =>
                item.status === "published" &&
                item.taskNumbers.includes(numbers[0]),
            );
            const range =
              numbers.length > 1
                ? `${String(numbers[0])}–${String(numbers.at(-1))}`
                : String(numbers[0]);
            const title = publication?.title;
            return `ЕГЭ ${range}${title ? ` · ${title}` : ""}`;
          })(),
        ]
      : [];
    if (exams.length) return exams.join(" · ");
    const materialIds = new Set(
      detail.theoryLinks?.map((link) => link.material_id),
    );
    const modules = coursePublications
      .filter((course) => course.status === "published")
      .flatMap((course) =>
        course.modules
          .filter((section) =>
            section.lessonPlan.some((lesson) => materialIds.has(lesson.id)),
          )
          .map((section) => `${course.shortTitle} · ${section.title}`),
      );
    return modules.join(" · ") || "Задание";
  },
};
