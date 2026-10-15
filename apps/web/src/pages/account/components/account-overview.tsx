import { BookOpen, Code2, ListChecks } from "lucide-react";
import { useMemo } from "react";
import { findCourseByRouteSlug, getCourseLessons } from "~/entities/course";
import { practiceCatalog } from "~/entities/practice-task";
import { topicCatalog, type TopicCatalogTypes } from "~/entities/topic-catalog";
import {
  useLessonProgressHydrated,
  useLessonProgressStatus,
  useLessonsProgress,
} from "~/features/lesson-progress";
import { usePracticeProgress } from "~/features/practice-progress";
import { ActionLink } from "~/shared/components/action-link";
import { Progress } from "~/shared/components/progress";
import { Typography } from "~/shared/components/typography";
import { russianCount } from "~/shared/lib/russian-count";
import {
  accountDashboard,
  type AccountDashboardTypes,
} from "../model/account-dashboard";
import { AccountTryTask } from "./account-try-task";
import type { AccountOverviewTypes } from "./account-overview.types";
import styles from "./account-overview.module.css";

const noLessonIds: readonly string[] = [];
const publishedTopics = topicCatalog.entries.filter(
  (entry): entry is TopicCatalogTypes.PublishedEntry =>
    entry.status === "published",
);

const StepLink: React.FC<{
  step: AccountDashboardTypes.Step;
  primary?: boolean;
}> = ({ step, primary }) => {
  const look = primary
    ? ({ hierarchy: "primary", presentation: "button" } as const)
    : ({ hierarchy: "text", presentation: "action" } as const);
  if (step.kind === "course" && !step.lessonRouteSlug)
    return (
      <ActionLink
        {...look}
        className={styles.stepAction}
        to="/courses/$courseSlug"
        params={{ courseSlug: step.courseRouteSlug }}
      >
        {step.action}
      </ActionLink>
    );
  if (step.kind === "course")
    return (
      <ActionLink
        {...look}
        className={styles.stepAction}
        to="/courses/$courseSlug/$lessonSlug"
        params={{
          courseSlug: step.courseRouteSlug,
          lessonSlug: step.lessonRouteSlug ?? "",
        }}
      >
        {step.action}
      </ActionLink>
    );
  if (step.kind === "topic")
    return (
      <ActionLink
        {...look}
        className={styles.stepAction}
        to="/ege/$slug"
        params={{ slug: step.routeSlug }}
      >
        {step.action}
      </ActionLink>
    );
  return (
    <ActionLink
      {...look}
      className={styles.stepAction}
      to={step.kind === "practice" ? "/practice" : "/ege"}
    >
      {step.action}
    </ActionLink>
  );
};

const stepKind: Record<AccountDashboardTypes.Step["kind"], string> = {
  course: "Мини-курс",
  topic: "Тема ЕГЭ",
  practice: "Практика",
  start: "С чего начать",
};

