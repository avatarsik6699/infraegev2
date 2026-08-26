import { useEffect } from "react";
import { reportProductEvent } from "~/features/analytics";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { CourseOverviewCurriculum } from "./components/course-overview-curriculum";
import { CourseOverviewIntro } from "./components/course-overview-intro";
import { CourseOverviewOutcomes } from "./components/course-overview-outcomes";
import type { CourseOverviewPageTypes } from "./course-overview-page.types";
import styles from "./course-overview-page.module.css";

export const CourseOverviewPage: React.FC<CourseOverviewPageTypes.Props> = (
  props,
) => {
  useEffect(
    function reportCourseOpenedFx() {
      reportProductEvent({
        name: "course_opened",
        properties: { course: props.course.id },
      });
    },
    [props.course.id],
  );

  const visibleLessons = props.lessons.filter((lesson) =>
    props.course.status === "published"
      ? lesson.status === "published"
      : lesson.status !== "draft",
  );
  const progressLessons = props.lessons.filter(
    (lesson) => lesson.status === "published",
  );

  return (
    <div className={styles.page} data-course-overview-page>
      <PublicHeader />
      <main className={styles.root}>
        <div className={styles.courseSummary}>
          <CourseOverviewIntro
            course={props.course}
            firstVisibleLesson={visibleLessons[0]}
            progressLessons={progressLessons}
          />
          <CourseOverviewOutcomes outcomes={props.course.learningOutcomes} />
        </div>
        <CourseOverviewCurriculum
          courseRouteSlug={props.course.routeSlug}
          lessons={visibleLessons}
          modules={props.course.modules}
        />
      </main>
      <PublicFooter />
    </div>
  );
};
