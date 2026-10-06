import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { ResponsiveDisclosure } from "~/shared/components/responsive-disclosure";
import { Typography } from "~/shared/components/typography";
import type { CourseNavigationTypes } from "./course-navigation.types";
import styles from "./course-navigation.module.css";

/**
 * F37: the course as a file tree — modules are folders of lessons, the
 * current module is open; lessons that are not published stay muted.
 */
export const CourseNavigation: React.FC<CourseNavigationTypes.Props> = (
  props,
) => {
  const [expanded, setExpanded] = useState(false);
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
    <nav
      className={styles.root}
      aria-label="Уроки курса"
      data-course-navigation
    >
      <ResponsiveDisclosure
        label={`Курс · ${position}`}
        expanded={expanded}
        onExpandedChange={setExpanded}
      >
        <Typography.Text className={styles.treeRoot}>
          {props.courseTitle}
        </Typography.Text>
        <ul className={styles.tree}>
          {props.modules.map((module, index) => (
            <li key={module.id}>
              <details open={index === moduleIndex}>
                <summary className={styles.folder}>
                  <ChevronRight className={styles.chevron} aria-hidden />
                  <span className={styles.marker} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className={styles.label}>{module.title}</span>
                </summary>
                <ol className={styles.branch}>
                  {module.lessons.map((lesson, position) => {
                    const content = (
                      <>
                        <span className={styles.marker} aria-hidden="true">
                          {`${String(index + 1)}.${String(position + 1)}`}
                        </span>
                        <span className={styles.label}>{lesson.title}</span>
                      </>
                    );
                    return (
                      <li key={lesson.id}>
                        {lesson.routeSlug ? (
                          <Link
                            className={styles.link}
                            to="/courses/$courseSlug/$lessonSlug"
                            params={{
                              courseSlug: props.courseRouteSlug,
                              lessonSlug: lesson.routeSlug,
                            }}
                            aria-current={
                              lesson.id === props.currentLessonId
                                ? "page"
                                : undefined
                            }
                            onClick={() => setExpanded(false)}
                          >
                            {content}
                          </Link>
                        ) : (
                          <span className={styles.link} data-planned>
                            {content}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </details>
            </li>
          ))}
        </ul>
        {props.progress ? (
          <div className={styles.progress}>{props.progress}</div>
        ) : null}
      </ResponsiveDisclosure>
    </nav>
  );
};
