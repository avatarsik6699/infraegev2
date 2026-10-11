import { courseProgress } from "~/entities/course";
import { practiceCatalog } from "~/entities/practice-task";
import type { AccountDashboardTypes } from "./account-dashboard.types";

export type { AccountDashboardTypes };

const hasSaved = (
  snapshots: AccountDashboardTypes.Input["saved"],
  id: string,
) => (snapshots[id]?.solvedTaskIds.length ?? 0) > 0;

function courseStep(
  input: AccountDashboardTypes.Input,
): AccountDashboardTypes.Step | undefined {
  const { courseTitle, courseRouteSlug, courseLessons } = input;
  if (!courseTitle || !courseRouteSlug) return undefined;
  if (!courseLessons.some((lesson) => hasSaved(input.saved, lesson.id)))
    return undefined;
  if (!input.course.ready)
    return {
      kind: "course",
      title: courseTitle,
      description: "Есть сохранённые решения. Продолжение временно недоступно.",
      courseRouteSlug,
      action: "Открыть курс",
    };
  const practice = courseProgress.calculatePractice(
    courseLessons,
    input.progress,
  );
  const core = courseProgress.coreLessons(courseLessons);
  const mastered = core.filter(
    (lesson) => practice.byLessonId[lesson.id]?.mastered,
  ).length;
  const next = core.find((lesson) => !practice.byLessonId[lesson.id]?.mastered);
  const target = next ?? courseLessons[0];
  if (!target) return undefined;
  return {
    kind: "course",
    title: target.title,
    description: next
      ? `${courseTitle} · освоено ${String(mastered)} из ${String(core.length)} уроков`
      : `${courseTitle} · все уроки освоены`,
    courseRouteSlug,
    lessonRouteSlug: target.routeSlug,
    action: next ? "Продолжить" : "Повторить курс",
  };
}

function topicRows(input: AccountDashboardTypes.Input) {
  return input.topics.map((topic) => {
    const solvedIds = new Set(input.progress[topic.id]?.solvedTaskIds ?? []);
    return {
      id: topic.id,
      title: topic.title,
      routeSlug: topic.routeSlug,
      taskLabel: topic.taskLabel,
      solved: topic.tasks.filter((task) => solvedIds.has(task.id)).length,
      total: topic.tasks.length,
    };
  });
}

function topicStep(
  input: AccountDashboardTypes.Input,
  rows: AccountDashboardTypes.TopicRow[],
): AccountDashboardTypes.Step | undefined {
  if (input.topicsSource.ready) {
    const row =
      rows.find((item) => item.solved > 0 && item.solved < item.total) ??
      rows.find((item) => item.solved > 0);
    return row
      ? {
          kind: "topic",
          title: row.title,
          description: `Решено ${String(row.solved)} из ${String(row.total)}`,
          routeSlug: row.routeSlug,
          action: "Открыть тему",
        }
      : undefined;
  }
  const topic = input.topics.find((item) => hasSaved(input.saved, item.id));
  return topic
    ? {
        kind: "topic",
        title: topic.title,
        description: "Есть сохранённые решения",
        routeSlug: topic.routeSlug,
        action: "Открыть тему",
      }
    : undefined;
}

export function accountDashboard(
  input: AccountDashboardTypes.Input,
): AccountDashboardTypes.Dashboard {
  const rows = topicRows(input);
  const practiceStep: AccountDashboardTypes.Step | undefined =
    input.practice.ready && input.practice.saved > 0
      ? {
          kind: "practice",
          title: "Самостоятельные задания",
          description: `Сохранено: ${practiceCatalog.countLabel(input.practice.saved)}`,
          action: "Открыть практику",
        }
      : undefined;
  const steps = [
    courseStep(input),
    topicStep(input, rows),
    practiceStep,
  ].filter((step): step is AccountDashboardTypes.Step => step !== undefined);
  const allReady =
    input.course.ready && input.topicsSource.ready && input.practice.ready;
  const [first, ...rest] = steps;
  const course = input.course.ready
    ? courseProgress.calculatePractice(input.courseLessons, input.progress)
    : undefined;

  return {
    course: course && {
      mastered: input.courseLessons.filter(
        (lesson) => course.byLessonId[lesson.id]?.mastered,
      ).length,
      total: input.courseLessons.length,
    },
    topics: input.topicsSource.ready
      ? {
          rows,
          solved: rows.reduce((sum, row) => sum + row.solved, 0),
          total: rows.reduce((sum, row) => sum + row.total, 0),
          started: rows.filter((row) => row.solved > 0).length,
        }
      : undefined,
    practice: input.practice.ready
      ? { saved: input.practice.saved }
      : undefined,
    nextStep:
      first ??
      (allReady
        ? {
            kind: "start",
            title: "Пока нет сохранённых результатов",
            description:
              "Решайте задачи в темах ЕГЭ, мини-курсе или банке — здесь появится продолжение.",
            action: "Выбрать тему",
          }
        : undefined),
    continuations: rest,
  };
}
