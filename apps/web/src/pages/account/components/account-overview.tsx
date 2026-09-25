import { useMemo } from "react";
import {
  courseProgress,
  findCourseByRouteSlug,
  getCourseLessons,
} from "~/entities/course";
import { practiceCatalog } from "~/entities/practice-task";
import { topicCatalog, type TopicCatalogTypes } from "~/entities/topic-catalog";
import {
  useLessonProgressHydrated,
  useLessonProgressStatus,
  useLessonsProgress,
} from "~/features/lesson-progress";
import { usePracticeProgress } from "~/features/practice-progress";
import { ActionLink } from "~/shared/components/action-link";
import { EmptyState } from "~/shared/components/empty-state";
import { Typography } from "~/shared/components/typography";
import type { AccountOverviewTypes } from "./account-overview.types";
import styles from "./account-overview.module.css";

const noLessonIds: readonly string[] = [];
const publishedTopics = topicCatalog.entries.filter(
  (entry): entry is TopicCatalogTypes.PublishedEntry =>
    entry.status === "published",
);

export const AccountOverview: React.FC<AccountOverviewTypes.Props> = (
  props,
) => {
  const course = findCourseByRouteSlug("python");
  const publishedLessons = useMemo(
    () =>
      course
        ? getCourseLessons(course).filter(
            (lesson) => lesson.status === "published",
          )
        : [],
    [course],
  );
  const summaries = useMemo(
    () => props.practiceSummary ?? [],
    [props.practiceSummary],
  );
  const lessonIds = useMemo(
    () => publishedLessons.map((lesson) => lesson.id),
    [publishedLessons],
  );
  const saved = useLessonsProgress(lessonIds, summaries);
  const lessonResults = useLessonsProgress(noLessonIds);
  const hydrated = useLessonProgressHydrated();
  const lessonProgressStatus = useLessonProgressStatus();
  const practiceHistory = usePracticeProgress((state) => state.history);
  const practiceProgressStatus = usePracticeProgress((state) => state.status);
  const byLesson = new Map(summaries.map((lesson) => [lesson.id, lesson]));
  const courseSummaryReady =
    props.practiceSummary !== null &&
    publishedLessons.length > 0 &&
    publishedLessons.every((lesson) => byLesson.has(lesson.id));
  const courseReady =
    courseSummaryReady && hydrated && lessonProgressStatus === "ready";
  const lessons = publishedLessons.map((lesson) => ({
    id: lesson.id,
    tasks: byLesson.get(lesson.id)?.tasks ?? [],
    masteryThreshold: lesson.masteryThreshold,
  }));
  const progress = courseProgress.calculatePractice(lessons, saved);
  const nextLesson = publishedLessons.find(
    (lesson) => !progress.byLessonId[lesson.id]?.mastered,
  );
  const courseTarget = nextLesson ?? publishedLessons[0];
  const courseContinuation = courseReady && progress.solved > 0;
  const courseStarted = publishedLessons.some(
    (lesson) => (lessonResults[lesson.id]?.solvedTaskIds.length ?? 0) > 0,
  );
  const topicContinuation = publishedTopics.find(
    (entry) => (lessonResults[entry.id]?.solvedTaskIds.length ?? 0) > 0,
  );
  const standaloneSolvedCount = Object.values(practiceHistory).filter(
    (revisions) => Object.keys(revisions).length > 0,
  ).length;
  const topicReady = hydrated && lessonProgressStatus === "ready";
  const practiceReady = practiceProgressStatus === "ready";
  const allSourcesReady = courseReady && practiceReady;
  const unavailable =
    !courseSummaryReady ||
    lessonProgressStatus === "error" ||
    practiceProgressStatus === "error";
  const hasContinuation = Boolean(
    (topicReady && courseStarted) ||
    (topicReady && topicContinuation) ||
    (practiceReady && standaloneSolvedCount > 0),
  );
  let courseDescription =
    "Есть сохранённые решения. Продолжение временно недоступно.";
  if (courseContinuation)
    courseDescription = nextLesson
      ? `Следующий урок: ${nextLesson.title}`
      : "Все уроки освоены";

  return (
    <section
      className={styles.root}
      id="progress"
      aria-labelledby="progress-title"
    >
      <div className={styles.heading}>
        <Typography.Title order={2} id="progress-title">
          Продолжить обучение
        </Typography.Title>
        <Typography.Text tone="muted">
          Ваши результаты сохраняются в аккаунте.
        </Typography.Text>
      </div>
      {hasContinuation ? (
        <div className={styles.continuations}>
          {topicReady && courseStarted && course ? (
            <article className={styles.continuation} data-continuation="course">
              <div className={styles.continuationDetails}>
                <Typography.Text className={styles.kind}>
                  Мини-курс
                </Typography.Text>
                <Typography.Title order={3}>{course.title}</Typography.Title>
                <Typography.Text tone="muted">
                  {courseDescription}
                </Typography.Text>
              </div>
              {courseContinuation && courseTarget ? (
                <ActionLink
                  to="/courses/$courseSlug/$lessonSlug"
                  params={{
                    courseSlug: course.routeSlug,
                    lessonSlug: courseTarget.routeSlug,
                  }}
                  hierarchy="primary"
                  presentation="button"
                  className={styles.continuationAction}
                >
                  {nextLesson ? "Продолжить" : "Повторить курс"}
                </ActionLink>
              ) : (
                <ActionLink
                  to="/courses/$courseSlug"
                  params={{ courseSlug: course.routeSlug }}
                  hierarchy="primary"
                  presentation="button"
                  className={styles.continuationAction}
                >
                  Открыть курс
                </ActionLink>
              )}
            </article>
          ) : null}
          {topicReady && topicContinuation ? (
            <article className={styles.continuation} data-continuation="topic">
              <div className={styles.continuationDetails}>
                <Typography.Text className={styles.kind}>
                  Тема ЕГЭ
                </Typography.Text>
                <Typography.Title order={3}>
                  {topicContinuation.title}
                </Typography.Title>
                <Typography.Text tone="muted">
                  Есть сохранённые решения
                </Typography.Text>
              </div>
              <ActionLink
                to="/ege/$slug"
                params={{ slug: topicContinuation.routeSlug }}
                hierarchy="primary"
                presentation="button"
                className={styles.continuationAction}
              >
                Открыть тему
              </ActionLink>
            </article>
          ) : null}
          {practiceReady && standaloneSolvedCount > 0 ? (
            <article
              className={styles.continuation}
              data-continuation="practice"
            >
              <div className={styles.continuationDetails}>
                <Typography.Text className={styles.kind}>
                  Практика
                </Typography.Text>
                <Typography.Title order={3}>
                  Самостоятельные задания
                </Typography.Title>
                <Typography.Text tone="muted">
                  Сохранено: {practiceCatalog.countLabel(standaloneSolvedCount)}
                </Typography.Text>
              </div>
              <ActionLink
                to="/practice"
                hierarchy="primary"
                presentation="button"
                className={styles.continuationAction}
              >
                Открыть практику
              </ActionLink>
            </article>
          ) : null}
        </div>
      ) : null}
      {allSourcesReady && !hasContinuation ? (
        <div className={styles.emptyCard}>
          <EmptyState
            title="Пока нет сохранённых результатов"
            description="Решайте задания в курсе, темах ЕГЭ или практике — здесь появится продолжение."
            headingOrder={3}
          />
        </div>
      ) : null}
      {!allSourcesReady ? (
        <Typography.Text tone="muted" role={unavailable ? "alert" : "status"}>
          {unavailable ? "Прогресс временно недоступен" : "Загружаем прогресс…"}
        </Typography.Text>
      ) : null}
    </section>
  );
};
