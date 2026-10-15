import { useRouter } from "@tanstack/react-router";
import { lessonSubtopics } from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
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
  // F43: the summary opens the page; Change 184: the self-check, then the tasks.
  const outline = [
    { id: "result", label: "Итог" },
    ...(props.lesson.examFocus
      ? [{ id: "exam-focus", label: "Проверка решения" }]
      : []),
    ...(props.lesson.checkpoint
      ? [{ id: "self-check", label: "Проверьте себя" }]
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
            Проверка решения
          </Typography.Title>
          <Typography.Prose>{props.lesson.examFocus}</Typography.Prose>
        </section>
      ) : null}

      {props.lesson.checkpoint ? (
        <div id="self-check" className={styles.section}>
          <Checkpoint
            items={props.lesson.checkpoint}
            headingClassName={styles.sectionTitle}
          />
        </div>
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
