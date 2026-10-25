import { russianCount } from "~/shared/lib/russian-count";
import {
  courseProgress,
  type CourseCatalogTypes,
  type CourseProgressTypes,
} from "~/entities/course";
import type { CourseCatalogPageTypes } from "../course-catalog-page.types";

const calculate = (
  entries: readonly CourseCatalogTypes.Entry[],
  summaries: CourseCatalogPageTypes.Props["summaries"],
  progressByLessonId: Readonly<
    Record<string, CourseProgressTypes.LessonProgress>
  >,
  hydrated: boolean,
  progressUnavailable = false,
) => {
  const byId: Partial<
    Record<CourseCatalogTypes.Id, CourseCatalogPageTypes.Progress>
  > = {};
  let mastered = 0;
  let total = 0;
  let unavailable = false;
  for (const entry of entries) {
    if (entry.status !== "published") continue;
    const advanced = new Set(entry.advancedLessonIds);
    total += entry.lessonCount - advanced.size;
    const lessons = summaries[entry.id]?.map((lesson) => ({
      ...lesson,
      level: advanced.has(lesson.id)
        ? ("advanced" as const)
        : ("core" as const),
    }));
    if (!lessons || lessons.length !== entry.lessonCount) {
      byId[entry.id] = { status: "unavailable" };
      unavailable = true;
    } else if (!hydrated) {
      byId[entry.id] = {
        status: progressUnavailable ? "unavailable" : "loading",
      };
      unavailable ||= progressUnavailable;
    } else {
      const progress = courseProgress.calculate(lessons, progressByLessonId);
      const count = progress.masteredLessonIds.length;
      byId[entry.id] = {
        status: "ready",
        mastered: count,
        total: progress.availableCount,
      };
      mastered += count;
    }
  }
  let summary: CourseCatalogPageTypes.Progress = { status: "loading" };
  if (unavailable) summary = { status: "unavailable" };
  else if (hydrated) summary = { status: "ready", mastered, total };
  return { byId, summary, total };
};

const lessonCount = (count: number): string => russianCount.lessons(count);

/** «из 27 уроков», «из 41 урока»: the genitive after «из». */
const ofLessons = (count: number): string =>
  `из ${String(count)} ${count % 10 === 1 && count % 100 !== 11 ? "урока" : "уроков"}`;

const progressText = (progress: CourseCatalogPageTypes.Progress): string => {
  if (progress.status === "unavailable") return "Прогресс временно недоступен";
  if (progress.status === "loading") return "Прогресс загружается";
  return `Освоено ${String(progress.mastered)} ${ofLessons(progress.total)}`;
};

export const courseCatalogModel = {
  calculate,
  lessonCount,
  ofLessons,
  progressText,
};
