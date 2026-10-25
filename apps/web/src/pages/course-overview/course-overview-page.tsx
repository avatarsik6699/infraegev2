import {
  hasCourseIllustration,
  ObjectIllustration,
} from "~/shared/components/object-illustration";
import { PageContainer } from "~/shared/components/page-container";
import { PageHead } from "~/shared/components/page-head";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { CourseChip, CourseMotif, courseIdentity } from "~/entities/course";
import { cssUtils } from "~/shared/lib/css-utils";
import { CourseOverviewCurriculum } from "./components/course-overview-curriculum";
import {
  CourseOverviewActions,
  CourseOverviewFacts,
} from "./components/course-overview-intro";
import { CourseOverviewProgress } from "./components/course-overview-progress";
import { useCourseOverview } from "./model/use-course-overview";
import type { CourseOverviewPageTypes } from "./course-overview-page.types";
import styles from "./course-overview-page.module.css";

export const CourseOverviewPage: React.FC<CourseOverviewPageTypes.Props> = (
  props,
) => {
  const overview = useCourseOverview(props);
  return (
    <div
      className={cssUtils.cx(styles.page, courseIdentity.palette)}
      data-course-tone={props.course.id}
      data-course-overview-page
    >
      <PublicHeader activeSection="courses" />
      <main id="main-content" className={styles.main}>
        <PageHead
          title={props.course.title}
          lead={props.course.summary}
          className={styles.head}
          eyebrow={
            <>
              <CourseChip entry={props.course} className={styles.chip} />
              <span>
                Мини-курс
                {overview.level ? (
                  <>
                    {" · "}
                    <span className={styles.level}>
                      {overview.level.toLocaleLowerCase("ru")} уровень
                    </span>
                  </>
                ) : null}
              </span>
            </>
          }
          backdrop={<CourseMotif courseId={props.course.id} />}
          asideOnNarrow="after-heading"
          aside={
            hasCourseIllustration(props.course.id) ? (
              <ObjectIllustration
                course={props.course.id}
                sizes="(max-width: 44rem) 92vw, (max-width: 80rem) 54vw, 43rem"
                priority
                className={styles.illustration}
              />
            ) : undefined
          }
        >
          <div className={styles.courseSummary} data-course-summary>
            <CourseOverviewProgress
              progress={overview.progress}
              lessonCount={overview.lessonCount}
              masteredLessons={overview.masteredLessons}
              guestTotal={props.practiceSummary?.reduce(
                (total, lesson) => total + lesson.tasks.length,
                0,
              )}
            />
            <CourseOverviewActions course={props.course} overview={overview} />
          </div>
        </PageHead>
        <PageContainer component="div" measure="wide" className={styles.root}>
          <CourseOverviewFacts
            courseId={props.course.id}
            requirements={props.course.requirements}
            outcomes={props.course.learningOutcomes}
          />
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
