import { lessonPublications } from "~/entities/lesson";
import { coursePublications } from "~/entities/course";
import type { PracticeTaskWidgetTypes } from "~/widgets/practice-task";

export const practiceTopic = {
  label(detail: NonNullable<PracticeTaskWidgetTypes.Result["detail"]>) {
    const exams = detail.examNumbers.map((number) => {
      const publication = lessonPublications.find(
        (item) =>
          item.status === "published" && item.taskNumbers.includes(number),
      );
      const title = number === 16 ? "Рекурсия" : publication?.title;
      return `${number} номер${title ? `. ${title}` : ""}`;
    });
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
          .map(
            (section) =>
              `${course.id === "python" ? "Python" : course.title} · ${section.title}`,
          ),
      );
    return modules.join(" · ") || "Задание";
  },
};
