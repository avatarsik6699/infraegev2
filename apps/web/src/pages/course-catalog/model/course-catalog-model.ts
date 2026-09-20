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
) => {
  const byId: Partial<
    Record<CourseCatalogTypes.Id, CourseCatalogPageTypes.Progress>
  > = {};
  let mastered = 0;
  let total = 0;
  let unavailable = false;
  for (const entry of entries) {
    if (entry.status !== "published") continue;
    total += entry.lessonCount;
    const lessons = summaries[entry.id];
    if (!lessons || lessons.length !== entry.lessonCount) {
      byId[entry.id] = { status: "unavailable" };
      unavailable = true;
    } else if (!hydrated) {
      byId[entry.id] = { status: "loading" };
    } else {
      const progress = courseProgress.calculate(lessons, progressByLessonId);
      const count = progress.masteredLessonIds.length;
      byId[entry.id] = {
        status: "ready",
        mastered: count,
        total: entry.lessonCount,
      };
      mastered += count;
    }
  }
  let summary: CourseCatalogPageTypes.Progress = { status: "loading" };
  if (unavailable) summary = { status: "unavailable" };
  else if (hydrated) summary = { status: "ready", mastered, total };
  return { byId, summary, total };
};

const lessonCount = (count: number): string => {
  const lastTwo = count % 100;
  const last = count % 10;
  let noun = "уроков";
  if (lastTwo < 11 || lastTwo > 14) {
    if (last === 1) noun = "урок";
    else if (last >= 2 && last <= 4) noun = "урока";
  }
  return `${String(count)} ${noun}`;
};

const progressText = (progress: CourseCatalogPageTypes.Progress): string => {
  if (progress.status === "unavailable") return "Прогресс временно недоступен";
  if (progress.status === "loading") return "Прогресс загружается";
  return `Освоено ${String(progress.mastered)} из ${lessonCount(progress.total)}`;
};

export const courseCatalogModel = { calculate, lessonCount, progressText };
