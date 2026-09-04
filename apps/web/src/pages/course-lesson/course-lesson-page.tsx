import { useRef } from "react";
import { getCourseLessons } from "~/entities/course";
import { type LessonTypes } from "~/entities/lesson";
import {
  LessonIntro,
  LessonTheory,
  LessonSectionHeading,
} from "~/shared/components/learning-content";
import { checkPracticeAnswer } from "~/features/lesson-practice";
import { useLessonTelemetry } from "~/features/analytics";
import { ReadingPositionIndicator } from "~/features/reading-position";
import { LessonOutline } from "~/widgets/lesson-outline";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { PublicFooter } from "~/widgets/public-footer";
import { CourseLessonHeader } from "./components/course-lesson-header";
import { CourseLessonProgress } from "./components/course-lesson-progress";
import { CourseLessonResult } from "./components/course-lesson-result";
import type { CourseLessonPageTypes } from "./course-lesson-page.types";
import styles from "./course-lesson-page.module.css";

export const CourseLessonPage: React.FC<CourseLessonPageTypes.Props> = (
  props,
) => {
  const articleRef = useRef<HTMLElement>(null);
  const handleAnswerChecked = useLessonTelemetry(
    props.lesson.id,
    props.tasks.length,
  );
  const publishedLessons = getCourseLessons(props.course).filter(
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
      <main className={styles.lesson} data-lesson-frame>
        <LessonIntro
          accessTier={props.lesson.accessTier}
          className={styles.intro}
          eyebrow="Урок курса"
          summary={props.lesson.summary}
          taskCount={props.tasks.length}
          technology="Python 3"
          title={props.lesson.title}
        />

        <aside className={styles.rail} data-outline-rail>
          <div className={styles.railContents}>
            <LessonOutline groups={outline} />
            <CourseLessonProgress
              masteryThreshold={props.lesson.masteryThreshold ?? 0.8}
              lessonId={props.lesson.id}
              taskCount={props.tasks.length}
            />
          </div>
        </aside>

        <article className={styles.article} data-article-frame ref={articleRef}>
          <LessonTheory
            concepts={props.lesson.theory}
            className={styles.section}
          />

          <section
            id="practice"
            className={styles.section + " " + styles.practiceSection}
          >
            <LessonSectionHeading index={2} variant="lesson">
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
            className={styles.section + " " + styles.resultSection}
          >
            <LessonSectionHeading index={3} variant="lesson">
              Итог
            </LessonSectionHeading>
            <CourseLessonResult
              course={props.course}
              lesson={props.lesson}
              nextLesson={nextLesson}
              previousLesson={previousLesson}
            />
          </section>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
};
