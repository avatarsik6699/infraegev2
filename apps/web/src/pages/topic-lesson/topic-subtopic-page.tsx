import { useRouter } from "@tanstack/react-router";
import { groupTasksBySubtopic, lessonSubtopics } from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import { useAccountSession } from "~/features/account";
import {
  checkPracticeAnswer,
  createCheckAndSaveAnswer,
} from "~/features/lesson-practice";
import {
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
    ...(tasks.length ? [{ id: "practice", label: "Практика" }] : []),
  ];
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
          summary={props.lesson.summary}
          taskCount={props.practiceUnavailable ? undefined : props.tasks.length}
          title={props.lesson.title}
        />
      ) : null}
      <header
        className={styles.subtopicHead}
        data-subtopic-head
        data-first={first || undefined}
      >
        <Typography.Text className={styles.position}>
          {position}
        </Typography.Text>
        <Typography.Title
          order={first ? 2 : 1}
          id={first ? "subtopic-title" : "lesson-title"}
          tabIndex={first ? undefined : -1}
          className={styles.subtopicTitle}
        >
          {subtopic.title}
        </Typography.Title>
      </header>

      <LessonTheory
        variant="page"
        concepts={subtopic.concepts}
        conceptHeadingOrder={first ? 3 : 2}
        className={styles.theory}
      />

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
            ? { title: previous.title, subtopic: previous.slug }
            : undefined
        }
        next={
          next
            ? { title: next.title, subtopic: next.slug }
            : { title: "Практика и итог" }
        }
      />
    </TopicLessonFrame>
  );
};
