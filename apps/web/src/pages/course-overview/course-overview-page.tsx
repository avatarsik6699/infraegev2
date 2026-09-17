import { Typography } from "~/shared/components/typography";
import { PageContainer } from "~/shared/components/page-container";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { CourseOverviewCurriculum } from "./components/course-overview-curriculum";
import { CourseOverviewIntro } from "./components/course-overview-intro";
import { CourseOverviewOutcomes } from "./components/course-overview-outcomes";
import { CourseOverviewProgress } from "./components/course-overview-progress";
import type { CourseOverviewPageTypes } from "./course-overview-page.types";
import styles from "./course-overview-page.module.css";

export const CourseOverviewPage: React.FC<CourseOverviewPageTypes.Props> = (
  props,
) => {
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
      <PublicHeader activeSection="courses" />
      <PageContainer component="main" measure="full" className={styles.root}>
        <div className={styles.courseSummary} data-course-summary>
          <CourseOverviewIntro
            course={props.course}
            publishedLessonCount={progressLessons.length}
            firstVisibleLesson={
              progressLessons.length === 0 ? visibleLessons[0] : undefined
            }
          />
          <CourseOverviewOutcomes outcomes={props.course.learningOutcomes} />
        </div>
        <div className={styles.courseContent} data-course-program>
          <Typography.Title order={2} id="course-curriculum">
            Программа курса
          </Typography.Title>
          <CourseOverviewProgress lessons={props.practiceSummary} />
          <CourseOverviewCurriculum
            courseRouteSlug={props.course.routeSlug}
            lessons={props.lessons}
            modules={props.course.modules}
          />
        </div>
      </PageContainer>
      <PublicFooter />
    </div>
  );
};
