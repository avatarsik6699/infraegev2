import { useEffect, useMemo, useRef } from "react";
import {
  Checkpoint,
  LessonSectionHeading,
  lessonPublications,
  type LessonTypes,
} from "~/entities/lesson";
import {
  LessonPractice,
  checkPracticeAnswer,
} from "~/features/lesson-practice";
import { createLessonProgressStore } from "~/features/lesson-progress";
import { ReadingPositionIndicator } from "~/features/reading-position";
import { reportProductEvent } from "~/features/product-analytics";
import { Badge } from "~/shared/components/badge";
import { Typography } from "~/shared/components/typography";
import { LessonOutline } from "~/widgets/lesson-outline";
import { PublicFooter } from "~/widgets/public-footer";
import { TopicLessonHeader } from "./components/topic-lesson-header";
import { TopicLessonResult } from "./components/topic-lesson-result";
import type { TopicLessonPageTypes } from "./topic-lesson-page.types";
import styles from "./topic-lesson-page.module.css";

export const TopicLessonPage: React.FC<TopicLessonPageTypes.Props> = (
  props,
) => {
  const articleRef = useRef<HTMLElement>(null);
  const progressStore = useMemo(
    () => createLessonProgressStore({ lessonId: props.lesson.id }),
    [props.lesson.id],
  );
  const practiceStartedRef = useRef(false);
  const completionReportedRef = useRef(false);
  useEffect(
    function reportLessonOpenedFx() {
      reportProductEvent({
        name: "lesson_opened",
        properties: { lesson: props.lesson.id },
      });
    },
    [props.lesson.id],
  );
  function handleAnswerChecked(result: "correct" | "incorrect") {
    if (!practiceStartedRef.current) {
      practiceStartedRef.current = true;
      reportProductEvent({
        name: "practice_started",
        properties: { lesson: props.lesson.id },
      });
    }
    reportProductEvent({
      name: "practice_answer_checked",
      properties: { lesson: props.lesson.id, result },
    });
    if (
      !completionReportedRef.current &&
      progressStore.getSnapshot().solvedTaskIds.length >= props.tasks.length
    ) {
      completionReportedRef.current = true;
      reportProductEvent({
        name: "lesson_completed",
        properties: { lesson: props.lesson.id },
      });
    }
  }
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
          <header className={styles.intro}>
            <div className={styles.lessonMeta} aria-label="Сведения об уроке">
              <Badge>{`Задание ${String(props.lesson.taskNumber)}`}</Badge>
              <Badge>ЕГЭ по информатике</Badge>
              <Badge>{taskCountLabel(props.tasks.length)}</Badge>
              <Badge>
                {props.lesson.accessTier === "free"
                  ? "Бесплатно"
                  : "По подписке"}
              </Badge>
            </div>
            <Typography.Title order={1}>{props.lesson.title}</Typography.Title>
            <Typography.Text variant="lead" tone="muted">
              {props.lesson.summary}
            </Typography.Text>
          </header>

          <section
            id="theory"
            className={`${styles.section} ${styles.theorySection}`}
          >
            <LessonSectionHeading index={1}>Теория</LessonSectionHeading>
            <div className={styles.concepts}>
              {props.lesson.theory.map((concept) => (
                <section
                  className={styles.concept}
                  id={concept.id}
                  key={concept.id}
                >
                  <Typography.Title order={3}>
                    {concept.navLabel}
                  </Typography.Title>
                  <Typography.Prose
                    className={styles.conceptExplanation}
                    data-concept-explanation
                  >
                    {concept.explanation}
                  </Typography.Prose>
                  {concept.diagram ? (
                    <div className={styles.conceptVisual}>
                      {concept.diagram}
                    </div>
                  ) : null}
                  {concept.workedExample ? (
                    <div className={styles.conceptExample}>
                      {concept.workedExample}
                    </div>
                  ) : null}
                  {concept.mistake ? (
                    <div className={styles.conceptMistake} data-concept-mistake>
                      {concept.mistake}
                    </div>
                  ) : null}
                  {concept.checkpoint ? (
                    <div
                      className={styles.conceptCheckpoint}
                      data-concept-checkpoint
                    >
                      <Checkpoint items={concept.checkpoint} />
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </section>

          {props.lesson.examFocus ? (
            <section id="exam-focus" className={styles.section}>
              <LessonSectionHeading index={examIndex}>
                На экзамене
              </LessonSectionHeading>
              <Typography.Prose>{props.lesson.examFocus}</Typography.Prose>
            </section>
          ) : null}

          {props.lesson.checkpoint ? (
            <section id="checkpoint" className={styles.section}>
              <LessonSectionHeading index={checkpointIndex}>
                Проверьте себя
              </LessonSectionHeading>
              <Checkpoint items={props.lesson.checkpoint} />
            </section>
          ) : null}

          <section
            id="practice"
            className={`${styles.section} ${styles.practiceSection}`}
          >
            <LessonSectionHeading index={practiceIndex}>
              Практика
            </LessonSectionHeading>
            <LessonPractice
              tasks={props.tasks}
              progressStore={progressStore}
              checkAnswer={checkPracticeAnswer}
              onAnswerChecked={handleAnswerChecked}
            />
          </section>

          <section
            id="result"
            className={`${styles.section} ${styles.resultSection}`}
          >
            <LessonSectionHeading index={resultIndex}>
              Итог
            </LessonSectionHeading>
            <TopicLessonResult
              lesson={props.lesson}
              otherPublishedLessons={otherPublishedLessons}
              progressStore={progressStore}
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

function taskCountLabel(count: number): string {
  const modulo100 = count % 100;
  const modulo10 = count % 10;
  const noun =
    modulo100 >= 11 && modulo100 <= 14
      ? "задач"
      : modulo10 === 1
        ? "задача"
        : modulo10 >= 2 && modulo10 <= 4
          ? "задачи"
          : "задач";
  return `${String(count)} ${noun}`;
}
