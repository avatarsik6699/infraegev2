import {
  courseCatalog,
  courseProgress,
  type CourseProgressTypes,
} from "~/entities/course";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";

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

const calculate = (
  props: CourseOverviewPageTypes.Props,
  saved: Readonly<Record<string, CourseProgressTypes.LessonProgress>>,
  hydrated: boolean,
  progressUnavailable = false,
  guest = false,
): CourseOverviewPageTypes.Model => {
  const definitions = new Map(
    props.lessons.map((lesson) => [lesson.id, lesson]),
  );
  const published = props.course.modules.flatMap((module) =>
    module.lessonPlan.flatMap((item) => {
      const lesson = definitions.get(item.id);
      return lesson?.status === "published" ? [lesson] : [];
    }),
  );
  const summaries = new Map(
    props.practiceSummary?.map((lesson) => [lesson.id, lesson]),
  );
  const complete =
    props.practiceSummary !== null &&
    published.length > 0 &&
    published.every((lesson) => summaries.has(lesson.id));
  const progressLessons = published.map((lesson) => ({
    id: lesson.id,
    tasks: summaries.get(lesson.id)?.tasks ?? [],
    masteryThreshold: lesson.masteryThreshold,
  }));
  const practice = courseProgress.calculatePractice(
    progressLessons,
    guest ? {} : saved,
  );
  const pending: CourseOverviewPageTypes.Progress = {
    status: complete && !progressUnavailable ? "loading" : "unavailable",
  };
  const ready = complete && (hydrated || guest);
  const allMastered =
    published.length > 0 &&
    published.every((lesson) => practice.byLessonId[lesson.id]?.mastered);
  const next = published.find(
    (lesson) => !practice.byLessonId[lesson.id]?.mastered,
  );
  const first = published[0];
  const target = ready ? (next ?? first) : first;
  const continuing = ready && !guest && practice.solved > 0 && !allMastered;
  let actionLabel = "Открыть первый урок";
  if (ready) {
    actionLabel = "Начать курс";
    if (allMastered) actionLabel = "Повторить курс";
    else if (continuing && target) actionLabel = `Продолжить: ${target.title}`;
  }
  return {
    lessonCount: published.length,
    level: courseCatalog.entries.find((entry) => entry.id === props.course.id)
      ?.level,
    action: target
      ? {
          lesson: target,
          continuing,
          label: actionLabel,
        }
      : undefined,
    progress: ready
      ? {
          status: "ready",
          solved: practice.solved,
          total: practice.total,
          mastered: allMastered,
        }
      : pending,
    modules: props.course.modules.map((module, moduleIndex) => {
      const lessons = module.lessonPlan.map(
        (item, lessonIndex): CourseOverviewPageTypes.Lesson => {
          const lesson = definitions.get(item.id);
          const progress = practice.byLessonId[item.id];
          return {
            id: item.id,
            title: item.title,
            number: `${String(moduleIndex + 1)}.${String(lessonIndex + 1)}`,
            routeSlug:
              lesson?.status === "published" ? lesson.routeSlug : undefined,
            progress:
              ready && progress ? { status: "ready", ...progress } : pending,
          };
        },
      );
      const available = lessons.filter((lesson) => lesson.routeSlug);
      let status = "Не начат";
      if (available.length === 0) status = "В плане";
      else if (!ready) status = "—";
      else if (
        available.every(
          (lesson) =>
            lesson.progress.status === "ready" && lesson.progress.mastered,
        )
      )
        status = "Освоен";
      else if (
        available.some(
          (lesson) =>
            lesson.progress.status === "ready" && lesson.progress.solved > 0,
        )
      )
        status = "В процессе";
      return {
        id: module.id,
        title: module.title,
        number: String(moduleIndex + 1).padStart(2, "0"),
        finalProject:
          props.course.id === "python" && module.id === "final-program",
        lessons,
        status,
      };
    }),
  };
};

const progressNote = (progress: CourseOverviewPageTypes.Progress): string => {
  if (progress.status === "unavailable") return "Прогресс временно недоступен";
  if (progress.status === "loading") return "Прогресс загружается";
  if (progress.mastered) return "Все уроки освоены";
  if (progress.total === 0) return "Практика пока не добавлена";
  return "";
};

const practiceCount = (progress: CourseOverviewPageTypes.Progress): string =>
  progress.status === "ready"
    ? `${String(progress.solved)} из ${String(progress.total)}`
    : "— из —";

export const courseOverviewModel = {
  calculate,
  lessonCount,
  progressNote,
  practiceCount,
};
