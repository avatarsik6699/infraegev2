import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ActionLink } from "~/shared/components/action-link";
import { ResponsiveDisclosure } from "~/shared/components/responsive-disclosure";
import { Typography } from "~/shared/components/typography";
import type { CourseNavigationTypes } from "./course-navigation.types";
import styles from "./course-navigation.module.css";

/** Left panel of a course lesson: the course, the current module's lessons and the other modules (Change 169). */
export const CourseNavigation: React.FC<CourseNavigationTypes.Props> = (
  props,
) => {
  const [expanded, setExpanded] = useState(false);
  const moduleIndex = props.modules.findIndex((module) =>
    module.lessons.some((lesson) => lesson.id === props.currentLessonId),
  );
  const module = props.modules[moduleIndex];
  const lessonIndex =
    module?.lessons.findIndex(
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
        <div className={styles.head}>
          <ActionLink
            className={styles.back}
            presentation="action"
            hierarchy="text"
            icon="back"
            to="/courses/$courseSlug"
            params={{ courseSlug: props.courseRouteSlug }}
          >
            К программе курса
          </ActionLink>
          <Typography.Text className={styles.title}>
            {props.courseTitle}
          </Typography.Text>
          {module ? (
            <Typography.Text className={styles.meta}>
              {`Модуль ${String(moduleIndex + 1)} · ${module.title}`}
            </Typography.Text>
          ) : null}
        </div>
        {module ? (
          <ol className={styles.list}>
            {module.lessons.map((lesson, index) => {
              const number = `${String(moduleIndex + 1)}.${String(index + 1)}`;
              const content = (
                <>
                  <span className={styles.marker} aria-hidden="true">
                    {number}
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
                        lesson.id === props.currentLessonId ? "page" : undefined
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
        ) : null}
        <Typography.Text className={styles.group}>
          Другие модули
        </Typography.Text>
        <ol className={styles.list}>
          {props.modules.map((item, index) => {
            if (index === moduleIndex) return null;
            const first = item.lessons.find((lesson) => lesson.routeSlug);
            const content = (
              <>
                <span className={styles.marker} aria-hidden="true">
                  {index + 1}
                </span>
                <span className={styles.label}>{item.title}</span>
              </>
            );
            return (
              <li key={item.id}>
                {first?.routeSlug ? (
                  <Link
                    className={styles.link}
                    to="/courses/$courseSlug/$lessonSlug"
                    params={{
                      courseSlug: props.courseRouteSlug,
                      lessonSlug: first.routeSlug,
                    }}
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
        {props.progress ? (
          <div className={styles.progress}>{props.progress}</div>
        ) : null}
      </ResponsiveDisclosure>
    </nav>
  );
};
