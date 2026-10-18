import { useRouter } from "@tanstack/react-router";
import { accessState } from "~/entities/access";
import { Suspense } from "react";
import { lessonSubtopics } from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import { useAccountSession } from "~/features/account";
import {
  LockedTasks,
  PaywallGate,
  paywallCopy,
  paywallUnlocks,
} from "~/features/paywall";
import {
  checkPracticeAnswer,
  createCheckAndSaveAnswer,
} from "~/features/lesson-practice";
import { Typography } from "~/shared/components/typography";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { PracticeBody } from "./components/practice-body";
import { TopicLessonPager } from "./components/topic-lesson-pager";
import { withSubtopicTheoryLinks } from "./lib/subtopic-task-links";
import { TopicLessonFrame } from "./topic-lesson-frame";
import type { TopicLessonPageTypes } from "./topic-lesson-page.types";
import styles from "./topic-lesson.module.css";

export const TopicPracticePage: React.FC<TopicLessonPageTypes.PracticeProps> = (
  props,
) => {
  const router = useRouter();
  const session = useAccountSession();
  const subtopics = lessonSubtopics(props.lesson);
  const last = subtopics.at(-1);
  // F43: the summary opens the page; Change 184: the self-check, then the tasks.
  // Change 192: a paid final page the visitor cannot open — outcomes, the paywall,
  // then the open tasks and the locked ones.
  const locked =
    Boolean(props.lesson.paidPractice) && !accessState.opens(props.access);
  const lockedTasks = props.lockedTasks ?? [];
  const outline = [
    { id: "result", label: "Итог", locked },
    ...(props.lesson.examFocus || props.lesson.paidPractice?.examFocus
      ? [{ id: "exam-focus", label: "Проверка решения", locked }]
      : []),
    ...(props.lesson.checkpoint || props.lesson.paidPractice?.checkpoint
      ? [{ id: "self-check", label: "Проверьте себя", locked }]
      : []),
    { id: "practice", label: "Практика" },
  ];

  return (
    <TopicLessonFrame {...props} current="practice" outline={outline}>
      <header className={styles.subtopicHead} data-subtopic-head>
        {/* F43: the topic in the EGE ink, not the orange of «you are here». */}
        <Typography.Text className={styles.examEyebrow}>
          {`${topicCatalog.formatTaskNumbers(props.lesson.taskNumbers)} · ${props.lesson.title}`}
        </Typography.Text>
        <Typography.Title
          order={1}
          id="lesson-title"
          tabIndex={-1}
          className={styles.subtopicTitle}
        >
          Практика и итог
        </Typography.Title>
      </header>

      {/* F35: what the topic teaches, in a row under rules of the EGE ink. */}
      <ol className={styles.outcomes} aria-label="Чему научились в теме">
        {props.lesson.learningOutcomes.map((outcome, index) => (
          <li key={outcome} className={styles.outcome}>
            <span className={styles.outcomeMark} aria-hidden="true">
              {`${String(props.lesson.taskNumbers[0])}.${String(index + 1)}`}
            </span>
            {outcome}
          </li>
        ))}
      </ol>

      <Suspense fallback={null}>
        <PracticeBody lesson={props.lesson} locked={locked} />
      </Suspense>
      {locked ? (
        <PaywallGate
          access={props.access}
          offer={props.offer}
          unlocks={paywallUnlocks.topic(props.lesson, lockedTasks.length)}
          {...paywallCopy.topic(props.lesson.taskNumbers)}
          headingOrder={2}
          from={`/ege/${props.lesson.routeSlug}/praktika`}
        />
      ) : null}

      <section
        id="practice"
        className={styles.section}
        aria-labelledby="practice-title"
      >
        <Typography.Title
          order={2}
          id="practice-title"
          className={styles.sectionTitle}
        >
          Практика
        </Typography.Title>
        <LessonPracticeFlow
          unavailable={props.practiceUnavailable}
          onRefresh={() => router.invalidate()}
          tasks={withSubtopicTheoryLinks(props.lesson, props.tasks)}
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
        {accessState.locks(props.access) ? (
          <LockedTasks
            tasks={lockedTasks}
            start={props.tasks.length + 1}
            from={`/ege/${props.lesson.routeSlug}/praktika`}
          />
        ) : null}
      </section>

      <TopicLessonPager
        routeSlug={props.lesson.routeSlug}
        previous={
          last
            ? {
                title: last.title,
                subtopic: last.slug,
                advanced: last.level === "advanced",
              }
            : undefined
        }
      />
    </TopicLessonFrame>
  );
};
