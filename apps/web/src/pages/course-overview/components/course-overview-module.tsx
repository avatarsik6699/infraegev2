import { Link } from "@tanstack/react-router";
import type { CourseTypes } from "~/entities/course";
import { Badge } from "~/shared/components/badge";
import { Typography } from "~/shared/components/typography";
import styles from "../course-overview-page.module.css";

type Props = {
  courseRouteSlug: string;
  index: number;
  lessons: readonly CourseTypes.LessonDefinition[];
  module: CourseTypes.Module;
};

export const CourseOverviewModule: React.FC<Props> = (props) => {
  const available = props.lessons.length > 0;

  return (
    <li
      className={styles.module}
      data-availability={available ? "available" : "planned"}
      data-course-module
    >
      <span className={styles.moduleNumber} aria-hidden="true">
        {String(props.index + 1).padStart(2, "0")}
      </span>
      <div className={styles.moduleCopy}>
        <Typography.Title order={3}>{props.module.title}</Typography.Title>
        <Typography.Text tone="muted">{props.module.summary}</Typography.Text>
      </div>
      {available ? null : (
        <Badge className={styles.moduleStatus}>В разработке</Badge>
      )}
      {available ? (
        <ul className={styles.lessonList}>
          {props.lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                to="/courses/$courseSlug/$lessonSlug"
                params={{
                  courseSlug: props.courseRouteSlug,
                  lessonSlug: lesson.routeSlug,
                }}
              >
                <span>{lesson.title}</span>
                <span>
                  {lesson.status === "published" ? "Доступен" : "На проверке"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
};
