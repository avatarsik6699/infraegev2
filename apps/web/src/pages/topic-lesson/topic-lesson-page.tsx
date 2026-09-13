import { useRouter } from "@tanstack/react-router";
import { useRef } from "react";
import { lessonPublications, type LessonTypes } from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import {
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
import { TopicLessonProgress } from "./components/topic-lesson-progress";
import { TopicLessonResult } from "./components/topic-lesson-result";
import type { TopicLessonPageTypes } from "./topic-lesson-page.types";
import styles from "~/shared/styles/lesson-layout.module.css";

export const TopicLessonPage: React.FC<TopicLessonPageTypes.Props> = (
  props,
) => {
  const router = useRouter();
  const articleRef = useRef<HTMLElement>(null);
  const handleAnswerChecked = useLessonTelemetry(
    props.lesson.id,
    props.tasks.length,
  );
  const publishedLessons = lessonPublications.filter(
    (lesson) => lesson.status === "published",
  );
  const currentLessonIndex = publishedLessons.findIndex(
    (lesson) => lesson.id === props.lesson.id,
  );
  const previousLesson =
    currentLessonIndex > 0
      ? publishedLessons[currentLessonIndex - 1]
      : undefined;
  const nextLesson =
    currentLessonIndex >= 0
      ? publishedLessons[currentLessonIndex + 1]
      : undefined;
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
    { id: "practice", label: "Практика", items: [] },
    { id: "result", label: "Итог", items: [] },
  ];
  const examIndex = 2;
  const practiceIndex = examIndex + Number(Boolean(props.lesson.examFocus));
  const resultIndex = practiceIndex + 1;

  return (
    <div className={styles.page} data-topic-lesson-page>
      <ReadingPositionIndicator targetRef={articleRef} />
      <TopicLessonHeader
        taskNumbers={props.lesson.taskNumbers}
        title={props.lesson.title}
      />

      <main className={styles.lesson} data-lesson-frame>
        <div className={styles.intro}>
          <LessonIntro
            accessTier={props.lesson.accessTier}
            eyebrow={topicCatalog.formatTaskNumbers(props.lesson.taskNumbers)}
            summary={props.lesson.summary}
            taskCount={props.tasks.length}
            title={props.lesson.title}
          />
        </div>
        <aside className={styles.rail} data-outline-rail>
          <div className={styles.railContents}>
            <LessonOutline groups={outline} />
            <div className={styles.railSpacer} aria-hidden="true" />
            <TopicLessonProgress
              masteryThreshold={props.lesson.masteryThreshold ?? 0.8}
              lessonId={props.lesson.id}
              tasks={props.tasks}
            />
          </div>
        </aside>

        <article className={styles.article} data-article-frame ref={articleRef}>
          <LessonTheory
            concepts={props.lesson.theory}
            className={styles.section}
          />

          {props.lesson.examFocus ? (
            <section id="exam-focus" className={styles.section}>
              <LessonSectionHeading index={examIndex}>
                На экзамене
              </LessonSectionHeading>
              <Typography.Prose>{props.lesson.examFocus}</Typography.Prose>
            </section>
          ) : null}

          <section id="practice" className={styles.section}>
            <LessonSectionHeading index={practiceIndex}>
              Практика
            </LessonSectionHeading>
            <LessonPracticeFlow
              unavailable={props.practiceUnavailable}
              onRefresh={() => router.invalidate()}
              tasks={props.tasks}
              lessonId={props.lesson.id}
              checkAnswer={checkPracticeAnswer}
              onAnswerChecked={handleAnswerChecked}
            />
          </section>

          <section id="result" className={styles.section}>
            <LessonSectionHeading index={resultIndex}>
              Итог
            </LessonSectionHeading>
            <TopicLessonResult
              lesson={props.lesson}
              nextLesson={nextLesson}
              previousLesson={previousLesson}
            />
          </section>
        </article>

        <aside
          className={styles.marginRail}
          data-margin-rail
          aria-hidden="true"
        />
      </main>
      <div className={styles.footer} data-lesson-footer>
        <PublicFooter />
      </div>
    </div>
  );
};
