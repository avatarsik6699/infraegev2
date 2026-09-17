import { useRouter } from "@tanstack/react-router";
import { useRef } from "react";
import { getCourseLessons } from "~/entities/course";
import { type LessonTypes } from "~/entities/lesson";
import {
  LessonIntro,
  LessonTheory,
  LessonSectionHeading,
} from "~/shared/components/learning-content";
import { checkPracticeAnswer } from "~/features/lesson-practice";
import { ReadingPositionIndicator } from "~/features/reading-position";
import { LessonOutline } from "~/widgets/lesson-outline";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { PublicFooter } from "~/widgets/public-footer";
import { CourseLessonHeader } from "./components/course-lesson-header";
import { CourseLessonProgress } from "./components/course-lesson-progress";
import { CourseLessonResult } from "./components/course-lesson-result";
import type { CourseLessonPageTypes } from "./course-lesson-page.types";
import styles from "~/shared/styles/lesson-layout.module.css";

export const CourseLessonPage: React.FC<CourseLessonPageTypes.Props> = (
  props,
) => {
  const router = useRouter();
  const articleRef = useRef<HTMLElement>(null);
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
        <div className={styles.intro}>
          <LessonIntro
            accessTier={props.lesson.accessTier}
            eyebrow="Урок курса"
            summary={props.lesson.summary}
            taskCount={props.tasks.length}
            title={props.lesson.title}
          />
        </div>

        <aside className={styles.rail} data-outline-rail>
          <div className={styles.railContents}>
            <LessonOutline groups={outline} />
            <div className={styles.railSpacer} aria-hidden="true" />
            <CourseLessonProgress
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

          <section id="practice" className={styles.section}>
            <LessonSectionHeading index={2}>Практика</LessonSectionHeading>
            <LessonPracticeFlow
              unavailable={props.practiceUnavailable}
              onRefresh={() => router.invalidate()}
              tasks={props.tasks}
              lessonId={props.lesson.id}
              checkAnswer={checkPracticeAnswer}
            />
          </section>

          <section id="result" className={styles.section}>
            <LessonSectionHeading index={3}>Итог</LessonSectionHeading>
            <CourseLessonResult
              course={props.course}
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
