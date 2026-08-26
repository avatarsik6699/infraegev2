import { useEffect, useRef } from "react";
import { type LessonTypes } from "~/entities/lesson";
import {
  Checkpoint,
  LessonSectionHeading,
} from "~/shared/components/learning-content";
import {
  checkPracticeAnswer,
  type LessonPracticeTypes,
} from "~/features/lesson-practice";
import { reportProductEvent } from "~/features/analytics";
import { ReadingPositionIndicator } from "~/features/reading-position";
import { Badge } from "~/shared/components/badge";
import { Typography } from "~/shared/components/typography";
import { LessonOutline } from "~/widgets/lesson-outline";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { PublicFooter } from "~/widgets/public-footer";
import { CourseLessonHeader } from "./components/course-lesson-header";
import { CourseLessonResult } from "./components/course-lesson-result";
import type { CourseLessonPageTypes } from "./course-lesson-page.types";
import styles from "./course-lesson-page.module.css";

export const CourseLessonPage: React.FC<CourseLessonPageTypes.Props> = (
  props,
) => {
  const articleRef = useRef<HTMLElement>(null);
  const practiceStartedRef = useRef(false);
  const completionReportedRef = useRef(false);

  useEffect(
    function reportCourseLessonOpenedFx() {
      reportProductEvent({
        name: "lesson_opened",
        properties: { lesson: props.lesson.id },
      });
    },
    [props.lesson.id],
  );

  function handleAnswerChecked(
    event: LessonPracticeTypes.AnswerCheckedEvent,
  ): void {
    if (!practiceStartedRef.current) {
      practiceStartedRef.current = true;
      reportProductEvent({
        name: "practice_started",
        properties: { lesson: props.lesson.id },
      });
    }
    reportProductEvent({
      name: "practice_answer_checked",
      properties: { lesson: props.lesson.id, result: event.result },
    });
    if (
      !completionReportedRef.current &&
      event.solvedCount >= props.tasks.length
    ) {
      completionReportedRef.current = true;
      reportProductEvent({
        name: "lesson_completed",
        properties: { lesson: props.lesson.id },
      });
    }
  }

  const outline: LessonTypes.OutlineGroup[] = [
    {
      id: "theory",
      label: "Теория",
      items: props.lesson.theory.map((concept) => ({
        id: concept.id,
        label: concept.navLabel,
      })),
    },
    ...(props.lesson.checkpoint
      ? [{ id: "checkpoint", label: "Проверьте себя", items: [] }]
      : []),
    { id: "practice", label: "Практика", items: [] },
    { id: "result", label: "Итог", items: [] },
  ];
  return (
    <div className={styles.page} data-course-lesson-page>
      <ReadingPositionIndicator targetRef={articleRef} />
      <CourseLessonHeader
        courseRouteSlug={props.course.routeSlug}
        courseTitle={props.course.title}
        lessonTitle={props.lesson.title}
      />
      <main className={styles.lesson}>
        <header className={styles.intro}>
          <div className={styles.lessonMeta} aria-label="Сведения об уроке">
            <Badge>Урок курса</Badge>
            <Badge>Python 3</Badge>
            <Badge>{taskCountLabel(props.tasks.length)}</Badge>
            <Badge>
              {props.lesson.accessTier === "free" ? "Бесплатно" : "По подписке"}
            </Badge>
          </div>
          <Typography.Title order={1}>{props.lesson.title}</Typography.Title>
          <Typography.Text variant="lead" tone="muted">
            {props.lesson.summary}
          </Typography.Text>
        </header>

        <aside className={styles.rail}>
          <div className={styles.railContents}>
            <LessonOutline groups={outline} />
          </div>
        </aside>

        <article className={styles.article} ref={articleRef}>
          <section
            id="theory"
            className={styles.section + " " + styles.theorySection}
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
                  <Typography.Prose className={styles.conceptExplanation}>
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
                    <div className={styles.conceptMistake}>
                      {concept.mistake}
                    </div>
                  ) : null}
                  {concept.checkpoint ? (
                    <div className={styles.conceptCheckpoint}>
                      <Checkpoint items={concept.checkpoint} />
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </section>

          {props.lesson.checkpoint ? (
            <div id="checkpoint" className={styles.section}>
              <Checkpoint items={props.lesson.checkpoint} />
            </div>
          ) : null}

          <section
            id="practice"
            className={styles.section + " " + styles.practiceSection}
          >
            <LessonSectionHeading index={2}>Практика</LessonSectionHeading>
            <LessonPracticeFlow
              tasks={props.tasks}
              lessonId={props.lesson.id}
              checkAnswer={checkPracticeAnswer}
              onAnswerChecked={handleAnswerChecked}
            />
          </section>

          <section
            id="result"
            className={styles.section + " " + styles.resultSection}
          >
            <LessonSectionHeading index={3}>Итог</LessonSectionHeading>
            <CourseLessonResult
              course={props.course}
              lesson={props.lesson}
              taskCount={props.tasks.length}
            />
          </section>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
};

function taskCountLabel(count: number): string {
  const modulo100 = count % 100;
  const modulo10 = count % 10;
  let noun = "задач";
  if (modulo100 < 11 || modulo100 > 14) {
    if (modulo10 === 1) noun = "задача";
    if (modulo10 >= 2 && modulo10 <= 4) noun = "задачи";
  }
  return String(count) + " " + noun;
}
