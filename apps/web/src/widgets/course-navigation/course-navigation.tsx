import { CourseChip } from "~/entities/course";
import { advancedLevelLabel } from "~/entities/lesson";
import { Link } from "@tanstack/react-router";
import styles from "./course-navigation.module.css";
import { LessonTree } from "~/shared/components/lesson-tree";
import type { CourseNavigationTypes } from "./course-navigation.types";

/**
 * F37: the course as a file tree — modules are folders of lessons, the
 * current module is open; lessons that are not published stay muted.
 */
export const CourseNavigation: React.FC<CourseNavigationTypes.Props> = (
  props,
) => {
  const moduleIndex = props.modules.findIndex((module) =>
    module.lessons.some((lesson) => lesson.id === props.currentLessonId),
  );
  const lessonIndex =
    props.modules[moduleIndex]?.lessons.findIndex(
      (lesson) => lesson.id === props.currentLessonId,
    ) ?? -1;
  const position =
    moduleIndex >= 0 && lessonIndex >= 0
      ? `урок ${String(moduleIndex + 1)}.${String(lessonIndex + 1)}`
      : "уроки";

  return (
    <LessonTree
      ariaLabel="Уроки курса"
      disclosureLabel={`${props.courseShortTitle} · ${position}`}
      rootLabel={
        <>
          <CourseChip entry={{ id: props.courseId }} className={styles.chip} />
          <Link
            className={styles.course}
            to="/courses/$courseSlug"
            params={{ courseSlug: props.courseRouteSlug }}
            activeOptions={{ exact: true }}
          >
            {props.courseTitle}
          </Link>
        </>
      }
      doneLabel="урок освоен"
      navProps={{ "data-course-navigation": true }}
      progress={props.progress}
      folders={props.modules.map((module, index) => ({
        id: module.id,
        marker: index + 1,
        label: module.title,
        open: index === moduleIndex,
        files: module.lessons.map((lesson, position) => ({
          id: lesson.id,
          marker: `${String(index + 1)}.${String(position + 1)}`,
          label: lesson.title,
          ...(lesson.routeSlug
            ? {
                to: "/courses/$courseSlug/$lessonSlug",
                params: {
                  courseSlug: props.courseRouteSlug,
                  lessonSlug: lesson.routeSlug,
                },
              }
            : {}),
          current: lesson.id === props.currentLessonId,
          done: props.masteredLessonIds?.has(lesson.id),
          locked: props.locks && lesson.paid,
          note: lesson.level === "advanced" ? advancedLevelLabel : undefined,
        })),
      }))}
    />
  );
};
