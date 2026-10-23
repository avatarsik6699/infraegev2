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
  // Change 192: a paid final page the visitor cannot open — the lead, the
  // paywall, then the open tasks and the locked ones. T254: «Практика и итог»
  // reads like the course summary — its sections, «Итог», the self-check and
  // only the topic's mixed tasks (no subtopic section); a subtopic's tasks
  // stay on its page.
  const locked =
    Boolean(props.lesson.paidPractice) && !accessState.opens(props.access);
  const lockedTasks = props.lockedTasks ?? [];
  const finalSections =
    props.lesson.finalSections ?? props.lesson.paidPractice?.sections ?? [];
  const mixed = <Task extends { theoryLinks: readonly unknown[] }>(
    tasks: readonly Task[],
  ) => tasks.filter((task) => task.theoryLinks.length === 0);
  const tasks = mixed(props.tasks);
  const shownLockedTasks = mixed(lockedTasks);
  const outline = [
    ...finalSections.map((section) => ({
      id: section.id,
      label: section.navLabel,
      locked,
    })),
    { id: "result", label: "Итог", locked },
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
        {/* T254: one line under the title, as in the course summary */}
        <Typography.Text
          variant="lead"
          className={styles.subtopicLead}
          data-final-lead
        >
          {props.lesson.finalLead}
        </Typography.Text>
      </header>

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
          tasks={withSubtopicTheoryLinks(props.lesson, tasks)}
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
            tasks={shownLockedTasks}
            start={tasks.length + 1}
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
