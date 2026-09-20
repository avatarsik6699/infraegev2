import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import { CourseOverviewLesson } from "./course-overview-lesson";
import styles from "../course-overview-page.module.css";

type Props = {
  courseRouteSlug: string;
  lessons: readonly CourseOverviewPageTypes.Lesson[];
  continuingLessonId?: string;
};

export const CourseOverviewLessons: React.FC<Props> = (props) => (
  <ol className={styles.lessonList}>
    {props.lessons.map((lesson) => (
      <CourseOverviewLesson
        key={lesson.id}
        lesson={lesson}
        courseRouteSlug={props.courseRouteSlug}
        continuing={lesson.id === props.continuingLessonId}
      />
    ))}
  </ol>
);
