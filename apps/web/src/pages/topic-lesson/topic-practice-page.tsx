import { useRouter } from "@tanstack/react-router";
import { lessonSubtopics } from "~/entities/lesson";
import { useAccountSession } from "~/features/account";
import {
  checkPracticeAnswer,
  createCheckAndSaveAnswer,
} from "~/features/lesson-practice";
import { Checkpoint } from "~/shared/components/learning-content";
import { Typography } from "~/shared/components/typography";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
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
  // F43: the summary opens the page, then the tasks, then the self-check.
  const outline = [
    { id: "result", label: "Итог" },
    ...(props.lesson.examFocus
      ? [{ id: "exam-focus", label: "На экзамене" }]
      : []),
    { id: "practice", label: "Практика" },
    ...(props.lesson.checkpoint
      ? [{ id: "self-check", label: "Проверьте себя" }]
      : []),
  ];

  return (
    <TopicLessonFrame {...props} current="practice" outline={outline}>
      <header className={styles.subtopicHead} data-subtopic-head>
        <Typography.Text className={styles.position}>
          {props.lesson.title}
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

      <div id="result" className={styles.summary} data-topic-summary>
        <Typography.Prose>{props.lesson.result}</Typography.Prose>
      </div>

      {props.lesson.examFocus ? (
        <section
          id="exam-focus"
          className={styles.section}
          aria-labelledby="exam-focus-title"
        >
          <Typography.Title
            order={2}
            id="exam-focus-title"
            className={styles.sectionTitle}
          >
            На экзамене
          </Typography.Title>
          <Typography.Prose>{props.lesson.examFocus}</Typography.Prose>
        </section>
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
      </section>

      {props.lesson.checkpoint ? (
        // The Checkpoint is itself the «Проверьте себя» region.
        <div id="self-check" className={styles.section}>
          <Checkpoint items={props.lesson.checkpoint} />
        </div>
      ) : null}

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
