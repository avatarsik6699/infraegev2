import { useRouter } from "@tanstack/react-router";
import { accessState } from "~/entities/access";
import { Suspense } from "react";
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
import { PaywallGate, paywallCopy, paywallUnlocks } from "~/features/paywall";
import {
  checkPracticeAnswer,
  createCheckAndSaveAnswer,
} from "~/features/lesson-practice";
import { LessonIntro } from "~/shared/components/learning-content";
import { Typography } from "~/shared/components/typography";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { LegacySectionRedirect } from "./components/legacy-section-redirect";
import { SubtopicBody } from "./components/subtopic-body";
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
  // Change 192: a paid subtopic the visitor cannot open shows its opening and the paywall.
  const locked = Boolean(subtopic.paid) && !accessState.opens(props.access);
  const outline = [
    ...subtopic.outline.map((concept) => ({
      id: concept.id,
      label: concept.navLabel,
      locked,
    })),
    // Change 184: reasoning first, then the tasks with a file
    ...(subtopic.checkpoint || subtopic.paid?.selfCheck
      ? [{ id: "self-check", label: "Проверьте себя", locked }]
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
          backdrop={<ExamPaper task={props.lesson.taskNumbers[0]} />}
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

      <Suspense fallback={null}>
        <SubtopicBody
          subtopic={subtopic}
          locked={locked}
          headingOrder={first ? 3 : 2}
          theoryClassName={styles.theory}
          sectionClassName={styles.section}
          sectionTitleClassName={styles.sectionTitle}
        />
      </Suspense>
      {locked ? (
        <PaywallGate
          access={props.access}
          offer={props.offer}
          unlocks={paywallUnlocks.topic(
            props.lesson,
            props.lockedTasks?.length ?? 0,
          )}
          {...paywallCopy.topic(props.lesson.taskNumbers)}
          headingOrder={first ? 3 : 2}
          from={`/ege/${props.lesson.routeSlug}/${subtopic.slug}`}
        />
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
