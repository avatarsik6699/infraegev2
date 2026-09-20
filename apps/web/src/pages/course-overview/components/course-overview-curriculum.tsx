import { useState } from "react";
import { ArrowDown, ArrowUp, Flag } from "lucide-react";
import { Accordion } from "~/shared/components/accordion";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
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
  const [open, setOpen] = useState<string[]>(() =>
    props.modules[0] ? [props.modules[0].id] : [],
  );
  const enhanced = useIsEnhanced();
  const allOpen =
    props.modules.length > 0 &&
    props.modules.every((module) => open.includes(module.id));
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
        <Button
          hierarchy="quiet"
          density="compact"
          className={styles.bulkAction}
          disabled={!enhanced}
          data-enhanced={enhanced || undefined}
          iconEnd={allOpen ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          onClick={() =>
            setOpen(allOpen ? [] : props.modules.map((module) => module.id))
          }
        >
          {allOpen ? "Свернуть всё" : "Развернуть всё"}
        </Button>
      </div>
      <Accordion
        className={styles.curriculum}
        nativeFallback
        multiple
        value={open}
        onValueChange={setOpen}
        items={props.modules.map((module) => ({
          id: module.id,
          icon: (
            <span className={styles.moduleNumber}>
              {module.finalProject ? (
                <Flag size={18} strokeWidth={1.5} />
              ) : (
                module.number
              )}
            </span>
          ),
          title: <CourseOverviewModule module={module} />,
          content: (
            <CourseOverviewLessons
              courseRouteSlug={props.courseRouteSlug}
              lessons={module.lessons}
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
