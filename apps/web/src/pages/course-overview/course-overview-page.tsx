import { PageContainer } from "~/shared/components/page-container";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { CourseOverviewCurriculum } from "./components/course-overview-curriculum";
import { CourseOverviewIntro } from "./components/course-overview-intro";
import { CourseOverviewProgress } from "./components/course-overview-progress";
import { useCourseOverview } from "./model/use-course-overview";
import type { CourseOverviewPageTypes } from "./course-overview-page.types";
import styles from "./course-overview-page.module.css";

export const CourseOverviewPage: React.FC<CourseOverviewPageTypes.Props> = (
  props,
) => {
  const overview = useCourseOverview(props);
  return (
    <div className={styles.page} data-course-overview-page>
      <PublicHeader activeSection="courses" />
      <PageContainer component="main" measure="wide" className={styles.root}>
        <div className={styles.courseSummary} data-course-summary>
          <CourseOverviewIntro course={props.course} overview={overview} />
          <CourseOverviewProgress
            progress={overview.progress}
            guestTotal={props.practiceSummary?.reduce(
              (total, lesson) => total + lesson.tasks.length,
              0,
            )}
          />
        </div>
        <CourseOverviewCurriculum
          courseRouteSlug={props.course.routeSlug}
          modules={overview.modules}
          action={overview.action}
        />
      </PageContainer>
      <PublicFooter />
    </div>
  );
};