export const AccountOverview: React.FC<AccountOverviewTypes.Props> = (
  props,
) => {
  const course = findCourseByRouteSlug("python");
  const courseLessons = useMemo(
    () =>
      course
        ? getCourseLessons(course).filter(
            (lesson) => lesson.status === "published",
          )
        : [],
    [course],
  );
  const versions = useMemo(
    () => [...(props.practiceSummary ?? []), ...(props.topicSummary ?? [])],
    [props.practiceSummary, props.topicSummary],
  );
  const lessonIds = useMemo(
    () => [
      ...courseLessons.map((lesson) => lesson.id),
      ...publishedTopics.map((topic) => topic.id),
    ],
    [courseLessons],
  );
  const progress = useLessonsProgress(lessonIds, versions);
  const hydrated = useLessonProgressHydrated();
  const lessonProgressStatus = useLessonProgressStatus();
  const practiceHistory = usePracticeProgress((state) => state.history);
  const practiceProgressStatus = usePracticeProgress((state) => state.status);

  const saved = useLessonsProgress(noLessonIds);
  const courseById = new Map(
    (props.practiceSummary ?? []).map((lesson) => [lesson.id, lesson]),
  );
  const topicById = new Map(
    (props.topicSummary ?? []).map((topic) => [topic.id, topic]),
  );
  const progressReady = hydrated && lessonProgressStatus === "ready";
  const courseComplete =
    courseLessons.length > 0 &&
    courseLessons.every((lesson) => courseById.has(lesson.id));
  const topicsComplete = publishedTopics.every((topic) =>
    topicById.has(topic.id),
  );
  const practiceReady = practiceProgressStatus === "ready";
  const unavailable =
    (props.practiceSummary !== undefined && !courseComplete) ||
    (props.topicSummary !== undefined && !topicsComplete) ||
    lessonProgressStatus === "error" ||
    practiceProgressStatus === "error";
  const savedTaskIds = Object.entries(practiceHistory)
    .filter(([, revisions]) => Object.keys(revisions).length > 0)
    .map(([id]) => id);

  const dashboard = accountDashboard({
    courseTitle: course?.title,
    courseRouteSlug: course?.routeSlug,
    courseLessons: courseLessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      routeSlug: lesson.routeSlug,
      masteryThreshold: lesson.masteryThreshold,
      level: lesson.level,
      tasks: courseById.get(lesson.id)?.tasks ?? [],
    })),
    topics: publishedTopics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      routeSlug: topic.routeSlug,
      taskLabel: topicCatalog.formatTaskNumbers(topic.taskNumbers),
      tasks: topicById.get(topic.id)?.tasks ?? [],
    })),
    progress,
    saved: progressReady ? saved : {},
    course: { ready: progressReady && courseComplete },
    topicsSource: { ready: progressReady && topicsComplete },
    practice: { ready: practiceReady, saved: savedTaskIds.length },
  });
  const allReady =
    progressReady && courseComplete && topicsComplete && practiceReady;

  return (
    <section
      className={styles.root}
      id="progress"
      aria-labelledby="progress-title"
      data-account-dashboard
    >
      <Typography.Title
        order={2}
        id="progress-title"
        className={styles.visuallyHidden}
      >
        Прогресс
      </Typography.Title>

      {!allReady ? (
        <Typography.Text tone="muted" role={unavailable ? "alert" : "status"}>
          {unavailable ? "Прогресс временно недоступен" : "Загружаем прогресс…"}
        </Typography.Text>
      ) : null}

      {dashboard.nextStep ? (
        <article
          className={styles.nextStep}
          data-continuation={dashboard.nextStep.kind}
        >
          <div className={styles.stepDetails}>
            <Typography.Text className={styles.kind}>
              Следующий шаг
            </Typography.Text>
            <Typography.Title order={3} className={styles.nextTitle}>
              {dashboard.nextStep.kind === "start"
                ? dashboard.nextStep.title
                : `${stepKind[dashboard.nextStep.kind]} · ${dashboard.nextStep.title}`}
            </Typography.Title>
            <Typography.Text tone="muted">
              {dashboard.nextStep.description}
            </Typography.Text>
          </div>
          <StepLink step={dashboard.nextStep} primary />
        </article>
      ) : null}

      {dashboard.course || dashboard.topics || dashboard.practice ? (
        <ul className={styles.tiles} aria-label="Итоги">
          {dashboard.course ? (
            <li className={styles.tile}>
              <Code2 className={styles.tileIcon} aria-hidden="true" />
              <Typography.Text className={styles.kind}>
                {course ? (
                  <ActionLink
                    className={styles.tileLink}
                    presentation="navigation"
                    to="/courses/$courseSlug"
                    params={{ courseSlug: course.routeSlug }}
                  >
                    {course.title}
                  </ActionLink>
                ) : (
                  "Мини-курс"
                )}
              </Typography.Text>
              <Typography.Text className={styles.tileValue}>
                {`${String(dashboard.course.mastered)} из ${String(dashboard.course.total)}`}
              </Typography.Text>
              <Typography.Text tone="muted">уроков освоено</Typography.Text>
              <Progress
                className={styles.tileBar}
                value={dashboard.course.mastered}
                max={Math.max(dashboard.course.total, 1)}
                label="Освоено уроков мини-курса"
                valueText={`${String(dashboard.course.mastered)} из ${String(dashboard.course.total)}`}
              />
            </li>
          ) : null}
          {dashboard.topics ? (
            <li className={styles.tile}>
              <BookOpen className={styles.tileIcon} aria-hidden="true" />
              <Typography.Text className={styles.kind}>
                <ActionLink
                  className={styles.tileLink}
                  presentation="navigation"
                  to="/ege/"
                >
                  Темы ЕГЭ
                </ActionLink>
              </Typography.Text>
              <Typography.Text className={styles.tileValue}>
                {russianCount.tasks(dashboard.topics.solved)}
              </Typography.Text>
              <Typography.Text tone="muted">
                {`решено в ${String(dashboard.topics.started)} из ${String(dashboard.topics.rows.length)} тем`}
              </Typography.Text>
              <Progress
                className={styles.tileBar}
                value={dashboard.topics.solved}
                max={Math.max(dashboard.topics.total, 1)}
                label="Решено задач в темах ЕГЭ"
                valueText={`${String(dashboard.topics.solved)} из ${String(dashboard.topics.total)}`}
              />
            </li>
          ) : null}
          {dashboard.practice ? (
            <li className={styles.tile}>
              <ListChecks className={styles.tileIcon} aria-hidden="true" />
              <Typography.Text className={styles.kind}>
                <ActionLink
                  className={styles.tileLink}
                  presentation="navigation"
                  to="/practice"
                >
                  Практика
                </ActionLink>
              </Typography.Text>
              <Typography.Text className={styles.tileValue}>
                {String(dashboard.practice.saved)}
              </Typography.Text>
              <Typography.Text tone="muted">
                {`${practiceCatalog
                  .countLabel(dashboard.practice.saved)
                  .replace(/^\d+\s/, "")} сохранено`}
              </Typography.Text>
            </li>
          ) : null}
        </ul>
      ) : null}

      <div className={styles.columns}>
        {dashboard.topics ? (
          <section className={styles.card} aria-labelledby="topics-title">
            <Typography.Title order={3} id="topics-title">
              Прогресс по темам ЕГЭ
            </Typography.Title>
            <ul className={styles.topicRows}>
              {dashboard.topics.rows.map((row) => (
                <li key={row.id} className={styles.topicRow}>
                  <div className={styles.topicName}>
                    <ActionLink
                      presentation="inline"
                      hierarchy="text"
                      icon="none"
                      to="/ege/$slug"
                      params={{ slug: row.routeSlug }}
                    >
                      {row.title}
                    </ActionLink>
                    <Typography.Text tone="muted" className={styles.small}>
                      {row.taskLabel}
                    </Typography.Text>
                  </div>
                  <Progress
                    className={styles.topicBar}
                    value={row.solved}
                    max={Math.max(row.total, 1)}
                    label={`Решено задач: ${row.title}`}
                    valueText={`${String(row.solved)} из ${String(row.total)}`}
                  />
                  <Typography.Text className={styles.topicCount}>
                    {`${String(row.solved)} из ${String(row.total)}`}
                  </Typography.Text>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className={styles.side}>
          {dashboard.continuations.length ? (
            <section className={styles.card} aria-labelledby="continue-title">
              <Typography.Title order={3} id="continue-title">
                Продолжить
              </Typography.Title>
              <ul className={styles.continuations}>
                {dashboard.continuations.map((step) => (
                  <li
                    key={step.kind}
                    className={styles.continuation}
                    data-continuation={step.kind}
                  >
                    <Typography.Text className={styles.kind}>
                      {stepKind[step.kind]}
                    </Typography.Text>
                    <Typography.Text className={styles.continuationTitle}>
                      {step.title}
                    </Typography.Text>
                    <Typography.Text tone="muted" className={styles.small}>
                      {step.description}
                    </Typography.Text>
                    <StepLink step={step} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {practiceReady ? (
            <AccountTryTask savedTaskIds={savedTaskIds} />
          ) : null}
        </div>
      </div>
    </section>
  );
};
