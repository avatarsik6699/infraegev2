import { useRouter } from "@tanstack/react-router";
import { useMemo, useRef } from "react";
import { ScrollToTop } from "~/shared/components/scroll-to-top";
import { getCourseLessons } from "~/entities/course";
import { Breadcrumbs } from "~/shared/components/breadcrumbs";
import { LessonTheory } from "~/shared/components/learning-content";
import { Typography } from "~/shared/components/typography";
import { useMediaQuery } from "~/shared/lib/media-query";
import { russianCount } from "~/shared/lib/russian-count";
import { theoryLinkLabel } from "~/shared/lib/theory-link-label";
import { useAccountSession } from "~/features/account";
import {
  checkPracticeAnswer,
  createCheckAndSaveAnswer,
} from "~/features/lesson-practice";
import { ReadingPositionIndicator } from "~/features/reading-position";
import { CourseNavigation } from "~/widgets/course-navigation";
import { PageOutline } from "~/widgets/lesson-outline";
import { LessonProgressPanel } from "~/widgets/lesson-progress-panel";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { CourseLessonPager } from "./components/course-lesson-pager";
import { CourseLessonResult } from "./components/course-lesson-result";
import type { CourseLessonPageTypes } from "./course-lesson-page.types";
import styles from "./course-lesson.module.css";

export const CourseLessonPage: React.FC<CourseLessonPageTypes.Props> = (
  props,
) => {
  const router = useRouter();
  const practiceTasks = useMemo(
    () =>
      props.tasks.map((task) => ({
        ...task,
        theoryLinks: task.theoryLinks.map((link) => ({
          ...link,
          label: theoryLinkLabel(props.lesson.theory, link.hash),
        })),
      })),
    [props.tasks, props.lesson.theory],
  );
  const session = useAccountSession();
  const articleRef = useRef<HTMLElement>(null);
  const lessons = getCourseLessons(props.course);
  const routeSlugs = new Map(
    lessons
      .filter((lesson) => lesson.status === "published")
      .map((lesson) => [lesson.id, lesson.routeSlug]),
  );
  const publishedLessons = lessons.filter(
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
  const modules = props.course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    lessons: module.lessonPlan.map((item) => ({
      id: item.id,
      title: item.title,
      routeSlug: routeSlugs.get(item.id),
    })),
  }));
  const moduleIndex = modules.findIndex((module) =>
    module.lessons.some((lesson) => lesson.id === props.lesson.id),
  );
  const lessonNumber =
    moduleIndex >= 0
      ? `${String(moduleIndex + 1)}.${String(
          (modules[moduleIndex]?.lessons.findIndex(
            (lesson) => lesson.id === props.lesson.id,
          ) ?? 0) + 1,
        )}`
      : undefined;
  // F38: progress sits under «На этой странице»; below 72rem it moves into
  // the course menu. One instance either way.
  const narrow = useMediaQuery("(max-width: 72rem)");
  const progress = (
    <LessonProgressPanel
      kind="course_lesson"
      masteryThreshold={props.lesson.masteryThreshold ?? 0.8}
      lessonId={props.lesson.id}
      tasks={props.tasks}
    />
  );
  const outline = [
    ...props.lesson.theory.map((concept) => ({
      id: concept.id,
      label: concept.navLabel,
    })),
    { id: "practice", label: "Практика" },
    { id: "result", label: "Итог" },
  ];

  return (
    <div className={styles.page} data-course-lesson-page>
      <ScrollToTop key={props.lesson.id} headingId="lesson-title" />
      <ReadingPositionIndicator targetRef={articleRef} />
      <PublicHeader activeSection="courses" />

      <main id="main-content" className={styles.lesson} data-lesson-frame>
        <aside
          className={styles.rail}
          aria-label="Уроки курса"
          data-outline-rail
        >
          <div className={styles.railContents}>
            <CourseNavigation
              courseRouteSlug={props.course.routeSlug}
              courseTitle={props.course.title}
              modules={modules}
              currentLessonId={props.lesson.id}
              progress={narrow ? progress : null}
            />
          </div>
        </aside>

        <article className={styles.article} data-article-frame ref={articleRef}>
          <Breadcrumbs
            className={styles.breadcrumbs}
            navProps={{ "data-course-lesson-context": true }}
            items={[
              { label: "Мини-курсы", to: "/courses" },
              {
                label: props.course.title,
                to: "/courses/$courseSlug",
                params: { courseSlug: props.course.routeSlug },
              },
              { label: props.lesson.title },
            ]}
          />

          <header className={styles.head} data-course-lesson-head>
            {lessonNumber ? (
              <Typography.Text className={styles.position}>
                {`Модуль ${String(moduleIndex + 1)} · Урок ${lessonNumber}`}
              </Typography.Text>
            ) : null}
            <Typography.Title
              order={1}
              id="lesson-title"
              tabIndex={-1}
              className={styles.title}
            >
              {props.lesson.title}
            </Typography.Title>
            <Typography.Text
              variant="lead"
              tone="muted"
              className={styles.summary}
            >
              {props.lesson.summary}
            </Typography.Text>
            <Typography.Text className={styles.meta}>
              {russianCount.tasks(props.tasks.length)}
              {props.lesson.accessTier === "paid" ? " · По подписке" : null}
            </Typography.Text>
          </header>

          <LessonTheory
            variant="page"
            concepts={props.lesson.theory}
            conceptHeadingOrder={2}
          />

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
              tasks={practiceTasks}
              lessonId={props.lesson.id}
              contextKind="course_lesson"
              checkAnswer={
                session.account
                  ? createCheckAndSaveAnswer(
                      "course_lesson",
                      props.lesson.id,
                      session.csrfToken,
                    )
                  : checkPracticeAnswer
              }
            />
          </section>

          <section
            id="result"
            className={styles.section}
            aria-labelledby="result-title"
          >
            <Typography.Title
              order={2}
              id="result-title"
              className={styles.sectionTitle}
            >
              Итог
            </Typography.Title>
            <CourseLessonResult lesson={props.lesson} />
          </section>

          <CourseLessonPager
            courseRouteSlug={props.course.routeSlug}
            previous={previousLesson}
            next={nextLesson}
          />
        </article>

        <aside
          className={styles.pageRail}
          aria-label="На этой странице"
          data-margin-rail
        >
          <div className={styles.pageRailContents}>
            <PageOutline items={outline} />
            {narrow ? null : (
              <div className={styles.pageProgress}>{progress}</div>
            )}
          </div>
        </aside>
      </main>
      <div className={styles.footer} data-lesson-footer>
        <PublicFooter />
      </div>
    </div>
  );
};
