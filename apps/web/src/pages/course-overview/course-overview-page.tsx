import { courseCatalog } from "~/entities/course";
import { Image } from "~/shared/components/image";
import { PageContainer } from "~/shared/components/page-container";
import { PageHead } from "~/shared/components/page-head";
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
  const illustration = courseCatalog.entries.find(
    (entry) => entry.id === props.course.id,
  )?.illustration;
  return (
    <div className={styles.page} data-course-overview-page>
      <PublicHeader activeSection="courses" />
      <main className={styles.main}>
        <PageHead
          aside={
            illustration ? (
              <div className={styles.illustration} aria-hidden="true">
                <Image
                  src={illustration.src}
                  decorative
                  layout="fill"
                  fit="contain"
                  loading="eager"
                  width={illustration.width}
                  height={illustration.height}
                />
              </div>
            ) : null
          }
        >
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
        </PageHead>
        <PageContainer component="div" measure="wide" className={styles.root}>
          <CourseOverviewCurriculum
            courseRouteSlug={props.course.routeSlug}
            modules={overview.modules}
            action={overview.action}
          />
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};
