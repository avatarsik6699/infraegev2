import { useRef } from "react";
import { lessonPublications, type LessonTypes } from "~/entities/lesson";
import {
  Checkpoint,
  LessonIntro,
  LessonTheory,
  LessonSectionHeading,
} from "~/shared/components/learning-content";
import { checkPracticeAnswer } from "~/features/lesson-practice";
import { ReadingPositionIndicator } from "~/features/reading-position";
import { useLessonTelemetry } from "~/features/analytics";
import { Typography } from "~/shared/components/typography";
import { LessonOutline } from "~/widgets/lesson-outline";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { PublicFooter } from "~/widgets/public-footer";
import { TopicLessonHeader } from "./components/topic-lesson-header";
import { TopicLessonResult } from "./components/topic-lesson-result";
import type { TopicLessonPageTypes } from "./topic-lesson-page.types";
import styles from "./topic-lesson-page.module.css";

export const TopicLessonPage: React.FC<TopicLessonPageTypes.Props> = (
  props,
) => {
  const articleRef = useRef<HTMLElement>(null);
  const handleAnswerChecked = useLessonTelemetry(
    props.lesson.id,
    props.tasks.length,
  );
  const otherPublishedLessons = lessonPublications.filter(
    (lesson) => lesson.status === "published" && lesson.id !== props.lesson.id,
  );
  const outline: LessonTypes.OutlineGroup[] = [
    {
      id: "theory",
      label: "Теория",
      items: props.lesson.theory.map((concept) => ({
        id: concept.id,
        label: concept.navLabel,
      })),
    },
    ...(props.lesson.examFocus
      ? [{ id: "exam-focus", label: "На экзамене", items: [] }]
      : []),
    ...(props.lesson.checkpoint
      ? [{ id: "checkpoint", label: "Проверьте себя", items: [] }]
      : []),
    { id: "practice", label: "Практика", items: [] },
    { id: "result", label: "Итог", items: [] },
  ];
  const examIndex = 2;
  const checkpointIndex = examIndex + Number(Boolean(props.lesson.examFocus));
  const practiceIndex =
    checkpointIndex + Number(Boolean(props.lesson.checkpoint));
  const resultIndex = practiceIndex + 1;

  return (
    <div className={styles.page} data-topic-lesson-page>
      <ReadingPositionIndicator targetRef={articleRef} />
      <TopicLessonHeader
        taskNumber={props.lesson.taskNumber}
        title={props.lesson.title}
      />

      <main className={styles.lesson} data-lesson-frame>
        <aside className={styles.rail} data-outline-rail>
          <div className={styles.railContents}>
            <LessonOutline groups={outline} />
          </div>
        </aside>

        <article className={styles.article} data-article-frame ref={articleRef}>
          <LessonIntro
            accessTier={props.lesson.accessTier}
            eyebrow={`Задание ${String(props.lesson.taskNumber)}`}
            summary={props.lesson.summary}
            taskCount={props.tasks.length}
            technology="ЕГЭ по информатике"
            title={props.lesson.title}
          />

          <LessonTheory
            concepts={props.lesson.theory}
            className={styles.section}
          />

          {props.lesson.examFocus ? (
            <section id="exam-focus" className={styles.section}>
              <LessonSectionHeading index={examIndex} variant="lesson">
                На экзамене
              </LessonSectionHeading>
              <Typography.Prose>{props.lesson.examFocus}</Typography.Prose>
            </section>
          ) : null}

          {props.lesson.checkpoint ? (
            <section id="checkpoint" className={styles.section}>
              <LessonSectionHeading index={checkpointIndex} variant="lesson">
                Проверьте себя
              </LessonSectionHeading>
              <Checkpoint items={props.lesson.checkpoint} />
            </section>
          ) : null}

          <section
            id="practice"
            className={`${styles.section} ${styles.practiceSection}`}
          >
            <LessonSectionHeading index={practiceIndex} variant="lesson">
              Практика
            </LessonSectionHeading>
            <LessonPracticeFlow
              tasks={props.tasks}
              lessonId={props.lesson.id}
              checkAnswer={checkPracticeAnswer}
              onAnswerChecked={handleAnswerChecked}
            />
          </section>

          <section
            id="result"
            className={`${styles.section} ${styles.resultSection}`}
          >
            <LessonSectionHeading index={resultIndex} variant="lesson">
              Итог
            </LessonSectionHeading>
            <TopicLessonResult
              lesson={props.lesson}
              otherPublishedLessons={otherPublishedLessons}
              taskCount={props.tasks.length}
            />
          </section>
        </article>

        <aside
          className={styles.marginRail}
          data-margin-rail
          aria-hidden="true"
        />
      </main>
      <PublicFooter />
    </div>
  );
};
