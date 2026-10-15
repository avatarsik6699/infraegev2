import { useRouter } from "@tanstack/react-router";
import {
  advancedLevelLabel,
  groupTasksBySubtopic,
  lessonSubtopics,
} from "~/entities/lesson";
import { masteryTasks } from "~/entities/practice-task";
import {
  ExamPaper,
  examPlan,
  topicCatalog,
  type TopicCatalogTypes,
} from "~/entities/topic-catalog";
import { useAccountSession } from "~/features/account";
import {
  checkPracticeAnswer,
  createCheckAndSaveAnswer,
} from "~/features/lesson-practice";
import {
  Checkpoint,
  LessonIntro,
  LessonTheory,
} from "~/shared/components/learning-content";
import { Typography } from "~/shared/components/typography";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { LegacySectionRedirect } from "./components/legacy-section-redirect";
import { TopicLessonPager } from "./components/topic-lesson-pager";
import { withSubtopicTheoryLinks } from "./lib/subtopic-task-links";
import { TopicLessonFrame } from "./topic-lesson-frame";
import type { TopicLessonPageTypes } from "./topic-lesson-page.types";
import styles from "./topic-lesson.module.css";

export const TopicSubtopicPage: React.FC<TopicLessonPageTypes.SubtopicProps> = (
  props,
) => {
  const router = useRouter();
  const session = useAccountSession();
  const subtopics = lessonSubtopics(props.lesson);
  const { subtopic } = props;
  const first = subtopic.index === 0;
  const previous = subtopics[subtopic.index - 1];
  const next = subtopics[subtopic.index + 1];
  const tasks = props.practiceUnavailable
    ? []
    : withSubtopicTheoryLinks(
        props.lesson,
        groupTasksBySubtopic(props.lesson, props.tasks).get(subtopic.slug) ??
          [],
        subtopic.slug,
      );
  const outline = [
    ...subtopic.concepts.map((concept) => ({
      id: concept.id,
      label: concept.navLabel,
    })),
    // Change 184: reasoning first, then the tasks with a file
    ...(subtopic.checkpoint
      ? [{ id: "self-check", label: "Проверьте себя" }]
      : []),
    ...(tasks.length ? [{ id: "practice", label: "Практика" }] : []),
  ];
  const advanced = subtopic.level === "advanced";
  const position = `Подтема ${String(subtopic.index + 1)} из ${String(subtopics.length)}`;

  return (
    <TopicLessonFrame {...props} current={subtopic.slug} outline={outline}>
      <LegacySectionRedirect
        lesson={props.lesson}
        sections={outline.map((item) => item.id)}
      />
      {first ? (
        <LessonIntro
          className={styles.intro}
          accessTier={props.lesson.accessTier}
          eyebrow={topicCatalog.formatTaskNumbers(props.lesson.taskNumbers)}
          subtopicCount={subtopics.length}
          summary={props.lesson.summary}
          taskCount={
            props.practiceUnavailable
              ? undefined
              : masteryTasks(props.tasks).length
          }
          additionalTaskCount={
            props.practiceUnavailable
              ? undefined
              : props.tasks.length - masteryTasks(props.tasks).length
          }
          title={props.lesson.title}
          examMeta={topicExamMeta(props.lesson.taskNumbers)}
          backdrop={<ExamPaper />}
        />
      ) : null}
      <header
        className={styles.subtopicHead}
        data-subtopic-head
        data-first={first || undefined}
      >
        <Typography.Text className={styles.position}>
          {position}
          {advanced ? (
            <span className={styles.level} data-subtopic-level>
              {` · ${advancedLevelLabel}`}
            </span>
          ) : null}
        </Typography.Text>
        <Typography.Title
          order={first ? 2 : 1}
          id={first ? "subtopic-title" : "lesson-title"}
          tabIndex={first ? undefined : -1}
          className={styles.subtopicTitle}
        >
          {subtopic.title}
        </Typography.Title>
        {subtopic.lead ? (
          <Typography.Text
            variant="lead"
            className={styles.subtopicLead}
            data-subtopic-lead
          >
            {subtopic.lead}
          </Typography.Text>
        ) : null}
      </header>

      <LessonTheory
        variant="page"
        concepts={subtopic.concepts}
        conceptHeadingOrder={first ? 3 : 2}
        className={styles.theory}
      />

      {subtopic.checkpoint ? (
        // The subtopic's «объясни, почему» self-check, before its tasks:
        // reasoning first, then Excel or code (Change 184).
        <div id="self-check" className={styles.section}>
          <Checkpoint
            items={subtopic.checkpoint}
            headingOrder={first ? 3 : 2}
            headingClassName={styles.sectionTitle}
          />
        </div>
      ) : null}

      {tasks.length ? (
        <section
          id="practice"
          className={styles.section}
          aria-labelledby="practice-title"
        >
          <Typography.Title
            order={first ? 3 : 2}
            id="practice-title"
            className={styles.sectionTitle}
          >
            Практика
          </Typography.Title>
          <LessonPracticeFlow
            onRefresh={() => router.invalidate()}
            tasks={tasks}
            lessonId={props.lesson.id}
            contextKind="topic_lesson"
            checkAnswer={
              session.account
                ? createCheckAndSaveAnswer(
                    "topic_lesson",
                    props.lesson.id,
                    session.csrfToken,
                  )
                : checkPracticeAnswer
            }
          />
        </section>
      ) : null}

      <TopicLessonPager
        routeSlug={props.lesson.routeSlug}
        previous={
          previous
            ? {
                title: previous.title,
                subtopic: previous.slug,
                advanced: previous.level === "advanced",
              }
            : undefined
        }
        next={
          next
            ? {
                title: next.title,
                subtopic: next.slug,
                advanced: next.level === "advanced",
              }
            : { title: "Практика и итог" }
        }
      />
    </TopicLessonFrame>
  );
};

/** F48: the topic's exam level and minutes, as the catalog row names them. */
function topicExamMeta(numbers: TopicCatalogTypes.TaskNumbers): string[] {
  const levels = [...new Set(examPlan.levels(numbers))].map((level) =>
    examPlan.levelTitles[level].toLocaleLowerCase("ru"),
  );
  const minutes = numbers.reduce(
    (sum, task) => sum + examPlan.minutes(task),
    0,
  );
  return [levels.join(" / "), `≈ ${String(minutes)} мин`];
}
