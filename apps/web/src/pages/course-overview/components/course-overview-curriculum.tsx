import { Flag } from "lucide-react";
import { Accordion } from "~/shared/components/accordion";
import { Typography } from "~/shared/components/typography";
import { CourseOverviewModule } from "./course-overview-module";
import { CourseOverviewLessons } from "./course-overview-lessons";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";

type Props = {
  courseRouteSlug: string;
  modules: readonly CourseOverviewPageTypes.Module[];
  action?: CourseOverviewPageTypes.Action;
};

export const CourseOverviewCurriculum: React.FC<Props> = (props) => {
  return (
    <section
      className={styles.courseContent}
      aria-labelledby="course-curriculum"
      data-course-program
    >
      <div className={styles.programHeader}>
        <Typography.Title
          order={2}
          id="course-curriculum"
          className={styles.programTitle}
        >
          Программа курса
        </Typography.Title>
      </div>
      <Accordion
        className={styles.curriculum}
        nativeFallback
        multiple
        defaultOpen={props.modules[0] ? [props.modules[0].id] : []}
        items={props.modules.map((module) => ({
          id: module.id,
          icon: (
            <span className={styles.moduleNumber}>
              {module.finalProject ? (
                <Flag size={18} strokeWidth={1.5} />
              ) : (
                Number(module.number)
              )}
            </span>
          ),
          title: <CourseOverviewModule module={module} />,
          content: (
            <CourseOverviewLessons
              courseRouteSlug={props.courseRouteSlug}
              lessons={module.lessons}
              markAdvanced={!module.advanced}
              continuingLessonId={
                props.action?.continuing ? props.action.lesson.id : undefined
              }
            />
          ),
        }))}
      />
    </section>
  );
};
