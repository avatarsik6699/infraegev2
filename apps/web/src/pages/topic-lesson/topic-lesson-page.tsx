import {
  Checkpoint,
  LessonSectionHeading,
  type LessonTypes,
} from "~/entities/lesson";
import {
  LessonPractice,
  checkPracticeAnswer,
} from "~/features/lesson-practice";
import {
  createLessonProgressStore,
  LessonProgress,
  useLessonProgress,
} from "~/features/lesson-progress";
import { Typography } from "~/shared/components/typography";
import { LessonOutline } from "~/widgets/lesson-outline";
import type { TopicLessonPageTypes } from "./topic-lesson-page.types";
import styles from "./topic-lesson-page.module.css";

export const TopicLessonPage: React.FC<TopicLessonPageTypes.Props> = (
  props,
) => {
  const progressStore = createLessonProgressStore({
    lessonId: props.lesson.id,
  });
  const progress = useLessonProgress(progressStore);
  const solved = progress.solvedTaskIds.filter((id) =>
    props.tasks.some((task) => task.id === id),
  ).length;
  const threshold = props.lesson.masteryThreshold ?? 0.8;
  const mastered = solved >= props.tasks.length * threshold;
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
    <main className={styles.page}>
      <header className={styles.header}>
        <Typography.Text variant="caption" tone="muted">
          {`Задание ${String(props.lesson.taskNumber)} · ЕГЭ по информатике`}
        </Typography.Text>
        <Typography.Title order={1}>{props.lesson.title}</Typography.Title>
        <Typography.Text variant="lead" tone="muted">
          {props.lesson.summary}
        </Typography.Text>
        <section className={styles.outcomes} aria-labelledby="lesson-outcomes">
          <Typography.Title order={2} id="lesson-outcomes">
            После урока вы сможете
          </Typography.Title>
          <ul>
            {props.lesson.learningOutcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>
      </header>

      <div className={styles.layout}>
        <aside className={styles.rail}>
          <div className={styles.railContents}>
            <LessonOutline groups={outline} />
            <LessonProgress
              solved={solved}
              total={props.tasks.length}
              masteryThreshold={threshold}
            />
          </div>
        </aside>

        <article className={styles.article}>
          <section id="theory" className={styles.section}>
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
                  <Typography.Prose>{concept.explanation}</Typography.Prose>
                  {concept.diagram}
                  {concept.workedExample}
                  {concept.mistake}
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
            <div id="checkpoint" className={styles.section}>
              <LessonSectionHeading index={checkpointIndex}>
                Проверьте себя
              </LessonSectionHeading>
              <Checkpoint items={props.lesson.checkpoint} />
            </div>
          ) : null}

          <section id="practice" className={styles.section}>
            <LessonSectionHeading index={practiceIndex}>
              Практика
            </LessonSectionHeading>
            <LessonPractice
              tasks={props.tasks}
              progressStore={progressStore}
              checkAnswer={checkPracticeAnswer}
            />
          </section>

          <section id="result" className={styles.section}>
            <LessonSectionHeading index={resultIndex}>
              Итог
            </LessonSectionHeading>
            <Typography.Prose>{props.lesson.result}</Typography.Prose>
            <Typography.Text className={styles.resultStatus}>
              {mastered
                ? "Порог освоения достигнут."
                : "Вернитесь к связанным фрагментам теории и продолжите практику."}
            </Typography.Text>
          </section>
        </article>
      </div>
    </main>
  );
};
